SCRIPTING LANGUAGES - PYTHON (CST203) – 5 Papers

---

📄 PAPER 1: 307/2(N) - DECEMBER 2024

GROUP-A (MCQ - Any ten with explanation)

i) Which of the following statements is true?
a) Python is a high level programming language b) Python is an interpreted language c) Python is an object-oriented language d) All of the above

ii) What is the output of the following loop? (Consider ',' as newline)

```python
for i in reversed(range(1, 10, 2)):
    print(i)
```

a) 0,2,4,6,8 b) 0,2,4,6,8,10 c) 9,7,5,3,1 d) 8,6,4,2

iii) Which of the following command is used to open a file "c:\temp.txt" in read-mode only?
a) infile = open("c:\temp.txt","r") b) infile = open("c:\temp.txt","r") c) infile = open(file="c:\temp.txt","r+") d) infile = open(file="c:\temp.txt","r+")

iv) A = {1,2,3,4,5,6}
Print(A[1:]) will give which output.
a) 1,2,3,4,5,6 b) 1 c) 2,3,4,5,6 d) 2

v) What two statements are used to implement iteration?
a) IF and ELSE b) ELSE and WHILE c) FOR and WHILE d) IF and WHILE

vi) Which function is called an anonymous function?
a) Lambda b) map c) filter d) reduce

vii) A = {'a',93,99,'time'} is a -
a) Tuple b) Dictionary c) List d) String

viii) A Python statement not found in C programming is -
a) Break b) Pass c) Continue d) None of the above

ix) Which one of these is floor division?
a) / b) // c) % d) None of the mentioned

x) What will be the output of print(10,20,30,sep="/")?
a) 10 20 30 b) 10/20/30 c) 10\20\30 d) error

xi) Which of these commands is not a management command of static files?
a) python manage.py collectstatic b) python manage.py findstatic c) python manage.py runserver -nostatic d) python manage.py makemigrations

xii) Which of the following functions is a built-in function in python language?
a) val() b) print() c) try() d) None of these

xiii) What is the output of the following?

```python
x = set("abracadabra")
y = set("alacazam")
z = x | y
print(z)
```

a) {'c', 'a'} b) {'b', 'd', 'c', 'f', 'z', 'a', 'r', 'm'} c) {'d', 'b', 'r'} d) None of the above

xiv) What is the output of the following?

```python
x = ['ab', 'cd']
for i in x:
    x.append(i.upper())
print(x)
```

a) ['AB', 'CD'] b) ['ab', 'cd', 'AB', 'CD'] c) ['ab', 'cd'] d) None of the mentioned

xv) What is the output of the following?

```python
i = 1
while True:
    if i % 2 == 0:
        break
    print(i)
    i += 2
```

a) 1 b) 12 c) 1 2 3 4 5 6 ... d) 1 3 5 7 9 11 ...

GROUP-B (Answer any Five)

2. i) Explain the basic data types available in Python with example. (5)
ii) What kind of type conversion is perform by python interpreter and how does it justify those conversions? (3)

3. i) How do the continue, break, and pass statements work in loops? (4)
ii) What is the difference between List and Dictionary? (2)
iii) Write a program that checks if the number is prime or not. (2)

4. i) Explain four types of arguments used in function with suitable examples. (4)
ii) Write a script to find the factorial of a number using recursion. (4)

5. i) What is the difference between a module, package in Python? Give an example for each. (4)
ii) What are global, local, class scope and nonlocal variables in Python? (4)

6. Explain the difference between the following with examples:
i) readline() and readlines() (3)
ii) write() and writelines() (3)
iii) open() and close() (2)

7. i) Write a Python program that reads a text file named file.txt and counts the number of words in the file. (4)
ii) Explain MVC (2)
iii) Is Django better than Flask? (2)

8. i) What is the range() function, and how is it used in a for loop? Provide an example. (3)
ii) List three ways to format strings in Python. (3)
iii) Classify the data types into mutable and immutable types. (2)

