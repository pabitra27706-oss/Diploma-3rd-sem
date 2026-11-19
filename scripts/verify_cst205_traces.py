#!/usr/bin/env python3
"""Independently compute every displayed Data Structures (CST205) trace.

Run: python3 scripts/verify_cst205_traces.py --check
Writes docs/phases/14-cst205-ds-content/evidence/ds-traces.json
No learner data is read or written; datasets are the exact printed paper datasets.
"""
import json, sys
from pathlib import Path
from math import comb

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs/phases/14-cst205-ds-content/evidence/ds-traces.json"

# ---------- BST ----------
class N:
    def __init__(s,v): s.v,s.l,s.r=v,None,None
def bst_insert(root,v):
    if not root: return N(v)
    if v<root.v: root.l=bst_insert(root.l,v)
    elif v>root.v: root.r=bst_insert(root.r,v)
    return root
def height(n): return -1 if not n else 1+max(height(n.l),height(n.r))  # edges
def inorder(n): return [] if not n else inorder(n.l)+[n.v]+inorder(n.r)
def preorder(n): return [] if not n else [n.v]+preorder(n.l)+preorder(n.r)
def postorder(n): return [] if not n else postorder(n.l)+postorder(n.r)+[n.v]
def shape(n):
    if not n: return None
    return [n.v, shape(n.l), shape(n.r)]

bst_keys=[10,25,2,4,7,13,11,22]
r=None
for k in bst_keys: r=bst_insert(r,k)
bst={"keys":bst_keys,"inorder":inorder(r),"preorder":preorder(r),"postorder":postorder(r),"heightEdges":height(r),"heightNodes":height(r)+1,"shape":shape(r)}
assert bst["inorder"]==sorted(bst_keys)

# ---------- AVL ----------
class AVL:
    def __init__(s,v): s.v,s.l,s.r,s.h=v,None,None,1
def h(n): return n.h if n else 0
def bf(n): return h(n.l)-h(n.r) if n else 0
def upd(n): n.h=1+max(h(n.l),h(n.r))
def rotR(y):
    x=y.l; t=x.r; x.r=y; y.l=t; upd(y); upd(x); return x
def rotL(x):
    y=x.r; t=y.l; y.l=x; x.r=t; upd(x); upd(y); return y
def avl_insert(root,key,log,step):
    if not root: return AVL(key)
    if key<root.v: root.l=avl_insert(root.l,key,log,step)
    elif key>root.v: root.r=avl_insert(root.r,key,log,step)
    else: return root
    upd(root); b=bf(root)
    if b>1 and key<root.l.v: log.append(f"insert {key}: LL at {root.v} -> right rotation"); return rotR(root)
    if b<-1 and key>root.r.v: log.append(f"insert {key}: RR at {root.v} -> left rotation"); return rotL(root)
    if b>1 and key>root.l.v: log.append(f"insert {key}: LR at {root.v} -> left then right"); root.l=rotL(root.l); return rotR(root)
    if b<-1 and key<root.r.v: log.append(f"insert {key}: RL at {root.v} -> right then left"); root.r=rotR(root.r); return rotL(root)
    return root

def avl_run(keys):
    root=None; log=[]
    for k in keys: root=avl_insert(root,k,log,k)
    return {"keys":keys,"rotations":log,"inorder":inorder_avl(root),"shape":shape_avl(root),"root":root.v}
def inorder_avl(n): return [] if not n else inorder_avl(n.l)+[n.v]+inorder_avl(n.r)
def shape_avl(n): return None if not n else [n.v,shape_avl(n.l),shape_avl(n.r)]

avl_num=avl_run([54,2345,6172,5918,1077,3422,44])
avl_months=avl_run(["March","May","November","August","April","January","December","July"])
assert avl_num["inorder"]==sorted([54,2345,6172,5918,1077,3422,44])
assert avl_months["inorder"]==sorted(["March","May","November","August","April","January","December","July"])

