COMPUTER ORGANIZATION & ARCHITECTURE (CST207) – 5 Papers

---

📄 PAPER 1: 307/4(N) - DECEMBER 2024

GROUP-A (MCQ - Any ten with explanation)

i) The instruction, MOV AX, [2500H] is an example of -
a) immediate addressing mode b) direct addressing mode c) indirect addressing mode d) register addressing mode

ii) In a virtual memory system, which of the following can improve the efficiency of address translation?
a) Larger page size b) Smaller page size c) Use of Translation Lookaside Buffer (TLB) d) Increased RAM size

iii) Develop a simple assembly language program to add two numbers stored in registers AX and BX, and store the result in CX. Which of the following best represents the steps?
a) MOV AX,BX ADD CX,AX b) MOV CX,AX ADD CX,BX c) MOV AX,CX ADD AX,BX d) MOV BX,CX ADD AX,CX

iv) Which of the following is a challenge that arises in a RISC pipeline architecture?
a) Hazard detection and resolution b) Fetching multiple instructions per cycle c) Reducing the instruction set d) Supporting a large instruction set

v) If a floating-point number uses 8 bits for the exponent and 23 bits for the mantissa, what is the precision limit for numbers represented by this format?
a) Approximately 16 decimal digits b) Approximately 6-7 decimal digits c) Approximately 12 decimal digits d) Approximately 3-4 decimal digits

vi) What is the hit ratio in cache memory?
a) Ratio of cache size to main memory size b) Number of cache hits divided by total memory accesses c) Ratio of cache misses to total memory accesses d) Ratio of cache speed to main memory speed

vii) In Intel 8086, which addressing mode uses the combination of a register and a displacement value?
a) Immediate Addressing b) Direct Addressing c) Register Indirect Addressing d) Base-Indexed Addressing

viii) What is the main characteristic of the Von-Neumann architecture?
a) Separate memory for data and instructions b) Shared memory for data and instructions c) No memory hierarchy d) Direct connection between CPU and memory

ix) Which of the following is responsible for address sequencing in a microprogrammed control unit?
a) Instruction Register b) Control Memory c) Arithmetic Logic Unit d) Program Counter

x) What is the word size of the Intel 8086 microprocessor?
a) 8-bit b) 16-bit c) 32-bit d) 64-bit

xi) In a pipeline architecture, which stage comes immediately after Instruction Fetch?
a) Decode b) Execute c) Memory Access d) Write Back

xii) What is the function of cache memory in a computer system?
a) To store the operating system b) To store frequently accessed data c) To increase the size of RAM d) To serve as backup storage

xiii) Which of the following micro-operations can combine two binary values?
a) Arithmetic micro-operation b) Shift micro-operation c) Logic micro-operation d) Memory transfer

xiv) Which of the following is NOT a valid step in Booth's multiplication algorithm?
a) Add multiplicand b) Shift right c) Invert the result d) Subtract multiplicand

GROUP-B (Answer any Five)

2. Explain Von Neumann architecture. Discuss the various types of Addressing Modes of Intel 8086. (4 + 4)

3. Explain Restoring Division Algorithm for Unsigned Integer. Multiply the (-9) with (-13) using Booth's algorithm. (4 + 4)

4. Explain 8086 internal architecture. Explain different types of interrupts. (5 + 3)

5. Calculate the number of page faults for the following reference string with frame size as 3 by using a) LRU and FIFO page replacement algorithm.
5, 0, 2, 1, 0, 3, 0, 2, 4, 3, 0, 3, 2, 1, 3, 0, 1, 5 (4 + 4)

6. Compare between direct mapped, set associative and associative cache. Differentiate between write through and write back cache. (5 + 3)

7. Differentiate between fixed point and floating-point representation. Represent -75 as 8-bit 2's complement number. What is Direct Memory Access (DMA)? (3 + 2 + 3)

8. Explain Pipelining. Discuss different kinds of hazard occurs in pipelining. (3 + 5)

9. Short Note (any two): a) Vector Processor b) RISC Pipeline c) Cache hit and cache miss (4 + 4)

---

📄 PAPER 2: 307/4(N) - JANUARY 2024