9. i) How are start() and end() used in pattern matching with regular expressions? (2)
ii) Explain re.match(), re.split(), and re.findall() with examples. (3)
iii) Which package is used for Fourier transformation in Python? Write a program to add two arrays using the above package. (1 + 2)

---

📄 PAPER 2: 307/2(N) - JANUARY 2024

GROUP-A (MCQ - Any ten with explanation)

i) Which of the following is not a valid way to import a module in Python?
a) import module_name b) from module_name import * c) include module_name d) import module_name as alias

ii) What is the purpose of the "else" statement in an "if-else" construct in Python?
a) It defines a second condition to check b) It defines a loop c) It specifies the code to execute when the condition in the "if" statement is false d) It raises an exception

iii) How do you define a multi-line comment in Python?
a) Using the # symbol b) Using triple-quotes c) Using // symbol d) Using /* and */ symbols

iv) In Python, how do you remove an item from a list by its value?
a) Using the pop() method b) Using the remove() method c) Using the delete() method d) Using the discard() method

v) What is the output of the code: print(list(range(2, 6)))?
a) [2, 3, 4, 5] b) [2, 3, 4, 5, 6] c) [2, 4, 6] d) [2, 5]

vi) How do you define an empty dictionary in Python?
a) empty_dict = {} b) empty_dict = [] c) empty_dict = () d) empty_dict = set()

vii) How do you check the length of a list in Python?
a) list.count() b) len(list) c) list.length() d) list.size()

viii) How do you create a shallow copy of a list in Python?
a) Using the copy.copy() method b) Using the copy.deepcopy() method c) Using the list.copy() method d) Shallow copies cannot be created in Python

ix) In Python, what does the == operator do?
a) It assigns a value to a variable b) It checks if two values are equal c) It performs bitwise AND operation d) It concatenates two strings

x) What is the main purpose of using functions in Python?
a) To create loops b) To organize code into reusable blocks c) To define variables d) To perform arithmetic operations

xi) Which of the following loops is used to iterate over a sequence (such as a list or string) in Python?
a) for loop b) while loop c) until loop d) do-while loop

xii) What is the correct way to create a list containing numbers from 1 to 5 in Python?
a) list = [1,2,3,4,5] b) list = (1,2,3,4,5) c) list = {1,2,3,4,5} d) list = range(1,6)

xiii) What is the purpose of the input() function in Python?
a) It displays text on the screen b) It imports external modules c) It takes user input from the keyboard d) It generates random numbers

xiv) What does the import statement do in Python?
a) It exports a variable to another module b) It imports a module or package into the current script c) It exports a module or package to another script d) It defines a new function

xv) What is the purpose of the join() method in Python when applied to strings?
a) It splits a string into a list of substrings b) It checks if two strings are equal c) It concatenates multiple strings with a specified separator d) It converts a string to lowercase

GROUP-B (Answer any Five)

2. (i) What is the purpose of indentation in Python? (2)
(ii) What is the difference between a list and a tuple in Python? (3)
(iii) What is an if statement, and how do you use it to make decisions in your code? (3)

3. (i) Explain List slicing with examples. (4)
(ii) What is Python Dictionary? Explain with an example. (4)

4. (i) How a for loop is different from a while loop? (3)
(ii) Write a program to get the sum of the digits of a number. (5)

5. Write short notes on the following arguments related to functions with examples:
(i) Positional arguments (2)
(ii) Default arguments (2)
(iii) Variable-length arguments (2)

6. (i) Write different modes for opening a file with examples. (6)
(ii) What is pattern matching? (2)

7. (i) What is MVC? (3)
(ii) What is Django and why should you use Django? (5)

8. (i) Write a program to print elements of a tuple using a for loop. (3)
(ii) What is the utility of a pass statement? (2)
(iii) What is the utility of the else clause of a for loop? (3)

