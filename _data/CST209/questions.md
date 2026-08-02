ALGORITHMS (CST209) – 5 Papers

---

📄 PAPER 1: 307/5(N) - DECEMBER 2024

GROUP-A (MCQ - Any ten with explanation)

i) Which of the following is NOT a characteristic of an algorithm?
a. Finiteness b. Definiteness c. Ambiguity d. Input

ii) What does the term "multiplicity" refer to in the context of a multiset?
a. Number of elements in the multiset b. Number of unique elements in the multiset c. Number of times an element appears in the multiset d. Total number of multisets that can be formed from a given set

iii) What is the time complexity of a Binary Search algorithm in the worst case?
a. O(n) b. O(log n) c. O(n²) d. O(1)

iv) Which of the following sorting algorithms is the most efficient in the average case for large datasets?
a. Bubble Sort b. Quick Sort c. Selection Sort d. Insertion Sort

v) Which approach is more suitable for problems with overlapping subproblems and optimal substructure?
a. Divide and Conquer b. Dynamic Programming c. Both a and b d. Neither

vi) Which algorithm follows the Divide and Conquer approach?
a. Bubble Sort b. Merge Sort c. Selection Sort d. Heap Sort

vii) What is the time complexity of Radix Sort?
a. O(nk) b. O(n²) c. O(n log n) d. O(n³)

viii) Which of the following hashing collision resolution techniques uses a linked list to resolve collisions?
a. Linear Probing b. Quadratic Probing c. Double Hashing d. Chaining

ix) Which of the following algorithms is used to find the shortest path in a graph with negative edge weights?
a. Dijkstra's Algorithm b. Prim's Algorithm c. Bellman-Ford Algorithm d. Kruskal's Algorithm

x) What type of approach does Prim's algorithm use to find a minimum spanning tree of a graph?
a. Divide and Conquer b. Dynamic Programming c. Greedy Approach d. Backtracking

xi) In the Rabin-Karp algorithm, the hashing technique is used to:
a. store the string b. calculate the matching of substrings c. compare every substring d. search for substrings by calculating hash values

xii) What is the worst-case time complexity of the Quick Sort algorithm?
a. O(n log n) b. O(n²) c. O(n) d. O(log n)

xiii) What is the number of edges in a tree with n nodes?
a. n b. n-1 c. n+1 d. 2n-1

xiv) Which of the following is the correct time complexity for constructing a Max-Heap?
a. O(n log n) b. O(n²) c. O(n) d. O(log n)

xv) The Knuth-Morris-Pratt (KMP) string matching algorithm preprocesses the pattern to:
a. avoid rechecking the matched characters b. compare characters from the end c. skip unmatched characters entirely d. directly match the substring

GROUP-B (Answer any Five)

2. a) Briefly explain key characteristics of every algorithm should have. (3)
b) What is asymptotic notation? Explain different types of asymptotic notations. (2 + 3)

3. a) Explain divide and conquer approach. (3)
b) Solve the recurrence relation using substitution method: T(n) = 2T(n/2) + 1 (3)
c) Calculate the time complexity of the given pseudo code:

```
for(i = 0; i < n; i++) {
    for(j = 0; j < n; j++) {
        Statement;
    }
}
```

(2)

4. a) Explain Selection sort using suitable example. (4)
b) Compare bubble sort, selection sort and insertion sort. (4)

5. a) Illustrate Quick Sort algorithm on the following sequence:
38, 81, 22, 48, 13, 69, 93, 14, 45, 58, 79, 72 (4)
b) Explain best case and worst case time complexity of quick sort. (4)

6. a) Write algorithm for binary search. (3)
b) What is a collision in hashing? Describe different types collision techniques. (2 + 3)

7. a) What is a Minimum Spanning Tree (MST)? (2)
b) Find Minimum Spanning Tree (MST) using Kruskal's algorithm. (6)

8. a) Explain DAG using an example. (2)
b) Illustrate Floyd Warshall's algorithm taking a suitable example. (6)

9. a) What are tries (prefix trees), and how are they used in storing strings? (3)
b) Construct a tree for the set of words: "bat", "ball", "doll", "dork", "do", "dorm", "send", "sense". Draw the tree and explain how it facilitates efficient search operations. (5)

10. a) Explain the Knuth-Morris-Pratt (KMP) string matching algorithm. (3)
b) Given the text T = "ababcabcababad" and the pattern P = "abad", use the KMP algorithm to determine if the pattern exists in the text. Show the construction of the lps (longest proper prefix which is also suffix) array and the step-by-step matching process. (5)

---

📄 PAPER 2: 307/5(N) - JANUARY 2024