# ---------- B-tree order 3 (max 2 keys/node) ----------
class BT:
    def __init__(s,leaf=True): s.keys=[]; s.children=[]; s.leaf=leaf
def btree_insert(root,key,log):
    # split root if full
    if len(root.keys)==2:
        s=BT(False); s.children.append(root); split_child(s,0,log); root=s
    insert_nonfull(root,key,log); return root
def split_child(parent,i,log):
    full=parent.children[i]; median=full.keys[1]
    right=BT(full.leaf); right.keys=full.keys[2:] if len(full.keys)>2 else [full.keys[1]] if False else []
    # order-3: node holds at most 2 keys; splitting [a,b] promotes b? Standard: promote median of 3 after temp insert.
    raise RuntimeError("use insert-then-split below")
# Simpler correct order-3 insertion: insert into leaf sorted, split overfull (3 keys) promoting middle.
def bt_insert(root,key,log):
    # returns new root
    def split(node):
        mid=node.keys[1]
        left=BT(node.leaf); left.keys=node.keys[:1]
        right=BT(node.leaf); right.keys=node.keys[2:]
        if not node.leaf:
            left.children=node.children[:2]; right.children=node.children[2:]
        log.append(f"split {node.keys} promote {mid}")
        newroot=BT(False); newroot.keys=[mid]; newroot.children=[left,right]; return newroot,mid,left,right
    def ins(node,key):
        if node.leaf:
            node.keys.append(key); node.keys.sort()
        else:
            i=0
            while i<len(node.keys) and key>node.keys[i]: i+=1
            child=node.children[i]
            ins(child,key)
            if len(child.keys)==3:
                _,mid,left,right=split(child)
                node.keys.insert(i,mid); node.children[i]=left; node.children.insert(i+1,right)
    ins(root,key)
    if len(root.keys)==3:
        _,mid,left,right=split(root)
        nr=BT(False); nr.keys=[mid]; nr.children=[left,right]; return nr
    return root
def bt_levels(root):
    levels=[]; cur=[root]
    while cur:
        levels.append([list(n.keys) for n in cur]); nxt=[]
        for n in cur: nxt.extend(n.children)
        cur=nxt
    return levels
bt_keys=[50,40,60,30,70,20,80,10,90,9,99]
btroot=BT(); blog=[]; bt_steps=[]
for k in bt_keys:
    btroot=bt_insert(btroot,k,blog); bt_steps.append({"insert":k,"levels":bt_levels(btroot)})
btree={"keys":bt_keys,"splits":blog,"steps":bt_steps,"final":bt_levels(btroot)}
# verify all keys present sorted at leaves via inorder-ish traversal
def bt_all(n):
    out=[]
    if n.leaf: return list(n.keys)
    for i,k in enumerate(n.keys):
        out+=bt_all(n.children[i]); out.append(k)
    out+=bt_all(n.children[-1]); return out
assert bt_all(btroot)==sorted(bt_keys), bt_all(btroot)

# ---------- Reconstruction ----------
def build_in_pre(pre,ino):
    if not pre: return None
    root=pre[0]; i=ino.index(root)
    return [root, build_in_pre(pre[1:1+i],ino[:i]), build_in_pre(pre[1+i:],ino[i+1:])]
def build_in_post(post,ino):
    if not post: return None
    root=post[-1]; i=ino.index(root)
    return [root, build_in_post(post[:i],ino[:i]), build_in_post(post[i:-1] if False else post[i:len(post)-1],ino[i+1:])]
def trav(t):
    if not t: return {"pre":[],"in":[],"post":[]}
    l=trav(t[1]); rr=trav(t[2])
    return {"pre":[t[0]]+l["pre"]+rr["pre"],"in":l["in"]+[t[0]]+rr["in"],"post":l["post"]+rr["post"]+[t[0]]}
