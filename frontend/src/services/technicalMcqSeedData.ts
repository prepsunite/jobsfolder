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

export const ALL_TECHNICAL_MCQ_SEEDS: TechnicalMcq[] = [
  ...C_PROGRAMMING_MCQ_SEED,
  ...CPP_PROGRAMMING_MCQ_SEED,
];
