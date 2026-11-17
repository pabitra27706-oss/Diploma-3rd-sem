const fs = require('node:fs');
const assert = require('node:assert/strict');

const catalog = JSON.parse(fs.readFileSync('_data/catalog.json', 'utf8'));
const practicePool = JSON.parse(fs.readFileSync('assets/data/practice-pool.json', 'utf8'));
const repeated = JSON.parse(fs.readFileSync('assets/search/repeated.json', 'utf8'));
const cst209Search = JSON.parse(fs.readFileSync('assets/search/index-CST209.json', 'utf8'));

// 1. Enriched catalog contract
assert.equal(catalog.rawPyqCount, 958);
assert.equal(catalog.uniquePyqCount, 923);
assert.equal(catalog.genericPyqTopicCount, 321);
assert.equal(catalog.uniqueGenericPyqTopicCount, 320);
assert.equal(catalog.genericQuizTopicCount, 0);
assert.equal(catalog.subjects.CST201.contactHours, 30);
assert.equal(catalog.subjects.CST205.credits, 3);
assert.deepEqual(catalog.subjects.CST205.ltp, [2, 1, 0]);
assert.equal(catalog.subjects.CST209.syllabusUnits, 4);
assert.equal(catalog.subjects.CST209.units.length, 4);

// 2. Practice pool derived topicQuality, aliases, and alsoAppearedIn contract
assert.equal(Object.keys(practicePool.aliases).length, 35);
assert.equal(practicePool.aliases['CST203-P001-Q44'], 'CST203-P001-Q43');
const qCanon = practicePool.questions.find(q => q.id === 'CST203-P001-Q43');
assert(qCanon, 'Expected canonical question CST203-P001-Q43 in practice pool');
assert(qCanon.alsoAppearedIn.includes('CST203-P001-Q44'));
const nonGenericTopics = new Set(
  practicePool.questions.filter(q => q.topicQuality !== 'generic').map(q => q.topic)
);
for (const placeholder of ['Short Answer', 'Long Answer', 'Objective', 'Group A / Objective', 'Group C / Long Answer']) {
  assert(!nonGenericTopics.has(placeholder), `Generic topic leaked into specific topics: ${placeholder}`);
}
assert.equal(nonGenericTopics.size, 483);

// 3. Discovery shard marks CST209 unit-5 notes supplementary & generic PYQ topics
const cst209Units = [...new Set(cst209Search.filter(r => r.type === 'unit' && !r.supplementary).map(r => r.unit))];
assert.deepEqual(cst209Units, [1, 2, 3, 4]);
assert(cst209Search.some(r => r.type === 'unit' && r.unit === 5 && r.supplementary === true));
assert(cst209Search.some(r => r.type === 'pyq' && r.genericTopic === true));

// 4. Repeated-question cross-reference covers all 35 aliases
assert.equal(repeated.aliasCount, 35);
assert(repeated.groups.some(g => g.canonical.id === 'CST203-P001-Q43' && g.appearances.some(a => a.id === 'CST203-P001-Q44')));

console.log('PASS catalog syllabus fields, practice-pool aliases/topicQuality, CST209 supplementary shard, and repeat cross-references');