GROUP-A (MCQ - Any ten with explanation)

i) LIFO scheme is used in ________ data structure.
a) stack b) queue c) linked list d) tree

ii) Which of the following sorting algorithms has a worst-case time complexity of O(n log n)?
a) Bubble sort b) Merge sort c) Selection sort d) Insertion sort

iii) O-notation provides an asymptotic ________.
a) upper bound b) lower bound c) light bound d) tight bound

iv) Time complexity of worst case for Linear Search is ________.
a) O(1) b) O(log n) c) O(n) d) O(n²)

v) Which of the following algorithm design technique is used in the Merge sort algorithm?
a) Dynamic programming b) Greedy Method c) Divide and conquer d) Backtracking

vi) Which of the following is false in the case of a spanning tree of a graph G?
a) It is tree that spans G b) It is a sub-graph of the G c) It includes every vertex of the G d) It can be either cyclic or acyclic

vii) Which of the following is true?
a) Prim's algorithm initializes with a vertex b) Prim's algorithm initializes with an edge c) Prim's algorithm initializes with a vertex which has smallest edge d) Prim's algorithm initializes with a forest

viii) Topological sort can be applied to which of the following graphs?
a) Undirected Cyclic Graphs b) Directed Cyclic Graphs c) Undirected Acyclic Graphs d) Directed Acyclic Graphs

ix) A Circuit that does not repeat vertices is called ________.
a) cycle b) path c) tree d) directed graph

x) What is a hash table?
a) A structure that maps values to keys b) A structure that maps keys to values c) A structure used for storage d) A structure used to implement stack and queue

xi) Dijkstra's algorithm is used for finding ________.
a) minimum spanning tree b) shortest path c) string matching d) sorted sequence

xii) A graph is called a ________ if it is a connected acyclic graph.
a) cyclic graph b) regular graph c) tree d) forest

xiii) A binary tree is balanced if the difference of height between left and right sub-tree is not more than ________.
a) 0 b) 1 c) 2 d) 3

xiv) The following numbers are inserted into an empty binary search tree in the given order:
10, 1, 3, 5, 15, 12, 16. What is the number of leaf nodes of the binary search tree?
a) 3 b) 4 c) 5 d) 6

xv) What is a Rabin and Karp Algorithm?
a) String Matching Algorithm b) Shortest Path Algorithm c) Spanning Tree Algorithm d) Approximation Algorithm

GROUP-B (Answer any Five)

2. What is Algorithm? Explain the difference between set and multi-set. Write the pseudo code of PUSH and POP operation. (2 + 2 + 4)

3. Write down the selection sort algorithm. Explain the steps of selection sort algorithm using an example. Find the worst-case time complexity of selection sort algorithm. (3 + 3 + 2)

4. Write down the Prim's algorithm for finding minimum spanning tree. Explain the steps of Prim's algorithm using an example. (4 + 4)

5. What is the significance of linear sort algorithm? Explain the limitations of linear sort. Discuss Bucket sort with an example. (2 + 2 + 4)

6. Write and explain recursive Binary search algorithm. Is binary search useful for an unsorted array? Find Time complexity of Binary search algorithm. (4 + 1 + 3)

7. What is Hashing? Describe the uses of Hash Table and Hash Function. Discuss Chaining method as Collision resolving technique. (2 + 3 + 3)

8. Write down Bellman-Ford's Shortest-Path algorithm. Explain Bellman-Ford algorithm using the following graph. (4 + 4)

9. Write a pseudocode of Naive String-Matching Algorithm. Given pattern: 101110, text: 1110101011101100. Find the occurrence of pattern in the text using Naive String-Matching Algorithm. (4 + 4)

---

📄 PAPER 3: 307/5(N) - MARCH 2023

GROUP-A (MCQ - Any twenty)

i) ADT full form -
a) About Data Type b) Abandoned Data Type c) Abstract Data Type d) Absolute Data Transaction

ii) In a multiset, elements are arranged in an unordered manner, with elements having a multiplicity of ________?
a) One b) More than one c) Zero d) All of the above

iii) Binary Search can be categorized into which of the following?
a) Graph algorithm b) Divide and conquer c) Greedy algorithm d) Dynamic programming

iv) What is the time complexity of binary search with iteration?
a) O(n log n) b) O(log n) c) O(n) d) O(n²)

v) Which of the following is/are property/properties of a dynamic programming problem?
a) Optimal substructure b) Overlapping sub-problems c) Greedy approach d) Both optimal substructure and overlapping sub-problems

vi) A circuit that does not repeat vertices is called ________.
a) a cycle b) a path c) a tree d) a directed graph

