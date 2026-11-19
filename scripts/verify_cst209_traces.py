#!/usr/bin/env python3
"""Executable teaching/exam trace evidence for Phase 16, immutable sources untouched."""
import json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
OUTPUT=ROOT/'docs/phases/16-cst209-algorithms-content/evidence/algorithm-traces.json'


def quick_trace(values):
    a=values[:];rows=[]
    def sort(lo,hi):
        if lo>=hi:return
        pivot=a[hi];i=lo-1
        for j in range(lo,hi):
            if a[j]<=pivot:
                i+=1;a[i],a[j]=a[j],a[i]
        a[i+1],a[hi]=a[hi],a[i+1];p=i+1
        rows.append([lo,hi,pivot,p,a[:]])
        sort(lo,p-1);sort(p+1,hi)
    sort(0,len(a)-1);assert a==sorted(values)
    return rows


def bubble_trace(values):
    a=values[:];rows=[]
    for end in range(len(a)-1,0,-1):
        swapped=False
        for j in range(end):
            if a[j]>a[j+1]:a[j],a[j+1]=a[j+1],a[j];swapped=True
        rows.append([len(a)-end,a[:],swapped])
        if not swapped:break
    assert a==sorted(values)
    return rows


def lps(pattern):
    result=[0]*len(pattern);j=0
    for i in range(1,len(pattern)):
        while j and pattern[i]!=pattern[j]:j=result[j-1]
        if pattern[i]==pattern[j]:j+=1
        result[i]=j
    return result


def traces():
    keys=[23,43,13,27,37];probes={}
    for method in ['linear','quadratic','double']:
        occupied={};rows=[]
        for k in keys:
            row=[]
            for i in range(10):
                offset=i if method=='linear' else i*i if method=='quadratic' else i*[1,3,7,9][k%4]
                slot=(k%10+offset)%10;row.append(slot)
                if slot not in occupied:occupied[slot]=k;break
            else:raise AssertionError('probe cycle')
            rows.append([k,row])
        probes[method]=rows
    radix=[347,142,361,423,538,126,320,549,365];radix_rows=[]
    for exp in [1,10,100]:
        radix=sorted(radix,key=lambda n:(n//exp)%10);radix_rows.append([exp,radix[:]])
    assert radix==[126,142,320,347,361,365,423,538,549]
    text='ababcabcabababd';pat='ababd';prefix=lps(pat);assert prefix==[0,0,1,2,0]
    i=j=0;steps=[];matches=[]
    while i<len(text):
        oldi,oldj=i,j
        if text[i]==pat[j]:
            i+=1;j+=1;action='advance both'
            if j==len(pat):matches.append(i-j);j=prefix[j-1];action='match at 10; fallback'
        elif j:j=prefix[j-1];action='fallback j only'
        else:i+=1;action='advance text'
        steps.append([oldi,oldj,text[oldi],pat[oldj],action,i,j])
    assert matches==[10]
    binary='1110101011101100';pattern='101110'
    shifts=[[s,binary[s:s+len(pattern)],binary[s:s+len(pattern)]==pattern] for s in range(len(binary)-len(pattern)+1)]
    assert [s for s,w,hit in shifts if hit]==[6]
    # Numeric strings: base 10, q=11, pattern 26 has one false and one true hash hit.
    rktext='152626';rkpat='26';h=10%11;target=int(rkpat)%11;value=int(rktext[:2])%11;rk=[]
    for s in range(len(rktext)-1):
        window=rktext[s:s+2];assert value==int(window)%11
        rk.append([s,window,value,'match' if window==rkpat else 'spurious hit' if value==target else 'hash mismatch'])
        if s<len(rktext)-2:value=(10*(value-int(rktext[s])*h)+int(rktext[s+2]))%11
    assert any(r[-1]=='spurious hit' for r in rk)
    words=['bat','ball','doll','dork','do','dorm','send','sense']
    prefixes={w[:i] for w in words for i in range(1,len(w)+1)}
    assert len(prefixes)==18  # enumerate the union of nonempty prefixes, not word lengths
    def recurrence(n):return 1 if n==1 else 2*recurrence(n//2)+1
    assert all(recurrence(2**k)==2*(2**k)-1 for k in range(12))
    assert len([s for s in range(5) if 2**s<=16])==5
    return {'hashProbes':probes,'quickDecember2024':quick_trace([38,81,22,48,13,69,93,14,45,58,79,72]),'bubbleJanuary2026':bubble_trace([25,57,48,37,12,92,86,33]),'radixJanuary2026':radix_rows,'kmpLps':prefix,'kmpSteps':steps,'naiveShifts':shifts,'rabinKarpTeaching':rk,'trieWords':words,'trieNonRootNodes':len(prefixes)}


if __name__=='__main__':
    import argparse
    ap=argparse.ArgumentParser();ap.add_argument('--check',action='store_true');args=ap.parse_args()
    data=traces();text=json.dumps(data,ensure_ascii=False,indent=2)+'\n'
    if args.check:
        assert OUTPUT.read_text()==text,'algorithm trace evidence is stale'
        print('loop, recurrence, hash, sorting and string/trie traces PASS')
    else:OUTPUT.write_text(text);print(OUTPUT.relative_to(ROOT))