9. (i) Differentiate between local and global variables with examples. (4)
(ii) Show how to pass a list to a function using suitable code. (4)

---

📄 PAPER 3: 307/2(N) - MARCH 2023

GROUP-A (MCQ - Any twenty)

i) Which of the following is a Python tuple?
a) [1,2,3] b) (1,2,3) c) {1,2,3} d) None

ii) What is the type of each element in sys.argv?
a) set b) list c) tuple d) string

iii) What will be the output of the follow Python statement?
print("diploma"[2:-1])
a) plom b) pl c) iploma d) iplom

iv) Which one of the following is known as membership operator?
a) in b) not in c) both a and b d) is

v) Name the Python Library modules which need to be imported to invoke the following functions: (i) sin() (ii) randint()
a) math b) random c) math & random d) None of them

vi) Identify the package manager for Python packages or modules.
a) Matplotlib b) python package c) plt.show() d) PIP

vii) Which is the correct form of declaration of dictionary?
a) Day = {1:'monday',2:'tuesday',3:'wednesday'} b) Day = [1:'monday',2:'tuesday',3:'wednesday'] c) Day = (1:'monday',2:'tuesday',3:'wednesday') d) None of them

viii) Identify the valid declaration of L: L = [1, 23, 'hi', 6].
a) tuple b) dictionary c) array d) list

ix) What will be the output of above Python code?

```python
dict = {"abc":5, "def":6, "ghi":7}
print(dict[0])
```

a) abc b) 5 c) {"abc":5} d) Error

x) Which of the following is False?
a) capitalize() function in string is used to return a string by converting the whole given string into uppercase b) lower() function in string is used to return a string by converting the whole given string into lowercase c) String is immutable d) None of these

xi) Which operator of the following has the lowest priority?
a) or b) & c) * d) +

xii) Slicing in python -
a) returns a range of characters b) required start and end index c) Both are correct d) None of them

xiii) Which of the following is valid arithmetic operator in Python?
a) // b) ? c) $ d) none

xiv) Which of the following will give output as [13, 24, 91, 751]? Where list1 = [6, 13, 3, 24, 0, 91, 8, 751]
a) print(list1[0:8:2]) b) print(list1[1:7:2]) c) print(list1[1:8:2]) d) print(list1[0:7:2])

xv) Which of the following is True regarding lists in Python?
a) Lists are immutable b) Size of the lists must be specified before its initialization c) elements can be of different data types d) None of them

xvi) What is the output of the following function call?

```python
def func(stdname, Stdage=30):
    print(stdname, Stdage)
func("Neha", 10)
```

a) Neha 10 b) Neha 30 c) Error d) None

xvii) Modes of Python interpreters are -
a) Interactive b) Script c) Both d) None

xviii) What is the output of the following code?

```python
import datetime
datetime = datetime.date(2022, 12, 18)
print(datetime)
```

a) Error b) 2022-18-12 c) 2022-12-18 d) 18-12-2022

xix) What will be the output of the following Python code?

```python
print(all([10, 8, 6, 4, 0]))
```

a) True b) False c) None d) Error

xx) To return the length of string str1 what command do we execute?
a) str1.len() b) len(str1) c) Both are correct d) None of them

xxi) The elements of a list are [10, 3, 5, 1, 7, 8]. Which of the following gives the correct outputs?
A. list_name.sort() print(list_name)
B. print(max(list_name))
C. list_name.reverse() print(list_name)
D. print(list_name[-1])
a) A,B b) A,C c) B,D d) C,D

xxii) Write down the output of the following code:

```python
s = 'a,b,c,d,'
print(s[1::2])
```

a) a b) bd c) bed d) b

xxiii) Which of the following is not a part of function definition?
a) function name b) parameter list c) return value d) both a and b

xxiv) All keywords in python are in -
a) Lowercase b) Uppercase c) Capitalized d) None of the above