vii) What is the time complexity of Kruskal's algorithm (E is the number of edges and V is the number of vertices of input graph)?
a) O(log V) b) O(E log V) c) O(E²) d) O(V log E)

viii) If A = {x, y, z}, number of elements of the power set of A is:
a) 6 b) 8 c) 10 d) 12

ix) Which option contains two equal sets?
a) X = {5,6} and Y = {6} b) X = {5,6,8,9} and Y = {6,8,5,9} c) X = {5,6,9} and Y = {5,6} d) X = {5,6} and Y = {5,6,3}

x) Time complexity depends on -
a) Compile time b) Run time c) both Compile time and Run time d) None of these

xi) Which of the following is a linear data structure?
a) Array b) AVL Trees c) Binary Trees d) Graphs

xii) What is the maximum number of swaps that can be performed in the Selection Sort algorithm?
a) n-1 b) n c) 1 d) n-2

xiii) Which of the following has search efficiency of O(1)?
a) Tree b) Heap c) Hash Table d) Linked-List

xiv) MST full form is:
a) Maximum Spanning Tree b) Maximum Sub Tree c) Minimum Spanning Tree d) Minimum Sub Tree

xv) If the array is already sorted, which of these algorithms will exhibit the best performance?
a) Merge Sort b) Insertion Sort c) Quick Sort d) Heap Sort

xvi) What is the maximum number of swaps that can be performed in the Bubble Sort algorithm?
a) n-1 b) n c) 1 d) n*(n-1)/2

xvii) The main measures of the efficiency of an algorithm are?
a) Time and space complexity b) Data and space c) Processor and memory d) Complexity and capacity

xviii) If several elements are competing for the same bucket in the hash table, what is it called?
a) Diffusion b) Replication c) Collision d) Duplication

xix) Quick Sort algorithm is a -
a) Dynamic Programming b) Computer programming c) Divide & Conquer Algorithm d) Greedy algorithm

xx) Name of the data structure uses by recursion is:
a) Stack b) Queue c) Array d) Linked list

xxi) DAG full form is:
a) Direct Aligned Graph b) Direct Acyclic Graph c) Defined Aligned Graph d) Defined Acyclic Graph

xxii) Dijkstra's algorithm is known as -
a) All pair shortest path b) All pair longest path c) Single Source longest Path d) Single Source shortest path

xxiii) Which of the following is true?
a) Prim's algorithm initializes with a vertex b) Prim's algorithm initializes with an edge c) Prim's algorithm initializes with a vertex which has smallest edge d) Prim's algorithm initializes with a forest

xxiv) Which of the following algorithms are used to find the shortest path from a source node to all other nodes in a weighted graph?
a) BFS b) Dijkstra's Algorithm c) Prim's Algorithm d) Kruskal's Algorithm

GROUP-B (Answer any Five)

2. a) What is Algorithm? Explain Big-Oh (O) asymptotic notation. (2 + 2)
b) What is Time complexity? Why Are Time and Space Complexities important? (2 + 2)

3. a) Find time complexity of following:

```
i = 1;
while (i ≤ n) {
    printf("CST\n");
    i = i * 2;
}
```

(4)
b) Explain the basic concept of divide and conquer algorithmic model. (4)

4. a) State the conditions when linear search can be considered. (2)
b) Write an algorithm of binary search. Explain why complexity of binary search is O(log n). (4 + 2)

5. a) Explain the signification and advantage of height balancing of binary search tree. (4)
b) Write a pseudo code of insertion operation in binary search tree. (4)

6. a) How does the Prim's algorithm work? (3)
b) Construct a minimum spanning tree from this weighted graph using Kruskal's algorithm. (5)

7. Explain Merge sort algorithm with suitable example. (8)

8. a) What is hashing? (2)
b) Briefly discuss about different collision resolution techniques. (6)

9. a) Write down Dijkstra's Shortest-Path Algorithm. (5)
b) Explain it with suitable example. (3)

10. a) Write down Rabin-Karp algorithm for string matching. (6)
b) Compare Rabin-Karp and KMP algorithm. (2)

---

📄 PAPER 4: 307/5(N) - JUNE 2022

GROUP-A (MCQ - Any ten)

i) Which of the following is asymptotically smallest?
a) n b) log n c) n log n d) 2n

ii) Which following statement is true?
a) All graphs are trees b) All trees are graphs c) Some trees are graphs d) No tree is a graph

iii) Which of the following sorting algorithms is the fastest?
a) Merge sort b) Quick sort c) Insertion sort d) Shell sort