rec1_t=build_in_pre([1,2,4,7,9,5,3,6,8],[7,9,4,2,5,1,3,6,8])
rec2_t=build_in_pre(list("ABDI EJCF GK".replace(" ","")),list("DIBEJ AFC KG".replace(" ","")))
# careful: use exact sequences below instead
rec2_t=build_in_pre(['A','B','D','I','E','J','C','F','G','K'],['D','I','B','E','J','A','F','C','K','G'])
rec3_t=build_in_pre(['F','A','E','K','C','D','H','G','B'],['E','A','C','K','F','H','D','B','G'])
rec_post_t=build_in_post(['D','E','B','F','C','A'],['D','B','E','A','F','C'])
recon={"rec1":{"tree":rec1_t,"trav":trav(rec1_t)},"rec2":{"tree":rec2_t,"trav":trav(rec2_t)},"rec3":{"tree":rec3_t,"trav":trav(rec3_t)},"inPost":{"tree":rec_post_t,"trav":trav(rec_post_t),"leftSubtreeNodes":len(trav(rec_post_t[1])["in"])}}
assert recon["rec1"]["trav"]["in"]==[7,9,4,2,5,1,3,6,8]
assert recon["inPost"]["trav"]["post"]==['D','E','B','F','C','A']

# ---------- Queue trace (capacity 8, linear) ----------
def queue_trace():
    MAX=8; q=[None]*MAX; front=rear=-1; steps=[]
    def enq(x):
        nonlocal front,rear
        if rear==MAX-1: steps.append(f"ENQ {x}: OVERFLOW (rear={rear}=MAX-1) though front={front} slots free -> false overflow"); return
        if front==-1: front=0
        rear+=1; q[rear]=x; steps.append(f"ENQ {x}: front={front} rear={rear} queue={[v for v in q[front:rear+1]]}")
    def deq():
        nonlocal front,rear
        x=q[front]
        if front==rear: front=rear=-1; steps.append(f"DEQ -> {x}: now empty front=rear=-1")
        else: front+=1; steps.append(f"DEQ -> {x}: front={front} rear={rear} queue={[v for v in q[front:rear+1]]}")
        return x
    for c in "ABCDEF": enq(c)
    deq(); deq()
    enq('G'); enq('H')
    for _ in range(4): deq()
    enq('M')
    return steps
qtrace=queue_trace()

# circular queue capacity 5 trace
def circ_trace():
    MAX=5; q=[None]*MAX; front=rear=-1; steps=[]
    def enq(x):
        nonlocal front,rear
        if front!=-1 and (rear+1)%MAX==front: steps.append(f"ENQ {x}: FULL"); return
        if front==-1: front=0
        rear=(rear+1)%MAX; q[rear]=x; steps.append(f"ENQ {x}: front={front} rear={rear}")
    def deq():
        nonlocal front,rear
        x=q[front]
        if front==rear: front=rear=-1; steps.append(f"DEQ -> {x}: empty")
        else: front=(front+1)%MAX; steps.append(f"DEQ -> {x}: front={front} rear={rear}")
    for c in "ABCD": enq(c)
    deq(); deq(); enq('E'); enq('F'); enq('G')
    return steps
ctrace=circ_trace()