GROUP-A (MCQ - Any ten with explanation)

i) Von Neumann architecture is based on -
a) SISD b) SIMD c) MISD d) MIMD

ii) Example for zero address instructions is -
a) push b) load A c) move R1, A d) store x

iii) What is the full form of TLB?
a) Translation Loop Buffer b) Translation Look-aside Buffer c) Time Loop Block d) None

iv) What is Page Map Table?
a) It maps the virtual addresses to physical addresses b) It maps physical addresses to virtual addresses c) It maps the virtual addresses to Logical addresses d) Support all the above

v) The result of MOV AL, 65 is to store -
a) 0100 0010 in AL b) 42H in AL c) 40H in AL d) 0100 0001 in AL

vi) Which of the following is page fault?
a) Page fault occurs when a program accesses a page of another program b) Page fault occurs when a program accesses a page in main memory c) Page fault occurs when there is an error in particular page d) Page fault occurs when a program accesses a page which is not present in main memory

vii) Which of the following are the two main components of the CPU?
a) CU and registers b) Registers and main memory c) CU and ALU d) Registers and ALU

viii) The term that provides simultaneous data processing tasks are -
a) parallel processing b) array processing c) vector processing d) distributed processing

ix) A 16 × 8 Organisation of memory cells, can store upto -
a) 256 bits b) 1024 bits c) 512 bits d) 128 bits

x) A processor can access a memory location by 32 bits. Then find the total memory size if all memory locations are available to the processor.
a) 4 GB b) 4 Gb c) 2 GB d) 4 MB

xi) Data transfer from Cache Memory to Processor is -
a) Word by Word b) Block by Block c) Block by Word d) Word by Block

xii) In which of the following term the performance of cache memory is measured?
a) Chart ratio b) Hit ratio c) Cache ratio d) Data ratio

xiii) Which of these is NOT involved in the case of a memory write operation?
a) Data bus b) MDR c) MAR d) PC

xiv) Which of the following memory unit communicates directly with the CPU?
a) Auxiliary memory b) Main memory c) Secondary memory d) None of the above

xv) A computer system supports 2⁴⁶ logical addresses and 2¹¹ addresses per page. How many pages can be represented in secondary memory (virtual memory address space)?
a) 35 b) 2³⁵ c) 2²⁵ d) 2⁵⁷

GROUP-B (Answer any Five)

2. a) Draw the Von Neumann basic structure and mark all its components. (4)
b) Draw and explain the BUS architecture of a digital computer. (4)

3. a) Explain the basic instructions cycle with appropriate diagram. (4)
b) Write the Zero address instructions to evaluate the arithmetic statement X = (A + B) * (C + D). (4)

4. a) Write the difference between Minimum Mode and Maximum Mode in 8086 Microprocessor. (4)
b) Explain with example any four addressing modes available in 8086 microprocessors. (4)

5. a) Write the different cache mapping techniques and explain it. (4)
b) A typical computer system cache memory access time is 8 ns and its main memory access time is 80 ns. If hit ratio is 90%, what is the average memory access time? (4)

6. a) Write the difference between CISC & RISC Architecture. (4)
b) Write short notes on any one: i) DMA ii) Virtual Memory (4)

7. a) What is biased exponent of floating-point number? (2)
b) Discuss in detail the architecture of 8086 microprocessor along with pin configuration diagram. (6)

8. a) Explain the different groups of computers according to Flynn's classification. (4)
b) Write down the IEEE-754 format for single and double precision numbers. (4)

9. a) Describe the concept of Pipeline and its types. (4)
b) Write the different types of pipeline hazards. (4)

---

📄 PAPER 3: 307/4(N) - JUNE 2022

GROUP-A (MCQ - Any ten)

i) The number successful accesses to memory stated as a fraction is called as -
a) Access rate b) Success rate c) Hit rate d) Miss rate

ii) The final addition sum of the numbers, 0110 & 0110 is -
a) 1101 b) 1111 c) 1001 d) 1010

iii) What does CSA stand for?
a) Computer Service Architecture b) Computer Speed Addition c) Carry Save Addition d) None of these

iv) Individual control word of the micro routine are called as -
a) Micro task b) Micro instruction c) Micro operation d) Micro Command

