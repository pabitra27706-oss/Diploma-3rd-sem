#!/usr/bin/env python3
"""Reproduce Phase 16 U4 worked traces; no paper or quiz writes.

Exam edge transcriptions are those already recorded in the frozen, scan-checked
papers. Other examples are explicitly teaching examples. Independent invariants
(MST cut/edge counts, all-pairs vs single-source) catch arithmetic mistakes.
"""
import json
from collections import deque
from math import inf
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'docs/phases/16-cst209-algorithms-content/evidence/graph-traces.json'
PRIM = [('A','B',4),('A','C',2),('B','C',1),('B','D',5),('C','D',8),('C','E',10),('D','E',2),('D','F',6),('E','F',3)]
KRUSKAL = [(0,3,5),(0,1,7),(1,2,8),(1,3,9),(1,4,7),(2,4,5),(3,4,15),(3,5,6),(5,4,8),(4,6,9),(5,6,11)]
BELLMAN = [('A','B',6),('A','C',4),('A','D',5),('D','C',-2),('C','B',-2),('B','E',-1),('C','E',3),('D','F',-1),('E','F',3)]
DIJKSTRA = [('A','B',4),('A','C',2),('B','D',3),('B','C',5),('C','B',1),('C','D',8),('D','E',2),('B','E',6)]
FLOYD = [(1,2,3),(1,3,8),(2,3,2),(3,4,1),(4,1,4)]


def kruskal(vertices, edges):
    parent = {v:v for v in vertices}
    def find(v):
        while v != parent[v]:
            parent[v] = parent[parent[v]]
            v = parent[v]
        return v
    rows, selected = [], []
    for u,v,w in sorted(edges, key=lambda e:(e[2], e[0], e[1])):
        accept = find(u) != find(v)
        if accept:
            parent[find(u)] = find(v)
            selected.append((u,v,w))
        rows.append([u,v,w,'accept' if accept else 'reject cycle'])
    assert len(selected) == len(vertices)-1
    return rows, sum(e[2] for e in selected)


def prim(vertices, edges):
    key = dict.fromkeys(vertices, inf); parent = dict.fromkeys(vertices)
    key[vertices[0]] = 0; done = set(); rows=[]
    while len(done) < len(vertices):
        u = min((v for v in vertices if v not in done), key=lambda v:(key[v],v))
        assert key[u] < inf
        done.add(u)
        for a,b,w in edges:
            v = b if a == u else a if b == u else None
            if v is not None and v not in done and w < key[v]:
                key[v],parent[v] = w,u
        rows.append([u, [key[v] for v in vertices], [parent[v] for v in vertices]])
    assert sum(key.values()) == kruskal(vertices,edges)[1]
    return rows, sum(key.values())


def bellman(vertices, edges):
    dist=dict.fromkeys(vertices,inf); dist[vertices[0]]=0; rows=[list(dist.values())]
    for _ in range(len(vertices)-1):
        for u,v,w in edges:
            if dist[u] < inf and dist[u]+w < dist[v]:
                dist[v]=dist[u]+w
        rows.append(list(dist.values()))
    assert not any(dist[u] < inf and dist[u]+w < dist[v] for u,v,w in edges)
    return rows


def floyd(vertices,edges):
    d = [[0 if i==j else inf for j in vertices] for i in vertices]
    for u,v,w in edges:
        i,j=vertices.index(u),vertices.index(v); d[i][j]=min(d[i][j],w)
    matrices=[[row[:] for row in d]]
    for k in range(len(vertices)):
        d=[[min(d[i][j],d[i][k]+d[k][j]) for j in range(len(vertices))] for i in range(len(vertices))]
        matrices.append([row[:] for row in d])
    return matrices


def dijkstra():
    vs=list('ABCDE'); d=dict.fromkeys(vs,inf); d['A']=0
    parent=dict.fromkeys(vs); done=set(); rows=[]
    while len(done)<len(vs):
        u=min((v for v in vs if v not in done),key=lambda v:(d[v],v)); done.add(u)
        for a,b,w in DIJKSTRA:
            if a==u and b not in done and d[u]+w<d[b]:d[b],parent[b]=d[u]+w,u
        rows.append([u,list(d.values()),list(parent.values())])
    assert list(d.values()) == floyd(vs,DIJKSTRA)[-1][0]
    return rows


def traces():
    p,total=prim(list('ABCDEF'),PRIM); assert total==13
    k,kt=kruskal(list(range(7)),KRUSKAL); assert kt==39
    k23,k23t=kruskal(list('ABCDE'), [('A','B',1),('D','E',2),('B','C',3),('C','D',4),('A','E',5),('A','C',7),('A','D',10)])
    assert k23t==10
    b=bellman(list('ABCDEF'),BELLMAN); assert b[-1]==[0,1,3,5,0,3]
    assert b[-1] == floyd(list('ABCDEF'),BELLMAN)[-1][0]
    f=floyd([1,2,3,4],FLOYD); assert f[-1]==[[0,3,5,6],[7,0,2,3],[5,8,0,1],[4,7,9,0]]
    edges=[(5,0),(5,2),(4,0),(4,1),(2,3),(3,1)]
    degree={v:sum(b==v for a,b in edges) for v in range(6)}
    queue=deque(v for v in range(6) if degree[v]==0); order=[]
    while queue:
        u=queue.popleft();order.append(u)
        for a,v in edges:
            if a==u:
                degree[v]-=1
                if degree[v]==0:queue.append(v)
    assert order==[4,5,0,2,3,1]
    assert all(order.index(u)<order.index(v) for u,v in edges)
    return {'primTeaching':p,'primTotal':total,'kruskalDecember2024':k,'kruskalTotal':kt,'kruskalMarch2023':k23,'kruskal2023Total':k23t,'dijkstraTeaching':dijkstra(),'bellmanJanuary2024':b,'floydTeaching':f,'kahnTeaching':order}


def printable(value):
    if isinstance(value,list):return [printable(v) for v in value]
    if isinstance(value,dict):return {k:printable(v) for k,v in value.items()}
    return '∞' if value == inf else value


if __name__ == '__main__':
    import argparse
    ap=argparse.ArgumentParser();ap.add_argument('--check',action='store_true');args=ap.parse_args()
    text=json.dumps(printable(traces()),ensure_ascii=False,indent=2)+'\n'
    if args.check:
        assert OUTPUT.read_text()==text, 'graph trace evidence is stale'
        print('graph traces: six algorithms, two exact MST papers, independent invariants PASS')
    else:
        OUTPUT.write_text(text)
        print(OUTPUT.relative_to(ROOT))