GROUP-B (Answer any Five)

2. a) Define python. Explain the features of python programming. (2 + 3)
b) Discuss the difference between local and global variable. (3)

3. a) Explain the use of join() and split() string methods with examples. (4)
b) What is Mutable and Immutable data type in python? (2)
c) Describe why strings are immutable with an example. (2)

4. a) Explain break and continue statement with the help of for loop with an example. (4)
b) Write a python program to check whether a number is prime or not. (4)

5. a) What is dictionary? Explain the methods available in dictionary. (2 + 2)
b) Differentiate between the tuple and list in python. (4)

6. a) State the purpose of using return statement with example in python function. (4)
b) What do you mean by required and default argument which can be passed at the time of function call? (2 + 2)

7. a) Explain different types of operators with example of each. (4)
b) Write down the example of importing a module in python. (4)

8. a) What do you mean module and package? (4)
b) Explain the arbitrary arguments associated with function with example. (4)
c) Write down the code to print current date and time. (2)

9. a) Describe the different access modes of the files with an example. (4)
b) Discuss the following methods associated with the file object: i) read() ii) write() (4)

10. a) What do you mean MVC framework? Explain each term. (3)
b) Write down the steps of creating Django project and run it. (5)

---

📄 PAPER 4: 307/2(N) - JUNE 2022

GROUP-A (MCQ - Any ten)

i) Which one of the following is not a keyword in Python language?
a) pass b) eval c) assert d) nonlocal

ii) The input() function takes user's input as a -
a) integer b) float c) string d) character

iii) What is the output of the following?

```python
x = ['ab', 'cd']
for i in x:
    x.append(i.upper())
print(x)
```

a) ['AB', 'CD'] b) ['ab', 'cd', 'AB', 'CD'] c) ['ab', 'cd'] d) none of the mentioned

iv) Which statement is used to terminate the execution of the nearest enclosing loop in which it appears?
a) Pass b) break c) continue d) jump

v) What will be the output of Python code snippet x << 2 if x = 1?
a) 4 b) 2 c) 1 d) 8

vi) The default access mode is -
a) r b) w c) rb d) wb

vii) DRY principle makes the code -
a) Reusable b) Loop forever c) Bad and repetitive d) Complex

viii) What will be the output of the following Python function?

```python
min(max(False, -3, -4), 2, 7)
```

a) -3 b) -4 c) error d) false

ix) What will be the output of the Python expression round(4.576)?
a) 4 b) 4.6 c) 5 d) 4.5

x) Which function is called an anonymous function?
a) Lambda b) Map c) Filter d) Reduce

xi) What does pip stand for python?
a) Unlimited length b) All private members must have leading and trailing underscores c) Preferred Installer Program d) None of these

xii) Which of the following functions can help us to find the version of python that we are currently working on?
a) sys.version(1) b) sys.version(0) c) sys.version() d) sys.version

xiii) What will be the output of print(10,20,30,sep="")?
a) 10 20 30 b) 10/20/30 c) 10\20\30 d) error

xiv) Which of the following is a Python tuple?
a) {1, 2, 3} b) [1, 2, 3] c) (1, 2, 3) d) None

xv) Predict output for the snippet:

```python
for j in range(1,5):
    print(j)
```

a) 1 2 3 4 b) indentation error c) j j j j d) 1 1 1 1

GROUP-B (Fill in the blanks - Any ten)

i) All keywords in Python are in ________.

ii) The Python built-in function for viewing variable types is ________.

iii) Django supports the ________ pattern.

iv) a = 5, b = 6
a, b = b, a
print(a, b) is the final output. ________

v) To convert '5' into int data type ________ command is used.

vi) Open() function is used for ________.

vii) a = 10 << 12, b = 34 >> 10, c = 7 | 13, d = 12 ^ 13
print(a, b, c, d) is the output. ________

viii) To find x^y you will use ________ operator.

ix) A program in python is stored with a ________ extension.