v) Which of the following circuit convert the binary data into a decimal?
a) Decoder b) Encoder c) Code converter d) Multiplexer

vi) The situation wherein the data of operands are not available is called -
a) Data hazard b) Stock c) Deadlock d) Structural hazard

vii) What is the full form of CISC?
a) Complex Instruction Sequential Compilation b) Complete Instruction Sequential Compilation c) Computer Integrated Sequential Compiler d) Complex Instruction Set Computer

viii) The alternate way of writing the instruction, ADD #5, R1 is -
a) ADD [5],[R1]; b) ADDI 5,R1; c) ADDIME 5,[R1]; d) There is no other way

ix) In order to read multiple bytes of a row at the same time, we make use of -
a) Memory extension b) Cache c) Shift register d) Latch

x) In full adders the sum circuit is implemented using -
a) And & or gates b) NAND gate c) XOR d) XNOR

xi) Computer address bus is -
a) Unidirectional b) Bidirectional c) Multidirectional d) None of the above

xii) Which of the following computer bus connects the CPU to a memory on the system board?
a) Expansion bus b) Width bus c) System bus d) None of the above

xiii) The instructions that are used for reading an input port and writing an output port respectively are -
a) MOV, XCHG b) MOV, IN c) IN, MOV d) IN, OUT

xiv) Micro operation is shown as -
a) R1 ← R2 b) R1 + R2 c) Both d) None

GROUP-B (Fill in the blanks - Any ten)

i) ________ is used to store data, instructions and results permanently for future use.

ii) ________ is generally used to increase the apparent size of physical memory.

iii) Gray Code is also called as ________.

iv) Instruction register stores ________.

v) A high speed memory is placed between the CPU and the primary memory is known as ________.

vi) I/O address in 8086 is ________ bit.

vii) Techniques that automatically move programs and data blocks into the physical memory when they are required for execution are called ________.

viii) Hit ratio is maximum in ________ mapping.

ix) The bias value for single-precision floating point numbers is ________.

x) MOV AX, [2A50] is an example of ________ addressing mode.

xi) Loop unrolling is a technique to improve ________.

xii) Page table resides in ________.

xiii) Microinstruction consists of ________.

xiv) The smallest entity of memory is called ________.

xv) A source program is usually in ________ language.

GROUP-C (Answer any ten)

i) How control unit controls other units?

ii) Give an example of a 4 bit, 8bit, 16-bit, and 32 bit microprocessor.

iii) What is Bus?

iv) What is MAR and MDR?

v) What is register?

vi) What is interrupt?

vii) What is non-volatile memory?

viii) What is logical address?

ix) Which is an error-detecting code?

x) What is the logic shift?

xi) What type of device converts digital signal into a form that is intelligible to the user?

xii) Which memory stores instruction which is required to start a computer?

xiii) Define clock rate.

xiv) What is the RAID system?

GROUP-D (Answer any six)

i) What are the three main elements of the control unit?

ii) What is Cache memory?

iii) What is control memory address?

iv) What is the 2's complement representation of -6?

v) What is clock signal in COA?

vi) Is USB a bus?

vii) Draw the block diagram of the half adder.

viii) Draw a multiplication circuit diagram.

ix) What's the difference between interrupt service routine and subroutine?

x) What do you mean by the write-back policy?

xi) What is RISC Pipeline?

xii) What size of MUXs are needed?

GROUP-E (Answer any one)

5. a) Explain the components of the Computer system and what is micro operation?

b) Represent (12.625)₁₀ in 32 bit floating point representation and what is odd parity checker?

c) Describe the Von-Neumann Architecture with diagram? Explain the Bus Structure with examples.

6. a) Describe the Flag Register of 8086 microprocessor.

b) Perform multiplication between 23 and 17 using fixed point multiplication algorithm.

c) What are the key characteristics of micro-programmed control? Explain different types of micro operation.

7. a) Discuss the various mapping techniques used in cache memory.

b) What is virtual memory? How does it work?

c) How can you interface RAM and the ROM EPROM to microprocessor 8086? What is the use of EPROM?

---

📄 PAPER 4: 337(S) - MARCH 2021

