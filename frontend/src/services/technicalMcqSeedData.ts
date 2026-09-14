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
