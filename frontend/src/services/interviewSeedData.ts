import type { InterviewQuestion } from '@/types/interview';

export const ALL_INTERVIEW_SEED_QUESTIONS: InterviewQuestion[] = [
  {
    "id": "int-java-001",
    "topic_id": "topic-java",
    "title": "What is Object-Oriented Programming (OOP) and what are its core pillars?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Object-Oriented Programming (OOP) is a programming paradigm based on the concept of 'objects', which contain data in the form of fields (attributes) and code in the form of procedures (methods). Java designs software architectures by modeling real-world entities into modular classes and objects.\n\nThe four fundamental pillars of OOP are:\n1. Encapsulation: Bundling data and methods into a single unit while restricting direct access using access modifiers.\n2. Abstraction: Hiding internal implementation details and exposing only essential interfaces to users.\n3. Inheritance: Reusing existing code and establishing an IS-A relationship between parent and child classes.\n4. Polymorphism: Performing a single action in different ways (compile-time overloading and runtime overriding).",
    "bullet_points": [
      "OOP models software systems as interacting objects containing state and behavior.",
      "The 4 pillars are Encapsulation (data hiding), Abstraction (complexity hiding), Inheritance (code reuse), and Polymorphism (many forms).",
      "OOP facilitates high maintainability, modularity, and scalability compared to procedural programming."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// Encapsulation + Abstraction Example\npublic class Account {\n    private double balance; // Data hiding\n\n    public double getBalance() {\n        return balance;\n    }\n    public void deposit(double amount) {\n        if (amount > 0) balance += amount;\n    }\n}"
    },
    "pro_tip": "When asked for real-world analogies, explain Encapsulation using a medical capsule or ATM machine, Abstraction using a car dashboard, and Polymorphism using a smartphone power button.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro",
      "Cognizant"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 1
  },
  {
    "id": "int-java-002",
    "topic_id": "topic-java",
    "title": "What is the difference between Object-Oriented Programming and Procedural Programming?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Procedural Programming (like C) is structured around functions, procedures, and sequential execution blocks where data flows openly between functions. In contrast, Object-Oriented Programming (like Java) revolves around objects and binds data closely with functions operating on that data.\n\nKey Differences:\n\u2022 Focus: Procedural focuses on 'how to do things' (algorithms & steps); OOP focuses on 'data and who does what' (objects & models).\n\u2022 Data Security: In procedural programming, global data can be altered by any function. In OOP, encapsulation and private access modifiers safeguard data from unauthorized modification.\n\u2022 Code Reusability: Procedural uses function libraries; OOP uses inheritance and polymorphism for extensibility.\n\u2022 Architecture: Procedural follows top-down design; OOP follows bottom-up design.",
    "bullet_points": [
      "Procedural focuses on step-by-step algorithms; OOP focuses on data modeling and objects.",
      "Procedural has low data security (open/global data); OOP guarantees data hiding via access specifiers.",
      "OOP follows a bottom-up architectural approach, whereas procedural programming follows top-down."
    ],
    "code_snippet": null,
    "pro_tip": "Remember: In procedural programming, functions dictate what happens to data. In OOP, objects own their data and invoke their own behaviors.",
    "company_tags": [
      "TCS",
      "Accenture",
      "Capgemini"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 2
  },
  {
    "id": "int-java-003",
    "topic_id": "topic-java",
    "title": "What is Java, who created it, and why was it originally named Oak?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Java is a high-level, class-based, object-oriented, and platform-independent programming language developed by James Gosling, Mike Sheridan, and Patrick Naughton at Sun Microsystems in 1991 (released publicly in 1995). Sun Microsystems was later acquired by Oracle Corporation in 2010.\n\nIt was originally named 'Oak' after an oak tree that stood outside James Gosling's office. Later, because 'Oak' was already registered as a trademark by Oak Technologies, the team renamed the project to 'Java', inspired by Java coffee from Indonesia.",
    "bullet_points": [
      "Invented by James Gosling and team at Sun Microsystems in 1991; released in 1995.",
      "Originally named 'Oak'; renamed to 'Java' due to trademark conflicts.",
      "Oracle Corporation acquired Sun Microsystems and currently stewards Java releases."
    ],
    "code_snippet": null,
    "pro_tip": "Interviewers often ask this as an ice-breaker question. Mentioning the transition from Oak to Java and Sun to Oracle demonstrates deep foundational knowledge.",
    "company_tags": [
      "TCS",
      "Wipro",
      "HCL"
    ],
    "frequency": "MEDIUM",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 3
  },
  {
    "id": "int-java-004",
    "topic_id": "topic-java",
    "title": "Why is Java known as Platform-Independent (Architecture-Neutral) and Portable?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Java achieves platform independence through its 'Write Once, Run Anywhere' (WORA) philosophy. When a Java program (.java) is compiled using javac, it is not compiled into machine-specific native binary code. Instead, it is converted into an intermediate, architecture-neutral format called Bytecode (.class).\n\nBytecode is not tied to any underlying CPU architecture or operating system. Any computer with a Java Virtual Machine (JVM) tailored for that specific OS can execute the same bytecode. Thus, while the JVM itself is platform-dependent, the compiled bytecode and Java code are completely platform-independent and portable.",
    "bullet_points": [
      "javac compiles .java source files into universal Bytecode (.class).",
      "Bytecode is architecture-neutral and executes on any machine equipped with a matching JVM.",
      "Crucial distinction: Java bytecode is platform-independent; the JVM itself is platform-dependent."
    ],
    "code_snippet": {
      "language": "text",
      "code": "Source Code (Demo.java)\n      \u2193 (javac compiler)\nBytecode (Demo.class - Universal)\n      \u2193\n[JVM for Windows]  [JVM for Linux]  [JVM for macOS]\n      \u2193                  \u2193                 \u2193\nNative Machine Code Native Machine Code Native Machine Code"
    },
    "pro_tip": "Never say 'JVM is platform-independent'. Interviewers love to catch candidates on this: JVM is OS-specific; Java programs and Bytecode are platform-independent.",
    "company_tags": [
      "Amazon",
      "TCS",
      "Infosys",
      "Oracle"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 4
  },
  {
    "id": "int-java-005",
    "topic_id": "topic-java",
    "title": "What is a Class and what is an Object in Java? Explain state, behavior, and identity.",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "\u2022 Class: A class is a blueprint, template, or prototype from which individual objects are created. It defines the attributes (data fields) and methods (behavior) that the objects created from it will possess. A class does not occupy memory space for instance variables until an object is instantiated.\n\n\u2022 Object: An object is a runtime instance of a class that has memory allocated on the Heap. Every object possesses three core characteristics:\n1. State: Represented by instance variables (attributes) storing specific values.\n2. Behavior: Represented by methods defining what operations the object can perform.\n3. Identity: A unique identifier (internally assigned by the JVM, usually reflected via hashcode or memory reference address) distinguishing it from all other objects, even if their states are identical.",
    "bullet_points": [
      "Class = logical blueprint; Object = physical runtime instance in Heap memory.",
      "Objects possess State (variables), Behavior (methods), and Identity (unique reference).",
      "A class consumes no heap memory for instance fields; objects allocate memory at runtime."
    ],
    "code_snippet": {
      "language": "java",
      "code": "public class Student {\n    // State\n    int id = 101;\n    String name = \"Chandu\";\n\n    // Behavior\n    void study() {\n        System.out.println(name + \" is studying.\");\n    }\n}\n\n// Instantiation\nStudent s1 = new Student(); // s1 is the reference variable, new Student() creates the object"
    },
    "pro_tip": "Emphasize that 'Student s1;' does NOT create an object\u2014it merely allocates 4 or 8 bytes on the Stack for a reference variable. The object is created when 'new' executes.",
    "company_tags": [
      "Infosys",
      "Wipro",
      "Cognizant"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 5
  },
  {
    "id": "int-java-006",
    "topic_id": "topic-java",
    "title": "What are Primitive Data Types in Java and what are their exact sizes and default values?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Java provides 8 strictly-defined primitive data types. Unlike languages where type sizes depend on OS architecture (e.g., C/C++ int on 16 vs 32 vs 64-bit systems), Java primitive types have strictly identical sizes across all hardware platforms:\n\n1. byte: 1 byte (8 bits), range: -128 to 127, default: 0\n2. short: 2 bytes (16 bits), range: -32,768 to 32,767, default: 0\n3. int: 4 bytes (32 bits), range: -2^31 to 2^31-1, default: 0\n4. long: 8 bytes (64 bits), range: -2^63 to 2^63-1, default: 0L\n5. float: 4 bytes (32 bits IEEE 754), default: 0.0f\n6. double: 8 bytes (64 bits IEEE 754), default: 0.0d\n7. char: 2 bytes (16-bit Unicode UTF-16), range: '\\u0000' (0) to '\\uffff' (65,535), default: '\\u0000'\n8. boolean: Size is not precisely specified by JVM specification (represented as int in bytecode, or 1-bit logic in arrays), default: false.",
    "bullet_points": [
      "Java has exactly 8 primitive data types with fixed cross-platform sizes.",
      "char in Java is 2 bytes (16-bit) because Java uses Unicode, unlike C which uses 1-byte ASCII.",
      "Default values only apply to class/instance variables, NOT local variables."
    ],
    "code_snippet": {
      "language": "java",
      "code": "byte b = 100;        // 1 byte\nshort s = 20000;     // 2 bytes\nint i = 100000;      // 4 bytes\nlong l = 100000L;    // 8 bytes\nfloat f = 5.75f;     // 4 bytes\ndouble d = 19.99;    // 8 bytes\nchar c = 'A';        // 2 bytes Unicode\nboolean ok = true;   // 1 bit logical"
    },
    "pro_tip": "Always highlight that char is 16-bit Unicode in Java (to support multilingual global characters), whereas in C it is 8-bit ASCII.",
    "company_tags": [
      "TCS",
      "Accenture",
      "Infosys"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 6
  },
  {
    "id": "int-java-007",
    "topic_id": "topic-java",
    "title": "What is an Anonymous Object in Java, and what is its typical use case?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "An anonymous object is an object that is instantiated without assigning it to a reference variable. Because it has no reference variable holding its memory address, it can only be used once at the point of creation. Once the method call completes, the object becomes immediately unreachable and eligible for Garbage Collection.\n\nTypical Use Cases:\n1. Calling a method only once when there is no need to store object state.\n2. Passing an object as an argument to a method or event listener.",
    "bullet_points": [
      "Created without a reference variable name (e.g., new Calculation().fact(5);).",
      "Used for one-time method invocations to conserve memory.",
      "Immediately becomes unreachable after invocation, eligible for Garbage Collection."
    ],
    "code_snippet": {
      "language": "java",
      "code": "class Calculation {\n    void fact(int n) {\n        int fact = 1;\n        for (int i = 1; i <= n; i++) fact *= i;\n        System.out.println(\"Factorial: \" + fact);\n    }\n}\n\npublic class Test {\n    public static void main(String[] args) {\n        // Anonymous object creation and method call\n        new Calculation().fact(5);\n    }\n}"
    },
    "pro_tip": "Point out that anonymous objects reduce memory footprint when you only need a single method execution without retaining object state.",
    "company_tags": [
      "TCS",
      "Wipro",
      "Mindtree"
    ],
    "frequency": "MEDIUM",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 7
  },
  {
    "id": "int-java-008",
    "topic_id": "topic-java",
    "title": "What are Identifiers in Java, and what are the strict naming rules?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "An identifier in Java is a symbolic name given to programming elements such as classes, variables, methods, packages, and interfaces.\n\nStrict Identifier Rules:\n1. Character set: Can contain uppercase letters (A-Z), lowercase letters (a-z), digits (0-9), dollar sign ($), and underscore (_).\n2. First Character: Must NOT begin with a digit (e.g., `1student` is invalid; `student1` is valid).\n3. Case Sensitivity: Java identifiers are strictly case-sensitive (`Total` and `total` are distinct).\n4. Reserved Keywords: Cannot use Java reserved keywords (e.g., `class`, `public`, `int`, `static`, `goto`).\n5. Length: There is no limit on the length of an identifier, though standard convention recommends readable names.\n6. Special Characters: Cannot contain whitespace or special symbols like `#`, `@`, `-`, `+`.",
    "bullet_points": [
      "Allowed characters: a-z, A-Z, 0-9, $, _.",
      "Must NOT start with a digit; cannot be a Java keyword.",
      "Identifiers are strictly case-sensitive and have no compiler length limit."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// Valid Identifiers\nint totalScore;\nint _count;\nint $value;\nint a2z;\n\n// Invalid Identifiers (Compilation Errors)\n// int 2count;   // Starts with digit\n// int class;    // Reserved keyword\n// int user-name;// Hyphen not permitted"
    },
    "pro_tip": "Beware of tricky interview questions: '$' and '_' ARE valid starting characters. Even '$123' or '_foo' are 100% valid Java identifiers.",
    "company_tags": [
      "Infosys",
      "TCS",
      "Capgemini"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 8
  },
  {
    "id": "int-java-009",
    "topic_id": "topic-java",
    "title": "What is the difference between Local Variables, Instance Variables, and Static Variables?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Java supports three categories of variables based on scope, lifetime, and memory location:\n\n1. Local Variables: Declared inside methods, constructors, or blocks. Created when the method is invoked and destroyed when it exits. Stored on the Stack. They DO NOT receive default values and must be initialized before use.\n\n2. Instance Variables: Declared inside a class but outside methods. Tied to an object instance and stored on the Heap inside that object. Created with `new` and destroyed when the object is garbage collected. Automatically receive default values (0, null, false).\n\n3. Static (Class) Variables: Declared with the `static` keyword inside a class. Tied to the class itself rather than instances. Stored in Metaspace / Method Area. Only ONE copy exists shared across all instances. Created when the class is loaded by the ClassLoader.",
    "bullet_points": [
      "Local: inside method, Stack memory, no default values, method lifetime.",
      "Instance: inside class, Heap memory (per object), receives default values, object lifetime.",
      "Static: single shared copy per class, Metaspace / Method Area, class lifetime."
    ],
    "code_snippet": {
      "language": "java",
      "code": "public class Employee {\n    static String company = \"Prepunite\"; // Static variable (1 copy)\n    int empId;                           // Instance variable (per object)\n\n    void calculateSalary() {\n        int bonus = 5000;                // Local variable (Stack frame)\n        System.out.println(empId + \": \" + (bonus + 50000));\n    }\n}"
    },
    "pro_tip": "A common trap: Accessing an uninitialized local variable causes a compile-time error ('variable might not have been initialized'), whereas uninitialized instance fields safely default to 0/null/false.",
    "company_tags": [
      "Amazon",
      "TCS",
      "Infosys"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 9
  },
  {
    "id": "int-java-010",
    "topic_id": "topic-java",
    "title": "What is the significance of the 'public static void main(String[] args)' signature in Java?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Each keyword in Java's main method declaration serves an essential purpose for the JVM runtime:\n\n\u2022 public: Access modifier that allows the JVM (which resides outside the class package) to locate and invoke the method from anywhere.\n\u2022 static: Allows the JVM to invoke the method without instantiating an object of the class first. Without static, JVM would not know which constructor to call or how to pass parameters.\n\u2022 void: Specifies that the method does not return any value to the operating system or JVM when it finishes.\n\u2022 main: The identifier name configured inside the JVM launch protocol as the program entry point.\n\u2022 String[] args: An array of String objects used to pass command-line arguments into the application.",
    "bullet_points": [
      "public: Accessible globally by the JVM runtime launcher.",
      "static: Executed by JVM without creating a class instance.",
      "void: No return value required by the OS upon exit.",
      "String[] args: Accepts command-line parameters passed at startup."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// Valid alternative forms of main signature:\nstatic public void main(String[] args)    // public and static can swap\npublic static void main(String... args)   // varargs syntax is 100% legal\npublic static void main(String args[])    // C-style array syntax is legal"
    },
    "pro_tip": "Showcase your knowledge: Mention that order of 'public' and 'static' does not matter ('static public void main' compiles and runs identically), and varargs ('String... args') is completely valid.",
    "company_tags": [
      "Microsoft",
      "Amazon",
      "Oracle"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 10
  },
  {
    "id": "int-java-011",
    "topic_id": "topic-java",
    "title": "What are the differences between Primitive and Non-Primitive (Reference) Data Types?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "\u2022 Memory Storage: Primitive variables directly hold their actual value directly on the Stack (or inline inside the object on the Heap if it's an instance variable). Non-primitive (reference) variables store the 32-bit or 64-bit memory address referencing an object allocated on the Heap.\n\n\u2022 Creation: Primitives are built-in types defined by the Java language (`int`, `char`, etc.); reference types are created by programmers or Java libraries (Classes, Interfaces, Arrays, Enums, Strings).\n\n\u2022 Default Values: Uninitialized instance primitives default to 0, 0.0, '\\u0000', or false. Uninitialized reference variables always default to `null`.\n\n\u2022 Methods: Primitives cannot invoke methods (e.g., `x.toString()` fails for `int x`). Reference types can invoke object methods.",
    "bullet_points": [
      "Primitives store raw bits directly; Reference types store Heap memory pointers.",
      "Default value for primitives is 0/false; for all reference types, it is null.",
      "Primitives are fixed-size language keywords; reference types are instantiated objects."
    ],
    "code_snippet": {
      "language": "java",
      "code": "int a = 10;                     // Stored directly in Stack frame\nString s = new String(\"hello\"); // 's' is on Stack, points to String object on Heap"
    },
    "pro_tip": "When you assign one reference variable to another (`b = a`), both variables point to the identical object on the Heap. Modifying through `b` reflects in `a`.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 11
  },
  {
    "id": "int-java-012",
    "topic_id": "topic-java",
    "title": "What is the default value of an unassigned object reference variable in Java?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "The default value of any unassigned reference variable (whether it references a Class, Interface, Array, or String) is `null`.\n\nHowever, this default value only applies if the reference variable is an instance field (attribute of a class) or a static class field. If a reference variable is declared as a local variable inside a method and left unassigned, Java does NOT assign `null`. Attempting to read it results in a compile-time error: 'variable may not have been initialized'.",
    "bullet_points": [
      "Instance reference variables automatically default to null upon object creation.",
      "null signifies that the reference variable does not point to any object in Heap memory.",
      "Local reference variables receive no default and must be explicitly initialized."
    ],
    "code_snippet": {
      "language": "java",
      "code": "public class Demo {\n    String name; // Instance variable -> defaults to null\n\n    void check() {\n        String localStr; // Local variable -> NO default value\n        // System.out.println(localStr); // COMPILE ERROR: not initialized\n        System.out.println(name);        // Prints: null\n    }\n}"
    },
    "pro_tip": "Interviewers love testing whether you realize that local variables never receive default values, whereas instance fields do.",
    "company_tags": [
      "TCS",
      "Accenture"
    ],
    "frequency": "MEDIUM",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 12
  },
  {
    "id": "int-java-013",
    "topic_id": "topic-java",
    "title": "What are the three ways to initialize the state of an Object in Java?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "In Java, an object's state (its instance fields) can be initialized in three standard ways:\n\n1. By Reference Variable: Directly modifying public/package-private fields using dot notation (`s1.name = \"Alice\";`). Generally discouraged in production because it breaks Encapsulation.\n2. By Method: Invoking a setter or initialization method (`s1.insertRecord(101, \"Alice\");`) that validates and sets private fields.\n3. By Constructor: Passing initial parameters during object instantiation via `new Student(101, \"Alice\");`. This is the industry standard practice as it guarantees the object is born in a valid, consistent state.",
    "bullet_points": [
      "Direct reference assignment: s.id = 1; (violates encapsulation).",
      "Method invocation: s.setData(1, 'Alice'); (allows validation).",
      "Constructor invocation: Student s = new Student(1, 'Alice'); (best practice)."
    ],
    "code_snippet": {
      "language": "java",
      "code": "public class Student {\n    private int id;\n    private String name;\n\n    // Constructor initialization (Best Practice)\n    public Student(int id, String name) {\n        this.id = id;\n        this.name = name;\n    }\n}"
    },
    "pro_tip": "State that initializing via Constructors is the cleanest approach because it enforces object invariants and prevents creating partially initialized objects.",
    "company_tags": [
      "Infosys",
      "Cognizant"
    ],
    "frequency": "MEDIUM",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 13
  },
  {
    "id": "int-java-014",
    "topic_id": "topic-java",
    "title": "Can a Java source file have multiple classes? What are the naming rules?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Yes, a single Java source file (`.java`) can contain multiple classes, but under strict compilation rules:\n\n1. Only ONE class in the file can be declared `public`.\n2. The name of the file MUST match the name of that public class exactly (including case). For example, if class `MainEngine` is public, the file must be named `MainEngine.java`.\n3. If there are no public classes in the file, the file name can be any arbitrary identifier.\n4. When compiled with `javac`, the compiler creates a SEPARATE `.class` file for every single class defined in the source file.",
    "bullet_points": [
      "At most one public class per .java file.",
      "File name must strictly match the public class name.",
      "javac produces separate .class bytecode files for every class in the source file."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// File: University.java\npublic class University {\n    // Public class matches file name\n}\nclass Department {\n    // Non-public helper class\n}\nclass Professor {\n    // Non-public helper class\n}\n// Compilation creates: University.class, Department.class, Professor.class"
    },
    "pro_tip": "Mention that inner classes or nested classes do not violate this rule, and each produces a Class$Inner.class bytecode artifact.",
    "company_tags": [
      "TCS",
      "Infosys"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 14
  },
  {
    "id": "int-java-015",
    "topic_id": "topic-java",
    "title": "Explain the difference between JDK, JRE, and JVM with their internal architectures.",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "\u2022 JVM (Java Virtual Machine): An abstract runtime engine responsible for executing Java bytecode. It manages runtime memory (Heap, Stack), performs bytecode verification, executes instructions via the Execution Engine (Interpreter + JIT), and handles automatic Garbage Collection. It is platform-dependent.\n\n\u2022 JRE (Java Runtime Environment): The runtime package needed to run compiled Java applications. It contains the JVM along with core Java Class Libraries (rt.jar / java.base) and supporting files. It contains NO development tools (no javac or debugger).\n\n\u2022 JDK (Java Development Kit): The full-featured software development environment needed to develop, compile, and run Java programs. It is a superset containing JRE + JVM + Development Tools (javac, jdb, javadoc, jar).",
    "bullet_points": [
      "JDK = JRE + Development Tools (javac, jdb, jar).",
      "JRE = JVM + Core Class Libraries (java.base, rt.jar).",
      "JVM = Execution Engine (Interpreter + JIT) + ClassLoader + Runtime Memory."
    ],
    "code_snippet": {
      "language": "text",
      "code": "\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 JDK (Java Development Kit)                             \u2502\n\u2502  Development Tools: javac, jdb, javap, jar, javadoc   \u2502\n\u2502 \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510 \u2502\n\u2502 \u2502 JRE (Java Runtime Environment)                     \u2502 \u2502\n\u2502 \u2502  Core Class Libraries (java.lang, java.util, etc.) \u2502 \u2502\n\u2502 \u2502 \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510 \u2502 \u2502\n\u2502 \u2502 \u2502 JVM (Java Virtual Machine)                     \u2502 \u2502 \u2502\n\u2502 \u2502 \u2502  ClassLoader \u2022 JIT Compiler \u2022 GC \u2022 Memory areas\u2502 \u2502 \u2502\n\u2502 \u2502 \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518 \u2502 \u2502\n\u2502 \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518 \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518"
    },
    "pro_tip": "To summarize instantly in an interview: 'JVM runs bytecode, JRE provides the environment to run it, JDK provides tools to write and compile it.'",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Oracle",
      "TCS"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 15
  },
  {
    "id": "int-java-016",
    "topic_id": "topic-java",
    "title": "What are the Runtime Memory Areas allotted by the JVM during execution?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "The JVM divides system memory into 5 distinct runtime data areas:\n\n1. Method Area / Metaspace: Stores class-level data, bytecode, method metadata, runtime constant pool, and static variables. (In Java 8+, Metaspace replaced PermGen and uses native memory).\n2. Heap Area: The shared runtime memory where all Java objects and arrays are allocated via `new`. Managed by the Garbage Collector.\n3. JVM Stack: Created per thread. Stores stack frames containing local variables, operand stacks, and partial results. Destroyed when the method returns.\n4. PC (Program Counter) Register: Created per thread. Holds the memory address of the JVM instruction currently being executed by that thread.\n5. Native Method Stack: Created per thread. Contains state and stack frames for native C/C++ methods called via JNI (Java Native Interface).",
    "bullet_points": [
      "Heap & Metaspace are shared across all threads; Stack, PC, and Native Stack are per-thread.",
      "Objects are allocated in Heap; local variables and method calls reside on Stack.",
      "Out of Memory: StackOverflowError happens on Stack; OutOfMemoryError happens on Heap/Metaspace."
    ],
    "code_snippet": null,
    "pro_tip": "Crucial distinction: Method Area & Heap are thread-shared (accessible to all threads); JVM Stack, PC Register, and Native Stack are strictly thread-private.",
    "company_tags": [
      "Amazon",
      "Google",
      "Goldman Sachs"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 16
  },
  {
    "id": "int-java-017",
    "topic_id": "topic-java",
    "title": "What is the ClassLoader subsystem in JVM and how does the Delegation Hierarchy work?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "The ClassLoader subsystem is responsible for dynamically loading, linking, and initializing compiled `.class` files into JVM memory at runtime.\n\nIt follows the Delegation Hierarchy Principle:\n1. Bootstrap ClassLoader: Written in native C/C++; loads core Java API classes from `<JAVA_HOME>/lib` (e.g., `java.lang.Object`, `rt.jar`). Has no parent ClassLoader.\n2. Extension / Platform ClassLoader: Loads classes from extension directories or platform modules (`<JAVA_HOME>/lib/ext`). Child of Bootstrap.\n3. Application / System ClassLoader: Loads application-specific classes located on the application CLASSPATH or module-path. Child of Platform ClassLoader.\n\nHow Delegation Works: When a class load request is made, a ClassLoader delegates the request to its parent before attempting to load it itself. Only if the parent fails (ClassNotFoundException) does the child attempt to load the class.",
    "bullet_points": [
      "3 standard loaders: Bootstrap (core runtime) -> Platform/Extension -> Application (classpath).",
      "Delegation order: Always asks parent first before attempting local loading.",
      "Protects security: Prevents rogue user code from overriding core classes like java.lang.String."
    ],
    "code_snippet": {
      "language": "java",
      "code": "System.out.println(String.class.getClassLoader()); // null (Bootstrap ClassLoader represented as null)\nSystem.out.println(MyClass.class.getClassLoader()); // jdk.internal.loader.ClassLoaders$AppClassLoader"
    },
    "pro_tip": "Why does `String.class.getClassLoader()` return `null`? Because the Bootstrap ClassLoader is written in native C/C++, not a Java object, so JVM returns null.",
    "company_tags": [
      "Oracle",
      "Amazon",
      "Uber"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 17
  },
  {
    "id": "int-java-018",
    "topic_id": "topic-java",
    "title": "What is the JIT (Just-In-Time) Compiler and how does it speed up JVM execution?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "The JVM Execution Engine originally used an Interpreter, which reads and translates bytecode instructions line-by-line into native machine code. While the interpreter starts fast, executing repeated code (loops, hot methods) line-by-line is slow.\n\nThe JIT (Just-In-Time) Compiler solves this performance bottleneck:\n\u2022 Hotspot Detection: As the program executes, the JVM monitors bytecode execution to identify frequently called code segments known as 'Hot Spots'.\n\u2022 Native Compilation: The JIT compiler compiles these hot bytecode sequences directly into optimized native CPU machine code.\n\u2022 Caching: The compiled native code is cached in the Code Cache. Future invocations execute the cached native machine code directly without interpretation.\n\nModern JVMs use tiered compilation (C1 Client compiler for quick startup, C2 Server compiler for aggressive long-term optimizations like method inlining, loop unrolling, and dead-code elimination).",
    "bullet_points": [
      "Interpreter translates line-by-line; JIT compiles hot methods once into native machine code.",
      "Hot spots are identified via method counters and loop back-edge counters.",
      "Result: Java achieves near-native C++ runtime execution speeds after JIT warm-up."
    ],
    "code_snippet": null,
    "pro_tip": "State clearly: Java is NEITHER purely compiled NOR purely interpreted. It is compiled to bytecode by javac, and then interpreted + JIT-compiled at runtime by JVM.",
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 18
  },
  {
    "id": "int-java-019",
    "topic_id": "topic-java",
    "title": "What is the Bytecode Verifier and why is it vital for Java security?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "The Bytecode Verifier is a core component of the JVM's ClassLoader linking phase. Before any loaded `.class` bytecode is passed to the Execution Engine, the Bytecode Verifier rigorously inspects the bytecode instructions to verify security and structural integrity.\n\nKey Verifications Performed:\n1. Stack Overflow/Underflow: Verifies that operand stack operations do not cause stack overflow or underflow.\n2. Type Safety: Ensures parameters to bytecode instructions always have the correct, compatible data types.\n3. Access Control: Checks that private and protected members are not accessed illegally.\n4. Pointer Forgery: Ensures bytecode does not forge memory pointers or directly manipulate memory addresses.\n5. Method Signatures: Verifies that method calls match declared signatures and return types.\n\nThis guarantees that untrusted bytecode downloaded over a network cannot compromise the host operating system.",
    "bullet_points": [
      "Runs during the linking phase before code execution begins.",
      "Prevents memory corruption, pointer forgery, and type violations.",
      "Essential for Java's sandbox security model when running remote or untrusted code."
    ],
    "code_snippet": null,
    "pro_tip": "Mention that bytecode verification is what allows Java to safely run applets or untrusted microservices without crashing the OS.",
    "company_tags": [
      "Oracle",
      "Cisco",
      "TCS"
    ],
    "frequency": "MEDIUM",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 19
  },
  {
    "id": "int-java-020",
    "topic_id": "topic-java",
    "title": "Explain the difference between Heap Memory and Stack Memory in Java.",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Java divides runtime memory allocation between the Stack and the Heap:\n\n\u2022 Stack Memory:\n- Scope: Thread-private; each thread has its own call stack.\n- Content: Stores local primitive variables and references pointing to Heap objects.\n- Allocation: LIFO (Last-In-First-Out); allocated when a method is entered and freed immediately when the method returns.\n- Speed: Extremely fast access.\n- Error: Throws `java.lang.StackOverflowError` if stack frames exceed allocated limit.\n\n\u2022 Heap Memory:\n- Scope: Shared globally across all threads in the JVM.\n- Content: Stores all instantiated objects, arrays, and instance variables.\n- Allocation: Dynamic allocation using `new` operator; memory remains allocated until reclaimed by the Garbage Collector.\n- Speed: Slower allocation and access due to synchronization and GC overhead.\n- Error: Throws `java.lang.OutOfMemoryError: Java heap space` when heap space is exhausted.",
    "bullet_points": [
      "Stack: thread-private, LIFO, stores local variables and object references, fast.",
      "Heap: shared globally, stores actual objects and instance variables, managed by GC.",
      "StackOverflowError occurs on Stack; OutOfMemoryError occurs on Heap."
    ],
    "code_snippet": {
      "language": "java",
      "code": "public void allocate() {\n    int x = 42;             // Primitive 'x' is on the Stack frame\n    Student s = new Student(); // Reference 's' is on the Stack, object is on the Heap\n}"
    },
    "pro_tip": "Always remember: In `Student s = new Student();`, 's' is on the Stack; the actual Student object with its fields is on the Heap.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Flipkart"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 20
  },
  {
    "id": "int-java-021",
    "topic_id": "topic-java",
    "title": "What is the difference between '==' operator and '.equals()' method in Java?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "\u2022 '==' Operator: A reference comparison operator. It checks whether two variables point to the exact same memory location on the Heap (reference equality). For primitives, it compares raw values.\n\n\u2022 '.equals()' Method: A method defined in `java.lang.Object`. In the base Object class, it defaults to reference comparison (`this == obj`). However, standard Java classes (like `String`, `Integer`, `Date`, etc.) override `.equals()` to perform value/content comparison.\n\nKey Rule: For objects where you want to compare logical content rather than memory address, always use `.equals()` and override `hashCode()` alongside it.",
    "bullet_points": [
      "'==' compares memory addresses (or primitive values).",
      "'.equals()' compares logical content when overridden (like in String, Integer).",
      "If .equals() is not overridden in your custom class, it defaults to '=='."
    ],
    "code_snippet": {
      "language": "java",
      "code": "String s1 = new String(\"hello\");\nString s2 = new String(\"hello\");\n\nSystem.out.println(s1 == s2);      // false (distinct Heap memory addresses)\nSystem.out.println(s1.equals(s2));  // true (identical character sequence)"
    },
    "pro_tip": "When defining custom classes, if you override `.equals()`, you MUST override `hashCode()` to satisfy the general contract: equal objects must have equal hash codes.",
    "company_tags": [
      "Amazon",
      "Adobe",
      "TCS",
      "Infosys"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 21
  },
  {
    "id": "int-java-022",
    "topic_id": "topic-java",
    "title": "Why are Strings Immutable in Java? What are the key architectural advantages?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "In Java, String objects are immutable, meaning once a String instance is created, its internal character sequence cannot be altered or modified. Any method that appears to modify a String (like `.concat()`, `.replace()`, `.toUpperCase()`) actually instantiates a brand new String on the Heap.\n\nKey Advantages of Immutability:\n1. String Constant Pool (SCP): Allows multiple reference variables to share the same String literal, saving massive amounts of Heap memory.\n2. Thread Safety: Immutable objects are inherently thread-safe without requiring synchronized blocks or locks.\n3. Security: Sensitive parameters (database URLs, user credentials, network sockets) are passed as Strings. Immutability guarantees that a rogue thread cannot alter these values after verification.\n4. HashCode Caching: Since String content never changes, its `hashCode()` is calculated once and cached (`hash` field in String class), making HashMap lookups lightning fast.",
    "bullet_points": [
      "Enables String Constant Pool (SCP) memory sharing.",
      "Guarantees thread safety with zero locking overhead.",
      "Crucial for security (file paths, DB connections, network endpoints).",
      "Enables hashcode caching for high-performance HashMap key lookups."
    ],
    "code_snippet": {
      "language": "java",
      "code": "String s1 = \"Java\";\ns1.concat(\" SE\"); // Returns new String \"Java SE\", but s1 still points to \"Java\"\nSystem.out.println(s1); // Prints: Java\n\ns1 = s1.concat(\" SE\"); // Now s1 reference points to the new String object"
    },
    "pro_tip": "If asked 'How to implement your own immutable class?', explain: Make class final, make all fields private final, do not provide setters, and return deep copies in getters.",
    "company_tags": [
      "Google",
      "Amazon",
      "Oracle",
      "Goldman Sachs"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 22
  },
  {
    "id": "int-java-023",
    "topic_id": "topic-java",
    "title": "What is the String Constant Pool (SCP) and how does String.intern() work?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "The String Constant Pool (SCP) is a specialized memory storage area inside the Java Heap (previously in PermGen prior to Java 7) that stores unique String literals.\n\n\u2022 Literal Creation (`String s = \"test\";`): The JVM checks the SCP. If \"test\" already exists, it returns a reference to the existing instance; if not, it creates a new String in the SCP and returns that reference.\n\n\u2022 Operator `new` (`String s = new String(\"test\");`): Bypasses pool deduplication. It creates a brand new String object on the non-pool Heap, while also ensuring \"test\" is placed in the SCP if not already present.\n\n\u2022 `String.intern()`: When invoked on a String object, `intern()` checks if an equal String exists in the SCP. If present, it returns the reference from the SCP; otherwise, it adds the String to the SCP and returns its reference.",
    "bullet_points": [
      "Located in the Java Heap (since Java 7).",
      "Prevents duplicate String objects for identical literals, saving memory.",
      "s.intern() returns the canonical reference from the String Constant Pool."
    ],
    "code_snippet": {
      "language": "java",
      "code": "String s1 = \"cat\";\nString s2 = new String(\"cat\");\nString s3 = s2.intern();\n\nSystem.out.println(s1 == s2); // false (Heap vs Pool)\nSystem.out.println(s1 == s3); // true (Both refer to same Pool object)"
    },
    "pro_tip": "In Java 7+, the String pool moved from PermGen to the regular Heap area. This prevents PermGen OutOfMemoryError exceptions caused by large numbers of interned strings.",
    "company_tags": [
      "Microsoft",
      "Amazon",
      "Salesforce"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 23
  },
  {
    "id": "int-java-024",
    "topic_id": "topic-java",
    "title": "What is the difference between String, StringBuilder, and StringBuffer?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "\u2022 String: Immutable. Any modification creates a new object on the Heap. Suitable when data changes rarely or when thread-safe immutable sharing is required.\n\n\u2022 StringBuffer: Mutable sequence of characters. Allows in-place modifications (`.append()`, `.insert()`). Every method in StringBuffer is `synchronized`, making it thread-safe for concurrent access, but introducing synchronization performance overhead.\n\n\u2022 StringBuilder: Mutable sequence of characters introduced in Java 5. Identical API to StringBuffer, but its methods are NOT synchronized. As a result, it is significantly faster and is the recommended default choice for single-threaded string manipulations.",
    "bullet_points": [
      "String is Immutable; StringBuilder and StringBuffer are Mutable.",
      "StringBuffer is Synchronized (Thread-safe, slower).",
      "StringBuilder is Non-Synchronized (Not thread-safe, fastest; best for single threads)."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// Bad: Creates 1000 intermediate String objects on Heap\nString s = \"\";\nfor (int i = 0; i < 1000; i++) s += i;\n\n// Good: Mutates single internal buffer\nStringBuilder sb = new StringBuilder();\nfor (int i = 0; i < 1000; i++) sb.append(i);"
    },
    "pro_tip": "In single-threaded applications (like 95% of typical methods), always use StringBuilder over StringBuffer for superior throughput.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Walmart",
      "Wipro"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 24
  },
  {
    "id": "int-java-025",
    "topic_id": "topic-java",
    "title": "What is Garbage Collection (GC) in Java and how does an object become eligible for GC?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Garbage Collection (GC) is the automatic memory management process in the JVM that reclaims Heap memory occupied by unreferenced (unreachable) objects.\n\nAn object becomes eligible for GC when there are no live references pointing to it from any GC Root (GC Roots include active thread stacks, local variables, static variables, and JNI references).\n\nFour Common Ways Objects Become Eligible for GC:\n1. Nullifying Reference Variable: `s1 = null;` (the object previously pointed to by `s1` loses its reference).\n2. Reassigning Reference Variable: `s1 = new Student(); s1 = s2;` (the first Student object has no references).\n3. Object Created Inside a Method: When a method finishes execution, its local stack frame pops; objects created locally without being returned become immediately unreachable.\n4. Island of Isolation: Objects that reference each other in a cycle, but none have references from any active GC Root.",
    "bullet_points": [
      "JVM automatically cleans unreferenced objects from the Heap.",
      "Eligibility: Object cannot be reached by traversing references from any GC Root.",
      "System.gc() requests GC execution, but does not guarantee immediate invocation."
    ],
    "code_snippet": {
      "language": "java",
      "code": "Student s1 = new Student(\"Alice\");\nStudent s2 = new Student(\"Bob\");\n\ns1 = s2; // \"Alice\" object is now unreachable and eligible for GC"
    },
    "pro_tip": "Emphasize the 'Island of Isolation': If Object A references B, and B references A, but neither is referenced from stack/static roots, BOTH are collected by the JVM tracing collector.",
    "company_tags": [
      "Oracle",
      "Amazon",
      "Morgan Stanley"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 25
  },
  {
    "id": "int-java-026",
    "topic_id": "topic-java",
    "title": "What is the difference between 'final', 'finally', and 'finalize()' in Java?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Although they share similar names, they have completely unrelated purposes:\n\n\u2022 final (Keyword): Used to apply restrictions:\n  - final variable: Value becomes constant and cannot be reassigned.\n  - final method: Cannot be overridden by child subclasses.\n  - final class: Cannot be inherited (prevents subclassing, e.g., `java.lang.String`).\n\n\u2022 finally (Block): A block associated with a `try-catch` structure. It ALWAYS executes whether an exception is thrown, caught, or unhandled. Used for resource cleanup (closing DB connections, streams).\n\n\u2022 finalize() (Method): A protected method defined in `java.lang.Object`. Historically invoked by the Garbage Collector just before an object is reclaimed. (Note: Deprecated in Java 9 and removed/disallowed in modern Java due to unpredictable execution timing; replaced by `AutoCloseable` and `Cleaner`).",
    "bullet_points": [
      "final: modifier for constants, non-overridable methods, and non-inheritable classes.",
      "finally: block in exception handling that always runs for resource cleanup.",
      "finalize(): deprecated method called before GC cleanup (superseded by try-with-resources)."
    ],
    "code_snippet": {
      "language": "java",
      "code": "final int MAX = 100; // Constant\n\ntry {\n    int res = 10 / 0;\n} catch (ArithmeticException e) {\n    System.out.println(\"Caught error\");\n} finally {\n    System.out.println(\"Always executes!\"); // Resource cleanup\n}"
    },
    "pro_tip": "Always point out that finalize() was deprecated in Java 9 because it has unpredictable execution latency and can cause deadlocks.",
    "company_tags": [
      "TCS",
      "Cognizant",
      "Infosys"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 26
  },
  {
    "id": "int-java-027",
    "topic_id": "topic-java",
    "title": "Explain the difference between Method Overloading and Method Overriding in Java.",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "\u2022 Method Overloading (Compile-Time / Static Polymorphism):\n- Occurs within the same class (or across inherited classes).\n- Methods share the same name but MUST have different parameter lists (different number of arguments, different data types, or different sequence of types).\n- Return type CANNOT be the only differentiator (changing return type alone causes compile error).\n- Resolved at compile time based on reference type.\n\n\u2022 Method Overriding (Run-Time / Dynamic Polymorphism):\n- Occurs between a subclass and a superclass (IS-A relationship).\n- Method name, parameter list, and return type (or covariant return type) MUST be identical.\n- Access modifier cannot be more restrictive than the parent method.\n- Resolved at runtime based on the actual object instance.",
    "bullet_points": [
      "Overloading: same class, different parameters, resolved at compile-time.",
      "Overriding: parent-child class, identical signature, resolved at runtime via dynamic dispatch.",
      "Private, static, and final methods CANNOT be overridden."
    ],
    "code_snippet": {
      "language": "java",
      "code": "class Calculator {\n    // Overloading\n    int add(int a, int b) { return a + b; }\n    double add(double a, double b) { return a + b; }\n}\n\nclass Animal {\n    void sound() { System.out.println(\"Animal sound\"); }\n}\nclass Dog extends Animal {\n    // Overriding\n    @Override\n    void sound() { System.out.println(\"Bark\"); }\n}"
    },
    "pro_tip": "Can you overload main()? Yes, you can have multiple overloaded `main()` methods in Java, but the JVM will only call the standard `main(String[] args)` as the entry point.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "TCS"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 27
  },
  {
    "id": "int-java-028",
    "topic_id": "topic-java",
    "title": "Why doesn't Java support Multiple Inheritance through Classes, and how does it solve the Diamond Problem?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Java deliberately avoids multiple inheritance of classes to prevent ambiguity known as the 'Diamond Problem'.\n\nScenario: Suppose class A has a method `display()`. Classes B and C both inherit from A and override `display()`. If class D were allowed to extend both B and C (`class D extends B, C`), which version of `display()` should D inherit when `d.display()` is called? The compiler cannot resolve whether to call B's or C's implementation.\n\nHow Java Solves It:\n1. Classes: A class can only extend ONE superclass (`single inheritance`).\n2. Interfaces: A class can implement multiple interfaces. Prior to Java 8, interfaces contained only method declarations without bodies, eliminating method implementation ambiguity.\n3. Default Methods (Java 8+): If two implemented interfaces provide conflicting default methods, the Java compiler forces class D to explicitly override the method and resolve the conflict using `InterfaceName.super.method()`.",
    "bullet_points": [
      "Avoids the Diamond Problem ambiguity where multiple parent classes have identical method implementations.",
      "Java achieves multiple inheritance safely through Interfaces (`implements InterfaceA, InterfaceB`).",
      "If default method conflicts occur in Java 8+, the subclass must explicitly override and resolve the conflict."
    ],
    "code_snippet": {
      "language": "java",
      "code": "interface A { default void show() { System.out.println(\"A\"); } }\ninterface B { default void show() { System.out.println(\"B\"); } }\n\nclass C implements A, B {\n    @Override\n    public void show() {\n        A.super.show(); // Explicitly disambiguating which default method to invoke\n    }\n}"
    },
    "pro_tip": "Demonstrate Java 8 knowledge: Mention that default methods reintroduced the potential for conflict, but Java resolves it cleanly by requiring explicit override disambiguation.",
    "company_tags": [
      "Amazon",
      "Adobe",
      "Oracle"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 28
  },
  {
    "id": "int-java-029",
    "topic_id": "topic-java",
    "title": "What is the difference between an Abstract Class and an Interface in modern Java (Java 8+)?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "\u2022 Abstract Class:\n- Represents an IS-A hierarchy and can hold state (instance variables).\n- Can have constructors and instance state.\n- Can contain any combination of abstract, concrete, final, and static methods.\n- Supports all access modifiers (`public`, `protected`, `private`).\n- A class can extend only ONE abstract class.\n\n\u2022 Interface:\n- Represents a capability or contract (CAN-DO relationship).\n- CANNOT hold instance state (all variables are implicitly `public static final` constants).\n- Cannot have constructors (cannot be instantiated directly).\n- Can have abstract methods, `default` methods (Java 8), `static` methods (Java 8), and `private` helper methods (Java 9).\n- A class can implement MULTIPLE interfaces.",
    "bullet_points": [
      "Abstract class can have constructors and mutable instance state; interface has only constants.",
      "Single inheritance for abstract classes; multiple inheritance for interfaces.",
      "Java 8+ added default/static methods and Java 9 added private methods to interfaces."
    ],
    "code_snippet": {
      "language": "java",
      "code": "public interface Flyable {\n    int MAX_ALTITUDE = 50000; // public static final\n    void fly();               // public abstract\n    default void glide() {    // Java 8 default method\n        System.out.println(\"Gliding\");\n    }\n}"
    },
    "pro_tip": "When to choose which? Choose an Abstract Class when you need code reuse across closely related classes with shared state. Choose an Interface to define a contract across unrelated classes.",
    "company_tags": [
      "Microsoft",
      "Amazon",
      "Goldman Sachs"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 29
  },
  {
    "id": "int-java-030",
    "topic_id": "topic-java",
    "title": "Explain Constructor Chaining in Java using 'this()' and 'super()'.",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Constructor Chaining is the process of calling one constructor from another constructor within the same class or from a parent class hierarchy.\n\nKey Mechanisms:\n\u2022 `this()`: Calls an overloaded constructor in the SAME class. Used to centralize initialization logic.\n\u2022 `super()`: Calls the constructor of the IMMEDIATE PARENT class. Used to ensure superclass state is initialized before subclass state.\n\nStrict Rules:\n1. Either `this()` or `super()` MUST be the very FIRST statement in any constructor body.\n2. Consequently, you cannot use both `this()` and `super()` inside the same constructor.\n3. If a constructor does not explicitly include `this()` or `super()`, the Java compiler automatically inserts a parameterless `super()` call as the first line.",
    "bullet_points": [
      "this() invokes another constructor in the same class; super() invokes parent constructor.",
      "Must be the very FIRST statement in the constructor.",
      "If omitted, compiler auto-inserts super() to ensure parent class is initialized first."
    ],
    "code_snippet": {
      "language": "java",
      "code": "class Parent {\n    Parent(String name) { System.out.println(\"Parent: \" + name); }\n}\nclass Child extends Parent {\n    Child() {\n        this(\"Default\"); // Chains to overloaded constructor\n    }\n    Child(String name) {\n        super(name);     // Chains to superclass constructor\n        System.out.println(\"Child initialized\");\n    }\n}"
    },
    "pro_tip": "Trap: If the parent class has a parameterized constructor and NO default no-arg constructor, the child constructor will fail to compile unless it explicitly calls `super(args)`!",
    "company_tags": [
      "TCS",
      "Infosys",
      "Cognizant"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 30
  },
  {
    "id": "int-java-031",
    "topic_id": "topic-java",
    "title": "Why can't static methods access non-static variables or call non-static methods directly?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Static methods belong to the Class itself, loaded into Metaspace when the class is initialized. They exist and can be called before ANY object of the class has been created (`ClassName.method()`).\n\nNon-static (instance) variables and methods belong to a specific Object instance allocated on the Heap. They require a concrete object reference and are accessed via the `this` keyword.\n\nWhen a static method executes, there is NO implicit `this` reference because no object may exist. If the JVM allowed a static method to access `name` directly, it would have no idea WHICH object's `name` in Heap memory should be accessed. Therefore, the Java compiler forbids accessing non-static members from static contexts unless an explicit object instance is supplied.",
    "bullet_points": [
      "Static members belong to the class; instance members require a concrete Heap object.",
      "Static methods have no 'this' pointer in their execution context.",
      "To access an instance field inside static main(), you must explicitly instantiate an object: new MyClass().field."
    ],
    "code_snippet": {
      "language": "java",
      "code": "public class Test {\n    int count = 10; // Instance variable\n\n    public static void main(String[] args) {\n        // System.out.println(count); // COMPILE ERROR: non-static variable cannot be referenced from static context\n        Test t = new Test();\n        System.out.println(t.count); // VALID: accessed via explicit object instance\n    }\n}"
    },
    "pro_tip": "Whenever asked this, emphasize: 'Static methods have no this reference, so there is no reference to bind instance state to.'",
    "company_tags": [
      "TCS",
      "Accenture",
      "Infosys"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 31
  },
  {
    "id": "int-java-032",
    "topic_id": "topic-java",
    "title": "What is Method Hiding in Java and can we override static methods?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "No, you CANNOT override static methods in Java. If a subclass declares a static method with the exact same signature as a static method in its superclass, this is known as Method Hiding, NOT method overriding.\n\nKey Differences:\n\u2022 Static methods are resolved at COMPILE TIME (static/early binding) based on the declared reference type of the variable.\n\u2022 Instance (overridden) methods are resolved at RUN TIME (dynamic/late binding) based on the actual runtime object instance.\n\nBecause static methods belong to the class and do not participate in virtual method table (`vtable`) dispatch, polymorphism does not apply to static methods.",
    "bullet_points": [
      "Static methods cannot be overridden; they can only be Hidden.",
      "Method Hiding resolution depends on the reference type at compile-time.",
      "Dynamic method dispatch only applies to instance methods, not class static methods."
    ],
    "code_snippet": {
      "language": "java",
      "code": "class Parent {\n    static void print() { System.out.println(\"Parent Static\"); }\n}\nclass Child extends Parent {\n    static void print() { System.out.println(\"Child Static\"); }\n}\n\npublic class Test {\n    public static void main(String[] args) {\n        Parent p = new Child();\n        p.print(); // Prints \"Parent Static\" because p's reference type is Parent!\n    }\n}"
    },
    "pro_tip": "This is a classic tricky question! If p is `Parent p = new Child()`, `p.print()` calls `Parent.print()`. If print() were non-static, it would call `Child.print()`.",
    "company_tags": [
      "Amazon",
      "Google",
      "Goldman Sachs"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 32
  },
  {
    "id": "int-java-033",
    "topic_id": "topic-java",
    "title": "Explain the Java Exception Hierarchy: Checked vs Unchecked vs Error.",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "All exceptions and errors in Java inherit from the `java.lang.Throwable` root class, which branches into two primary subclasses:\n\n1. Error: Serious problems that a reasonable application should not attempt to catch (e.g., `OutOfMemoryError`, `StackOverflowError`). Caused by environment/JVM hardware failures.\n\n2. Exception: Conditions that an application might want to handle:\n   \u2022 Checked Exceptions (Compile-Time): Subclasses of `Exception` (excluding `RuntimeException`). The Java compiler FORCES the developer to handle them using `try-catch` or declare them using `throws` (e.g., `IOException`, `SQLException`, `ClassNotFoundException`).\n   \u2022 Unchecked Exceptions (Run-Time): Subclasses of `RuntimeException`. Caused by programming errors or bad logic (e.g., `NullPointerException`, `ArrayIndexOutOfBoundsException`, `ArithmeticException`). Compiler does not force explicit handling.",
    "bullet_points": [
      "Throwable is the root class; branches into Error and Exception.",
      "Checked: verified at compile-time (IOException, SQLException); must be handled or declared.",
      "Unchecked: inherits RuntimeException; caused by logic errors (NullPointerException)."
    ],
    "code_snippet": {
      "language": "text",
      "code": "               Throwable\n              /         \\\n          Error         Exception\n         /     \\        /        \\\n      OOM    StackOF  Checked   RuntimeException (Unchecked)\n                     (IOException)    (NullPointerException)"
    },
    "pro_tip": "Why did Java introduce Checked Exceptions? To enforce compile-time verification for recoverable external failure conditions (e.g., missing file, network glitch).",
    "company_tags": [
      "TCS",
      "Infosys",
      "Amazon",
      "Oracle"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 33
  },
  {
    "id": "int-java-034",
    "topic_id": "topic-java",
    "title": "What is the difference between 'throw' and 'throws' keywords in Java?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "\u2022 throw (Keyword):\n- Used to explicitly instantiate and throw an exception object.\n- Written inside a method body or block.\n- Followed by an exception instance (`throw new IllegalArgumentException(\"Invalid age\");`).\n- You can only throw one exception object at a time.\n\n\u2022 throws (Keyword):\n- Used in the method signature to declare that this method might throw one or more checked exceptions.\n- Shifts the responsibility of handling the exception to the caller method in the call stack.\n- Followed by exception class names (`void readFile() throws IOException, SQLException`).\n- Multiple exception classes can be separated by commas.",
    "bullet_points": [
      "throw is used inside method body to trigger an exception instance.",
      "throws is used in method signature to declare potential checked exceptions.",
      "throw handles 1 exception instance; throws can declare multiple exception class names."
    ],
    "code_snippet": {
      "language": "java",
      "code": "public void validateAge(int age) throws InvalidAgeException { // throws declaration\n    if (age < 18) {\n        throw new InvalidAgeException(\"Not eligible\"); // throw instance\n    }\n}"
    },
    "pro_tip": "Remember: 'throw' actually fires the exception; 'throws' serves as a warning label on the method signature notifying callers to handle it.",
    "company_tags": [
      "TCS",
      "Cognizant",
      "Wipro"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 34
  },
  {
    "id": "int-java-035",
    "topic_id": "topic-java",
    "title": "How does HashMap work internally in Java (Hashing, Buckets, and Treeification)?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "In Java, `HashMap` operates on the principle of Hashing using an array of `Node<K,V>` (buckets):\n\n1. put(K, V) Operation:\n\u2022 The key's `hashCode()` is computed and passed through a supplemental hash function to distribute bits.\n\u2022 Bucket index is calculated using bitwise AND: `index = (n - 1) & hash` (where n is array capacity, power of 2).\n\u2022 If the bucket is empty, a new Node is inserted.\n\u2022 If a collision occurs (two keys hash to the same bucket index), keys are compared using `equals()`:\n  - If keys are equal, the value is updated.\n  - If keys are not equal, the new node is appended to a singly linked list at that bucket.\n\n2. Treeification (Java 8+ Optimization):\n\u2022 If the number of nodes in a single bucket exceeds `TREEIFY_THRESHOLD` (8) and total table capacity is at least 64, the linked list is transformed into a balanced Red-Black Tree.\n\u2022 This improves worst-case lookup performance from O(N) down to O(log N).",
    "bullet_points": [
      "Bucket index determined via (n-1) & hash.",
      "Collisions handled via chaining (LinkedList).",
      "Java 8 transforms bucket into Red-Black Tree when chain length exceeds 8 (O(log n) lookup)."
    ],
    "code_snippet": null,
    "pro_tip": "Always mention load factor (default 0.75) and initial capacity (default 16). When threshold (16 * 0.75 = 12) is reached, table capacity doubles to 32 and rehashing occurs.",
    "company_tags": [
      "Amazon",
      "Google",
      "Microsoft",
      "Flipkart",
      "Uber"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 35
  },
  {
    "id": "int-java-036",
    "topic_id": "topic-java",
    "title": "What is the difference between Comparable and Comparator interfaces in Java?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Both interfaces are used for sorting object collections, but differ in design:\n\n\u2022 Comparable<T>:\n- Belongs to `java.lang` package.\n- Provides a single natural sorting sequence for a class.\n- Implemented directly by the domain class itself via the `compareTo(T o)` method.\n- Modifies the original class source code.\n- Usage: `Collections.sort(list);`\n\n\u2022 Comparator<T>:\n- Belongs to `java.util` package.\n- Provides multiple, customized sorting sequences (e.g., sort by name, sort by price, sort by date).\n- Defined as a separate external class or lambda expression via `compare(T o1, T o2)`.\n- Does NOT modify the domain class source code.\n- Usage: `Collections.sort(list, new NameComparator());` or `list.sort(Comparator.comparing(Student::getName));`",
    "bullet_points": [
      "Comparable: single natural order, compareTo(T o), implemented inside class.",
      "Comparator: multiple custom orders, compare(T o1, T o2), implemented as separate class/lambda.",
      "Use Comparable for default ordering; use Comparator for multiple flexible sorting criteria."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// Comparable\nclass Student implements Comparable<Student> {\n    int id;\n    public int compareTo(Student o) { return this.id - o.id; }\n}\n\n// Comparator\nComparator<Student> byName = (s1, s2) -> s1.name.compareTo(s2.name);"
    },
    "pro_tip": "In modern Java (Java 8+), prefer Comparator lambdas like `Comparator.comparing(Student::getAge).thenComparing(Student::getName)`.",
    "company_tags": [
      "Amazon",
      "TCS",
      "Morgan Stanley"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 36
  },
  {
    "id": "int-java-037",
    "topic_id": "topic-java",
    "title": "Compilation Trap: What happens when you execute 'byte a = 10; byte b = 20; byte c = a + b;' in Java?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "It will FAIL TO COMPILE with an error: 'incompatible types: possible lossy conversion from int to byte'.\n\nWhy this happens (Type Promotion Rule):\nIn Java, during any binary arithmetic operation (`+`, `-`, `*`, `/`) involving integer types smaller than `int` (`byte`, `short`, `char`), the operands are AUTOMATICALLY PROMOTED to `int` before the operation is performed.\n\nTherefore, `a + b` produces an `int` result (30). Attempting to assign this `int` result back into a 1-byte variable `c` triggers a compiler error, because an `int` (4 bytes) cannot be implicitly downcast to a `byte` (1 byte).\n\nHow to fix:\n1. Explicit type cast: `byte c = (byte)(a + b);`\n2. Compound assignment: `a += b;` (compound assignment operators automatically perform implicit type casting!).",
    "bullet_points": [
      "Byte, short, and char operands are automatically promoted to int in arithmetic expressions.",
      "a + b results in an int type, causing 'possible lossy conversion from int to byte'.",
      "Fix with explicit cast (byte)(a + b) or compound assignment a += b."
    ],
    "code_snippet": {
      "language": "java",
      "code": "byte a = 10;\nbyte b = 20;\n// byte c = a + b; // COMPILE ERROR: cannot convert from int to byte\nbyte c = (byte)(a + b); // SUCCESS: explicit cast\na += b;                 // SUCCESS: compound assignment auto-casts"
    },
    "pro_tip": "Interviewers love this question! Always explain: 'Java evaluates expressions in 32-bit registers, promoting smaller types to int.'",
    "company_tags": [
      "Google",
      "Amazon",
      "Oracle"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 37
  },
  {
    "id": "int-java-038",
    "topic_id": "topic-java",
    "title": "Compilation Trap: Why does 'byte b = 127;' compile, but 'byte b = 128;' or 'byte b = 129;' fail to compile?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "In Java, the `byte` primitive data type is signed 8-bit, with a strictly defined range from -128 to +127 (inclusive).\n\nWhen you write a constant integer literal assignment like `byte b = 127;`, the Java compiler performs implicit compile-time range checking:\n\u2022 Because 127 falls within the valid range of `byte` [-128, 127], the compiler allows the narrowing primitive conversion automatically without explicit cast.\n\u2022 When you write `byte b = 128;` or `byte b = 129;`, the literal exceeds +127. The compiler immediately detects the overflow and issues a compile-time error: 'incompatible types: possible lossy conversion from int to byte'.\n\nIf you explicitly force a cast `byte b = (byte)128;`, it compiles, but wraps around in two's complement to `-128`. `(byte)129` wraps around to `-127`.",
    "bullet_points": [
      "byte range is strictly -128 to 127.",
      "Literals within [-128, 127] undergo implicit compile-time narrowing.",
      "128 and 129 exceed byte range, triggering compile-time lossy conversion error.",
      "Explicit casting (byte)128 wraps around via two's complement to -128."
    ],
    "code_snippet": {
      "language": "java",
      "code": "byte b1 = 127;          // Valid\n// byte b2 = 128;       // COMPILE ERROR: incompatible types\nbyte b3 = (byte)128;    // Valid: evaluates to -128 (two's complement wrap)\nbyte b4 = (byte)129;    // Valid: evaluates to -127"
    },
    "pro_tip": "Mention two's complement arithmetic: In 8-bit binary, 128 is 10000000, which has the sign bit set, evaluating to -128.",
    "company_tags": [
      "Microsoft",
      "Amazon",
      "Oracle"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 38
  },
  {
    "id": "int-java-039",
    "topic_id": "topic-java",
    "title": "Is Java strictly 'Pass-by-Value' or 'Pass-by-Reference'? Prove your answer with a swap example.",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Java is STRICTLY PASS-BY-VALUE. There is NO pass-by-reference in Java under any circumstance.\n\nCommon Confusion:\nWhen an object is passed into a method, what is passed is NOT the object itself, nor is it a reference to the reference variable. The JVM copies the VALUE of the reference (the memory address). Both the caller and the method receive separate copies of the pointer pointing to the same Heap object.\n\nProof:\n1. If you modify the state of the object via the reference copy (`s.setName(\"Bob\")`), the changes reflect outside because both references point to the same object on the Heap.\n2. But if you REASSIGN the reference variable itself inside the method (`s = new Student(\"Charlie\")`), the caller's reference outside the method DOES NOT CHANGE. If Java were pass-by-reference, the caller's reference would point to Charlie. Because it doesn't, Java is undeniably pass-by-value.",
    "bullet_points": [
      "Java is 100% pass-by-value at all times.",
      "For primitives: the raw value is copied.",
      "For objects: the value of the reference address is copied.",
      "Reassigning an object reference inside a method has zero effect on the caller's reference."
    ],
    "code_snippet": {
      "language": "java",
      "code": "public static void swap(Student a, Student b) {\n    Student temp = a;\n    a = b;\n    b = temp;\n    // Only local reference copies are swapped; caller's references remain unchanged!\n}\n\nStudent s1 = new Student(\"Alice\");\nStudent s2 = new Student(\"Bob\");\nswap(s1, s2);\nSystem.out.println(s1.name); // Still prints \"Alice\"!"
    },
    "pro_tip": "Always demonstrate with the classic `swap(a, b)` function. Because s1 and s2 do not swap in the caller, it unequivocally proves Java passes reference values by copy.",
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 39
  },
  {
    "id": "int-java-040",
    "topic_id": "topic-java",
    "title": "What is the Integer Cache trap in Java? Explain 'Integer a = 127, b = 127; a == b' vs 128.",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "In Java, Autoboxing uses the `Integer.valueOf(int)` method behind the scenes.\n\nJava maintains an internal `IntegerCache` for values in the range of -128 to +127 (inclusive):\n\u2022 When you assign `Integer a = 127; Integer b = 127;`, JVM returns the cached `Integer` object instance from the pool. Therefore, `a == b` evaluates to `true` because both references point to the exact same cached object in memory.\n\u2022 When you assign `Integer a = 128; Integer b = 128;`, 128 is outside the default cache range [-128, 127]. `Integer.valueOf(128)` instantiates two distinct `Integer` objects on the Heap via `new Integer(128)`. Therefore, `a == b` evaluates to `false`!\n\nTo safely compare wrapper objects for logical equivalence, always use `a.equals(b)` rather than `==`.",
    "bullet_points": [
      "IntegerCache caches objects between -128 and 127.",
      "For values in [-128, 127], Integer.valueOf() returns cached objects (== returns true).",
      "Outside this range, new Heap objects are instantiated (== returns false).",
      "Always use .equals() to compare wrapper objects."
    ],
    "code_snippet": {
      "language": "java",
      "code": "Integer a = 127, b = 127;\nSystem.out.println(a == b); // true (cached object)\n\nInteger c = 128, d = 128;\nSystem.out.println(c == d); // false (different Heap objects!)\nSystem.out.println(c.equals(d)); // true (value comparison)"
    },
    "pro_tip": "Bonus points: Mention that the high boundary (+127) can be adjusted using the JVM launch parameter `-XX:AutoBoxCacheMax=<size>`, but the lower boundary (-128) is fixed.",
    "company_tags": [
      "Google",
      "Amazon",
      "Uber",
      "Goldman Sachs"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 40
  },
  {
    "id": "int-java-041",
    "topic_id": "topic-java",
    "title": "Can a 'finally' block ever be skipped or fail to execute in Java?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Yes! Although the general rule is that `finally` always executes, there are 4 specific scenarios where a `finally` block is bypassed:\n\n1. System.exit(): If `System.exit(0)` or `Runtime.getRuntime().exit()` is invoked in the `try` or `catch` block, the JVM immediately terminates the operating system process, bypassing all remaining `finally` blocks.\n2. JVM Fatal Crash: If the JVM crashes due to an unrecoverable system error (e.g., `OutOfMemoryError` in native memory, OS signal `SIGKILL`, or fatal segmentation fault).\n3. Infinite Loop / Deadlock: If an infinite loop (`while(true) {}`) or permanent thread deadlock occurs inside the `try` or `catch` block, execution never leaves that block, so `finally` is never reached.\n4. Daemon Thread Termination: If the thread running the `try` block is a daemon thread, and all user (non-daemon) threads terminate, the JVM shuts down abruptly without waiting for daemon threads to run their `finally` blocks.",
    "bullet_points": [
      "System.exit(0) aborts the JVM process immediately, skipping finally.",
      "Fatal JVM crash (SIGKILL, segfault) prevents execution.",
      "Infinite loop or deadlock inside try/catch prevents reaching finally.",
      "Daemon thread abruptly killed when all user threads finish."
    ],
    "code_snippet": {
      "language": "java",
      "code": "try {\n    System.out.println(\"Inside try\");\n    System.exit(0); // Halts JVM immediately\n} finally {\n    System.out.println(\"Inside finally\"); // NEVER PRINTS!\n}"
    },
    "pro_tip": "Always answer with `System.exit(0)` first, followed by daemon thread termination\u2014interviewers consider this the benchmark of an experienced senior Java developer.",
    "company_tags": [
      "Amazon",
      "Goldman Sachs",
      "Oracle"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 41
  },
  {
    "id": "int-java-042",
    "topic_id": "topic-java",
    "title": "What happens if both 'try' and 'finally' blocks have 'return' statements?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "If both the `try` (or `catch`) block and the `finally` block contain a `return` statement, the `return` statement inside the `finally` block OVERRIDES and SUPPRESSES the return statement from the `try` block.\n\nExecution Flow:\n1. The `try` block computes its return value and prepares to return.\n2. Before the method can actually return to the caller, the JVM must execute the `finally` block.\n3. When the `finally` block encounters its own `return` statement, that return executes immediately, discarding the previous return value from the `try` block.\n\nEven worse: If the `try` block throws an exception, and the `finally` block executes a `return`, the thrown exception is completely swallowed and lost! This is why having return statements in `finally` blocks is considered a dangerous anti-pattern.",
    "bullet_points": [
      "finally block return overrides the return value of try/catch.",
      "If try throws an exception and finally returns, the exception is silently swallowed.",
      "Having return statements inside finally blocks is a severe code smell and anti-pattern."
    ],
    "code_snippet": {
      "language": "java",
      "code": "public static int test() {\n    try {\n        return 10;\n    } finally {\n        return 20; // Silently overrides 10!\n    }\n}\n// Calling test() returns 20!"
    },
    "pro_tip": "Warn against placing return in finally: SonarQube and compiler linters flag this as a critical bug because it silently swallows unhandled exceptions.",
    "company_tags": [
      "Microsoft",
      "Amazon",
      "Atlassian"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 42
  },
  {
    "id": "int-java-043",
    "topic_id": "topic-java",
    "title": "How does an Anonymous Inner Class cause a Memory Leak in Java?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "In Java, non-static inner classes (including Anonymous Inner Classes) maintain an implicit, hidden reference to the enclosing outer class instance (`OuterClass.this`).\n\nHow the Memory Leak Happens:\n1. An anonymous inner class is instantiated inside an outer class (e.g., as an event listener, runnable, callback, or thread).\n2. If this anonymous inner object has a longer lifecycle than the outer class instance (e.g., registered as a long-lived callback, static event bus, or background worker thread).\n3. Even when the outer class instance is no longer needed and its local references are gone, the Garbage Collector CANNOT reclaim it because the anonymous inner class still holds an active hidden reference to `OuterClass.this`.\n\nSolution:\n1. Use a `static nested class` instead of an inner class (static nested classes do NOT hold a reference to the outer instance).\n2. Use WeakReference if a back-reference is needed.\n3. In Java 8+, use static lambdas or method references that do not capture outer instance state.",
    "bullet_points": [
      "Non-static inner classes retain an implicit reference to the outer class instance.",
      "If inner class outlives outer class (callbacks, threads), outer class cannot be garbage collected.",
      "Fix by using static nested classes, WeakReferences, or unregistering listeners."
    ],
    "code_snippet": {
      "language": "java",
      "code": "public class Activity {\n    void start() {\n        // Anonymous Runnable holds implicit reference to Activity.this\n        new Thread(new Runnable() {\n            @Override\n            public void run() {\n                while(true) { /* Long running task leaks Activity */ }\n            }\n        }).start();\n    }\n}"
    },
    "pro_tip": "This is a classic question in Android and backend microservices where leaking an Activity or Service leads to rapid OutOfMemoryError.",
    "company_tags": [
      "Google",
      "Uber",
      "Meta"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 43
  },
  {
    "id": "int-java-044",
    "topic_id": "topic-java",
    "title": "Explain the difference between finalize(), Cleaner, and try-with-resources in modern Java.",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "\u2022 finalize() (Deprecated in Java 9, for removal):\n- Deprecated because of unpredictable execution timing, performance degradation, and potential thread deadlocks. An object can even resurrect itself inside `finalize()`, breaking GC invariants.\n\n\u2022 try-with-resources & AutoCloseable (Java 7+ Standard):\n- Deterministic resource management. Any class implementing `java.lang.AutoCloseable` or `java.io.Closeable` automatically has its `.close()` method invoked when exiting the `try` block.\n- Handles suppressed exceptions properly and guarantees immediate cleanup without waiting for the next GC cycle.\n\n\u2022 java.lang.ref.Cleaner (Java 9+ Alternative to finalize):\n- Replaces `finalize()` for safety-net cleanup.\n- Uses phantom references and runs cleanup actions on a separate background cleaner thread.\n- Unlike `finalize()`, the cleanup action MUST NOT hold a reference to the object being cleaned, preventing object resurrection.",
    "bullet_points": [
      "finalize() is deprecated due to non-deterministic execution and resource leaks.",
      "try-with-resources is the gold standard for deterministic resource disposal.",
      "Cleaner (Java 9) uses PhantomReferences on dedicated cleaner threads."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// Gold standard: try-with-resources\ntry (BufferedReader br = new BufferedReader(new FileReader(\"data.txt\"))) {\n    System.out.println(br.readLine());\n} // Automatically closed here, even if an IOException occurs"
    },
    "pro_tip": "Mention suppressed exceptions: If both the try block and auto-close throw an exception, try-with-resources preserves the primary exception and attaches the close failure via `getSuppressed()`.",
    "company_tags": [
      "Oracle",
      "Amazon",
      "Netflix"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 44
  },
  {
    "id": "int-java-045",
    "topic_id": "topic-java",
    "title": "What is the 'String.intern()' Memory Leak trap in Java 6 vs modern Java 8+?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "In Java 6 and earlier:\n\u2022 The String Constant Pool was located in PermGen (Permanent Generation) memory, which had a fixed size (typically 64MB) and was rarely garbage collected.\n\u2022 Calling `.intern()` on thousands of dynamically generated Strings rapidly filled PermGen, triggering `java.lang.OutOfMemoryError: PermGen space`. This was a notorious memory leak.\n\nIn Java 7, 8, and beyond:\n\u2022 The String Constant Pool was moved directly into the standard Java Heap Area.\n\u2022 String literals in the pool CAN now be garbage collected if they are no longer referenced by any live code.\n\u2022 In Java 8, PermGen was completely eliminated and replaced by Metaspace (which uses native off-heap memory for class metadata).\n\u2022 While still safe, abusing `intern()` on unbounded random strings can cause CPU degradation due to hash table rehashing and lock contention in the internal StringTable.",
    "bullet_points": [
      "Java 6: Pool was in fixed PermGen; intern() caused frequent PermGen OutOfMemoryErrors.",
      "Java 7+: Pool moved to main Heap; interned strings are safely reclaimed by GC.",
      "Java 8: PermGen replaced by native Metaspace; String pool remains on the Heap."
    ],
    "code_snippet": null,
    "pro_tip": "Demonstrates senior-level understanding of JVM evolutionary history from Java 6 PermGen to Java 8 Metaspace.",
    "company_tags": [
      "Google",
      "Goldman Sachs",
      "Oracle"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 45
  },
  {
    "id": "int-c-001",
    "topic_id": "topic-c",
    "title": "What is C language, who developed it, and why is it called a 'Middle-Level' language?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "C is a procedural, general-purpose, and structured programming language developed by Dennis Ritchie at Bell Laboratories between 1969 and 1973. It was originally designed to rewrite the UNIX operating system.\n\nWhy it is called a 'Middle-Level' language:\nC bridges the gap between low-level machine languages and high-level abstract languages:\n\u2022 Low-level features: Direct memory access through pointers, bit manipulation, register access, and explicit memory management (malloc/free).\n\u2022 High-level features: Structured syntax, strong typed variables, control flow statements (loops, conditionals), and modular functions.\n\nThis blend makes C ideal for system programming (OS kernels, device drivers, embedded systems) and high-performance applications.",
    "bullet_points": [
      "Developed by Dennis Ritchie at Bell Labs (1972) to implement UNIX.",
      "Middle-level because it combines low-level memory control (pointers) with high-level structured syntax.",
      "Foundational to modern operating systems, compilers, and embedded runtimes."
    ],
    "code_snippet": null,
    "pro_tip": "State that UNIX, Linux, and Git are predominantly written in C, proving its continuing dominance in systems programming.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Qualcomm",
      "Intel"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 1
  },
  {
    "id": "int-c-002",
    "topic_id": "topic-c",
    "title": "Explain the four distinct phases of C Program Compilation.",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Compiling a C source file (`.c`) into an executable binary involves four distinct stages:\n\n1. Preprocessing (cpp):\n\u2022 Strips comments.\n\u2022 Expands `#include` header files by inlining their contents.\n\u2022 Substitutes `#define` macros and evaluates conditional compilation (`#ifdef`).\n\u2022 Produces preprocessed source file (`.i`).\n\n2. Compilation (cc / gcc):\n\u2022 Performs lexical, syntax, and semantic analysis.\n\u2022 Converts preprocessed C code into assembly language instructions tailored to the target CPU architecture.\n\u2022 Produces assembly file (`.s`).\n\n3. Assembly (as):\n\u2022 Translates assembly language mnemonics into machine code instructions (relocatable object code).\n\u2022 Produces object file (`.o` or `.obj`).\n\n4. Linking (ld):\n\u2022 Combines multiple object files and resolves external symbols, functions, and standard library code (e.g., `printf` from `libc`).\n\u2022 Produces the final executable binary (`a.out` or `.exe`).",
    "bullet_points": [
      "1. Preprocessing (.i): macro expansion, header inlining, comment removal.",
      "2. Compilation (.s): converts C code to assembly instructions.",
      "3. Assembly (.o): converts assembly to relocatable machine object code.",
      "4. Linking (executable): resolves external library symbols into final binary."
    ],
    "code_snippet": {
      "language": "text",
      "code": "prog.c \u2500\u2500[Preprocess]\u2500\u2500> prog.i \u2500\u2500[Compile]\u2500\u2500> prog.s \u2500\u2500[Assemble]\u2500\u2500> prog.o \u2500\u2500[Link]\u2500\u2500> a.out"
    },
    "pro_tip": "In GCC, you can inspect intermediate files with: `gcc -E prog.c -o prog.i` (preprocess), `gcc -S prog.i` (assembly), and `gcc -c prog.s` (object file).",
    "company_tags": [
      "Qualcomm",
      "Cisco",
      "Intel",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 2
  },
  {
    "id": "int-c-003",
    "topic_id": "topic-c",
    "title": "What are Storage Classes in C and what are the four standard specifiers?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "A storage class in C determines the scope (visibility), lifetime (duration), default initial value, and memory storage location of a variable.\n\nThe four standard storage classes are:\n1. auto (Automatic): Default for local variables. Stored on the Stack. Scope is local to the declaring block; lifetime exists while the block executes. Default value is garbage.\n2. register: Stored in CPU registers (if available) for ultra-fast access instead of RAM. Cannot take its address using `&`. Scope is local, lifetime is block duration. Default is garbage.\n3. static: Stored in the Data segment / BSS. Preserves its value across repeated function calls. Scope is local (or file-private if declared at file level). Default value is 0.\n4. extern: Used to declare a global variable or function defined in another source file. Stored in Data/BSS segment. Lifetime is entire program duration. Default value is 0.",
    "bullet_points": [
      "auto: stack memory, block scope, garbage default.",
      "register: CPU registers, no address '&' operator allowed, fastest access.",
      "static: persists state across calls, 0 default value, file or block scope.",
      "extern: global reference to symbol defined in another translation unit."
    ],
    "code_snippet": {
      "language": "c",
      "code": "void counter() {\n    static int count = 0; // Initialized once in Data segment\n    count++;\n    printf(\"%d \", count); // Prints 1, 2, 3 across successive calls\n}"
    },
    "pro_tip": "Tricky interview question: Can you take the address of a register variable? NO! `&regVar` causes a compile-time error because CPU registers do not have RAM memory addresses.",
    "company_tags": [
      "TCS",
      "Wipro",
      "Qualcomm",
      "Bosch"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 3
  },
  {
    "id": "int-c-004",
    "topic_id": "topic-c",
    "title": "What is a Pointer in C and what are the operators '&' and '*'?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "A pointer is a variable that stores the memory address of another variable in RAM.\n\nTwo Fundamental Operators:\n1. Address-of Operator (`&`): A unary operator that returns the memory address of its operand.\n   Example: If variable `x` is located at memory address `0x7ffee4`, then `&x` evaluates to `0x7ffee4`.\n\n2. Dereference (Indirection) Operator (`*`):\n   \u2022 In declarations (`int *ptr;`): Indicates that `ptr` is a pointer variable targeting an `int`.\n   \u2022 In expressions (`*ptr = 25;`): Accesses and manipulates the value stored at the memory address pointed to by `ptr`.",
    "bullet_points": [
      "Pointer holds memory address rather than a raw data value.",
      "& operator retrieves the memory address of a variable.",
      "* operator dereferences a pointer to read or write the value at that address.",
      "Pointer size depends on CPU architecture (4 bytes on 32-bit, 8 bytes on 64-bit systems)."
    ],
    "code_snippet": {
      "language": "c",
      "code": "int num = 10;\nint *ptr = &num; // ptr stores address of num\n\nprintf(\"Address: %p\\n\", ptr);\nprintf(\"Value: %d\\n\", *ptr); // Dereference: outputs 10\n\n*ptr = 20; // Modifies num directly through memory address"
    },
    "pro_tip": "Always remember that pointer size is determined strictly by machine architecture (32-bit = 4 bytes, 64-bit = 8 bytes), regardless of whether it points to char, int, or a 1000-byte struct.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Intel",
      "Texas Instruments"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 4
  },
  {
    "id": "int-c-005",
    "topic_id": "topic-c",
    "title": "What is a NULL Pointer vs a Void Pointer (void*) in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "\u2022 NULL Pointer: A pointer that does not point to any valid memory location. It holds the value `0` or `(void*)0` defined in `<stdio.h>`. Dereferencing a NULL pointer causes an immediate segmentation fault (crash). Used to indicate uninitialized state or end-of-list.\n\n\u2022 Void Pointer (`void*`): A generic pointer type that can hold the memory address of ANY data type (`int`, `float`, `char`, `struct`).\n  - It has no associated data type size, so you CANNOT directly dereference a `void*` pointer.\n  - You must explicitly type-cast it to a concrete pointer type before dereferencing.\n  - Used extensively by standard libraries like `malloc()` (which returns `void*`) and `qsort()`.",
    "bullet_points": [
      "NULL pointer points to address 0 (no valid object).",
      "Void pointer (void*) is a generic pointer that can hold address of any data type.",
      "Void pointer cannot be dereferenced directly without type-casting.",
      "malloc() returns void* so it can allocate memory for any data type."
    ],
    "code_snippet": {
      "language": "c",
      "code": "int a = 42;\nvoid *vptr = &a; // Generic pointer holding int address\n\n// printf(\"%d\", *vptr); // COMPILE ERROR: cannot dereference void*\nprintf(\"%d\", *(int*)vptr); // VALID: cast to int* then dereference"
    },
    "pro_tip": "Pointer arithmetic on `void*` is not standard in ISO C because `sizeof(void)` is undefined (though GCC allows it as an extension with size 1).",
    "company_tags": [
      "Qualcomm",
      "Cisco",
      "Amazon"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 5
  },
  {
    "id": "int-c-006",
    "topic_id": "topic-c",
    "title": "What is the difference between an Array and a Pointer in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Although array names decay into pointers when passed to functions, they have fundamental differences:\n\n1. Memory Allocation: An array allocates a contiguous block of memory to store elements (`int arr[5]` reserves 20 bytes). A pointer allocates only 4 or 8 bytes to hold an address.\n2. Mutability of Address: An array name is a CONSTANT pointer; its base address cannot be changed (`arr++` causes a compile error). A pointer is a variable; its address can be reassigned (`ptr++` is valid).\n3. `sizeof` Operator: `sizeof(arr)` returns the total byte size of the entire array (`5 * 4 = 20`). `sizeof(ptr)` returns the pointer size (4 or 8 bytes), regardless of how many elements it points to.\n4. Address-of (`&`): `&arr` yields the address of the entire array (type `int(*)[5]`). `&ptr` yields the address of the pointer variable on the stack.",
    "bullet_points": [
      "Array is a constant block of memory; pointer is a variable holding an address.",
      "arr++ is invalid (array name is not an lvalue); ptr++ is valid.",
      "sizeof(arr) returns total array size; sizeof(ptr) returns 4 or 8 bytes."
    ],
    "code_snippet": {
      "language": "c",
      "code": "int arr[5] = {10, 20, 30, 40, 50};\nint *ptr = arr;\n\nprintf(\"%zu\", sizeof(arr)); // Prints: 20 (on 32-bit int)\nprintf(\"%zu\", sizeof(ptr)); // Prints: 8 (on 64-bit architecture)"
    },
    "pro_tip": "When an array is passed as a function argument (`void foo(int arr[])`), it decays into a pointer (`int *arr`), and `sizeof(arr)` inside the function will return 8, not the array length.",
    "company_tags": [
      "Amazon",
      "TCS",
      "Infosys",
      "Intel"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 6
  },
  {
    "id": "int-c-007",
    "topic_id": "topic-c",
    "title": "What is the significance of the null terminator '\\0' in C strings?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "In C, strings are not a primitive or built-in object type. A string is simply a one-dimensional array of characters terminated by a special character called the Null Character (`'\\0'`, ASCII value 0).\n\nSignificance:\n\u2022 Boundary Detection: Because arrays do not store their length, standard string library functions (`strlen`, `strcpy`, `printf(\"%s\")`) rely exclusively on encountering `'\\0'` to detect the end of the string.\n\u2022 Memory Allocation: When allocating a buffer for a string of N characters, you must allocate at least `N + 1` bytes to accommodate the null terminator.\n\u2022 Missing '\\0' Hazard: If a character array is not null-terminated, string functions continue reading past the buffer into adjacent memory until they accidentally encounter a zero byte, resulting in garbage characters or segmentation faults.",
    "bullet_points": [
      "C strings are character arrays terminated by '\\0' (ASCII 0).",
      "String functions (strlen, printf) loop until finding '\\0'.",
      "Always allocate n + 1 bytes for a string of length n."
    ],
    "code_snippet": {
      "language": "c",
      "code": "char str[6] = \"Hello\"; // 'H', 'e', 'l', 'l', 'o', '\\0'\n// char bad[5] = \"Hello\"; // Lacks null terminator -> UB in printf(\"%s\", bad)!"
    },
    "pro_tip": "Watch out: `'0'` has ASCII value 48. `'\\0'` has ASCII value 0. They are completely different!",
    "company_tags": [
      "TCS",
      "Cognizant",
      "Wipro"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 7
  },
  {
    "id": "int-c-008",
    "topic_id": "topic-c",
    "title": "What is the difference between 'printf' and 'scanf' format specifiers in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Format specifiers instruct `printf` and `scanf` on how to interpret binary data in memory during input and output operations:\n\nStandard Specifiers:\n\u2022 `%d` / `%i`: Signed decimal integer (`int`).\n\u2022 `%u`: Unsigned decimal integer.\n\u2022 `%f`: Floating-point number (`float` in printf, but in scanf `%f` is `float*` and `%lf` is `double*`).\n\u2022 `%lf`: Double precision float (`double`).\n\u2022 `%c`: Single character (`char`).\n\u2022 `%s`: String (sequence of characters up to first whitespace in scanf).\n\u2022 `%p`: Pointer memory address in hexadecimal format.\n\u2022 `%x` / `%X`: Unsigned integer in hexadecimal.\n\u2022 `%zu`: Size type (`size_t`, returned by `sizeof`).",
    "bullet_points": [
      "%d for int, %f for float, %lf for double, %s for string, %p for pointer.",
      "Critical in scanf: use %lf for double and %f for float (printf treats %f as double).",
      "Always pass the address &variable into scanf, except for arrays/strings."
    ],
    "code_snippet": {
      "language": "c",
      "code": "double pi = 3.14159;\nscanf(\"%lf\", &pi); // Requires %lf in scanf\nprintf(\"Value: %f\", pi); // %f in printf promotes float/double"
    },
    "pro_tip": "A classic bug: Using `%f` instead of `%lf` in `scanf` for a double variable writes only 4 bytes to an 8-byte variable, corrupting memory!",
    "company_tags": [
      "TCS",
      "Accenture",
      "Infosys"
    ],
    "frequency": "MEDIUM",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 8
  },
  {
    "id": "int-c-009",
    "topic_id": "topic-c",
    "title": "What is the difference between '#include <stdio.h>' and '#include \"myheader.h\"'?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Both directives instruct the preprocessor to paste the contents of a header file into the current source code, but they differ in their directory search path priority:\n\n1. Angled Brackets (`#include <filename>`):\n\u2022 Searches standard system library directories first (e.g., `/usr/include` or compiler include directories).\n\u2022 Used for standard C libraries (`stdio.h`, `stdlib.h`, `math.h`).\n\n2. Double Quotes (`#include \"filename\"`):\n\u2022 Searches the CURRENT working directory (where the source file resides) first.\n\u2022 If not found in the current directory, it falls back to searching standard system library directories.\n\u2022 Used for user-defined custom header files (`myheader.h`).",
    "bullet_points": [
      "< > searches standard system include directories first.",
      "\" \" searches current local source directory first, then system paths.",
      "Use < > for standard libraries, \" \" for user-created headers."
    ],
    "code_snippet": null,
    "pro_tip": "You can use double quotes for standard headers (`#include \"stdio.h\"`) and it will work, but using `<stdio.h>` is faster and standard practice.",
    "company_tags": [
      "TCS",
      "Capgemini"
    ],
    "frequency": "MEDIUM",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 9
  },
  {
    "id": "int-c-010",
    "topic_id": "topic-c",
    "title": "What is the difference between a Local Variable and a Global Variable in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "\u2022 Local Variable:\n- Declared inside a function or block `{}`.\n- Scope: Accessible only within the enclosing function/block.\n- Lifetime: Created upon entering the function/block and destroyed upon exit.\n- Memory: Stored on the Call Stack.\n- Default Value: Contains random garbage values if uninitialized.\n\n\u2022 Global Variable:\n- Declared outside all functions (file level).\n- Scope: Accessible by all functions throughout the program.\n- Lifetime: Created when the program starts and persists until program termination.\n- Memory: Stored in the Data Segment (if initialized) or BSS Segment (if uninitialized).\n- Default Value: Automatically initialized to 0 (or NULL).",
    "bullet_points": [
      "Local: Stack memory, block scope, function lifetime, garbage default value.",
      "Global: Data/BSS segment, global scope, program lifetime, 0 default value.",
      "Global variables should be minimized to avoid unintended side effects across functions."
    ],
    "code_snippet": {
      "language": "c",
      "code": "int global_x; // BSS segment -> initialized to 0\n\nvoid test() {\n    int local_y; // Stack frame -> garbage value!\n}"
    },
    "pro_tip": "If a local variable shares the same name as a global variable, the local variable shadows (takes precedence over) the global variable within that scope.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 10
  },
  {
    "id": "int-c-011",
    "topic_id": "topic-c",
    "title": "What is Type Casting in C? Explain Implicit vs Explicit Casting.",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Type casting is converting a variable from one data type to another.\n\n1. Implicit Casting (Type Promotion / Coercion):\n\u2022 Performed automatically by the compiler without programmer intervention.\n\u2022 Occurs when smaller data types are promoted to larger types in expressions to prevent data loss (e.g., `int` + `float` promotes `int` to `float`).\n\n2. Explicit Casting (Type Casting):\n\u2022 Manually specified by the programmer using the cast operator `(target_type)variable`.\n\u2022 Used when converting larger data types to smaller types (narrowing) or converting pointer types.\n\u2022 Carries risk of truncation or precision loss.",
    "bullet_points": [
      "Implicit: auto-promotion by compiler (e.g., int to double).",
      "Explicit: manual cast using (type) expression.",
      "Integer division 5/2 gives 2; casting ((float)5)/2 gives 2.5."
    ],
    "code_snippet": {
      "language": "c",
      "code": "int a = 5, b = 2;\nfloat result1 = a / b;          // result1 = 2.0 (integer division happens first!)\nfloat result2 = (float)a / b;   // result2 = 2.5 (explicit cast prevents truncation)"
    },
    "pro_tip": "Always highlight the integer division trap: `float f = 5/2;` gives `2.0`, not `2.5`, because integer arithmetic evaluates before the assignment.",
    "company_tags": [
      "TCS",
      "Accenture"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 11
  },
  {
    "id": "int-c-012",
    "topic_id": "topic-c",
    "title": "What are Macros in C and how do they differ from Functions?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "A macro is a preprocessor fragment of code defined using `#define`. Before the compiler compiles the code, the preprocessor performs literal textual substitution, replacing the macro name with its defined body wherever it appears.\n\nKey Differences:\n\u2022 Substitution vs Call: Macros undergo text replacement at compile-time (no function call overhead); functions involve a runtime call, stack frame creation, and parameter passing.\n\u2022 Type Safety: Macros are NOT type-safe (parameters have no data types); functions enforce strict parameter type checking.\n\u2022 Code Size: Macros increase executable binary size because code is duplicated at every invocation; functions exist once in the Code (Text) segment.\n\u2022 Side Effects: Macros can cause dangerous side effects if arguments contain increments (e.g., `SQUARE(x++)`).",
    "bullet_points": [
      "Macro: text substitution by preprocessor, zero runtime call overhead, no type safety.",
      "Function: compiled code block, runtime call stack frame, strict type checking.",
      "Macros can cause severe side effects with ++/-- operators."
    ],
    "code_snippet": {
      "language": "c",
      "code": "#define SQUARE(x) ((x) * (x))\n\nint a = 3;\nint res = SQUARE(a++); // Expands to ((a++) * (a++)) -> Undefined Behavior & double increment!"
    },
    "pro_tip": "In modern C (C99+), prefer `static inline` functions over complex macros for guaranteed type safety with the same zero-overhead performance.",
    "company_tags": [
      "Intel",
      "Qualcomm",
      "Cisco"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 12
  },
  {
    "id": "int-c-013",
    "topic_id": "topic-c",
    "title": "What is the purpose of 'static' variables inside a function in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "When the `static` keyword is applied to a local variable inside a function:\n\n1. Persistence: The variable is NOT stored on the Call Stack. Instead, it is allocated in the Data Segment (or BSS segment if uninitialized) of program memory.\n2. Lifetime: Its lifetime extends for the ENTIRE duration of the program execution, preserving its value between successive function calls.\n3. Scope: Its visibility remains strictly local to the function in which it is declared. External functions cannot access it directly.\n4. Initialization: It is initialized exactly ONCE when the program starts. Subsequent function calls skip the initialization statement.",
    "bullet_points": [
      "Allocated in Data/BSS segment, not on the Call Stack.",
      "Preserves its value across multiple function calls.",
      "Initialized only once when the program loads.",
      "Retains local scope restricted to the defining function."
    ],
    "code_snippet": {
      "language": "c",
      "code": "void visit() {\n    static int count = 0; // Initialized once at program start\n    count++;\n    printf(\"Visit %d\\n\", count);\n}\n\nint main() {\n    visit(); // Visit 1\n    visit(); // Visit 2\n    visit(); // Visit 3\n}"
    },
    "pro_tip": "Contrast local static with global static: Global static variables restrict visibility to that single `.c` file (internal linkage), preventing symbol collision with other files.",
    "company_tags": [
      "TCS",
      "Wipro",
      "Bosch",
      "Qualcomm"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 13
  },
  {
    "id": "int-c-014",
    "topic_id": "topic-c",
    "title": "Explain the Memory Layout of a compiled C program (Text, Data, BSS, Heap, Stack).",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "A compiled C program's virtual address space is organized into 5 primary segments:\n\n1. Text Segment (Code): Contains compiled executable machine code instructions. Read-only to prevent accidental modification; shared among concurrent processes.\n\n2. Initialized Data Segment: Stores global, static, and constant variables that are explicitly initialized with non-zero values (e.g., `int x = 10;`). Divided into read-only and read-write sections.\n\n3. Uninitialized Data Segment (BSS - Block Started by Symbol): Stores uninitialized global and static variables. Automatically initialized to binary zeros by the kernel before `main()` executes. Takes 0 space in the executable binary on disk.\n\n4. Heap Segment: Used for dynamic memory allocation (`malloc`, `calloc`). Managed manually by the programmer. Grows upwards toward higher memory addresses.\n\n5. Stack Segment: Stores function call stack frames, local variables, return addresses, and register state. Managed automatically by the CPU. Follows LIFO order and grows downwards toward lower memory addresses.",
    "bullet_points": [
      "Text: read-only machine instructions.",
      "Data: initialized global/static variables.",
      "BSS: uninitialized global/static variables (zeroed by OS).",
      "Heap: dynamic allocations (malloc), grows upwards.",
      "Stack: local variables & call frames, grows downwards."
    ],
    "code_snippet": {
      "language": "text",
      "code": "High Memory \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n            \u2502 Command Line & Env Vars   \u2502\n            \u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n            \u2502 Stack (grows downward \u2193)  \u2502\n            \u2502                           \u2502\n            \u2502          \u2191                \u2502\n            \u2502 Heap (grows upward \u2191)     \u2502\n            \u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n            \u2502 BSS (Uninitialized Data)  \u2502\n            \u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n            \u2502 Initialized Data          \u2502\n            \u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n Low Memory \u2502 Text / Code Segment       \u2502\n            \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518"
    },
    "pro_tip": "Great interview insight: BSS consumes 0 bytes in the binary file on disk! The OS loader simply notes its size and zeroes that memory region upon program launch.",
    "company_tags": [
      "Qualcomm",
      "Intel",
      "Cisco",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 14
  },
  {
    "id": "int-c-015",
    "topic_id": "topic-c",
    "title": "What is Dynamic Memory Allocation in C? Compare malloc(), calloc(), realloc(), and free().",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Dynamic memory allocation allows memory to be requested from the Heap at runtime when the exact required size is not known at compile time.\n\nFunctions (defined in `<stdlib.h>`):\n1. `malloc(size_t size)`:\n\u2022 Allocates a single contiguous block of `size` bytes on the Heap.\n\u2022 Leaves the allocated memory UNINITIALIZED (contains random garbage values).\n\u2022 Returns `void*` pointing to the first byte, or `NULL` if allocation fails.\n\n2. `calloc(size_t num, size_t size)`:\n\u2022 Allocates memory for an array of `num` elements, each of `size` bytes.\n\u2022 Automatically INITIALIZES every allocated byte to binary ZERO.\n\u2022 Slightly slower than malloc due to zeroing.\n\n3. `realloc(void *ptr, size_t new_size)`:\n\u2022 Resizes a previously allocated memory block pointed to by `ptr` to `new_size` bytes.\n\u2022 Preserves existing content up to the minimum of old and new sizes.\n\u2022 Can expand in place or allocate a new block elsewhere, copying data and freeing the old block.\n\n4. `free(void *ptr)`:\n\u2022 Deallocates the dynamic memory block pointed to by `ptr`, returning it to the Heap.\n\u2022 Does NOT reset `ptr` to `NULL` (creates a dangling pointer if not explicitly cleared).",
    "bullet_points": [
      "malloc: allocates n bytes with garbage contents.",
      "calloc: allocates num * size bytes and zeroes all memory.",
      "realloc: resizes previously allocated block while preserving data.",
      "free: releases heap memory; does not nullify the pointer."
    ],
    "code_snippet": {
      "language": "c",
      "code": "int *arr = (int*)malloc(5 * sizeof(int)); // 5 ints with garbage\nint *zeros = (int*)calloc(5, sizeof(int)); // 5 ints initialized to 0\n\narr = (int*)realloc(arr, 10 * sizeof(int)); // Expanded to 10 ints\nfree(arr);\narr = NULL; // Safe practice: prevent dangling pointer"
    },
    "pro_tip": "Always check if returned pointer is `NULL` before using it. Failing to check malloc return pointer leads to null pointer dereference crashes under low-memory conditions.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Qualcomm",
      "TCS"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 15
  },
  {
    "id": "int-c-016",
    "topic_id": "topic-c",
    "title": "What is Structure Padding and Word Alignment in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Processors do not read and write memory 1 byte at a time; they access memory in 4-byte or 8-byte 'words' matching their data bus architecture. To optimize memory read/write cycles, the compiler aligns data types at memory addresses that are multiples of their size.\n\nStructure Padding:\nWhen struct members of varying sizes are declared, the compiler inserts empty padding bytes between members or at the end of the struct so that every member aligns naturally.\n\nExample:\n`struct Student { char a; int b; char c; };`\n\u2022 `char a`: 1 byte (offset 0).\n\u2022 3 padding bytes inserted so `int b` can start at offset 4 (multiple of 4).\n\u2022 `int b`: 4 bytes (offset 4 to 7).\n\u2022 `char c`: 1 byte (offset 8).\n\u2022 3 padding bytes added at the end so total struct size is a multiple of largest member (4).\n\u2022 Total size = 1 + 3 + 4 + 1 + 3 = 12 bytes (not 6 bytes)!\n\nOptimization: Reordering members from largest to smallest (`int b; char a; char c;`) reduces size to 8 bytes.",
    "bullet_points": [
      "Processors access memory in 4 or 8 byte word boundaries for efficiency.",
      "Compiler inserts empty padding bytes to align members naturally.",
      "Order members by decreasing size to minimize wasted padding space.",
      "#pragma pack(1) disables padding at the cost of slower CPU memory access."
    ],
    "code_snippet": {
      "language": "c",
      "code": "struct Unoptimized { char a; int b; char c; }; // sizeof = 12\nstruct Optimized   { int b; char a; char c; }; // sizeof = 8\n\n#pragma pack(push, 1) // Disables padding (exact packed size)\nstruct Packed      { char a; int b; char c; }; // sizeof = 6\n#pragma pack(pop)"
    },
    "pro_tip": "In embedded systems or network packet serialization, explain `#pragma pack(1)` or `__attribute__((packed))` to prevent padding between transmitted bytes.",
    "company_tags": [
      "Qualcomm",
      "Intel",
      "Cisco",
      "Nvidia"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 16
  },
  {
    "id": "int-c-017",
    "topic_id": "topic-c",
    "title": "What is the difference between a Structure and a Union in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Both `struct` and `union` are composite user-defined data types, but their memory architectures are fundamentally opposite:\n\n\u2022 Structure (struct):\n- Every member is allocated its OWN separate memory location.\n- Total memory size = Sum of sizes of all members + any structure padding bytes.\n- All members can be accessed and store distinct values concurrently.\n\n\u2022 Union (union):\n- All members SHARE the exact SAME memory location.\n- Total memory size = Size of its largest member (plus alignment padding).\n- Only ONE member can hold a valid value at any given time. Assigning a value to one member overwrites the others.\n\nUse Case for Union: Hardware registers, variant data types, network packet headers where a payload can represent different message types.",
    "bullet_points": [
      "struct: each member has dedicated memory; all members active concurrently.",
      "union: all members share identical memory; only 1 member valid at a time.",
      "Size: struct >= sum of members; union = size of largest member.",
      "Unions conserve memory when fields are mutually exclusive."
    ],
    "code_snippet": {
      "language": "c",
      "code": "struct S { int i; char c; double d; }; // sizeof = ~16 bytes\nunion  U { int i; char c; double d; }; // sizeof = 8 bytes (double)\n\nunion U u;\nu.i = 100;\nu.d = 3.14; // Overwrites u.i with double bit representation!"
    },
    "pro_tip": "Unions are often paired with an enum inside a struct to create a 'Tagged Union' (discriminated union) to track which union member is currently active.",
    "company_tags": [
      "Qualcomm",
      "Intel",
      "Bosch",
      "TCS"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 17
  },
  {
    "id": "int-c-018",
    "topic_id": "topic-c",
    "title": "What is the difference between 'const int *p', 'int * const p', and 'const int * const p'?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "This is a classic pointer interview question testing `const` qualifier placement (read right-to-left):\n\n1. `const int *p` (or `int const *p`):\n\u2022 Pointer to Constant Integer.\n\u2022 The value pointed to is constant and cannot be modified (`*p = 20;` FAILS).\n\u2022 The pointer itself is mutable and can point to another memory address (`p = &other;` SUCCEEDS).\n\n2. `int * const p`:\n\u2022 Constant Pointer to Integer.\n\u2022 The pointer address is fixed and cannot point anywhere else (`p = &other;` FAILS).\n\u2022 The value pointed to can be freely modified (`*p = 20;` SUCCEEDS).\n\n3. `const int * const p`:\n\u2022 Constant Pointer to Constant Integer.\n\u2022 Neither the pointer address nor the value pointed to can be modified (`*p = 20;` FAILS and `p = &other;` FAILS).",
    "bullet_points": [
      "const before *: data is constant (*p = x is illegal).",
      "const after *: pointer address is constant (p = &x is illegal).",
      "const both sides: both pointer and target data are read-only.",
      "Rule of thumb: Read declarations from right to left."
    ],
    "code_snippet": {
      "language": "c",
      "code": "int x = 10, y = 20;\nconst int *p1 = &x;     // *p1 = 15 (Error), p1 = &y (OK)\nint * const p2 = &x;     // *p2 = 15 (OK),    p2 = &y (Error)\nconst int * const p3 = &x; // *p3 = 15 (Error), p3 = &y (Error)"
    },
    "pro_tip": "Teach the interviewer the 'Clockwise/Spiral Rule' or 'Right-to-Left Rule' to show mastery: Find the identifier `p`, read right, then read left.",
    "company_tags": [
      "Qualcomm",
      "Amazon",
      "Intel",
      "Microsoft"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 18
  },
  {
    "id": "int-c-019",
    "topic_id": "topic-c",
    "title": "What is a Function Pointer in C and what are its practical use cases?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "A function pointer is a pointer that stores the starting memory address of executable code (a function) in the Text/Code segment, rather than a data address in Heap or Stack.\n\nDeclaration Syntax:\n`return_type (*func_ptr_name)(param_types);`\n(The parentheses around `*func_ptr_name` are mandatory; without them, it declares a function returning a pointer).\n\nPractical Use Cases:\n1. Callbacks: Passing a function as an argument to another function (e.g., comparator passed to `qsort()`).\n2. Event-Driven Systems & GUI: Registering event handlers and button click listeners.\n3. Jump Tables / State Machines: Implementing dispatch tables to replace huge `switch-case` statements with O(1) table lookups.\n4. Simulating OOP Polymorphism: Emulating virtual methods and vtables in C.",
    "bullet_points": [
      "Points to executable instructions in the Text segment.",
      "Syntax: int (*fp)(int, int) = add;",
      "Essential for callback architectures, qsort(), and state machines.",
      "Enables object-oriented polymorphism patterns in pure C."
    ],
    "code_snippet": {
      "language": "c",
      "code": "int add(int a, int b) { return a + b; }\n\nint main() {\n    int (*op)(int, int) = add; // Assign function address\n    int result = op(5, 3);     // Invocation: returns 8\n    printf(\"%d\", result);\n}"
    },
    "pro_tip": "Mention `qsort(arr, n, sizeof(int), compare)` as the definitive real-world C standard library function relying entirely on function pointers.",
    "company_tags": [
      "Qualcomm",
      "Nvidia",
      "Intel",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 19
  },
  {
    "id": "int-c-020",
    "topic_id": "topic-c",
    "title": "What is a Memory Leak in C, how does it occur, and how do you detect/prevent it?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "A memory leak occurs when dynamically allocated Heap memory (`malloc`, `calloc`, `realloc`) is no longer needed by the program, but is never deallocated using `free()`, and all pointers referencing that block are lost.\n\nConsequences: As the program continues running, unavailable heap memory accumulates. Over time, the application exhausts system RAM, slowing the OS and ultimately crashing with an Out Of Memory (OOM) error.\n\nCommon Causes:\n1. Losing pointer reference before freeing (`ptr = malloc(100); ptr = malloc(200);` leaks first 100 bytes).\n2. Exiting function without freeing locally allocated dynamic memory.\n3. Returning early from a function on error branches without freeing.\n\nPrevention & Detection:\n\u2022 Golden Rule: Every `malloc` must have a corresponding `free`.\n\u2022 Always set pointer to `NULL` after freeing.\n\u2022 Use memory profiling tools: `Valgrind` (`valgrind --leak-check=full ./a.out`) or GCC AddressSanitizer (`-fsanitize=address`).",
    "bullet_points": [
      "Occurs when heap memory is allocated but never freed after references are lost.",
      "Causes gradual memory depletion leading to process crashes.",
      "Detected using Valgrind or AddressSanitizer (ASan).",
      "Prevention: strict paired allocation/deallocation and setting pointers to NULL."
    ],
    "code_snippet": {
      "language": "c",
      "code": "void leak() {\n    char *buf = (char*)malloc(1024); // 1 KB allocated on Heap\n    if (error_condition) return;     // LEAK: exits without calling free(buf)!\n    free(buf);\n}"
    },
    "pro_tip": "Always mention Valgrind and AddressSanitizer (`-fsanitize=address -g`)\u2014interviewers look for candidates who know industry-standard debugging tools.",
    "company_tags": [
      "Qualcomm",
      "Intel",
      "Microsoft",
      "Google"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 20
  },
  {
    "id": "int-c-021",
    "topic_id": "topic-c",
    "title": "What is a Dangling Pointer vs a Wild Pointer in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "\u2022 Dangling Pointer:\n- A pointer that continues pointing to a memory address that has already been deallocated or freed.\n- Occurs when dynamically allocated memory is released with `free(ptr)`, but `ptr` is not set to `NULL`.\n- Also occurs when a pointer points to a local stack variable of a function that has already returned.\n- Dereferencing or writing to a dangling pointer corrupts heap memory or causes a segmentation fault.\n\n\u2022 Wild Pointer:\n- A pointer that has been declared but NEVER initialized to any memory address or NULL.\n- It contains arbitrary garbage bits pointing to an unknown random location in system RAM.\n- Attempting to dereference a wild pointer can overwrite critical memory or crash immediately.\n\nPrevention:\n1. Always initialize pointers to `NULL` upon declaration (`int *p = NULL;`).\n2. Immediately set pointers to `NULL` after calling `free(p)`.",
    "bullet_points": [
      "Dangling: points to freed memory or destroyed stack frame.",
      "Wild: uninitialized pointer containing garbage memory address.",
      "Fix for wild pointer: initialize to NULL on declaration (int *p = NULL).",
      "Fix for dangling pointer: set to NULL immediately after free(p)."
    ],
    "code_snippet": {
      "language": "c",
      "code": "int *wild;            // WILD POINTER: uninitialized garbage address\n\nint *dangling = (int*)malloc(sizeof(int));\nfree(dangling);       // DANGLING: memory freed, but pointer still holds address!\n// *dangling = 5;     // DANGEROUS: writes to freed memory!\ndangling = NULL;      // SAFE: resolved"
    },
    "pro_tip": "Warn against returning pointers to local stack variables: `int* func() { int x = 10; return &x; }` creates an immediate dangling pointer because `x` dies when `func` returns.",
    "company_tags": [
      "Qualcomm",
      "Intel",
      "TCS",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 21
  },
  {
    "id": "int-c-022",
    "topic_id": "topic-c",
    "title": "What is a Segmentation Fault (SIGSEGV) and what are its most common causes?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "A Segmentation Fault (SIGSEGV) is a specific hardware-triggered error signal generated by the Memory Management Unit (MMU) and operating system when a program attempts to access a memory location that it does not have permission to access, or that does not exist in its virtual address space.\n\nMost Common Causes in C:\n1. Dereferencing a NULL pointer (`int *p = NULL; *p = 5;`).\n2. Dereferencing an uninitialized or wild pointer.\n3. Buffer Overflow: Writing beyond the allocated bounds of an array into protected memory.\n4. Writing to Read-Only Memory: Attempting to modify string literals stored in the Text/Code segment (`char *str = \"hello\"; str[0] = 'H';`).\n5. Stack Overflow: Infinite recursion consuming all available stack memory frames.\n6. Accessing dangling pointers to deallocated heap blocks.",
    "bullet_points": [
      "Triggered by MMU/OS when accessing invalid or protected memory.",
      "Common causes: NULL dereference, wild pointer, buffer overflow, writing to string literals.",
      "Infinite recursion triggers SIGSEGV via Stack Overflow.",
      "Modifying string literals (char *s = \"abc\"; s[0]='x') crashes because literals are read-only."
    ],
    "code_snippet": {
      "language": "c",
      "code": "char *literal = \"Read-Only\"; // Stored in read-only Text segment\n// literal[0] = 'W';           // CRASH: Segmentation fault (SIGSEGV)!\n\nchar mutable_arr[] = \"Mutable\"; // Stored on Stack frame\nmutable_arr[0] = 'W';           // VALID"
    },
    "pro_tip": "Highlight the difference: `char *s = \"hello\"` is stored in read-only Text segment (modifying it crashes). `char s[] = \"hello\"` copies characters to the Stack (modifiable).",
    "company_tags": [
      "Qualcomm",
      "Intel",
      "Cisco",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 22
  },
  {
    "id": "int-c-023",
    "topic_id": "topic-c",
    "title": "What is the difference between 'typedef' and '#define' in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "While both are used to create aliases, they operate at completely different compilation stages with different semantics:\n\n\u2022 #define (Preprocessor Directive):\n- Evaluated by the PREPROCESSOR before compilation.\n- Simple textual substitution without any syntactic or semantic understanding.\n- Does not obey scope rules (valid from declaration until end of file or `#undef`).\n- Cannot be debugged easily with symbol debuggers.\n\n\u2022 typedef (C Keyword):\n- Evaluated by the COMPILER during semantic analysis.\n- Creates a genuine type alias with full type safety checking.\n- Obeys normal C scope rules (can be local to a function or block).\n- Properly handles pointer aliasing across multiple variable declarations.",
    "bullet_points": [
      "typedef is compiler-interpreted; #define is textual preprocessor replacement.",
      "typedef respects block scope; #define is global across the file.",
      "typedef int* IntPtr; IntPtr a, b; creates two pointers. #define INT_PTR int* creates 1 pointer and 1 int!"
    ],
    "code_snippet": {
      "language": "c",
      "code": "#define PTR_DEF int*\ntypedef int* PTR_TYP;\n\nPTR_DEF a, b; // Expands to: int* a, b; -> 'a' is pointer, 'b' is plain int!\nPTR_TYP c, d; // Both 'c' and 'd' are genuine int* pointers!"
    },
    "pro_tip": "The pointer declaration trap `INT_PTR a, b;` is one of the most famous C interview questions. Always show how `typedef` guarantees both variables are pointers.",
    "company_tags": [
      "TCS",
      "Qualcomm",
      "Infosys"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 23
  },
  {
    "id": "int-c-024",
    "topic_id": "topic-c",
    "title": "Explain recursion in C and how the Call Stack manages stack frames.",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Recursion is a programming technique where a function calls itself directly or indirectly to solve a smaller instance of the same problem.\n\nStack Frame Mechanics:\n1. Each time a function calls itself, the CPU allocates a new Stack Frame on the Call Stack.\n2. The stack frame stores:\n   \u2022 Local variables of that invocation.\n   \u2022 Input parameters passed to the function.\n   \u2022 The Return Address (where execution should resume once the call finishes).\n3. Each recursive call pushes a new frame onto the stack, consuming stack memory.\n4. When the Base Case is satisfied, the function returns; stack frames are popped one by one in LIFO order.\n\nCritical Hazard: If the base case is missing or unreachable, recursive calls continue pushing frames indefinitely until stack space is exhausted, resulting in `Stack Overflow` (segmentation fault).",
    "bullet_points": [
      "Every recursive call pushes a new stack frame (parameters, local vars, return address).",
      "Base case is mandatory to terminate recursion and trigger stack unwind.",
      "Missing base case causes Stack Overflow crash.",
      "Tail recursion can be optimized by compilers into loops to save stack frames."
    ],
    "code_snippet": {
      "language": "c",
      "code": "int factorial(int n) {\n    if (n <= 1) return 1; // Base case: stops recursion\n    return n * factorial(n - 1); // Recursive call: pushes new stack frame\n}"
    },
    "pro_tip": "Introduce Tail Call Optimization (TCO): If the recursive call is the very last operation in the function, smart compilers (`gcc -O2`) reuse the existing stack frame, converting recursion into a loop.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "TCS"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 24
  },
  {
    "id": "int-c-025",
    "topic_id": "topic-c",
    "title": "What is the difference between 'pass by value' and 'pass by reference' in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Technically, C is STRICTLY PASS-BY-VALUE. There is NO true pass-by-reference mechanism built into the C language syntax (unlike C++ references `&`).\n\nHow C Simulates Pass-by-Reference:\n1. Pass-by-Value: The value of the actual argument is copied into the function's formal parameter variable on the stack. Changes made inside the function affect only the local copy and do NOT alter the original variable in the caller.\n\n2. Simulating Pass-by-Reference via Pointers: Instead of passing the variable itself, the caller passes the MEMORY ADDRESS (`&var`) of the variable by value. The function receives a pointer copy holding that address. By dereferencing the pointer (`*ptr`), the function can directly read and mutate the caller's original variable in memory.",
    "bullet_points": [
      "C is strictly pass-by-value at all times.",
      "Pass-by-value copies the argument value; changes do not affect caller.",
      "Pass-by-reference is simulated in C by passing memory addresses (pointers) by value.",
      "Dereferencing the pointer modifies the caller's variable directly."
    ],
    "code_snippet": {
      "language": "c",
      "code": "void swap(int *a, int *b) { // Receives addresses\n    int temp = *a;\n    *a = *b;\n    *b = temp; // Mutates caller's memory directly\n}\n\nint x = 5, y = 10;\nswap(&x, &y); // Passes addresses by value"
    },
    "pro_tip": "Correct the interviewer politely if they say 'C has pass-by-reference': 'C only has pass-by-value, but we simulate pass-by-reference by passing pointers by value.'",
    "company_tags": [
      "Qualcomm",
      "TCS",
      "Intel",
      "Infosys"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 25
  },
  {
    "id": "int-c-026",
    "topic_id": "topic-c",
    "title": "What are Bit Fields in C and where are they used?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Bit fields allow members of a `struct` or `union` to be allocated with a specific number of bits, rather than full byte multiples (e.g., 1 bit for a boolean flag instead of 32 bits for an int).\n\nSyntax: `type member_name : width_in_bits;`\n\nUse Cases:\n1. Embedded Systems & Hardware Registers: Interfacing with microcontrollers where specific hardware status registers have 1-bit or 2-bit flags.\n2. Network Protocols: Implementing packet headers (e.g., IP header flags, TCP control bits SYN, ACK, FIN) that require exact bit-level sizing.\n3. Memory Compression: Storing thousands of boolean flags or small integer ranges (-3 to 3) in minimal RAM footprint.\n\nLimitations: You CANNOT take the address of a bit-field member (`&flags.is_active` causes a compile error) because pointers can only address byte boundaries, not individual bits.",
    "bullet_points": [
      "Enables allocating exact number of bits for struct members.",
      "Essential for hardware registers, device drivers, and network headers.",
      "Massively compresses memory for boolean flags.",
      "Cannot apply address-of (&) operator to a bit field member."
    ],
    "code_snippet": {
      "language": "c",
      "code": "struct DeviceStatus {\n    unsigned int is_ready    : 1; // 1 bit (0 or 1)\n    unsigned int error_code  : 3; // 3 bits (0 to 7)\n    unsigned int mode        : 2; // 2 bits (0 to 3)\n}; // Fits in 1 single 4-byte int instead of 12 bytes!"
    },
    "pro_tip": "Remember: Bit fields cannot be addressed with `&` because CPU memory addresses operate on bytes, not individual bits.",
    "company_tags": [
      "Qualcomm",
      "Intel",
      "Bosch",
      "Texas Instruments"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 26
  },
  {
    "id": "int-c-027",
    "topic_id": "topic-c",
    "title": "What is the difference between static and dynamic linking in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Linking is the final stage of compilation that resolves external library functions into executable code:\n\n\u2022 Static Linking (`.a` / `.lib`):\n- All external library code used by the program is copied directly into the final executable binary at compile time.\n- Advantage: The executable is completely self-contained and portable; it runs on any compatible machine without requiring external library files.\n- Disadvantage: Executable file size is significantly larger; updating the library requires recompiling the entire application.\n\n\u2022 Dynamic Linking (`.so` / `.dll`):\n- Library code is NOT copied into the binary. Only symbolic references and function table stubs are embedded.\n- The dynamic linker resolves and loads the shared library into RAM at runtime when the program launches.\n- Advantage: Drastically smaller executable sizes; multiple running processes share the same library code in RAM; libraries can be upgraded without recompiling applications.\n- Disadvantage: Missing DLL / `.so` crashes the program at startup ('DLL Hell').",
    "bullet_points": [
      "Static (.a): copies library code into binary at build time (larger file, self-contained).",
      "Dynamic (.so/.dll): loads library into RAM at runtime (smaller binary, shared memory).",
      "Dynamic linking allows upgrading libraries without recompiling programs."
    ],
    "code_snippet": null,
    "pro_tip": "In Linux, inspect dynamically linked libraries of any binary with the command: `ldd ./a.out`.",
    "company_tags": [
      "Cisco",
      "Qualcomm",
      "Intel",
      "Red Hat"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 27
  },
  {
    "id": "int-c-028",
    "topic_id": "topic-c",
    "title": "How do you detect Endianness (Little Endian vs Big Endian) in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Endianness refers to the order in which bytes of a multi-byte word are stored in computer memory:\n\u2022 Little Endian: The Least Significant Byte (LSB) is stored at the lowest memory address (common in x86, x64, ARM).\n\u2022 Big Endian: The Most Significant Byte (MSB) is stored at the lowest memory address (common in network protocols, mainframe architectures).\n\nDetection Algorithm in C:\nStore an integer `1` (which is `0x00000001` in 32-bit hexadecimal). Cast its memory address to a `char*` pointer to inspect the very first byte in memory:\n\u2022 If the first byte `*c` is `1`, the architecture is Little Endian.\n\u2022 If the first byte `*c` is `0`, the architecture is Big Endian.",
    "bullet_points": [
      "Little Endian: LSB at lowest address (Intel x86/x64, ARM default).",
      "Big Endian: MSB at lowest address (Network Byte Order).",
      "Detected by inspecting first byte of int x = 1 cast to char*."
    ],
    "code_snippet": {
      "language": "c",
      "code": "int x = 1;\nchar *c = (char*)&x;\nif (*c == 1) {\n    printf(\"Little Endian\\n\");\n} else {\n    printf(\"Big Endian\\n\");\n}"
    },
    "pro_tip": "Remember network programming: Network Byte Order is ALWAYS Big Endian. Functions like `htons()` (host to network short) and `ntohl()` convert between host endianness and network endianness.",
    "company_tags": [
      "Qualcomm",
      "Cisco",
      "Intel",
      "Nvidia"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 28
  },
  {
    "id": "int-c-029",
    "topic_id": "topic-c",
    "title": "What is the difference between 'char *str = \"Hello\"' and 'char str[] = \"Hello\"'?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "While they appear similar, their memory layout and mutability are completely different:\n\n1. `char *str = \"Hello\";`:\n\u2022 The string literal `\"Hello\"` is stored in the Read-Only Text/Code segment.\n\u2022 `str` is a pointer variable stored on the Stack that holds the address of that read-only string.\n\u2022 Attempting to modify characters (`str[0] = 'h';`) causes an immediate Segmentation Fault (SIGSEGV) at runtime.\n\n2. `char str[] = \"Hello\";`:\n\u2022 The array `str` is allocated directly on the Stack frame (6 bytes: 5 chars + `\\0`).\n\u2022 The literal characters are copied into this local stack array at initialization.\n\u2022 You can freely read and mutate characters (`str[0] = 'h';` is 100% legal and safe).",
    "bullet_points": [
      "char *s points to read-only string literal in Text segment (modifying crashes).",
      "char s[] allocates array on Stack and copies characters (safely mutable).",
      "sizeof(char*) = 4 or 8 bytes; sizeof(char[]) = exact string length + 1."
    ],
    "code_snippet": {
      "language": "c",
      "code": "char *p = \"Hello\"; // In Text segment\n// p[0] = 'h';      // RUNTIME CRASH: Segmentation fault\n\nchar a[] = \"Hello\"; // On Stack\na[0] = 'h';         // SUCCESS: string is now \"hello\""
    },
    "pro_tip": "Always declare pointer string literals as `const char *str = \"Hello\";` so the compiler will catch illegal write attempts at compile-time instead of crashing at runtime.",
    "company_tags": [
      "Amazon",
      "Qualcomm",
      "TCS",
      "Microsoft"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 29
  },
  {
    "id": "int-c-030",
    "topic_id": "topic-c",
    "title": "What is the difference between 'exit(0)' and 'return 0' in the main function of C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Inside `main()`, both `return 0` and `exit(0)` terminate the program and return exit status code 0 to the operating system, but they differ in execution mechanics:\n\n1. `return 0`:\n\u2022 A language statement that exits the current function.\n\u2022 In `main()`, returning will unwind local stack variables and call the C runtime termination routine (`exit`).\n\u2022 If called inside a helper function, it merely returns to the caller, leaving the program running.\n\n2. `exit(0)`:\n\u2022 A standard library function defined in `<stdlib.h>`.\n\u2022 Can be called from ANY function, at any recursion depth, to immediately terminate the entire program.\n\u2022 Flushes all unwritten buffered output streams (`fflush`).\n\u2022 Closes all open file descriptors.\n\u2022 Invokes all cleanup functions registered via `atexit()`.\n\u2022 Does NOT unwind local stack frames in helper functions (destructors/local cleanups skipped).",
    "bullet_points": [
      "return exits current function; in main() it returns control to CRT startup code.",
      "exit() immediately terminates entire program from any nested function.",
      "exit() flushes output buffers and calls atexit() handlers.",
      "exit() does not unwind local stack frames."
    ],
    "code_snippet": {
      "language": "c",
      "code": "void deepFunction() {\n    if (fatal_error) {\n        exit(1); // Terminates entire process immediately from here\n    }\n}"
    },
    "pro_tip": "Contrast with `_exit(0)`: `_exit()` is a direct POSIX system call that terminates immediately without flushing stdio buffers or calling `atexit()` handlers.",
    "company_tags": [
      "Qualcomm",
      "Intel",
      "Cisco"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 30
  },
  {
    "id": "int-c-031",
    "topic_id": "topic-c",
    "title": "What is an Inline Function in C (C99) and when should it be used?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "An `inline` function (standardized in C99) is a function declared with the `inline` keyword that suggests to the compiler that the function's body should be substituted directly at the call site, rather than executing a traditional function call.\n\nAdvantages over Traditional Functions:\n\u2022 Eliminates function call overhead (no stack frame allocation, no saving/restoring CPU registers, no jump instructions).\n\nAdvantages over Macros:\n\u2022 Full type safety and compiler syntax verification.\n\u2022 No macro side effects with `++` or `--` operands.\n\u2022 Normal variable scoping.\n\nWhen to Use:\n\u2022 Small, frequently called helper functions (1 to 3 lines, e.g., `max(a, b)`).\n\u2022 Performance-critical inner loops.\n\u2022 Do NOT inline large functions; inlining large functions causes code bloat, filling the CPU instruction cache and degrading performance.",
    "bullet_points": [
      "Suggests compiler replace function call with inline code body.",
      "Eliminates call stack overhead while maintaining strict type safety.",
      "Best for small, hot functions (1-3 lines).",
      "Compiler can ignore the inline suggestion if the function is too large or recursive."
    ],
    "code_snippet": {
      "language": "c",
      "code": "static inline int max(int a, int b) {\n    return (a > b) ? a : b;\n}"
    },
    "pro_tip": "Emphasize that `inline` is only a recommendation (hint) to the compiler. The compiler can freely reject inlining if the function is recursive, too complex, or takes its own function pointer address.",
    "company_tags": [
      "Intel",
      "Qualcomm",
      "Nvidia"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 31
  },
  {
    "id": "int-c-032",
    "topic_id": "topic-c",
    "title": "What is an Enumeration (enum) in C and what is its default numbering?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "An enumeration (`enum`) is a user-defined data type used to assign meaningful names to integral constants, improving code readability and maintainability.\n\nDefault Numbering Rules:\n1. By default, the first enum constant is assigned value `0`.\n2. Each subsequent constant is automatically assigned the value of the previous constant plus `1`.\n3. Custom values can be assigned to any constant. Subsequent unassigned constants will continue incrementing from that new value.\n\nMemory Size: An enum in C is treated as an `int` and typically occupies 4 bytes in memory.",
    "bullet_points": [
      "Assigns symbolic names to integer constants.",
      "Defaults to starting at 0 and increments by 1.",
      "Custom values can be assigned at any position.",
      "Stored internally as standard integer types."
    ],
    "code_snippet": {
      "language": "c",
      "code": "enum Day { MON = 1, TUE, WED, THU, FRI, SAT, SUN };\n// MON=1, TUE=2, WED=3, etc.\n\nenum Status { OK = 200, CREATED = 201, BAD_REQUEST = 400, NOT_FOUND };\n// NOT_FOUND automatically becomes 401"
    },
    "pro_tip": "Point out that enums provide much better debugging visibility in tools like GDB compared to `#define`, because the debugger retains the symbolic enum name.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro"
    ],
    "frequency": "MEDIUM",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 32
  },
  {
    "id": "int-c-033",
    "topic_id": "topic-c",
    "title": "What is the difference between 'qsort' and manual sorting in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "`qsort` is the C standard library sorting function defined in `<stdlib.h>`.\n\nSignature:\n`void qsort(void *base, size_t nitems, size_t size, int (*compar)(const void *, const void *));`\n\nKey Attributes:\n1. Generic: Uses `void*` so it can sort arrays of ANY data type (integers, strings, floats, complex structs).\n2. High Performance: Typically implemented as an optimized hybrid Quicksort / Introsort algorithm with O(N log N) average time complexity.\n3. Custom Comparator: Relies on a callback function pointer returning:\n   \u2022 Negative value if `elem1 < elem2`\n   \u2022 Zero if `elem1 == elem2`\n   \u2022 Positive value if `elem1 > elem2`.\n\nUsing `qsort` avoids reinventing sorting algorithms and leverages highly optimized, cache-friendly library implementations.",
    "bullet_points": [
      "Standard library generic sort function using void* and comparator callback.",
      "O(N log N) average time complexity.",
      "Comparator returns < 0 (first smaller), 0 (equal), > 0 (first larger)."
    ],
    "code_snippet": {
      "language": "c",
      "code": "int compare_ints(const void *a, const void *b) {\n    return (*(int*)a - *(int*)b); // Ascending order\n}\n\nint arr[] = {42, 12, 88, 5, 23};\nqsort(arr, 5, sizeof(int), compare_ints);"
    },
    "pro_tip": "Comparator trap: Writing `return *(int*)a - *(int*)b;` can cause integer overflow if numbers are very large negative/positive. Safer practice: `if (*(int*)a < *(int*)b) return -1;`.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 33
  },
  {
    "id": "int-c-034",
    "topic_id": "topic-c",
    "title": "What is Variable-Length Argument (varargs) in C and how does '<stdarg.h>' work?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Variable-length arguments allow a function to accept an unspecified number of parameters (like `printf`).\n\nMechanism (`<stdarg.h>`):\n1. The function signature specifies at least one fixed parameter followed by an ellipsis `...` (e.g., `void my_print(int count, ...)`).\n2. `va_list`: Declares a pointer variable that steps through the argument list on the stack.\n3. `va_start(valist, last_fixed_param)`: Initializes `valist` to point to the first variable argument immediately following `last_fixed_param`.\n4. `va_arg(valist, type)`: Retrieves the next argument as `type` and advances the pointer.\n5. `va_end(valist)`: Cleans up the `valist` before returning.",
    "bullet_points": [
      "Enables functions to accept variable number of arguments using '...'.",
      "Uses macros from <stdarg.h>: va_list, va_start, va_arg, va_end.",
      "At least one mandatory fixed parameter must precede '...'."
    ],
    "code_snippet": {
      "language": "c",
      "code": "#include <stdarg.h>\n\nint sum(int count, ...) {\n    va_list args;\n    va_start(args, count);\n    int total = 0;\n    for (int i = 0; i < count; i++) {\n        total += va_arg(args, int); // Retrieve next int\n    }\n    va_end(args);\n    return total;\n}"
    },
    "pro_tip": "Why does `printf` need format specifiers? Because C functions cannot determine argument types or counts at runtime on the stack; the format string instructs `va_arg` which types to extract.",
    "company_tags": [
      "Qualcomm",
      "Intel",
      "Cisco"
    ],
    "frequency": "MEDIUM",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 34
  },
  {
    "id": "int-c-035",
    "topic_id": "topic-c",
    "title": "Tricky Pointer Arithmetic: Explain the exact differences between '*p++', '(*p)++', and '*++p'.",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "This is one of the most famous and tricky pointer evaluation questions in C interviews. It tests operator precedence and associativity.\n\nPrecedence Rules: Postfix `++` has higher precedence than unary prefix `*`. Prefix `++` and unary `*` have equal precedence and evaluate right-to-left.\n\n1. `*p++`:\n\u2022 Evaluates as `*(p++)`.\n\u2022 Postfix `++` increments the POINTER `p` to the next memory address, but because it is postfix, it returns the OLD address for dereferencing.\n\u2022 Result: Dereferences original `p` value, THEN advances pointer `p`.\n\n2. `(*p)++`:\n\u2022 Parentheses force dereference first.\n\u2022 Postfix `++` increments the VALUE stored at the address pointed to by `p`.\n\u2022 The pointer `p` itself DOES NOT MOVE.\n\u2022 Result: Returns original value, then increments the value in memory.\n\n3. `*++p`:\n\u2022 Prefix `++` and `*` associate right-to-left: `*(++p)`.\n\u2022 The pointer `p` is incremented FIRST to the next address, and then the new address is dereferenced.\n\u2022 Result: Advances pointer `p`, then returns the value at the new address.",
    "bullet_points": [
      "*p++: fetches current value, then advances pointer to next address.",
      "(*p)++: increments the data value in memory; pointer address does not move.",
      "*++p: advances pointer to next address first, then fetches value at new address.",
      "Postfix ++ has higher precedence than *; prefix ++ and * associate right-to-left."
    ],
    "code_snippet": {
      "language": "c",
      "code": "int arr[] = {10, 20, 30};\nint *p = arr;\n\nprintf(\"%d\\n\", *p++);   // Prints 10; p now points to arr[1] (20)\nprintf(\"%d\\n\", (*p)++); // Prints 20; arr[1] becomes 21; p still points to arr[1]\nprintf(\"%d\\n\", *++p);   // Advances p to arr[2] first; Prints 30"
    },
    "pro_tip": "Memorize this progression! Interviewers often write `int x = *p++;` on a whiteboard and ask for the value of both `x` and `*p`.",
    "company_tags": [
      "Qualcomm",
      "Google",
      "Intel",
      "Microsoft"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 35
  },
  {
    "id": "int-c-036",
    "topic_id": "topic-c",
    "title": "What is the 'volatile' qualifier in C and why is it critical in Embedded Systems and ISRs?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "The `volatile` keyword tells the C compiler that a variable's value can change at any moment from outside the current program flow (e.g., modified by hardware, an Interrupt Service Routine, or a concurrent thread).\n\nWhat it prevents:\nCompilers aggressively optimize code. If a loop checks a variable (`while (!flag)`), the compiler may read `flag` into a CPU register once and reuse that register, never re-reading RAM. If an external hardware interrupt changes `flag` in RAM, the program gets trapped in an infinite loop!\n\nWhen `volatile` is added (`volatile int flag;`), it forces the compiler to re-read the variable directly from physical RAM every single time it is accessed, disabling register caching.\n\nThree Mandatory Use Cases:\n1. Memory-Mapped Peripheral Registers in microcontrollers (e.g., reading UART buffer).\n2. Global variables shared between an Interrupt Service Routine (ISR) and main loop.\n3. Multi-threaded shared memory flags.",
    "bullet_points": [
      "Tells compiler that variable value can change unexpectedly outside program code.",
      "Prevents compiler from caching the variable in CPU registers.",
      "Mandatory for memory-mapped I/O hardware registers and ISR flags.",
      "Does NOT guarantee thread synchronization/atomicity (not a mutex replacement)."
    ],
    "code_snippet": {
      "language": "c",
      "code": "volatile int is_interrupted = 0; // Prevent register optimization\n\nvoid ISR_Handler() {\n    is_interrupted = 1; // Modified by hardware interrupt\n}\n\nint main() {\n    while (!is_interrupted) {\n        // Without volatile, compiler might optimize this to while(1)!\n    }\n}"
    },
    "pro_tip": "State clearly: `volatile` prevents compiler optimizations; it does NOT provide atomic operations or memory barriers for multi-threading!",
    "company_tags": [
      "Qualcomm",
      "Intel",
      "Bosch",
      "Texas Instruments",
      "Apple"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 36
  },
  {
    "id": "int-c-037",
    "topic_id": "topic-c",
    "title": "What is Undefined Behavior (UB) and Sequence Points in C? Explain 'i = i++ + ++i'.",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Undefined Behavior (UB) means the C language specification imposes NO requirements or guarantees on what the compiled code will do. The program might produce unpredictable output, crash with a segfault, or produce completely different results across different compilers (GCC vs Clang) or optimization flags (`-O0` vs `-O3`).\n\nSequence Point Rule (Pre-C11):\nBetween two sequence points, the stored value of an object may be modified at most ONCE. If an object is modified multiple times without an intervening sequence point, the behavior is strictly UNDEFINED.\n\nWhy `i = i++ + ++i;` is Undefined Behavior:\n\u2022 The variable `i` is being modified multiple times (`i++` and `++i`) and also assigned (`i = ...`) within a single expression with no sequence point.\n\u2022 The C compiler is free to evaluate operands in any arbitrary order.\n\u2022 GCC might evaluate `++i` first, Clang might evaluate `i++` first.\n\u2022 Never write or rely on expressions with multiple unsequenced side effects on the same variable!",
    "bullet_points": [
      "Undefined Behavior has zero specification guarantees (can format disk or crash).",
      "Modifying a variable multiple times without an intervening sequence point is UB.",
      "Expressions like i = i++ + ++i or a[i] = i++ are completely illegal in standard C.",
      "Sequence points occur at: semicolons (;), logical AND (&&), OR (||), and comma (,)."
    ],
    "code_snippet": {
      "language": "c",
      "code": "int i = 5;\n// i = i++ + ++i; // UNDEFINED BEHAVIOR: Never do this in production!\n\n// Safe alternative:\ni++;\nint result = i + (i + 1);\ni++;"
    },
    "pro_tip": "If an interviewer shows you `i = i++ + ++i;` and asks 'What is the output?', the only correct answer is: 'It is Undefined Behavior in C standard, compiler-dependent.'",
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Qualcomm"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 37
  },
  {
    "id": "int-c-038",
    "topic_id": "topic-c",
    "title": "How do you implement the 'sizeof' operator using Pointer Arithmetic without using library functions?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "The `sizeof` operator in C is a compile-time operator that returns the size (in bytes) of an object or type.\n\nYou can simulate `sizeof` using a macro that exploits pointer arithmetic:\n\n`#define my_sizeof(type) ((size_t)((type*)0 + 1))`\n\nHow it works:\n1. `(type*)0`: Casts the address `0` (NULL) to a pointer of the specified `type`.\n2. `+ 1`: In C pointer arithmetic, adding 1 to a typed pointer advances the address by `1 * sizeof(type)` bytes.\n3. `((size_t)...)`: Subtracting or measuring the resulting address from 0 gives the exact number of bytes occupied by `type` in memory!\n\nFor a variable `var`:\n`#define my_sizeof_var(var) ((size_t)((char*)(&var + 1) - (char*)(&var)))`\nSubtracting the base address of `var` from the address of `(&var + 1)` in `char*` units yields the exact byte length.",
    "bullet_points": [
      "Exploits pointer arithmetic: (type*)0 + 1 advances by sizeof(type) bytes.",
      "For variable: (char*)(&var + 1) - (char*)(&var) calculates byte difference.",
      "Casts to char* because sizeof(char) is guaranteed to be 1 byte in C.",
      "Evaluated without dereferencing, so zero memory is accessed at runtime."
    ],
    "code_snippet": {
      "language": "c",
      "code": "#define my_sizeof_type(type) ((size_t)((type*)0 + 1))\n#define my_sizeof_var(var)   ((size_t)((char*)(&var + 1) - (char*)(&var)))\n\nint main() {\n    double d;\n    printf(\"%zu\\n\", my_sizeof_type(double)); // Prints: 8\n    printf(\"%zu\\n\", my_sizeof_var(d));       // Prints: 8\n}"
    },
    "pro_tip": "This is a classic interview brain-teaser! Interviewers ask this to test your deep understanding of pointer scaling in pointer arithmetic.",
    "company_tags": [
      "Microsoft",
      "Amazon",
      "Adobe",
      "Qualcomm"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 38
  },
  {
    "id": "int-c-039",
    "topic_id": "topic-c",
    "title": "What is a Flexible Array Member (FAM) in C99 and how is it allocated?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "A Flexible Array Member (introduced in C99) is an incomplete array declared as the LAST member of a `struct` without specifying a size (e.g., `int data[];`).\n\nRules & Characteristics:\n1. Must be the VERY LAST member of the struct.\n2. The struct must contain at least one other named member.\n3. `sizeof(struct)` does NOT include any memory for the flexible array member (it treats the array size as 0 bytes, plus any padding).\n\nHow it is Allocated:\nMemory for both the struct header and the variable-length array is allocated in a SINGLE contiguous `malloc()` call:\n`struct Packet *p = malloc(sizeof(struct Packet) + n * sizeof(int));`\n\nAdvantages:\n\u2022 Single allocation and single `free()` call.\n\u2022 Eliminates pointer indirection (data is stored inline immediately following the struct fields).\n\u2022 Cache-friendly: Struct and data reside in adjacent contiguous memory cache lines.",
    "bullet_points": [
      "Incomplete array (int arr[];) declared as the last struct member.",
      "sizeof(struct) ignores the flexible array member.",
      "Allocated contiguously in a single malloc call: sizeof(struct) + n * sizeof(element).",
      "Superior cache locality and single free() deallocation."
    ],
    "code_snippet": {
      "language": "c",
      "code": "struct Packet {\n    int length;\n    int payload[]; // Flexible array member\n};\n\nint n = 100;\nstruct Packet *p = malloc(sizeof(struct Packet) + n * sizeof(int));\np->length = n;\np->payload[0] = 42; // Directly accessed inline!\nfree(p);            // Single free releases both struct and payload"
    },
    "pro_tip": "Used extensively in Linux kernel networking code (e.g., `sk_buff`) to package protocol headers and payload data in one allocation.",
    "company_tags": [
      "Linux Foundation",
      "Cisco",
      "Qualcomm",
      "Nvidia"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 39
  },
  {
    "id": "int-c-040",
    "topic_id": "topic-c",
    "title": "What is a Self-Referential Structure in C and how does it enable Dynamic Data Structures?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "A self-referential structure is a `struct` that contains one or more pointer members that point to a structure of the SAME type.\n\nWhy it must be a pointer:\nA struct CANNOT contain an actual direct instance of itself (`struct Node next;` is ILLEGAL) because that would create infinite recursive sizing, making `sizeof(struct Node)` infinite and impossible for the compiler to determine.\nHowever, a POINTER to the same struct (`struct Node *next;`) is completely valid, because pointers always have a known, fixed size (4 or 8 bytes) regardless of the target type.\n\nApplications:\nSelf-referential structures are the foundation for building dynamic, non-contiguous data structures in C:\n\u2022 Singly Linked Lists (`next` pointer)\n\u2022 Doubly Linked Lists (`next` and `prev` pointers)\n\u2022 Binary Trees (`left` and `right` child pointers)\n\u2022 Graphs (adjacency lists).",
    "bullet_points": [
      "Contains a pointer member targeting its own struct type.",
      "Direct member instance is impossible (infinite recursive size).",
      "Pointer has fixed 4/8 byte size, enabling safe compiler definition.",
      "Essential building block for Linked Lists, Binary Search Trees, and Graphs."
    ],
    "code_snippet": {
      "language": "c",
      "code": "struct Node {\n    int data;\n    struct Node *next; // Self-referential pointer\n};\n\nstruct Node* createNode(int val) {\n    struct Node* n = (struct Node*)malloc(sizeof(struct Node));\n    n->data = val;\n    n->next = NULL;\n    return n;\n}"
    },
    "pro_tip": "Ask candidate: 'Why can't a struct contain an instance of itself?' The answer is compiler sizing: the compiler must know exact byte sizes at compile-time.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Amazon"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 40
  },
  {
    "id": "int-c-041",
    "topic_id": "topic-c",
    "title": "Explain the 'Double Free' vulnerability and how Heap Corruption occurs.",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "A Double Free vulnerability occurs when `free()` is called more than once on the exact same dynamic heap memory address without an intervening `malloc()`.\n\nHeap Corruption Mechanics:\n1. Modern heap allocators (like `ptmalloc` in glibc) maintain internal metadata structures (free lists, bin chunks, boundary tags) to track which memory blocks are available for reuse.\n2. When `free(p)` is called, the allocator inserts the chunk into its free list.\n3. If `free(p)` is called a second time on the same pointer:\n   \u2022 The allocator inserts the same memory chunk into the free list TWICE.\n   \u2022 This creates a circular linked list or corrupts the chunk forward/backward pointers.\n   \u2022 Subsequent calls to `malloc()` will return overlapping memory chunks to different parts of the application.\n4. Attackers exploit this to overwrite function pointers or return addresses, achieving arbitrary code execution.\n\nDefense:\nAlways set the pointer to `NULL` immediately after freeing: `free(p); p = NULL;`. Calling `free(NULL)` is explicitly defined by the C standard as a safe no-op!",
    "bullet_points": [
      "Calling free() twice on same pointer corrupts heap manager free lists.",
      "Creates overlapping memory allocations on subsequent malloc calls.",
      "Major cybersecurity vulnerability exploited for arbitrary code execution.",
      "Prevention: always set p = NULL after free; free(NULL) is safely ignored."
    ],
    "code_snippet": {
      "language": "c",
      "code": "char *ptr = (char*)malloc(32);\nfree(ptr);\n// free(ptr); // CRASH / VULNERABILITY: double free detected in tcache2!\n\n// Safe Pattern:\nfree(ptr);\nptr = NULL;\nfree(ptr); // 100% Safe: free(NULL) is a harmless no-op"
    },
    "pro_tip": "C standard explicitly mandates: `free(NULL)` does nothing and is completely safe. Setting pointers to NULL after freeing completely neutralizes double free bugs!",
    "company_tags": [
      "Google",
      "Qualcomm",
      "Apple",
      "Microsoft"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 41
  },
  {
    "id": "int-c-042",
    "topic_id": "topic-c",
    "title": "What is Stack Smashing and Buffer Overflow? How does a Canary protect against it?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "A Buffer Overflow occurs when a program writes more data into an array or buffer allocated on the Stack than the buffer was sized to hold (e.g., using unsafe functions like `gets()`, `strcpy()`, `sprintf()`).\n\nStack Smashing Attack:\nBecause the Call Stack stores the function's local buffer right next to the saved Frame Pointer (`EBP/RBP`) and the function's Return Address (`EIP/RIP`):\n1. Overflowing the buffer overwrites the adjacent saved Return Address.\n2. When the function finishes and executes `ret`, the CPU jumps to the attacker's injected code address instead of returning to the caller.\n\nStack Canary Defense (Stack Protector):\n\u2022 The compiler (GCC `-fstack-protector`) inserts a random integer known as a 'Canary' immediately between local stack variables and the return address.\n\u2022 Just before the function returns, the compiler generates instructions to check if the canary value has changed.\n\u2022 If a buffer overflow overwrote the return address, the canary was also overwritten.\n\u2022 The program detects the modified canary, halts immediately, and prints: `*** stack smashing detected ***: terminated`, preventing arbitrary code execution.",
    "bullet_points": [
      "Buffer overflow writes beyond stack boundaries into saved return address.",
      "Enables attackers to hijack CPU control flow upon function return.",
      "Stack Canary: random guard value placed between local buffer and return address.",
      "Compiler verifies canary integrity before returning; halts if corrupted."
    ],
    "code_snippet": {
      "language": "c",
      "code": "void vulnerable() {\n    char buffer[16];\n    gets(buffer); // DANGEROUS: no bounds checking, causes stack smashing!\n    // fgets(buffer, sizeof(buffer), stdin); // SAFE: bounded input\n}"
    },
    "pro_tip": "Never use `gets()` in C! It was officially removed from the C11 standard because it is fundamentally impossible to prevent buffer overflows with it.",
    "company_tags": [
      "Google",
      "Apple",
      "Cisco",
      "Qualcomm"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 42
  },
  {
    "id": "int-cpp-001",
    "topic_id": "topic-cpp",
    "title": "What is C++ and how does it extend the C programming language?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "C++ is a multi-paradigm, statically-typed, and compiled programming language designed by Bjarne Stroustrup at Bell Labs in 1979 as an extension of C (originally named 'C with Classes').\n\nHow C++ Extends C:\n1. Object-Oriented Programming (OOP): Adds classes, inheritance, polymorphism, encapsulation, and data abstraction.\n2. Stronger Type Checking: Enforces stricter type safety and explicit type conversions.\n3. Generic Programming: Introduces Templates for writing type-agnostic algorithms and data structures.\n4. Standard Template Library (STL): Provides powerful pre-built containers (vector, map, set) and algorithms (sort, search).\n5. Memory Management: Introduces `new` and `delete` operators for type-safe memory management that automatically invoke constructors and destructors.\n6. References and Exception Handling: Adds true reference types (`&`) and structured `try-catch` exception handling.",
    "bullet_points": [
      "Created by Bjarne Stroustrup (1979) as 'C with Classes'.",
      "Multi-paradigm: procedural, object-oriented, and generic programming.",
      "Introduces classes, templates (STL), exception handling, and reference types.",
      "Maintains near 100% backward compatibility with C."
    ],
    "code_snippet": null,
    "pro_tip": "State that C++ is a multi-paradigm language, not purely OOP, because you can write procedural, functional, or generic code without defining a single class.",
    "company_tags": [
      "Microsoft",
      "Adobe",
      "Qualcomm",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 1
  },
  {
    "id": "int-cpp-002",
    "topic_id": "topic-cpp",
    "title": "What is the difference between a 'class' and a 'struct' in C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "In C++, classes and structs are virtually identical in runtime performance, memory layout, and capabilities\u2014both can have member functions, constructors, destructors, inheritance, and polymorphism.\n\nThe ONLY Two Differences:\n1. Default Member Access Specifier:\n   \u2022 In a `struct`, all members and methods are `public` by default.\n   \u2022 In a `class`, all members and methods are `private` by default.\n\n2. Default Inheritance Access Specifier:\n   \u2022 When deriving from a `struct`, inheritance is `public` by default (`struct D : B {};`).\n   \u2022 When deriving from a `class`, inheritance is `private` by default (`class D : B {};`).\n\nConvention: In industry practice, `struct` is used for Plain Old Data (POD) structures (passive data carriers), whereas `class` is used when encapsulating private state with active behaviors.",
    "bullet_points": [
      "struct members and inheritance default to public.",
      "class members and inheritance default to private.",
      "Identical runtime performance and zero memory overhead difference.",
      "Industry convention: struct for passive data bundles; class for encapsulated objects."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "struct S {\n    int x; // public by default\n};\n\nclass C {\n    int x; // private by default\n};"
    },
    "pro_tip": "Interviewers love asking: 'What is the performance difference between class and struct?' The answer is: Zero! Compilers generate identical machine code.",
    "company_tags": [
      "Microsoft",
      "Amazon",
      "Nvidia",
      "Adobe"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 2
  },
  {
    "id": "int-cpp-003",
    "topic_id": "topic-cpp",
    "title": "Explain the three Access Specifiers in C++: public, private, and protected.",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Access specifiers enforce encapsulation by restricting visibility and access to class members:\n\n1. public:\n\u2022 Accessible from anywhere in the program where the object is visible.\n\u2022 Typically used for public member functions (getters, setters, API methods).\n\n2. private:\n\u2022 Accessible ONLY by member functions and friend functions/classes of the same class.\n\u2022 Inaccessible to derived child classes and outside functions.\n\u2022 Used to safeguard internal member variables.\n\n3. protected:\n\u2022 Accessible within the class itself and by member functions of DERIVED (sub)classes.\n\u2022 Inaccessible to outside functions and unrelated classes.\n\u2022 Used to share base class implementation details with child classes while hiding them from the public.",
    "bullet_points": [
      "public: accessible by anyone, anywhere.",
      "private: accessible only within the declaring class.",
      "protected: accessible within the declaring class and its derived subclasses."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class Base {\npublic:\n    int pubVar;       // Accessible everywhere\nprotected:\n    int protVar;      // Accessible in Base and Derived\nprivate:\n    int privVar;      // Accessible ONLY in Base\n};"
    },
    "pro_tip": "Remember: In private inheritance, public and protected base members become private in the child; in protected inheritance, public members become protected.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Cognizant"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 3
  },
  {
    "id": "int-cpp-004",
    "topic_id": "topic-cpp",
    "title": "What is a Reference (&) in C++ and how does it differ from a Pointer (*)?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "A reference is an alias (an alternative name) for an already existing variable in memory.\n\nKey Differences:\n1. Nullability: A reference CANNOT be null; it must always bind to a valid object. A pointer can be `nullptr`.\n2. Initialization: A reference MUST be initialized at the moment of declaration (`int &ref = x;`). A pointer can be uninitialized or declared without assigning.\n3. Reassignment: Once a reference is bound to an object, it CANNOT be rebound to another object for its lifetime. Assigning to it changes the value of the referent. A pointer can freely point to other memory addresses.\n4. Syntax: References use clean dot syntax directly (`ref.method()`); pointers require dereferencing (`ptr->method()` or `(*ptr).method()`).\n5. Memory Address: Taking the address of a reference (`&ref`) yields the address of the referent. A pointer has its own distinct address on the stack.",
    "bullet_points": [
      "Reference is an immutable alias that cannot be NULL.",
      "Must be initialized upon declaration and cannot be rebound.",
      "Clean direct syntax without dereferencing overhead.",
      "Pointers can be NULL, uninitialized, and rebound to other addresses."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "int a = 10, b = 20;\nint &ref = a; // ref is an alias for 'a'\nref = b;      // Assigns value 20 to 'a'! Does NOT rebind ref to b!"
    },
    "pro_tip": "Trap: `ref = b;` does NOT rebind the reference to `b`. It assigns the value of `b` into `a`! A reference cannot be rebound after initialization.",
    "company_tags": [
      "Microsoft",
      "Amazon",
      "Qualcomm",
      "Nvidia"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 4
  },
  {
    "id": "int-cpp-005",
    "topic_id": "topic-cpp",
    "title": "What is the difference between 'new/delete' and 'malloc/free' in C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "`new`/`delete` are C++ operators, while `malloc()`/`free()` are C library functions:\n\n1. Constructors & Destructors: `new` allocates heap memory AND automatically calls the class constructor to initialize the object. `delete` calls the destructor before freeing memory. `malloc()` and `free()` allocate and release raw bytes with ZERO awareness of constructors/destructors.\n2. Type Safety: `new` is type-safe and returns a typed pointer (`int* p = new int;`). `malloc` returns `void*` requiring explicit casting.\n3. Size Calculation: `new` calculates size automatically based on type (`new Student`). `malloc` requires manual byte sizing (`malloc(sizeof(Student))`).\n4. Error Handling: `new` throws a `std::bad_alloc` exception on failure (or returns `nullptr` with `std::nothrow`). `malloc` returns `NULL`.\n5. Array Operators: C++ provides dedicated `new[]` and `delete[]` for dynamically allocating and destroying arrays of objects.",
    "bullet_points": [
      "new/delete invoke constructors and destructors; malloc/free do not.",
      "new is type-safe; malloc returns untyped void*.",
      "new throws std::bad_alloc on failure; malloc returns NULL.",
      "Never mix them: delete an object allocated with new; free an object allocated with malloc."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class Test {\npublic:\n    Test()  { std::cout << \"Constructed\\n\"; }\n    ~Test() { std::cout << \"Destroyed\\n\"; }\n};\n\nTest *t = new Test(); // Prints: Constructed\ndelete t;             // Prints: Destroyed"
    },
    "pro_tip": "Critical rule: Never use `delete` on an array allocated with `new[]`. Always use `delete[] arr;` so the compiler invokes destructors for every single array element!",
    "company_tags": [
      "Microsoft",
      "Amazon",
      "Adobe",
      "Qualcomm"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 5
  },
  {
    "id": "int-cpp-006",
    "topic_id": "topic-cpp",
    "title": "What is Function Overloading and Operator Overloading in C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Both are forms of Compile-Time (Static) Polymorphism:\n\n1. Function Overloading:\n\u2022 Defining two or more functions with the SAME name within the same scope, but with DIFFERENT parameter signatures (different number, types, or order of parameters).\n\u2022 Resolved at compile time based on argument matching.\n\u2022 Return type alone CANNOT be used to differentiate overloaded functions.\n\n2. Operator Overloading:\n\u2022 Giving custom behavior to existing C++ operators (`+`, `-`, `*`, `<<`, `==`, `[]`) when applied to user-defined classes.\n\u2022 Implemented using `operator<symbol>()` member or friend functions.\n\u2022 Cannot create new operators (e.g., cannot create `**`), and cannot alter operator precedence, associativity, or arity.\n\u2022 Non-overloadable operators: `.` (dot), `.*` (pointer to member), `::` (scope resolution), `?:` (ternary), and `sizeof`.",
    "bullet_points": [
      "Function Overloading: same function name, different parameter lists, compile-time dispatch.",
      "Operator Overloading: custom semantics for C++ operators with user-defined types.",
      "Cannot overload: ., .*, ::, ?:, and sizeof.",
      "Cannot create brand new operator symbols or change precedence rules."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class Complex {\n    double real, imag;\npublic:\n    Complex(double r, double i) : real(r), imag(i) {}\n    Complex operator+(const Complex &other) const {\n        return Complex(real + other.real, imag + other.imag);\n    }\n};"
    },
    "pro_tip": "Always recite the 5 non-overloadable operators: `.`, `.*`, `::`, `?:`, `sizeof`. Interviewers frequently test this exact trivia.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Adobe",
      "Intel"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 6
  },
  {
    "id": "int-cpp-007",
    "topic_id": "topic-cpp",
    "title": "What is a Constructor in C++? What are Default, Parameterized, and Copy Constructors?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "A constructor is a special member function that has the exact same name as the class and no return type. It is automatically invoked by the compiler whenever an object of that class is instantiated.\n\nTypes of Constructors:\n1. Default Constructor: Takes no arguments (or all arguments have default values). If no constructor is written, the compiler synthesizes a default constructor.\n2. Parameterized Constructor: Accepts arguments to initialize member variables with specific custom values.\n3. Copy Constructor: Initializes a new object by copying data from an existing object of the same class. Signature: `ClassName(const ClassName &other);` (must pass by reference to avoid infinite recursion).\n\nIf any parameterized constructor is explicitly defined, the compiler will NO LONGER generate an implicit default constructor.",
    "bullet_points": [
      "Same name as class, no return type, called automatically on instantiation.",
      "Default: takes 0 arguments; Parameterized: takes custom initialization values.",
      "Copy: ClassName(const ClassName &other); initializes object from another instance.",
      "Defining a custom constructor suppresses compiler default constructor generation."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class Box {\n    int length;\npublic:\n    Box() : length(0) {}                     // Default\n    Box(int l) : length(l) {}                // Parameterized\n    Box(const Box &b) : length(b.length) {}  // Copy Constructor\n};"
    },
    "pro_tip": "Why must the copy constructor parameter be passed by reference? If passed by value (`Box(Box b)`), passing `b` would require calling the copy constructor, causing infinite compile-time recursion!",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "TCS"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 7
  },
  {
    "id": "int-cpp-008",
    "topic_id": "topic-cpp",
    "title": "What is a Destructor in C++ and what are its key rules?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "A destructor is a special member function that has the same name as the class preceded by a tilde (`~`) and no return type or parameters.\n\nIt is invoked automatically by the runtime when an object goes out of scope (for stack objects) or when `delete` is called (for heap objects).\n\nKey Rules:\n1. Cannot be overloaded: A class can have at most ONE destructor (takes no arguments).\n2. Cannot be static or const.\n3. Destruction Order: Destructors are called in reverse order of construction (LIFO order: last constructed, first destroyed).\n4. Purpose: Releases external resources owned by the object (closing file handles, freeing dynamically allocated heap memory, releasing mutex locks).",
    "bullet_points": [
      "Syntax: ~ClassName(); called automatically upon object destruction.",
      "A class can have only ONE destructor (no overloading, no parameters).",
      "Destructors execute in reverse order of construction (LIFO).",
      "Essential for RAII resource cleanup (memory, files, sockets)."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class Resource {\n    int *data;\npublic:\n    Resource() { data = new int[100]; }\n    ~Resource() {\n        delete[] data; // Releases allocated heap memory automatically\n    }\n};"
    },
    "pro_tip": "If a class manages dynamic memory or raw resource pointers, you almost always need a custom destructor to prevent memory leaks.",
    "company_tags": [
      "Microsoft",
      "Adobe",
      "Qualcomm"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 8
  },
  {
    "id": "int-cpp-009",
    "topic_id": "topic-cpp",
    "title": "What is 'this' pointer in C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "The `this` pointer is an implicit, hidden pointer passed as the first argument to every non-static member function of a class. It points to the specific object instance on which the member function was invoked.\n\nKey Characteristics:\n\u2022 Type: For class `X`, `this` has type `X * const` (a constant pointer pointing to the current object). Inside `const` member functions, it has type `const X * const`.\n\u2022 Value: Holds the memory address of the invoking object (`&object`).\n\nCommon Uses:\n1. Disambiguating parameters from member variables with identical names (`this->age = age;`).\n2. Returning reference to the current object for Method Chaining / Fluent API (`return *this;`).\n3. Passing the current object to external functions or event callbacks.",
    "bullet_points": [
      "Implicit pointer available inside all non-static member functions.",
      "Points to the memory address of the object invoking the method.",
      "Differentiates member variables from parameters with same name.",
      "Enables method chaining by returning *this."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class Counter {\n    int count = 0;\npublic:\n    Counter& increment() {\n        count++;\n        return *this; // Return reference to self for chaining\n    }\n};\n\nCounter c;\nc.increment().increment().increment(); // Method chaining"
    },
    "pro_tip": "Static member functions do NOT have a `this` pointer because static methods belong to the class, not to any individual object instance.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 9
  },
  {
    "id": "int-cpp-010",
    "topic_id": "topic-cpp",
    "title": "What is a Namespace in C++ and why is 'using namespace std;' discouraged in headers?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "A namespace is a declarative region that provides a scope to identifiers (names of types, functions, variables) inside it. It is used to organize code into logical sub-systems and prevent Name Collisions in large projects combining multiple third-party libraries.\n\nWhy `using namespace std;` is strongly discouraged in header files:\n\u2022 Namespace Pollution: It imports all hundreds of standard identifiers into the global namespace of any source file that includes that header.\n\u2022 Name Collisions: If a library or your own code defines a function with a common name (like `count`, `min`, `max`, `distance`), it creates ambiguous call compiler errors with `std::count` or `std::min`.\n\u2022 Best Practice: Use explicit qualification (`std::vector<int>`, `std::cout`) in headers, or import only specific names in `.cpp` files (`using std::cout;`).",
    "bullet_points": [
      "Namespaces prevent identifier collisions across large codebases.",
      "using namespace std in headers pollutes the global namespace of all includers.",
      "Causes ambiguous call compiler errors with standard library names.",
      "Industry standard: use explicit std:: prefixes in header files."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "namespace MathLib {\n    int add(int a, int b) { return a + b; }\n}\n\n// Explicit resolution prevents ambiguity\nint sum = MathLib::add(5, 10);"
    },
    "pro_tip": "In interviews, always demonstrate best practice: say 'I avoid using namespace std in headers to prevent namespace pollution and name collisions.'",
    "company_tags": [
      "Google",
      "Microsoft",
      "Bloomberg"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 10
  },
  {
    "id": "int-cpp-011",
    "topic_id": "topic-cpp",
    "title": "What is the difference between 'std::vector' and a raw dynamic array in C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "`std::vector` is a sequence container from the Standard Template Library (STL) that encapsulates a dynamic array:\n\n1. Automatic Resizing: Raw arrays have a fixed capacity once allocated. A `vector` automatically reallocates and doubles its internal buffer when full (`push_back()`).\n2. Memory Management (RAII): Raw arrays require manual `new[]` and `delete[]` calls. A `vector` manages its own heap memory; when it goes out of scope, its destructor automatically frees all heap memory.\n3. Size & Capacity: A `vector` tracks both its element count (`size()`) and internal buffer capacity (`capacity()`). Raw arrays cannot know their size once passed to functions.\n4. Bounds Checking: `vector::at(i)` performs safe runtime bounds checking, throwing `std::out_of_range`. `operator[]` provides raw array speed without bounds checking.\n5. Copying: Assigning a vector (`v2 = v1;`) performs a safe deep copy; assigning raw pointers only copies the memory address (shallow copy).",
    "bullet_points": [
      "vector automatically resizes when capacity is exceeded.",
      "Automatic memory deallocation via RAII (zero memory leaks).",
      "Tracks size() and capacity() dynamically.",
      "Supports safe bounds checking via .at() method."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "#include <vector>\n\nstd::vector<int> v = {10, 20, 30};\nv.push_back(40); // Automatically resizes internal buffer\n// Automatically deallocates heap buffer upon exiting scope"
    },
    "pro_tip": "Mention `vector::reserve(n)`: Pre-allocating capacity avoids frequent internal reallocations and buffer copies when inserting thousands of elements.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Adobe"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 11
  },
  {
    "id": "int-cpp-012",
    "topic_id": "topic-cpp",
    "title": "What is the 'const' keyword in C++ when applied to member functions?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "When a member function is declared with `const` after its parameter list (`void print() const;`):\n\n1. Read-Only Guarantee: The function promises not to modify any non-static member variables of the calling object.\n2. Inspection of 'this': Inside the const function, the `this` pointer has type `const ClassName * const`. Attempting to modify member variables (`x = 5;`) triggers a compile-time error.\n3. Const Object Invocability: ONLY const member functions can be called on `const` object instances (`const Student s; s.print();`). Non-const member functions cannot be invoked on const objects.\n4. Exception: Members marked with the `mutable` specifier CAN be modified even inside a const member function (useful for caching or mutex locks).",
    "bullet_points": [
      "Guarantees that the function will not modify object state.",
      "Allows the method to be invoked on const object instances.",
      "Inside const methods, 'this' is a pointer to const object.",
      "mutable members can still be modified inside const functions."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class Account {\n    double balance;\n    mutable int accessCount = 0; // Allowed to change\npublic:\n    double getBalance() const {\n        accessCount++; // Allowed because it is mutable\n        // balance += 10; // COMPILE ERROR: cannot mutate in const function\n        return balance;\n    }\n};"
    },
    "pro_tip": "Always mention `const correctness`: Making read-only methods const allows compiler optimization and enables calling them on const references (`const MyClass &obj`).",
    "company_tags": [
      "Google",
      "Microsoft",
      "Bloomberg"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 12
  },
  {
    "id": "int-cpp-013",
    "topic_id": "topic-cpp",
    "title": "What is the difference between 'std::endl' and '\\n' in C++ output streams?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "While both `std::endl` and `'\\n'` insert a newline character into the output stream, they have a critical performance difference:\n\n\u2022 `\\n`: Inserts a newline character into the output buffer without flushing the buffer to the OS screen/file.\n\n\u2022 `std::endl`: Inserts a newline character AND explicitly forces a stream buffer flush (`std::cout.flush()`).\n\nPerformance Impact: Flushing the output buffer is an expensive operating system system call. In tight loops or competitive programming, using `std::endl` forces the CPU to flush the buffer on every single iteration, making I/O orders of magnitude slower. Always prefer `\\n` unless immediate synchronization is strictly required.",
    "bullet_points": [
      "\\n inserts newline into the stream buffer (fast).",
      "std::endl inserts newline AND flushes the stream buffer (slow system call).",
      "Using std::endl inside loops causes massive I/O performance bottlenecks.",
      "Use \\n and let the buffer flush automatically when full or at program exit."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "// Fast: buffer flushes automatically\nfor (int i = 0; i < 100000; i++) std::cout << i << '\\n';\n\n// Extremely Slow: 100,000 explicit OS flushes!\nfor (int i = 0; i < 100000; i++) std::cout << i << std::endl;"
    },
    "pro_tip": "In competitive programming or high-performance systems, pair `\\n` with `std::ios_base::sync_with_stdio(false); std::cin.tie(NULL);` for maximum I/O throughput.",
    "company_tags": [
      "Google",
      "Amazon",
      "Goldman Sachs"
    ],
    "frequency": "MEDIUM",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 13
  },
  {
    "id": "int-cpp-014",
    "topic_id": "topic-cpp",
    "title": "Explain Virtual Functions, Runtime Polymorphism, and Dynamic Binding in C++.",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "A `virtual` function is a member function in a base class declared with the `virtual` keyword, designed to be overridden by derived classes.\n\nRuntime Polymorphism (Dynamic Binding):\nWhen a derived class object is referenced through a base class pointer or reference (`Base *b = new Derived();`), calling a non-virtual function invokes the Base class version (early/compile-time binding).\nHowever, if the function is declared `virtual`, C++ performs Dynamic Binding at runtime: it looks up the actual runtime object type and invokes the Derived class overridden implementation.\n\nSignificance: Allows writing generic, extensible code where callers interact with an abstract Base interface, while runtime derived implementations execute automatically without knowing derived types at compile time.",
    "bullet_points": [
      "virtual keyword enables runtime polymorphism via dynamic binding.",
      "Allows base class pointers/references to invoke derived class overrides.",
      "Non-virtual methods resolve at compile-time based on pointer type.",
      "Implemented under the hood via vtable and vptr."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class Shape {\npublic:\n    virtual void draw() { std::cout << \"Shape\\n\"; }\n};\nclass Circle : public Shape {\npublic:\n    void draw() override { std::cout << \"Circle\\n\"; }\n};\n\nShape *s = new Circle();\ns->draw(); // Prints: Circle (Dynamic dispatch!)"
    },
    "pro_tip": "Always use the `override` specifier (C++11) in derived classes. If the signature doesn't match the base class virtual method, the compiler will catch it as a compile error.",
    "company_tags": [
      "Microsoft",
      "Adobe",
      "Amazon",
      "Google"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 14
  },
  {
    "id": "int-cpp-015",
    "topic_id": "topic-cpp",
    "title": "How do 'vtable' and 'vptr' work under the hood in C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "The C++ runtime implements dynamic dispatch for virtual functions using two internal data structures:\n\n1. vtable (Virtual Method Table):\n\u2022 A static array of function pointers generated by the compiler for every class containing at least one virtual function.\n\u2022 There is only ONE vtable per CLASS stored in read-only memory.\n\u2022 Each slot in the vtable holds the starting address of the most derived virtual function implementation.\n\n2. vptr (Virtual Table Pointer):\n\u2022 A hidden pointer inserted by the compiler into every OBJECT instance of a class with virtual functions.\n\u2022 Initialized by the constructor to point to the class's vtable.\n\u2022 Adds 4 or 8 bytes of memory overhead to every object instance.\n\nExecution Flow (`b->draw()`):\n1. The CPU reads the object's hidden `vptr`.\n2. Follows `vptr` to locate the class's `vtable` in memory.\n3. Indexes into the vtable at the known offset for `draw()`.\n4. Invokes the function pointer found at that slot. (Involves two pointer indirections at runtime).",
    "bullet_points": [
      "vtable is a static array of function pointers created per class.",
      "vptr is a hidden pointer embedded in every object instance pointing to its vtable.",
      "Virtual method calls require 2 pointer dereferences: object -> vptr -> vtable -> function.",
      "Adds 8 bytes (on 64-bit) to sizeof(object) for classes with virtual functions."
    ],
    "code_snippet": {
      "language": "text",
      "code": "Derived Object (Heap/Stack)        vtable for Derived (Read-Only RAM)\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510         \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 vptr \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500>\u2502 slot 0: &Derived::draw()      \u2502\n\u2502 int member_data        \u2502         \u2502 slot 1: &Base::info()         \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518         \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518"
    },
    "pro_tip": "State the performance trade-off: Virtual functions prevent compiler inlining and add two pointer dereferences, introducing a tiny runtime overhead compared to static calls.",
    "company_tags": [
      "Google",
      "Microsoft",
      "Nvidia",
      "Bloomberg"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 15
  },
  {
    "id": "int-cpp-016",
    "topic_id": "topic-cpp",
    "title": "What is a Pure Virtual Function and an Abstract Class in C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "\u2022 Pure Virtual Function:\nA virtual function declared in a base class that has NO implementation in that base class, declared using `= 0;` syntax:\n`virtual void draw() = 0;`\nIt serves as a contract requiring all concrete derived classes to provide their own implementation.\n\n\u2022 Abstract Class:\nAny class that contains at least ONE pure virtual function.\n\nKey Rules:\n1. Cannot be instantiated: You CANNOT create direct objects of an abstract class (`Shape s;` triggers a compile error).\n2. Pointers & References Allowed: You CAN declare pointers and references to an abstract class (`Shape *s = new Circle();`).\n3. Inheritance Requirement: If a derived class fails to override all pure virtual functions, it remains abstract and cannot be instantiated.\n4. Pure virtual destructors are legal, but must provide a function body outside the class definition.",
    "bullet_points": [
      "Pure virtual syntax: virtual returnType func() = 0;",
      "Class with >=1 pure virtual function becomes an Abstract Class.",
      "Abstract classes cannot be directly instantiated.",
      "Derived classes must override pure virtual functions to become concrete."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class Printable { // Abstract Class\npublic:\n    virtual void print() = 0; // Pure virtual function\n    virtual ~Printable() = default;\n};\n\nclass Document : public Printable {\npublic:\n    void print() override { std::cout << \"Printing Doc\\n\"; }\n};"
    },
    "pro_tip": "In C++, pure virtual functions are how you define pure Interfaces (analogous to `interface` in Java or C#).",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "TCS"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 16
  },
  {
    "id": "int-cpp-017",
    "topic_id": "topic-cpp",
    "title": "What is the Diamond Problem in C++ and how does Virtual Inheritance resolve it?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "The Diamond Problem occurs in multiple inheritance when a class derives from two classes that both inherit from a single common base class (forming a diamond shape: A -> B, C -> D).\n\nProblem:\nClass D inherits TWO separate copies of class A (one through B, one through C). This causes:\n1. Ambiguity: Calling a method `d.display()` from class A causes a compile-time error: 'request for member display is ambiguous'.\n2. Wasted Memory: Duplicate copies of A's member variables exist inside D.\n\nSolution: Virtual Inheritance (`class B : virtual public A` and `class C : virtual public A`):\n\u2022 Instructs the compiler to share a single common instance of base class A across the inheritance hierarchy.\n\u2022 Class D now contains only ONE shared subobject of class A.\n\u2022 Resolution is maintained using a Virtual Base Table (`vbtable`) and Virtual Base Pointer (`vbptr`).",
    "bullet_points": [
      "Occurs when class D extends B and C, which both extend A.",
      "Causes ambiguity and duplicate copies of A's members inside D.",
      "Resolved using virtual inheritance: class B : virtual public A.",
      "Guarantees only one single shared instance of A exists inside D."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class A { public: int val; };\nclass B : virtual public A {}; // Virtual inheritance\nclass C : virtual public A {}; // Virtual inheritance\nclass D : public B, public C {}; // D has only ONE shared 'val' instance\n\nint main() {\n    D d;\n    d.val = 10; // Unambiguous and 100% legal!\n}"
    },
    "pro_tip": "In virtual inheritance, the most derived class (D) is responsible for invoking the constructor of the virtual base class (A), skipping B and C's calls to A's constructor.",
    "company_tags": [
      "Microsoft",
      "Adobe",
      "Qualcomm",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 17
  },
  {
    "id": "int-cpp-018",
    "topic_id": "topic-cpp",
    "title": "Explain the 'Rule of Three' in C++ and why it is critical for classes managing resources.",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "The Rule of Three states that if a class requires a custom definition for any ONE of the following three special member functions, it almost certainly requires all THREE:\n\n1. Destructor (`~MyClass()`): To free allocated resources (heap memory, file handles).\n2. Copy Constructor (`MyClass(const MyClass&)`): To perform a deep copy of the resource when instantiating from an existing object.\n3. Copy Assignment Operator (`MyClass& operator=(const MyClass&)`): To safely release existing resources and perform a deep copy when assigning (`obj1 = obj2;`).\n\nWhy it is Critical:\nIf you only define a custom destructor to `delete` a heap pointer, the compiler will still generate default copy constructor and assignment operators that perform a Shallow Copy (bitwise copy). Copying an object copies the raw pointer address. When both objects go out of scope, both destructors will call `delete` on the same pointer, triggering a catastrophic Double Free crash!",
    "bullet_points": [
      "Rule of Three: Destructor, Copy Constructor, Copy Assignment Operator.",
      "If you define one, you must define all three.",
      "Default compiler copy copies raw pointers (shallow copy), causing double-free crashes.",
      "Custom copy methods perform Deep Copies to give each object its own independent memory."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class Buffer {\n    int *data;\npublic:\n    Buffer(int size) { data = new int[size]; }\n    ~Buffer() { delete[] data; } // 1. Destructor\n    Buffer(const Buffer &other) { // 2. Copy Constructor (Deep copy)\n        data = new int[100];\n        std::copy(other.data, other.data + 100, data);\n    }\n    Buffer& operator=(const Buffer &other) { // 3. Copy Assignment\n        if (this != &other) {\n            delete[] data;\n            data = new int[100];\n            std::copy(other.data, other.data + 100, data);\n        }\n        return *this;\n    }\n};"
    },
    "pro_tip": "Always implement the Self-Assignment Check (`if (this != &other)`) in copy assignment operators to prevent deleting your own data before copying!",
    "company_tags": [
      "Microsoft",
      "Google",
      "Amazon",
      "Bloomberg"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 18
  },
  {
    "id": "int-cpp-019",
    "topic_id": "topic-cpp",
    "title": "What is the 'explicit' keyword in C++ and what are conversion constructors?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "A constructor that can be called with a single argument acts as an implicit Conversion Constructor by default. The compiler can use it to perform implicit type conversions behind the scenes.\n\nProblem with Implicit Conversion:\nIf a class `Array` has `Array(int size);`, writing `Array a = 5;` or passing `5` to a function expecting `Array` causes the compiler to silently construct an `Array` of size 5. This can lead to subtle, unintended bugs and performance degradation.\n\nRole of 'explicit':\nApplying `explicit` to a constructor tells the compiler to DISABLE implicit conversions. The constructor can now only be invoked via explicit initialization syntax (`Array a(5);` or `Array a{5};`).\n\nBest Practice: Make all single-argument constructors `explicit` by default unless implicit conversion is explicitly desired (like a custom String wrapper class).",
    "bullet_points": [
      "Single-argument constructors act as implicit conversion constructors by default.",
      "explicit prevents the compiler from performing unintended implicit conversions.",
      "Forces callers to use explicit instantiation: MyClass obj(5);",
      "Standard practice in production C++ to prevent subtle conversion bugs."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class Vector {\npublic:\n    explicit Vector(int capacity) {} // explicit prevents conversion\n};\n\nvoid process(Vector v) {}\n\n// process(10); // COMPILE ERROR: cannot convert int to Vector\nprocess(Vector(10)); // SUCCESS: explicit construction"
    },
    "pro_tip": "In C++11 and beyond, `explicit` can also be applied to conversion operators (`explicit operator bool() const;`) to prevent boolean conversion traps in arithmetic expressions.",
    "company_tags": [
      "Google",
      "Microsoft",
      "Bloomberg"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 19
  },
  {
    "id": "int-cpp-020",
    "topic_id": "topic-cpp",
    "title": "What are Static Data Members and Static Member Functions in C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "\u2022 Static Data Members:\n- A class variable shared across ALL object instances of the class. Only ONE copy exists in program memory (stored in Data/BSS segment, not inside object memory).\n- Must be declared inside the class and defined/initialized outside the class in file scope.\n- Does NOT increase `sizeof(object)`.\n\n\u2022 Static Member Functions:\n- Can be called using the class name directly without instantiating an object (`MyClass::doSomething()`).\n- Has NO access to non-static member variables or non-static methods because it has NO `this` pointer.\n- Can ONLY access static data members and call other static member functions.",
    "bullet_points": [
      "Static data member has 1 copy shared by all instances, defined outside class.",
      "Static member functions can be called via ClassName::method().",
      "Static functions have no 'this' pointer and can only access static members.",
      "Static members do not contribute to sizeof(object)."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class Player {\n    static int playerCount; // Declaration\npublic:\n    Player() { playerCount++; }\n    static int getCount() { return playerCount; } // Static function\n};\n\nint Player::playerCount = 0; // Definition in global scope\n\nint total = Player::getCount(); // Invocation without object"
    },
    "pro_tip": "Common compilation error: Forgetting to define static members outside the class causes an 'undefined reference to Class::variable' linker error!",
    "company_tags": [
      "TCS",
      "Infosys",
      "Adobe"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 20
  },
  {
    "id": "int-cpp-021",
    "topic_id": "topic-cpp",
    "title": "What are Friend Functions and Friend Classes in C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "A `friend` function or class is an external function or class that is granted full access to the `private` and `protected` members of the granting class.\n\nKey Rules:\n1. Friendship is Granted, Not Taken: Class A must explicitly declare `friend class B;`. Class B cannot force itself to be a friend of A.\n2. Friendship is NOT Symmetric: If A is a friend of B, B is NOT automatically a friend of A.\n3. Friendship is NOT Transitive: If A is a friend of B, and B is a friend of C, A is NOT automatically a friend of C.\n4. Friendship is NOT Inherited: Friends of a base class do not inherit friendship access to derived class private members.\n\nCommon Use Case: Overloading stream insertion (`<<`) and extraction (`>>`) operators, where the left operand is `std::ostream` and cannot be a class member function.",
    "bullet_points": [
      "Grants external function or class access to private/protected members.",
      "Not symmetric, not transitive, and not inherited.",
      "Essential for overloading stream operators (operator<<, operator>>).",
      "Should be used sparingly to avoid breaking encapsulation."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class Point {\n    int x, y;\npublic:\n    Point(int x, int y) : x(x), y(y) {}\n    // Friend function grants access to private x, y\n    friend std::ostream& operator<<(std::ostream &os, const Point &p) {\n        return os << '(' << p.x << \", \" << p.y << ')';\n    }\n};"
    },
    "pro_tip": "The most common interview scenario for friend functions is operator overloading for stream I/O (`operator<<`), which cannot be a member function because `std::ostream` is the left operand.",
    "company_tags": [
      "Adobe",
      "Amazon",
      "Microsoft"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 21
  },
  {
    "id": "int-cpp-022",
    "topic_id": "topic-cpp",
    "title": "What are Templates in C++ and how do Function Templates differ from Class Templates?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Templates are C++'s mechanism for Generic Programming. They allow functions and classes to operate with generic, parameterized types without rewriting code for every specific data type.\n\nMechanism: Templates are expanded at COMPILE TIME (monomorphization). When you invoke `add<int>(1, 2)` and `add<double>(1.5, 2.5)`, the compiler generates TWO separate concrete, highly optimized functions in machine code.\n\n\u2022 Function Templates: Defines a generic algorithm that works with any type supporting the required operators (e.g., `std::sort`, `std::max`).\n\n\u2022 Class Templates: Defines a generic data structure that can store elements of any data type (e.g., `std::vector<T>`, `std::map<K, V>`).\n\nTemplate Specialization: Allows providing a specialized custom implementation for a specific data type (e.g., `std::vector<bool>` uses bit-level compression).",
    "bullet_points": [
      "Enables generic programming by parameterizing types (template <typename T>).",
      "Compiler generates concrete code at compile-time for each used type.",
      "Zero runtime abstraction overhead (near raw-code performance).",
      "Template implementations must typically reside in header files for compiler visibility."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "template <typename T>\nT add(T a, T b) {\n    return a + b;\n}\n\nint x = add(5, 10);       // Compiler generates int version\ndouble y = add(2.5, 4.5); // Compiler generates double version"
    },
    "pro_tip": "Why must template implementations be placed in header files? Because the compiler needs to see the full implementation to instantiate code when it encounters a call in a translation unit.",
    "company_tags": [
      "Google",
      "Microsoft",
      "Bloomberg"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 22
  },
  {
    "id": "int-cpp-023",
    "topic_id": "topic-cpp",
    "title": "Explain the differences between std::vector, std::list, and std::deque in STL.",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "These are the three standard sequential containers in the C++ Standard Template Library (STL):\n\n1. `std::vector` (Dynamic Array):\n\u2022 Memory: Contiguous memory buffer.\n\u2022 Random Access: O(1) instantaneous indexing via `[]`.\n\u2022 Insertion: Fast O(1) amortized at the end (`push_back`); expensive O(N) in the middle/front due to element shifting.\n\u2022 Cache Locality: Superior CPU cache locality due to contiguous layout (recommended default container).\n\n2. `std::list` (Doubly Linked List):\n\u2022 Memory: Non-contiguous individual heap nodes linked by forward and backward pointers.\n\u2022 Random Access: None; O(N) sequential traversal required.\n\u2022 Insertion/Deletion: O(1) constant time anywhere once an iterator position is held.\n\u2022 Overhead: High memory overhead (2 pointers per element) and poor CPU cache locality.\n\n3. `std::deque` (Double-Ended Queue):\n\u2022 Memory: Array of fixed-size contiguous chunks (chunked memory).\n\u2022 Random Access: O(1) indexing.\n\u2022 Insertion: Fast O(1) at BOTH front and back without reallocating the entire buffer.",
    "bullet_points": [
      "vector: contiguous array, O(1) random access, best cache performance.",
      "list: doubly linked list, O(1) insert/erase with iterator, poor cache locality.",
      "deque: chunked memory, O(1) push/pop at both front and back.",
      "Default choice in 95% of use cases: std::vector."
    ],
    "code_snippet": null,
    "pro_tip": "Bjarne Stroustrup famously demonstrated that `std::vector` often outperforms `std::list` even for middle insertions due to modern CPU cache line prefetching!",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Google",
      "Bloomberg"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 23
  },
  {
    "id": "int-cpp-024",
    "topic_id": "topic-cpp",
    "title": "What is the difference between 'std::map' and 'std::unordered_map' in C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Both are associative key-value containers, but rely on completely different underlying data structures:\n\n\u2022 `std::map` (Ordered Map):\n- Underlying Data Structure: Self-balancing Binary Search Tree (Red-Black Tree).\n- Ordering: Keys are always maintained in strictly sorted order (requires `<` operator).\n- Time Complexity: Search, Insert, and Delete are guaranteed O(log N) worst-case.\n- Memory: Higher tree node pointer overhead (3 pointers per node: left, right, parent).\n\n\u2022 `std::unordered_map` (Hash Map):\n- Underlying Data Structure: Hash Table with bucket chaining.\n- Ordering: Elements have NO guaranteed order (keys can appear in arbitrary sequence).\n- Time Complexity: Search, Insert, and Delete are O(1) average time; O(N) worst-case under hash collisions.\n- Requirements: Requires a hash function (`std::hash<Key>`) and equality operator (`==`).",
    "bullet_points": [
      "std::map: Red-Black Tree, keys sorted, O(log N) guaranteed lookup.",
      "std::unordered_map: Hash Table, no order, O(1) average lookup.",
      "Use map when you need sorted order or range queries (lower_bound/upper_bound).",
      "Use unordered_map when maximum lookup speed is needed."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "#include <map>\n#include <unordered_map>\n\nstd::map<int, std::string> ordered;          // Keys sorted: 1, 2, 5, 10\nstd::unordered_map<int, std::string> hashed; // O(1) hash table lookup"
    },
    "pro_tip": "Never assume `unordered_map` is always faster: If hash collisions occur or lots of small lookups are performed, `std::map` avoids hash computation and can be faster.",
    "company_tags": [
      "Amazon",
      "Google",
      "Microsoft",
      "Uber"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 24
  },
  {
    "id": "int-cpp-025",
    "topic_id": "topic-cpp",
    "title": "Explain the four C++ Casts: static_cast, dynamic_cast, const_cast, and reinterpret_cast.",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "C++ replaces unsafe C-style casting `(Type)var` with four explicit, type-safe casting operators:\n\n1. static_cast:\n\u2022 Compile-time cast for well-defined conversions (e.g., float to int, implicit conversions, safe upcasting in class hierarchies).\n\u2022 Fast with zero runtime overhead.\n\n2. dynamic_cast:\n\u2022 Run-time cast used specifically for safe DOWNCASTING in polymorphic class hierarchies (requires at least one virtual function).\n\u2022 Uses RTTI (Run-Time Type Information) to verify whether the object actually belongs to the target derived class.\n\u2022 If invalid: returns `nullptr` for pointers, or throws `std::bad_cast` for references.\n\n3. const_cast:\n\u2022 Used to add or strip away `const` or `volatile` qualifiers from a variable.\n\u2022 Undefined behavior if you cast away const to modify a variable originally declared const.\n\n4. reinterpret_cast:\n\u2022 Low-level bit reinterpretation (e.g., converting integer to pointer or pointer to unrelated pointer type).\n\u2022 Platform-dependent and inherently unsafe; used in device drivers and serialization.",
    "bullet_points": [
      "static_cast: compile-time safe conversions and upcasting.",
      "dynamic_cast: runtime-checked safe downcasting using RTTI (returns nullptr on failure).",
      "const_cast: adds or removes const/volatile qualifiers.",
      "reinterpret_cast: raw low-level bit reinterpretation across unrelated types."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "Base *b = new Derived();\nDerived *d = dynamic_cast<Derived*>(b); // Safe downcast: succeeds\n\nconst int val = 100;\nint *modifiable = const_cast<int*>(&val); // Casts away const"
    },
    "pro_tip": "Always prefer `dynamic_cast` over `static_cast` when downcasting polymorphic pointers so you can check for `nullptr` to prevent invalid memory accesses.",
    "company_tags": [
      "Microsoft",
      "Google",
      "Amazon",
      "Bloomberg"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 25
  },
  {
    "id": "int-cpp-026",
    "topic_id": "topic-cpp",
    "title": "What are Lambda Expressions in C++11 and how does the capture clause '[]' work?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Lambda expressions (introduced in C++11) provide a concise syntax to construct anonymous, inline function objects (closures) directly at the point of call.\n\nSyntax: `[capture](parameters) -> return_type { body }`\n\nCapture Clause (`[]`):\n\u2022 `[]`: Captures nothing from the enclosing scope.\n\u2022 `[=]`: Captures all local variables by VALUE (read-only copy).\n\u2022 `[&]`: Captures all local variables by REFERENCE (can modify outer variables).\n\u2022 `[x, &y]`: Captures `x` by value, `y` by reference.\n\u2022 `[this]`: Captures the current class instance pointer.\n\nBy default, variables captured by value are `const` inside the lambda body. Adding the `mutable` keyword (`[=]() mutable {}`) allows modifying the local copy.",
    "bullet_points": [
      "Creates anonymous inline function objects (closures).",
      "[=] captures by value; [&] captures by reference.",
      "Captured value variables are const by default unless marked mutable.",
      "Used extensively with STL algorithms: std::sort, std::for_each, std::find_if."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "#include <algorithm>\n#include <vector>\n\nstd::vector<int> nums = {4, 1, 8, 3};\nint threshold = 3;\n\n// Lambda capturing threshold by value\nauto it = std::find_if(nums.begin(), nums.end(), [threshold](int n) {\n    return n > threshold;\n});"
    },
    "pro_tip": "Trap: Capturing local stack variables by reference (`[&]`) inside a lambda returned from a function creates dangling references when the function exits!",
    "company_tags": [
      "Google",
      "Meta",
      "Microsoft",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 26
  },
  {
    "id": "int-cpp-027",
    "topic_id": "topic-cpp",
    "title": "What is the difference between Shallow Copy and Deep Copy in C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "\u2022 Shallow Copy:\n- Copies the exact bit-by-bit primitive values of member variables.\n- If a member is a POINTER, shallow copy only copies the memory address (pointer), meaning both original and copied objects point to the exact SAME heap memory block.\n- Hazard: Modifying memory via one object mutates the other; when both objects are destroyed, both destructors call `delete` on the same address, causing a catastrophic Double Free crash.\n- This is what the default compiler-generated copy constructor and assignment operator do.\n\n\u2022 Deep Copy:\n- Allocates a brand new, independent block of heap memory for the copy.\n- Copies the actual data values from the original heap buffer into the new heap buffer.\n- Both objects maintain completely independent lifecycles and memory addresses.\n- Required for all classes managing raw dynamic pointers.",
    "bullet_points": [
      "Shallow copy duplicates pointer addresses; both objects point to same memory.",
      "Shallow copy leads to double-free crashes and unintended state mutation.",
      "Deep copy allocates new heap memory and copies the data contents.",
      "Default compiler copy constructor is always a shallow copy."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class Deep {\n    int *data;\npublic:\n    Deep(int val) { data = new int(val); }\n    // Deep Copy Constructor\n    Deep(const Deep &other) {\n        data = new int(*other.data); // Allocate new memory & copy value!\n    }\n    ~Deep() { delete data; }\n};"
    },
    "pro_tip": "Whenever an interviewer asks 'Why did my program crash with a double-free?', the answer is almost always a shallow copy bug in a class without a custom copy constructor.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Microsoft",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 27
  },
  {
    "id": "int-cpp-028",
    "topic_id": "topic-cpp",
    "title": "Explain Exception Handling in C++ ('try', 'catch', 'throw') and standard exception classes.",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Exception handling in C++ provides a structured, type-safe mechanism to detect and handle runtime errors without relying on error return codes.\n\nKey Keywords:\n\u2022 throw: Signals the occurrence of an anomalous condition by instantiating and throwing an exception object.\n\u2022 try: Encloses a block of code that might throw an exception.\n\u2022 catch: Catches and handles specific exception types.\n\u2022 catch(...): Universal catch-all handler that catches any exception of any type.\n\nStandard Exception Hierarchy (`#include <stdexcept>`):\nAll standard exceptions inherit from `std::exception` (defines virtual `const char* what() const noexcept`):\n\u2022 `std::logic_error`: Bugs in program logic (e.g., `std::invalid_argument`, `std::out_of_range`).\n\u2022 `std::runtime_error`: Unpredictable runtime failures (e.g., `std::overflow_error`, `std::system_error`).\n\u2022 `std::bad_alloc`: Thrown by `new` when heap memory is exhausted.",
    "bullet_points": [
      "try block monitors code; throw triggers exception; catch handles specific type.",
      "catch(...) acts as a catch-all block.",
      "Standard hierarchy inherits from std::exception (virtual what() method).",
      "Always catch exceptions by const reference: catch (const std::exception &e)."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "try {\n    std::vector<int> v = {1, 2, 3};\n    std::cout << v.at(10); // Throws std::out_of_range\n} catch (const std::out_of_range &e) {\n    std::cerr << \"Out of range: \" << e.what() << '\\n';\n} catch (const std::exception &e) {\n    std::cerr << \"General error: \" << e.what() << '\\n';\n}"
    },
    "pro_tip": "Always catch exceptions by const reference (`catch (const std::exception &e)`). Catching by value causes Object Slicing, stripping derived exception info!",
    "company_tags": [
      "Microsoft",
      "Amazon",
      "Adobe"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 28
  },
  {
    "id": "int-cpp-029",
    "topic_id": "topic-cpp",
    "title": "What is the difference between overloading prefix '++i' and postfix 'i++' operators in C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "In C++, overloading the increment operator requires a language convention to distinguish prefix from postfix:\n\n1. Prefix Increment (`++obj`):\n\u2022 Signature: `MyClass& operator++();`\n\u2022 Takes NO arguments.\n\u2022 Increments object state and returns a reference to the updated object (`*this`).\n\u2022 Efficient: No temporary copy is created.\n\n2. Postfix Increment (`obj++`):\n\u2022 Signature: `MyClass operator++(int);`\n\u2022 Takes a dummy `int` parameter (used solely by the compiler to differentiate the signature; value is ignored).\n\u2022 Must save a COPY of the original object state, increment the object, and return the OLD copy by value.\n\u2022 Slower: Creates a temporary object copy on the stack.",
    "bullet_points": [
      "Prefix ++obj: MyClass& operator++(); returns updated object by reference.",
      "Postfix obj++: MyClass operator++(int); dummy int parameter, returns old copy by value.",
      "Prefix is more efficient because it creates no temporary object.",
      "In loops with iterators, always prefer ++it over it++ for better performance."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class Number {\n    int val = 0;\npublic:\n    Number& operator++() { // Prefix (++n)\n        val++;\n        return *this;\n    }\n    Number operator++(int) { // Postfix (n++)\n        Number temp = *this; // Save copy\n        val++;\n        return temp;         // Return old copy by value\n    }\n};"
    },
    "pro_tip": "This is why C++ guidelines always recommend `++it` over `it++` in for-loops: prefix avoids creating and destroying a temporary iterator on every single loop iteration.",
    "company_tags": [
      "Microsoft",
      "Adobe",
      "Qualcomm"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 29
  },
  {
    "id": "int-cpp-030",
    "topic_id": "topic-cpp",
    "title": "What is 'constexpr' in C++11 and how does it differ from 'const'?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "\u2022 const (Constant):\n- Guarantees that a variable's value cannot be modified after initialization.\n- Can be initialized at runtime (e.g., `const int size = get_user_input();`).\n- Specifies read-only mutability semantics.\n\n\u2022 constexpr (Constant Expression - C++11):\n- Guarantees that the value is evaluated and computed strictly at COMPILE TIME.\n- Must be initialized with an expression that the compiler can evaluate during compilation (`constexpr int size = 10 * 2;`).\n- Can be applied to functions (`constexpr int square(int x) { return x * x; }`): If passed compile-time constants, the function executes at compile time and embeds the constant result in machine code with ZERO runtime execution cost!\n\nAll `constexpr` variables are implicitly `const`, but not all `const` variables are `constexpr`.",
    "bullet_points": [
      "const can be initialized at runtime; constexpr MUST be computed at compile-time.",
      "constexpr functions execute at compile time if inputs are known at compile time.",
      "constexpr results can be used for array sizes, template arguments, and enum values.",
      "All constexpr variables are implicitly const."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "constexpr int factorial(int n) {\n    return (n <= 1) ? 1 : (n * factorial(n - 1));\n}\n\n// Computed by the compiler at build time: 120 directly embedded in binary!\nint arr[factorial(5)];"
    },
    "pro_tip": "Mention that `constexpr` enables Zero-Cost Abstractions where complex mathematical tables or hashes are calculated at build time with 0 CPU cycles at runtime.",
    "company_tags": [
      "Google",
      "Microsoft",
      "Bloomberg",
      "Nvidia"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 30
  },
  {
    "id": "int-cpp-031",
    "topic_id": "topic-cpp",
    "title": "What are Iterators in STL and what are the five standard iterator categories?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "An iterator is an object that acts as a generalized pointer, enabling sequential or random traversal across elements in any STL container without exposing its underlying memory architecture.\n\nFive Standard Iterator Categories (Hierarchical):\n1. Input Iterator: Read-only, single-pass forward movement (e.g., `std::istream_iterator`).\n2. Output Iterator: Write-only, single-pass forward movement (e.g., `std::ostream_iterator`).\n3. Forward Iterator: Read/write, multi-pass forward movement (e.g., `std::forward_list`).\n4. Bidirectional Iterator: Read/write, can move both forward (`++`) and backward (`--`) (e.g., `std::list`, `std::map`, `std::set`).\n5. Random Access Iterator: Read/write, supports instantaneous arithmetic jumps in O(1) (`+`, `-`, `+=`, `[]`, `<`) (e.g., `std::vector`, `std::deque`, raw arrays).",
    "bullet_points": [
      "Iterators decouple algorithms from underlying container memory layouts.",
      "5 categories: Input, Output, Forward, Bidirectional, Random Access.",
      "vector iterators are Random Access (O(1) indexing).",
      "list/map iterators are Bidirectional (support ++ and --, but not arithmetic offsets like + 5)."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "#include <vector>\n\nstd::vector<int> v = {10, 20, 30};\nfor (std::vector<int>::iterator it = v.begin(); it != v.end(); ++it) {\n    std::cout << *it << ' ';\n}"
    },
    "pro_tip": "In modern C++, avoid verbose iterator declarations: use `for (const auto &elem : v)` (range-based for loop) or `auto it = v.begin()`.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Adobe"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 31
  },
  {
    "id": "int-cpp-032",
    "topic_id": "topic-cpp",
    "title": "Explain the 'auto' keyword and type deduction in modern C++ (C++11/14).",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "In modern C++ (C++11), the `auto` keyword specifies that the compiler will automatically deduce the variable's type from its initialization expression at compile time.\n\nKey Rules:\n1. Zero Runtime Overhead: Type deduction happens entirely at compile time; machine code is identical to explicitly typed code.\n2. Strips References and Const by Default:\n   \u2022 `const int x = 10; auto a = x;` -> `a` is deduced as `int` (NOT const).\n   \u2022 To preserve const and references, use `const auto&` (`const auto &ref = x;`).\n3. Eliminates Verbosity: Ideal for complex STL container types and iterators (`auto it = map.begin();` instead of `std::map<std::string, std::vector<int>>::iterator`).\n4. C++14 Generic Lambdas: Allows `auto` in parameter lists (`[](auto a, auto b) { return a + b; }`).",
    "bullet_points": [
      "Compiler deduces type at compile-time with zero runtime penalty.",
      "auto strips const and references by default; use const auto& to preserve them.",
      "Drastically simplifies long STL iterator and function pointer types.",
      "C++14 supports auto in function return types and lambda parameters."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "std::vector<std::pair<int, std::string>> list;\n// Without auto: verbose and error-prone\nfor (auto it = list.begin(); it != list.end(); ++it) {}\n\n// Range-based for loop with const reference\nfor (const auto &item : list) {}"
    },
    "pro_tip": "Rule of thumb: Use `const auto&` for read-only iterations over collections to avoid expensive unintended copies.",
    "company_tags": [
      "Microsoft",
      "Google",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 32
  },
  {
    "id": "int-cpp-033",
    "topic_id": "topic-cpp",
    "title": "What is 'nullptr' in C++11 and why is it superior to 'NULL' or '0'?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "In pre-C++11, `NULL` was defined as `0` or `((void*)0)`. Because `0` is an integer literal, it introduced subtle function overloading ambiguities.\n\nThe Problem with NULL/0:\nSuppose you have overloaded functions:\n`void f(int);`\n`void f(char*);`\nCalling `f(NULL)` or `f(0)` resolves to `f(int)`! The compiler treats `NULL` as an integer rather than a pointer, which is counter-intuitive and dangerous.\n\nWhy nullptr is Superior (C++11):\n\u2022 `nullptr` is a strongly-typed keyword of type `std::nullptr_t`.\n\u2022 It is implicitly convertible to ANY raw pointer or smart pointer type, but CANNOT be converted to integer types (except boolean in conditional contexts).\n\u2022 Calling `f(nullptr)` unambiguously resolves to `f(char*)`.",
    "bullet_points": [
      "NULL was defined as integer 0, causing function overloading ambiguities.",
      "nullptr is a strongly typed pointer literal of type std::nullptr_t.",
      "Cannot convert implicitly to integers; binds unambiguously to pointer overloads.",
      "Always use nullptr in modern C++."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "void foo(int x)   { std::cout << \"int\\n\"; }\nvoid foo(int *ptr) { std::cout << \"pointer\\n\"; }\n\n// foo(NULL);    // AMBIGUOUS or calls foo(int)!\nfoo(nullptr); // Unambiguously calls foo(int*)"
    },
    "pro_tip": "Always replace `NULL` with `nullptr` across your codebase. Any modern C++ compiler flags `NULL` as deprecated style.",
    "company_tags": [
      "Microsoft",
      "Google",
      "Adobe",
      "Apple"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 33
  },
  {
    "id": "int-cpp-034",
    "topic_id": "topic-cpp",
    "title": "What is Constructor Delegation and In-Class Member Initializers in C++11?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "C++11 introduced two major features to eliminate constructor boilerplate and duplication:\n\n1. Constructor Delegation:\n\u2022 Allows a constructor in a class to call another constructor in the SAME class in its member initializer list.\n\u2022 Eliminates duplicate initialization logic across multiple overloaded constructors.\n\u2022 Syntax: `MyClass() : MyClass(0, \"Default\") {}`\n\u2022 Rule: The delegated constructor must be the ONLY element in the initializer list.\n\n2. In-Class Member Initializers:\n\u2022 Allows member variables to be given default values directly at their declaration inside the class definition.\n\u2022 If a constructor does not explicitly initialize that field, the in-class default value is used automatically.\n\u2022 If a constructor explicitly initializes the field, the constructor's value overrides the in-class default.",
    "bullet_points": [
      "Constructor delegation allows one constructor to invoke another constructor in the same class.",
      "Centralizes initialization and eliminates duplicate code.",
      "In-class initializers provide default values at declaration site.",
      "Constructor member initializer lists override in-class defaults."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class Server {\n    int port = 8080;        // In-class default\n    std::string host = \"localhost\";\npublic:\n    // Delegating Constructor\n    Server() : Server(8080, \"localhost\") {}\n    Server(int p, std::string h) : port(p), host(h) {} // Target constructor\n};"
    },
    "pro_tip": "Mention that before C++11, developers had to write private `init()` helper methods, which lost the benefit of const member initialization in initializer lists.",
    "company_tags": [
      "Google",
      "Microsoft",
      "Amazon"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 34
  },
  {
    "id": "int-cpp-035",
    "topic_id": "topic-cpp",
    "title": "Why must a Base Class Destructor ALWAYS be declared Virtual when deleting through a base pointer?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "This is arguably the #1 most frequently asked C++ tricky interview question.\n\nScenario: Suppose you create a derived object dynamically and hold it via a base class pointer:\n`Base *ptr = new Derived();`\nWhen you delete it:\n`delete ptr;`\n\nWhat Happens if the Base Destructor is Non-Virtual:\n\u2022 The compiler binds the destructor call at compile time based on the declared pointer type (`Base*`).\n\u2022 As a result, ONLY `~Base()` executes! The derived class destructor `~Derived()` is NEVER called!\n\u2022 Consequences:\n  1. Any heap memory, open file descriptors, or mutex locks owned by the derived class are LEAKED.\n  2. The C++ standard explicitly classifies deleting a derived object through a non-virtual base pointer as UNDEFINED BEHAVIOR.\n\nWhen `virtual ~Base()` is Added:\n\u2022 Destructor invocation uses dynamic dispatch via the `vtable`.\n\u2022 The runtime calls `~Derived()` first, which releases derived resources, and then automatically calls `~Base()` in reverse order.",
    "bullet_points": [
      "Deleting derived object via non-virtual base pointer calls ONLY base destructor.",
      "Derived destructor never runs, causing resource/memory leaks and Undefined Behavior.",
      "Declaring virtual ~Base() ensures dynamic dispatch: ~Derived() runs first, then ~Base().",
      "Golden Rule: Any class intended as a base class with virtual functions MUST have a virtual destructor."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class Base {\npublic:\n    virtual ~Base() { std::cout << \"~Base\\n\"; } // VIRTUAL: prevents leaks!\n};\nclass Derived : public Base {\n    int *arr;\npublic:\n    Derived() { arr = new int[100]; }\n    ~Derived() override { delete[] arr; std::cout << \"~Derived\\n\"; }\n};\n\nBase *b = new Derived();\ndelete b; // Outputs: ~Derived then ~Base"
    },
    "pro_tip": "State the Guideline: 'A base class destructor should either be public and virtual, or protected and non-virtual.'",
    "company_tags": [
      "Microsoft",
      "Google",
      "Adobe",
      "Apple",
      "Nvidia"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 35
  },
  {
    "id": "int-cpp-036",
    "topic_id": "topic-cpp",
    "title": "What is the Object Slicing Problem in C++ and how do you prevent it?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Object Slicing occurs when an object of a derived class is copied into an instance of a base class BY VALUE (instead of by reference or pointer).\n\nHow it Happens:\n`class Derived : public Base { int extra; };`\n`Derived d;`\n`Base b = d; // OBJECT SLICING OCCURS HERE!`\n\nBecause variable `b` is of type `Base`, its memory allocation on the stack is only large enough to hold `Base`'s member variables. During assignment, the compiler 'slices off' all the derived class members (`extra`) and copies only the base class portion.\n\nFatal Consequence for Polymorphism:\nThe sliced object `b`'s hidden `vptr` is pointed to `Base`'s vtable! Even if you call virtual functions on `b`, the derived class overrides will NEVER be called.\n\nPrevention:\nAlways pass polymorphic objects by CONST REFERENCE (`const Base &b`) or POINTER (`Base *b`). Never pass polymorphic objects by value!",
    "bullet_points": [
      "Occurs when a derived object is assigned to a base class variable by value.",
      "Derived member variables are sliced off to fit base object size.",
      "The object's vptr is reset to base vtable, completely destroying polymorphism.",
      "Prevent by passing objects by reference (Base&) or pointer (Base*)."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "void bad(Base b) { b.draw(); }       // Slices derived object! Calls Base::draw()\nvoid good(const Base &b) { b.draw(); } // Preserves polymorphism! Calls Derived::draw()"
    },
    "pro_tip": "Whenever reviewing a function signature accepting a base class by value (`void func(Base b)`), immediately flag it as an Object Slicing bug.",
    "company_tags": [
      "Google",
      "Microsoft",
      "Adobe",
      "Bloomberg"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 36
  },
  {
    "id": "int-cpp-037",
    "topic_id": "topic-cpp",
    "title": "Explain Rvalue References (&&), std::move, and Move Semantics in modern C++11.",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Move Semantics (introduced in C++11) eliminates expensive deep copies when dealing with temporary objects (rvalues).\n\n\u2022 Lvalue vs Rvalue:\n- Lvalue: An expression that refers to a persistent memory location with an identifiable name (`int x = 10;`, `x` is an lvalue).\n- Rvalue: A temporary value that does not persist beyond the expression that creates it (`10`, `x + 5`, temporary objects returned by value).\n\n\u2022 Rvalue Reference (`T&&`):\nA new reference type that binds specifically to temporary rvalues.\n\n\u2022 Move Constructor & Move Assignment (`T(T&& other)`):\nInstead of allocating a new heap buffer and copying bytes from `other` (deep copy), move semantics 'steals' the raw internal pointer from `other` and sets `other`'s pointer to `nullptr`! This operation is O(1) instantaneous.\n\n\u2022 std::move:\n`std::move` does NOT move anything at runtime! It is simply an unconditional compile-time cast that casts an lvalue to an rvalue (`static_cast<T&&>(var)`), signaling to the compiler that it is safe to pillage its resources.",
    "bullet_points": [
      "lvalue has an identifiable name/address; rvalue is a temporary value.",
      "Rvalue reference (Type&&) binds to temporary objects.",
      "Move constructor steals heap pointers in O(1) instead of deep-copying bytes.",
      "std::move is just a static cast to rvalue reference; it generates zero machine instructions."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class Buffer {\n    int *data;\npublic:\n    // Move Constructor: Steals resources in O(1)\n    Buffer(Buffer &&other) noexcept : data(other.data) {\n        other.data = nullptr; // Leave source in safe, destructible state\n    }\n};\n\nBuffer a(1000000);\nBuffer b = std::move(a); // Transfers ownership instantaneously! a.data is now null"
    },
    "pro_tip": "Always mark move constructors and move assignment operators with `noexcept`. Standard containers like `std::vector` will refuse to use move semantics during reallocation if not marked `noexcept`!",
    "company_tags": [
      "Google",
      "Meta",
      "Microsoft",
      "Nvidia"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 37
  },
  {
    "id": "int-cpp-038",
    "topic_id": "topic-cpp",
    "title": "Compare C++11 Smart Pointers: unique_ptr, shared_ptr, and weak_ptr. How is Circular Reference resolved?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Smart pointers (in `<memory>`) are RAII class templates that automatically manage heap memory, eliminating manual `delete` calls and memory leaks:\n\n1. `std::unique_ptr`:\n\u2022 Exclusive Ownership: Only ONE `unique_ptr` can own the object at a time.\n\u2022 Non-copyable (copy constructor deleted); must be MOVED (`std::move`).\n\u2022 Zero runtime overhead (exact same size and speed as a raw pointer).\n\u2022 Factory: `std::make_unique<T>()`.\n\n2. `std::shared_ptr`:\n\u2022 Shared Ownership: Multiple `shared_ptr`s can share ownership of the same object.\n\u2022 Maintains an internal atomic Reference Count inside a Heap Control Block.\n\u2022 When a shared_ptr is copied, ref count increments; when destroyed, ref count decrements.\n\u2022 When ref count reaches 0, the object is deleted.\n\u2022 Factory: `std::make_shared<T>()`.\n\n3. `std::weak_ptr` (Resolves Circular References):\n\u2022 Non-owning observer of an object owned by a `shared_ptr`.\n\u2022 Does NOT increment the reference count.\n\u2022 Circular Reference Trap: If Node A holds `shared_ptr<B>` and B holds `shared_ptr<A>`, both reference counts never hit 0, causing a permanent memory leak!\n\u2022 Resolution: Break the cycle by changing one pointer to `std::weak_ptr`.",
    "bullet_points": [
      "unique_ptr: exclusive ownership, zero overhead, move-only.",
      "shared_ptr: shared ownership via thread-safe atomic reference counting.",
      "weak_ptr: non-owning observer; does not increment reference count.",
      "Circular references between shared_ptrs leak memory; broken using weak_ptr."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "struct Node {\n    std::shared_ptr<Node> next;\n    std::weak_ptr<Node> prev; // weak_ptr breaks circular reference cycle!\n};\n\nauto u = std::make_unique<int>(42); // Recommended unique_ptr creation"
    },
    "pro_tip": "Always use `std::make_shared` over `shared_ptr<T>(new T)`: `make_shared` performs a single heap allocation for both the control block and object, improving cache locality.",
    "company_tags": [
      "Microsoft",
      "Google",
      "Amazon",
      "Adobe"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 38
  },
  {
    "id": "int-cpp-039",
    "topic_id": "topic-cpp",
    "title": "What is RAII (Resource Acquisition Is Initialization) and why is it the backbone of modern C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "RAII (Resource Acquisition Is Initialization) is a core C++ idiom that binds the lifecycle of a resource (heap memory, file handles, socket descriptors, thread mutex locks) directly to the lifetime of a Stack object.\n\nTwo Core Principles:\n1. Resource Acquisition in Constructor: The resource is acquired and initialized inside the object's constructor.\n2. Resource Release in Destructor: The resource is guaranteed to be released inside the object's destructor.\n\nWhy RAII is the Backbone of C++:\n\u2022 Exception Safety: If an exception is thrown in a function, the C++ runtime performs Stack Unwinding. Destructors of all local stack objects are guaranteed to execute during stack unwinding. Resources managed via RAII are never leaked, even during unexpected exceptions!\n\u2022 Examples in Standard Library: `std::unique_ptr`, `std::vector`, `std::fstream`, `std::lock_guard`, `std::unique_lock`.",
    "bullet_points": [
      "Acquire resource in constructor; release in destructor.",
      "Guarantees deterministic cleanup during normal exit and Stack Unwinding.",
      "Eliminates manual cleanup and prevents resource leaks.",
      "Standard library examples: unique_ptr, fstream, lock_guard."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "void processFile() {\n    std::ifstream file(\"data.txt\"); // File opened in constructor\n    std::lock_guard<std::mutex> lock(mtx); // Mutex acquired\n    \n    if (error_condition) throw std::runtime_error(\"Error\"); \n    // Even if exception is thrown, file and mutex are 100% safely released!"
    },
    "pro_tip": "State: 'In modern C++, you should almost never see raw `new` and `delete` in application code; RAII wrappers like `unique_ptr` and `lock_guard` manage everything.'",
    "company_tags": [
      "Google",
      "Microsoft",
      "Bloomberg",
      "Apple"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 39
  },
  {
    "id": "int-cpp-040",
    "topic_id": "topic-cpp",
    "title": "Explain the 'Rule of Five' and 'Rule of Zero' in modern C++.",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "\u2022 Rule of Five (Extension of Rule of Three for C++11):\nWith the introduction of move semantics in C++11, if a class needs to manage resources manually, it must declare all FIVE special member functions:\n1. Destructor\n2. Copy Constructor\n3. Copy Assignment Operator\n4. Move Constructor\n5. Move Assignment Operator\n(If you declare a custom destructor or copy operation, the compiler will automatically disable generation of move operations!).\n\n\u2022 Rule of Zero (Modern C++ Best Practice):\nClasses should be designed such that they require ZERO custom special member functions.\nInstead of manually managing raw pointers or handles, use standard library RAII types (`std::string`, `std::vector`, `std::unique_ptr`). The compiler-generated default destructors, copy operations, and move operations will automatically do the right thing without writing a single line of boilerplate!",
    "bullet_points": [
      "Rule of Five: Destructor, Copy Ctor, Copy Assign, Move Ctor, Move Assign.",
      "Providing custom copy/destructor suppresses default move operations.",
      "Rule of Zero: Use RAII types (string, vector, smart pointers) so zero custom special functions are needed.",
      "Rule of Zero is the highest architectural ideal in modern C++."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "// Rule of Zero: Completely clean, no manual memory management\nclass Person {\n    std::string name;\n    std::vector<int> scores;\n    // All 5 special functions auto-generated correctly by compiler!\n};"
    },
    "pro_tip": "Always advocate the Rule of Zero first: 'Whenever possible, I follow the Rule of Zero by composing modern RAII types like smart pointers and STL containers.'",
    "company_tags": [
      "Google",
      "Microsoft",
      "Meta",
      "Bloomberg"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 40
  },
  {
    "id": "int-cpp-041",
    "topic_id": "topic-cpp",
    "title": "What is Name Hiding in C++ and how does it differ from Method Overriding?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "In C++, if a derived class declares a member function with the same name as a function in its base class, it HIDES ALL overloads of that function in the base class, regardless of whether the parameter signatures match!\n\nExample:\n\u2022 Base class has `void print(int);` and `void print(double);`.\n\u2022 Derived class declares `void print(string);`.\n\u2022 If you call `derived.print(5);`, it FAILS to compile with an error! The compiler does not check the Base class overloads because the name `print` in the derived scope hides the base scope.\n\nSolution: Use the `using` declaration:\n`using Base::print;`\nThis brings all base class overloads into the derived class scope, allowing normal overloading across the inheritance hierarchy.",
    "bullet_points": [
      "Declaring a function name in a derived class hides all base overloads with that name.",
      "Occurs even if parameter signatures are completely different.",
      "Un-hide base overloads by adding: using Base::function_name; in derived class.",
      "Crucial difference: Overriding replaces virtual implementation; Hiding obscures scope."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class Base {\npublic:\n    void show(int x) { std::cout << \"Base int: \" << x << '\\n'; }\n};\nclass Derived : public Base {\npublic:\n    using Base::show; // Un-hides Base::show(int)\n    void show(std::string s) { std::cout << \"Derived str: \" << s << '\\n'; }\n};\n\nDerived d;\nd.show(42); // Now works! Without 'using Base::show', this fails to compile!"
    },
    "pro_tip": "Interviewers test this to check if you understand C++ scope lookup rules (name lookup happens before type/overload resolution).",
    "company_tags": [
      "Google",
      "Microsoft",
      "Qualcomm"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 41
  },
  {
    "id": "int-cpp-042",
    "topic_id": "topic-cpp",
    "title": "Explain the 'Copy-and-Swap' Idiom in C++ and why it guarantees Strong Exception Safety.",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "The Copy-and-Swap idiom is an elegant pattern for implementing the copy assignment operator (and move assignment) that achieves Strong Exception Safety and eliminates code duplication between copy constructor and assignment.\n\nHow it Works:\n1. Pass argument BY VALUE: `MyClass& operator=(MyClass other)`.\n   \u2022 Passing by value leverages the copy constructor to duplicate the resource BEFORE entering the assignment function body.\n   \u2022 If memory allocation fails during copying, an exception is thrown before any changes are made to `this` object.\n2. Swap: Swap the internal data pointers of `this` and `other` using a non-throwing `swap` function (`std::swap(data, other.data)`).\n3. Automatic Cleanup: When the assignment function exits, `other` (which now holds the old resource from `this`) goes out of scope and its destructor automatically frees the old resource!\n\nBenefits: Solves self-assignment checking, provides the strong exception safety guarantee (all-or-nothing), and automatically handles both copy and move assignment.",
    "bullet_points": [
      "Takes argument by value to perform copy upfront.",
      "Swaps member data with local copy using non-throwing swap.",
      "Old resource automatically destroyed when local copy exits scope.",
      "Guarantees Strong Exception Safety and handles self-assignment seamlessly."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class String {\n    char *buf;\n    size_t size;\npublic:\n    friend void swap(String &first, String &second) noexcept {\n        using std::swap;\n        swap(first.buf, second.buf);\n        swap(first.size, second.size);\n    }\n    // Copy-and-Swap Assignment Operator\n    String& operator=(String other) { // Takes by value\n        swap(*this, other);           // Swaps resources\n        return *this;                 // other's destructor frees old buf\n    }\n};"
    },
    "pro_tip": "Mention that passing by value in `operator=(MyClass other)` allows the single function to serve as BOTH copy assignment and move assignment (via move constructor)!",
    "company_tags": [
      "Google",
      "Microsoft",
      "Bloomberg",
      "Amazon"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 42
  },
  {
    "id": "int-python-001",
    "topic_id": "topic-python",
    "title": "What is Python and why is it called a Dynamically-Typed, Interpreted language?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Python is a high-level, general-purpose, interpreted, and multi-paradigm programming language created by Guido van Rossum and first released in 1991.\n\nWhy it is called:\n1. Dynamically Typed: Variable types are NOT declared explicitly in code. Type checking occurs at runtime when the statement executes, and a variable can hold different data types over its lifecycle (`x = 10; x = \"hello\"` is 100% legal).\n2. Interpreted / Bytecode-Compiled: Python source code (`.py`) is compiled into intermediate bytecode (`.pyc`) by CPython, which is then interpreted instruction-by-instruction by the Python Virtual Machine (PVM). There is no separate manual build/compilation step required by the programmer.",
    "bullet_points": [
      "Created by Guido van Rossum (1991).",
      "Dynamically typed: variables bind to object references at runtime without explicit type declarations.",
      "CPython compiles source to .pyc bytecode and executes it on the Python Virtual Machine (PVM).",
      "Supports object-oriented, functional, and procedural programming paradigms."
    ],
    "code_snippet": {
      "language": "python",
      "code": "x = 42        # x is an integer reference\nx = \"Prepunite\" # x dynamically rebounds to a string object at runtime"
    },
    "pro_tip": "Clarify the common misconception: Python is NOT purely interpreted! CPython compiles `.py` to bytecode `.pyc` first, and then interprets the bytecode.",
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft",
      "TCS"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 1
  },
  {
    "id": "int-python-002",
    "topic_id": "topic-python",
    "title": "What are the core Built-in Data Structures in Python and how do they differ?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Python provides four primary built-in collection data structures:\n\n1. List (`[]`): Ordered, mutable sequence of elements. Allows duplicates. Supports indexing and slicing. (Dynamic array implementation).\n2. Tuple (`()`): Ordered, IMMUTABLE sequence of elements. Allows duplicates. Faster than lists and can be used as dictionary keys if all items are hashable.\n3. Set (`{}`): Unordered, mutable collection of UNIQUE elements. Disallows duplicates. Backed by a hash table; provides O(1) average lookup and set operations (union, intersection).\n4. Dictionary (`{key: value}`): Ordered (since Python 3.7) collection of key-value pairs. Keys must be immutable/hashable; values can be of any type. Backed by an optimized hash table.",
    "bullet_points": [
      "List: ordered, mutable, duplicates allowed ([1, 2, 2]).",
      "Tuple: ordered, immutable, hashable if contents are immutable ((1, 2)).",
      "Set: unordered, unique elements, O(1) membership testing ({1, 2}).",
      "Dictionary: key-value mapping, O(1) lookup, unique hashable keys ({'a': 1})."
    ],
    "code_snippet": {
      "language": "python",
      "code": "my_list = [1, 2, 3]        # Mutable: my_list.append(4)\nmy_tuple = (1, 2, 3)       # Immutable: cannot reassign elements\nmy_set = {1, 2, 3, 3}      # Unique: evaluates to {1, 2, 3}\nmy_dict = {\"id\": 1, \"name\": \"Chandu\"} # Hash map"
    },
    "pro_tip": "Whenever asked 'When to choose tuple over list?', answer: (1) Data integrity (guarantee read-only values), (2) Performance (lower memory and faster creation), (3) Usable as dictionary keys and set elements.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "TCS",
      "Infosys"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 2
  },
  {
    "id": "int-python-003",
    "topic_id": "topic-python",
    "title": "What is the difference between Mutable and Immutable data types in Python?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "In Python, every entity is an Object in memory. Whether an object's state can change after creation determines its mutability:\n\n\u2022 Immutable Types:\n- State CANNOT be modified after creation in memory.\n- Modifying an immutable variable (e.g., `s += \"!\"`) creates a BRAND NEW object at a different memory address (`id()`).\n- Types: `int`, `float`, `bool`, `str`, `tuple`, `frozenset`, `bytes`.\n\n\u2022 Mutable Types:\n- State CAN be modified in-place in memory without changing the object's identity (`id()`).\n- Types: `list`, `dict`, `set`, `bytearray`, custom classes.\n- Passing a mutable object to a function allows the function to alter caller state directly.",
    "bullet_points": [
      "Immutable: int, float, str, tuple, bool, frozenset (cannot modify in-place).",
      "Mutable: list, dict, set (can modify in-place without changing id()).",
      "Reassigning an immutable variable creates a new object in memory.",
      "Only immutable (hashable) objects can be used as dictionary keys."
    ],
    "code_snippet": {
      "language": "python",
      "code": "x = 10\nprint(id(x))\nx += 1\nprint(id(x)) # DIFFERENT id: new integer object instantiated!\n\nlst = [1, 2]\nprint(id(lst))\nlst.append(3)\nprint(id(lst)) # IDENTICAL id: mutated in-place!"
    },
    "pro_tip": "Interviewers frequently ask why strings are immutable in Python: For hash table security (caching string hashes for dict keys) and thread-safe memory sharing.",
    "company_tags": [
      "Google",
      "Amazon",
      "Meta",
      "Uber"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 3
  },
  {
    "id": "int-python-004",
    "topic_id": "topic-python",
    "title": "What is the difference between 'is' and '==' operators in Python?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "\u2022 '==' Operator (Equality / Value Comparison):\n- Compares the VALUES or contents of two objects.\n- Invokes the object's `__eq__()` dunder method behind the scenes.\n- Evaluates to `True` if both objects represent the same logical data.\n\n\u2022 'is' Operator (Identity / Reference Comparison):\n- Compares the MEMORY IDENTITY (address) of two objects.\n- Checks whether `id(a) == id(b)` (whether both variables point to the exact SAME physical object in RAM).\n- Evaluates to `True` only if both variables reference the identical object.\n\nRule: Always use `is` when comparing singletons like `None` (`if val is None:`), and `==` when comparing values (`if a == b:`).",
    "bullet_points": [
      "== compares object values/contents (calls __eq__).",
      "is compares object memory addresses (id(a) == id(b)).",
      "Two distinct lists with identical elements return True for == and False for is.",
      "Always use 'is None' and 'is not None' for singleton checks."
    ],
    "code_snippet": {
      "language": "python",
      "code": "a = [1, 2, 3]\nb = [1, 2, 3]\n\nprint(a == b) # True  (identical values)\nprint(a is b) # False (distinct Heap list objects in memory)\n\nc = a\nprint(a is c) # True  (both point to same memory address)"
    },
    "pro_tip": "PEP 8 standard explicitly requires: Comparisons to singletons like `None` must always be done with `is` or `is not`, never with equality operators.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "TCS",
      "Accenture"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 4
  },
  {
    "id": "int-python-005",
    "topic_id": "topic-python",
    "title": "How does Slicing work in Python? Explain '[start:stop:step]'.",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Slicing extracts a sub-sequence from sequential collections (strings, lists, tuples) without mutating the original object.\n\nSyntax: `sequence[start:stop:step]`\n\nParameters:\n\u2022 start: The starting index (inclusive). Defaults to `0` (or end if step is negative).\n\u2022 stop: The ending index (EXCLUSIVE). Defaults to sequence length.\n\u2022 step: The stride / increment between elements. Defaults to `1`.\n\nKey Tricks:\n1. Negative indexing: `-1` refers to the last element, `-2` second-to-last.\n2. Reversing a sequence: `seq[::-1]` reverses the collection in a single line.\n3. Copying: `seq[:]` creates a shallow copy of the sequence.\n4. Omitted bounds: `seq[:3]` grabs first 3 items; `seq[3:]` skips first 3 items.",
    "bullet_points": [
      "Syntax: seq[start:stop:step] (start is inclusive, stop is exclusive).",
      "Negative index wraps around from the end (-1 is last element).",
      "seq[::-1] cleanly reverses any sequence in O(N) time.",
      "Slicing returns a new collection without modifying the original."
    ],
    "code_snippet": {
      "language": "python",
      "code": "s = \"PREPUNITE\"\nprint(s[0:4])   # \"PREP\" (indices 0, 1, 2, 3)\nprint(s[::2])    # \"PENIE\" (every 2nd character)\nprint(s[::-1])   # \"ETINUPERP\" (reversed string!)"
    },
    "pro_tip": "Explain that `s[::-1]` is implemented in optimized C inside CPython, making it faster than manual loop concatenation or `reversed()` for strings.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 5
  },
  {
    "id": "int-python-006",
    "topic_id": "topic-python",
    "title": "What is the purpose of 'self' in Python class methods?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "`self` represents the instance of the class that is currently calling the method.\n\nWhy it is Explicit in Python:\nIn languages like Java or C++, the instance pointer (`this`) is passed implicitly behind the scenes. Python follows the Zen of Python philosophy: 'Explicit is better than implicit'.\n\nHow it Works:\nWhen you call `student.study()`, Python internally transforms the call into:\n`Student.study(student)`\nPython automatically passes the object reference (`student`) as the first parameter to the method. While convention universally names this parameter `self`, it is not a reserved keyword (you could technically name it anything, though breaking convention is strongly discouraged).",
    "bullet_points": [
      "Represents the specific instance calling the method.",
      "Enforces Python philosophy: 'Explicit is better than implicit'.",
      "object.method() translates to Class.method(object) under the hood.",
      "Must be the first parameter in all instance method declarations."
    ],
    "code_snippet": {
      "language": "python",
      "code": "class Car:\n    def __init__(self, brand):\n        self.brand = brand # Binds brand attribute to this instance\n\n    def drive(self):\n        print(f\"{self.brand} is driving\")\n\nc = Car(\"Tesla\")\nc.drive() # Automatically passes 'c' as self"
    },
    "pro_tip": "Class methods decorated with `@classmethod` take `cls` as their first parameter instead of `self`, referencing the class object itself rather than an instance.",
    "company_tags": [
      "TCS",
      "Accenture",
      "Cognizant"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 6
  },
  {
    "id": "int-python-007",
    "topic_id": "topic-python",
    "title": "What is the difference between 'range()' and 'enumerate()' in Python loops?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "\u2022 range(start, stop, step):\n- Generates an immutable sequence of numbers on-demand (lazy evaluation in Python 3).\n- Consumes O(1) constant memory regardless of whether the range spans 10 or 10,000,000 numbers.\n- Used when you need a loop to execute a set number of iterations (`for i in range(10):`).\n\n\u2022 enumerate(iterable, start=0):\n- Built-in function that takes an iterable and returns an enumerate iterator yielding pairs of `(index, element)` on each step.\n- Eliminates the anti-pattern of manually tracking loop index counters (`i = 0; i += 1`) or indexing with `range(len(arr))`.\n- Cleaner, more pythonic, and faster.",
    "bullet_points": [
      "range generates sequence of numbers in O(1) memory.",
      "enumerate yields (index, item) tuples directly.",
      "Avoid for i in range(len(arr)): use for idx, item in enumerate(arr):.",
      "Supports custom start index: enumerate(arr, start=1)."
    ],
    "code_snippet": {
      "language": "python",
      "code": "fruits = [\"apple\", \"banana\", \"cherry\"]\n\n# Pythonic: enumerate yields index and item\nfor idx, fruit in enumerate(fruits, start=1):\n    print(f\"{idx}: {fruit}\")"
    },
    "pro_tip": "Whenever an interviewer sees `for i in range(len(list)):`, they subtract points for unpythonic code. Always use `enumerate()`!",
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 7
  },
  {
    "id": "int-python-008",
    "topic_id": "topic-python",
    "title": "What are Keyword Arguments vs Positional Arguments in Python functions?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "\u2022 Positional Arguments:\n- Arguments that are passed into a function based strictly on their ORDER / position in the parameter list.\n- The first argument binds to the first parameter, the second to the second.\n\n\u2022 Keyword (Named) Arguments:\n- Arguments passed with the syntax `parameter_name = value`.\n- Order does NOT matter because parameters are mapped explicitly by their identifier name.\n- Vastly improves readability for functions with many parameters or optional configurations.\n\nRule: Positional arguments must ALWAYS come BEFORE keyword arguments in any function call (`func(10, y=20)` is valid; `func(x=10, 20)` causes a SyntaxError: positional argument follows keyword argument).",
    "bullet_points": [
      "Positional arguments match parameters based on order.",
      "Keyword arguments match parameters based on variable names.",
      "Positional arguments MUST always precede keyword arguments.",
      "Keyword arguments enhance code clarity and self-documentation."
    ],
    "code_snippet": {
      "language": "python",
      "code": "def register_user(username, email, role=\"Student\"):\n    print(f\"{username}, {email}, {role}\")\n\nregister_user(\"chandu\", \"c@test.com\")                  # Positional\nregister_user(email=\"c@test.com\", username=\"chandu\")  # Keyword (order flipped!)\n# register_user(username=\"chandu\", \"c@test.com\")      # SyntaxError!"
    },
    "pro_tip": "In Python 3.8+, you can use `/` to enforce positional-only arguments and `*` to enforce keyword-only arguments (`def f(pos_only, /, standard, *, kw_only):`).",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "TCS"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 8
  },
  {
    "id": "int-python-009",
    "topic_id": "topic-python",
    "title": "What is the difference between 'break', 'continue', and 'pass' in Python?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "All three are control flow statements used in loops and blocks:\n\n1. break:\n\u2022 Terminates the innermost enclosing loop (`for` or `while`) immediately.\n\u2022 Execution jumps to the statement following the loop body.\n\n2. continue:\n\u2022 Skips the remainder of the current loop iteration.\n\u2022 Execution immediately jumps to the next cycle of the loop condition/iterator.\n\n3. pass:\n\u2022 A null statement (no-operation / NOP).\n\u2022 The CPU executes it and does nothing.\n\u2022 Used as a syntactic placeholder in empty functions, classes, or conditional branches where code will eventually be written, because Python indentation requires at least one statement in a block.",
    "bullet_points": [
      "break immediately terminates the loop.",
      "continue skips current iteration and moves to next loop cycle.",
      "pass is a syntactic placeholder that performs zero operation.",
      "pass prevents IndentationError in empty class/method definitions."
    ],
    "code_snippet": {
      "language": "python",
      "code": "def future_feature():\n    pass # Syntactically valid empty function\n\nfor i in range(5):\n    if i == 2: continue # Skips 2\n    if i == 4: break    # Halts loop at 4\n    print(i)            # Prints 0, 1, 3"
    },
    "pro_tip": "Notice the difference between `pass` and `continue`: `pass` lets execution continue down the rest of the current block, while `continue` immediately jumps to the next loop iteration.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Cognizant"
    ],
    "frequency": "MEDIUM",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 9
  },
  {
    "id": "int-python-010",
    "topic_id": "topic-python",
    "title": "What is PEP 8 and why is it important in Python development?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "PEP 8 (Python Enhancement Proposal 8) is the official Style Guide for Python Code authored by Guido van Rossum, Barry Warsaw, and Nick Coghlan in 2001.\n\nKey Recommendations:\n1. Indentation: 4 spaces per indentation level (never tabs).\n2. Line Length: Maximum 79 characters for code lines, 72 for docstrings.\n3. Naming Conventions:\n   \u2022 Functions & Variables: `snake_case` (e.g., `calculate_tax`).\n   \u2022 Classes: `PascalCase` / `CapWords` (e.g., `StudentRecord`).\n   \u2022 Constants: `UPPER_CASE_WITH_UNDERSCORES` (e.g., `MAX_RETRIES`).\n   \u2022 Private members: Leading underscore (e.g., `_internal_cache`).\n4. Imports: Grouped at the top of the file in order: Standard library, third-party libraries, local application imports.\n\nImportance: Guarantees consistency, professional readability, and maintainability across open-source and enterprise codebases.",
    "bullet_points": [
      "Official Python style guide for formatting and conventions.",
      "4 spaces for indentation (no tabs); max line length 79 characters.",
      "snake_case for functions/vars, PascalCase for classes, UPPER_CASE for constants.",
      "Tools like flake8, black, and ruff enforce PEP 8 automatically."
    ],
    "code_snippet": null,
    "pro_tip": "Mention modern formatting tools like `Black` or `Ruff`\u2014interviewers love candidates who automate PEP 8 compliance in CI/CD pipelines.",
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 10
  },
  {
    "id": "int-python-011",
    "topic_id": "topic-python",
    "title": "What are Truthy and Falsy values in Python?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "In Python, any object can be tested for truth value inside conditional statements (`if`, `while`). Objects that evaluate to boolean `False` in a boolean context are called Falsy; all other values are called Truthy.\n\nStandard Falsy Values in Python:\n1. Constants: `None`, `False`\n2. Numerical Zeros: `0`, `0.0`, `0j`, `Decimal(0)`, `Fraction(0, 1)`\n3. Empty Sequences & Collections: `\"\"` (empty string), `[]` (empty list), `()` (empty tuple), `{}` (empty dict), `set()` (empty set), `range(0)`\n4. Custom Objects whose `__bool__()` or `__len__()` method returns `False` or `0`.\n\nEverything else in Python is Truthy (including non-empty strings `\"False\"`, non-empty lists `[0]`, negative numbers `-1`).",
    "bullet_points": [
      "Falsy: None, False, 0, 0.0, empty collections ([], (), {}, '', set()).",
      "Truthy: any non-zero number, non-empty collection (even [0] or 'False').",
      "Pythonic check: use if not my_list: instead of if len(my_list) == 0:."
    ],
    "code_snippet": {
      "language": "python",
      "code": "items = []\n# Pythonic: leverages falsy evaluation of empty list\nif not items:\n    print(\"List is empty!\")"
    },
    "pro_tip": "Trap: `\"False\"` (a string containing the word 'False') is TRUTHY because it is a non-empty string!",
    "company_tags": [
      "TCS",
      "Accenture",
      "Infosys"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 11
  },
  {
    "id": "int-python-012",
    "topic_id": "topic-python",
    "title": "What is the difference between 'append()' and 'extend()' methods on Python lists?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Both methods add elements to an existing list in-place, but differ in how they handle iterables:\n\n\u2022 append(item):\n- Adds its argument as a SINGLE element to the end of the list.\n- If you pass an iterable (like another list `[4, 5]`), `append` nests that entire list as a single sublist element, increasing `len(list)` by 1.\n\n\u2022 extend(iterable):\n- Iterates through the given iterable and appends each element INDIVIDUALLY to the end of the list.\n- Flattens the elements into the main list, increasing `len(list)` by `len(iterable)`.",
    "bullet_points": [
      "append adds the argument as a single element (nests lists).",
      "extend unpacks the iterable and appends each element individually.",
      "lst.append([1, 2]) results in [..., [1, 2]]; lst.extend([1, 2]) results in [..., 1, 2]."
    ],
    "code_snippet": {
      "language": "python",
      "code": "a = [1, 2]\na.append([3, 4])\nprint(a) # [1, 2, [3, 4]] (length is 3)\n\nb = [1, 2]\nb.extend([3, 4])\nprint(b) # [1, 2, 3, 4] (length is 4)"
    },
    "pro_tip": "The `+=` operator on lists behaves identically to `extend()`, not `append()` (`b += [3, 4]` unpacks elements).",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 12
  },
  {
    "id": "int-python-013",
    "topic_id": "topic-python",
    "title": "What is the difference between 'del', 'remove()', and 'pop()' on Python lists?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "All three delete elements from a list, but operate on different criteria:\n\n1. remove(val):\n\u2022 Searches for the FIRST occurrence of the specified VALUE and removes it.\n\u2022 Does not return any value (returns `None`).\n\u2022 Throws a `ValueError` if `val` is not found in the list.\n\n2. pop([index]):\n\u2022 Removes and RETURNS the element at the specified INDEX.\n\u2022 If no index is provided, defaults to `index = -1` (removes and returns the last element in O(1) time, matching stack pop).\n\u2022 Throws `IndexError` if index is out of bounds.\n\n3. del statement (`del lst[index]` or `del lst[slice]`):\n\u2022 Python language statement that deletes an element or slice of elements by INDEX.\n\u2022 Can also delete the entire variable name from scope (`del lst`).",
    "bullet_points": [
      "remove(val): removes by value (first occurrence); raises ValueError if missing.",
      "pop(i): removes and returns element by index (defaults to last element -1).",
      "del statement: removes by index or slice; does not return anything."
    ],
    "code_snippet": {
      "language": "python",
      "code": "lst = [10, 20, 30, 20]\nlst.remove(20) # Removes first 20 -> [10, 30, 20]\nval = lst.pop() # Removes & returns last item (20) -> [10, 30]\ndel lst[0]      # Deletes item at index 0 -> [30]"
    },
    "pro_tip": "When implementing a Stack in Python using a list, `pop()` without arguments operates in O(1) amortized time.",
    "company_tags": [
      "TCS",
      "Cognizant",
      "Infosys"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 13
  },
  {
    "id": "int-python-014",
    "topic_id": "topic-python",
    "title": "What is the difference between List Comprehension and Generator Expressions in Python?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Both provide concise syntax for creating collections from iterables, but differ fundamentally in memory allocation and execution timing:\n\n\u2022 List Comprehension (`[x for x in iterable]`):\n- Eager Evaluation: Evaluates all elements immediately and constructs the ENTIRE list in RAM.\n- Memory: Consumes memory proportional to the number of elements (O(N) space).\n- Indexing: Supports indexing, slicing, and len().\n\n\u2022 Generator Expression (`(x for x in iterable)`):\n- Lazy Evaluation: Does NOT create a collection in memory. Yields one item at a time on-demand as requested via `next()` or a loop.\n- Memory: Consumes O(1) constant memory regardless of whether processing 10 items or 10 billion items.\n- Iteration: Can only be traversed ONCE; does not support indexing or `len()`.\n\nBest Practice: Use generator expressions when streaming large datasets or feeding aggregators like `sum()`, `max()`, `min()`.",
    "bullet_points": [
      "List comprehension is eagerly evaluated; stores entire list in memory (brackets []).",
      "Generator expression is lazily evaluated; yields items on-demand in O(1) memory (parentheses ()).",
      "Generators can only be iterated once; lists persist in memory.",
      "Use generators for large datasets to prevent Out Of Memory crashes."
    ],
    "code_snippet": {
      "language": "python",
      "code": "# List: creates 10 million ints in RAM immediately (~80MB memory)\nlist_comp = [x * 2 for x in range(10_000_000)]\n\n# Generator: creates generator object, 0 items computed upfront (~120 bytes)\ngen_expr = (x * 2 for x in range(10_000_000))\nprint(sum(gen_expr)) # Computes lazily one-by-one!"
    },
    "pro_tip": "Highlight memory savings: `sum(x for x in range(1000000))` consumes 0 extra RAM, whereas `sum([x for x in range(1000000)])` wastes megabytes of memory.",
    "company_tags": [
      "Amazon",
      "Google",
      "Microsoft",
      "Meta"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 14
  },
  {
    "id": "int-python-015",
    "topic_id": "topic-python",
    "title": "Explain '*args' and '**kwargs' in Python function definitions.",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "`*args` and `**kwargs` allow functions to accept an arbitrary, dynamic number of arguments:\n\n\u2022 `*args` (Non-Keyword Arguments):\n- The asterisk `*` operator packs any extra positional arguments into a TUPLE named `args`.\n- Allows passing variable number of positional values (`func(1, 2, 3)`).\n\n\u2022 `**kwargs` (Keyword Arguments):\n- The double asterisk `**` packs any extra named keyword arguments into a DICTIONARY named `kwargs`.\n- Keys are string argument names, values are the argument values (`func(a=1, b=2)`).\n\nUnpacking in Calls: The inverse is also true: prefixing an iterable with `*` unpacks it into positional parameters; prefixing a dictionary with `**` unpacks it into keyword parameters.\n\nParameter Order: Strict order in function definition is: `def func(standard, *args, kw_only, **kwargs):`.",
    "bullet_points": [
      "*args packs extra positional arguments into a tuple.",
      "**kwargs packs extra keyword arguments into a dictionary.",
      "* and ** can also unpack collections when calling functions.",
      "The names 'args' and 'kwargs' are convention; the * and ** operators do the work."
    ],
    "code_snippet": {
      "language": "python",
      "code": "def master_log(*args, **kwargs):\n    print(\"Positional:\", args) # Tuple\n    print(\"Keywords:\", kwargs) # Dictionary\n\nmaster_log(1, 2, status=\"SUCCESS\", code=200)"
    },
    "pro_tip": "In decorator design or subclassing, `def wrapper(*args, **kwargs):` is the standard boilerplate to accept any arbitrary signature without modification.",
    "company_tags": [
      "Google",
      "Amazon",
      "Uber",
      "TCS"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 15
  },
  {
    "id": "int-python-016",
    "topic_id": "topic-python",
    "title": "What is the difference between Shallow Copy and Deep Copy in Python ('copy' module)?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "In Python, assignment (`b = a`) only creates a new reference pointing to the existing object in memory. To create actual duplicates, Python provides the `copy` module:\n\n\u2022 Shallow Copy (`copy.copy(obj)` or `obj.copy()` or `obj[:]`):\n- Constructs a new outer container object.\n- But populates it with REFERENCES to the identical child objects contained in the original collection.\n- If the collection contains nested mutable objects (e.g., list of lists), modifying a nested list in the copy WILL MUTATE the original!\n\n\u2022 Deep Copy (`copy.deepcopy(obj)`):\n- Recursively constructs a new outer container AND brand new copies of every nested child object found within it.\n- The copy is 100% independent. Modifying any nested element in the copy has zero effect on the original.",
    "bullet_points": [
      "Assignment (b = a) copies reference only; no duplicate created.",
      "copy.copy() creates new outer container but references same nested objects.",
      "copy.deepcopy() recursively clones outer container and all nested child objects.",
      "Always use deepcopy when manipulating nested mutable structures."
    ],
    "code_snippet": {
      "language": "python",
      "code": "import copy\n\norig = [[1, 2], [3, 4]]\nshallow = copy.copy(orig)\ndeep = copy.deepcopy(orig)\n\nshallow[0][0] = 99\nprint(orig[0][0]) # 99! (Shallow copy mutated original)\n\ndeep[0][0] = 42\nprint(orig[0][0]) # 99 (Deep copy is completely isolated)"
    },
    "pro_tip": "Always demonstrate with nested lists `[[1, 2], [3, 4]]`. That immediately proves you understand why shallow copy fails on nested references.",
    "company_tags": [
      "Microsoft",
      "Amazon",
      "Adobe",
      "Goldman Sachs"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 16
  },
  {
    "id": "int-python-017",
    "topic_id": "topic-python",
    "title": "What are Generators and the 'yield' statement in Python? How do they differ from normal functions?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "A Generator is a special type of function that returns an iterator object, yielding a sequence of values lazily on-demand.\n\n\u2022 The `yield` Statement:\nUnlike `return`, which terminates the function and destroys its local stack frame, `yield` pauses the function execution, saves its entire execution state (all local variables and instruction pointer), and yields a value back to the caller.\n\n\u2022 Resuming Execution:\nWhen the caller invokes `next(gen)`, execution resumes immediately following the `yield` statement with all local variables intact.\n\nAdvantages:\n1. Zero Memory Overhead: Streams huge datasets (gigabytes of log files, infinite sequences) without loading everything into RAM.\n2. State Preservation: Eliminates the need to build custom classes with complex `__iter__()` and `__next__()` boilerplate.",
    "bullet_points": [
      "yield pauses execution and preserves function state; return terminates function.",
      "Generators implement iterator protocol (__iter__ and __next__) automatically.",
      "Enables streaming massive files or infinite series in O(1) memory.",
      "Can only be iterated through once."
    ],
    "code_snippet": {
      "language": "python",
      "code": "def fibonacci(limit):\n    a, b = 0, 1\n    while a < limit:\n        yield a\n        a, b = b, a + b\n\nfor num in fibonacci(50):\n    print(num, end=\" \")"
    },
    "pro_tip": "When asked for a real-world scenario, explain reading a 50GB CSV file line-by-line using a generator: `for line in file: yield parse(line)`.",
    "company_tags": [
      "Google",
      "Amazon",
      "Netflix",
      "Spotify"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 17
  },
  {
    "id": "int-python-018",
    "topic_id": "topic-python",
    "title": "What is a Context Manager and how does the 'with' statement prevent resource leaks?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "A Context Manager is a Python design pattern that guarantees deterministic resource allocation and cleanup (opening files, acquiring database connections, acquiring thread locks), even if exceptions occur.\n\nHow the 'with' statement works (Context Management Protocol):\n1. `__enter__()`: Executed before entering the code block. Acquires the resource and returns it (assigned to the `as variable`).\n2. `__exit__(exc_type, exc_val, exc_tb)`: Guaranteed to execute upon exiting the block, whether exiting normally or via an unhandled exception. Releases the resource (closes file, frees connection).\n\nCreating Custom Context Managers:\n\u2022 Class-based: Implement `__enter__` and `__exit__` methods.\n\u2022 Generator-based: Use the `@contextlib.contextmanager` decorator with `yield`.",
    "bullet_points": [
      "Guarantees resource cleanup even if exceptions are thrown.",
      "Relies on __enter__() and __exit__() dunder methods.",
      "Replaces verbose try-finally resource cleanup blocks.",
      "Can be implemented easily using @contextlib.contextmanager."
    ],
    "code_snippet": {
      "language": "python",
      "code": "# Context manager ensures file is closed immediately when block exits\nwith open(\"data.txt\", \"r\") as f:\n    data = f.read()\n# Even if an error happens in reading, f.close() is guaranteed to execute!"
    },
    "pro_tip": "Explain the `exc_type` parameter in `__exit__`: If `__exit__` returns `True`, it suppresses the exception from propagating to the outer caller.",
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 18
  },
  {
    "id": "int-python-019",
    "topic_id": "topic-python",
    "title": "What is the difference between '__str__' and '__repr__' in Python?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Both are dunder (magic) methods that return a string representation of an object, but target different audiences:\n\n\u2022 `__repr__()` (Representation):\n- Goal: Unambiguous, technical representation for DEVELOPERS and debugging.\n- Output should ideally look like valid Python code that could recreate the object (`eval(repr(obj)) == obj`).\n- Used when inspecting objects in the interactive Python REPL, logging, and in collections (`print([obj])`).\n\n\u2022 `__str__()` (String):\n- Goal: Readable, informal, user-friendly representation for END USERS.\n- Used by `print(obj)` and `str(obj)`.\n\nFallback Rule: If `__str__()` is not defined, Python falls back to `__repr__()`. If neither is defined, it defaults to the ugly `<ClassName object at 0x...>`.",
    "bullet_points": [
      "__repr__ is for developers/debugging (precise, ideally executable code).",
      "__str__ is for end-users (readable, pretty-printed).",
      "If __str__ is missing, Python falls back to __repr__ automatically.",
      "Rule of thumb: Always implement at least __repr__ in your classes."
    ],
    "code_snippet": {
      "language": "python",
      "code": "class Point:\n    def __init__(self, x, y): self.x, self.y = x, y\n    def __repr__(self): return f\"Point({self.x}, {self.y})\" # For developers\n    def __str__(self):  return f\"({self.x}, {self.y})\"       # For users\n\np = Point(3, 4)\nprint(str(p))  # \"(3, 4)\"\nprint(repr(p)) # \"Point(3, 4)\""
    },
    "pro_tip": "Always implement `__repr__` first! If you only implement `__repr__`, it serves as both `__repr__` and `__str__`.",
    "company_tags": [
      "Google",
      "Microsoft",
      "Amazon"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 19
  },
  {
    "id": "int-python-020",
    "topic_id": "topic-python",
    "title": "What does 'if __name__ == \"__main__\":' mean in Python scripts?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Every Python module has a built-in special variable named `__name__` set by the Python runtime:\n\n1. Direct Execution: If the file is executed directly from the terminal (`python my_script.py`), Python assigns the string `\"__main__\"` to `__name__`.\n2. Imported Module: If the file is imported into another script (`import my_script`), Python assigns the module's actual filename/module name (e.g., `\"my_script\"`) to `__name__`.\n\nPurpose:\nThe check `if __name__ == \"__main__\":` allows a file to act as BOTH a reusable library module and a standalone executable script:\n\u2022 Functions, classes, and definitions can be imported by other files without running the test/script execution code.\n\u2022 The standalone execution code inside the block only runs when executed directly.",
    "bullet_points": [
      "__name__ is set to '__main__' when the file is run directly.",
      "__name__ is set to module name when imported into another file.",
      "Prevents script execution code from running when imported as a library.",
      "Enables modular code architecture and standalone unit testing."
    ],
    "code_snippet": {
      "language": "python",
      "code": "def calculate_tax(income):\n    return income * 0.2\n\nif __name__ == \"__main__\":\n    # Only runs when directly executed, NOT when imported!\n    print(\"Test tax:\", calculate_tax(50000))"
    },
    "pro_tip": "This is standard Python boilerplate. Mentioning that it prevents side effects upon importing is the textbook answer.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Amazon",
      "Wipro"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 20
  },
  {
    "id": "int-python-021",
    "topic_id": "topic-python",
    "title": "How do Lambda Functions work in Python and what are their architectural limitations?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "A lambda function is a small, anonymous function defined with the `lambda` keyword on a single line without using `def`.\n\nSyntax: `lambda arguments: expression`\n\nCharacteristics:\n\u2022 Automatically returns the evaluated expression without an explicit `return` keyword.\n\u2022 Commonly used for short, throwaway callback functions passed into higher-order functions like `sorted()`, `map()`, and `filter()`.\n\nArchitectural Limitations:\n1. Single Expression Only: Cannot contain multiple statements, assignments (`x = 5`), loops (`for`, `while`), or `try-except` blocks.\n2. No Docstrings or Annotations: Cannot have docstrings or type hints, harming maintainability.\n3. Hard to Debug: Tracebacks simply display `<lambda>` instead of an identifiable function name.\n\nGuideline: If logic requires more than one simple expression, always use a standard `def` function.",
    "bullet_points": [
      "Anonymous single-line function: lambda x, y: x + y.",
      "Implicit return; cannot contain statements, loops, or try-except blocks.",
      "Best used as quick inline callbacks for sorted(), map(), filter().",
      "Tracebacks display '<lambda>', making complex lambdas difficult to debug."
    ],
    "code_snippet": {
      "language": "python",
      "code": "students = [(\"Alice\", 85), (\"Bob\", 92), (\"Charlie\", 78)]\n# Sort by score (2nd tuple item)\nstudents.sort(key=lambda s: s[1], reverse=True)"
    },
    "pro_tip": "PEP 8 discourages binding lambdas to names (`square = lambda x: x*x`). If you are giving it a name, always use `def square(x): return x*x`!",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "TCS"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 21
  },
  {
    "id": "int-python-022",
    "topic_id": "topic-python",
    "title": "Explain Exception Handling in Python: try, except, else, and finally.",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Python provides a 4-part exception handling block:\n\n1. try: Encloses code that might raise an exception.\n2. except ExceptionType as e: Catches and handles specific exception types if raised in the `try` block. Can have multiple `except` branches.\n3. else: Executes ONLY IF the `try` block ran successfully WITHOUT raising any exceptions! (Great for code that should only run if no error occurred, keeping `try` blocks clean and minimal).\n4. finally: ALWAYS executes before exiting the block, whether an exception occurred, was handled, or a return statement was hit. Used for cleanup actions (closing files, releasing locks).",
    "bullet_points": [
      "try: monitors for exceptions.",
      "except: handles specific exception classes.",
      "else: runs ONLY if NO exceptions occurred in try block.",
      "finally: ALWAYS runs regardless of exceptions or returns."
    ],
    "code_snippet": {
      "language": "python",
      "code": "try:\n    f = open(\"data.txt\", \"r\")\nexcept FileNotFoundError:\n    print(\"File missing!\")\nelse:\n    print(\"File read successfully:\", f.read())\nfinally:\n    print(\"Cleanup operations run here.\")"
    },
    "pro_tip": "The `else` clause in try-except is unique to Python and underutilized. Explain that using `else` prevents accidentally catching exceptions raised by follow-up code that wasn't intended to be protected.",
    "company_tags": [
      "Microsoft",
      "Amazon",
      "Google"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 22
  },
  {
    "id": "int-python-023",
    "topic_id": "topic-python",
    "title": "What is the difference between 'map()', 'filter()', and 'reduce()' in Python?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "These are fundamental functional programming higher-order functions in Python:\n\n1. map(func, iterable):\n\u2022 Applies `func` to every element in `iterable`.\n\u2022 Returns an iterator yielding transformed items.\n\u2022 Equivalent to: `[func(x) for x in iterable]`.\n\n2. filter(predicate, iterable):\n\u2022 Evaluates `predicate(x)` for each item in `iterable`.\n\u2022 Returns an iterator yielding only items where predicate returns `True`.\n\u2022 Equivalent to: `[x for x in iterable if predicate(x)]`.\n\n3. reduce(func, iterable[, initializer]):\n\u2022 Resides in the `functools` module (`from functools import reduce`).\n\u2022 Cumulatively applies a 2-argument function to sequence elements, reducing the entire sequence to a SINGLE aggregated scalar value (e.g., product, sum).",
    "bullet_points": [
      "map transforms elements 1-to-1.",
      "filter selects elements matching a boolean predicate.",
      "reduce (in functools) aggregates a sequence into a single cumulative value.",
      "In modern Python, list comprehensions are generally preferred over map/filter for readability."
    ],
    "code_snippet": {
      "language": "python",
      "code": "from functools import reduce\n\nnums = [1, 2, 3, 4]\nsquares = list(map(lambda x: x**2, nums))     # [1, 4, 9, 16]\nevens   = list(filter(lambda x: x % 2 == 0, nums)) # [2, 4]\nproduct = reduce(lambda a, b: a * b, nums)         # 24"
    },
    "pro_tip": "Guido van Rossum famously preferred list comprehensions over `map` and `filter` because `[x**2 for x in nums]` is clearer and avoids lambda boilerplate.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "TCS"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 23
  },
  {
    "id": "int-python-024",
    "topic_id": "topic-python",
    "title": "What are Dictionary Comprehension and Set Comprehension in Python?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Similar to list comprehensions, Python supports concise syntax for constructing dictionaries and sets:\n\n1. Dictionary Comprehension:\n\u2022 Syntax: `{key_expr: value_expr for item in iterable if condition}`\n\u2022 Constructs a new dictionary in a single line.\n\u2022 Use Case: Inverting a dictionary (swapping keys and values), filtering dictionaries, mapping transformations.\n\n2. Set Comprehension:\n\u2022 Syntax: `{expr for item in iterable if condition}`\n\u2022 Constructs a set, automatically deduplicating elements and computing in O(1) hash table space.\n\u2022 Distinct from dictionary comprehension because it has no colon `:` separating keys and values.",
    "bullet_points": [
      "Dict comprehension: {k: v for item in iterable}.",
      "Set comprehension: {v for item in iterable}.",
      "Inverting dict: {v: k for k, v in original.items()}.",
      "Both provide cleaner and faster construction than manual loops."
    ],
    "code_snippet": {
      "language": "python",
      "code": "# Dict comprehension: square mapping\nsq_dict = {x: x**2 for x in range(5)} # {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}\n\n# Invert dictionary\nports = {\"http\": 80, \"https\": 443}\ninverted = {port: protocol for protocol, port in ports.items()}\n\n# Set comprehension\nunique_lengths = {len(w) for w in [\"apple\", \"cat\", \"banana\", \"dog\"]}"
    },
    "pro_tip": "Dictionary and set comprehensions are compiled into dedicated bytecode loops, executing faster than repetitive `.append()` or `dict[k] = v` assignments in Python.",
    "company_tags": [
      "Google",
      "Amazon",
      "Adobe"
    ],
    "frequency": "MEDIUM",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 24
  },
  {
    "id": "int-python-025",
    "topic_id": "topic-python",
    "title": "What is the difference between 'sort()' and 'sorted()' in Python?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "While both sort elements using the Timsort algorithm (O(N log N) hybrid mergesort/insertionsort), they differ in mutability and applicability:\n\n1. `list.sort(key=None, reverse=False)`:\n\u2022 In-place method that mutates the original list directly.\n\u2022 Returns `None` (does not return a new list).\n\u2022 Only works on `list` objects (cannot be called on tuples, dicts, strings).\n\u2022 More memory-efficient because no duplicate list is allocated.\n\n2. `sorted(iterable, key=None, reverse=False)`:\n\u2022 Built-in function that takes ANY iterable (tuples, dictionaries, strings, sets, generators).\n\u2022 Leaves the original iterable UNMODIFIED.\n\u2022 Always constructs and returns a BRAND NEW sorted `list`.\n\u2022 Consumes O(N) additional memory for the new list.",
    "bullet_points": [
      "list.sort() sorts in-place, returns None, only works on lists.",
      "sorted(iterable) returns a new sorted list, leaves original untouched, works on any iterable.",
      "Both use Timsort (O(N log N) worst and average case, O(N) best case).",
      "Both accept key=lambda and reverse=True parameters."
    ],
    "code_snippet": {
      "language": "python",
      "code": "nums = [3, 1, 4, 2]\nnew_nums = sorted(nums) # nums remains [3, 1, 4, 2]; new_nums is [1, 2, 3, 4]\n\nnums.sort()             # nums is now [1, 2, 3, 4] in-place\nprint(nums.sort())      # Prints: None (common beginner mistake!)"
    },
    "pro_tip": "Common beginner trap: Writing `nums = nums.sort()`. Because `sort()` returns `None`, `nums` becomes `None`!",
    "company_tags": [
      "TCS",
      "Infosys",
      "Amazon",
      "Microsoft"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 25
  },
  {
    "id": "int-python-026",
    "topic_id": "topic-python",
    "title": "How does 'zip()' work in Python and how do you handle unequal sequence lengths?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "`zip(*iterables)` aggregates elements from each of the provided iterables into an iterator of tuples:\n\n\u2022 Pairing: The i-th tuple contains the i-th element from each argument iterable.\n\u2022 Lazy Evaluation: Returns an iterator in Python 3; elements are generated on-demand.\n\nHandling Unequal Sequence Lengths:\n1. Default `zip()` Behavior (Shortest Length):\n\u2022 Stops iterating as soon as the SHORTEST input iterable is exhausted. Any trailing elements in longer iterables are silently ignored.\n\n2. `itertools.zip_longest(*iterables, fillvalue=None)`:\n\u2022 Continues iterating until the LONGEST iterable is exhausted.\n\u2022 Missing values from shorter iterables are automatically populated with `fillvalue` (defaults to `None`).\n\n3. Strict Mode (Python 3.10+):\n\u2022 `zip(a, b, strict=True)` raises a `ValueError` if the iterables have unequal lengths.",
    "bullet_points": [
      "zip pairs corresponding elements from multiple iterables into tuples.",
      "Default zip stops at the shortest iterable (truncating longer ones).",
      "itertools.zip_longest pads shorter iterables with fillvalue.",
      "Python 3.10 added strict=True to raise ValueError on length mismatches."
    ],
    "code_snippet": {
      "language": "python",
      "code": "names = [\"Alice\", \"Bob\", \"Charlie\"]\nscores = [90, 85] # Shorter\n\nprint(list(zip(names, scores))) \n# [('Alice', 90), ('Bob', 85)] (Charlie is truncated)\n\nfrom itertools import zip_longest\nprint(list(zip_longest(names, scores, fillvalue=0)))\n# [('Alice', 90), ('Bob', 85), ('Charlie', 0)]"
    },
    "pro_tip": "Demonstrate modern Python 3.10 knowledge by mentioning `zip(a, b, strict=True)` to prevent silent truncation bugs.",
    "company_tags": [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 26
  },
  {
    "id": "int-python-027",
    "topic_id": "topic-python",
    "title": "Explain the difference between '@staticmethod' and '@classmethod' in Python.",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Both decorators define methods that can be called without instantiating an object (`ClassName.method()`), but differ in binding:\n\n1. `@classmethod`:\n\u2022 Receives the CLASS OBJECT itself (`cls`) as its implicit first argument, NOT an instance.\n\u2022 Can access and modify class-level state (class variables) and call other class methods.\n\u2022 Primary Use Case: Alternative constructors / factory methods (e.g., `Date.from_string(\"2026-09-14\")`).\n\u2022 Respects inheritance: If invoked on a subclass, `cls` binds to the subclass.\n\n2. `@staticmethod`:\n\u2022 Receives NO implicit first argument (neither `self` nor `cls`).\n\u2022 Cannot access or modify class state or instance state.\n\u2022 Acts like a plain utility/helper function that logically belongs inside the class namespace for organization.\n\u2022 Has no awareness of inheritance hierarchies.",
    "bullet_points": [
      "@classmethod receives 'cls' (the class object); can access class state.",
      "@staticmethod receives no implicit first argument; acts like a plain function in class namespace.",
      "@classmethod is standard for factory methods and alternative constructors.",
      "Both can be called on ClassName or instance."
    ],
    "code_snippet": {
      "language": "python",
      "code": "class Employee:\n    raise_amount = 1.05\n\n    def __init__(self, name, salary):\n        self.name, self.salary = name, salary\n\n    @classmethod\n    def from_string(cls, emp_str): # Factory method\n        name, salary = emp_str.split('-')\n        return cls(name, float(salary))\n\n    @staticmethod\n    def is_workday(day): # Independent utility\n        return day.weekday() < 5"
    },
    "pro_tip": "Always point out alternative constructors as the primary real-world use case for `@classmethod`.",
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 27
  },
  {
    "id": "int-python-028",
    "topic_id": "topic-python",
    "title": "What are Python Dunder (Magic) Methods and how do they enable Operator Overloading?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Dunder (Double Underscore) or Magic Methods are special methods in Python with names prefixed and suffixed by double underscores (e.g., `__init__`, `__str__`, `__len__`).\n\nThey allow custom user-defined classes to hook into Python's built-in syntax, protocols, and operators:\n\nKey Protocols & Examples:\n1. Operator Overloading:\n   \u2022 `+` operator calls `__add__(self, other)`\n   \u2022 `==` operator calls `__eq__(self, other)`\n   \u2022 `<` operator calls `__lt__(self, other)`\n2. Container Protocol:\n   \u2022 `len(obj)` calls `__len__(self)`\n   \u2022 `obj[key]` calls `__getitem__(self, key)`\n   \u2022 `obj[key] = val` calls `__setitem__(self, key, val)`\n   \u2022 `item in obj` calls `__contains__(self, item)`\n3. Iteration Protocol:\n   \u2022 `for x in obj:` calls `__iter__(self)` and `__next__(self)`\n4. Callable Objects:\n   \u2022 `obj()` calls `__call__(self)`.",
    "bullet_points": [
      "Dunder methods enable user-defined classes to support built-in operators and protocols.",
      "__add__ for +, __eq__ for ==, __len__ for len(), __getitem__ for indexing [].",
      "__iter__ and __next__ enable the iterator protocol for for-loops.",
      "__call__ allows class instances to be called like functions."
    ],
    "code_snippet": {
      "language": "python",
      "code": "class Vector:\n    def __init__(self, x, y): self.x, self.y = x, y\n    def __add__(self, other): # Overloads '+' operator\n        return Vector(self.x + other.x, self.y + other.y)\n    def __repr__(self): return f\"Vector({self.x}, {self.y})\"\n\nv1 = Vector(1, 2)\nv2 = Vector(3, 4)\nprint(v1 + v2) # Vector(4, 6)"
    },
    "pro_tip": "Mention that Python's clean operator syntax (`len()`, `[]`, `+`) is entirely powered by dunder method lookups on the class type.",
    "company_tags": [
      "Google",
      "Amazon",
      "Adobe"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 28
  },
  {
    "id": "int-python-029",
    "topic_id": "topic-python",
    "title": "What is Duck Typing and the EAFP ('Easier to Ask for Forgiveness than Permission') philosophy in Python?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "\u2022 Duck Typing:\nDerived from the phrase: 'If it walks like a duck and quacks like a duck, it's a duck.'\nIn Python, an object's suitability is determined by the presence of specific methods and properties, rather than its explicit class inheritance hierarchy. If an object implements `.read()`, Python treats it as a file-like object regardless of whether it inherits from `io.IOBase`.\n\n\u2022 EAFP vs LBYL:\n1. LBYL (Look Before You Leap):\nChecking conditions, types, or keys before performing an action (`if \"key\" in dict: return dict[\"key\"]`). Requires two lookups (one for check, one for access) and creates race conditions in concurrent code.\n\n2. EAFP (Easier to Ask for Forgiveness than Permission - Pythonic Standard):\nAssume the key/attribute exists and attempt the operation directly. If it fails, catch the resulting exception (`try: return dict[\"key\"] except KeyError: ...`). Faster in the happy path and atomic.",
    "bullet_points": [
      "Duck Typing: types are judged by their behavior (methods), not inheritance tree.",
      "EAFP: Try the operation directly; catch exception if it fails.",
      "LBYL: Look Before You Leap (check if key in dict first).",
      "EAFP is faster for common success paths and avoids race conditions."
    ],
    "code_snippet": {
      "language": "python",
      "code": "# Pythonic EAFP pattern:\ndef safe_access(d, key):\n    try:\n        return d[key] # Directly access (fast)\n    except KeyError:\n        return None   # Ask for forgiveness"
    },
    "pro_tip": "EAFP is considered the quintessential Python philosophy. Contrasting it with Java/C++'s LBYL approach shows deep language maturity.",
    "company_tags": [
      "Google",
      "Meta",
      "Amazon"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 29
  },
  {
    "id": "int-python-030",
    "topic_id": "topic-python",
    "title": "How do Sets work internally in Python and why can't Lists or Dictionaries be added to a Set?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "In Python, a `set` is implemented as an optimized Hash Table containing only keys (without values).\n\nInternal Mechanism:\n\u2022 When an element is added to a set, Python computes its `hash(element)`.\n\u2022 The hash determines the bucket index in the internal table for O(1) average lookup and insertion.\n\nWhy Lists or Dictionaries CANNOT be added to a Set:\n\u2022 To be placed in a hash table, an object MUST be 'Hashable'.\n\u2022 An object is hashable if it has an immutable hash value that NEVER changes during its lifetime (implements `__hash__()` and `__eq__()`).\n\u2022 Lists and dictionaries are MUTABLE. If a list were placed in a set, modifying that list later would change its hash value, stranding it in the wrong bucket and breaking hash table invariants.\n\u2022 Attempting to add a list to a set raises a `TypeError: unhashable type: 'list'`.\n\nSolution: Use immutable equivalents like `tuple` or `frozenset`.",
    "bullet_points": [
      "Sets are hash tables containing only keys, giving O(1) average membership tests.",
      "Set elements must be Hashable (immutable, persistent hash value).",
      "Lists and dicts are mutable, so they lack __hash__ and raise TypeError.",
      "Use tuples or frozensets when storing collections inside a set."
    ],
    "code_snippet": {
      "language": "python",
      "code": "s = set()\n# s.add([1, 2]) # TypeError: unhashable type: 'list'\ns.add((1, 2))    # 100% Valid: tuples are immutable and hashable!"
    },
    "pro_tip": "Remember: Custom classes are hashable by default (using their object memory address `id()`), unless they override `__eq__` without also defining `__hash__`.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 30
  },
  {
    "id": "int-python-031",
    "topic_id": "topic-python",
    "title": "What is the 'collections' module in Python? Explain Counter, defaultdict, and deque.",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "The `collections` module provides specialized, high-performance container alternatives to Python's general built-in dict, list, and tuple:\n\n1. Counter:\n\u2022 A dict subclass for counting hashable items.\n\u2022 Elements are stored as keys and their counts are stored as values.\n\u2022 Features `most_common(n)` for top-N frequency analysis in O(N log K) time.\n\n2. defaultdict:\n\u2022 A dict subclass that accepts a default factory callable (e.g., `int`, `list`).\n\u2022 When accessing a missing key, it automatically initializes and inserts the key with the default factory's return value instead of raising a `KeyError`.\n\n3. deque (Double-Ended Queue):\n\u2022 Optimized for O(1) append and pop operations from BOTH the left and right ends.\n\u2022 Traditional Python lists take O(N) time for `insert(0, val)` or `pop(0)` due to element shifting. `deque` executes them in O(1) time.",
    "bullet_points": [
      "Counter: frequency counting with most_common(k) method.",
      "defaultdict: auto-initializes missing keys with default values without KeyError.",
      "deque: double-ended queue with O(1) appends and pops at both ends.",
      "deque is vastly superior to list for implementing Queues (FIFO)."
    ],
    "code_snippet": {
      "language": "python",
      "code": "from collections import Counter, defaultdict, deque\n\ncounts = Counter(\"banana\") # Counter({'a': 3, 'n': 2, 'b': 1})\n\ngrouping = defaultdict(list)\ngrouping[\"fruits\"].append(\"apple\") # Auto-creates empty list for 'fruits'!\n\nq = deque([1, 2, 3])\nq.appendleft(0) # O(1) push to front!\nq.popleft()     # O(1) pop from front!"
    },
    "pro_tip": "In coding interviews (LeetCode/DSA), ALWAYS use `collections.deque` instead of `list` for BFS and queue algorithms to avoid O(N) time degradation.",
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 31
  },
  {
    "id": "int-python-032",
    "topic_id": "topic-python",
    "title": "What is 'yield from' in Python generators and how does it delegate to subgenerators?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "The `yield from <iterable>` statement (introduced in Python 3.3) is used to delegate generator iteration to a subgenerator or nested iterable.\n\nKey Advantages:\n1. Eliminates Nested Loops: Replaces verbose boilerplate like `for item in sub_generator: yield item` with a single line `yield from sub_generator`.\n2. Transparent Two-Way Channel: Establishes a transparent bidirectional communication pipe between the caller and the subgenerator:\n   \u2022 Values sent via `.send()` from the caller pass directly into the subgenerator.\n   \u2022 Exceptions thrown via `.throw()` pass directly into the subgenerator.\n   \u2022 Captures the return value of the subgenerator (`result = yield from subgen()`).\n\nThis was the fundamental building block for early Python asynchronous coroutines prior to `async/await`.",
    "bullet_points": [
      "Replaces for item in iterable: yield item with clean single-line delegation.",
      "Establishes a 2-way communication channel between caller and subgenerator.",
      "Passes .send(), .throw(), and .close() transparently to the subgenerator.",
      "Captures the return value of subgenerators."
    ],
    "code_snippet": {
      "language": "python",
      "code": "def sub_sequence():\n    yield 1\n    yield 2\n    return \"Done\"\n\ndef main_generator():\n    yield 0\n    res = yield from sub_sequence() # Delegates seamlessly\n    print(\"Subgenerator returned:\", res)\n    yield 3\n\nprint(list(main_generator())) # [0, 1, 2, 3]"
    },
    "pro_tip": "Showcase knowledge: Explain that `yield from` formed the core foundation of `asyncio` coroutines before native `async`/`await` keywords were introduced in Python 3.5.",
    "company_tags": [
      "Google",
      "Amazon",
      "Netflix"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 32
  },
  {
    "id": "int-python-033",
    "topic_id": "topic-python",
    "title": "How does Python handle Multiple Inheritance and what is the MRO (Method Resolution Order) C3 Linearization?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Python supports multiple inheritance (a class can inherit from multiple parent classes: `class D(B, C):`).\n\nMethod Resolution Order (MRO):\nThe order in which Python searches the class hierarchy to locate a method or attribute. It can be inspected using `ClassName.__mro__` or `ClassName.mro()`.\n\nC3 Linearization Algorithm (Python 2.3+):\nPython uses the C3 Linearization algorithm to compute the MRO, guaranteeing three essential properties:\n1. Children Before Parents: Subclasses are checked before their parent superclasses.\n2. Order Preservation: The declaration order of parent classes in the class header (`class D(B, C)`) is strictly preserved (B is checked before C).\n3. Monotonicity: If class A precedes class B in one class's MRO, it will precede B in all derived MROs.\n\nRole of `super()`: In multiple inheritance, `super()` does NOT necessarily call the immediate parent\u2014it calls the NEXT class in the calculated MRO!",
    "bullet_points": [
      "MRO defines the search order for methods across multiple inheritance trees.",
      "Computed using the C3 Linearization algorithm.",
      "Inspectable via ClassName.mro() or ClassName.__mro__.",
      "super() calls the next class in the MRO, resolving the Diamond Problem cleanly."
    ],
    "code_snippet": {
      "language": "python",
      "code": "class A: pass\nclass B(A): pass\nclass C(A): pass\nclass D(B, C): pass\n\nprint(D.mro())\n# [D, B, C, A, object] -> Diamond problem resolved cleanly without duplicate A!"
    },
    "pro_tip": "Whenever asked about the Diamond Problem in Python, state: 'Python resolves the Diamond Problem automatically using the C3 Linearization algorithm in the MRO.'",
    "company_tags": [
      "Google",
      "Meta",
      "Amazon",
      "Bloomberg"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 33
  },
  {
    "id": "int-python-034",
    "topic_id": "topic-python",
    "title": "What is Monkey Patching in Python, when is it useful, and what are its risks?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Monkey Patching is the dynamic modification of a module, class, or function at RUNTIME without altering the original source code.\n\nHow it works in Python:\nBecause Python classes and modules are mutable dictionaries (`__dict__`), you can reassign an existing method name to point to a new function object at runtime: `MyClass.existing_method = my_custom_function`.\n\nWhen it is Useful:\n1. Unit Testing & Mocking: Patching network calls or slow database connections with mock objects (`unittest.mock.patch`).\n2. Hot Bug Fixing: Patching a third-party library bug at runtime without waiting for upstream package updates.\n3. Runtime Instrumentation: Adding profiling or telemetry hooks to standard library functions (e.g., `gevent` patching sockets for greenlets).\n\nRisks:\n\u2022 Hard to Debug: Changes occur dynamically, making source code misleading.\n\u2022 Upgrade Incompatibility: Library updates can break undocumented patched internals.",
    "bullet_points": [
      "Dynamically modifying classes or modules at runtime.",
      "Enabled by Python's mutable runtime symbol dictionaries.",
      "Standard industry use case: Unit testing mocks and patchers.",
      "Risky in production because it obscures bugs and violates code expectations."
    ],
    "code_snippet": {
      "language": "python",
      "code": "import math\n\n# Original function\nprint(math.sqrt(16)) # 4.0\n\n# Monkey Patch math.sqrt\ndef custom_sqrt(x):\n    return \"Patched!\"\n\nmath.sqrt = custom_sqrt\nprint(math.sqrt(16)) # \"Patched!\""
    },
    "pro_tip": "Always caution against using monkey patching in production application code, reserving it primarily for unit test mocking (`unittest.mock`).",
    "company_tags": [
      "Google",
      "Meta",
      "Spotify"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 34
  },
  {
    "id": "int-python-035",
    "topic_id": "topic-python",
    "title": "The Mutable Default Argument Trap: What happens when you execute 'def append_to(item, target=[]): target.append(item)' in Python?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "This is the #1 most notorious Python interview trap.\n\nWhat Happens:\nWhen you define `def append_to(item, target=[]):`:\n\u2022 Python evaluates default argument expressions ONCE, at the time the FUNCTION IS DEFINED (compiled), NOT every time the function is called!\n\u2022 Therefore, `target` binds to a SINGLE mutable list object in memory created at definition time.\n\u2022 Every subsequent function call that omits `target` will mutate and append to that SAME shared list object across calls!\n\nExecution Trace:\n`append_to(1)` -> returns `[1]`\n`append_to(2)` -> returns `[1, 2]` (NOT `[2]`)!\n\nStandard Pythonic Fix:\nAlways set default argument to `None`, and initialize inside the function body:\n`def append_to(item, target=None):`\n`    if target is None: target = []`",
    "bullet_points": [
      "Default arguments are evaluated once at function definition time, NOT at call time.",
      "Mutable defaults ([], {}) are shared across all calls that omit the argument.",
      "Calls mutate the same persistent object, causing subtle multi-call bugs.",
      "Solution: use None as default: def f(arg=None): if arg is None: arg = []."
    ],
    "code_snippet": {
      "language": "python",
      "code": "# BUGGY TRAP:\ndef add_item(val, items=[]):\n    items.append(val)\n    return items\n\nprint(add_item(1)) # [1]\nprint(add_item(2)) # [1, 2] (Surprise! Reuses same list!)\n\n# CORRECT FIX:\ndef add_item_fixed(val, items=None):\n    if items is None: items = []\n    items.append(val)\n    return items"
    },
    "pro_tip": "Every senior Python developer knows this trap by heart. Explain: 'Default argument values are stored in the function's `__defaults__` tuple attribute on the function object.'",
    "company_tags": [
      "Google",
      "Meta",
      "Amazon",
      "Netflix"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 35
  },
  {
    "id": "int-python-036",
    "topic_id": "topic-python",
    "title": "Late-Binding Closures in Loops: Why does '[lambda: i for i in range(3)]' output '[2, 2, 2]'?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "This tests Python's Late Binding (lexical scoping) behavior in closures.\n\nWhy it happens:\n\u2022 In Python, closures look up variable values when the function is CALLED, NOT when the function is DEFINED.\n\u2022 In the list comprehension `funcs = [lambda: i for i in range(3)]`, all 3 lambda functions capture the variable `i` by reference from the surrounding scope.\n\u2022 When the loop finishes, `i` has reached its final value: `2`.\n\u2022 When you subsequently call the lambdas (`[f() for f in funcs]`), all three look up `i` in the enclosing scope, and find `2`!\n\nHow to Fix It (Default Argument Trick):\nForce early binding by setting `i` as a default argument inside the lambda:\n`funcs = [lambda i=i: i for i in range(3)]`\nBecause default arguments are evaluated at definition time, each lambda captures its own independent copy of `i` (0, 1, and 2).",
    "bullet_points": [
      "Python closures bind variables late: values are looked up at call time, not definition time.",
      "All lambdas in the loop reference the same enclosing variable i, which ends at 2.",
      "Fix using default argument trick: lambda i=i: i (binds current value at definition time).",
      "Or fix using functools.partial(func, i)."
    ],
    "code_snippet": {
      "language": "python",
      "code": "# TRAP:\nfuncs = [lambda: i for i in range(3)]\nprint([f() for f in funcs]) # [2, 2, 2]!\n\n# FIX (Default argument binding):\nfixed_funcs = [lambda i=i: i for i in range(3)]\nprint([f() for f in fixed_funcs]) # [0, 1, 2] (Correct!)"
    },
    "pro_tip": "This trap frequently appears in UI event listeners and asynchronous task dispatches where callbacks created in loops accidentally share the final index value.",
    "company_tags": [
      "Google",
      "Microsoft",
      "Meta",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 36
  },
  {
    "id": "int-python-037",
    "topic_id": "topic-python",
    "title": "What is the Global Interpreter Lock (GIL) in CPython and how does it impact multi-threading?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "The Global Interpreter Lock (GIL) is a mutex (mutual exclusion lock) used by the standard CPython implementation to ensure that only ONE native OS thread can execute Python bytecode at any given moment, even on multi-core CPUs.\n\nWhy the GIL Exists:\nCPython's memory management is NOT thread-safe. CPython uses Reference Counting to track object lifecycles. Without the GIL, concurrent threads modifying reference counts simultaneously would cause race conditions, memory leaks, or premature object deallocations.\n\nImpact on Performance:\n\u2022 CPU-Bound Tasks (number crunching, image processing): Multi-threading DOES NOT speed up Python! In fact, thread context switching and lock contention make multi-threaded CPU tasks SLOWER than single-threaded execution.\n\u2022 I/O-Bound Tasks (network requests, file reading, database queries): Multi-threading IS effective because threads release the GIL while waiting for OS I/O operations to complete.\n\nHow to achieve true multi-core CPU parallelism in Python:\n1. Use `multiprocessing` module (spawns separate processes, each with its own Python interpreter and GIL).\n2. Use C/C++ extensions or libraries like `NumPy` (which release the GIL during heavy numeric computations).\n3. Use alternative Python runtimes without a GIL (e.g., PyPy with STM, or Python 3.13 free-threaded experimental mode).",
    "bullet_points": [
      "CPython mutex preventing multiple threads from executing Python bytecode simultaneously.",
      "Protects CPython's non-thread-safe reference counting memory management.",
      "CPU-bound multi-threading is ineffective; I/O-bound multi-threading works well.",
      "True multi-core parallelism is achieved using the multiprocessing module or NumPy."
    ],
    "code_snippet": null,
    "pro_tip": "Demonstrate cutting-edge knowledge: Mention PEP 703 and Python 3.13's experimental build with free-threading (`--disable-gil`), which makes the GIL optional!",
    "company_tags": [
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Uber"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 37
  },
  {
    "id": "int-python-038",
    "topic_id": "topic-python",
    "title": "How does Python manage memory? Explain Reference Counting and the Cyclic Garbage Collector.",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Python's memory management employs a dual mechanism:\n\n1. Reference Counting (Primary):\n\u2022 Every object in Python contains a header field `ob_refcnt` tracking how many active references point to it.\n\u2022 Incremented when: assigned to variable, stored in list/dict, passed to function.\n\u2022 Decremented when: variable goes out of scope, reassigned, or `del` is called.\n\u2022 Immediate Deallocation: The moment `ob_refcnt` hits 0, the object's memory is deallocated INSTANTANEOUSLY.\n\n2. Cyclic Garbage Collector (Secondary - `gc` module):\n\u2022 Fatal Flaw of Reference Counting: Cannot detect Reference Cycles (e.g., Object A references B, and B references A. Even when outer references are gone, both retain `refcnt = 1`, leaking memory permanently).\n\u2022 The Cyclic GC runs periodically in the background to detect and break unreachable reference cycles.\n\u2022 Uses Generational Garbage Collection: Divides objects into 3 generations (Gen 0, Gen 1, Gen 2) based on survival. Newly created objects enter Gen 0; if they survive a collection cycle, they are promoted to Gen 1, then Gen 2.",
    "bullet_points": [
      "Reference counting deallocates memory immediately when count hits 0.",
      "Reference cycles (A -> B -> A) cannot be freed by reference counting alone.",
      "Cyclic GC detects and collects isolated reference cycles using graph traversal.",
      "Generational collection (Gen 0, 1, 2) focuses on young objects (weak generational hypothesis)."
    ],
    "code_snippet": {
      "language": "python",
      "code": "import gc\n\n# Reference cycle example:\nclass Node:\n    def __init__(self): self.cycle = self\n\nn = Node() # n points to Node, Node.cycle points to Node\ndel n      # refcnt is still 1! Reference counting fails to free it!\n\ngc.collect() # Cyclic GC runs, detects isolated cycle, and frees memory"
    },
    "pro_tip": "Mention the Weak Generational Hypothesis: Most objects die young! Gen 0 is collected frequently; Gen 2 is collected rarely, optimizing CPU efficiency.",
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 38
  },
  {
    "id": "int-python-039",
    "topic_id": "topic-python",
    "title": "The Integer Caching Trap: Why does 'a = 256; b = 256; a is b' evaluate to True, but 257 evaluates to False?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "In Python, integers are immutable objects allocated on the Heap.\n\nCPython Integer Interning / Caching Optimization:\n\u2022 During startup, CPython pre-allocates and caches an array of singleton integer objects for all integers in the range `-5` to `256` (inclusive).\n\u2022 When you create an integer in the range `[-5, 256]`, Python does NOT allocate a new object; it returns a reference to the existing cached singleton.\n\u2022 For 256: `a = 256; b = 256;` -> Both `a` and `b` point to the identical cached memory address. Therefore, `a is b` evaluates to `True`.\n\u2022 For 257: 257 is outside the pre-allocated cache `[-5, 256]`. When executed in separate lines/REPL, CPython allocates two distinct integer objects on the Heap. Therefore, `a is b` evaluates to `False` (though `a == b` is still `True`)!\n\nNote: In a single script or compilation unit, the compiler's code-object constant folder may intern 257 within the same code block, but across separate contexts, only `[-5, 256]` are guaranteed singletons.",
    "bullet_points": [
      "CPython caches integer singletons in range -5 to 256 at startup.",
      "Integers in [-5, 256] share memory addresses; 'is' evaluates to True.",
      "Integers >= 257 allocate distinct Heap objects; 'is' evaluates to False.",
      "Never use 'is' to compare numbers; always use '=='."
    ],
    "code_snippet": {
      "language": "python",
      "code": "a = 256\nb = 256\nprint(a is b) # True (cached singleton)\n\nc = 257\nd = 257\nprint(c is d) # False (in separate interactive prompts)!\nprint(c == d) # True (value equality)"
    },
    "pro_tip": "Interviewers ask this to test whether you know CPython C-level implementation details (`small_ints` array defined in `longobject.c`).",
    "company_tags": [
      "Google",
      "Meta",
      "Amazon",
      "Bloomberg"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 39
  },
  {
    "id": "int-python-040",
    "topic_id": "topic-python",
    "title": "How do Decorators with Arguments work in Python and why is '@functools.wraps' mandatory?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "A decorator is a higher-order function that takes another function as input, extends its behavior without modifying its source code, and returns a callable.\n\nDecorators with Arguments (3-Level Closure):\nIf a decorator accepts arguments (`@repeat(num_times=3)`), it requires THREE nested function layers:\n1. Outer function: Accepts the decorator arguments.\n2. Middle function: Accepts the target function being decorated.\n3. Inner wrapper function: Accepts `*args, **kwargs`, executes the logic, and calls the target function.\n\nWhy `@functools.wraps` is Mandatory:\nWhen a function is decorated, the original function is replaced by the inner `wrapper` function. Without `@functools.wraps(func)`:\n\u2022 The function's name becomes `wrapper.__name__ = 'wrapper'` instead of the original function name.\n\u2022 The docstring `__doc__` is lost.\n\u2022 Introspection tools, debuggers, and doc generators break.\n`@functools.wraps` copies over the original function's `__name__`, `__doc__`, and `__annotations__`.",
    "bullet_points": [
      "Decorators wrap functions using higher-order functions and closures.",
      "Decorators with arguments require a 3-tier nested function hierarchy.",
      "@functools.wraps preserves original function metadata (__name__, __doc__).",
      "Always accept *args, **kwargs in wrapper to support any target function signature."
    ],
    "code_snippet": {
      "language": "python",
      "code": "import functools\n\ndef repeat(num_times):\n    def decorator_repeat(func):\n        @functools.wraps(func) # Preserves __name__ and __doc__\n        def wrapper(*args, **kwargs):\n            for _ in range(num_times):\n                result = func(*args, **kwargs)\n            return result\n        return wrapper\n    return decorator_repeat\n\n@repeat(num_times=3)\ndef greet(name):\n    print(f\"Hello {name}\")"
    },
    "pro_tip": "If you write a decorator in a coding interview without `@functools.wraps`, interviewers will immediately deduct points for omitting metadata preservation.",
    "company_tags": [
      "Google",
      "Amazon",
      "Meta",
      "Microsoft"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 40
  },
  {
    "id": "int-python-041",
    "topic_id": "topic-python",
    "title": "What is the difference between '__new__' and '__init__' in Python? How do you implement a Singleton?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "\u2022 `__new__(cls, *args, **kwargs)` (The Creator / Allocator):\n- A static method responsible for CREATING and returning a brand new, raw instance of the class in memory.\n- Must return an instance of `cls` (usually by calling `super().__new__(cls)`).\n- Called FIRST, before `__init__`.\n\n\u2022 `__init__(self, *args, **kwargs)` (The Initializer):\n- An instance method responsible for INITIALIZING the newly created object's state (attributes).\n- Receives the instance `self` created by `__new__`.\n- Returns `None`.\n\nImplementing a Thread-Safe Singleton Pattern:\nOverride `__new__` to check if an instance already exists. If it exists, return the cached instance instead of allocating a new one!",
    "bullet_points": [
      "__new__ creates and returns the object instance; __init__ initializes object attributes.",
      "__new__ is called first; __init__ is called only if __new__ returns an instance of the class.",
      "__new__ is used to customize immutable types (tuple/int subclasses) and singletons.",
      "Singletons intercept __new__ to return a cached class instance."
    ],
    "code_snippet": {
      "language": "python",
      "code": "class Singleton:\n    _instance = None\n\n    def __new__(cls, *args, **kwargs):\n        if cls._instance is None:\n            # Allocate instance once\n            cls._instance = super().__new__(cls)\n        return cls._instance\n\ns1 = Singleton()\ns2 = Singleton()\nprint(s1 is s2) # True! Both reference identical memory address"
    },
    "pro_tip": "To create a subclass of an immutable type like `tuple` or `int`, you MUST override `__new__`, because modifying attributes in `__init__` is already too late (immutable object is already frozen).",
    "company_tags": [
      "Google",
      "Amazon",
      "Bloomberg",
      "Meta"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 41
  },
  {
    "id": "int-python-042",
    "topic_id": "topic-python",
    "title": "What are Metaclasses in Python and how do they relate to 'type'?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "In Python, 'everything is an object'\u2014and that includes Classes themselves! A Class is an instance of a Metaclass.\n\n\u2022 Metaclass: A 'class of a class' that defines how classes are constructed, validated, and initialized. Just as an ordinary class defines how instances behave, a metaclass defines how class objects behave.\n\n\u2022 The Built-in Metaclass 'type':\nBy default, all classes in Python are instances of the `type` metaclass.\nYou can dynamically create a class at runtime using `type(name, bases, dict)`:\n`MyClass = type('MyClass', (BaseClass,), {'x': 10})`\n\nWhen to Use Custom Metaclasses (`metaclass=Meta`):\n1. API Frameworks (Django Models, Pydantic, SQLAlchemy): Validating that subclasses define required attributes or register database schema tables at import time.\n2. Automatic Registration: Auto-registering plugins into a central registry upon class definition.\n3. Enforcing Coding Standards: Enforcing that all methods have docstrings or specific naming patterns.",
    "bullet_points": [
      "A metaclass is the blueprint for creating classes (class of a class).",
      "type is the default metaclass of all Python classes.",
      "type(name, bases, dict) dynamically constructs classes at runtime.",
      "Used by frameworks (Django ORM, Pydantic) to validate class schemas upon import."
    ],
    "code_snippet": {
      "language": "python",
      "code": "class ValidateMeta(type):\n    def __new__(cls, name, bases, dct):\n        if \"required_field\" not in dct:\n            raise TypeError(f\"{name} must define 'required_field'!\")\n        return super().__new__(cls, name, bases, dct)\n\nclass MyModel(metaclass=ValidateMeta):\n    required_field = \"valid\"\n    # If required_field is missing, Python raises TypeError at import time!"
    },
    "pro_tip": "Tim Peters famously stated: 'Metaclasses are deeper magic than 99% of users should ever worry about.' In modern Python 3.6+, prefer `__init_subclass__` over metaclasses for simpler class validation.",
    "company_tags": [
      "Google",
      "Meta",
      "Netflix",
      "Uber"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 42
  }
];
