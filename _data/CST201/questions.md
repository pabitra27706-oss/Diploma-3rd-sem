C PROGRAMMING (CST201) – 5 Papers

📄 PAPER 1: 307/1(N) - DECEMBER 2024

GROUP-A (MCQ - Any ten with explanation)

i) Write the output of the following code:

```c
void main() { 
    int x = 4 * 8 % 10 / 2; 
    printf("%d", x); 
}
```

[A] 2 [B] 16 [C] 1 [D] None of these

ii) What is the value of p in the following code?

```c
#define SQR(x) x * x
void main() {
    int p = SQR(2 + 3);
    printf("%d", p);
}
```

[A] 25 [B] 11 [C] 13 [D] 10

iii) If a = 14 and b = -4, then what is the value of a % b?
[A] -3 [B] 3 [C] 2 [D] -2

iv) Write the output of the following code:

```c
int main() {
    int x = 35;
    printf("%d %d %d", x == 50, x = 50, x >= 50);
}
```

[A] 1 50 0 [B] 0 50 0 [C] 50 50 1 [D] 0 50 1

v) Which of the following statement is not generally used in structured programming?
[A] break [B] continue [C] switch [D] goto

vi) Which of the following is a reserved word in C?
[A] printf [B] main [C] union [D] All of these

vii) If an int element requires 2-byte memory, How many bytes will be allocated to int arr[5][5]?
[A] 5 [B] 50 [C] 25 [D] 10

viii) Find the output of the following code:

```c
#include<stdio.h>
main() {
    int num = 5, *ptr = &num, x = *ptr;
    printf("%d %d %d", ++num, x + 2, (*ptr)--);
}
```

[A] 6 8 6 [B] 6 8 4 [C] 5 7 4 [D] 5 7 5

ix) If arr is an array of integers, the arr[i] is equivalent to
[A] *a - i [B] *a - i [C] a - i [D] *arr[i]

x) If P and Q are properly declared and initialized pointer and x, y and z are integer variables, then which of the following statement is NOT valid?
[A] x = x + *P [B] y = *P + *Q [C] P = Q + 10 [D] *P = P + 10

xi) If int, char and float variables take 2 byte, 1 byte and 4 byte memory respectively, then what is the size of a variable of following union type?

```c
union test {
    int x;
    char y;
    float z;
};
```

[A] 7 bytes [B] 2 bytes [C] 3 bytes [D] 4 bytes

xii) Which of the following is NOT a storage class?
[A] auto [B] extern [C] dynamic [D] static

xiii) Which of the following is NOT an infinite loop?
[A] for (i = 100; i < 500; --i) { }
[B] while(1) { }
[C] i = 10; for (i < 20; ++i) { }
[D] for (i = 10; i < 20; --i) { i = i - 2; }

xiv) Which of the following is a valid variable name in C?
[A] roll_no [B] &rollno [C] roll no [D] roll-no

xv) Which of the following is NOT determined by the storage class of a variable?
[A] The place where the variable allocates its space.
[B] The scope of the variable.
[C] The range of values of the variable.
[D] The initial value of the variable.

GROUP-B (Answer any Five)

2. Write the relation between header file and library file. Explain operator precedence and associativity with example. Write the difference between == (equality) and = (assignment) operators. (2 + 4 + 2)

3. Draw the flow-chart of nested if-else structure. Write a C program which input three integer numbers and find and display the maximum number. (3 + 5)

4. Write the difference between while and do-while loops. Write a C program to input an integer number and calculate the sum of its digits. (3 + 5)

5. What do you mean by array? Write a C program to read a 4×4 integer matrix and find the sum of its diagonal elements. (2 + 6)

6. What are the advantages of user-defined function? Write the difference between function declaration and function definition. Explain actual parameter and formal parameter with example. (3 + 2 + 3)

7. What is the use of 'return' statement? Write a C program which calculate the following sum:
sum = 1/1! + 1/2! + 1/3! + ... + 1/n!
[The value of n is taken as input] (2 + 6)

8. What do you understand by recursion? Explain with example. Write recursive function with two integer parameters and calculate their greatest common divisor. (3 + 5)

9. What do you understand by storage class? Explain different storage class in C with example. (2 + 6)

10. What is pointer? Explain call-by-value and call-by-address parameter passing techniques with example. (2 + 6)

---

📄 PAPER 2: 307/1(N) - JANUARY 2024

GROUP-A (MCQ - Any ten with explanation)

a) What will be the default value of a global integer variable?
a) 0 b) 1 c) garbage d) depends on compiler

b) Which of the following is not a valid C variable name?
a) int number; b) float _rate; c) int variable_count; d) int $main;