SECTION A (Compulsory)

1. A. Choose the correct answer from the given alternatives (any ten)

i) The instruction 1111 111100001100 is a -
(a) direct memory reference instruction (b) indirect memory reference instruction (c) register reference instruction (d) input output instruction

ii) 01110000 represents -
(a) 0 (b) NaN (c) +∞ (d) -∞

iii) The largest floating point number that can be represented by 8 bit is -
(a) 01111111 (b) 11111111 (c) 01101111 (d) 01111110

iv) If n is number of bits in exponent, the bias number can be calculated as -
(a) 2ⁿ⁻¹ (b) 2ⁿ (c) 2ⁿ⁻¹ (d) 2ⁿ⁻¹ - 1

v) In Booth's algorithm, if the multiplier has n bits then the multiplicand should have -
(a) 1 bit (b) n bits (c) n+1 bits (d) 2n bits

vi) k-way set associative means -
(a) k blocks are present in a set (b) k sets are present in a block (c) k sets are present in the cache (d) none of these

vii) The three main components of a digital computer system are -
(a) Memory, IO, DMA (b) ALU, CPU, Memory (c) CU, ALU, Register (d) CPU, Memory, IO

viii) The second generation of computer used -
(a) transistors (b) IC (c) vacuum tube (d) LSI

ix) Processors of all computers, whether micro, mini or mainframe must have -
(a) ALU (b) Primary storage (c) Control Unit (d) all of these

x) In which addressing mode is operand specified in the instruction itself?
(a) Register mode (b) Immediate mode (c) Direct Address mode (d) Index Addressing mode

xi) The instruction LOAD is a -
(a) zero-address instruction (b) one-address instruction (c) two-address instruction (d) three-address instruction

xii) The number of fetch operation to execute instruction in immediate mode is -
(a) 0 (b) 1 (c) 2 (d) none of these

1. B. Answer the following questions (any five)

i) What is Program Counter?

ii) What is IO processor?

iii) Write full form of RISC and CISC.

iv) What is a super computer?

v) How does a computer differ from a calculator?

vi) What is bus?

vii) What do you mean by Effective Address?

SECTION B (Answer any five)

2. Write short notes on the followings (any two):
a) IO processor b) Vector Processing c) Memory Interleaving d) Loop Buffer (5 + 5)

3. a) Explain different types of mapping technique used in cache memory. (6)
b) Differentiate virtual memory and cache memory. (4)

4. What do you mean by pipeline hazards/conflicts? Discuss the different types of hazards being observed and also explain the possible solutions. (2 + 8)

5. a) What are the major characteristics of RISC architecture? (5)
b) What do you mean by speedup ratio? What are the reasons for which theoretical maximum speedup cannot be obtained in reality? (2 + 3)

6. a) Differentiate programmed IO and Interrupt briefly. (4)
b) Describe DMA mode of data transfer in details with suitable diagram. (6)

7. Describe the following addressing modes with suitable example.
i) Register addressing mode ii) Indirect addressing mode iii) Indexed addressing mode iv) Base addressing mode v) Immediate addressing mode (5 × 2)

8. a) Describe Booth's algorithm with suitable block diagram and flowchart. (6)
b) Show the steps of multiplication performed by using Booth's algorithm of 7 × -5. (4)

9. a) Explain the difference between Hardwired Control and Microprogrammed control. (5)
b) What do you mean by horizontal and vertical microprogramming? Compare these two ways of microprogramming. (5)

---

📄 PAPER 5: 2235 - MARCH 2023 (from Merged File)

SECTION A (MCQ - Any twenty)

i) Which of the following are the components of Von-Neumann architecture?
(a) Busses, memory and input/output component (b) Hard disks, floppy disks and CPU (c) Memory, CPU and Printer (d) Memory, input/output modules and CPU

ii) Which of the following computer memory is fastest?
a) register b) Hard disk c) RAM d) None of the above

iii) In the parity generator which logic operator is used to generate the parity bit?
(a) OR (b) AND (c) NOT (d) XOR

iv) Which of the following is not a characteristic of RISC?
(a) One instruction per cycle (b) Large instruction set (c) Simple addressing modes (d) Register-to-register operations