iv) The given array is arr = {1, 2, 4, 3}. Bubble sort is used to sort the array elements. How many iterations will be done to sort the array?
a) 4 b) 2 c) 1 d) 0

v) Choose the incorrect statement about merge sort from the following -
a) it is a comparison based sort b) it is an adaptive algorithm c) it is not an in-place algorithm d) it is a stable algorithm

vi) What is a randomized QuickSort?
a) The leftmost element is chosen as the pivot b) The rightmost element is chosen as the pivot c) Any element in the array is chosen as the pivot d) A random number is generated which is used as the pivot

vii) Which of the following algorithm implementations is similar to that of an insertion sort?
a) Binary heap b) Quick sort c) Merge sort d) Radix sort

viii) Which of the following is true?
a) Prim's algorithm initialises with a vertex b) Prim's algorithm initialises with an edge c) Prim's algorithm initialises with a vertex which has smallest edge d) Prim's algorithm initialises with a forest

ix) Given an array arr = {45, 77, 89, 90, 94, 99, 100} and key = 99; what are the mid values (corresponding array elements) in the first and second levels of recursion?
a) 90 and 99 b) 90 and 94 c) 89 and 99 d) 89 and 94

x) What is a Rabin and Karp Algorithm?
a) String Matching Algorithm b) Shortest Path Algorithm c) Minimum spanning tree Algorithm d) Approximation Algorithm

xi) Worst case is the worst case time complexity of Prim's algorithm if adjacency matrix is used?
a) O(log V) b) O(V²) c) O(E²) d) O(V log E)

xii) Floyd Warshall Algorithm used to solve the shortest path problem has a time complexity of -
a) O(VV) b) O(VVV) c) O(EV) d) O(E*E)

GROUP-B (Fill in the blanks - Any ten)

i) Running time complexity of heap sort is ________.

ii) LIFO scheme is used in ________ data structure.

iii) An algorithm is a ________ to solve a problem.

iv) Element of queue will be deleted from ________ end.

v) Worst case for linear search is ________.

vi) Each node in a binary tree has atmost ________ child nodes.

vii) O-notation provides an asymptotic ________.

viii) Deletion in heap requires ________ number of arrays.

ix) Time complexity of insertion sort is ________.

x) The process where two rotations are required to balance a tree is called ________.

xi) Big O notation derives the ________ case.

xii) ________ notation gives the lower bound of the function f(n).

xiii) Balance factor of AVL tree is ________.

xiv) ________ is the formula used in Euclid's algorithm for finding the greatest common divisor of two numbers.

xv) If algorithm takes O(n²), it is faster for sufficiently larger n than if it had taken ________.

GROUP-C (Answer any ten)

i) Write one difference between path and cycle.

ii) Define insertion sort.

iii) What is another name of height balanced binary search tree?

iv) What is the Greedy method?

v) Mention the various types of searching techniques in C.

vi) What is Linear Time Sorting?

vii) What is Collision?

viii) What is advantage of linked list representation of binary trees over arrays?

ix) What is cut vertex?

x) What is direct addressing?

xi) What is data abstraction?

xii) What is sink in a graph?

xiii) Define in-degree of a graph.

xiv) What is pivot in Quick Sort?

GROUP-D (Answer any six)

i) Which is the best searching algorithm and why?

ii) Describe best case time complexity.

iii) Define 'Big Theta' Notation.

iv) What do you mean by sorting?

v) Define Dynamic Programming algorithm.

vi) Why a sorting technique is called stable?

vii) Which one is more efficient - Insertion Sort or Merge Sort?

viii) Write the advantages of height balancing.

ix) What is Omega Notation & give example?

x) What is inorder traversal in BST?

GROUP-E (Answer any one)

5. a) What is an algorithm and what is the Complexity of the Algorithm?

b) Write an algorithm for the bubble sort method.

c) Draw and explain the colpitt oscillator. Write down Barkhausen criterion for oscillation.

6. a) What is space complexity? Write down the complexity of merge sort.

b) Write and explain recursive binary search algorithm.

c) Write Divide and Conquer algorithm with detailed explanation.

7. a) Explain path, cycle and directed acyclic graph with proper examples.

b) Explain Directed Acyclic Graphs with Examples.

c) Use Kruskal's algorithm to find out the minimum spanning tree for the graph.

---

📄 PAPER 5: 2235 - MARCH 2023 (from Merged File)

GROUP-A (MCQ - Any twenty)

i) Which of the following is asymptotically smallest?
a) n b) log n c) n log n d) 2n

ii) Which following statement is true?
a) All graphs are trees b) All trees are graphs c) Some trees are graphs d) No tree is a graph

