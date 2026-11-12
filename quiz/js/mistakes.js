/* Shared entry widget; queue persistence belongs only to QuizAttempts. */
document.addEventListener('DOMContentLoaded', () => {
  const host = document.getElementById('mistake-queue');
  if (!host) return;
  function render() {
    const queue = QuizAttempts.mistakes();
    const items = Object.values(queue.items).sort((a,b) => b.lastSeen-a.lastSeen);
    host.replaceChildren();
    const heading = document.createElement('h2'); heading.textContent = 'Practice my mistakes';
    const summary = document.createElement('p');
    summary.textContent = `${items.length} wrong or unanswered questions · ${queue.resolvedCount} resolved. Practice uses the newest 40. Keyless answers cannot be auto-resolved.`;
    const play = document.createElement('a'); play.textContent = 'Practise queued questions';
    play.href = host.dataset.playUrl || 'play.html?mistakes=1';
    if (!items.length) { play.removeAttribute('href'); play.setAttribute('aria-disabled','true'); }
    const clear = document.createElement('button'); clear.type = 'button'; clear.textContent = 'Clear mistake queue'; clear.disabled = !items.length;
    clear.addEventListener('click', () => { if (confirm('Clear all queued mistakes and the resolution count on this device?')) { QuizAttempts.clearMistakes(); render(); } });
    const list = document.createElement('ul');
    items.slice(0,10).forEach(item => { const li=document.createElement('li'); li.textContent=`${item.subject} · ${item.topic} · ${item.questionId} · ${item.attempts} attempt(s)`; list.append(li); });
    host.append(heading,summary,play,document.createTextNode(' '),clear,list);
  }
  try { render(); } catch (error) { host.textContent='Mistake queue unavailable: '+error.message; }
});