# ---------- Expressions ----------
def postfix_eval(tokens):
    st=[]; steps=[]
    for t in tokens:
        if isinstance(t,int): st.append(t); steps.append(f"push {t}: {st}")
        else:
            b=st.pop(); a=st.pop(); v={'+':a+b,'-':a-b,'*':a*b,'/':a//b}[t]; st.append(v); steps.append(f"pop {b},{a}: {a}{t}{b}={v} push: {st}")
    return st[0],steps
pf_val,pf_steps=postfix_eval([5,6,2,'+',8,'+',4,'/','-'])
assert pf_val==1
def infix_to_postfix(expr):
    prec={'^':3,'*':2,'/':2,'+':1,'-':1}; st=[]; out=[]; steps=[]
    for ch in expr:
        if ch.isalpha(): out.append(ch)
        elif ch=='(': st.append(ch)
        elif ch==')':
            while st[-1]!='(': out.append(st.pop())
            st.pop()
        else:
            while st and st[-1]!='(' and prec[st[-1]]>=prec[ch]: out.append(st.pop())
            st.append(ch)
        steps.append(f"read {ch}: stack={st} output={''.join(out)}")
    while st: out.append(st.pop())
    return ''.join(out),steps
i2p,i2p_steps=infix_to_postfix("A*B+C/D")
assert i2p=="AB*CD/+", i2p
# prefix exact via reverse method verified by evaluation equivalence on numbers
# (A-D/C)*(D+E-F) with A=10,D=6,C=2,E=1,F=3: infix=(10-3)*(6+1-3)=7*4=28 ; prefix *-A/DC-+DEF
prefix_exact="*-A/DC-+DEF"
val_infix=(10-6/2)*(6+1-3)
def eval_prefix(s,env):
    st=[]
    for ch in reversed(s):
        if ch.isalpha(): st.append(env[ch])
        else:
            a=st.pop(); b=st.pop(); st.append({'+':a+b,'-':a-b,'*':a*b,'/':a/b}[ch])
    return st[0]
assert eval_prefix(prefix_exact,{'A':10,'D':6,'C':2,'E':1,'F':3})==val_infix==28.0

# Hanoi + GCD
def hanoi(n,a,b,c,moves):
    if n==0: return
    hanoi(n-1,a,c,b,moves); moves.append(f"disk {n}: {a}->{c}"); hanoi(n-1,b,a,c,moves)
moves=[]; hanoi(3,'A','B','C',moves)
def gcd_trace(a,b):
    steps=[]
    while b: steps.append(f"gcd({a},{b}): {a} = {a//b}*{b} + {a%b}"); a,b=b,a%b
    steps.append(f"gcd({a},0) = {a}"); return a,steps
gcd_val,gcd_steps=gcd_trace(48,18)
assert gcd_val==6 and len(moves)==7

# Address: 8x3, w=4, base 3500, A[5,2]
addr_1based=3500+((5-1)*3+(2-1))*4
addr_0based=3500+((5*3)+2)*4
addr_col_1based=3500+((2-1)*8+(5-1))*4
catalan4=comb(8,4)//5
assert catalan4==14

# BFS/DFS sample graph A-B,A-C,B-D,B-E,C-F,E-F (alphabetical neighbours)
graph={'A':['B','C'],'B':['A','D','E'],'C':['A','F'],'D':['B'],'E':['B','F'],'F':['C','E']}
def bfs(g,s):
    seen=[s]; q=[s]; order=[]
    while q:
        v=q.pop(0); order.append(v)
        for w in g[v]:
            if w not in seen: seen.append(w); q.append(w)
    return order
def dfs(g,s):
    seen=[]; 
    def go(v):
        seen.append(v)
        for w in g[v]:
            if w not in seen: go(w)
    go(s); return seen
bfso=bfs(graph,'A'); dfso=dfs(graph,'A')

evidence={
 "bst":bst,"avlNumeric":avl_num,"avlMonths":avl_months,"btreeOrder3":btree,
 "reconstructions":recon,"queueTraceCapacity8":qtrace,"circularQueueCapacity5":ctrace,
 "postfix":{"value":pf_val,"steps":pf_steps},"infixToPostfix":{"expr":"A*B+C/D","result":i2p,"steps":i2p_steps},
 "prefixExact":{"expr":"(A-D/C)*(D+E-F)","result":prefix_exact},
 "hanoi3":moves,"gcd48_18":{"value":gcd_val,"steps":gcd_steps},
 "address8x3":{"rowMajor1Based":addr_1based,"rowMajor0BasedSubscripts":addr_0based,"colMajor1Based":addr_col_1based},
 "catalan4":catalan4,"sampleGraphBFS":bfso,"sampleGraphDFS":dfso,
 "K5Edges":5*4//2,
}
if "--check" in sys.argv:
    print(json.dumps(evidence,indent=1))
    OUT.parent.mkdir(parents=True,exist_ok=True)
    OUT.write_text(json.dumps(evidence,indent=1)+"\n")
    print(f"WROTE {OUT}")
else:
    print(json.dumps(evidence,indent=1))