c) Which keyword is used to prevent any changes in the variable within a C program?
a) immutable b) mutable c) const d) volatile

d) What is the sizeof(char) in a 32-bit C compiler?
a) 1 bit b) 2 bits c) 1 Byte d) 2 Bytes

e) The function strcpy(s1,s2) -
a) copies s1 into s2 b) copies s2 into s1 c) append s2 after s1 d) replace s1 with s2

f) What will be the output of the following:

```c
void main() {
    int i = 3;
    int k = i % -2;
    printf("%d\n", k);
}
```

a) 0 b) -1 c) 1 d) compiler error

g) What will be the output:

```c
int main() {
    int r, x = 2;
    float y = 3;
    r = y % x;
    printf("%d", r);
}
```

a) 0 b) -1 c) 1 d) compiler error

h) What is the output of the following code:

```c
int main() {
    int y = 99;
    int y = 34;
    printf("Hi! %d\n", y);
    return 0;
}
```

a) Compile time error b) Hi! 34 c) Hi! 99 d) Hi! followed by a garbage value

i) Find the output of the following C code:

```c
void main() {
    int y = 5 * 9 / 3 + 9;
}
```

a) 3 b) 24 c) 0 d) 3.75

j) Find the output:

```c
void main() {
    1 < 2 ? return 1 : return 2;
}
```

a) returns 1 b) returns 2 c) Varies d) Compile time error

k) Data type that will be returned from fun():

```c
int fun() {
    return (double)(char)9.0;
}
```

l) x = 6; y = x++; The values of x and y will be -
a) x = 6, y = 7 b) x = 7, y = 6 c) x = 6, y = 6 d) x = 7, y = 7

m) x = 6; y = ++x; The values of x and y will be -
a) x = 6, y = 7 b) x = 7, y = 6 c) x = 6, y = 6 d) x = 7, y = 7

n) x = 6; y = -x; The values of x and y will be -
a) x = 6, y = 5 b) x = 5, y = 6 c) x = 6, y = 6 d) x = 5, y = 5

o) The value of -17 % -5 is -
a) 2 b) -2 c) 3.4 d) none

GROUP-B (Answer any Five)

2. a) How do comments written in C explain with examples? (2)
b) Write a program to explain if-else construct in a C program. (3)
c) What is modular programming? How functions help in modular programming? (3)

3. a) Write a program to calculate GCD of two numbers. (4)
b) Discuss different storage classes with examples. (4)

4. a) What is a string in C? (1)
b) Discuss any four string handling library functions with example. (7)

5. a) Write a C program to reverse a string without using any string handling library function. (4)
b) Discuss different storage classes with examples. (4)

6. a) Explain with example the use of "address of" and "value of" operator in relation to pointers in C. (4)
b) Write a C program to access a one dimensional array using pointers. (4)

7. a) Differentiate calloc() and malloc(). (3)
b) Explain the differences between recursion and iteration. (2)
c) Write a complete "Hello World" program in C and explain used header files with their purpose. (3)

8. Write programs to generate Fibonacci series using recursion and loop. (4 + 4)

9. a) Illustrate the use of switch-case with an example program code. (4)
b) Write a program to find all the Armstrong numbers within 100 to 1000. (4)

---

📄 PAPER 3: 307/1(N) - MARCH 2023

GROUP-A (MCQ - Any twenty)

i) Which is the correct way to declare a pointer?
a) int_ptr x b) int *ptr c) *int ptr d) none

ii) What is the size of the int data type (in bytes) in C?
a) 4 b) 8 c) 2 d) 1

iii) How is an array initialized in C language?
a) int a[3] = {1, 2, 3}; b) int a = {1, 2, 3}; c) int a[] = new int[3]; d) int a(3) = {1, 2, 3};

iv) A function -
a) may or may not need input data b) may or may not return a value c) Both a and b d) None of these

v) How will you print \n on the screen?
a) printf("\n") b) echo "\n" c) printf("\n") d) printf("\n")

vi) If p is an integer pointer with a value 1000, then what will the value of p + 5 be?
a) 1020 b) 1005 c) 1004 d) 1010

vii) Which of the following are not standard header files in C?
a) stdio.h b) stdlib.h c) conio.h d) None of the above

viii) What is the output of the following code snippet?

```c
#include <stdio.h>
int main() {
    int a[] = {1, 2, 3, 4};
    int sum = 0;
    for(int i = 0; i < 4; i++) {
        sum += a[i];
    }
    printf("%d", sum);
    return 0;
}
```

a) 1 b) 4 c) 20 d) 10

