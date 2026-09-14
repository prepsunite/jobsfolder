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
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Which of the following describes the correct chronological sequence of stages in the C compilation pipeline?",
    "options": [
      "Compiler -> Preprocessor -> Assembler -> Linker",
      "Preprocessor -> Compiler -> Assembler -> Linker",
      "Preprocessor -> Assembler -> Compiler -> Linker",
      "Compiler -> Linker -> Preprocessor -> Loader"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "The standard C build pipeline executes in four sequential stages:\n1. Preprocessor: Expands macros (#define), includes header files (#include), and removes comments (produces .i file).\n2. Compiler: Translates preprocessed C code into assembly instructions (produces .s file).\n3. Assembler: Translates assembly code into machine-readable object code (produces .o or .obj file).\n4. Linker: Combines object files with standard library definitions to produce the final executable binary.",
    "companyTags": [
      "TCS",
      "Infosys",
      "Cognizant"
    ],
    "company_tags": [
      "TCS",
      "Infosys",
      "Cognizant"
    ],
    "difficulty": "BASIC",
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
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "In the standard C runtime memory layout, where are uninitialized global and static variables stored?",
    "options": [
      "Stack Segment",
      "BSS (Block Started by Symbol) Segment",
      "Initialized Data Segment (.data)",
      "Text (Code) Segment"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Memory segments in C:\n- Text Segment: Stores compiled machine code instructions (read-only).\n- Initialized Data (.data): Stores global and static variables initialized to non-zero values.\n- BSS Segment: Stores uninitialized global and static variables, automatically zero-initialized by the OS kernel loader before main() executes.\n- Heap: Managed dynamically at runtime via malloc/free.\n- Stack: Holds local automatic variables and function activation records.",
    "companyTags": [
      "Qualcomm",
      "Zoho",
      "Accenture"
    ],
    "company_tags": [
      "Qualcomm",
      "Zoho",
      "Accenture"
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
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "What critical runtime error is caused by the unbounded recursion in the function below?",
    "codeSnippet": "#include <stdio.h>\n\nvoid recurse() {\n    int buffer[1024];\n    recurse();\n}\n\nint main() {\n    recurse();\n    return 0;\n}",
    "code_snippet": "#include <stdio.h>\n\nvoid recurse() {\n    int buffer[1024];\n    recurse();\n}\n\nint main() {\n    recurse();\n    return 0;\n}",
    "options": [
      "Heap Out of Memory error",
      "Stack Overflow crash due to exhaustion of call stack memory",
      "Floating Point Exception",
      "Bus Error due to unaligned memory address"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Every invocation of recurse() creates a new activation frame on the call stack, allocating 1024 integers (approx 4KB) plus return address and frame pointers. Because there is no base case, the call stack grows indefinitely until it exceeds the operating system stack size limit (typically 1MB–8MB), causing a Stack Overflow segmentation fault.",
    "companyTags": [
      "Wipro",
      "TCS Prime",
      "Capgemini"
    ],
    "company_tags": [
      "Wipro",
      "TCS Prime",
      "Capgemini"
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
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "Which of the following compiler flags in GCC enables strict adherence to the ISO C11 standard and emits warnings for all non-standard extensions?",
    "options": [
      "gcc -O3 -Wall",
      "gcc -std=c11 -pedantic -Wall",
      "gcc -g -fPIC",
      "gcc -shared -static"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "-std=c11 specifies compliance with the ISO/IEC 9899:2011 standard.\n-pedantic issues all warnings demanded by strict ISO C, rejecting forbidden extensions.\n-Wall enables all commonly recommended compiler diagnostic warnings.",
    "companyTags": [
      "Qualcomm",
      "Texas Instruments"
    ],
    "company_tags": [
      "Qualcomm",
      "Texas Instruments"
    ],
    "difficulty": "MEDIUM",
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
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the key role of the Linker during program compilation when multiple source files are compiled together?",
    "options": [
      "Translates C syntax into intermediate assembly code",
      "Resolves symbol references across object files and binds library functions to their actual definitions",
      "Expands preprocessor conditionals and macros",
      "Checks for syntax errors and generates abstract syntax trees"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "The Linker resolves cross-file external references (symbols). If file1.c calls a function defined in file2.c, the compiler produces unresolved external symbol placeholders in file1.o. The Linker scans all .o files and libraries to resolve these symbols into concrete virtual addresses.",
    "companyTags": [
      "Infosys",
      "TCS",
      "Accenture"
    ],
    "company_tags": [
      "Infosys",
      "TCS",
      "Accenture"
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
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What will be the output of the following C code regarding integer promotion and comparison?",
    "codeSnippet": "#include <stdio.h>\n\nint main() {\n    signed int a = -1;\n    unsigned int b = 1;\n    \n    if (a < b) {\n        printf(\"LESS\");\n    } else {\n        printf(\"GREATER\");\n    }\n    return 0;\n}",
    "code_snippet": "#include <stdio.h>\n\nint main() {\n    signed int a = -1;\n    unsigned int b = 1;\n    \n    if (a < b) {\n        printf(\"LESS\");\n    } else {\n        printf(\"GREATER\");\n    }\n    return 0;\n}",
    "options": [
      "LESS",
      "GREATER",
      "Compilation Error",
      "Undefined Behavior"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "In C (ISO C99/C11 §6.3.1.8 - Usual Arithmetic Conversions), when comparing signed int and unsigned int of the same rank, the signed operand is converted to unsigned int.\nConverting -1 to unsigned int wraps around modulo 2^32, yielding UINT_MAX (4,294,967,295).\nSince 4294967295 < 1 evaluates to false, the else branch executes and prints \"GREATER\".",
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
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
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
    "explanation": "In C operator precedence, arithmetic addition (+) has higher precedence than bitwise shift operators (<<, >>).\nTherefore, 1 << 2 + 1 is evaluated as: 1 << (2 + 1) = 1 << 3 = 8.\nTo achieve (1 << 2) + 1 = 5, explicit parentheses around the shift would be required.",
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
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output after executing this statement with logical operators and short-circuit evaluation?",
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
    "explanation": "Operator precedence groups the expression as: ((a++ && ++b) || ++c).\n1. a++ evaluates to 0 (false), while post-incrementing a to 1.\n2. Because the left operand of logical AND (&&) is 0, short-circuit evaluation skips ++b. b remains 5.\n3. The left side of || is 0 (false), requiring evaluation of the right operand (++c).\n4. ++c increments c from 10 to 11 and yields 11 (true).\n5. (0 || 11) yields 1.\nResult: a=1, b=5, c=11, res=1.",
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
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "Which of the following is NOT a valid identifier name in C?",
    "options": [
      "_counter_2",
      "default_value",
      "2nd_variable",
      "total$sum"
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "According to ISO C identifier naming rules:\n1. Identifiers can contain letters (a-z, A-Z), digits (0-9), and underscores (_).\n2. An identifier CANNOT begin with a digit. Therefore, '2nd_variable' is illegal syntax.\n(Note: while some compilers accept $ as an extension, standard C identifiers strictly forbid starting with a digit).",
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
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the result of the expression sizeof('a') in standard C compared to C++?",
    "codeSnippet": "#include <stdio.h>\n\nint main() {\n    printf(\"%zu\", sizeof('a'));\n    return 0;\n}",
    "code_snippet": "#include <stdio.h>\n\nint main() {\n    printf(\"%zu\", sizeof('a'));\n    return 0;\n}",
    "options": [
      "1 in both C and C++",
      "sizeof(int) (typically 4) in C, but 1 in C++",
      "1 in C, but sizeof(int) in C++",
      "Undefined in both languages"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "In C, character constants like 'a' have type int, so sizeof('a') == sizeof(int) (typically 4 bytes).\nIn C++, character constants have type char, so sizeof('a') == sizeof(char) == 1 byte.\nThis is one of the classic subtle differences between C and C++.",
    "companyTags": [
      "Zoho",
      "Qualcomm",
      "TCS Digital"
    ],
    "company_tags": [
      "Zoho",
      "Qualcomm",
      "TCS Digital"
    ],
    "difficulty": "HARD",
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
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
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
    "explanation": "In C, switch statements feature fall-through behavior by default unless a break or return statement is encountered.\nSince x == 2, execution jumps to case 2, printing '2 '.\nBecause there is no break statement, execution falls through sequentially into case 3 (printing '3 ') and then into default (printing 'D ').\nOutput is: '2 3 D '.",
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
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What will be the output of the following loop utilizing the comma operator?",
    "codeSnippet": "#include <stdio.h>\n\nint main() {\n    int i, j;\n    for (i = 0, j = 0; i < 3, j < 5; i++, j++) {\n        // empty body\n    }\n    printf(\"%d %d\", i, j);\n    return 0;\n}",
    "code_snippet": "#include <stdio.h>\n\nint main() {\n    int i, j;\n    for (i = 0, j = 0; i < 3, j < 5; i++, j++) {\n        // empty body\n    }\n    printf(\"%d %d\", i, j);\n    return 0;\n}",
    "options": [
      "3 3",
      "5 5",
      "3 5",
      "Compilation Error"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "In the condition clause (i < 3, j < 5), the comma operator evaluates each operand from left to right and yields the value of the RIGHTMOST operand.\nThus, the loop termination depends solely on (j < 5).\nThe loop runs for j = 0, 1, 2, 3, 4 (5 iterations).\nAt loop exit, i = 5 and j = 5.\nOutput: 5 5.",
    "companyTags": [
      "Cognizant",
      "TCS Prime",
      "Accenture"
    ],
    "company_tags": [
      "Cognizant",
      "TCS Prime",
      "Accenture"
    ],
    "difficulty": "MEDIUM",
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
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Which of the following data types CANNOT be used as the controlling expression in a C switch statement?",
    "options": [
      "char",
      "enum",
      "float",
      "short int"
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "In C, the controlling expression of a switch statement and the case label values MUST be of integer type (char, short, int, long, or enum). Floating-point types (float, double) are not permitted because exact equality comparisons on floating-point numbers are unreliable due to binary rounding representation.",
    "companyTags": [
      "TCS",
      "Wipro",
      "Infosys"
    ],
    "company_tags": [
      "TCS",
      "Wipro",
      "Infosys"
    ],
    "difficulty": "BASIC",
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
    "questionType": "CODE_COMPLETION",
    "question_type": "CODE_COMPLETION",
    "question": "What loop condition must replace /* BLANK */ so that the loop executes exactly 10 times (from 10 down to 1)?",
    "codeSnippet": "#include <stdio.h>\n\nint main() {\n    int count = 10;\n    while (/* BLANK */) {\n        printf(\"%d \", count);\n    }\n    return 0;\n}",
    "code_snippet": "#include <stdio.h>\n\nint main() {\n    int count = 10;\n    while (/* BLANK */) {\n        printf(\"%d \", count);\n    }\n    return 0;\n}",
    "options": [
      "count-- > 0",
      "--count > 0",
      "count-- >= 0",
      "count > 0; count--"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Using count-- > 0:\n1. First check: count (10) > 0 is true, count decrements to 9. Prints 10.\n... \n10. Tenth check: count (1) > 0 is true, count decrements to 0. Prints 1.\n11. Eleventh check: count (0) > 0 is false. Loop terminates.\nTotal iterations: exactly 10 times.",
    "companyTags": [
      "Capgemini",
      "Accenture",
      "TCS"
    ],
    "company_tags": [
      "Capgemini",
      "Accenture",
      "TCS"
    ],
    "difficulty": "MEDIUM",
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
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What will be printed when the following program executes with a static local variable?",
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
    "explanation": "A static local variable in C is initialized only once during program startup (in the data segment), and retains its value between function calls across the entire program lifetime.\nIteration 0: prints 5, decrements count to 4.\nIteration 1: prints 4, decrements count to 3.\nIteration 2: prints 3, decrements count to 2.\nOutput: '5 4 3 '.",
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
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "What error occurs when compiling the following code attempting to take the address of a register variable?",
    "codeSnippet": "#include <stdio.h>\n\nint main() {\n    register int x = 10;\n    int *ptr = &x;\n    printf(\"%d\", *ptr);\n    return 0;\n}",
    "code_snippet": "#include <stdio.h>\n\nint main() {\n    register int x = 10;\n    int *ptr = &x;\n    printf(\"%d\", *ptr);\n    return 0;\n}",
    "options": [
      "No error: prints 10",
      "Compile-time error: address of register variable requested",
      "Undefined Behavior at runtime",
      "Segmentation fault on dereference"
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
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
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
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the difference between declaring a variable with 'extern' vs defining a global variable in C?",
    "codeSnippet": "// File 1: extern int counter;\n// File 2: int counter = 0;",
    "code_snippet": "// File 1: extern int counter;\n// File 2: int counter = 0;",
    "options": [
      "'extern' allocates memory on the stack, whereas normal globals allocate on the heap",
      "'extern' declares the variable's type and name without allocating memory, referencing a definition in another file",
      "'extern' makes the variable constant and immutable",
      "There is no difference; 'extern' is optional syntactic sugar"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "In C, a declaration informs the compiler about the name and type of a variable without allocating memory. 'extern int counter;' is a declaration that tells the linker to find the definition elsewhere.\nA definition ('int counter = 0;') instructs the compiler to allocate storage in the data segment.",
    "companyTags": [
      "Cognizant",
      "Infosys",
      "Wipro"
    ],
    "company_tags": [
      "Cognizant",
      "Infosys",
      "Wipro"
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
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What will be the output of the following program testing global variable scoping and masking?",
    "codeSnippet": "#include <stdio.h>\n\nint x = 100;\n\nvoid display() {\n    printf(\"%d \", x);\n}\n\nint main() {\n    int x = 200;\n    display();\n    printf(\"%d\", x);\n    return 0;\n}",
    "code_snippet": "#include <stdio.h>\n\nint x = 100;\n\nvoid display() {\n    printf(\"%d \", x);\n}\n\nint main() {\n    int x = 200;\n    display();\n    printf(\"%d\", x);\n    return 0;\n}",
    "options": [
      "200 200",
      "100 200",
      "100 100",
      "Compilation Error: redeclaration of x"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Inside main(), the local variable 'int x = 200' shadows (masks) the global 'x = 100' within the scope of main().\nHowever, display() has no local variable named x, so it accesses the global 'x = 100'.\nTherefore, display() prints 100, and main() prints its local 200.\nOutput: 100 200.",
    "companyTags": [
      "TCS",
      "Accenture",
      "Capgemini"
    ],
    "company_tags": [
      "TCS",
      "Accenture",
      "Capgemini"
    ],
    "difficulty": "MEDIUM",
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
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What will be the output of the following C program evaluating pointer increment operations?",
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
    "explanation": "1. *p++: The postfix ++ operator has higher precedence than dereference (*). It yields the current pointer address p, dereferences it to print 10, and then increments p so it now points to arr[1].\n2. (*p)++: Parentheses force dereferencing first. The value at p (arr[1] = 20) is evaluated for printing, and then the integer in memory at arr[1] is incremented from 20 to 21.\n3. *p: Evaluates the current value at p, which is now 21.\n4. arr[1]: Since p was pointing to arr[1], its updated value is 21.\nOutput is: 10, 20, 21, 21.",
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
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What will be the output of the following pointer arithmetic program comparing arr and &arr?",
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
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
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
    "difficulty": "MEDIUM",
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
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
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
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "What is the difference between 'int *p[10]' and 'int (*p)[10]' in C declarations?",
    "options": [
      "int *p[10] is an array of 10 pointers to int; int (*p)[10] is a pointer to an array of 10 integers",
      "int *p[10] is a pointer to an array of 10 integers; int (*p)[10] is an array of 10 pointers",
      "Both declarations are identical in ISO C",
      "int (*p)[10] is invalid syntax in C"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Due to operator precedence: [] binds tighter than *.\n- int *p[10]: [] binds to p first -> 'p is an array of 10 elements, each of type pointer to int' (Array of Pointers).\n- int (*p)[10]: Parentheses override precedence -> '* binds to p first, so p is a pointer to an array of 10 integers' (Pointer to Array).",
    "companyTags": [
      "Qualcomm",
      "Zoho",
      "TCS Prime"
    ],
    "company_tags": [
      "Qualcomm",
      "Zoho",
      "TCS Prime"
    ],
    "difficulty": "MEDIUM",
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
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
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
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the difference between a NULL pointer, a void pointer, and a wild pointer?",
    "options": [
      "NULL pointer points to address 0; void* is a generic untyped pointer; wild pointer is uninitialized pointing to random memory",
      "NULL and wild pointers are identical; void* cannot be cast to other types",
      "void* points to function code; NULL points to heap; wild points to stack",
      "A wild pointer has been freed via free()"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "- NULL Pointer: A pointer explicitly assigned 0 or ((void*)0), representing pointing to nothing valid.\n- Void Pointer (void*): A generic pointer type that can hold the address of any object without type information.\n- Wild Pointer: An uninitialized pointer variable holding garbage memory address.\n(Note: A pointer to deallocated memory is specifically called a 'dangling pointer').",
    "companyTags": [
      "Infosys",
      "TCS",
      "Accenture"
    ],
    "company_tags": [
      "Infosys",
      "TCS",
      "Accenture"
    ],
    "difficulty": "BASIC",
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
    "questionType": "CODE_COMPLETION",
    "question_type": "CODE_COMPLETION",
    "question": "What expression should replace /* BLANK */ to advance the pointer ptr to the next node in a singly linked list?",
    "codeSnippet": "struct Node {\n    int data;\n    struct Node *next;\n};\n\nvoid printList(struct Node *head) {\n    struct Node *ptr = head;\n    while (ptr != NULL) {\n        printf(\"%d \", ptr->data);\n        ptr = /* BLANK */;\n    }\n}",
    "code_snippet": "struct Node {\n    int data;\n    struct Node *next;\n};\n\nvoid printList(struct Node *head) {\n    struct Node *ptr = head;\n    while (ptr != NULL) {\n        printf(\"%d \", ptr->data);\n        ptr = /* BLANK */;\n    }\n}",
    "options": [
      "ptr->next",
      "*ptr->next",
      "&ptr->next",
      "ptr++"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In a linked list, each node stores the address of the subsequent node in its 'next' pointer member. To advance the traversal pointer ptr to the next node, we assign ptr = ptr->next. (Using ptr++ would advance contiguous memory in an array, which is invalid for non-contiguous heap nodes).",
    "companyTags": [
      "TCS",
      "Cognizant",
      "Infosys"
    ],
    "company_tags": [
      "TCS",
      "Cognizant",
      "Infosys"
    ],
    "difficulty": "BASIC",
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
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
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
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
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
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "What is the serious memory vulnerability in the function allocateBuffer()?",
    "codeSnippet": "#include <stdlib.h>\n\nvoid allocateBuffer() {\n    int *data = (int *)malloc(100 * sizeof(int));\n    // ... computations performed ...\n    return;\n}",
    "code_snippet": "#include <stdlib.h>\n\nvoid allocateBuffer() {\n    int *data = (int *)malloc(100 * sizeof(int));\n    // ... computations performed ...\n    return;\n}",
    "options": [
      "Double free corruption",
      "Memory Leak: dynamically allocated heap memory is not released with free() before pointer data goes out of scope",
      "Stack overflow",
      "NULL pointer dereference"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "The pointer variable 'data' is allocated on the stack, but the 400 bytes it points to reside on the heap. When allocateBuffer() returns, 'data' is destroyed, but the heap memory remains allocated with no remaining pointer referencing it. This causes a permanent memory leak until program termination.",
    "companyTags": [
      "Zoho",
      "Cognizant",
      "TCS"
    ],
    "company_tags": [
      "Zoho",
      "Cognizant",
      "TCS"
    ],
    "difficulty": "BASIC",
    "sort_order": 30,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-31",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "What happens when realloc() is invoked with a size of 0, as in 'realloc(ptr, 0)'?",
    "codeSnippet": "#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int *ptr = (int *)malloc(10 * sizeof(int));\n    ptr = (int *)realloc(ptr, 0);\n    return 0;\n}",
    "code_snippet": "#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int *ptr = (int *)malloc(10 * sizeof(int));\n    ptr = (int *)realloc(ptr, 0);\n    return 0;\n}",
    "options": [
      "It acts equivalently to free(ptr), deallocating the memory and returning NULL",
      "It triggers a runtime segmentation fault",
      "It doubles the allocated memory buffer",
      "It leaves the memory untouched and returns ptr unchanged"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Under standard C library specifications, calling realloc(ptr, 0) on a non-NULL pointer frees the memory pointed to by ptr and returns either NULL or an implementation-defined unique pointer that cannot be dereferenced.",
    "companyTags": [
      "Qualcomm",
      "Zoho"
    ],
    "company_tags": [
      "Qualcomm",
      "Zoho"
    ],
    "difficulty": "HARD",
    "sort_order": 31,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-32",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "On a 64-bit architecture, what will be printed by the following code testing array decay in function arguments?",
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
    "explanation": "1. In main, arr is an array of 10 integers. sizeof(arr) evaluates to 10 * sizeof(int) = 10 * 4 = 40 bytes.\n2. When an array is passed as a function argument in C, it automatically decays into a pointer to its first element (int arr[10] is rewritten by compiler as int *arr).\n3. Inside printSize, sizeof(arr) measures the size of a pointer variable (int*), which is 8 bytes on a 64-bit architecture.\nOutput is '40 8'.",
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
    "sort_order": 32,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-33",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "questionType": "CODE_COMPLETION",
    "question_type": "CODE_COMPLETION",
    "question": "To dynamically allocate a 2D integer matrix of R rows and C columns using a pointer-to-pointer, which code snippet correctly allocates row pointers?",
    "codeSnippet": "int **matrix;\nint R = 3, C = 4;\n// Line X: allocate row pointers\nfor (int i = 0; i < R; i++) {\n    matrix[i] = (int *)malloc(C * sizeof(int));\n}",
    "code_snippet": "int **matrix;\nint R = 3, C = 4;\n// Line X: allocate row pointers\nfor (int i = 0; i < R; i++) {\n    matrix[i] = (int *)malloc(C * sizeof(int));\n}",
    "options": [
      "matrix = (int **)malloc(R * sizeof(int *));",
      "matrix = (int *)malloc(R * C * sizeof(int));",
      "matrix = (int **)calloc(R, C);",
      "matrix = (int **)malloc(C * sizeof(int *));"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In dynamic 2D array allocation via int**, 'matrix' is an array of pointers to integers. Therefore, we must allocate R elements where each element has size sizeof(int*): matrix = (int **)malloc(R * sizeof(int *)). Then, in a loop, each matrix[i] is allocated C integers.",
    "companyTags": [
      "Infosys SP",
      "TCS Digital",
      "Zoho"
    ],
    "company_tags": [
      "Infosys SP",
      "TCS Digital",
      "Zoho"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 33,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-34",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "What occurs during execution of the following C program attempting to write to string literals?",
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
    "explanation": "char s2[] = 'World'; creates an array allocated in writeable stack memory, so mutating s2[0] is completely valid.\nHowever, char *s1 = 'Hello'; creates a pointer to a string literal stored in the read-only data segment (.rodata).\nAttempting to modify read-only memory via s1[0] = 'h' invokes Undefined Behavior, which crashes with a Segmentation Fault (SIGSEGV) on modern OSes.",
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
    "sort_order": 34,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-35",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What will the following code output regarding string length vs array size with embedded null bytes?",
    "codeSnippet": "#include <stdio.h>\n\n#include <string.h>\n\nint main() {\n    char str[] = \"Gate\\0Exam\";\n    printf(\"%zu, %zu\", strlen(str), sizeof(str));\n    return 0;\n}",
    "code_snippet": "#include <stdio.h>\n\n#include <string.h>\n\nint main() {\n    char str[] = \"Gate\\0Exam\";\n    printf(\"%zu, %zu\", strlen(str), sizeof(str));\n    return 0;\n}",
    "options": [
      "4, 10",
      "9, 9",
      "4, 9",
      "8, 10"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "1. strlen(str): Scans from the start of str until the first null terminator '\\0'. 'G', 'a', 't', 'e' is 4 characters, so strlen returns 4.\n2. sizeof(str): Returns the total number of bytes allocated in memory for the array at compile time.\nThe characters are: 'G', 'a', 't', 'e', '\\0', 'E', 'x', 'a', 'm', and the implicit trailing '\\0' added by the compiler.\nTotal count = 4 + 1 + 4 + 1 = 10 bytes.\nOutput is '4, 10'.",
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
    "sort_order": 35,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-36",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "Why was the standard library function gets() officially deprecated in C99 and removed completely in C11?",
    "codeSnippet": "char buffer[64];\ngets(buffer); // Dangerous function",
    "code_snippet": "char buffer[64];\ngets(buffer); // Dangerous function",
    "options": [
      "It only works with ASCII characters and cannot handle UTF-8",
      "It cannot specify the maximum buffer length, making buffer overflow unavoidable if user input exceeds array size",
      "It is slower than scanf",
      "It always returns NULL on Unix systems"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "gets() reads characters until a newline is entered with no mechanism to prevent reading more bytes than the destination buffer can hold. This causes arbitrary stack memory corruption (buffer overflow), enabling security exploits. ISO C11 completely removed gets(); safe alternatives are fgets(buffer, sizeof(buffer), stdin) or gets_s().",
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
    "difficulty": "BASIC",
    "sort_order": 36,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-37",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
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
    "explanation": "In C, the printf() function returns the total number of characters successfully printed to standard output.\nThe string 'PrepUnite' has exactly 9 characters.\nThe first printf prints 'PrepUnite' and returns 9 into count.\nThe second printf immediately prints 9.\nOutput: PrepUnite9.",
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
    "sort_order": 37,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-38",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the return value of strcmp(s1, s2) when string s1 is lexicographically smaller than string s2?",
    "codeSnippet": "#include <string.h>\nint res = strcmp(\"Apple\", \"Banana\");",
    "code_snippet": "#include <string.h>\nint res = strcmp(\"Apple\", \"Banana\");",
    "options": [
      "A negative integer (< 0)",
      "0",
      "A positive integer (> 0)",
      "NULL"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In C standard library, strcmp(s1, s2) compares characters by ASCII value:\n- Returns < 0 if s1 < s2 (the first unmatched character in s1 has smaller ASCII value than s2, e.g. 'A' (65) < 'B' (66)).\n- Returns 0 if s1 == s2.\n- Returns > 0 if s1 > s2.",
    "companyTags": [
      "Wipro",
      "TCS",
      "Accenture"
    ],
    "company_tags": [
      "Wipro",
      "TCS",
      "Accenture"
    ],
    "difficulty": "BASIC",
    "sort_order": 38,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-39",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
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
    "sort_order": 39,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-40",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
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
    "sort_order": 40,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-41",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
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
    "sort_order": 41,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-42",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "What is the purpose of bit-fields in C structures as shown below?",
    "codeSnippet": "struct Status {\n    unsigned int is_ready : 1;\n    unsigned int error_code : 3;\n};",
    "code_snippet": "struct Status {\n    unsigned int is_ready : 1;\n    unsigned int error_code : 3;\n};",
    "options": [
      "To allow explicit allocation of a specific number of bits for members, minimizing memory consumption",
      "To speed up arithmetic addition operations",
      "To encrypt data stored in the struct",
      "To convert integers into float representations"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Bit-fields allow packing integer data members into exact bit widths (e.g. 1 bit for boolean flags, 3 bits for numbers 0–7). This is extensively used in embedded microcontrollers, network packet headers, and hardware device drivers to tightly conserve RAM and match hardware registers.",
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
    "sort_order": 42,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-43",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the memory footprint of a union containing members 'char c[10]; int i; double d;'?",
    "codeSnippet": "union Sample {\n    char c[10];\n    int i;\n    double d;\n};",
    "code_snippet": "union Sample {\n    char c[10];\n    int i;\n    double d;\n};",
    "options": [
      "10 bytes",
      "22 bytes (sum of all sizes)",
      "16 bytes (size rounded up to multiple of largest member alignment)",
      "8 bytes"
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "In a union, all members overlay the same memory location, so the union size must be at least as large as the largest member (char c[10] = 10 bytes).\nFurthermore, the total union size must be a multiple of the largest member's alignment requirement (double d requires 8-byte alignment).\nThe smallest multiple of 8 that is >= 10 is 16 bytes. Hence, sizeof(union Sample) is 16 bytes.",
    "companyTags": [
      "Qualcomm",
      "Zoho",
      "TCS Digital"
    ],
    "company_tags": [
      "Qualcomm",
      "Zoho",
      "TCS Digital"
    ],
    "difficulty": "HARD",
    "sort_order": 43,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-44",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
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
    "sort_order": 44,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-45",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
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
    "explanation": "1. CONCAT(x, y): The ## operator concatenates tokens 'x' and 'y' into identifier 'xy', which refers to int xy = 30.\n2. STR(CONCAT(x, y)): The # operator converts the argument passed to it into a string literal without macro-expanding it first.\nThus, STR(CONCAT(x, y)) literally converts the text 'CONCAT(x, y)' into a string. (To expand before stringifying, an extra indirection macro like #define STR2(s) STR(s) is needed).\nOutput is: 30, CONCAT(x, y).",
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
    "sort_order": 45,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-46",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "Why are multi-statement macros in C typically wrapped inside 'do { ... } while(0)'?",
    "codeSnippet": "#define LOG_AND_CLEAR(x) do { log(x); x = 0; } while(0)",
    "code_snippet": "#define LOG_AND_CLEAR(x) do { log(x); x = 0; } while(0)",
    "options": [
      "To make the macro loop infinitely",
      "To allow the macro to be used safely with trailing semicolons inside if-else branches without breaking syntax",
      "To force execution in a background thread",
      "To suppress compiler optimizations"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "If a multi-statement macro is written as '{ log(x); x = 0; }', writing:\nif (cond) LOG_AND_CLEAR(a);\nelse foo();\nexpands to an if block followed by a lone semicolon ';', causing the 'else' to become orphaned and trigger a compilation syntax error.\nWrapping with do { ... } while(0) ensures the macro behaves syntactically as a single compound statement that accepts a trailing semicolon seamlessly.",
    "companyTags": [
      "Qualcomm",
      "Zoho",
      "TCS Prime"
    ],
    "company_tags": [
      "Qualcomm",
      "Zoho",
      "TCS Prime"
    ],
    "difficulty": "HARD",
    "sort_order": 46,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-47",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the purpose of header include guards (#ifndef, #define, #endif) in C header files?",
    "codeSnippet": "#ifndef UTILS_H\n#define UTILS_H\n// declarations\n#endif",
    "code_snippet": "#ifndef UTILS_H\n#define UTILS_H\n// declarations\n#endif",
    "options": [
      "To prevent duplicate header inclusion and avoid redefinition errors across translation units",
      "To hide implementation details from the user",
      "To speed up disk I/O operations during compilation",
      "To automatically link external libraries"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "If a header file is included multiple times directly or indirectly (transitive inclusion) within the same translation unit, include guards guarantee that the contents are processed only once by the preprocessor, preventing duplicate type or structure redefinition errors.",
    "companyTags": [
      "TCS",
      "Infosys",
      "Wipro"
    ],
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro"
    ],
    "difficulty": "BASIC",
    "sort_order": 47,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-48",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
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
    "sort_order": 48,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-49",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
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
    "sort_order": 49,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-c-50",
    "topicId": "mcq-c-programming",
    "topic_id": "mcq-c-programming",
    "topic": "C Language",
    "topic_name": "C Language",
    "topicCategory": "C_PROGRAMMING",
    "topic_category": "C_PROGRAMMING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
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
    "sort_order": 50,
    "is_hidden": false,
    "is_deleted": false
  }
];

export const CPP_PROGRAMMING_MCQ_SEED: TechnicalMcq[] = [
  {
    "id": "cpp-mcq-01",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Which of the following statements is FALSE regarding references in C++ compared to pointers?",
    "options": [
      "A reference cannot be NULL and must be initialized upon declaration.",
      "Once a reference is bound to an object, it cannot be rebound to refer to another object.",
      "A reference has its own distinct memory address independent of the referred object.",
      "A reference does not require the dereference operator (*) to access its value."
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "In C++, a reference is an alias for an existing object. Taking the address of a reference (&ref) yields the address of the referenced object itself, not a separate address for the reference. References must be initialized, cannot be reseated, and cannot be NULL.",
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
    "difficulty": "BASIC",
    "sort_order": 1,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-02",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "Which C++ cast operator is used to cast away 'const' or 'volatile' qualifiers from a variable?",
    "options": [
      "static_cast",
      "dynamic_cast",
      "reinterpret_cast",
      "const_cast"
    ],
    "correctOptionIndex": 3,
    "correct_option_index": 3,
    "explanation": "const_cast is explicitly designed to add or remove the 'const' or 'volatile' cv-qualifiers from a pointer or reference type. Using static_cast or dynamic_cast to strip constness results in a compilation error.",
    "companyTags": [
      "Infosys SP",
      "Capgemini",
      "Accenture"
    ],
    "company_tags": [
      "Infosys SP",
      "Capgemini",
      "Accenture"
    ],
    "difficulty": "BASIC",
    "sort_order": 2,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-03",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of the following C++ program with reference modification?",
    "codeSnippet": "#include <iostream>\nusing namespace std;\n\nvoid modify(int &a, int b = 5) {\n    a += b;\n}\n\nint main() {\n    int x = 10;\n    modify(x);\n    modify(x, 15);\n    cout << x << endl;\n    return 0;\n}",
    "code_snippet": "#include <iostream>\nusing namespace std;\n\nvoid modify(int &a, int b = 5) {\n    a += b;\n}\n\nint main() {\n    int x = 10;\n    modify(x);\n    modify(x, 15);\n    cout << x << endl;\n    return 0;\n}",
    "options": [
      "10",
      "25",
      "30",
      "35"
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "1. Initially x = 10.\n2. In `modify(x)`, default parameter b = 5 is used, so x is passed by reference and becomes 10 + 5 = 15.\n3. In `modify(x, 15)`, b is explicitly 15, so x becomes 15 + 15 = 30.\n4. Output is 30.",
    "companyTags": [
      "TCS Prime",
      "Mindtree",
      "LTI"
    ],
    "company_tags": [
      "TCS Prime",
      "Mindtree",
      "LTI"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 3,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-04",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "What happens when compiling and executing the following C++ code?",
    "codeSnippet": "#include <iostream>\nusing namespace std;\n\nint& getLocal() {\n    int val = 42;\n    return val;\n}\n\nint main() {\n    int &ref = getLocal();\n    cout << ref << endl;\n    return 0;\n}",
    "code_snippet": "#include <iostream>\nusing namespace std;\n\nint& getLocal() {\n    int val = 42;\n    return val;\n}\n\nint main() {\n    int &ref = getLocal();\n    cout << ref << endl;\n    return 0;\n}",
    "options": [
      "Prints 42 reliably under all compilers.",
      "Compilation error because local variables cannot be returned.",
      "Runtime crash immediately upon returning from getLocal.",
      "Undefined behavior due to returning a reference to a local stack variable that goes out of scope."
    ],
    "correctOptionIndex": 3,
    "correct_option_index": 3,
    "explanation": "Returning a reference to a local automatic stack variable (`val`) invokes undefined behavior. Once `getLocal()` finishes, the stack frame is deallocated. Any subsequent read through `ref` accesses a dangling reference.",
    "companyTags": [
      "Amazon",
      "Cisco",
      "Qualcomm"
    ],
    "company_tags": [
      "Amazon",
      "Cisco",
      "Qualcomm"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 4,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-05",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the key requirement for 'dynamic_cast' to succeed when downcasting a Base pointer to a Derived pointer at runtime?",
    "options": [
      "The Base class must have a public default constructor.",
      "The Base class must be polymorphic (contain at least one virtual function).",
      "The Derived class must use multiple inheritance.",
      "The Base class must not contain any private data members."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "dynamic_cast relies on Run-Time Type Information (RTTI), which is generated by the compiler only for polymorphic classes (classes containing at least one virtual function). Attempting dynamic_cast on a non-polymorphic base class causes a compile-time error.",
    "companyTags": [
      "Microsoft",
      "Goldman Sachs",
      "Morgan Stanley"
    ],
    "company_tags": [
      "Microsoft",
      "Goldman Sachs",
      "Morgan Stanley"
    ],
    "difficulty": "HARD",
    "sort_order": 5,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-06",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Which constructor is invoked when an existing object is used to initialize a new object of the same class?",
    "codeSnippet": "MyClass obj1;\nMyClass obj2 = obj1;",
    "code_snippet": "MyClass obj1;\nMyClass obj2 = obj1;",
    "options": [
      "Default constructor",
      "Copy constructor",
      "Conversion constructor",
      "Move assignment operator"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "When an object is initialized at declaration time with another object of the same class (like `MyClass obj2 = obj1;`), the copy constructor is invoked. This is initialization, not assignment (which uses `operator=`).",
    "companyTags": [
      "TCS Ninja",
      "Accenture",
      "Infosys"
    ],
    "company_tags": [
      "TCS Ninja",
      "Accenture",
      "Infosys"
    ],
    "difficulty": "BASIC",
    "sort_order": 6,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-07",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the exact output of this constructor/destructor lifecycle program?",
    "codeSnippet": "#include <iostream>\nusing namespace std;\n\nclass Sample {\npublic:\n    Sample() { cout << \"C \"; }\n    ~Sample() { cout << \"D \"; }\n};\n\nint main() {\n    Sample s1;\n    {\n        Sample s2;\n    }\n    return 0;\n}",
    "code_snippet": "#include <iostream>\nusing namespace std;\n\nclass Sample {\npublic:\n    Sample() { cout << \"C \"; }\n    ~Sample() { cout << \"D \"; }\n};\n\nint main() {\n    Sample s1;\n    {\n        Sample s2;\n    }\n    return 0;\n}",
    "options": [
      "C C D D ",
      "C D C D ",
      "C C D ",
      "D D C C "
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "1. `s1` is constructed -> prints \"C \".\n2. Inside the inner block, `s2` is constructed -> prints \"C \".\n3. Inner block terminates: `s2` goes out of scope and is destroyed -> prints \"D \".\n4. `main()` returns: `s1` goes out of scope and is destroyed -> prints \"D \".\nOverall output is `C C D D `.",
    "companyTags": [
      "Cognizant GenC",
      "HCL",
      "Wipro"
    ],
    "company_tags": [
      "Cognizant GenC",
      "HCL",
      "Wipro"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 7,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-08",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "In what order are member variables initialized in a C++ class with a member initializer list?",
    "codeSnippet": "#include <iostream>\nusing namespace std;\n\nclass Test {\n    int a;\n    int b;\npublic:\n    Test(int val) : b(val), a(b + 5) {\n        cout << a << \" \" << b << endl;\n    }\n};\n\nint main() {\n    Test t(10);\n    return 0;\n}",
    "code_snippet": "#include <iostream>\nusing namespace std;\n\nclass Test {\n    int a;\n    int b;\npublic:\n    Test(int val) : b(val), a(b + 5) {\n        cout << a << \" \" << b << endl;\n    }\n};\n\nint main() {\n    Test t(10);\n    return 0;\n}",
    "options": [
      "15 10",
      "GarbageValue 10",
      "10 15",
      "Compilation error"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "In C++, member variables are initialized strictly in the order they are declared in the class declaration, NOT in the order they appear in the constructor initializer list. Since `a` is declared before `b`, `a(b + 5)` executes first when `b` holds garbage/uninitialized data. Hence `a` gets a garbage value and `b` gets 10.",
    "companyTags": [
      "Amazon",
      "Cisco",
      "DE Shaw"
    ],
    "company_tags": [
      "Amazon",
      "Cisco",
      "DE Shaw"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 8,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-09",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "What is the purpose of declaring a single-argument constructor as 'explicit' in C++?",
    "codeSnippet": "class Complex {\npublic:\n    explicit Complex(double r) { ... }\n};",
    "code_snippet": "class Complex {\npublic:\n    explicit Complex(double r) { ... }\n};",
    "options": [
      "It prevents the class from being inherited by child classes.",
      "It prevents the compiler from using the constructor for implicit type conversions.",
      "It forces the compiler to inline the constructor body.",
      "It ensures the constructor can only be called through a pointer."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "The `explicit` keyword on a constructor prevents unintended implicit type conversions and copy-initialization syntax (such as `Complex c = 3.5;`). It requires direct initialization like `Complex c(3.5);` or explicit casting `Complex(3.5)`.",
    "companyTags": [
      "Adobe",
      "Microsoft",
      "Oracle"
    ],
    "company_tags": [
      "Adobe",
      "Microsoft",
      "Oracle"
    ],
    "difficulty": "BASIC",
    "sort_order": 9,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-10",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "Identify the critical flaw in the custom copy constructor below:",
    "codeSnippet": "class Buffer {\n    int* data;\npublic:\n    Buffer(const Buffer b) { // Line 4\n        data = new int(*b.data);\n    }\n};",
    "code_snippet": "class Buffer {\n    int* data;\npublic:\n    Buffer(const Buffer b) { // Line 4\n        data = new int(*b.data);\n    }\n};",
    "options": [
      "Memory leak because delete is not called inside the copy constructor.",
      "Compilation error on Line 4 because a copy constructor cannot take its parameter by value (infinite recursion).",
      "Run-time segmentation fault because *b.data is a const pointer.",
      "Buffer overflow if b.data exceeds sizeof(int)."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "A copy constructor parameter MUST be passed by reference (e.g., `const Buffer& b`). If passed by value (`const Buffer b`), passing the argument to the copy constructor would itself require invoking the copy constructor, leading to infinite compilation recursion.",
    "companyTags": [
      "Google",
      "Bloomberg",
      "Tower Research"
    ],
    "company_tags": [
      "Google",
      "Bloomberg",
      "Tower Research"
    ],
    "difficulty": "HARD",
    "sort_order": 10,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-11",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the default access specifier for members of a 'class' versus members of a 'struct' in C++?",
    "options": [
      "class is public by default; struct is private by default.",
      "class is private by default; struct is public by default.",
      "Both class and struct are private by default.",
      "Both class and struct are public by default."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "In C++, the only syntactic differences between `class` and `struct` are defaults: `class` members and base class inheritance default to `private`, whereas `struct` members and base class inheritance default to `public`.",
    "companyTags": [
      "TCS",
      "Cognizant",
      "Infosys"
    ],
    "company_tags": [
      "TCS",
      "Cognizant",
      "Infosys"
    ],
    "difficulty": "BASIC",
    "sort_order": 11,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-12",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "Which of the following is TRUE about a 'friend' function in C++?",
    "options": [
      "A friend function is a member of the class and has a hidden 'this' pointer.",
      "A friend function can access private and protected members of the granting class.",
      "Friendship is automatically inherited by derived classes.",
      "If class A is a friend of class B, then class B is automatically a friend of class A."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "A friend function is a non-member function granted privileged access to private and protected members of a class. Friendship is neither inherited nor symmetric (transitive).",
    "companyTags": [
      "Wipro",
      "Tech Mahindra",
      "Accenture"
    ],
    "company_tags": [
      "Wipro",
      "Tech Mahindra",
      "Accenture"
    ],
    "difficulty": "BASIC",
    "sort_order": 12,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-13",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of the following program featuring a 'mutable' member?",
    "codeSnippet": "#include <iostream>\nusing namespace std;\n\nclass Counter {\n    mutable int count;\npublic:\n    Counter() : count(0) {}\n    void increment() const {\n        count++;\n    }\n    int get() const { return count; }\n};\n\nint main() {\n    const Counter c;\n    c.increment();\n    c.increment();\n    cout << c.get() << endl;\n    return 0;\n}",
    "code_snippet": "#include <iostream>\nusing namespace std;\n\nclass Counter {\n    mutable int count;\npublic:\n    Counter() : count(0) {}\n    void increment() const {\n        count++;\n    }\n    int get() const { return count; }\n};\n\nint main() {\n    const Counter c;\n    c.increment();\n    c.increment();\n    cout << c.get() << endl;\n    return 0;\n}",
    "options": [
      "Compilation error: cannot call increment() on a const object.",
      "Compilation error: cannot modify count inside a const member function.",
      "2",
      "0"
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "The `mutable` keyword allows a class member variable to be modified even within `const` member functions and on `const` object instances. `c.increment()` legally mutates `count` twice, so `c.get()` outputs 2.",
    "companyTags": [
      "Morgan Stanley",
      "Societe Generale",
      "Barclays"
    ],
    "company_tags": [
      "Morgan Stanley",
      "Societe Generale",
      "Barclays"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 13,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-14",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "What is wrong with the following C++ code involving static member functions?",
    "codeSnippet": "#include <iostream>\nusing namespace std;\n\nclass Math {\n    int factor = 2;\npublic:\n    static int multiply(int x) {\n        return x * factor;\n    }\n};\n\nint main() {\n    cout << Math::multiply(5) << endl;\n    return 0;\n}",
    "code_snippet": "#include <iostream>\nusing namespace std;\n\nclass Math {\n    int factor = 2;\npublic:\n    static int multiply(int x) {\n        return x * factor;\n    }\n};\n\nint main() {\n    cout << Math::multiply(5) << endl;\n    return 0;\n}",
    "options": [
      "Static member functions cannot take parameters.",
      "Cannot invoke Math::multiply without instantiating Math.",
      "Compile error: static member function 'multiply' cannot access non-static member 'factor'.",
      "factor cannot have an in-class initializer."
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "Static member functions in C++ do not receive an implicit `this` pointer and are not associated with any particular object instance. Therefore, they cannot access non-static data members (like `factor`) or non-static member functions directly.",
    "companyTags": [
      "Samsung",
      "Capgemini",
      "LTI"
    ],
    "company_tags": [
      "Samsung",
      "Capgemini",
      "LTI"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 14,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-15",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "In protected inheritance (`class Derived : protected Base`), how do the public and protected members of Base appear within Derived and to outside code?",
    "options": [
      "Base public and protected members both become protected in Derived; inaccessible to outside code.",
      "Base public members stay public; Base protected members become private.",
      "All Base members become private in Derived.",
      "Base public members become private; protected members stay protected."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Under protected inheritance, public and protected members of Base both become `protected` members inside Derived. Consequently, they are accessible to Derived and its future subclasses, but are completely hidden from external users (outside code) of Derived.",
    "companyTags": [
      "Cisco",
      "Qualcomm",
      "NVIDIA"
    ],
    "company_tags": [
      "Cisco",
      "Qualcomm",
      "NVIDIA"
    ],
    "difficulty": "HARD",
    "sort_order": 15,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-16",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Which C++ feature directly solves the ambiguity and duplicate subobject problem of the 'Diamond of Death' in multiple inheritance?",
    "options": [
      "Abstract interfaces",
      "Virtual base classes (`virtual public Base`)",
      "Friend inheritance",
      "Dynamic casting"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Virtual base classes (`class B : virtual public A`) ensure that only a single shared instance of the base class subobject exists in the most derived class, resolving ambiguity and duplicate state.",
    "companyTags": [
      "TCS Digital",
      "Infosys SP",
      "Cognizant"
    ],
    "company_tags": [
      "TCS Digital",
      "Infosys SP",
      "Cognizant"
    ],
    "difficulty": "BASIC",
    "sort_order": 16,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-17",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of constructor invocations in this multiple inheritance hierarchy?",
    "codeSnippet": "#include <iostream>\nusing namespace std;\n\nclass A { public: A() { cout << \"A\"; } };\nclass B { public: B() { cout << \"B\"; } };\nclass C : public B, public A {\npublic:\n    C() { cout << \"C\"; }\n};\n\nint main() {\n    C obj;\n    return 0;\n}",
    "code_snippet": "#include <iostream>\nusing namespace std;\n\nclass A { public: A() { cout << \"A\"; } };\nclass B { public: B() { cout << \"B\"; } };\nclass C : public B, public A {\npublic:\n    C() { cout << \"C\"; }\n};\n\nint main() {\n    C obj;\n    return 0;\n}",
    "options": [
      "ABC",
      "BAC",
      "CBA",
      "CAB"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Base class constructors are called strictly in the order of their appearance in the class derivation list (`class C : public B, public A`), NOT the order in C's constructor initializer list. B is declared first, then A, and finally C's own constructor body executes. Output is BAC.",
    "companyTags": [
      "Amazon",
      "Optum",
      "Paytm"
    ],
    "company_tags": [
      "Amazon",
      "Optum",
      "Paytm"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 17,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-18",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What happens when passing a Derived object by value to a function expecting a Base object (Object Slicing)?",
    "codeSnippet": "#include <iostream>\nusing namespace std;\n\nclass Base {\npublic:\n    virtual void show() { cout << \"Base \"; }\n};\n\nclass Derived : public Base {\npublic:\n    void show() override { cout << \"Derived \"; }\n};\n\nvoid print(Base b) {\n    b.show();\n}\n\nint main() {\n    Derived d;\n    print(d);\n    return 0;\n}",
    "code_snippet": "#include <iostream>\nusing namespace std;\n\nclass Base {\npublic:\n    virtual void show() { cout << \"Base \"; }\n};\n\nclass Derived : public Base {\npublic:\n    void show() override { cout << \"Derived \"; }\n};\n\nvoid print(Base b) {\n    b.show();\n}\n\nint main() {\n    Derived d;\n    print(d);\n    return 0;\n}",
    "options": [
      "Derived ",
      "Base ",
      "Compilation error: cannot convert Derived to Base by value",
      "Undefined Behavior"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Because `print(Base b)` accepts `Base` by value, object slicing occurs. The Derived portion of `d` is sliced away, copying only the `Base` subobject into `b`. The vptr inside `b` points to `Base`'s vtable, printing `Base `.",
    "companyTags": [
      "Microsoft",
      "Adobe",
      "Intuit"
    ],
    "company_tags": [
      "Microsoft",
      "Adobe",
      "Intuit"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 18,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-19",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "Why does the following code fail to compile?",
    "codeSnippet": "class Base {\nprivate:\n    int secret = 100;\n};\n\nclass Derived : public Base {\npublic:\n    void display() {\n        cout << secret << endl;\n    }\n};",
    "code_snippet": "class Base {\nprivate:\n    int secret = 100;\n};\n\nclass Derived : public Base {\npublic:\n    void display() {\n        cout << secret << endl;\n    }\n};",
    "options": [
      "Derived must use private inheritance.",
      "secret is private in Base and cannot be accessed directly by Derived member functions.",
      "Base needs a virtual destructor.",
      "cout cannot print integer member variables."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Private members of a base class are private to that base class and can NEVER be accessed directly by derived classes. To allow derived class access while hiding from the public, `secret` must be declared as `protected`.",
    "companyTags": [
      "TCS Ninja",
      "Infosys",
      "Wipro"
    ],
    "company_tags": [
      "TCS Ninja",
      "Infosys",
      "Wipro"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 19,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-20",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "In a diamond inheritance hierarchy with a virtual base class, which class is responsible for invoking the constructor of the virtual base class?",
    "codeSnippet": "class Top { ... };\nclass Left : virtual public Top { ... };\nclass Right : virtual public Top { ... };\nclass Bottom : public Left, public Right { ... };",
    "code_snippet": "class Top { ... };\nclass Left : virtual public Top { ... };\nclass Right : virtual public Top { ... };\nclass Bottom : public Left, public Right { ... };",
    "options": [
      "Left, because it is the first base class declared in Bottom.",
      "Both Left and Right call it sequentially.",
      "The most derived class (Bottom) directly invokes Top's constructor.",
      "The compiler invokes it through an anonymous wrapper."
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "In C++, the most derived class (here, `Bottom`) is directly responsible for initializing any virtual base classes (`Top`). Intermediate classes (`Left` and `Right`) suppress their calls to `Top`'s constructor when `Bottom` is instantiated.",
    "companyTags": [
      "DE Shaw",
      "Goldman Sachs",
      "Google"
    ],
    "company_tags": [
      "DE Shaw",
      "Goldman Sachs",
      "Google"
    ],
    "difficulty": "HARD",
    "sort_order": 20,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-21",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What makes a C++ class an 'Abstract Class'?",
    "options": [
      "Declaring all member variables as private.",
      "Declaring at least one pure virtual function (`virtual void func() = 0;`).",
      "Inheriting from more than two base classes.",
      "Making the class destructor private."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "A class containing at least one pure virtual function (`= 0`) is an Abstract Class. Instances of abstract classes cannot be directly instantiated.",
    "companyTags": [
      "Accenture",
      "TCS",
      "Capgemini"
    ],
    "company_tags": [
      "Accenture",
      "TCS",
      "Capgemini"
    ],
    "difficulty": "BASIC",
    "sort_order": 21,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-22",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of the following virtual function dispatch code?",
    "codeSnippet": "#include <iostream>\nusing namespace std;\n\nclass Base {\npublic:\n    virtual void print() { cout << \"Base \"; }\n};\n\nclass Derived : public Base {\npublic:\n    void print() override { cout << \"Derived \"; }\n};\n\nint main() {\n    Base* ptr = new Derived();\n    ptr->print();\n    delete ptr;\n    return 0;\n}",
    "code_snippet": "#include <iostream>\nusing namespace std;\n\nclass Base {\npublic:\n    virtual void print() { cout << \"Base \"; }\n};\n\nclass Derived : public Base {\npublic:\n    void print() override { cout << \"Derived \"; }\n};\n\nint main() {\n    Base* ptr = new Derived();\n    ptr->print();\n    delete ptr;\n    return 0;\n}",
    "options": [
      "Base ",
      "Derived ",
      "Base Derived ",
      "Compilation error"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Since `print()` is virtual in `Base` and overridden in `Derived`, calling `ptr->print()` uses runtime dynamic dispatch through `ptr`'s `vptr` and invokes `Derived::print()`, printing `Derived `.",
    "companyTags": [
      "Cognizant",
      "HCL",
      "Mindtree"
    ],
    "company_tags": [
      "Cognizant",
      "HCL",
      "Mindtree"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 22,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-23",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "What catastrophic issue exists when deleting an object of derived type via a base pointer with a non-virtual destructor?",
    "codeSnippet": "class Base { public: ~Base() {} };\nclass Derived : public Base {\n    int* arr = new int[100];\npublic:\n    ~Derived() { delete[] arr; }\n};\n\nBase* b = new Derived();\ndelete b; // What happens?",
    "code_snippet": "class Base { public: ~Base() {} };\nclass Derived : public Base {\n    int* arr = new int[100];\npublic:\n    ~Derived() { delete[] arr; }\n};\n\nBase* b = new Derived();\ndelete b; // What happens?",
    "options": [
      "The program will not compile.",
      "Only Derived's destructor runs, leaking Base members.",
      "Undefined behavior and memory leak: Derived's destructor is never called.",
      "delete b automatically resolves Derived's destructor via RTTI."
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "If a base class destructor is not declared `virtual`, deleting a derived object via a base pointer invokes undefined behavior according to the C++ standard. In practice, only `~Base()` executes, bypassing `~Derived()`, which leaks `arr`.",
    "companyTags": [
      "Amazon",
      "Cisco",
      "Oracle"
    ],
    "company_tags": [
      "Amazon",
      "Cisco",
      "Oracle"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 23,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-24",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of calling a virtual function from inside a base class constructor?",
    "codeSnippet": "#include <iostream>\nusing namespace std;\n\nclass Base {\npublic:\n    Base() { test(); }\n    virtual void test() { cout << \"Base \"; }\n};\n\nclass Derived : public Base {\npublic:\n    void test() override { cout << \"Derived \"; }\n};\n\nint main() {\n    Derived d;\n    return 0;\n}",
    "code_snippet": "#include <iostream>\nusing namespace std;\n\nclass Base {\npublic:\n    Base() { test(); }\n    virtual void test() { cout << \"Base \"; }\n};\n\nclass Derived : public Base {\npublic:\n    void test() override { cout << \"Derived \"; }\n};\n\nint main() {\n    Derived d;\n    return 0;\n}",
    "options": [
      "Derived ",
      "Base ",
      "Base Derived ",
      "Pure virtual method called crash"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "In C++, during the execution of a Base constructor, the Derived portion of the object has not yet been constructed. Hence, the vptr points to the Base vtable, and virtual dispatch calls `Base::test()`, printing `Base `.",
    "companyTags": [
      "Qualcomm",
      "NVIDIA",
      "Microsoft"
    ],
    "company_tags": [
      "Qualcomm",
      "NVIDIA",
      "Microsoft"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 24,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-25",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "On a 64-bit platform, what is `sizeof(Sample)` assuming standard 8-byte pointer alignment?",
    "codeSnippet": "class Sample {\n    int x; // 4 bytes\n    virtual void func() {}\n};",
    "code_snippet": "class Sample {\n    int x; // 4 bytes\n    virtual void func() {}\n};",
    "options": [
      "4 bytes",
      "8 bytes",
      "12 bytes",
      "16 bytes"
    ],
    "correctOptionIndex": 3,
    "correct_option_index": 3,
    "explanation": "The virtual function adds a hidden `vptr` pointer (8 bytes on 64-bit architecture). `x` takes 4 bytes. Due to structure alignment padding to match the 8-byte alignment requirement of the `vptr`, 4 bytes of padding are added: 8 (vptr) + 4 (int) + 4 (padding) = 16 bytes.",
    "companyTags": [
      "Goldman Sachs",
      "Morgan Stanley",
      "Adobe"
    ],
    "company_tags": [
      "Goldman Sachs",
      "Morgan Stanley",
      "Adobe"
    ],
    "difficulty": "HARD",
    "sort_order": 25,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-26",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "What is the difference between the C++11 'override' and 'final' contextual keywords for virtual functions?",
    "options": [
      "override forces runtime binding; final forces compile-time inline binding.",
      "override ensures a function matches a base virtual signature; final prevents further overriding in derived classes.",
      "override can only be used on constructors; final can only be used on destructors.",
      "final makes a function private; override makes it protected."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "`override` instructs the compiler to verify that a base virtual function with the exact same signature exists (preventing subtle mismatch bugs). `final` prevents any derived class from further overriding that virtual function (or inheriting from a class if applied to a class declaration).",
    "companyTags": [
      "Bloomberg",
      "Amazon",
      "Apple"
    ],
    "company_tags": [
      "Bloomberg",
      "Amazon",
      "Apple"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 26,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-27",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Which of the following operators CANNOT be overloaded in C++?",
    "options": [
      "[] (array subscript)",
      "-> (member selection)",
      ". (member access) and :: (scope resolution)",
      "() (function call)"
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "In C++, the following operators cannot be overloaded: `.` (dot), `.*` (pointer-to-member), `::` (scope resolution), `?:` (ternary conditional), and `sizeof`.",
    "companyTags": [
      "TCS",
      "Infosys",
      "Wipro"
    ],
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro"
    ],
    "difficulty": "BASIC",
    "sort_order": 27,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-28",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "How does the C++ compiler distinguish between prefix increment `++obj` and postfix increment `obj++` in operator overloading?",
    "options": [
      "The postfix operator uses the keyword `post`.",
      "The postfix operator takes a dummy `int` parameter (`operator++(int)`).",
      "The prefix operator takes a dummy `int` parameter (`operator++(int)`).",
      "By checking the return type: prefix returns void, postfix returns int."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "C++ disambiguates post-increment by requiring a dummy (unused) `int` argument in the signature: `ReturnType operator++(int);`. Prefix increment takes no arguments: `ReturnType& operator++();`.",
    "companyTags": [
      "Tech Mahindra",
      "Cognizant",
      "LTI"
    ],
    "company_tags": [
      "Tech Mahindra",
      "Cognizant",
      "LTI"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 28,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-29",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of the following custom addition operator code?",
    "codeSnippet": "#include <iostream>\nusing namespace std;\n\nclass Point {\n    int val;\npublic:\n    Point(int v) : val(v) {}\n    Point operator+(const Point& p) {\n        return Point(this->val * 2 + p.val);\n    }\n    int get() const { return val; }\n};\n\nint main() {\n    Point p1(3), p2(4);\n    Point p3 = p1 + p2;\n    cout << p3.get() << endl;\n    return 0;\n}",
    "code_snippet": "#include <iostream>\nusing namespace std;\n\nclass Point {\n    int val;\npublic:\n    Point(int v) : val(v) {}\n    Point operator+(const Point& p) {\n        return Point(this->val * 2 + p.val);\n    }\n    int get() const { return val; }\n};\n\nint main() {\n    Point p1(3), p2(4);\n    Point p3 = p1 + p2;\n    cout << p3.get() << endl;\n    return 0;\n}",
    "options": [
      "7",
      "10",
      "14",
      "Compilation error"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "The overloaded `+` evaluates `this->val * 2 + p.val`. Here `p1` is `this` (`val = 3`) and `p2` is `p` (`val = 4`). Calculation: 3 * 2 + 4 = 10.",
    "companyTags": [
      "Capgemini",
      "Accenture",
      "TCS Digital"
    ],
    "company_tags": [
      "Capgemini",
      "Accenture",
      "TCS Digital"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 29,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-30",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "Why must stream insertion `operator<<` (for `cout << obj;`) typically be overloaded as a non-member (often friend) function rather than a member function?",
    "options": [
      "Member functions cannot return references.",
      "The left-hand operand is `std::ostream&`, not the user-defined class object.",
      "Stream operators cannot access private variables.",
      "C++ forbids overloading bitwise shift operators as class members."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "In an expression like `cout << obj;`, the left-hand operand is `cout` (an instance of `std::ostream`). If overloaded as a member function, it would have to belong to `std::ostream` (which users cannot modify). Therefore, it must be a standalone non-member function taking `ostream&` as its first parameter.",
    "companyTags": [
      "Amazon",
      "Flipkart",
      "Cisco"
    ],
    "company_tags": [
      "Amazon",
      "Flipkart",
      "Cisco"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 30,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-31",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "CODE_COMPLETION",
    "question_type": "CODE_COMPLETION",
    "question": "In a robust copy-assignment operator (`operator=`), which check is essential to prevent memory corruption when assigning an object to itself?",
    "codeSnippet": "Array& Array::operator=(const Array& other) {\n    // Which line belongs here?\n    delete[] data;\n    data = new int[other.size];\n    ...\n    return *this;\n}",
    "code_snippet": "Array& Array::operator=(const Array& other) {\n    // Which line belongs here?\n    delete[] data;\n    data = new int[other.size];\n    ...\n    return *this;\n}",
    "options": [
      "if (data == other.data) return *this;",
      "if (this == &other) return *this;",
      "if (sizeof(*this) == sizeof(other)) return *this;",
      "if (other.data != nullptr) return *this;"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Self-assignment check (`if (this == &other) return *this;`) is critical. Without it, `a = a;` would execute `delete[] data;`, deallocating its own memory before trying to read from `other.data`, causing undefined behavior.",
    "companyTags": [
      "Microsoft",
      "Goldman Sachs",
      "DE Shaw"
    ],
    "company_tags": [
      "Microsoft",
      "Goldman Sachs",
      "DE Shaw"
    ],
    "difficulty": "HARD",
    "sort_order": 31,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-32",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "At what stage does the C++ compiler generate executable code for a template function or class?",
    "options": [
      "At runtime when the function is first invoked.",
      "During compile time when the template is instantiated with concrete types.",
      "During preprocessing before code parsing.",
      "During linking when object files are merged."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "C++ templates are instantiated at compile time. The compiler generates specialized machine code for each unique set of template arguments used in the codebase.",
    "companyTags": [
      "TCS Ninja",
      "Infosys",
      "Cognizant"
    ],
    "company_tags": [
      "TCS Ninja",
      "Infosys",
      "Cognizant"
    ],
    "difficulty": "BASIC",
    "sort_order": 32,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-33",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of the following template specialization program?",
    "codeSnippet": "#include <iostream>\nusing namespace std;\n\ntemplate <typename T>\nvoid print(T val) {\n    cout << \"General \";\n}\n\ntemplate <>\nvoid print<int>(int val) {\n    cout << \"Specialized \";\n}\n\nint main() {\n    print(10);\n    print(3.14);\n    return 0;\n}",
    "code_snippet": "#include <iostream>\nusing namespace std;\n\ntemplate <typename T>\nvoid print(T val) {\n    cout << \"General \";\n}\n\ntemplate <>\nvoid print<int>(int val) {\n    cout << \"Specialized \";\n}\n\nint main() {\n    print(10);\n    print(3.14);\n    return 0;\n}",
    "options": [
      "General General ",
      "Specialized Specialized ",
      "Specialized General ",
      "General Specialized "
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "`print(10)` passes an `int`, matching the full template specialization `print<int>`, so it prints `Specialized `. `print(3.14)` passes a `double`, matching the generic template, printing `General `.",
    "companyTags": [
      "Adobe",
      "Oracle",
      "Cisco"
    ],
    "company_tags": [
      "Adobe",
      "Oracle",
      "Cisco"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 33,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-34",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "What issue occurs if a template class declaration is placed in a `.h` file and its member function definitions are placed in a separate `.cpp` file?",
    "options": [
      "Compilation error: templates cannot be declared inside header files.",
      "Linker error (unresolved external symbol) in translation units that instantiate the template.",
      "Runtime segmentation fault upon instantiation.",
      "The compiler automatically inlines all methods into the executable without issue."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Because templates are compiled upon instantiation, the compiler needs access to the full template definitions in each translation unit where they are used. Placing definitions in a `.cpp` file prevents other files from instantiating them, causing a linker error.",
    "companyTags": [
      "Google",
      "Amazon",
      "Samsung"
    ],
    "company_tags": [
      "Google",
      "Amazon",
      "Samsung"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 34,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-35",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "What is a 'non-type template parameter' in C++?",
    "codeSnippet": "template <typename T, int Size>\nclass FixedArray { ... };",
    "code_snippet": "template <typename T, int Size>\nclass FixedArray { ... };",
    "options": [
      "A parameter that can accept any custom class without copy constructors.",
      "A parameter whose value is a compile-time constant (such as an integer, pointer, or enum) rather than a type.",
      "A parameter evaluated dynamically at runtime via RTTI.",
      "A variadic template pack parameter."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Non-type template parameters represent compile-time constant values (e.g., integral types, pointers, references, or enums like `int Size` in `std::array<T, N>`) rather than data types.",
    "companyTags": [
      "Qualcomm",
      "NVIDIA",
      "DE Shaw"
    ],
    "company_tags": [
      "Qualcomm",
      "NVIDIA",
      "DE Shaw"
    ],
    "difficulty": "HARD",
    "sort_order": 35,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-36",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Which C++ smart pointer represents exclusive ownership of a dynamically allocated resource and cannot be copied?",
    "options": [
      "std::shared_ptr",
      "std::weak_ptr",
      "std::unique_ptr",
      "std::auto_ptr"
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "`std::unique_ptr` enforces strict single/exclusive ownership. Its copy constructor and copy assignment operators are explicitly deleted (`= delete`). Ownership can only be transferred via move semantics (`std::move`).",
    "companyTags": [
      "TCS Digital",
      "Infosys SP",
      "Accenture"
    ],
    "company_tags": [
      "TCS Digital",
      "Infosys SP",
      "Accenture"
    ],
    "difficulty": "BASIC",
    "sort_order": 36,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-37",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the primary role of 'std::weak_ptr' in modern C++?",
    "options": [
      "To speed up allocation performance of unique_ptr.",
      "To break cyclic references (circular dependencies) between std::shared_ptr instances.",
      "To allow raw pointer arithmetic on shared memory.",
      "To automatically serialize objects to disk."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "When two objects reference each other with `std::shared_ptr`, a circular reference occurs, preventing the reference count from ever reaching zero (causing a permanent memory leak). `std::weak_ptr` holds a non-owning reference to break the cycle.",
    "companyTags": [
      "Amazon",
      "Cisco",
      "Paytm"
    ],
    "company_tags": [
      "Amazon",
      "Cisco",
      "Paytm"
    ],
    "difficulty": "BASIC",
    "sort_order": 37,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-38",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of the following lambda expression with capture by value?",
    "codeSnippet": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int a = 10;\n    auto func = [a]() mutable {\n        a += 5;\n        cout << a << \" \";\n    };\n    func();\n    cout << a << endl;\n    return 0;\n}",
    "code_snippet": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int a = 10;\n    auto func = [a]() mutable {\n        a += 5;\n        cout << a << \" \";\n    };\n    func();\n    cout << a << endl;\n    return 0;\n}",
    "options": [
      "15 15",
      "15 10",
      "10 10",
      "Compilation error"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "The lambda captures `a` by value (`[a]`). Inside the lambda, `a` is an internal copy. The `mutable` keyword allows modifying this copy, printing `15 `. However, the original `a` in `main()` remains untouched (`10`). Output: `15 10`.",
    "companyTags": [
      "Microsoft",
      "Adobe",
      "Cognizant GenC Next"
    ],
    "company_tags": [
      "Microsoft",
      "Adobe",
      "Cognizant GenC Next"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 38,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-39",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What happens when moving from a `std::unique_ptr`?",
    "codeSnippet": "#include <iostream>\n#include <memory>\nusing namespace std;\n\nint main() {\n    unique_ptr<int> p1 = make_unique<int>(100);\n    unique_ptr<int> p2 = move(p1);\n    if (!p1) {\n        cout << \"Null \";\n    }\n    cout << *p2 << endl;\n    return 0;\n}",
    "code_snippet": "#include <iostream>\n#include <memory>\nusing namespace std;\n\nint main() {\n    unique_ptr<int> p1 = make_unique<int>(100);\n    unique_ptr<int> p2 = move(p1);\n    if (!p1) {\n        cout << \"Null \";\n    }\n    cout << *p2 << endl;\n    return 0;\n}",
    "options": [
      "100 100",
      "Null 100",
      "Null Null",
      "Crash at runtime"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "`std::move(p1)` transfers the underlying pointer ownership to `p2`. After the move, `p1` becomes empty (`nullptr`), while `p2` holds the allocated value `100`. The output is `Null 100`.",
    "companyTags": [
      "Oracle",
      "Goldman Sachs",
      "Intuit"
    ],
    "company_tags": [
      "Oracle",
      "Goldman Sachs",
      "Intuit"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 39,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-40",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "What is the bug in the following C++ code involving auto and rvalue references?",
    "codeSnippet": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int x = 10;\n    int&& r1 = 20; // OK\n    int&& r2 = x;  // Line 7\n    return 0;\n}",
    "code_snippet": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int x = 10;\n    int&& r1 = 20; // OK\n    int&& r2 = x;  // Line 7\n    return 0;\n}",
    "options": [
      "Line 6 is invalid; rvalue references cannot bind to literals.",
      "Line 7 fails to compile: an rvalue reference (int&&) cannot bind to an lvalue (x).",
      "x must be declared const to bind to an rvalue reference.",
      "Cannot have two rvalue references in the same scope."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "An rvalue reference (`int&&`) can only bind to temporary rvalues (like literals or temporary objects), NOT to named lvalues (`x`). To bind an lvalue to an rvalue reference, one must explicitly cast it via `std::move(x)`.",
    "companyTags": [
      "Amazon",
      "Uber",
      "Tower Research"
    ],
    "company_tags": [
      "Amazon",
      "Uber",
      "Tower Research"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 40,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-41",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the key advantage of 'std::make_shared' over directly writing 'std::shared_ptr<T>(new T(...))'?",
    "options": [
      "std::make_shared prevents multithreaded race conditions entirely.",
      "std::make_shared performs a single combined heap allocation for both the managed object and the control block.",
      "std::make_shared enables dynamic casting to derived classes automatically.",
      "std::make_shared bypasses the class constructor for faster performance."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "`std::make_shared` allocates memory for both the control block (reference counters) and the object in a single contiguous memory allocation, improving cache locality and reducing heap allocation overhead compared to `shared_ptr(new T)`, which requires two separate allocations.",
    "companyTags": [
      "DE Shaw",
      "Google",
      "Bloomberg"
    ],
    "company_tags": [
      "DE Shaw",
      "Google",
      "Bloomberg"
    ],
    "difficulty": "HARD",
    "sort_order": 41,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-42",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What underlying data structure is typically used to implement 'std::map' in standard C++ libraries?",
    "options": [
      "Hash table with bucket chaining",
      "Red-Black Tree (Self-balancing Binary Search Tree)",
      "Doubly linked list with skip pointers",
      "Dynamic contiguous array"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "`std::map` is ordered and guarantees $O(\\log n)$ search, insertion, and deletion. It is almost universally implemented as a Red-Black Tree. In contrast, `std::unordered_map` is based on hash tables.",
    "companyTags": [
      "TCS Prime",
      "Cognizant",
      "Infosys"
    ],
    "company_tags": [
      "TCS Prime",
      "Cognizant",
      "Infosys"
    ],
    "difficulty": "BASIC",
    "sort_order": 42,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-43",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the difference between `v.size()` and `v.capacity()` for a `std::vector` in C++?",
    "options": [
      "size is the allocated memory in bytes; capacity is the number of elements.",
      "size is the number of elements currently stored; capacity is the total number of elements it can hold before needing reallocation.",
      "size is fixed at compile time; capacity grows dynamically.",
      "They are always identical."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "`size()` returns the actual count of elements currently in the vector. `capacity()` returns the count of elements the vector can hold in its currently allocated memory buffer before a new, larger buffer must be allocated.",
    "companyTags": [
      "Accenture",
      "Wipro",
      "HCL"
    ],
    "company_tags": [
      "Accenture",
      "Wipro",
      "HCL"
    ],
    "difficulty": "BASIC",
    "sort_order": 43,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-44",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of inserting duplicate keys into a `std::map` using the `insert()` method?",
    "codeSnippet": "#include <iostream>\n#include <map>\nusing namespace std;\n\nint main() {\n    map<int, string> m;\n    m.insert({1, \"Apple\"});\n    m.insert({1, \"Banana\"});\n    cout << m[1] << \" \" << m.size() << endl;\n    return 0;\n}",
    "code_snippet": "#include <iostream>\n#include <map>\nusing namespace std;\n\nint main() {\n    map<int, string> m;\n    m.insert({1, \"Apple\"});\n    m.insert({1, \"Banana\"});\n    cout << m[1] << \" \" << m.size() << endl;\n    return 0;\n}",
    "options": [
      "Banana 1",
      "Apple 1",
      "Banana 2",
      "Compilation error"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "`map::insert()` inserts an element only if the key does not already exist. Because key 1 already exists with value \"Apple\", the second insert fails silently and is ignored. `m[1]` remains \"Apple\", and `m.size()` is 1.",
    "companyTags": [
      "Amazon",
      "Flipkart",
      "Walmart"
    ],
    "company_tags": [
      "Amazon",
      "Flipkart",
      "Walmart"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 44,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-45",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "Why is the loop below dangerous (Iterator Invalidation bug)?",
    "codeSnippet": "#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> v = {1, 2, 3, 4, 5};\n    for (auto it = v.begin(); it != v.end(); ++it) {\n        if (*it == 3) {\n            v.erase(it);\n        }\n    }\n    return 0;\n}",
    "code_snippet": "#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> v = {1, 2, 3, 4, 5};\n    for (auto it = v.begin(); it != v.end(); ++it) {\n        if (*it == 3) {\n            v.erase(it);\n        }\n    }\n    return 0;\n}",
    "options": [
      "vector does not support the erase() method.",
      "erase(it) invalidates 'it' and all subsequent iterators; continuing the loop causes undefined behavior.",
      "auto cannot deduce vector iterator types.",
      "v.end() is evaluated once before the loop starts and never updates."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "`v.erase(it)` invalidates the iterator `it` and all iterators after it. Performing `++it` on an invalidated iterator causes undefined behavior (often crashing). The safe idiom is `it = v.erase(it);` or `std::erase(v, 3)` in C++20.",
    "companyTags": [
      "Goldman Sachs",
      "Morgan Stanley",
      "Microsoft"
    ],
    "company_tags": [
      "Goldman Sachs",
      "Morgan Stanley",
      "Microsoft"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 45,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-46",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Which C++ STL container guarantees that inserting an element NEVER invalidates existing pointers, references, or iterators to other elements?",
    "options": [
      "std::vector",
      "std::deque",
      "std::list",
      "std::string"
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "`std::list` is implemented as a doubly linked list. Because each node is allocated independently on the heap, inserting or erasing elements does not reallocate or move existing nodes, guaranteeing pointer/reference/iterator stability.",
    "companyTags": [
      "Cisco",
      "NVIDIA",
      "Qualcomm"
    ],
    "company_tags": [
      "Cisco",
      "NVIDIA",
      "Qualcomm"
    ],
    "difficulty": "HARD",
    "sort_order": 46,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-47",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the difference between `delete ptr;` and `delete[] ptr;` in C++?",
    "options": [
      "delete is for primitive types; delete[] is for user-defined classes.",
      "delete deallocates a single object; delete[] invokes destructors for each element of an array and deallocates the array.",
      "delete is deprecated in C++11; delete[] is the standard replacement.",
      "They are completely interchangeable under modern compilers."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "`new[]` allocates an array and records the element count (cookie). Calling `delete[]` invokes the destructor on every single element before freeing the memory buffer. Calling `delete` on an array pointer invokes undefined behavior.",
    "companyTags": [
      "TCS",
      "Accenture",
      "Cognizant"
    ],
    "company_tags": [
      "TCS",
      "Accenture",
      "Cognizant"
    ],
    "difficulty": "BASIC",
    "sort_order": 47,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-48",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output when an exception unwinds the stack in C++?",
    "codeSnippet": "#include <iostream>\nusing namespace std;\n\nclass Trace {\npublic:\n    ~Trace() { cout << \"Destruct \"; }\n};\n\nvoid test() {\n    Trace t;\n    throw 20;\n}\n\nint main() {\n    try {\n        test();\n    } catch (int e) {\n        cout << \"Caught: \" << e << endl;\n    }\n    return 0;\n}",
    "code_snippet": "#include <iostream>\nusing namespace std;\n\nclass Trace {\npublic:\n    ~Trace() { cout << \"Destruct \"; }\n};\n\nvoid test() {\n    Trace t;\n    throw 20;\n}\n\nint main() {\n    try {\n        test();\n    } catch (int e) {\n        cout << \"Caught: \" << e << endl;\n    }\n    return 0;\n}",
    "options": [
      "Caught: 20 Destruct ",
      "Destruct Caught: 20",
      "Caught: 20 ",
      "Abnormal program termination"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Stack unwinding guarantees that as the stack frame of `test()` is exited due to an unhandled exception, local automatic objects (`t`) have their destructors called before the exception handler (`catch`) executes. Output: `Destruct Caught: 20`.",
    "companyTags": [
      "Amazon",
      "Microsoft",
      "Adobe"
    ],
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Adobe"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 48,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-49",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "Why should destructors NEVER throw exceptions in C++?",
    "options": [
      "Because destructors cannot have try-catch blocks.",
      "If an exception is thrown from a destructor during stack unwinding of another exception, `std::terminate()` is immediately called.",
      "Because destructors do not have return types.",
      "Throwing an exception leaves the destructor in an infinite loop."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "If a destructor throws an exception while the stack is already unwinding due to an active in-flight exception, C++ cannot handle two active exceptions simultaneously and immediately aborts the program via `std::terminate()`. In C++11 and later, destructors are `noexcept(true)` by default.",
    "companyTags": [
      "DE Shaw",
      "Morgan Stanley",
      "Google"
    ],
    "company_tags": [
      "DE Shaw",
      "Morgan Stanley",
      "Google"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 49,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "cpp-mcq-50",
    "topicId": "mcq-cpp-programming",
    "topic_id": "mcq-cpp-programming",
    "topic": "C++ Language",
    "topic_name": "C++ Language",
    "topicCategory": "CPP_PROGRAMMING",
    "topic_category": "CPP_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the 'Rule of Zero' in modern C++ software architecture?",
    "options": [
      "A class should never have zero members.",
      "All pointers in a class must be initialized to 0/nullptr.",
      "Classes that manage resources should rely on existing RAII types (smart pointers, containers) and declare ZERO custom destructor, copy, or move operations.",
      "Every virtual function must be assigned to = 0."
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "The Rule of Zero states that if a class does not directly manage raw resources (and instead composes standard RAII wrappers like `std::string`, `std::vector`, or `std::unique_ptr`), it should declare NONE of the special member functions (destructor, copy/move constructors, copy/move assignment). The compiler-generated defaults will correctly and safely manage lifetime.",
    "companyTags": [
      "Microsoft",
      "Google",
      "Bloomberg"
    ],
    "company_tags": [
      "Microsoft",
      "Google",
      "Bloomberg"
    ],
    "difficulty": "HARD",
    "sort_order": 50,
    "is_hidden": false,
    "is_deleted": false
  }
];

export const JAVA_PROGRAMMING_MCQ_SEED: TechnicalMcq[] = [
  {
    "id": "java-mcq-01",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Which component of the Java Virtual Machine (JVM) is responsible for converting bytecode into native machine instructions at runtime for frequently executed hot spots?",
    "options": [
      "ClassLoader Subsystem",
      "Just-In-Time (JIT) Compiler",
      "Garbage Collector (GC)",
      "Java Native Interface (JNI)"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "The JIT (Just-In-Time) compiler is part of the JVM execution engine. It monitors code execution, identifies 'hot spots' (frequently executed code segments), and compiles that bytecode directly into optimized native machine code for faster execution.",
    "companyTags": [
      "TCS Ninja",
      "Cognizant",
      "Wipro"
    ],
    "company_tags": [
      "TCS Ninja",
      "Cognizant",
      "Wipro"
    ],
    "difficulty": "BASIC",
    "sort_order": 1,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-02",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "What is the size and default value of a 'boolean' primitive instance variable in Java?",
    "options": [
      "1 byte, default value true",
      "1 bit, default value 0",
      "JVM-dependent (typically 1 byte in memory), default value false",
      "2 bytes, default value null"
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "In Java, the JVM specification does not define an exact size for `boolean` in memory (typically represented as 1 byte on the heap, or 4-byte integers on the operand stack). The default value for boolean member variables of an uninitialized object is `false`.",
    "companyTags": [
      "Infosys",
      "Capgemini",
      "Accenture"
    ],
    "company_tags": [
      "Infosys",
      "Capgemini",
      "Accenture"
    ],
    "difficulty": "BASIC",
    "sort_order": 2,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-03",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of the following typecasting and compound assignment snippet in Java?",
    "codeSnippet": "public class Main {\n    public static void main(String[] args) {\n        byte b = 10;\n        b += 5; // Line 4\n        // b = b + 5; // Line 5\n        System.out.println(b);\n    }\n}",
    "code_snippet": "public class Main {\n    public static void main(String[] args) {\n        byte b = 10;\n        b += 5; // Line 4\n        // b = b + 5; // Line 5\n        System.out.println(b);\n    }\n}",
    "options": [
      "Compilation error on Line 4 due to loss of precision.",
      "15",
      "Compilation error on both Line 4 and Line 5.",
      "Runtime ClassCastException."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "In Java, compound assignment operators (`E1 op= E2`) automatically cast the result to the type of the left-hand operand (`b = (byte)(b + 5)`). Therefore, Line 4 compiles cleanly and outputs 15. In contrast, `b = b + 5` (Line 5) would fail to compile because arithmetic on bytes promotes operands to `int`.",
    "companyTags": [
      "TCS Digital",
      "Mindtree",
      "LTI"
    ],
    "company_tags": [
      "TCS Digital",
      "Mindtree",
      "LTI"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 3,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-04",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "Why does the following Java code fail to compile?",
    "codeSnippet": "public class Test {\n    public static void main(String[] args) {\n        int x;\n        if (args.length > 0) {\n            x = 10;\n        }\n        System.out.println(x); // Error here\n    }\n}",
    "code_snippet": "public class Test {\n    public static void main(String[] args) {\n        int x;\n        if (args.length > 0) {\n            x = 10;\n        }\n        System.out.println(x); // Error here\n    }\n}",
    "options": [
      "args array cannot be checked with .length.",
      "Variable 'x' might not have been initialized before being read.",
      "x must be declared static to be printed in main.",
      "main method cannot take parameters in modern Java."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Unlike instance/static fields which receive default values (0, null, false), local variables in Java are allocated on the stack and receive NO default values. If there is any code execution path where a local variable might not be assigned before read, the compiler issues: 'variable x might not have been initialized'.",
    "companyTags": [
      "Amazon",
      "Cisco",
      "Paytm"
    ],
    "company_tags": [
      "Amazon",
      "Cisco",
      "Paytm"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 4,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-05",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Which principle does the standard Java ClassLoader hierarchy enforce to prevent a rogue application from replacing core classes like `java.lang.Object`?",
    "options": [
      "Double-Checked Locking Model",
      "Parent Delegation Model",
      "Lazy Initialization Model",
      "Bytecode Verification Sandbox"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "The Parent Delegation Model dictates that when a ClassLoader receives a request to load a class, it delegates the request to its parent classloader first, up to the Bootstrap ClassLoader. Only if parent classloaders fail to locate the class does the child attempt to load it, ensuring trusted core Java libraries cannot be overridden.",
    "companyTags": [
      "Oracle",
      "Goldman Sachs",
      "Morgan Stanley"
    ],
    "company_tags": [
      "Oracle",
      "Goldman Sachs",
      "Morgan Stanley"
    ],
    "difficulty": "HARD",
    "sort_order": 5,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-06",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Why are String objects immutable in Java?",
    "options": [
      "To prevent String from being serialized across networks.",
      "To enable String Constant Pool caching, thread safety, and secure hashing for HashMaps.",
      "Because Java does not support heap memory reallocation.",
      "To allow Strings to be inherited by StringBuilder."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "String immutability provides three critical advantages: 1) String Pool optimization (multiple variables sharing the same literal safely), 2) Security (passwords, URLs, and file paths cannot be altered maliciously after verification), and 3) Thread safety with cached `hashCode()` for instant HashMap lookups.",
    "companyTags": [
      "TCS",
      "Infosys",
      "Cognizant"
    ],
    "company_tags": [
      "TCS",
      "Infosys",
      "Cognizant"
    ],
    "difficulty": "BASIC",
    "sort_order": 6,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-07",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the exact output of comparing String references created via literals versus new keyword?",
    "codeSnippet": "public class StringTest {\n    public static void main(String[] args) {\n        String s1 = \"Java\";\n        String s2 = \"Java\";\n        String s3 = new String(\"Java\");\n        String s4 = s3.intern();\n        \n        System.out.println((s1 == s2) + \" \" + (s1 == s3) + \" \" + (s1 == s4));\n    }\n}",
    "code_snippet": "public class StringTest {\n    public static void main(String[] args) {\n        String s1 = \"Java\";\n        String s2 = \"Java\";\n        String s3 = new String(\"Java\");\n        String s4 = s3.intern();\n        \n        System.out.println((s1 == s2) + \" \" + (s1 == s3) + \" \" + (s1 == s4));\n    }\n}",
    "options": [
      "true true true",
      "true false true",
      "false false false",
      "true false false"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "1. `s1` and `s2` refer to the same literal in the String Constant Pool (SCP), so `s1 == s2` is true.\n2. `s3` creates a new explicit object in the general heap, so `s1 == s3` is false.\n3. `s3.intern()` returns the canonical reference from the SCP (which is `s1`), so `s1 == s4` is true.\nOutput is `true false true`.",
    "companyTags": [
      "Amazon",
      "Flipkart",
      "Optum"
    ],
    "company_tags": [
      "Amazon",
      "Flipkart",
      "Optum"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 7,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-08",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the primary architectural difference between StringBuilder and StringBuffer in Java?",
    "options": [
      "StringBuilder is thread-safe with synchronized methods; StringBuffer is non-synchronized and faster.",
      "StringBuffer is thread-safe with synchronized methods; StringBuilder is non-synchronized and faster.",
      "StringBuilder stores UTF-8 characters; StringBuffer stores ASCII characters.",
      "StringBuffer is immutable; StringBuilder is mutable."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "`StringBuffer` (since Java 1.0) has synchronized methods, making it thread-safe but introducing lock overhead. `StringBuilder` (introduced in Java 1.5) removes synchronization, making it significantly faster for single-threaded string concatenation.",
    "companyTags": [
      "Accenture",
      "HCL",
      "Wipro"
    ],
    "company_tags": [
      "Accenture",
      "HCL",
      "Wipro"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 8,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-09",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What will be printed by the following string concatenation evaluation?",
    "codeSnippet": "public class ConcatTest {\n    public static void main(String[] args) {\n        System.out.println(10 + 20 + \"Hello\" + 30 + 40);\n    }\n}",
    "code_snippet": "public class ConcatTest {\n    public static void main(String[] args) {\n        System.out.println(10 + 20 + \"Hello\" + 30 + 40);\n    }\n}",
    "options": [
      "1020Hello3040",
      "30Hello70",
      "30Hello3040",
      "Compilation error"
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "Operators in Java evaluate from left to right: 1) `10 + 20` performs integer addition = `30`. 2) `30 + \"Hello\"` performs string concatenation = `\"30Hello\"`. 3) Once a String is formed, subsequent `+` operations treat remaining numbers as strings: `\"30Hello\" + 30` = `\"30Hello30\"`, and then `+ 40` = `\"30Hello3040\"`.",
    "companyTags": [
      "TCS Ninja",
      "Capgemini",
      "Tech Mahindra"
    ],
    "company_tags": [
      "TCS Ninja",
      "Capgemini",
      "Tech Mahindra"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 9,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-10",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "How many total String objects are created in memory (Heap + String Constant Pool) by executing the line below assuming 'Java' was NOT previously in the pool?",
    "codeSnippet": "String s = new String(\"Java\");",
    "code_snippet": "String s = new String(\"Java\");",
    "options": [
      "1 object (only in the Heap)",
      "1 object (only in the String Constant Pool)",
      "2 objects (one in the String Constant Pool and one in the general Heap)",
      "3 objects (Heap, SCP, and char array reference)"
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "Executing `new String(\"Java\")` creates 2 objects: 1) The string literal `\"Java\"` is created in the String Constant Pool (if not already present), and 2) the `new` operator allocates a distinct String object on the general heap holding the reference to that pool data.",
    "companyTags": [
      "Microsoft",
      "Adobe",
      "DE Shaw"
    ],
    "company_tags": [
      "Microsoft",
      "Adobe",
      "DE Shaw"
    ],
    "difficulty": "HARD",
    "sort_order": 10,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-11",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "Which constructor call must be the FIRST statement in a child class constructor in Java?",
    "options": [
      "super() or this()",
      "init()",
      "Class.forName()",
      "Object.clone()"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In Java, an explicit constructor call (`super(...)` to invoke a parent constructor or `this(...)` to chain an overloaded constructor) MUST be the very first statement in the constructor body. If neither is written, the compiler automatically inserts `super()`.",
    "companyTags": [
      "TCS",
      "Cognizant",
      "Infosys"
    ],
    "company_tags": [
      "TCS",
      "Cognizant",
      "Infosys"
    ],
    "difficulty": "BASIC",
    "sort_order": 11,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-12",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of the following polymorphic method invocation versus variable shadowing code?",
    "codeSnippet": "class Parent {\n    int x = 10;\n    void show() { System.out.print(\"ParentShow \"); }\n}\n\nclass Child extends Parent {\n    int x = 20;\n    void show() { System.out.print(\"ChildShow \"); }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Parent p = new Child();\n        System.out.print(p.x + \" \");\n        p.show();\n    }\n}",
    "code_snippet": "class Parent {\n    int x = 10;\n    void show() { System.out.print(\"ParentShow \"); }\n}\n\nclass Child extends Parent {\n    int x = 20;\n    void show() { System.out.print(\"ChildShow \"); }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Parent p = new Child();\n        System.out.print(p.x + \" \");\n        p.show();\n    }\n}",
    "options": [
      "20 ChildShow ",
      "10 ChildShow ",
      "10 ParentShow ",
      "20 ParentShow "
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "In Java: 1) Variables are NOT polymorphic; variable access is resolved at compile time based on the reference type (`Parent p`, so `p.x` accesses `Parent.x = 10`). 2) Instance methods ARE polymorphic; method invocation is resolved at runtime based on the actual object (`new Child()`, so `p.show()` calls `Child.show()`). Output: `10 ChildShow `.",
    "companyTags": [
      "Amazon",
      "Adobe",
      "Qualcomm"
    ],
    "company_tags": [
      "Amazon",
      "Adobe",
      "Qualcomm"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 12,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-13",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What happens when a static method is declared with the same signature in both Parent and Child classes (Method Hiding)?",
    "codeSnippet": "class A {\n    static void display() { System.out.print(\"A \"); }\n}\nclass B extends A {\n    static void display() { System.out.print(\"B \"); }\n}\npublic class Test {\n    public static void main(String[] args) {\n        A obj = new B();\n        obj.display();\n    }\n}",
    "code_snippet": "class A {\n    static void display() { System.out.print(\"A \"); }\n}\nclass B extends A {\n    static void display() { System.out.print(\"B \"); }\n}\npublic class Test {\n    public static void main(String[] args) {\n        A obj = new B();\n        obj.display();\n    }\n}",
    "options": [
      "B ",
      "A ",
      "Compilation error: cannot override static methods",
      "A B "
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Static methods cannot be overridden in Java; they are hidden. Because static methods belong to the class and are resolved at compile time based on the reference type (`A obj`), calling `obj.display()` invokes `A.display()`, printing `A `.",
    "companyTags": [
      "Cognizant GenC Next",
      "HCL",
      "Mindtree"
    ],
    "company_tags": [
      "Cognizant GenC Next",
      "HCL",
      "Mindtree"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 13,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-14",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "What rule does the following method overriding attempt violate?",
    "codeSnippet": "class Parent {\n    protected void process() {}\n}\nclass Child extends Parent {\n    void process() {} // Error here\n}",
    "code_snippet": "class Parent {\n    protected void process() {}\n}\nclass Child extends Parent {\n    void process() {} // Error here\n}",
    "options": [
      "Child method must be declared static.",
      "An overriding method cannot reduce the visibility of the inherited method (protected cannot become default/package-private).",
      "Child method must return boolean.",
      "process() must be declared final in Parent."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "In Java, an overriding method cannot assign weaker access privileges than the overridden method in the superclass. `protected` in Parent cannot be reduced to `default` (package-private) in Child. It can only stay `protected` or be widened to `public`.",
    "companyTags": [
      "TCS Digital",
      "Infosys SP",
      "Capgemini"
    ],
    "company_tags": [
      "TCS Digital",
      "Infosys SP",
      "Capgemini"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 14,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-15",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is 'Covariant Return Type' introduced in Java 5?",
    "codeSnippet": "class SuperClass {\n    SuperClass get() { return this; }\n}\nclass SubClass extends SuperClass {\n    SubClass get() { return this; } // Valid?\n}",
    "code_snippet": "class SuperClass {\n    SuperClass get() { return this; }\n}\nclass SubClass extends SuperClass {\n    SubClass get() { return this; } // Valid?\n}",
    "options": [
      "A method returning void can be overridden to return an int.",
      "An overriding method can return a subtype of the return type declared in the overridden superclass method.",
      "A method can return multiple values using tuples.",
      "Overriding methods must return Object in all subclasses."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Covariant return type allows an overriding method in a subclass to declare a return type that is a subtype (derived class) of the return type declared in the superclass method, eliminating the need for client-side downcasting.",
    "companyTags": [
      "Google",
      "Bloomberg",
      "Goldman Sachs"
    ],
    "company_tags": [
      "Google",
      "Bloomberg",
      "Goldman Sachs"
    ],
    "difficulty": "HARD",
    "sort_order": 15,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-16",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "What are the implicit modifiers for variables declared inside an interface in Java?",
    "codeSnippet": "interface Constants {\n    int MAX = 100;\n}",
    "code_snippet": "interface Constants {\n    int MAX = 100;\n}",
    "options": [
      "private static final",
      "public static final",
      "protected final",
      "public volatile"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Every field declared inside an interface is automatically and implicitly `public static final`. They are compile-time constants.",
    "companyTags": [
      "Wipro",
      "Tech Mahindra",
      "Accenture"
    ],
    "company_tags": [
      "Wipro",
      "Tech Mahindra",
      "Accenture"
    ],
    "difficulty": "BASIC",
    "sort_order": 16,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-17",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is a 'Functional Interface' in Java 8?",
    "options": [
      "An interface that contains only static utility methods.",
      "An interface containing exactly one abstract method (Single Abstract Method - SAM).",
      "An interface with no methods at all.",
      "An interface that cannot be implemented by classes."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "A Functional Interface contains exactly one abstract method (Single Abstract Method / SAM), making it eligible for lambda expressions and method references. It may contain any number of `default` or `static` methods.",
    "companyTags": [
      "Amazon",
      "Cisco",
      "Optum"
    ],
    "company_tags": [
      "Amazon",
      "Cisco",
      "Optum"
    ],
    "difficulty": "BASIC",
    "sort_order": 17,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-18",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "How does Java 8 resolve ambiguity when a class implements two interfaces that provide conflicting default methods with the same signature?",
    "codeSnippet": "interface A { default void hello() { System.out.print(\"A\"); } }\ninterface B { default void hello() { System.out.print(\"B\"); } }\n\nclass C implements A, B {\n    public void hello() {\n        A.super.hello();\n        System.out.print(\"C\");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        new C().hello();\n    }\n}",
    "code_snippet": "interface A { default void hello() { System.out.print(\"A\"); } }\ninterface B { default void hello() { System.out.print(\"B\"); } }\n\nclass C implements A, B {\n    public void hello() {\n        A.super.hello();\n        System.out.print(\"C\");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        new C().hello();\n    }\n}",
    "options": [
      "AC",
      "BC",
      "Compilation error: conflicting default methods cannot be resolved",
      "ABC"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "When two interfaces have conflicting default methods, the implementing class MUST explicitly override the method to resolve ambiguity. It can invoke a specific interface's default implementation using `InterfaceName.super.methodName()`. Here `A.super.hello()` prints \"A\", followed by \"C\", outputting `AC`.",
    "companyTags": [
      "Morgan Stanley",
      "Societe Generale",
      "Barclays"
    ],
    "company_tags": [
      "Morgan Stanley",
      "Societe Generale",
      "Barclays"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 18,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-19",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "Which statement about abstract classes in Java is FALSE?",
    "options": [
      "An abstract class can have constructors.",
      "An abstract class can contain concrete (implemented) methods.",
      "An abstract class can be declared with the 'final' keyword.",
      "A class can be declared abstract even if it contains no abstract methods."
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "An abstract class can NEVER be declared `final`. An abstract class is designed specifically to be inherited and extended by subclasses, while `final` explicitly forbids inheritance. Combining them produces a compile-time error: 'illegal combination of modifiers: abstract and final'.",
    "companyTags": [
      "TCS Ninja",
      "Infosys",
      "Cognizant"
    ],
    "company_tags": [
      "TCS Ninja",
      "Infosys",
      "Cognizant"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 19,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-20",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is a 'Marker Interface' in Java, and how does modern Java design replace its usage?",
    "options": [
      "An interface containing only abstract methods; replaced by Abstract classes.",
      "An empty interface with no methods or fields (like Serializable); largely superseded by Annotations.",
      "An interface with only private methods; replaced by Sealed interfaces.",
      "An interface implemented only by native libraries; replaced by JNI."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "A marker (or tag) interface has no methods or constants (e.g., `java.io.Serializable`, `java.lang.Cloneable`). It delivers metadata to the JVM or frameworks via `instanceof`. In modern Java (since Java 5), custom Annotations are preferred for metadata decoration.",
    "companyTags": [
      "Oracle",
      "Goldman Sachs",
      "DE Shaw"
    ],
    "company_tags": [
      "Oracle",
      "Goldman Sachs",
      "DE Shaw"
    ],
    "difficulty": "HARD",
    "sort_order": 20,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-21",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Which of the following exception classes is an UNCHECKED exception in Java?",
    "options": [
      "java.io.IOException",
      "java.sql.SQLException",
      "java.lang.NullPointerException",
      "java.lang.ClassNotFoundException"
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "Unchecked exceptions in Java are subclasses of `RuntimeException` (such as `NullPointerException`, `ArrayIndexOutOfBoundsException`, `ArithmeticException`) and `Error`. They do not need to be declared in a method's `throws` clause or enclosed in a try-catch block. `IOException`, `SQLException`, and `ClassNotFoundException` are checked exceptions.",
    "companyTags": [
      "TCS",
      "Accenture",
      "Cognizant"
    ],
    "company_tags": [
      "TCS",
      "Accenture",
      "Cognizant"
    ],
    "difficulty": "BASIC",
    "sort_order": 21,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-22",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the return value of the following method containing a return statement inside both 'try' and 'finally' blocks?",
    "codeSnippet": "public class Test {\n    public static int getValue() {\n        try {\n            return 10;\n        } finally {\n            return 20;\n        }\n    }\n    public static void main(String[] args) {\n        System.out.println(getValue());\n    }\n}",
    "code_snippet": "public class Test {\n    public static int getValue() {\n        try {\n            return 10;\n        } finally {\n            return 20;\n        }\n    }\n    public static void main(String[] args) {\n        System.out.println(getValue());\n    }\n}",
    "options": [
      "10",
      "20",
      "Compilation error",
      "10 followed by 20"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "The `finally` block ALWAYS executes before a method returns. If the `finally` block executes a `return` statement, it discards and overrides any pending return value from the `try` block, returning 20.",
    "companyTags": [
      "Amazon",
      "Cisco",
      "Adobe"
    ],
    "company_tags": [
      "Amazon",
      "Cisco",
      "Adobe"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 22,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-23",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "Why does the following multi-catch block cause a compilation error?",
    "codeSnippet": "try {\n    // some code\n} catch (Exception e) {\n    System.out.println(\"Exception\");\n} catch (ArithmeticException e) {\n    System.out.println(\"Arithmetic\");\n}",
    "code_snippet": "try {\n    // some code\n} catch (Exception e) {\n    System.out.println(\"Exception\");\n} catch (ArithmeticException e) {\n    System.out.println(\"Arithmetic\");\n}",
    "options": [
      "ArithmeticException cannot be caught after a generic try block.",
      "Compilation error: Unreachable catch block because ArithmeticException has already been caught by the broader Exception handler.",
      "Variable 'e' cannot be reused across catch blocks.",
      "try blocks require at least one finally block."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "In Java catch blocks, subclasses MUST precede superclasses. Because `ArithmeticException` is a subclass of `Exception`, placing `catch(Exception e)` first catches all exceptions, rendering the `catch(ArithmeticException e)` block completely unreachable, which is a compile-time error.",
    "companyTags": [
      "Infosys SP",
      "Capgemini",
      "Tech Mahindra"
    ],
    "company_tags": [
      "Infosys SP",
      "Capgemini",
      "Tech Mahindra"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 23,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-24",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Under what circumstance will a 'finally' block NOT execute in Java?",
    "options": [
      "When an OutOfMemoryError is thrown.",
      "When the try block finishes with a return statement.",
      "When `System.exit(0)` is invoked inside the try block.",
      "When an unhandled RuntimeException occurs."
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "`System.exit(status)` halts the JVM process immediately, terminating OS-level execution without running pending `finally` blocks (the only exceptions being JVM crashes or power failure).",
    "companyTags": [
      "Qualcomm",
      "NVIDIA",
      "Samsung"
    ],
    "company_tags": [
      "Qualcomm",
      "NVIDIA",
      "Samsung"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 24,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-25",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "What interface must a resource implement to be managed automatically by Java 7's 'try-with-resources' statement?",
    "codeSnippet": "try (MyResource res = new MyResource()) {\n    // operations\n}",
    "code_snippet": "try (MyResource res = new MyResource()) {\n    // operations\n}",
    "options": [
      "java.io.Serializable",
      "java.lang.AutoCloseable",
      "java.lang.Runnable",
      "java.util.Observer"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Any resource used within the parentheses of a `try(...)` statement must implement `java.lang.AutoCloseable` (or its child `java.io.Closeable`). The JVM automatically invokes its `close()` method upon exiting the try block in reverse order of initialization.",
    "companyTags": [
      "Microsoft",
      "Google",
      "Bloomberg"
    ],
    "company_tags": [
      "Microsoft",
      "Google",
      "Bloomberg"
    ],
    "difficulty": "HARD",
    "sort_order": 25,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-26",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Which Java Collections interface guarantees unique elements and sorts them in their natural ascending order?",
    "options": [
      "HashSet",
      "LinkedHashSet",
      "TreeSet",
      "PriorityQueue"
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "`TreeSet` implements the `NavigableSet` / `SortedSet` interface and uses a Red-Black Tree to guarantee unique elements stored in natural sorted order (or via a custom `Comparator`) with $O(\\log n)$ operations.",
    "companyTags": [
      "TCS Ninja",
      "Infosys",
      "Wipro"
    ],
    "company_tags": [
      "TCS Ninja",
      "Infosys",
      "Wipro"
    ],
    "difficulty": "BASIC",
    "sort_order": 26,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-27",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What happens in a Java HashMap when the number of elements in a single bucket exceeds TREEIFY_THRESHOLD (8) and total table capacity is at least 64?",
    "options": [
      "The entire HashMap throws a HashCollisionException.",
      "The bucket's singly linked list is converted into a balanced Red-Black Tree.",
      "The oldest elements in the bucket are automatically purged.",
      "The HashMap switches to linear probing."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Since Java 8, when a bucket in `HashMap` reaches a threshold of 8 elements and the overall capacity is $\\ge$ 64, the linked list is transformed into a balanced Red-Black Tree (`TreeNode`). This improves worst-case lookup from $O(n)$ to $O(\\log n)$.",
    "companyTags": [
      "Amazon",
      "Flipkart",
      "Walmart"
    ],
    "company_tags": [
      "Amazon",
      "Flipkart",
      "Walmart"
    ],
    "difficulty": "BASIC",
    "sort_order": 27,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-28",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of the following HashSet operation when equals() and hashCode() are NOT overridden?",
    "codeSnippet": "import java.util.*;\n\nclass Student {\n    int id;\n    Student(int id) { this.id = id; }\n}\n\npublic class SetTest {\n    public static void main(String[] args) {\n        Set<Student> set = new HashSet<>();\n        set.add(new Student(1));\n        set.add(new Student(1));\n        System.out.println(set.size());\n    }\n}",
    "code_snippet": "import java.util.*;\n\nclass Student {\n    int id;\n    Student(int id) { this.id = id; }\n}\n\npublic class SetTest {\n    public static void main(String[] args) {\n        Set<Student> set = new HashSet<>();\n        set.add(new Student(1));\n        set.add(new Student(1));\n        System.out.println(set.size());\n    }\n}",
    "options": [
      "1",
      "2",
      "Compilation error",
      "Runtime Exception"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Because `equals()` and `hashCode()` are not overridden in `Student`, `HashSet` uses `Object`'s default implementation, which compares memory references (`==`). Since both instances are created with separate `new` calls, their hash codes and references differ, resulting in both being added (size = 2).",
    "companyTags": [
      "Adobe",
      "Cisco",
      "Paytm"
    ],
    "company_tags": [
      "Adobe",
      "Cisco",
      "Paytm"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 28,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-29",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "What exception is thrown when modifying an ArrayList while traversing it using an enhanced for-loop (Fail-Fast Iterator)?",
    "codeSnippet": "List<String> list = new ArrayList<>(Arrays.asList(\"A\", \"B\", \"C\"));\nfor (String s : list) {\n    if (s.equals(\"B\")) {\n        list.remove(s); // What happens?\n    }\n}",
    "code_snippet": "List<String> list = new ArrayList<>(Arrays.asList(\"A\", \"B\", \"C\"));\nfor (String s : list) {\n    if (s.equals(\"B\")) {\n        list.remove(s); // What happens?\n    }\n}",
    "options": [
      "IllegalStateException",
      "ConcurrentModificationException",
      "IndexOutOfBoundsException",
      "NoSuchElementException"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Java collections iterators are fail-fast. When structural modifications (add/remove) are made directly to the collection instead of through the iterator's own `it.remove()` method, the `modCount` diverges from the expected count, throwing `ConcurrentModificationException`.",
    "companyTags": [
      "Goldman Sachs",
      "Morgan Stanley",
      "Microsoft"
    ],
    "company_tags": [
      "Goldman Sachs",
      "Morgan Stanley",
      "Microsoft"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 29,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-30",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of sorting Strings using a PriorityQueue with default natural ordering in Java?",
    "codeSnippet": "import java.util.*;\n\npublic class PQTest {\n    public static void main(String[] args) {\n        PriorityQueue<Integer> pq = new PriorityQueue<>();\n        pq.add(40);\n        pq.add(10);\n        pq.add(30);\n        pq.add(20);\n        \n        System.out.print(pq.poll() + \" \" + pq.poll());\n    }\n}",
    "code_snippet": "import java.util.*;\n\npublic class PQTest {\n    public static void main(String[] args) {\n        PriorityQueue<Integer> pq = new PriorityQueue<>();\n        pq.add(40);\n        pq.add(10);\n        pq.add(30);\n        pq.add(20);\n        \n        System.out.print(pq.poll() + \" \" + pq.poll());\n    }\n}",
    "options": [
      "40 30",
      "10 20",
      "10 40",
      "40 10"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "In Java, `PriorityQueue` is a min-heap by default. The `poll()` method retrieves and removes the smallest element first. The first `poll()` returns 10, and the second `poll()` returns 20.",
    "companyTags": [
      "Uber",
      "Intuit",
      "Amazon"
    ],
    "company_tags": [
      "Uber",
      "Intuit",
      "Amazon"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 30,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-31",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "How does Java 8's ConcurrentHashMap achieve thread safety without locking the entire map like Hashtable?",
    "options": [
      "By disabling all write operations during concurrent reads.",
      "By using CAS (Compare-And-Swap) for empty bucket insertion and locking only the head node of a bucket (`synchronized(head)`) during write operations.",
      "By maintaining a full replica of the map on each thread's stack.",
      "By running all reads and writes on a single background actor thread."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "In Java 8, `ConcurrentHashMap` abandoned Segmented Locks in favor of Lock-Free CAS (Compare-And-Swap) operations for inserting into empty buckets, combined with synchronized locks on individual bucket head nodes for collisions. Reads are completely lock-free via volatile field reads.",
    "companyTags": [
      "DE Shaw",
      "Goldman Sachs",
      "Google"
    ],
    "company_tags": [
      "DE Shaw",
      "Goldman Sachs",
      "Google"
    ],
    "difficulty": "HARD",
    "sort_order": 31,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-32",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the difference between calling `thread.start()` versus `thread.run()` in Java?",
    "options": [
      "start() creates a new OS thread and invokes run() asynchronously; run() executes on the current calling thread synchronously.",
      "run() creates a new OS thread; start() is deprecated.",
      "start() can only be called once; run() cannot be called more than once.",
      "There is no difference; start() is an alias for run()."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "`thread.start()` allocates new thread resources and registers with the OS scheduler to invoke `run()` on a separate execution path. Directly calling `thread.run()` simply invokes a normal method on the caller's existing thread synchronously.",
    "companyTags": [
      "TCS Digital",
      "Cognizant",
      "Infosys"
    ],
    "company_tags": [
      "TCS Digital",
      "Cognizant",
      "Infosys"
    ],
    "difficulty": "BASIC",
    "sort_order": 32,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-33",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What does the 'volatile' keyword guarantee in Java?",
    "codeSnippet": "private volatile boolean flag = true;",
    "code_snippet": "private volatile boolean flag = true;",
    "options": [
      "It guarantees both memory visibility and mutual exclusion (thread atomicity for count++).",
      "It guarantees memory visibility across threads (reading directly from main memory) and prevents instruction reordering, but does NOT provide atomicity.",
      "It causes the variable to be stored on the execution stack instead of the heap.",
      "It locks the object until the calling thread exits."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "`volatile` guarantees visibility (changes made by one thread are immediately visible to all other threads by bypassing CPU L1/L2 caches) and prevents compiler/CPU instruction reordering. However, compound operations like `count++` (read-modify-write) are NOT atomic.",
    "companyTags": [
      "Amazon",
      "Cisco",
      "Adobe"
    ],
    "company_tags": [
      "Amazon",
      "Cisco",
      "Adobe"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 33,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-34",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "What exception is thrown if `wait()`, `notify()`, or `notifyAll()` is called on an object without holding that object's monitor lock?",
    "codeSnippet": "Object lock = new Object();\nlock.wait(); // Line 2 (not inside synchronized(lock))",
    "code_snippet": "Object lock = new Object();\nlock.wait(); // Line 2 (not inside synchronized(lock))",
    "options": [
      "InterruptedException",
      "IllegalMonitorStateException",
      "NullPointerException",
      "ThreadDeath"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Calling `wait()` or `notify()` requires the current thread to own the object's monitor lock (via `synchronized(lock)`). Failing to acquire the monitor lock before calling these methods throws `IllegalMonitorStateException` at runtime.",
    "companyTags": [
      "Microsoft",
      "Oracle",
      "Qualcomm"
    ],
    "company_tags": [
      "Microsoft",
      "Oracle",
      "Qualcomm"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 34,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-35",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What happens when `join()` is invoked on a thread instance in Java?",
    "codeSnippet": "Thread t = new Thread(() -> {\n    // background work\n});\nt.start();\nt.join(); // What does this call do?",
    "code_snippet": "Thread t = new Thread(() -> {\n    // background work\n});\nt.start();\nt.join(); // What does this call do?",
    "options": [
      "Terminates thread t immediately.",
      "Causes the calling thread to pause and wait until thread t completes its execution.",
      "Merges thread t's memory into the calling thread's heap space.",
      "Puts thread t into the BLOCKED state."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "`t.join()` causes the current thread (the one calling `join()`) to suspend execution and enter `WAITING` state until thread `t` terminates.",
    "companyTags": [
      "Paytm",
      "Flipkart",
      "Accenture"
    ],
    "company_tags": [
      "Paytm",
      "Flipkart",
      "Accenture"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 35,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-36",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What are the four Coffman conditions required for a deadlock to occur in Java multithreading, and how is it typically prevented?",
    "options": [
      "Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait; prevented by acquiring locks in a consistent global order.",
      "Race Condition, Context Switch, Thread Starvation, Cache Miss; prevented by increasing heap memory.",
      "Volatile Reads, CAS Failures, Spinlock contention, CPU Throttle; prevented by using thread pools.",
      "Paging Anomaly, Thread Leak, Garbage Collection Pause, Monitor timeout; prevented with noexcept."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "The 4 necessary conditions for deadlock are: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. Breaking 'Circular Wait' by enforcing strict linear lock acquisition ordering across all threads is the standard programmatic solution.",
    "companyTags": [
      "Bloomberg",
      "Tower Research",
      "DE Shaw"
    ],
    "company_tags": [
      "Bloomberg",
      "Tower Research",
      "DE Shaw"
    ],
    "difficulty": "HARD",
    "sort_order": 36,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-37",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is 'Type Erasure' in Java Generics?",
    "options": [
      "Removing primitive variables to save heap space.",
      "The compiler replacing all generic type parameters with their bounds (or Object) and inserting appropriate casts, discarding generic metadata at runtime.",
      "A JVM feature that deletes unused classes from memory.",
      "The process of clearing variables before garbage collection."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "To maintain backward compatibility with pre-Java 5 legacy code, Java uses Type Erasure. The compiler enforces type safety during compilation and then strips away generic type arguments (replacing `T` with its upper bound or `Object`) in bytecode.",
    "companyTags": [
      "TCS",
      "Infosys",
      "Cognizant"
    ],
    "company_tags": [
      "TCS",
      "Infosys",
      "Cognizant"
    ],
    "difficulty": "BASIC",
    "sort_order": 37,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-38",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "Why does the following Java code fail to compile?",
    "codeSnippet": "List<Number> list = new ArrayList<Integer>();",
    "code_snippet": "List<Number> list = new ArrayList<Integer>();",
    "options": [
      "Integer does not inherit from Number.",
      "Generics in Java are invariant: `List<Integer>` is NOT a subtype of `List<Number>`.",
      "ArrayList cannot be instantiated with a generic type.",
      "Number is an abstract class and cannot be referenced."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "In Java, generic types are invariant. Although `Integer` is a subtype of `Number`, `List<Integer>` is NOT a subtype of `List<Number>`. Allowing this would permit writing `list.add(3.14)` (a Double) into a list of Integers. The correct covariant wildcard syntax is `List<? extends Number> list = new ArrayList<Integer>();`.",
    "companyTags": [
      "Amazon",
      "Adobe",
      "Microsoft"
    ],
    "company_tags": [
      "Amazon",
      "Adobe",
      "Microsoft"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 38,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-39",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "According to the PECS (Producer Extends, Consumer Super) rule in Java Generics, which wildcard should be used when a collection produces read-only data?",
    "options": [
      "<? super T>",
      "<? extends T>",
      "<?>",
      "<T extends Object>"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "PECS stands for 'Producer Extends, Consumer Super'. If a parameterized type represents a producer that you only read from (`get()`), use `<? extends T>`. If it represents a consumer that you write to (`add()`), use `<? super T>`.",
    "companyTags": [
      "Goldman Sachs",
      "Morgan Stanley",
      "Google"
    ],
    "company_tags": [
      "Goldman Sachs",
      "Morgan Stanley",
      "Google"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 39,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-40",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "Which of the following operations is ILLEGAL with generic type parameters due to Type Erasure?",
    "options": [
      "Declaring a generic method `public <T> void print(T item)`",
      "Creating an instance of a type parameter directly: `T obj = new T();`",
      "Passing generic collections as method parameters",
      "Using bounded wildcards `List<? extends Comparable<T>>`"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Because type parameters are erased at runtime into `Object`, the expression `new T()` is invalid because the JVM does not know what concrete constructor or memory allocation to perform. Reflection or factory suppliers (`Supplier<T>`) are required instead.",
    "companyTags": [
      "Cisco",
      "Qualcomm",
      "Oracle"
    ],
    "company_tags": [
      "Cisco",
      "Qualcomm",
      "Oracle"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 40,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-41",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "CODE_COMPLETION",
    "question_type": "CODE_COMPLETION",
    "question": "Which method signature correctly completes a generic copy method that transfers all elements from a source list to a destination list following the PECS principle?",
    "codeSnippet": "public static <T> void copy(// Missing parameters here) {\n    for (T item : src) {\n        dest.add(item);\n    }\n}",
    "code_snippet": "public static <T> void copy(// Missing parameters here) {\n    for (T item : src) {\n        dest.add(item);\n    }\n}",
    "options": [
      "List<T> dest, List<T> src",
      "List<? super T> dest, List<? extends T> src",
      "List<? extends T> dest, List<? super T> src",
      "List<?> dest, List<?> src"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "`src` produces items (read via foreach), so it must be `List<? extends T>`. `dest` consumes items (written via `dest.add(item)`), so it must be `List<? super T>`. This is the exact signature used in `java.util.Collections.copy()`.",
    "companyTags": [
      "DE Shaw",
      "Bloomberg",
      "Google"
    ],
    "company_tags": [
      "DE Shaw",
      "Bloomberg",
      "Google"
    ],
    "difficulty": "HARD",
    "sort_order": 41,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-42",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the difference between Intermediate and Terminal operations in the Java 8 Streams API?",
    "options": [
      "Intermediate operations execute immediately; Terminal operations are lazy.",
      "Intermediate operations return a new Stream and are lazily evaluated; Terminal operations trigger pipeline execution and produce a result or side-effect.",
      "Intermediate operations cannot be chained; Terminal operations can be chained infinitely.",
      "Intermediate operations only work on parallel streams."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Intermediate operations (like `filter`, `map`, `sorted`) return a new Stream and are lazy—no computation occurs until a Terminal operation (like `collect`, `forEach`, `reduce`, `count`) is invoked, which triggers the stream pipeline.",
    "companyTags": [
      "TCS Digital",
      "Infosys SP",
      "Accenture"
    ],
    "company_tags": [
      "TCS Digital",
      "Infosys SP",
      "Accenture"
    ],
    "difficulty": "BASIC",
    "sort_order": 42,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-43",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "Which method reference syntax corresponds to calling a static method `Math.max(a, b)`?",
    "options": [
      "Math::max",
      "Math->max",
      "Math.max::call",
      "::Math.max"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In Java 8, method references use the `::` double colon operator. A reference to a static method of a class is written as `ClassName::staticMethodName` (e.g., `Math::max`).",
    "companyTags": [
      "Cognizant",
      "Capgemini",
      "Wipro"
    ],
    "company_tags": [
      "Cognizant",
      "Capgemini",
      "Wipro"
    ],
    "difficulty": "BASIC",
    "sort_order": 43,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-44",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of the following Streams filter and map pipeline?",
    "codeSnippet": "import java.util.*;\nimport java.util.stream.*;\n\npublic class StreamTest {\n    public static void main(String[] args) {\n        List<Integer> nums = Arrays.asList(1, 2, 3, 4, 5, 6);\n        long count = nums.stream()\n            .filter(n -> n % 2 == 0)\n            .map(n -> n * 2)\n            .filter(n -> n > 6)\n            .count();\n            \n        System.out.println(count);\n    }\n}",
    "code_snippet": "import java.util.*;\nimport java.util.stream.*;\n\npublic class StreamTest {\n    public static void main(String[] args) {\n        List<Integer> nums = Arrays.asList(1, 2, 3, 4, 5, 6);\n        long count = nums.stream()\n            .filter(n -> n % 2 == 0)\n            .map(n -> n * 2)\n            .filter(n -> n > 6)\n            .count();\n            \n        System.out.println(count);\n    }\n}",
    "options": [
      "1",
      "2",
      "3",
      "4"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "1. `filter(n -> n % 2 == 0)` filters even numbers: [2, 4, 6].\n2. `map(n -> n * 2)` doubles each: [4, 8, 12].\n3. `filter(n -> n > 6)` keeps numbers strictly greater than 6: [8, 12].\n4. `count()` returns 2.",
    "companyTags": [
      "Amazon",
      "Cisco",
      "Optum"
    ],
    "company_tags": [
      "Amazon",
      "Cisco",
      "Optum"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 44,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-45",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of dealing with an empty Optional in Java?",
    "codeSnippet": "import java.util.Optional;\n\npublic class OptionalTest {\n    public static void main(String[] args) {\n        Optional<String> opt = Optional.ofNullable(null);\n        String res = opt.orElse(\"Default\");\n        System.out.println(res);\n    }\n}",
    "code_snippet": "import java.util.Optional;\n\npublic class OptionalTest {\n    public static void main(String[] args) {\n        Optional<String> opt = Optional.ofNullable(null);\n        String res = opt.orElse(\"Default\");\n        System.out.println(res);\n    }\n}",
    "options": [
      "null",
      "NullPointerException",
      "Default",
      "Optional.empty"
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "`Optional.ofNullable(null)` returns an empty `Optional`. When calling `opt.orElse(\"Default\")`, since the optional is empty, it returns the fallback default value (\"Default\") safely without throwing NullPointerException.",
    "companyTags": [
      "Adobe",
      "Paytm",
      "Flipkart"
    ],
    "company_tags": [
      "Adobe",
      "Paytm",
      "Flipkart"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 45,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-46",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What happens when you invoke multiple intermediate operations on a Stream without ever calling a terminal operation?",
    "codeSnippet": "Stream<String> s = list.stream()\n    .filter(x -> { System.out.println(x); return true; });",
    "code_snippet": "Stream<String> s = list.stream()\n    .filter(x -> { System.out.println(x); return true; });",
    "options": [
      "All elements are printed immediately.",
      "Nothing is printed because intermediate operations are lazily evaluated and never execute without a terminal operation.",
      "An IllegalStateException is thrown.",
      "The stream runs in the background on the Common ForkJoinPool."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Stream intermediate operations are completely lazy. The JVM builds a pipeline specification, but zero elements are pulled through the pipeline until a terminal operation (e.g., `collect`, `findFirst`, `count`) is invoked.",
    "companyTags": [
      "Goldman Sachs",
      "Google",
      "Microsoft"
    ],
    "company_tags": [
      "Goldman Sachs",
      "Google",
      "Microsoft"
    ],
    "difficulty": "HARD",
    "sort_order": 46,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-47",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "In the Java Virtual Machine heap memory, where are newly created objects initially allocated?",
    "options": [
      "Old (Tenured) Generation",
      "Eden Space in the Young Generation",
      "Survivor Space S1",
      "Metaspace"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "New objects are initially allocated in the Eden space of the Young Generation. Objects that survive Minor Garbage Collections are aged in Survivor spaces (S0 and S1) before eventually being promoted to the Old (Tenured) Generation.",
    "companyTags": [
      "TCS Ninja",
      "Infosys",
      "Wipro"
    ],
    "company_tags": [
      "TCS Ninja",
      "Infosys",
      "Wipro"
    ],
    "difficulty": "BASIC",
    "sort_order": 47,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-48",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What replaced the PermGen (Permanent Generation) in Java 8, and where is it allocated?",
    "options": [
      "CodeCache, allocated on the Java heap.",
      "Metaspace, allocated on native OS memory outside the Java heap.",
      "Stack Frame, allocated per-thread.",
      "Eden space, allocated on continuous virtual memory."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Java 8 completely removed PermGen to prevent `java.lang.OutOfMemoryError: PermGen space`. It was replaced by `Metaspace`, which stores class metadata in native OS memory and dynamically expands as needed.",
    "companyTags": [
      "Amazon",
      "Cisco",
      "Oracle"
    ],
    "company_tags": [
      "Amazon",
      "Cisco",
      "Oracle"
    ],
    "difficulty": "BASIC",
    "sort_order": 48,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-49",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "Which of the following scenarios is the most common cause of a Memory Leak in a managed runtime like Java?",
    "options": [
      "Creating primitive variables in a loop.",
      "Unintentionally retaining references to obsolete objects in a static collection (e.g., `static List<Object> cache`).",
      "Calling `System.gc()` repeatedly.",
      "Catching NullPointerException."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "In Java, an object cannot be garbage-collected as long as it is reachable from a GC Root. Static fields live for the entire lifetime of the ClassLoader; adding objects to static collections without eviction means they can never be collected, creating a memory leak.",
    "companyTags": [
      "Microsoft",
      "Adobe",
      "DE Shaw"
    ],
    "company_tags": [
      "Microsoft",
      "Adobe",
      "DE Shaw"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 49,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "java-mcq-50",
    "topicId": "mcq-java-programming",
    "topic_id": "mcq-java-programming",
    "topic": "Java Language",
    "topic_name": "Java Language",
    "topicCategory": "JAVA_PROGRAMMING",
    "topic_category": "JAVA_PROGRAMMING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the difference between a Strong Reference, WeakReference, and SoftReference in Java?",
    "options": [
      "WeakReferences are never collected; SoftReferences are collected on every GC.",
      "Strong references prevent GC; SoftReferences are cleared only when memory is critically low (before OOM); WeakReferences are cleared eagerly on the very next GC cycle.",
      "SoftReferences cannot hold collections; WeakReferences can hold any object.",
      "They are completely identical in modern JVMs."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Java Reference types: 1) Strong (`Object o = new Object()`): never collected while reachable. 2) `SoftReference`: ideal for memory-sensitive caches, cleared only before the JVM throws OutOfMemoryError. 3) `WeakReference`: ideal for canonical mappings (`WeakHashMap`), cleared whenever the garbage collector encounters them.",
    "companyTags": [
      "Google",
      "Bloomberg",
      "Tower Research"
    ],
    "company_tags": [
      "Google",
      "Bloomberg",
      "Tower Research"
    ],
    "difficulty": "HARD",
    "sort_order": 50,
    "is_hidden": false,
    "is_deleted": false
  }
];

export const PYTHON_PROGRAMMING_MCQ_SEED: TechnicalMcq[] = [
  {
    "id": "py-mcq-01",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Which of the following built-in collection types in Python is IMMUTABLE?",
    "options": [
      "list",
      "dict",
      "tuple",
      "set"
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "In Python, `tuple`, `str`, `int`, `float`, `bool`, `bytes`, and `frozenset` are immutable. Once created, their elements/values cannot be modified in-place. In contrast, `list`, `dict`, and `set` are mutable.",
    "companyTags": [
      "TCS Ninja",
      "Cognizant",
      "Infosys"
    ],
    "company_tags": [
      "TCS Ninja",
      "Cognizant",
      "Infosys"
    ],
    "difficulty": "BASIC",
    "sort_order": 1,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-02",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "How do you define a valid single-element tuple in Python containing the integer 42?",
    "options": [
      "t = (42)",
      "t = (42,)",
      "t = tuple[42]",
      "t = {42,}"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Parentheses alone `(42)` evaluate as grouped integer arithmetic (type `int`). A trailing comma `(42,)` is mandatory for Python syntax to recognize a single-element tuple.",
    "companyTags": [
      "Accenture",
      "Wipro",
      "Capgemini"
    ],
    "company_tags": [
      "Accenture",
      "Wipro",
      "Capgemini"
    ],
    "difficulty": "BASIC",
    "sort_order": 2,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-03",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of the following list aliasing versus shallow copy snippet?",
    "codeSnippet": "a = [1, 2, [3, 4]]\nb = a[:]\nb[0] = 99\nb[2].append(5)\nprint(a)",
    "code_snippet": "a = [1, 2, [3, 4]]\nb = a[:]\nb[0] = 99\nb[2].append(5)\nprint(a)",
    "options": [
      "[1, 2, [3, 4]]",
      "[99, 2, [3, 4, 5]]",
      "[1, 2, [3, 4, 5]]",
      "[99, 2, [3, 4]]"
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "Slicing `a[:]` creates a shallow copy. The outer list is a new container (so modifying `b[0] = 99` does NOT affect `a[0]`). However, the nested list `[3, 4]` is still shared by reference. Modifying `b[2].append(5)` alters the shared inner list. Thus `a` is `[1, 2, [3, 4, 5]]`.",
    "companyTags": [
      "Amazon",
      "Cisco",
      "Flipkart"
    ],
    "company_tags": [
      "Amazon",
      "Cisco",
      "Flipkart"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 3,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-04",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of identity comparison `is` versus value equality `==` in CPython for small integers?",
    "codeSnippet": "x = 256\ny = 256\na = 257\nb = 257\nprint((x is y), (a is b))",
    "code_snippet": "x = 256\ny = 256\na = 257\nb = 257\nprint((x is y), (a is b))",
    "options": [
      "True True",
      "True False",
      "False False",
      "False True"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "CPython pre-allocates and caches an array of small integer objects in the range [-5, 256]. For 256, both `x` and `y` reference the exact same cached object (`x is y` is True). For 257 (outside the cache, in standard interactive execution), separate integer objects are created (`a is b` is False). Output: `True False`.",
    "companyTags": [
      "Adobe",
      "Microsoft",
      "Goldman Sachs"
    ],
    "company_tags": [
      "Adobe",
      "Microsoft",
      "Goldman Sachs"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 4,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-05",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "Why does the following dictionary key assignment fail with a TypeError?",
    "codeSnippet": "d = {}\nd[[1, 2]] = \"numbers\"",
    "code_snippet": "d = {}\nd[[1, 2]] = \"numbers\"",
    "options": [
      "Dictionaries only allow string keys in Python.",
      "List is a mutable type and lacks an immutable `__hash__` method (TypeError: unhashable type: 'list').",
      "Lists must be wrapped in tuple() before calling dict.keys().",
      "Memory error because list indexing cannot exceed 0."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Dictionary keys in Python must be hashable (their hash value must remain invariant throughout their lifetime). Because `list` is mutable, its `__hash__` is set to `None`. Attempting to use a list as a dictionary key throws `TypeError: unhashable type: 'list'`. Tuples must be used instead.",
    "companyTags": [
      "Google",
      "Bloomberg",
      "Tower Research"
    ],
    "company_tags": [
      "Google",
      "Bloomberg",
      "Tower Research"
    ],
    "difficulty": "HARD",
    "sort_order": 5,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-06",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the difference between `/` and `//` operators in Python 3?",
    "options": [
      "/ performs float division; // performs floor (integer) division rounding toward negative infinity.",
      "/ is for integers; // is for floating-point numbers.",
      "/ returns a quotient; // returns a remainder.",
      "They are completely interchangeable."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In Python 3, `/` always performs true division returning a `float` (e.g., `7 / 2 = 3.5`). The `//` operator performs floor division, rounding down towards negative infinity (e.g., `7 // 2 = 3`, and `-7 // 2 = -4`).",
    "companyTags": [
      "TCS",
      "Infosys",
      "Cognizant"
    ],
    "company_tags": [
      "TCS",
      "Infosys",
      "Cognizant"
    ],
    "difficulty": "BASIC",
    "sort_order": 6,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-07",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of negative floor division and modulo in Python?",
    "codeSnippet": "print((-7 // 3), (-7 % 3))",
    "code_snippet": "print((-7 // 3), (-7 % 3))",
    "options": [
      "-2 -1",
      "-3 2",
      "-2 1",
      "-3 -1"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Python defines modulo such that `r = a - (a // b) * b`, and the remainder `r` shares the sign of the divisor `b` (3): 1) `-7 / 3 = -2.333`, floored to `-3`. 2) `-7 - (-3 * 3) = -7 - (-9) = 2`. Output: `-3 2`.",
    "companyTags": [
      "Paytm",
      "Accenture",
      "LTI"
    ],
    "company_tags": [
      "Paytm",
      "Accenture",
      "LTI"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 7,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-08",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the exact result of the short-circuiting logical expression below?",
    "codeSnippet": "x = [] or (0 and \"hello\") or \"Python\"\nprint(x)",
    "code_snippet": "x = [] or (0 and \"hello\") or \"Python\"\nprint(x)",
    "options": [
      "True",
      "[]",
      "0",
      "Python"
    ],
    "correctOptionIndex": 3,
    "correct_option_index": 3,
    "explanation": "In Python, `or` and `and` return the operand itself, not a boolean: 1) `[]` is falsy, so `[] or ...` evaluates the right side. 2) `(0 and \"hello\")`: `0` is falsy, so `and` short-circuits and evaluates to `0`. 3) `0 or \"Python\"`: `0` is falsy, so `or` evaluates to `\"Python\"` (truthy). Output: `Python`.",
    "companyTags": [
      "Amazon",
      "Adobe",
      "Qualcomm"
    ],
    "company_tags": [
      "Amazon",
      "Adobe",
      "Qualcomm"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 8,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-09",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of the extended slice operation on a string?",
    "codeSnippet": "s = \"Python\"\nprint(s[1:5:2], s[::-1])",
    "code_snippet": "s = \"Python\"\nprint(s[1:5:2], s[::-1])",
    "options": [
      "yh nohtyP",
      "pt nohtyP",
      "yh Python",
      "yhn nohtyP"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "1. `s[1:5:2]` starts at index 1 ('y'), goes up to index 5 (exclusive) in steps of 2: index 1 ('y'), index 3 ('h') -> `\"yh\"`. 2. `s[::-1]` reverses the entire string -> `\"nohtyP\"`. Output is `yh nohtyP`.",
    "companyTags": [
      "Mindtree",
      "HCL",
      "Wipro"
    ],
    "company_tags": [
      "Mindtree",
      "HCL",
      "Wipro"
    ],
    "difficulty": "BASIC",
    "sort_order": 9,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-10",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "What is the 'Walrus Operator' `:=` introduced in Python 3.8?",
    "codeSnippet": "if (n := len(data)) > 10:\n    print(f\"List is too long: {n}\")",
    "code_snippet": "if (n := len(data)) > 10:\n    print(f\"List is too long: {n}\")",
    "options": [
      "An operator that compares both type and memory identity simultaneously.",
      "An assignment expression operator that assigns values to variables as part of a larger expression.",
      "A pattern-matching guard condition.",
      "A type-hinting operator for dynamic duck typing."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "The walrus operator `:=` is an assignment expression. It enables assigning a value to a variable within an expression (like inside an `if` condition or `while` loop test) and evaluating to that assigned value simultaneously.",
    "companyTags": [
      "DE Shaw",
      "Microsoft",
      "Goldman Sachs"
    ],
    "company_tags": [
      "DE Shaw",
      "Microsoft",
      "Goldman Sachs"
    ],
    "difficulty": "HARD",
    "sort_order": 10,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-11",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "When does the 'else' block of a 'for' or 'while' loop execute in Python?",
    "codeSnippet": "for x in items:\n    if x == target:\n        break\nelse:\n    print(\"Not found\")",
    "code_snippet": "for x in items:\n    if x == target:\n        break\nelse:\n    print(\"Not found\")",
    "options": [
      "Whenever the loop encounters a break statement.",
      "Only if the loop exhausts all elements without encountering a break statement.",
      "At every single iteration where the condition is false.",
      "Only if an exception is raised inside the loop."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "In Python, a loop's `else` clause executes only when the loop completes normally (by exhausting an iterable in `for`, or when the condition becomes false in `while`). If the loop is terminated early via `break`, the `else` block is skipped.",
    "companyTags": [
      "TCS Digital",
      "Infosys SP",
      "Cognizant"
    ],
    "company_tags": [
      "TCS Digital",
      "Infosys SP",
      "Cognizant"
    ],
    "difficulty": "BASIC",
    "sort_order": 11,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-12",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of the nested list comprehension below?",
    "codeSnippet": "matrix = [[1, 2], [3, 4]]\nflat = [x for row in matrix for x in row if x % 2 == 0]\nprint(flat)",
    "code_snippet": "matrix = [[1, 2], [3, 4]]\nflat = [x for row in matrix for x in row if x % 2 == 0]\nprint(flat)",
    "options": [
      "[2, 4]",
      "[[2], [4]]",
      "[1, 3]",
      "[4, 2]"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "The order of `for` clauses in a list comprehension matches the order of standard nested for-loops: `for row in matrix:` then `for x in row: if x % 2 == 0: yield x`. Even numbers are 2 and 4. Output: `[2, 4]`.",
    "companyTags": [
      "Amazon",
      "Cisco",
      "Optum"
    ],
    "company_tags": [
      "Amazon",
      "Cisco",
      "Optum"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 12,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-13",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of multiplying a list containing an inner list: `[[0] * 2] * 2`?",
    "codeSnippet": "grid = [[0] * 2] * 2\ngrid[0][0] = 5\nprint(grid)",
    "code_snippet": "grid = [[0] * 2] * 2\ngrid[0][0] = 5\nprint(grid)",
    "options": [
      "[[5, 0], [0, 0]]",
      "[[5, 0], [5, 0]]",
      "[[5, 5], [0, 0]]",
      "[[5, 5], [5, 5]]"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Multiplying `[sublist] * 2` copies the reference to `sublist`, NOT the list itself. `grid[0]` and `grid[1]` point to the exact same inner list in memory. Modifying `grid[0][0] = 5` reflects in all rows: `[[5, 0], [5, 0]]`.",
    "companyTags": [
      "Google",
      "Bloomberg",
      "Adobe"
    ],
    "company_tags": [
      "Google",
      "Bloomberg",
      "Adobe"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 13,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-14",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "Why is modifying a list while iterating over it in a standard for-loop dangerous in Python?",
    "codeSnippet": "nums = [1, 2, 3, 4, 5]\nfor x in nums:\n    if x == 2:\n        nums.remove(x)\nprint(nums)",
    "code_snippet": "nums = [1, 2, 3, 4, 5]\nfor x in nums:\n    if x == 2:\n        nums.remove(x)\nprint(nums)",
    "options": [
      "Throws ConcurrentModificationException at runtime.",
      "Silently skips the element immediately following the removed element (index shift bug).",
      "Causes an infinite loop.",
      "Syntactically forbidden by Python compiler."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Python's list iterator tracks an internal integer index. When `2` is removed at index 1, element `3` shifts down to index 1. On the next iteration, the iterator moves to index 2, pointing to `4` and completely skipping `3`. Output becomes `[1, 3, 4, 5]` without throwing an error.",
    "companyTags": [
      "Microsoft",
      "Oracle",
      "Paytm"
    ],
    "company_tags": [
      "Microsoft",
      "Oracle",
      "Paytm"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 14,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-15",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "In Python 3, what is the scope of the iteration variable in a List Comprehension versus a standard For-Loop?",
    "codeSnippet": "x = 100\n[x for x in range(5)]\nprint(x) # What does this print in Python 3?",
    "code_snippet": "x = 100\n[x for x in range(5)]\nprint(x) # What does this print in Python 3?",
    "options": [
      "4 in both Python 2 and Python 3",
      "100 in Python 3 (comprehension variables are scoped to a private function frame); 4 in Python 2 (leaked into outer scope)",
      "Throws UnboundLocalError in Python 3",
      "None"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "In Python 3, list comprehensions are executed in their own private nested function scope. Variables inside the comprehension do not leak into or overwrite variables in the enclosing scope, so `print(x)` safely prints `100`. (In Python 2, `x` leaked and became 4).",
    "companyTags": [
      "Goldman Sachs",
      "DE Shaw",
      "Morgan Stanley"
    ],
    "company_tags": [
      "Goldman Sachs",
      "DE Shaw",
      "Morgan Stanley"
    ],
    "difficulty": "HARD",
    "sort_order": 15,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-16",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the resolution order for variable lookup in Python (LEGB Rule)?",
    "options": [
      "Local -> Global -> Enclosing -> Built-in",
      "Local -> Enclosing -> Global -> Built-in",
      "Global -> Local -> Enclosing -> Built-in",
      "Built-in -> Global -> Enclosing -> Local"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Python looks up variables according to the LEGB rule: 1. Local (inside current function), 2. Enclosing (in enclosing/outer functions), 3. Global (module level), 4. Built-in (standard Python library built-ins).",
    "companyTags": [
      "TCS",
      "Cognizant",
      "Wipro"
    ],
    "company_tags": [
      "TCS",
      "Cognizant",
      "Wipro"
    ],
    "difficulty": "BASIC",
    "sort_order": 16,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-17",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "What is the dangerous consequence of using a mutable default argument in a function definition?",
    "codeSnippet": "def append_item(val, target=[]):\n    target.append(val)\n    return target\n\nprint(append_item(1))\nprint(append_item(2))",
    "code_snippet": "def append_item(val, target=[]):\n    target.append(val)\n    return target\n\nprint(append_item(1))\nprint(append_item(2))",
    "options": [
      "[1] followed by [2]",
      "[1] followed by [1, 2]",
      "Compilation error: default parameters cannot be empty lists",
      "Runtime TypeError on the second call"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Default parameter expressions are evaluated once when the function is defined (at module load time), NOT each time the function is called. The exact same list instance is reused across invocations, producing `[1]` on the first call and `[1, 2]` on the second.",
    "companyTags": [
      "Amazon",
      "Adobe",
      "Microsoft"
    ],
    "company_tags": [
      "Amazon",
      "Adobe",
      "Microsoft"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 17,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-18",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "In Python 3.8+, what does a single forward slash `/` in a function signature indicate?",
    "codeSnippet": "def func(a, b, /, c, d): pass",
    "code_snippet": "def func(a, b, /, c, d): pass",
    "options": [
      "Parameters preceding `/` must be positional-only; they cannot be passed by keyword.",
      "Parameters following `/` must be keyword-only.",
      "The function performs division on all arguments.",
      "The function cannot accept default values."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In Python 3.8, `/` denotes positional-only parameters. Any parameters placed to the left of `/` (`a` and `b`) must be supplied by position and cannot be called as keyword arguments (`func(a=1, b=2)` raises a TypeError).",
    "companyTags": [
      "Qualcomm",
      "NVIDIA",
      "Cisco"
    ],
    "company_tags": [
      "Qualcomm",
      "NVIDIA",
      "Cisco"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 18,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-19",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of modifying a variable in an enclosing scope using 'nonlocal' versus without it?",
    "codeSnippet": "def outer():\n    x = 10\n    def inner():\n        nonlocal x\n        x += 5\n    inner()\n    return x\n\nprint(outer())",
    "code_snippet": "def outer():\n    x = 10\n    def inner():\n        nonlocal x\n        x += 5\n    inner()\n    return x\n\nprint(outer())",
    "options": [
      "10",
      "15",
      "UnboundLocalError",
      "SyntaxError"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "The `nonlocal` keyword allows a nested function to rebind variables in its nearest enclosing (non-global) scope. `inner()` mutates `x` in `outer()`, so `outer()` returns 15.",
    "companyTags": [
      "Infosys SP",
      "Capgemini",
      "Tech Mahindra"
    ],
    "company_tags": [
      "Infosys SP",
      "Capgemini",
      "Tech Mahindra"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 19,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-20",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "Why does the following code raise an UnboundLocalError at runtime?",
    "codeSnippet": "x = 50\ndef func():\n    print(x) # Error here\n    x = 10\nfunc()",
    "code_snippet": "x = 50\ndef func():\n    print(x) # Error here\n    x = 10\nfunc()",
    "options": [
      "Global variables cannot be printed inside functions.",
      "Because 'x = 10' is an assignment in the function body, Python treats 'x' as a local variable throughout the entire function, making the prior print an access before assignment.",
      "print() cannot execute before variable declarations.",
      "Functions require return statements to read globals."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "When Python compiles a function body, any variable that is assigned to (e.g., `x = 10`) without an explicit `global x` declaration is flagged as a local variable for the entire scope. Reading `print(x)` before `x = 10` executes raises `UnboundLocalError: local variable 'x' referenced before assignment`.",
    "companyTags": [
      "Google",
      "Bloomberg",
      "DE Shaw"
    ],
    "company_tags": [
      "Google",
      "Bloomberg",
      "DE Shaw"
    ],
    "difficulty": "HARD",
    "sort_order": 20,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-21",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What distinguishes a generator function containing 'yield' from a normal Python function?",
    "options": [
      "It executes concurrently on a background OS thread.",
      "It returns a generator iterator object and suspends its execution state, resuming from that exact state on the next `next()` call.",
      "It cannot take arguments.",
      "It stores all yielded values in a heap list before returning."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "A function with `yield` returns a generator object without executing the body immediately. When iterated via `next()`, it executes until reaching `yield`, produces a value, and freezes its execution frame (variables and instruction pointer) until the next `next()` call.",
    "companyTags": [
      "TCS",
      "Accenture",
      "Cognizant"
    ],
    "company_tags": [
      "TCS",
      "Accenture",
      "Cognizant"
    ],
    "difficulty": "BASIC",
    "sort_order": 21,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-22",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of the generator expression when exhausted twice?",
    "codeSnippet": "gen = (x * 2 for x in range(3))\nprint(list(gen))\nprint(list(gen))",
    "code_snippet": "gen = (x * 2 for x in range(3))\nprint(list(gen))\nprint(list(gen))",
    "options": [
      "[0, 2, 4] followed by [0, 2, 4]",
      "[0, 2, 4] followed by []",
      "[] followed by []",
      "Runtime StopIteration exception"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Generators are one-time-use iterators. The first `list(gen)` exhausts all yielded values `[0, 2, 4]`. The second `list(gen)` encounters an already-exhausted generator (which raises `StopIteration`), resulting in an empty list `[]`.",
    "companyTags": [
      "Amazon",
      "Cisco",
      "Paytm"
    ],
    "company_tags": [
      "Amazon",
      "Cisco",
      "Paytm"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 22,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-23",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of the following lambda closure in a list comprehension (Late Binding)?",
    "codeSnippet": "funcs = [lambda: i for i in range(3)]\nprint([f() for f in funcs])",
    "code_snippet": "funcs = [lambda: i for i in range(3)]\nprint([f() for f in funcs])",
    "options": [
      "[0, 1, 2]",
      "[2, 2, 2]",
      "[0, 0, 0]",
      "[3, 3, 3]"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Python closures bind by variable name, not by value (late binding). The variable `i` is looked up in the surrounding scope when the lambda is called, at which point the loop has finished and `i = 2`. Calling all 3 functions evaluates to `[2, 2, 2]`. (To fix: `lambda i=i: i`).",
    "companyTags": [
      "Microsoft",
      "Adobe",
      "Goldman Sachs"
    ],
    "company_tags": [
      "Microsoft",
      "Adobe",
      "Goldman Sachs"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 23,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-24",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "What does the 'yield from' statement accomplish in Python generators?",
    "codeSnippet": "def flatten(nested):\n    for sub in nested:\n        yield from sub",
    "code_snippet": "def flatten(nested):\n    for sub in nested:\n        yield from sub",
    "options": [
      "Converts the sub-iterable into a tuple.",
      "Delegates iteration to a sub-generator or iterable, creating a transparent bi-directional channel.",
      "Stops the generator if sub is empty.",
      "Catches all exceptions raised inside sub."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "`yield from <iterable>` transparently delegates generation to the sub-generator, yielding all its items. It also establishes a bi-directional communications channel allowing `send()` and `throw()` to pass directly into the sub-generator.",
    "companyTags": [
      "Qualcomm",
      "NVIDIA",
      "Uber"
    ],
    "company_tags": [
      "Qualcomm",
      "NVIDIA",
      "Uber"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 24,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-25",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CODE_COMPLETION",
    "question_type": "CODE_COMPLETION",
    "question": "Which standard library function from 'functools' calculates the cumulative product of all elements in `[1, 2, 3, 4]`?",
    "codeSnippet": "from functools import reduce\nnums = [1, 2, 3, 4]\n# Which code produces 24?\nresult = reduce(// Missing expression here, nums)",
    "code_snippet": "from functools import reduce\nnums = [1, 2, 3, 4]\n# Which code produces 24?\nresult = reduce(// Missing expression here, nums)",
    "options": [
      "lambda x, y: x * y",
      "lambda x: x * 2",
      "sum",
      "lambda *args: args[0] * args[1]"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "`functools.reduce(function, iterable)` applies a two-argument function cumulatively to the items of a sequence from left to right. `reduce(lambda x, y: x * y, [1, 2, 3, 4])` computes `(((1*2)*3)*4) = 24`.",
    "companyTags": [
      "Bloomberg",
      "DE Shaw",
      "Google"
    ],
    "company_tags": [
      "Bloomberg",
      "DE Shaw",
      "Google"
    ],
    "difficulty": "HARD",
    "sort_order": 25,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-26",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the syntax `@my_decorator` placed above `def greet(): pass` equivalent to in Python?",
    "options": [
      "greet = my_decorator()",
      "greet = my_decorator(greet)",
      "my_decorator = greet(my_decorator)",
      "class greet(my_decorator): pass"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "The `@` decorator syntax is syntactic sugar. Writing `@my_decorator` immediately preceding `def greet(): ...` is precisely equivalent to executing `greet = my_decorator(greet)` after the function is defined.",
    "companyTags": [
      "TCS Ninja",
      "Infosys",
      "Wipro"
    ],
    "company_tags": [
      "TCS Ninja",
      "Infosys",
      "Wipro"
    ],
    "difficulty": "BASIC",
    "sort_order": 26,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-27",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Why is `@functools.wraps(func)` commonly used inside custom decorator wrapper functions?",
    "options": [
      "To make the decorated function thread-safe.",
      "To preserve the original function's metadata (such as `__name__`, `__doc__`, and signature) instead of being masked by the wrapper.",
      "To automatically catch and log exceptions in the decorated function.",
      "To compile the function into C bytecode."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Without `@functools.wraps(func)`, the decorated function's `__name__` would report `'wrapper'` and its docstring would be overwritten by the wrapper's docstring. `@wraps` copies over the original function attributes.",
    "companyTags": [
      "Amazon",
      "Flipkart",
      "Oracle"
    ],
    "company_tags": [
      "Amazon",
      "Flipkart",
      "Oracle"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 27,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-28",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of executing the stacked decorators below?",
    "codeSnippet": "def dec1(func):\n    def wrapper():\n        return \"<1>\" + func() + \"</1>\"\n    return wrapper\n\ndef dec2(func):\n    def wrapper():\n        return \"<2>\" + func() + \"</2>\"\n    return wrapper\n\n@dec1\n@dec2\ndef hello():\n    return \"Hi\"\n\nprint(hello())",
    "code_snippet": "def dec1(func):\n    def wrapper():\n        return \"<1>\" + func() + \"</1>\"\n    return wrapper\n\ndef dec2(func):\n    def wrapper():\n        return \"<2>\" + func() + \"</2>\"\n    return wrapper\n\n@dec1\n@dec2\ndef hello():\n    return \"Hi\"\n\nprint(hello())",
    "options": [
      "<1><2>Hi</2></1>",
      "<2><1>Hi</1></2>",
      "<1>Hi</1><2>Hi</2>",
      "Compilation error"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Decorators apply from bottom to top: `hello = dec1(dec2(hello))`. 1) `dec2(hello)` wraps `\"Hi\"` into `\"<2>Hi</2>\"`. 2) `dec1(...)` wraps that into `\"<1><2>Hi</2></1>\"`.",
    "companyTags": [
      "Adobe",
      "Microsoft",
      "Optum"
    ],
    "company_tags": [
      "Adobe",
      "Microsoft",
      "Optum"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 28,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-29",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "What causes a TypeError when creating a decorator that accepts arguments like `@repeat(num=3)`?",
    "codeSnippet": "def repeat(num):\n    # If missing an inner function layer:\n    def wrapper(func):\n        pass\n    return wrapper",
    "code_snippet": "def repeat(num):\n    # If missing an inner function layer:\n    def wrapper(func):\n        pass\n    return wrapper",
    "options": [
      "Decorators cannot accept keyword arguments.",
      "A decorator with arguments requires three levels of functions: the outer takes decorator arguments, the middle takes the function, and the inner takes the function arguments.",
      "num must be a string.",
      "functools is mandatory for parameterized decorators."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "A decorator factory with arguments (like `@repeat(3)`) is called first with its parameters (`repeat(3)`), which must return the actual decorator function taking `func`, which in turn returns the callable `wrapper(*args, **kwargs)`.",
    "companyTags": [
      "Cisco",
      "Paytm",
      "Accenture"
    ],
    "company_tags": [
      "Cisco",
      "Paytm",
      "Accenture"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 29,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-30",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is a 'Closure' in Python, and what special attribute stores its captured cell variables?",
    "options": [
      "A function that returns void; stored in `__void__`.",
      "A nested function that retains bindings to variables in its enclosing scope even after the outer function has finished execution; stored in `__closure__`.",
      "A class with no methods; stored in `__slots__`.",
      "A background daemon thread; stored in `__thread__`."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "A closure is a function that remembers and accesses variables from its lexical enclosing scope even after the enclosing scope has closed. Captured non-local variables are stored as cell objects in the function's `__closure__` tuple attribute.",
    "companyTags": [
      "Google",
      "Bloomberg",
      "DE Shaw"
    ],
    "company_tags": [
      "Google",
      "Bloomberg",
      "DE Shaw"
    ],
    "difficulty": "HARD",
    "sort_order": 30,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-31",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the difference between `@classmethod` and `@staticmethod` in Python?",
    "options": [
      "@classmethod takes the class (`cls`) as its first parameter; @staticmethod takes neither `self` nor `cls`.",
      "@staticmethod can only access private variables; @classmethod cannot.",
      "@classmethod can only be called from an instantiated object.",
      "@staticmethod is deprecated in Python 3."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "`@classmethod` receives the class object as its implicit first argument (`cls`), allowing factory methods and class-level state modifications. `@staticmethod` behaves like a plain function placed inside a class namespace without receiving implicit `self` or `cls`.",
    "companyTags": [
      "TCS",
      "Cognizant",
      "Infosys"
    ],
    "company_tags": [
      "TCS",
      "Cognizant",
      "Infosys"
    ],
    "difficulty": "BASIC",
    "sort_order": 31,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-32",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the difference between `__str__` and `__repr__` special methods in Python?",
    "options": [
      "__str__ is for serialization; __repr__ is for comparisons.",
      "__str__ provides an informal, human-readable representation for end users; __repr__ provides an unambiguous, detailed representation primarily for developers and debugging.",
      "__repr__ cannot return strings with whitespace.",
      "__str__ is only called when converting to an integer."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "`__str__` is intended for end-user readability (invoked by `str(obj)` and `print(obj)`). `__repr__` is intended for developers and debugging (ideally returning valid Python code that could recreate the object). If `__str__` is omitted, Python falls back to `__repr__`.",
    "companyTags": [
      "Amazon",
      "Microsoft",
      "Adobe"
    ],
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Adobe"
    ],
    "difficulty": "BASIC",
    "sort_order": 32,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-33",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What algorithm does Python use to compute the Method Resolution Order (MRO) for multiple inheritance?",
    "codeSnippet": "class A: pass\nclass B(A): pass\nclass C(A): pass\nclass D(B, C): pass\nprint([cls.__name__ for cls in D.mro()])",
    "code_snippet": "class A: pass\nclass B(A): pass\nclass C(A): pass\nclass D(B, C): pass\nprint([cls.__name__ for cls in D.mro()])",
    "options": [
      "['D', 'B', 'A', 'C', 'object']",
      "['D', 'B', 'C', 'A', 'object']",
      "['D', 'C', 'B', 'A', 'object']",
      "['D', 'A', 'B', 'C', 'object']"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Python uses the C3 Linearization algorithm to compute the MRO. For diamond inheritance, it visits subclasses before superclasses while preserving the declared order of base classes: `D -> B -> C -> A -> object`.",
    "companyTags": [
      "Goldman Sachs",
      "Morgan Stanley",
      "Google"
    ],
    "company_tags": [
      "Goldman Sachs",
      "Morgan Stanley",
      "Google"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 33,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-34",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "How does Python enforce 'pseudo-private' attributes starting with double underscores (e.g., `__secret`), and how can they still be accessed?",
    "codeSnippet": "class Account:\n    def __init__(self):\n        self.__pin = 1234\n\na = Account()\n# a.__pin throws AttributeError. How is it accessed?",
    "code_snippet": "class Account:\n    def __init__(self):\n        self.__pin = 1234\n\na = Account()\n# a.__pin throws AttributeError. How is it accessed?",
    "options": [
      "Through `a._Account__pin` due to name mangling.",
      "Through `Account.pin(a)`.",
      "It is completely inaccessible and protected at the OS kernel level.",
      "Through `a.__getattr__('__pin')`."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Python performs 'Name Mangling' on any identifier prefixed with at least two underscores (and at most one trailing underscore), rewriting `__pin` to `_ClassName__attributeName` (`_Account__pin`). It prevents accidental subclass overriding, but does not provide true security.",
    "companyTags": [
      "Qualcomm",
      "Cisco",
      "Oracle"
    ],
    "company_tags": [
      "Qualcomm",
      "Cisco",
      "Oracle"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 34,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-35",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the primary memory optimization benefit of defining `__slots__` in a Python class?",
    "codeSnippet": "class Point:\n    __slots__ = ('x', 'y')",
    "code_snippet": "class Point:\n    __slots__ = ('x', 'y')",
    "options": [
      "It prevents the class from being garbage collected.",
      "It prevents the creation of a dynamic `__dict__` for each instance, storing attributes in a compact fixed-size array and dramatically reducing memory overhead.",
      "It forces Python to compile the class to assembly.",
      "It makes all attributes read-only."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "By default, Python instances store attributes in a dynamic dictionary (`__dict__`), which carries significant memory overhead. `__slots__` tells Python to allocate a fixed-size array of references instead of `__dict__`, reducing memory consumption by up to 60-70% for millions of small objects.",
    "companyTags": [
      "DE Shaw",
      "Bloomberg",
      "Tower Research"
    ],
    "company_tags": [
      "DE Shaw",
      "Bloomberg",
      "Tower Research"
    ],
    "difficulty": "HARD",
    "sort_order": 35,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-36",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "When does the 'else' block execute in a Python try-except-else-finally construct?",
    "codeSnippet": "try:\n    do_work()\nexcept ValueError:\n    handle_error()\nelse:\n    do_success()\nfinally:\n    cleanup()",
    "code_snippet": "try:\n    do_work()\nexcept ValueError:\n    handle_error()\nelse:\n    do_success()\nfinally:\n    cleanup()",
    "options": [
      "Whenever an exception is caught by the except block.",
      "Only if NO exceptions were raised in the try block.",
      "Only if an unhandled exception occurred.",
      "Before the try block begins."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "In Python, the `else` clause of a `try` statement runs if and only if the `try` block completed successfully without raising any exceptions. The `finally` block runs unconditionally regardless of exceptions.",
    "companyTags": [
      "TCS",
      "Accenture",
      "Cognizant"
    ],
    "company_tags": [
      "TCS",
      "Accenture",
      "Cognizant"
    ],
    "difficulty": "BASIC",
    "sort_order": 36,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-37",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What two dunder methods must an object implement to support the 'with' statement (Context Manager protocol)?",
    "codeSnippet": "with ManagedResource() as res:\n    res.work()",
    "code_snippet": "with ManagedResource() as res:\n    res.work()",
    "options": [
      "__start__ and __stop__",
      "__enter__ and __exit__",
      "__open__ and __close__",
      "__init__ and __del__"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "The Context Manager protocol requires `__enter__()` (invoked before the `with` block begins, whose return value binds to `as var`) and `__exit__(exc_type, exc_val, exc_tb)` (invoked after the block exits, handling any raised exceptions).",
    "companyTags": [
      "Amazon",
      "Cisco",
      "Paytm"
    ],
    "company_tags": [
      "Amazon",
      "Cisco",
      "Paytm"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 37,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-38",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "How can a custom context manager's `__exit__` method suppress an exception raised inside the with block?",
    "codeSnippet": "class SuppressError:\n    def __enter__(self): return self\n    def __exit__(self, exc_type, exc_val, exc_tb):\n        return True # Line 4\n\nwith SuppressError():\n    raise ValueError(\"Fail\")\nprint(\"Done\")",
    "code_snippet": "class SuppressError:\n    def __enter__(self): return self\n    def __exit__(self, exc_type, exc_val, exc_tb):\n        return True # Line 4\n\nwith SuppressError():\n    raise ValueError(\"Fail\")\nprint(\"Done\")",
    "options": [
      "Program crashes with ValueError.",
      "Prints 'Done' because returning True from `__exit__` suppresses the exception.",
      "SyntaxError on Line 4.",
      "Prints 'ValueError'."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "If the `__exit__` method returns a truthy value (`return True`), Python suppresses the active exception and continues execution immediately after the `with` block, printing `Done`.",
    "companyTags": [
      "Microsoft",
      "Adobe",
      "Oracle"
    ],
    "company_tags": [
      "Microsoft",
      "Adobe",
      "Oracle"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 38,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-39",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "Why should custom user-defined exceptions inherit from `Exception` rather than `BaseException` in Python?",
    "codeSnippet": "class MyError(BaseException): pass",
    "code_snippet": "class MyError(BaseException): pass",
    "options": [
      "BaseException cannot be raised with the 'raise' statement.",
      "Inheriting from BaseException bypasses `except Exception:`, preventing standard error catch blocks from catching it and intercepting system-exiting signals like KeyboardInterrupt.",
      "BaseException requires three arguments in its constructor.",
      "Python 3 deprecated BaseException."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "`BaseException` is the root of the exception hierarchy designed for system-exiting exceptions (`KeyboardInterrupt`, `SystemExit`, `GeneratorExit`). Catch-all blocks like `except Exception:` intentionally do not catch `BaseException`. Custom business exceptions must inherit from `Exception`.",
    "companyTags": [
      "Google",
      "Bloomberg",
      "Goldman Sachs"
    ],
    "company_tags": [
      "Google",
      "Bloomberg",
      "Goldman Sachs"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 39,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-40",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "In exception chaining (`raise RuntimeError(...) from err`), what does `raise ... from None` do?",
    "codeSnippet": "try:\n    int(\"abc\")\nexcept ValueError as e:\n    raise RuntimeError(\"Invalid input\") from None",
    "code_snippet": "try:\n    int(\"abc\")\nexcept ValueError as e:\n    raise RuntimeError(\"Invalid input\") from None",
    "options": [
      "Raises no exception.",
      "Explicitly suppresses the display of the original exception context (`__cause__`), outputting only the new exception without traceback chaining.",
      "Causes a MemoryError.",
      "Converts the exception to a warning."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Using `from None` sets `__cause__ = None` and `__suppress_context__ = True`, cleanly suppressing the previous traceback (e.g. hiding internal implementation details like `ValueError: invalid literal`) and reporting only the clean `RuntimeError`.",
    "companyTags": [
      "DE Shaw",
      "Morgan Stanley",
      "Uber"
    ],
    "company_tags": [
      "DE Shaw",
      "Morgan Stanley",
      "Uber"
    ],
    "difficulty": "HARD",
    "sort_order": 40,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-41",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the time complexity of appending and popping elements from either end of a `collections.deque` compared to a standard Python `list`?",
    "options": [
      "deque is O(1) at both ends; list is O(1) at the end but O(n) for left-side operations (insert(0) or pop(0)).",
      "list is O(1) at both ends; deque is O(n).",
      "Both list and deque are O(1) for all operations.",
      "deque requires O(log n) because it is a binary tree."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "`collections.deque` is implemented as a doubly linked list of blocks, providing guaranteed $O(1)$ amortized pushes and pops from both ends. A standard `list` is a contiguous dynamic array, making left-end insertions and deletions (`pop(0)`) $O(n)$ due to element shifting.",
    "companyTags": [
      "TCS Ninja",
      "Infosys",
      "Cognizant"
    ],
    "company_tags": [
      "TCS Ninja",
      "Infosys",
      "Cognizant"
    ],
    "difficulty": "BASIC",
    "sort_order": 41,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-42",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What does `collections.defaultdict(int)` do when accessing a non-existent key?",
    "codeSnippet": "from collections import defaultdict\nd = defaultdict(int)\nprint(d[\"missing\"])",
    "code_snippet": "from collections import defaultdict\nd = defaultdict(int)\nprint(d[\"missing\"])",
    "options": [
      "Raises a KeyError.",
      "Returns None.",
      "Automatically inserts the key with the default value of int() (which is 0) and returns 0.",
      "Returns -1."
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "`defaultdict` takes a default factory callable (here `int`). When a missing key is accessed, it calls `int()` to produce `0`, stores `\"missing\": 0` in the dictionary, and returns `0` without raising `KeyError`.",
    "companyTags": [
      "Wipro",
      "Accenture",
      "Capgemini"
    ],
    "company_tags": [
      "Wipro",
      "Accenture",
      "Capgemini"
    ],
    "difficulty": "BASIC",
    "sort_order": 42,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-43",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of counting characters using `collections.Counter` and calling `most_common(1)`?",
    "codeSnippet": "from collections import Counter\nc = Counter(\"abracadabra\")\nprint(c.most_common(1))",
    "code_snippet": "from collections import Counter\nc = Counter(\"abracadabra\")\nprint(c.most_common(1))",
    "options": [
      "[('a', 5)]",
      "('a', 5)",
      "{'a': 5}",
      "['a']"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "`Counter.most_common(n)` returns a list of the `n` most common elements and their counts as tuples, from the most common to the least. 'a' appears 5 times, so `most_common(1)` returns `[('a', 5)]`.",
    "companyTags": [
      "Amazon",
      "Flipkart",
      "Optum"
    ],
    "company_tags": [
      "Amazon",
      "Flipkart",
      "Optum"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 43,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-44",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the difference between `itertools.permutations` and `itertools.combinations` on `[1, 2]` with length 2?",
    "codeSnippet": "import itertools\np = list(itertools.permutations([1, 2], 2))\nc = list(itertools.combinations([1, 2], 2))\nprint(len(p), len(c))",
    "code_snippet": "import itertools\np = list(itertools.permutations([1, 2], 2))\nc = list(itertools.combinations([1, 2], 2))\nprint(len(p), len(c))",
    "options": [
      "2 1",
      "2 2",
      "4 2",
      "1 2"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "`permutations` treats order as significant: `(1, 2)` and `(2, 1)` (total 2). `combinations` considers order insignificant: only `(1, 2)` (total 1). Output: `2 1`.",
    "companyTags": [
      "Adobe",
      "Microsoft",
      "Paytm"
    ],
    "company_tags": [
      "Adobe",
      "Microsoft",
      "Paytm"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 44,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-45",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What heap ordering invariant does Python's `heapq` module maintain by default?",
    "codeSnippet": "import heapq\nh = [20, 10, 30]\nheapq.heapify(h)",
    "code_snippet": "import heapq\nh = [20, 10, 30]\nheapq.heapify(h)",
    "options": [
      "Max-heap (root `h[0]` is always the largest element).",
      "Min-heap (root `h[0]` is always the smallest element).",
      "Dual-ended heap.",
      "Fibonacci heap."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Python's `heapq` module provides a Min-Heap implementation where `h[0]` is always the smallest element. To simulate a max-heap, values are commonly negated (`-val`).",
    "companyTags": [
      "Goldman Sachs",
      "Google",
      "DE Shaw"
    ],
    "company_tags": [
      "Goldman Sachs",
      "Google",
      "DE Shaw"
    ],
    "difficulty": "HARD",
    "sort_order": 45,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-46",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What primary mechanism does CPython use for automatic memory reclamation?",
    "options": [
      "Mark-and-sweep exclusively.",
      "Reference counting supplemented by a cyclic garbage collector (generational gc).",
      "Manual malloc and free by the programmer.",
      "Compile-time static borrow checking."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "CPython's core memory management is based on Reference Counting: an object is deallocated immediately when its reference count drops to zero. To resolve circular references (where two dead objects reference each other), Python supplements it with a generational cyclic garbage collector.",
    "companyTags": [
      "TCS",
      "Infosys",
      "Cognizant"
    ],
    "company_tags": [
      "TCS",
      "Infosys",
      "Cognizant"
    ],
    "difficulty": "BASIC",
    "sort_order": 46,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-47",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the Global Interpreter Lock (GIL) in CPython?",
    "options": [
      "A lock that prevents Python from connecting to the internet.",
      "A mutex that protects access to Python objects, preventing multiple native OS threads from executing Python bytecodes concurrently on multiple CPU cores.",
      "A database lock that synchronizes SQLite transactions.",
      "A security sandbox that disables file system writes."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "The GIL is a mutex used by CPython to ensure that only one thread executes Python bytecode at a time, simplifying CPython's C-extension integration and reference counting. Because of the GIL, standard multithreading cannot achieve true CPU-bound parallelism in CPython.",
    "companyTags": [
      "Amazon",
      "Cisco",
      "Adobe"
    ],
    "company_tags": [
      "Amazon",
      "Cisco",
      "Adobe"
    ],
    "difficulty": "BASIC",
    "sort_order": 47,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-48",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Because of the Global Interpreter Lock (GIL), how should CPU-bound tasks be parallelized in Python to utilize multiple CPU cores?",
    "options": [
      "Using the `threading` module with higher thread priority.",
      "Using the `multiprocessing` module (or `concurrent.futures.ProcessPoolExecutor`) to spawn separate OS processes with independent GILs.",
      "By setting `sys.setcheckinterval(0)`.",
      "By wrapping CPU loops inside async/await coroutines."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Because each OS process has its own independent Python interpreter and its own private GIL, using `multiprocessing` allows multiple CPU cores to be utilized concurrently for CPU-intensive calculations.",
    "companyTags": [
      "Microsoft",
      "Google",
      "Oracle"
    ],
    "company_tags": [
      "Microsoft",
      "Google",
      "Oracle"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 48,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-49",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "What causes memory to leak in a Python application despite reference counting and garbage collection?",
    "options": [
      "Creating objects inside a generator.",
      "Appending objects to module-level global lists or dictionaries without ever removing them, keeping reference counts above zero.",
      "Using recursion with base cases.",
      "Using lambda expressions."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Python's garbage collector only reclaims objects whose reference count reaches zero or unreferenced isolated cyclic groups. Objects that remain referenced by long-lived global containers, class caches, or circular references with `__del__` (in older Python versions) cannot be freed.",
    "companyTags": [
      "DE Shaw",
      "Bloomberg",
      "Tower Research"
    ],
    "company_tags": [
      "DE Shaw",
      "Bloomberg",
      "Tower Research"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 49,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "py-mcq-50",
    "topicId": "mcq-python-programming",
    "topic_id": "mcq-python-programming",
    "topic": "Python Language",
    "topic_name": "Python Language",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is stored inside a Python `.pyc` file compiled into the `__pycache__` directory?",
    "options": [
      "Native machine code binary compiled for the host CPU.",
      "Serialized Python bytecode (marshalled PyCodeObject) and header metadata (magic number and timestamp) to skip re-parsing on future imports.",
      "Encrypted source code for digital rights management.",
      "C source files generated by Cython."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "`.pyc` files contain platform-independent bytecode generated by Python's parser and compiler. They include a header (magic number verifying Python version + file timestamp/hash) followed by the marshalled code object (`PyCodeObject`), allowing Python to bypass parsing and compilation on subsequent imports.",
    "companyTags": [
      "Google",
      "Microsoft",
      "Goldman Sachs"
    ],
    "company_tags": [
      "Google",
      "Microsoft",
      "Goldman Sachs"
    ],
    "difficulty": "HARD",
    "sort_order": 50,
    "is_hidden": false,
    "is_deleted": false
  }
];

export const OOPS_CONCEPTS_MCQ_SEED: TechnicalMcq[] = [
  {
    "id": "mcq-oops-1",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Which of the following statements most accurately captures the fundamental architectural difference between Abstraction and Encapsulation?",
    "options": [
      "Abstraction is hiding the implementation details and showing only essential features to the user, whereas Encapsulation is bundling data and the methods that operate on that data into a single unit while restricting direct access.",
      "Encapsulation is hiding internal implementation details using abstract classes, whereas Abstraction is declaring private variables with public getters.",
      "Abstraction occurs only at runtime through dynamic polymorphism, whereas Encapsulation is strictly a compile-time mechanism.",
      "There is no functional difference; both terms are interchangeable synonyms for data hiding in object-oriented programming."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Abstraction focuses on 'what' an entity does by exposing only high-level conceptual interfaces while hiding complex internal mechanics (achieved via abstract classes and interfaces). Encapsulation focuses on 'how' an entity is constructed by binding fields and methods into a cohesive unit and restricting direct state access via visibility modifiers (data hiding).",
    "companyTags": [
      "TCS Digital",
      "Infosys",
      "Wipro Turbo"
    ],
    "company_tags": [
      "TCS Digital",
      "Infosys",
      "Wipro Turbo"
    ],
    "difficulty": "BASIC",
    "sort_order": 1,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-2",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "In standard Java access level specifications, which access modifier allows access from any class in the same package and any subclass in a different package, but restricts access from non-subclasses in different packages?",
    "options": [
      "public",
      "protected",
      "default (package-private)",
      "private"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "In Java's access matrix:\n- `public`: Accessible from everywhere.\n- `protected`: Accessible within the same package AND by subclasses in different packages.\n- `default (package-private)`: Accessible strictly within the same package (not accessible by subclasses in other packages).\n- `private`: Accessible only within the declaring class.",
    "companyTags": [
      "Cognizant GenC Next",
      "Accenture",
      "Capgemini"
    ],
    "company_tags": [
      "Cognizant GenC Next",
      "Accenture",
      "Capgemini"
    ],
    "difficulty": "BASIC",
    "sort_order": 2,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-3",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What will be the output of the following Java code demonstrating object identity versus state equality?",
    "codeSnippet": "class Student {\n    int id;\n    Student(int id) { this.id = id; }\n}\npublic class Main {\n    public static void main(String[] args) {\n        Student s1 = new Student(101);\n        Student s2 = new Student(101);\n        System.out.println((s1 == s2) + \" \" + s1.equals(s2));\n    }\n}",
    "code_snippet": "class Student {\n    int id;\n    Student(int id) { this.id = id; }\n}\npublic class Main {\n    public static void main(String[] args) {\n        Student s1 = new Student(101);\n        Student s2 = new Student(101);\n        System.out.println((s1 == s2) + \" \" + s1.equals(s2));\n    }\n}",
    "options": [
      "true true",
      "false true",
      "false false",
      "true false"
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "The `==` operator checks reference identity (memory addresses), which are distinct because `s1` and `s2` were created via separate `new` allocations. Because `Student` does not override `equals()`, it inherits `Object.equals()`, which also defaults to reference equality (`this == obj`). Therefore, both evaluate to `false`.",
    "companyTags": [
      "Amazon",
      "TCS Digital",
      "Infosys SP"
    ],
    "company_tags": [
      "Amazon",
      "TCS Digital",
      "Infosys SP"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 3,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-4",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "Why does the following class fail to achieve true immutability and leak encapsulated state?",
    "codeSnippet": "public final class UserProfile {\n    private final String username;\n    private final java.util.Date birthDate;\n\n    public UserProfile(String username, java.util.Date birthDate) {\n        this.username = username;\n        this.birthDate = birthDate;\n    }\n    public String getUsername() { return username; }\n    public java.util.Date getBirthDate() { return birthDate; }\n}",
    "code_snippet": "public final class UserProfile {\n    private final String username;\n    private final java.util.Date birthDate;\n\n    public UserProfile(String username, java.util.Date birthDate) {\n        this.username = username;\n        this.birthDate = birthDate;\n    }\n    public String getUsername() { return username; }\n    public java.util.Date getBirthDate() { return birthDate; }\n}",
    "options": [
      "The class cannot be declared final if it contains private final fields.",
      "`java.util.Date` is a mutable class; the constructor and getter return direct references rather than defensive copies, allowing external code to modify internal state.",
      "The `username` string can be mutated in place via pointer modification.",
      "A class cannot be immutable unless it implements the `java.lang.Cloneable` interface."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "`java.util.Date` is mutable (e.g. `user.getBirthDate().setTime(0)` alters the date). To achieve true immutability, the constructor must create a defensive copy (`this.birthDate = new Date(birthDate.getTime())`) and the getter must also return a defensive clone (`return new Date(this.birthDate.getTime())`), or use immutable types like `java.time.LocalDate`.",
    "companyTags": [
      "Goldman Sachs",
      "Morgan Stanley",
      "Cisco"
    ],
    "company_tags": [
      "Goldman Sachs",
      "Morgan Stanley",
      "Cisco"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 4,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-5",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "In software design, which scenario represents a high-cohesion, low-coupling design architecture?",
    "options": [
      "A single monolith class handles user authentication, database persistence, email notifications, and PDF billing directly.",
      "Multiple classes share public mutable global state so they can instantly communicate without invoking methods.",
      "Each class has a single, well-defined responsibility and interacts with other components exclusively through minimal, well-documented abstract interfaces.",
      "Every class inherits from every other class in a circular dependency to maximize code reuse."
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "High cohesion means elements within a module or class work together toward a single, focused, tightly related purpose. Low coupling means distinct modules depend on each other as little as possible (relying on abstractions rather than concrete implementations), minimizing ripple effects when requirements change.",
    "companyTags": [
      "Microsoft",
      "Oracle",
      "Adobe"
    ],
    "company_tags": [
      "Microsoft",
      "Oracle",
      "Adobe"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 5,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-6",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the primary architectural justification for the OOP guideline 'Favor Object Composition over Class Inheritance'?",
    "options": [
      "Inheritance violates encapsulation because subclasses depend on parent implementation details (the fragile base class problem), whereas composition preserves encapsulation and enables dynamic runtime behavior changes.",
      "Inheritance allocates memory on the stack whereas composition allocates memory on the heap.",
      "Composition completely eliminates the need for unit testing.",
      "Inheritance allows multiple classes to share private variables directly without getters, which is forbidden in composition."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Class inheritance creates a compile-time static binding where derived classes are tightly coupled to base class internal implementations. If the superclass changes, subclasses may break silently (the fragile base class problem). Composition ('has-a') keeps internal details encapsulated behind interfaces and allows swapping strategies or behaviors dynamically at runtime.",
    "companyTags": [
      "Google",
      "Amazon",
      "Goldman Sachs"
    ],
    "company_tags": [
      "Google",
      "Amazon",
      "Goldman Sachs"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 6,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-7",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Which of the following correctly characterizes the difference between Aggregation and Composition in UML association relationships?",
    "options": [
      "Aggregation implies strong ownership where the child cannot exist without the parent; Composition implies weak ownership with independent lifecycles.",
      "Composition represents a strong 'death relationship' where the contained object's lifecycle is strictly owned and bound to the container; Aggregation represents a weak 'has-a' relationship where child objects can outlive the parent.",
      "Aggregation can only be implemented using interfaces, whereas Composition can only be implemented using abstract classes.",
      "Composition allows an object to belong to multiple owners simultaneously, whereas Aggregation forbids multiple owners."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "In UML:\n- Composition (filled diamond): Strong ownership. If a `Building` object is destroyed, its constituent `Room` objects cease to exist.\n- Aggregation (hollow diamond): Weak ownership. A `Department` aggregates `Professors`; if the `Department` is dissolved, the `Professors` continue to exist independently.",
    "companyTags": [
      "TCS Digital",
      "Wipro",
      "Cognizant"
    ],
    "company_tags": [
      "TCS Digital",
      "Wipro",
      "Cognizant"
    ],
    "difficulty": "BASIC",
    "sort_order": 7,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-8",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "In C++, how is the classic 'Diamond Problem' of multiple inheritance (where two derived classes inherit from a common base class, and a fourth class inherits from both) resolved to ensure only one shared base subobject exists?",
    "options": [
      "By declaring the common base class methods with the `override` specifier.",
      "By inheriting the common base class using the `virtual` inheritance specifier (`virtual public Base`).",
      "By declaring all member variables in the common base class as `static`.",
      "By making the fourth class inherit privately from both intermediate classes."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "In C++, virtual inheritance (`class B : virtual public A` and `class C : virtual public A`) instructs the compiler that classes `B` and `C` share a single, common base instance of `A` inside any most-derived class `D`. This eliminates ambiguous duplication of `A`'s member variables and methods.",
    "companyTags": [
      "Qualcomm",
      "Cisco",
      "Nvidia"
    ],
    "company_tags": [
      "Qualcomm",
      "Cisco",
      "Nvidia"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 8,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-9",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the exact sequence printed when an instance of class `Child` is instantiated in the following Java program?",
    "codeSnippet": "class GrandParent {\n    GrandParent() { System.out.print(\"GP \"); }\n}\nclass Parent extends GrandParent {\n    Parent() { System.out.print(\"P \"); }\n}\nclass Child extends Parent {\n    Child() { System.out.print(\"C \"); }\n}\npublic class Test {\n    public static void main(String[] args) {\n        new Child();\n    }\n}",
    "code_snippet": "class GrandParent {\n    GrandParent() { System.out.print(\"GP \"); }\n}\nclass Parent extends GrandParent {\n    Parent() { System.out.print(\"P \"); }\n}\nclass Child extends Parent {\n    Child() { System.out.print(\"C \"); }\n}\npublic class Test {\n    public static void main(String[] args) {\n        new Child();\n    }\n}",
    "options": [
      "C P GP",
      "GP P C",
      "P GP C",
      "C GP P"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "During object creation in an inheritance hierarchy, a subclass constructor implicitly invokes `super()` as its first statement. The call propagates upward until reaching `java.lang.Object`. Constructors then execute in top-down order (base first, derived last): `GrandParent()` prints 'GP ', `Parent()` prints 'P ', and `Child()` prints 'C '.",
    "companyTags": [
      "Infosys",
      "TCS",
      "Accenture"
    ],
    "company_tags": [
      "Infosys",
      "TCS",
      "Accenture"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 9,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-10",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "What is the compiler error produced by the following Java code?",
    "codeSnippet": "class Alpha {\n    Alpha(int x) {\n        System.out.println(\"Alpha: \" + x);\n    }\n}\nclass Beta extends Alpha {\n    Beta() {\n        System.out.println(\"Beta\");\n    }\n}",
    "code_snippet": "class Alpha {\n    Alpha(int x) {\n        System.out.println(\"Alpha: \" + x);\n    }\n}\nclass Beta extends Alpha {\n    Beta() {\n        System.out.println(\"Beta\");\n    }\n}",
    "options": [
      "Compile error in class `Alpha`: constructors cannot take parameters without a default constructor.",
      "Compile error in class `Beta`: implicit super constructor `Alpha()` is undefined for default constructor call.",
      "Compile error: `Beta` cannot inherit from `Alpha` unless marked `open`.",
      "No error; the compiler automatically generates a parameterless default constructor for `Alpha`."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "When a class defines any explicit parameterized constructor (`Alpha(int x)`), the compiler no longer supplies a default zero-argument constructor. In `Beta()`, the compiler automatically inserts an implicit `super();` call. Because `Alpha` has no no-arg constructor, compilation fails with: 'Implicit super constructor Alpha() is undefined'.",
    "companyTags": [
      "Amazon",
      "Cognizant GenC Next",
      "Zoho"
    ],
    "company_tags": [
      "Amazon",
      "Cognizant GenC Next",
      "Zoho"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 10,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-11",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Which mechanism enables Runtime (Dynamic) Polymorphism in object-oriented programming languages?",
    "options": [
      "Function overloading with varying return types resolved by the preprocessor.",
      "Dynamic Method Dispatch using virtual method tables (vtables) resolved at runtime based on the actual object type.",
      "Static early binding resolved by the linker at compile time.",
      "Operator overloading evaluated during abstract syntax tree parsing."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Runtime polymorphism relies on Dynamic Method Dispatch. When a method is called on a reference variable pointing to a derived object, the runtime engine looks up the method address in the object's virtual method table (`vtable` via `vptr`) based on the concrete instantiated class, rather than the reference type.",
    "companyTags": [
      "TCS Digital",
      "Microsoft",
      "Oracle"
    ],
    "company_tags": [
      "TCS Digital",
      "Microsoft",
      "Oracle"
    ],
    "difficulty": "BASIC",
    "sort_order": 11,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-12",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of the following Java program demonstrating variable shadowing versus dynamic method overriding?",
    "codeSnippet": "class Base {\n    int val = 10;\n    void show() { System.out.print(\"Base::\" + val + \" \"); }\n}\nclass Derived extends Base {\n    int val = 20;\n    void show() { System.out.print(\"Derived::\" + val + \" \"); }\n}\npublic class Test {\n    public static void main(String[] args) {\n        Base obj = new Derived();\n        System.out.print(obj.val + \" \");\n        obj.show();\n    }\n}",
    "code_snippet": "class Base {\n    int val = 10;\n    void show() { System.out.print(\"Base::\" + val + \" \"); }\n}\nclass Derived extends Base {\n    int val = 20;\n    void show() { System.out.print(\"Derived::\" + val + \" \"); }\n}\npublic class Test {\n    public static void main(String[] args) {\n        Base obj = new Derived();\n        System.out.print(obj.val + \" \");\n        obj.show();\n    }\n}",
    "options": [
      "20 Derived::20",
      "10 Base::10",
      "10 Derived::20",
      "20 Base::10"
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "In Java:\n1. Fields (variables) are NOT polymorphic; they are resolved at compile-time based on the reference type (`Base obj` -> `obj.val` yields 10).\n2. Instance methods ARE polymorphic; `obj.show()` is dispatched dynamically at runtime to the actual instance (`Derived`), where `this.val` evaluates to 20. Output is '10 Derived::20 '.",
    "companyTags": [
      "Amazon",
      "Goldman Sachs",
      "Infosys SP"
    ],
    "company_tags": [
      "Amazon",
      "Goldman Sachs",
      "Infosys SP"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 12,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-13",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "Can static methods in Java be overridden to achieve runtime polymorphism?",
    "options": [
      "Yes, static methods participate in runtime polymorphism if the `@Override` annotation is present.",
      "No, static methods belong to the class rather than individual instances; defining an identical static method in a subclass results in method hiding (shadowing), resolved at compile time.",
      "Yes, provided both static methods have identical access specifiers and parameter signatures.",
      "No, Java produces a fatal compiler syntax error if a subclass defines a static method with the same name as a superclass static method."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Static methods are bound statically at compile-time to the class reference type (early binding). If a subclass declares a static method with the identical signature as one in the superclass, it 'hides' the superclass method rather than overriding it. Calling it via a parent reference executes the parent's static method.",
    "companyTags": [
      "Cognizant GenC Next",
      "TCS Digital",
      "Wipro"
    ],
    "company_tags": [
      "Cognizant GenC Next",
      "TCS Digital",
      "Wipro"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 13,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-14",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of the following C++ program involving virtual functions?",
    "codeSnippet": "#include <iostream>\nclass Base {\npublic:\n    virtual void print(int x = 10) {\n        std::cout << \"Base: \" << x << std::endl;\n    }\n};\nclass Derived : public Base {\npublic:\n    void print(int x = 20) override {\n        std::cout << \"Derived: \" << x << std::endl;\n    }\n};\nint main() {\n    Base* ptr = new Derived();\n    ptr->print();\n    delete ptr;\n    return 0;\n}",
    "code_snippet": "#include <iostream>\nclass Base {\npublic:\n    virtual void print(int x = 10) {\n        std::cout << \"Base: \" << x << std::endl;\n    }\n};\nclass Derived : public Base {\npublic:\n    void print(int x = 20) override {\n        std::cout << \"Derived: \" << x << std::endl;\n    }\n};\nint main() {\n    Base* ptr = new Derived();\n    ptr->print();\n    delete ptr;\n    return 0;\n}",
    "options": [
      "Derived: 20",
      "Derived: 10",
      "Base: 10",
      "Base: 20"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "In C++, virtual functions are dynamically bound at runtime, BUT default parameter values are statically bound at compile time based on the static type of the pointer (`Base*`). The compiler substitutes `Base::print`'s default argument (10) into the call site, while dynamic dispatch invokes `Derived::print`. The result is 'Derived: 10'.",
    "companyTags": [
      "Google",
      "Adobe",
      "Qualcomm"
    ],
    "company_tags": [
      "Google",
      "Adobe",
      "Qualcomm"
    ],
    "difficulty": "HARD",
    "sort_order": 14,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-15",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "What is invalid about the following Java method overloading attempt?",
    "codeSnippet": "class Calculator {\n    public int compute(int a, int b) {\n        return a + b;\n    }\n    public double compute(int a, int b) {\n        return (double)(a + b);\n    }\n}",
    "code_snippet": "class Calculator {\n    public int compute(int a, int b) {\n        return a + b;\n    }\n    public double compute(int a, int b) {\n        return (double)(a + b);\n    }\n}",
    "options": [
      "The method cannot return a double when taking integer arguments.",
      "Method overloading requires distinct parameter lists (count, types, or order); differing only by return type causes a compile-time duplicate method error.",
      "The `public` access modifier cannot be used repeatedly on overloaded methods.",
      "Method overloading is only allowed across subclass boundaries, not within the same class."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Method overloading requires different parameter signatures (different parameter types, number of parameters, or ordering). In Java (and C++), the return type is not considered part of the method signature for resolution because a caller can invoke `compute(5, 10)` without assigning the return value, creating compiler ambiguity.",
    "companyTags": [
      "TCS",
      "Infosys",
      "Capgemini"
    ],
    "company_tags": [
      "TCS",
      "Infosys",
      "Capgemini"
    ],
    "difficulty": "BASIC",
    "sort_order": 15,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-16",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Which statement correctly distinguishes an Abstract Class from an Interface in modern Java (Java 8+)?",
    "options": [
      "Interfaces can hold mutable instance state (instance variables), whereas abstract classes cannot.",
      "A class can inherit from multiple abstract classes, but can only implement a single interface.",
      "An abstract class can maintain non-static instance state (fields) and constructors, whereas an interface cannot declare instance state fields or constructors.",
      "Abstract classes cannot define method implementations, whereas interfaces must implement all methods."
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "In Java:\n- Abstract classes can maintain mutable instance state (fields), instance initialization blocks, and constructors invoked by derived classes.\n- Interfaces can only declare `public static final` constants (no instance state) and cannot define constructors, even though they support `default` and `static` methods.",
    "companyTags": [
      "Amazon",
      "Cisco",
      "Accenture"
    ],
    "company_tags": [
      "Amazon",
      "Cisco",
      "Accenture"
    ],
    "difficulty": "BASIC",
    "sort_order": 16,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-17",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "Can an abstract class in Java have a constructor, and if so, when is it executed?",
    "options": [
      "No, abstract classes cannot have constructors because they cannot be instantiated directly with `new`.",
      "Yes, an abstract class can have constructors; they are executed via constructor chaining when an instance of a concrete subclass is created.",
      "Yes, but only private constructors are allowed to prevent inheritance.",
      "No, having a constructor immediately turns an abstract class into an interface."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Abstract classes cannot be directly instantiated via `new AbstractClass()`, but they frequently contain constructors to initialize base fields. When a concrete subclass constructor is called, it calls `super()` to execute the abstract superclass constructor first.",
    "companyTags": [
      "Infosys SP",
      "TCS Digital",
      "Zoho"
    ],
    "company_tags": [
      "Infosys SP",
      "TCS Digital",
      "Zoho"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 17,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-18",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "In C++, what specific syntactic declaration makes a class an Abstract Class (preventing direct instantiation)?",
    "options": [
      "Prefacing the class definition with the `abstract` keyword.",
      "Declaring at least one pure virtual member function with `= 0` (e.g., `virtual void draw() = 0;`).",
      "Marking the class constructor as `delete`.",
      "Declaring all member variables as private."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "In C++, there is no `abstract` keyword for class declarations. A class automatically becomes an abstract class (pure virtual class) if it contains at least one pure virtual function declared with `= 0`. Any attempt to instantiate such a class directly causes a compile-time error.",
    "companyTags": [
      "Qualcomm",
      "Microsoft",
      "Adobe"
    ],
    "company_tags": [
      "Qualcomm",
      "Microsoft",
      "Adobe"
    ],
    "difficulty": "BASIC",
    "sort_order": 18,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-19",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What happens when a class implements two interfaces containing identical default methods in Java 8?",
    "codeSnippet": "interface Alpha {\n    default void log() { System.out.print(\"Alpha \"); }\n}\ninterface Beta {\n    default void log() { System.out.print(\"Beta \"); }\n}\nclass Gamma implements Alpha, Beta {\n    // No log() implementation provided\n}",
    "code_snippet": "interface Alpha {\n    default void log() { System.out.print(\"Alpha \"); }\n}\ninterface Beta {\n    default void log() { System.out.print(\"Beta \"); }\n}\nclass Gamma implements Alpha, Beta {\n    // No log() implementation provided\n}",
    "options": [
      "It compiles cleanly and executes `Alpha`'s default method because `Alpha` is listed first.",
      "It compiles cleanly and prints `Beta` because later interfaces take precedence.",
      "Compilation fails with an error stating class `Gamma` inherits unrelated defaults for `log()` from types `Alpha` and `Beta`.",
      "The program throws a `NoSuchMethodError` at runtime."
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "In Java 8, when a class implements two interfaces that declare the same signature default method without any inheritance hierarchy between them, the compiler detects an ambiguous multiple-inheritance conflict. The class MUST override the conflicting method explicitly (e.g., `Alpha.super.log();`).",
    "companyTags": [
      "Goldman Sachs",
      "Morgan Stanley",
      "Amazon"
    ],
    "company_tags": [
      "Goldman Sachs",
      "Morgan Stanley",
      "Amazon"
    ],
    "difficulty": "HARD",
    "sort_order": 19,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-20",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "What is illegal in the following interface declaration in Java?",
    "codeSnippet": "public interface PaymentProcessor {\n    int timeout = 5000;\n    public void processPayment();\n    protected void auditTransaction();\n}",
    "code_snippet": "public interface PaymentProcessor {\n    int timeout = 5000;\n    public void processPayment();\n    protected void auditTransaction();\n}",
    "options": [
      "`timeout` must be explicitly marked `final`.",
      "`processPayment()` cannot be declared `public` inside an interface.",
      "`auditTransaction()` cannot be declared `protected`; all interface methods (prior to Java 9 private methods) must be `public`.",
      "Interfaces cannot define primitive variables."
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "In Java interfaces, methods are implicitly `public abstract` (or `default`/`static`). Interface methods cannot have `protected` or `package-private` access modifiers because an interface defines a public contract for implementing classes. Declaring a method `protected` triggers a compile-time error: 'modifier protected not allowed here'.",
    "companyTags": [
      "TCS Digital",
      "Cognizant",
      "Wipro Turbo"
    ],
    "company_tags": [
      "TCS Digital",
      "Cognizant",
      "Wipro Turbo"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 20,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-21",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "In C++, why is it essential to declare the base class destructor as `virtual` when working with polymorphic hierarchies?",
    "codeSnippet": "Base* ptr = new Derived();\ndelete ptr;",
    "code_snippet": "Base* ptr = new Derived();\ndelete ptr;",
    "options": [
      "To force the compiler to allocate memory on the static data segment.",
      "Without a virtual destructor, `delete ptr` invokes only the `Base` destructor, causing undefined behavior and failing to clean up resources allocated in `Derived` (memory leak).",
      "To prevent the derived class from defining its own destructor.",
      "It is not essential; the C++ runtime always calls the derived destructor automatically regardless of `virtual`."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "When deleting an object of a derived class through a pointer to a base class, if the base class destructor is non-virtual, only the base destructor is statically called. The derived class destructor is bypassed, leaving any dynamic resources allocated by `Derived` orphaned and invoking C++ standard undefined behavior.",
    "companyTags": [
      "Cisco",
      "Nvidia",
      "Qualcomm"
    ],
    "company_tags": [
      "Cisco",
      "Nvidia",
      "Qualcomm"
    ],
    "difficulty": "HARD",
    "sort_order": 21,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-22",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the exact output printed by the following Java program demonstrating static vs instance initialization order?",
    "codeSnippet": "class Demo {\n    static {\n        System.out.print(\"S1 \");\n    }\n    {\n        System.out.print(\"I1 \");\n    }\n    Demo() {\n        System.out.print(\"C1 \");\n    }\n}\npublic class Main {\n    public static void main(String[] args) {\n        System.out.print(\"M1 \");\n        new Demo();\n        new Demo();\n    }\n}",
    "code_snippet": "class Demo {\n    static {\n        System.out.print(\"S1 \");\n    }\n    {\n        System.out.print(\"I1 \");\n    }\n    Demo() {\n        System.out.print(\"C1 \");\n    }\n}\npublic class Main {\n    public static void main(String[] args) {\n        System.out.print(\"M1 \");\n        new Demo();\n        new Demo();\n    }\n}",
    "options": [
      "M1 S1 I1 C1 I1 C1",
      "S1 M1 I1 C1 I1 C1",
      "M1 I1 C1 S1 I1 C1",
      "S1 I1 C1 M1 I1 C1"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Execution order in Java:\n1. `main()` runs, printing 'M1 '.\n2. `new Demo()` triggers class loading of `Demo`: static block runs once, printing 'S1 '.\n3. Instance initializer runs before constructor: prints 'I1 '.\n4. Constructor executes: prints 'C1 '.\n5. Second `new Demo()`: static block does NOT run again. Instance block prints 'I1 ', constructor prints 'C1 '.\nOverall output: 'M1 S1 I1 C1 I1 C1 '.",
    "companyTags": [
      "Amazon",
      "TCS Digital",
      "Infosys SP"
    ],
    "company_tags": [
      "Amazon",
      "TCS Digital",
      "Infosys SP"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 22,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-23",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the key danger of performing a Shallow Copy versus a Deep Copy on an object containing references to mutable heap structures?",
    "options": [
      "A shallow copy takes exponentially more memory than a deep copy.",
      "In a shallow copy, only reference pointers are duplicated; both original and cloned objects reference the exact same underlying heap structures, leading to unexpected shared mutations and double-free errors.",
      "A shallow copy fails to copy primitive fields like integers and booleans.",
      "Shallow copying converts all private variables into public variables."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "A shallow copy copies field-by-field bitwise: primitive values are copied directly, but pointer/reference fields simply copy the address. As a consequence, both objects share the same mutable references. Modifying child data through one object modifies it in both.",
    "companyTags": [
      "Microsoft",
      "Oracle",
      "Goldman Sachs"
    ],
    "company_tags": [
      "Microsoft",
      "Oracle",
      "Goldman Sachs"
    ],
    "difficulty": "BASIC",
    "sort_order": 23,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-24",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "What is the compiler error in the following constructor chaining attempt in Java?",
    "codeSnippet": "class Employee {\n    int id;\n    String name;\n    Employee(int id) {\n        this.id = id;\n    }\n    Employee(int id, String name) {\n        this.name = name;\n        this(id); // chaining to single-param constructor\n    }\n}",
    "code_snippet": "class Employee {\n    int id;\n    String name;\n    Employee(int id) {\n        this.id = id;\n    }\n    Employee(int id, String name) {\n        this.name = name;\n        this(id); // chaining to single-param constructor\n    }\n}",
    "options": [
      "`this(id)` must be the very first statement inside the constructor body.",
      "Constructor chaining cannot pass parameters.",
      "A class cannot have multiple constructors with the same initial parameter type.",
      "`this` constructor calls can only be made from static methods."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In Java, an explicit constructor invocation using `this(...)` or `super(...)` MUST be the very first statement in a constructor body. Placing `this.name = name;` before `this(id);` triggers the compiler error: 'Constructor call must be the first statement in a constructor'.",
    "companyTags": [
      "TCS",
      "Infosys",
      "Cognizant"
    ],
    "company_tags": [
      "TCS",
      "Infosys",
      "Cognizant"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 24,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-25",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CODE_COMPLETION",
    "question_type": "CODE_COMPLETION",
    "question": "To implement the RAII (Resource Acquisition Is Initialization) idiom in C++ and ensure deterministic cleanup of an open file descriptor when an object leaves scope, how should the destructor be completed?",
    "codeSnippet": "class FileHandler {\n    FILE* fp;\npublic:\n    FileHandler(const char* filename) {\n        fp = fopen(filename, \"r\");\n    }\n    ~FileHandler() {\n        /* __BLANK__ */\n    }\n};",
    "code_snippet": "class FileHandler {\n    FILE* fp;\npublic:\n    FileHandler(const char* filename) {\n        fp = fopen(filename, \"r\");\n    }\n    ~FileHandler() {\n        /* __BLANK__ */\n    }\n};",
    "options": [
      "if (fp) { fclose(fp); fp = nullptr; }",
      "delete fp;",
      "free(fp);",
      "fp->close();"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In C, `fopen` returns a `FILE*` allocated by the runtime C standard I/O library that must be closed using `fclose(fp)`. Using `delete` or `free()` directly corrupts internal stream buffers. Guarding with `if (fp)` and resetting to `nullptr` ensures safe, deterministic RAII cleanup.",
    "companyTags": [
      "Qualcomm",
      "Cisco",
      "Intel"
    ],
    "company_tags": [
      "Qualcomm",
      "Cisco",
      "Intel"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 25,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-26",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the core definition of the Single Responsibility Principle (SRP) in Robert C. Martin's SOLID design framework?",
    "options": [
      "A class should only have a single method with fewer than 20 lines of code.",
      "A class should have one, and only one, reason to change (i.e., it should encapsulate a single actor's or domain's responsibility).",
      "A software module must never depend on more than one third-party external library.",
      "Every variable in an object-oriented system must only be assigned a single time."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "The Single Responsibility Principle (SRP) states that a class should have only one reason to change, meaning it should be responsible to one, and only one, actor or business domain. For example, separating business logic calculation from report rendering/formatting adheres to SRP.",
    "companyTags": [
      "Amazon",
      "Microsoft",
      "TCS Digital"
    ],
    "company_tags": [
      "Amazon",
      "Microsoft",
      "TCS Digital"
    ],
    "difficulty": "BASIC",
    "sort_order": 26,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-27",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Which code design pattern or refactoring best aligns with the Open/Closed Principle (OCP) ('Software entities should be open for extension, but closed for modification')?",
    "options": [
      "Using a giant `switch-case` statement checking enum types inside a central manager class whenever a new payment type is added.",
      "Defining a `PaymentMethod` interface with a `pay()` method and creating new class implementations (`CreditCardPayment`, `UpiPayment`) without modifying existing payment processing code.",
      "Marking all classes and methods with the `final` keyword so nobody can extend them.",
      "Hardcoding all configurations in static arrays within the main method."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "The Open/Closed Principle means you can introduce new functionality (extension) without altering pre-existing, tested code (closed for modification). By coding against a polymorphic `PaymentMethod` interface, adding a new payment gateway merely involves creating a new implementing class without editing the orchestrator.",
    "companyTags": [
      "Goldman Sachs",
      "Infosys SP",
      "Adobe"
    ],
    "company_tags": [
      "Goldman Sachs",
      "Infosys SP",
      "Adobe"
    ],
    "difficulty": "BASIC",
    "sort_order": 27,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-28",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "The classic 'Square extends Rectangle' hierarchy is the textbook violation of which SOLID design principle, and why?",
    "codeSnippet": "class Rectangle {\n    void setWidth(int w) { this.width = w; }\n    void setHeight(int h) { this.height = h; }\n}\nclass Square extends Rectangle {\n    void setWidth(int w) { this.width = this.height = w; }\n    void setHeight(int h) { this.width = this.height = h; }\n}",
    "code_snippet": "class Rectangle {\n    void setWidth(int w) { this.width = w; }\n    void setHeight(int h) { this.height = h; }\n}\nclass Square extends Rectangle {\n    void setWidth(int w) { this.width = this.height = w; }\n    void setHeight(int h) { this.width = this.height = h; }\n}",
    "options": [
      "Single Responsibility Principle, because Square performs two multiplications.",
      "Liskov Substitution Principle (LSP), because client code expecting a Rectangle (where width and height vary independently) fails when given a Square where changing width modifies height.",
      "Interface Segregation Principle, because Rectangle exposes too many interfaces.",
      "Dependency Inversion Principle, because Square depends on a concrete class."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "The Liskov Substitution Principle (LSP) requires that subclasses must be substitutable for their base types without breaking program correctness or invariant assumptions. If client code executes `r.setWidth(5); r.setHeight(10); assert(r.getArea() == 50);`, substituting a `Square` causes `width` to become 10, resulting in an area of 100 and breaking caller expectations.",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 28,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-29",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "Which method signature in a subclass violates the Liskov Substitution Principle (LSP) regarding method contracts?",
    "options": [
      "A subclass method that returns a narrower, more specific subtype (covariant return type).",
      "A subclass method that strengthens preconditions (e.g. requiring non-null arguments where the superclass accepted null) or weakens postconditions.",
      "A subclass method that catches an exception internally without rethrowing.",
      "A subclass method that invokes `super.method()` before performing additional operations."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "According to Barbara Liskov's formal contract rules:\n- Preconditions cannot be strengthened in a subtype (the subtype cannot demand more than the supertype).\n- Postconditions cannot be weakened (the subtype cannot guarantee less than the supertype).\n- Invariants of the supertype must be preserved.\nStrengthening preconditions causes callers passing valid superclass inputs to crash.",
    "companyTags": [
      "Goldman Sachs",
      "Uber",
      "Morgan Stanley"
    ],
    "company_tags": [
      "Goldman Sachs",
      "Uber",
      "Morgan Stanley"
    ],
    "difficulty": "HARD",
    "sort_order": 29,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-30",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the architectural flaw in the following code snippet according to SOLID principles?",
    "codeSnippet": "class OrderService {\n    public void processOrder(Order order) {\n        // 1. Calculate tax\n        double tax = order.amount * 0.18;\n        // 2. Insert into MySQL\n        String sql = \"INSERT INTO orders VALUES (\" + order.id + \", \" + tax + \")\";\n        // 3. Send SMTP email\n        sendEmail(\"admin@store.com\", \"Order processed\");\n    }\n}",
    "code_snippet": "class OrderService {\n    public void processOrder(Order order) {\n        // 1. Calculate tax\n        double tax = order.amount * 0.18;\n        // 2. Insert into MySQL\n        String sql = \"INSERT INTO orders VALUES (\" + order.id + \", \" + tax + \")\";\n        // 3. Send SMTP email\n        sendEmail(\"admin@store.com\", \"Order processed\");\n    }\n}",
    "options": [
      "It violates the Single Responsibility Principle (SRP) by coupling business logic, database persistence, and communication alerts into a single method.",
      "It violates LSP because it does not extend a BaseOrderService class.",
      "It violates polymorphism because methods cannot take parameters of type Order.",
      "There is no flaw; aggregating all operations in one place maximizes operational cohesion."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "`OrderService` violates SRP because it has at least three reasons to change: if business calculation rules change, if database persistence schemas/drivers change, or if email notification protocols change. These responsibilities should be delegated to separate services (`TaxCalculator`, `OrderRepository`, `NotificationService`).",
    "companyTags": [
      "TCS Digital",
      "Accenture",
      "Cognizant GenC Next"
    ],
    "company_tags": [
      "TCS Digital",
      "Accenture",
      "Cognizant GenC Next"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 30,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-31",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the core premise of the Interface Segregation Principle (ISP)?",
    "options": [
      "Every interface must be placed in a segregated file bearing an identical name.",
      "Clients should not be forced to depend upon interfaces that they do not use (prefer several small, focused interfaces over one large, bloated general-purpose interface).",
      "Interfaces must never declare more than three methods.",
      "Subclasses must implement all interfaces declared across their entire inheritance hierarchy."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "The Interface Segregation Principle (ISP) advocates against 'fat' interfaces. For instance, rather than a single `Worker` interface with `work()`, `eat()`, and `sleep()`, split it into `Workable` and `Feedable`. A Robot class implementing `Workable` is not forced to provide dummy empty implementations for `eat()`.",
    "companyTags": [
      "Amazon",
      "TCS Digital",
      "Infosys"
    ],
    "company_tags": [
      "Amazon",
      "TCS Digital",
      "Infosys"
    ],
    "difficulty": "BASIC",
    "sort_order": 31,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-32",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Which scenario best exemplifies the Dependency Inversion Principle (DIP)?",
    "options": [
      "A high-level `NotificationService` directly instantiates a concrete `MySqlDatabase` and `TwilioSmsClient` using `new` inside its constructor.",
      "A high-level `NotificationService` depends upon abstract `MessageSender` and `DataStore` interfaces injected via its constructor, decoupling it from concrete vendor implementations.",
      "Reversing the inheritance tree so derived classes become parents of their base classes.",
      "Converting all public methods into private methods to invert dependencies."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Dependency Inversion states: (1) High-level modules should not depend on low-level modules; both should depend on abstractions. (2) Abstractions should not depend on details; details should depend on abstractions. Using constructor injection of interface abstractions (`MessageSender`) decouples the high-level business rules from concrete implementations.",
    "companyTags": [
      "Microsoft",
      "Google",
      "Oracle"
    ],
    "company_tags": [
      "Microsoft",
      "Google",
      "Oracle"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 32,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-33",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "Which design principle is violated when code makes calls of the form `customer.getOrders().get(0).getInvoice().getMerchant().getBankDetails().getIban()`?",
    "options": [
      "Law of Demeter (Principle of Least Knowledge)",
      "Liskov Substitution Principle",
      "Open/Closed Principle",
      "DRY (Don't Repeat Yourself)"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "The Law of Demeter (Principle of Least Knowledge) states that an object should only invoke methods of itself, its fields, objects passed into it as parameters, or objects it creates directly ('Don't talk to strangers'). Cascading navigation chains ('train wrecks') tightly couple the caller to the internal structure of five distant navigation hops.",
    "companyTags": [
      "Goldman Sachs",
      "Amazon",
      "Adobe"
    ],
    "company_tags": [
      "Goldman Sachs",
      "Amazon",
      "Adobe"
    ],
    "difficulty": "HARD",
    "sort_order": 33,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-34",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "Why is Constructor Injection generally preferred over Field Injection (e.g. `@Autowired` directly on private fields) in Dependency Injection frameworks?",
    "options": [
      "Constructor injection makes classes immutably testable without requiring reflection or a Spring container, and clearly exposes all required dependencies at instantiation time.",
      "Field injection is forbidden by the Java Virtual Machine specification.",
      "Constructor injection runs faster because it bypasses memory allocation.",
      "Field injection prevents classes from implementing interfaces."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Constructor injection ensures that objects cannot be created in an incomplete, half-initialized state. It allows declaring dependency fields as `final` (thread safety and immutability), and makes unit testing trivial by permitting mock objects to be passed in directly with `new MyClass(mockDep)` without reflection containers.",
    "companyTags": [
      "Amazon",
      "Morgan Stanley",
      "Cisco"
    ],
    "company_tags": [
      "Amazon",
      "Morgan Stanley",
      "Cisco"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 34,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-35",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the primary objective of the DRY (Don't Repeat Yourself) principle in OOP system design?",
    "options": [
      "Every piece of knowledge or business logic must have a single, unambiguous, authoritative representation within a system.",
      "A developer must never use the same variable name across different methods.",
      "No loop can ever iterate through an array more than once.",
      "Inheritance must be used instead of composition in every case to avoid repeating methods."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "The DRY principle, coined in 'The Pragmatic Programmer', states: 'Every piece of knowledge must have a single, unambiguous, authoritative representation within a system'. Duplicating business algorithms across multiple classes means that when requirements change, one copy might be updated while another is missed, creating bugs.",
    "companyTags": [
      "Infosys",
      "TCS Digital",
      "Accenture"
    ],
    "company_tags": [
      "Infosys",
      "TCS Digital",
      "Accenture"
    ],
    "difficulty": "BASIC",
    "sort_order": 35,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-36",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CODE_COMPLETION",
    "question_type": "CODE_COMPLETION",
    "question": "In the thread-safe Double-Checked Locking implementation of the Singleton pattern in Java, why must the `instance` variable be marked `volatile`?",
    "codeSnippet": "public class Singleton {\n    private static volatile Singleton instance;\n    private Singleton() {}\n    public static Singleton getInstance() {\n        if (instance == null) {\n            synchronized (Singleton.class) {\n                if (instance == null) {\n                    instance = new Singleton();\n                }\n            }\n        }\n        return instance;\n    }\n}",
    "code_snippet": "public class Singleton {\n    private static volatile Singleton instance;\n    private Singleton() {}\n    public static Singleton getInstance() {\n        if (instance == null) {\n            synchronized (Singleton.class) {\n                if (instance == null) {\n                    instance = new Singleton();\n                }\n            }\n        }\n        return instance;\n    }\n}",
    "options": [
      "To prevent the compiler and CPU from reordering instructions during object allocation, which could otherwise expose a partially initialized object to another thread.",
      "To ensure that `instance` is stored in the CPU L1 cache rather than main RAM.",
      "To allow the class to be cloned across different threads.",
      "`volatile` is not needed; the `synchronized` block is completely sufficient by itself."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "`new Singleton()` involves 3 steps: (1) allocate memory, (2) initialize constructor, (3) assign reference. The JVM/CPU can reorder steps (2) and (3). Without `volatile`, thread B could observe a non-null `instance` pointer whose constructor hasn't finished executing, resulting in thread B accessing a corrupted, partially initialized object.",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Goldman Sachs"
    ],
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Goldman Sachs"
    ],
    "difficulty": "HARD",
    "sort_order": 36,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-37",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Which design pattern is specifically designed to solve the 'Telescoping Constructor' anti-pattern where a class has numerous optional parameters?",
    "options": [
      "Builder Pattern",
      "Prototype Pattern",
      "Proxy Pattern",
      "Facade Pattern"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "The Builder pattern separates object construction from representation. Instead of having multiple overloaded constructors with varying parameters (`User(name)`, `User(name, age)`, `User(name, age, phone)`, etc.), the Builder provides fluent chained methods (`builder.setAge(25).setPhone(\"...\").build()`), improving readability and safety.",
    "companyTags": [
      "Amazon",
      "Infosys SP",
      "Adobe"
    ],
    "company_tags": [
      "Amazon",
      "Infosys SP",
      "Adobe"
    ],
    "difficulty": "BASIC",
    "sort_order": 37,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-38",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the primary difference in architectural intent between the Adapter Pattern and the Facade Pattern?",
    "options": [
      "Adapter changes an existing interface to conform to what a client expects; Facade provides a simplified, higher-level unified interface to an entire complex subsystem.",
      "Adapter is a creational pattern, whereas Facade is a behavioral pattern.",
      "Adapter can only be used with third-party libraries, while Facade is only for internal code.",
      "There is no difference; both wrap an object identically."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "- Adapter (Wrapper): Converts one specific existing interface into another interface that a client expects, enabling incompatible classes to work together.\n- Facade: Provides a clean, simplified high-level interface over a large subsystem of multiple classes (e.g. `computer.start()` coordinating CPU, RAM, and Disk boot routines).",
    "companyTags": [
      "TCS Digital",
      "Cisco",
      "Oracle"
    ],
    "company_tags": [
      "TCS Digital",
      "Cisco",
      "Oracle"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 38,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-39",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Java's standard I/O library (`new BufferedReader(new InputStreamReader(new FileInputStream(\"data.txt\")))`) is a canonical example of which structural design pattern?",
    "options": [
      "Decorator Pattern",
      "Flyweight Pattern",
      "Singleton Pattern",
      "Composite Pattern"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "The Decorator Pattern attaches additional responsibilities and capabilities to an object dynamically without subclass explosion. `BufferedReader` decorates `Reader` with buffering; `InputStreamReader` decorates `InputStream` with byte-to-char translation, all sharing the common stream component interface.",
    "companyTags": [
      "Goldman Sachs",
      "Morgan Stanley",
      "Google"
    ],
    "company_tags": [
      "Goldman Sachs",
      "Morgan Stanley",
      "Google"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 39,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-40",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the primary distinction between the Factory Method pattern and the Abstract Factory pattern?",
    "options": [
      "Factory Method relies on inheritance and defers object creation of a single product to subclasses; Abstract Factory relies on composition to produce families of related or dependent products without specifying their concrete classes.",
      "Factory Method only creates static objects; Abstract Factory only creates dynamic objects.",
      "Factory Method requires interfaces, whereas Abstract Factory requires abstract classes.",
      "Abstract Factory is used strictly for database connections, while Factory Method is for GUI components."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "- Factory Method: Uses inheritance; defines an interface for creating an object, but lets subclasses decide which class to instantiate (creates one product).\n- Abstract Factory: Uses object composition; provides an interface for creating families of related products (e.g. `DarkButton` + `DarkScrollBar` vs `LightButton` + `LightScrollBar`).",
    "companyTags": [
      "Microsoft",
      "Amazon",
      "Cognizant GenC Next"
    ],
    "company_tags": [
      "Microsoft",
      "Amazon",
      "Cognizant GenC Next"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 40,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-41",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Which behavioral design pattern defines a one-to-many dependency between objects such that when one object changes state, all its registered dependents are notified and updated automatically?",
    "options": [
      "Observer Pattern",
      "Strategy Pattern",
      "Memento Pattern",
      "Visitor Pattern"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "The Observer pattern (also known as Publish-Subscribe) defines a subject maintaining a list of observers. Whenever the subject's state changes, it broadcasts notifications to all attached observers via their `update()` method, establishing loose coupling between publisher and consumers.",
    "companyTags": [
      "Infosys",
      "TCS Digital",
      "Accenture"
    ],
    "company_tags": [
      "Infosys",
      "TCS Digital",
      "Accenture"
    ],
    "difficulty": "BASIC",
    "sort_order": 41,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-42",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "Which design pattern is implemented by the following code structure?",
    "codeSnippet": "interface SortingStrategy {\n    void sort(int[] list);\n}\nclass QuickSort implements SortingStrategy {\n    public void sort(int[] list) { System.out.println(\"QuickSort\"); }\n}\nclass MergeSort implements SortingStrategy {\n    public void sort(int[] list) { System.out.println(\"MergeSort\"); }\n}\nclass Context {\n    private SortingStrategy strategy;\n    public void setStrategy(SortingStrategy s) { this.strategy = s; }\n    public void executeSort(int[] list) { strategy.sort(list); }\n}",
    "code_snippet": "interface SortingStrategy {\n    void sort(int[] list);\n}\nclass QuickSort implements SortingStrategy {\n    public void sort(int[] list) { System.out.println(\"QuickSort\"); }\n}\nclass MergeSort implements SortingStrategy {\n    public void sort(int[] list) { System.out.println(\"MergeSort\"); }\n}\nclass Context {\n    private SortingStrategy strategy;\n    public void setStrategy(SortingStrategy s) { this.strategy = s; }\n    public void executeSort(int[] list) { strategy.sort(list); }\n}",
    "options": [
      "Strategy Pattern",
      "State Pattern",
      "Template Method Pattern",
      "Proxy Pattern"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "The Strategy Pattern defines a family of interchangeable algorithms, encapsulates each one into a separate class conforming to a common interface (`SortingStrategy`), and makes them swappable inside a `Context` object at runtime.",
    "companyTags": [
      "Amazon",
      "Adobe",
      "Cognizant GenC Next"
    ],
    "company_tags": [
      "Amazon",
      "Adobe",
      "Cognizant GenC Next"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 42,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-43",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "How does the Template Method pattern achieve algorithm customization across derived classes?",
    "options": [
      "By declaring the algorithm invariant skeleton in a `final` base class method, while deferring specific customizable primitive steps to abstract methods implemented in subclasses.",
      "By creating C++ templates that generate code for every primitive type at compile time.",
      "By requiring all methods in the subclass to be static.",
      "By duplicating the entire algorithm structure in every subclass."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "The Template Method defines the steps of an algorithm in a base class method (often declared `final` to prevent overriding the overall workflow). Individual steps are declared as `abstract` (or hook) methods, allowing subclasses to override specific steps without altering the overall sequence of execution.",
    "companyTags": [
      "Goldman Sachs",
      "Microsoft",
      "TCS Digital"
    ],
    "company_tags": [
      "Goldman Sachs",
      "Microsoft",
      "TCS Digital"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 43,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-44",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Which behavioral pattern encapsulates a request as an object, thereby letting you parameterize clients with different requests, queue or log requests, and support undo/redo operations?",
    "options": [
      "Command Pattern",
      "Mediator Pattern",
      "Chain of Responsibility Pattern",
      "Interpreter Pattern"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "The Command Pattern encapsulates an action and its parameters into an object implementing an `execute()` (and optionally `undo()`) method. This decouples the invoker (e.g. a UI button or scheduler) from the receiver executing the business logic, enabling command queues, macros, and undo histories.",
    "companyTags": [
      "Google",
      "Uber",
      "Amazon"
    ],
    "company_tags": [
      "Google",
      "Uber",
      "Amazon"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 44,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-45",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What key difference distinguishes the State Pattern from the Strategy Pattern, given that their UML class diagrams look almost identical?",
    "options": [
      "In Strategy, the client typically chooses and sets the strategy independently; in State, states can transition automatically from one to another based on internal object actions.",
      "State pattern requires multiple inheritance whereas Strategy strictly forbids it.",
      "Strategy can only be used with numeric data, while State is for strings.",
      "State pattern stores data in cookies, whereas Strategy stores data in session storage."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "While both patterns utilize composition and interfaces, their intent differs: Strategy provides alternative interchangeable algorithms chosen by the client to solve a problem. State allows an object to alter its behavior when its internal state changes, where concrete state subclasses frequently trigger transitions to other states automatically.",
    "companyTags": [
      "Adobe",
      "Oracle",
      "Cisco"
    ],
    "company_tags": [
      "Adobe",
      "Oracle",
      "Cisco"
    ],
    "difficulty": "HARD",
    "sort_order": 45,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-46",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "In Java and C++, what is a Covariant Return Type in method overriding?",
    "codeSnippet": "class BaseProducer {\n    public Number produce() { return 1; }\n}\nclass DerivedProducer extends BaseProducer {\n    @Override\n    public Integer produce() { return 2; }\n}",
    "code_snippet": "class BaseProducer {\n    public Number produce() { return 1; }\n}\nclass DerivedProducer extends BaseProducer {\n    @Override\n    public Integer produce() { return 2; }\n}",
    "options": [
      "An overriding method can return a subtype of the return type declared in the superclass method, which is valid and type-safe.",
      "An overriding method must return the exact identical class type as the superclass; returning a subclass is a syntax error.",
      "A feature where a method can return multiple values simultaneously using tuples.",
      "A mechanism where the return type is inferred at runtime by the JIT compiler."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "A covariant return type permits an overriding method to specify a return type that is a subclass of the return type declared in the parent method (`Integer` is a subtype of `Number`). This is completely valid and avoids the caller having to perform redundant downcasting.",
    "companyTags": [
      "Amazon",
      "Oracle",
      "Infosys SP"
    ],
    "company_tags": [
      "Amazon",
      "Oracle",
      "Infosys SP"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 46,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-47",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is Object Slicing in C++, and what is the output of the following code snippet?",
    "codeSnippet": "#include <iostream>\nclass Base {\npublic:\n    virtual void print() const { std::cout << \"Base \"; }\n};\nclass Derived : public Base {\npublic:\n    void print() const override { std::cout << \"Derived \"; }\n};\nvoid display(Base b) { // pass-by-value\n    b.print();\n}\nint main() {\n    Derived d;\n    display(d);\n    return 0;\n}",
    "code_snippet": "#include <iostream>\nclass Base {\npublic:\n    virtual void print() const { std::cout << \"Base \"; }\n};\nclass Derived : public Base {\npublic:\n    void print() const override { std::cout << \"Derived \"; }\n};\nvoid display(Base b) { // pass-by-value\n    b.print();\n}\nint main() {\n    Derived d;\n    display(d);\n    return 0;\n}",
    "options": [
      "Derived ",
      "Base ",
      "Compilation error: cannot convert Derived to Base value",
      "Segmentation fault"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Object Slicing occurs when a derived class object is assigned or passed by value (not by reference or pointer) to a base class object. The derived portion and vptr are 'sliced away', leaving a pure `Base` object. Consequently, `display(Base b)` calls `Base::print()`, printing 'Base '.",
    "companyTags": [
      "Qualcomm",
      "Nvidia",
      "Microsoft"
    ],
    "company_tags": [
      "Qualcomm",
      "Nvidia",
      "Microsoft"
    ],
    "difficulty": "HARD",
    "sort_order": 47,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-48",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the 'Fragile Base Class' problem in object-oriented architecture?",
    "options": [
      "A situation where seemingly harmless modifications to a base class inadvertently break the internal invariants and behaviors of derived subclasses due to tight coupling.",
      "A memory leak caused by unclosed base class database connections.",
      "When a base class exceeds 1,000 lines of code and crashes the compiler.",
      "A condition where a base class cannot be garbage collected because of weak references."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "The Fragile Base Class problem is a classic architectural risk in inheritance hierarchies: because derived classes rely on implementation details of base classes, changes to base class methods (such as calling another internal method) can unintentionally cause infinite recursion or break overridden behavior in derived subclasses.",
    "companyTags": [
      "Google",
      "Amazon",
      "Goldman Sachs"
    ],
    "company_tags": [
      "Google",
      "Amazon",
      "Goldman Sachs"
    ],
    "difficulty": "HARD",
    "sort_order": 48,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-49",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Which OOP anti-pattern is characterized by a colossal class that knows too much or does too much, centralizing most system intelligence and turning other classes into passive data holders?",
    "options": [
      "God Object (The Blob)",
      "Anemic Domain Model",
      "Spaghetti Code",
      "Lava Layer"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "The God Object (or 'The Blob') anti-pattern occurs when a single class takes on an excessive number of responsibilities, centralizing system logic and leaving other classes as mere dumb data holders. It severely violates SRP, has high coupling, low cohesion, and is very difficult to maintain and test.",
    "companyTags": [
      "Microsoft",
      "TCS Digital",
      "Accenture"
    ],
    "company_tags": [
      "Microsoft",
      "TCS Digital",
      "Accenture"
    ],
    "difficulty": "BASIC",
    "sort_order": 49,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-oops-50",
    "topicId": "mcq-oops-concepts",
    "topic_id": "mcq-oops-concepts",
    "topic": "OOPs Concepts",
    "topic_name": "OOPs Concepts",
    "topicCategory": "SYNTAX_BASICS",
    "topic_category": "SYNTAX_BASICS",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "In the following C++ code snippet, what critical design flaw leads to memory leaks and resource corruption?",
    "codeSnippet": "class ResourceHolder {\n    int* data;\npublic:\n    ResourceHolder(int size) { data = new int[size]; }\n    ~ResourceHolder() { delete[] data; }\n    // No copy constructor or assignment operator defined\n};\nvoid process() {\n    ResourceHolder r1(100);\n    ResourceHolder r2 = r1; // default shallow copy\n}",
    "code_snippet": "class ResourceHolder {\n    int* data;\npublic:\n    ResourceHolder(int size) { data = new int[size]; }\n    ~ResourceHolder() { delete[] data; }\n    // No copy constructor or assignment operator defined\n};\nvoid process() {\n    ResourceHolder r1(100);\n    ResourceHolder r2 = r1; // default shallow copy\n}",
    "options": [
      "Violation of the Rule of Three: allocating raw heap resources requires custom copy constructor, copy assignment operator, and destructor. The default copy performs a shallow pointer copy, causing a double-free on `data` when both destructors run.",
      "`new int[size]` cannot be deallocated using `delete[]`.",
      "`r2` is allocated on the heap while `r1` is on the stack.",
      "`size` must be an unsigned long long."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "The Rule of Three states that if a class manages raw resources requiring a custom destructor, it almost certainly needs a custom copy constructor and copy assignment operator. Without them, `r2 = r1` performs a shallow copy of pointer `data`. At the end of `process()`, both destructors execute `delete[] data` on the same memory address, triggering a fatal double-free crash.",
    "companyTags": [
      "Qualcomm",
      "Cisco",
      "Google",
      "Adobe"
    ],
    "company_tags": [
      "Qualcomm",
      "Cisco",
      "Google",
      "Adobe"
    ],
    "difficulty": "HARD",
    "sort_order": 50,
    "is_hidden": false,
    "is_deleted": false
  }
];

export const DBMS_SYSTEMS_MCQ_SEED: TechnicalMcq[] = [
  {
    "id": "mcq-dbms-1",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Which of the following defines a Candidate Key in relational database theory?",
    "options": [
      "Any set of attributes that uniquely identifies a tuple, regardless of whether it contains redundant attributes.",
      "A minimal superkey, meaning a superkey from which no proper subset can uniquely identify tuples in the relation.",
      "A foreign key that references a unique constraint in another table.",
      "Any single-column primary key chosen by the database administrator."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "A Candidate Key is defined as a minimal superkey. While a superkey can uniquely identify a row but may contain redundant attributes (e.g., {ID, Phone, Name}), a candidate key contains only the minimal set of attributes necessary for uniqueness—removing any single attribute destroys its uniqueness property.",
    "companyTags": [
      "TCS Digital",
      "Infosys",
      "Wipro Turbo"
    ],
    "company_tags": [
      "TCS Digital",
      "Infosys",
      "Wipro Turbo"
    ],
    "difficulty": "BASIC",
    "sort_order": 1,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-2",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the key architectural difference between a Primary Key and a Unique Key constraint in standard SQL databases?",
    "options": [
      "A table can have only one Primary Key and it strictly forbids NULL values; a table can have multiple Unique Keys, and in standard SQL, Unique Keys permit NULL values.",
      "Primary Keys can accept multiple NULL values, whereas Unique Keys strictly forbid all NULLs.",
      "Primary Keys can only be defined on integer columns, whereas Unique Keys can be defined on any data type.",
      "There is no difference; Primary Key and Unique Key are identical syntactic synonyms in SQL."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In relational databases:\n1. A table can possess only one PRIMARY KEY, which enforces both uniqueness and `NOT NULL` on its constituent columns.\n2. A table can possess multiple UNIQUE constraints, which enforce uniqueness among non-null values while permitting NULLs (in SQL standard, multiple NULLs are permitted because `NULL != NULL`).",
    "companyTags": [
      "Cognizant GenC Next",
      "Accenture",
      "Capgemini"
    ],
    "company_tags": [
      "Cognizant GenC Next",
      "Accenture",
      "Capgemini"
    ],
    "difficulty": "BASIC",
    "sort_order": 2,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-3",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "Consider a foreign key defined with `ON DELETE CASCADE`. What occurs when a referenced parent record in the primary table is deleted?",
    "codeSnippet": "ALTER TABLE Orders\nADD CONSTRAINT fk_customer\nFOREIGN KEY (customer_id) REFERENCES Customers(id)\nON DELETE CASCADE;",
    "code_snippet": "ALTER TABLE Orders\nADD CONSTRAINT fk_customer\nFOREIGN KEY (customer_id) REFERENCES Customers(id)\nON DELETE CASCADE;",
    "options": [
      "The database rejects the deletion of the parent customer record and throws a referential integrity violation error.",
      "The database deletes the parent customer record and automatically deletes all associated child records in the `Orders` table.",
      "The database deletes the parent customer record and sets the `customer_id` in `Orders` to NULL.",
      "The database prompts the application user with an interactive confirmation dialog."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "`ON DELETE CASCADE` instructs the database engine that whenever a row in the parent table (`Customers`) is deleted, all dependent child rows in the referencing table (`Orders`) must be automatically deleted by the DBMS to preserve referential integrity.",
    "companyTags": [
      "Infosys SP",
      "TCS",
      "Zoho"
    ],
    "company_tags": [
      "Infosys SP",
      "TCS",
      "Zoho"
    ],
    "difficulty": "BASIC",
    "sort_order": 3,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-4",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Given a relation $R(A, B, C, D)$ with functional dependencies: $A \\to B$, $B \\to C$, and $C \\to D$. What are the candidate keys of $R$?",
    "options": [
      "Only $A$",
      "$A$ and $B$",
      "$A, B,$ and $C$",
      "$D$"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "To find candidate keys, compute attribute closures:\n- $A^+ = \\{A, B, C, D\\}$ (covers all attributes, so $A$ is a candidate key).\n- $B^+ = \\{B, C, D\\}$ (cannot derive $A$).\n- $C^+ = \\{C, D\\}$ (cannot derive $A, B$).\n- $D^+ = \\{D\\}$.\nSince $A$ is on no right-hand side, every candidate key must contain $A$. Since $A$ alone generates all attributes, $A$ is the sole candidate key.",
    "companyTags": [
      "Amazon",
      "Microsoft",
      "Goldman Sachs"
    ],
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Goldman Sachs"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 4,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-5",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "What is the violation in the following relational schema definition?",
    "codeSnippet": "CREATE TABLE Department (\n    dept_id INT,\n    dept_name VARCHAR(50),\n    PRIMARY KEY (dept_id)\n);\n\nCREATE TABLE Employee (\n    emp_id INT PRIMARY KEY,\n    emp_name VARCHAR(50),\n    dept_name VARCHAR(50),\n    FOREIGN KEY (dept_name) REFERENCES Department(dept_name)\n);",
    "code_snippet": "CREATE TABLE Department (\n    dept_id INT,\n    dept_name VARCHAR(50),\n    PRIMARY KEY (dept_id)\n);\n\nCREATE TABLE Employee (\n    emp_id INT PRIMARY KEY,\n    emp_name VARCHAR(50),\n    dept_name VARCHAR(50),\n    FOREIGN KEY (dept_name) REFERENCES Department(dept_name)\n);",
    "options": [
      "A foreign key cannot reference a VARCHAR column.",
      "Referential integrity requires the referenced column (`Department.dept_name`) to be either a PRIMARY KEY or constrained with a UNIQUE index; referencing an unindexed non-unique column causes a DDL error.",
      "The child table must have the same number of columns as the parent table.",
      "Foreign keys cannot have the same column name as the referenced table."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "In relational databases (including MySQL, PostgreSQL, Oracle), a foreign key must reference a column (or set of columns) that is guaranteed to be unique in the parent table (either the PRIMARY KEY or defined with a UNIQUE constraint). Because `Department.dept_name` has no UNIQUE constraint, the DDL command fails.",
    "companyTags": [
      "Cisco",
      "Oracle",
      "Goldman Sachs"
    ],
    "company_tags": [
      "Cisco",
      "Oracle",
      "Goldman Sachs"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 5,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-6",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the fundamental requirement for a relational table to satisfy First Normal Form (1NF)?",
    "options": [
      "Every non-key attribute must depend directly on the primary key without transitive dependencies.",
      "Each column must contain only atomic (indivisible) values, and there must be no repeating groups or multi-valued attributes in any row.",
      "All foreign keys must reference existing primary keys in parent tables.",
      "The table must have an auto-incrementing surrogate integer key."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "First Normal Form (1NF) mandates that the domain of each attribute must contain only atomic (single indivisible) values, and the value of each attribute in a row must be a single value from that domain. Comma-separated lists or repeating column groups violate 1NF.",
    "companyTags": [
      "TCS",
      "Infosys",
      "Cognizant"
    ],
    "company_tags": [
      "TCS",
      "Infosys",
      "Cognizant"
    ],
    "difficulty": "BASIC",
    "sort_order": 6,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-7",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Under what condition is a relation in Second Normal Form (2NF)?",
    "options": [
      "It is in 1NF and contains no transitive dependencies.",
      "It is in 1NF and no non-prime attribute is partially dependent on any candidate key (full functional dependency).",
      "Every determinant is a candidate key.",
      "All multivalued dependencies are eliminated."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "A relation is in 2NF if and only if it is in 1NF and no non-prime attribute (an attribute not part of any candidate key) exhibits partial dependency on a composite candidate key. If all candidate keys are single-attribute, the relation is automatically in 2NF.",
    "companyTags": [
      "Infosys SP",
      "TCS Digital",
      "Accenture"
    ],
    "company_tags": [
      "Infosys SP",
      "TCS Digital",
      "Accenture"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 7,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-8",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "A relation $R$ is in Third Normal Form (3NF) if, for every non-trivial functional dependency $X \\to Y$:",
    "options": [
      "$X$ is a superkey OR $Y$ is a prime attribute (member of some candidate key).",
      "$X$ must always be a superkey without exceptions.",
      "$Y$ must be a foreign key.",
      "$X$ and $Y$ must share at least one common attribute."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "The formal definition of 3NF states that for every non-trivial FD $X \\to Y$, at least one of the following holds:\n1. $X$ is a superkey of $R$, OR\n2. $Y$ is a prime attribute (part of any candidate key).\nThis relaxation allows 3NF to always guarantee dependency preservation.",
    "companyTags": [
      "Amazon",
      "Microsoft",
      "Goldman Sachs"
    ],
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Goldman Sachs"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 8,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-9",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Why is Boyce-Codd Normal Form (BCNF) strictly stronger than 3NF?",
    "options": [
      "BCNF removes the exception where the right-hand side $Y$ can be a prime attribute; in BCNF, for every non-trivial $X \\to Y$, $X$ MUST be a superkey.",
      "BCNF requires all foreign keys to be composite keys.",
      "BCNF eliminates all join operations completely.",
      "BCNF guarantees dependency preservation whereas 3NF does not."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In 3NF, $X \\to Y$ is permitted if $Y$ is prime even when $X$ is not a superkey. BCNF strictly eliminates this condition: in BCNF, whenever a non-trivial FD $X \\to Y$ exists, $X$ MUST be a superkey. However, decomposing a relation into BCNF may sometimes fail to preserve dependencies, whereas 3NF always preserves them.",
    "companyTags": [
      "Google",
      "Adobe",
      "Qualcomm"
    ],
    "company_tags": [
      "Google",
      "Adobe",
      "Qualcomm"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 9,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-10",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "Consider relation $R(A, B, C)$ with functional dependencies $AB \\to C$ and $C \\to B$. What is the highest normal form satisfied by $R$?",
    "options": [
      "1NF",
      "2NF",
      "3NF",
      "BCNF"
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "Candidate keys of $R$ are $AB$ and $AC$ (since $(AC)^+ = \\{A, B, C\\}$). Prime attributes are $\\{A, B, C\\}$.\n- For $AB \\to C$: $AB$ is a superkey (satisfies 3NF and BCNF).\n- For $C \\to B$: $C$ is NOT a superkey, BUT $B$ is a prime attribute (part of candidate key $AB$).\nBecause $B$ is prime, $C \\to B$ satisfies 3NF, but fails BCNF because $C$ is not a superkey. Highest normal form is 3NF.",
    "companyTags": [
      "Amazon",
      "Morgan Stanley",
      "Cisco"
    ],
    "company_tags": [
      "Amazon",
      "Morgan Stanley",
      "Cisco"
    ],
    "difficulty": "HARD",
    "sort_order": 10,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-11",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Which component of the DBMS architecture is directly responsible for ensuring the 'Atomicity' and 'Durability' properties of ACID?",
    "options": [
      "Query Optimizer and Parser",
      "Recovery Manager via Write-Ahead Logging (WAL)",
      "Concurrency Control Manager via Two-Phase Locking",
      "Data Dictionary / Catalog Manager"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Atomicity (all-or-nothing execution) and Durability (committed changes survive system crashes) are guaranteed by the Recovery Manager using Write-Ahead Logging (WAL) and checkpointing. Isolation is handled by Concurrency Control, and Consistency is preserved through constraints and correct transaction logic.",
    "companyTags": [
      "TCS Digital",
      "Infosys",
      "Wipro"
    ],
    "company_tags": [
      "TCS Digital",
      "Infosys",
      "Wipro"
    ],
    "difficulty": "BASIC",
    "sort_order": 11,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-12",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the core protocol mandated by the Write-Ahead Logging (WAL) rule in database recovery?",
    "options": [
      "Data pages on disk must be updated before any log record is written to buffer memory.",
      "The log record corresponding to an update must be flushed to non-volatile disk storage BEFORE the corresponding dirty data page is written to disk.",
      "All read operations must be logged to disk before transaction commit.",
      "Transactions must wait for all other active transactions to finish before writing logs."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "The WAL protocol dictates that:\n1. Undo rule: Before a dirty database page is written to disk (stealing page), the log record describing the uncommitted change must already reside on non-volatile disk storage (enables UNDO).\n2. Redo rule: Before a transaction commits, all log records for its changes must be flushed to non-volatile disk (enables REDO).",
    "companyTags": [
      "Microsoft",
      "Google",
      "Oracle"
    ],
    "company_tags": [
      "Microsoft",
      "Google",
      "Oracle"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 12,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-13",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "In log-based database recovery with checkpointing, which set of transactions must be UNDONE and which must be REDONE following a system crash?",
    "options": [
      "Transactions with `<commit>` in the log are REDONE; active transactions without `<commit>` or `<abort>` in the log are UNDONE.",
      "All transactions in the log must be UNDONE, and the entire database rebuilt from day zero.",
      "Transactions with `<commit>` are UNDONE; transactions without `<commit>` are REDONE.",
      "Only transactions that executed `SELECT` statements are REDONE."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "During crash recovery:\n- REDO list: Contains transactions that committed before the crash (having `<T, commit>` in the log). Their changes must be re-applied to ensure Durability.\n- UNDO list: Contains transactions that were active at the crash moment (no `<T, commit>` or `<T, abort>`). Their partial modifications must be rolled back to guarantee Atomicity.",
    "companyTags": [
      "Goldman Sachs",
      "Amazon",
      "Adobe"
    ],
    "company_tags": [
      "Goldman Sachs",
      "Amazon",
      "Adobe"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 13,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-14",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "In the Two-Phase Commit (2PC) protocol used in distributed databases, what happens if any participating node votes 'NO' (Abort) during Phase 1 (Prepare phase)?",
    "options": [
      "The coordinator forces all other nodes to commit anyway based on majority voting.",
      "The coordinator broadcasts a GLOBAL-ABORT message to all participating nodes, causing all nodes to rollback their local transactions.",
      "The coordinator waits indefinitely until the failing node changes its vote.",
      "The coordinator excludes that node and commits the transaction on the remaining nodes."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "The Two-Phase Commit (2PC) protocol enforces all-or-nothing distributed atomicity. In Phase 1 (Prepare phase), the coordinator asks all participants to vote. If even a single participant votes 'NO' (or times out), the coordinator broadcasts `GLOBAL-ABORT` to all nodes, aborting and rolling back the entire distributed transaction.",
    "companyTags": [
      "Google",
      "Amazon",
      "Uber"
    ],
    "company_tags": [
      "Google",
      "Amazon",
      "Uber"
    ],
    "difficulty": "HARD",
    "sort_order": 14,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-15",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "What critical database flaw occurs if an application transfers funds between two bank accounts using two separate non-transactional SQL statements without `BEGIN TRANSACTION` and `COMMIT`?",
    "codeSnippet": "UPDATE Accounts SET balance = balance - 500 WHERE account_id = 'A';\n-- System crashes here due to power failure\nUPDATE Accounts SET balance = balance + 500 WHERE account_id = 'B';",
    "code_snippet": "UPDATE Accounts SET balance = balance - 500 WHERE account_id = 'A';\n-- System crashes here due to power failure\nUPDATE Accounts SET balance = balance + 500 WHERE account_id = 'B';",
    "options": [
      "A violation of Isolation only.",
      "A violation of Atomicity, leaving the database in an inconsistent state where $500 vanished from Account A without being credited to Account B.",
      "A syntax error in the UPDATE clause.",
      "An automatic cascade rollback performed by the operating system."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Without wrapping multi-step related modifications in a single atomic transaction block (`BEGIN TRANSACTION ... COMMIT`), a crash after the first statement leaves the first update permanently applied while the second never executes. This destroys Atomicity and leaves total system money inconsistent.",
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
    "difficulty": "BASIC",
    "sort_order": 15,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-16",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Two operations $O_i$ and $O_j$ in a concurrent database schedule are in conflict if and only if:",
    "options": [
      "They belong to the same transaction and operate on different data items.",
      "They belong to different transactions, operate on the exact same data item, and at least one of them is a write (W) operation.",
      "Both operations are read (R) operations on the same data item.",
      "They execute at the exact same clock microsecond."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "By definition, conflict operations satisfy three conditions:\n1. Belong to different transactions ($T_i \\neq T_j$).\n2. Access the identical data item $X$.\n3. At least one operation is a Write ($W_i(X)$ and $R_j(X)$, $R_i(X)$ and $W_j(X)$, or $W_i(X)$ and $W_j(X)$). Two reads never conflict.",
    "companyTags": [
      "Amazon",
      "TCS Digital",
      "Infosys SP"
    ],
    "company_tags": [
      "Amazon",
      "TCS Digital",
      "Infosys SP"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 16,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-17",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "How can you formally determine whether a concurrent execution schedule is Conflict Serializable?",
    "options": [
      "Construct a Precedence Graph (Serialization Graph); the schedule is conflict serializable if and only if the graph contains NO directed cycles.",
      "Count the number of write operations; if writes < reads, it is serializable.",
      "Check if all transactions commit within 5 seconds of each other.",
      "Verify that no transaction uses the `WHERE` clause."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "To test for Conflict Serializability, build a Precedence Graph whose nodes are transactions and directed edges $T_i \\to T_j$ exist if an operation in $T_i$ conflicts with and executes before an operation in $T_j$. The schedule is conflict serializable if and only if the precedence graph is a Directed Acyclic Graph (DAG, has no cycles).",
    "companyTags": [
      "Goldman Sachs",
      "Microsoft",
      "Oracle"
    ],
    "company_tags": [
      "Goldman Sachs",
      "Microsoft",
      "Oracle"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 17,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-18",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Which concurrency anomaly is prevented by the `READ COMMITTED` isolation level, but NOT by `READ UNCOMMITTED`?",
    "options": [
      "Phantom Read",
      "Non-Repeatable (Fuzzy) Read",
      "Dirty Read (reading uncommitted data written by another transaction that later rolls back)",
      "Serialization Anomaly"
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "- `READ UNCOMMITTED` permits Dirty Reads, Non-repeatable Reads, and Phantom Reads.\n- `READ COMMITTED` prevents Dirty Reads by ensuring a transaction only reads rows that have been committed by other transactions prior to the read.\n- `REPEATABLE READ` prevents Dirty Reads and Non-repeatable Reads.\n- `SERIALIZABLE` prevents Dirty Reads, Non-repeatable Reads, and Phantom Reads.",
    "companyTags": [
      "Amazon",
      "Cisco",
      "Adobe"
    ],
    "company_tags": [
      "Amazon",
      "Cisco",
      "Adobe"
    ],
    "difficulty": "BASIC",
    "sort_order": 18,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-19",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "What is the core invariant of the Basic Two-Phase Locking (2PL) protocol?",
    "options": [
      "A transaction must acquire all locks in exactly two milliseconds.",
      "A transaction cannot acquire any new lock once it has released any lock (Growing Phase: acquiring locks only; Shrinking Phase: releasing locks only).",
      "Every read lock must be upgraded to an exclusive lock before committing.",
      "Locks can only be held by a maximum of two transactions concurrently."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "The Two-Phase Locking (2PL) protocol mandates two distinct phases:\n1. Growing Phase: The transaction may acquire locks, but cannot release any lock.\n2. Shrinking Phase: The transaction may release locks, but cannot acquire any new lock.\nAdhering to 2PL guarantees Conflict Serializability, though basic 2PL does NOT prevent deadlocks or cascading aborts.",
    "companyTags": [
      "Microsoft",
      "Oracle",
      "Qualcomm"
    ],
    "company_tags": [
      "Microsoft",
      "Oracle",
      "Qualcomm"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 19,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-20",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the result of testing the following schedule $S$ for conflict serializability?\n$S: R_1(A); W_2(A); R_1(B); W_1(A); R_2(B);$",
    "options": [
      "It is Conflict Serializable with equivalent serial order $T_1 \\to T_2$.",
      "It is NOT Conflict Serializable because there is a cycle between $T_1$ and $T_2$ in the precedence graph.",
      "It is View Serializable but not Conflict Serializable.",
      "It produces a deadlock automatically."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Analyze conflicting operations in $S$:\n1. $R_1(A)$ precedes $W_2(A)$ -> adds edge $T_1 \\to T_2$.\n2. $W_2(A)$ precedes $W_1(A)$ -> adds edge $T_2 \\to T_1$.\nEdges $T_1 \\to T_2$ and $T_2 \\to T_1$ create a directed cycle of length 2. Therefore, schedule $S$ is NOT conflict serializable.",
    "companyTags": [
      "Goldman Sachs",
      "Amazon",
      "Morgan Stanley"
    ],
    "company_tags": [
      "Goldman Sachs",
      "Amazon",
      "Morgan Stanley"
    ],
    "difficulty": "HARD",
    "sort_order": 20,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-21",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "According to the standard database lock compatibility matrix, when can an Exclusive Lock (X) be granted on data item $A$?",
    "options": [
      "Only when no other transaction holds ANY lock (neither Shared nor Exclusive) on item $A$.",
      "Whenever other transactions hold only Shared (S) locks on item $A$.",
      "Whenever the requesting transaction has a higher transaction ID.",
      "At any time, because Exclusive locks immediately preempt and evict all other locks."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Lock compatibility rules:\n- Shared lock (S) requested: Compatible with existing Shared locks; incompatible with Exclusive locks.\n- Exclusive lock (X) requested: Incompatible with both Shared (S) and Exclusive (X) locks. It can only be granted when no lock whatsoever is currently held on the data item.",
    "companyTags": [
      "TCS Digital",
      "Infosys SP",
      "Cognizant"
    ],
    "company_tags": [
      "TCS Digital",
      "Infosys SP",
      "Cognizant"
    ],
    "difficulty": "BASIC",
    "sort_order": 21,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-22",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "How does the 'Wait-Die' deadlock prevention scheme decide whether transaction $T_i$ may wait when requesting a lock held by $T_j$ (where timestamps denote age: smaller timestamp = older transaction)?",
    "options": [
      "If $T_i$ is older than $T_j$ ($TS(T_i) < TS(T_j)$), $T_i$ is allowed to wait; if $T_i$ is younger ($TS(T_i) > TS(T_j)$), $T_i$ dies (aborts and rolls back).",
      "If $T_i$ is younger than $T_j$, $T_i$ is allowed to wait; if older, $T_i$ dies.",
      "The older transaction always preempts and kills the younger transaction.",
      "Both transactions are aborted simultaneously."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Wait-Die is a non-preemptive scheme:\n- If older requests data held by younger ($TS(T_i) < TS(T_j)$): Older is allowed to WAIT.\n- If younger requests data held by older ($TS(T_i) > TS(T_j)$): Younger DIES (aborts and restarts with its original timestamp).\nBecause younger transactions never wait for older ones, directed cycles are impossible, preventing deadlocks.",
    "companyTags": [
      "Amazon",
      "Google",
      "Oracle"
    ],
    "company_tags": [
      "Amazon",
      "Google",
      "Oracle"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 22,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-23",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "In contrast to Wait-Die, how does the 'Wound-Wait' deadlock prevention scheme operate?",
    "options": [
      "It is a preemptive scheme: if an older transaction requests data held by a younger transaction, the older transaction 'wounds' (preempts and aborts) the younger; if a younger transaction requests data held by an older, the younger waits.",
      "It allows only read-only transactions to wait, while all write transactions die.",
      "It never rolls back any transaction.",
      "It causes younger transactions to kill older transactions immediately."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Wound-Wait is preemptive:\n- If older requests data held by younger ($TS(T_i) < TS(T_j)$): Older WOUNDS younger ($T_j$ is aborted and forced to restart).\n- If younger requests data held by older ($TS(T_i) > TS(T_j)$): Younger is allowed to WAIT.\nWound-Wait generally results in fewer transaction aborts than Wait-Die.",
    "companyTags": [
      "Microsoft",
      "Cisco",
      "Qualcomm"
    ],
    "company_tags": [
      "Microsoft",
      "Cisco",
      "Qualcomm"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 23,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-24",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the purpose of Intent Locks (Intent Shared 'IS' and Intent Exclusive 'IX') in Multiple Granularity Locking (MGL)?",
    "options": [
      "To allow transactions to read uncommitted data without isolation.",
      "To indicate locking intentions at higher nodes (e.g., Table or Database) in the granularity hierarchy before locking explicit lower-level nodes (e.g., Pages or Rows), preventing table-level locks from conflicting without scanning every single row.",
      "To encrypt transaction logs before writing to disk.",
      "To convert B-tree indexes into Hash indexes dynamically."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "In Multiple Granularity Locking (Database -> Table -> Page -> Row), if a transaction locks a row with an X lock, checking if another transaction can lock the entire Table would require scanning all rows. By placing an `IX` lock on the Table first, any subsequent transaction requesting an `S` or `X` table lock immediately knows a row is locked.",
    "companyTags": [
      "Oracle",
      "Goldman Sachs",
      "Google"
    ],
    "company_tags": [
      "Oracle",
      "Goldman Sachs",
      "Google"
    ],
    "difficulty": "HARD",
    "sort_order": 24,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-25",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the primary difference between Strict 2PL and Rigorous 2PL protocols?",
    "options": [
      "Strict 2PL holds all Exclusive (X) locks until transaction commit/abort; Rigorous 2PL holds BOTH Shared (S) and Exclusive (X) locks until transaction commit/abort.",
      "Strict 2PL does not guarantee serializability, whereas Rigorous 2PL does.",
      "Strict 2PL applies only to in-memory databases.",
      "Rigorous 2PL releases all locks in the growing phase."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "- Strict 2PL: All Exclusive (write) locks acquired by a transaction must be held until the transaction commits or aborts (prevents cascading aborts and guarantees strict schedules).\n- Rigorous 2PL: Both Shared (read) AND Exclusive (write) locks must be held until commit or abort (serialization order is identical to commit order).",
    "companyTags": [
      "Amazon",
      "Adobe",
      "Microsoft"
    ],
    "company_tags": [
      "Amazon",
      "Adobe",
      "Microsoft"
    ],
    "difficulty": "HARD",
    "sort_order": 25,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-26",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the primary architectural difference between a Clustered Index and a Non-Clustered (Secondary) Index?",
    "options": [
      "A Clustered Index dictates the physical ordering of actual data rows on disk (hence only ONE clustered index can exist per table); a Non-Clustered Index stores a separate index structure with pointers to the data rows.",
      "A table can have up to 256 clustered indexes, but only one non-clustered index.",
      "Clustered indexes are stored in RAM; non-clustered indexes are stored on tape drives.",
      "Non-clustered indexes can only be created on boolean columns."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Because physical disk records can only be sorted in a single physical order on disk, a table can have at most ONE Clustered Index (typically on the Primary Key). Non-clustered indexes create auxiliary search structures (B+ trees) whose leaf nodes contain pointers (or clustered key values) pointing to the actual row data.",
    "companyTags": [
      "TCS Digital",
      "Infosys",
      "Wipro Turbo"
    ],
    "company_tags": [
      "TCS Digital",
      "Infosys",
      "Wipro Turbo"
    ],
    "difficulty": "BASIC",
    "sort_order": 26,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-27",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Why are B+ Trees overwhelmingly preferred over B-Trees for relational database storage engines (such as InnoDB in MySQL)?",
    "options": [
      "B+ Trees store actual record data pointers exclusively at the leaf level, allowing internal non-leaf nodes to pack far more search keys (higher fan-out and shallower tree height), and leaf nodes are linked sequentially for rapid range scans.",
      "B+ Trees have $O(1)$ worst-case search time complexity whereas B-Trees have $O(N)$.",
      "B-Trees require binary search trees while B+ Trees do not require balancing.",
      "B+ Trees store all data in the root node."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In B+ Trees:\n1. Internal nodes store only search keys and child pointers (no data pointers), meaning each disk block can hold hundreds of keys (huge branching factor / fan-out, resulting in a tree height of only 3-4 levels for billions of rows).\n2. All leaf nodes are linked as a doubly linked list, making sequential range scans (`WHERE age BETWEEN 20 AND 30`) fast and continuous.",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Goldman Sachs"
    ],
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Goldman Sachs"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 27,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-28",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "In a B+ Tree index with block size = 512 bytes, key size = 8 bytes, and block pointer size = 4 bytes, what is the maximum order (fan-out $n$) of an internal node?",
    "options": [
      "42",
      "43",
      "64",
      "128"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "An internal node of order $n$ contains $n$ block pointers and $(n - 1)$ search keys:\n$n \\cdot P + (n - 1) \\cdot K \\le \\text{Block Size}$\n$n \\cdot 4 + (n - 1) \\cdot 8 \\le 512$\n$4n + 8n - 8 \\le 512$\n$12n \\le 520$\n$n \\le 520 / 12 \\approx 43.33$.\nTaking the floor integer: $n = 43$.",
    "companyTags": [
      "Goldman Sachs",
      "Cisco",
      "Amazon"
    ],
    "company_tags": [
      "Goldman Sachs",
      "Cisco",
      "Amazon"
    ],
    "difficulty": "HARD",
    "sort_order": 28,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-29",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "When would a Hash Index be preferable over a B+ Tree index, and what is its primary limitation?",
    "options": [
      "Hash Index provides $O(1)$ lookup for point equality queries (`WHERE id = 5`), but cannot support range queries (`WHERE age >= 25`) or prefix pattern matching (`LIKE 'John%'`).",
      "Hash Index is best for sorting, but cannot handle integer values.",
      "Hash Index requires more disk I/O operations than a B+ tree for single-row lookups.",
      "Hash Index only works in distributed database clusters."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Hash indexes map search keys directly to bucket addresses via a hash function, providing expected $O(1)$ point lookups. However, because hash functions disperse values randomly, hash indexes cannot support range scans (`>`, `<`, `BETWEEN`), ordering (`ORDER BY`), or prefix lookups (`LIKE 'abc%'`).",
    "companyTags": [
      "Infosys SP",
      "Adobe",
      "Cognizant GenC Next"
    ],
    "company_tags": [
      "Infosys SP",
      "Adobe",
      "Cognizant GenC Next"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 29,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-30",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is a 'Covering Index' in relational database query optimization?",
    "options": [
      "An index that encrypts all columns to cover security vulnerabilities.",
      "An index that contains all the columns requested by a query (in SELECT, WHERE, and JOIN), allowing the database engine to satisfy the query entirely from the index without accessing the underlying table data pages (Index-Only Scan).",
      "An index that automatically covers and indexes every table in a schema.",
      "An index created on the foreign key to cover parent table updates."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "A Covering Index contains all columns referenced in the query (e.g. index on `(dept_id, salary)` for `SELECT salary FROM emp WHERE dept_id = 10`). Since all needed fields reside directly in the index leaf pages, the engine performs an 'Index Only Scan', completely skipping expensive random I/O lookups to the table data pages.",
    "companyTags": [
      "Amazon",
      "Uber",
      "Microsoft"
    ],
    "company_tags": [
      "Amazon",
      "Uber",
      "Microsoft"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 30,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-31",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "Table $A$ has 5 rows and Table $B$ has 4 rows. What is the exact number of rows returned by a `CROSS JOIN` between Table $A$ and Table $B$?",
    "codeSnippet": "SELECT * FROM A CROSS JOIN B;",
    "code_snippet": "SELECT * FROM A CROSS JOIN B;",
    "options": [
      "9",
      "20",
      "5",
      "1"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "A `CROSS JOIN` computes the Cartesian product of two relations. Every row in the first relation is paired with every row in the second relation. With $|A| = 5$ and $|B| = 4$, the result set contains $|A| \\times |B| = 5 \\times 4 = 20$ rows.",
    "companyTags": [
      "TCS",
      "Infosys",
      "Capgemini"
    ],
    "company_tags": [
      "TCS",
      "Infosys",
      "Capgemini"
    ],
    "difficulty": "BASIC",
    "sort_order": 31,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-32",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "What is the logical order of query execution in a standard SQL SELECT statement?",
    "options": [
      "SELECT -> FROM -> WHERE -> GROUP BY -> HAVING -> ORDER BY",
      "FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> DISTINCT -> ORDER BY -> LIMIT",
      "FROM -> SELECT -> WHERE -> HAVING -> GROUP BY -> ORDER BY",
      "WHERE -> FROM -> GROUP BY -> SELECT -> ORDER BY"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "SQL statements are evaluated in this logical sequence:\n1. `FROM / JOIN`: Identify tables and compute intermediate virtual tables.\n2. `WHERE`: Filter individual rows.\n3. `GROUP BY`: Aggregate rows into groups.\n4. `HAVING`: Filter grouped aggregates.\n5. `SELECT`: Evaluate column expressions and aliases.\n6. `DISTINCT`: Eliminate duplicates.\n7. `ORDER BY`: Sort the result set.\n8. `LIMIT / OFFSET`: Restrict total output rows.",
    "companyTags": [
      "Goldman Sachs",
      "Amazon",
      "TCS Digital"
    ],
    "company_tags": [
      "Goldman Sachs",
      "Amazon",
      "TCS Digital"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 32,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-33",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "What causes the syntax error in the following SQL query?",
    "codeSnippet": "SELECT department, AVG(salary) AS avg_sal\nFROM Employees\nWHERE avg_sal > 50000\nGROUP BY department;",
    "code_snippet": "SELECT department, AVG(salary) AS avg_sal\nFROM Employees\nWHERE avg_sal > 50000\nGROUP BY department;",
    "options": [
      "The `AVG` aggregate function cannot be aliased.",
      "Aggregate conditions cannot appear in the `WHERE` clause (which filters rows prior to aggregation), and column aliases defined in `SELECT` are not visible in `WHERE`; `HAVING AVG(salary) > 50000` must be used instead.",
      "The `GROUP BY` clause must appear before the `FROM` clause.",
      "`department` must be wrapped in `COUNT()`."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "In SQL logical execution, `WHERE` executes before `GROUP BY` and before `SELECT`. Therefore, aggregate calculations (like `AVG(salary)`) and aliases defined in the `SELECT` list (`avg_sal`) do not exist yet during `WHERE` evaluation. Filtering aggregated results requires placing `HAVING AVG(salary) > 50000` after `GROUP BY`.",
    "companyTags": [
      "Cognizant GenC Next",
      "Accenture",
      "TCS Digital"
    ],
    "company_tags": [
      "Cognizant GenC Next",
      "Accenture",
      "TCS Digital"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 33,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-34",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "Consider Table $A$ with values $\\{1, 1, 2\\}$ and Table $B$ with values $\\{1, 2, 2\\}$. How many rows are returned by `SELECT * FROM A INNER JOIN B ON A.val = B.val`?",
    "options": [
      "3",
      "4",
      "5",
      "6"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Evaluate pairs where `A.val = B.val`:\n- For value 1: Table A has two 1s, Table B has one 1 -> produces $2 \\times 1 = 2$ rows.\n- For value 2: Table A has one 2, Table B has two 2s -> produces $1 \\times 2 = 2$ rows.\nTotal output rows = $2 + 2 = 4$ rows.",
    "companyTags": [
      "Amazon",
      "Morgan Stanley",
      "Infosys SP"
    ],
    "company_tags": [
      "Amazon",
      "Morgan Stanley",
      "Infosys SP"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 34,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-35",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "CODE_COMPLETION",
    "question_type": "CODE_COMPLETION",
    "question": "Which SQL query correctly finds the employee with the second-highest salary without using the vendor-specific `LIMIT` or `TOP` keywords?",
    "options": [
      "SELECT MAX(salary) FROM Employees WHERE salary < (SELECT MAX(salary) FROM Employees);",
      "SELECT salary FROM Employees ORDER BY salary DESC OFFSET 2;",
      "SELECT MIN(salary) FROM Employees WHERE salary > (SELECT MAX(salary) FROM Employees);",
      "SELECT salary FROM Employees WHERE salary = MAX(salary) - 1;"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "The standard ANSI SQL solution to find the 2nd highest salary computes the maximum salary among all salaries that are strictly less than the overall maximum: `SELECT MAX(salary) FROM Employees WHERE salary < (SELECT MAX(salary) FROM Employees);`. This works uniformly across Oracle, MySQL, Postgres, and SQL Server.",
    "companyTags": [
      "TCS Digital",
      "Infosys",
      "Wipro",
      "Amazon"
    ],
    "company_tags": [
      "TCS Digital",
      "Infosys",
      "Wipro",
      "Amazon"
    ],
    "difficulty": "BASIC",
    "sort_order": 35,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-36",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of the following SQL query involving Three-Valued Logic (3VL)?",
    "codeSnippet": "SELECT CASE \n    WHEN NULL = NULL THEN 'EQUAL'\n    WHEN NULL != NULL THEN 'NOT EQUAL'\n    ELSE 'UNKNOWN'\nEND AS result;",
    "code_snippet": "SELECT CASE \n    WHEN NULL = NULL THEN 'EQUAL'\n    WHEN NULL != NULL THEN 'NOT EQUAL'\n    ELSE 'UNKNOWN'\nEND AS result;",
    "options": [
      "EQUAL",
      "NOT EQUAL",
      "UNKNOWN",
      "NULL"
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "In SQL, NULL represents an unknown missing value. Comparing any expression to NULL using standard comparison operators (`NULL = NULL` or `NULL != NULL`) evaluates to `UNKNOWN` (neither `TRUE` nor `FALSE`). In a CASE expression, only `TRUE` triggers a WHEN branch; hence it falls through to the `ELSE` branch, returning `'UNKNOWN'`.",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Goldman Sachs"
    ],
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Goldman Sachs"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 36,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-37",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "Table `Employees` has 5 rows where the `bonus` column contains: `[100, 200, NULL, 300, NULL]`. What do `COUNT(*)` and `COUNT(bonus)` return?",
    "codeSnippet": "SELECT COUNT(*), COUNT(bonus) FROM Employees;",
    "code_snippet": "SELECT COUNT(*), COUNT(bonus) FROM Employees;",
    "options": [
      "5 and 5",
      "5 and 3",
      "3 and 3",
      "5 and NULL"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "`COUNT(*)` counts the total number of rows in the table regardless of column values (returning 5). `COUNT(column_name)` counts only rows where the specified column contains a non-NULL value. Since 2 rows contain NULL in `bonus`, `COUNT(bonus)` returns $5 - 2 = 3$.",
    "companyTags": [
      "TCS",
      "Infosys",
      "Cognizant"
    ],
    "company_tags": [
      "TCS",
      "Infosys",
      "Cognizant"
    ],
    "difficulty": "BASIC",
    "sort_order": 37,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-38",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What does the following query return if Table `Students` contains IDs `[1, 2, 3]` and Table `Graduates` contains IDs `[2, NULL]`?",
    "codeSnippet": "SELECT * FROM Students WHERE id NOT IN (SELECT id FROM Graduates);",
    "code_snippet": "SELECT * FROM Students WHERE id NOT IN (SELECT id FROM Graduates);",
    "options": [
      "IDs 1 and 3",
      "ID 1 only",
      "Zero rows (empty set)",
      "All rows: IDs 1, 2, and 3"
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "The `NOT IN` subquery expands to `id != 2 AND id != NULL`. In SQL three-valued logic, `id != NULL` evaluates to `UNKNOWN`. Because `TRUE AND UNKNOWN` is `UNKNOWN`, the WHERE condition never evaluates to `TRUE` for ANY row. Thus, if a `NOT IN` subquery returns even a single `NULL`, the entire outer query yields zero rows!",
    "companyTags": [
      "Amazon",
      "Goldman Sachs",
      "Oracle"
    ],
    "company_tags": [
      "Amazon",
      "Goldman Sachs",
      "Oracle"
    ],
    "difficulty": "HARD",
    "sort_order": 38,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-39",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What does `COALESCE(NULL, NULL, 'Alpha', 'Beta')` return in SQL?",
    "options": [
      "NULL",
      "'Alpha'",
      "'Beta'",
      "An array containing ['Alpha', 'Beta']"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "The `COALESCE()` function accepts two or more arguments and returns the first non-NULL expression from left to right. Here, the first two arguments are NULL and the third is `'Alpha'`, so it immediately returns `'Alpha'`.",
    "companyTags": [
      "Accenture",
      "TCS Digital",
      "Infosys"
    ],
    "company_tags": [
      "Accenture",
      "TCS Digital",
      "Infosys"
    ],
    "difficulty": "BASIC",
    "sort_order": 39,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-40",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "What does the SQL `NULLIF(arg1, arg2)` function return if `arg1` and `arg2` are equal?",
    "codeSnippet": "SELECT NULLIF(100, 100);",
    "code_snippet": "SELECT NULLIF(100, 100);",
    "options": [
      "100",
      "0",
      "NULL",
      "TRUE"
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "`NULLIF(a, b)` returns `NULL` if $a = b$. If $a \\neq b$, it returns $a$. It is commonly used in division expressions to avoid divide-by-zero errors: `SELECT count / NULLIF(total, 0)`.",
    "companyTags": [
      "Infosys SP",
      "Cognizant GenC Next",
      "Zoho"
    ],
    "company_tags": [
      "Infosys SP",
      "Cognizant GenC Next",
      "Zoho"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 40,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-41",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "Given student scores: `[100, 100, 90, 80]`, what ranks are generated by `RANK()` versus `DENSE_RANK()` ordered descending by score?",
    "codeSnippet": "SELECT score,\n       RANK() OVER (ORDER BY score DESC) as rnk,\n       DENSE_RANK() OVER (ORDER BY score DESC) as dense_rnk\nFROM Scores;",
    "code_snippet": "SELECT score,\n       RANK() OVER (ORDER BY score DESC) as rnk,\n       DENSE_RANK() OVER (ORDER BY score DESC) as dense_rnk\nFROM Scores;",
    "options": [
      "RANK: [1, 1, 3, 4] and DENSE_RANK: [1, 1, 2, 3]",
      "RANK: [1, 2, 3, 4] and DENSE_RANK: [1, 1, 2, 3]",
      "RANK: [1, 1, 2, 3] and DENSE_RANK: [1, 1, 3, 4]",
      "RANK: [1, 1, 1, 2] and DENSE_RANK: [1, 2, 3, 4]"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "- `RANK()` assigns the same rank to duplicate values, but skips subsequent rank numbers by the count of ties (scores 100, 100 receive 1, 1; the next score 90 receives rank 3).\n- `DENSE_RANK()` assigns the same rank to ties without skipping numbers (scores 100, 100 receive 1, 1; score 90 receives rank 2; score 80 receives rank 3).",
    "companyTags": [
      "Amazon",
      "Microsoft",
      "Goldman Sachs",
      "Flipkart"
    ],
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Goldman Sachs",
      "Flipkart"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 41,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-42",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "Which SQL window function allows accessing data from the previous row in the same result set without performing a self-join?",
    "codeSnippet": "SELECT sales_date, amount,\n       __BLANK__(amount, 1, 0) OVER (ORDER BY sales_date) AS prev_amount\nFROM DailySales;",
    "code_snippet": "SELECT sales_date, amount,\n       __BLANK__(amount, 1, 0) OVER (ORDER BY sales_date) AS prev_amount\nFROM DailySales;",
    "options": [
      "LEAD",
      "LAG",
      "PREV",
      "ROW_NUMBER"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "`LAG(expression, offset, default_value)` is a window function that looks backwards by `offset` rows (default 1) within the current partition or ordered frame. `LEAD()` looks forward to subsequent rows.",
    "companyTags": [
      "TCS Digital",
      "Infosys SP",
      "Adobe"
    ],
    "company_tags": [
      "TCS Digital",
      "Infosys SP",
      "Adobe"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 42,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-43",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the primary architectural difference between a Standard View and a Materialized View?",
    "options": [
      "A Standard View is a virtual table whose underlying query is executed on-the-fly whenever queried; a Materialized View physically persists the query results on disk and must be refreshed periodically.",
      "Standard Views can only have one column, while Materialized Views can have unlimited columns.",
      "Materialized Views are automatically updated on every single nanosecond write without any overhead.",
      "Standard Views require C++ code, while Materialized Views use SQL."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "A Standard View stores only the SQL definition in the data dictionary; when queried, the DBMS combines the view query with the outer query and executes it against the base tables. A Materialized View computes the result set and stores the physical data on disk like a regular table, drastically speeding up complex aggregation queries at the cost of requiring explicit refresh strategies.",
    "companyTags": [
      "Oracle",
      "Amazon",
      "Cisco"
    ],
    "company_tags": [
      "Oracle",
      "Amazon",
      "Cisco"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 43,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-44",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "CODE_COMPLETION",
    "question_type": "CODE_COMPLETION",
    "question": "To write a recursive SQL Common Table Expression (CTE) to traverse an organizational hierarchy tree, which operator must combine the anchor member and the recursive member?",
    "codeSnippet": "WITH RECURSIVE OrgChart AS (\n    -- Anchor member: CEO\n    SELECT emp_id, name, manager_id, 1 as level\n    FROM Employees WHERE manager_id IS NULL\n    /* __BLANK__ */\n    -- Recursive member: direct reports\n    SELECT e.emp_id, e.name, e.manager_id, o.level + 1\n    FROM Employees e\n    JOIN OrgChart o ON e.manager_id = o.emp_id\n)\nSELECT * FROM OrgChart;",
    "code_snippet": "WITH RECURSIVE OrgChart AS (\n    -- Anchor member: CEO\n    SELECT emp_id, name, manager_id, 1 as level\n    FROM Employees WHERE manager_id IS NULL\n    /* __BLANK__ */\n    -- Recursive member: direct reports\n    SELECT e.emp_id, e.name, e.manager_id, o.level + 1\n    FROM Employees e\n    JOIN OrgChart o ON e.manager_id = o.emp_id\n)\nSELECT * FROM OrgChart;",
    "options": [
      "UNION ALL",
      "INTERSECT",
      "CROSS JOIN",
      "EXCEPT"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In standard SQL recursive CTEs, the base anchor member (which establishes the initial seed set) and the recursive member (which references the CTE itself to generate successive levels) MUST be combined using `UNION ALL` (or `UNION`).",
    "companyTags": [
      "Google",
      "Amazon",
      "Goldman Sachs"
    ],
    "company_tags": [
      "Google",
      "Amazon",
      "Goldman Sachs"
    ],
    "difficulty": "HARD",
    "sort_order": 44,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-45",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "What is the default window frame specification when `ORDER BY` is used inside an `OVER()` clause without an explicit `ROWS` or `RANGE` frame specification?",
    "codeSnippet": "SELECT id, val, SUM(val) OVER (ORDER BY id) FROM Data;",
    "code_snippet": "SELECT id, val, SUM(val) OVER (ORDER BY id) FROM Data;",
    "options": [
      "RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW",
      "ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING",
      "ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING",
      "RANGE BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "When an `ORDER BY` clause is present in an `OVER()` clause without an explicit frame clause, the ANSI SQL default frame is `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`. This produces a cumulative running total, grouping duplicates (ties) together.",
    "companyTags": [
      "Microsoft",
      "Oracle",
      "Morgan Stanley"
    ],
    "company_tags": [
      "Microsoft",
      "Oracle",
      "Morgan Stanley"
    ],
    "difficulty": "HARD",
    "sort_order": 45,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-46",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Which of the following describes a key distinction between a Stored Procedure and a User-Defined Function (UDF) in relational databases?",
    "options": [
      "Stored procedures can execute transaction management statements (`COMMIT`, `ROLLBACK`) and can return zero, one, or multiple values; Functions cannot initiate transactions and must return a single value (or table).",
      "Functions can alter server configuration, while stored procedures are strictly read-only.",
      "Stored procedures cannot accept input parameters.",
      "Functions can only be called from Python, while stored procedures are called from SQL."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Stored Procedures are precompiled SQL programs that can perform full transaction control (`COMMIT`/`ROLLBACK`), execute DDL statements, modify database state, and return multiple output parameters or result sets. User-Defined Functions (UDFs) are deterministic mathematical or scalar transformations that cannot alter database state or manage transactions, allowing them to be safely embedded inside `SELECT` statements.",
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
    "difficulty": "MEDIUM",
    "sort_order": 46,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-47",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "In database triggers, what are the pseudo-records `:NEW` and `:OLD` in an `UPDATE` trigger?",
    "options": [
      "`:OLD` contains row values prior to the update; `:NEW` contains the proposed new row values about to be written.",
      "`:OLD` represents the database administrator; `:NEW` represents the application user.",
      "`:OLD` is only available in DELETE triggers; `:NEW` is only available in INSERT triggers.",
      "Both `:OLD` and `:NEW` always contain the exact same values."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In row-level triggers:\n- `INSERT`: Only `:NEW` is available (holding values being inserted).\n- `DELETE`: Only `:OLD` is available (holding values being deleted).\n- `UPDATE`: Both `:OLD` (original pre-update row values) and `:NEW` (updated post-update row values) are accessible, allowing auditing and validation.",
    "companyTags": [
      "Accenture",
      "TCS Digital",
      "Infosys SP"
    ],
    "company_tags": [
      "Accenture",
      "TCS Digital",
      "Infosys SP"
    ],
    "difficulty": "BASIC",
    "sort_order": 47,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-48",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "According to Eric Brewer's CAP Theorem, what fundamental tradeoff must any distributed data store make in the event of a Network Partition (P)?",
    "options": [
      "It must choose between Consistency (C) and Availability (A) — either guarantee that all nodes see the same data at the cost of rejecting requests, or remain available at the cost of returning stale data.",
      "It can achieve all three (Consistency, Availability, Partition Tolerance) simultaneously by using SSDs.",
      "It must sacrifice Security for Performance.",
      "It must switch from SQL to NoSQL automatically."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "The CAP theorem proves that in any distributed data system, network partitions (communication breakdowns between nodes) are inevitable. When a partition ($P$) occurs, the system must choose between:\n- Consistency ($CP$): Reject requests or error out until nodes re-sync, guaranteeing correct data.\n- Availability ($AP$): Keep responding to every request, risking returning stale or inconsistent data.",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Uber"
    ],
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Uber"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 48,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-49",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Which category of NoSQL database is most suitable for storing hierarchical documents with rapidly evolving schemas (e.g. JSON-formatted catalogs)?",
    "options": [
      "Document Stores (e.g., MongoDB, Couchbase)",
      "Column-Family Stores (e.g., Apache Cassandra, HBase)",
      "Graph Databases (e.g., Neo4j)",
      "Relational Databases with 3NF normalization"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Document stores model data as self-describing, semi-structured documents (typically BSON/JSON). They support nested hierarchies, arrays, and dynamic polymorphic schemas, making them ideal for catalogs, user profiles, and content management where schema flexibility is paramount.",
    "companyTags": [
      "TCS Digital",
      "Infosys",
      "Wipro Turbo"
    ],
    "company_tags": [
      "TCS Digital",
      "Infosys",
      "Wipro Turbo"
    ],
    "difficulty": "BASIC",
    "sort_order": 49,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dbms-50",
    "topicId": "mcq-database-systems",
    "topic_id": "mcq-database-systems",
    "topic": "DBMS & SQL",
    "topic_name": "DBMS & SQL",
    "topicCategory": "DATABASE",
    "topic_category": "DATABASE",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "What critical concurrency bug can occur when using a `BEFORE INSERT` trigger to validate a table-wide uniqueness constraint under high concurrent load without appropriate row or table locking?",
    "codeSnippet": "CREATE TRIGGER check_unique_email\nBEFORE INSERT ON Users\nFOR EACH ROW\nBEGIN\n    IF (SELECT COUNT(*) FROM Users WHERE email = NEW.email) > 0 THEN\n        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Duplicate email';\n    END IF;\nEND;",
    "code_snippet": "CREATE TRIGGER check_unique_email\nBEFORE INSERT ON Users\nFOR EACH ROW\nBEGIN\n    IF (SELECT COUNT(*) FROM Users WHERE email = NEW.email) > 0 THEN\n        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Duplicate email';\n    END IF;\nEND;",
    "options": [
      "A Time-of-Check to Time-of-Use (TOCTOU) Race Condition: two concurrent transactions executing the trigger simultaneously both see `COUNT(*) = 0` and proceed to insert the identical email, creating duplicate records.",
      "Triggers cannot execute `SELECT` queries.",
      "The `SIGNAL` statement is forbidden in triggers.",
      "The trigger deletes all records in the `Users` table."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Checking constraints via procedural trigger queries suffers from a classic Time-of-Check to Time-of-Use (TOCTOU) race condition. If two transactions insert the same email at the same instant under default isolation levels, both triggers execute `SELECT COUNT(*)` concurrently, both see 0, and both commit duplicates. Uniqueness MUST be enforced by declarative `UNIQUE` database indexes.",
    "companyTags": [
      "Google",
      "Amazon",
      "Goldman Sachs"
    ],
    "company_tags": [
      "Google",
      "Amazon",
      "Goldman Sachs"
    ],
    "difficulty": "HARD",
    "sort_order": 50,
    "is_hidden": false,
    "is_deleted": false
  }
];

export const OPERATING_SYSTEMS_MCQ_SEED: TechnicalMcq[] = [
  {
    "id": "mcq-os-1",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the primary function of Dual-Mode operation (User Mode vs Kernel Mode) in modern computer operating systems?",
    "options": [
      "To allow two users to log into the operating system simultaneously.",
      "To protect the operating system kernel and hardware resources from being compromised by erroneous or malicious user-space applications.",
      "To double the clock frequency of the central processing unit.",
      "To execute 32-bit and 64-bit applications concurrently without recompilation."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Dual-mode execution uses a hardware mode bit (0 for kernel mode, 1 for user mode) to restrict privileged instructions (such as direct I/O access, memory map alterations, and disabling interrupts) to kernel mode. Attempting to execute a privileged instruction in user mode triggers a hardware trap into the OS kernel.",
    "companyTags": [
      "TCS Digital",
      "Infosys",
      "Wipro Turbo"
    ],
    "company_tags": [
      "TCS Digital",
      "Infosys",
      "Wipro Turbo"
    ],
    "difficulty": "BASIC",
    "sort_order": 1,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-2",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Which of the following resources is uniquely allocated to each Thread rather than being shared among all threads within the same process?",
    "options": [
      "Heap memory segment",
      "Open file descriptors",
      "Global variables and initialized data (.data segment)",
      "Program Counter (PC), CPU registers, and Call Stack"
    ],
    "correctOptionIndex": 3,
    "correct_option_index": 3,
    "explanation": "Threads belonging to the same process share the process's address space, code segment, data segment, open file handles, and heap. However, each thread maintains its own independent execution context: a unique Thread ID, Program Counter (PC), register set, and private execution Call Stack.",
    "companyTags": [
      "Cognizant GenC Next",
      "Accenture",
      "Capgemini"
    ],
    "company_tags": [
      "Cognizant GenC Next",
      "Accenture",
      "Capgemini"
    ],
    "difficulty": "BASIC",
    "sort_order": 2,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-3",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "How many total processes (including the parent process) are created upon executing the following C program?",
    "codeSnippet": "#include <stdio.h>\n#include <unistd.h>\nint main() {\n    fork();\n    fork();\n    fork();\n    return 0;\n}",
    "code_snippet": "#include <stdio.h>\n#include <unistd.h>\nint main() {\n    fork();\n    fork();\n    fork();\n    return 0;\n}",
    "options": [
      "3",
      "6",
      "8",
      "16"
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "Each invocation of `fork()` duplicates the calling process. With $n$ sequential `fork()` calls without conditionals, the total number of processes created is $2^n$. For $n = 3$, $2^3 = 8$ total active processes exist (1 original parent + 7 child processes).",
    "companyTags": [
      "Amazon",
      "TCS Digital",
      "Infosys SP"
    ],
    "company_tags": [
      "Amazon",
      "TCS Digital",
      "Infosys SP"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 3,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-4",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the key difference between a Zombie Process and an Orphan Process in Unix-like operating systems?",
    "options": [
      "A Zombie process has terminated execution but still has an entry in the Process Table waiting for its parent to read its exit status via `wait()`; an Orphan process has its parent terminate first, causing it to be adopted by `init` (PID 1).",
      "A Zombie process runs indefinitely in an infinite loop; an Orphan process is killed immediately by the kernel.",
      "An Orphan process occupies CPU cycles; a Zombie process is stored in virtual memory.",
      "There is no difference; both are synonyms for deadlocked processes."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "- Zombie Process: Child has completed execution via `exit()`, releasing memory and resources, but its PCB remains in the process table until the parent calls `wait()` to collect its termination status code.\n- Orphan Process: Parent process terminates before the child. The orphan child is immediately adopted by the `init` process (systemd / PID 1), which periodically invokes `wait()` to reap it.",
    "companyTags": [
      "Goldman Sachs",
      "Cisco",
      "Oracle"
    ],
    "company_tags": [
      "Goldman Sachs",
      "Cisco",
      "Oracle"
    ],
    "difficulty": "HARD",
    "sort_order": 4,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-5",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is printed by the child and parent processes in the following C code snippet?",
    "codeSnippet": "#include <stdio.h>\n#include <unistd.h>\nint val = 10;\nint main() {\n    pid_t pid = fork();\n    if (pid == 0) {\n        val += 5;\n        printf(\"Child: %d \", val);\n    } else {\n        wait(NULL);\n        printf(\"Parent: %d \", val);\n    }\n    return 0;\n}",
    "code_snippet": "#include <stdio.h>\n#include <unistd.h>\nint val = 10;\nint main() {\n    pid_t pid = fork();\n    if (pid == 0) {\n        val += 5;\n        printf(\"Child: %d \", val);\n    } else {\n        wait(NULL);\n        printf(\"Parent: %d \", val);\n    }\n    return 0;\n}",
    "options": [
      "Child: 15 Parent: 15 ",
      "Child: 15 Parent: 10 ",
      "Child: 10 Parent: 15 ",
      "Child: 10 Parent: 10 "
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "`fork()` creates a separate address space for the child process via Copy-On-Write (COW). When the child modifies `val += 5`, it updates its own private copy of the variable (printing 'Child: 15'). The parent process's memory space remains completely unaffected, so its `val` remains 10 (printing 'Parent: 10').",
    "companyTags": [
      "Amazon",
      "Google",
      "Qualcomm"
    ],
    "company_tags": [
      "Amazon",
      "Google",
      "Qualcomm"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 5,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-6",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the 'Convoy Effect' in operating system CPU scheduling?",
    "options": [
      "A situation where many CPU-bound processes queue behind a single short I/O process.",
      "A phenomenon in First-Come, First-Served (FCFS) scheduling where many short I/O-bound processes are stuck waiting behind one long, CPU-intensive process, resulting in severe CPU and device underutilization.",
      "When processes are scheduled in a round-robin circular ring without preemption.",
      "When high-priority processes monopolize the ready queue permanently."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "The Convoy Effect occurs under non-preemptive FCFS scheduling when a long CPU-burst process holds the CPU. Multiple short processes that need only a fraction of a millisecond to start an I/O operation are stalled waiting in the ready queue, leaving I/O devices idle and lowering system throughput.",
    "companyTags": [
      "TCS Digital",
      "Infosys",
      "Wipro"
    ],
    "company_tags": [
      "TCS Digital",
      "Infosys",
      "Wipro"
    ],
    "difficulty": "BASIC",
    "sort_order": 6,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-7",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "Three processes arrive at time $t = 0$ with burst times: $P_1 = 24\\text{ ms}, P_2 = 3\\text{ ms}, P_3 = 3\\text{ ms}$. Under Shortest Job First (SJF) scheduling, what is the average waiting time?",
    "options": [
      "17 ms",
      "3 ms",
      "6 ms",
      "9 ms"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Under non-preemptive SJF, order of execution is $P_2 \\to P_3 \\to P_1$:\n- Waiting time for $P_2 = 0\\text{ ms}$\n- Waiting time for $P_3 = 3\\text{ ms}$\n- Waiting time for $P_1 = 3 + 3 = 6\\text{ ms}$\nAverage waiting time = $(0 + 3 + 6) / 3 = 9 / 3 = 3\\text{ ms}$.\n(Under FCFS $P_1 \\to P_2 \\to P_3$, it would be $(0 + 24 + 27) / 3 = 17\\text{ ms}$).",
    "companyTags": [
      "Amazon",
      "TCS Digital",
      "Infosys SP"
    ],
    "company_tags": [
      "Amazon",
      "TCS Digital",
      "Infosys SP"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 7,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-8",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What happens if the Time Quantum in a Round Robin (RR) CPU scheduling algorithm is set excessively large?",
    "options": [
      "It degenerates into First-Come First-Served (FCFS) scheduling.",
      "It causes severe context switching overhead and thrashing.",
      "It guarantees zero turnaround time for all processes.",
      "It transforms into Shortest Remaining Time First (SRTF)."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "If the time quantum $q$ is extremely large (greater than the longest CPU burst), every process completes its entire burst before its quantum expires. Thus, no preemption ever occurs, and Round Robin scheduling degenerates directly into First-Come First-Served (FCFS).",
    "companyTags": [
      "Cognizant GenC Next",
      "Accenture",
      "Zoho"
    ],
    "company_tags": [
      "Cognizant GenC Next",
      "Accenture",
      "Zoho"
    ],
    "difficulty": "BASIC",
    "sort_order": 8,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-9",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Which technique is used to solve the Starvation problem inherent in Priority Scheduling?",
    "options": [
      "Compaction",
      "Aging (gradually increasing the priority of processes that wait in the ready queue for a long time)",
      "Paging",
      "Spinlocking"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Priority scheduling can lead to indefinite blocking (starvation), where low-priority processes are continuously superseded by newly arriving high-priority processes. 'Aging' solves this by incrementally boosting the priority of waiting processes over time (e.g. increasing priority by 1 every 15 minutes), ensuring every process eventually executes.",
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
    "difficulty": "MEDIUM",
    "sort_order": 9,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-10",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "Consider processes arriving at $t=0$: $P_1$ (burst 8 ms), $P_2$ (burst 4 ms). Using Round Robin with time quantum $q = 3\\text{ ms}$, what is the completion time of $P_1$?",
    "options": [
      "8 ms",
      "11 ms",
      "12 ms",
      "15 ms"
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "Round Robin execution timeline ($q = 3$):\n- $0 - 3\\text{ ms}$: $P_1$ runs for 3 ms (remaining: 5 ms).\n- $3 - 6\\text{ ms}$: $P_2$ runs for 3 ms (remaining: 1 ms).\n- $6 - 9\\text{ ms}$: $P_1$ runs for 3 ms (remaining: 2 ms).\n- $9 - 10\\text{ ms}$: $P_2$ runs for 1 ms and finishes at $t = 10\\text{ ms}$.\n- $10 - 12\\text{ ms}$: $P_1$ runs for its remaining 2 ms and finishes at $t = 12\\text{ ms}$.",
    "companyTags": [
      "Amazon",
      "Microsoft",
      "Goldman Sachs"
    ],
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Goldman Sachs"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 10,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-11",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What are the three essential requirements that any valid solution to the Critical Section problem must satisfy?",
    "options": [
      "Deadlock Freedom, Livelock Freedom, and FIFO Ordering",
      "Mutual Exclusion, Progress, and Bounded Waiting",
      "Atomicity, Consistency, and Durability",
      "Preemption, Aging, and Compaction"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "A valid solution to the Critical Section problem must satisfy:\n1. Mutual Exclusion: If process $P_i$ is executing in its critical section, no other processes can be executing in theirs.\n2. Progress: If no process is in its critical section and some wish to enter, only processes not in their remainder section can participate in deciding who enters next.\n3. Bounded Waiting: A bound must exist on the number of times other processes are allowed to enter after a process has requested entry.",
    "companyTags": [
      "TCS Digital",
      "Microsoft",
      "Oracle"
    ],
    "company_tags": [
      "TCS Digital",
      "Microsoft",
      "Oracle"
    ],
    "difficulty": "BASIC",
    "sort_order": 11,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-12",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "In Dijkstra's Semaphore abstraction, what are the atomic definitions of the `wait()` (P) and `signal()` (V) operations on an integer semaphore $S$?",
    "options": [
      "`wait(S)` decrements $S$ (blocking if $S \\le 0$); `signal(S)` increments $S$ (unblocking a waiting process).",
      "`wait(S)` increments $S$; `signal(S)` decrements $S$.",
      "`wait(S)` checks if $S == 0$; `signal(S)` deletes $S$.",
      "Both operations reset $S$ to 1 atomically."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In classic OS theory:\n- `wait(S)` (Dutch: *proberen*, test/decrement): Checks if $S \\le 0$ (blocks until $S > 0$), then decrements $S$ atomically: `S--;`\n- `signal(S)` (Dutch: *verhogen*, increment): Increments $S$ atomically: `S++;` and wakes up any process blocked on $S$.",
    "companyTags": [
      "Infosys SP",
      "TCS",
      "Accenture"
    ],
    "company_tags": [
      "Infosys SP",
      "TCS",
      "Accenture"
    ],
    "difficulty": "BASIC",
    "sort_order": 12,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-13",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the 'Priority Inversion' problem in real-time multitasking systems, and what protocol is designed to solve it?",
    "options": [
      "When a low-priority process enters an infinite loop; solved by killing all low-priority processes.",
      "When a high-priority task is indirectly preempted by a medium-priority task because a low-priority task holds a shared resource needed by the high-priority task; solved by the Priority Inheritance Protocol.",
      "When CPU priorities are inverted during power-saving sleep modes; solved by APM.",
      "When reader threads starve writer threads in shared memory; solved by FCFS."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Priority Inversion famously affected the Mars Pathfinder rover. A low-priority task $L$ acquired a mutex. A high-priority task $H$ blocked waiting for the mutex. Meanwhile, medium-priority tasks $M$ with no mutex requirement continuously preempted $L$, causing $H$ to miss deadlines. The Priority Inheritance Protocol resolves this by temporarily elevating $L$'s priority to $H$'s priority until $L$ releases the mutex.",
    "companyTags": [
      "Google",
      "Amazon",
      "NASA",
      "Qualcomm"
    ],
    "company_tags": [
      "Google",
      "Amazon",
      "NASA",
      "Qualcomm"
    ],
    "difficulty": "HARD",
    "sort_order": 13,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-14",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "CODE_COMPLETION",
    "question_type": "CODE_COMPLETION",
    "question": "In Peterson's algorithm for two processes $P_0$ and $P_1$, what is the correct entry condition for process $P_i$ (with peer $j = 1 - i$)?",
    "codeSnippet": "flag[i] = true;\nturn = j;\nwhile (/* __BLANK__ */) {\n    // busy wait\n}\n// Critical Section",
    "code_snippet": "flag[i] = true;\nturn = j;\nwhile (/* __BLANK__ */) {\n    // busy wait\n}\n// Critical Section",
    "options": [
      "flag[j] == true && turn == j",
      "flag[i] == true && turn == i",
      "flag[j] == false || turn == i",
      "turn != j"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In Peterson's algorithm, process $P_i$ announces its intention to enter by setting `flag[i] = true`, then courteously offers priority to the other process by setting `turn = j`. It busy-waits only if the other process also desires entry (`flag[j] == true`) AND it is the other process's turn (`turn == j`).",
    "companyTags": [
      "Microsoft",
      "Adobe",
      "Oracle"
    ],
    "company_tags": [
      "Microsoft",
      "Adobe",
      "Oracle"
    ],
    "difficulty": "HARD",
    "sort_order": 14,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-15",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is a Spinlock, and under what operational condition is a spinlock preferable to a blocking mutex?",
    "options": [
      "A spinlock is a lock where a thread loops continuously checking lock availability; it is preferable in multiprocessor systems when the lock is expected to be held for a very brief duration (less than the context-switch cost).",
      "A spinlock is used only in single-core processors to prevent context switching.",
      "A spinlock suspends threads to swap space on disk.",
      "A spinlock is an unrecoverable deadlocked state."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "A spinlock causes the acquiring thread to spin in a tight busy-waiting loop on a CPU core. On multiprocessor machines, if the critical section is extremely short, spinning consumes fewer CPU cycles than putting the thread to sleep, incurring two full context switches (sleep + wakeup).",
    "companyTags": [
      "Qualcomm",
      "Cisco",
      "Intel"
    ],
    "company_tags": [
      "Qualcomm",
      "Cisco",
      "Intel"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 15,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-16",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "In the Producer-Consumer problem using a bounded buffer of size $N$, what initial values must the counting semaphores `empty` and `full` have?",
    "options": [
      "empty = 0, full = N",
      "empty = N, full = 0",
      "empty = 1, full = 1",
      "empty = N, full = N"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Initially, the buffer contains zero items and $N$ empty slots. Therefore:\n- `empty` (tracks vacant slots): initialized to $N$.\n- `full` (tracks filled slots): initialized to 0.\n- `mutex` (binary semaphore for mutual exclusion): initialized to 1.",
    "companyTags": [
      "TCS Digital",
      "Infosys SP",
      "Cognizant"
    ],
    "company_tags": [
      "TCS Digital",
      "Infosys SP",
      "Cognizant"
    ],
    "difficulty": "BASIC",
    "sort_order": 16,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-17",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "Why does the following naive solution to the Dining Philosophers problem cause a fatal Deadlock?",
    "codeSnippet": "void philosopher(int i) {\n    while (1) {\n        think();\n        wait(chopstick[i]);              // pick left\n        wait(chopstick[(i + 1) % 5]);    // pick right\n        eat();\n        signal(chopstick[i]);\n        signal(chopstick[(i + 1) % 5]);\n    }\n}",
    "code_snippet": "void philosopher(int i) {\n    while (1) {\n        think();\n        wait(chopstick[i]);              // pick left\n        wait(chopstick[(i + 1) % 5]);    // pick right\n        eat();\n        signal(chopstick[i]);\n        signal(chopstick[(i + 1) % 5]);\n    }\n}",
    "options": [
      "Philosophers cannot think and eat in the same function.",
      "If all 5 philosophers become hungry simultaneously and each picks up their left chopstick first, every chopstick is held and each philosopher waits indefinitely for their right chopstick (Circular Wait deadlock).",
      "The `signal` operations are called in reverse order.",
      "`wait()` cannot accept array elements."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "If all 5 philosophers execute `wait(chopstick[i])` concurrently, each successfully acquires their left chopstick. When they proceed to request their right chopstick (`wait(chopstick[(i+1)%5])`), all chopsticks are unavailable. The four Coffman conditions are met, creating an unbreakable circular wait deadlock.",
    "companyTags": [
      "Amazon",
      "Microsoft",
      "Goldman Sachs"
    ],
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Goldman Sachs"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 17,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-18",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "In the First Readers-Writers problem (reader preference), what severe anomaly can writer processes experience?",
    "options": [
      "Starvation (indefinite postponement), because as long as at least one reader is actively reading, newly arriving readers can continually enter, preventing writers from ever gaining access.",
      "Deadlock between two readers.",
      "Memory corruption in the reader queue.",
      "Buffer overflow in the writer stack."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In the first readers-writers problem, no reader should be kept waiting unless a writer has already obtained permission to use the shared object. Consequently, if a continuous stream of readers arrives, the writer will starve indefinitely.",
    "companyTags": [
      "Adobe",
      "Oracle",
      "Cisco"
    ],
    "company_tags": [
      "Adobe",
      "Oracle",
      "Cisco"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 18,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-19",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the key difference between Hoare Semantics and Mesa Semantics when signaling a condition variable inside a Monitor?",
    "options": [
      "In Hoare semantics, `signal()` immediately yields CPU control to the awakened process (signal-and-wait); in Mesa semantics, the signaling process continues running and the awakened process is merely moved to the ready queue (signal-and-continue), requiring a `while` loop re-check.",
      "Hoare semantics is implemented only in hardware, while Mesa is in software.",
      "Mesa semantics does not support mutual exclusion.",
      "Hoare semantics allows multiple processes inside the monitor simultaneously."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In Hoare semantics (signal-and-wait), the condition is guaranteed to hold immediately upon wake-up (`if` test). In Mesa semantics (signal-and-continue, used by Java and POSIX threads), by the time the awakened thread actually runs, another thread may have altered state; therefore, conditions must always be re-evaluated inside a loop: `while (!condition) wait();`.",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "difficulty": "HARD",
    "sort_order": 19,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-20",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "CODE_COMPLETION",
    "question_type": "CODE_COMPLETION",
    "question": "Which strategy successfully prevents deadlocks in the Dining Philosophers problem without limiting concurrency unnecessarily?",
    "options": [
      "Resource Hierarchy Solution: Number chopsticks 0 through 4 and enforce that every philosopher must always acquire the lower-numbered chopstick first before requesting the higher-numbered chopstick.",
      "Eliminate all forks and let philosophers eat with hands.",
      "Allow all philosophers to eat at the exact same second.",
      "Force all philosophers to be left-handed."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Imposing a strict total ordering on resources (Dijkstra's resource hierarchy) breaks the Circular Wait condition. Philosophers 0 to 3 pick up chopstick $i$ then $i+1$. The last philosopher 4 must pick up chopstick 0 first (since $0 < 4$), breaking the circular symmetry and guaranteeing at least one philosopher can eat.",
    "companyTags": [
      "Goldman Sachs",
      "Morgan Stanley",
      "Uber"
    ],
    "company_tags": [
      "Goldman Sachs",
      "Morgan Stanley",
      "Uber"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 20,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-21",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Which of the following is NOT one of the four Coffman conditions necessary for a Deadlock to occur?",
    "options": [
      "Mutual Exclusion",
      "Hold and Wait",
      "No Preemption",
      "Preemptive Scheduling"
    ],
    "correctOptionIndex": 3,
    "correct_option_index": 3,
    "explanation": "The four necessary Coffman conditions for deadlock are:\n1. Mutual Exclusion (at least one non-shareable resource)\n2. Hold and Wait (a process holding resources can request additional ones)\n3. No Preemption (resources cannot be forcibly confiscated)\n4. Circular Wait (a closed chain of processes each waiting for a resource held by the next). 'Preemptive Scheduling' actually prevents/breaks deadlocks.",
    "companyTags": [
      "TCS",
      "Infosys",
      "Wipro Turbo"
    ],
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro Turbo"
    ],
    "difficulty": "BASIC",
    "sort_order": 21,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-22",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "In a Resource Allocation Graph (RAG), when does the presence of a directed cycle guarantee that a deadlock has occurred?",
    "options": [
      "When each resource type in the system has only a SINGLE instance.",
      "When each resource type has multiple instances.",
      "Cycles never indicate deadlocks in RAGs.",
      "Only when all processes are running in user mode."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In a Resource Allocation Graph:\n- If every resource type has strictly ONE instance, a cycle is BOTH necessary and sufficient for deadlock (a cycle guarantees deadlock).\n- If resource types have MULTIPLE instances, a cycle is necessary but NOT sufficient (a cycle may or may not represent a deadlock).",
    "companyTags": [
      "Amazon",
      "Cisco",
      "Oracle"
    ],
    "company_tags": [
      "Amazon",
      "Cisco",
      "Oracle"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 22,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-23",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "A system has 3 processes ($P_0, P_1, P_2$) each requiring a maximum of 2 units of Resource $R$. What is the minimum number of units of $R$ required to guarantee the system will NEVER deadlock?",
    "options": [
      "3",
      "4",
      "5",
      "6"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "The general formula to guarantee deadlock prevention for $n$ processes where each process $P_i$ needs at most $m$ units of a single resource type is:\n$R \\ge \\sum (m_i - 1) + 1 = n \\cdot (m - 1) + 1$.\nHere, $n = 3, m = 2$:\n$R \\ge 3 \\cdot (2 - 1) + 1 = 3 \\cdot 1 + 1 = 4$ units.\nWith 3 units, each process could hold 1 unit, deadlocking. With 4 units, at least one process gets 2 units and finishes.",
    "companyTags": [
      "TCS Digital",
      "Infosys SP",
      "Accenture"
    ],
    "company_tags": [
      "TCS Digital",
      "Infosys SP",
      "Accenture"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 23,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-24",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "In the Banker's Algorithm for deadlock avoidance, what defines a 'Safe State'?",
    "options": [
      "A state where all resources are currently free.",
      "A state from which there exists at least one 'safe execution sequence' of all processes such that every process can satisfy its maximum demand and terminate without deadlocking.",
      "A state where CPU utilization is below 50%.",
      "A state where no process has requested memory allocation."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "A state is safe if the system can allocate resources to each process (up to its stated maximum) in some order without deadlocking. An unsafe state is NOT necessarily a deadlock, but it has the potential to lead to a deadlock if processes request their maximum claims.",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 24,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-25",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "A system has 10 units of resource $R$. Currently: $P_0$ holds 3 (needs max 8), $P_1$ holds 2 (needs max 4), $P_2$ holds 2 (needs max 9). Total allocated = 7; Available = 3. Is the system in a safe state, and if so, what is a valid safe sequence?",
    "options": [
      "Safe sequence: <P1, P0, P2>",
      "Safe sequence: <P0, P1, P2>",
      "Unsafe state (deadlock inevitable)",
      "Safe sequence: <P2, P0, P1>"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Remaining Need = Max - Allocation:\n- $Need(P_0) = 8 - 3 = 5$\n- $Need(P_1) = 4 - 2 = 2$\n- $Need(P_2) = 9 - 2 = 7$\nAvailable = 3.\n1. Only $Need(P_1) = 2 \\le 3$. $P_1$ runs, releases 2 -> Available becomes $3 + 2 = 5$.\n2. Now $Need(P_0) = 5 \\le 5$. $P_0$ runs, releases 3 -> Available becomes $5 + 3 = 8$.\n3. Now $Need(P_2) = 7 \\le 8$. $P_2$ runs and completes.\nSafe sequence is `<P1, P0, P2>`.",
    "companyTags": [
      "Goldman Sachs",
      "Amazon",
      "Microsoft"
    ],
    "company_tags": [
      "Goldman Sachs",
      "Amazon",
      "Microsoft"
    ],
    "difficulty": "HARD",
    "sort_order": 25,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-26",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the key difference between Internal Fragmentation and External Fragmentation in main memory management?",
    "options": [
      "Internal fragmentation occurs when allocated memory blocks are larger than the requested size, leaving wasted space inside the partition; External fragmentation occurs when total free memory is sufficient to satisfy a request, but is split into non-contiguous scattered holes.",
      "External fragmentation happens inside cache; internal fragmentation happens on hard disks.",
      "Internal fragmentation can be eliminated by compaction, whereas external fragmentation cannot.",
      "External fragmentation occurs exclusively in fixed partitioning."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "- Internal fragmentation: Space wasted *inside* an allocated partition/page (e.g. allocating a 4 KB page for a 1 KB process leaves 3 KB internal fragmentation).\n- External fragmentation: Exists *outside* allocated blocks when enough total memory exists to satisfy a request, but the available blocks are non-contiguous. Can be solved by compaction or paging.",
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
    "sort_order": 26,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-27",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "A system uses paging with a page size of $4\\text{ KB}$ ($2^{12}$ bytes) and a 32-bit logical address space. How many bits are used for the Page Number ($p$) and Page Offset ($d$)?",
    "options": [
      "Page Number = 20 bits, Offset = 12 bits",
      "Page Number = 16 bits, Offset = 16 bits",
      "Page Number = 12 bits, Offset = 20 bits",
      "Page Number = 24 bits, Offset = 8 bits"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Page size = $4\\text{ KB} = 4096\\text{ bytes} = 2^{12}\\text{ bytes}$. Thus, the lower 12 bits represent the page offset ($d$).\nIn a 32-bit address space, the remaining bits represent the page number ($p$):\n$p = 32 - 12 = 20\\text{ bits}$ (allowing $2^{20} \\approx 1\\text{ million}$ virtual pages).",
    "companyTags": [
      "Infosys SP",
      "Amazon",
      "Cognizant GenC Next"
    ],
    "company_tags": [
      "Infosys SP",
      "Amazon",
      "Cognizant GenC Next"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 27,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-28",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "A system has a Translation Lookaside Buffer (TLB) with hit ratio $\\alpha = 80\\%$. TLB access time is $20\\text{ ns}$ and main memory access time is $100\\text{ ns}$. What is the Effective Memory Access Time (EMAT)?",
    "options": [
      "120 ns",
      "140 ns",
      "220 ns",
      "100 ns"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Effective Memory Access Time formula:\n$\\text{EMAT} = \\alpha \\cdot (t_{\\text{TLB}} + t_{\\text{mem}}) + (1 - \\alpha) \\cdot (t_{\\text{TLB}} + 2 \\cdot t_{\\text{mem}})$\n- On TLB hit (80%): access TLB ($20\\text{ ns}$) + 1 memory access for data ($100\\text{ ns}$) = $120\\text{ ns}$.\n- On TLB miss (20%): access TLB ($20\\text{ ns}$) + 1 memory access for page table ($100\\text{ ns}$) + 1 memory access for data ($100\\text{ ns}$) = $220\\text{ ns}$.\n$\\text{EMAT} = 0.8 \\times 120 + 0.2 \\times 220 = 96 + 44 = 140\\text{ ns}$.",
    "companyTags": [
      "Google",
      "Amazon",
      "Qualcomm",
      "Microsoft"
    ],
    "company_tags": [
      "Google",
      "Amazon",
      "Qualcomm",
      "Microsoft"
    ],
    "difficulty": "HARD",
    "sort_order": 28,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-29",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Which dynamic memory allocation strategy searches the entire list of free blocks and allocates the smallest hole that is big enough to satisfy the request?",
    "options": [
      "First-Fit",
      "Best-Fit",
      "Worst-Fit",
      "Next-Fit"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Best-Fit searches the entire free list to find the smallest hole that fits the request. While intuitive, it produces the smallest leftover slivers of free memory, exacerbating external fragmentation and requiring full-list traversal unless maintained in sorted order.",
    "companyTags": [
      "TCS",
      "Accenture",
      "Wipro"
    ],
    "company_tags": [
      "TCS",
      "Accenture",
      "Wipro"
    ],
    "difficulty": "BASIC",
    "sort_order": 29,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-30",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Why is multi-level (hierarchical) paging used instead of single-level paging in 32-bit and 64-bit systems?",
    "options": [
      "To avoid allocating a gigantic, contiguous linear page table in physical memory for the entire virtual address space, allocating page table nodes only for currently mapped address regions.",
      "To speed up memory access by eliminating the need for TLB cache.",
      "To compress RAM data in real time.",
      "To allow processes to share private registers."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In a 32-bit architecture with 4 KB pages, a single-level page table requires $2^{20} \\times 4\\text{ bytes} = 4\\text{ MB}$ of contiguous physical RAM for *every* process. Multi-level paging breaks the table into page-sized chunks, allowing sparse allocation where unmapped memory ranges consume no page table storage.",
    "companyTags": [
      "Microsoft",
      "Intel",
      "Cisco"
    ],
    "company_tags": [
      "Microsoft",
      "Intel",
      "Cisco"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 30,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-31",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is Belady's Anomaly in operating system virtual memory?",
    "options": [
      "A phenomenon where increasing the number of physical page frames results in an INCREASE in the number of page faults for certain page reference strings (notably in FIFO).",
      "A condition where LRU generates more page faults than FIFO.",
      "A CPU hardware bug that misaligns memory addresses.",
      "When virtual memory exceeds physical disk swap space."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Belady's Anomaly is the counter-intuitive observation where giving a process more physical page frames leads to a higher number of page faults. It occurs in non-stack algorithms like First-In First-Out (FIFO). Stack-based algorithms (like LRU and Optimal) are mathematically proven to be immune to Belady's Anomaly.",
    "companyTags": [
      "TCS Digital",
      "Infosys SP",
      "Amazon"
    ],
    "company_tags": [
      "TCS Digital",
      "Infosys SP",
      "Amazon"
    ],
    "difficulty": "BASIC",
    "sort_order": 31,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-32",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "Given the page reference string: `[7, 0, 1, 2, 0, 3, 0]` and 3 empty frames, how many total page faults occur under FIFO page replacement?",
    "options": [
      "4",
      "5",
      "6",
      "7"
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "Simulating FIFO with 3 frames:\n1. Page 7 -> Fault (Frames: [7])\n2. Page 0 -> Fault (Frames: [7, 0])\n3. Page 1 -> Fault (Frames: [7, 0, 1])\n4. Page 2 -> Fault (replaces 7 -> Frames: [2, 0, 1])\n5. Page 0 -> HIT (0 is already in frame)\n6. Page 3 -> Fault (replaces 0 -> Frames: [2, 3, 1])\n7. Page 0 -> Fault (replaces 1 -> Frames: [2, 3, 0])\nTotal page faults = 6.",
    "companyTags": [
      "Amazon",
      "TCS Digital",
      "Cognizant GenC Next"
    ],
    "company_tags": [
      "Amazon",
      "TCS Digital",
      "Cognizant GenC Next"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 32,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-33",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "For the same reference string `[7, 0, 1, 2, 0, 3, 0]` with 3 empty frames, how many total page faults occur under Optimal Page Replacement (OPT)?",
    "options": [
      "4",
      "5",
      "6",
      "7"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Simulating Optimal (replaces page not used for longest time in future):\n1. Page 7 -> Fault (Frames: [7])\n2. Page 0 -> Fault (Frames: [7, 0])\n3. Page 1 -> Fault (Frames: [7, 0, 1])\n4. Page 2 -> Fault: next uses are 0 (step 5), 3 (step 6). 7 is never used again! Replace 7 -> Frames: [2, 0, 1]\n5. Page 0 -> HIT\n6. Page 3 -> Fault: next use is 0 (step 7). Between 2 and 1, neither used; replace 1 (or 2) -> Frames: [2, 0, 3]\n7. Page 0 -> HIT\nTotal page faults = 5.",
    "companyTags": [
      "Google",
      "Microsoft",
      "Goldman Sachs"
    ],
    "company_tags": [
      "Google",
      "Microsoft",
      "Goldman Sachs"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 33,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-34",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is 'Thrashing' in virtual memory, and what causes it?",
    "options": [
      "A state where the operating system spends more time swapping pages in and out of disk than executing user instructions, caused when the sum of processes' working-set sizes exceeds total physical memory.",
      "Rapid deletion of temporary files during garbage collection.",
      "Overheating of the CPU due to overclocking.",
      "When the file allocation table gets corrupted."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Thrashing occurs when processes do not have enough frames to hold their active working sets. A process page-faults, waiting for disk I/O. The OS observes low CPU utilization and mistakenly increases the degree of multiprogramming, bringing in more processes and worsening page faults until the system grinds to a halt swapping pages.",
    "companyTags": [
      "TCS Digital",
      "Infosys",
      "Adobe"
    ],
    "company_tags": [
      "TCS Digital",
      "Infosys",
      "Adobe"
    ],
    "difficulty": "BASIC",
    "sort_order": 34,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-35",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "How does the Clock (Second-Chance) page replacement algorithm approximate Least Recently Used (LRU)?",
    "options": [
      "By inspecting a reference bit: if 0, the page is replaced; if 1, the reference bit is cleared to 0 and the hand advances to give it a second chance.",
      "By synchronizing with the motherboard real-time clock chip.",
      "By counting the exact nanoseconds since last access using 64-bit hardware timers.",
      "By running a background daemon every 60 seconds."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "The Clock algorithm arranges frames in a circular queue with a reference bit for each page. When a page must be replaced, the pointer advances: if the reference bit is 1, it resets it to 0 ('second chance') and advances. The first page encountered with a reference bit of 0 is selected for replacement.",
    "companyTags": [
      "Cisco",
      "Qualcomm",
      "Oracle"
    ],
    "company_tags": [
      "Cisco",
      "Qualcomm",
      "Oracle"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 35,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-36",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "In a Unix-style file system, what information is NOT stored inside an i-node?",
    "options": [
      "File size and file type",
      "User ID (UID) and Group ID (GID) permissions",
      "Direct and indirect disk block pointers",
      "The file's name"
    ],
    "correctOptionIndex": 3,
    "correct_option_index": 3,
    "explanation": "An i-node stores all file metadata (file size, permissions, owner UID, timestamps, links count, and data block pointers), but does NOT store the filename! Filenames are stored inside Directory entries, which map filenames to their corresponding i-node numbers (allowing hard links to point different names to the same i-node).",
    "companyTags": [
      "Google",
      "Amazon",
      "Red Hat",
      "Microsoft"
    ],
    "company_tags": [
      "Google",
      "Amazon",
      "Red Hat",
      "Microsoft"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 36,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-37",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "In an i-node with block size = $1\\text{ KB}$ and 4-byte block pointers, there are 10 direct block pointers and 1 single indirect pointer. What is the maximum file size that can be addressed?",
    "options": [
      "10 KB",
      "256 KB",
      "266 KB",
      "1 MB"
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "- Direct blocks: $10 \\times 1\\text{ KB} = 10\\text{ KB}$.\n- Single indirect pointer: Points to a block of size $1\\text{ KB} = 1024\\text{ bytes}$ containing 4-byte pointers. Number of pointers = $1024 / 4 = 256$ pointers. Each points to a 1 KB data block = $256 \\times 1\\text{ KB} = 256\\text{ KB}$.\nTotal addressable size = $10\\text{ KB} + 256\\text{ KB} = 266\\text{ KB}$.",
    "companyTags": [
      "Goldman Sachs",
      "Amazon",
      "Qualcomm"
    ],
    "company_tags": [
      "Goldman Sachs",
      "Amazon",
      "Qualcomm"
    ],
    "difficulty": "HARD",
    "sort_order": 37,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-38",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the key difference between a Hard Link and a Symbolic (Soft) Link in Linux?",
    "options": [
      "A Hard Link is a directory entry pointing directly to the original file's i-node (sharing the same i-node number and file contents); a Soft Link is a special file containing the path string to the target file with its own distinct i-node.",
      "Deleting the original file corrupts hard links, but soft links continue working.",
      "Hard links can link to directories across different mounted file systems.",
      "Soft links use more memory than the original file."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "- Hard Link: Creates another directory entry sharing the identical i-node number. Deleting the original name keeps the file intact until link count drops to 0. Cannot cross file systems.\n- Soft Link (`ln -s`): Creates a new file with its own unique i-node whose content is the target file path. If original file is deleted, soft link becomes a 'dangling' broken link.",
    "companyTags": [
      "TCS Digital",
      "Infosys SP",
      "Cognizant"
    ],
    "company_tags": [
      "TCS Digital",
      "Infosys SP",
      "Cognizant"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 38,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-39",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "A disk head is at cylinder 53. Requests queue: `[98, 183, 37, 122]`. Under Shortest Seek Time First (SSTF), which cylinder is serviced first?",
    "options": [
      "98 (distance 45)",
      "37 (distance 16)",
      "122 (distance 69)",
      "183 (distance 130)"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "SSTF selects the request closest to the current head position:\n- $|53 - 98| = 45$\n- $|53 - 183| = 130$\n- $|53 - 37| = 16$\n- $|53 - 122| = 69$\nThe minimum distance is 16, so cylinder 37 is serviced first.",
    "companyTags": [
      "TCS",
      "Infosys",
      "Capgemini"
    ],
    "company_tags": [
      "TCS",
      "Infosys",
      "Capgemini"
    ],
    "difficulty": "BASIC",
    "sort_order": 39,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-40",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Why does Circular SCAN (C-SCAN) disk scheduling provide a more uniform wait time than standard SCAN (Elevator)?",
    "options": [
      "C-SCAN treats cylinders as a circular list, servicing requests in one direction only, and immediately jumps back to the beginning of the disk without servicing requests on the return journey.",
      "C-SCAN uses binary search trees for disk sectors.",
      "C-SCAN operates without physical disk arms.",
      "C-SCAN prioritizes write requests over read requests."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In standard SCAN, requests at the far end of the disk wait longer when the head reverses. C-SCAN eliminates this bias by scanning strictly in one direction; when it reaches the outer cylinder, it resets directly to the beginning without servicing requests on the return sweep, ensuring equal average wait times across all tracks.",
    "companyTags": [
      "Amazon",
      "Adobe",
      "Microsoft"
    ],
    "company_tags": [
      "Amazon",
      "Adobe",
      "Microsoft"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 40,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-41",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the primary benefit of Direct Memory Access (DMA) in computer architecture?",
    "options": [
      "It allows high-speed I/O devices to transfer large blocks of data directly to and from main memory without continuous CPU intervention.",
      "It eliminates the need for RAM cache.",
      "It automatically executes Java bytecode in hardware.",
      "It allows the CPU to operate without an instruction register."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Without DMA, programmed I/O or interrupt-driven I/O requires the CPU to transfer data byte-by-byte or word-by-word between device and memory. DMA delegates this transfer to a DMA controller: the CPU initiates the transfer and is freed to do other work, receiving a single interrupt only when the entire block transfer completes.",
    "companyTags": [
      "TCS Digital",
      "Intel",
      "Qualcomm"
    ],
    "company_tags": [
      "TCS Digital",
      "Intel",
      "Qualcomm"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 41,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-42",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the architectural tradeoff between a Monolithic Kernel (e.g., Linux) and a Microkernel (e.g., QNX, Mach)?",
    "options": [
      "Monolithic kernels run all OS services (VFS, IPC, drivers) in kernel space for high performance at the cost of stability; Microkernels keep only minimal primitives in kernel space, running drivers and file systems in user space for fault isolation at the cost of IPC message-passing overhead.",
      "Microkernels run faster because they use 8-bit registers.",
      "Monolithic kernels cannot support networking.",
      "Microkernels cannot run multithreaded programs."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "- Monolithic Kernel: Entire OS (drivers, file system, memory manager) executes in privileged kernel space. Advantage: high performance via direct function calls. Disadvantage: a crash in a device driver can crash the entire OS.\n- Microkernel: Only minimal mechanisms (IPC, basic scheduling, memory mapping) run in kernel space. Drivers and servers run in user space. Advantage: robust fault isolation. Disadvantage: high message-passing context switch overhead.",
    "companyTags": [
      "Google",
      "Amazon",
      "Red Hat"
    ],
    "company_tags": [
      "Google",
      "Amazon",
      "Red Hat"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 42,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-43",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is 'Spooling' (Simultaneous Peripheral Operations On-Line) in operating system I/O management?",
    "options": [
      "Buffering data on disk for a slow, non-shareable peripheral device (such as a printer) so multiple processes can output concurrently without interleaving output.",
      "Winding magnetic tape backups at high speed.",
      "Compressing disk blocks using gzip algorithms.",
      "Distributing network packets across fiber optic links."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Spooling uses the disk as a massive buffer to hold print or device jobs from multiple concurrent processes. Because a printer cannot interleave lines from distinct programs, jobs are spooled to temporary files on disk and printed sequentially one by one.",
    "companyTags": [
      "Infosys",
      "TCS",
      "Accenture"
    ],
    "company_tags": [
      "Infosys",
      "TCS",
      "Accenture"
    ],
    "difficulty": "BASIC",
    "sort_order": 43,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-44",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "How does a software application transition from user mode to kernel mode to invoke an operating system service?",
    "options": [
      "By executing a software interrupt / trap instruction (e.g. `syscall` or `int 0x80`), which switches the CPU mode bit to kernel mode and jumps to the kernel's interrupt vector table.",
      "By modifying the CPU program counter directly with a `goto` statement.",
      "By writing to a shared global variable in C.",
      "By compiling the application with the `-kernel` compiler flag."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "User applications cannot directly jump into kernel memory (hardware memory protection causes a segmentation fault). Instead, the application puts system call arguments into CPU registers and triggers a hardware trap/instruction (`syscall` / `int 0x80`). The CPU hardware switches mode bit to 0 (kernel mode) and vectors to the pre-configured kernel dispatch table.",
    "companyTags": [
      "Microsoft",
      "Google",
      "Intel"
    ],
    "company_tags": [
      "Microsoft",
      "Google",
      "Intel"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 44,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-45",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is 'Cycle Stealing' by a Direct Memory Access (DMA) controller?",
    "options": [
      "The DMA controller temporarily suspends CPU memory bus access for one bus cycle to transfer a data word directly into RAM.",
      "A CPU overclocking mechanism to increase cycle counts.",
      "A security malware vulnerability.",
      "A battery drain issue in mobile laptops."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In cycle-stealing mode, when the DMA controller and the CPU contend for the system memory bus, the DMA controller takes priority for a single bus cycle to transfer one data word directly to/from memory, slightly delaying the CPU's memory access without stopping CPU computation entirely.",
    "companyTags": [
      "Qualcomm",
      "Intel",
      "Cisco"
    ],
    "company_tags": [
      "Qualcomm",
      "Intel",
      "Cisco"
    ],
    "difficulty": "HARD",
    "sort_order": 45,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-46",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What security mechanism randomizes the memory addresses of the stack, heap, and libraries at runtime to mitigate buffer overflow exploits?",
    "options": [
      "ASLR (Address Space Layout Randomization)",
      "DMA (Direct Memory Access)",
      "TLB (Translation Lookaside Buffer)",
      "RAID (Redundant Array of Independent Disks)"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Address Space Layout Randomization (ASLR) randomly arranges the address space positions of key data areas (the base of the executable, stack, heap, and shared libraries). This prevents attackers from reliably predicting the target addresses needed to jump into injected shellcode or execute return-oriented programming (ROP) payloads.",
    "companyTags": [
      "Microsoft",
      "Google",
      "Amazon"
    ],
    "company_tags": [
      "Microsoft",
      "Google",
      "Amazon"
    ],
    "difficulty": "BASIC",
    "sort_order": 46,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-47",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the primary architectural difference between a Type-1 (Bare-Metal) Hypervisor and a Type-2 (Hosted) Hypervisor?",
    "options": [
      "A Type-1 Hypervisor runs directly on the physical host hardware without an underlying host OS; a Type-2 Hypervisor runs as an application on top of an existing host operating system.",
      "Type-1 hypervisors can only run Linux; Type-2 can only run Windows.",
      "Type-2 hypervisors do not require CPU virtualization extensions.",
      "Type-1 hypervisors cannot manage virtual storage."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "- Type-1 Hypervisor (Bare-metal, e.g. VMware ESXi, Xen, KVM): Deployed directly onto bare hardware, delivering superior performance, lower latency, and higher security for data centers.\n- Type-2 Hypervisor (Hosted, e.g. VirtualBox, VMware Workstation): Operates inside a standard host OS (like Windows or macOS), relying on the host OS for device drivers and resource scheduling.",
    "companyTags": [
      "VMware",
      "Amazon AWS",
      "Microsoft Azure"
    ],
    "company_tags": [
      "VMware",
      "Amazon AWS",
      "Microsoft Azure"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 47,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-48",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "In Linux container technologies (such as Docker), which two kernel features provide resource limitation and process namespace isolation respectively?",
    "options": [
      "cgroups (Control Groups) for resource limitation, and Namespaces for process/filesystem isolation.",
      "i-nodes and superblocks",
      "Paging and Segmentation",
      "RAID and LVM"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Linux Containers rely on two core kernel building blocks:\n1. `cgroups` (control groups): Regulates and caps hardware resource usage (CPU time, RAM limits, disk I/O bandwidth).\n2. `namespaces`: Provides process-level isolation of system resources (PID, Mount, Network, IPC, User namespaces), giving each container the illusion of its own dedicated OS.",
    "companyTags": [
      "Google",
      "Red Hat",
      "Amazon",
      "Docker"
    ],
    "company_tags": [
      "Google",
      "Red Hat",
      "Amazon",
      "Docker"
    ],
    "difficulty": "HARD",
    "sort_order": 48,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-49",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "In Real-Time Operating Systems (RTOS), what distinguishes a Hard Real-Time system from a Soft Real-Time system?",
    "options": [
      "In a Hard RTOS, missing a single deadline results in total catastrophic system failure (e.g. pacemakers, automotive airbag deployment); in a Soft RTOS, missing a deadline degrades quality of service but does not cause system collapse (e.g. video streaming).",
      "Hard RTOS uses magnetic storage; Soft RTOS uses SSDs.",
      "Soft RTOS cannot use priority scheduling.",
      "Hard RTOS runs only on quantum computers."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Real-time systems enforce strict timeliness constraints. In Hard RTOS (aerospace flight control, nuclear reactors, medical implants), missing a deadline constitutes total system failure. In Soft RTOS (multimedia playback, gaming), deadlines are desirable goals where lateness simply causes dropped frames without hazard.",
    "companyTags": [
      "Qualcomm",
      "ISRO",
      "Intel",
      "Boeing"
    ],
    "company_tags": [
      "Qualcomm",
      "ISRO",
      "Intel",
      "Boeing"
    ],
    "difficulty": "BASIC",
    "sort_order": 49,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-os-50",
    "topicId": "mcq-operating-systems",
    "topic_id": "mcq-operating-systems",
    "topic": "Operating Systems",
    "topic_name": "Operating Systems",
    "topicCategory": "OPERATING_SYSTEMS",
    "topic_category": "OPERATING_SYSTEMS",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "What security vulnerability occurs in C when `gets()` or `strcpy()` writes user input into a fixed-size stack buffer without bounds checking?",
    "codeSnippet": "void vulnerable() {\n    char buffer[64];\n    gets(buffer); // Stack-based buffer overflow\n}",
    "code_snippet": "void vulnerable() {\n    char buffer[64];\n    gets(buffer); // Stack-based buffer overflow\n}",
    "options": [
      "Stack-based Buffer Overflow: user input exceeds 64 bytes, corrupting saved frame pointer and overwriting the function's return address to hijack instruction control flow.",
      "Memory leak in the heap segment.",
      "Deadlock in the standard C library.",
      "A page fault that permanently locks the motherboard BIOS."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Unbounded string functions like `gets()` write past the 64-byte stack allocation boundary. The surplus bytes overwrite the saved base pointer and the function's return address located in the stack activation record. An attacker crafts payload bytes such that `ret` jumps execution directly to malicious shellcode.",
    "companyTags": [
      "Google",
      "Microsoft",
      "Goldman Sachs"
    ],
    "company_tags": [
      "Google",
      "Microsoft",
      "Goldman Sachs"
    ],
    "difficulty": "HARD",
    "sort_order": 50,
    "is_hidden": false,
    "is_deleted": false
  }
];

export const COMPUTER_NETWORKS_MCQ_SEED: TechnicalMcq[] = [
  {
    "id": "mcq-cn-1",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Which layer of the 7-layer OSI reference model is directly responsible for data formatting, character code translation (e.g. ASCII to EBCDIC), and data encryption/decryption (TLS/SSL)?",
    "options": [
      "Application Layer (Layer 7)",
      "Presentation Layer (Layer 6)",
      "Session Layer (Layer 5)",
      "Transport Layer (Layer 4)"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "The Presentation Layer (Layer 6) acts as the data translator for the network. It handles syntax and semantics of information exchanged between systems, including data representation/formatting (ASCII, Unicode, JPEG), data compression, and cryptographic encryption/decryption.",
    "companyTags": [
      "TCS Digital",
      "Infosys",
      "Wipro Turbo"
    ],
    "company_tags": [
      "TCS Digital",
      "Infosys",
      "Wipro Turbo"
    ],
    "difficulty": "BASIC",
    "sort_order": 1,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-2",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "What is the correct chronological sequence of Protocol Data Units (PDUs) as user data is encapsulated moving down the OSI model from Layer 7 to Layer 1?",
    "options": [
      "Data (Message) -> Segment -> Packet (Datagram) -> Frame -> Bits",
      "Packet -> Frame -> Segment -> Data -> Bits",
      "Data -> Packet -> Segment -> Frame -> Bits",
      "Message -> Frame -> Packet -> Segment -> Bits"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "PDU encapsulation sequence:\n- Application / Presentation / Session (Layers 7-5): Data / Message\n- Transport (Layer 4): Segment (TCP) or Datagram (UDP)\n- Network (Layer 3): Packet\n- Data Link (Layer 2): Frame (adds header + trailer with CRC)\n- Physical (Layer 1): Bits (raw electromagnetic / optical signals)",
    "companyTags": [
      "Cognizant GenC Next",
      "Accenture",
      "Capgemini"
    ],
    "company_tags": [
      "Cognizant GenC Next",
      "Accenture",
      "Capgemini"
    ],
    "difficulty": "BASIC",
    "sort_order": 2,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-3",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Why does the Data Link layer append both a Header AND a Trailer to the packet, whereas other layers append only headers?",
    "options": [
      "The trailer contains the Cyclic Redundancy Check (CRC) Frame Check Sequence (FCS) calculated over the entire frame for bit-error detection upon physical reception.",
      "The trailer stores the destination IP address.",
      "The trailer contains encryption keys for the Transport layer.",
      "The trailer is required by the operating system kernel to allocate socket buffers."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "The Data Link layer encapsulates network packets into frames. While the header stores source/destination MAC addresses and frame type, the trailer stores the Frame Check Sequence (FCS), typically computed using a 32-bit Cyclic Redundancy Check (CRC). Placing it at the end allows the receiving hardware to calculate the checksum on-the-fly as bits stream in.",
    "companyTags": [
      "Cisco",
      "Qualcomm",
      "Intel"
    ],
    "company_tags": [
      "Cisco",
      "Qualcomm",
      "Intel"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 3,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-4",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the primary responsibility of the Session Layer (Layer 5) in the OSI model?",
    "options": [
      "Routing packets across multiple autonomous networks.",
      "Establishing, managing, synchronizing (via checkpoints), and terminating dialog sessions between communicating applications.",
      "Modulating digital signals onto analog carrier waves.",
      "Performing sliding-window flow control between transport sockets."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "The Session Layer establishes, maintains, and synchronizes dialog interactions between two communicating hosts. It handles dialog separation (simplex, half-duplex, or full-duplex) and inserts synchronization checkpoints into long data streams so that in case of failure, only data after the last checkpoint is resent.",
    "companyTags": [
      "Infosys SP",
      "TCS Digital",
      "Accenture"
    ],
    "company_tags": [
      "Infosys SP",
      "TCS Digital",
      "Accenture"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 4,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-5",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "How does the 4-layer TCP/IP reference model map to the 7-layer OSI reference model?",
    "options": [
      "Application (OSI 5, 6, 7), Transport (OSI 4), Internet (OSI 3), Network Access / Link (OSI 1, 2)",
      "Application (OSI 7), Transport (OSI 6, 5), Internet (OSI 4, 3), Link (OSI 2, 1)",
      "Application (OSI 6, 7), Session (OSI 5), Transport (OSI 3, 4), Link (OSI 1, 2)",
      "There is a 1-to-1 exact mapping between all layers."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "The original TCP/IP architecture collapses OSI layers:\n- TCP/IP Application layer combines OSI Application, Presentation, and Session layers.\n- TCP/IP Transport layer corresponds to OSI Transport layer.\n- TCP/IP Internet layer corresponds to OSI Network layer.\n- TCP/IP Network Access (Link) layer combines OSI Data Link and Physical layers.",
    "companyTags": [
      "Amazon",
      "Google",
      "Oracle"
    ],
    "company_tags": [
      "Amazon",
      "Google",
      "Oracle"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 5,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-6",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "In HDLC bit-oriented framing, the flag sequence is `01111110`. Under Bit Stuffing rules, what is the transmitted bit stream for the input data `01111110111110`?",
    "options": [
      "0111110101111100",
      "011111010111110",
      "011111101111100",
      "011111001111101"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In HDLC bit stuffing, whenever the sender encounters five consecutive 1s in the data payload, it automatically stuffs a single `0` bit immediately after the fifth `1` (to prevent data from mimicking the 6-consecutive-1s delimiter flag `01111110`).\nInput: `0 11111 10 11111 0`\n- First five 1s: stuff `0` -> `0 11111 0 10 ...`\n- Next five 1s: stuff `0` -> `... 11111 0 0`\nResult: `0111110101111100`.",
    "companyTags": [
      "Amazon",
      "TCS Digital",
      "Infosys SP"
    ],
    "company_tags": [
      "Amazon",
      "TCS Digital",
      "Infosys SP"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 6,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-7",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "In a Stop-and-Wait ARQ protocol, transmission time $T_t = 1\\text{ ms}$ and propagation time $T_p = 49.5\\text{ ms}$. If acknowledgment transmission time is negligible, what is the link utilization (efficiency $\\eta$)?",
    "options": [
      "1%",
      "2%",
      "10%",
      "50%"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Efficiency formula for Stop-and-Wait:\n$\\eta = \\frac{T_t}{T_t + 2 \\cdot T_p} = \\frac{1}{1 + 2 \\cdot (49.5)} = \\frac{1}{1 + 99} = \\frac{1}{100} = 1\\%$.\nThe channel remains idle 99% of the time waiting for round-trip propagation, demonstrating why pipelined sliding window protocols are essential for high-latency links.",
    "companyTags": [
      "Google",
      "Cisco",
      "Qualcomm"
    ],
    "company_tags": [
      "Google",
      "Cisco",
      "Qualcomm"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 7,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-8",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the maximum Sender Window Size ($W_s$) and Receiver Window Size ($W_r$) for a $k$-bit sequence number in Go-Back-N (GBN) versus Selective Repeat (SR)?",
    "options": [
      "GBN: $W_s = 2^k - 1, W_r = 1$; Selective Repeat: $W_s = 2^{k-1}, W_r = 2^{k-1}$",
      "GBN: $W_s = 2^k, W_r = 1$; Selective Repeat: $W_s = 2^k, W_r = 2^k$",
      "GBN: $W_s = 1, W_r = 2^k - 1$; Selective Repeat: $W_s = 2^{k-1}, W_r = 1$",
      "Both protocols require $W_s = W_r = 2^k - 1$."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "- In Go-Back-N, the receiver accepts only in-order packets ($W_r = 1$). To avoid sequence number ambiguity, $W_s \\le 2^k - 1$.\n- In Selective Repeat, both sender and receiver buffer out-of-order packets. To prevent overlap between the current window and the next sequence space cycle, $W_s + W_r \\le 2^k$. With symmetric windows, $W_s = W_r = 2^{k-1}$.",
    "companyTags": [
      "Goldman Sachs",
      "Amazon",
      "Microsoft"
    ],
    "company_tags": [
      "Goldman Sachs",
      "Amazon",
      "Microsoft"
    ],
    "difficulty": "HARD",
    "sort_order": 8,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-9",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is 'Piggybacking' in Data Link layer sliding window protocols?",
    "options": [
      "Temporarily delaying an outgoing ACK so it can be hooked into an outgoing data frame's header, saving network bandwidth.",
      "Sending two identical packets simultaneously over different cables.",
      "Stealing Wi-Fi bandwidth from an adjacent router.",
      "Encrypting payload data with private keys."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Piggybacking is an optimization in bidirectional communication. Instead of sending a separate standalone ACK frame (which incurs full preamble, header, and framing overhead), the receiver waits briefly for an outgoing data frame of its own and embeds the ACK number directly into that data frame's header.",
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
    "sort_order": 9,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-10",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "In Cyclic Redundancy Check (CRC), if the generator polynomial is $G(x) = x^3 + x + 1$ (binary `1011`), how many zero bits must be appended to the data message before performing polynomial modulo-2 division?",
    "options": [
      "2 bits",
      "3 bits",
      "4 bits",
      "Depends on the data message length"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "In CRC, the number of redundant zero bits appended to the data is equal to the degree of the generator polynomial ($r$). For $G(x) = x^3 + x + 1$, the highest power of $x$ is 3 (length of divisor is $r + 1 = 4$ bits). Thus, exactly $r = 3$ zeros are appended to the data stream.",
    "companyTags": [
      "Qualcomm",
      "Cisco",
      "Amazon"
    ],
    "company_tags": [
      "Qualcomm",
      "Cisco",
      "Amazon"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 10,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-11",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the maximum theoretical channel utilization (efficiency) of Pure ALOHA versus Slotted ALOHA random access protocols?",
    "options": [
      "Pure ALOHA $\\approx 18.4\\%$ ($1/2e$), Slotted ALOHA $\\approx 36.8\\%$ ($1/e$)",
      "Pure ALOHA $\\approx 50\\%$, Slotted ALOHA $\\approx 100\\%$",
      "Pure ALOHA $\\approx 36.8\\%$, Slotted ALOHA $\\approx 18.4\\%$",
      "Both achieve a maximum efficiency of 50%."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "- Pure ALOHA has a vulnerable collision window of $2 \\times T_{fr}$, giving maximum throughput $S = G \\cdot e^{-2G}$. For $G = 0.5$, $S_{\\max} = 1/(2e) \\approx 0.184$ (18.4%).\n- Slotted ALOHA restricts transmissions to discrete time slots, halving the vulnerable period to $T_{fr}$. Throughput $S = G \\cdot e^{-G}$, peaking at $G = 1$ with $S_{\\max} = 1/e \\approx 0.368$ (36.8%).",
    "companyTags": [
      "TCS Digital",
      "Infosys SP",
      "Wipro"
    ],
    "company_tags": [
      "TCS Digital",
      "Infosys SP",
      "Wipro"
    ],
    "difficulty": "BASIC",
    "sort_order": 11,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-12",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "In an Ethernet network operating at bandwidth $B = 100\\text{ Mbps}$ with a maximum propagation delay $T_p = 25.6\\text{ microseconds}$, what is the minimum frame size required for reliable CSMA/CD collision detection?",
    "options": [
      "64 bytes (512 bits)",
      "640 bytes (5120 bits)",
      "1500 bytes",
      "32 bytes"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "To detect collisions before transmission finishes in CSMA/CD, transmission time must be at least twice the one-way propagation delay: $T_t \\ge 2 \\cdot T_p$.\n$\\frac{L_{\\min}}{B} \\ge 2 \\cdot T_p \\implies L_{\\min} \\ge 2 \\cdot T_p \\cdot B$\n$L_{\\min} = 2 \\times (25.6 \\times 10^{-6}\\text{ s}) \\times (100 \\times 10^6\\text{ bps}) = 5120\\text{ bits} = 640\\text{ bytes}$.",
    "companyTags": [
      "Google",
      "Cisco",
      "Amazon"
    ],
    "company_tags": [
      "Google",
      "Cisco",
      "Amazon"
    ],
    "difficulty": "HARD",
    "sort_order": 12,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-13",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Why does Wi-Fi (IEEE 802.11) use CSMA/CA (Collision Avoidance) instead of CSMA/CD (Collision Detection)?",
    "options": [
      "In wireless communication, a station's own high-power transmission drowns out any incoming collision signal, making collision detection during transmission physically impractical (half-duplex RF transceiver limitation).",
      "Wi-Fi signals travel at the speed of sound rather than speed of light.",
      "CSMA/CD is patented exclusively by Microsoft.",
      "Collisions are physically impossible in radio frequency spectrums."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In wireless RF transmission, the transmitted signal power is orders of magnitude stronger than received signals from distant nodes. A wireless card cannot listen to the channel while transmitting because its own signal saturates the receiver. Hence, wireless networks must avoid collisions proactively using CSMA/CA with RTS/CTS handshakes.",
    "companyTags": [
      "Qualcomm",
      "Cisco",
      "Broadcom"
    ],
    "company_tags": [
      "Qualcomm",
      "Cisco",
      "Broadcom"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 13,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-14",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "How does the RTS/CTS (Request to Send / Clear to Send) mechanism in IEEE 802.11 solve the 'Hidden Terminal Problem'?",
    "options": [
      "The Access Point broadcasts a CTS containing a Network Allocation Vector (NAV) duration, alerting all hidden terminals within the AP's range to defer transmissions for that duration.",
      "By boosting wireless antenna transmission power to infinity.",
      "By converting radio signals into infrared light.",
      "By forcing all nodes to connect using Ethernet cables."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "If node A and node C cannot hear each other but both can communicate with access point B, both might transmit simultaneously. With RTS/CTS: A sends an RTS to B. B replies with a CTS broadcast to all nodes in its range (including C). Hearing the CTS, C sets its NAV timer and remains silent while A transmits to B.",
    "companyTags": [
      "Cisco",
      "Qualcomm",
      "Amazon"
    ],
    "company_tags": [
      "Cisco",
      "Qualcomm",
      "Amazon"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 14,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-15",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "In the binary exponential backoff algorithm of Ethernet CSMA/CD, what is the range of backoff slots chosen after the 3rd collision ($k = 3$)?",
    "options": [
      "$[0, 3]$",
      "$[0, 7]$",
      "$[0, 8]$",
      "$[0, 15]$"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "After the $k$-th collision, the station picks a random number of slot times $r$ uniformly distributed in the interval $[0, 2^k - 1]$. For $k = 3$, $2^3 - 1 = 8 - 1 = 7$. Thus, $r \\in [0, 7]$ (8 possible integer slot choices).",
    "companyTags": [
      "Infosys",
      "TCS Digital",
      "Accenture"
    ],
    "company_tags": [
      "Infosys",
      "TCS Digital",
      "Accenture"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 15,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-16",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "For the IPv4 network address `192.168.10.0/27`, what is the Subnet Mask, the Broadcast Address, and the number of usable host IP addresses?",
    "options": [
      "Mask: 255.255.255.224, Broadcast: 192.168.10.31, Usable Hosts: 30",
      "Mask: 255.255.255.240, Broadcast: 192.168.10.15, Usable Hosts: 14",
      "Mask: 255.255.255.192, Broadcast: 192.168.10.63, Usable Hosts: 62",
      "Mask: 255.255.255.224, Broadcast: 192.168.10.32, Usable Hosts: 32"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In `/27` subnetting:\n- Host bits = $32 - 27 = 5$ bits.\n- Total IP addresses per subnet = $2^5 = 32$.\n- Usable host addresses = $2^5 - 2 = 30$ (subtracting Network ID and Broadcast).\n- Subnet Mask: $24\\text{ ones} + 3\\text{ ones} = 255.255.255.(128 + 64 + 32) = 255.255.255.224$.\n- Subnet range: `192.168.10.0` to `192.168.10.31`. Broadcast address = `192.168.10.31`.",
    "companyTags": [
      "TCS Digital",
      "Amazon",
      "Infosys SP"
    ],
    "company_tags": [
      "TCS Digital",
      "Amazon",
      "Infosys SP"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 16,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-17",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "An IPv4 datagram of total size 4000 bytes (including 20-byte IP header) arrives at a router whose outgoing link has an MTU of 1500 bytes. What are the Data Sizes, Fragment Offsets, and More Fragments (MF) flags for the fragments?",
    "options": [
      "Frag 1: 1480 bytes data, Offset = 0, MF = 1; Frag 2: 1480 bytes data, Offset = 185, MF = 1; Frag 3: 1020 bytes data, Offset = 370, MF = 0",
      "Frag 1: 1500 bytes, Offset = 0, MF = 1; Frag 2: 1500 bytes, Offset = 1500, MF = 1; Frag 3: 1000 bytes, Offset = 3000, MF = 0",
      "Frag 1: 1480 bytes data, Offset = 0, MF = 1; Frag 2: 1480 bytes data, Offset = 1480, MF = 1; Frag 3: 1020 bytes data, Offset = 2960, MF = 0",
      "Frag 1: 1500 bytes, Offset = 0, MF = 0"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Total payload = $4000 - 20 = 3980$ bytes. MTU = 1500 bytes, so max payload per fragment = $1500 - 20 = 1480$ bytes (which is divisible by 8).\n- Frag 1: 1480 bytes data. Offset = $0 / 8 = 0$. MF = 1.\n- Frag 2: 1480 bytes data. Offset = $1480 / 8 = 185$. MF = 1.\n- Frag 3: Remaining payload = $3980 - 2960 = 1020$ bytes. Offset = $2960 / 8 = 370$. MF = 0 (last fragment).",
    "companyTags": [
      "Cisco",
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "company_tags": [
      "Cisco",
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "difficulty": "HARD",
    "sort_order": 17,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-18",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What happens when an intermediate router receives an IPv4 packet whose Time to Live (TTL) field reaches zero after decrementing?",
    "options": [
      "The router forwards the packet to the default gateway.",
      "The router drops the packet and sends an ICMP 'Time Exceeded' (Type 11, Code 0) error message back to the source IP address.",
      "The router increments TTL to 64 and retries.",
      "The router converts the packet into an IPv6 datagram."
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "TTL prevents packets from circulating indefinitely in routing loops. Every router decrements TTL by at least 1. When TTL reaches 0, the router discards the packet and transmits an ICMP Type 11 (Time Exceeded) message back to the sender. The `traceroute` utility leverages this exact behavior to map network paths.",
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
    "sort_order": 18,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-19",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Which of the following architectural changes was introduced in IPv6 to accelerate router packet forwarding speed compared to IPv4?",
    "options": [
      "Removal of the Header Checksum and elimination of intermediate router packet fragmentation (fragmentation is handled exclusively by the source host).",
      "Adopting variable-length headers without fixed sizes.",
      "Adding hop-by-hop retransmission at every router.",
      "Reducing IP address size to 16 bits."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In IPv6, the base header is fixed at 40 bytes. Two major changes speed up router forwarding:\n1. No header checksum: Since L2 (Ethernet CRC) and L4 (TCP/UDP checksum) already check errors, removing the L3 checksum avoids routers recalculating it at every hop after decrementing Hop Limit.\n2. Routers do not fragment: If a packet exceeds path MTU, it is dropped with an ICMPv6 Packet Too Big message; Path MTU Discovery (PMTUD) ensures the sender fragments.",
    "companyTags": [
      "Google",
      "Cisco",
      "Microsoft"
    ],
    "company_tags": [
      "Google",
      "Cisco",
      "Microsoft"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 19,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-20",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "Which of the following IPv4 address blocks is designated by RFC 1918 as non-routable Private IP Address Space?",
    "options": [
      "10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16",
      "127.0.0.0/8 and 169.254.0.0/16",
      "192.0.2.0/24 and 198.51.100.0/24",
      "224.0.0.0/4 and 240.0.0.0/4"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "RFC 1918 defines private IP address ranges reserved for internal private local networks and not routable on the public Internet:\n- 10.0.0.0 to 10.255.255.255 (10.0.0.0/8)\n- 172.16.0.0 to 172.31.255.255 (172.16.0.0/12)\n- 192.168.0.0 to 192.168.255.255 (192.168.0.0/16).",
    "companyTags": [
      "TCS",
      "Accenture",
      "Infosys"
    ],
    "company_tags": [
      "TCS",
      "Accenture",
      "Infosys"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 20,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-21",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What algorithm does Open Shortest Path First (OSPF) use, and what type of routing protocol is it?",
    "options": [
      "Dijkstra's Algorithm; Link-State Routing Protocol",
      "Bellman-Ford Algorithm; Distance-Vector Routing Protocol",
      "Floyd-Warshall Algorithm; Path-Vector Routing Protocol",
      "Prim's Algorithm; Exterior Gateway Protocol"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "OSPF is an interior gateway Link-State routing protocol. Every router floods Link State Advertisements (LSAs) so every router possesses a complete topological map of the entire network. Each router then independently executes Dijkstra's Shortest Path First algorithm to build its forwarding table.",
    "companyTags": [
      "Cisco",
      "Juniper",
      "TCS Digital"
    ],
    "company_tags": [
      "Cisco",
      "Juniper",
      "TCS Digital"
    ],
    "difficulty": "BASIC",
    "sort_order": 21,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-22",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What problem is inherent in Distance-Vector routing protocols (like RIP) due to slow convergence after a link failure, and how is it partially mitigated?",
    "options": [
      "Count-to-Infinity problem; mitigated by Split Horizon with Poison Reverse and defining infinity as 16 hops.",
      "Buffer overflow; mitigated by TCP sliding windows.",
      "Packet sniffing; mitigated by AES encryption.",
      "Subnet exhaustion; mitigated by DHCP."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In Distance-Vector protocols, when a link fails, neighboring nodes may exchange outdated distance vectors, slowly incrementing metric counts in a loop (the 'Count-to-Infinity' problem). RIP mitigates this by capping infinity at 16 hops and employing 'Split Horizon' (never advertise a route back out of the interface through which it was learned).",
    "companyTags": [
      "Amazon",
      "Cisco",
      "Oracle"
    ],
    "company_tags": [
      "Amazon",
      "Cisco",
      "Oracle"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 22,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-23",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "How does the Address Resolution Protocol (ARP) operate when Host A wants to resolve the MAC address of Host B on the same local subnet?",
    "options": [
      "ARP Request is sent as a Broadcast (FF:FF:FF:FF:FF:FF); ARP Reply is sent as a Unicast back to Host A.",
      "Both ARP Request and ARP Reply are sent as Broadcasts.",
      "ARP Request is Unicast; ARP Reply is Multicast.",
      "ARP queries a centralized DNS server on port 53."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "When Host A needs the MAC address for IP `B`: it broadcasts an ARP Request (`Who has IP B? Tell A`) to all stations on the L2 segment (`FF:FF:FF:FF:FF:FF`). All stations examine it; only Host B matches the target IP and responds with a direct Unicast ARP Reply containing its physical MAC address.",
    "companyTags": [
      "TCS Digital",
      "Infosys SP",
      "Cognizant"
    ],
    "company_tags": [
      "TCS Digital",
      "Infosys SP",
      "Cognizant"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 23,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-24",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Which protocol serves as the de facto routing backbone of the global Internet between different Autonomous Systems (inter-domain routing)?",
    "options": [
      "Border Gateway Protocol (BGP-4)",
      "Routing Information Protocol (RIP)",
      "Open Shortest Path First (OSPF)",
      "Intermediate System to Intermediate System (IS-IS)"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "BGP (Border Gateway Protocol) is the standardized Exterior Gateway Protocol (EGP) designed to exchange routing and reachability information among Autonomous Systems (ASes) across the global Internet. It is a Path-Vector protocol that operates over TCP (port 179) and supports policy-based routing.",
    "companyTags": [
      "Google",
      "Cloudflare",
      "Amazon",
      "Cisco"
    ],
    "company_tags": [
      "Google",
      "Cloudflare",
      "Amazon",
      "Cisco"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 24,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-25",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the key functional difference between traditional Network Address Translation (NAT / 1-to-1 NAT) and Port Address Translation (PAT / NAPT)?",
    "options": [
      "Basic NAT maps one private IP to one public IP (requiring a pool of public IPs); PAT maps thousands of internal private IP addresses to a single shared public IP by multiplexing unique source Layer 4 port numbers.",
      "PAT operates only on UDP traffic, while NAT is for TCP.",
      "NAT modifies MAC addresses; PAT modifies IP addresses.",
      "PAT requires fiber optic hardware."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Basic NAT maps each private IP to a dedicated public IP from a pool. PAT (Port Address Translation, also called NAT overload) allows an entire home or corporate network with thousands of private devices to share a single public IP address by tracking connections using dynamic source port mappings in a NAT translation table.",
    "companyTags": [
      "Amazon",
      "Microsoft",
      "Goldman Sachs"
    ],
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Goldman Sachs"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 25,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-26",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the minimum header size of a standard TCP segment versus a standard UDP datagram?",
    "options": [
      "TCP header is minimum 20 bytes; UDP header is fixed at 8 bytes.",
      "TCP header is 16 bytes; UDP header is 4 bytes.",
      "TCP header is 32 bytes; UDP header is 16 bytes.",
      "Both protocols have identical 20-byte headers."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "- TCP header: 20 bytes minimum (can expand up to 60 bytes with optional header fields like MSS, Window Scale, SACK, Timestamps).\n- UDP header: Exactly 8 bytes fixed (Source Port [2B], Destination Port [2B], Length [2B], Checksum [2B]).",
    "companyTags": [
      "TCS Digital",
      "Infosys",
      "Wipro Turbo"
    ],
    "company_tags": [
      "TCS Digital",
      "Infosys",
      "Wipro Turbo"
    ],
    "difficulty": "BASIC",
    "sort_order": 26,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-27",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "Which of the following transport protocol pairings with standard application protocols and default port numbers is INCORRECT?",
    "options": [
      "HTTP: TCP port 80",
      "DNS: Primarily UDP port 53 (TCP for zone transfers / large responses)",
      "SSH: TCP port 22",
      "HTTPS: UDP port 443"
    ],
    "correctOptionIndex": 3,
    "correct_option_index": 3,
    "explanation": "HTTPS operates over TCP port 443 (securing HTTP via TLS/SSL). HTTP/3 (QUIC) uses UDP port 443, but standard HTTPS in network theory is universally classified as TCP port 443. All other pairs (HTTP:80, DNS:53, SSH:22) are standard.",
    "companyTags": [
      "Cognizant GenC Next",
      "Accenture",
      "TCS"
    ],
    "company_tags": [
      "Cognizant GenC Next",
      "Accenture",
      "TCS"
    ],
    "difficulty": "BASIC",
    "sort_order": 27,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-28",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "Host A sends a TCP segment with Sequence Number = 1000 carrying 500 bytes of user payload data. Assuming no packet loss, what will be the Acknowledgment Number sent back by Host B?",
    "options": [
      "1000",
      "1500",
      "1501",
      "500"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "TCP sequence numbers are byte-oriented. The segment carries bytes 1000 through 1499 ($1000 + 500 - 1 = 1499$). In TCP cumulative acknowledgment, the ACK number indicates the *next byte expected* by the receiver. Thus, the receiver sends $\\text{ACK} = 1500$.",
    "companyTags": [
      "Amazon",
      "Goldman Sachs",
      "Infosys SP"
    ],
    "company_tags": [
      "Amazon",
      "Goldman Sachs",
      "Infosys SP"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 28,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-29",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Why is UDP preferred over TCP for real-time multiplayer gaming, live video streaming (VoIP), and DNS lookups?",
    "options": [
      "UDP has no connection establishment overhead (zero-RTT start), no retransmission delays (head-of-line blocking elimination), and lower protocol header overhead (8 bytes vs 20+ bytes).",
      "UDP guarantees 100% packet delivery without error.",
      "UDP automatically compresses video frames using hardware acceleration.",
      "UDP operates at the Physical layer directly."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "TCP's guaranteed reliability comes with head-of-line blocking: if a packet drops, all subsequent received packets wait until the lost packet is retransmitted. In live audio/video or gaming, a late packet is useless; it is better to drop it and render the latest frame immediately.",
    "companyTags": [
      "Amazon",
      "Google",
      "Adobe"
    ],
    "company_tags": [
      "Amazon",
      "Google",
      "Adobe"
    ],
    "difficulty": "BASIC",
    "sort_order": 29,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-30",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "On an Ethernet link with MTU = 1500 bytes, what is the maximum TCP Maximum Segment Size (MSS) for standard IPv4 traffic without options?",
    "options": [
      "1500 bytes",
      "1460 bytes",
      "1480 bytes",
      "1440 bytes"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "MSS is the maximum data payload a TCP segment can carry without fragmentation:\n$\\text{MSS} = \\text{MTU} - \\text{IP Header Size} - \\text{TCP Header Size}$\nStandard IPv4 header = 20 bytes; standard TCP header = 20 bytes.\n$\\text{MSS} = 1500 - 20 - 20 = 1460\\text{ bytes}$.",
    "companyTags": [
      "Cisco",
      "Qualcomm",
      "Intel"
    ],
    "company_tags": [
      "Cisco",
      "Qualcomm",
      "Intel"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 30,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-31",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the exact sequence of TCP flag exchanges during the standard Three-Way Handshake connection establishment?",
    "options": [
      "Client -> Server: SYN; Server -> Client: SYN + ACK; Client -> Server: ACK",
      "Client -> Server: ACK; Server -> Client: SYN; Client -> Server: ACK",
      "Client -> Server: SYN; Server -> Client: ACK; Client -> Server: FIN",
      "Client -> Server: CONNECT; Server -> Client: ACCEPT; Client -> Server: OK"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "TCP 3-way handshake:\n1. Client sends `SYN` (specifying initial sequence number $ISN_c$).\n2. Server responds with `SYN-ACK` (acknowledging client with $ACK = ISN_c + 1$ and specifying its own $ISN_s$).\n3. Client sends `ACK` ($ACK = ISN_s + 1$). Both directions are now synchronized and established.",
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
    "sort_order": 31,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-32",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Why does a TCP connection endpoint enter the `TIME_WAIT` state for a duration of $2 \\times \\text{MSL}$ (Maximum Segment Lifetime) after sending its final ACK during connection teardown?",
    "options": [
      "To ensure that any delayed, duplicated segments lingering in the network from the old connection die out completely, and to reliably retransmit the final ACK if it was dropped so the peer can close cleanly.",
      "To allow the CPU to cool down after high throughput.",
      "To allow the user to cancel the disconnection.",
      "To re-download the operating system kernel."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "`TIME_WAIT` (typically 1 to 2 minutes) serves two vital purposes:\n1. Reliability: If the active closer's final ACK is lost, the peer retransmits its FIN. If the closer closed immediately, it would respond with an RST error.\n2. Quiescence: Guarantees that any stray duplicated packets floating in routing loops expire, preventing them from corrupting a future connection reusing the same port pair.",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Goldman Sachs"
    ],
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Goldman Sachs"
    ],
    "difficulty": "HARD",
    "sort_order": 32,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-33",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "How do 'SYN Cookies' protect a server against TCP SYN Flood Denial of Service (DoS) attacks?",
    "options": [
      "The server avoids allocating memory for the half-open connection in the backlog queue, instead encoding connection state cryptographically into the Initial Sequence Number ($ISN$) of the SYN-ACK response.",
      "The server blocks all incoming IP addresses ending in .0.",
      "The server drops all incoming SYN packets unconditionally.",
      "The server stores browser cookies on the client's hard drive."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In a SYN flood attack, attackers send thousands of fake SYNs without completing the handshake, exhausting the server's SYN queue table memory. With SYN Cookies, the server allocates zero state in memory. It encodes the client's parameters into a cryptographic hash in its own SYN-ACK sequence number; only when the client returns the final ACK does the server reconstruct and allocate the socket.",
    "companyTags": [
      "Cloudflare",
      "Amazon",
      "Microsoft"
    ],
    "company_tags": [
      "Cloudflare",
      "Amazon",
      "Microsoft"
    ],
    "difficulty": "HARD",
    "sort_order": 33,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-34",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "What is the purpose of the TCP `RST` (Reset) flag in a TCP header?",
    "options": [
      "To abruptly abort an invalid connection, reject an incoming connection request on an un-listened closed port, or signal an unrecoverable protocol error.",
      "To pause transmission for 5 seconds.",
      "To reset the sliding window buffer size to zero.",
      "To request encryption key renewal."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "The `RST` flag is used for abrupt termination. If a client sends a SYN to a server port where no application is listening, the server kernel replies with an `RST` packet. It is also sent if an unexpected packet arrives for an already terminated socket or when an application forcefully aborts a connection.",
    "companyTags": [
      "Cisco",
      "Oracle",
      "Qualcomm"
    ],
    "company_tags": [
      "Cisco",
      "Oracle",
      "Qualcomm"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 34,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-35",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "How many total packets are exchanged during a graceful TCP teardown where both sides independently close their send directions?",
    "options": [
      "2 packets",
      "3 packets",
      "4 packets (FIN -> ACK, then FIN -> ACK)",
      "6 packets"
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "Graceful TCP termination takes 4 steps (two half-closures):\n1. Host A sends `FIN`.\n2. Host B responds with `ACK` (A can no longer send, but B can still send data).\n3. Host B finishes its remaining data and sends its own `FIN`.\n4. Host A responds with `ACK`.\nTotal: 4 packets.",
    "companyTags": [
      "Infosys SP",
      "TCS Digital",
      "Accenture"
    ],
    "company_tags": [
      "Infosys SP",
      "TCS Digital",
      "Accenture"
    ],
    "difficulty": "BASIC",
    "sort_order": 35,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-36",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "How does TCP determine the maximum amount of unacknowledged data the sender is allowed to transmit at any given instant?",
    "options": [
      "Effective Window = $\\min(\\text{Receiver Advertised Window } (\\text{rwnd}), \\text{Congestion Window } (\\text{cwnd}))$",
      "Effective Window = $\\text{rwnd} + \\text{cwnd}$",
      "Effective Window = $\\text{cwnd} - \\text{rwnd}$",
      "Effective Window is fixed at 64 KB permanently."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "TCP transmission rate is governed by two constraints:\n1. Flow Control: `rwnd` prevents overwhelming the receiver's application buffer.\n2. Congestion Control: `cwnd` prevents overwhelming intermediate network routers.\nThe sender transmits at $\\min(\\text{rwnd}, \\text{cwnd})$, satisfying both constraints simultaneously.",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "difficulty": "BASIC",
    "sort_order": 36,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-37",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "A TCP sender starts in Slow Start with $\\text{cwnd} = 1\\text{ MSS}$ and $\\text{ssthresh} = 8\\text{ MSS}$. Assuming every segment is acknowledged, what will be the value of $\\text{cwnd}$ after 4 Round Trip Times (RTTs)?",
    "options": [
      "8 MSS",
      "9 MSS",
      "16 MSS",
      "10 MSS"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "- RTT 0: cwnd = 1 MSS\n- RTT 1: cwnd doubles to 2 MSS\n- RTT 2: cwnd doubles to 4 MSS\n- RTT 3: cwnd doubles to 8 MSS (hits `ssthresh` = 8, transitioning to Congestion Avoidance)\n- RTT 4: In Congestion Avoidance (additive increase), cwnd increases linearly by 1 MSS: $8 + 1 = 9\\text{ MSS}$.",
    "companyTags": [
      "Amazon",
      "Goldman Sachs",
      "Cisco"
    ],
    "company_tags": [
      "Amazon",
      "Goldman Sachs",
      "Cisco"
    ],
    "difficulty": "HARD",
    "sort_order": 37,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-38",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What triggers the TCP 'Fast Retransmit' mechanism before the retransmission timeout (RTO) timer expires?",
    "options": [
      "Arrival of 3 duplicate ACKs for the same sequence number.",
      "Arrival of a single NACK packet from the receiver.",
      "Expiration of the Keepalive timer.",
      "ICMP Destination Unreachable message."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "When an out-of-order segment arrives at the receiver, it immediately sends a duplicate ACK for the last in-order byte. If the sender receives 3 duplicate ACKs (4 identical ACKs in total), it deduces that the segment was dropped in transit and retransmits it immediately without waiting for the slow RTO timer to expire.",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 38,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-39",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the purpose of Nagle's Algorithm in TCP implementations?",
    "options": [
      "To solve the Small-Packet Problem (Silly Window Syndrome at sender) by buffering small outgoing packets until a full MSS of data is gathered or until an outstanding ACK is received.",
      "To calculate moving average RTT using exponential smoothing.",
      "To prevent SYN flood attacks on web servers.",
      "To enforce random packet dropping under high queue loads."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Applications like Telnet send tiny 1-byte keystrokes, each incurring a 40-byte TCP/IP header (4100% overhead). Nagle's algorithm buffers tiny outgoing chunks and transmits them only when previous data has been acknowledged or when enough data accumulates to fill an entire MSS.",
    "companyTags": [
      "Cisco",
      "Qualcomm",
      "Oracle"
    ],
    "company_tags": [
      "Cisco",
      "Qualcomm",
      "Oracle"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 39,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-40",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What deadlock scenario does the TCP 'Persistence Timer' prevent?",
    "options": [
      "A deadlock where the receiver sends an update opening a zero-window (`rwnd = 0`), but the subsequent window-update packet (`rwnd > 0`) is lost, leaving both sender and receiver waiting for each other indefinitely.",
      "A deadlock between two routers running BGP.",
      "A deadlock caused by DNS cache poisoning.",
      "A deadlock during three-way handshaking."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "When the receiver advertises `rwnd = 0`, the sender halts. When buffer space frees up, the receiver sends a window update packet (e.g. `rwnd = 2000`). Because ACKs are not acknowledged, if this packet drops, the sender waits for the window update while the receiver waits for data. The Persistence Timer periodically sends a 1-byte 'probe' to elicit an updated window advertisement.",
    "companyTags": [
      "Amazon",
      "Microsoft",
      "Goldman Sachs"
    ],
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Goldman Sachs"
    ],
    "difficulty": "HARD",
    "sort_order": 40,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-41",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the key structural advancement of HTTP/2 over HTTP/1.1?",
    "options": [
      "HTTP/2 uses binary framing and multiplexes multiple concurrent bidirectional request/response streams over a single shared TCP connection, eliminating HTTP-level Head-of-Line blocking.",
      "HTTP/2 completely removes TLS encryption.",
      "HTTP/2 uses UDP port 80 instead of TCP.",
      "HTTP/2 requires all web servers to run on ARM processors."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In HTTP/1.1, browsers opened 6 parallel TCP connections per domain because requests over a single connection were strictly sequential (Head-of-Line blocking). HTTP/2 splits text messages into binary frames with stream IDs, allowing hundreds of requests and responses to interleave simultaneously across one persistent TCP connection.",
    "companyTags": [
      "Google",
      "Amazon",
      "Cloudflare",
      "Meta"
    ],
    "company_tags": [
      "Google",
      "Amazon",
      "Cloudflare",
      "Meta"
    ],
    "difficulty": "BASIC",
    "sort_order": 41,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-42",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "What is the distinction between HTTP Status Codes `401 Unauthorized` and `403 Forbidden`?",
    "options": [
      "`401` indicates authentication is required or credentials were invalid (unauthenticated); `403` indicates the client's identity is known, but the client is not permitted access to the requested resource (unauthorized / forbidden).",
      "`401` is a server error; `403` is a client error.",
      "`401` applies only to images; `403` applies to HTML pages.",
      "Both status codes are interchangeable synonyms."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "- `401 Unauthorized`: Semantically means 'Unauthenticated'. The request lacks valid authentication credentials (`Authorization` header missing or bad token).\n- `403 Forbidden`: The client IS authenticated, but lacks sufficient authorization / permissions to access the resource (e.g. standard user attempting to access `/admin/delete`).",
    "companyTags": [
      "TCS Digital",
      "Infosys SP",
      "Adobe"
    ],
    "company_tags": [
      "TCS Digital",
      "Infosys SP",
      "Adobe"
    ],
    "difficulty": "BASIC",
    "sort_order": 42,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-43",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the difference between a Recursive DNS Query and an Iterative DNS Query?",
    "options": [
      "In a Recursive query, the DNS client demands that the queried server resolve the full domain name itself (contacting root, TLD, and authoritative servers on the client's behalf); in an Iterative query, the queried server returns the best referral address it knows (e.g. 'I don't know, ask the .com TLD server').",
      "Recursive queries use TCP, while iterative queries use UDP.",
      "Iterative queries are used only for IPv6 lookups.",
      "Recursive queries do not support DNS caching."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "- Recursive query (typically from client PC to Local DNS Resolver): Client says 'give me the answer or fail'. The resolver does the legwork.\n- Iterative query (typically from Local Resolver to Root/TLD servers): Resolver says 'where is example.com?'. Root says 'I don't know, but here is the IP of the .com server'.",
    "companyTags": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 43,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-44",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Why does HTTP/3 switch from TCP to the QUIC protocol running over UDP?",
    "options": [
      "To eliminate Transport-layer Head-of-Line blocking (in HTTP/2, dropping one packet stalls ALL multiplexed streams because TCP guarantees byte ordering; in QUIC, dropped packets stall only their own stream) and achieve zero-RTT connection resumption.",
      "Because TCP is no longer supported on modern operating systems.",
      "To avoid using port numbers entirely.",
      "To prevent websites from using cookies."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "While HTTP/2 solved application-level HoL blocking, it suffered from TCP-level HoL blocking: because TCP sees one linear byte stream, a single dropped packet in stream A stops the delivery of packets in streams B and C. HTTP/3 builds on QUIC over UDP, managing independent streams natively at the transport layer.",
    "companyTags": [
      "Google",
      "Cloudflare",
      "Meta",
      "Amazon"
    ],
    "company_tags": [
      "Google",
      "Cloudflare",
      "Meta",
      "Amazon"
    ],
    "difficulty": "HARD",
    "sort_order": 44,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-45",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "What is the security implication of omitting the `HttpOnly` and `SameSite` flags from a session authentication cookie in HTTP headers?",
    "codeSnippet": "Set-Cookie: session_id=xyz789; Path=/;",
    "code_snippet": "Set-Cookie: session_id=xyz789; Path=/;",
    "options": [
      "Missing `HttpOnly` exposes the cookie to Cross-Site Scripting (XSS) theft via `document.cookie`; missing `SameSite` (or `SameSite=None`) leaves the application vulnerable to Cross-Site Request Forgery (CSRF).",
      "The browser refuses to send the cookie over the network.",
      "The web server crashes upon receiving the next request.",
      "The cookie becomes permanent and can never expire."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "- `HttpOnly`: Prevents client-side scripts (JavaScript) from accessing `document.cookie`, defeating token theft via Cross-Site Scripting (XSS).\n- `SameSite=Lax` or `Strict`: Prevents the browser from sending the cookie along with cross-site third-party requests, protecting against Cross-Site Request Forgery (CSRF).",
    "companyTags": [
      "Goldman Sachs",
      "Amazon",
      "Microsoft"
    ],
    "company_tags": [
      "Goldman Sachs",
      "Amazon",
      "Microsoft"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 45,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-46",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "How is a Digital Signature created by a sender to ensure both message integrity and non-repudiation?",
    "options": [
      "The sender hashes the message and encrypts the resulting hash with the sender's PRIVATE key; the recipient verifies it using the sender's PUBLIC key.",
      "The sender encrypts the entire message with the recipient's public key.",
      "The sender encrypts the hash with the recipient's private key.",
      "The sender writes their handwritten signature into the IP header."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Digital Signature mechanics:\n1. Sender hashes message $M$ to produce digest $H(M)$.\n2. Sender encrypts $H(M)$ using the sender's own Private Key. This is the signature.\n3. Recipient decrypts the signature using the sender's Public Key to retrieve $H(M)$, hashes the received message, and verifies that both hashes match.",
    "companyTags": [
      "TCS Digital",
      "Infosys SP",
      "Amazon"
    ],
    "company_tags": [
      "TCS Digital",
      "Infosys SP",
      "Amazon"
    ],
    "difficulty": "BASIC",
    "sort_order": 46,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-47",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the primary difference between a Stateless Packet-Filtering Firewall and a Stateful Inspection Firewall?",
    "options": [
      "A Stateless firewall inspects packets individually based only on static header fields (IP, port, protocol) in isolation; a Stateful firewall tracks the active state of TCP/UDP connections, permitting inbound return packets only if they belong to an established outbound session.",
      "Stateless firewalls run on Linux; Stateful firewalls run on Windows.",
      "Stateless firewalls operate at Layer 7; Stateful operates at Layer 2.",
      "Stateful firewalls do not inspect IP addresses."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "- Stateless Firewall: Inspects each packet as an independent entity (e.g. `allow if port == 80`). Vulnerable to IP spoofing and ACK-scan probing.\n- Stateful Inspection Firewall: Maintains a state table tracking 3-way handshakes, sequence numbers, and connection states. It automatically permits return traffic matching an active outbound connection while blocking unsolicited inbound probes.",
    "companyTags": [
      "Cisco",
      "Palo Alto Networks",
      "Fortinet"
    ],
    "company_tags": [
      "Cisco",
      "Palo Alto Networks",
      "Fortinet"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 47,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-48",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "How does the WebSocket protocol establish a persistent, full-duplex communication channel between a browser and a server?",
    "options": [
      "It initiates an initial HTTP GET request with `Upgrade: websocket` and `Connection: Upgrade` headers; upon receiving HTTP 101 Switching Protocols from the server, the underlying TCP connection switches to the binary WebSocket protocol.",
      "It establishes a raw UDP connection directly without HTTP.",
      "It creates two separate parallel HTTP POST streams.",
      "It downloads a Flash applet to bypass browser security."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "WebSocket handshake begins over standard HTTP/HTTPS (ports 80/443). The client sends an HTTP GET request containing `Upgrade: websocket` and `Connection: Upgrade`. The server responds with `HTTP/101 Switching Protocols`. From that moment, the HTTP protocol is abandoned and both sides communicate bidirectionally with tiny 2-byte framing overhead over the established TCP socket.",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 48,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-49",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "In a DNS Amplification Distributed Denial of Service (DDoS) attack, what two mechanisms allow an attacker with limited bandwidth to flood a victim?",
    "options": [
      "IP Address Spoofing (setting the source IP to the victim's IP) and Reflection/Amplification (sending small queries like `ANY` or `TXT` to open DNS resolvers that reply with massive multi-kilobyte responses directed at the victim).",
      "Modifying the victim's local hosts file.",
      "Brute-forcing root DNS passwords.",
      "Overclocking the victim's network card."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "DNS Amplification exploits UDP's connectionless nature. Because UDP does not verify source IPs, the attacker sends a 60-byte DNS request with the victim's spoofed source IP to publicly accessible open DNS resolvers. The resolver returns a large 3,000-byte DNS response (50x amplification factor) directly to the victim, overwhelming the victim's link.",
    "companyTags": [
      "Cloudflare",
      "Amazon",
      "Microsoft"
    ],
    "company_tags": [
      "Cloudflare",
      "Amazon",
      "Microsoft"
    ],
    "difficulty": "HARD",
    "sort_order": 49,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-cn-50",
    "topicId": "mcq-computer-networks",
    "topic_id": "mcq-computer-networks",
    "topic": "Computer Networks",
    "topic_name": "Computer Networks",
    "topicCategory": "NETWORKING",
    "topic_category": "NETWORKING",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the primary difference between IPSec Transport Mode and IPSec Tunnel Mode?",
    "options": [
      "Transport Mode encrypts only the IP payload while preserving the original IP header (used for host-to-host communication); Tunnel Mode encrypts the ENTIRE original IP packet (header + payload) and encapsulates it inside a new IP header (used for gateway-to-gateway VPNs).",
      "Transport mode runs only on TCP; Tunnel mode runs on UDP.",
      "Tunnel mode does not encrypt data.",
      "Transport mode is used exclusively on satellite links."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "- IPSec Transport Mode: Protects upper-layer protocols. The original IP header is preserved, and only the payload is encrypted/authenticated. Best for end-to-end host communication.\n- IPSec Tunnel Mode: The entire original IP packet (including internal source and destination IPs) is encrypted. A brand new outer IP header is attached pointing to the VPN gateway. Best for site-to-site VPN tunnels.",
    "companyTags": [
      "Cisco",
      "Palo Alto Networks",
      "Juniper"
    ],
    "company_tags": [
      "Cisco",
      "Palo Alto Networks",
      "Juniper"
    ],
    "difficulty": "HARD",
    "sort_order": 50,
    "is_hidden": false,
    "is_deleted": false
  }
];

export const DATA_STRUCTURES_MCQ_SEED: TechnicalMcq[] = [
  {
    "id": "mcq-dsa-1",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Which asymptotic notation formally describes an asymptotically tight bound that sandwiches a function $f(n)$ from both above and below by constants $c_1$ and $c_2$ for sufficiently large $n$?",
    "options": [
      "Big-O notation ($O$)",
      "Big-Omega notation ($\\Omega$)",
      "Big-Theta notation ($\\Theta$)",
      "Little-o notation ($o$)"
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "By definition:\n- $O(g(n))$ provides an asymptotic upper bound: $f(n) \\le c \\cdot g(n)$.\n- $\\Omega(g(n))$ provides an asymptotic lower bound: $f(n) \\ge c \\cdot g(n)$.\n- $\\Theta(g(n))$ provides an asymptotically tight bound: $c_1 \\cdot g(n) \\le f(n) \\le c_2 \\cdot g(n)$ for all $n \\ge n_0$.",
    "companyTags": [
      "TCS Digital",
      "Infosys",
      "Wipro Turbo"
    ],
    "company_tags": [
      "TCS Digital",
      "Infosys",
      "Wipro Turbo"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 1,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-2",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "Using the Master Theorem, what is the asymptotic time complexity of the recurrence relation $T(n) = 2T(n/2) + O(n)$ (characterizing MergeSort)?",
    "options": [
      "$\\Theta(n)$",
      "$\\Theta(n \\log n)$",
      "$\\Theta(n^2)$",
      "$\\Theta(\\log n)$"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "In $T(n) = aT(n/b) + f(n)$, we have $a = 2, b = 2, f(n) = n$.\nCompute $n^{\\log_b a} = n^{\\log_2 2} = n^1 = n$.\nSince $f(n) = \\Theta(n^{\\log_b a}) = \\Theta(n)$, Case 2 of the Master Theorem applies:\n$T(n) = \\Theta(n^{\\log_b a} \\log n) = \\Theta(n \\log n)$.",
    "companyTags": [
      "Amazon",
      "TCS Digital",
      "Infosys SP"
    ],
    "company_tags": [
      "Amazon",
      "TCS Digital",
      "Infosys SP"
    ],
    "difficulty": "BASIC",
    "sort_order": 2,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-3",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the amortized time complexity of an `append()` operation in a dynamic resizing array (like Java's `ArrayList` or C++'s `std::vector`) that doubles its capacity when full?",
    "options": [
      "$O(N)$",
      "$O(1)$",
      "$O(\\log N)$",
      "$O(N \\log N)$"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "While resizing an array of size $N$ takes $O(N)$ time to allocate memory and copy elements, doubling the capacity occurs only after $N$ cheap $O(1)$ insertions. Distributing the $O(N)$ copy cost across the $N$ preceding insertions yields an amortized time complexity of $\\frac{O(N)}{N} = O(1)$ per append.",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "difficulty": "BASIC",
    "sort_order": 3,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-4",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the solution to the recurrence relation $T(n) = T(n-1) + n$ with base condition $T(1) = 1$?",
    "options": [
      "$\\Theta(n)$",
      "$\\Theta(n \\log n)$",
      "$\\Theta(n^2)$",
      "$\\Theta(2^n)$"
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "Unrolling the recurrence:\n$T(n) = T(n-1) + n = T(n-2) + (n-1) + n = \\dots = 1 + 2 + 3 + \\dots + n = \\frac{n(n+1)}{2} = \\frac{n^2 + n}{2} = \\Theta(n^2)$.\nThis represents the worst-case time complexity of QuickSort (with sorted input and bad pivot selection).",
    "companyTags": [
      "Cognizant GenC Next",
      "Accenture",
      "TCS"
    ],
    "company_tags": [
      "Cognizant GenC Next",
      "Accenture",
      "TCS"
    ],
    "difficulty": "HARD",
    "sort_order": 4,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-5",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "Using Master Theorem, what is the time complexity of the recurrence relation $T(n) = 4T(n/2) + O(n)$?",
    "options": [
      "$\\Theta(n \\log n)$",
      "$\\Theta(n^2)$",
      "$\\Theta(n^{\\log_2 3})$",
      "$\\Theta(n^3)$"
    ],
    "correctOptionIndex": 1,
    "correct_option_index": 1,
    "explanation": "Here $a = 4, b = 2, f(n) = O(n)$.\nCompute $n^{\\log_b a} = n^{\\log_2 4} = n^2$.\nSince $f(n) = O(n^{2 - \\epsilon})$ for $\\epsilon = 1$, Case 1 of the Master Theorem applies, which yields:\n$T(n) = \\Theta(n^{\\log_b a}) = \\Theta(n^2)$.",
    "companyTags": [
      "Goldman Sachs",
      "Amazon",
      "Microsoft"
    ],
    "company_tags": [
      "Goldman Sachs",
      "Amazon",
      "Microsoft"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 5,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-6",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "In a 2D array $A[10][20]$ stored in Row-Major order starting at base address 1000 with 4 bytes per element, what is the memory address of element $A[3][5]$ (0-indexed)?",
    "options": [
      "1260",
      "1280",
      "1140",
      "1320"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In Row-Major ordering, elements are stored row by row:\n$\\text{Address}(A[i][j]) = \\text{Base} + (i \\times \\text{Cols} + j) \\times \\text{Element Size}$\nHere, $i = 3, j = 5, \\text{Cols} = 20, \\text{Size} = 4$:\n$\\text{Address} = 1000 + (3 \\times 20 + 5) \\times 4 = 1000 + (60 + 5) \\times 4 = 1000 + 65 \\times 4 = 1000 + 260 = 1260$.",
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
    "difficulty": "MEDIUM",
    "sort_order": 6,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-7",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the optimal time complexity to find the maximum in every sliding window of size $K$ across an array of length $N$ using a Monotonic Double-Ended Queue (deque)?",
    "options": [
      "$O(N \\log K)$",
      "$O(N \\times K)$",
      "$O(N)$",
      "$O(K)$"
    ],
    "correctOptionIndex": 2,
    "correct_option_index": 2,
    "explanation": "By maintaining a monotonic decreasing deque storing indices of elements in the current window, each index is pushed into the deque once and popped at most once across the entire traversal. Total deque operations sum to at most $2N$, achieving linear $O(N)$ time complexity.",
    "companyTags": [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    "company_tags": [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 7,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-8",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "In the Knuth-Morris-Pratt (KMP) string matching algorithm, what does the Longest Prefix Suffix (LPS) array represent for each prefix of the pattern?",
    "options": [
      "The length of the longest proper prefix that is also a suffix of the pattern substring ending at that index.",
      "The hash code of the pattern substring.",
      "The distance to the next matching character in the text.",
      "The frequency of vowels in the pattern."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "The $\\pi$ (LPS) table in KMP precomputes the length of the longest proper prefix of $P[0 \\dots i]$ that is also a suffix of $P[0 \\dots i]$. When a mismatch occurs between pattern and text, the LPS table informs the algorithm how many characters of the pattern can be skipped without re-examining matched text characters.",
    "companyTags": [
      "Adobe",
      "Google",
      "Amazon"
    ],
    "company_tags": [
      "Adobe",
      "Google",
      "Amazon"
    ],
    "difficulty": "HARD",
    "sort_order": 8,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-9",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the LPS (Longest Prefix Suffix) array for the pattern string `\"ABABCABAB\"`?",
    "options": [
      "[0, 0, 1, 2, 0, 1, 2, 3, 4]",
      "[0, 1, 2, 3, 0, 1, 2, 3, 4]",
      "[0, 0, 0, 1, 2, 3, 4, 5, 6]",
      "[0, 0, 1, 2, 1, 2, 3, 4, 5]"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Trace `\"ABABCABAB\"`:\n- 'A': 0\n- 'AB': 0\n- 'ABA': 1 ('A')\n- 'ABAB': 2 ('AB')\n- 'ABABC': 0 (no proper prefix is suffix)\n- 'ABABCA': 1 ('A')\n- 'ABABCAB': 2 ('AB')\n- 'ABABCABA': 3 ('ABA')\n- 'ABABCABAB': 4 ('ABAB')\nLPS array = `[0, 0, 1, 2, 0, 1, 2, 3, 4]`.",
    "companyTags": [
      "Amazon",
      "Goldman Sachs",
      "Microsoft"
    ],
    "company_tags": [
      "Amazon",
      "Goldman Sachs",
      "Microsoft"
    ],
    "difficulty": "HARD",
    "sort_order": 9,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-10",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Which algorithm partitions an array containing only 0s, 1s, and 2s in a single pass in $O(N)$ time and $O(1)$ extra space?",
    "options": [
      "Dutch National Flag Algorithm (using 3 pointers: low, mid, high)",
      "Kadane's Algorithm",
      "Floyd's Cycle Algorithm",
      "Boyer-Moore Voting Algorithm"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Edsger Dijkstra's Dutch National Flag algorithm partitions an array into three partitions using three pointers (`low`, `mid`, `high`) in a single $O(N)$ pass. 0s are swapped to `low`, 2s to `high`, while `mid` scans through, leaving 1s in the middle.",
    "companyTags": [
      "TCS Digital",
      "Infosys SP",
      "Accenture"
    ],
    "company_tags": [
      "TCS Digital",
      "Infosys SP",
      "Accenture"
    ],
    "difficulty": "BASIC",
    "sort_order": 10,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-11",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "In Floyd's Cycle-Finding Algorithm (Tortoise and Hare), why are the slow pointer (advancing 1 step) and fast pointer (advancing 2 steps) guaranteed to meet if a loop exists in a linked list?",
    "options": [
      "Because the relative distance between the fast and slow pointer decreases by exactly 1 node on each iteration inside the loop.",
      "Because the fast pointer resets to the head whenever it reaches the end.",
      "Because the length of the list is always an even number.",
      "Because the slow pointer stops moving once inside the loop."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Once both pointers enter the loop of length $C$, if the fast pointer is initially $d$ steps behind the slow pointer, on every step the fast pointer moves 2 while the slow moves 1. The distance between them shrinks by $(2 - 1) = 1$ step per loop iteration, guaranteeing they meet in at most $C$ steps.",
    "companyTags": [
      "Amazon",
      "Microsoft",
      "TCS Digital"
    ],
    "company_tags": [
      "Amazon",
      "Microsoft",
      "TCS Digital"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 11,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-12",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "CODE_COMPLETION",
    "question_type": "CODE_COMPLETION",
    "question": "To reverse a singly linked list iteratively in $O(1)$ space, how should the pointer rewiring inside the `while (curr != NULL)` loop be completed?",
    "codeSnippet": "Node* prev = NULL;\nNode* curr = head;\nNode* next = NULL;\nwhile (curr != NULL) {\n    next = curr->next;\n    /* __BLANK__ */\n    prev = curr;\n    curr = next;\n}\nreturn prev;",
    "code_snippet": "Node* prev = NULL;\nNode* curr = head;\nNode* next = NULL;\nwhile (curr != NULL) {\n    next = curr->next;\n    /* __BLANK__ */\n    prev = curr;\n    curr = next;\n}\nreturn prev;",
    "options": [
      "curr->next = prev;",
      "curr->next = next;",
      "prev->next = curr;",
      "head = curr;"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "To reverse the link direction of node `curr`, its `next` pointer must be redirected to point to the previously visited node (`curr->next = prev;`). After saving the original next node in `next`, reversing `curr->next` and shifting `prev` and `curr` forward completes the iterative reversal.",
    "companyTags": [
      "Infosys SP",
      "TCS",
      "Cognizant"
    ],
    "company_tags": [
      "Infosys SP",
      "TCS",
      "Cognizant"
    ],
    "difficulty": "BASIC",
    "sort_order": 12,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-13",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Why do array iterations typically exhibit significantly higher CPU execution throughput than traversing an identically sized linked list?",
    "options": [
      "Arrays allocate elements in contiguous memory blocks, providing high spatial locality of reference that maximizes CPU L1/L2 cache line hits; linked list nodes are scattered across the heap, incurring cache misses on pointer dereferences.",
      "Linked lists require dynamic compilation by the GPU.",
      "Arrays can only store 32-bit integers.",
      "Pointers cannot be read by 64-bit processors."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "CPUs fetch memory in 64-byte cache lines. In a contiguous array, fetching one element preloads adjacent elements into cache. In a linked list, each node is independently heap-allocated at random memory addresses; traversing `node = node->next` causes repeated CPU cache misses, forcing expensive RAM memory stalls.",
    "companyTags": [
      "Google",
      "Amazon",
      "Qualcomm"
    ],
    "company_tags": [
      "Google",
      "Amazon",
      "Qualcomm"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 13,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-14",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "In Floyd's cycle detection, slow and fast meet at node $M$. Distance from head to cycle start is $X$, and distance from cycle start to $M$ is $Y$. If cycle length is $C$, which formula proves that moving one pointer to head and stepping both at equal speed finds the cycle start?",
    "options": [
      "$X = k \\cdot C - Y$",
      "$X = Y + C$",
      "$X = 2Y$",
      "$X = C / 2$"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Distance traveled by slow = $X + Y$. Distance by fast = $X + Y + kC$.\nSince fast traveled twice the distance of slow:\n$2(X + Y) = X + Y + kC \\implies X + Y = kC \\implies X = kC - Y$.\nTherefore, the distance from head to cycle start ($X$) equals the distance from meeting point $M$ around the cycle to cycle start ($kC - Y$).",
    "companyTags": [
      "Goldman Sachs",
      "Amazon",
      "Microsoft"
    ],
    "company_tags": [
      "Goldman Sachs",
      "Amazon",
      "Microsoft"
    ],
    "difficulty": "HARD",
    "sort_order": 14,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-15",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the expected search, insertion, and deletion time complexity in a Skip List data structure with $N$ elements?",
    "options": [
      "$O(\\log N)$ expected",
      "$O(1)$ worst case",
      "$O(N)$ expected",
      "$O(N \\log N)$"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "A Skip List is a probabilistic alternative to balanced trees. It consists of multiple layered linked lists where higher layers act as express lanes skipping nodes. By choosing node heights using geometric coin-flips ($p = 1/2$), search, insert, and delete all run in expected $O(\\log N)$ time with $O(N)$ space.",
    "companyTags": [
      "Redis",
      "Amazon",
      "Google"
    ],
    "company_tags": [
      "Redis",
      "Amazon",
      "Google"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 15,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-16",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the Postfix (Reverse Polish Notation) equivalent of the infix expression: `A + B * C - D / E`?",
    "options": [
      "`A B C * + D E / -`",
      "`A B + C * D E / -`",
      "`A B C * D E / - +`",
      "`+ A * B C - / D E`"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Evaluating precedence:\n1. Multiplication and division have highest precedence: `(B * C) -> B C *` and `(D / E) -> D E /`.\n2. Left-to-right addition: `A + (B C *) -> A B C * +`.\n3. Subtraction: `(A B C * +) - (D E /) -> A B C * + D E / -`.",
    "companyTags": [
      "TCS",
      "Infosys",
      "Capgemini"
    ],
    "company_tags": [
      "TCS",
      "Infosys",
      "Capgemini"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 16,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-17",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the evaluated result of the postfix expression: `5 3 2 * + 8 2 / -`?",
    "options": [
      "7",
      "11",
      "15",
      "3"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Stack trace:\n- Push 5, Push 3, Push 2: Stack `[5, 3, 2]`\n- `*`: Pop 2 and 3, compute $3 \\times 2 = 6$. Push 6 -> Stack `[5, 6]`\n- `+`: Pop 6 and 5, compute $5 + 6 = 11$. Push 11 -> Stack `[11]`\n- Push 8, Push 2: Stack `[11, 8, 2]`\n- `/`: Pop 2 and 8, compute $8 / 2 = 4$. Push 4 -> Stack `[11, 4]`\n- `-`: Pop 4 and 11, compute $11 - 4 = 7$. Push 7 -> Final result = 7.",
    "companyTags": [
      "TCS Digital",
      "Accenture",
      "Wipro"
    ],
    "company_tags": [
      "TCS Digital",
      "Accenture",
      "Wipro"
    ],
    "difficulty": "BASIC",
    "sort_order": 17,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-18",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "How can a Queue be implemented using two Stacks ($S_1$ and $S_2$) such that enqueue is $O(1)$ and dequeue is amortized $O(1)$?",
    "options": [
      "Enqueue pushes to $S_1$. Dequeue pops from $S_2$; if $S_2$ is empty, all elements from $S_1$ are popped and pushed into $S_2$ (reversing their order), then popped from $S_2$.",
      "Enqueue pushes to both stacks simultaneously.",
      "Dequeue empties both stacks on every call.",
      "Two stacks cannot simulate a FIFO queue."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In the two-stack queue:\n- `enqueue(x)`: Simply push to $S_1$ ($O(1)$).\n- `dequeue()`: If $S_2$ has items, pop from $S_2$. If $S_2$ is empty, transfer all items from $S_1$ into $S_2$. Each element is pushed to $S_1$, transferred to $S_2$ once, and popped from $S_2$ once across its lifetime, yielding amortized $O(1)$ per operation.",
    "companyTags": [
      "Amazon",
      "Microsoft",
      "Goldman Sachs"
    ],
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Goldman Sachs"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 18,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-19",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What data structure is used to solve the 'Next Greater Element' (NGE) problem for an array of length $N$ in optimal $O(N)$ time?",
    "options": [
      "Monotonic Stack (maintaining elements in decreasing order)",
      "Max-Heap",
      "Segment Tree",
      "Circular Linked List"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "A monotonic stack stores array elements or indices in decreasing order. When iterating through the array, while the current element is greater than the stack's top, the current element is the NGE for that top element, popping it. Since each element is pushed and popped at most once, total time is strictly $O(N)$.",
    "companyTags": [
      "Amazon",
      "Google",
      "Adobe"
    ],
    "company_tags": [
      "Amazon",
      "Google",
      "Adobe"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 19,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-20",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "SYNTAX_RULE",
    "question_type": "SYNTAX_RULE",
    "question": "In a circular queue of fixed capacity $N$ implemented with indices `front` and `rear`, what is the condition indicating that the queue is full?",
    "options": [
      "`(rear + 1) % N == front`",
      "`rear == front`",
      "`rear == N - 1`",
      "`(front + 1) % N == rear`"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In a circular queue array of size $N$, one slot is typically kept vacant to differentiate between an empty queue (`front == rear == -1` or `front == rear`) and a full queue. The full condition occurs when incrementing `rear` circularly lands directly on `front`: `(rear + 1) % N == front`.",
    "companyTags": [
      "TCS",
      "Cognizant",
      "Infosys"
    ],
    "company_tags": [
      "TCS",
      "Cognizant",
      "Infosys"
    ],
    "difficulty": "BASIC",
    "sort_order": 20,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-21",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "In a Full (Strict) Binary Tree where every node has either 0 or 2 children, if there are $L$ leaf nodes and $I$ internal nodes, what is the exact mathematical relationship between $L$ and $I$?",
    "options": [
      "$L = I + 1$",
      "$L = 2I$",
      "$L = I - 1$",
      "$L = 2^I$"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In any strictly binary tree, the number of leaf nodes is always exactly one greater than the number of internal nodes ($L = I + 1$). Proof: Total edges $E = 2I = N - 1$. Total nodes $N = I + L$. Thus $2I = I + L - 1 \\implies L = I + 1$.",
    "companyTags": [
      "TCS Digital",
      "Infosys SP",
      "Wipro"
    ],
    "company_tags": [
      "TCS Digital",
      "Infosys SP",
      "Wipro"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 21,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-22",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "Which pair of tree traversals is SUFFICIENT to reconstruct any unique Binary Tree without ambiguity?",
    "options": [
      "Inorder and Preorder (OR Inorder and Postorder)",
      "Preorder and Postorder",
      "Level-order and Preorder",
      "Level-order and Postorder"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Reconstructing an arbitrary binary tree uniquely requires the Inorder traversal because Inorder splits the tree into left and right subtrees around the root. The root itself is identified from the first element of Preorder (or last element of Postorder). Preorder + Postorder cannot uniquely distinguish between a left-child-only tree and a right-child-only tree.",
    "companyTags": [
      "Amazon",
      "Microsoft",
      "Adobe"
    ],
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Adobe"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 22,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-23",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "Given Inorder: `[D, B, E, A, F, C]` and Preorder: `[A, B, D, E, C, F]`, what is the Postorder traversal of this binary tree?",
    "options": [
      "`[D, E, B, F, C, A]`",
      "`[D, B, E, F, C, A]`",
      "`[E, D, B, F, C, A]`",
      "`[D, E, F, B, C, A]`"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Tree reconstruction:\n- Preorder[0] = `A` (root).\n- Inorder splits around `A`: Left subtree = `{D, B, E}`, Right subtree = `{F, C}`.\n- In Left subtree, Preorder is `B, D, E` -> root is `B`. Inorder `{D}` left, `{E}` right.\n- In Right subtree, Preorder is `C, F` -> root is `C`. Inorder `{F}` left, `{}` right.\nPostorder (Left, Right, Root): `D, E, B, F, C, A`.",
    "companyTags": [
      "Amazon",
      "Goldman Sachs",
      "Infosys SP"
    ],
    "company_tags": [
      "Amazon",
      "Goldman Sachs",
      "Infosys SP"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 23,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-24",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "How does Morris Traversal achieve Inorder traversal of a binary tree in $O(N)$ time with strictly $O(1)$ auxiliary memory without recursion or an explicit stack?",
    "options": [
      "By constructing temporary threaded links from each node's inorder predecessor's right null pointer back to the current node, traversing the link, and then dismantling the thread.",
      "By hashing all pointers into an integer array.",
      "By converting the tree into a doubly linked list.",
      "By storing parent pointers inside node values."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Morris Traversal uses threaded binary tree concepts. For any node with a left child, it finds its inorder predecessor (rightmost node in left subtree). If `pred->right == NULL`, it sets `pred->right = curr` (temporary thread) and moves left. If `pred->right == curr`, it removes the thread, visits `curr`, and moves right. Space complexity is strictly $O(1)$.",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "difficulty": "HARD",
    "sort_order": 24,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-25",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the maximum number of nodes in a binary tree of height $h$ (where a tree with a single root node has height $h = 0$)?",
    "options": [
      "$2^{h+1} - 1$",
      "$2^h - 1$",
      "$2h + 1$",
      "$2^{h-1}$"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "At depth $i$, a binary tree has at most $2^i$ nodes. For height $h$ (levels 0 through $h$), the maximum nodes occur in a full binary tree:\n$\\sum_{i=0}^h 2^i = 2^0 + 2^1 + \\dots + 2^h = 2^{h+1} - 1$.\n(For $h = 0$, $2^1 - 1 = 1$; for $h = 2$, $2^3 - 1 = 7$).",
    "companyTags": [
      "TCS",
      "Infosys",
      "Cognizant"
    ],
    "company_tags": [
      "TCS",
      "Infosys",
      "Cognizant"
    ],
    "difficulty": "BASIC",
    "sort_order": 25,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-26",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What traversal of a Binary Search Tree (BST) visits all keys in strictly ascending sorted order?",
    "options": [
      "Inorder Traversal (Left -> Root -> Right)",
      "Preorder Traversal (Root -> Left -> Right)",
      "Postorder Traversal (Left -> Right -> Root)",
      "Level-Order Traversal"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "By BST invariant, all nodes in the left subtree have values smaller than the root, and all nodes in the right subtree have values greater than the root. Traversing Left -> Root -> Right (Inorder) inherently outputs the keys in ascending sorted order in $O(N)$ time.",
    "companyTags": [
      "TCS Digital",
      "Infosys",
      "Wipro Turbo"
    ],
    "company_tags": [
      "TCS Digital",
      "Infosys",
      "Wipro Turbo"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 26,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-27",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the permissible range of Balance Factors for any node in an AVL Tree?",
    "options": [
      "$\\text{Balance Factor} \\in \\{-1, 0, +1\\}$",
      "$\\text{Balance Factor} \\in \\{-2, 0, +2\\}$",
      "$\\text{Balance Factor} \\le 0$",
      "$\\text{Balance Factor} \\ge 1$"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "An AVL tree is a strictly self-balancing BST where the balance factor of every node, defined as $\\text{Height}(\\text{Left Subtree}) - \\text{Height}(\\text{Right Subtree})$, must be in $\\{-1, 0, +1\\}$. If an insertion or deletion causes the factor to become $\\pm 2$, rotations (LL, RR, LR, RL) restore balance.",
    "companyTags": [
      "Amazon",
      "Cisco",
      "Oracle"
    ],
    "company_tags": [
      "Amazon",
      "Cisco",
      "Oracle"
    ],
    "difficulty": "BASIC",
    "sort_order": 27,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-28",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "When deleting a node that has TWO children from a Binary Search Tree, with which node can it be replaced to preserve the BST invariant?",
    "options": [
      "Either its Inorder Successor (smallest node in right subtree) OR its Inorder Predecessor (largest node in left subtree)",
      "The root of the tree",
      "Any leaf node chosen at random",
      "The node's parent"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "To delete a node with 2 children without violating BST rules, replace its value with either:\n1. Inorder Successor: the minimum element in its right subtree (which has at most one child).\n2. Inorder Predecessor: the maximum element in its left subtree (which has at most one child).\nThen delete that successor/predecessor node trivially.",
    "companyTags": [
      "Microsoft",
      "Adobe",
      "Amazon"
    ],
    "company_tags": [
      "Microsoft",
      "Adobe",
      "Amazon"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 28,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-29",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Why do standard libraries (like C++ `std::map`, Java `TreeMap`, Linux kernel CFS) use Red-Black Trees instead of AVL Trees?",
    "options": [
      "Red-Black trees have slightly looser balance constraints than AVL trees, requiring at most 2 rotations on insertion and 3 rotations on deletion, making them significantly faster for write-heavy workloads.",
      "Red-Black trees take $O(1)$ worst-case search time.",
      "AVL trees cannot store string keys.",
      "Red-Black trees require zero extra memory bits per node."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "AVL trees are more rigidly balanced (height $\\le 1.44 \\log N$), giving slightly faster lookups. However, maintaining strict balance requires frequent rebalancing rotations on insertions and deletions. Red-Black trees (height $\\le 2 \\log N$) require at most 2 rotations on insert and 3 on delete, offering higher overall throughput for frequent updates.",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Goldman Sachs"
    ],
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Goldman Sachs"
    ],
    "difficulty": "HARD",
    "sort_order": 29,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-30",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "Starting with an empty AVL tree, keys are inserted in sequence: `10, 20, 30`. What rotation is performed, and which node becomes the root?",
    "options": [
      "Left Rotation (RR rotation); Node 20 becomes the new root",
      "Right Rotation (LL rotation); Node 10 becomes the root",
      "Left-Right Rotation (LR rotation); Node 30 becomes the root",
      "No rotation required"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Inserting 10, then 20 (right child of 10), then 30 (right child of 20):\nNode 10 has balance factor $0 - 2 = -2$. This is a Right-Right (RR) imbalance. A single Left Rotation around node 10 is performed: node 20 moves up to become the root, with 10 as its left child and 30 as its right child.",
    "companyTags": [
      "TCS Digital",
      "Infosys SP",
      "Cognizant GenC Next"
    ],
    "company_tags": [
      "TCS Digital",
      "Infosys SP",
      "Cognizant GenC Next"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 30,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-31",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the time complexity of the `buildHeap()` bottom-up heap construction algorithm to convert an arbitrary array of $N$ elements into a Binary Heap?",
    "options": [
      "$O(N)$",
      "$O(N \\log N)$",
      "$O(N^2)$",
      "$O(\\log N)$"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "While inserting elements one by one into an initially empty heap takes $O(N \\log N)$, building a heap bottom-up (`buildHeap`) by calling `heapify()` from index $\\lfloor N/2 \\rfloor$ down to 0 takes linear $O(N)$ time. The mathematical sum $\\sum_{h=0}^{\\log N} \\frac{h}{2^h} \\le 2$ converges to a constant.",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Goldman Sachs"
    ],
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Goldman Sachs"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 31,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-32",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "In a 0-indexed array representation of a complete Binary Heap, what are the formulas for the Left Child, Right Child, and Parent indices of a node at index $i$?",
    "options": [
      "Left: $2i + 1$, Right: $2i + 2$, Parent: $\\lfloor (i - 1) / 2 \\rfloor$",
      "Left: $2i$, Right: $2i + 1$, Parent: $\\lfloor i / 2 \\rfloor$",
      "Left: $i + 1$, Right: $i + 2$, Parent: $i - 1$",
      "Left: $2i - 1$, Right: $2i$, Parent: $\\lfloor i / 2 \\rfloor$"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In 0-indexed complete binary trees:\n- Left Child = $2i + 1$\n- Right Child = $2i + 2$\n- Parent = $\\lfloor (i - 1) / 2 \\rfloor$\n(In 1-indexed representations, Left is $2i$, Right is $2i + 1$, Parent is $\\lfloor i / 2 \\rfloor$).",
    "companyTags": [
      "TCS",
      "Infosys",
      "Accenture"
    ],
    "company_tags": [
      "TCS",
      "Infosys",
      "Accenture"
    ],
    "difficulty": "BASIC",
    "sort_order": 32,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-33",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "Given a Max-Heap array `[50, 30, 40, 10, 20, 35]`, what is the array after inserting key `45` and restoring the heap property?",
    "options": [
      "`[50, 30, 45, 10, 20, 35, 40]`",
      "`[50, 45, 40, 10, 20, 35, 30]`",
      "`[50, 30, 40, 45, 20, 35, 10]`",
      "`[50, 45, 40, 30, 20, 35, 10]`"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "1. Append 45 at end (index 6): `[50, 30, 40, 10, 20, 35, 45]`.\n2. Parent of index 6 is index $\\lfloor (6-1)/2 \\rfloor = 2$ (value 40).\n3. Since $45 > 40$, bubble up: swap 45 and 40 -> array becomes `[50, 30, 45, 10, 20, 35, 40]`.\n4. Parent of index 2 is index 0 (value 50). Since $45 < 50$, heap property is satisfied.",
    "companyTags": [
      "Amazon",
      "Goldman Sachs",
      "Infosys SP"
    ],
    "company_tags": [
      "Amazon",
      "Goldman Sachs",
      "Infosys SP"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 33,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-34",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the optimal data structure architecture to continuously find the Median in a streaming data sequence in $O(1)$ query time and $O(\\log N)$ insertion time?",
    "options": [
      "Two Heaps: A Max-Heap storing the lower half of numbers and a Min-Heap storing the upper half of numbers.",
      "A single circular singly linked list.",
      "A hash map with load factor 0.5.",
      "A stack and a queue connected back-to-back."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Using two heaps:\n- Max-Heap holds the smaller half of numbers (root is largest of the lower half).\n- Min-Heap holds the greater half of numbers (root is smallest of the upper half).\nKeeping both heaps balanced in size (differing by at most 1 element), the median is either the root of the larger heap or the average of both roots in $O(1)$ time.",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Uber"
    ],
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Uber"
    ],
    "difficulty": "HARD",
    "sort_order": 34,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-35",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Is HeapSort a stable sorting algorithm, and what is its worst-case auxiliary space complexity?",
    "options": [
      "HeapSort is NOT stable; auxiliary space complexity is $O(1)$.",
      "HeapSort is stable; auxiliary space complexity is $O(N)$.",
      "HeapSort is stable; auxiliary space complexity is $O(1)$.",
      "HeapSort is NOT stable; auxiliary space complexity is $O(N \\log N)$."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "HeapSort sorts in-place using $O(1)$ extra memory by swapping the root (max element) with the last element of the array and heapifying down. Because heap operations swap elements across distant non-adjacent array indices, it does not preserve the relative order of identical elements, making it UNSTABLE.",
    "companyTags": [
      "TCS Digital",
      "Infosys",
      "Adobe"
    ],
    "company_tags": [
      "TCS Digital",
      "Infosys",
      "Adobe"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 35,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-36",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is 'Primary Clustering' in open addressing hash tables, and which collision resolution method is most prone to it?",
    "options": [
      "The tendency for occupied slots to form long continuous contiguous clusters, increasing average search time for subsequent insertions; most prone in Linear Probing ($h(k, i) = (h'(k) + i) \\pmod M$).",
      "Collisions occurring in separate chaining linked lists.",
      "When hash values overflow 32-bit registers.",
      "Clustering of keys in quadratic probing."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In Linear Probing, if a collision occurs at index $x$, the algorithm checks $x+1, x+2, \\dots$. Any key that hashes into any slot in a contiguous run increases the size of that run, creating long clusters of occupied slots (Primary Clustering) that degrade search performance towards $O(N)$.",
    "companyTags": [
      "TCS Digital",
      "Infosys SP",
      "Amazon"
    ],
    "company_tags": [
      "TCS Digital",
      "Infosys SP",
      "Amazon"
    ],
    "difficulty": "BASIC",
    "sort_order": 36,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-37",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "Insert keys `[12, 23, 34, 45]` into a hash table of size $M = 11$ using the hash function $h(k) = k \\pmod{11}$ and Linear Probing. At which index is key `45` placed?",
    "options": [
      "Index 1",
      "Index 2",
      "Index 3",
      "Index 4"
    ],
    "correctOptionIndex": 3,
    "correct_option_index": 3,
    "explanation": "- $12 \\pmod{11} = 1$ -> placed at index 1.\n- $23 \\pmod{11} = 1$ -> collision at 1; linear probes to index 2 (placed at 2).\n- $34 \\pmod{11} = 1$ -> collision at 1, 2; linear probes to index 3 (placed at 3).\n- $45 \\pmod{11} = 1$ -> collision at 1, 2, 3; linear probes to index 4 (placed at 4).",
    "companyTags": [
      "Amazon",
      "TCS",
      "Cognizant"
    ],
    "company_tags": [
      "Amazon",
      "TCS",
      "Cognizant"
    ],
    "difficulty": "BASIC",
    "sort_order": 37,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-38",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the Load Factor $\\alpha$ of a hash table with $N$ stored keys and $M$ slots, and why does Java's `HashMap` trigger a rehash when $\\alpha$ exceeds 0.75?",
    "options": [
      "$\\alpha = N / M$; 0.75 offers an optimal empirical tradeoff between minimizing time-wasting hash collisions and minimizing wasted memory space.",
      "$\\alpha = M / N$; 0.75 prevents stack overflow.",
      "$\\alpha = N \\times M$; 0.75 is required by the garbage collector.",
      "$\\alpha$ measures the CPU cache temperature."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Load factor $\\alpha = N / M$ measures table fullness. If $\\alpha$ is too high (close to 1.0), hash collisions multiply, degrading search from $O(1)$ to $O(N)$. If $\\alpha$ is too low (e.g. 0.2), memory is wasted. A threshold of 0.75 balances $O(1)$ time with ~25% memory overhead.",
    "companyTags": [
      "Google",
      "Microsoft",
      "Oracle"
    ],
    "company_tags": [
      "Google",
      "Microsoft",
      "Oracle"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 38,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-39",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "How does Double Hashing avoid both Primary and Secondary Clustering in open addressing?",
    "options": [
      "By using a probe sequence $h(k, i) = (h_1(k) + i \\cdot h_2(k)) \\pmod M$, where the step size between probes depends dynamically on the key's value via second hash function $h_2(k)$.",
      "By maintaining two separate tables simultaneously.",
      "By squaring the probe offset.",
      "By doubling the array size on every insertion."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Double Hashing uses $h(k, i) = (h_1(k) + i \\cdot h_2(k)) \\pmod M$. Because the step interval $h_2(k)$ is calculated uniquely for each key, keys that collide on $h_1(k)$ probe along completely different step sizes, effectively eliminating both primary clustering (fixed step 1) and secondary clustering (fixed quadratic sequence).",
    "companyTags": [
      "Goldman Sachs",
      "Amazon",
      "Cisco"
    ],
    "company_tags": [
      "Goldman Sachs",
      "Amazon",
      "Cisco"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 39,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-40",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "In Java 8, what optimization was introduced to `HashMap` to prevent malicious Denial of Service attacks that exploit worst-case $O(N)$ hash collision degradation?",
    "options": [
      "When the number of items in a single bucket exceeds 8 (TREEIFY_THRESHOLD), the linked list is converted into a balanced Red-Black Tree, guaranteeing $O(\\log N)$ worst-case search.",
      "Hashing was replaced with binary search.",
      "All keys are encrypted using AES-256.",
      "Buckets are resized to hold only 1 element."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Attackers can generate inputs sharing identical hash codes to degrade hash map lookups to $O(N)$ linked-list scans (HashDoS attack). Java 8 transforms bucket linked lists into balanced Red-Black Trees (`TreeNode`) once a bucket contains 8 or more entries (and table capacity $\\ge 64$), bounding worst-case lookup to $O(\\log N)$.",
    "companyTags": [
      "Oracle",
      "Google",
      "Amazon"
    ],
    "company_tags": [
      "Oracle",
      "Google",
      "Amazon"
    ],
    "difficulty": "HARD",
    "sort_order": 40,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-41",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the time complexity of Breadth-First Search (BFS) and Depth-First Search (DFS) on a graph with $V$ vertices and $E$ edges represented using an Adjacency List?",
    "options": [
      "$O(V + E)$",
      "$O(V^2)$",
      "$O(V \\cdot E)$",
      "$O(E \\log V)$"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "With an Adjacency List, every vertex is enqueued/visited once ($O(V)$), and every edge's adjacency entry is examined once (for directed) or twice (for undirected) ($O(E)$). Thus, total time complexity for both BFS and DFS is $O(V + E)$. (With an Adjacency Matrix, it is $O(V^2)$).",
    "companyTags": [
      "TCS Digital",
      "Infosys",
      "Wipro Turbo"
    ],
    "company_tags": [
      "TCS Digital",
      "Infosys",
      "Wipro Turbo"
    ],
    "difficulty": "BASIC",
    "sort_order": 41,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-42",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Under what condition is a Topological Sort possible for a graph?",
    "options": [
      "If and only if the graph is a Directed Acyclic Graph (DAG).",
      "Only for complete undirected graphs.",
      "Only if the graph contains a Hamiltonian path.",
      "For any graph with non-negative edge weights."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "A Topological Sort is a linear ordering of vertices such that for every directed edge $u \\to v$, $u$ appears before $v$. If the graph has a cycle (e.g. $A \\to B \\to C \\to A$), no linear ordering can satisfy the precedence constraints. Therefore, topological sorting is defined strictly for Directed Acyclic Graphs (DAGs).",
    "companyTags": [
      "Amazon",
      "Microsoft",
      "Adobe"
    ],
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Adobe"
    ],
    "difficulty": "BASIC",
    "sort_order": 42,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-43",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "How does Kahn's algorithm for Topological Sorting detect whether a directed graph contains a cycle?",
    "options": [
      "If the count of vertices processed in the topological sort order is strictly LESS than the total number of vertices $V$ in the graph.",
      "If the queue size exceeds $V$.",
      "If the sum of in-degrees is negative.",
      "If any vertex has out-degree 0."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Kahn's algorithm initializes a queue with all vertices having in-degree = 0. When a vertex is popped, in-degrees of its neighbors are decremented. If the graph has a cycle, nodes in the cycle never reach in-degree = 0 and are never pushed to the queue. If `processedCount < V`, the graph contains a cycle.",
    "companyTags": [
      "Google",
      "Amazon",
      "Infosys SP"
    ],
    "company_tags": [
      "Google",
      "Amazon",
      "Infosys SP"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 43,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-44",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "In a DFS traversal of a directed graph, which edge type indicates the presence of a directed Cycle?",
    "options": [
      "Back Edge (pointing to an ancestor in the current DFS recursion stack)",
      "Forward Edge (pointing to a descendant already visited)",
      "Cross Edge (pointing to a node in a different DFS branch)",
      "Tree Edge"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In DFS classification of directed graphs:\n- Tree Edge: visits an undiscovered vertex.\n- Back Edge: connects a vertex to an ancestor currently on the active recursion call stack (Gray node in 3-coloring). A back edge proves the existence of a cycle.",
    "companyTags": [
      "Goldman Sachs",
      "Amazon",
      "Cisco"
    ],
    "company_tags": [
      "Goldman Sachs",
      "Amazon",
      "Cisco"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 44,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-45",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is the time complexity of Kosaraju's algorithm to find all Strongly Connected Components (SCCs) in a directed graph?",
    "options": [
      "$O(V + E)$",
      "$O(V^2)$",
      "$O(V \\cdot E)$",
      "$O(E \\log V)$"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Kosaraju's algorithm runs two standard DFS passes:\n1. First DFS on original graph $G$ to push vertices to a stack in order of finish times ($O(V + E)$).\n2. Transpose the graph $G^T$ ($O(V + E)$).\n3. Second DFS on $G^T$ popping nodes from stack to extract each SCC ($O(V + E)$).\nTotal time complexity is $O(V + E)$.",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "difficulty": "HARD",
    "sort_order": 45,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-46",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Why does Dijkstra's shortest path algorithm fail to produce correct results on graphs containing negative edge weights?",
    "options": [
      "Dijkstra's greedy choice assumes that once a vertex is extracted from the priority queue, its shortest distance is finalized and cannot be decreased by longer multi-edge paths with negative weights.",
      "Dijkstra cannot handle directed graphs.",
      "Negative weights cause integer overflow in C++.",
      "Priority queues cannot store negative values."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Dijkstra is a greedy algorithm that finalizes the shortest distance to the closest unvisited vertex, assuming path costs only monotonically increase. A negative edge encountered later could create a path to an already finalized vertex that is shorter, which Dijkstra never re-evaluates. Bellman-Ford must be used instead.",
    "companyTags": [
      "Amazon",
      "Google",
      "TCS Digital"
    ],
    "company_tags": [
      "Amazon",
      "Google",
      "TCS Digital"
    ],
    "difficulty": "BASIC",
    "sort_order": 46,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-47",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the time complexity of Kruskal's Minimum Spanning Tree (MST) algorithm using Disjoint Set Union (DSU) with Path Compression and Union by Rank?",
    "options": [
      "$O(E \\log E)$ or $O(E \\log V)$",
      "$O(V^2)$",
      "$O(V \\log V)$",
      "$O(E^2)$"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Kruskal's steps:\n1. Sort all $E$ edges by weight: $O(E \\log E) = O(E \\log V)$ (since $E \\le V^2$).\n2. For each edge, perform `find` and `union` operations with path compression and union by rank: $O(E \\cdot \\alpha(V))$, where $\\alpha$ is the nearly constant inverse Ackermann function.\nThe sorting step dominates, giving total time $O(E \\log V)$.",
    "companyTags": [
      "Microsoft",
      "Cisco",
      "Infosys SP"
    ],
    "company_tags": [
      "Microsoft",
      "Cisco",
      "Infosys SP"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 47,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-48",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Why is the classic 0/1 Knapsack dynamic programming algorithm classified as having 'Pseudo-Polynomial' time complexity?",
    "options": [
      "Because its time complexity $O(N \\cdot W)$ depends on the numeric value of the capacity $W$, which is exponential in terms of the bit-length of the input ($2^k$ for a $k$-bit number).",
      "Because it only works for prime numbers.",
      "Because it uses polynomial approximations for float numbers.",
      "Because it runs in $O(N^3)$ time."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "An algorithm is pseudo-polynomial if its runtime is polynomial in the *numeric value* of the input, but exponential in the *input length* (number of bits). For $W = 10^9$, $W$ requires only $\\approx 30$ bits of input storage, but the algorithm must perform $10^9$ operations, which is exponential ($2^{30}$) in input bit length.",
    "companyTags": [
      "Goldman Sachs",
      "Google",
      "Amazon"
    ],
    "company_tags": [
      "Goldman Sachs",
      "Google",
      "Amazon"
    ],
    "difficulty": "HARD",
    "sort_order": 48,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-49",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "How does the Bellman-Ford algorithm detect the presence of a Negative Weight Cycle reachable from the source vertex?",
    "options": [
      "After relaxing all $E$ edges $(V - 1)$ times, if ANY edge can STILL be relaxed on a $V$-th iteration, a negative weight cycle exists.",
      "If the sum of all edge weights is negative.",
      "If the priority queue becomes empty.",
      "If the source vertex distance becomes zero."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In any shortest path graph without negative cycles, a simple shortest path contains at most $V - 1$ edges. Relaxing all edges $V - 1$ times guarantees optimal shortest paths. If a $V$-th pass can still relax any edge ($dist[u] + weight < dist[v]$), it mathematically proves the presence of a negative cycle endlessly reducing distances.",
    "companyTags": [
      "Amazon",
      "Adobe",
      "Qualcomm"
    ],
    "company_tags": [
      "Amazon",
      "Adobe",
      "Qualcomm"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 49,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-dsa-50",
    "topicId": "mcq-data-structures",
    "topic_id": "mcq-data-structures",
    "topic": "Data Structures & Algorithms",
    "topic_name": "Data Structures & Algorithms",
    "topicCategory": "DATA_STRUCTURES",
    "topic_category": "DATA_STRUCTURES",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the length of the Longest Common Subsequence (LCS) between strings $S_1 = \\text{\"AGGTAB\"}$ and $S_2 = \\text{\"GXTXAYB\"}$?",
    "options": [
      "4 (`\"GTAB\"`)",
      "5",
      "3",
      "6"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Comparing subsequences:\n- Common characters in order: 'G', 'T', 'A', 'B'.\n- In $S_1$: A **G** **T** **A** **B**\n- In $S_2$: **G** X **T** X **A** Y **B**\nThe longest common subsequence is `\"GTAB\"` with length 4.",
    "companyTags": [
      "TCS Digital",
      "Infosys SP",
      "Amazon",
      "Microsoft"
    ],
    "company_tags": [
      "TCS Digital",
      "Infosys SP",
      "Amazon",
      "Microsoft"
    ],
    "difficulty": "BASIC",
    "sort_order": 50,
    "is_hidden": false,
    "is_deleted": false
  }
];

export const PSEUDO_CODE_MCQ_SEED: TechnicalMcq[] = [
  {
    "id": "mcq-pseudo-1",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of the following pseudo-code algorithm utilizing bitwise XOR and bit shifts?",
    "codeSnippet": "Integer a, b, c\nSet a = 5, b = 9\nSet c = (a ^ b) + (a & b)\nPrint c",
    "code_snippet": "Integer a, b, c\nSet a = 5, b = 9\nSet c = (a ^ b) + (a & b)\nPrint c",
    "options": [
      "13",
      "14",
      "12",
      "16"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Binary breakdown:\n- $a = 5 = (0101)_2$\n- $b = 9 = (1001)_2$\n- $a \\wedge b = (0101)_2 \\wedge (1001)_2 = (1100)_2 = 12$\n- $a \\& b = (0101)_2 \\& (1001)_2 = (0001)_2 = 1$\nThen $c = 12 + 1 = 13$.",
    "companyTags": [
      "Accenture",
      "Capgemini",
      "TCS Digital"
    ],
    "company_tags": [
      "Accenture",
      "Capgemini",
      "TCS Digital"
    ],
    "difficulty": "BASIC",
    "sort_order": 1,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-2",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What will be printed by the following bitwise manipulation pseudo-code?",
    "codeSnippet": "Integer x, y\nSet x = 18\nSet y = x & (x - 1)\nPrint y",
    "code_snippet": "Integer x, y\nSet x = 18\nSet y = x & (x - 1)\nPrint y",
    "options": [
      "16",
      "17",
      "0",
      "2"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "The operation $x \\& (x - 1)$ clears the lowest set bit of $x$ (Brian Kernighan's algorithm):\n$x = 18 = (10010)_2$\n$x - 1 = 17 = (10001)_2$\n$x \\& (x - 1) = (10010)_2 \\& (10001)_2 = (10000)_2 = 16$.",
    "companyTags": [
      "Accenture",
      "Cognizant GenC Next",
      "TCS Prime"
    ],
    "company_tags": [
      "Accenture",
      "Cognizant GenC Next",
      "TCS Prime"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 2,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-3",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the final value of variable `res` after executing this pseudo-code?",
    "codeSnippet": "Integer p, q, res\nSet p = 6, q = 3\nSet res = (p << 2) ^ (q >> 1)\nPrint res",
    "code_snippet": "Integer p, q, res\nSet p = 6, q = 3\nSet res = (p << 2) ^ (q >> 1)\nPrint res",
    "options": [
      "25",
      "24",
      "23",
      "27"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "- $p \\ll 2 = 6 \\times 2^2 = 6 \\times 4 = 24 = (11000)_2$.\n- $q \\gg 1 = 3 / 2 = 1 = (00001)_2$.\n- $24 \\oplus 1 = (11000)_2 \\oplus (00001)_2 = (11001)_2 = 25$.",
    "companyTags": [
      "Capgemini",
      "Infosys SP",
      "Wipro Turbo"
    ],
    "company_tags": [
      "Capgemini",
      "Infosys SP",
      "Wipro Turbo"
    ],
    "difficulty": "BASIC",
    "sort_order": 3,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-4",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of the following bitwise swap sequence without using a temporary variable?",
    "codeSnippet": "Integer a, b\nSet a = 12, b = 25\na = a ^ b\nb = a ^ b\na = a ^ b\nPrint a, b",
    "code_snippet": "Integer a, b\nSet a = 12, b = 25\na = a ^ b\nb = a ^ b\na = a ^ b\nPrint a, b",
    "options": [
      "25 12",
      "12 25",
      "37 13",
      "0 0"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "This is the classic XOR swap algorithm:\n1. $a_1 = a \\oplus b$\n2. $b_1 = a_1 \\oplus b = (a \\oplus b) \\oplus b = a = 12$\n3. $a_2 = a_1 \\oplus b_1 = (a \\oplus b) \\oplus a = b = 25$\nResult: $a = 25, b = 12$.",
    "companyTags": [
      "Accenture",
      "TCS Digital",
      "Cognizant"
    ],
    "company_tags": [
      "Accenture",
      "TCS Digital",
      "Cognizant"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 4,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-5",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is printed by the following bitwise negation pseudo-code in standard two's complement 32-bit arithmetic?",
    "codeSnippet": "Integer x\nSet x = 15\nSet x = ~x + 5\nPrint x",
    "code_snippet": "Integer x\nSet x = 15\nSet x = ~x + 5\nPrint x",
    "options": [
      "-11",
      "-10",
      "20",
      "-20"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In standard two's complement representation, bitwise NOT satisfies $\\sim x = -(x + 1)$.\nFor $x = 15$, $\\sim 15 = -(15 + 1) = -16$.\nThen $x = -16 + 5 = -11$.",
    "companyTags": [
      "Capgemini",
      "Accenture",
      "Infosys SP"
    ],
    "company_tags": [
      "Capgemini",
      "Accenture",
      "Infosys SP"
    ],
    "difficulty": "HARD",
    "sort_order": 5,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-6",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What will be the final value of `count` after executing the nested loop?",
    "codeSnippet": "Integer count, i, j\nSet count = 0\nfor i = 1 to 4\n    for j = 1 to i\n        count = count + (i * j)\n    end for\nend for\nPrint count",
    "code_snippet": "Integer count, i, j\nSet count = 0\nfor i = 1 to 4\n    for j = 1 to i\n        count = count + (i * j)\n    end for\nend for\nPrint count",
    "options": [
      "65",
      "55",
      "45",
      "30"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Tracing outer and inner loops:\n- $i = 1$: $j = 1 \\implies count = 1 \\times 1 = 1$\n- $i = 2$: $j = 1, 2 \\implies count = 1 + 2 \\times (1 + 2) = 1 + 6 = 7$\n- $i = 3$: $j = 1, 2, 3 \\implies count = 7 + 3 \\times (1 + 2 + 3) = 7 + 18 = 25$\n- $i = 4$: $j = 1, 2, 3, 4 \\implies count = 25 + 4 \\times (1 + 2 + 3 + 4) = 25 + 40 = 65$.",
    "companyTags": [
      "Accenture",
      "TCS Prime",
      "Capgemini"
    ],
    "company_tags": [
      "Accenture",
      "TCS Prime",
      "Capgemini"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 6,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-7",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of the following pseudo-code involving a while loop with variable step?",
    "codeSnippet": "Integer a, b\nSet a = 1, b = 20\nwhile (b > a)\n    a = a + 2\n    b = b - 3\nend while\nPrint a, b",
    "code_snippet": "Integer a, b\nSet a = 1, b = 20\nwhile (b > a)\n    a = a + 2\n    b = b - 3\nend while\nPrint a, b",
    "options": [
      "9 8",
      "7 11",
      "11 5",
      "9 11"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Trace while $b > a$:\n- Start: $a = 1, b = 20$\n- Iteration 1: $a = 1+2 = 3, b = 20-3 = 17$ ($17 > 3$, continue)\n- Iteration 2: $a = 3+2 = 5, b = 17-3 = 14$ ($14 > 5$, continue)\n- Iteration 3: $a = 5+2 = 7, b = 14-3 = 11$ ($11 > 7$, continue)\n- Iteration 4: $a = 7+2 = 9, b = 11-3 = 8$ ($8 > 9$ is FALSE, loop terminates)\nOutput: `9 8`.",
    "companyTags": [
      "Accenture",
      "Capgemini",
      "Cognizant"
    ],
    "company_tags": [
      "Accenture",
      "Capgemini",
      "Cognizant"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 7,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-8",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What will be the output of the following pseudo-code snippet containing a `break` statement?",
    "codeSnippet": "Integer sum, i, j\nSet sum = 0\nfor i = 1 to 3\n    for j = 1 to 3\n        if (j == 2)\n            break\n        end if\n        sum = sum + i + j\n    end for\nend for\nPrint sum",
    "code_snippet": "Integer sum, i, j\nSet sum = 0\nfor i = 1 to 3\n    for j = 1 to 3\n        if (j == 2)\n            break\n        end if\n        sum = sum + i + j\n    end for\nend for\nPrint sum",
    "options": [
      "9",
      "18",
      "12",
      "6"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "The inner loop runs for $j = 1$ to 3. When $j = 2$, `break` terminates the INNER loop immediately. Thus, only $j = 1$ executes for each $i$:\n- $i = 1, j = 1$: $sum = 0 + 1 + 1 = 2$\n- $i = 2, j = 1$: $sum = 2 + 2 + 1 = 5$\n- $i = 3, j = 1$: $sum = 5 + 3 + 1 = 9$\nFinal sum = 9.",
    "companyTags": [
      "Infosys SP",
      "Accenture",
      "TCS Digital"
    ],
    "company_tags": [
      "Infosys SP",
      "Accenture",
      "TCS Digital"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 8,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-9",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of the following pseudo-code featuring nested while loops and modulo operations?",
    "codeSnippet": "Integer m, n, ans\nSet m = 12, n = 5, ans = 0\nwhile (m > 0)\n    if (m % 2 != 0)\n        ans = ans + n\n    end if\n    m = m / 2\n    n = n * 2\nend while\nPrint ans",
    "code_snippet": "Integer m, n, ans\nSet m = 12, n = 5, ans = 0\nwhile (m > 0)\n    if (m % 2 != 0)\n        ans = ans + n\n    end if\n    m = m / 2\n    n = n * 2\nend while\nPrint ans",
    "options": [
      "60",
      "50",
      "40",
      "30"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "This implements Russian Peasant Multiplication ($m \\times n = 12 \\times 5 = 60$):\n- $m = 12$ (even): $m = 6, n = 10, ans = 0$\n- $m = 6$ (even): $m = 3, n = 20, ans = 0$\n- $m = 3$ (odd): $ans = 0 + 20 = 20, m = 1, n = 40$\n- $m = 1$ (odd): $ans = 20 + 40 = 60, m = 0, n = 80$\nLoop terminates. Output is 60.",
    "companyTags": [
      "Capgemini",
      "Accenture",
      "Goldman Sachs"
    ],
    "company_tags": [
      "Capgemini",
      "Accenture",
      "Goldman Sachs"
    ],
    "difficulty": "HARD",
    "sort_order": 9,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-10",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "FIND_ERROR",
    "question_type": "FIND_ERROR",
    "question": "Why does the following pseudo-code loop fail to terminate and result in an Infinite Loop?",
    "codeSnippet": "Integer i\nSet i = 1\nwhile (i != 10)\n    i = i + 2\nend while\nPrint i",
    "code_snippet": "Integer i\nSet i = 1\nwhile (i != 10)\n    i = i + 2\nend while\nPrint i",
    "options": [
      "`i` starts at 1 and increases by 2 each iteration (1, 3, 5, 7, 9, 11, 13, ...), forever skipping 10 because `i` is always an odd number.",
      "The `while` condition requires double parentheses.",
      "`i` is an unsigned byte that overflows.",
      "`Print` is written outside the loop."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "`i` takes values $1, 3, 5, 7, 9, 11, 13, \\dots$. Since all values generated are odd integers, the condition `i != 10` is perpetually true (it steps directly from 9 to 11 without ever equaling 10), triggering an infinite loop.",
    "companyTags": [
      "TCS",
      "Accenture",
      "Cognizant"
    ],
    "company_tags": [
      "TCS",
      "Accenture",
      "Cognizant"
    ],
    "difficulty": "BASIC",
    "sort_order": 10,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-11",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the return value of function `fun(4)`?",
    "codeSnippet": "function fun(Integer n)\n    if (n <= 1)\n        return 1\n    end if\n    return n + fun(n - 1) + fun(n - 2)\nend function",
    "code_snippet": "function fun(Integer n)\n    if (n <= 1)\n        return 1\n    end if\n    return n + fun(n - 1) + fun(n - 2)\nend function",
    "options": [
      "16",
      "18",
      "19",
      "12"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Evaluating bottom-up recursion:\n- $fun(0) = 1$\n- $fun(1) = 1$\n- $fun(2) = 2 + fun(1) + fun(0) = 2 + 1 + 1 = 4$\n- $fun(3) = 3 + fun(2) + fun(1) = 3 + 4 + 1 = 8$\n- $fun(4) = 4 + fun(3) + fun(2) = 4 + 8 + 4 = 16$.",
    "companyTags": [
      "Amazon",
      "TCS Digital",
      "Accenture"
    ],
    "company_tags": [
      "Amazon",
      "TCS Digital",
      "Accenture"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 11,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-12",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What does the following recursive function with a static variable print when called as `solve(3)`?",
    "codeSnippet": "function solve(Integer n)\n    Static Integer x = 0\n    if (n <= 0)\n        return 1\n    end if\n    x = x + 1\n    return solve(n - 1) + x\nend function",
    "code_snippet": "function solve(Integer n)\n    Static Integer x = 0\n    if (n <= 0)\n        return 1\n    end if\n    x = x + 1\n    return solve(n - 1) + x\nend function",
    "options": [
      "10",
      "7",
      "6",
      "4"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Static variable `x` persists across all recursive activation frames:\n1. `solve(3)`: $x$ increments to 1. Returns `solve(2) + x`.\n2. `solve(2)`: $x$ increments to 2. Returns `solve(1) + x`.\n3. `solve(1)`: $x$ increments to 3. Returns `solve(0) + x`.\n4. `solve(0)`: returns 1.\nNow unwinding the call stack with $x = 3$ throughout:\n- `solve(1)` returns $1 + 3 = 4$\n- `solve(2)` returns $4 + 3 = 7$\n- `solve(3)` returns $7 + 3 = 10$.",
    "companyTags": [
      "Accenture",
      "Capgemini",
      "Infosys SP"
    ],
    "company_tags": [
      "Accenture",
      "Capgemini",
      "Infosys SP"
    ],
    "difficulty": "HARD",
    "sort_order": 12,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-13",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the exact output printed by the following non-tail recursive function when invoked with `display(3)`?",
    "codeSnippet": "function display(Integer n)\n    if (n == 0)\n        return\n    end if\n    Print n\n    display(n - 1)\n    Print n\nend function",
    "code_snippet": "function display(Integer n)\n    if (n == 0)\n        return\n    end if\n    Print n\n    display(n - 1)\n    Print n\nend function",
    "options": [
      "3 2 1 1 2 3",
      "3 2 1 3 2 1",
      "1 2 3 3 2 1",
      "3 2 1"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Tracing activation records on call stack:\n- `display(3)` prints 3, calls `display(2)`\n  - `display(2)` prints 2, calls `display(1)`\n    - `display(1)` prints 1, calls `display(0)`\n      - `display(0)` returns\n    - `display(1)` resumes, prints 1\n  - `display(2)` resumes, prints 2\n- `display(3)` resumes, prints 3\nCombined printed sequence: `3 2 1 1 2 3`.",
    "companyTags": [
      "TCS Digital",
      "Accenture",
      "Cognizant GenC Next"
    ],
    "company_tags": [
      "TCS Digital",
      "Accenture",
      "Cognizant GenC Next"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 13,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-14",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the return value of `calc(5, 2)`?",
    "codeSnippet": "function calc(Integer a, Integer b)\n    if (a < b)\n        return 0\n    end if\n    return 1 + calc(a - b, b)\nend function",
    "code_snippet": "function calc(Integer a, Integer b)\n    if (a < b)\n        return 0\n    end if\n    return 1 + calc(a - b, b)\nend function",
    "options": [
      "2",
      "3",
      "5",
      "1"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "This implements integer division $a / b$ ($5 / 2 = 2$):\n- `calc(5, 2)`: $1 + calc(3, 2)$\n- `calc(3, 2)`: $1 + calc(1, 2)$\n- `calc(1, 2)`: since $1 < 2$, returns 0.\nUnwinding: $1 + 1 + 0 = 2$.",
    "companyTags": [
      "Capgemini",
      "Infosys",
      "TCS"
    ],
    "company_tags": [
      "Capgemini",
      "Infosys",
      "TCS"
    ],
    "difficulty": "BASIC",
    "sort_order": 14,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-15",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What does the recursive function `mystery(4)` return?",
    "codeSnippet": "function mystery(Integer n)\n    if (n == 1)\n        return 1\n    end if\n    if (n % 2 == 0)\n        return 2 * mystery(n / 2)\n    else\n        return 2 * mystery(n - 1)\n    end if\nend function",
    "code_snippet": "function mystery(Integer n)\n    if (n == 1)\n        return 1\n    end if\n    if (n % 2 == 0)\n        return 2 * mystery(n / 2)\n    else\n        return 2 * mystery(n - 1)\n    end if\nend function",
    "options": [
      "4",
      "8",
      "16",
      "2"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Trace:\n- `mystery(4)`: 4 is even -> returns $2 \\times mystery(2)$\n- `mystery(2)`: 2 is even -> returns $2 \\times mystery(1)$\n- `mystery(1)`: base case returns 1.\nResult = $2 \\times (2 \\times 1) = 4$.",
    "companyTags": [
      "Accenture",
      "Cognizant",
      "Wipro"
    ],
    "company_tags": [
      "Accenture",
      "Cognizant",
      "Wipro"
    ],
    "difficulty": "HARD",
    "sort_order": 15,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-16",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "In the following pseudo-code, parameter `x` is passed by Value and parameter `y` is passed by Reference (`ref`). What will be printed by the main program?",
    "codeSnippet": "function modify(Integer x, ref Integer y)\n    x = x + 10\n    y = y + 10\nend function\n\nInteger a, b\nSet a = 5, b = 5\nmodify(a, b)\nPrint a, b",
    "code_snippet": "function modify(Integer x, ref Integer y)\n    x = x + 10\n    y = y + 10\nend function\n\nInteger a, b\nSet a = 5, b = 5\nmodify(a, b)\nPrint a, b",
    "options": [
      "5 15",
      "15 15",
      "5 5",
      "15 5"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "- Parameter `x` is passed by value: changes to `x` inside `modify` affect only the local copy, leaving caller variable `a = 5` unchanged.\n- Parameter `y` is passed by reference (`ref`): changes directly modify the caller's variable in memory, so `b` becomes $5 + 10 = 15$.\nOutput: `5 15`.",
    "companyTags": [
      "TCS Digital",
      "Accenture",
      "Capgemini"
    ],
    "company_tags": [
      "TCS Digital",
      "Accenture",
      "Capgemini"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 16,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-17",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is printed by the following pseudo-code where an array is passed to a function?",
    "codeSnippet": "function alter(Integer arr[], Integer n)\n    arr[0] = arr[0] + arr[1]\n    arr[1] = arr[0] - arr[1]\nend function\n\nInteger arr[2] = {10, 20}\nalter(arr, 2)\nPrint arr[0], arr[1]",
    "code_snippet": "function alter(Integer arr[], Integer n)\n    arr[0] = arr[0] + arr[1]\n    arr[1] = arr[0] - arr[1]\nend function\n\nInteger arr[2] = {10, 20}\nalter(arr, 2)\nPrint arr[0], arr[1]",
    "options": [
      "30 10",
      "10 20",
      "30 20",
      "20 10"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Arrays are passed by reference (decaying to base memory address):\n1. `arr[0] = arr[0] + arr[1] = 10 + 20 = 30`.\n2. `arr[1] = arr[0] - arr[1] = 30 - 20 = 10`.\nOriginal array memory is updated. Output: `30 10`.",
    "companyTags": [
      "Accenture",
      "Infosys SP",
      "Cognizant"
    ],
    "company_tags": [
      "Accenture",
      "Infosys SP",
      "Cognizant"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 17,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-18",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of the following pointer dereferencing pseudo-code?",
    "codeSnippet": "Integer arr[4] = {5, 10, 15, 20}\nInteger *ptr = arr\nptr = ptr + 2\n*ptr = *ptr + *(ptr - 1)\nPrint arr[2]",
    "code_snippet": "Integer arr[4] = {5, 10, 15, 20}\nInteger *ptr = arr\nptr = ptr + 2\n*ptr = *ptr + *(ptr - 1)\nPrint arr[2]",
    "options": [
      "25",
      "15",
      "35",
      "30"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "- `ptr = arr` points to `arr[0]` (5).\n- `ptr = ptr + 2` points to `arr[2]` (15).\n- `*(ptr - 1)` accesses `arr[1]` (10).\n- `*ptr = *ptr + *(ptr - 1) = 15 + 10 = 25`.\nTherefore, `arr[2]` is updated to 25.",
    "companyTags": [
      "TCS Prime",
      "Capgemini",
      "Amazon"
    ],
    "company_tags": [
      "TCS Prime",
      "Capgemini",
      "Amazon"
    ],
    "difficulty": "HARD",
    "sort_order": 18,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-19",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "In the following pseudo-code, both arguments are passed by reference to the same variable: `update(x, x)`. What is the final value of `x`?",
    "codeSnippet": "function update(ref Integer a, ref Integer b)\n    a = a + 5\n    b = b * 2\nend function\n\nInteger x = 4\nupdate(x, x)\nPrint x",
    "code_snippet": "function update(ref Integer a, ref Integer b)\n    a = a + 5\n    b = b * 2\nend function\n\nInteger x = 4\nupdate(x, x)\nPrint x",
    "options": [
      "18",
      "13",
      "14",
      "8"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Because `a` and `b` both reference the exact same memory location of `x` (aliasing):\n1. `a = a + 5` -> $x = 4 + 5 = 9$.\n2. `b = b * 2` -> reads $b$ (which is $x = 9$) and multiplies: $x = 9 \\times 2 = 18$.\nFinal value of $x$ is 18.",
    "companyTags": [
      "Goldman Sachs",
      "Accenture",
      "Microsoft"
    ],
    "company_tags": [
      "Goldman Sachs",
      "Accenture",
      "Microsoft"
    ],
    "difficulty": "HARD",
    "sort_order": 19,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-20",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "What is 'Pointer Aliasing' in programming and compiler optimization?",
    "options": [
      "A situation where two or more distinct pointers or reference variables point to the exact same memory location, meaning modifications through one pointer alter the value observed through the other.",
      "Using short names for pointer variables.",
      "Casting an integer to a float pointer.",
      "Freeing memory twice."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Aliasing occurs when two distinct symbolic pointer references refer to the same physical memory address. It forces compilers to generate conservative machine code because a write to pointer `*p` might unpredictably change the value stored under `*q`.",
    "companyTags": [
      "Google",
      "Qualcomm",
      "Cisco"
    ],
    "company_tags": [
      "Google",
      "Qualcomm",
      "Cisco"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 20,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-21",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What will be printed by the following pseudo-code demonstrating short-circuit logical evaluation?",
    "codeSnippet": "Integer a, b, c\nSet a = 1, b = 0, c = 5\nif (a == 1 || ++b > 0)\n    c = c + 1\nend if\nPrint b, c",
    "code_snippet": "Integer a, b, c\nSet a = 1, b = 0, c = 5\nif (a == 1 || ++b > 0)\n    c = c + 1\nend if\nPrint b, c",
    "options": [
      "0 6",
      "1 6",
      "0 5",
      "1 5"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In short-circuit logical OR (`||`), if the left-hand operand evaluates to `TRUE`, the right-hand operand is completely bypassed and never executed.\nHere, `a == 1` is `TRUE`. Therefore, `++b > 0` is NOT evaluated. Variable `b` remains 0, and `c` increments to 6. Output: `0 6`.",
    "companyTags": [
      "Accenture",
      "Capgemini",
      "Infosys"
    ],
    "company_tags": [
      "Accenture",
      "Capgemini",
      "Infosys"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 21,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-22",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the value of `val` after evaluating the chained ternary expression?",
    "codeSnippet": "Integer a = 15, b = 25, c = 20, val\nval = (a > b) ? a : ((b > c) ? b : c)\nPrint val",
    "code_snippet": "Integer a = 15, b = 25, c = 20, val\nval = (a > b) ? a : ((b > c) ? b : c)\nPrint val",
    "options": [
      "25",
      "20",
      "15",
      "0"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Evaluating `(a > b) ? a : ((b > c) ? b : c)`:\n1. Condition `a > b` ($15 > 25$) is `FALSE`.\n2. It evaluates the false branch: `(b > c) ? b : c`.\n3. In nested ternary, `b > c` ($25 > 20$) is `TRUE`, which selects `b` (25).\nResult is 25.",
    "companyTags": [
      "TCS",
      "Accenture",
      "Cognizant"
    ],
    "company_tags": [
      "TCS",
      "Accenture",
      "Cognizant"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 22,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-23",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of the following pseudo-code featuring short-circuit AND (`&&`)?",
    "codeSnippet": "Integer x, y\nSet x = 0, y = 10\nif (x != 0 && ++y > 10)\n    Print \"Condition Met\"\nend if\nPrint y",
    "code_snippet": "Integer x, y\nSet x = 0, y = 10\nif (x != 0 && ++y > 10)\n    Print \"Condition Met\"\nend if\nPrint y",
    "options": [
      "10",
      "11",
      "Condition Met 11",
      "Condition Met 10"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In short-circuit logical AND (`&&`), if the left operand evaluates to `FALSE`, the entire condition is false and the right-hand operand is not evaluated.\n`x != 0` ($0 \\neq 0$) is `FALSE`. The RHS `++y > 10` is skipped. Variable `y` remains 10.",
    "companyTags": [
      "Accenture",
      "Capgemini",
      "Wipro"
    ],
    "company_tags": [
      "Accenture",
      "Capgemini",
      "Wipro"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 23,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-24",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is printed by the following conditional block with compound logical operators?",
    "codeSnippet": "Integer p = 4, q = 6, r = 8\nif (p + q > r && r - q < p)\n    Print \"Alpha\"\nelse if (p * 2 == r || q * 2 == r)\n    Print \"Beta\"\nelse\n    Print \"Gamma\"\nend if",
    "code_snippet": "Integer p = 4, q = 6, r = 8\nif (p + q > r && r - q < p)\n    Print \"Alpha\"\nelse if (p * 2 == r || q * 2 == r)\n    Print \"Beta\"\nelse\n    Print \"Gamma\"\nend if",
    "options": [
      "Alpha",
      "Beta",
      "Gamma",
      "Alpha Beta"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Test first condition:\n- $p + q > r \\implies 4 + 6 > 8 \\implies 10 > 8$ (TRUE)\n- $r - q < p \\implies 8 - 6 < 4 \\implies 2 < 4$ (TRUE)\nSince both are true, `p + q > r && r - q < p` is TRUE, printing \"Alpha\". The remaining `else if` branches are skipped.",
    "companyTags": [
      "TCS Digital",
      "Infosys SP",
      "Cognizant"
    ],
    "company_tags": [
      "TCS Digital",
      "Infosys SP",
      "Cognizant"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 24,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-25",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of the following pseudo-code involving bitwise vs logical operators?",
    "codeSnippet": "Integer a = 2, b = 4\nif (a & b)\n    Print \"Bitwise True\"\nelse if (a && b)\n    Print \"Logical True\"\nend if",
    "code_snippet": "Integer a = 2, b = 4\nif (a & b)\n    Print \"Bitwise True\"\nelse if (a && b)\n    Print \"Logical True\"\nend if",
    "options": [
      "Logical True",
      "Bitwise True",
      "Bitwise True Logical True",
      "No output"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "- Bitwise AND: $a \\& b = 2 \\& 4 = (0010)_2 \\& (0100)_2 = (0000)_2 = 0$ (falsy in conditionals).\n- Logical AND: In boolean logic, any non-zero integer is truthy. Both $a=2$ and $b=4$ are non-zero (true), so $a \\&\\& b$ evaluates to TRUE, printing \"Logical True\".",
    "companyTags": [
      "Accenture",
      "Capgemini",
      "TCS Prime"
    ],
    "company_tags": [
      "Accenture",
      "Capgemini",
      "TCS Prime"
    ],
    "difficulty": "HARD",
    "sort_order": 25,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-26",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What will be the elements of array `A` after executing the following in-place prefix transformation?",
    "codeSnippet": "Integer A[4] = {2, 3, 5, 7}\nfor i = 1 to 3\n    A[i] = A[i] + A[i - 1]\nend for\nPrint A[3]",
    "code_snippet": "Integer A[4] = {2, 3, 5, 7}\nfor i = 1 to 3\n    A[i] = A[i] + A[i - 1]\nend for\nPrint A[3]",
    "options": [
      "17",
      "15",
      "12",
      "10"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Tracing prefix sum transformation:\n- $i = 1$: $A[1] = A[1] + A[0] = 3 + 2 = 5$\n- $i = 2$: $A[2] = A[2] + A[1] = 5 + 5 = 10$\n- $i = 3$: $A[3] = A[3] + A[2] = 7 + 10 = 17$\nFinal value of $A[3]$ is 17.",
    "companyTags": [
      "Accenture",
      "TCS Digital",
      "Infosys"
    ],
    "company_tags": [
      "Accenture",
      "TCS Digital",
      "Infosys"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 26,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-27",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of the following 2D matrix diagonal summation pseudo-code?",
    "codeSnippet": "Integer M[3][3] = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}}\nInteger sum = 0, i\nfor i = 0 to 2\n    sum = sum + M[i][i] + M[i][2 - i]\nend for\nPrint sum",
    "code_snippet": "Integer M[3][3] = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}}\nInteger sum = 0, i\nfor i = 0 to 2\n    sum = sum + M[i][i] + M[i][2 - i]\nend for\nPrint sum",
    "options": [
      "30",
      "25",
      "15",
      "45"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Summing main and anti-diagonals:\n- $i = 0$: $M[0][0] + M[0][2] = 1 + 3 = 4$\n- $i = 1$: $M[1][1] + M[1][1] = 5 + 5 = 10$ (center element counted twice)\n- $i = 2$: $M[2][2] + M[2][0] = 9 + 7 = 16$\nTotal sum = $4 + 10 + 16 = 30$.",
    "companyTags": [
      "Capgemini",
      "Accenture",
      "Cognizant"
    ],
    "company_tags": [
      "Capgemini",
      "Accenture",
      "Cognizant"
    ],
    "difficulty": "HARD",
    "sort_order": 27,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-28",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the final value of variable `k` in the following array manipulation trace?",
    "codeSnippet": "Integer arr[5] = {1, 2, 3, 4, 5}\nInteger k = 0, i\nfor i = 0 to 4\n    if (arr[i] % 2 != 0)\n        k = k ^ arr[i]\n    end if\nend for\nPrint k",
    "code_snippet": "Integer arr[5] = {1, 2, 3, 4, 5}\nInteger k = 0, i\nfor i = 0 to 4\n    if (arr[i] % 2 != 0)\n        k = k ^ arr[i]\n    end if\nend for\nPrint k",
    "options": [
      "7",
      "1",
      "9",
      "15"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Odd elements in array are 1, 3, 5.\n- $k_0 = 0$\n- $k_1 = 0 \\oplus 1 = 1 = (001)_2$\n- $k_2 = 1 \\oplus 3 = (001)_2 \\oplus (011)_2 = (010)_2 = 2$\n- $k_3 = 2 \\oplus 5 = (010)_2 \\oplus (101)_2 = (111)_2 = 7$\nFinal value is 7.",
    "companyTags": [
      "Accenture",
      "TCS Prime",
      "Capgemini"
    ],
    "company_tags": [
      "Accenture",
      "TCS Prime",
      "Capgemini"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 28,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-29",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "CODE_COMPLETION",
    "question_type": "CODE_COMPLETION",
    "question": "To rotate an array `arr` of size $N$ to the left by $D$ positions in $O(N)$ time and $O(1)$ auxiliary space, how should the 3-step reversal algorithm be completed?",
    "codeSnippet": "reverse(arr, 0, D - 1)\nreverse(arr, D, N - 1)\n/* __BLANK__ */",
    "code_snippet": "reverse(arr, 0, D - 1)\nreverse(arr, D, N - 1)\n/* __BLANK__ */",
    "options": [
      "reverse(arr, 0, N - 1)",
      "reverse(arr, 1, N)",
      "reverse(arr, D, 0)",
      "reverse(arr, 0, D)"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "The block-reversal algorithm rotates an array in 3 steps:\n1. Reverse first $D$ elements: `reverse(0, D - 1)`.\n2. Reverse remaining $N - D$ elements: `reverse(D, N - 1)`.\n3. Reverse the entire array: `reverse(0, N - 1)`.\nThis achieves left rotation in $O(N)$ time with $O(1)$ memory.",
    "companyTags": [
      "Amazon",
      "Microsoft",
      "TCS Digital"
    ],
    "company_tags": [
      "Amazon",
      "Microsoft",
      "TCS Digital"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 29,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-30",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of the following matrix element transformation?",
    "codeSnippet": "Integer A[2][2] = {{2, 4}, {6, 8}}\nInteger i, j\nfor i = 0 to 1\n    for j = 0 to 1\n        if (i == j)\n            A[i][j] = A[i][j] * 2\n        else\n            A[i][j] = A[i][j] / 2\n        end if\n    end for\nend for\nPrint A[0][1] + A[1][1]",
    "code_snippet": "Integer A[2][2] = {{2, 4}, {6, 8}}\nInteger i, j\nfor i = 0 to 1\n    for j = 0 to 1\n        if (i == j)\n            A[i][j] = A[i][j] * 2\n        else\n            A[i][j] = A[i][j] / 2\n        end if\n    end for\nend for\nPrint A[0][1] + A[1][1]",
    "options": [
      "18",
      "16",
      "20",
      "12"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "- For diagonal ($i == j$): $A[0][0] = 2 \\times 2 = 4$; $A[1][1] = 8 \\times 2 = 16$.\n- For off-diagonal ($i \\neq j$): $A[0][1] = 4 / 2 = 2$; $A[1][0] = 6 / 2 = 3$.\nSum requested: $A[0][1] + A[1][1] = 2 + 16 = 18$.",
    "companyTags": [
      "Accenture",
      "Cognizant GenC Next",
      "Infosys"
    ],
    "company_tags": [
      "Accenture",
      "Cognizant GenC Next",
      "Infosys"
    ],
    "difficulty": "BASIC",
    "sort_order": 30,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-31",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the result of performing the bitwise operation `ch ^ 32` on an uppercase ASCII character `ch = 'A'` (ASCII 65)?",
    "options": [
      "'a' (ASCII 97, converts uppercase to lowercase)",
      "'A' (remains uppercase)",
      "A compile error",
      "Space character (ASCII 32)"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In the ASCII table, uppercase and lowercase letters differ by exactly the 5th bit ($2^5 = 32$):\n- `'A' = 65 = (01000001)_2$\n- $32 = (00100000)_2$\n- $65 \\oplus 32 = (01100001)_2 = 97 = \\text{'a'}$.\nXORing with 32 toggles the case between upper and lower case in $O(1)$ time.",
    "companyTags": [
      "Accenture",
      "Capgemini",
      "TCS Digital"
    ],
    "company_tags": [
      "Accenture",
      "Capgemini",
      "TCS Digital"
    ],
    "difficulty": "BASIC",
    "sort_order": 31,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-32",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What will be printed by the following string palindrome checker pseudo-code for string `S = \"radar\"`?",
    "codeSnippet": "function isPalindrome(String S)\n    Integer left = 0, right = length(S) - 1\n    while (left < right)\n        if (S[left] != S[right])\n            return False\n        end if\n        left = left + 1\n        right = right - 1\n    end while\n    return True\nend function",
    "code_snippet": "function isPalindrome(String S)\n    Integer left = 0, right = length(S) - 1\n    while (left < right)\n        if (S[left] != S[right])\n            return False\n        end if\n        left = left + 1\n        right = right - 1\n    end while\n    return True\nend function",
    "options": [
      "True",
      "False",
      "Infinite Loop",
      "Compilation Error"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Tracing `S = \"radar\"`:\n- Step 1: `left = 0 ('r')`, `right = 4 ('r')` -> match. `left = 1, right = 3`.\n- Step 2: `left = 1 ('a')`, `right = 3 ('a')` -> match. `left = 2, right = 2`.\n- `left < right` ($2 < 2$) is false; loop terminates and returns `True`.",
    "companyTags": [
      "TCS",
      "Infosys",
      "Cognizant"
    ],
    "company_tags": [
      "TCS",
      "Infosys",
      "Cognizant"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 32,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-33",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of the following character accumulator pseudo-code?",
    "codeSnippet": "String str = \"a1b2c3\"\nInteger sum = 0, i\nfor i = 0 to length(str) - 1\n    if (str[i] >= '0' && str[i] <= '9')\n        sum = sum + (str[i] - '0')\n    end if\nend for\nPrint sum",
    "code_snippet": "String str = \"a1b2c3\"\nInteger sum = 0, i\nfor i = 0 to length(str) - 1\n    if (str[i] >= '0' && str[i] <= '9')\n        sum = sum + (str[i] - '0')\n    end if\nend for\nPrint sum",
    "options": [
      "6",
      "150",
      "156",
      "0"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "The loop filters digit characters (`'1'`, `'2'`, `'3'`) and converts them to numeric values by subtracting `'0'` (ASCII 48):\n- `'1' - '0' = 1`\n- `'2' - '0' = 2`\n- `'3' - '0' = 3`\nSum = $1 + 2 + 3 = 6$.",
    "companyTags": [
      "Accenture",
      "Capgemini",
      "Infosys SP"
    ],
    "company_tags": [
      "Accenture",
      "Capgemini",
      "Infosys SP"
    ],
    "difficulty": "BASIC",
    "sort_order": 33,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-34",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of the following string frequency count algorithm for `\"banana\"`?",
    "codeSnippet": "String s = \"banana\"\nInteger count = 0, i\nfor i = 0 to length(s) - 1\n    if (s[i] == 'a')\n        count = count + 1\n    end if\nend for\nPrint count * 10",
    "code_snippet": "String s = \"banana\"\nInteger count = 0, i\nfor i = 0 to length(s) - 1\n    if (s[i] == 'a')\n        count = count + 1\n    end if\nend for\nPrint count * 10",
    "options": [
      "30",
      "20",
      "10",
      "60"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "In the string `\"banana\"`, the character `'a'` appears at indices 1, 3, and 5 (total 3 times). Then `count * 10 = 3 * 10 = 30`.",
    "companyTags": [
      "TCS",
      "Wipro",
      "Cognizant"
    ],
    "company_tags": [
      "TCS",
      "Wipro",
      "Cognizant"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 34,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-35",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What does the following function return for `text = \"abcde\"`?",
    "codeSnippet": "function test(String text)\n    Integer len = length(text)\n    String res = \"\"\n    for i = len - 1 down to 0\n        res = res + text[i]\n    end for\n    return res\nend function",
    "code_snippet": "function test(String text)\n    Integer len = length(text)\n    String res = \"\"\n    for i = len - 1 down to 0\n        res = res + text[i]\n    end for\n    return res\nend function",
    "options": [
      "\"edcba\"",
      "\"abcde\"",
      "\"a\"",
      "\"e\""
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "The loop iterates backward from index $\\text{len} - 1$ (4) down to 0, appending each character: `'e'`, `'d'`, `'c'`, `'b'`, `'a'`, effectively producing the reversed string `\"edcba\"`.",
    "companyTags": [
      "Accenture",
      "Infosys",
      "Capgemini"
    ],
    "company_tags": [
      "Accenture",
      "Infosys",
      "Capgemini"
    ],
    "difficulty": "BASIC",
    "sort_order": 35,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-36",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the return value of `gcd(48, 18)` using the Euclidean pseudo-code algorithm?",
    "codeSnippet": "function gcd(Integer a, Integer b)\n    while (b != 0)\n        Integer temp = b\n        b = a % b\n        a = temp\n    end while\n    return a\nend function",
    "code_snippet": "function gcd(Integer a, Integer b)\n    while (b != 0)\n        Integer temp = b\n        b = a % b\n        a = temp\n    end while\n    return a\nend function",
    "options": [
      "6",
      "12",
      "3",
      "2"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Euclidean GCD trace:\n- Start: $a = 48, b = 18$\n- Iteration 1: $temp = 18, b = 48 \\pmod{18} = 12, a = 18$\n- Iteration 2: $temp = 12, b = 18 \\pmod{12} = 6, a = 12$\n- Iteration 3: $temp = 6, b = 12 \\pmod 6 = 0, a = 6$\n- $b == 0$, loop ends. Returns $a = 6$.",
    "companyTags": [
      "Accenture",
      "TCS Digital",
      "Infosys SP"
    ],
    "company_tags": [
      "Accenture",
      "TCS Digital",
      "Infosys SP"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 36,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-37",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What does the following pseudo-code compute for input `num = 1234`?",
    "codeSnippet": "Integer num = 1234, sum = 0\nwhile (num > 0)\n    sum = sum + (num % 10)\n    num = num / 10\nend while\nPrint sum",
    "code_snippet": "Integer num = 1234, sum = 0\nwhile (num > 0)\n    sum = sum + (num % 10)\n    num = num / 10\nend while\nPrint sum",
    "options": [
      "10",
      "24",
      "4",
      "4321"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "The loop extracts digits from right to left using modulo 10 and integer division:\n- $1234 \\pmod{10} = 4$, num becomes 123\n- $123 \\pmod{10} = 3$, num becomes 12\n- $12 \\pmod{10} = 2$, num becomes 1\n- $1 \\pmod{10} = 1$, num becomes 0\nSum $= 4 + 3 + 2 + 1 = 10$.",
    "companyTags": [
      "TCS",
      "Cognizant",
      "Capgemini"
    ],
    "company_tags": [
      "TCS",
      "Cognizant",
      "Capgemini"
    ],
    "difficulty": "BASIC",
    "sort_order": 37,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-38",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the mathematical Digital Root computed by the formula `1 + (n - 1) % 9` for `n = 4589`?",
    "options": [
      "8",
      "7",
      "9",
      "5"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Digital root sums digits recursively until a single digit remains:\n$4 + 5 + 8 + 9 = 26 \\implies 2 + 6 = 8$.\nUsing the congruence formula: $1 + (4589 - 1) \\pmod 9 = 1 + 4588 \\pmod 9$.\n$4588 / 9 = 509\\text{ R }7$. Thus $1 + 7 = 8$.",
    "companyTags": [
      "Accenture",
      "Capgemini",
      "Goldman Sachs"
    ],
    "company_tags": [
      "Accenture",
      "Capgemini",
      "Goldman Sachs"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 38,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-39",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What will be printed by the following base-conversion loop for decimal number 29?",
    "codeSnippet": "Integer n = 29, rem\nString bin = \"\"\nwhile (n > 0)\n    rem = n % 2\n    bin = rem + bin\n    n = n / 2\nend while\nPrint bin",
    "code_snippet": "Integer n = 29, rem\nString bin = \"\"\nwhile (n > 0)\n    rem = n % 2\n    bin = rem + bin\n    n = n / 2\nend while\nPrint bin",
    "options": [
      "\"11101\"",
      "\"10111\"",
      "\"11011\"",
      "\"11110\""
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Decimal 29 to binary:\n- $29 / 2 = 14\\text{ rem } 1$\n- $14 / 2 = 7\\text{ rem } 0$\n- $7 / 2 = 3\\text{ rem } 1$\n- $3 / 2 = 1\\text{ rem } 1$\n- $1 / 2 = 0\\text{ rem } 1$\nReading remainders bottom to top: $11101_2$ ($16 + 8 + 4 + 1 = 29$).",
    "companyTags": [
      "Infosys SP",
      "Accenture",
      "TCS Digital"
    ],
    "company_tags": [
      "Infosys SP",
      "Accenture",
      "TCS Digital"
    ],
    "difficulty": "BASIC",
    "sort_order": 39,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-40",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "CONCEPTUAL",
    "question_type": "CONCEPTUAL",
    "question": "Why does a prime-checking loop need to iterate only up to $\\sqrt{N}$ ($i \\times i \\le N$) instead of $N - 1$?",
    "options": [
      "If $N$ has a divisor greater than $\\sqrt{N}$, it must also have a corresponding complement divisor smaller than $\\sqrt{N}$, so all potential factors are tested by testing up to $\\sqrt{N}$.",
      "Because square roots eliminate negative numbers.",
      "Because CPU registers cannot multiply past square roots.",
      "It is a heuristic approximation that only works for odd numbers."
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "If $N = a \\times b$, it is mathematically impossible for both $a$ and $b$ to be strictly greater than $\\sqrt{N}$ (since $\\sqrt{N} \\times \\sqrt{N} = N$). Thus, at least one factor must be $\\le \\sqrt{N}$. If no factor is found up to $\\sqrt{N}$, $N$ is guaranteed to be prime, reducing complexity from $O(N)$ to $O(\\sqrt{N})$.",
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
    "difficulty": "BASIC",
    "sort_order": 40,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-41",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the final state of Stack $S$ (top to bottom) after executing this operation sequence?",
    "codeSnippet": "Stack S\nS.push(10)\nS.push(20)\nS.pop()\nS.push(30)\nS.push(40)\nS.pop()\nS.push(50)",
    "code_snippet": "Stack S\nS.push(10)\nS.push(20)\nS.pop()\nS.push(30)\nS.push(40)\nS.pop()\nS.push(50)",
    "options": [
      "Top -> [50, 30, 10]",
      "Top -> [10, 30, 50]",
      "Top -> [50, 40, 30]",
      "Top -> [50, 10]"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Trace:\n- `push(10)`: `[10]`\n- `push(20)`: `[10, 20]`\n- `pop()`: removes 20 -> `[10]`\n- `push(30)`: `[10, 30]`\n- `push(40)`: `[10, 30, 40]`\n- `pop()`: removes 40 -> `[10, 30]`\n- `push(50)`: `[10, 30, 50]`\nFrom top to bottom: 50, 30, 10.",
    "companyTags": [
      "Accenture",
      "TCS",
      "Cognizant"
    ],
    "company_tags": [
      "Accenture",
      "TCS",
      "Cognizant"
    ],
    "difficulty": "BASIC",
    "sort_order": 41,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-42",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of the following queue manipulation pseudo-code?",
    "codeSnippet": "Queue Q\nQ.enqueue(1)\nQ.enqueue(2)\nQ.enqueue(3)\nInteger x = Q.dequeue()\nQ.enqueue(x + Q.dequeue())\nPrint Q.dequeue()",
    "code_snippet": "Queue Q\nQ.enqueue(1)\nQ.enqueue(2)\nQ.enqueue(3)\nInteger x = Q.dequeue()\nQ.enqueue(x + Q.dequeue())\nPrint Q.dequeue()",
    "options": [
      "3",
      "1",
      "2",
      "4"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Queue trace (FIFO):\n1. `enqueue(1, 2, 3)`: Queue `[1, 2, 3]`.\n2. `x = Q.dequeue()`: removes 1, $x = 1$. Queue: `[2, 3]`.\n3. `Q.enqueue(x + Q.dequeue())`: $1 + 2 = 3$ enqueued. Queue: `[3, 3]`.\n4. `Print Q.dequeue()`: pops front element = 3.",
    "companyTags": [
      "Capgemini",
      "Accenture",
      "Infosys SP"
    ],
    "company_tags": [
      "Capgemini",
      "Accenture",
      "Infosys SP"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 42,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-43",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What will be printed by the following stack-based character reversal pseudo-code?",
    "codeSnippet": "Stack S\nString word = \"GATE\"\nfor i = 0 to length(word) - 1\n    S.push(word[i])\nend for\nString out = \"\"\nwhile (!S.isEmpty())\n    out = out + S.pop()\nend while\nPrint out",
    "code_snippet": "Stack S\nString word = \"GATE\"\nfor i = 0 to length(word) - 1\n    S.push(word[i])\nend for\nString out = \"\"\nwhile (!S.isEmpty())\n    out = out + S.pop()\nend while\nPrint out",
    "options": [
      "\"ETAG\"",
      "\"GATE\"",
      "\"G\"",
      "\"E\""
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "A stack operates on LIFO (Last-In First-Out) principle. Pushing characters `'G'`, `'A'`, `'T'`, `'E'` puts `'E'` at the top. Popping characters until empty produces the reversed string `\"ETAG\"`.",
    "companyTags": [
      "TCS",
      "Accenture",
      "Cognizant"
    ],
    "company_tags": [
      "TCS",
      "Accenture",
      "Cognizant"
    ],
    "difficulty": "BASIC",
    "sort_order": 43,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-44",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What does `balanceCheck(\"({[]})\")` return in the standard parentheses matching pseudo-code?",
    "codeSnippet": "function balanceCheck(String s)\n    Stack st\n    for i = 0 to length(s) - 1\n        if (s[i] == '(' || s[i] == '{' || s[i] == '[')\n            st.push(s[i])\n        else\n            if (st.isEmpty()) return False\n            char top = st.pop()\n            if (s[i] == ')' && top != '(') return False\n            if (s[i] == '}' && top != '{') return False\n            if (s[i] == ']' && top != '[') return False\n        end if\n    end for\n    return st.isEmpty()\nend function",
    "code_snippet": "function balanceCheck(String s)\n    Stack st\n    for i = 0 to length(s) - 1\n        if (s[i] == '(' || s[i] == '{' || s[i] == '[')\n            st.push(s[i])\n        else\n            if (st.isEmpty()) return False\n            char top = st.pop()\n            if (s[i] == ')' && top != '(') return False\n            if (s[i] == '}' && top != '{') return False\n            if (s[i] == ']' && top != '[') return False\n        end if\n    end for\n    return st.isEmpty()\nend function",
    "options": [
      "True",
      "False",
      "Compilation Error",
      "Null"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Every opening delimiter is pushed onto the stack: `'('`, then `'{'`, then `'['`. As closing delimiters appear, each matches and pops its corresponding opening delimiter in reverse order: `']'` pops `'['`, `'}'` pops `'{'`, and `')'` pops `'('`. Stack is empty at the end, returning `True`.",
    "companyTags": [
      "Amazon",
      "TCS Digital",
      "Accenture"
    ],
    "company_tags": [
      "Amazon",
      "TCS Digital",
      "Accenture"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 44,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-45",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the maximum number of elements in the stack during the evaluation of the postfix expression: `1 2 + 3 4 + *`?",
    "options": [
      "3",
      "4",
      "2",
      "5"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Stack size tracking:\n- Push 1 (size 1)\n- Push 2 (size 2)\n- `+`: pop 2, pop 1, push 3 (size 1)\n- Push 3 (size 2)\n- Push 4 (size 3) -> MAXIMUM SIZE REACHED = 3\n- `+`: pop 4, pop 3, push 7 (size 2)\n- `*`: pop 7, pop 3, push 21 (size 1).\nMaximum stack height was 3.",
    "companyTags": [
      "Goldman Sachs",
      "Accenture",
      "Capgemini"
    ],
    "company_tags": [
      "Goldman Sachs",
      "Accenture",
      "Capgemini"
    ],
    "difficulty": "HARD",
    "sort_order": 45,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-46",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the value of `res` after evaluating pre-increment and post-increment operators?",
    "codeSnippet": "Integer a = 5, b = 10, res\nres = ++a + b++ + a\nPrint res, a, b",
    "code_snippet": "Integer a = 5, b = 10, res\nres = ++a + b++ + a\nPrint res, a, b",
    "options": [
      "22 6 11",
      "21 6 11",
      "20 5 10",
      "23 7 11"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Step by step evaluation:\n1. `++a`: Pre-increment increments `a` from 5 to 6 and yields 6.\n2. `b++`: Post-increment yields current value 10, then increments `b` to 11.\n3. `a`: Current value of `a` is 6.\nExpression: $6 + 10 + 6 = 22$.\nValues: `res = 22, a = 6, b = 11`.",
    "companyTags": [
      "Accenture",
      "Capgemini",
      "Cognizant GenC Next"
    ],
    "company_tags": [
      "Accenture",
      "Capgemini",
      "Cognizant GenC Next"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 46,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-47",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What will be printed by the following pseudo-code involving variable shadowing in nested blocks?",
    "codeSnippet": "Integer x = 10\nbegin\n    Integer x = 20\n    x = x + 5\nend\nPrint x",
    "code_snippet": "Integer x = 10\nbegin\n    Integer x = 20\n    x = x + 5\nend\nPrint x",
    "options": [
      "10",
      "25",
      "15",
      "20"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "The inner block declares a local variable `x` that shadows the outer `x`. Modifying `x = x + 5` alters only the inner `x` (making it 25). Once the inner block terminates, the inner `x` goes out of scope and is destroyed. The outer `x` remains untouched at 10.",
    "companyTags": [
      "Accenture",
      "Infosys SP",
      "TCS Digital"
    ],
    "company_tags": [
      "Accenture",
      "Infosys SP",
      "TCS Digital"
    ],
    "difficulty": "BASIC",
    "sort_order": 47,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-48",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the output of the following integer division truncation pseudo-code?",
    "codeSnippet": "Integer p = 7, q = 2\nFloat ans\nans = (p / q) * 4.0\nPrint ans",
    "code_snippet": "Integer p = 7, q = 2\nFloat ans\nans = (p / q) * 4.0\nPrint ans",
    "options": [
      "12.0",
      "14.0",
      "14",
      "12"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "Because both `p` (7) and `q` (2) are integers, integer division `p / q` truncates toward zero, yielding integer `3` (not 3.5). Then multiplying by `4.0` casts 3 to a float and evaluates $3 \\times 4.0 = 12.0$.",
    "companyTags": [
      "Capgemini",
      "Accenture",
      "TCS Prime"
    ],
    "company_tags": [
      "Capgemini",
      "Accenture",
      "TCS Prime"
    ],
    "difficulty": "MEDIUM",
    "sort_order": 48,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-49",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What will be printed after evaluating this bitwise shift and mask sequence?",
    "codeSnippet": "Integer val = 29\nSet val = (val >> 2) & 7\nPrint val",
    "code_snippet": "Integer val = 29\nSet val = (val >> 2) & 7\nPrint val",
    "options": [
      "7",
      "5",
      "3",
      "1"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "- $val = 29 = (11101)_2$.\n- $val \\gg 2 = \\lfloor 29 / 4 \\rfloor = 7 = (00111)_2$.\n- $7 \\& 7 = (00111)_2 \\& (00111)_2 = 7$.\nOutput is 7.",
    "companyTags": [
      "Accenture",
      "Capgemini",
      "Goldman Sachs"
    ],
    "company_tags": [
      "Accenture",
      "Capgemini",
      "Goldman Sachs"
    ],
    "difficulty": "HARD",
    "sort_order": 49,
    "is_hidden": false,
    "is_deleted": false
  },
  {
    "id": "mcq-pseudo-50",
    "topicId": "mcq-pseudo-code",
    "topic_id": "mcq-pseudo-code",
    "topic": "Campus OA Pseudo-Code",
    "topic_name": "Campus OA Pseudo-Code",
    "topicCategory": "PSEUDO_CODE",
    "topic_category": "PSEUDO_CODE",
    "questionType": "OUTPUT_PREDICTION",
    "question_type": "OUTPUT_PREDICTION",
    "question": "What is the final value of `total` after executing this loop with an increment step?",
    "codeSnippet": "Integer total = 0, i\nfor i = 1 to 10 step 3\n    total = total + i\nend for\nPrint total",
    "code_snippet": "Integer total = 0, i\nfor i = 1 to 10 step 3\n    total = total + i\nend for\nPrint total",
    "options": [
      "22",
      "18",
      "15",
      "25"
    ],
    "correctOptionIndex": 0,
    "correct_option_index": 0,
    "explanation": "The loop starts at $i = 1$ and increments by 3 on each step while $i \\le 10$:\n- $i = 1$: $total = 0 + 1 = 1$\n- $i = 4$: $total = 1 + 4 = 5$\n- $i = 7$: $total = 5 + 7 = 12$\n- $i = 10$: $total = 12 + 10 = 22$\n- Next $i = 13 > 10$, loop terminates.\nFinal value is 22.",
    "companyTags": [
      "Accenture",
      "TCS Digital",
      "Capgemini"
    ],
    "company_tags": [
      "Accenture",
      "TCS Digital",
      "Capgemini"
    ],
    "difficulty": "BASIC",
    "sort_order": 50,
    "is_hidden": false,
    "is_deleted": false
  }
];

export const ALL_TECHNICAL_MCQ_SEEDS: TechnicalMcq[] = [
  ...C_PROGRAMMING_MCQ_SEED,
  ...CPP_PROGRAMMING_MCQ_SEED,
  ...JAVA_PROGRAMMING_MCQ_SEED,
  ...PYTHON_PROGRAMMING_MCQ_SEED,
  ...OOPS_CONCEPTS_MCQ_SEED,
  ...DBMS_SYSTEMS_MCQ_SEED,
  ...OPERATING_SYSTEMS_MCQ_SEED,
  ...COMPUTER_NETWORKS_MCQ_SEED,
  ...DATA_STRUCTURES_MCQ_SEED,
  ...PSEUDO_CODE_MCQ_SEED,
];