v) What is computer organization?
a) structure and behavior of a computer system as observed by the user b) structure of a computer system as observed by the developer c) structure and behavior of a computer system as observed by the developer d) All of the mentioned

vi) The content of a 8 bit register is initially 10011100, what is the content of the register after an arithmetic shift-right operation?
(a) 11001110 (b) 01001110 (c) 11001111 (d) 11001101

vii) The performance of cache memory is frequently measured in terms of -
a) main memory b) hit ratio c) CPU cycle d) Bus speed

viii) ________ are the major reasons for moving to RISC.
a) Time delay b) Semantic gap c) Cost d) All of the mentioned

ix) Which are the different type/s of generating control signals?
a) Hardwired b) Micro-instruction c) Micro-programmed d) Both Micro-programmed and Hardwired

x) The small extremely fast, RAM's are called as -
a) Heaps b) Accumulators c) Stacks d) Cache

xi) MAR stands for -
a) Memory Access Register b) Memory Address Register c) Memory Access Reference d) Memory Address Reference

xii) In order to read multiple bytes of a row at the same time, we make use of -
a) Memory extension b) Cache c) Shift register d) Latch

xiii) Cache memory uses -
(a) SRAM (b) DRAM (c) EEPROM (d) EPROM

xiv) Computer address bus is -
a) Multidirectional b) Bidirectional c) Unidirectional d) None of the above

xv) The address in the main memory is known as -
a) Logical address b) Physical address c) Virtual address d) None of the above

xvi) Full form of RISC is -
a) Reduced instruction set computer b) Reduction instruction set computer c) Reduced instructor set computer d) none of these

xvii) Which of the following statement(s) is(are) true?
a) ROM is a read/write memory b) PC points to the next instruction to be executed

xviii) DMA stands for -
a) Direct memory adder b) Direct memory address c) Direct memory access d) none of these

xix) What is the full form of MBR?
a) memory buffer register b) memory boot register c) memory buffer reduction d) none of these

xx) IEEE double precision format is -
a) 30 bits b) 32 bits c) 60 bits d) 64 bits

xxi) Full form of PC is -
a) progress counter b) program count c) program counter d) none of these

xxii) Theoretically maximum speedup that a pipeline can provide depends on the -
a) number of segments on the pipeline b) number of Instructions c) number of address bus d) none of these

xxiii) Which memory is difficult to interface with processor?
a) Dynamic memory b) Static memory c) both a & b d) none of these

xxiv) An example of direct addressing mode is -
a) MOV C, B b) LDA 2021H c) both a & b d) none of these

xxv) Which mode of DMA is fastest?
a) burst mode b) cycle stealing c) both a & b d) None of these

SECTION B (Answer any five)

2. a) Draw the Von Neumann basic structure and mark all its components. (4)
b) Write down the IEEE format for single and double precision numbers. (4)

3. a) Write the restoring division process with flowchart and example. (5)
b) Explain the function of BIU & EU. (3)

4. a) What do you mean by hit and miss ratio? (4)
b) A typical computer system cache memory access time is 8 ns and its main memory access time is 65 ns. If hit ratio is 90%, what is the average memory access time? (4)

5. a) What do you mean by cache memory mapping? (2)
b) Write down the direct cache memory mapping technique and what is its main disadvantage. (6)

6. a) Write the differences between RISC and CISC architecture. (2)
b) Discuss different types of addressing modes with examples. (6)

7. a) Write the different pipeline hazards. (3)
b) Explain the different groups of computers according to Flynn's classification. (5)

8. a) Draw the pin diagram of 8086 microprocessor. (5)
b) Explain maximum and minimum mode of 8086 microprocessor. (3)

9. Write short notes on any two: (a) TLB (b) DMA (c) Virtual Memory (4 + 4)

10. a) What do you mean by micro operation? (2)
b) Explain the functioning procedure of micro-programmed control unit. (6)

---

📊 YEAR-WISE SUMMARY – COMPUTER ORGANIZATION & ARCHITECTURE

Year Paper Code Month
2024 307/4(N) December
2024 307/4(N) January
2022 307/4(N) June
2021 337(S) March
2023 2235 March

---