ix) What is the output of the following code snippet?

```c
int main() {
    int sum = 2 + 4 / 2 + 6 * 2;
    printf("%d", sum);
    return 0;
}
```

a) 2 b) 15 c) 16 d) 18

x) Which of the following is an exit controlled loop?
a) while loop b) for loop c) do-while loop d) None of the above

xi) Which data structure is used to handle recursion in C?
a) Stack b) Queue c) Queue d) Tree

xii) Which of the following is not a storage class specifier in C?
a) volatile b) extern c) typedef d) static

xiii) Who is the father of C language?
a) Steve Jobs b) James Gosling c) Dennis Ritchie d) Rasmus Lerdorf

xiv) Which of the following is not a valid C variable name?
a) int number; b) float rate; c) int variable_count; d) int $main;

xv) All keywords in C are in -
a) LowerCase letters b) UpperCase letters c) CamelCase letters d) None of the mentioned

xvi) Which of the following cannot be a variable name in C?
a) volatile b) true c) friend d) export

xvii) The C-preprocessors are specified with symbol -
a) # b) $ c) " d) &

xviii) If the function returns no value then it is called -
a) Data type function b) Calling function c) Main function d) Void function

xix) In C compiler there are -
a) 30 keywords b) 32 keywords c) 31 keywords d) 37 keywords

xx) && is a/an ________ operator.
a) arithmetic b) logical c) Uninor d) Bitwise AND

xxi) The continue statement cannot be used with -
a) for b) switch c) while d) all of these

xxii) Compiler converts the .c file into -
a) class file b) obj file c) lib file d) batch file

xxiii) The keyword used to transfer control from a function back to the calling function is -
a) switch b) goto c) go back d) return

xxiv) What is the output?

```c
int a = 5, b;
b = a++;
printf("%d %d", a, b);
```

a) 6 5 b) 6 6 c) 5 5 d) 5 6

xxv) If x = -5 and y = 3 then the value of x % y is -
a) -2 b) 2 c) 1 d) None of these

GROUP-B (Answer any Five)

2. a) Write a program in C to find the GCD (Greatest Common Divisor) of two numbers. (4)
b) Write a program in C to check whether a number is divisible by 5 and 11 or not. (4)

3. a) Differentiate between for and while loop using suitable example. (3)
b) Write a program in C to input marks of five subjects C_Prog, Data_Struct, Algorithms, Python and Comp_System_Organization. Calculate percentage and grade according to following:
Percentage >= 90% : Grade A
Percentage >= 80% : Grade B
Percentage >= 70% : Grade C
Percentage >= 60% : Grade D
Percentage >= 40% : Grade E
Percentage < 40% : Grade F (5)

4. a) What is the use of goto statement? Give suitable example. (3)
b) Print the patterns using nested loops:

```
5
4 5
3 4 5
2 3 4 5
1 2 3 4 5
```

(5)

5. a) Write a program in C to check whether a given matrix is an identity matrix. (5)
b) What is an array? State advantages of an array. (1 + 2)

6. a) Discuss various storage classes used in C. (4)
b) Differentiate between call by value and call by address. (4)

7. a) Explain the following string operations using in C: (i) strcmp() (ii) strcat() (3)
b) Write a C program to convert lowercase string to uppercase and vice versa. [Do Not use string.h] (5)

8. a) Write a program in C to add two numbers using pointers and function. (5)
b) What is pointer? State advantages of using pointer in C. (1 + 2)

9. a) Write a program in C to find ASCII value of a character. (3)
b) Write a program in C to find all prime numbers between given interval using functions. (5)

10. Explain with example: a) malloc() b) calloc() c) realloc() d) free() (2 + 2 + 2 + 2)

---

📄 PAPER 4: 307/1(N) - JUNE 2022

GROUP-A (MCQ - Any ten)

i) 'C' is often called a -
a) Object oriented language b) High level language c) Assembly language d) Machine level language

ii) Which operator has the lowest priority?
a) ++ b) % c) + d) ||

iii) Which escape character can be used to begin a new line in C?
a) \a b) \b c) \m d) \n

iv) Which is false?
a) A variable defined once can be defined again with different scope.
b) A single variable cannot be defined with two different types in the same scope.
c) A variable must be declared and defined at the same time.
d) A variable refers to a location in memory.

v) The function strcpy(s1,s2) call means -
a) copies s1 string into s2 b) copies s2 string into s1 c) copies both s1 and s2 d) None of these

vi) File manipulation functions in C available in header file -
a) streams.h b) stdio.h c) stdlib.h d) files.h

vii) What is the limit for number of functions in a C Program?
a) 16 b) 31 c) 32 d) No Limit