iii) Which of the following sorting algorithms is the fastest?
a) Merge sort b) Quick sort c) Insertion sort d) Shell sort

iv) The given array is arr = {1, 2, 4, 3}. Bubble sort is used to sort the array elements. How many iterations will be done to sort the array?
a) 4 b) 2 c) 1 d) 0

v) Choose the incorrect statement about merge sort from the following -
a) it is a comparison based sort b) it is an adaptive algorithm c) it is not an in-place algorithm d) it is a stable algorithm

vi) What is a randomized QuickSort?
a) The leftmost element is chosen as the pivot b) The rightmost element is chosen as the pivot c) Any element in the array is chosen as the pivot d) A random number is generated which is used as the pivot

vii) Which of the following algorithm implementations is similar to that of an insertion sort?
a) Binary heap b) Quick sort c) Merge sort d) Radix sort

viii) Which of the following is true?
a) Prim's algorithm initialises with a vertex b) Prim's algorithm initialises with an edge c) Prim's algorithm initialises with a vertex which has smallest edge d) Prim's algorithm initialises with a forest

ix) Given an array arr = {45, 77, 89, 90, 94, 99, 100} and key = 99; what are the mid values (corresponding array elements) in the first and second levels of recursion?
a) 90 and 99 b) 90 and 94 c) 89 and 99 d) 89 and 94

x) What is a Rabin and Karp Algorithm?
a) String Matching Algorithm b) Shortest Path Algorithm c) Minimum spanning tree Algorithm d) Approximation Algorithm

xi) Worst case is the worst case time complexity of Prim's algorithm if adjacency matrix is used?
a) O(log V) b) O(V²) c) O(E²) d) O(V log E)

xii) Floyd Warshall Algorithm used to solve the shortest path problem has a time complexity of -
a) O(VV) b) O(VVV) c) O(EV) d) O(E*E)

GROUP-B (Fill in the blanks - Any ten)

i) Running time complexity of heap sort is ________.

ii) LIFO scheme is used in ________ data structure.

iii) An algorithm is a ________ to solve a problem.

iv) Element of queue will be deleted from ________ end.

v) Worst case for linear search is ________.

vi) Each node in a binary tree has atmost ________ child nodes.

vii) O-notation provides an asymptotic ________.

viii) Deletion in heap requires ________ number of arrays.

ix) Time complexity of insertion sort is ________.

x) The process where two rotations are required to balance a tree is called ________.

xi) Big O notation derives the ________ case.

xii) ________ notation gives the lower bound of the function f(n).

xiii) Balance factor of AVL tree is ________.

xiv) ________ is the formula used in Euclid's algorithm for finding the greatest common divisor of two numbers.

xv) If algorithm takes O(n²), it is faster for sufficiently larger n than if it had taken ________.

GROUP-C (Answer any ten)

i) Write one difference between path and cycle.

ii) Define insertion sort.

iii) What is another name of height balanced binary search tree?

iv) What is the Greedy method?

v) Mention the various types of searching techniques in C.

vi) What is Linear Time Sorting?

vii) What is Collision?

viii) What is advantage of linked list representation of binary trees over arrays?

ix) What is cut vertex?

x) What is direct addressing?

xi) What is data abstraction?

xii) What is sink in a graph?

xiii) Define in-degree of a graph.

xiv) What is pivot in Quick Sort?

GROUP-D (Answer any six)

i) Which is the best searching algorithm and why?

ii) Describe best case time complexity.

iii) Define 'Big Theta' Notation.

iv) What do you mean by sorting?

v) Define Dynamic Programming algorithm.

vi) Why a sorting technique is called stable?

vii) Which one is more efficient - Insertion Sort or Merge Sort?

viii) Write the advantages of height balancing.

ix) What is Omega Notation & give example?

x) What is inorder traversal in BST?

GROUP-E (Answer any one)

5. a) What is an algorithm and what is the Complexity of the Algorithm?

b) Write an algorithm for the bubble sort method.

c) Draw and explain the colpitt oscillator. Write down Barkhausen criterion for oscillation.

6. a) What is space complexity? Write down the complexity of merge sort.

b) Write and explain recursive binary search algorithm.

c) Write Divide and Conquer algorithm with detailed explanation.

7. a) Explain path, cycle and directed acyclic graph with proper examples.

b) Explain Directed Acyclic Graphs with Examples.

c) Use Kruskal's algorithm to find out the minimum spanning tree for the graph.

---

📊 YEAR-WISE SUMMARY – ALGORITHMS

Year Paper Code Month
2024 307/5(N) December
2024 307/5(N) January
2023 307/5(N) March
2022 307/5(N) June
2023 2235 March

---