x) The value of the expression set([1, 1, 2, 3]) is ________.

xi) ________ method is used to delete a file.

xii) The ________ statement is a combination of an else statement and an if statement.

xiii) import time
a = time.localtime()
c = time.asctime(a)
print(c) is the output. ________

xiv) ________ is used to define a block of code in Python language.

xv) The 13 // (4 + 3 % 5) evaluates to ________.

GROUP-C (Answer any ten)

i) What is a lambda function?

ii) What is an Interpreted language?

iii) What is the purpose of isatty()?

iv) What are python iterators?

v) What is Scope in Python?

vi) How to comment multiple lines in python?

vii) Explain find() function.

viii) How will you capitalize the first letter of string?

ix) What is the purpose of flush()?

x) What are Python's dictionaries?

xi) How can you generate random numbers?

xii) What is PEP 8?

xiii) What is the purpose of the PYTHONPATH environment variable?

xiv) Is python a case-sensitive language?

GROUP-D (Answer any six)

i) What is slicing?

ii) What are membership operators?

iii) Differentiate between continue and break statement.

iv) Differentiate between globals() and locals()

v) Name two file built-in functions. Give their syntax.

vi) What is the difference between Python Arrays and lists?

vii) Give two ways to convert a number into a string.

viii) B = 3, A = 2. Swap the values of these variables.

ix) How can the ternary operators be used in python?

x) How do you insert a static file to a template in Django?

xi) Is Django better than Flask?

xii) Write a Python code to add the values of two variables.

GROUP-E (Answer any one)

5. a) Explain the basic data types available in Python with examples.

b) What is the difference between list and tuples in Python? What are the key features of Python?

c) Write a Python program to print the factorial of a number.

6. a) What is difference between module and package? Is pandas a module or package?

b) Explain different types of loops available in Python with suitable examples.

c) Write a python program to check whether the number given is a palindrome or not.

7. a) What are input and output files? How do you use input and output files in Python?

b) Write a Python program to calculate the length of a string.

c) Write a python function to print multiplication table from 1 to 10.

---

📄 PAPER 5: 2235 - MARCH 2023 (from Merged File)

GROUP-A (MCQ - Any twenty)

i) Which of the following is a Python tuple?
a) [1,2,3] b) (1,2,3) c) {1,2,3} d) None

ii) What is the type of each element in sys.argv?
a) set b) list c) tuple d) string

iii) What will be the output of the follow Python statement?
print("diploma"[2:-1])
a) plom b) pl c) iploma d) iplom

iv) Which one of the following is known as membership operator?
a) in b) not in c) both a and b d) is

v) Name the Python Library modules which need to be imported to invoke the following functions: (i) sin() (ii) randint()
a) math b) random c) math & random d) None of them

vi) Identify the package manager for Python packages or modules.
a) Matplotlib b) python package c) plt.show() d) PIP

vii) Which is the correct form of declaration of dictionary?
a) Day = {1:'monday',2:'tuesday',3:'wednesday'} b) Day = [1:'monday',2:'tuesday',3:'wednesday'] c) Day = (1:'monday',2:'tuesday',3:'wednesday') d) None of them

viii) Identify the valid declaration of L: L = [1, 23, 'hi', 6].
a) tuple b) dictionary c) array d) list

ix) What will be the output of above Python code?

```python
dict = {"abc":5, "def":6, "ghi":7}
print(dict[0])
```

a) abc b) 5 c) {"abc":5} d) Error

x) Which of the following is False?
a) capitalize() function in string is used to return a string by converting the whole given string into uppercase b) lower() function in string is used to return a string by converting the whole given string into lowercase c) String is immutable d) None of these

xi) Which operator of the following has the lowest priority?
a) or b) & c) * d) +

xii) Slicing in python -
a) returns a range of characters b) required start and end index c) Both are correct d) None of them