viii) Address stored in the pointer variable is of type -
a) Integer b) Float c) Array d) Character

ix) What is the output of:

```c
int main() {
    int i = -5;
    int k = i % 4;
    printf("%d\n", k);
}
```

a) Compile time error b) -1 c) 1 d) None

x) How many times will the following loop execute?

```c
for(j = 1; j <= 10; j = j - 1)
```

a) forever b) never c) 0 d) 1

xi) What is the output of the following program?

```c
#include<stdio.h>
main() {
    int r, x = 2;
    float y = 5;
    r = y % x;
    printf("%d", r);
}
```

a) 1 b) 0 c) 2 d) Compile error

xii) The machine registers are sometimes called -
a) local variables b) global variables c) accumulators d) static variables

xiii) The value of -17 % -5 is -
a) 3.4 b) 3 c) -3 d) None

xiv) x = 5; y = x++; The values of x and y will be -
a) x = 5, y = 6 b) y = 5, x = 6 c) x = 5, y = 5 d) x = 6, y = 6

xv) Which is valid C expression?
a) int my_num = 100,000; b) int my_num = 100000; c) int my_num = 1000; d) int $my_num = 10000

GROUP-B (Fill in the blanks - Any ten)

i) Long int I; In 32-bit compiler occupies ______ bytes in main memory.

ii) The C language consist of ______ number of keywords.

iii) Each string is terminated with a ______ character.

iv) scanf() is a predefined function in ______ header file.

v) The ______ is equivalent to a = a - 1.

vi) ______ is unconditional control structure in C.

vii) The EOF is equivalent to ______.

viii) If the function returns no value then it is called ______.

ix) The union holds ______.

x) By default a variable is assigned with ______ in static storage class.

xi) Array subscripts in C always start at ______.

xii) The run time library is collection of ______ files.

xiii) The operator "--" is known as ______ operator.

xiv) If a is an integer variable, a = 11/2 will store in a ______.

xv) The C language was originally developed from ______ language.

GROUP-C (Answer any ten)

i) What is keywords?

ii) What is prototype declaration of a function?

iii) What do you mean by library function in C program?

iv) What do you mean by debugging?

v) What is the difference between declaring a header file with <> and " "?

vi) What is the use of a '\0' character?

vii) What is a syntax error?

viii) What is token?

ix) Write the difference between = and == in C programming.

x) What is global variable?

xi) What is malloc()?

xii) What is typecasting?

xiii) What is the job of Assembler in C programming?

xiv) What are macros?

GROUP-D (Answer any six)

i) What is Bit wise operation in C?

ii) What is header file?

iii) Write down the advantage of the Structured program.

iv) State the types of User-Defined Functions.

v) What is the difference between do-while and while loop?

vi) Evaluate c = a+++++b-- where a = 8, b = 4.

vii) Convert (167) base 10 to binary.

viii) Explain size of operator with example.

ix) Write the differences between Compiler and Interpreter.

x) Name the types of Arrays.

xi) What is looping in C?

xii) Differentiate Source Codes from Object Codes.

GROUP-E (Answer any one)

5. a) What do you mean by associativity of an operator? Explain break and continue statement with an example.

b) Write a program to calculate GCD of two numbers. Why goto statement should be avoided in C?

c) What do you mean by nested loop structure? Write a program in C to find the sum of the series 1 + (1+2) + (1+2+3) + ... up to 'n' terms, the value of 'n' should be given from the keyboard.

6. a) Discuss with programming examples the different types of String Handling Function in C.

b) Discuss different Storage Class with example.

c) Write a C program to find reverse of a string.

7. a) What do you mean by a pointer to a function? Write a C program to access a one dimensional array using pointer.

b) Write a recursive function to obtain the returning sum of first 25 natural numbers. Write a program to find whether a year is leap year or not.

c) Write a C program for reading and writing some integer value using the concept of Dynamic Memory Allocation.

---

📄 PAPER 5: 332(S) - MARCH 2021

SECTION A (Compulsory)

1. A. What will be the output of the following codes? (any five)

i)

```c
#define SQUARE(n) n * n
main() {
    int j;
    j = 64 / SQUARE(4);
    printf("j = %d", j);
}
```

ii)

```c
main() {
    int arr[] = {1, 2, 3, 4, 5};
    int *ptr, i;
    ptr = arr + 4;
    for(i = 0; i < 5; i++)
        printf("%d", *(ptr - i));
}
```

iii)

```c
int func();
main() {
    printf("%d", func());
    printf("%d", func());
    printf("%d", func());
}
int func() {
    int counter = 5;
    counter++;
    return(counter);
}
```

