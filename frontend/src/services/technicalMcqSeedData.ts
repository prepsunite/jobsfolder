import type { TechnicalMcq } from '@/types/technical';

export const C_PROGRAMMING_MCQ_SEED: TechnicalMcq[] = [
  {
    "id": "mcq-c-1",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "question": "What will be the output of the following C program?",
    "codeSnippet": "#include <stdio.h>\n\nint main() {\n    int arr[] = {10, 20, 30, 40};\n    int *p = arr;\n    \n    printf(\"%d, \", *p++);\n    printf(\"%d, \", (*p)++);\n    printf(\"%d, \", *p);\n    printf(\"%d\", arr[1]);\n    return 0;\n}",
    "code_snippet": "#include <stdio.h>\n\nint main() {\n    int arr[] = {10, 20, 30, 40};\n    int *p = arr;\n    \n    printf(\"%d, \", *p++);\n    printf(\"%d, \", (*p)++);\n    printf(\"%d, \", *p);\n    printf(\"%d\", arr[1]);\n    return 0;\n}",
    "options": [
      "10, 20, 21, 21",
      "10, 21, 21, 20",
      "11, 20, 20, 21",
      "10, 20, 30, 20"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "1. *p++: The postfix ++ operator has higher precedence than the dereference (*) operator. It yields the current pointer address p, dereferences it to print 10, and then increments p so it now points to arr[1].\n2. (*p)++: Parentheses force dereferencing first. The value at p (which is arr[1] = 20) is evaluated for printing, and then the integer in memory at arr[1] is incremented from 20 to 21.\n3. *p: Evaluates the current value at p, which is now 21.\n4. arr[1]: Since p was pointing to arr[1], its updated value is 21.\nOutput is: 10, 20, 21, 21.",
    "companyTags": [
      "TCS Digital",
      "Cognizant GenC Next",
      "Infosys"
    ],
    "company_tags": [
      "TCS Digital",
      "Cognizant GenC Next",
      "Infosys"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 1,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-2",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "question": "What will be the output of the following C code regarding integer promotion and comparison?",
    "codeSnippet": "#include <stdio.h>\n\nint main() {\n    signed int a = -1;\n    unsigned int b = 1;\n    \n    if (a < b) {\n        printf(\"LESS\");\n    } else {\n        printf(\"GREATER\");\n    }\n    return 0;\n}",
    "code_snippet": "#include <stdio.h>\n\nint main() {\n    signed int a = -1;\n    unsigned int b = 1;\n    \n    if (a < b) {\n        printf(\"LESS\");\n    } else {\n        printf(\"GREATER\");\n    }\n    return 0;\n}",
    "options": [
      "LESS",
      "GREATER",
      "Compilation Error: Cannot compare signed with unsigned",
      "Undefined Behavior"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "In C (ISO C99/C11 §6.3.1.8 - Usual Arithmetic Conversions), when a binary operator operates on a signed int and an unsigned int of the same integer conversion rank, the signed operand is converted to unsigned int.\nConverting -1 to unsigned int wraps around modulo 2^32, yielding UINT_MAX (4,294,967,295 on 32/64-bit systems).\nSince 4294967295 < 1 evaluates to false, the else branch executes and prints \"GREATER\".",
    "companyTags": [
      "Accenture Advanced",
      "Wipro Turbo",
      "TCS Prime"
    ],
    "company_tags": [
      "Accenture Advanced",
      "Wipro Turbo",
      "TCS Prime"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 2,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-3",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "question": "What will be the printed output of this preprocessor macro evaluation?",
    "codeSnippet": "#include <stdio.h>\n\n#define SQUARE(x) x * x\n\nint main() {\n    int result = SQUARE(3 + 2);\n    printf(\"%d\", result);\n    return 0;\n}",
    "code_snippet": "#include <stdio.h>\n\n#define SQUARE(x) x * x\n\nint main() {\n    int result = SQUARE(3 + 2);\n    printf(\"%d\", result);\n    return 0;\n}",
    "options": [
      "25",
      "11",
      "15",
      "13"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "C preprocessor macros perform direct textual substitution without algebraic evaluation.\nSQUARE(3 + 2) expands directly to:\n3 + 2 * 3 + 2\nBy operator precedence, multiplication (*) takes precedence over addition (+):\n= 3 + (2 * 3) + 2\n= 3 + 6 + 2\n= 11.\nTo get 25, parentheses must encapsulate the macro argument: #define SQUARE(x) ((x) * (x)).",
    "companyTags": [
      "TCS",
      "Capgemini",
      "Infosys"
    ],
    "company_tags": [
      "TCS",
      "Capgemini",
      "Infosys"
    ],
    "difficulty": "BASIC",
    "sort_order": 3,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-4",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "question": "Assuming a standard 64-bit architecture with 4-byte int alignment, what is the output of sizeof(struct Packet)?",
    "codeSnippet": "#include <stdio.h>\n\nstruct Packet {\n    char id;\n    int code;\n    char flag;\n};\n\nint main() {\n    printf(\"%zu\", sizeof(struct Packet));\n    return 0;\n}",
    "code_snippet": "#include <stdio.h>\n\nstruct Packet {\n    char id;\n    int code;\n    char flag;\n};\n\nint main() {\n    printf(\"%zu\", sizeof(struct Packet));\n    return 0;\n}",
    "options": [
      "6",
      "8",
      "12",
      "16"
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "Structure alignment rules dictate memory layout:\n1. char id takes 1 byte at offset 0.\n2. Next member int code requires 4-byte boundary alignment, so 3 padding bytes are inserted at offsets 1, 2, 3. code occupies offsets 4, 5, 6, 7.\n3. char flag takes 1 byte at offset 8.\n4. The total size of the structure must be a multiple of the largest member's alignment (4 bytes for int). Therefore, 3 tail padding bytes are added at offsets 9, 10, 11.\nTotal structure size = 1 + 3 + 4 + 1 + 3 = 12 bytes.",
    "companyTags": [
      "Qualcomm",
      "Zoho",
      "Cognizant"
    ],
    "company_tags": [
      "Qualcomm",
      "Zoho",
      "Cognizant"
    ],
    "difficulty": "HARD",
    "sort_order": 4,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-5",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "question": "What occurs during execution of the following C program?",
    "codeSnippet": "#include <stdio.h>\n\nint main() {\n    char *s1 = \"Hello\";\n    char s2[] = \"World\";\n    \n    s2[0] = 'w';\n    s1[0] = 'h';\n    \n    printf(\"%s %s\", s1, s2);\n    return 0;\n}",
    "code_snippet": "#include <stdio.h>\n\nint main() {\n    char *s1 = \"Hello\";\n    char s2[] = \"World\";\n    \n    s2[0] = 'w';\n    s1[0] = 'h';\n    \n    printf(\"%s %s\", s1, s2);\n    return 0;\n}",
    "options": [
      "Prints: hello world",
      "Runtime error / Segmentation fault at s1[0] = 'h'",
      "Compile-time error: invalid assignment",
      "Prints: Hello world"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "char s2[] = \"World\"; creates an array allocated in writeable stack memory, so mutating s2[0] is completely valid.\nHowever, char *s1 = \"Hello\"; creates a pointer to a string literal stored in the read-only data segment (.rodata).\nAttempting to modify read-only memory via s1[0] = 'h' invokes Undefined Behavior, which crashes with a Segmentation Fault (SIGSEGV) on modern OSes.",
    "companyTags": [
      "Infosys SP",
      "Zoho",
      "TCS Prime"
    ],
    "company_tags": [
      "Infosys SP",
      "Zoho",
      "TCS Prime"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 5,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-6",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "question": "What will be the output of the following pointer arithmetic program?",
    "codeSnippet": "#include <stdio.h>\n\nint main() {\n    int arr[5] = {1, 2, 3, 4, 5};\n    int *p1 = (int *)(&arr + 1);\n    \n    printf(\"%d\", *(p1 - 1));\n    return 0;\n}",
    "code_snippet": "#include <stdio.h>\n\nint main() {\n    int arr[5] = {1, 2, 3, 4, 5};\n    int *p1 = (int *)(&arr + 1);\n    \n    printf(\"%d\", *(p1 - 1));\n    return 0;\n}",
    "options": [
      "1",
      "5",
      "Garbage value",
      "Compilation error"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "arr decays to int*, pointing to the first element arr[0].\nIn contrast, &arr has type int (*)[5] (pointer to an entire array of 5 integers).\nTherefore, (&arr + 1) advances the pointer by the complete size of the array: 5 * sizeof(int) = 20 bytes.\nCasting this back to int* yields p1 pointing immediately past the last element arr[4].\nConsequently, (p1 - 1) steps back by 1 int (4 bytes) to point directly at arr[4].\nDereferencing *(p1 - 1) gives 5.",
    "companyTags": [
      "Cognizant GenC Next",
      "TCS Prime",
      "Accenture"
    ],
    "company_tags": [
      "Cognizant GenC Next",
      "TCS Prime",
      "Accenture"
    ],
    "difficulty": "HARD",
    "sort_order": 6,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-7",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "question": "What is the output of the following C code snippet utilizing inverted array indexing syntax?",
    "codeSnippet": "#include <stdio.h>\n\nint main() {\n    int arr[] = {100, 200, 300, 400};\n    printf(\"%d\", 2[arr]);\n    return 0;\n}",
    "code_snippet": "#include <stdio.h>\n\nint main() {\n    int arr[] = {100, 200, 300, 400};\n    printf(\"%d\", 2[arr]);\n    return 0;\n}",
    "options": [
      "Compilation Error: Invalid array subscript syntax",
      "300",
      "200",
      "Garbage value"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "In the C standard (ISO/IEC 9899 §6.5.2.1), array indexing E1[E2] is strictly defined as (*((E1) + (E2))).\nBecause pointer addition is commutative:\narr[2] == *(arr + 2) == *(2 + arr) == 2[arr].\nTherefore, 2[arr] is 100% valid C syntax and accesses the element at index 2, which is 300.",
    "companyTags": [
      "Wipro",
      "TCS",
      "Capgemini"
    ],
    "company_tags": [
      "Wipro",
      "TCS",
      "Capgemini"
    ],
    "difficulty": "BASIC",
    "sort_order": 7,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-8",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "question": "What will be printed when the following program executes?",
    "codeSnippet": "#include <stdio.h>\n\nvoid counter() {\n    static int count = 5;\n    printf(\"%d \", count--);\n}\n\nint main() {\n    for (int i = 0; i < 3; i++) {\n        counter();\n    }\n    return 0;\n}",
    "code_snippet": "#include <stdio.h>\n\nvoid counter() {\n    static int count = 5;\n    printf(\"%d \", count--);\n}\n\nint main() {\n    for (int i = 0; i < 3; i++) {\n        counter();\n    }\n    return 0;\n}",
    "options": [
      "5 5 5 ",
      "5 4 3 ",
      "4 3 2 ",
      "5 4 3 2 1 "
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "A static local variable in C is initialized only once during program startup (in the data segment), and retains its value between function calls across the entire program lifetime.\nIteration 0: prints 5, decrements count to 4.\nIteration 1: prints 4, decrements count to 3.\nIteration 2: prints 3, decrements count to 2.\nOutput: \"5 4 3 \".",
    "companyTags": [
      "TCS Digital",
      "Infosys",
      "Cognizant"
    ],
    "company_tags": [
      "TCS Digital",
      "Infosys",
      "Cognizant"
    ],
    "difficulty": "BASIC",
    "sort_order": 8,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-9",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "question": "What is the output after executing this statement with logical operators?",
    "codeSnippet": "#include <stdio.h>\n\nint main() {\n    int a = 0, b = 5, c = 10;\n    int res = a++ && ++b || ++c;\n    \n    printf(\"a=%d, b=%d, c=%d, res=%d\", a, b, c, res);\n    return 0;\n}",
    "code_snippet": "#include <stdio.h>\n\nint main() {\n    int a = 0, b = 5, c = 10;\n    int res = a++ && ++b || ++c;\n    \n    printf(\"a=%d, b=%d, c=%d, res=%d\", a, b, c, res);\n    return 0;\n}",
    "options": [
      "a=1, b=6, c=11, res=1",
      "a=1, b=5, c=11, res=1",
      "a=1, b=5, c=10, res=1",
      "a=0, b=5, c=11, res=0"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Operator precedence groups the expression as: ((a++ && ++b) || ++c).\n1. a++ evaluates to 0 (false), while post-incrementing a to 1.\n2. Because the left operand of logical AND (&&) is 0, short-circuit evaluation kicks in: ++b is SKIPPED. b remains 5.\n3. The left side of || is now 0 (false). Because the left side is false, the right side (++c) MUST be evaluated.\n4. ++c increments c from 10 to 11 and yields 11 (true).\n5. (0 || 11) yields 1.\nResult: a=1, b=5, c=11, res=1.",
    "companyTags": [
      "Accenture Advanced",
      "TCS Prime",
      "Infosys"
    ],
    "company_tags": [
      "Accenture Advanced",
      "TCS Prime",
      "Infosys"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 9,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-10",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "question": "On a 64-bit system, what will be printed by the following code?",
    "codeSnippet": "#include <stdio.h>\n\nvoid printSize(int arr[10]) {\n    printf(\"%zu \", sizeof(arr));\n}\n\nint main() {\n    int arr[10];\n    printf(\"%zu \", sizeof(arr));\n    printSize(arr);\n    return 0;\n}",
    "code_snippet": "#include <stdio.h>\n\nvoid printSize(int arr[10]) {\n    printf(\"%zu \", sizeof(arr));\n}\n\nint main() {\n    int arr[10];\n    printf(\"%zu \", sizeof(arr));\n    printSize(arr);\n    return 0;\n}",
    "options": [
      "40 40",
      "40 8",
      "10 10",
      "8 8"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "1. In main, arr is an array of 10 integers. sizeof(arr) evaluates to 10 * sizeof(int) = 10 * 4 = 40 bytes.\n2. When an array is passed as a function argument in C, it automatically decays into a pointer to its first element (int arr[10] is rewritten by compiler as int *arr).\n3. Inside printSize, sizeof(arr) measures the size of a pointer variable (int*), which is 8 bytes on a 64-bit architecture.\nOutput is \"40 8\".",
    "companyTags": [
      "Zoho",
      "Cognizant",
      "Qualcomm"
    ],
    "company_tags": [
      "Zoho",
      "Cognizant",
      "Qualcomm"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 10,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-11",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "question": "For any positive integer n, what condition does (n & (n - 1)) == 0 test?",
    "codeSnippet": "#include <stdio.h>\n\nint check(int n) {\n    return (n > 0) && ((n & (n - 1)) == 0);\n}",
    "code_snippet": "#include <stdio.h>\n\nint check(int n) {\n    return (n > 0) && ((n & (n - 1)) == 0);\n}",
    "options": [
      "Whether n is an odd number",
      "Whether n is a power of 2",
      "Whether n is divisible by 4",
      "Whether all bits in n are set to 1"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Powers of 2 in binary have exactly one bit set to 1 (e.g. 2 = 0010, 4 = 0100, 8 = 1000).\nSubtracting 1 flips this set bit to 0 and all lower bits to 1 (e.g. 8 - 1 = 7 = 0111).\nPerforming bitwise AND: (n & (n - 1)) clears the lowest set bit.\nIf n is a power of 2, clearing that single bit yields 0. For any other number, remaining higher bits keep the result > 0.\nThus, for n > 0, (n & (n - 1)) == 0 tests if n is a power of 2.",
    "companyTags": [
      "Amazon",
      "TCS Prime",
      "Accenture"
    ],
    "company_tags": [
      "Amazon",
      "TCS Prime",
      "Accenture"
    ],
    "difficulty": "BASIC",
    "sort_order": 11,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-12",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "question": "What is a dangling pointer in C, as illustrated by the snippet below?",
    "codeSnippet": "#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int *ptr = (int *)malloc(sizeof(int));\n    *ptr = 42;\n    free(ptr);\n    // Line X: ptr is still holding the deallocated address\n    return 0;\n}",
    "code_snippet": "#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int *ptr = (int *)malloc(sizeof(int));\n    *ptr = 42;\n    free(ptr);\n    // Line X: ptr is still holding the deallocated address\n    return 0;\n}",
    "options": [
      "A pointer that has never been initialized to any address",
      "A pointer that still points to a memory location that has already been deallocated",
      "A pointer cast to void*",
      "A pointer pointing to a constant string literal"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "When free(ptr) is called, the memory block is released back to the heap manager, but the pointer variable ptr itself is not reset.\nIt still stores the memory address of the now-deallocated block. This is called a dangling pointer.\nDereferencing or reading from a dangling pointer results in undefined behavior. The standard fix is to set ptr = NULL immediately after free(ptr).",
    "companyTags": [
      "Infosys",
      "Wipro Turbo",
      "TCS"
    ],
    "company_tags": [
      "Infosys",
      "Wipro Turbo",
      "TCS"
    ],
    "difficulty": "BASIC",
    "sort_order": 12,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-13",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "question": "What will be the output of the following program utilizing function pointers as callbacks?",
    "codeSnippet": "#include <stdio.h>\n\nint add(int a, int b) { return a + b; }\nint multiply(int a, int b) { return a * b; }\n\nint operate(int x, int y, int (*func)(int, int)) {\n    return func(x, y);\n}\n\nint main() {\n    printf(\"%d\", operate(3, 4, multiply) + operate(5, 2, add));\n    return 0;\n}",
    "code_snippet": "#include <stdio.h>\n\nint add(int a, int b) { return a + b; }\nint multiply(int a, int b) { return a * b; }\n\nint operate(int x, int y, int (*func)(int, int)) {\n    return func(x, y);\n}\n\nint main() {\n    printf(\"%d\", operate(3, 4, multiply) + operate(5, 2, add));\n    return 0;\n}",
    "options": [
      "19",
      "14",
      "24",
      "Compilation Error: Cannot pass functions as parameters"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "int (*func)(int, int) declares a function pointer parameter named func that points to any function accepting two integers and returning an integer.\n1. operate(3, 4, multiply) calls multiply(3, 4) = 12.\n2. operate(5, 2, add) calls add(5, 2) = 7.\n3. 12 + 7 = 19.\nOutput is 19.",
    "companyTags": [
      "Zoho",
      "Capgemini",
      "Cognizant"
    ],
    "company_tags": [
      "Zoho",
      "Capgemini",
      "Cognizant"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 13,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-14",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "question": "On a little-endian machine where int is 4 bytes, what will be printed by this union inspection?",
    "codeSnippet": "#include <stdio.h>\n\nunion Data {\n    int i;\n    char ch[4];\n};\n\nint main() {\n    union Data d;\n    d.i = 0x12345678;\n    printf(\"0x%X\", (unsigned char)d.ch[0]);\n    return 0;\n}",
    "code_snippet": "#include <stdio.h>\n\nunion Data {\n    int i;\n    char ch[4];\n};\n\nint main() {\n    union Data d;\n    d.i = 0x12345678;\n    printf(\"0x%X\", (unsigned char)d.ch[0]);\n    return 0;\n}",
    "options": [
      "0x12",
      "0x78",
      "0x34",
      "0x56"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Union members share the exact same starting memory address.\nIn little-endian architecture (like x86, x64, and most ARM devices), the least significant byte (LSB) is stored at the lowest memory address (byte offset 0).\nFor the 32-bit hex number 0x12345678:\n- Byte 0 (lowest address): 0x78 (LSB)\n- Byte 1: 0x56\n- Byte 2: 0x34\n- Byte 3 (highest address): 0x12 (MSB)\nTherefore, d.ch[0] accesses Byte 0, which holds 0x78.",
    "companyTags": [
      "Qualcomm",
      "TCS Prime",
      "Zoho"
    ],
    "company_tags": [
      "Qualcomm",
      "TCS Prime",
      "Zoho"
    ],
    "difficulty": "HARD",
    "sort_order": 14,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-15",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "question": "What will the following code output regarding string length vs array size?",
    "codeSnippet": "#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char str[] = \"Gate\\0Exam\";\n    printf(\"%zu, %zu\", strlen(str), sizeof(str));\n    return 0;\n}",
    "code_snippet": "#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char str[] = \"Gate\\0Exam\";\n    printf(\"%zu, %zu\", strlen(str), sizeof(str));\n    return 0;\n}",
    "options": [
      "4, 10",
      "9, 9",
      "4, 9",
      "8, 10"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "1. strlen(str): Scans from the start of str until the first null terminator '\\0'. 'G', 'a', 't', 'e' is 4 characters, so strlen returns 4.\n2. sizeof(str): Returns the total number of bytes allocated in memory for the array at compile time.\nThe characters are: 'G', 'a', 't', 'e', '\\0', 'E', 'x', 'a', 'm', and the implicit trailing '\\0' added by the compiler.\nTotal count = 4 + 1 + 4 + 1 = 10 bytes.\nOutput is \"4, 10\".",
    "companyTags": [
      "Infosys",
      "Accenture",
      "TCS"
    ],
    "company_tags": [
      "Infosys",
      "Accenture",
      "TCS"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 15,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-16",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "question": "What is the output printed when calling fun(3)?",
    "codeSnippet": "#include <stdio.h>\n\nvoid fun(int n) {\n    if (n <= 0) return;\n    fun(n - 1);\n    printf(\"%d \", n);\n    fun(n - 1);\n}\n\nint main() {\n    fun(3);\n    return 0;\n}",
    "code_snippet": "#include <stdio.h>\n\nvoid fun(int n) {\n    if (n <= 0) return;\n    fun(n - 1);\n    printf(\"%d \", n);\n    fun(n - 1);\n}\n\nint main() {\n    fun(3);\n    return 0;\n}",
    "options": [
      "1 2 1 3 1 2 1 ",
      "3 2 1 1 2 3 ",
      "1 2 3 1 2 3 ",
      "3 2 1 2 1 "
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Tracing the recursion tree (symmetric in-order traversal):\n- fun(1) calls fun(0), prints 1, calls fun(0) -> prints \"1 \"\n- fun(2) calls fun(1), prints 2, calls fun(1) -> prints \"1 2 1 \"\n- fun(3) calls fun(2), prints 3, calls fun(2) -> prints \"1 2 1 3 1 2 1 \"\nFinal output: 1 2 1 3 1 2 1 .",
    "companyTags": [
      "TCS Digital",
      "Cognizant",
      "Wipro"
    ],
    "company_tags": [
      "TCS Digital",
      "Cognizant",
      "Wipro"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 16,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-17",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "question": "What will be printed by this program using stringification (#) and token-pasting (##)?",
    "codeSnippet": "#include <stdio.h>\n\n#define CONCAT(a, b) a##b\n#define STR(s) #s\n\nint main() {\n    int xy = 30;\n    printf(\"%d, %s\", CONCAT(x, y), STR(CONCAT(x, y)));\n    return 0;\n}",
    "code_snippet": "#include <stdio.h>\n\n#define CONCAT(a, b) a##b\n#define STR(s) #s\n\nint main() {\n    int xy = 30;\n    printf(\"%d, %s\", CONCAT(x, y), STR(CONCAT(x, y)));\n    return 0;\n}",
    "options": [
      "30, xy",
      "30, CONCAT(x, y)",
      "xy, 30",
      "Compilation Error"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "1. CONCAT(x, y): The ## operator concatenates tokens 'x' and 'y' into identifier 'xy', which refers to int xy = 30.\n2. STR(CONCAT(x, y)): The # operator converts the argument passed to it into a string literal without macro-expanding it first.\nThus, STR(CONCAT(x, y)) literally converts the text \"CONCAT(x, y)\" into a string. (To expand before stringifying, an extra indirection macro like #define STR2(s) STR(s) is needed).\nOutput is: 30, CONCAT(x, y).",
    "companyTags": [
      "Zoho",
      "Accenture Advanced",
      "TCS"
    ],
    "company_tags": [
      "Zoho",
      "Accenture Advanced",
      "TCS"
    ],
    "difficulty": "HARD",
    "sort_order": 17,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-18",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "question": "What happens when attempting to compile the following code with a register variable?",
    "codeSnippet": "#include <stdio.h>\n\nint main() {\n    register int x = 10;\n    int *ptr = &x;\n    printf(\"%d\", *ptr);\n    return 0;\n}",
    "code_snippet": "#include <stdio.h>\n\nint main() {\n    register int x = 10;\n    int *ptr = &x;\n    printf(\"%d\", *ptr);\n    return 0;\n}",
    "options": [
      "Prints 10",
      "Compile-time error: address of register variable requested",
      "Undefined Behavior",
      "Segmentation fault at runtime"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "According to ISO C standard §6.5.3.2:\nThe operand of the unary & (address-of) operator shall not have register storage class.\nSince variables declared as register might reside in a CPU register (which does not possess a memory address in RAM), requesting their address with &x is strictly illegal in C and causes a compile-time error.",
    "companyTags": [
      "TCS Prime",
      "Infosys",
      "Qualcomm"
    ],
    "company_tags": [
      "TCS Prime",
      "Infosys",
      "Qualcomm"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 18,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-19",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "question": "Given the declarations below, which statement produces a compilation error?",
    "codeSnippet": "int a = 10, b = 20;\n\nconst int *p1 = &a;       // Pointer to constant int\nint * const p2 = &a;       // Constant pointer to int",
    "code_snippet": "int a = 10, b = 20;\n\nconst int *p1 = &a;       // Pointer to constant int\nint * const p2 = &a;       // Constant pointer to int",
    "options": [
      "*p1 = 15;",
      "p1 = &b;",
      "*p2 = 15;",
      "Both p1 = &b; and *p2 = 15;"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "1. const int *p1: p1 is a pointer to a const int. The value pointed to cannot be modified (*p1 = 15; produces a compile-time error: assignment of read-only location). However, p1 itself can be redirected (p1 = &b; is allowed).\n2. int * const p2: p2 is a constant pointer to a mutable int. The address in p2 cannot be changed, but the value *p2 can be modified (*p2 = 15; is valid).\nTherefore, *p1 = 15; is the invalid statement.",
    "companyTags": [
      "Cognizant",
      "Infosys",
      "Wipro Turbo"
    ],
    "company_tags": [
      "Cognizant",
      "Infosys",
      "Wipro Turbo"
    ],
    "difficulty": "BASIC",
    "sort_order": 19,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-20",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "question": "What will be the output of this 2D array pointer dereferencing expression?",
    "codeSnippet": "#include <stdio.h>\n\nint main() {\n    int arr[2][3] = {{1, 2, 3}, {4, 5, 6}};\n    printf(\"%d\", *(*(arr + 1) + 2));\n    return 0;\n}",
    "code_snippet": "#include <stdio.h>\n\nint main() {\n    int arr[2][3] = {{1, 2, 3}, {4, 5, 6}};\n    printf(\"%d\", *(*(arr + 1) + 2));\n    return 0;\n}",
    "options": [
      "3",
      "5",
      "6",
      "Garbage value"
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "1. In a 2D array, arr is a pointer to the first row (type int (*)[3]).\n2. (arr + 1) advances to the second row (index 1), containing {4, 5, 6}.\n3. *(arr + 1) dereferences the row pointer, yielding a pointer to the first element of row 1 (i.e. &arr[1][0]).\n4. (*(arr + 1) + 2) advances 2 integers forward, pointing to &arr[1][2].\n5. Dereferencing *(*(arr + 1) + 2) accesses arr[1][2], which has the value 6.",
    "companyTags": [
      "TCS Digital",
      "Infosys",
      "Capgemini"
    ],
    "company_tags": [
      "TCS Digital",
      "Infosys",
      "Capgemini"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 20,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-21",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "question": "What occurs if the in-place XOR swap function below is called as swap(&a, &a)?",
    "codeSnippet": "void swap(int *x, int *y) {\n    *x = *x ^ *y;\n    *y = *x ^ *y;\n    *x = *x ^ *y;\n}",
    "code_snippet": "void swap(int *x, int *y) {\n    *x = *x ^ *y;\n    *y = *x ^ *y;\n    *x = *x ^ *y;\n}",
    "options": [
      "The variable retains its original value safely",
      "The variable becomes 0",
      "A compilation error occurs due to identical pointer arguments",
      "A runtime bus error occurs"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "When x and y point to the exact same memory address (&a):\nLine 1: *x = *x ^ *y calculates a ^ a, which equals 0. This immediately writes 0 into the memory location of a!\nLine 2: *y = *x ^ *y calculates 0 ^ 0 = 0.\nLine 3: *x = *x ^ *y calculates 0 ^ 0 = 0.\nThe value of a is permanently wiped to 0. XOR swap requires x != y (distinct memory addresses).",
    "companyTags": [
      "Accenture",
      "TCS Prime",
      "Cognizant"
    ],
    "company_tags": [
      "Accenture",
      "TCS Prime",
      "Cognizant"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 21,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-22",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "question": "What is the fundamental difference between malloc() and calloc() in the C standard library?",
    "codeSnippet": "int *p1 = (int *)malloc(5 * sizeof(int));\nint *p2 = (int *)calloc(5, sizeof(int));",
    "code_snippet": "int *p1 = (int *)malloc(5 * sizeof(int));\nint *p2 = (int *)calloc(5, sizeof(int));",
    "options": [
      "malloc allocates memory on the stack whereas calloc allocates on the heap",
      "malloc leaves memory uninitialized (indeterminate garbage values), whereas calloc zeroes out all allocated bytes",
      "calloc cannot allocate more than 1024 bytes",
      "malloc returns NULL on failure while calloc throws an exception"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Both malloc and calloc allocate dynamic memory from the heap.\n- malloc(size_t size) takes a single parameter for total bytes and does NOT clear memory, leaving indeterminate garbage values.\n- calloc(size_t num, size_t size) takes two parameters and initializes every byte of the allocated memory block to zero.",
    "companyTags": [
      "Wipro",
      "TCS",
      "Infosys"
    ],
    "company_tags": [
      "Wipro",
      "TCS",
      "Infosys"
    ],
    "difficulty": "BASIC",
    "sort_order": 22,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-23",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "question": "What will be printed by the following expression evaluating bitwise shift and addition?",
    "codeSnippet": "#include <stdio.h>\n\nint main() {\n    int x = 1 << 2 + 1;\n    printf(\"%d\", x);\n    return 0;\n}",
    "code_snippet": "#include <stdio.h>\n\nint main() {\n    int x = 1 << 2 + 1;\n    printf(\"%d\", x);\n    return 0;\n}",
    "options": [
      "5",
      "8",
      "4",
      "3"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "In C operator precedence, arithmetic addition (+) has higher precedence than bitwise shift operators (<<, >>).\nTherefore, 1 << 2 + 1 is evaluated as:\n1 << (2 + 1)\n= 1 << 3\nShifting binary 1 left by 3 positions gives: 1000 in binary = 8.\nTo achieve (1 << 2) + 1 = 5, explicit parentheses around the shift would be required.",
    "companyTags": [
      "TCS Digital",
      "Cognizant",
      "Accenture Advanced"
    ],
    "company_tags": [
      "TCS Digital",
      "Cognizant",
      "Accenture Advanced"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 23,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-24",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "question": "What will be printed by this program testing the return value of printf()?",
    "codeSnippet": "#include <stdio.h>\n\nint main() {\n    int count = printf(\"PrepUnite\");\n    printf(\"%d\", count);\n    return 0;\n}",
    "code_snippet": "#include <stdio.h>\n\nint main() {\n    int count = printf(\"PrepUnite\");\n    printf(\"%d\", count);\n    return 0;\n}",
    "options": [
      "PrepUnite8",
      "PrepUnite9",
      "PrepUnite1",
      "PrepUnite0"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "In C, the printf() function returns the total number of characters successfully printed to standard output.\nThe string \"PrepUnite\" has exactly 9 characters.\nThe first printf prints \"PrepUnite\" and returns 9 into count.\nThe second printf immediately prints 9.\nOutput: PrepUnite9.",
    "companyTags": [
      "Infosys",
      "TCS",
      "Capgemini"
    ],
    "company_tags": [
      "Infosys",
      "TCS",
      "Capgemini"
    ],
    "difficulty": "BASIC",
    "sort_order": 24,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-25",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "question": "What is the critical bug in the following function returning a pointer?",
    "codeSnippet": "#include <stdio.h>\n\nint* getNumber() {\n    int num = 42;\n    return &num;\n}\n\nint main() {\n    int *p = getNumber();\n    printf(\"%d\", *p);\n    return 0;\n}",
    "code_snippet": "#include <stdio.h>\n\nint* getNumber() {\n    int num = 42;\n    return &num;\n}\n\nint main() {\n    int *p = getNumber();\n    printf(\"%d\", *p);\n    return 0;\n}",
    "options": [
      "Syntax error: missing pointer cast in return &num",
      "Returns the address of a stack-allocated local variable that is destroyed after the function returns (Undefined Behavior)",
      "Functions cannot return pointer types in C",
      "printf format specifier %d cannot print dereferenced pointers"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "The variable num has automatic storage duration, meaning its lifetime is confined to the stack frame of getNumber().\nWhen getNumber() returns, its stack frame is popped and may be overwritten by subsequent function calls or interrupt handlers.\nReturning &num returns a dangling pointer to invalid stack memory. Dereferencing *p in main invokes Undefined Behavior.",
    "companyTags": [
      "Zoho",
      "Cognizant GenC Next",
      "TCS"
    ],
    "company_tags": [
      "Zoho",
      "Cognizant GenC Next",
      "TCS"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 25,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-26",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "question": "What will be printed when running this code testing sizeof evaluation side effects?",
    "codeSnippet": "#include <stdio.h>\n\nint main() {\n    int a = 5;\n    printf(\"%zu, %d\", sizeof(++a), a);\n    return 0;\n}",
    "code_snippet": "#include <stdio.h>\n\nint main() {\n    int a = 5;\n    printf(\"%zu, %d\", sizeof(++a), a);\n    return 0;\n}",
    "options": [
      "4, 6",
      "4, 5",
      "8, 6",
      "5, 5"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "In C, sizeof is a compile-time operator (except for variable-length arrays - VLAs).\nThe expression inside sizeof(++a) is an unevaluated operand; the compiler inspects only its type (which is int, 4 bytes) and replaces the sizeof call with 4 at compile time.\nThe side-effect (++a) is never executed at runtime. Thus, variable a remains 5.\nOutput is \"4, 5\".",
    "companyTags": [
      "TCS Digital",
      "Accenture",
      "Cognizant"
    ],
    "company_tags": [
      "TCS Digital",
      "Accenture",
      "Cognizant"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 26,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-27",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "question": "What will be printed by the following code involving bitwise NOT on an unsigned char?",
    "codeSnippet": "#include <stdio.h>\n\nint main() {\n    unsigned char x = 0;\n    printf(\"%d\", ~x);\n    return 0;\n}",
    "code_snippet": "#include <stdio.h>\n\nint main() {\n    unsigned char x = 0;\n    printf(\"%d\", ~x);\n    return 0;\n}",
    "options": [
      "255",
      "-1",
      "0",
      "Compilation Error"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Before applying the bitwise NOT operator ~, integral promotion promotes unsigned char to signed int (since all values of unsigned char fit into signed int).\nThus, 0 becomes (int)0.\nApplying ~ on 0 inverts all 32 bits, resulting in 0xFFFFFFFF.\nIn two's complement representation, 0xFFFFFFFF is interpreted as -1 for a signed int.\nprintf(\"%d\") prints signed int, outputting -1. (To get 255, one must cast: (unsigned char)~x).",
    "companyTags": [
      "Qualcomm",
      "Zoho",
      "Wipro Turbo"
    ],
    "company_tags": [
      "Qualcomm",
      "Zoho",
      "Wipro Turbo"
    ],
    "difficulty": "HARD",
    "sort_order": 27,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-28",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "question": "What will be the printed output of this switch statement lacking break statements?",
    "codeSnippet": "#include <stdio.h>\n\nint main() {\n    int x = 2;\n    switch (x) {\n        case 1: printf(\"1 \");\n        case 2: printf(\"2 \");\n        case 3: printf(\"3 \");\n        default: printf(\"D \");\n    }\n    return 0;\n}",
    "code_snippet": "#include <stdio.h>\n\nint main() {\n    int x = 2;\n    switch (x) {\n        case 1: printf(\"1 \");\n        case 2: printf(\"2 \");\n        case 3: printf(\"3 \");\n        default: printf(\"D \");\n    }\n    return 0;\n}",
    "options": [
      "2 ",
      "2 3 D ",
      "2 3 ",
      "D "
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "In C, switch statements feature fall-through behavior by default unless a break or return statement is encountered.\nSince x == 2, execution jumps to case 2, printing \"2 \".\nBecause there is no break statement, execution falls through sequentially into case 3 (printing \"3 \") and then into default (printing \"D \").\nOutput is: \"2 3 D \".",
    "companyTags": [
      "Infosys",
      "Capgemini",
      "TCS"
    ],
    "company_tags": [
      "Infosys",
      "Capgemini",
      "TCS"
    ],
    "difficulty": "BASIC",
    "sort_order": 28,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-29",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "question": "What is the primary purpose of the volatile keyword in C embedded systems and systems programming?",
    "codeSnippet": "volatile int *hardware_register = (int *)0x40001000;",
    "code_snippet": "volatile int *hardware_register = (int *)0x40001000;",
    "options": [
      "Forces the compiler to read/write directly from RAM on every access instead of optimizing it into a CPU register",
      "Allocates the variable in high-speed L1 CPU cache memory",
      "Applies an automatic thread-safe mutex lock during variable access",
      "Makes the variable constant and read-only"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "The volatile keyword instructs the compiler optimizer that the variable can be altered at any moment by something outside the program's control (such as hardware I/O registers, interrupt service routines, or another thread).\nIt prevents compiler optimizations like caching the value in a CPU register or omitting redundant reads/writes.",
    "companyTags": [
      "Qualcomm",
      "Texas Instruments",
      "Zoho"
    ],
    "company_tags": [
      "Qualcomm",
      "Texas Instruments",
      "Zoho"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 29,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-30",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "question": "What will be the output of sizeof(struct PackedData) when #pragma pack(1) is applied?",
    "codeSnippet": "#include <stdio.h>\n\n#pragma pack(1)\nstruct PackedData {\n    char a;\n    int b;\n    char c;\n};\n\nint main() {\n    printf(\"%zu\", sizeof(struct PackedData));\n    return 0;\n}",
    "code_snippet": "#include <stdio.h>\n\n#pragma pack(1)\nstruct PackedData {\n    char a;\n    int b;\n    char c;\n};\n\nint main() {\n    printf(\"%zu\", sizeof(struct PackedData));\n    return 0;\n}",
    "options": [
      "6",
      "8",
      "12",
      "16"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "#pragma pack(1) sets byte alignment to 1, completely disabling internal and tail structure padding bytes.\n- char a takes 1 byte (offset 0).\n- int b is packed immediately after at offset 1 (occupies 4 bytes: offsets 1 to 4).\n- char c takes 1 byte at offset 5.\nTotal packed size = 1 + 4 + 1 = 6 bytes (compared to 12 bytes without packing).",
    "companyTags": [
      "Qualcomm",
      "Zoho",
      "Cognizant"
    ],
    "company_tags": [
      "Qualcomm",
      "Zoho",
      "Cognizant"
    ],
    "difficulty": "HARD",
    "sort_order": 30,
    "is_hidden": false,
    "is_deleted": false
  }
];