xiii) Which of the following is valid arithmetic operator in Python?
a) // b) ? c) $ d) none

xiv) Which of the following will give output as [13, 24, 91, 751]? Where list1 = [6, 13, 3, 24, 0, 91, 8, 751]
a) print(list1[0:8:2]) b) print(list1[1:7:2]) c) print(list1[1:8:2]) d) print(list1[0:7:2])

xv) Which of the following is True regarding lists in Python?
a) Lists are immutable b) Size of the lists must be specified before its initialization c) elements can be of different data types d) None of them

xvi) What is the output of the following function call?

```python
def func(stdname, Stdage=30):
    print(stdname, Stdage)
func("Neha", 10)
```

a) Neha 10 b) Neha 30 c) Error d) None

xvii) Modes of Python interpreters are -
a) Interactive b) Script c) Both d) None

xviii) What is the output of the following code?

```python
import datetime
datetime = datetime.date(2022, 12, 18)
print(datetime)
```

a) Error b) 2022-18-12 c) 2022-12-18 d) 18-12-2022

xix) What will be the output of the following Python code?

```python
print(all([10, 8, 6, 4, 0]))
```

a) True b) False c) None d) Error

xx) To return the length of string str1 what command do we execute?
a) str1.len() b) len(str1) c) Both are correct d) None of them

xxi) The elements of a list are [10, 3, 5, 1, 7, 8]. Which of the following gives the correct outputs?
A. list_name.sort() print(list_name)
B. print(max(list_name))
C. list_name.reverse() print(list_name)
D. print(list_name[-1])
a) A,B b) A,C c) B,D d) C,D

xxii) Write down the output of the following code:

```python
s = 'a,b,c,d,'
print(s[1::2])
```

a) a b) bd c) bed d) b

xxiii) Which of the following is not a part of function definition?
a) function name b) parameter list c) return value d) both a and b

xxiv) All keywords in python are in -
a) Lowercase b) Uppercase c) Capitalized d) None of the above

GROUP-B (Answer any Five)

2. a) Define python. Explain the features of python programming. (2 + 3)
b) Discuss the difference between local and global variable. (3)

3. a) Explain the use of join() and split() string methods with examples. (4)
b) What is Mutable and Immutable data type in python? (2)
c) Describe why strings are immutable with an example. (2)

4. a) Explain break and continue statement with the help of for loop with an example. (4)
b) Write a python program to check whether a number is prime or not. (4)

5. a) What is dictionary? Explain the methods available in dictionary. (2 + 2)
b) Differentiate between the tuple and list in python. (4)

6. a) State the purpose of using return statement with example in python function. (4)
b) What do you mean by required and default argument which can be passed at the time of function call? (2 + 2)

7. a) Explain different types of operators with example of each. (4)
b) Write down the example of importing a module in python. (4)

8. a) What do you mean module and package? (4)
b) Explain the arbitrary arguments associated with function with example. (4)
c) Write down the code to print current date and time. (2)

9. a) Describe the different access modes of the files with an example. (4)
b) Discuss the following methods associated with the file object: i) read() ii) write() (4)

10. a) What do you mean MVC framework? Explain each term. (3)
b) Write down the steps of creating Django project and run it. (5)

---

📊 YEAR-WISE SUMMARY – SCRIPTING LANGUAGES (PYTHON)

Year Paper Code Month
2024 307/2(N) December
2024 307/2(N) January
2023 307/2(N) March
2022 307/2(N) June
2023 2235 March

---

🎯 COMPLETE SUMMARY – ALL 5 SUBJECTS

Subject Papers Years Covered
C Programming (CST201) 5 2021, 2022, 2023, 2024
Data Structures (CST205) 5 2021, 2022, 2023, 2024
COA (CST207) 5 2021, 2022, 2023, 2024
Algorithms (CST209) 5 2022, 2023, 2024
Python (CST203) 5 2022, 2023, 2024
TOTAL 25 Papers 