iv)

```c
int f2(int a) {
    return(a * a);
}
int f1(int a, int b) {
    return(f2(a * b));
}
main() {
    int x;
    x = f1(2, 4);
    printf("%d", x);
}
```

v)

```c
main() {
    int i = 1;
    while(1) {
        printf("%d\n", i++);
        if(i > 10)
            break;
    }
}
```

vi)

```c
main() {
    int x = 3, y, z;
    y = x = 10;
    z = x < 10;
    printf("x=%d y=%d z=%d", x, y, z);
}
```

vii)

```c
main() {
    int k, num = 30;
    k = (num > 5 ? (num <= 10 ? 100 : 200) : 500);
    printf("%d", k);
}
```

1. B. Choose the correct answer from the given alternatives (any ten)

i) If an array is declared as arr[] = {1, 2, 5, 7, 9}; then what is the value of sizeof(arr[3])?
(a) 1 (b) 2 (c) 3 (d) 8

ii) ASCII code for a - z ranges from -
(a) 0 - 26 (b) 35 - 81 (c) 97 - 123 (d) none of the above

iii) s1 = "H1", s2 = "HELLO", s3 = "BYE". How can we concatenate the three strings?
(a) strcat(s1, s2, s3) (b) strcat(s1, strcat(s2, s3)) (c) strcpy(s1, s2, s3) (d) strcpy(s1, strcpy(s2, s3))

iv) A string is terminated by a -
(a) \0 (b) \n (c) 0 (d) \

v) The default storage class of a local variable is -
(a) auto (b) static (c) register (d) extern

vi) *(&num) is equivalent to writing -
(a) &num (b) *num (c) num (d) none of these

vii) A structure can be placed within another structure is known as -
(a) nested structure (b) self-referential structure (c) parallel structure (d) pointer to structure

viii) From which standard stream does a C program read data?
(a) stdin (b) stdout (c) stderr (d) all of these

ix) C is a -
(a) Middle level language (b) High level language (c) Low level language (d) none of these

x) If a is an integer variable, a = 5/2; will return a value -
(a) 2.5 (b) 3 (c) 2 (d) 0

xi) The break statement is used to exit from -
(a) an if statement (b) a for loop (c) a program (d) the main() function

xii) A do while loop is useful when we want that the statements within the loop must be executed -
(a) only once (b) at least once (c) more than once (d) none of the above

SECTION B (Answer any five)

2. a) Distinguish between Structure and union. (3)
b) Write down a program in C to insert 'n' students data in a structure array named as 'Student' consisting of roll, name and marks of three subjects as member data. Display all those data and average marks of each student in tabular format. (7)

3. a) What do you mean by parameter passing in C? (3)
b) Explain different types of parameter passing supported by C using suitable examples. (7)

4. a) What are the advantages of switch-case statements over nested if-else structure? (3)
b) Write down a program in C to express any multiword string into its equivalent abbreviated form separated by a dot (.) i.e. SWAPAN KUMAR SEN will be written as S.K.S. (7)

5. a) Create a two dimensional integer array to insert some integers randomly into it. Now find the greatest and smallest integer from the array and also find their corresponding locations. (6)
b) What do you mean by pointer to a function? Give an example. (2 + 2)

6. a) What are the different kinds of modes available in C to open a file? (3)
b) Write a program in C to create three different files "NUMBER", "EVEN" and "ODD". Now insert some integer numbers randomly into "NUMBER" file. Now from all those integers put all even numbers into "EVEN" and odd numbers into "ODD" file respectively. (7)

7. a) Write down the atleast three differences between entry controlled and exit controlled loop structure. (4)
b) Write down a C program to find all the prime numbers in a given range (upper and lower range should be given from the keyboard). (6)

8. a) Write a program in C to find the sum of the series 1 + (1+2) + (1+2+3) + ... up to 'n' terms, the value of 'n' should be given from the keyboard. (6)
b) Why we should avoid 'goto' statement from our program? (4)

9. a) What do you mean by pointer in C? (2)
b) What are the advantages of pointer variable over memory variable? (3)
c) Write a program in C to access the elements of a one dimensional array using pointer. (5)

10. a) Write C programs to implement: i) strcpy(), ii) strlen() library function by yourself. (3×2)
b) What do you mean by null character? Describe its uses in string manipulation. (1 + 3)

---

📊 YEAR-WISE SUMMARY – C PROGRAMMING

Year Paper Code Month
2024 307/1(N) December
2024 307/1(N) January
2023 307/1(N) March
2022 307/1(N) June
2021 332(S) March