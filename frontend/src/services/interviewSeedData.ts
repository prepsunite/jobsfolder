import type { InterviewQuestion } from '@/types/interview';

export const ALL_INTERVIEW_SEED_QUESTIONS: InterviewQuestion[] = [
  {
    "id": "int-java-001",
    "topic_id": "topic-java",
    "title": "What is the difference between JDK, JRE, and JVM in Java?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Java's runtime and development ecosystem is split into three concentric layers:\n\n1. JVM (Java Virtual Machine): An abstract computing machine that executes compiled Java bytecode (.class files). It is platform-dependent because it translates bytecode into specific host OS machine instructions.\n2. JRE (Java Runtime Environment): An implementation of the JVM bundled with the core Java Class Libraries (rt.jar, java.lang, java.util) necessary to run compiled Java applications. It does not include development tools like javac.\n3. JDK (Java Development Kit): The complete software development package containing the JRE, the JVM, and developer tools including the compiler (javac), archiver (jar), debugger (jdb), and documentation generator (javadoc).",
    "bullet_points": [
      "JVM executes platform-independent bytecode into native machine instructions.",
      "JRE = JVM + Core Class Libraries (sufficient to run programs).",
      "JDK = JRE + Development Tools (compiler, debugger, profilers)."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// Architecture hierarchy:\n// JDK = JRE + Development Tools (javac, jdb, jar)\n// JRE = JVM + Core Class Libraries (rt.jar)\n// JVM = ClassLoader + Memory Areas + Execution Engine (JIT + Interpreter)"
    },
    "pro_tip": "Always clarify to the interviewer: 'Java is platform-independent because of bytecode, but the JVM itself is platform-dependent.'",
    "company_tags": [
      "Amazon",
      "TCS",
      "Infosys",
      "Wipro"
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
    "title": "How does the Java ClassLoader Subsystem work, and what are its three main phases?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "The ClassLoader subsystem dynamically loads, links, and initializes Java classes during runtime when they are first referenced.\n\nIts three phases are:\n1. Loading: Locates and imports binary data for types using a delegation hierarchy (Bootstrap ClassLoader loads rt.jar/java.base, Platform/Extension ClassLoader loads ext modules, and Application/System ClassLoader loads user classpath classes).\n2. Linking: Consists of three sub-steps:\n   - Verification: Checks bytecode integrity against the JVM specification to prevent corrupted or malicious code.\n   - Preparation: Allocates memory for static fields and initializes them to default zero/null values (not user-assigned values yet).\n   - Resolution: Replaces symbolic references in the runtime constant pool with direct memory references.\n3. Initialization: Executes static initializers (<clinit>) and assigns explicit values to static variables in textual order.",
    "bullet_points": [
      "ClassLoader operates in 3 phases: Loading, Linking, and Initialization.",
      "Linking includes Verification, Preparation (memory allocated, set to zero), and Resolution (symbolic to direct pointers).",
      "Initialization runs static blocks and assigns declared values to static fields."
    ],
    "code_snippet": {
      "language": "java",
      "code": "public class ClassLoadDemo {\n    // Preparation: count allocated and set to 0\n    // Initialization: count set to 100, static block runs\n    static int count = 100;\n    static {\n        System.out.println(\"Static block initialized: \" + count);\n    }\n}"
    },
    "pro_tip": "Interviewer follow-up: 'When is a class loaded?' Answer: Only on first active use (instantiation, accessing a static member, or Class.forName()).",
    "company_tags": [
      "Google",
      "Microsoft",
      "Oracle"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 2
  },
  {
    "id": "int-java-003",
    "topic_id": "topic-java",
    "title": "What is the Delegation-Hierarchy Principle in Java ClassLoaders?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "When a ClassLoader is requested to load a class, it does not attempt to find the class itself first. Instead, it delegates the request to its parent ClassLoader up the chain until it reaches the Bootstrap ClassLoader.\n\nOnly if the parent ClassLoader fails to find and load the class (throwing ClassNotFoundException) does the child ClassLoader attempt to search its own repository and load the bytecode. This guarantees security: malicious code cannot override core Java classes like java.lang.String or java.lang.System by placing a counterfeit version on the classpath.",
    "bullet_points": [
      "Child delegates to parent all the way to Bootstrap ClassLoader before searching locally.",
      "Prevents user code from hijacking core JDK classes like java.lang.Object.",
      "Parent hierarchy: Bootstrap -> Platform (Extension) -> Application (System) -> Custom."
    ],
    "code_snippet": {
      "language": "java",
      "code": "ClassLoader appLoader = ClassLoadDemo.class.getClassLoader();\nSystem.out.println(appLoader); // jdk.internal.loader.ClassLoaders$AppClassLoader\nSystem.out.println(appLoader.getParent()); // PlatformClassLoader\nSystem.out.println(appLoader.getParent().getParent()); // null (Bootstrap Loader in C/C++)"
    },
    "pro_tip": "Notice that calling getParent() on the Platform ClassLoader returns null because the Bootstrap ClassLoader is implemented in native C/C++.",
    "company_tags": [
      "Oracle",
      "Adobe",
      "Morgan Stanley"
    ],
    "frequency": "MEDIUM",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 3
  },
  {
    "id": "int-java-004",
    "topic_id": "topic-java",
    "title": "What is the role of the JIT (Just-In-Time) Compiler in JVM, and how does HotSpot detect hot spots?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "The JVM combines interpretation with compilation for peak performance:\n\n1. Interpreter: Starts executing bytecode immediately line-by-line without compilation delay, but repeated executions of the same code loops run slowly.\n2. JIT Compiler: HotSpot monitors running code using execution counters (invocation counters for methods and backedge counters for loops). When an execution threshold is exceeded, that code segment is flagged as a 'Hot Spot'.\n3. Compilation: The JIT compiler compiles hot bytecode into native CPU machine code, stores it in the Code Cache, and applies aggressive optimizations like method inlining, loop unrolling, and dead-code elimination. Subsequent calls execute native machine code directly at bare-metal speeds.",
    "bullet_points": [
      "Interpreter provides instant start-up; JIT provides sustained high performance.",
      "HotSpot tracks invocation counters and loop backedge counters to identify hot code.",
      "Compiled native code is stored in the JVM Code Cache to bypass repeated interpretation."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// Hot loop candidate for JIT compilation and loop unrolling:\npublic long computeSum(int iterations) {\n    long sum = 0;\n    for (int i = 0; i < iterations; i++) {\n        sum += i; // Backedge counter triggers JIT\n    }\n    return sum;\n}"
    },
    "pro_tip": "Mention Tiered Compilation (enabled by default since Java 8): C1 (Client compiler, fast compilation with basic optimizations) + C2 (Server compiler, deep profiling and aggressive optimizations).",
    "company_tags": [
      "Google",
      "Uber",
      "Goldman Sachs"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 4
  },
  {
    "id": "int-java-005",
    "topic_id": "topic-java",
    "title": "What is Ahead-of-Time (AOT) compilation in Java (GraalVM Native Image), and how does it differ from JIT?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Ahead-of-Time (AOT) compilation translates Java bytecode directly into a standalone platform-native executable binary before execution, without requiring a traditional JVM at runtime.\n\nComparison:\n- Startup Time & Memory: AOT (e.g. GraalVM) starts in milliseconds and consumes minimal memory (ideal for serverless AWS Lambda and containerized microservices). JIT requires JVM warm-up time to compile hot spots.\n- Peak Throughput: JIT can often achieve higher long-term peak throughput than AOT because it makes runtime speculative optimizations based on real-world production profiling data and can deoptimize if assumptions break.\n- Reflection & Dynamic Loading: AOT requires static analysis and explicit configuration for reflection, dynamic proxies, and JNI.",
    "bullet_points": [
      "AOT compiles bytecode into OS-native binary ahead of execution (e.g., GraalVM Native Image).",
      "AOT gives instant sub-10ms startup and lower RAM usage; JIT gives higher peak throughput after warm-up.",
      "AOT closes the 'world' at build time, requiring explicit metadata for reflection and dynamic classloading."
    ],
    "code_snippet": {
      "language": "bash",
      "code": "# Compiling Java directly into a native Linux binary with GraalVM\nnative-image -jar app.jar app-binary\n./app-binary # Executes directly without java command or JVM startup latency"
    },
    "pro_tip": "Frame your answer around modern cloud-native architectures: JIT for high-throughput long-running services; AOT for fast-scaling Kubernetes pods and serverless functions.",
    "company_tags": [
      "Amazon",
      "Netflix",
      "Red Hat"
    ],
    "frequency": "MEDIUM",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 5
  },
  {
    "id": "int-java-006",
    "topic_id": "topic-java",
    "title": "What are the different Runtime Data Areas defined by the JVM Specification?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "The JVM divides runtime memory into 5 distinct areas:\n\n1. Heap Area (Shared across all threads): Stores all instantiated objects, instance variables, and arrays. Managed automatically by the Garbage Collector.\n2. Method Area / Metaspace (Shared across all threads): Stores class-level data, bytecode, method structures, field definitions, static variables, and the runtime constant pool.\n3. JVM Stack (Per thread): Created when a thread starts. Stores stack frames containing local variables, operand stacks, and partial results. Destroyed when thread terminates.\n4. Program Counter (PC) Register (Per thread): Tracks the memory address of the JVM instruction currently being executed by the thread.\n5. Native Method Stack (Per thread): Holds frames for native C/C++ methods invoked via JNI (Java Native Interface).",
    "bullet_points": [
      "Shared among threads: Heap Area and Method Area / Metaspace.",
      "Per-thread (private): JVM Stack, PC Register, and Native Method Stack.",
      "Thread private areas are deallocated automatically when thread finishes, requiring no GC."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// Memory area mapping:\npublic class Demo {\n    static int globalCount; // Metaspace\n    int instanceId;         // Heap (inside Demo object)\n    \n    public void calculate() {\n        int localVal = 42;  // Stack frame of current thread\n        Demo d = new Demo();// 'd' ref on Stack, 'new Demo()' on Heap\n    }\n}"
    },
    "pro_tip": "Common interview trap: 'Where are primitive local variables stored vs primitive instance variables?' Local primitives live on Stack; instance primitives live on Heap inside their parent object.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Salesforce"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 6
  },
  {
    "id": "int-java-007",
    "topic_id": "topic-java",
    "title": "What is the difference between PermGen and Metaspace in Java?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "PermGen (Permanent Generation) was replaced by Metaspace starting in Java 8:\n\n1. Location: PermGen was part of the contiguous Java Heap and had a fixed maximum size configured via -XX:MaxPermSize. Metaspace is allocated out of native OS memory (off-heap).\n2. OutOfMemoryError: PermGen frequently threw java.lang.OutOfMemoryError: PermGen space during dynamic classloading (e.g., Spring/Hibernate apps creating dynamic CGLIB proxies). Metaspace auto-expands dynamically up to available OS memory unless bounded by -XX:MaxMetaspaceSize.\n3. Garbage Collection: Metaspace triggers seamless metadata garbage collection when classloaders become unreachable.",
    "bullet_points": [
      "PermGen existed in Heap with fixed limits (-XX:MaxPermSize) until Java 7.",
      "Metaspace lives in native OS memory (off-heap) starting in Java 8.",
      "Eliminates frequent PermGen OutOfMemoryErrors caused by dynamic class proxies."
    ],
    "code_snippet": {
      "language": "bash",
      "code": "# Tuning Metaspace in Java 8+:\njava -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=512m -jar app.jar"
    },
    "pro_tip": "Remember: Static variables and interned Strings were moved out of PermGen into the regular Java Heap in Java 7, prior to Metaspace's full introduction in Java 8.",
    "company_tags": [
      "Oracle",
      "Cisco",
      "Walmart"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 7
  },
  {
    "id": "int-java-008",
    "topic_id": "topic-java",
    "title": "What causes a StackOverflowError vs an OutOfMemoryError in the JVM?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Both are fatal runtime errors descending from java.lang.VirtualMachineError:\n\n1. java.lang.StackOverflowError: Occurs when a thread's call stack exceeds the allocated stack memory limit (set via -Xss). Almost always caused by unbounded or excessively deep recursion, circular method calls, or huge local variable allocations.\n2. java.lang.OutOfMemoryError (OOM): Occurs when the JVM cannot allocate memory for an object because the heap is exhausted and the Garbage Collector cannot reclaim sufficient memory. Common variants include: OOM: Java heap space, OOM: GC overhead limit exceeded, and OOM: Metaspace.",
    "bullet_points": [
      "StackOverflowError: Thread stack depth exceeded (infinite recursion, -Xss).",
      "OutOfMemoryError: Heap or native memory exhausted (memory leaks, -Xmx).",
      "StackOverflowError occurs on thread-private stack; OOM typically occurs on shared heap."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// StackOverflowError: Unbounded recursion\nvoid recursiveCall() {\n    recursiveCall(); // Pushes frames until thread stack limit exceeded\n}\n\n// OutOfMemoryError: Leaking heap memory\nList<byte[]> memoryHog = new ArrayList<>();\nwhile (true) {\n    memoryHog.add(new byte[1024 * 1024]); // 1MB chunks until Heap exhausts\n}"
    },
    "pro_tip": "When asked how to resolve StackOverflowError: Fix recursive termination base cases or tune thread stack size with -Xss (e.g. -Xss1m).",
    "company_tags": [
      "Amazon",
      "Adobe",
      "Paypal"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 8
  },
  {
    "id": "int-java-009",
    "topic_id": "topic-java",
    "title": "What is Escape Analysis in HotSpot JVM, and how does it enable Scalar Replacement and Lock Coarsening?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Escape Analysis is a compiler optimization technique where the JIT compiler analyzes the scope of a new object across method boundaries:\n\n1. Global Escape: Object escapes the method and thread (e.g. returned, stored in a static field, or passed to another thread).\n2. Arg Escape: Object is passed as an argument but does not escape the invoked method.\n3. No Escape: Object is strictly confined to the declaring method.\n\nOptimizations enabled when an object does not escape:\n- Scalar Replacement: The JVM breaks the object into its primitive fields and stores them directly in CPU registers or stack frames, completely bypassing heap allocation and GC overhead.\n- Synchronization Elimination (Lock Elision): If a lock is acquired on an object that never escapes the thread, the locking overhead is eliminated at runtime.",
    "bullet_points": [
      "Escape Analysis determines if an object is accessible outside its declaring method or thread.",
      "Scalar Replacement decomposes non-escaping objects into primitive stack variables.",
      "Lock Elision removes synchronized blocks when the locked object cannot escape the thread."
    ],
    "code_snippet": {
      "language": "java",
      "code": "public int calculate() {\n    // Point does not escape method scope\n    Point p = new Point(10, 20);\n    return p.x + p.y; \n    // JIT scalar replaces p with two primitive integers x=10, y=20 on stack!\n}"
    },
    "pro_tip": "Point out that Java objects are not technically allocated on the stack directly as struct values; instead, Scalar Replacement decomposes the object into primitive variables on the stack.",
    "company_tags": [
      "Google",
      "Microsoft",
      "Jane Street"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 9
  },
  {
    "id": "int-java-010",
    "topic_id": "topic-java",
    "title": "What is the JVM Bytecode Verifier, and why is it essential for Java security?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "The Bytecode Verifier is a core component of the JVM's class linking phase. It conducts rigorous static and structural checks on loaded .class files before execution to guarantee that untrusted code running from the network or disk cannot violate JVM constraints.\n\nKey verifications include:\n1. Type Safety: Verifies that variables are initialized before use and values match operand types.\n2. Stack Overflow/Underflow: Ensures method execution will not cause operand stack underflow or overflow.\n3. Memory Access: Prevents illegal memory access, pointer spoofing, or reading arbitrary memory locations.\n4. Access Control: Checks that private and protected access boundaries are respected.",
    "bullet_points": [
      "Bytecode verifier guarantees loaded bytecode adheres to JVM specifications.",
      "Ensures type safety, prevents operand stack underflow, and blocks illegal memory access.",
      "Enforces the Java security sandbox before bytecode can reach the execution engine."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// Bytecode verifier prevents type forging at the bytecode level\n// e.g. Treating an integer as a raw pointer address to read kernel memory\n// is rejected immediately with java.lang.VerifyError."
    },
    "pro_tip": "Mention that Bytecode verification can be disabled with -noverify for legacy benchmarks, but this creates severe security vulnerabilities.",
    "company_tags": [
      "Oracle",
      "Apple",
      "Barclays"
    ],
    "frequency": "MEDIUM",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 10
  },
  {
    "id": "int-java-011",
    "topic_id": "topic-java",
    "title": "What is Garbage Collection in Java, and what is its main objective?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Garbage Collection (GC) in Java is the automated process by which the Java Virtual Machine (JVM) reclaims heap memory occupied by objects that are no longer referenced or reachable by the running application.\n\nMain Objectives:\n1. Automatic Memory Management: Eliminates manual memory allocation/freeing (like malloc/free in C/C++), preventing catastrophic vulnerabilities such as dangling pointers, double frees, and manual memory leaks.\n2. Resource Recycling: Frees unused heap blocks so they can be reused for new object allocations, preventing OutOfMemoryError.\n3. Runtime Integrity: Operates continuously in the background under JVM heuristics to ensure steady application throughput.",
    "bullet_points": [
      "GC is JVM's automated process of reclaiming heap memory from unreachable objects.",
      "Eliminates manual memory management hazards like dangling pointers and memory leaks.",
      "Runs as a low-priority background daemon thread managed by the JVM."
    ],
    "code_snippet": {
      "language": "java",
      "code": "public void test() {\n    Customer c = new Customer(\"Alice\"); // Allocated on Heap\n    // Method finishes -> 'c' reference on Stack pops\n    // Customer object on Heap becomes unreachable and eligible for GC\n}"
    },
    "pro_tip": "Clarify that GC reclaims only heap memory occupied by objects. Native OS resources (file handles, database sockets) must still be closed explicitly via try-with-resources.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Cognizant",
      "Wipro"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 11
  },
  {
    "id": "int-java-012",
    "topic_id": "topic-java",
    "title": "In which parts of memory are Java objects, object references, and local variables created?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Memory allocation depends strictly on whether the variable is an object instance, a reference, or a local primitive:\n\n1. Java Objects: All objects (regardless of where they are created, even inside methods) are always allocated on the Heap memory area.\n2. Object Reference Variables: Created on the Stack if declared as local variables inside a method. Created on the Heap if declared as instance fields of another class.\n3. Local Variables: Stored inside the thread's Stack frame during method execution. Deallocated instantly when the method frame pops.\n4. Static Variables & References: Stored in the Metaspace/Heap class metadata area.",
    "bullet_points": [
      "All Java objects are created on Heap memory.",
      "Object reference variables live on the Stack (if local) or on the Heap (if instance fields).",
      "Stack allocation is fast and deallocated immediately upon method return; Heap requires GC."
    ],
    "code_snippet": {
      "language": "java",
      "code": "public void demo() {\n    int age = 25;              // Local primitive -> Stack frame\n    String name = new String(\"John\"); \n    // 'name' reference variable -> Stack frame\n    // new String(\"John\") object -> Heap memory\n}"
    },
    "pro_tip": "A frequent trick question: 'Can an object ever be allocated on the stack in Java?' Answer: Conceptually no, but via JIT Escape Analysis and Scalar Replacement, fields of non-escaping objects can be held on the stack.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Accenture"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 12
  },
  {
    "id": "int-java-013",
    "topic_id": "topic-java",
    "title": "When exactly does an object become eligible for Garbage Collection?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "An object becomes eligible for garbage collection the instant it becomes 'unreachable'\u2014meaning there are no active paths from any live GC Roots to that object.\n\nCommon scenarios that make an object eligible for GC:\n1. Explicit Nullification: Explicitly assigning null to the reference variable (e.g., obj = null).\n2. Reassigning Reference: Pointing a reference variable to a different object (e.g., ref = new Object()). The original object loses its reference.\n3. Scope Expiry: When a method terminates, all local reference variables in its stack frame are popped, leaving objects created inside unreachable (unless returned or stored globally).\n4. Island of Isolation: Two or more unreferenced objects reference each other cyclically, but none have references from any active GC Root.",
    "bullet_points": [
      "An object is GC-eligible when it is unreachable from all active GC Roots.",
      "Occurs via nullification, reference reassignment, exiting method scope, or islands of isolation.",
      "Cyclic references do not prevent GC if the entire group is disconnected from GC Roots."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// 1. Reassigning reference\nStudent s1 = new Student(\"Bob\");\ns1 = new Student(\"Charlie\"); // \"Bob\" is eligible for GC\n\n// 2. Explicit nullification\nStudent s2 = new Student(\"Alice\");\ns2 = null; // \"Alice\" is eligible for GC"
    },
    "pro_tip": "Emphasize the Island of Isolation: Unlike CPython's simple reference counting, Java's GC handles circular references effortlessly because reachability tracing starts from GC Roots.",
    "company_tags": [
      "Amazon",
      "Google",
      "Oracle"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 13
  },
  {
    "id": "int-java-014",
    "topic_id": "topic-java",
    "title": "What is an Island of Isolation in Java Garbage Collection?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "An Island of Isolation occurs when two or more objects reference each other in a cycle, but none of these objects can be reached by any active live reference from a GC Root (such as a running thread stack, static variable, or JNI pointer).\n\nEven though each object in the cycle has an incoming reference count of 1 or more, the JVM's Tracing Garbage Collector starts traversal strictly from GC Roots. Because the entire cluster is detached from the root graph, the JVM recognizes the entire island as unreachable garbage and reclaims all objects in the cycle simultaneously.",
    "bullet_points": [
      "An island of isolation is a group of cyclically referencing objects detached from GC Roots.",
      "Reference counting would fail to collect them; Java's tracing GC collects the entire island.",
      "Demonstrates why the JVM uses reachability graphs rather than reference counting."
    ],
    "code_snippet": {
      "language": "java",
      "code": "class Node {\n    Node next;\n}\n\nNode a = new Node();\nNode b = new Node();\na.next = b; // a references b\nb.next = a; // b references a\n\na = null;   // Sever root link to a\nb = null;   // Sever root link to b\n// Both 'a' and 'b' form an Island of Isolation and will be garbage collected!"
    },
    "pro_tip": "Use diagrams or ASCII arrows during whiteboard interviews to illustrate GC root disconnection.",
    "company_tags": [
      "Microsoft",
      "Uber",
      "Goldman Sachs"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 14
  },
  {
    "id": "int-java-015",
    "topic_id": "topic-java",
    "title": "What are GC Roots in Java, and what types of references qualify as GC Roots?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "GC Roots are the special anchoring objects that the Garbage Collector uses as starting points for reachability analysis. Any object that can be reached via a chain of references starting from a GC Root is marked as 'alive' and retained; all others are swept away.\n\nThe 4 primary types of GC Roots are:\n1. Stack References: Local variables and method parameters residing in any currently executing thread's JVM stack frames.\n2. Active Threads: All live Thread objects currently running in the JVM.\n3. Static References: Class-level static fields referenced by loaded classes residing in Metaspace/Method Area.\n4. JNI References: Native Java Native Interface (JNI) global and local references allocated in C/C++ native method stacks.",
    "bullet_points": [
      "GC Roots are the entry points for reachability graph traversal.",
      "4 Main Roots: Active Thread Stacks (local variables), Live Thread objects, Static variables, JNI references.",
      "If an object cannot be reached via reference chains from any GC Root, it is reclaimed."
    ],
    "code_snippet": {
      "language": "java",
      "code": "public class GCRootsDemo {\n    private static Object staticRoot = new Object(); // GC Root (Static)\n    \n    public void run() {\n        Object localRoot = new Object(); // GC Root while run() executes (Stack)\n    }\n}"
    },
    "pro_tip": "When troubleshooting memory leaks in heap dumps (via MAT or VisualVM), you always trace the 'Path to GC Roots' to find what is pinning unreachable objects in memory.",
    "company_tags": [
      "Google",
      "Apple",
      "Netflix"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 15
  },
  {
    "id": "int-java-016",
    "topic_id": "topic-java",
    "title": "How does the Mark-and-Sweep Garbage Collection algorithm work?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Mark-and-Sweep is the foundational tracing algorithm used in the JVM heap:\n\n1. Mark Phase: The GC traverses the object graph starting from all GC Roots. Every object encountered along active reference paths has a bit flag set (marked as alive). Unreachable objects remain unmarked.\n2. Sweep Phase: The GC scans through the entire heap memory segment. Any memory block containing an unmarked object is cleared and added to a free-memory list for future allocations. Marked live objects have their mark bits cleared for the next cycle.\n3. Compact Phase (Mark-Compact): To prevent memory fragmentation caused by scattered free blocks, live objects are slid down to the beginning of the memory space, forming a single continuous block of free memory.",
    "bullet_points": [
      "Mark Phase: Traverses from GC roots and flags reachable objects as alive.",
      "Sweep Phase: Sweeps through heap memory, deallocating unmarked objects.",
      "Compact Phase: Relocates surviving objects contiguously to eliminate memory fragmentation."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// Conceptual representation of Mark-Sweep:\n// 1. Traverse: GC_Roots -> A -> B (Marked: A, B)\n// 2. Unreachable: C, D (Unmarked)\n// 3. Sweep: Free memory allocated to C and D\n// 4. Compact: Shift A and B adjacent to prevent fragmentation"
    },
    "pro_tip": "State the trade-off: Mark-Sweep alone causes heap fragmentation; adding Compaction solves fragmentation but requires updating all object reference pointers, which increases Stop-the-World pause time.",
    "company_tags": [
      "Amazon",
      "Cisco",
      "Adobe"
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
    "title": "Can Garbage Collection be forced or guaranteed in Java? What is the function of System.gc()?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "No, Garbage Collection can never be forced or guaranteed in Java.\n\nFunction of System.gc() / Runtime.getRuntime().gc():\n- Invoking System.gc() sends a suggestion or request to the JVM runtime that it should execute a garbage collection cycle.\n- However, the JVM specification makes zero guarantee that the request will be honored immediately or at all. The JVM may postpone, scale down, or outright ignore the request depending on current memory load and GC ergonomics.\n- Calling System.gc() manually in production is considered an antipattern because it can trigger a full Stop-The-World (STW) Major GC, freezing application threads for hundreds of milliseconds.\n- Furthermore, JVM flags like -XX:+DisableExplicitGC can completely disable System.gc() calls at runtime.",
    "bullet_points": [
      "GC cannot be forced; System.gc() is only a non-binding request to the JVM.",
      "The JVM decides independently when to trigger GC based on memory thresholds.",
      "Calling System.gc() in production is an anti-pattern as it risks triggering full STW pauses."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// Requesting GC (No guarantee of immediate execution):\nSystem.gc();\n\n// Alternative equivalent call:\nRuntime.getRuntime().gc();"
    },
    "pro_tip": "Pro-tip: In high-performance low-latency applications (e.g. trading engines), always run with -XX:+DisableExplicitGC to prevent third-party libraries from invoking System.gc().",
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
    "sort_order": 17
  },
  {
    "id": "int-java-018",
    "topic_id": "topic-java",
    "title": "Which type of thread is the Java Garbage Collector thread?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "The Java Garbage Collector runs as a low-priority Daemon Thread created and managed internally by the JVM.\n\nKey Characteristics:\n1. Daemon Status: Because it is a daemon thread, its existence does not prevent the JVM from terminating when all user application threads (non-daemon threads) finish execution.\n2. Low Priority: It typically runs with low thread priority (Thread.MIN_PRIORITY or slightly higher) so it does not starve application worker threads when heap memory is ample.\n3. Priority Escalation: If the JVM detects that heap memory is nearly exhausted or allocation rates spike, GC threads dynamically preempt user threads to execute urgent scavenges or Stop-the-World pauses.",
    "bullet_points": [
      "GC operates as an internal, low-priority JVM daemon thread.",
      "Does not block JVM shutdown when all user threads finish.",
      "Dynamically preempts user threads when free memory drops below safe thresholds."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// User vs Daemon Thread comparison:\nThread userThread = new Thread(() -> doWork()); // Default: Non-daemon\n// JVM will stay alive until userThread completes.\n\n// GC Thread is created internally by JVM with thread.setDaemon(true);"
    },
    "pro_tip": "Explain: The JVM exits immediately when the only remaining threads are daemon threads (such as GC, finalizer, and JMX threads).",
    "company_tags": [
      "Capgemini",
      "Accenture",
      "HCL"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 18
  },
  {
    "id": "int-java-019",
    "topic_id": "topic-java",
    "title": "What is Generational Garbage Collection in the JVM, and what is the Weak Generational Hypothesis?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Generational Garbage Collection divides the Java Heap into distinct age-based spaces based on the Weak Generational Hypothesis:\n\nThe Weak Generational Hypothesis states two empirical facts:\n1. Most allocated objects have very short lifespans (infant mortality) and die shortly after creation (e.g. local variables, method iterators, DTOs).\n2. Objects that survive multiple collection rounds are likely to remain alive for a long time.\n\nHeap Segmentation:\n- Young Generation: Where all new objects are born. Consists of Eden Space, Survivor 0 (S0 / From), and Survivor 1 (S1 / To). Garbage collected frequently via fast 'Minor GC'.\n- Old Generation (Tenured): Stores long-lived objects promoted from the Young Gen after surviving a threshold number of GC cycles (tenuring threshold). Collected via 'Major GC' / 'Full GC'.",
    "bullet_points": [
      "Weak Generational Hypothesis: Most objects die shortly after creation.",
      "Young Generation (Eden + S0 + S1): Fast, frequent Minor GCs reclaim short-lived objects.",
      "Old Generation (Tenured): Stores long-surviving objects; collected via Major/Full GC."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// Object lifecycle through generations:\n// 1. Object allocated in Eden.\n// 2. Minor GC: Survives -> copied to S0 (age = 1).\n// 3. Next Minor GC: Copied to S1 (age = 2).\n// 4. Age reaches -XX:MaxTenuringThreshold (default 15) -> Promoted to Old Generation."
    },
    "pro_tip": "Mention that dividing the heap into generations dramatically boosts throughput because Minor GCs only scan the small Young Gen without inspecting millions of Old Gen objects.",
    "company_tags": [
      "Amazon",
      "Oracle",
      "Microsoft"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 19
  },
  {
    "id": "int-java-020",
    "topic_id": "topic-java",
    "title": "How do Survivor Spaces (S0 and S1) work during Minor Garbage Collection?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Survivor spaces utilize a Copying Algorithm across two identical spaces: S0 ('From Space') and S1 ('To Space'). At any point in time, one survivor space is active and the other is completely empty.\n\nStep-by-step process during Minor GC:\n1. New objects are allocated in Eden Space.\n2. When Eden fills up, a Minor GC triggers. The GC identifies all live objects in Eden and the active survivor space (e.g. S0).\n3. All surviving live objects are copied into the empty survivor space (S1), their age counters increment by 1, and any remaining objects in Eden and S0 are wiped.\n4. S0 and S1 swap roles: S1 is now the active 'From Space', and S0 becomes the clean 'To Space'.\n5. When an object's age reaches the Tenuring Threshold (configured by -XX:MaxTenuringThreshold, default 15), it is promoted to the Old Generation.",
    "bullet_points": [
      "One survivor space is always empty to act as the destination buffer for the next Minor GC.",
      "Live objects from Eden and the active survivor space are copied to the empty survivor space.",
      "Surviving objects increment their age until reaching the tenuring threshold to enter Old Gen."
    ],
    "code_snippet": {
      "language": "bash",
      "code": "# JVM flags to configure Survivor Spaces:\n-XX:SurvivorRatio=8         # Eden to Survivor ratio is 8:1:1\n-XX:MaxTenuringThreshold=15 # Promoted to Old Gen after surviving 15 Minor GCs"
    },
    "pro_tip": "If the survivor space overflows during a Minor GC, objects are directly promoted to the Old Gen prematurely (Premature Tenuring).",
    "company_tags": [
      "Morgan Stanley",
      "Goldman Sachs",
      "Intuit"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 20
  },
  {
    "id": "int-java-021",
    "topic_id": "topic-java",
    "title": "What is a Stop-the-World (STW) pause, and why does it occur during Garbage Collection?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "A Stop-the-World (STW) pause is an event where the JVM temporarily halts all running application worker threads (mutators) at safe points while GC threads execute memory operations.\n\nWhy it is necessary:\n1. State Consistency: When tracing live object graphs and updating references, the object graph cannot mutate under the collector's feet. If user threads kept creating or moving objects, live objects could be misidentified as garbage or references could point to corrupted memory.\n2. Compaction & Relocation: When relocating live objects to eliminate heap fragmentation, the JVM must update all memory pointers pointing to those objects. Halting user threads ensures pointers are updated atomically.\n\nModern GC algorithms (G1, ZGC, Shenandoah) strive to minimize STW pauses down to sub-millisecond durations using concurrent marking and concurrent relocation phases.",
    "bullet_points": [
      "STW freezes all application threads at JVM safe points during GC phases.",
      "Prevents race conditions and ensures object graph consistency while moving objects.",
      "Modern collectors (ZGC, Shenandoah) reduce STW pauses to under 1ms."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// During an STW pause:\n// Application threads: [RUNNING] -> [SAFEPOINT - PAUSED] -> [RESUMED]\n// GC Threads:          [IDLE]    -> [SCAN / COMPACT]      -> [COMPLETED]"
    },
    "pro_tip": "Distinguish throughput collectors (Parallel GC: longer pauses, maximum throughput) from latency collectors (ZGC: sub-millisecond pauses, slight CPU overhead).",
    "company_tags": [
      "Google",
      "Uber",
      "Apple"
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
    "title": "What are the major Garbage Collectors available in HotSpot JVM (Serial, Parallel, CMS, G1, ZGC)?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "HotSpot offers several GC collectors tailored for different workload requirements:\n\n1. Serial GC (-XX:+UseSerialGC): Single-threaded collector for both Young and Old gen. Holds STW pauses for all work. Best for small client apps with small heaps (< 100MB).\n2. Parallel GC (-XX:+UseParallelGC): Multi-threaded collector for Young and Old gen. Emphasizes maximum throughput by utilizing all CPU cores, but incurs noticeable STW pauses. Default in Java 8.\n3. CMS (Concurrent Mark Sweep): Deprecated in Java 9, removed in Java 14. Minimized pauses by performing marking and sweeping concurrently with user threads, but suffered from heap fragmentation.\n4. G1 GC (Garbage-First) (-XX:+UseG1GC): Default since Java 9. Divides the heap into equal-sized virtual regions. Prioritizes collecting regions with the most garbage ('Garbage-First') to meet user-defined pause time targets (-XX:MaxGCPauseMillis).\n5. ZGC (-XX:+UseZGC): Ultra-low latency, scalable collector (Java 11+). Performs almost all phases concurrently\u2014including compaction\u2014using colored pointers and load barriers, guaranteeing sub-millisecond STW pause times regardless of heap size (gigabytes to terabytes).",
    "bullet_points": [
      "Parallel GC: Maximum throughput, default in Java 8.",
      "G1 GC: Region-based, predictable pause time targets, default in Java 9+.",
      "ZGC: Sub-millisecond pauses on terabyte heaps using colored pointers and load barriers."
    ],
    "code_snippet": {
      "language": "bash",
      "code": "# Enabling G1 GC with a target pause time of 200ms:\njava -XX:+UseG1GC -XX:MaxGCPauseMillis=200 -jar app.jar\n\n# Enabling ultra-low-latency ZGC (Java 15+):\njava -XX:+UseZGC -jar app.jar"
    },
    "pro_tip": "Interviewers love asking which GC is default: Java 8 is Parallel GC; Java 9 through Java 21+ is G1 GC.",
    "company_tags": [
      "Amazon",
      "Google",
      "Microsoft",
      "Meta"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 22
  },
  {
    "id": "int-java-023",
    "topic_id": "topic-java",
    "title": "What is the finalize() method in Java? Why is it considered flawed and deprecated in Java 9?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "The finalize() method is a protected method defined in java.lang.Object that the garbage collector invokes on an unreachable object before reclaiming its memory.\n\nWhy finalize() is fundamentally flawed and deprecated:\n1. Non-deterministic Execution: There is zero guarantee when\u2014or even if\u2014finalize() will be executed before the JVM terminates.\n2. Severe Performance Overhead: Objects overriding finalize() cannot be reclaimed during their initial GC cycle. They are placed into a Finalizer reference queue, delaying deallocation and increasing GC pause times.\n3. Object Resurrection: A finalize() method can resurrect an object by assigning 'this' to an active GC Root.\n4. Exception Swallowing: Any uncaught exception thrown inside finalize() is silently ignored by the JVM, leaving resources in an inconsistent state.\n5. Deprecated in Java 9 and marked for removal; replaced by java.lang.ref.Cleaner and AutoCloseable.",
    "bullet_points": [
      "finalize() was meant for cleanup before GC but offers no execution time guarantees.",
      "Degrades GC performance by delaying deallocation and placing objects on a finalizer queue.",
      "Officially deprecated in Java 9; modern code uses try-with-resources and AutoCloseable."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// Antipattern: Using finalize() for cleanup\npublic class ResourceHolder {\n    @Override\n    @Deprecated(since=\"9\")\n    protected void finalize() throws Throwable {\n        // Unreliable! May never run before JVM exits\n        closeNativeHandle(); \n    }\n}"
    },
    "pro_tip": "When asked: 'How many times can finalize() be called by GC on an object?' Answer: Exactly once. Even if resurrected and made unreachable again, finalize() will not run a second time.",
    "company_tags": [
      "Amazon",
      "Oracle",
      "Salesforce"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 23
  },
  {
    "id": "int-java-024",
    "topic_id": "topic-java",
    "title": "Can an unreferenced object be resurrected during finalization? How does Object Resurrection work?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Yes, an unreferenced object can be resurrected during its finalize() execution by assigning its 'this' reference to a live GC Root (such as an active static variable or a live collection).\n\nMechanics:\n1. When the object becomes unreachable, the GC detects it overrides finalize() and moves it to a special Finalization Queue (Finalizer thread).\n2. The Finalizer thread executes its finalize() method.\n3. Inside finalize(), if the object executes 'activeList.add(this)' or 'GlobalHolder.instance = this', a live GC Root reference is re-established.\n4. The object is resurrected and transitions back to reachable state, escaping garbage collection!\n5. However, the JVM remembers that finalize() has already executed for this object. If the object becomes unreachable again later, the GC will immediately collect it without ever invoking finalize() again.",
    "bullet_points": [
      "An object can resurrect itself by re-attaching 'this' to a live GC Root inside finalize().",
      "The JVM runs finalize() at most once per object lifecycle.",
      "If resurrected and subsequently made unreachable again, it is garbage collected without finalization."
    ],
    "code_snippet": {
      "language": "java",
      "code": "public class Phoenix {\n    public static Phoenix savior;\n\n    @Override\n    protected void finalize() {\n        // Object Resurrection!\n        savior = this; // Re-attaching to a live static GC Root\n        System.out.println(\"Resurrected from the dead!\");\n    }\n}"
    },
    "pro_tip": "Interviewer follow-up: 'Is resurrection possible using java.lang.ref.Cleaner?' Answer: No, because Cleaners do not hold references to the dying object (preventing resurrection entirely).",
    "company_tags": [
      "Google",
      "Microsoft",
      "Uber"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 24
  },
  {
    "id": "int-java-025",
    "topic_id": "topic-java",
    "title": "What are the 4 Reference Types in Java (Strong, Soft, Weak, Phantom), and how do they interact with GC?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Java provides 4 levels of reference strengths in java.lang.ref:\n\n1. Strong Reference: Default reference (e.g. Object obj = new Object()). As long as an object has a strong reference path from a GC Root, it is never garbage collected, even if memory runs out.\n2. Soft Reference (SoftReference<T>): Kept in memory as long as memory is sufficient. The GC only clears softly-referenced objects right before throwing an OutOfMemoryError. Ideal for memory-sensitive caches (e.g. image caches).\n3. Weak Reference (WeakReference<T>): Cleared eagerly at the very next GC cycle regardless of memory pressure. Ideal for canonical mappings where you don't want keys to stay alive artificially (used in java.util.WeakHashMap).\n4. Phantom Reference (PhantomReference<T>): The weakest reference. get() always returns null. Enqueued in a ReferenceQueue after the object's memory has been reclaimed. Used for scheduling pre-mortem cleanup actions and off-heap memory tracking (replaces finalize()).",
    "bullet_points": [
      "Strong: Never collected while reachable; throws OOM rather than collecting.",
      "Soft: Collected only when JVM runs low on memory (used for caching).",
      "Weak: Collected immediately during the next GC cycle (used in WeakHashMap).",
      "Phantom: get() returns null; used with ReferenceQueue for safe off-heap resource cleanup."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// Using WeakReference\nObject strongObj = new Object();\nWeakReference<Object> weakRef = new WeakReference<>(strongObj);\nstrongObj = null; // Sever strong reference\n\nSystem.gc(); // Force GC request\nSystem.out.println(weakRef.get()); // null (Reclaimed during GC!)"
    },
    "pro_tip": "Always reference WeakHashMap when explaining WeakReference: when a key is no longer strongly referenced elsewhere, its entry is automatically evicted from the map.",
    "company_tags": [
      "Amazon",
      "Bloomberg",
      "Goldman Sachs"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 25
  },
  {
    "id": "int-java-026",
    "topic_id": "topic-java",
    "title": "What is java.lang.ref.Cleaner, and how does it replace finalize() in Java 9+?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "java.lang.ref.Cleaner (introduced in Java 9) provides a safe, modern, and lightweight mechanism for managing post-mortem cleanups without the pitfalls of finalize():\n\nAdvantages over finalize():\n1. Prevents Resurrection: The cleanup action (a Runnable) must never refer to the tracked object itself; it only holds state needed for cleanup.\n2. Thread Control: Cleaners run on dedicated daemon threads managed by the library, rather than a single bottlenecked JVM finalizer thread.\n3. Exception Isolation: Exceptions in cleaning actions are isolated and do not crash the cleaner thread.\n4. Deterministic with AutoCloseable: Can be paired with AutoCloseable so resources are cleaned immediately upon close(), while the Cleaner serves as a fallback if the caller forgets to call close().",
    "bullet_points": [
      "Cleaner provides safe post-mortem cleanup introduced in Java 9 to replace finalize().",
      "Cleaning actions must not reference the tracked object, completely preventing resurrection.",
      "Best practice: Implement AutoCloseable for deterministic cleanup; use Cleaner as safety net."
    ],
    "code_snippet": {
      "language": "java",
      "code": "public class NativeResource implements AutoCloseable {\n    private static final Cleaner cleaner = Cleaner.create();\n    private final Cleaner.Cleanable cleanable;\n    \n    public NativeResource() {\n        this.cleanable = cleaner.register(this, new State());\n    }\n    static class State implements Runnable {\n        public void run() { /* Free native pointer */ }\n    }\n    public void close() { cleanable.clean(); }\n}"
    },
    "pro_tip": "Crucial rule with Cleaner: The cleanup Runnable must be a static nested class to avoid holding an implicit reference to the enclosing object.",
    "company_tags": [
      "Google",
      "Netflix",
      "Oracle"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 26
  },
  {
    "id": "int-java-027",
    "topic_id": "topic-java",
    "title": "What is the difference between Major GC, Minor GC, and Full GC?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Different collection scopes target different regions of the JVM heap:\n\n1. Minor GC: Collects only the Young Generation (Eden + Survivor spaces). Triggered when Eden fills up. Fast and frequent because of the high mortality rate of young objects. Pauses are typically very short (few milliseconds).\n2. Major GC: Collects the Old Generation (Tenured space). Often triggered when the Old Gen cannot accommodate promotions from the Young Gen. Takes significantly longer than Minor GC because the Old Gen is larger and objects are densely packed.\n3. Full GC: Cleans the entire JVM memory space\u2014including the Young Gen, Old Gen, and Metaspace/Method Area. Completely compacts the heap and causes the longest Stop-the-World pauses. Frequent Full GCs indicate a serious performance issue or memory leak.",
    "bullet_points": [
      "Minor GC: Young Generation only (Eden + Survivors); fast and frequent.",
      "Major GC: Old Generation (Tenured); longer pauses than Minor GC.",
      "Full GC: Entire Heap + Metaspace; maximum Stop-the-World pause duration."
    ],
    "code_snippet": {
      "language": "bash",
      "code": "# Analyzing GC logs to detect Full GCs:\njava -Xlog:gc*:file=gc.log:time,uptime,pid:filecount=5,filesize=100m -jar app.jar"
    },
    "pro_tip": "In modern collectors like G1, 'Mixed GC' collects all Young regions plus a select subset of Old regions with the highest garbage density.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Salesforce"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 27
  },
  {
    "id": "int-java-028",
    "topic_id": "topic-java",
    "title": "What is 'java.lang.OutOfMemoryError: GC overhead limit exceeded', and how do you resolve it?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "The JVM throws 'java.lang.OutOfMemoryError: GC overhead limit exceeded' as a protective mechanism when the application spends an excessive amount of time doing Garbage Collection with almost no memory reclaimed.\n\nTriggering Criteria:\n- By default, the JVM triggers this error if the process spends more than 98% of its total CPU time performing Garbage Collection and reclaims less than 2% of the heap memory in that time.\n- The JVM halts execution to protect CPU cores from burning at 100% capacity in an endless, futile GC loop.\n\nResolution Steps:\n1. Analyze heap dump (-XX:+HeapDumpOnOutOfMemoryError) with Eclipse MAT or VisualVM to locate memory leaks (e.g. unclosed static maps, caching).\n2. Increase Heap Size (-Xmx) if the application legitimately requires more live memory.\n3. Disable the check temporarily if needed using -XX:-UseGCOverheadLimit (though this usually just postpones a standard Heap Space OOM).",
    "bullet_points": [
      "Triggered when JVM spends > 98% CPU time on GC and reclaims < 2% of the heap.",
      "Protects the system from burning CPU in perpetual, futile Stop-the-World loops.",
      "Fix by diagnosing memory leaks via heap dumps (-XX:+HeapDumpOnOutOfMemoryError) or tuning -Xmx."
    ],
    "code_snippet": {
      "language": "bash",
      "code": "# Best practice production JVM diagnostics flags:\n-XX:+HeapDumpOnOutOfMemoryError\n-XX:HeapDumpPath=/var/log/app_oom.hprof\n-Xmx4g -Xms4g"
    },
    "pro_tip": "Emphasize to the interviewer: 'Increasing -Xmx is a temporary band-aid. The permanent fix requires identifying the leaky object retention path in the heap dump.'",
    "company_tags": [
      "Amazon",
      "Google",
      "Goldman Sachs"
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
    "title": "What are the 4 fundamental pillars of Object-Oriented Programming (OOP) in Java?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Java implements Object-Oriented Programming through four foundational pillars:\n\n1. Encapsulation: Bundling data (state) and methods (behavior) together within a single class while restricting unauthorized external access using access modifiers (private, protected). Ensures data integrity.\n2. Abstraction: Exposing only relevant interfaces and essential behaviors to the outside world while concealing internal implementation complexities using interfaces and abstract classes.\n3. Inheritance: Reusing existing code and establishing hierarchical IS-A relationships where a subclass inherits properties and behaviors from a superclass using the 'extends' keyword.\n4. Polymorphism: Enabling a single entity (method or operator) to take multiple forms. Manifests as Compile-time Polymorphism (Method Overloading) and Runtime Polymorphism (Method Overriding via dynamic method dispatch).",
    "bullet_points": [
      "Encapsulation: Binds state and behavior together and protects data with access specifiers.",
      "Abstraction: Hides internal complexity behind clean interfaces.",
      "Inheritance: Enables code reuse through hierarchical IS-A relationships.",
      "Polymorphism: Allows the same interface to execute distinct implementations."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// Encapsulation: private field with validated setter\npublic class BankAccount {\n    private double balance;\n    public void deposit(double amt) {\n        if (amt > 0) this.balance += amt;\n    }\n}"
    },
    "pro_tip": "When asked for real-life analogies: Encapsulation is a medical capsule; Abstraction is a car accelerator pedal; Polymorphism is a smartphone button doing different things depending on context.",
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
    "sort_order": 29
  },
  {
    "id": "int-java-030",
    "topic_id": "topic-java",
    "title": "Is Java purely Object-Oriented? Why or why not?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "No, Java is not 100% purely Object-Oriented.\n\nReasons why Java is not pure OOP:\n1. Primitive Data Types: Java includes 8 built-in primitive data types (byte, short, int, long, float, double, char, boolean) that are not objects. They reside directly on the stack for maximum performance and do not inherit from java.lang.Object.\n2. Static Members: Static variables and static methods belong to the class itself rather than an object instance, allowing invocation without instantiating any object (e.g. Math.sqrt()).\n3. Pure OOP Languages: In pure object-oriented languages like Smalltalk or Ruby, even numbers and primitives are first-class objects with methods (e.g. 5.times { ... }). In Java, 5 is a raw 32-bit primitive value.",
    "bullet_points": [
      "Java is not pure OOP because it supports 8 primitive data types (int, boolean, etc.).",
      "Primitives do not inherit from java.lang.Object and have no methods.",
      "Static methods and variables can be accessed without creating any object instance."
    ],
    "code_snippet": {
      "language": "java",
      "code": "int x = 10; // Primitive: Not an object, no methods, lives on stack\nInteger obj = Integer.valueOf(10); // Wrapper object: Lives on Heap"
    },
    "pro_tip": "Interviewers follow up: 'Why did Java creators keep primitives?' Answer: Raw performance and minimal memory footprint. Direct CPU ALU execution of primitives is vastly faster than heap object dereferencing.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Accenture"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 30
  },
  {
    "id": "int-java-031",
    "topic_id": "topic-java",
    "title": "Is Java 'Pass by Value' or 'Pass by Reference'? Prove your answer.",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Java is strictly and exclusively Pass-by-Value. There is no concept of pass-by-reference in Java.\n\nProof & Explanation:\n- When passing primitives (e.g. int), a copy of the primitive value is passed. Changes inside the method do not affect the caller's variable.\n- When passing objects, a copy of the reference address (pointer value) is passed by value. Both the caller and callee reference variables point to the same underlying heap object, so mutating internal object fields affects the shared object.\n- Crucial Proof: If you reassign the object reference itself inside the method (e.g., param = new Student()), the caller's original reference remains completely unchanged! If Java were pass-by-reference, the caller's reference would point to the new student.",
    "bullet_points": [
      "Java is strictly Pass-by-Value for both primitives and object references.",
      "For objects, the reference address is copied and passed by value.",
      "Reassigning a parameter reference inside a method has zero impact on the caller's reference."
    ],
    "code_snippet": {
      "language": "java",
      "code": "public static void swap(Student s1, Student s2) {\n    Student temp = s1;\n    s1 = s2;\n    s2 = temp; // Reassigning local reference copies!\n}\n// In caller: s1 and s2 are NOT swapped because references were passed by value."
    },
    "pro_tip": "Code up the swap method on a whiteboard to prove it immediately. Explain that Java passes pointers by value, just like C.",
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Paypal"
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
    "title": "What is the difference between Abstract Class and Interface in Java 8 and beyond?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Key differences in modern Java:\n\n1. Multiple Inheritance: A class can implement multiple interfaces, but can extend only one abstract class (single inheritance of state).\n2. State & Fields: Abstract classes can declare instance variables (fields) with state. Interfaces can only declare 'public static final' constants (no instance state).\n3. Constructors: Abstract classes have constructors (invoked via super() during subclass instantiation). Interfaces cannot have constructors.\n4. Methods (Java 8+): Interfaces can contain 'default' methods (with implementation) and 'static' methods, plus 'private' helper methods (Java 9+). Abstract classes can have any access modifier (protected, private, package-private).\n5. Semantic Intent: Abstract class represents an 'IS-A' relationship (code reuse and identity). Interface represents a 'CAN-DO' behavioral contract.",
    "bullet_points": [
      "Abstract class supports single inheritance of state; interface supports multiple inheritance of behavior.",
      "Abstract classes have constructors and instance fields; interfaces have no constructors and only static constants.",
      "Java 8 added default and static methods to interfaces; Java 9 added private interface methods."
    ],
    "code_snippet": {
      "language": "java",
      "code": "public interface Flyable {\n    default void fly() {\n        System.out.println(\"Flying with wings\");\n    }\n}\npublic abstract class Bird {\n    protected String species; // Instance state\n    public Bird(String species) { this.species = species; } // Constructor\n}"
    },
    "pro_tip": "A favorite follow-up: 'Why did Java 8 introduce default methods in interfaces?' Answer: To ensure backward compatibility in existing libraries (like Collections) when adding new methods (e.g. stream(), forEach()) without breaking existing implementers.",
    "company_tags": [
      "Amazon",
      "Adobe",
      "Oracle",
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
    "title": "How does Java resolve the Diamond Problem with default methods in multiple interfaces?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "When a class implements two interfaces that both declare a default method with the identical signature, the compiler encounters ambiguity (the Diamond Problem) and throws a compile-time error:\n'class inherits unrelated defaults for method() from types InterfaceA and InterfaceB'.\n\nResolution Rules:\n1. Class Wins Rule: A method declaration in a superclass or super-interface takes precedence over any interface default method.\n2. Sub-interface Wins Rule: If an interface extends another interface, the most specific sub-interface default method wins.\n3. Explicit Disambiguation: If neither rule applies, the implementing class MUST explicitly override the method and specify which interface default method to invoke using the syntax: InterfaceName.super.methodName().",
    "bullet_points": [
      "Compiler refuses to compile if multiple implemented interfaces share identical default method signatures.",
      "Rule 1: Superclass implementation always takes precedence over interface default methods.",
      "Disambiguate manually using: InterfaceA.super.methodName();"
    ],
    "code_snippet": {
      "language": "java",
      "code": "interface A { default void show() { System.out.println(\"A\"); } }\ninterface B { default void show() { System.out.println(\"B\"); } }\n\nclass C implements A, B {\n    @Override\n    public void show() {\n        A.super.show(); // Explicitly resolving ambiguity\n    }\n}"
    },
    "pro_tip": "Emphasize: Java allows multiple inheritance of type and behavior (via interfaces), but rejects multiple inheritance of state (instance fields).",
    "company_tags": [
      "Microsoft",
      "Uber",
      "Cisco"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 33
  },
  {
    "id": "int-java-034",
    "topic_id": "topic-java",
    "title": "What are Covariant Return Types in Java Method Overriding?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Starting in Java 5, an overriding method in a subclass is permitted to return a narrower (more specific) subtype of the return type declared in the superclass method, rather than having to match the exact same return type.\n\nBenefits:\n- Type Safety: Callers invoking the subclass method receive the specific derived type directly, eliminating the need for ugly downcasting.\n- Clean API Design: Allows fluent builder patterns and cloned objects to return their specific type without casting.",
    "bullet_points": [
      "Subclass overriding method can return a subtype of the superclass method's return type.",
      "Introduced in Java 5 to eliminate manual downcasting.",
      "Only applies to object reference return types, not primitive types."
    ],
    "code_snippet": {
      "language": "java",
      "code": "class Animal {\n    Animal reproduce() { return new Animal(); }\n}\nclass Dog extends Animal {\n    @Override\n    Dog reproduce() { return new Dog(); } // Valid: Dog is a subtype of Animal\n}"
    },
    "pro_tip": "Remind the interviewer: Covariant return types work only for reference types. You cannot override a method returning double to return int because primitives do not share an inheritance hierarchy.",
    "company_tags": [
      "Oracle",
      "Paypal",
      "Salesforce"
    ],
    "frequency": "MEDIUM",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 34
  },
  {
    "id": "int-java-035",
    "topic_id": "topic-java",
    "title": "Can you override private, static, or final methods in Java?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "No, none of them can be overridden:\n\n1. Private Methods: Cannot be overridden because private methods are not visible to subclasses. If a subclass defines a method with the identical signature, it is an entirely new, unrelated method (no polymorphism).\n2. Static Methods: Cannot be overridden because static methods are bonded at compile-time using Static Binding based on the reference type, not runtime dynamic dispatch. Defining a static method with the same signature in a subclass is called Method Hiding, not overriding.\n3. Final Methods: Cannot be overridden. The 'final' modifier explicitly forbids subclasses from modifying the method implementation. The compiler raises a compile-time error.",
    "bullet_points": [
      "Private methods are not visible to subclasses, hence cannot be overridden.",
      "Static methods use compile-time static binding; re-declaring them is Method Hiding.",
      "Final methods explicitly prohibit overriding at compile time."
    ],
    "code_snippet": {
      "language": "java",
      "code": "class Super { static void print() { System.out.println(\"Super\"); } }\nclass Sub extends Super { static void print() { System.out.println(\"Sub\"); } }\n\nSuper ref = new Sub();\nref.print(); // Prints \"Super\"! (Method hiding uses reference type, not object)"
    },
    "pro_tip": "Method Hiding is one of the most common tricky MCQ/interview questions. Always look at the reference type for static methods!",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 35
  },
  {
    "id": "int-java-036",
    "topic_id": "topic-java",
    "title": "What is the difference between Static Binding (Early Binding) and Dynamic Binding (Late Binding)?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Binding refers to the process of linking a method call to its method definition:\n\n1. Static Binding (Early Binding): The method call is resolved at compile time by the compiler based on the declared type of the reference variable. Used for private, final, static methods, and overloaded methods, because their target cannot change at runtime. Uses the JVM instruction 'invokestatic' or 'invokespecial'.\n2. Dynamic Binding (Late Binding): The method call is resolved at runtime based on the actual object type residing on the heap. Used for overridden instance methods (virtual methods). The JVM uses 'invokevirtual' or 'invokeinterface' to look up the method address in the class's vtable.",
    "bullet_points": [
      "Static Binding resolves at compile-time based on reference type (private, static, final, overloaded).",
      "Dynamic Binding resolves at runtime based on the actual object in heap (overridden virtual methods).",
      "Dynamic binding uses JVM vtables (virtual method tables) for fast runtime lookup."
    ],
    "code_snippet": {
      "language": "java",
      "code": "class Parent { void test() { System.out.println(\"Parent\"); } }\nclass Child extends Parent { void test() { System.out.println(\"Child\"); } }\n\nParent p = new Child();\np.test(); // Dynamic Binding: Resolves to Child.test() at runtime via vtable."
    },
    "pro_tip": "Connect this with C++ vtable/vptr concepts to demonstrate deep systems understanding.",
    "company_tags": [
      "Adobe",
      "Google",
      "Amazon"
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
    "title": "What are the rules for Exception Handling when overriding a method in Java?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "When a subclass overrides a superclass method, strict rules govern checked exceptions to preserve polymorphism (Liskov Substitution Principle):\n\n1. No New/Broader Checked Exceptions: The overriding method CANNOT declare a new or broader checked exception than declared by the superclass method.\n2. Narrower or Fewer Checked Exceptions: The overriding method CAN declare fewer checked exceptions, narrower (subclass) checked exceptions, or no checked exceptions at all.\n3. Unchecked Exceptions: The overriding method can declare any unchecked (RuntimeException or Error) regardless of whether the superclass method declares it or not.\n4. If Superclass Declares No Checked Exception: The subclass method CANNOT declare any checked exception at all.",
    "bullet_points": [
      "Overriding method cannot declare broader or new checked exceptions.",
      "Overriding method can declare narrower (subclass) checked exceptions or omit them completely.",
      "Unchecked exceptions (RuntimeException) are unrestricted and can be thrown freely."
    ],
    "code_snippet": {
      "language": "java",
      "code": "class SuperClass {\n    void execute() throws IOException {}\n}\nclass SubClass extends SuperClass {\n    // Valid: FileNotFoundException is a subclass of IOException\n    @Override\n    void execute() throws FileNotFoundException {}\n    \n    // INVALID: void execute() throws Exception {} // Compile Error!\n}"
    },
    "pro_tip": "Interviewer trap: 'Why does this rule exist?' Answer: If SubClass could throw a broader exception (like Exception), existing client code catching IOException would crash on unhandled general exceptions.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Morgan Stanley"
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
    "title": "Why does Java not support Multiple Inheritance with classes?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Java deliberately avoids multiple inheritance of classes to prevent ambiguity, complexity, and the notorious Diamond Problem:\n\n1. The Diamond Problem: If class A defines a method display(), and classes B and C both extend A and override display(), then if class D extends both B and C, calling d.display() creates irreconcilable ambiguity: which version should D inherit?\n2. State Duplication: If a class inherited multiple base classes, instance variables could be duplicated multiple times in memory, creating complex pointer offsets and object layout overhead.\n3. Simplicity: The designers of Java chose simplicity and security over complexity, providing interfaces instead to achieve multiple inheritance of type and behavior without multiple inheritance of state.",
    "bullet_points": [
      "Prevents the Diamond Problem and method resolution ambiguity.",
      "Avoids duplicate memory allocations for inherited base class fields.",
      "Interfaces provide safe multiple inheritance of type and behavior without state conflicts."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// Diamond problem scenario (Prevented in Java):\n//     A\n//    / \\\n//   B   C\n//    \\ /\n//     D  <-- Which display() should D inherit?"
    },
    "pro_tip": "Remind the interviewer: Java 8 default methods allow multiple behavioral inheritance, but enforce strict compile-time disambiguation rules to eliminate ambiguity.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Capgemini"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 38
  },
  {
    "id": "int-java-039",
    "topic_id": "topic-java",
    "title": "What is the difference between Shallow Copy and Deep Copy in Java? How do you implement them?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Object cloning creates a duplicate of an existing object:\n\n1. Shallow Copy: Copies all field values of the original object. If a field is a primitive, its value is copied directly. However, if a field is an object reference, only the reference address is copied\u2014both the original and cloned objects point to the exact same inner object on the heap. Mutating an inner object in one affects the other.\n2. Deep Copy: Copies the outer object and recursively instantiates duplicates of all nested dependent objects. The original and cloned objects share zero mutable object references. Changes to the clone never affect the original.\n\nImplementation:\n- Shallow copy is provided by default by Object.clone() (requires implementing Cloneable).\n- Deep copy is implemented via copy constructors, serialization/deserialization, or libraries like Jackson/Apache Commons.",
    "bullet_points": [
      "Shallow copy copies reference pointers; nested objects are shared between clones.",
      "Deep copy creates distinct copies of both the parent object and all nested child objects.",
      "Default Object.clone() performs a shallow copy."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// Deep Copy via Copy Constructor\npublic class Department {\n    private String name;\n    public Department(Department other) {\n        this.name = other.name;\n    }\n}\npublic class Employee {\n    private Department dept;\n    public Employee(Employee other) {\n        this.dept = new Department(other.dept); // Deep copy of nested object\n    }\n}"
    },
    "pro_tip": "Josh Bloch's Effective Java recommends avoiding Cloneable/clone() entirely in favor of Copy Constructors or Static Factory Methods.",
    "company_tags": [
      "Amazon",
      "Goldman Sachs",
      "Intuit"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 39
  },
  {
    "id": "int-java-040",
    "topic_id": "topic-java",
    "title": "What are Marker Interfaces in Java, and what are modern alternatives?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "A Marker Interface (or Tagging Interface) is an interface that declares zero methods and zero constants (an empty interface).\n\nPurpose:\n- Delivers metadata or a 'tag' to the JVM, compiler, or libraries indicating that implementing classes possess a special capability or permission.\n- Classic Examples: java.io.Serializable (signals serialization eligibility), java.lang.Cloneable (allows Object.clone()), java.util.RandomAccess (signals O(1) indexed access in lists).\n\nModern Alternative:\n- Custom Annotations (@MyMarker) introduced in Java 5. Annotations are vastly superior because they support parameters, retain retention policies (@Retention(RUNTIME)), and do not pollute the class type hierarchy.",
    "bullet_points": [
      "Marker interfaces contain no methods or constants (e.g., Serializable, Cloneable).",
      "Used to tag classes with runtime or compiler capabilities checked via 'instanceof'.",
      "Replaced in modern Java by custom annotations (@Annotation)."
    ],
    "code_snippet": {
      "language": "java",
      "code": "public interface Deletable { } // Marker Interface\n\nif (entity instanceof Deletable) {\n    deleteFromDatabase(entity);\n}"
    },
    "pro_tip": "If asked: 'What happens if a class invokes clone() without implementing Cloneable?' Answer: It throws java.lang.CloneNotSupportedException at runtime.",
    "company_tags": [
      "Infosys",
      "Wipro",
      "Oracle"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 40
  },
  {
    "id": "int-java-041",
    "topic_id": "topic-java",
    "title": "What is the difference between Composition and Inheritance? Why prefer Composition?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Both provide code reuse and modularity, but differ fundamentally:\n\n1. Inheritance (IS-A relationship): Tightly couples the subclass to the superclass implementation ('white-box reuse'). If the superclass changes its internal implementation, subclasses can silently break (fragile base class problem). Bound statically at compile-time.\n2. Composition (HAS-A relationship): A class contains references to instances of other classes and delegates tasks to them ('black-box reuse'). Loosely coupled; internal details remain encapsulated. Can dynamically swap behaviors at runtime via dependency injection.\n\nWhy Prefer Composition ('Favor composition over inheritance' - Effective Java):\n- Prevents fragile base class bugs.\n- Allows swapping component behaviors dynamically at runtime.\n- Avoids inheriting unwanted or dangerous superclass methods.",
    "bullet_points": [
      "Inheritance creates tight compile-time coupling (IS-A); breaks encapsulation.",
      "Composition achieves loose coupling by holding object references and delegating (HAS-A).",
      "Composition allows dynamic runtime behavior swapping (Strategy Pattern)."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// Composition: Engine is injected and encapsulated\npublic class Car {\n    private final Engine engine; // HAS-A relationship\n    public Car(Engine engine) { this.engine = engine; }\n    public void drive() { engine.start(); }\n}"
    },
    "pro_tip": "Cite the famous example from Effective Java where subclassing HashSet to count added elements broke because addAll() internally calls add(), doubling the count.",
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 41
  },
  {
    "id": "int-java-042",
    "topic_id": "topic-java",
    "title": "How does the 'instanceof' pattern matching work in Java 16+?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Prior to Java 16, using 'instanceof' required a tedious and error-prone two-step ceremony: first testing type with instanceof, followed by an explicit typecast.\n\nPattern Matching for instanceof (Standardized in Java 16, JEP 394):\n- Combines the type test and conditional variable extraction into a single clean construct.\n- If the instanceof predicate evaluates to true, the extracted target variable is automatically bound, scoped, and typed.\n- Eliminates redundant boilerplate casting and removes ClassCastException risks.",
    "bullet_points": [
      "Combines type testing and variable casting into one atomic expression.",
      "Standardized in Java 16 (JEP 394).",
      "The scoped variable is only in scope where the condition is guaranteed to be true."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// Before Java 16:\nif (obj instanceof String) {\n    String s = (String) obj; // Manual boilerplate cast\n    System.out.println(s.length());\n}\n\n// Java 16+ Pattern Matching:\nif (obj instanceof String s) {\n    System.out.println(s.length()); // 's' is directly available and typed\n}"
    },
    "pro_tip": "Highlight scope flow: 'if (!(obj instanceof String s)) return; System.out.println(s.toUpperCase());' is completely valid because 's' is in scope after the guard return!",
    "company_tags": [
      "Uber",
      "Meta",
      "Amazon"
    ],
    "frequency": "MEDIUM",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 42
  },
  {
    "id": "int-java-043",
    "topic_id": "topic-java",
    "title": "What are the 8 primitive data types in Java and their memory sizes?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Java primitives have fixed, platform-independent sizes defined by the JVM specification:\n\n1. byte: 1 byte (8 bits), range -128 to 127.\n2. short: 2 bytes (16 bits), range -32,768 to 32,767.\n3. int: 4 bytes (32 bits), range -2^31 to 2^31 - 1.\n4. long: 8 bytes (64 bits), range -2^63 to 2^63 - 1 (appended with 'L').\n5. float: 4 bytes (32 bits), IEEE 754 single-precision (appended with 'f').\n6. double: 8 bytes (64 bits), IEEE 754 double-precision (default floating point).\n7. char: 2 bytes (16 bits), unsigned Unicode characters (\\u0000 to \\uffff, 0 to 65,535).\n8. boolean: Size is JVM-dependent (typically 1 byte for standalone booleans, 1 bit packed in bitfields/arrays).",
    "bullet_points": [
      "8 primitives: byte (1B), short (2B), int (4B), long (8B), float (4B), double (8B), char (2B), boolean.",
      "char in Java is 2 bytes (16-bit) because it supports Unicode UTF-16 characters, unlike C's 1-byte ASCII.",
      "Primitive sizes are identical across all operating systems and architectures."
    ],
    "code_snippet": {
      "language": "java",
      "code": "byte b = 127;          // 8 bits\nchar c = 'A';          // 16 bits (Unicode)\nlong big = 100_000_000_000L; // 64 bits"
    },
    "pro_tip": "Tricky point: In C, sizeof(int) can vary between 16-bit and 64-bit systems. In Java, an int is ALWAYS 32 bits everywhere.",
    "company_tags": [
      "TCS",
      "Wipro",
      "Cognizant"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 43
  },
  {
    "id": "int-java-044",
    "topic_id": "topic-java",
    "title": "What is the Java Integer Cache trap (Integer a = 127 vs 128)?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Java maintains an internal object pool for small Integer wrapper instances to conserve memory:\n\nMechanics:\n- By default, java.lang.Integer caches objects with values in the range [-128 to 127].\n- When autoboxing or calling Integer.valueOf(n):\n  - If n is between -128 and 127, valueOf() returns the pre-instantiated cached object from IntegerCache.low to IntegerCache.high.\n  - If n is >= 128 or <= -129, valueOf() allocates a brand-new Integer instance on the heap.\n- Therefore: Integer a = 127; Integer b = 127; a == b evaluates to true (same memory reference).\n- But: Integer c = 128; Integer d = 128; c == d evaluates to false (two distinct heap objects)!",
    "bullet_points": [
      "IntegerCache pools Integer objects from -128 to 127 by default.",
      "Autoboxing invokes Integer.valueOf() under the hood, utilizing the cache.",
      "Comparing wrapped integers with '==' checks memory addresses, leading to subtle bugs above 127. Always use .equals()!"
    ],
    "code_snippet": {
      "language": "java",
      "code": "Integer a = 127, b = 127;\nSystem.out.println(a == b); // true (Both reference cached object)\n\nInteger c = 128, d = 128;\nSystem.out.println(c == d); // false (Two distinct heap allocations!)\nSystem.out.println(c.equals(d)); // true (Value equality)"
    },
    "pro_tip": "Mention that Byte, Short, Long also cache [-128, 127], Character caches [0, 127], but Float and Double have NO cache.",
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Paypal"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 44
  },
  {
    "id": "int-java-045",
    "topic_id": "topic-java",
    "title": "Why does 'byte b = 129;' cause a compilation error, and how does explicit casting behave?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "In Java, integer literals are treated as 32-bit int values by default:\n\n1. Range Validation: The 'byte' data type is signed 8-bit, with valid values from -128 to +127. When assigning 129, the compiler detects that 129 exceeds the byte maximum limit (+127) and throws a compile-time error: 'possible loss of precision'.\n2. Explicit Casting (byte) 129: Forces conversion by truncating the higher 24 bits of the 32-bit int (0x00000081), leaving only the lowest 8 bits (10000001 in binary).\n3. Two's Complement: In 8-bit signed two's complement, 10000001 has a leading 1 (sign bit negative). Its value is -128 + 1 = -127. Thus, (byte) 129 evaluates to -127.",
    "bullet_points": [
      "129 exceeds the maximum 8-bit signed byte limit (+127), causing a compile-time error.",
      "Explicit cast (byte) 129 truncates upper bits, yielding binary 10000001.",
      "Under two's complement arithmetic, 10000001 wraps around to -127."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// byte b = 129; // Compile Error: incompatible types: possible lossy conversion from int to byte\nbyte b = (byte) 129;\nSystem.out.println(b); // Prints: -127"
    },
    "pro_tip": "Another trick: 'byte a = 10; byte b = 20; byte c = a + b;' also fails compilation because arithmetic operands promote automatically to int! You need: byte c = (byte)(a + b);",
    "company_tags": [
      "Amazon",
      "Oracle",
      "Goldman Sachs"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 45
  },
  {
    "id": "int-java-046",
    "topic_id": "topic-java",
    "title": "What are the 3 distinct uses of the 'final' keyword in Java?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "The 'final' keyword is a non-access modifier that restricts modification across three contexts:\n\n1. Final Variable: Once assigned, its value cannot be changed (acts as a constant). For primitive variables, the value cannot be modified. For object references, the reference address cannot be changed to point to another object (though the internal mutable fields of the object CAN still be mutated!).\n2. Final Method: Prevents method overriding in any subclass. Guarantees that the behavior defined by the parent class cannot be modified by child classes.\n3. Final Class: Prevents inheritance (cannot be extended). Used to build secure, immutable classes (e.g., java.lang.String, java.lang.Integer, System).",
    "bullet_points": [
      "Final Variable: Constant value / immutable reference address.",
      "Final Method: Prohibits method overriding in subclasses.",
      "Final Class: Prohibits inheritance and subclassing (e.g. String)."
    ],
    "code_snippet": {
      "language": "java",
      "code": "final List<String> list = new ArrayList<>();\nlist.add(\"Hello\"); // ALLOWED: Internal object state can mutate\n// list = new ArrayList<>(); // COMPILE ERROR: Reference cannot be reassigned!"
    },
    "pro_tip": "Highlight the distinction between final reference and immutability: A final reference cannot point to a new object, but the object itself is NOT immutable unless its class is designed to be immutable.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 46
  },
  {
    "id": "int-java-047",
    "topic_id": "topic-java",
    "title": "How do you create a fully Immutable Class in Java? What are the strict design rules?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "An immutable class is one whose instance state cannot be modified after instantiation (e.g. java.lang.String).\n\nStrict Rules to Create an Immutable Class:\n1. Declare class as 'final' to prevent subclasses from overriding methods and altering immutability.\n2. Make all fields 'private' (restrict external access) and 'final' (ensures assigned only once via constructor and visible safely across threads).\n3. Provide no setter methods (no state mutation methods).\n4. Initialize all fields via constructor performing Defensive Copying for any mutable inputs (e.g. clone Date or List).\n5. In getter methods, return Defensive Copies of mutable fields rather than returning the direct internal reference.\n\nModern alternative: Use Java 14+ 'record' classes.",
    "bullet_points": [
      "Declare class final and all fields private final.",
      "No setter methods.",
      "Perform defensive copying on mutable constructor arguments and getter returns.",
      "Java 14+ records provide built-in shallow immutability."
    ],
    "code_snippet": {
      "language": "java",
      "code": "public final class ImmutablePerson {\n    private final String name;\n    private final List<String> hobbies;\n\n    public ImmutablePerson(String name, List<String> hobbies) {\n        this.name = name;\n        this.hobbies = new ArrayList<>(hobbies); // Defensive copy on input\n    }\n    public List<String> getHobbies() {\n        return new ArrayList<>(this.hobbies);   // Defensive copy on output\n    }\n}"
    },
    "pro_tip": "Interviewer trick question: 'If hobbies is declared final, why do we still need defensive copying?' Answer: Final only prevents reassigning the list reference; callers could still call person.getHobbies().add('Bad') and corrupt state!",
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Goldman Sachs"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 47
  },
  {
    "id": "int-java-048",
    "topic_id": "topic-java",
    "title": "What are Java Records (introduced in Java 14/16), and how do they differ from standard classes?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "A 'record' is a special class type designed to act as transparent, immutable carriers for data with zero boilerplate.\n\nKey Characteristics of Records:\n1. Automatic Generation: The compiler automatically generates private final fields, a canonical constructor, public accessor methods (named field() without 'get'), equals(), hashCode(), and toString().\n2. Immutability: Records are implicitly final and cannot be extended. All defined fields are private and final.\n3. Restrictions: Cannot declare non-static instance fields; cannot extend any class (implicitly extends java.lang.Record), but can implement interfaces.\n4. Compact Constructor: Allows custom validation without repeating assignments.",
    "bullet_points": [
      "Transparent, immutable data carrier classes standardized in Java 16.",
      "Compiler auto-generates constructor, accessors, equals(), hashCode(), and toString().",
      "Implicitly final and immutable; replaces verbose Lombok @Value / POJO boilerplate."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// Replaces 50 lines of boilerplate POJO code:\npublic record Point(int x, int y) {\n    // Compact constructor for validation\n    public Point {\n        if (x < 0 || y < 0) throw new IllegalArgumentException(\"Coords must be >= 0\");\n    }\n}\nPoint p = new Point(10, 20);\nSystem.out.println(p.x()); // 10 (accessor method without 'get')"
    },
    "pro_tip": "Note: Field accessor methods in records do NOT use the JavaBean 'get' prefix (e.g., p.x() instead of p.getX()).",
    "company_tags": [
      "Amazon",
      "Netflix",
      "Salesforce"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 48
  },
  {
    "id": "int-java-049",
    "topic_id": "topic-java",
    "title": "What is Autoboxing and Unboxing in Java, and what is its performance and NullPointerException risk?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Autoboxing is the automatic conversion that the Java compiler makes between the primitive types and their corresponding object wrapper classes (e.g. int to Integer). Unboxing is the reverse (Integer to int).\n\nHidden Traps:\n1. NullPointerException on Unboxing: If a wrapper object is null and unboxed into a primitive (e.g. in an if condition or arithmetic operation), the JVM invokes .intValue() on a null reference, throwing java.lang.NullPointerException.\n2. Performance Degradation: In tight loops, autoboxing silently creates millions of short-lived wrapper objects on the heap, thrashing CPU caches and triggering frequent Minor GCs.",
    "bullet_points": [
      "Autoboxing: Primitive -> Wrapper (int -> Integer via Integer.valueOf()).",
      "Unboxing: Wrapper -> Primitive (Integer -> int via intValue()).",
      "Unboxing a null wrapper throws NullPointerException; excessive autoboxing causes heap churn."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// 1. NPE on Unboxing\nInteger count = null;\n// int total = count + 5; // Throws NullPointerException! (count.intValue() on null)\n\n// 2. Performance Trap (Silent boxing in loop)\nLong sum = 0L; // WRONG: Uses wrapper Long instead of primitive long\nfor (long i = 0; i < 1_000_000; i++) {\n    sum += i; // Instantiates 1,000,000 Long objects on Heap!\n}"
    },
    "pro_tip": "Always check for null before unboxing wrapper objects retrieved from databases or maps.",
    "company_tags": [
      "Amazon",
      "Adobe",
      "Paypal"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 49
  },
  {
    "id": "int-java-050",
    "topic_id": "topic-java",
    "title": "Why should sensitive data like passwords be stored in char[] rather than String in Java?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Storing passwords in char[] is an industry security standard recommended by the Java Security Architecture:\n\nReasons:\n1. String Immutability: Strings are immutable and placed in the String Constant Pool or heap. Once created, a String cannot be modified or zeroed out; it remains in memory until collected by GC (which may take hours).\n2. Memory Dump Vulnerability: A hacker obtaining an application memory dump (core dump or hprof) can inspect plain-text String passwords in cleartext memory.\n3. Array Zeroing: With a char[] (or byte[]), you can immediately overwrite the memory with zeroes or blanks (Arrays.fill(pwd, '0')) as soon as authentication completes, completely wiping the secret from RAM.",
    "bullet_points": [
      "Strings are immutable; passwords remain readable in memory until GC reclaims them.",
      "Memory dumps can expose plain-text passwords stored in Strings.",
      "char[] can be explicitly wiped (Arrays.fill(password, '0')) immediately after use."
    ],
    "code_snippet": {
      "language": "java",
      "code": "char[] password = new char[]{'s', 'e', 'c', 'r', 'e', 't'};\nauthenticateUser(password);\n// Wipe from memory immediately!\nArrays.fill(password, '0');"
    },
    "pro_tip": "This is a classic question asked by cybersecurity, banking, and fintech firms (Goldman Sachs, Morgan Stanley, Visa).",
    "company_tags": [
      "Goldman Sachs",
      "Morgan Stanley",
      "Visa",
      "Paypal"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 50
  },
  {
    "id": "int-java-051",
    "topic_id": "topic-java",
    "title": "Why are Strings immutable in Java? What are the core architectural reasons?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "String immutability is one of the most critical architectural decisions in Java, driven by 4 pillars:\n\n1. String Constant Pool (SCP) Optimization: By making Strings immutable, the JVM shares identical string literals across the entire application in the SCP. If strings were mutable, altering a string in one thread would silently corrupt the value for all other threads sharing that literal.\n2. Multithreading & Thread-Safety: Immutable objects are inherently thread-safe without requiring synchronized locks, improving concurrent performance.\n3. Security & ClassLoading: Strings carry critical security parameters (database URLs, usernames, passwords, network sockets). If mutable, an adversary could modify connection endpoints after security validation checks (TOCTOU attacks).\n4. HashCode Caching: Immutability guarantees that a String's hashCode never changes. It is calculated lazily once and cached, enabling ultra-fast lookups when used as HashMap/HashSet keys.",
    "bullet_points": [
      "Enables String Constant Pool (SCP) memory sharing.",
      "Guarantees absolute thread-safety without lock overhead.",
      "Caches hashCode for instant O(1) HashMap key operations and secures network/file I/O."
    ],
    "code_snippet": {
      "language": "java",
      "code": "String s1 = \"Prepunite\";\nString s2 = \"Prepunite\"; // Reuses identical memory address in SCP\nSystem.out.println(s1 == s2); // true"
    },
    "pro_tip": "When asked: 'How does hashCode caching work?' Point to java.lang.String source: private int hash; is calculated once and stored in the field.",
    "company_tags": [
      "Amazon",
      "Google",
      "Microsoft",
      "TCS"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 51
  },
  {
    "id": "int-java-052",
    "topic_id": "topic-java",
    "title": "What is the difference between String s = \"abc\" and String s = new String(\"abc\")?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "The two declarations allocate memory completely differently:\n\n1. String s = \"abc\" (String Literal):\n   - The JVM checks the String Constant Pool (SCP) inside the Java Heap.\n   - If \"abc\" already exists, 's' simply points directly to the existing pool instance.\n   - If not, \"abc\" is created in the SCP and 's' points to it.\n   - Only 0 or 1 object is created.\n\n2. String s = new String(\"abc\"):\n   - Two objects may be created: First, the literal \"abc\" is placed in the SCP if not present already. Second, the 'new' operator explicitly forces the allocation of a brand-new, distinct String object in the regular non-pool Java Heap.\n   - 's' points to the heap object, NOT the SCP object.",
    "bullet_points": [
      "Literal syntax uses the String Constant Pool, preventing duplicate allocations.",
      "'new String()' always allocates a distinct new object in non-pool heap memory.",
      "Comparing a literal with a new String using '==' yields false due to different memory addresses."
    ],
    "code_snippet": {
      "language": "java",
      "code": "String s1 = \"Hello\";\nString s2 = new String(\"Hello\");\nSystem.out.println(s1 == s2);      // false (SCP vs Heap)\nSystem.out.println(s1.equals(s2)); // true (Content matches)"
    },
    "pro_tip": "Always clarify: 'new String()' creates at least 1 object (on heap) and at most 2 objects (if literal wasn't in SCP yet).",
    "company_tags": [
      "Infosys",
      "Wipro",
      "Amazon",
      "Cognizant"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 52
  },
  {
    "id": "int-java-053",
    "topic_id": "topic-java",
    "title": "What does the String intern() method do, and how does it optimize memory?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "The intern() method provides programmatic access to the String Constant Pool:\n\nWhen s.intern() is invoked:\n1. The JVM checks if an equal String (by equals()) already exists in the String Constant Pool.\n2. If present, intern() returns the reference to the pooled instance.\n3. If absent, the string is added to the pool and its reference is returned.\n\nUse Case & Memory Optimization:\n- When reading millions of duplicate strings (e.g. state names, country codes, category tags) from a database or JSON payload, calling .intern() deduplicates them, allowing thousands of duplicate heap strings to be collected by GC while all references point to a single pooled instance.",
    "bullet_points": [
      "intern() returns the canonical reference from the String Constant Pool.",
      "Deduplicates identical heap strings, freeing significant heap memory.",
      "Enables reference equality ('==') comparison instead of .equals() for interned strings."
    ],
    "code_snippet": {
      "language": "java",
      "code": "String s1 = new String(\"Java\"); // In heap\nString s2 = s1.intern();         // Returns SCP reference\nString s3 = \"Java\";             // Literal in SCP\n\nSystem.out.println(s1 == s2); // false\nSystem.out.println(s2 == s3); // true!"
    },
    "pro_tip": "Note on Java 8+: String deduplication can also be enabled automatically in G1 GC via -XX:+UseStringDeduplication without modifying application code.",
    "company_tags": [
      "Amazon",
      "Oracle",
      "Goldman Sachs"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 53
  },
  {
    "id": "int-java-054",
    "topic_id": "topic-java",
    "title": "What is the difference between String, StringBuilder, and StringBuffer?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Comparison across mutability, performance, and thread safety:\n\n1. java.lang.String: Immutable. Any concatenation (using '+') creates a new String object on the heap, causing significant memory churn in loops.\n2. java.lang.StringBuffer: Mutable character sequence. Thread-safe because its methods (append, insert, delete) are synchronized. Incurs locking overhead in single-threaded contexts. Introduced in Java 1.0.\n3. java.lang.StringBuilder: Mutable character sequence. Non-synchronized and NOT thread-safe. Faster than StringBuffer because it eliminates lock contention. Introduced in Java 5; preferred for single-threaded string manipulations.",
    "bullet_points": [
      "String is immutable; StringBuffer and StringBuilder are mutable.",
      "StringBuffer is thread-safe (synchronized methods); StringBuilder is not.",
      "StringBuilder is significantly faster and standard for single-threaded operations."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// High performance loop concatenation:\nStringBuilder sb = new StringBuilder(1000);\nfor (int i = 0; i < 1000; i++) {\n    sb.append(i).append(\",\");\n}\nString result = sb.toString();"
    },
    "pro_tip": "Modern javac compilers automatically translate simple '+' concatenations (e.g. String s = a + b) into StringBuilder or StringConcatFactory (Java 9+ invokedynamic).",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 54
  },
  {
    "id": "int-java-055",
    "topic_id": "topic-java",
    "title": "What is the contract between equals() and hashCode() in Java?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "The contract defined in java.lang.Object guarantees correctness when using hash-based collections (HashMap, HashSet, Hashtable):\n\nContract Rules:\n1. If two objects are equal according to equals(Object), calling hashCode() on each must produce the exact same integer result.\n2. If two objects produce the same hashCode(), they are NOT necessarily equal (this is a Hash Collision).\n3. If two objects are not equal according to equals(), their hashCodes may or may not be equal.\n4. Consistency: Multiple invocations of hashCode() on the same object must consistently return the same integer provided no fields used in equals() are modified.\n\nConsequence of Violation:\n- If you override equals() without overriding hashCode(), equal objects will have different hash codes, causing HashMap to place and search for them in different hash buckets. As a result, map.get(key) will return null even if an equal key was inserted!",
    "bullet_points": [
      "If a.equals(b) is true, a.hashCode() MUST equal b.hashCode().",
      "If hashCodes match, objects may or may not be equal (hash collision).",
      "Overriding equals() without hashCode() breaks HashMap, causing lost lookups."
    ],
    "code_snippet": {
      "language": "java",
      "code": "public class User {\n    private int id;\n    private String name;\n\n    @Override\n    public boolean equals(Object o) {\n        if (this == o) return true;\n        if (!(o instanceof User u)) return false;\n        return id == u.id && Objects.equals(name, u.name);\n    }\n\n    @Override\n    public int hashCode() {\n        return Objects.hash(id, name);\n    }\n}"
    },
    "pro_tip": "Always emphasize: 'Whenever you override equals(), you MUST override hashCode().'",
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Uber"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 55
  },
  {
    "id": "int-java-056",
    "topic_id": "topic-java",
    "title": "What is Compact Strings in Java 9+, and how did it reduce memory consumption by 50%?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Prior to Java 9, java.lang.String stored characters in a UTF-16 char[] array, consuming 2 bytes (16 bits) for every single character, even though the vast majority of application strings consist of single-byte ASCII characters (LATIN-1).\n\nCompact Strings (JEP 254 in Java 9):\n- Replaced char[] with a byte[] value array plus a 1-byte 'coder' flag.\n- Coder flags:\n  - LATIN1 (0): If all characters fit within 1 byte (ISO-8859-1 / ASCII), each character uses only 1 byte in the byte[] array.\n  - UTF16 (1): If any character requires Unicode (e.g. emojis or Asian glyphs), characters are stored using 2 bytes per char.\n- Result: Decreased heap memory usage of Java applications by 15-30% out of the box with zero code changes.",
    "bullet_points": [
      "Replaced char[] with byte[] + coder flag in java.lang.String (Java 9).",
      "Uses 1 byte per char for Latin-1/ASCII strings; falls back to 2 bytes for Unicode.",
      "Reduces heap memory consumption of strings by up to 50%."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// Internal String representation in Java 9+:\npublic final class String {\n    private final byte[] value;\n    private final byte coder;\n    static final byte LATIN1 = 0;\n    static final byte UTF16  = 1;\n}"
    },
    "pro_tip": "Demonstrates deep knowledge of JDK version evolutions and memory profiling.",
    "company_tags": [
      "Oracle",
      "Amazon",
      "Morgan Stanley"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 56
  },
  {
    "id": "int-java-057",
    "topic_id": "topic-java",
    "title": "Why does 'String s = null; System.out.println(s + \"hello\");' print 'nullhello' instead of throwing NPE?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "In Java, the string concatenation operator '+' has special handling for null operands defined in the Java Language Specification (JLS \u00a715.18.1):\n\nMechanics:\n- When concatenating using '+', if one operand is null, Java does NOT invoke s.toString() on the null reference.\n- Instead, the compiler and runtime convert null references using String.valueOf(s), which explicitly checks: if (obj == null) return \"null\";\n- Therefore, null is converted to the four-character literal string \"null\", resulting in \"nullhello\".\n- In contrast, calling s.concat(\"hello\") directly invokes a method on a null reference, which immediately throws java.lang.NullPointerException.",
    "bullet_points": [
      "The '+' operator uses String.valueOf(obj), converting null into the string \"null\".",
      "Avoids NullPointerException during string concatenation.",
      "Calling methods directly (e.g. s.concat() or s.length()) throws NullPointerException."
    ],
    "code_snippet": {
      "language": "java",
      "code": "String s = null;\nSystem.out.println(s + \"hello\"); // Prints \"nullhello\"\n// s.concat(\"hello\");            // Throws java.lang.NullPointerException!"
    },
    "pro_tip": "A classic trick question in campus recruitment tests and written technical screening rounds.",
    "company_tags": [
      "TCS",
      "Accenture",
      "Cognizant"
    ],
    "frequency": "MEDIUM",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 57
  },
  {
    "id": "int-java-058",
    "topic_id": "topic-java",
    "title": "What are Java Text Blocks (Java 15+), and how do they handle indentation and escapes?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Text Blocks (standardized in Java 15, JEP 378) provide multi-line string literals enclosed within triple quotes (\"\"\").\n\nKey Features:\n1. Multi-line Strings: Avoids messy escape characters (\\n, \\\") when defining JSON, SQL queries, HTML, or regex patterns.\n2. Incidental Whitespace Stripping: The compiler calculates the minimum common indentation of all non-empty lines and strips it automatically, preserving relative indentation.\n3. Trailing Line Escape: A trailing backslash (\\) suppresses the newline character, allowing long single-line strings to be formatted cleanly across multiple editor lines.",
    "bullet_points": [
      "Triple quotes (\"\"\") define multi-line string literals without escape sequences.",
      "Automatically strips incidental indentation while keeping relative alignment.",
      "Ideal for embedded SQL queries, JSON payloads, and HTML templates."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// Clean JSON payload with Text Blocks:\nString json = \"\"\"\n    {\n        \"name\": \"Chandu\",\n        \"role\": \"Engineer\"\n    }\n    \"\"\";"
    },
    "pro_tip": "Remember: The opening \"\"\" must be followed by a line terminator; you cannot place content on the same line as the opening triple quotes.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Meta"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 58
  },
  {
    "id": "int-java-059",
    "topic_id": "topic-java",
    "title": "What is the difference between Checked and Unchecked Exceptions in Java?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Java's Exception hierarchy branches from java.lang.Throwable into Error and Exception:\n\n1. Checked Exceptions (Compile-time): Direct subclasses of Exception, excluding RuntimeException (e.g. IOException, SQLException, ClassNotFoundException). The compiler enforces the 'Catch or Specify' requirement: you must handle them via try-catch or declare them via 'throws'. They represent recoverable failure conditions beyond the program's direct control (e.g. missing network file).\n2. Unchecked Exceptions (Runtime): Subclasses of java.lang.RuntimeException (e.g. NullPointerException, ArrayIndexOutOfBoundsException, IllegalArgumentException). The compiler does NOT force you to catch or declare them. They typically represent programming bugs, logic errors, or API misuse that should be fixed in code rather than caught.",
    "bullet_points": [
      "Checked exceptions inherit from Exception (excluding RuntimeException); checked by compiler.",
      "Unchecked exceptions inherit from RuntimeException; indicate programming bugs.",
      "Errors (e.g., OutOfMemoryError) represent fatal JVM infrastructure failures."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// Checked: Must declare or catch\npublic void readFile() throws IOException {\n    FileReader fr = new FileReader(\"test.txt\");\n}\n\n// Unchecked: No compilation requirement\npublic void divide(int a, int b) {\n    int res = a / b; // ArithmeticException if b == 0\n}"
    },
    "pro_tip": "A senior design tip: Modern Java frameworks (Spring, Hibernate) wrap checked exceptions into unchecked RuntimeExceptions to avoid polluting API method signatures.",
    "company_tags": [
      "Amazon",
      "TCS",
      "Infosys",
      "Google"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 59
  },
  {
    "id": "int-java-060",
    "topic_id": "topic-java",
    "title": "What is the difference between final, finally, and finalize in Java?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Though sharing similar names, their roles are completely unrelated:\n\n1. final: A keyword/modifier used to declare constants (final variable), prevent method overriding (final method), or prevent class inheritance (final class).\n2. finally: A block used in exception handling with try-catch. It ALWAYS executes whether an exception is thrown or not, ensuring guaranteed cleanup of critical resources (e.g. closing file/db handles).\n3. finalize(): A protected method of java.lang.Object called by the Garbage Collector before reclaiming an unreachable object's memory. Officially deprecated in Java 9 due to non-deterministic execution.",
    "bullet_points": [
      "final: Modifier for constants, non-overridable methods, and non-inheritable classes.",
      "finally: Block in try-catch that is guaranteed to execute for resource cleanup.",
      "finalize(): Deprecated Object method invoked by GC before memory deallocation."
    ],
    "code_snippet": {
      "language": "java",
      "code": "final int MAX = 100;\ntry {\n    // risky code\n} finally {\n    System.out.println(\"Guaranteed cleanup execution\");\n}"
    },
    "pro_tip": "This is one of the top 3 most frequently asked Java interview screening questions of all time.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro",
      "Cognizant",
      "Accenture"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 60
  },
  {
    "id": "int-java-061",
    "topic_id": "topic-java",
    "title": "Under what specific conditions will a finally block NOT execute in Java?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "A finally block is designed to execute unconditionally, but there are 4 specific scenarios where it will NOT execute:\n\n1. System.exit(): When System.exit(0) or Runtime.getRuntime().exit(status) is invoked inside the try or catch block, the JVM process terminates immediately without executing finally.\n2. JVM Crash / Fatal Error: If the JVM encounters an unrecoverable system crash (SIGKILL, segmentation fault in native JNI code, OutOfMemoryError in GC threads).\n3. Thread Death / Halt: If the thread executing the try block is killed via Runtime.getRuntime().halt() or OS-level kill -9.\n4. Infinite Loop / Deadlock: If the try block enters an infinite while(true) loop without returning or hangs permanently on a thread deadlock.",
    "bullet_points": [
      "System.exit() terminates the JVM process immediately, skipping finally.",
      "JVM fatal crashes or OS SIGKILL terminate the runtime.",
      "Infinite loops or thread deadlocks in try prevent execution from ever reaching finally."
    ],
    "code_snippet": {
      "language": "java",
      "code": "try {\n    System.out.println(\"Inside try\");\n    System.exit(0); // Halts JVM\n} finally {\n    System.out.println(\"Inside finally\"); // WILL NEVER PRINT!\n}"
    },
    "pro_tip": "If the interviewer asks: 'What if a return statement is in try?' Answer: The finally block STILL executes before the method actually returns to the caller!",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Goldman Sachs"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 61
  },
  {
    "id": "int-java-062",
    "topic_id": "topic-java",
    "title": "What happens if both try/catch and finally blocks contain return statements?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "If both the try/catch block and the finally block contain a 'return' statement, the return statement in the finally block OVERRIDES and suppresses any return value or exception produced by the try or catch block!\n\nExecution Mechanics:\n- The try block evaluates its return expression and stashes the result in a temporary slot.\n- Before the method returns, control transfers to the finally block.\n- If the finally block executes its own 'return', that value becomes the final method return value, silently discarding the try block's return value.\n- Even worse: If the try block threw an exception, a return inside finally will swallow the exception completely, making debugging an absolute nightmare. For this reason, placing return inside finally is a severe code smell flagged by SonarQube.",
    "bullet_points": [
      "Return in finally overrides and suppresses return statements in try and catch.",
      "Swallows any unhandled exception thrown in try/catch without warning.",
      "Considered a dangerous antipattern flagged by static analysis tools."
    ],
    "code_snippet": {
      "language": "java",
      "code": "public int test() {\n    try {\n        return 10;\n    } finally {\n        return 20; // Silently overwrites 10 -> Returns 20!\n    }\n}"
    },
    "pro_tip": "Warn the interviewer immediately that writing return inside finally is a critical code quality violation.",
    "company_tags": [
      "Google",
      "Uber",
      "Amazon"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 62
  },
  {
    "id": "int-java-063",
    "topic_id": "topic-java",
    "title": "How does Try-With-Resources work in Java 7+, and what is the AutoCloseable interface?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Try-With-Resources (Java 7) automates the closing of resources, completely eliminating manual finally blocks and resource leak bugs:\n\nMechanics:\n- Any class that implements java.lang.AutoCloseable (or java.io.Closeable) can be declared inside the try(...) statement parentheses.\n- The compiler automatically generates code that calls .close() on each declared resource in reverse order of declaration when the block exits (normally or via exception).\n- Closes resources even if an exception occurs inside the try body.\n- Suppressed Exceptions: If both the try block and close() throw exceptions, the try block exception is thrown to the caller while the close() exception is attached as a Suppressed Exception (retrievable via e.getSuppressed()).",
    "bullet_points": [
      "Resources declared in try(...) are closed automatically in reverse declaration order.",
      "Requires the resource to implement java.lang.AutoCloseable.",
      "Suppressed exceptions are preserved and accessible via e.getSuppressed()."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// Clean and safe: No manual finally block needed!\ntry (BufferedReader br = new BufferedReader(new FileReader(\"data.txt\"))) {\n    System.out.println(br.readLine());\n} // br.close() is automatically called here"
    },
    "pro_tip": "Notice that close() is invoked BEFORE any catch or finally block associated with the try-with-resources statement executes.",
    "company_tags": [
      "Amazon",
      "Adobe",
      "Oracle"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 63
  },
  {
    "id": "int-java-064",
    "topic_id": "topic-java",
    "title": "What are Suppressed Exceptions in Java Try-With-Resources?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "In traditional try-catch-finally, if an exception occurred in the try block AND another exception occurred in the finally block (e.g. while closing a stream), the finally block exception masked and completely swallowed the original try exception.\n\nSuppressed Exceptions (Java 7+):\n- With try-with-resources, the primary exception thrown in the try block is preserved and propagated up the stack.\n- Any secondary exceptions thrown during the automatic closing of resources are caught and appended to the primary exception as 'Suppressed Exceptions'.\n- Developers can inspect them using Throwable.getSuppressed(), ensuring that critical root-cause diagnostic information is never lost.",
    "bullet_points": [
      "Prevents close() exceptions from masking the root-cause try block exception.",
      "Secondary exceptions are attached to the primary exception.",
      "Retrieved using throwable.getSuppressed()."
    ],
    "code_snippet": {
      "language": "java",
      "code": "try (BadResource r = new BadResource()) {\n    throw new RuntimeException(\"Primary Error\");\n} catch (Exception e) {\n    System.out.println(e.getMessage()); // \"Primary Error\"\n    for (Throwable suppressed : e.getSuppressed()) {\n        System.out.println(\"Suppressed: \" + suppressed.getMessage());\n    }\n}"
    },
    "pro_tip": "Highlight this feature when contrasting modern Java try-with-resources against legacy Java 6 finally blocks.",
    "company_tags": [
      "Microsoft",
      "Bloomberg",
      "Salesforce"
    ],
    "frequency": "MEDIUM",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 64
  },
  {
    "id": "int-java-065",
    "topic_id": "topic-java",
    "title": "What is the difference between 'throw' and 'throws' keywords in Java?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Though used together, they serve distinct roles in exception control flow:\n\n1. throw: A statement used to explicitly instantiate and throw an exception object inside a method body (e.g. throw new IllegalArgumentException(\"Invalid age\")). Immediately halts sequential execution.\n2. throws: A keyword used in the method signature to declare that the method may propagate one or more checked exceptions to its caller (e.g. void read() throws IOException, SQLException). Acts as a contract warning callers to handle or re-declare those exceptions.",
    "bullet_points": [
      "throw is used inside method bodies to trigger an exception instance.",
      "throws is used in method signatures to declare potential checked exceptions.",
      "throw is followed by an exception instance; throws is followed by exception class names."
    ],
    "code_snippet": {
      "language": "java",
      "code": "public void checkAge(int age) throws InvalidAgeException { // 'throws' declares\n    if (age < 18) {\n        throw new InvalidAgeException(\"Underage\");        // 'throw' executes\n    }\n}"
    },
    "pro_tip": "Point out that 'throw' is followed by an object instance (new Exception()), whereas 'throws' is followed by class names separated by commas.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 65
  },
  {
    "id": "int-java-066",
    "topic_id": "topic-java",
    "title": "Can you catch multiple exceptions in a single catch block (Multi-Catch block)? What are the rules?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Introduced in Java 7, a single catch block can handle multiple disjoint exception types using the pipe operator (|).\n\nRules:\n1. Disjoint Hierarchy Only: The exceptions listed in the multi-catch block CANNOT have an inheritance relationship (subclass-superclass). For example, catch (FileNotFoundException | IOException e) causes a compile-time error because FileNotFoundException is already an IOException.\n2. Implicitly Final: The catch parameter variable 'e' in a multi-catch block is implicitly final. You cannot reassign 'e' inside the catch block (e.g. e = new Exception() is prohibited).",
    "bullet_points": [
      "Enables handling multiple exceptions using the pipe (|) separator in one block.",
      "Exception types must be disjoint; compiler rejects parent and child in same block.",
      "The exception parameter variable is implicitly final."
    ],
    "code_snippet": {
      "language": "java",
      "code": "try {\n    process();\n} catch (SQLException | IOException e) { // Disjoint checked exceptions\n    logger.error(\"Operation failed: \" + e.getMessage());\n    // e = new IOException(); // COMPILE ERROR: e is implicitly final!\n}"
    },
    "pro_tip": "Mention that Multi-Catch significantly reduces code duplication compared to cascading identical catch blocks.",
    "company_tags": [
      "Amazon",
      "Oracle",
      "Paypal"
    ],
    "frequency": "MEDIUM",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 66
  },
  {
    "id": "int-java-067",
    "topic_id": "topic-java",
    "title": "How does HashMap work internally in Java 8? Explain Hashing, Bucketing, and Treeification.",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "HashMap is an array of Node buckets (Node<K,V>[] table) with an initial default capacity of 16 and a load factor of 0.75:\n\n1. Hashing & Index Calculation:\n   - When put(key, value) is called, it calculates hash = (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16) (XOR shift distributes higher bits).\n   - Bucket index is calculated using bitwise AND: index = hash & (n - 1) (where n is array capacity, always a power of 2).\n2. Collision Handling:\n   - If two keys map to the same bucket index, they form a linked list.\n3. Treeification (Java 8 Optimization):\n   - In Java 7, collisions formed simple linked lists with O(n) search time.\n   - In Java 8, when a bucket's linked list reaches TREEIFY_THRESHOLD (8 items) AND the total table capacity is at least MIN_TREEIFY_CAPACITY (64), the linked list is converted into a balanced Red-Black Tree (TreeNode).\n   - This improves worst-case collision lookup time from O(n) to O(log n)!\n   - If items drop to UNTREEIFY_THRESHOLD (6 items) during resizing, it converts back to a linked list.",
    "bullet_points": [
      "Calculates bucket index via hash & (capacity - 1) with XOR bit shifting.",
      "Collisions form linked lists; converted to Red-Black Trees at 8 elements (table capacity >= 64).",
      "Improves worst-case lookup from O(n) to O(log n)."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// Internal Java 8 HashMap thresholds:\nstatic final int TREEIFY_THRESHOLD = 8;\nstatic final int UNTREEIFY_THRESHOLD = 6;\nstatic final int MIN_TREEIFY_CAPACITY = 64;\nstatic final float DEFAULT_LOAD_FACTOR = 0.75f;"
    },
    "pro_tip": "Explain why array capacity is always a power of two: It allows calculating (hash % capacity) via fast bitwise AND (hash & (n-1)).",
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
    "sort_order": 67
  },
  {
    "id": "int-java-068",
    "topic_id": "topic-java",
    "title": "What is the Load Factor in HashMap, and how does Resizing (Rehashing) work?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "The Load Factor measures how full the HashMap is allowed to get before its capacity is automatically doubled:\n\n1. Default Load Factor: 0.75 (optimal trade-off between time complexity and memory space overhead).\n2. Threshold Calculation: Threshold = Capacity * LoadFactor (e.g. 16 * 0.75 = 12 elements).\n3. Rehashing (Resizing):\n   - When the number of stored entries exceeds the threshold, resize() is triggered.\n   - A new node array is allocated with DOUBLE the capacity (e.g. 16 -> 32).\n   - Java 8 Optimization: Instead of recalculating hashes, Java 8 checks the new bit in the hash (hash & oldCap). If 0, the node stays at the same index; if 1, the node moves to (index + oldCap). This preserves relative order without recomputing hashes!",
    "bullet_points": [
      "Default load factor 0.75 triggers resizing when capacity exceeds 75% full.",
      "Resizing doubles the array capacity and reallocates nodes.",
      "Java 8 checks the high-order bit (hash & oldCap) to relocate nodes without full rehashing."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// Sizing a HashMap for 10,000 items to avoid expensive resizing:\nint initialCapacity = (int) Math.ceil(10_000 / 0.75) + 1; // 13,334 -> 16,384\nMap<String, String> map = new HashMap<>(initialCapacity);"
    },
    "pro_tip": "Pro-tip: Always size HashMaps in advance if the expected number of elements is known to prevent multiple expensive resizing cycles.",
    "company_tags": [
      "Amazon",
      "Uber",
      "Oracle"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 68
  },
  {
    "id": "int-java-069",
    "topic_id": "topic-java",
    "title": "What is the difference between HashMap, Hashtable, and ConcurrentHashMap?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Comparison across thread safety, null support, and concurrency:\n\n1. HashMap: Non-thread-safe. Allows one null key and multiple null values. Fast because methods are non-synchronized. Used in single-threaded operations.\n2. Hashtable: Legacy class (Java 1.0). Thread-safe because every public method is guarded by a coarse-grained synchronized lock on 'this'. Extremely slow under contention. Prohibits null keys and null values.\n3. ConcurrentHashMap: Modern thread-safe concurrent map (Java 5+). Never locks the entire map! In Java 8, it uses CAS (Compare-And-Swap) for empty bucket insertion and synchronizes ONLY the specific head node of the bucket during updates. Allows concurrent reads without locking. Prohibits null keys and null values.",
    "bullet_points": [
      "HashMap is not thread-safe; allows null keys and values.",
      "Hashtable locks the entire map on every operation (legacy, slow).",
      "ConcurrentHashMap locks only the head node of individual buckets using CAS + synchronized."
    ],
    "code_snippet": {
      "language": "java",
      "code": "Map<String, Integer> map = new ConcurrentHashMap<>();\nmap.put(\"A\", 1); // Thread-safe without coarse locking\n// map.put(null, 2); // Throws NullPointerException!"
    },
    "pro_tip": "When asked: 'Why does ConcurrentHashMap not allow null keys or values?' Doug Lea answered: In concurrent maps, map.get(k) returning null would be ambiguous\u2014is the key absent, or is the value null?",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Goldman Sachs"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 69
  },
  {
    "id": "int-java-070",
    "topic_id": "topic-java",
    "title": "How does ArrayList dynamically grow in Java? What is its Growth Factor?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "ArrayList is backed by an internal Object[] array with an initial default capacity of 10 (when first element is added):\n\nGrowth Mechanics:\n1. When the array fills up and a new element is added, ensureCapacityInternal() triggers grow().\n2. New Capacity Calculation: int newCapacity = oldCapacity + (oldCapacity >> 1);\n   - Bitwise right shift by 1 divides by 2. Thus, the new capacity is 1.5x (50% increase) of the old capacity (e.g. 10 -> 15 -> 22 -> 33).\n3. Array Copy: Arrays.copyOf() allocates the new larger array and invokes native System.arraycopy() to copy all elements to the new backing array.\n4. Amortized Time: Appending to an ArrayList is O(1) amortized, but O(n) in the rare frame where resizing occurs.",
    "bullet_points": [
      "ArrayList grows by 50% (newCapacity = oldCapacity + (oldCapacity >> 1)).",
      "Initial default capacity is 10 upon first element addition.",
      "Uses native System.arraycopy() for fast memory copying; amortized O(1) append."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// Pre-allocating capacity avoids 1.5x arraycopy overhead:\nList<Integer> list = new ArrayList<>(100_000);"
    },
    "pro_tip": "In vector, the capacity doubles (2x / 100% increase), whereas ArrayList grows by 50% (1.5x) to prevent excessive memory waste.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 70
  },
  {
    "id": "int-java-071",
    "topic_id": "topic-java",
    "title": "What is the difference between ArrayList and LinkedList in Java? When should you use which?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Core differences in architecture and performance:\n\n1. Internal Structure:\n   - ArrayList is backed by a contiguous, resizable Object[] array.\n   - LinkedList is backed by a Doubly-Linked List where each Node contains data, a 'prev' pointer, and a 'next' pointer.\n2. Time Complexity:\n   - Random Access (get(i)): ArrayList is O(1); LinkedList is O(n) (must traverse from head or tail).\n   - Insertion/Deletion at beginning: LinkedList is O(1); ArrayList is O(n) (must shift elements).\n   - Appending to end: Both are O(1) amortized.\n3. Memory & CPU Cache Locality:\n   - ArrayList has excellent CPU cache locality because array elements are contiguous in RAM.\n   - LinkedList scatters node objects across heap RAM, causing CPU cache misses, and incurs heavy 24-byte pointer overhead per node.\n   - Modern Best Practice: ArrayList is almost always faster than LinkedList in real-world benchmarks, even for insertions, due to CPU L1/L2 cache prefetching!",
    "bullet_points": [
      "ArrayList provides O(1) random access; LinkedList is O(n).",
      "ArrayList stores elements contiguously, providing superior CPU cache locality.",
      "LinkedList has heavy node pointer memory overhead and causes CPU cache misses."
    ],
    "code_snippet": {
      "language": "java",
      "code": "List<String> arrayList = new ArrayList<>(); // Fast random access, low memory\nList<String> linkedList = new LinkedList<>(); // Doubly-linked list"
    },
    "pro_tip": "Interviewers love asking: 'Why is ArrayList often faster than LinkedList even for insertions in the middle?' Answer: CPU cache prefetching and hardware-accelerated System.arraycopy outperform node pointer chasing in RAM.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Paypal"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 71
  },
  {
    "id": "int-java-072",
    "topic_id": "topic-java",
    "title": "What is the difference between Fail-Fast and Fail-Safe Iterators?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Iterators react differently when the underlying collection is modified concurrently during iteration:\n\n1. Fail-Fast Iterators (e.g. ArrayList, HashMap, HashSet):\n   - Operates directly on the actual collection data.\n   - Maintains an internal modification counter called modCount.\n   - If the collection is structurally modified (add, remove) while iterating by any means other than the iterator's own remove() method, it immediately throws java.util.ConcurrentModificationException.\n\n2. Fail-Safe / Weakly-Consistent Iterators (e.g. CopyOnWriteArrayList, ConcurrentHashMap):\n   - Operates on a cloned copy or weakly-consistent snapshot of the collection.\n   - Does NOT throw ConcurrentModificationException if the original collection is modified.\n   - CopyOnWriteArrayList creates an entirely new array copy on every write, while iteration reads the untouched old snapshot.",
    "bullet_points": [
      "Fail-Fast checks modCount; throws ConcurrentModificationException on structural modifications.",
      "Fail-Safe operates on a snapshot or cloned array, never throwing ConcurrentModificationException.",
      "Fail-Fast: ArrayList, HashMap; Fail-Safe: CopyOnWriteArrayList, ConcurrentHashMap."
    ],
    "code_snippet": {
      "language": "java",
      "code": "List<String> list = new ArrayList<>(List.of(\"A\", \"B\"));\nfor (String s : list) {\n    if (s.equals(\"A\")) list.remove(s); // THROWS ConcurrentModificationException!\n}\n// Safe way: Use iterator.remove() or list.removeIf()"
    },
    "pro_tip": "Always demonstrate list.removeIf(s -> s.equals(\"A\")) or using Iterator.remove() as the clean idiomatic solution to avoid ConcurrentModificationException.",
    "company_tags": [
      "Amazon",
      "Google",
      "Goldman Sachs"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 72
  },
  {
    "id": "int-java-073",
    "topic_id": "topic-java",
    "title": "What is the difference between Comparable and Comparator in Java?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Both interfaces sort objects, but their design and coupling differ:\n\n1. java.lang.Comparable<T>:\n   - Defines the Natural Sorting Order for a class.\n   - The class itself must implement Comparable and override int compareTo(T o).\n   - Only provides a single sorting strategy.\n   - Affects the class definition directly (internal sorting).\n\n2. java.util.Comparator<T>:\n   - Defines Custom Sorting Orders external to the target class.\n   - Implemented as separate classes or lambda expressions overriding int compare(T o1, T o2).\n   - Allows creating multiple distinct sorting strategies for the same class (e.g. sort by name, sort by salary, sort by age).\n   - Does not require modifying the source code of the target class.",
    "bullet_points": [
      "Comparable defines single natural ordering via compareTo(T o) inside the class.",
      "Comparator defines multiple custom orderings via compare(T o1, T o2) outside the class.",
      "Java 8 added Comparator.comparing() and .thenComparing() for fluent comparator chaining."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// Fluent Java 8 Comparator:\nComparator<Employee> byNameThenSalary = Comparator\n    .comparing(Employee::getName)\n    .thenComparingDouble(Employee::getSalary).reversed();\nemployees.sort(byNameThenSalary);"
    },
    "pro_tip": "Rule of thumb: Use Comparable if there is an obvious natural order (like numbers or dates). Use Comparator for customizable, dynamic sorting requirements.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 73
  },
  {
    "id": "int-java-074",
    "topic_id": "topic-java",
    "title": "How does HashSet work internally in Java? Does it maintain insertion order?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "HashSet is backed entirely by a java.util.HashMap under the hood:\n\nMechanics:\n1. Internal Map: Inside HashSet, elements are stored as KEYS in a private backing HashMap: private transient HashMap<E,Object> map;\n2. Dummy Constant Value: Since HashMap requires key-value pairs, HashSet associates every added element key with a single shared dummy Object constant called PRESENT: private static final Object PRESENT = new Object();\n3. add() Method: Calling set.add(e) executes: return map.put(e, PRESENT) == null;\n4. Insertion Order: HashSet does NOT maintain insertion order because elements are distributed across hash buckets based on their hashCode().\n5. Preserving Order: To preserve insertion order, use LinkedHashSet (maintains a running doubly-linked list across entries). To preserve sorted natural order, use TreeSet (Red-Black Tree).",
    "bullet_points": [
      "HashSet is an adapter backed internally by a HashMap.",
      "Elements are stored as HashMap keys; values are a dummy Object constant (PRESENT).",
      "Does not maintain order; use LinkedHashSet for insertion order and TreeSet for sorted order."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// Internal JDK HashSet implementation:\npublic boolean add(E e) {\n    return map.put(e, PRESENT) == null;\n}"
    },
    "pro_tip": "A standard interview trap: 'Can a HashSet contain null?' Answer: Yes, exactly one null element (because HashMap permits one null key).",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Accenture"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 74
  },
  {
    "id": "int-java-075",
    "topic_id": "topic-java",
    "title": "What is CopyOnWriteArrayList, and when is it preferred over Collections.synchronizedList?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "CopyOnWriteArrayList is a thread-safe variant of ArrayList designed for read-heavy concurrent scenarios:\n\nMechanics:\n- Every write operation (add, set, remove) creates a brand-new internal copy of the underlying backing array, modifies the clone, and atomically updates the volatile array reference to the new clone.\n- Read operations (get, iterator) access the volatile array snapshot directly without ANY locking or synchronization overhead, making reads lightning-fast.\n\nWhen Preferred over SynchronizedList:\n- Ideal when reads vastly outnumber writes (e.g. event listeners, cache registries, configuration observers).\n- Iterators never throw ConcurrentModificationException and do not require synchronizing during iteration.\n- Antipattern for write-heavy workloads: Creating new array copies on every write causes severe memory allocation overhead.",
    "bullet_points": [
      "Thread-safe list that creates a fresh clone of the backing array on every write.",
      "Read operations require zero locks or synchronization.",
      "Best for read-heavy workloads (e.g., event listener lists); terrible for write-heavy systems."
    ],
    "code_snippet": {
      "language": "java",
      "code": "List<String> subscribers = new CopyOnWriteArrayList<>();\nsubscribers.add(\"user@test.com\"); // Writes create array copy\n// Reads and loops iterate over stable snapshot without lock contention:\nfor (String s : subscribers) {\n    notifyUser(s);\n}"
    },
    "pro_tip": "Always state the trade-off: CopyOnWriteArrayList trades write performance and memory space for zero-lock read throughput.",
    "company_tags": [
      "Amazon",
      "Goldman Sachs",
      "Netflix"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 75
  },
  {
    "id": "int-java-076",
    "topic_id": "topic-java",
    "title": "What is the difference between PriorityQueue and standard Queues in Java?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Standard queues (e.g. ArrayDeque, LinkedList) process elements in First-In-First-Out (FIFO) order. PriorityQueue processes elements based on Priority:\n\nKey Attributes of PriorityQueue:\n1. Data Structure: Backed by a resizable array representing a Min-Heap (or Max-Heap with custom Comparator).\n2. Ordering: Head of the queue is the least element according to natural ordering or custom comparator.\n3. Complexities:\n   - offer() / add(): O(log n) (sift-up operation).\n   - poll() / remove(): O(log n) (sift-down operation).\n   - peek(): O(1) (inspects array[0]).\n4. Thread-Safety: Not thread-safe (use PriorityBlockingQueue for concurrent systems).\n5. Prohibits null elements.",
    "bullet_points": [
      "Implements a priority heap rather than FIFO queue.",
      "Head of the queue always holds the minimum element (Min-Heap by default).",
      "offer() and poll() take O(log n); peek() takes O(1)."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// Max-Heap PriorityQueue for Top-K problems:\nPriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());\nmaxHeap.offer(10);\nmaxHeap.offer(30);\nmaxHeap.offer(20);\nSystem.out.println(maxHeap.poll()); // 30 (highest priority)"
    },
    "pro_tip": "Emphasize: PriorityQueue iterators do NOT iterate in sorted order. They iterate in arbitrary heap array order. Only poll() guarantees sorted retrieval.",
    "company_tags": [
      "Google",
      "Uber",
      "Amazon"
    ],
    "frequency": "MEDIUM",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 76
  },
  {
    "id": "int-java-077",
    "topic_id": "topic-java",
    "title": "How does LinkedHashMap maintain insertion order or access order?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "LinkedHashMap extends HashMap and combines hash table lookups with doubly-linked list ordering:\n\nMechanics:\n1. Doubly-Linked List: Every Entry node contains before and after pointers linking all entries into a global doubly-linked list.\n2. Insertion Order (Default): As entries are added, they are appended to the tail of the linked list, preserving insertion order during iteration.\n3. Access Order (LRU Cache mode): When initialized with accessOrder = true (new LinkedHashMap<>(16, 0.75f, true)), whenever get() or put() touches an entry, that node is automatically detached and relocated to the tail of the list.\n4. LRU Eviction: Overriding removeEldestEntry(Map.Entry eldest) allows building a clean, production-ready Least Recently Used (LRU) Cache in 5 lines of code!",
    "bullet_points": [
      "Combines HashMap buckets with a running doubly-linked list of entries.",
      "Maintains insertion order by default; can switch to access-order for LRU caches.",
      "Overriding removeEldestEntry() provides a built-in LRU eviction policy."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// Building an LRU Cache in Java using LinkedHashMap:\npublic class LRUCache<K, V> extends LinkedHashMap<K, V> {\n    private final int maxCapacity;\n    public LRUCache(int maxCapacity) {\n        super(maxCapacity, 0.75f, true); // true = access-order\n        this.maxCapacity = maxCapacity;\n    }\n    @Override\n    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {\n        return size() > maxCapacity; // Automatically evicts oldest item\n    }\n}"
    },
    "pro_tip": "This is one of the most frequently asked design questions: 'How to implement an LRU Cache in Java without external libraries?'",
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Salesforce"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 77
  },
  {
    "id": "int-java-078",
    "topic_id": "topic-java",
    "title": "What is the difference between ArrayDeque and LinkedList when implementing a Stack or Queue?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Both implement Deque (Double-Ended Queue), but ArrayDeque is almost universally superior:\n\n1. ArrayDeque:\n   - Backed by a circular resizable Object[] array.\n   - No node allocation overhead; elements are stored compactly in contiguous memory.\n   - Excellent CPU cache locality.\n   - Does not allow null elements.\n2. LinkedList:\n   - Backed by a doubly-linked list allocating a separate Node object for every element.\n   - Incurs heavy memory overhead (24 bytes per node) and triggers GC thrashing.\n   - Causes CPU cache misses while chasing pointers in heap RAM.\n\nRecommendation: Java documentation officially advises using ArrayDeque rather than LinkedList or legacy Stack class for stacks and queues.",
    "bullet_points": [
      "ArrayDeque uses a circular array; LinkedList allocates heap nodes.",
      "ArrayDeque has zero node allocation overhead and superior cache locality.",
      "Official Java recommendation: Prefer ArrayDeque over LinkedList and legacy Stack."
    ],
    "code_snippet": {
      "language": "java",
      "code": "Deque<Integer> stack = new ArrayDeque<>();\nstack.push(10);\nstack.push(20);\nSystem.out.println(stack.pop()); // 20"
    },
    "pro_tip": "Point out that the legacy java.util.Stack class extends Vector, synchronizing all operations and causing unnecessary locking overhead.",
    "company_tags": [
      "Amazon",
      "Apple",
      "Oracle"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 78
  },
  {
    "id": "int-java-079",
    "topic_id": "topic-java",
    "title": "What are Unmodifiable Collections vs Immutable Collections in Java?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Introduced at different points in Java's evolution:\n\n1. Unmodifiable Collections (Collections.unmodifiableList(list)):\n   - A wrapper view around an existing mutable backing collection.\n   - Calling mutating methods (add, remove) on the unmodifiable view throws UnsupportedOperationException.\n   - BUT NOT IMMUTABLE: If the underlying backing collection is modified directly, those changes are immediately reflected in the unmodifiable view!\n2. Immutable Collections (List.of(), Set.of(), Map.of() in Java 9+):\n   - Truly immutable, standalone instances that hold no reference to any backing collection.\n   - Compact, null-hostile (throws NullPointerException if any element is null), and structurally frozen.\n   - Highly optimized internal memory layouts.",
    "bullet_points": [
      "Collections.unmodifiableList() is only a read-only wrapper around a mutable backing list.",
      "List.of() creates a truly immutable collection with no backing reference.",
      "List.of() rejects null elements; unmodifiableList permits null if backing list has it."
    ],
    "code_snippet": {
      "language": "java",
      "code": "List<String> raw = new ArrayList<>(List.of(\"A\"));\nList<String> unmodifiable = Collections.unmodifiableList(raw);\nraw.add(\"B\"); // Modifying backing list directly!\nSystem.out.println(unmodifiable); // [A, B] (Reflects change!)\n\nList<String> trulyImmutable = List.of(\"A\", \"B\"); // Truly immutable"
    },
    "pro_tip": "Always use List.of() and Map.of() in modern Java 9+ code for true immutability.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Meta"
    ],
    "frequency": "MEDIUM",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 79
  },
  {
    "id": "int-java-080",
    "topic_id": "topic-java",
    "title": "What is the identityHashCode() method in System class, and how does it differ from object.hashCode()?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "System.identityHashCode(Object x) returns the default hash code generated by the JVM identity hashing algorithm for the given object reference, identical to the value that would be returned by default java.lang.Object.hashCode(), regardless of whether the object's class has overridden hashCode().\n\nKey Differences:\n- obj.hashCode(): Can be overridden to return value-based equality hashes (e.g., \"hello\".hashCode() is derived from its characters).\n- System.identityHashCode(obj): Completely bypasses any overridden hashCode() method and computes hash based on the object's internal memory identity.\n- Used by IdentityHashMap to compare keys via reference equality ('==') rather than value equality.",
    "bullet_points": [
      "identityHashCode() returns the default JVM object hash regardless of overrides.",
      "Bypasses custom overridden hashCode() implementations.",
      "Used internally by IdentityHashMap to test reference equality."
    ],
    "code_snippet": {
      "language": "java",
      "code": "String s1 = new String(\"test\");\nString s2 = new String(\"test\");\nSystem.out.println(s1.hashCode() == s2.hashCode()); // true (Overridden value hash)\nSystem.out.println(System.identityHashCode(s1) == System.identityHashCode(s2)); // false!"
    },
    "pro_tip": "Mention that IdentityHashMap uses System.identityHashCode() and '==' to compare keys, useful for serialization graph traversal.",
    "company_tags": [
      "Oracle",
      "Google",
      "Bloomberg"
    ],
    "frequency": "MEDIUM",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 80
  },
  {
    "id": "int-java-081",
    "topic_id": "topic-java",
    "title": "What is the difference between Process and Thread? What is the Java Thread lifecycle?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Process vs Thread:\n- Process: An executing program instance with its own isolated address space, OS resources, and memory protection. Inter-process communication (IPC) is expensive.\n- Thread: The smallest unit of CPU execution inside a process. Threads within the same process share the heap and memory address space, but retain their own private JVM Stack and PC Register.\n\nJava Thread Lifecycle (Thread.State enum):\n1. NEW: Thread instantiated but not yet started via start().\n2. RUNNABLE: Executing in JVM or waiting for OS CPU scheduling.\n3. BLOCKED: Waiting to acquire a monitor lock to enter a synchronized block/method.\n4. WAITING: Waiting indefinitely for another thread to perform a specific action (via wait(), join(), or LockSupport.park()).\n5. TIMED_WAITING: Waiting for a specified duration (via sleep(millis), wait(timeout), or join(timeout)).\n6. TERMINATED: Completed execution or aborted due to an uncaught exception.",
    "bullet_points": [
      "Process has isolated memory; threads share heap memory while having private stacks.",
      "6 Thread States: NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, TERMINATED.",
      "Calling start() transitions NEW to RUNNABLE; calling run() directly executes on the caller thread!"
    ],
    "code_snippet": {
      "language": "java",
      "code": "Thread t = new Thread(() -> System.out.println(\"Worker running\"));\nSystem.out.println(t.getState()); // NEW\nt.start();                         // Transitions to RUNNABLE"
    },
    "pro_tip": "Trap question: 'What happens if you call t.run() instead of t.start()?' Answer: run() executes synchronously as a normal method on the calling thread; no new thread is spawned!",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 81
  },
  {
    "id": "int-java-082",
    "topic_id": "topic-java",
    "title": "What is the difference between Runnable and Callable interfaces in Java?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Comparison across return values and exception handling:\n\n1. java.lang.Runnable (Java 1.0):\n   - Defines: public void run();\n   - Cannot return any computation result.\n   - Cannot throw checked exceptions (must handle checked exceptions internally via try-catch).\n   - Executed directly by Thread or ExecutorService.\n\n2. java.util.concurrent.Callable<V> (Java 5):\n   - Defines: public V call() throws Exception;\n   - Returns a generic computed value of type V.\n   - Can throw checked exceptions directly to the caller.\n   - Submitted to an ExecutorService, returning a Future<V> to retrieve the result asynchronously.",
    "bullet_points": [
      "Runnable: void run(); cannot return results or throw checked exceptions.",
      "Callable<V>: V call() throws Exception; returns computed value and throws exceptions.",
      "Callable works with ExecutorService.submit(), returning a Future<V>."
    ],
    "code_snippet": {
      "language": "java",
      "code": "Callable<Integer> task = () -> {\n    Thread.sleep(1000);\n    return 42; // Returns value\n};\nExecutorService executor = Executors.newSingleThreadExecutor();\nFuture<Integer> future = executor.submit(task);\nSystem.out.println(future.get()); // 42"
    },
    "pro_tip": "Always mention that Future.get() is a blocking call that halts the calling thread until the Callable completes.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Goldman Sachs"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 82
  },
  {
    "id": "int-java-083",
    "topic_id": "topic-java",
    "title": "What is the role of the 'volatile' keyword in Java? Explain Visibility and Instruction Reordering.",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "The 'volatile' keyword in Java addresses two critical CPU hardware challenges:\n\n1. Visibility (CPU Cache Coherency):\n   - Modern multi-core CPUs keep local L1/L2 hardware caches. If Thread A modifies a variable, the updated value may remain in CPU A's local cache without being flushed to shared RAM, leaving Thread B on CPU B reading stale memory indefinitely.\n   - Declaring a variable 'volatile' forces all writes to flush immediately to main memory and all reads to fetch directly from main memory, guaranteeing visibility across threads.\n2. Instruction Reordering & Memory Barriers:\n   - Compilers and CPU out-of-order execution engines reorder instructions for efficiency.\n   - 'volatile' establishes a Happens-Before relationship by inserting hardware Memory Barriers (Fence instructions), preventing instruction reordering before and after volatile reads/writes.\n3. Limitation: Volatile does NOT guarantee atomicity! Operations like count++ (read-modify-write) are not atomic under volatile. For atomicity, use AtomicInteger or synchronized.",
    "bullet_points": [
      "Guarantees visibility by flushing writes to main memory and invalidating CPU caches.",
      "Prevents CPU instruction reordering via memory barriers (Happens-Before).",
      "Does NOT guarantee atomicity for compound operations like count++."
    ],
    "code_snippet": {
      "language": "java",
      "code": "public class SharedFlag {\n    private volatile boolean running = true;\n    public void stop() { running = false; } // Instantly visible to worker thread\n    public void run() {\n        while (running) { /* do work */ }\n    }\n}"
    },
    "pro_tip": "A legendary interview trap: 'Is volatile sufficient for count++?' Answer: No! count++ is 3 distinct bytecode instructions: getfield, iadd, putfield. Race conditions will occur.",
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Uber"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 83
  },
  {
    "id": "int-java-084",
    "topic_id": "topic-java",
    "title": "How does the Double-Checked Locking pattern work for Thread-Safe Singleton? Why is 'volatile' mandatory?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Double-Checked Locking provides lazy, thread-safe Singleton initialization with minimal synchronization overhead:\n\nWhy 'volatile' is strictly mandatory:\n- The instruction 'instance = new Singleton()' is NOT atomic. The JVM executes 3 steps:\n  1. Allocate memory for the Singleton object.\n  2. Initialize the object (run constructor).\n  3. Assign memory address to the 'instance' reference variable.\n- Due to CPU instruction reordering, the JVM can reorder this to: Step 1 -> Step 3 -> Step 2!\n- If Thread A executes Step 1 and Step 3, 'instance' is now non-null, but uninitialized! If Thread B enters the method at this exact instant, the outer check (instance == null) evaluates to false, returning a half-initialized, corrupted object to Thread B!\n- Declaring 'private static volatile Singleton instance;' prevents instruction reordering via memory barriers, guaranteeing safety.",
    "bullet_points": [
      "Minimizes synchronization overhead by checking nullness before and after acquiring lock.",
      "volatile is mandatory to prevent instruction reordering during object instantiation.",
      "Without volatile, another thread can read a partially initialized object reference."
    ],
    "code_snippet": {
      "language": "java",
      "code": "public class Singleton {\n    private static volatile Singleton instance; // volatile is mandatory!\n    private Singleton() {}\n    public static Singleton getInstance() {\n        if (instance == null) { // 1st Check (No locking)\n            synchronized (Singleton.class) {\n                if (instance == null) { // 2nd Check (With lock)\n                    instance = new Singleton();\n                }\n            }\n        }\n        return instance;\n    }\n}"
    },
    "pro_tip": "Alternative modern best practice: Bill Pugh Singleton pattern using a static inner helper class, which relies on JVM class loading guarantees without locking.",
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Goldman Sachs"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 84
  },
  {
    "id": "int-java-085",
    "topic_id": "topic-java",
    "title": "What is the difference between synchronized method and synchronized block? What is an Object Monitor?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Synchronization in Java is based on internal entity locks called Object Monitors:\n\n1. Object Monitor (Intrinsic Lock):\n   - Every object in Java is associated with an internal monitor. Only one thread can hold the monitor lock at any time.\n2. Synchronized Method:\n   - Locks the entire method on 'this' (for instance methods) or ClassName.class (for static methods).\n   - Coarse-grained: Entire method execution is serialized, reducing concurrent throughput.\n3. Synchronized Block:\n   - Fine-grained: Locks only a critical section of code on a specific target object monitor (synchronized(lock) { ... }).\n   - Vastly superior because non-critical calculations before and after the critical section execute concurrently.",
    "bullet_points": [
      "Synchronized method locks the whole method on 'this' or Class object.",
      "Synchronized block provides fine-grained locking on specific monitor objects.",
      "JVM uses monitorenter and monitorexit bytecode instructions to acquire and release locks."
    ],
    "code_snippet": {
      "language": "java",
      "code": "public class Counter {\n    private int count = 0;\n    private final Object lock = new Object(); // Dedicated monitor lock\n    \n    public void increment() {\n        // Non-critical operations run concurrently\n        synchronized (lock) {\n            count++; // Only critical section is synchronized\n        }\n    }\n}"
    },
    "pro_tip": "Best practice: Always synchronize on private final Object lock = new Object(); rather than 'this' to prevent external client code from locking on your instance.",
    "company_tags": [
      "Amazon",
      "Paypal",
      "Adobe"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 85
  },
  {
    "id": "int-java-086",
    "topic_id": "topic-java",
    "title": "What is ThreadLocal in Java, and what is its memory leak risk in thread pools?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "ThreadLocal provides thread-local variables. Each thread accessing a ThreadLocal variable has its own independent, initialized copy of the variable stored in its private ThreadLocalMap:\n\nUse Cases:\n- Storing per-thread context: User session ID, security tokens, or transaction IDs.\n- Thread-safe instances of non-thread-safe legacy tools (e.g. SimpleDateFormat).\n\nMemory Leak Risk in Thread Pools (Tomcat / ExecutorService):\n- In application servers, threads are pooled and reused across HTTP requests rather than being destroyed.\n- ThreadLocalMap uses WeakReferences for keys (the ThreadLocal instance), but Strong References for values.\n- If a thread returns to the pool without calling threadLocal.remove(), the value remains pinned in memory forever by the pooled thread, causing catastrophic memory leaks!\n- Golden Rule: Always clean up inside a finally block: try { ... } finally { threadLocal.remove(); }.",
    "bullet_points": [
      "Provides thread-confined state isolated to the executing thread.",
      "ThreadLocalMap keys are weak references; values are strong references.",
      "In thread pools, failing to call threadLocal.remove() causes severe memory leaks."
    ],
    "code_snippet": {
      "language": "java",
      "code": "public class ContextHolder {\n    private static final ThreadLocal<String> userCtx = new ThreadLocal<>();\n    public static void set(String user) { userCtx.set(user); }\n    public static String get() { return userCtx.get(); }\n    public static void clear() { userCtx.remove(); } // Prevent memory leaks!\n}"
    },
    "pro_tip": "Mention Java 21 Scoped Values (JEP 446) as the modern, immutable, and leak-free alternative to ThreadLocal in Virtual Threads.",
    "company_tags": [
      "Google",
      "Amazon",
      "Netflix",
      "Uber"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 86
  },
  {
    "id": "int-java-087",
    "topic_id": "topic-java",
    "title": "What is the difference between wait(), notify(), and sleep() in Java?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Fundamental differences in thread synchronization:\n\n1. wait() & notify() / notifyAll():\n   - Defined in java.lang.Object (not Thread) because locks are associated with objects.\n   - Must be called from inside a synchronized context; throws IllegalMonitorStateException otherwise.\n   - Releases the monitor lock while waiting, allowing other waiting threads to acquire the lock and proceed.\n   - Woken up via notify(), notifyAll(), or timeout.\n\n2. Thread.sleep(millis):\n   - Defined as a static method in java.lang.Thread.\n   - Can be called from anywhere without synchronization.\n   - Holds and retains all acquired locks while sleeping! No other thread can access synchronized blocks guarded by that lock.\n   - Wakes up after the specified time expires or if interrupted.",
    "bullet_points": [
      "wait() releases the monitor lock; sleep() holds the lock while sleeping.",
      "wait() is defined in Object class; sleep() is static in Thread class.",
      "wait() must be called inside a synchronized block; sleep() does not require synchronization."
    ],
    "code_snippet": {
      "language": "java",
      "code": "synchronized (lock) {\n    while (!condition) {\n        lock.wait(); // Releases 'lock' monitor and waits\n    }\n    // Resumes with lock re-acquired\n}"
    },
    "pro_tip": "Trap question: 'Why must wait() always be called inside a while loop rather than an if statement?' Answer: To guard against Spurious Wakeups!",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 87
  },
  {
    "id": "int-java-088",
    "topic_id": "topic-java",
    "title": "What are Java Thread Pools, and what are the core parameters of ThreadPoolExecutor?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Thread pools manage a collection of reusable worker threads, eliminating the heavy OS overhead of repeatedly creating and tearing down threads:\n\nCore Parameters of ThreadPoolExecutor:\n1. corePoolSize: The minimum number of worker threads kept alive in the pool, even if idle.\n2. maximumPoolSize: The maximum allowable number of threads in the pool when the work queue fills up.\n3. keepAliveTime: Duration non-core idle threads wait before terminating.\n4. unit: TimeUnit for keepAliveTime.\n5. workQueue: BlockingQueue holding submitted tasks awaiting execution (e.g. ArrayBlockingQueue, LinkedBlockingQueue).\n6. threadFactory: Factory for creating new threads (naming, priority, daemon status).\n7. handler (RejectedExecutionHandler): Policy invoked when tasks are rejected (AbortPolicy, CallerRunsPolicy, DiscardPolicy, DiscardOldestPolicy).",
    "bullet_points": [
      "Eliminates per-task thread creation overhead through worker thread reuse.",
      "7 Parameters: corePoolSize, maxPoolSize, keepAliveTime, unit, workQueue, threadFactory, rejectionHandler.",
      "Executors.newFixedThreadPool() uses an unbounded queue, posing OutOfMemoryError risks."
    ],
    "code_snippet": {
      "language": "java",
      "code": "ThreadPoolExecutor executor = new ThreadPoolExecutor(\n    4,                         // corePoolSize\n    8,                         // maximumPoolSize\n    60L, TimeUnit.SECONDS,     // keepAliveTime\n    new ArrayBlockingQueue<>(100), // Bounded queue\n    new ThreadPoolExecutor.CallerRunsPolicy() // Rejection policy\n);"
    },
    "pro_tip": "Production tip: Never use Executors.newFixedThreadPool() or newCachedThreadPool() in production because they use unbounded queues (Integer.MAX_VALUE), which can cause OutOfMemoryError under traffic spikes.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Salesforce"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 88
  },
  {
    "id": "int-java-089",
    "topic_id": "topic-java",
    "title": "What are Java 21 Virtual Threads (Project Loom), and how do they revolutionize concurrency?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Virtual Threads (standardized in Java 21, JEP 444) are lightweight threads managed entirely by the JVM runtime rather than 1:1 OS platform threads:\n\nHow Virtual Threads Work:\n- Traditional Platform Threads: Mapped 1:1 to OS kernel threads. Heavyweight (~1MB stack size, expensive OS context switches). A server can only support a few thousand before running out of memory.\n- Virtual Threads (M:N Model): The JVM multiplexes millions of virtual threads onto a small pool of carrier OS threads (ForkJoinPool). Virtual thread stacks are tiny (bytes to kilobytes) stored on the Java heap.\n- Non-Blocking I/O Unmounting: When a virtual thread performs blocking I/O (database query, network call, Thread.sleep()), the JVM unmounts the virtual thread from its carrier thread. The carrier thread immediately executes other work. When the I/O completes, the JVM remounts the virtual thread onto an available carrier thread.\n- Result: Enables writing simple synchronous, blocking code that scales to millions of concurrent connections!",
    "bullet_points": [
      "Lightweight JVM-managed threads decoupling Java threads from 1:1 OS kernel threads.",
      "Millions of virtual threads can run concurrently with negligible RAM usage.",
      "Unmounts from carrier thread on blocking I/O, eliminating thread starvation."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// Launching 100,000 concurrent Virtual Threads effortlessly:\ntry (var executor = Executors.newVirtualThreadPerTaskExecutor()) {\n    for (int i = 0; i < 100_000; i++) {\n        executor.submit(() -> {\n            Thread.sleep(1000); // Unmounts carrier thread; zero CPU wasted!\n            return \"Done\";\n        });\n    }\n}"
    },
    "pro_tip": "Virtual Thread Pinning warning: Avoid using 'synchronized' blocks around blocking I/O because it pins the virtual thread to its carrier OS thread; use java.util.concurrent.locks.ReentrantLock instead!",
    "company_tags": [
      "Google",
      "Amazon",
      "Netflix",
      "Meta"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 89
  },
  {
    "id": "int-java-090",
    "topic_id": "topic-java",
    "title": "What are the 4 conditions required for Deadlock to occur (Coffman Conditions)? How do you prevent it?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "A Deadlock is a situation where two or more threads are permanently blocked, each holding a lock that the other needs.\n\n4 Coffman Conditions (All 4 must hold simultaneously for deadlock to occur):\n1. Mutual Exclusion: At least one resource must be held in a non-shareable mode.\n2. Hold and Wait: A thread holds at least one resource and is waiting to acquire additional resources held by other threads.\n3. No Preemption: Resources cannot be forcibly confiscated from a thread holding them.\n4. Circular Wait: A closed chain of threads exists where each thread holds a resource needed by the next thread (Thread 1 -> Lock A -> Lock B; Thread 2 -> Lock B -> Lock A).\n\nPrevention:\n- Eliminate Circular Wait by enforcing Strict Lock Ordering across the entire codebase.\n- Use timed lock acquisition via Lock.tryLock(timeout) rather than synchronized, releasing locks if unable to acquire all needed resources.",
    "bullet_points": [
      "4 Coffman conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.",
      "Break deadlock by breaking ANY ONE of the 4 conditions.",
      "Primary prevention: Enforce global lock acquisition ordering and use tryLock() with timeouts."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// Lock Ordering prevents circular wait deadlock:\npublic void transfer(Account from, Account to, double amt) {\n    Account first = from.id < to.id ? from : to;\n    Account second = from.id < to.id ? to : from;\n    synchronized (first) {\n        synchronized (second) {\n            from.debit(amt);\n            to.credit(amt);\n        }\n    }\n}"
    },
    "pro_tip": "If asked: 'How to detect deadlocks in production?' Answer: Use jstack <pid> or ThreadMXBean.findDeadlockedThreads() to inspect JVM thread dumps.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Goldman Sachs"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 90
  },
  {
    "id": "int-java-091",
    "topic_id": "topic-java",
    "title": "What is a Functional Interface in Java? What is the purpose of @FunctionalInterface?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "A Functional Interface (Single Abstract Method or SAM interface) is an interface that declares exactly ONE abstract method.\n\nKey Attributes:\n1. Role: Serves as the foundational type for Lambda Expressions and Method References introduced in Java 8.\n2. Default & Static Methods: A functional interface can contain any number of default, static, and private methods, as long as it has exactly one abstract method.\n3. Object Class Methods: Abstract methods that override public methods of java.lang.Object (e.g. equals(), toString()) do NOT count against the single abstract method rule.\n4. @FunctionalInterface Annotation: Optional, but highly recommended. It instructs the compiler to verify that the interface conforms strictly to the SAM rule, generating a compile error if a second abstract method is added.",
    "bullet_points": [
      "Contains exactly one abstract method (Single Abstract Method / SAM).",
      "Target type for lambda expressions and method references.",
      "Can contain multiple default and static methods without violating SAM."
    ],
    "code_snippet": {
      "language": "java",
      "code": "@FunctionalInterface\npublic interface Transformer<T, R> {\n    R transform(T input); // The single abstract method\n    default void log() { System.out.println(\"Transforming\"); } // Allowed\n}"
    },
    "pro_tip": "Remember: Runnable, Callable, Comparator, and ActionListener are all retrofitted as functional interfaces in Java 8.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 91
  },
  {
    "id": "int-java-092",
    "topic_id": "topic-java",
    "title": "What are the 4 core Built-in Functional Interfaces in java.util.function?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Java 8 provides a rich set of standardized functional interfaces in java.util.function:\n\n1. Predicate<T>: Represents a boolean-valued function of one argument.\n   - Method: boolean test(T t);\n   - Use Case: Filtering collections (e.g. stream.filter(x -> x > 10)).\n2. Function<T, R>: Represents a function that accepts one argument of type T and produces a result of type R.\n   - Method: R apply(T t);\n   - Use Case: Transforming data (e.g. stream.map(User::getName)).\n3. Consumer<T>: Represents an operation that accepts a single input argument and returns no result (side-effect producer).\n   - Method: void accept(T t);\n   - Use Case: Iterating/printing (e.g. list.forEach(System.out::println)).\n4. Supplier<T>: Represents a supplier of results with zero arguments.\n   - Method: T get();\n   - Use Case: Lazy evaluation and factory instantiation (e.g. Optional.orElseGet(User::new)).",
    "bullet_points": [
      "Predicate<T>: boolean test(T t) -> Conditional evaluations.",
      "Function<T, R>: R apply(T t) -> Type transformations.",
      "Consumer<T>: void accept(T t) -> Side-effect executions.",
      "Supplier<T>: T get() -> Lazy factory generation."
    ],
    "code_snippet": {
      "language": "java",
      "code": "Predicate<String> isBlank = String::isBlank;\nFunction<String, Integer> length = String::length;\nConsumer<String> printer = System.out::println;\nSupplier<Double> randomizer = Math::random;"
    },
    "pro_tip": "Interviewers frequently ask for two-argument variants: BiPredicate<T, U>, BiFunction<T, U, R>, and BiConsumer<T, U>.",
    "company_tags": [
      "Amazon",
      "Oracle",
      "Paypal"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 92
  },
  {
    "id": "int-java-093",
    "topic_id": "topic-java",
    "title": "What is the difference between Intermediate and Terminal Operations in Java Streams?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Streams process data pipelines lazily through two distinct categories of operations:\n\n1. Intermediate Operations (Lazy):\n   - Return a new Stream instance.\n   - Lazy Execution: They do not perform any actual computation or traversal when called! They simply configure the pipeline.\n   - Examples: filter(), map(), flatMap(), distinct(), sorted(), limit(), skip().\n2. Terminal Operations (Eager):\n   - Traverse the stream, execute all pipeline transformations, and produce a non-stream result (List, count, boolean, void).\n   - A stream pipeline is ONLY evaluated when a terminal operation is invoked.\n   - Closes the stream: A stream cannot be reused once a terminal operation has executed.\n   - Examples: collect(), forEach(), count(), reduce(), anyMatch(), findFirst().",
    "bullet_points": [
      "Intermediate operations return a new Stream and execute lazily (filter, map).",
      "Terminal operations trigger pipeline execution and produce a final result (collect, forEach).",
      "Streams cannot be reused after a terminal operation has executed."
    ],
    "code_snippet": {
      "language": "java",
      "code": "List<String> names = List.of(\"Alice\", \"Bob\", \"Charlie\");\n// Intermediate: filter, map (Nothing executes yet!)\nvar stream = names.stream().filter(s -> s.startsWith(\"A\")).map(String::toUpperCase);\n// Terminal operation collect triggers pipeline processing:\nList<String> result = stream.collect(Collectors.toList());"
    },
    "pro_tip": "Common trick: 'Stream.of(\"a\", \"b\").peek(System.out::println);' prints nothing because no terminal operation was attached!",
    "company_tags": [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 93
  },
  {
    "id": "int-java-094",
    "topic_id": "topic-java",
    "title": "What is the difference between map() and flatMap() in Java Streams?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Both transform stream elements, but handle nesting differently:\n\n1. map() (One-to-One transformation):\n   - Takes a Function<T, R> that transforms each element into another single element.\n   - If the mapper function produces a stream or collection (e.g. List<List<String>>), map() returns a Stream of streams (Stream<Stream<R>>), preserving nesting.\n2. flatMap() (One-to-Many transformation + Flattening):\n   - Takes a Function<T, Stream<R>> that maps each element into a stream of zero or more items, and then flattens all those generated sub-streams into a single unified continuous stream (Stream<R>).\n   - Eliminates nested hierarchies (e.g. converting List<List<String>> into a flat List<String>).",
    "bullet_points": [
      "map(): 1-to-1 transformation; returns Stream<R>.",
      "flatMap(): 1-to-many transformation; flattens Stream<Stream<R>> into Stream<R>.",
      "flatMap() unpacks nested collections and Optional wrappers."
    ],
    "code_snippet": {
      "language": "java",
      "code": "List<List<String>> nested = List.of(\n    List.of(\"a\", \"b\"),\n    List.of(\"c\", \"d\")\n);\nList<String> flat = nested.stream()\n    .flatMap(Collection::stream) // Flattens inner lists into one stream\n    .collect(Collectors.toList()); // [a, b, c, d]"
    },
    "pro_tip": "Always remember: flatMap() is also used to unwrap nested Optionals: Optional<Optional<String>> -> Optional<String>.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Uber"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 94
  },
  {
    "id": "int-java-095",
    "topic_id": "topic-java",
    "title": "How does parallelStream() work, and when should you avoid using it?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "parallelStream() splits data into multiple sub-streams using Spliterator and processes them concurrently across CPU cores using the shared ForkJoinPool.commonPool():\n\nWhen to Avoid parallelStream():\n1. Small Datasets: Overhead of thread management, data splitting, and merging results is significantly slower than sequential iteration.\n2. Blocking I/O: Since it shares the global ForkJoinPool.commonPool(), any blocking operations (HTTP calls, DB queries) will starve all other components across the entire JVM application!\n3. Stateful / Non-Associative Operations: Operations that rely on order or mutable state (e.g. limit(), findFirst(), or accumulating to non-thread-safe lists) require synchronization, destroying parallel gains.\n\nIdeal Use Case: Large, in-memory CPU-bound computations with independent, stateless operations.",
    "bullet_points": [
      "Splits stream processing across CPU cores via ForkJoinPool.commonPool().",
      "Avoid for small datasets due to thread coordination overhead.",
      "Never use for blocking I/O because it starves the JVM-wide common ForkJoinPool."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// Parallel CPU-heavy computation:\nlong sum = LongStream.rangeClosed(1, 10_000_000)\n    .parallel()\n    .reduce(0, Long::sum);"
    },
    "pro_tip": "In web servers (Tomcat/Spring Boot), avoid parallelStream() because request threads already utilize multi-core concurrency.",
    "company_tags": [
      "Amazon",
      "Netflix",
      "Goldman Sachs"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 95
  },
  {
    "id": "int-java-096",
    "topic_id": "topic-java",
    "title": "What is java.util.Optional, and what are the best practices for using it?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Optional<T> is a container object introduced in Java 8 that may or may not contain a non-null value, designed to provide a fluent alternative to returning null and preventing NullPointerException:\n\nBest Practices (per Brian Goetz and Java Architecture Team):\n1. Method Return Types Only: Designed primarily as a return type for methods that might have 'no result' (e.g. findUserById()).\n2. Never use as Class Fields: Optional is not Serializable and adds 16-24 bytes of heap overhead per field.\n3. Never use as Method Parameters: Pass parameters normally or overload methods; passing Optional forces callers to wrap values unnecessarily.\n4. Avoid get() without isPresent(): Calling optional.get() on an empty Optional throws NoSuchElementException. Use orElse(), orElseGet(), or orElseThrow().\n5. orElse() vs orElseGet(): orElse(defaultVal) evaluates the fallback value eagerly every time; orElseGet(Supplier) evaluates lazily ONLY when empty.",
    "bullet_points": [
      "Container to represent optional return values and eliminate NullPointerExceptions.",
      "Best practice: Use only as method return types; never as class fields or method parameters.",
      "Prefer orElseGet() over orElse() to avoid evaluating fallback values eagerly."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// Idiomatic Optional usage:\nOptional<User> userOpt = findUser(id);\nString name = userOpt\n    .map(User::getName)\n    .orElseGet(() -> \"Guest\"); // Evaluated lazily"
    },
    "pro_tip": "Highlight the orElse vs orElseGet difference: orElse(new HeavyObject()) instantiates HeavyObject even if the Optional is present!",
    "company_tags": [
      "Google",
      "Amazon",
      "Salesforce"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 96
  },
  {
    "id": "int-java-097",
    "topic_id": "topic-java",
    "title": "What are the 4 types of Method References in Java 8?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Method References provide compact, readable syntax for lambda expressions that merely forward arguments to an existing method (using the '::' double colon operator):\n\n4 Types of Method References:\n1. Reference to a Static Method: ClassName::staticMethodName (e.g., Math::max instead of (a, b) -> Math.max(a, b)).\n2. Reference to an Instance Method of a Particular Object: instanceRef::instanceMethodName (e.g., System.out::println instead of x -> System.out.println(x)).\n3. Reference to an Instance Method of an Arbitrary Object of a Particular Type: ClassName::instanceMethodName (e.g., String::toUpperCase instead of s -> s.toUpperCase()).\n4. Reference to a Constructor: ClassName::new (e.g., ArrayList::new instead of () -> new ArrayList<>()).",
    "bullet_points": [
      "Static method: Class::staticMethod.",
      "Instance method of an existing object: obj::instanceMethod.",
      "Instance method of an arbitrary object of a type: Class::instanceMethod.",
      "Constructor reference: Class::new."
    ],
    "code_snippet": {
      "language": "java",
      "code": "List<String> words = List.of(\"apple\", \"banana\");\n// Arbitrary object instance method reference:\nwords.stream().map(String::toUpperCase).forEach(System.out::println);"
    },
    "pro_tip": "Explain: Method references improve performance slightly because the JVM uses invokedynamic to link direct method handles.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 97
  },
  {
    "id": "int-java-098",
    "topic_id": "topic-java",
    "title": "What is CompletableFuture, and how does it differ from traditional Future in Java?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "CompletableFuture (Java 8) revolutionized asynchronous, non-blocking concurrent programming in Java:\n\nLimitations of Traditional Future (Java 5):\n- Cannot be manually completed.\n- get() is strictly blocking, freezing the calling thread until computation finishes.\n- Cannot chain asynchronous callbacks or combine multiple independent futures without blocking.\n\nCompletableFuture Superpowers:\n1. Non-Blocking Callbacks: Attach callbacks that execute automatically upon completion (thenApply, thenAccept, thenRun).\n2. Asynchronous Chaining & Composition: thenCompose() (monadic flatMap) chains dependent futures sequentially; thenCombine() runs independent futures concurrently and combines their outputs.\n3. Exception Handling: built-in exceptionally() and handle() methods capture async errors gracefully without try-catch blocks.",
    "bullet_points": [
      "Provides non-blocking, event-driven asynchronous programming.",
      "Supports chaining callbacks (thenApply) and composing multiple futures (thenCombine).",
      "Handles async exceptions cleanly via exceptionally() and handle()."
    ],
    "code_snippet": {
      "language": "java",
      "code": "CompletableFuture.supplyAsync(() -> fetchUserData(userId))\n    .thenApply(user -> user.getEmail())\n    .thenAccept(email -> sendNotification(email))\n    .exceptionally(ex -> {\n        logger.error(\"Failed: \" + ex.getMessage());\n        return null;\n    });"
    },
    "pro_tip": "Senior tip: By default, CompletableFuture uses ForkJoinPool.commonPool(). For production I/O tasks, always pass a custom ThreadPoolExecutor: supplyAsync(task, customExecutor).",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Uber",
      "Meta"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 98
  },
  {
    "id": "int-java-099",
    "topic_id": "topic-java",
    "title": "What is the difference between findFirst() and findAny() in Java Streams?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Both return an Optional containing an element matching the filter, but behavior differs in parallel execution:\n\n1. findFirst():\n   - Deterministic: Always returns the very first element in the stream's encounter order.\n   - In parallel streams, maintaining strict encounter order requires significant synchronization overhead across threads, degrading parallel performance.\n2. findAny():\n   - Non-deterministic: Free to return ANY matching element found by any executing thread.\n   - In parallel streams, findAny() is vastly faster because whichever worker thread finds a match first terminates the search immediately (short-circuiting), with zero synchronization delay.\n- In sequential streams, findFirst() and findAny() usually return the exact same first element.",
    "bullet_points": [
      "findFirst() is deterministic and guarantees encounter order.",
      "findAny() is non-deterministic and returns the first element discovered by any thread.",
      "findAny() offers vastly superior performance in parallel streams."
    ],
    "code_snippet": {
      "language": "java",
      "code": "List<Integer> list = List.of(1, 2, 3, 4, 5);\n// In parallel, findAny returns whichever thread matches first:\nOptional<Integer> match = list.parallelStream()\n    .filter(n -> n > 2)\n    .findAny();"
    },
    "pro_tip": "Rule: Use findFirst() when exact order matters; use findAny() when you just need to know if any matching item exists.",
    "company_tags": [
      "Amazon",
      "Oracle",
      "Goldman Sachs"
    ],
    "frequency": "MEDIUM",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 99
  },
  {
    "id": "int-java-100",
    "topic_id": "topic-java",
    "title": "What is the difference between reduce() and collect() in Java Streams?",
    "category": "CORE_CS",
    "subject": "JAVA",
    "subject_label": "Java",
    "answer": "Both are terminal reduction operations, but differ fundamentally in mutability and performance:\n\n1. reduce() (Immutable Reduction):\n   - Combines stream elements into a single summary value by repeatedly applying a binary accumulator function (e.g. sum, min, max).\n   - Functional and stateless: It generates a new value on every step rather than mutating an existing accumulator.\n   - Inefficient for accumulating into collections: Accumulating into an ArrayList via reduce creates a new ArrayList on every iteration (O(n^2) allocations!).\n2. collect() (Mutable Reduction):\n   - Designed specifically to accumulate elements into a mutable container (like List, Set, Map, or StringBuilder) in-place without creating intermediate container objects.\n   - High performance: Mutates the existing container (supplier, accumulator, combiner).",
    "bullet_points": [
      "reduce() performs immutable reduction into a single primitive/value (sum, max).",
      "collect() performs mutable container reduction into collections (List, Map).",
      "Using reduce() to accumulate collections causes severe O(n^2) memory reallocation."
    ],
    "code_snippet": {
      "language": "java",
      "code": "// reduce for single values:\nint sum = Stream.of(1, 2, 3).reduce(0, Integer::sum);\n\n// collect for mutable accumulation:\nList<String> list = Stream.of(\"a\", \"b\").collect(Collectors.toList());"
    },
    "pro_tip": "End the interview by summarizing: 'reduce is for values; collect is for containers.'",
    "company_tags": [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 100
  },
  {
    "id": "int-c-001",
    "topic_id": "topic-c",
    "title": "What are the 4 fundamental stages of C program compilation?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Translating high-level C source code (.c) into an executable binary involves 4 sequential stages:\n\n1. Preprocessing (gcc -E):\n   - Strips comments.\n   - Expands all preprocessor directives (#include pastes header file contents, #define replaces macro constants).\n   - Evaluates conditional compilation (#ifdef, #endif).\n   - Generates a preprocessed text file (.i).\n2. Compilation (gcc -S):\n   - Performs lexical, syntactic, and semantic analysis on preprocessed code.\n   - Generates target CPU assembly code (.s).\n3. Assembly (gcc -c):\n   - Translates assembly instructions into raw machine code and relocatable object symbols.\n   - Generates an object file (.o or .obj).\n4. Linking (gcc):\n   - Resolves external symbols and function references across multiple object files.\n   - Combines object files with C standard library code (libc).\n   - Produces the final executable binary (a.out, .exe).",
    "bullet_points": [
      "4 Stages: Preprocessing (.i) -> Compilation (.s) -> Assembly (.o) -> Linking (executable).",
      "Preprocessing handles macros, headers, and comments.",
      "Linker resolves external symbols and attaches library code to produce the binary."
    ],
    "code_snippet": {
      "language": "bash",
      "code": "# Inspecting intermediate stages in GCC:\ngcc -E main.c -o main.i  # 1. Preprocessed output\ngcc -S main.i -o main.s  # 2. Assembly output\ngcc -c main.s -o main.o  # 3. Relocatable object binary\ngcc main.o -o main       # 4. Final linked executable"
    },
    "pro_tip": "Interviewers frequently ask: 'In which stage are syntax errors detected?' Answer: During Compilation (Stage 2).",
    "company_tags": [
      "TCS",
      "Infosys",
      "Intel",
      "Qualcomm"
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
    "title": "What is the difference between #include <stdio.h> and #include \"myheader.h\"?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "The search path algorithm used by the preprocessor differs:\n\n1. Angle Brackets (#include <file.h>):\n   - The preprocessor searches strictly within standard system library directories (e.g. /usr/include, /usr/local/include, or compiler toolchain include paths).\n   - Does NOT search the current working directory first.\n   - Used for standard C library headers.\n2. Double Quotes (#include \"file.h\"):\n   - The preprocessor searches the current directory (where the source file resides) FIRST.\n   - If the file is not found in the local directory, it falls back and searches the standard system library directories.\n   - Used for user-defined, project-specific headers.",
    "bullet_points": [
      "#include <file.h> searches only standard system directories.",
      "#include \"file.h\" searches current working directory first, then system paths.",
      "Use quotes for custom headers and angle brackets for standard C libraries."
    ],
    "code_snippet": {
      "language": "c",
      "code": "#include <stdio.h>    // Searches compiler system library paths\n#include \"my_math.h\"  // Searches local directory first, then system paths"
    },
    "pro_tip": "Mention the -I compiler flag: You can add custom directories to the system include search path using gcc -I/path/to/headers.",
    "company_tags": [
      "Qualcomm",
      "Texas Instruments",
      "Wipro"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 2
  },
  {
    "id": "int-c-003",
    "topic_id": "topic-c",
    "title": "What are Header Guards, and why are they necessary? What is #pragma once?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Header Guards prevent multiple inclusions of the same header file within a single compilation unit:\n\nWhy Necessary:\n- In large C projects, Header A might include Header C, and Header B might also include Header C. If main.c includes both Header A and B, Header C is included twice.\n- Without header guards, type definitions (structs, typedefs) inside Header C would be duplicated, causing fatal compiler errors: 'redefinition of struct/type'.\n\nMechanics:\n- Header Guards use preprocessor conditional directives (#ifndef, #define, #endif) to ensure the contents are parsed only on the first encounter.\n- Alternative: '#pragma once' is a non-standard but universally supported compiler directive placed at the top of headers. It is faster because the preprocessor skips opening the file entirely on repeated encounters.",
    "bullet_points": [
      "Header guards prevent duplicate type declarations caused by circular or multiple inclusions.",
      "Implemented using #ifndef HEADER_H, #define HEADER_H, and #endif.",
      "#pragma once is a faster compiler directive serving the same purpose."
    ],
    "code_snippet": {
      "language": "c",
      "code": "// Traditional Header Guard in my_header.h\n#ifndef MY_HEADER_H\n#define MY_HEADER_H\n\nstruct Data {\n    int id;\n};\n\n#endif // MY_HEADER_H"
    },
    "pro_tip": "Contrast #pragma once vs header guards: #pragma once is cleaner and faster, but can occasionally fail with symlinks or across distributed filesystems.",
    "company_tags": [
      "Intel",
      "NVIDIA",
      "Qualcomm"
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
    "title": "What are the dangers of Parameterized Macros vs Inline Functions in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Parameterized macros perform simple, unhygienic textual substitution before compilation without type checking, introducing subtle bugs:\n\nMajor Dangers:\n1. Operator Precedence Bug: If arguments are not enclosed in parentheses, expressions expand unexpectedly (e.g. #define SQUARE(x) x * x -> SQUARE(2 + 3) expands to 2 + 3 * 2 + 3 = 11 instead of 25!).\n2. Double Evaluation / Side-Effects Bug: If an argument with side-effects is passed (e.g. SQUARE(i++)), the expression evaluates i++ twice, corrupting data and producing undefined behavior.\n3. No Type Checking: Macros accept any type without validation.\n\nInline Functions (inline keyword in C99):\n- Handled by compiler, not preprocessor.\n- Enforces strict type checking.\n- Arguments are evaluated strictly ONCE.\n- Compiler can choose to inline code to eliminate function call overhead while guaranteeing safety.",
    "bullet_points": [
      "Macros do blind text substitution without type safety or scope.",
      "Macro arguments with side-effects (e.g., x++) get evaluated multiple times.",
      "Inline functions provide identical execution speed with full type safety."
    ],
    "code_snippet": {
      "language": "c",
      "code": "// Dangerous Macro Trap:\n#define SQUARE(x) ((x) * (x))\nint i = 3;\nint res = SQUARE(i++); // Expands to: ((i++) * (i++)) -> Undefined Behavior!\n\n// Safe Inline Function:\nstatic inline int square(int x) {\n    return x * x; // Evaluated safely once\n}"
    },
    "pro_tip": "Always remember: 'Always enclose every macro parameter and the entire macro body in parentheses: #define MULT(a, b) ((a) * (b))'.",
    "company_tags": [
      "Microsoft",
      "Apple",
      "ARM"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 4
  },
  {
    "id": "int-c-005",
    "topic_id": "topic-c",
    "title": "What do the Stringizing (#) and Token-Pasting (##) operators do in C macros?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "These are specialized preprocessor operators used in advanced macro metaprogramming:\n\n1. Stringizing Operator (#):\n   - Placed before a macro parameter in the replacement list.\n   - Converts the passed argument into a quoted string literal (e.g. #x -> \"x\").\n   - Widely used for debugging loggers, assertions, and printing variable names.\n2. Token-Pasting / Concatenation Operator (##):\n   - Merges two separate lexical tokens into a single valid composite token during preprocessing.\n   - Enables programmatic generation of variable names, struct fields, or specialized function definitions.",
    "bullet_points": [
      "# (Stringizing) converts a macro parameter into a quoted string literal.",
      "## (Token-Pasting) concatenates two tokens into a single syntactic identifier.",
      "Commonly used in logging frameworks, assert macros, and dynamic dispatch tables."
    ],
    "code_snippet": {
      "language": "c",
      "code": "// 1. Stringizing (#)\n#define PRINT_VAR(x) printf(#x \" = %d\\n\", x)\nint age = 25;\nPRINT_VAR(age); // Expands to: printf(\"age\" \" = %d\\n\", age);\n\n// 2. Token-Pasting (##)\n#define MAKE_FUNC(name) void run_##name() { printf(\"Running \" #name); }\nMAKE_FUNC(test); // Creates function: void run_test() { ... }"
    },
    "pro_tip": "If a macro argument is itself another macro, an extra indirection macro layer is required to expand it before stringizing.",
    "company_tags": [
      "Cisco",
      "NVIDIA",
      "Qualcomm"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 5
  },
  {
    "id": "int-c-006",
    "topic_id": "topic-c",
    "title": "What are Predefined Macros in C (__FILE__, __LINE__, __func__, __DATE__)?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "The C standard preprocessor provides built-in macros that automatically expand into metadata about the compilation context:\n\n1. __FILE__: Expands to a string literal containing the path of the current C source file.\n2. __LINE__: Expands to an integer representing the current source line number.\n3. __func__ (or __FUNCTION__): Standard C99 identifier containing the name of the current enclosing function as a string.\n4. __DATE__: String literal representing the date of compilation (e.g. \"Sep 14 2026\").\n5. __TIME__: String literal representing the time of compilation (e.g. \"19:15:00\").\n6. __STDC__: Defined as 1 if the compiler conforms to ISO C standards.\n\nUse Case: Foundational for implementing custom assertion engines and structured error logging.",
    "bullet_points": [
      "__FILE__ and __LINE__ track file name and current line for diagnostics.",
      "__func__ provides the enclosing function name (C99).",
      "Used universally across production systems for debugging and assert() macros."
    ],
    "code_snippet": {
      "language": "c",
      "code": "#define LOG_ERROR(msg) \\\n    printf(\"[ERROR] %s:%d in %s(): %s\\n\", __FILE__, __LINE__, __func__, msg)\n\nvoid connect() {\n    LOG_ERROR(\"Connection timed out\");\n}"
    },
    "pro_tip": "Notice the backslash (\\) at the end of macro lines: it allows multi-line macro definitions.",
    "company_tags": [
      "Amazon",
      "Texas Instruments",
      "Broadcom"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 6
  },
  {
    "id": "int-c-007",
    "topic_id": "topic-c",
    "title": "How does Conditional Compilation work (#if, #ifdef, #ifndef, #elif, #endif)?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Conditional compilation instructs the preprocessor to include or exclude specific blocks of code from compilation based on preprocessor conditions:\n\nKey Directives:\n- #ifdef FEATURE: Compiles the following block if FEATURE is defined.\n- #ifndef FEATURE: Compiles if FEATURE is NOT defined (standard for header guards).\n- #if CONDITION: Evaluates an integer constant expression (supports operators like ==, >, &&).\n- #elif: Else-if branch for #if.\n- #else: Fallback branch.\n- #endif: Terminates the conditional compilation block.\n\nReal-World Applications:\n- Cross-platform codebases (compiling Windows API vs Linux POSIX calls).\n- Toggling debug logging without runtime performance penalties.\n- Architecting hardware-specific driver register maps.",
    "bullet_points": [
      "Selectively compiles code blocks based on preprocessor symbol definitions.",
      "Zero runtime cost: excluded code is stripped before compilation.",
      "Essential for cross-platform portability and debug build flags."
    ],
    "code_snippet": {
      "language": "c",
      "code": "#ifdef _WIN32\n    #include <windows.h>\n#elif defined(__linux__)\n    #include <unistd.h>\n#endif\n\n#if DEBUG_LEVEL > 2\n    printf(\"Verbose tracing enabled\\n\");\n#endif"
    },
    "pro_tip": "Point out that compiler flags like -DDEBUG or -DVERSION=2 define macros directly from the build command line.",
    "company_tags": [
      "Intel",
      "Cisco",
      "Sony"
    ],
    "frequency": "MEDIUM",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 7
  },
  {
    "id": "int-c-008",
    "topic_id": "topic-c",
    "title": "What is the difference between a macro and a typedef in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "While both can alias names, they operate at completely different compilation layers:\n\n1. Scope & Layer:\n   - #define is a preprocessor text replacement directive with global file scope from its point of declaration.\n   - typedef is a compiler keyword with lexical block scope, obeying standard variable scoping rules.\n2. Pointer Handling Trap (Crucial Difference):\n   - #define PTR int*\n     PTR a, b; expands to: int* a, b; -> 'a' is a pointer to int, but 'b' is a regular int!\n   - typedef int* IntPtr;\n     IntPtr a, b; -> Both 'a' AND 'b' are proper pointers to int!\n3. Type Checking: typedef enforces strict compiler type rules, whereas macros can blindly replace invalid tokens.",
    "bullet_points": [
      "#define is preprocessor string replacement; typedef is a compiler type alias.",
      "typedef obeys C lexical scope; #define has flat file scope.",
      "#define PTR int* causes subtle bugs where PTR a, b makes only 'a' a pointer, not 'b'."
    ],
    "code_snippet": {
      "language": "c",
      "code": "// Dangerous Macro:\n#define PTR int*\nPTR x, y; // x is int*, y is int!\n\n// Safe Typedef:\ntypedef int* IntPtr;\nIntPtr p1, p2; // Both p1 and p2 are int*!"
    },
    "pro_tip": "This pointer declaration difference is an iconic C technical screening question.",
    "company_tags": [
      "Amazon",
      "Qualcomm",
      "TCS"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 8
  },
  {
    "id": "int-c-009",
    "topic_id": "topic-c",
    "title": "What is the #error directive in C, and how is it used during compilation?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "The #error directive causes the preprocessor to immediately halt compilation and emit a fatal compiler error message specified in the directive:\n\nUse Cases:\n1. Architecture / Compiler Compatibility: Abort compilation if an unsupported platform, OS, or compiler version is detected.\n2. Configuration Sanity Checks: Ensure mandatory build flags or configuration parameters are set before compilation proceeds.\n3. Preventing Undefined Hardware States: Abort if clock frequencies or memory buffer sizes exceed hardware microcontroller limits.",
    "bullet_points": [
      "Halts compilation immediately with a custom user-defined error message.",
      "Enforces compile-time environment and configuration constraints.",
      "Operates during preprocessing before any code compilation occurs."
    ],
    "code_snippet": {
      "language": "c",
      "code": "#ifndef BUFFER_SIZE\n    #error \"BUFFER_SIZE must be defined via -DBUFFER_SIZE=<n>\"\n#endif\n\n#if __STDC_VERSION__ < 201112L\n    #error \"This project requires C11 or higher\"\n#endif"
    },
    "pro_tip": "Explain: It saves developer time by failing builds immediately with a helpful error rather than generating hundreds of confusing cascading syntax errors.",
    "company_tags": [
      "Texas Instruments",
      "ARM",
      "Intel"
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
    "title": "Can you define a macro inside another macro or expand recursively in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "No, the C preprocessor strictly forbids recursive macro expansion to prevent infinite loops during preprocessing:\n\nMechanics:\n- When a macro is expanded, its own name is temporarily disabled from further expansion within that replacement text.\n- If the macro name appears inside its own expansion, the preprocessor leaves the name as a literal token without expanding it again.\n- Therefore, recursive algorithms (like factorial calculation) cannot be written using pure standard C macro self-recursion.",
    "bullet_points": [
      "C preprocessor disables a macro's name during its own expansion to prevent infinite loops.",
      "Direct self-recursive macros do not expand recursively.",
      "Guarantees that preprocessing always terminates in finite time."
    ],
    "code_snippet": {
      "language": "c",
      "code": "#define FOO (1 + FOO)\nint x = FOO; // Expands to: (1 + FOO) -- 'FOO' is NOT recursively expanded!"
    },
    "pro_tip": "Point out that advanced preprocessor libraries (like Boost.Preprocessor) simulate recursion using massive tables of pre-generated unrolled macros, not actual self-recursion.",
    "company_tags": [
      "Qualcomm",
      "NVIDIA",
      "Google"
    ],
    "frequency": "MEDIUM",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 10
  },
  {
    "id": "int-c-011",
    "topic_id": "topic-c",
    "title": "What are the 4 Storage Classes in C (auto, register, static, extern)?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Storage classes determine the scope, lifetime, memory location, and linkage of variables:\n\n1. auto (Automatic):\n   - Default for local variables declared inside functions.\n   - Scope: Local to block. Lifetime: Function execution. Location: Stack.\n   - Uninitialized value: Garbage.\n2. register:\n   - Suggests to compiler to store variable in a fast CPU register instead of RAM stack.\n   - Cannot take its address using '&' (registers have no memory addresses).\n3. static:\n   - Preserves value across function invocations. Initialized once at program startup.\n   - Location: Data/BSS segment. Lifetime: Entire program duration.\n   - Uninitialized value: Guaranteed 0.\n   - File-scope static limits visibility strictly to current file (internal linkage).\n4. extern:\n   - Declares a variable defined in another source file or scope without allocating memory.\n   - Scope: Global (external linkage).",
    "bullet_points": [
      "auto: Local stack variable, garbage default value.",
      "register: Hints CPU register storage; address operator (&) is prohibited.",
      "static: Retains value between calls, stored in Data/BSS segment, defaults to 0.",
      "extern: Global reference to a variable allocated in another file."
    ],
    "code_snippet": {
      "language": "c",
      "code": "void counter() {\n    static int count = 0; // Initialized once at startup in BSS segment\n    count++;\n    printf(\"%d \", count);\n}\n// Calling counter() 3 times prints: 1 2 3"
    },
    "pro_tip": "Remember: Modern optimizing compilers (GCC -O2/-O3) ignore the 'register' keyword because compiler register allocation algorithms (graph coloring) are far smarter than humans.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 11
  },
  {
    "id": "int-c-012",
    "topic_id": "topic-c",
    "title": "What is the difference between a Declaration and a Definition in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Fundamental distinction in C compilation and memory layout:\n\n1. Declaration:\n   - Informs the compiler about the name, type, and signature of a variable or function.\n   - Allocates NO memory in the executable.\n   - Can be repeated multiple times across files.\n   - Example: extern int global_val; or void calculate(int x);\n2. Definition:\n   - Actually allocates memory for the variable or generates executable machine instructions for the function body.\n   - Can only occur ONCE across the entire linked project (One Definition Rule / ODR).\n   - Example: int global_val = 10; or void calculate(int x) { ... }",
    "bullet_points": [
      "Declaration introduces type and name without allocating memory.",
      "Definition allocates memory and creates the actual variable or function code.",
      "Declarations can occur multiple times; definitions must be unique to avoid linker errors."
    ],
    "code_snippet": {
      "language": "c",
      "code": "extern int count; // Declaration: Informs compiler, NO memory allocated\nint count = 10;   // Definition: Allocates 4 bytes in Data segment\n\nvoid compute();   // Declaration\nvoid compute() {} // Definition"
    },
    "pro_tip": "When a linker outputs 'duplicate symbol' or 'undefined reference', it means you violated definition uniqueness or missed a definition entirely.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Intel"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 12
  },
  {
    "id": "int-c-013",
    "topic_id": "topic-c",
    "title": "What is the role of the 'volatile' qualifier in C? Why is it crucial in Embedded Systems?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "The 'volatile' keyword informs the compiler that a variable's value can be modified at any moment by factors outside the direct control of the program code (e.g. hardware registers, OS signals, or concurrent threads):\n\nWhy It Is Crucial:\n- Compiler Optimization Hazard: Without 'volatile', an optimizing compiler assumes the variable cannot change if the local code does not modify it. It caches the value in a CPU register and never re-reads it from RAM, turning loops like while(!flag) into infinite loops!\n- Volatile Effect: Forces the compiler to reload the variable from memory address on EVERY single read and write directly to memory on EVERY single write, completely bypassing CPU register caching.\n\n3 Universal Embedded Systems Use Cases:\n1. Memory-mapped peripheral hardware registers (e.g. UART status register, GPIO pins).\n2. Global variables modified inside Interrupt Service Routines (ISRs).\n3. Shared global flags modified across multi-threaded applications.",
    "bullet_points": [
      "Informs compiler that value can change asynchronously outside current program control.",
      "Prevents compiler from optimizing away reads/writes into CPU registers.",
      "Mandatory for hardware memory-mapped I/O registers and ISR shared variables."
    ],
    "code_snippet": {
      "language": "c",
      "code": "// Memory-mapped hardware status register\nvolatile uint32_t *const UART_STATUS = (uint32_t*) 0x40001000;\n\n// Without volatile, optimizer turns this into an infinite loop or reads once!\nwhile ((*UART_STATUS & 0x01) == 0) {\n    // Wait for hardware transmit buffer ready\n}"
    },
    "pro_tip": "A standard trap: 'Does volatile make operations thread-safe or atomic?' Answer: NO! Volatile only guarantees memory read/write visibility. It does NOT make compound operations atomic or provide synchronization locks.",
    "company_tags": [
      "Qualcomm",
      "Intel",
      "Texas Instruments",
      "Apple"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 13
  },
  {
    "id": "int-c-014",
    "topic_id": "topic-c",
    "title": "What is the difference between 'const int *p', 'int *const p', and 'const int *const p'?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "The placement of the 'const' keyword relative to the asterisk (*) determines what is read-only:\n\nRead Rule: Read from right to left:\n1. const int *p (or int const *p):\n   - 'p is a pointer to a constant integer'.\n   - Value is constant: You CANNOT modify the value through *p (*p = 10 causes compile error).\n   - Pointer is mutable: You CAN reassign the pointer to point to another address (p = &other is allowed).\n2. int *const p:\n   - 'p is a constant pointer to an integer'.\n   - Pointer is constant: You CANNOT reassign the pointer address (p = &other causes compile error).\n   - Value is mutable: You CAN modify the value pointed to (*p = 10 is allowed).\n3. const int *const p:\n   - 'p is a constant pointer to a constant integer'.\n   - Both pointer address and the pointed-to value are strictly read-only.",
    "bullet_points": [
      "const int *p: Pointed-to value is constant; pointer address can change.",
      "int *const p: Pointer address is constant; pointed-to value can change.",
      "const int *const p: Both pointer address and value are read-only."
    ],
    "code_snippet": {
      "language": "c",
      "code": "int x = 10, y = 20;\nconst int *p1 = &x;\n// *p1 = 15; // COMPILE ERROR!\np1 = &y;     // Valid\n\nint *const p2 = &x;\n*p2 = 15;    // Valid\n// p2 = &y;  // COMPILE ERROR!"
    },
    "pro_tip": "Remember the clock-wise / right-to-left rule to decode any complex C declaration during an interview.",
    "company_tags": [
      "TCS",
      "Amazon",
      "Cisco",
      "NVIDIA"
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
    "title": "What is the difference between Signed and Unsigned Integer Overflow in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "The C standard treats signed and unsigned arithmetic overflow fundamentally differently:\n\n1. Unsigned Integer Overflow (Defined Behavior):\n   - The C standard explicitly defines unsigned arithmetic to wrap around modulo 2^N (where N is number of bits).\n   - For a 32-bit unsigned int: UINT_MAX + 1 wraps to 0. It is fully defined, portable behavior.\n2. Signed Integer Overflow (UNDEFINED BEHAVIOR):\n   - Overflow of signed integer types (e.g. INT_MAX + 1) is completely UNDEFINED BEHAVIOR (UB) in the C standard!\n   - Because it is UB, optimizing compilers (GCC/Clang) assume that signed overflow can NEVER happen. They can eliminate safety checks like if (x + 1 > x) because mathematically x + 1 > x is always assumed true!",
    "bullet_points": [
      "Unsigned overflow is well-defined: wraps modulo 2^N (UINT_MAX + 1 = 0).",
      "Signed overflow is UNDEFINED BEHAVIOR in standard C.",
      "Compilers optimize away bounds checks assuming signed overflow never occurs."
    ],
    "code_snippet": {
      "language": "c",
      "code": "unsigned int u = UINT_MAX;\nu = u + 1; // Well-defined: u becomes 0\n\nint s = INT_MAX;\ns = s + 1; // UNDEFINED BEHAVIOR! Compiler may optimize or crash"
    },
    "pro_tip": "Security exploit connection: Integer overflows are the primary cause of heap buffer overflow vulnerabilities in C when calculating allocation sizes (e.g., malloc(n * sizeof(int))).",
    "company_tags": [
      "Google",
      "Microsoft",
      "Apple"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 15
  },
  {
    "id": "int-c-016",
    "topic_id": "topic-c",
    "title": "What is the 'restrict' type qualifier in C99, and how does it assist compiler optimization?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "The 'restrict' qualifier is a hint to the compiler that for the lifetime of the pointer, the pointed-to object will ONLY be accessed through that specific pointer (no pointer aliasing):\n\nWhy It Matters (Pointer Aliasing Problem):\n- If a function takes two pointers void update(int *a, int *b), the compiler must assume that 'a' and 'b' could point to the exact same memory address (aliased).\n- Therefore, on every write through *b, the compiler is forced to reload *a from RAM because *b might have overwritten *a's memory.\n- By declaring void update(int *restrict a, int *restrict b), the programmer promises the compiler that 'a' and 'b' will never overlap.\n- Optimization: The compiler can keep *a cached in a fast CPU register across loop iterations and execute SIMD vectorization, yielding dramatic speedups.",
    "bullet_points": [
      "restrict promises the compiler that the pointer is the exclusive accessor to that memory.",
      "Eliminates pointer aliasing assumptions, allowing register caching.",
      "Enables aggressive auto-vectorization and loop unrolling in numerical computations."
    ],
    "code_snippet": {
      "language": "c",
      "code": "// Standard C memcpy vs memmove:\n// memcpy uses restrict because source and dest MUST NOT overlap:\nvoid *memcpy(void *restrict dest, const void *restrict src, size_t n);\n\n// memmove allows overlapping memory buffers without restrict:\nvoid *memmove(void *dest, const void *src, size_t n);"
    },
    "pro_tip": "This explains why memcpy() is faster than memmove(), but crashes or corrupts data if source and destination memory buffers overlap.",
    "company_tags": [
      "Intel",
      "NVIDIA",
      "Apple"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 16
  },
  {
    "id": "int-c-017",
    "topic_id": "topic-c",
    "title": "What is Internal Linkage vs External Linkage in C? What does 'static' mean at file scope?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Linkage describes how identifiers can be referred to across translation units (source files):\n\n1. External Linkage (Default for global variables and functions):\n   - The identifier can be accessed from any source file across the entire program.\n   - The compiler generates a globally visible linker symbol.\n   - Other files access it using the 'extern' declaration.\n2. Internal Linkage (static at file scope):\n   - The identifier can ONLY be accessed from within the specific translation unit (.c file) where it is declared.\n   - The linker does NOT export the symbol globally.\n   - Information Hiding: Allows multiple source files to use the identical variable or helper function name without symbol collision linker errors.\n3. None Linkage: Local variables inside blocks.",
    "bullet_points": [
      "External linkage: Identifier is globally accessible across all linked object files.",
      "Internal linkage (file-scope static): Identifier is private to the current .c file.",
      "Prevents global namespace pollution and symbol collision during linking."
    ],
    "code_snippet": {
      "language": "c",
      "code": "// In file1.c:\nstatic int secret_key = 42; // Internal linkage: Invisible to other files\nstatic void helper() {}     // Helper function private to file1.c\n\nint global_counter = 1;     // External linkage: Visible everywhere"
    },
    "pro_tip": "Best practice in C: Always declare internal helper functions and file-level state as 'static' to encapsulate implementation details.",
    "company_tags": [
      "Qualcomm",
      "Amazon",
      "Broadcom"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 17
  },
  {
    "id": "int-c-018",
    "topic_id": "topic-c",
    "title": "How does Two's Complement representation work for negative numbers in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Two's Complement is the universal binary representation for signed integers in modern computing systems:\n\nAlgorithm to find Two's Complement of a negative number (-X):\n1. Write the positive number X in binary.\n2. Invert all bits (One's complement: 0 becomes 1, 1 becomes 0).\n3. Add 1 to the result.\n\nAdvantages of Two's Complement:\n- Exactly ONE representation of zero (00000000), eliminating negative zero ambiguity.\n- Addition and subtraction hardware circuits are identical: A - B is computed as A + (-B).\n- Most significant bit (MSB) acts naturally as the sign bit (1 for negative, 0 for positive).",
    "bullet_points": [
      "Two's Complement = Invert all bits + 1.",
      "Eliminates negative zero and unifies addition/subtraction hardware arithmetic.",
      "Standardized as mandatory for signed integers in C23."
    ],
    "code_snippet": {
      "language": "c",
      "code": "// Representing -5 in 8-bit signed char:\n// +5 in binary:       00000101\n// Invert bits:        11111010\n// Add 1:              11111011 (0xFB = -5)"
    },
    "pro_tip": "Explain: For an 8-bit signed char, the range is -128 (10000000) to +127 (01111111). The negative range has 1 more number because 0 is grouped with positives.",
    "company_tags": [
      "Intel",
      "ARM",
      "Qualcomm"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 18
  },
  {
    "id": "int-c-019",
    "topic_id": "topic-c",
    "title": "What is the difference between char, signed char, and unsigned char in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Unlike 'int' which is guaranteed to be signed by default, plain 'char' is architecture-dependent:\n\n1. Implementation-Defined Sign:\n   - The C standard states that plain 'char' can be either signed or unsigned depending on the target CPU architecture and compiler!\n   - On x86 architectures, char is typically signed (-128 to 127).\n   - On ARM and PowerPC architectures, char is unsigned by default (0 to 255) to optimize hardware instructions.\n2. Portability Trap:\n   - If you write char c = -1; if (c == -1) ..., this code compiles and runs on x86, but FAILS on ARM because unsigned char can never be -1!\n3. Best Practice: When storing text ASCII characters, use plain 'char'. When performing numeric calculations or binary byte manipulation, explicitly use 'int8_t' or 'uint8_t' from <stdint.h>.",
    "bullet_points": [
      "Plain char's signedness is implementation-defined (signed on x86, unsigned on ARM).",
      "Writing 'char c = -1' causes fatal portability bugs on ARM.",
      "Always use uint8_t or int8_t from <stdint.h> for binary data and raw bytes."
    ],
    "code_snippet": {
      "language": "c",
      "code": "#include <stdint.h>\n// Portable fixed-width types:\nuint8_t  byte_val = 0xFF; // Exactly 8 bits unsigned (0 to 255)\nint8_t   signed_b = -10;  // Exactly 8 bits signed (-128 to 127)"
    },
    "pro_tip": "Mention GCC flag: You can force char to be signed or unsigned on any architecture using -fsigned-char or -funsigned-char.",
    "company_tags": [
      "ARM",
      "Apple",
      "Texas Instruments"
    ],
    "frequency": "MEDIUM",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 19
  },
  {
    "id": "int-c-020",
    "topic_id": "topic-c",
    "title": "What is an Enumeration (enum) in C, and what is its underlying type and value assignment?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "An enum is a user-defined type consisting of a set of named integer constants:\n\nMechanics:\n- By default, enum constants are assigned integer values starting at 0 and incrementing by 1 for each subsequent identifier.\n- Explicit Assignment: Any constant can be explicitly assigned an integer value. Any subsequent constant without an explicit assignment will automatically take the value of the previous constant plus 1.\n- Underlying Type: In C, enum constants are treated simply as integers (int). C does NOT enforce strict type safety for enums (unlike C++ or Java enums); you can freely assign raw integers to enum variables.\n- Size: Typically sizeof(int) (4 bytes).",
    "bullet_points": [
      "Defines named integer constants starting from 0 by default.",
      "Subsequent constants take previous value + 1.",
      "In C, enums are treated as standard integers without strong type safety."
    ],
    "code_snippet": {
      "language": "c",
      "code": "enum Status {\n    SUCCESS = 0,\n    PENDING = 5,\n    FAILED,       // Automatically assigned 6 (5 + 1)\n    TIMEOUT = 10\n};\nenum Status s = FAILED;\nprintf(\"%d\\n\", s); // Prints: 6"
    },
    "pro_tip": "Contrast with C++: In C, you can do enum Status s = 100; without casting. In C++, this causes a strict type compile error.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Cisco"
    ],
    "frequency": "MEDIUM",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 20
  },
  {
    "id": "int-c-021",
    "topic_id": "topic-c",
    "title": "What is the difference between NULL, '\\0', and 0 in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "All three represent zero in memory, but have distinct semantic types and intents:\n\n1. 0 (Integer Literal):\n   - An int constant of value zero, type int.\n2. '\\0' (Null Character):\n   - A character constant used to terminate C strings.\n   - Value is 0, but its semantic intent is a character ('\\0').\n3. NULL (Null Pointer Constant):\n   - A macro defined in <stddef.h> / <stdio.h> as ((void*)0) or plain 0.\n   - Used strictly to indicate that a pointer does not point to any valid memory address.\n   - Dereferencing NULL causes a segmentation fault.",
    "bullet_points": [
      "0 is an integer literal.",
      "'\\0' is the character literal null terminator for strings (ASCII 0).",
      "NULL is a pointer macro ((void*)0) representing an invalid memory address."
    ],
    "code_snippet": {
      "language": "c",
      "code": "int x = 0;              // Integer zero\nchar str[] = \"hi\";       // str[2] is '\\0'\nint *ptr = NULL;        // Null pointer"
    },
    "pro_tip": "In C, NULL is typically ((void*)0), while in C++, NULL is simply 0 or nullptr.",
    "company_tags": [
      "TCS",
      "Wipro",
      "Cognizant"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 21
  },
  {
    "id": "int-c-022",
    "topic_id": "topic-c",
    "title": "What are Fixed-Width Integer Types in <stdint.h> (int32_t, uint64_t, etc.), and why are they preferred?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Standardized in C99, <stdint.h> provides explicit bit-width integer types:\n\nWhy Preferred over Primitive Types (int, long):\n- Portability Guarantee: The C standard only defines minimum sizes for basic types (e.g. 'long' is 32 bits on 64-bit Windows, but 64 bits on 64-bit Linux!). This leads to cross-platform bugs.\n- Predictable Memory Layout: Types like int8_t, int16_t, int32_t, int64_t guarantee exact signed bit widths on every platform.\n- Unsigned Types: uint8_t, uint16_t, uint32_t, uint64_t guarantee exact unsigned ranges.\n- Essential for network protocols (TCP headers), binary file formats, and embedded hardware registers.",
    "bullet_points": [
      "<stdint.h> guarantees exact bit-width across all compilers and OS platforms.",
      "Eliminates cross-platform discrepancies where 'long' varies between 32 and 64 bits.",
      "Standard in modern systems programming, embedded firmware, and network protocols."
    ],
    "code_snippet": {
      "language": "c",
      "code": "#include <stdint.h>\n#include <inttypes.h>\n\nuint32_t ip_addr = 0xC0A80001; // Exactly 32 bits everywhere\nprintf(\"IP: %\" PRIu32 \"\\n\", ip_addr); // Portable print format macro"
    },
    "pro_tip": "Always use the <inttypes.h> format specifier macros (PRIu32, PRId64) when printing fixed-width types to avoid compiler format warnings.",
    "company_tags": [
      "Amazon",
      "Google",
      "Intel"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 22
  },
  {
    "id": "int-c-023",
    "topic_id": "topic-c",
    "title": "What is a Pointer in C, and what is the difference between the '&' and '*' operators?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "A pointer is a variable that stores the memory address of another variable:\n\n1. Address-of Operator (&):\n   - A unary operator that returns the memory address of its operand.\n   - int *p = &x; takes the address of x and stores it in pointer p.\n2. Dereference / Indirection Operator (*):\n   - Accesses the value stored at the memory address currently held by the pointer.\n   - *p = 20 modifies the original variable x directly through memory.\n\nSize of Pointers:\n- The size of any pointer in C depends exclusively on the CPU architecture address bus, NOT the data type it points to:\n  - 32-bit Architecture: All pointers are 4 bytes.\n  - 64-bit Architecture: All pointers are 8 bytes.",
    "bullet_points": [
      "A pointer holds a memory address.",
      "& (Address-of) retrieves memory address; * (Dereference) accesses value at that address.",
      "All pointers are 8 bytes on 64-bit systems regardless of data type."
    ],
    "code_snippet": {
      "language": "c",
      "code": "int val = 42;\nint *ptr = &val; // ptr holds memory address of val\nprintf(\"Address: %p, Value: %d\\n\", (void*)ptr, *ptr); // *ptr dereferences"
    },
    "pro_tip": "Interviewer trap: 'What is sizeof(char*) vs sizeof(double*)?' Both are identical (8 bytes on 64-bit OS) because memory addresses are uniform.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 23
  },
  {
    "id": "int-c-024",
    "topic_id": "topic-c",
    "title": "How does Pointer Arithmetic work in C? What happens when you execute (p + 1)?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Pointer arithmetic in C is scaled automatically by the size of the underlying data type pointed to:\n\nFormula:\nWhen you add an integer n to a pointer p (p + n):\nNew Address = Current Address + (n * sizeof(*p))\n\nExample:\n- If an int pointer 'ptr' holds address 0x1000, and sizeof(int) is 4 bytes:\n  ptr + 1 evaluates to 0x1004 (NOT 0x1001!).\n  ptr + 5 evaluates to 0x1000 + (5 * 4) = 0x1014.\n- If a double pointer 'dptr' holds 0x1000, and sizeof(double) is 8 bytes:\n  dptr + 1 evaluates to 0x1008.\n\nAllowed Operations on Pointers:\n1. Adding/subtracting an integer to/from a pointer.\n2. Subtracting two pointers of the SAME type (returns number of elements between them, type ptrdiff_t).\n3. Comparing two pointers (<, >, ==).\n\nProhibited: Adding two pointers (p1 + p2), multiplying pointers, or dividing pointers.",
    "bullet_points": [
      "p + n calculates: Address + (n * sizeof(*p)).",
      "Subtracting two pointers (p2 - p1) yields the number of elements between them.",
      "Adding two pointers together is illegal and rejected by the compiler."
    ],
    "code_snippet": {
      "language": "c",
      "code": "int arr[5] = {10, 20, 30, 40, 50};\nint *p = arr; // points to arr[0]\nprintf(\"%d\\n\", *(p + 2)); // Prints: 30 (arr[2])"
    },
    "pro_tip": "Interviewer trick: 'What is 2[arr] in C?' Answer: It is completely valid! arr[2] is syntactic sugar for *(arr + 2), which is equivalent to *(2 + arr), which equals 2[arr]!",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Google",
      "Qualcomm"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 24
  },
  {
    "id": "int-c-025",
    "topic_id": "topic-c",
    "title": "What is the difference between *p++, (*p)++, and *++p in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Operator Precedence & Associativity Rules:\n- Postfix ++ has higher precedence than unary dereference *.\n- Prefix ++ and unary dereference * have equal precedence and associate Right-to-Left.\n\nAnalysis of Expressions:\n1. *p++:\n   - Evaluates: *(p++).\n   - Dereferences the CURRENT pointer address first (returns *p).\n   - Afterward, increments the pointer address p to point to the next element.\n2. (*p)++:\n   - The parentheses override precedence.\n   - Dereferences p first, retrieving the value.\n   - Afterward, increments the VALUE stored at that address (pointer p remains stationary!).\n3. *++p:\n   - Evaluates Right-to-Left: *(++p).\n   - Increments the pointer address p FIRST.\n   - Afterward, dereferences the new address.\n4. ++*p:\n   - Evaluates: ++(*p).\n   - Dereferences p first, then increments the value immediately and returns the incremented value.",
    "bullet_points": [
      "*p++ returns current value, then advances the pointer address.",
      "(*p)++ increments the value at the pointer; pointer address does not change.",
      "*++p advances the pointer address first, then returns the new value."
    ],
    "code_snippet": {
      "language": "c",
      "code": "int arr[] = {10, 20, 30};\nint *p = arr;\n\nprintf(\"%d\\n\", *p++);   // Prints 10; p now points to arr[1]\nprintf(\"%d\\n\", (*p)++); // Prints 20; arr[1] becomes 21, p stays at arr[1]\nprintf(\"%d\\n\", *++p);   // Advances p to arr[2], prints 30"
    },
    "pro_tip": "This is one of the most famous tricky pointer screening questions in technical interviews.",
    "company_tags": [
      "Amazon",
      "Google",
      "Qualcomm",
      "NVIDIA"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 25
  },
  {
    "id": "int-c-026",
    "topic_id": "topic-c",
    "title": "What is a Void Pointer (void*), and what are its capabilities and restrictions?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "A void pointer (generic pointer) is a pointer that has no associated data type:\n\nCapabilities:\n1. Generic Address Holder: Can hold the memory address of ANY data type (int, float, struct) without explicit casting.\n2. C Standard Library Functions: Universal interfaces like malloc (void* malloc(size_t)), memcpy, and qsort use void* to handle arbitrary memory buffers.\n\nRestrictions:\n1. Cannot be Dereferenced: *ptr is prohibited because the compiler does not know the size or type of data stored at the address. It must be explicitly cast to a concrete type first (e.g. *(int*)ptr).\n2. No Pointer Arithmetic: Standard C forbids ptr + 1 on void* because the step size is unknown (GCC has an extension treating sizeof(void) as 1, but it is non-standard).",
    "bullet_points": [
      "void* is a generic pointer capable of storing addresses of any data type.",
      "Cannot be dereferenced without casting to a concrete data type.",
      "Pointer arithmetic on void* is illegal in standard ISO C."
    ],
    "code_snippet": {
      "language": "c",
      "code": "int n = 42;\nvoid *vptr = &n; // Generic pointer\n// printf(\"%d\\n\", *vptr); // COMPILE ERROR!\nprintf(\"%d\\n\", *(int*)vptr); // Valid: Cast to int* then dereference"
    },
    "pro_tip": "Notice: In C, converting between void* and any typed pointer requires no cast. In C++, explicit casting is mandatory.",
    "company_tags": [
      "Microsoft",
      "Intel",
      "Amazon"
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
    "title": "What is a Dangling Pointer, and what causes it?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "A Dangling Pointer is a pointer that points to a memory address that has already been deallocated or freed:\n\nCommon Causes:\n1. Freeing Dynamic Memory without Nullifying:\n   - Calling free(ptr) releases the heap block back to the OS, but ptr STILL retains the old memory address!\n   - Any subsequent dereference (*ptr) or write corrupts the heap, causing undefined behavior or crashes.\n2. Returning Address of a Local Stack Variable:\n   - When a function returns &local_var, the function's stack frame is popped.\n   - The pointer now points to invalid/overwritten stack memory.\n\nPrevention:\n- Immediately assign ptr = NULL after free(ptr).\n- Never return addresses of local stack variables.",
    "bullet_points": [
      "Points to memory that has been deallocated or destroyed.",
      "Caused by freeing dynamic heap memory or returning addresses of local stack variables.",
      "Prevention: Set pointers to NULL immediately after free()."
    ],
    "code_snippet": {
      "language": "c",
      "code": "// Cause 1: After free\nint *p = malloc(sizeof(int));\nfree(p);\n// p is now a dangling pointer!\np = NULL; // Safe!\n\n// Cause 2: Returning stack address\nint* bad_func() {\n    int x = 10;\n    return &x; // DANGEROUS: x destroyed upon return!\n}"
    },
    "pro_tip": "A freed pointer set to NULL is safe because dereferencing NULL crashes cleanly, whereas dereferencing a dangling pointer causes silent data corruption.",
    "company_tags": [
      "Amazon",
      "Cisco",
      "Qualcomm"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 27
  },
  {
    "id": "int-c-028",
    "topic_id": "topic-c",
    "title": "What is a Wild Pointer, and how does it differ from a Dangling Pointer and NULL Pointer?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Comparison across pointer states:\n\n1. Wild Pointer:\n   - An uninitialized pointer that has never been assigned an address.\n   - Contains random garbage memory bits pointing to arbitrary RAM locations.\n   - Writing through a wild pointer can overwrite critical kernel or application memory.\n2. Dangling Pointer:\n   - A pointer that once pointed to valid memory, but that memory was subsequently freed or destroyed.\n3. NULL Pointer:\n   - A pointer that has been explicitly assigned NULL ((void*)0) to indicate it intentionally points to nothing.\n\nRemedy: Always initialize pointers at declaration: int *p = NULL;.",
    "bullet_points": [
      "Wild pointer: Uninitialized pointer containing random garbage addresses.",
      "Dangling pointer: Points to previously valid memory that has been freed.",
      "NULL pointer: Explicitly assigned NULL, pointing safely to nothing."
    ],
    "code_snippet": {
      "language": "c",
      "code": "int *wild_ptr;      // Wild pointer (uninitialized garbage address!)\nint *null_ptr = NULL; // Safe null pointer\n\nint *dang_ptr = malloc(sizeof(int));\nfree(dang_ptr);     // Dangling pointer"
    },
    "pro_tip": "Best practice rule: 'Always initialize every pointer to NULL or a valid address at declaration time.'",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 28
  },
  {
    "id": "int-c-029",
    "topic_id": "topic-c",
    "title": "What is a Double Pointer (pointer to pointer, int**), and where is it used?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "A Double Pointer is a pointer variable that stores the memory address of another pointer variable:\n\nMemory Chain: double_ptr -> ptr -> variable value.\n\nPrimary Use Cases:\n1. Modifying a Pointer in a Called Function (Simulating Pass-by-Reference for Pointers):\n   - When a function needs to allocate memory or reassign a caller's pointer (e.g. allocating a linked list node or matrix), passing int* passes the pointer by value (modifications are lost).\n   - Passing int** allows the function to dereference (*double_ptr = malloc(...)) and update the caller's original pointer address!\n2. Dynamic 2D Arrays (Matrices):\n   - Allocating an array of pointers (int**), where each element points to a dynamically allocated 1D array row.\n3. Command-line Arguments:\n   - main(int argc, char **argv) receives an array of string pointers.",
    "bullet_points": [
      "Stores the address of another pointer variable (int**).",
      "Required to modify caller's pointer address inside functions (e.g. dynamic allocation).",
      "Used for dynamic 2D array allocation and command-line arguments (char **argv)."
    ],
    "code_snippet": {
      "language": "c",
      "code": "// Modifying caller's pointer via double pointer\nvoid allocate(int **p) {\n    *p = malloc(sizeof(int)); // Updates caller's pointer!\n    **p = 42;\n}\nint *ptr = NULL;\nallocate(&ptr);\nprintf(\"%d\\n\", *ptr); // 42"
    },
    "pro_tip": "Drawing memory boxes with arrows on paper during interviews instantly impresses the interviewer.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Google",
      "Adobe"
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
    "title": "What are Function Pointers in C, and how do you declare and invoke them?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "A Function Pointer stores the memory address of executable machine instructions for a function in the code/text segment:\n\nSyntax & Declaration:\nreturn_type (*func_ptr_name)(param_types);\n\nExample:\nint add(int a, int b) { return a + b; }\nint (*op)(int, int) = add; // Pointer to function taking 2 ints and returning int\n\nInvocation:\nint result = op(10, 20); // Or (*op)(10, 20);\n\nCrucial Real-World Applications:\n1. Callbacks: Passing custom comparison functions to qsort() or event notification hooks in GUI/network drivers.\n2. Implementing Polymorphism in C: Structs containing function pointers mimic OOP interfaces and virtual method tables (used extensively in the Linux Kernel driver architecture).\n3. State Machines: Jump tables / dispatch tables mapping event IDs directly to function handlers.",
    "bullet_points": [
      "Function pointers store the entry address of functions in the text segment.",
      "Syntax: return_type (*name)(arg_types). Parentheses around (*name) are mandatory.",
      "Enables callbacks (qsort), dynamic dispatch tables, and OOP polymorphism in C."
    ],
    "code_snippet": {
      "language": "c",
      "code": "// Callback with qsort\nint compare(const void *a, const void *b) {\n    return (*(int*)a - *(int*)b);\n}\nint arr[] = {5, 2, 8, 1};\nqsort(arr, 4, sizeof(int), compare); // Passes function pointer callback"
    },
    "pro_tip": "Emphasize: Without parentheses, int *func(int) declares a function that returns an int pointer! The parentheses int (*func)(int) are mandatory to declare a pointer to a function.",
    "company_tags": [
      "Amazon",
      "Google",
      "Apple",
      "NVIDIA"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 30
  },
  {
    "id": "int-c-031",
    "topic_id": "topic-c",
    "title": "How do you implement the 'sizeof' operator using pointer arithmetic without library calls?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "In C, 'sizeof' is a built-in unary compile-time operator, but you can simulate its exact behavior using pointer arithmetic:\n\nMechanics:\n- Incrementing a typed pointer (ptr + 1) advances the memory address by exactly sizeof(*ptr) bytes.\n- If we take the address of a variable (&x), cast it to a pointer, add 1, and subtract the original address after casting both to (char*), the difference in byte addresses equals the exact size in bytes!\n\nMacro Implementation:\n#define my_sizeof(x) ((size_t)((char*)(&(x) + 1) - (char*)(&(x))))\n\nExplanation:\n- &(x) gets address of x.\n- &(x) + 1 advances by 1 whole element of x's type.\n- Casting to (char*) ensures pointer subtraction yields the difference in individual 1-byte increments.\n- Evaluates at compile time.",
    "bullet_points": [
      "Pointer arithmetic (p + 1) advances by sizeof(*p) bytes.",
      "Subtracting the base address from the advanced address using (char*) yields byte size.",
      "Macro: ((size_t)((char*)(&(x) + 1) - (char*)(&(x))))."
    ],
    "code_snippet": {
      "language": "c",
      "code": "#define my_sizeof(x) ((size_t)((char*)(&(x) + 1) - (char*)(&(x))))\n\ndouble d = 3.14;\nprintf(\"Size: %zu bytes\\n\", my_sizeof(d)); // Prints: 8 bytes"
    },
    "pro_tip": "This is one of the most famous C interview whiteboard brainteasers.",
    "company_tags": [
      "Amazon",
      "Google",
      "Microsoft",
      "Qualcomm"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 31
  },
  {
    "id": "int-c-032",
    "topic_id": "topic-c",
    "title": "What is an Array of Pointers vs a Pointer to an Array in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "A crucial distinction governed by bracket/asterisk operator precedence:\n\n1. Array of Pointers (int *arr[5]):\n   - Subscript operator [] has higher precedence than *.\n   - Reads: 'arr is an array of 5 pointers to int'.\n   - Allocates 5 distinct pointer variables in memory (40 bytes on 64-bit OS). Each element can point to a separate int or heap array.\n2. Pointer to an Array (int (*arr)[5]):\n   - Parentheses override precedence.\n   - Reads: 'arr is a single pointer pointing to an entire array of 5 integers'.\n   - Allocates ONLY ONE pointer in memory (8 bytes on 64-bit OS).\n   - Pointer arithmetic arr + 1 advances by the size of the ENTIRE array (5 * 4 = 20 bytes!).",
    "bullet_points": [
      "int *arr[5]: An array of 5 individual pointers (5 * 8 = 40 bytes).",
      "int (*arr)[5]: A single pointer to an array of 5 integers (8 bytes).",
      "arr + 1 on int (*arr)[5] advances by the size of the entire 5-element array (20 bytes)."
    ],
    "code_snippet": {
      "language": "c",
      "code": "int matrix[3][5];\nint (*pRow)[5] = matrix; // Pointer to array of 5 ints\npRow++; // Advances by 20 bytes to point to row 1 (matrix[1])"
    },
    "pro_tip": "Use the right-to-left rule to explain declarations effortlessly to the interviewer.",
    "company_tags": [
      "Amazon",
      "Cisco",
      "Intel"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 32
  },
  {
    "id": "int-c-033",
    "topic_id": "topic-c",
    "title": "What happens when you subtract two pointers in C? What is the type of the result?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Subtracting two pointers (ptr2 - ptr1) returns the number of elements of the base type residing between them, NOT the raw difference in byte addresses!\n\nRules:\n1. Same Array Requirement: Both pointers must point to elements within the exact same array (or one element past the end). Subtracting unrelated pointers is undefined behavior.\n2. Scaling: The raw byte difference is automatically divided by sizeof(*ptr).\n3. Result Type: The resulting value is of signed integer type 'ptrdiff_t' (defined in <stddef.h>).\n- Format Specifier: Use '%td' in printf to print ptrdiff_t portably.",
    "bullet_points": [
      "Subtracting pointers yields the number of elements between them.",
      "Calculates: (Address2 - Address1) / sizeof(*ptr).",
      "Return type is ptrdiff_t (printed via %td)."
    ],
    "code_snippet": {
      "language": "c",
      "code": "int arr[] = {10, 20, 30, 40, 50};\nint *p1 = &arr[1];\nint *p4 = &arr[4];\nptrdiff_t diff = p4 - p1;\nprintf(\"Elements between: %td\\n\", diff); // Prints: 3 (not 12 bytes!)"
    },
    "pro_tip": "Remind the interviewer: Pointer subtraction is valid only within the same allocated buffer.",
    "company_tags": [
      "Qualcomm",
      "Apple",
      "Broadcom"
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
    "title": "What is Pointer Aliasing, and what are Strict Aliasing Rules in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Pointer Aliasing occurs when two or more distinct pointers access the same region of memory.\n\nStrict Aliasing Rule (C99 Standard):\n- The C standard dictates that two pointers of different types (e.g. int* and float*) can NEVER point to the same memory location, allowing the compiler to optimize register caching aggressively.\n- Exceptions: Pointers to char*, unsigned char*, and signed char* are permitted to alias any type (used for byte inspection).\n\nViolation (Undefined Behavior):\n- Casting an int* directly to float* and dereferencing it (Type Punning) violates strict aliasing. Optimizing compilers (-O2/-O3) can reorder or eliminate writes, corrupting program logic.\n- Safe Type Punning: Use a 'union' or 'memcpy()' to inspect raw bytes of different types safely.",
    "bullet_points": [
      "Strict aliasing rule: Pointers of different types are assumed not to point to the same memory.",
      "Casting between unrelated pointer types violates strict aliasing, causing undefined behavior.",
      "char* is the only type permitted to alias any other type."
    ],
    "code_snippet": {
      "language": "c",
      "code": "// Undefined Behavior under strict aliasing:\nint x = 42;\nfloat *fp = (float*)&x; // Aliasing violation!\n*fp = 1.0f;\n\n// Safe approach using union:\nunion FloatInt {\n    float f;\n    uint32_t i;\n} u;\nu.f = 1.0f;"
    },
    "pro_tip": "Mention GCC flag: -fno-strict-aliasing disables this optimization if legacy codebases rely on type-punning pointers.",
    "company_tags": [
      "Google",
      "Intel",
      "NVIDIA"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 34
  },
  {
    "id": "int-c-035",
    "topic_id": "topic-c",
    "title": "What is the difference between lvalue and rvalue in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Expressions in C are categorized into lvalues and rvalues:\n\n1. lvalue (Locator Value):\n   - An expression that designates a specific, identifiable memory location (has an address in RAM or registers).\n   - Can appear on the left-hand side of an assignment operator (if not declared const).\n   - You can take its address using '&'.\n   - Examples: variable names (x), array elements (arr[0]), dereferenced pointers (*ptr).\n2. rvalue (Read / Right Value):\n   - The temporary data value of an expression (does not have a persistent memory address).\n   - Can only appear on the right-hand side of an assignment.\n   - You CANNOT take its address (&(x + 5) causes compile error: 'lvalue required as unary & operand').\n   - Examples: literals (10, 3.14), arithmetic results (a + b), function return values.",
    "bullet_points": [
      "lvalue: Has an identifiable memory address; can appear on left side of '='.",
      "rvalue: Temporary data value; cannot be assigned to or have its address taken.",
      "Expressions like (x + 1) or literals like 42 are rvalues."
    ],
    "code_snippet": {
      "language": "c",
      "code": "int x = 10; // 'x' is lvalue, '10' is rvalue\n// 10 = x;    // COMPILE ERROR: 10 is not an lvalue\n// &(x + 5);  // COMPILE ERROR: lvalue required"
    },
    "pro_tip": "Connect this directly to C++ move semantics when transitioning across systems languages.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "TCS"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 35
  },
  {
    "id": "int-c-036",
    "topic_id": "topic-c",
    "title": "How does Array Decay work in C? When does an array NOT decay to a pointer?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "In C, whenever an array name is evaluated in an expression, it automatically 'decays' (converts) into a pointer to its first element (&arr[0]).\n\nWhen Array Decay DOES NOT Occur (The 3 Exceptions):\n1. When passed as the operand of 'sizeof(arr)': Returns the total byte size of the entire array, not the pointer size (e.g. 5 * 4 = 20 bytes, not 8 bytes).\n2. When passed as the operand of the address-of operator '&arr': Returns a pointer to the entire array (type int (*)[N]), not int*.\n3. When used to initialize a char array from a string literal (e.g. char str[] = \"hello\").",
    "bullet_points": [
      "Array decay converts an array name into a pointer to its first element.",
      "Exception 1: sizeof(arr) returns the total memory size of the array.",
      "Exception 2: &arr returns a pointer to the entire array (type int (*)[N])."
    ],
    "code_snippet": {
      "language": "c",
      "code": "int arr[5] = {1, 2, 3, 4, 5};\nprintf(\"sizeof(arr): %zu\\n\", sizeof(arr)); // 20 bytes (No decay!)\n\nvoid func(int a[]) { // Decays to int *a\n    printf(\"sizeof(a): %zu\\n\", sizeof(a));   // 8 bytes (Pointer size!)\n}"
    },
    "pro_tip": "Trap question: 'Can you get the size of an array inside a function?' Answer: No, because it decayed to a pointer upon being passed as an argument!",
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Qualcomm"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 36
  },
  {
    "id": "int-c-037",
    "topic_id": "topic-c",
    "title": "What is Memory Alignment and Structure Padding in C? Why does CPU require it?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "CPUs do not read memory byte-by-byte; they read memory in aligned 32-bit (4-byte) or 64-bit (8-byte) word chunks from the system memory bus:\n\nWhy Hardware Requires Alignment:\n- An aligned 4-byte integer must sit at a memory address that is a multiple of 4 (0x0, 0x4, 0x8).\n- If an integer is misaligned (e.g. starting at address 0x1), the CPU must perform TWO memory bus read cycles, shift the bits, and merge them, cutting memory throughput in half. Some architectures (ARM, SPARC) generate hardware bus fault exceptions on unaligned memory access!\n\nStructure Padding:\n- The C compiler automatically inserts invisible padding bytes between struct members to ensure every member starts at an aligned address suitable for its type.\n- The total size of the struct is also padded to be a multiple of the largest member's alignment requirement.",
    "bullet_points": [
      "CPUs fetch data in word-aligned memory chunks (4 or 8 bytes).",
      "Compilers insert invisible padding bytes to align members on natural boundaries.",
      "Unaligned access causes severe CPU latency penalties or hardware bus fault crashes."
    ],
    "code_snippet": {
      "language": "c",
      "code": "struct Padded {\n    char c;    // 1 byte\n    // 3 bytes of compiler padding inserted here!\n    int i;     // 4 bytes (aligned to 4-byte boundary)\n    short s;   // 2 bytes\n    // 2 bytes of trailing padding inserted here!\n}; // Total size: 12 bytes, NOT 7 bytes!"
    },
    "pro_tip": "Show the interviewer how reordering members from largest to smallest shrinks the struct: int i (4) + short s (2) + char c (1) + 1 padding = 8 bytes!",
    "company_tags": [
      "NVIDIA",
      "Intel",
      "Apple",
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
    "title": "What is #pragma pack(1) in C, and what are its trade-offs?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "#pragma pack(n) is a preprocessor directive that instructs the compiler to pack structure members on n-byte alignment boundaries:\n\n#pragma pack(1):\n- Forces 1-byte alignment, completely eliminating all compiler structure padding bytes.\n- The struct size becomes the exact sum of the sizes of its individual members.\n\nTrade-offs:\n- Advantage: Essential for low-level network packets (TCP/IP headers), file headers (BMP, ELF), and hardware device registers where exact byte offsets are required.\n- Disadvantage: Severe CPU performance penalty due to misaligned memory reads. On architectures without unaligned access support, dereferencing packed members can trigger fatal hardware exceptions.",
    "bullet_points": [
      "#pragma pack(1) eliminates all padding, packing struct members tightly.",
      "Mandatory for network protocols and binary file format serialization.",
      "Causes CPU performance penalties due to unaligned memory access."
    ],
    "code_snippet": {
      "language": "c",
      "code": "#pragma pack(push, 1)\nstruct NetworkHeader {\n    uint8_t  type;\n    uint32_t seq_num;\n}; // Exactly 5 bytes (1 + 4), zero padding!\n#pragma pack(pop) // Restores default compiler alignment"
    },
    "pro_tip": "Always use '#pragma pack(push, 1)' and '#pragma pack(pop)' to avoid leaking packing settings into subsequent header files.",
    "company_tags": [
      "Cisco",
      "Juniper",
      "Broadcom"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 38
  },
  {
    "id": "int-c-039",
    "topic_id": "topic-c",
    "title": "What does the offsetof() macro do in C, and how is it implemented?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "The offsetof(type, member) macro (defined in <stddef.h>) returns the byte offset of a specific member from the beginning of its parent structure:\n\nImplementation Trick:\n#define offsetof(TYPE, MEMBER) ((size_t)&(((TYPE*)0)->MEMBER))\n\nMechanics:\n1. ((TYPE*)0): Takes the null address 0 and casts it to a pointer of the struct type TYPE.\n2. ->MEMBER: Accesses the member relative to the base address 0.\n3. &: Takes the address of that member.\n4. Since the base address is 0, the address of the member is identically equal to its byte offset from the start of the structure!\n5. Zero runtime overhead; evaluated purely at compile-time by the compiler.",
    "bullet_points": [
      "Returns the byte offset of a struct member from the start of the structure.",
      "Implemented using null pointer trick: ((size_t)&(((TYPE*)0)->MEMBER)).",
      "Famous for powering the container_of() macro in the Linux Kernel."
    ],
    "code_snippet": {
      "language": "c",
      "code": "#include <stddef.h>\nstruct Packet {\n    char id;\n    int data;\n};\nsize_t offset = offsetof(struct Packet, data);\nprintf(\"Offset of data: %zu\\n\", offset); // Typically 4 (after 3 padding bytes)"
    },
    "pro_tip": "Cite the Linux Kernel's container_of() macro: It uses offsetof to obtain the pointer to an enclosing structure given only a pointer to one of its inner members.",
    "company_tags": [
      "Google",
      "Red Hat",
      "Qualcomm"
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
    "title": "What is the difference between a Union and a Structure in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Comparison of memory layout and member allocation:\n\n1. Structure (struct):\n   - Every member has its own distinct, dedicated memory location.\n   - Total memory size = Sum of member sizes + compiler padding bytes.\n   - All members can be stored and accessed simultaneously.\n2. Union (union):\n   - All members SHARE the exact same starting memory address.\n   - Total memory size = Size of its largest member (rounded to member alignment).\n   - Only ONE member can hold a valid value at any given time.\n   - Writing to one member overwrites the data of all other members.",
    "bullet_points": [
      "Struct: Each member has separate memory; all can be accessed concurrently.",
      "Union: All members share the same memory; size is that of largest member.",
      "Unions conserve memory and enable low-level hardware register interpretation."
    ],
    "code_snippet": {
      "language": "c",
      "code": "union Data {\n    int i;    // 4 bytes\n    char c;   // 1 byte\n}; // sizeof(union Data) is 4 bytes\nunion Data d;\nd.i = 0x12345678;\nd.c = 0xAB; // Overwrites the lowest byte of d.i!"
    },
    "pro_tip": "Common interview question: 'How to check Little-Endian vs Big-Endian using a union?'",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 40
  },
  {
    "id": "int-c-041",
    "topic_id": "topic-c",
    "title": "How do you determine whether a system is Big-Endian or Little-Endian in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Endianness refers to the byte order used by hardware to store multi-byte data words in memory:\n\n1. Little-Endian (x86, ARM default): The Least Significant Byte (LSB) is stored at the lowest memory address.\n2. Big-Endian (Network Byte Order, older SPARC): The Most Significant Byte (MSB) is stored at the lowest memory address.\n\nTwo Standard C Algorithms to Detect Endianness:\n- Method 1: Using Pointer Casting: Initialize an int x = 1 (0x00000001). Cast to (char*)&x and inspect the first byte. If *ptr == 1, it is Little-Endian; if *ptr == 0, it is Big-Endian.\n- Method 2: Using Union: Store integer 1, read single-byte char member.",
    "bullet_points": [
      "Little-Endian stores LSB at lowest address (x86, ARM).",
      "Big-Endian stores MSB at lowest address (Network byte order).",
      "Check via: int x = 1; (*(char*)&x == 1) ? LittleEndian : BigEndian."
    ],
    "code_snippet": {
      "language": "c",
      "code": "int is_little_endian() {\n    int x = 1;\n    char *ptr = (char*)&x;\n    return (*ptr == 1); // 1 = Little Endian, 0 = Big Endian\n}"
    },
    "pro_tip": "Mention network functions: htonl(), ntohl() convert between Host Endianness and Network Byte Order (Big-Endian).",
    "company_tags": [
      "Intel",
      "Cisco",
      "NVIDIA",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 41
  },
  {
    "id": "int-c-042",
    "topic_id": "topic-c",
    "title": "What is the difference between char str[] = \"hello\" and char *str = \"hello\" in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "They allocate memory in completely different memory segments:\n\n1. char str[] = \"hello\" (Character Array):\n   - Memory Location: Allocated on the Stack frame of the function.\n   - Initialized by copying the string bytes into local stack memory.\n   - Mutable: You CAN safely modify characters (str[0] = 'H' is fully allowed).\n2. char *str = \"hello\" (String Literal Pointer):\n   - Memory Location: Stored in the Read-Only Data Segment (.rodata / text segment).\n   - 'str' is a pointer on the stack pointing to read-only memory.\n   - Immutable: Attempting to modify characters (str[0] = 'H') triggers a segmentation fault (SIGSEGV) crash at runtime!\n   - Best Practice: Always declare string literals as: const char *str = \"hello\";.",
    "bullet_points": [
      "char str[] is a mutable array copied onto the stack.",
      "char *str points to read-only memory in the .rodata segment.",
      "Writing to char *str triggers a Segmentation Fault (SIGSEGV)."
    ],
    "code_snippet": {
      "language": "c",
      "code": "char arr[] = \"hello\";\narr[0] = 'H'; // Valid: Stack memory is mutable\n\nchar *ptr = \"hello\";\n// ptr[0] = 'H'; // RUNTIME CRASH: Segmentation fault (writing to read-only memory!)"
    },
    "pro_tip": "This is one of the top causes of unexpected crashes in beginner C code.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "TCS",
      "Qualcomm"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 42
  },
  {
    "id": "int-c-043",
    "topic_id": "topic-c",
    "title": "How does 2D Array memory layout work in C? What is Row-Major Order?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "In C, multi-dimensional arrays are stored contiguously in memory in Row-Major Order:\n\nRow-Major Order:\n- Elements of Row 0 are stored contiguously, followed immediately by elements of Row 1, Row 2, etc.\n- Formula to access element matrix[i][j]:\n  Address = BaseAddress + ((i * NUM_COLS + j) * sizeof(element))\n\nCPU Cache Performance Impact:\n- Traversing a 2D array row-by-row (outer loop i, inner loop j) accesses sequential adjacent memory addresses, maximizing CPU L1/L2 cache hits.\n- Traversing column-by-column (outer loop j, inner loop i) jumps by NUM_COLS bytes on every step, causing severe CPU cache misses and slowing execution by 10x-50x!",
    "bullet_points": [
      "C stores multi-dimensional arrays in continuous Row-Major Order.",
      "Index formula: Base + (i * COLS + j) * sizeof(element).",
      "Row-wise loops leverage CPU cache prefetching; column-wise loops cause cache misses."
    ],
    "code_snippet": {
      "language": "c",
      "code": "// High performance cache-friendly loop:\nfor (int i = 0; i < ROWS; i++) {\n    for (int j = 0; j < COLS; j++) {\n        matrix[i][j] = 0; // Sequential memory access\n    }\n}"
    },
    "pro_tip": "Tie this directly to matrix multiplication optimizations in high-performance computing.",
    "company_tags": [
      "Google",
      "NVIDIA",
      "Intel"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 43
  },
  {
    "id": "int-c-044",
    "topic_id": "topic-c",
    "title": "What is the difference between strlen() and sizeof() for C strings?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Differences in evaluation and null terminator handling:\n\n1. strlen(str):\n   - A standard library function (<string.h>).\n   - Evaluated at RUNTIME by traversing characters until it encounters the null terminator '\\0'.\n   - Returns the character count EXCLUDING the null terminator '\\0'.\n   - Time complexity: O(n).\n2. sizeof(str):\n   - A compile-time unary operator.\n   - Returns the total allocated memory size in bytes of the array type, INCLUDING the null terminator '\\0'.\n   - Time complexity: O(1) (evaluated at compile time).\n   - Trap: If applied to a pointer (char *p), sizeof(p) returns 8 bytes (pointer size), NOT the string length!",
    "bullet_points": [
      "strlen() counts characters up to '\\0' at runtime (O(n)).",
      "sizeof() returns total array memory in bytes including '\\0' at compile time (O(1)).",
      "sizeof on a pointer (char*) returns pointer size (8 bytes), not string length."
    ],
    "code_snippet": {
      "language": "c",
      "code": "char str[100] = \"Hello\";\nprintf(\"strlen: %zu\\n\", strlen(str)); // 5 (character count)\nprintf(\"sizeof: %zu\\n\", sizeof(str)); // 100 (total array memory allocated)"
    },
    "pro_tip": "Always remember: When allocating memory with malloc for strings, allocate strlen(s) + 1 to account for the null terminator!",
    "company_tags": [
      "TCS",
      "Infosys",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 44
  },
  {
    "id": "int-c-045",
    "topic_id": "topic-c",
    "title": "Why are gets() and strcpy() dangerous in C? What are the secure alternatives?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Both functions lack buffer bounds checking, creating severe Buffer Overflow vulnerabilities:\n\n1. gets(str):\n   - Reads input until newline without knowing the destination buffer size.\n   - If user input exceeds the buffer, it smashes the stack frame, overwriting the return address to execute malicious shellcode!\n   - Removed entirely from the ISO C11 standard.\n   - Secure Replacement: fgets(buf, sizeof(buf), stdin).\n2. strcpy(dest, src):\n   - Copies until '\\0' without checking if dest has sufficient capacity.\n   - Secure Replacements: strncpy(dest, src, n) or snprintf(dest, sizeof(dest), \"%s\", src).",
    "bullet_points": [
      "gets() and strcpy() lack buffer bounds checking, causing stack buffer overflows.",
      "Buffer overflows overwrite return addresses, enabling arbitrary code execution.",
      "Safe replacements: fgets() instead of gets(); snprintf() instead of strcpy()."
    ],
    "code_snippet": {
      "language": "c",
      "code": "char buffer[16];\n// DANGEROUS: gets(buffer); // Stack smashing vulnerability!\n\n// SECURE:\nfgets(buffer, sizeof(buffer), stdin);"
    },
    "pro_tip": "Mention compiler stack protection flags: GCC enables Stack Canaries by default (-fstack-protector) to detect buffer overflows before return.",
    "company_tags": [
      "Amazon",
      "Google",
      "Microsoft",
      "Apple"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 45
  },
  {
    "id": "int-c-046",
    "topic_id": "topic-c",
    "title": "How does the strtok() string tokenization function work, and why is it not thread-safe?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "strtok(str, delim) splits a string into a sequence of tokens based on delimiter characters:\n\nMechanics:\n- On the first call, pass the string pointer: strtok(str, \",\"). It finds the first token, replaces the delimiter with '\\0', and returns the token pointer.\n- On subsequent calls, pass NULL: strtok(NULL, \",\"). It continues scanning from where it left off.\n\nWhy It Is NOT Thread-Safe:\n- strtok() stores its scanning position in an internal static pointer variable across calls.\n- If multiple threads call strtok() concurrently, they overwrite each other's static state, corrupting the tokenization stream!\n- Modifies Original String: Replaces delimiters with '\\0' in-place.\n- Thread-Safe Alternative: strtok_r() (POSIX) takes an explicit user-provided context pointer (char **saveptr).",
    "bullet_points": [
      "strtok() tokenizes strings by replacing delimiters with '\\0' in-place.",
      "Uses an internal static pointer to remember state, making it NOT thread-safe.",
      "POSIX provides strtok_r() for thread-safe reentrant tokenization."
    ],
    "code_snippet": {
      "language": "c",
      "code": "char str[] = \"apple,banana,cherry\";\nchar *token = strtok(str, \",\");\nwhile (token != NULL) {\n    printf(\"%s\\n\", token);\n    token = strtok(NULL, \",\"); // NULL continues from previous position\n}"
    },
    "pro_tip": "Remind the interviewer: Never pass a string literal to strtok() because it modifies the string in-place, causing a SIGSEGV crash!",
    "company_tags": [
      "Cisco",
      "Amazon",
      "Oracle"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 46
  },
  {
    "id": "int-c-047",
    "topic_id": "topic-c",
    "title": "What is the difference between memcpy() and memmove() in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Both copy n bytes from source memory to destination memory, but handle overlapping memory buffers differently:\n\n1. memcpy(dest, src, n):\n   - Assumes that source and destination memory buffers DO NOT overlap (uses 'restrict' qualifier).\n   - Copies sequentially. If dest and src overlap, source bytes are overwritten before being read, resulting in corrupted data!\n   - Faster because it requires no overlap checks or temporary buffering.\n2. memmove(dest, src, n):\n   - Safely handles overlapping memory buffers!\n   - Detects overlap direction: If dest > src, it copies bytes backwards (from end to beginning); if dest < src, it copies forwards.\n   - Behaves as if bytes are copied to a temporary buffer first.",
    "bullet_points": [
      "memcpy() assumes non-overlapping memory buffers; fails if buffers overlap.",
      "memmove() correctly and safely handles overlapping memory blocks.",
      "Use memmove() whenever shifting elements inside the same array."
    ],
    "code_snippet": {
      "language": "c",
      "code": "char str[] = \"123456789\";\n// Overlapping copy: Shift \"3456\" over \"1234\"\nmemmove(str, str + 2, 4); // Safe: Correctly copies without corruption\nprintf(\"%s\\n\", str);"
    },
    "pro_tip": "Rule of thumb: Always use memmove() when sliding or shifting elements within the same allocated buffer.",
    "company_tags": [
      "Google",
      "Microsoft",
      "Intel",
      "Apple"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 47
  },
  {
    "id": "int-c-048",
    "topic_id": "topic-c",
    "title": "How does the snprintf() function prevent buffer overflow compared to sprintf()?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Comparison of formatted string writing:\n\n1. sprintf(buf, format, ...):\n   - Writes formatted output to the destination buffer with NO length limit.\n   - If the formatted text exceeds the buffer capacity, it writes past the buffer boundary, causing a fatal buffer overflow.\n2. snprintf(buf, size, format, ...):\n   - Accepts the maximum buffer capacity 'size' as an explicit parameter.\n   - Writes at most (size - 1) characters and ALWAYS appends the terminating null character '\\0'.\n   - Return Value: Returns the total number of characters that WOULD have been written if the buffer had been large enough. If return value >= size, truncation occurred.",
    "bullet_points": [
      "sprintf() has no size check, risking stack buffer overflow.",
      "snprintf() enforces a maximum size limit and guarantees null termination.",
      "Return value indicates whether output was truncated."
    ],
    "code_snippet": {
      "language": "c",
      "code": "char buf[10];\nint written = snprintf(buf, sizeof(buf), \"ID: %d\", 12345);\nif (written >= sizeof(buf)) {\n    printf(\"Warning: String was truncated!\\n\");\n}"
    },
    "pro_tip": "Industry coding standards (MISRA C, CERT C) strictly forbid sprintf() and require snprintf().",
    "company_tags": [
      "Amazon",
      "Qualcomm",
      "TCS"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 48
  },
  {
    "id": "int-c-049",
    "topic_id": "topic-c",
    "title": "What is the difference between Array Name and Address of Array (&arr)?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Though both evaluate to the exact same numeric memory address value, they have completely different data types and pointer arithmetic behavior:\n\nExample: int arr[5];\n1. arr (Array Name / Pointer to First Element):\n   - Type: int*\n   - Value: Memory address of arr[0] (e.g. 0x1000).\n   - Arithmetic: arr + 1 advances by sizeof(int) = 4 bytes (to 0x1004).\n2. &arr (Address of Whole Array):\n   - Type: int (*)[5] (pointer to an entire array of 5 integers).\n   - Value: Memory address of the entire array (0x1000).\n   - Arithmetic: &arr + 1 advances by the size of the ENTIRE array: 5 * sizeof(int) = 20 bytes (to 0x1014)!",
    "bullet_points": [
      "arr and &arr have the same numerical address, but different types.",
      "arr is type int*; arr + 1 advances by 4 bytes.",
      "&arr is type int (*)[5]; &arr + 1 advances by 20 bytes."
    ],
    "code_snippet": {
      "language": "c",
      "code": "int arr[5] = {1, 2, 3, 4, 5};\nprintf(\"arr:     %p, arr + 1:     %p\\n\", (void*)arr, (void*)(arr + 1));     // +4 bytes\nprintf(\"&arr:    %p, &arr + 1:    %p\\n\", (void*)&arr, (void*)(&arr + 1));   // +20 bytes"
    },
    "pro_tip": "This is a classic question to separate candidates with shallow vs deep memory understanding.",
    "company_tags": [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 49
  },
  {
    "id": "int-c-050",
    "topic_id": "topic-c",
    "title": "What are Variable Length Arrays (VLAs) in C99, and why were they made optional in C11?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Standardized in C99, Variable Length Arrays (VLAs) allow declaring stack arrays whose size is evaluated at runtime:\n\nExample: void func(int n) { int arr[n]; }\n\nWhy Made Optional in C11:\n1. Stack Overflow Vulnerability: VLAs are allocated on the thread's Stack memory. If an attacker passes a huge 'n' or if input is unbounded, the stack instantly overflows, crashing the process without any error checking mechanism (unlike malloc which returns NULL on failure).\n2. Security Exploits: Unchecked VLAs are a major source of stack-smashing security exploits.\n3. Kernel Policy: The Linux Kernel completely banned all VLAs from the codebase in 2018 (using -Wvla) to eliminate stack overflow risks.",
    "bullet_points": [
      "VLAs allocate runtime-sized arrays on the stack.",
      "Cannot detect memory allocation failure, risking fatal Stack Overflow.",
      "Made optional in C11; banned in the Linux Kernel and safety-critical code."
    ],
    "code_snippet": {
      "language": "c",
      "code": "void process(int n) {\n    // VLA: Dangerous if n is large!\n    // int buffer[n]; \n    \n    // Safe alternative using heap:\n    int *buffer = malloc(n * sizeof(int));\n    if (!buffer) return; // Checked allocation\n    free(buffer);\n}"
    },
    "pro_tip": "Always recommend malloc/free over VLAs in production code.",
    "company_tags": [
      "Google",
      "Red Hat",
      "Intel"
    ],
    "frequency": "MEDIUM",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 50
  },
  {
    "id": "int-c-051",
    "topic_id": "topic-c",
    "title": "What are the differences between malloc(), calloc(), realloc(), and free() in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Dynamic memory management functions declared in <stdlib.h>:\n\n1. malloc(size_t size):\n   - Allocates a single contiguous block of 'size' bytes from the Heap.\n   - Does NOT initialize memory; leaves garbage data.\n   - Returns void* pointing to first byte, or NULL if allocation fails.\n2. calloc(size_t num, size_t size):\n   - Allocates memory for an array of 'num' elements of 'size' bytes each.\n   - Automatically initializes all allocated bytes to zero (0).\n   - Slightly slower than malloc due to zero-filling overhead.\n3. realloc(void *ptr, size_t new_size):\n   - Resizes a previously allocated memory block.\n   - Can shrink or expand. If expanding, it may expand in-place or allocate a new block elsewhere, copy existing bytes, and free the old block.\n4. free(void *ptr):\n   - Deallocates the memory block back to the heap allocator.\n   - Passing NULL to free() is completely safe and performs a no-op.",
    "bullet_points": [
      "malloc() allocates raw uninitialized memory containing garbage values.",
      "calloc() allocates memory and clears all bytes to zero.",
      "realloc() resizes existing blocks; free() releases memory back to the heap."
    ],
    "code_snippet": {
      "language": "c",
      "code": "int *p1 = malloc(10 * sizeof(int)); // Uninitialized\nint *p2 = calloc(10, sizeof(int)); // Zero-initialized\n\nint *p3 = realloc(p1, 20 * sizeof(int)); // Resized to 20 ints\nfree(p2);\nfree(p3);"
    },
    "pro_tip": "Always check if malloc/calloc returned NULL before dereferencing: if (!ptr) { handle_error(); }.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 51
  },
  {
    "id": "int-c-052",
    "topic_id": "topic-c",
    "title": "Why should you never cast the result of malloc() in C (e.g., int *p = (int*)malloc(...))?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "In standard C, casting the return value of malloc() is considered an antipattern and bad practice:\n\nReasons:\n1. Unnecessary: In C, void* automatically and implicitly promotes to any typed pointer without casting.\n2. Masks Missing Header Bug: In legacy C89/C90, if you forgot to #include <stdlib.h>, the compiler assumed malloc returned int. An explicit cast (int*) silenced the compiler warning, causing subtle crashes on 64-bit systems where pointer sizes (64-bit) differed from int (32-bit).\n3. Code Redundancy: Increases code verbosity.\n\nNote on C++: In C++, casting IS required because C++ does not allow implicit void* conversion. But in modern idiomatic C, omit the cast.",
    "bullet_points": [
      "C automatically promotes void* to any typed pointer type.",
      "Casting masks missing #include <stdlib.h> compilation warnings.",
      "Modern idiomatic C standard practice: int *p = malloc(sizeof(*p));"
    ],
    "code_snippet": {
      "language": "c",
      "code": "// Idiomatic, clean, robust C allocation pattern:\nint *ptr = malloc(sizeof(*ptr)); // Notice: sizeof(*ptr) prevents type mismatches!"
    },
    "pro_tip": "Using sizeof(*ptr) rather than sizeof(int) makes code refactoring effortless if the pointer type is ever changed.",
    "company_tags": [
      "Google",
      "Red Hat",
      "Apple"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 52
  },
  {
    "id": "int-c-053",
    "topic_id": "topic-c",
    "title": "What is the realloc() memory leak trap, and how do you prevent it?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "The classic realloc() antipattern creates silent memory leaks upon allocation failure:\n\nDangerous Trap:\nptr = realloc(ptr, new_size); // DANGEROUS!\n\nWhy It Leaks:\n- If realloc() fails to find sufficient memory, it returns NULL.\n- By directly assigning ptr = NULL, the original pointer to the previously allocated block is overwritten and lost!\n- The original memory block remains allocated on the heap, but can never be freed because all references were lost, causing an irrecoverable memory leak!\n\nSafe Pattern:\nAlways use a temporary pointer variable to hold the realloc() return value.",
    "bullet_points": [
      "Directly assigning ptr = realloc(ptr, new_size) leaks the original block if realloc fails.",
      "When realloc fails, it returns NULL but leaves original memory untouched.",
      "Fix: Assign realloc() to a temporary pointer, verify non-null, then reassign."
    ],
    "code_snippet": {
      "language": "c",
      "code": "// Safe realloc pattern:\nint *temp = realloc(ptr, new_size * sizeof(int));\nif (temp == NULL) {\n    // Handle allocation failure\n    free(ptr); // Original block can still be freed safely!\n    return -1;\n}\nptr = temp; // Reassign only upon confirmed success"
    },
    "pro_tip": "This is one of the most critical code review checks in production C codebases.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Google",
      "Qualcomm"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 53
  },
  {
    "id": "int-c-054",
    "topic_id": "topic-c",
    "title": "What is a Memory Leak in C, and how do you detect and fix it?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "A Memory Leak occurs when dynamically allocated heap memory (via malloc/calloc) is no longer needed by the program, but has not been released via free(), and all pointers to that memory block have been lost or overwritten:\n\nConsequences:\n- The process memory consumption continuously swells over time.\n- Eventually exhausts physical RAM and swap space, leading to out-of-memory crashes or termination by the OS Out-Of-Memory (OOM) Killer.\n\nDetection & Prevention:\n1. Static Analysis: Compiler flags (-Wall, -Wextra) and tools like Cppcheck.\n2. Dynamic Runtime Analysis: Valgrind (valgrind --leak-check=full ./app) tracks every allocation and flags un-freed blocks and file/line origins upon exit.\n3. AddressSanitizer (ASan): Compile with gcc -fsanitize=address -g to catch leaks instantly with low overhead.",
    "bullet_points": [
      "Memory leak: Heap memory allocated but never freed after pointers are lost.",
      "Causes continuous RAM growth until system crashes or process is killed.",
      "Detect using Valgrind (--leak-check=full) or GCC AddressSanitizer (-fsanitize=address)."
    ],
    "code_snippet": {
      "language": "bash",
      "code": "# Detecting leaks with Valgrind:\nvalgrind --leak-check=full --show-leak-kinds=all ./my_program\n\n# Detecting leaks with GCC AddressSanitizer:\ngcc -fsanitize=address -g main.c -o my_program\n./my_program"
    },
    "pro_tip": "Always mention AddressSanitizer: It is built directly into modern GCC/Clang and runs 10x faster than Valgrind.",
    "company_tags": [
      "Amazon",
      "Google",
      "Intel"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 54
  },
  {
    "id": "int-c-055",
    "topic_id": "topic-c",
    "title": "What is a Double Free Vulnerability in C, and how does it lead to heap corruption exploits?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "A Double Free occurs when free() is invoked more than once on the exact same allocated heap pointer without intervening reallocation:\n\nMechanics of Heap Corruption:\n- Heap allocators (like glibc ptmalloc) maintain internal metadata structures (bins, free lists, chunk headers) tracking freed memory chunks.\n- When free(ptr) is called, the allocator inserts the chunk into a free list.\n- Calling free(ptr) a second time inserts the same chunk into the free list AGAIN, creating a circular loop in the allocator's linked list!\n- An attacker can exploit this corruption to overwrite allocator metadata, leading to arbitrary memory write primitives and remote code execution.\n\nPrevention:\nImmediately assign ptr = NULL after free(ptr). Calling free(NULL) is guaranteed safe by the C standard.",
    "bullet_points": [
      "Double free calls free() twice on the same pointer.",
      "Corrupts allocator free list metadata, creating circular linked list loops.",
      "Major security vulnerability; prevent by setting ptr = NULL after every free()."
    ],
    "code_snippet": {
      "language": "c",
      "code": "int *p = malloc(sizeof(int));\nfree(p);\n// p = NULL; // Omitting this creates double free vulnerability!\n\nfree(p); // FATAL: Double free corruption crash (SIGABRT)!"
    },
    "pro_tip": "Modern glibc allocators detect double frees and abort immediately with: 'double free or corruption (fasttop)'.",
    "company_tags": [
      "Google",
      "Microsoft",
      "Apple"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 55
  },
  {
    "id": "int-c-056",
    "topic_id": "topic-c",
    "title": "How does the Heap Allocator work internally (brk, sbrk, and mmap system calls)?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "malloc() is a user-space C library function, not a direct system call. It requests memory from the OS kernel using two underlying system calls:\n\n1. brk() and sbrk():\n   - Used for small allocations (typically < 128KB in glibc).\n   - Manipulates the 'program break', which marks the end of the process's data segment.\n   - sbrk(increment) moves the break pointer upward into unmapped virtual memory to expand the heap.\n2. mmap():\n   - Used for large allocations (typically >= 128KB, e.g. MMAP_THRESHOLD).\n   - Maps an anonymous, private page-aligned memory block directly from OS kernel pages into the process virtual address space.\n   - When free() is called on an mmap-allocated block, the memory is returned immediately to the OS kernel via munmap().",
    "bullet_points": [
      "malloc uses brk/sbrk for small blocks by moving the heap program break.",
      "Uses mmap for large allocations (>= 128KB), mapping anonymous virtual pages.",
      "mmap blocks are returned immediately to the OS kernel upon munmap()."
    ],
    "code_snippet": {
      "language": "c",
      "code": "// Inspecting program break using sbrk:\n#include <unistd.h>\nvoid *current_brk = sbrk(0); // Query current end of heap"
    },
    "pro_tip": "Explaining brk vs mmap proves you understand real OS kernel and memory subsystem internals.",
    "company_tags": [
      "Amazon",
      "Google",
      "Red Hat",
      "Meta"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 56
  },
  {
    "id": "int-c-057",
    "topic_id": "topic-c",
    "title": "What is Heap Fragmentation (Internal vs External Fragmentation)?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Fragmentation reduces the usable efficiency of dynamically allocated memory:\n\n1. Internal Fragmentation:\n   - Occurs when memory allocated to a process is larger than the requested amount.\n   - Cause: Heap allocators allocate memory in fixed-size quantum blocks (e.g. 8-byte or 16-byte alignment) plus chunk headers storing size and metadata. If you request 5 bytes, the allocator might allocate 16 bytes. The 11 wasted bytes inside the allocated chunk constitute internal fragmentation.\n2. External Fragmentation:\n   - Occurs when total free memory across the heap is ample, but it is divided into small, non-contiguous scattered holes.\n   - Cause: Repeated allocations and deallocations of varying sizes over long periods.\n   - Result: A request for 100 contiguous bytes fails even if total free heap memory exceeds 10,000 bytes!",
    "bullet_points": [
      "Internal fragmentation: Wasted space inside allocated blocks due to alignment/headers.",
      "External fragmentation: Free memory broken into non-contiguous holes.",
      "External fragmentation prevents large allocations even when total free RAM is high."
    ],
    "code_snippet": {
      "language": "c",
      "code": "// Custom Memory Pool / Arena Allocator avoids fragmentation:\n// Pre-allocates a massive contiguous buffer and hands out fixed-size blocks."
    },
    "pro_tip": "Solution for embedded/game systems: Implement Fixed-Size Block Allocators (Object Pools) or Arena Allocators to eliminate external fragmentation completely.",
    "company_tags": [
      "NVIDIA",
      "Intel",
      "Sony"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 57
  },
  {
    "id": "int-c-058",
    "topic_id": "topic-c",
    "title": "How do you dynamically allocate and free a 2D Array (Matrix) in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Two primary methods exist to dynamically allocate a 2D matrix (rows x cols):\n\nMethod 1: Array of Pointers (Discontinuous Rows):\n- Allocate an array of row pointers: int **mat = malloc(rows * sizeof(int*));\n- Loop through rows and allocate each: mat[i] = malloc(cols * sizeof(int));\n- Freeing requires a loop: Free each mat[i], then free(mat).\n- Disadvantage: Multiple heap allocations, rows are scattered across RAM (poor cache locality).\n\nMethod 2: Single Contiguous Block (Best Practice):\n- Allocate one continuous block: int *mat = malloc(rows * cols * sizeof(int));\n- Access element via: mat[i * cols + j];\n- Frees in a single free(mat) call with superior CPU cache locality.",
    "bullet_points": [
      "Method 1 allocates an array of pointers (int**), requiring row-by-row allocation and free.",
      "Method 2 allocates a single flat buffer (rows * cols), providing superior cache performance.",
      "Single buffer frees with a single free() call."
    ],
    "code_snippet": {
      "language": "c",
      "code": "// Contiguous 2D Matrix (Best Practice):\nint *matrix = malloc(ROWS * COLS * sizeof(int));\n// Access: matrix[r * COLS + c] = 42;\nfree(matrix);"
    },
    "pro_tip": "Always propose Method 2 (contiguous single allocation) first to demonstrate cache awareness.",
    "company_tags": [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 58
  },
  {
    "id": "int-c-059",
    "topic_id": "topic-c",
    "title": "Can you call free() on memory that was not allocated dynamically? What happens?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "No! Calling free() on any pointer that was not returned by malloc(), calloc(), or realloc() is strictly UNDEFINED BEHAVIOR:\n\nScenarios:\n1. Calling free() on a stack variable pointer (e.g. int x; free(&x);).\n2. Calling free() on a static/global variable.\n3. Calling free() on an interior pointer (e.g. ptr + 5).\n\nConsequences:\n- The heap allocator attempts to inspect the chunk header metadata preceding the passed pointer address.\n- Because stack/global memory contains arbitrary values, the allocator reads corrupted header sizes and aborts execution immediately with: 'free(): invalid pointer' or a fatal segmentation fault.",
    "bullet_points": [
      "Calling free() on stack, global, or interior pointers causes undefined behavior.",
      "Allocator expects chunk metadata headers right before the pointer address.",
      "Results in immediate SIGABRT: 'free(): invalid pointer'."
    ],
    "code_snippet": {
      "language": "c",
      "code": "int stack_var = 10;\n// free(&stack_var); // CRASH: free(): invalid pointer (SIGABRT)"
    },
    "pro_tip": "Remember: free() only works on base addresses returned directly by heap allocation routines.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 59
  },
  {
    "id": "int-c-060",
    "topic_id": "topic-c",
    "title": "What happens when malloc(0) is called in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "The behavior of malloc(0) is implementation-defined by the C standard:\n\nPossible Behaviors:\n1. Returns NULL: The implementation treats 0-byte allocation as having nothing to allocate and returns NULL.\n2. Returns a Non-NULL Unique Pointer: Many standard allocators (including glibc ptmalloc) allocate the minimum chunk size (including allocator metadata) and return a non-null pointer address that can be safely passed to free().\n\nCrucial Rule:\n- Regardless of whether malloc(0) returns NULL or a non-null pointer, you MUST NEVER dereference that pointer! Dereferencing causes undefined behavior.\n- Best Practice: Always check: if (size == 0) return NULL; to avoid implementation-dependent behaviors.",
    "bullet_points": [
      "Behavior is implementation-defined: returns either NULL or a unique non-dereferenceable pointer.",
      "Dereferencing the returned pointer is strictly undefined behavior.",
      "The returned non-null pointer must still be passed to free() to prevent leaks."
    ],
    "code_snippet": {
      "language": "c",
      "code": "void *p = malloc(0);\nif (p != NULL) {\n    // p is valid to free, but DO NOT dereference!\n    free(p);\n}"
    },
    "pro_tip": "This is a favorite brainteaser to test whether a candidate knows edge cases in the C standard.",
    "company_tags": [
      "Qualcomm",
      "Amazon",
      "Intel"
    ],
    "frequency": "MEDIUM",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 60
  },
  {
    "id": "int-c-061",
    "topic_id": "topic-c",
    "title": "How does a custom Arena Allocator (Linear / Bump Allocator) work in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "An Arena (or Bump) Allocator is an ultra-fast memory allocation pattern widely used in game engines (Unreal Engine), compilers, and embedded systems:\n\nMechanics:\n1. Pre-allocation: Allocates a massive contiguous block of memory once at startup (e.g. 100MB).\n2. Bump Allocation: When memory is requested, it checks if enough capacity remains, returns the current pointer, and simply increments ('bumps') an internal offset pointer forward by size. Time complexity is O(1) (few CPU cycles, no locks or free-list searches).\n3. Bulk Deallocation: Individual blocks are NEVER freed! Instead, the entire arena is reset back to zero (offset = 0) at the end of a frame or request lifecycle.\n\nAdvantages:\n- Zero fragmentation.\n- Massive throughput (hundreds of times faster than malloc).\n- Instant bulk cleanup.",
    "bullet_points": [
      "Pre-allocates a large buffer and advances ('bumps') an offset pointer for allocations.",
      "Allocation is O(1) in 3 CPU instructions; individual frees are eliminated.",
      "The entire arena is cleared in bulk at the end of a frame or transaction."
    ],
    "code_snippet": {
      "language": "c",
      "code": "typedef struct {\n    char *buffer;\n    size_t capacity;\n    size_t offset;\n} Arena;\n\nvoid* arena_alloc(Arena *a, size_t size) {\n    if (a->offset + size > a->capacity) return NULL;\n    void *ptr = &a->buffer[a->offset];\n    a->offset += (size + 7) & ~7; // 8-byte alignment\n    return ptr;\n}\nvoid arena_reset(Arena *a) { a->offset = 0; }"
    },
    "pro_tip": "Mentioning Arena Allocators indicates elite systems-level engineering capability.",
    "company_tags": [
      "NVIDIA",
      "Epic Games",
      "Google"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 61
  },
  {
    "id": "int-c-062",
    "topic_id": "topic-c",
    "title": "What are Bitfields in C Structures, and what are their limitations?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Bitfields allow defining struct members with explicit bit-widths to conserve memory and map directly to hardware registers:\n\nSyntax:\nstruct Reg {\n    unsigned int enable : 1; // 1 bit\n    unsigned int mode   : 3; // 3 bits (values 0-7)\n    unsigned int flag   : 4; // 4 bits (values 0-15)\n};\n\nLimitations & Gotchas:\n1. Address-of Prohibited: You CANNOT take the address of a bitfield (&reg.enable is illegal) because memory addresses in hardware refer to byte boundaries, not individual bits.\n2. Implementation-Defined Ordering: The C standard does not specify whether bitfields are laid out from Least-Significant-Bit (LSB) or Most-Significant-Bit (MSB) within the byte/word. Makes them non-portable across different CPU architectures without compiler-specific macros.\n3. Type Restrictions: Only integer types (_Bool, signed int, unsigned int) are standard.",
    "bullet_points": [
      "Allows declaring struct fields with exact bit widths (e.g. unsigned int flag : 1).",
      "Taking the address of a bitfield (&field) is strictly prohibited.",
      "Bit ordering (MSB to LSB vs LSB to MSB) is implementation-defined."
    ],
    "code_snippet": {
      "language": "c",
      "code": "struct DeviceFlags {\n    unsigned int is_ready : 1;\n    unsigned int error_code : 3;\n};\nstruct DeviceFlags dev;\n// &dev.is_ready; // COMPILE ERROR: Cannot take address of bitfield"
    },
    "pro_tip": "In embedded drivers, explicit bit-masking (using | and &) is often preferred over bitfields for guaranteed cross-compiler portability.",
    "company_tags": [
      "Intel",
      "Qualcomm",
      "ARM"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 62
  },
  {
    "id": "int-c-063",
    "topic_id": "topic-c",
    "title": "What is the difference between passing a pointer by value and passing a pointer by reference in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "C has NO native pass-by-reference syntax (unlike C++ with &). All arguments in C are passed strictly by value:\n\nPassing Pointer by Value (int *ptr):\n- A copy of the pointer address is passed to the function.\n- Modifying the pointed-to memory (*ptr = 5) affects the caller's memory.\n- Reassigning the pointer itself (ptr = malloc(...)) modifies ONLY the local copy; the caller's pointer remains completely unaffected!\n\nSimulating Pass-by-Reference for Pointers (int **ptr):\n- Pass the memory address of the pointer variable (&ptr).\n- The function receives a double pointer, allowing it to dereference (*ptr = malloc(...)) and update the caller's pointer address directly.",
    "bullet_points": [
      "C is strictly pass-by-value; passing a pointer passes a copy of the address.",
      "Modifying *ptr changes caller data; reassigning ptr does not change caller's pointer.",
      "To modify caller's pointer address, pass a double pointer (int**)."
    ],
    "code_snippet": {
      "language": "c",
      "code": "void bad_alloc(int *p)  { p = malloc(sizeof(int)); } // Modifies copy only!\nvoid good_alloc(int **p) { *p = malloc(sizeof(int)); } // Modifies caller pointer!"
    },
    "pro_tip": "Illustrate the stack frame popping to show why bad_alloc leaves the caller's pointer pointing to garbage.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "TCS"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 63
  },
  {
    "id": "int-c-064",
    "topic_id": "topic-c",
    "title": "What does alloca() do in C, and how does it differ from malloc()?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "alloca() allocates temporary memory directly on the caller's Stack frame rather than the Heap:\n\nKey Differences:\n1. Deallocation: Memory allocated via alloca() is automatically freed when the calling function returns (when the stack frame pops). You NEVER call free() on it!\n2. Speed: Blazingly fast (simply decrements the CPU stack pointer register esp/rsp by size).\n3. Dangers: Does NOT check for stack overflow. Allocating too much memory crashes the application with an instant stack overflow segfault.\n4. Non-Standard: POSIX / compiler extension, not part of ANSI ISO C standard.",
    "bullet_points": [
      "alloca() allocates memory on the stack frame; automatically freed upon function return.",
      "Never call free() on alloca-allocated memory.",
      "Risks immediate stack overflow if large sizes are requested."
    ],
    "code_snippet": {
      "language": "c",
      "code": "#include <alloca.h>\nvoid temp_work(size_t len) {\n    char *buf = alloca(len); // Allocated on stack\n    // Automatically deallocated when temp_work() returns!\n}"
    },
    "pro_tip": "Modern C99 VLAs provide cleaner syntax for dynamic stack allocation, though both carry stack overflow risks.",
    "company_tags": [
      "Apple",
      "Google",
      "Red Hat"
    ],
    "frequency": "MEDIUM",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 64
  },
  {
    "id": "int-c-065",
    "topic_id": "topic-c",
    "title": "What is the container_of() macro in the Linux Kernel, and how does it work?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "container_of() is a legendary macro in the Linux Kernel used to obtain a pointer to an enclosing structure given only a pointer to one of its inner members:\n\nDefinition:\n#define container_of(ptr, type, member) \\\n    ((type *)((char *)(ptr) - offsetof(type, member)))\n\nMechanics:\n1. offsetof(type, member) calculates the byte distance from the start of the struct to that member.\n2. (char*)(ptr) casts the member pointer to a byte pointer.\n3. Subtracting the offset from the member pointer shifts the pointer back to the exact starting address of the enclosing parent structure!\n4. Casts the result back to (type*).\n\nApplication: Powers intrusive linked lists (struct list_head) throughout the Linux Kernel, allowing lists to be embedded directly into structs with zero memory allocations.",
    "bullet_points": [
      "Retrieves parent structure pointer from an inner member pointer.",
      "Calculates: (type*)((char*)(ptr) - offsetof(type, member)).",
      "Foundational to Linux Kernel intrusive data structures (struct list_head)."
    ],
    "code_snippet": {
      "language": "c",
      "code": "struct Task {\n    int id;\n    struct list_head list; // Embedded intrusive node\n};\n// Given a pointer to &task->list, retrieve parent struct Task*:\nstruct Task *t = container_of(node_ptr, struct Task, list);"
    },
    "pro_tip": "Explaining container_of() demonstrates that you understand real-world systems architecture.",
    "company_tags": [
      "Google",
      "Red Hat",
      "NVIDIA",
      "Meta"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 65
  },
  {
    "id": "int-c-066",
    "topic_id": "topic-c",
    "title": "Can a C structure contain a pointer to itself? What is a Self-Referential Structure?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Yes! A structure cannot contain an instance of itself (because its size would be infinite), but it CAN contain a pointer to its own type. This is called a Self-Referential Structure:\n\nWhy It Works:\n- All pointers have a fixed, known size (8 bytes on 64-bit systems) regardless of what they point to. The compiler can easily compute the structure's memory footprint.\n\nUse Cases:\n- Foundational building block for dynamic data structures in C: Singly Linked Lists, Doubly Linked Lists, Binary Search Trees, and Graphs.",
    "bullet_points": [
      "Structure cannot contain an instance of itself, but can contain a pointer to its own type.",
      "Pointer has a fixed size (8 bytes), allowing compiler to calculate struct size.",
      "Foundational for Linked Lists, Trees, and Graph data structures."
    ],
    "code_snippet": {
      "language": "c",
      "code": "struct Node {\n    int data;\n    struct Node *next; // Self-referential pointer\n};"
    },
    "pro_tip": "If you wrote 'struct Node next;' (without *), the compiler would throw: 'field has incomplete type' due to infinite recursive sizing.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 66
  },
  {
    "id": "int-c-067",
    "topic_id": "topic-c",
    "title": "What is the difference between passing a structure by value vs passing by pointer in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Comparison of performance and semantics:\n\n1. Passing by Value (void process(struct Data d)):\n   - Copies the entire structure byte-by-byte onto the function stack frame.\n   - If the structure is large (e.g. 500 bytes), copying consumes significant CPU cycles and stack space.\n   - Safe: Modifications inside the function do not alter the caller's original struct.\n2. Passing by Pointer (void process(const struct Data *d)):\n   - Copies ONLY an 8-byte pointer address onto the stack frame.\n   - Ultra-fast with zero copying overhead regardless of struct size.\n   - Using 'const' ensures the caller's data remains read-only and safe from accidental mutation.",
    "bullet_points": [
      "Pass-by-value copies all struct bytes onto the stack; slow for large structs.",
      "Pass-by-pointer copies only an 8-byte address; fast and memory-efficient.",
      "Best practice: Pass by const pointer (const struct Data *d) for read-only access."
    ],
    "code_snippet": {
      "language": "c",
      "code": "struct Heavy {\n    char payload[1024]; // 1 KB\n};\nvoid efficient(const struct Heavy *h) { /* Fast: Only 8-byte pointer copied */ }"
    },
    "pro_tip": "Always state: 'In production C, structs are almost always passed via const pointers for performance.'",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Intel"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 67
  },
  {
    "id": "int-c-068",
    "topic_id": "topic-c",
    "title": "What is an Incomplete Type (Opaque Pointer) in C, and how is it used for Information Hiding?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "An Incomplete Type is a type whose name is declared without defining its internal structure or members:\n\nImplementation (Opaque Pointer / PIMPL in C):\n- In the public header (my_queue.h):\n  typedef struct Queue Queue;\n  Queue* queue_create();\n  void queue_push(Queue *q, int val);\n- In the private source file (my_queue.c):\n  struct Queue {\n      int items[100];\n      int front, rear;\n  };\n\nBenefits:\n1. True Encapsulation: Callers cannot inspect or tamper with internal struct fields because the struct definition is completely invisible to client code.\n2. Binary Compatibility (ABI stability): Modifying the private struct fields does NOT require recompiling client code.",
    "bullet_points": [
      "Incomplete types declare a struct name without defining its internal fields in public headers.",
      "Achieves strict encapsulation and information hiding in pure C.",
      "Client code only interacts via opaque pointers (Queue*)."
    ],
    "code_snippet": {
      "language": "c",
      "code": "// Public header: Opaque pointer\ntypedef struct Connection Connection;\nConnection* connect_to_server(const char *url);\n// Client cannot access connection->socket_fd directly!"
    },
    "pro_tip": "Cite standard library examples: FILE* is an opaque pointer in <stdio.h>.",
    "company_tags": [
      "Google",
      "Apple",
      "Red Hat"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 68
  },
  {
    "id": "int-c-069",
    "topic_id": "topic-c",
    "title": "What are Flexible Array Members in C99 structures?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "A Flexible Array Member (C99 standard) allows declaring an unsized array as the LAST member of a structure:\n\nSyntax:\nstruct Packet {\n    int length;\n    char payload[]; // Flexible array member (must be last member!)\n};\n\nMechanics:\n- sizeof(struct Packet) evaluates ONLY the size of preceding members (length = 4 bytes); the flexible array contributes 0 bytes.\n- When allocating, allocate memory for the struct PLUS the desired payload length:\n  struct Packet *p = malloc(sizeof(struct Packet) + (num_bytes * sizeof(char)));\n- The payload can then be accessed as a normal array: p->payload[i].\n- Eliminates an extra pointer dereference and allocates everything in a single contiguous memory block.",
    "bullet_points": [
      "Unsized array declared as the last member of a structure (type name[]).",
      "sizeof(struct) excludes the flexible array member (contributes 0 bytes).",
      "Allocates header and payload together in a single contiguous malloc() call."
    ],
    "code_snippet": {
      "language": "c",
      "code": "struct Packet {\n    int length;\n    char data[]; // Flexible array member\n};\nint n = 100;\nstruct Packet *p = malloc(sizeof(struct Packet) + n);\np->length = n;\np->data[0] = 'A'; // Contiguous memory access!"
    },
    "pro_tip": "Before C99, developers used the non-standard 'struct hack' (char data[1]; or char data[0];).",
    "company_tags": [
      "Amazon",
      "Cisco",
      "Google"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 69
  },
  {
    "id": "int-c-070",
    "topic_id": "topic-c",
    "title": "What is Designated Initializer syntax in C99 for structs and arrays?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Designated Initializers (C99) allow initializing specific struct members or array indices by name or index rather than fixed positional order:\n\nAdvantages:\n1. Order Independence: Members can be initialized in any order.\n2. Robust against Refactoring: If fields are reordered in the struct definition, designated initializers remain correct.\n3. Automatic Zeroing: Any members not explicitly named are automatically initialized to zero.",
    "bullet_points": [
      "Initializes struct fields by name (.field = val) in any order.",
      "Unspecified members are automatically zero-initialized.",
      "Prevents bugs when struct fields are added or reordered."
    ],
    "code_snippet": {
      "language": "c",
      "code": "struct Point {\n    int x;\n    int y;\n    int z;\n};\n// Designated initializer:\nstruct Point p = { .y = 20, .x = 10 }; // z is automatically 0"
    },
    "pro_tip": "Used universally throughout the Linux Kernel driver file_operations structs.",
    "company_tags": [
      "Qualcomm",
      "NVIDIA",
      "Intel"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 70
  },
  {
    "id": "int-c-071",
    "topic_id": "topic-c",
    "title": "Can you compare two structures directly using '==' in C? Why or why not?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "No! In C, you CANNOT compare two structures using the equality operator (if (s1 == s2) causes a compile error):\n\nWhy C Disallows s1 == s2:\n1. Structure Padding Bytes: Due to compiler padding, unused bytes exist between members. Padding bytes contain random uninitialized garbage values. A bitwise comparison (like memcmp) would compare this garbage and falsely report equal structs as unequal!\n2. Pointer Semantics: If members are pointers, should '==' compare pointer addresses or perform deep content comparisons?\n\nHow to Compare Structures Correctly:\n- Write a custom comparison function that compares each member individually.",
    "bullet_points": [
      "Comparing structs with '==' is rejected by the compiler.",
      "Padding bytes contain random garbage, making bitwise memcmp() unreliable.",
      "Must compare members field-by-field in a dedicated equality function."
    ],
    "code_snippet": {
      "language": "c",
      "code": "struct User { int id; char name[20]; };\nint user_equals(const struct User *a, const struct User *b) {\n    return a->id == b->id && strcmp(a->name, b->name) == 0;\n}"
    },
    "pro_tip": "Interviewer follow-up: 'Can you use memcmp(&s1, &s2, sizeof(s1))?' Answer: Only if the struct was zeroed out completely using memset(&s, 0, sizeof(s)) at initialization!",
    "company_tags": [
      "TCS",
      "Infosys",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 71
  },
  {
    "id": "int-c-072",
    "topic_id": "topic-c",
    "title": "What is an Anonymous Structure or Anonymous Union in C11?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Standardized in C11, an Anonymous Struct or Union is an unnamed nested structure or union declared inside an enclosing structure:\n\nMechanics:\n- Members of the anonymous struct/union are promoted directly into the scope of the enclosing structure.\n- Eliminates redundant nested dot-notation access (e.g. parent.nested.field becomes simply parent.field).\n- Widely used for tagged unions (variants) and vectors.",
    "bullet_points": [
      "Unnamed nested struct/union whose members promote to the enclosing struct scope.",
      "Simplifies member access by removing redundant intermediate identifier names.",
      "Standardized in C11."
    ],
    "code_snippet": {
      "language": "c",
      "code": "struct Vector4 {\n    union {\n        struct { float x, y, z, w; }; // Anonymous struct\n        float v[4];                    // Anonymous union member\n    };\n};\nstruct Vector4 vec;\nvec.x = 1.0f; // Directly accessible!\nvec.v[0] = 2.0f; // Aliases x"
    },
    "pro_tip": "Extremely common in 3D graphics and math libraries (OpenGL, DirectX).",
    "company_tags": [
      "NVIDIA",
      "Epic Games",
      "Sony"
    ],
    "frequency": "MEDIUM",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 72
  },
  {
    "id": "int-c-073",
    "topic_id": "topic-c",
    "title": "How does Type Punning work using Unions in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Type Punning is the technique of reading the raw in-memory binary representation of one data type as if it were another data type:\n\nMechanics via Union:\n- Store a value into one member of a union, and read it out through a different member.\n- Unlike pointer casting (which violates strict aliasing), reading through an inactive union member is explicitly allowed and defined as valid in ISO C99 (TC3) and C11.\n\nUse Case: Inspecting IEEE 754 floating-point sign, exponent, and mantissa bit patterns without bit-shift conversions.",
    "bullet_points": [
      "Type punning reads the memory representation of one type as another.",
      "Permitted and well-defined via unions in ISO C99/C11.",
      "Used for inspecting float bit representations and fast inverse square root math."
    ],
    "code_snippet": {
      "language": "c",
      "code": "union FloatBits {\n    float f;\n    uint32_t bits;\n};\nunion FloatBits fb;\nfb.f = -1.0f;\nprintf(\"Sign bit: %u\\n\", (fb.bits >> 31) & 1); // 1 (negative)"
    },
    "pro_tip": "Cite the famous Quake III Fast Inverse Square Root algorithm which relied on floating-point bit manipulation.",
    "company_tags": [
      "NVIDIA",
      "Intel",
      "Apple"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 73
  },
  {
    "id": "int-c-074",
    "topic_id": "topic-c",
    "title": "What is a Tagged Union (Discriminated Union) in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Because standard C unions do not remember which member is currently active, a Tagged Union packages a union together with an enum tag inside an enclosing structure:\n\nMechanics:\n- The enum tag explicitly identifies the type of data currently stored in the union.\n- Program code checks the tag in a switch statement before accessing the union member, guaranteeing type safety.\n- Models algebraic data types (enums with values) similar to Rust or Swift.",
    "bullet_points": [
      "Enclosing struct containing an enum tag and a union.",
      "Enum tag tracks which union member holds valid data.",
      "Guarantees type-safe access through switch-case pattern matching."
    ],
    "code_snippet": {
      "language": "c",
      "code": "enum ValueType { TYPE_INT, TYPE_FLOAT, TYPE_STRING };\nstruct TaggedValue {\n    enum ValueType type; // The Tag\n    union {\n        int i;\n        float f;\n        char str[32];\n    } data;\n};"
    },
    "pro_tip": "Used to build JSON parsers and AST (Abstract Syntax Tree) compiler nodes in C.",
    "company_tags": [
      "Google",
      "Bloomberg",
      "Microsoft"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 74
  },
  {
    "id": "int-c-075",
    "topic_id": "topic-c",
    "title": "How does the compiler lay out members of a Nested Structure in memory?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "When a structure contains an inner structure as a member, memory layout follows nested alignment rules:\n\nRules:\n1. The inner struct's members are laid out with their own padding internally.\n2. The entire inner structure must be aligned to a memory boundary that is a multiple of its own largest internal member.\n3. The enclosing parent structure's total alignment is governed by the largest member across all nested structures.",
    "bullet_points": [
      "Nested struct members maintain internal padding.",
      "Inner struct aligns to its own largest internal member's boundary.",
      "Parent struct size is padded to a multiple of the global largest member."
    ],
    "code_snippet": {
      "language": "c",
      "code": "struct Inner { char c; int x; }; // 8 bytes (1 + 3 pad + 4)\nstruct Outer {\n    short s;            // 2 bytes\n    // 2 bytes pad to align Inner on 4-byte boundary\n    struct Inner inner; // 8 bytes\n}; // Total size: 12 bytes"
    },
    "pro_tip": "Demonstrating nested alignment calculation shows mastery of systems architecture.",
    "company_tags": [
      "Qualcomm",
      "Intel",
      "Broadcom"
    ],
    "frequency": "MEDIUM",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 75
  },
  {
    "id": "int-c-076",
    "topic_id": "topic-c",
    "title": "What is the difference between struct Point p; and typedef struct Point Point; Point p;?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "In C, structure tags reside in a separate namespace called the 'Tag Namespace':\n\n1. Without Typedef:\n   - Declaring struct Point { int x, y; }; requires you to write the 'struct' keyword on EVERY variable declaration: struct Point p1;\n2. With Typedef:\n   - typedef struct Point Point; aliases the struct tag into the regular identifier namespace.\n   - Allows declaring variables cleanly without the 'struct' keyword: Point p1; (similar to C++).",
    "bullet_points": [
      "C structures reside in a separate tag namespace.",
      "Without typedef, variable declarations require the 'struct' keyword.",
      "typedef aliases the tag into the regular namespace for clean declaration."
    ],
    "code_snippet": {
      "language": "c",
      "code": "// Idiomatic C declaration with typedef:\ntypedef struct Node {\n    int data;\n    struct Node *next; // Notice: Must still use 'struct Node' inside definition!\n} Node;\n\nNode n; // Clean declaration without 'struct'"
    },
    "pro_tip": "Note: Inside the self-referential pointer of the struct definition, you must still use 'struct Node* next' because the typedef alias is not yet complete.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 76
  },
  {
    "id": "int-c-077",
    "topic_id": "topic-c",
    "title": "What is the memory size of an empty struct in C vs C++?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Empty structures are treated completely differently between C and C++:\n\n1. In C (Standard C99/C11):\n   - The C standard states that a struct must have at least one named member. An empty struct (struct Empty {};) is technically a Constraint Violation!\n   - In GCC with C mode, it is supported as an extension and evaluates to sizeof(struct Empty) = 0 bytes.\n2. In C++:\n   - An empty struct is fully legal, but sizeof evaluates to AT LEAST 1 byte (sizeof(Empty) == 1)!\n   - Why C++ enforces 1 byte: In C++, every object must have a unique memory address so that pointers to distinct objects can never compare equal (&a != &b).",
    "bullet_points": [
      "In standard C, empty structs are illegal (GCC extension yields 0 bytes).",
      "In C++, an empty struct is guaranteed to be at least 1 byte.",
      "C++ requires 1 byte to ensure distinct object instances have distinct memory addresses."
    ],
    "code_snippet": {
      "language": "c",
      "code": "struct Empty {};\n// In C (GCC):   sizeof(struct Empty) == 0\n// In C++:        sizeof(struct Empty) == 1"
    },
    "pro_tip": "This is an iconic trick question comparing C and C++ language design specifications.",
    "company_tags": [
      "Microsoft",
      "Amazon",
      "Apple"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 77
  },
  {
    "id": "int-c-078",
    "topic_id": "topic-c",
    "title": "What is a Stack Frame (Activation Record), and what is pushed during a C function call?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "When a C function is called, a Stack Frame is pushed onto the thread's call stack:\n\nContents of a Stack Frame (High Memory to Low Memory):\n1. Function Parameters / Arguments (passed via registers on x86-64, or pushed on stack if exceeding register limits).\n2. Return Address: The memory address of the next machine instruction in the caller function to resume execution after return.\n3. Saved Frame Pointer (Previous Base Pointer / RBP): Points to the base of the caller's stack frame.\n4. Local Variables: Memory allocated for local auto variables declared in the function.\n5. Callee-Saved Registers: General-purpose CPU registers preserved by the called function.\n\nStack Pointer (RSP) tracks the top of the stack; Base Pointer (RBP) anchors access to local variables and parameters.",
    "bullet_points": [
      "Stack frame stores parameters, return address, saved base pointer (RBP), and local variables.",
      "Pushing frames expands stack downward (high memory to low memory on x86).",
      "Popping frames restores caller registers and resumes at the return address."
    ],
    "code_snippet": {
      "language": "c",
      "code": "// Stack frame layout during call:\n// [Caller Stack Frame]\n// [Return Address]     <-- Overwritten in buffer overflow exploits!\n// [Saved RBP]\n// [Local Variables]    <-- char buffer[16]"
    },
    "pro_tip": "Security connection: Explaining stack frames proves how stack smashing attacks overwrite the return address to hijack control flow.",
    "company_tags": [
      "Google",
      "Intel",
      "NVIDIA"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 78
  },
  {
    "id": "int-c-079",
    "topic_id": "topic-c",
    "title": "What is Tail Call Optimization (TCO) in C, and how does it prevent Stack Overflow in recursion?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "A Tail Call occurs when a function's very last action before returning is calling another function (or itself in Tail Recursion):\n\nTail Call Optimization (TCO):\n- In standard recursion, every recursive call allocates a new stack frame, eventually exhausting stack memory (Stack Overflow) on deep inputs (O(n) stack space).\n- When a call is in the tail position, the compiler realizes the current stack frame's local variables are no longer needed.\n- Instead of pushing a new frame, the compiler simply reuses the CURRENT stack frame and overwrites the parameters with a jump instruction (JMP)!\n- Transforms recursion into an iterative loop with O(1) constant stack space.",
    "bullet_points": [
      "Tail call: Recursive call is the absolute final action before return.",
      "Compiler reuses current stack frame via JMP instruction instead of CALL.",
      "Converts O(n) recursive stack growth into O(1) iterative execution."
    ],
    "code_snippet": {
      "language": "c",
      "code": "// Non-tail recursive: Must multiply after return (Stack grows)\nint fact(int n) { return n == 1 ? 1 : n * fact(n - 1); }\n\n// Tail-recursive: Accumulator holds state, O(1) stack space with -O2\nint fact_tail(int n, int acc) {\n    return n == 1 ? acc : fact_tail(n - 1, n * acc);\n}"
    },
    "pro_tip": "Remind the interviewer: TCO requires compiler optimization flags (like gcc -O2 or -O3). In unoptimized debug builds (-O0), frames are still pushed.",
    "company_tags": [
      "Amazon",
      "Google",
      "Apple"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 79
  },
  {
    "id": "int-c-080",
    "topic_id": "topic-c",
    "title": "What are Variadic Functions in C (printf), and how do you use <stdarg.h>?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "A Variadic Function is a function that accepts a variable number of arguments (syntax: func(int fixed, ...)):\n\nKey Macros in <stdarg.h>:\n1. va_list: A pointer type used to track the variable arguments list.\n2. va_start(ap, last_fixed_param): Initializes the va_list pointer to point immediately after the last named fixed parameter.\n3. va_arg(ap, type): Retrieves the next argument as the specified 'type' and advances the pointer.\n4. va_end(ap): Cleans up the va_list before function exit.\n\nLimitation: Variadic functions have NO built-in way to know how many arguments were passed! The caller must supply argument count via a format string (like printf's \"%d %s\") or a sentinel terminal value (like NULL).",
    "bullet_points": [
      "Accepts variable argument counts via ellipsis (...) syntax.",
      "Managed using va_list, va_start, va_arg, and va_end from <stdarg.h>.",
      "Caller must supply argument count or format string to prevent memory corruption."
    ],
    "code_snippet": {
      "language": "c",
      "code": "#include <stdarg.h>\nint sum_all(int count, ...) {\n    va_list args;\n    va_start(args, count);\n    int total = 0;\n    for (int i = 0; i < count; i++) {\n        total += va_arg(args, int); // Fetch next argument\n    }\n    va_end(args);\n    return total;\n}"
    },
    "pro_tip": "Trap: Passing the wrong type to va_arg() causes undefined behavior because va_arg reads raw stack memory without runtime type reflection.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Oracle"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 80
  },
  {
    "id": "int-c-081",
    "topic_id": "topic-c",
    "title": "What are Callback Functions in C, and how do you implement them using Function Pointers?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "A Callback Function is a function that is passed as a pointer argument to another function, which executes the callback when a specific event or operation finishes:\n\nArchitecture:\n- Decouples generic algorithms (e.g. sorting, event loops, timer ticks) from application-specific logic.\n- Standard Example: qsort() receives a custom comparison callback function pointer.",
    "bullet_points": [
      "Function pointer passed as an argument to execute custom logic.",
      "Decouples reusable generic libraries from application business logic.",
      "Widely used in GUI event handling, thread creation, and sorting."
    ],
    "code_snippet": {
      "language": "c",
      "code": "void for_each(int *arr, int len, void (*action)(int)) {\n    for (int i = 0; i < len; i++) {\n        action(arr[i]); // Invoking callback\n    }\n}\nvoid print_item(int x) { printf(\"%d \", x); }\n// Usage: for_each(arr, 5, print_item);"
    },
    "pro_tip": "Point out that callback functions in C cannot carry enclosing lexical state (unlike lambdas or closures in Python/Java).",
    "company_tags": [
      "Amazon",
      "Qualcomm",
      "Cisco"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 81
  },
  {
    "id": "int-c-082",
    "topic_id": "topic-c",
    "title": "What is the difference between __cdecl, __stdcall, and __fastcall calling conventions?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Calling conventions dictate the assembly protocol for passing parameters and cleaning up the call stack:\n\n1. __cdecl (Default C calling convention):\n   - Arguments pushed on stack from Right-to-Left.\n   - Stack Cleanup: Caller cleans the stack (allows variadic functions like printf).\n2. __stdcall (Standard Windows API convention):\n   - Arguments pushed Right-to-Left.\n   - Stack Cleanup: Callee cleans the stack (smaller binary size, but cannot support variadic functions).\n3. __fastcall / System V AMD64 ABI (Default x86-64):\n   - First several arguments passed directly in CPU registers (RDI, RSI, RDX, RCX, R8, R9) rather than RAM stack.\n   - Blazingly fast function calls due to zero RAM bus traffic.",
    "bullet_points": [
      "__cdecl: Caller cleans stack; supports variadic functions.",
      "__stdcall: Callee cleans stack; standard in Windows Win32 API.",
      "x86-64 ABI passes first 6 arguments in CPU registers for maximum speed."
    ],
    "code_snippet": {
      "language": "c",
      "code": "// Windows API declaration:\nint __stdcall MessageBoxA(void*, const char*, const char*, unsigned int);"
    },
    "pro_tip": "Modern 64-bit systems standardize on fast register-based calling conventions, making legacy 32-bit stack conventions obsolete.",
    "company_tags": [
      "Microsoft",
      "Intel",
      "CrowdStrike"
    ],
    "frequency": "MEDIUM",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 82
  },
  {
    "id": "int-c-083",
    "topic_id": "topic-c",
    "title": "What is the difference between a Reentrant Function and a Thread-Safe Function?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Though related, they define different concurrency and interruption guarantees:\n\n1. Reentrant Function:\n   - A function that can be safely interrupted in the middle of execution, re-entered by an Interrupt Service Routine (ISR) or signal handler, and resumed later without state corruption.\n   - Criteria: Uses ONLY local stack variables, accesses no shared global/static state, and acquires NO locks or mutexes (locking in ISR causes immediate deadlock!).\n2. Thread-Safe Function:\n   - A function that can be safely called by multiple concurrent threads simultaneously.\n   - Can use mutexes, synchronization locks, or atomic operations to protect shared state.\n\nKey takeaway: All reentrant functions are thread-safe, but NOT all thread-safe functions are reentrant! (A function that holds a mutex is thread-safe, but NOT reentrant because re-entering from an ISR deadlocks).",
    "bullet_points": [
      "Reentrant functions can be interrupted and re-entered by ISRs/signals safely.",
      "Reentrant functions must not hold mutexes or access global static data.",
      "All reentrant functions are thread-safe; thread-safe functions with mutexes are NOT reentrant."
    ],
    "code_snippet": {
      "language": "c",
      "code": "// Non-reentrant (static buffer):\nchar* get_time() {\n    static char buf[32]; // Shared static memory\n    return buf;\n}\n\n// Reentrant & Thread-safe (caller provides buffer):\nvoid get_time_r(char *buf, size_t size) { /* uses caller stack */ }"
    },
    "pro_tip": "In POSIX, reentrant function variants are suffixed with '_r' (e.g., strtok_r, localtime_r).",
    "company_tags": [
      "Qualcomm",
      "Cisco",
      "Apple"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 83
  },
  {
    "id": "int-c-084",
    "topic_id": "topic-c",
    "title": "What is a Function Attribute in GCC (__attribute__((noreturn, constructor, deprecated)))?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "GCC and Clang support __attribute__ syntax to attach compiler directives to function declarations:\n\nKey Attributes:\n1. __attribute__((noreturn)): Informs compiler the function never returns to caller (e.g. exit(), abort()), suppressing uninitialized return warnings.\n2. __attribute__((constructor)): Instructs the linker to execute this function automatically BEFORE main() starts!\n3. __attribute__((destructor)): Executes automatically AFTER main() completes or exit() is called.\n4. __attribute__((deprecated)): Emits a compile-time warning if client code invokes this function.",
    "bullet_points": [
      "GCC attributes provide compiler and linker metadata for functions.",
      "constructor attribute executes functions before main() begins.",
      "destructor attribute executes functions automatically upon program termination."
    ],
    "code_snippet": {
      "language": "c",
      "code": "void __attribute__((constructor)) init_system() {\n    printf(\"Runs BEFORE main()!\\n\");\n}\nint main() {\n    printf(\"Inside main()\\n\");\n    return 0;\n}"
    },
    "pro_tip": "Interviewer brainteaser: 'How to print something in C before main() starts?' Answer: Use __attribute__((constructor)).",
    "company_tags": [
      "Google",
      "Red Hat",
      "Apple"
    ],
    "frequency": "MEDIUM",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 84
  },
  {
    "id": "int-c-085",
    "topic_id": "topic-c",
    "title": "What are Static Inline Functions in C header files, and why are they preferred?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "When placing inline function implementations inside header files (.h), declaring them as 'static inline' is standard practice:\n\nWhy 'static inline' is Required:\n- If you declare an inline function in a header without 'static', every .c file that includes that header will emit an external function symbol into its object file (.o).\n- When the linker attempts to link these object files together, it crashes with a fatal linker error: 'multiple definition of function / duplicate symbol'!\n- Adding 'static' gives the function Internal Linkage within each translation unit, allowing the compiler to inline it locally without exporting external symbols.",
    "bullet_points": [
      "Header inline functions must be declared 'static inline'.",
      "Prevents linker 'multiple definition' errors across multiple translation units.",
      "Gives internal linkage so compiler inlines code locally into each object file."
    ],
    "code_snippet": {
      "language": "c",
      "code": "// In my_math.h:\nstatic inline int max(int a, int b) {\n    return (a > b) ? a : b;\n}"
    },
    "pro_tip": "This is an absolute must-know rule for C header library architects.",
    "company_tags": [
      "Linux Kernel",
      "Google",
      "Intel"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 85
  },
  {
    "id": "int-c-086",
    "topic_id": "topic-c",
    "title": "What is the difference between passing an array vs passing a pointer to a function?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "In C function parameter lists, array syntax is purely syntactic sugar for a pointer:\n\nSyntax Equivalence:\nvoid func(int arr[]) is identical to void func(int *arr) and void func(int arr[100]).\n\nConsequences:\n- Regardless of what number you put inside the brackets (e.g. int arr[100]), the compiler treats it simply as int *arr.\n- The function does NOT receive a 100-element array; it receives only an 8-byte pointer to the first element.\n- Calling sizeof(arr) inside the function returns 8 bytes (pointer size), NOT the array size.\n- You MUST pass the array length as an explicit separate parameter: void func(int *arr, size_t len).",
    "bullet_points": [
      "int arr[] in parameter lists is identical to int *arr.",
      "The compiler decays array parameters into simple pointer variables.",
      "Array lengths must be passed as an explicit separate parameter."
    ],
    "code_snippet": {
      "language": "c",
      "code": "void print_arr(int arr[], size_t len) { // arr is int*\n    printf(\"sizeof(arr) = %zu\\n\", sizeof(arr)); // 8 bytes (pointer size!)\n}"
    },
    "pro_tip": "Remind the interviewer: 'An array parameter never copies the array; it passes the pointer address.'",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 86
  },
  {
    "id": "int-c-087",
    "topic_id": "topic-c",
    "title": "How does Recursion consume memory compared to Iteration?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Comparison of memory footprints and execution overhead:\n\n1. Recursion:\n   - Each recursive invocation pushes a brand-new Stack Frame onto the call stack.\n   - Consumes O(n) stack memory space proportional to the recursion depth.\n   - Incurs CPU function call overhead (saving registers, jumping instructions, returning).\n   - Risk: Deep recursion (thousands of levels) exhausts thread stack limits, causing fatal Stack Overflow crashes.\n2. Iteration (Loops):\n   - Uses a fixed, constant amount of memory: O(1) stack space.\n   - Executes fast machine jump/loop instructions without pushing stack frames.\n   - Immune to stack overflow.",
    "bullet_points": [
      "Recursion allocates O(n) stack frames; iteration consumes O(1) constant stack space.",
      "Deep recursion causes fatal Stack Overflow crashes.",
      "Iteration provides superior performance and cache efficiency."
    ],
    "code_snippet": {
      "language": "c",
      "code": "// Iterative Fibonacci: O(1) memory, zero stack overflow risk\nlong fib(int n) {\n    long a = 0, b = 1;\n    for (int i = 0; i < n; i++) {\n        long next = a + b; a = b; b = next;\n    }\n    return a;\n}"
    },
    "pro_tip": "Always convert recursive algorithms to iterative loops in safety-critical and embedded systems.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "TCS"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 87
  },
  {
    "id": "int-c-088",
    "topic_id": "topic-c",
    "title": "What is the difference between Text Mode (\"r\", \"w\") and Binary Mode (\"rb\", \"wb\") in C File I/O?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "The difference lies in how newline line terminators are translated by the runtime library:\n\n1. Text Mode (\"r\", \"w\"):\n   - Platform Translation: On Windows, newlines in files are CRLF ('\\r\\n'). When reading in text mode, C translates '\\r\\n' automatically into a single '\\n'. When writing, '\\n' is translated back into '\\r\\n'.\n   - End of File: On Windows, character 0x1A (Ctrl+Z) is interpreted as an explicit EOF indicator.\n2. Binary Mode (\"rb\", \"wb\"):\n   - Raw Byte Transparency: Reads and writes exact raw bytes with ZERO translation or modification.\n   - Mandatory for binary data (images, PDFs, compiled executables, network packets).\n   - On Linux/Unix, text mode and binary mode behave identically because Linux uses single '\\n' natively.",
    "bullet_points": [
      "Text mode translates newlines (e.g. CRLF <-> LF on Windows).",
      "Binary mode reads and writes raw byte streams without modification.",
      "Binary mode is mandatory for images, executables, and protocol packets."
    ],
    "code_snippet": {
      "language": "c",
      "code": "FILE *f = fopen(\"image.png\", \"rb\"); // Binary mode prevents byte corruption!\nif (!f) perror(\"File open failed\");"
    },
    "pro_tip": "Reading binary files in text mode on Windows silently corrupts data because 0x0D 0x0A sequences get collapsed!",
    "company_tags": [
      "Microsoft",
      "Sony",
      "Amazon"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 88
  },
  {
    "id": "int-c-089",
    "topic_id": "topic-c",
    "title": "What is the difference between fread()/fwrite() and fscanf()/fprintf()?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Comparison of binary block I/O vs formatted text I/O:\n\n1. fread() & fwrite() (Binary Block I/O):\n   - Directly transfer raw memory byte blocks between RAM and disk without string conversion.\n   - Syntax: size_t fread(void *ptr, size_t size, size_t count, FILE *stream);\n   - Fast and compact: An integer 1000000 consumes exactly 4 raw bytes in binary.\n2. fscanf() & fprintf() (Formatted Text I/O):\n   - Convert binary numbers into human-readable ASCII text strings.\n   - Slower due to parsing and string formatting overhead.\n   - Larger disk footprint: The integer 1000000 consumes 7 ASCII text bytes (\"1000000\").",
    "bullet_points": [
      "fread/fwrite perform direct memory block byte transfers (fast, binary).",
      "fprintf/fscanf convert data to/from human-readable ASCII text (slower).",
      "fread/fwrite are standard for structs, arrays, and media files."
    ],
    "code_snippet": {
      "language": "c",
      "code": "struct Record rec = { 101, 3.14 };\n// Fast binary write of entire struct:\nfwrite(&rec, sizeof(struct Record), 1, fp);"
    },
    "pro_tip": "Always check the return value of fread(): It returns the number of complete items successfully read, not total bytes.",
    "company_tags": [
      "Amazon",
      "Cisco",
      "Qualcomm"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 89
  },
  {
    "id": "int-c-090",
    "topic_id": "topic-c",
    "title": "What do fseek() and ftell() do in C? How do you calculate file size?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "fseek() and ftell() control and inspect the file position indicator:\n\n1. fseek(FILE *stream, long offset, int whence):\n   - Repositions the file read/write cursor.\n   - 'whence' flags: SEEK_SET (from beginning), SEEK_CUR (from current position), SEEK_END (from end of file).\n2. ftell(FILE *stream):\n   - Returns the current byte offset of the file position indicator from the start of the file.\n\nCalculating File Size Idiom:\n- Seek to the end of file: fseek(fp, 0, SEEK_END);\n- Query byte offset: long size = ftell(fp);\n- Rewind back to start: rewind(fp); (or fseek(fp, 0, SEEK_SET)).",
    "bullet_points": [
      "fseek() moves the file cursor relative to SEEK_SET, SEEK_CUR, or SEEK_END.",
      "ftell() returns current cursor byte position.",
      "Determine file size: fseek(SEEK_END) followed by ftell()."
    ],
    "code_snippet": {
      "language": "c",
      "code": "FILE *fp = fopen(\"data.bin\", \"rb\");\nfseek(fp, 0, SEEK_END);      // Move to end\nlong file_size = ftell(fp);  // Get size in bytes\nrewind(fp);                  // Reset cursor back to beginning"
    },
    "pro_tip": "For files larger than 2GB on 32-bit systems, use 64-bit functions: fseeko() and ftello() with off_t.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 90
  },
  {
    "id": "int-c-091",
    "topic_id": "topic-c",
    "title": "What does fflush() do, and why is fflush(stdin) undefined behavior?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "C standard I/O library (<stdio.h>) maintains internal user-space memory buffers to minimize slow OS kernel disk/terminal write system calls:\n\n1. fflush(stdout / output_stream):\n   - Immediately forces all unwritten buffered data in user-space buffers out to the operating system file or console screen.\n   - Useful for debugging log messages before expected crashes.\n2. fflush(stdin) (UNDEFINED BEHAVIOR):\n   - The C standard explicitly dictates that fflush() is ONLY defined for OUTPUT streams.\n   - Calling fflush(stdin) is completely UNDEFINED BEHAVIOR!\n   - While Microsoft MSVC treats it as an extension to discard input buffer characters, on GCC/Linux it is an invalid operation that fails silently.\n   - Safe way to clear input buffer: while ((c = getchar()) != '\\n' && c != EOF);.",
    "bullet_points": [
      "fflush(output_stream) forces buffered output data to disk or terminal.",
      "fflush(stdin) is UNDEFINED BEHAVIOR in standard C.",
      "Clear input buffer safely using: while ((c = getchar()) != '\\n' && c != EOF);"
    ],
    "code_snippet": {
      "language": "c",
      "code": "// Safe buffer clearing:\nint c;\nwhile ((c = getchar()) != '\\n' && c != EOF) { /* discard */ }"
    },
    "pro_tip": "This is one of the most famous traps in university and campus recruitment exams.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "TCS"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 91
  },
  {
    "id": "int-c-092",
    "topic_id": "topic-c",
    "title": "What is the difference between File Descriptors (int fd) and File Streams (FILE*)?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Comparison of Operating System system calls vs C Standard Library buffering:\n\n1. File Descriptors (int fd):\n   - Low-level, unbuffered OS kernel integer handles (POSIX open, read, write, close).\n   - Every read() and write() triggers an expensive OS kernel context switch.\n   - Direct interface to Linux hardware devices, pipes, and network sockets.\n2. File Streams (FILE*):\n   - High-level, buffered wrappers provided by the C Standard Library (fopen, fread, fwrite, fclose).\n   - Maintains an internal user-space memory buffer (typically 4KB-8KB).\n   - Minimizes kernel context switches by bundling small read/writes into bulk block transfers.\n   - Portable across Windows and POSIX.",
    "bullet_points": [
      "File descriptors (int) are low-level unbuffered OS kernel handles (read/write).",
      "FILE* streams provide high-level user-space buffered I/O (fread/fwrite).",
      "Convert between them using fileno(stream) and fdopen(fd, mode)."
    ],
    "code_snippet": {
      "language": "c",
      "code": "int fd = fileno(stdout); // Retrieves underlying OS file descriptor (1 for stdout)"
    },
    "pro_tip": "Always explain: FILE* builds on top of file descriptors to optimize throughput via buffering.",
    "company_tags": [
      "Google",
      "Red Hat",
      "Apple"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 92
  },
  {
    "id": "int-c-093",
    "topic_id": "topic-c",
    "title": "What is the difference between EOF and feof() in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Confusion between EOF and feof() is the leading cause of off-by-one loops in file reading:\n\n1. EOF (-1):\n   - A macro constant returned by I/O read functions (like fgetc(), getchar()) when an attempt to read past the end of file fails.\n2. feof(stream):\n   - A function that checks the internal EOF indicator flag on the stream.\n   - Crucial Trap: feof() returns true ONLY AFTER an actual read operation has already attempted to read PAST the end of file and failed!\n   - Anti-Pattern: while (!feof(fp)) { fread(...); process(); } will ALWAYS process the last record TWICE because feof() is false until an attempted read fails!",
    "bullet_points": [
      "EOF is the return value (-1) signaling read failure at end-of-file.",
      "feof() is only set AFTER a read operation has attempted to read past EOF.",
      "Never use while(!feof(fp)) as loop condition; test the read function return value directly."
    ],
    "code_snippet": {
      "language": "c",
      "code": "// CORRECT file loop:\nint ch;\nwhile ((ch = fgetc(fp)) != EOF) {\n    putchar(ch);\n}"
    },
    "pro_tip": "This loop pattern bug is present in thousands of C programs. Pointing it out impresses interviewers.",
    "company_tags": [
      "Amazon",
      "Oracle",
      "Qualcomm"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 93
  },
  {
    "id": "int-c-094",
    "topic_id": "topic-c",
    "title": "What is Undefined Behavior (UB), Unspecified Behavior, and Implementation-Defined Behavior in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "The ISO C standard classifies non-standard operations into 3 distinct categories:\n\n1. Undefined Behavior (UB):\n   - The standard imposes ZERO requirements. The program can crash, produce garbage results, or corrupt memory.\n   - The compiler is entitled to assume UB can NEVER happen, optimizing away code paths.\n   - Examples: Dereferencing NULL, signed integer overflow, array index out of bounds, division by zero.\n2. Implementation-Defined Behavior:\n   - The compiler must choose a consistent behavior AND DOCUMENT IT in the compiler manual.\n   - Examples: sizeof(int), signedness of plain char, bitfield ordering.\n3. Unspecified Behavior:\n   - The standard provides multiple valid alternatives, but the compiler does not have to document which one it chooses.\n   - Examples: Order of evaluation of function arguments (func(a(), b()) can evaluate a() first or b() first).",
    "bullet_points": [
      "Undefined Behavior: No guarantees; program can crash or produce corrupt optimizations.",
      "Implementation-Defined: Compiler must choose and officially document behavior (e.g. sizeof(int)).",
      "Unspecified: Order of evaluation of function parameters (a() or b() first)."
    ],
    "code_snippet": {
      "language": "c",
      "code": "// Undefined Behavior: Anything can happen!\nint *p = NULL;\n*p = 10; // UB: Hardware crash or optimizer eliminations"
    },
    "pro_tip": "Never say 'it prints X on my machine' for UB: Optimizers can change behavior between -O0 and -O3!",
    "company_tags": [
      "Google",
      "Microsoft",
      "Apple",
      "Intel"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 94
  },
  {
    "id": "int-c-095",
    "topic_id": "topic-c",
    "title": "Why is 'i = i++ + ++i;' Undefined Behavior in C? What are Sequence Points?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "This violates the fundamental Sequence Point rule in C (C99 \u00a76.5):\n\nSequence Point Rule:\n- Between the previous and next Sequence Point, an object's stored value can be modified at most ONCE by expression evaluation.\n- Furthermore, the prior value shall be accessed ONLY to determine the value to be stored.\n\nWhy i = i++ + ++i is UB:\n- 'i' is modified multiple times (i++ and ++i and assignment '=') without an intervening sequence point.\n- In C, the '+' operator does NOT introduce a sequence point; the order in which operands of '+' are evaluated is completely unspecified!\n- Compilers can emit assembly that produces completely different results under different optimization flags.\n\nWhere Sequence Points DO Occur: At ';', at comma operator ',', at '&&', at '||', at '?:', and before a function is called.",
    "bullet_points": [
      "Modifying a variable multiple times without an intervening sequence point is Undefined Behavior.",
      "The '+' operator does NOT introduce a sequence point.",
      "Sequence points occur at ';', '&&', '||', ',', and function call boundaries."
    ],
    "code_snippet": {
      "language": "c",
      "code": "// UNDEFINED BEHAVIOR:\n// int res = i++ + ++i;\n\n// WELL-DEFINED:\ni++;\nint res = i + (i + 1);\ni++;"
    },
    "pro_tip": "Always advise the interviewer: 'Never write multiple modifications to the same variable in a single expression.'",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 95
  },
  {
    "id": "int-c-096",
    "topic_id": "topic-c",
    "title": "Why does 'int a[5]; a[5] = 10;' compile without errors in C? What happens at runtime?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "C intentionally does NOT perform array bounds checking at compile time or runtime for raw performance:\n\nWhy It Compiles:\n- Array subscripting a[5] is pure syntactic sugar for *(a + 5).\n- The compiler simply calculates the memory address: BaseAddress + (5 * sizeof(int)) and generates a CPU store instruction.\n\nWhat Happens at Runtime:\n- It writes 10 into whatever memory happens to reside 20 bytes past the start of the array!\n- If that memory is another local variable, that variable is silently corrupted.\n- If it overwrites the saved frame pointer or return address, it can crash with a segmentation fault or stack smashing error upon returning from the function.\n- This is the textbook definition of a Buffer Overflow.",
    "bullet_points": [
      "C performs zero array bounds checking for raw execution speed.",
      "a[5] evaluates to *(a + 5), writing directly into adjacent memory.",
      "Causes silent data corruption, stack smashing, or segmentation faults."
    ],
    "code_snippet": {
      "language": "c",
      "code": "int a[5]; // Valid indices are 0, 1, 2, 3, 4\na[5] = 10; // Off-by-one out of bounds write! (Buffer overflow)"
    },
    "pro_tip": "Use GCC compiler flags like -fsanitize=bounds to catch out-of-bounds array access during testing.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 96
  },
  {
    "id": "int-c-097",
    "topic_id": "topic-c",
    "title": "What is the Comma Operator (',') in C, and how does it differ from a comma separator?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "The comma operator has the absolute lowest precedence of all C operators:\n\nMechanics:\n- Binary operator: expr1 , expr2\n- Evaluates expr1 from Left-to-Right, discards the result of expr1, and introduces a Sequence Point.\n- Evaluates expr2 and returns the value and type of expr2.\n\nComma Operator vs Comma Separator:\n- Comma Separator: Used in function arguments (func(a, b)) and variable declarations (int x, y). Separators do NOT guarantee left-to-right evaluation!\n- Comma Operator: Used in expressions and for loops to bundle multiple statements: for (i = 0, j = 10; i < j; i++, j--).",
    "bullet_points": [
      "Comma operator evaluates left operand, discards it, and returns right operand.",
      "Has the lowest operator precedence in C and introduces a sequence point.",
      "Comma in function arguments (func(a, b)) is a syntax separator, not the comma operator."
    ],
    "code_snippet": {
      "language": "c",
      "code": "int x = (10, 20, 30); // Evaluates 10, then 20, returns 30\nprintf(\"%d\\n\", x);   // Prints: 30"
    },
    "pro_tip": "Notice the parentheses: without parentheses, int x = 10, 20; causes a syntax error because '=' has higher precedence than ','!",
    "company_tags": [
      "Amazon",
      "Cisco",
      "Paypal"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 97
  },
  {
    "id": "int-c-098",
    "topic_id": "topic-c",
    "title": "What is the difference between Pre-increment (++i) and Post-increment (i++) in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Comparison of evaluation and return value:\n\n1. Pre-increment (++i):\n   - Increments the variable's value FIRST.\n   - Returns the updated, incremented value.\n   - Evaluates to the new value.\n2. Post-increment (i++):\n   - Takes a copy of the CURRENT value to return for expression evaluation.\n   - Afterward, increments the variable in memory.\n   - Evaluates to the old original value.\n\nIn C++, pre-increment is slightly faster for complex iterator classes because post-increment requires instantiating a temporary object copy.",
    "bullet_points": [
      "++i increments value first, then returns the new value.",
      "i++ returns the current value first, then increments in memory.",
      "In loops (for (int i=0; i<n; ++i)), both behave identically."
    ],
    "code_snippet": {
      "language": "c",
      "code": "int a = 5, b = 5;\nint x = ++a; // a becomes 6, x = 6\nint y = b++; // y = 5, b becomes 6"
    },
    "pro_tip": "A standard warm-up question in campus interviews.",
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
    "sort_order": 98
  },
  {
    "id": "int-c-099",
    "topic_id": "topic-c",
    "title": "Why does 'float f = 0.1; if (f == 0.1)' evaluate to false in C?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Floating-point literal type matching and IEEE 754 precision:\n\nWhy It Evaluates to False:\n1. Default Type: In C, floating-point literals with decimal points (like 0.1) are treated as double-precision (double, 64-bit IEEE 754) by default, NOT float!\n2. Inexact Binary Representation: The decimal 0.1 cannot be represented finitely in binary (it is a repeating fraction: 0.0001100110011...).\n3. Precision Mismatch:\n   - float f (32-bit) truncates the binary sequence to 24 bits of precision.\n   - double literal 0.1 (64-bit) retains 53 bits of precision.\n   - When comparing (f == 0.1), 'f' is promoted to double, but its padded lower bits do NOT match the 64-bit precision literal!\n4. Correct Way: Compare with float literal (f == 0.1f) or use epsilon comparison: fabs(f - 0.1) < 1e-6.",
    "bullet_points": [
      "0.1 is a 64-bit double literal by default in C.",
      "0.1 has no exact binary IEEE 754 representation; 32-bit float and 64-bit double differ.",
      "Always use epsilon comparison: fabs(a - b) < EPSILON."
    ],
    "code_snippet": {
      "language": "c",
      "code": "float f = 0.1f;\nif (f == 0.1)  printf(\"Equal\\n\"); // DOES NOT PRINT!\nif (f == 0.1f) printf(\"Equal\\n\"); // Prints: Equal"
    },
    "pro_tip": "Rule: Never compare floating-point numbers using '==' in production code; always use an epsilon delta tolerance.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Intel",
      "Goldman Sachs"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 99
  },
  {
    "id": "int-c-100",
    "topic_id": "topic-c",
    "title": "What is the difference between a Segmentation Fault (SIGSEGV) and a Bus Error (SIGBUS)?",
    "category": "CORE_CS",
    "subject": "C",
    "subject_label": "C",
    "answer": "Both are fatal hardware-generated OS signals terminating the process, but stem from different memory violations:\n\n1. Segmentation Fault (SIGSEGV):\n   - The CPU's Memory Management Unit (MMU) detects an access to an INVALID virtual memory address or a permissions violation.\n   - Examples: Dereferencing NULL, accessing memory outside process address space, or writing to read-only text memory (char *s = \"hi\"; s[0] = 'H').\n2. Bus Error (SIGBUS):\n   - The hardware CPU detects a physical hardware bus error during memory access.\n   - Most common cause: Unaligned memory access on architectures that do NOT support unaligned reads (e.g. attempting to read a 4-byte int from an odd memory address on SPARC/ARM).\n   - Other cause: Accessing a memory-mapped file (mmap) that has been truncated on disk.",
    "bullet_points": [
      "SIGSEGV: MMU virtual memory violation (invalid address or permissions violation).",
      "SIGBUS: Hardware bus fault, typically caused by unaligned memory access on strict CPUs.",
      "x86 architectures rarely trigger SIGBUS because x86 handles unaligned access in microcode."
    ],
    "code_snippet": {
      "language": "c",
      "code": "// SIGSEGV: Writing to read-only memory\nchar *s = \"hello\";\ns[0] = 'H'; // SIGSEGV!\n\n// SIGBUS: Unaligned memory read on strict alignment architectures\nchar buf[10];\nint *unaligned = (int*)(buf + 1); // Odd address\n// *unaligned = 42; // SIGBUS on SPARC/ARM!"
    },
    "pro_tip": "Distinguishing SIGSEGV from SIGBUS demonstrates deep systems programming expertise.",
    "company_tags": [
      "Apple",
      "Google",
      "Intel",
      "Qualcomm"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 100
  },
  {
    "id": "int-cpp-001",
    "topic_id": "topic-cpp",
    "title": "What are the key differences between C and C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "C++ is a multi-paradigm language originally designed as 'C with Classes' that extends procedural C into object-oriented and generic programming:\n\nKey Differences:\n1. Paradigm: C is procedural; C++ supports Procedural, Object-Oriented (classes, inheritance, polymorphism), and Generic programming (templates).\n2. Memory Management: C uses malloc()/free() which do NOT call constructors/destructors; C++ introduces new/delete which automatically invoke constructors and destructors.\n3. Type Safety: C++ enforces strict type checking (e.g. malloc returns void* which requires explicit cast in C++; empty struct has size >= 1 byte).\n4. Function Overloading & References: C++ introduces Function Overloading (same name, different parameters) and Reference variables (aliases), which do not exist in C.\n5. Standard Library: C++ includes the rich Standard Template Library (STL: vector, map, algorithms) and RAII containers.",
    "bullet_points": [
      "C is procedural; C++ supports OOP, procedural, and generic template programming.",
      "C++ new/delete call constructors and destructors; malloc/free do not.",
      "C++ supports function overloading, references, and the Standard Template Library (STL)."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "// C++ new/delete invokes constructors/destructors automatically\nclass Widget {\npublic:\n    Widget() { std::cout << \"Constructed\\n\"; }\n    ~Widget() { std::cout << \"Destroyed\\n\"; }\n};\nWidget *w = new Widget(); // Prints Constructed\ndelete w;                 // Prints Destroyed"
    },
    "pro_tip": "Remind the interviewer: In C++, almost any valid C code can compile, but modern C++ idioms (smart pointers, RAII, std::string) make manual pointer handling obsolete.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Google",
      "TCS"
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
    "title": "What is the difference between a Reference and a Pointer in C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "While both provide indirect access to variables in memory, their semantics and safety guarantees differ fundamentally:\n\n1. Syntax & Reassignment:\n   - Reference (int &r = x): An alias for an existing variable. MUST be initialized upon declaration and CANNOT be reseated (reassigned) to alias a different variable later.\n   - Pointer (int *p = &x): Stores a memory address. Can be uninitialized, set to nullptr, and reassigned to point to different addresses at any time.\n2. Nullability:\n   - Pointers can be null (nullptr); references can NEVER legitimately be null (no 'null references').\n3. Memory & Address:\n   - Taking the address of a reference (&r) returns the address of the REFERENCED variable. Pointers have their own distinct memory address.\n4. Indirection: References do not require dereferencing operators (*); they are used with direct variable syntax.",
    "bullet_points": [
      "References cannot be null and must be initialized upon declaration.",
      "References cannot be reseated to alias another variable; pointers can change targets.",
      "Pointers require dereferencing (*p); references use natural value syntax."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "int a = 10, b = 20;\nint &ref = a; // Alias for a\nref = b;      // Assigns value of b into a! (a becomes 20; ref still aliases a!)\n\nint *ptr = &a;\nptr = &b;     // Rebinds pointer to point to b"
    },
    "pro_tip": "Trap question: 'Can a reference be null?' Answer: Legally no. Binding a reference to a dereferenced null pointer (*(int*)nullptr) is strictly Undefined Behavior.",
    "company_tags": [
      "Amazon",
      "Adobe",
      "Microsoft",
      "Google"
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
    "title": "Why is 'using namespace std;' considered bad practice in C++ header files?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Injecting the entire standard library namespace into the global scope causes Namespace Pollution and silent symbol collisions:\n\nWhy It Is Dangerous:\n1. Namespace Pollution: std contains thousands of identifiers (count, min, max, distance, map, array). If a header contains 'using namespace std;', every single source file that includes that header inherits the entire std namespace globally!\n2. Ambiguous Symbol Collisions: If your code defines a variable or function called 'count' or 'distance', the compiler encounters two conflicting declarations (yours vs std::count), throwing ambiguous lookup compile errors.\n3. Version Fragility: When upgrading to newer C++ standards (e.g. C++17, C++20), new symbols added to std (like std::byte) can silently break existing code that used custom 'byte' identifiers.\n\nBest Practice: Use explicit qualification (std::cout) or scoped using declarations inside function bodies (using std::vector;).",
    "bullet_points": [
      "Causes namespace pollution and silent symbol collisions (e.g., std::count vs custom count).",
      "Including it in headers forces the pollution onto all downstream translation units.",
      "Best practice: Explicitly qualify std:: or scope using declarations inside function blocks."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "// Clean, professional practice in headers:\n#include <vector>\n#include <string>\n\nvoid process(const std::vector<std::string>& items); // Explicit std::"
    },
    "pro_tip": "Google C++ Style Guide strictly forbids 'using namespace std;' in headers and recommends limiting it even in .cpp files.",
    "company_tags": [
      "Google",
      "Microsoft",
      "Bloomberg"
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
    "title": "How does Function Overloading work in C++? What is Name Mangling?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Function Overloading allows multiple functions in the same scope to share the exact same name with different parameter signatures:\n\nRules for Overloading:\n- Functions must differ in: Number of parameters, Types of parameters, or Sequence of parameter types.\n- Return Type Alone CANNOT Overload: int func() and double func() cannot coexist because the compiler cannot resolve which to call when the return value is ignored.\n\nName Mangling (Name Decoration):\n- C++ compilers encode the function name along with its parameter types into a unique linker symbol string (e.g. add(int, int) becomes _Z3addii in GCC).\n- The linker uses these unique decorated names to resolve calls to the correct function implementation.\n- In C, name mangling does not exist (the symbol is simply 'add'), which is why C does not support function overloading.",
    "bullet_points": [
      "Overloading allows identical function names with different parameter signatures.",
      "Overloading cannot be based solely on return type.",
      "Name Mangling generates unique linker symbols encoding parameter types."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "void print(int x);    // Mangled in GCC: _Z5printi\nvoid print(double d); // Mangled in GCC: _Z5printd\n// Linker distinguishes them by their distinct decorated symbol names!"
    },
    "pro_tip": "Connect to 'extern \"C\"': When calling C functions from C++, 'extern \"C\"' instructs the C++ compiler to suppress name mangling so the C linker can resolve symbols.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Intel",
      "NVIDIA"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 4
  },
  {
    "id": "int-cpp-005",
    "topic_id": "topic-cpp",
    "title": "What is the purpose of 'extern \"C\"' in C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "In C++, the compiler performs Name Mangling on all function names to support function overloading, generating symbols like _Z3addii.\n\nIn C, the compiler does NOT mangle names; a function add(int, int) produces the plain linker symbol 'add'.\n\nRole of extern \"C\":\n- When linking C++ code with C libraries (or exposing C++ functions to C code), the C++ compiler would look for mangled symbols that don't exist in the compiled C library, resulting in linker error: 'undefined reference to add()'.\n- Wrapping declarations in extern \"C\" instructs the C++ compiler to disable name mangling and use standard C linkage conventions for those symbols.",
    "bullet_points": [
      "Disables C++ name mangling, using standard C linkage conventions.",
      "Enables seamless inter-operation between C and C++ object files and libraries.",
      "Mandatory when including C headers inside C++ projects."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "// Safe inclusion of C header in C++:\n#ifdef __cplusplus\nextern \"C\" {\n#endif\n\nvoid c_library_function(int x);\n\n#ifdef __cplusplus\n}\n#endif"
    },
    "pro_tip": "Point out the standard idiom: The #ifdef __cplusplus guard allows the exact same header to be included in both pure C and C++ compilers.",
    "company_tags": [
      "Qualcomm",
      "Apple",
      "Linux Foundation"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 5
  },
  {
    "id": "int-cpp-006",
    "topic_id": "topic-cpp",
    "title": "What are Default Arguments in C++ functions, and what are the declaration rules?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Default arguments allow a function to be called without specifying all arguments, automatically using fallback values:\n\nRules:\n1. Trailing Position Only: All default arguments must be specified from right to left at the END of the parameter list. You cannot specify a default for a parameter without specifying defaults for all subsequent parameters (e.g. void f(int a = 1, int b) is illegal!).\n2. Declaration vs Definition: Default values should be specified in the function DECLARATION (in header file), NOT in the function definition (in .cpp file). Redefining defaults in both causes a compile-time error: 'redefinition of default argument'.",
    "bullet_points": [
      "Default arguments provide fallback values if caller omits them.",
      "Must be placed at the right-hand end (trailing parameters) of the parameter list.",
      "Declare default arguments in the header declaration, not in the source definition."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "// In header:\nvoid log_message(const std::string &msg, int level = 1, bool timestamp = true);\n\n// Usage:\nlog_message(\"System start\"); // level=1, timestamp=true"
    },
    "pro_tip": "Interviewer trap: 'Are default arguments bound statically at compile time or dynamically at runtime?' Answer: Statically at compile time based on the static type!",
    "company_tags": [
      "TCS",
      "Infosys",
      "Adobe"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 6
  },
  {
    "id": "int-cpp-007",
    "topic_id": "topic-cpp",
    "title": "Why is std::endl slower than '\\n' in C++? How does stream synchronization work?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "In C++, std::endl does two separate operations:\n1. Inserts a newline character ('\\n') into the output stream.\n2. FORCES A FLUSH of the output stream buffer (calls stream.flush()).\n\nPerformance Impact:\n- Flushing the stream forces an immediate OS write system call, bypassing buffering. In tight loops, outputting std::endl causes severe I/O slowdowns (often 10x-50x slower!).\n- Using '\\n' simply places the newline into the stream buffer, which flushes naturally in high-performance blocks.\n\nCompetitive Programming / Fast I/O Tip:\n- std::cin.tie(nullptr); std::ios_base::sync_with_stdio(false); disables synchronization between C++ iostreams and C stdio, accelerating I/O to raw C speeds.",
    "bullet_points": [
      "std::endl inserts '\\n' AND forces a buffer flush (stream.flush()).",
      "Using '\\n' avoids expensive OS write system calls, running up to 50x faster.",
      "Disable sync_with_stdio for competitive programming I/O acceleration."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "// High performance output loop:\nfor (int i = 0; i < 100000; i++) {\n    std::cout << i << '\\n'; // Fast: Buffered\n    // std::cout << i << std::endl; // SLOW: Flushes 100,000 times!\n}"
    },
    "pro_tip": "This is a staple screening question in high-frequency trading (HFT) and competitive programming interviews.",
    "company_tags": [
      "Jane Street",
      "Tower Research",
      "Amazon"
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
    "title": "What is the difference between static_cast, dynamic_cast, const_cast, and reinterpret_cast in C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "C++ replaces unsafe C-style casting ((Type)val) with 4 explicit, type-safe casting operators:\n\n1. static_cast<T>(expr):\n   - Compile-time cast for well-defined, compatible conversions (e.g. float to int, implicit conversions, safe upcasting in class hierarchies).\n2. dynamic_cast<T>(expr):\n   - Run-Time Type Identification (RTTI) cast for polymorphic downcasting (base pointer to derived pointer).\n   - Checks vtable at runtime: If the cast is invalid, returns nullptr for pointers, or throws std::bad_cast for references.\n   - Requires at least one virtual function in the base class.\n3. const_cast<T>(expr):\n   - Adds or removes 'const' or 'volatile' qualifiers from a variable.\n   - Modifying a truly const variable after const_cast is Undefined Behavior.\n4. reinterpret_cast<T>(expr):\n   - Low-level, bitwise reinterpretation of raw memory (e.g. pointer to integer, int* to char*). Extremely unsafe; completely implementation-dependent.",
    "bullet_points": [
      "static_cast: Compile-time conversions between related types and safe upcasting.",
      "dynamic_cast: Safe runtime polymorphic downcasting using RTTI (returns nullptr on failure).",
      "const_cast: Casts away constness; reinterpret_cast: Raw bitwise pointer reinterpretation."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "Base *b = new Derived();\nDerived *d = dynamic_cast<Derived*>(b); // Safe runtime checked downcast\nif (d) { /* Successfully cast */ }\n\nconst int val = 10;\nint *non_const = const_cast<int*>(&val); // Removes const qualifier"
    },
    "pro_tip": "Never use C-style casts (Type)x in modern C++ because they blindly try static_cast, then const_cast, then reinterpret_cast without warning.",
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
    "sort_order": 8
  },
  {
    "id": "int-cpp-009",
    "topic_id": "topic-cpp",
    "title": "What is the difference between a class and a struct in C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "In C++, a 'class' and a 'struct' are identical in all capabilities EXCEPT their default access level and default inheritance visibility:\n\n1. Member Access:\n   - In a class, members and methods are private by default.\n   - In a struct, members and methods are public by default.\n2. Inheritance Visibility:\n   - A class inherits privately by default (class Derived : Base -> private inheritance).\n   - A struct inherits publicly by default (struct Derived : Base -> public inheritance).\n\nBoth can have constructors, destructors, virtual methods, and templates. Industry convention: Use 'struct' for Plain Old Data (POD) / passive data carriers, and 'class' for entities with private state and invariants.",
    "bullet_points": [
      "Class members are private by default; struct members are public by default.",
      "Class inherits privately by default; struct inherits publicly by default.",
      "Both support constructors, destructors, polymorphism, and methods identically."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class MyClass { int x; };  // x is private by default\nstruct MyStruct { int x; }; // x is public by default"
    },
    "pro_tip": "Many beginners mistakenly believe structs cannot have methods or constructors in C++\u2014clarify that they can!",
    "company_tags": [
      "TCS",
      "Infosys",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 9
  },
  {
    "id": "int-cpp-010",
    "topic_id": "topic-cpp",
    "title": "What are the different types of Constructors in C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "C++ classes can define several distinct types of constructors:\n\n1. Default Constructor: Takes zero arguments (or all arguments have defaults). Invoked when an object is instantiated without arguments (Widget w;).\n2. Parameterized Constructor: Takes explicit arguments to initialize member fields with custom values (Widget w(10, 20);).\n3. Copy Constructor (Widget(const Widget &other)): Initializes a new object by deep-copying an existing object of the same class.\n4. Move Constructor (Widget(Widget &&other) noexcept): Transfers ownership of heap resources from a temporary rvalue object to the new object, eliminating expensive copying.\n5. Conversion Constructor: A single-argument constructor that allows implicit conversion (suppressed via the 'explicit' keyword).",
    "bullet_points": [
      "Default: Zero parameters (Widget()).",
      "Parameterized: Takes custom initialization arguments.",
      "Copy Constructor: Widget(const Widget&); Move Constructor: Widget(Widget&&).",
      "Single-argument constructors act as conversion constructors unless marked 'explicit'."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class Vector {\npublic:\n    Vector();                     // Default\n    Vector(int size);             // Parameterized\n    Vector(const Vector &other);  // Copy Constructor\n    Vector(Vector &&other);       // Move Constructor\n};"
    },
    "pro_tip": "Always declare single-argument constructors as 'explicit' to prevent accidental implicit type conversions.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 10
  },
  {
    "id": "int-cpp-011",
    "topic_id": "topic-cpp",
    "title": "Why are Member Initializer Lists mandatory for certain C++ class members?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "A Member Initializer List initializes class fields BEFORE the constructor body executes:\n\nSyntax: MyClass(int a) : member(a) { }\n\n3 Scenarios Where Initializer Lists are MANDATORY:\n1. Const Members: Const fields (const int id;) cannot be assigned to inside constructor bodies; they must be initialized at construction.\n2. Reference Members: References (int &ref;) must be bound upon creation; they cannot be uninitialized.\n3. Base Class / Member Objects without Default Constructors: If a member object or base class lacks a parameterless default constructor, you must pass arguments via the initializer list.\n\nPerformance Bonus: For objects (e.g. std::string), initializer lists call the direct copy constructor ONCE, whereas assignment inside the body invokes the default constructor first, followed by the copy assignment operator (double work!).",
    "bullet_points": [
      "Mandatory for: const members, reference members, and objects without default constructors.",
      "Initializes fields directly, eliminating redundant default constructor + assignment overhead.",
      "Members are ALWAYS initialized in order of their class declaration, not the list order!"
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class Account {\n    const int id;       // Must use initializer list\n    std::string name;   // High performance\npublic:\n    Account(int id, std::string n) : id(id), name(std::move(n)) {} // Direct initialization\n};"
    },
    "pro_tip": "Interviewer trap: Member variables are initialized in the exact order they are DECLARED in the class, regardless of their order in the initializer list!",
    "company_tags": [
      "Google",
      "Microsoft",
      "Apple",
      "NVIDIA"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 11
  },
  {
    "id": "int-cpp-012",
    "topic_id": "topic-cpp",
    "title": "What is the 'explicit' keyword in C++, and why should single-argument constructors use it?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "In C++, any constructor that can be called with a single argument acts as an Implicit Conversion Constructor by default:\n\nDangerous Trap Without 'explicit':\n- If you have class String { String(int size); };, calling void print(String s);\n- If the caller executes print(42), the compiler sees an int, finds String(int), and silently creates a temporary String object of size 42! This causes subtle, hard-to-find logic bugs.\n\nRole of 'explicit':\n- Adding 'explicit' (explicit String(int size);) prohibits the compiler from using the constructor for implicit conversions or copy-initialization.\n- Forces callers to construct objects explicitly: print(String(42));.",
    "bullet_points": [
      "Single-argument constructors perform implicit type conversion by default.",
      "'explicit' suppresses implicit conversions and copy-initialization.",
      "Best practice: Mark all single-argument constructors 'explicit' unless implicit conversion is intentional."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class MyArray {\npublic:\n    explicit MyArray(int capacity); // Prevents implicit int -> MyArray conversion\n};\nvoid process(MyArray arr);\n// process(10);        // COMPILE ERROR: Implicit conversion blocked!\nprocess(MyArray(10)); // Allowed: Explicit construction"
    },
    "pro_tip": "C++11 also added explicit to conversion operators (explicit operator bool()).",
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 12
  },
  {
    "id": "int-cpp-013",
    "topic_id": "topic-cpp",
    "title": "What is the exact execution order of Constructors and Destructors in C++ Inheritance?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Constructors and Destructors execute in reverse mirror order:\n\n1. Constructor Execution Order (Top-Down / Base-to-Derived):\n   - Virtual Base classes execute first.\n   - Non-virtual Superclass / Base class constructors execute.\n   - Member objects execute in order of declaration inside the class.\n   - Derived class constructor body executes last.\n\n2. Destructor Execution Order (Bottom-Up / Derived-to-Base):\n   - Exactly the reverse: Derived class destructor body executes first.\n   - Member object destructors execute in reverse declaration order.\n   - Base class destructor executes.\n   - Virtual base class destructors execute last.",
    "bullet_points": [
      "Constructors execute Top-Down: Base class first, then Derived class.",
      "Destructors execute Bottom-Up: Derived class first, then Base class.",
      "Ensures derived objects can safely access fully constructed base class state."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class Base { public: Base() { std::cout << \"Base\\n\"; } ~Base() { std::cout << \"~Base\\n\"; } };\nclass Derived : public Base { public: Derived() { std::cout << \"Derived\\n\"; } ~Derived() { std::cout << \"~Derived\\n\"; } };\n// Construction prints: Base -> Derived\n// Destruction prints:  ~Derived -> ~Base"
    },
    "pro_tip": "Analogy: When building a house, construct foundation first, then roof. When demolishing, remove roof first, then foundation.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 13
  },
  {
    "id": "int-cpp-014",
    "topic_id": "topic-cpp",
    "title": "Why should you never call Virtual Functions inside Constructors or Destructors in C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "In C++, calling a virtual function inside a constructor or destructor does NOT execute the derived class override (dynamic dispatch is disabled!):\n\nWhy Dynamic Dispatch is Disabled:\n- During base class construction, the derived class has not yet been constructed! Derived member variables contain uninitialized garbage.\n- If the base constructor could invoke the derived override, that override would read uninitialized derived fields, causing crashes or memory corruption.\n- Therefore, inside Base's constructor, the object's vptr points strictly to Base's vtable. Virtual calls resolve statically to Base's implementation!\n- If Base defines a pure virtual function (= 0) and calls it from its constructor, the program crashes with a fatal runtime error: 'pure virtual method called' (SIGABRT).\n- Same rule in destructors: Derived parts are already destroyed, so vptr reverts to Base.",
    "bullet_points": [
      "Virtual calls in constructors/destructors resolve statically to the current class, not derived.",
      "Prevents derived overrides from accessing unconstructed or already-destroyed derived state.",
      "Calling a pure virtual function from constructor causes immediate fatal runtime abort."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class Base {\npublic:\n    Base() { setup(); } // Calls Base::setup(), NOT Derived::setup()!\n    virtual void setup() { std::cout << \"Base setup\\n\"; }\n};\nclass Derived : public Base {\n    void setup() override { std::cout << \"Derived setup\\n\"; }\n};"
    },
    "pro_tip": "Contrast with Java/C#: In Java, virtual calls in constructors DO dispatch to derived methods (which can access uninitialized fields). C++ deliberately prevents this.",
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
    "sort_order": 14
  },
  {
    "id": "int-cpp-015",
    "topic_id": "topic-cpp",
    "title": "What is the Copy-and-Swap Idiom in C++, and how does it provide Strong Exception Safety?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "The Copy-and-Swap idiom is the gold standard design pattern for implementing the Copy Assignment Operator (operator=):\n\nImplementation:\n1. Pass parameter by VALUE: MyClass& operator=(MyClass other) noexcept\n   - Passing by value automatically triggers the copy constructor, creating a safe temporary copy.\n   - If the copy constructor throws an exception (e.g. std::bad_alloc), the current object remains completely untouched (Strong Exception Safety!).\n2. Swap: Swap the contents of 'this' with 'other' using a non-throwing swap() function.\n3. Return: Return *this.\n4. Automatic Cleanup: When operator= returns, 'other' goes out of scope and its destructor automatically frees the old resource.\n\nBenefits: Eliminates code duplication between copy constructor, move constructor, and assignment operators, while providing strong exception guarantees.",
    "bullet_points": [
      "Idiom for implementing assignment operators with strong exception safety.",
      "Takes argument by value (auto copy) and swaps internal resources.",
      "Old resources are freed automatically when the passed copy goes out of scope."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class Buffer {\n    int *data; size_t size;\npublic:\n    friend void swap(Buffer &first, Buffer &second) noexcept {\n        std::swap(first.data, second.data);\n        std::swap(first.size, second.size);\n    }\n    Buffer& operator=(Buffer other) noexcept { // Pass by value (copies!)\n        swap(*this, other); // Swap resources\n        return *this;       // 'other' destructor cleans up old data\n    }\n};"
    },
    "pro_tip": "Mentioning Copy-and-Swap proves deep modern C++ engineering proficiency.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 15
  },
  {
    "id": "int-cpp-016",
    "topic_id": "topic-cpp",
    "title": "What is the difference between shallow copy and deep copy in C++? How do you implement a Copy Constructor?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Comparison of member-wise copy vs heap resource duplication:\n\n1. Shallow Copy (Default Compiler Copy Constructor):\n   - Copies raw member field values directly.\n   - If a member is a pointer to heap memory, only the pointer address is copied\u2014both objects point to the same heap block.\n   - Double Free Disaster: When both objects go out of scope, their destructors both call delete on the same pointer, crashing the program with a double-free abort!\n2. Deep Copy (User-Defined Copy Constructor):\n   - Allocates brand-new heap memory and duplicates the underlying data elements.\n   - Each object owns an independent memory buffer; changes or destruction in one object has zero impact on the other.",
    "bullet_points": [
      "Shallow copy copies pointer addresses, causing shared memory and double-free crashes.",
      "Deep copy allocates new heap buffers and duplicates data contents.",
      "Any class managing raw pointers must implement a custom deep-copy constructor."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class String {\n    char *data;\npublic:\n    // Deep Copy Constructor:\n    String(const String &other) {\n        data = new char[strlen(other.data) + 1];\n        strcpy(data, other.data);\n    }\n    ~String() { delete[] data; }\n};"
    },
    "pro_tip": "Rule of thumb: In modern C++, use std::string and std::vector instead of raw pointers to get deep copying automatically.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 16
  },
  {
    "id": "int-cpp-017",
    "topic_id": "topic-cpp",
    "title": "How does Runtime Polymorphism work in C++? Explain the vtable and vptr internal mechanics.",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Runtime polymorphism enables calling derived class methods through a base class pointer/reference using Dynamic Dispatch:\n\nInternal Mechanics of Virtual Method Tables:\n1. vtable (Virtual Method Table):\n   - For every class containing at least one virtual function, the compiler constructs a static array of function pointers called the vtable during compilation.\n   - Each entry in the vtable stores the memory address of the most derived override of that virtual function.\n2. vptr (Virtual Table Pointer):\n   - For every instantiated object of a polymorphic class, the compiler invisibly injects a hidden pointer field called vptr (typically at offset 0 of the object).\n   - When an object is constructed, the constructor sets vptr to point to its class's specific vtable.\n3. Function Invocation:\n   - When ptr->virtualFunc() is executed, the CPU executes 3 assembly steps:\n     1. Fetch the vptr from the object (vptr = *(ptr)).\n     2. Look up the function pointer at the known vtable index (func = vptr[index]).\n     3. Jump to and execute that function address (call func).\n   - Incurs a slight indirect pointer dereference overhead (~2-3 CPU instructions).",
    "bullet_points": [
      "Compiler generates a static vtable containing virtual function pointers per class.",
      "Each object instance stores a hidden vptr pointing to its class's vtable.",
      "Virtual calls perform dynamic dispatch via vtable index lookup at runtime."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class Base {\npublic:\n    virtual void speak() { std::cout << \"Base\\n\"; }\n};\nclass Dog : public Base {\npublic:\n    void speak() override { std::cout << \"Woof\\n\"; }\n};\nBase *b = new Dog();\nb->speak(); // b->vptr->vtable[0]() -> Dispatches dynamically to Dog::speak()"
    },
    "pro_tip": "Drawing the vtable and vptr diagram on a whiteboard is the single best way to ace a C++ interview.",
    "company_tags": [
      "Amazon",
      "Google",
      "Microsoft",
      "NVIDIA"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 17
  },
  {
    "id": "int-cpp-018",
    "topic_id": "topic-cpp",
    "title": "Why MUST a Base class have a Virtual Destructor in C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Failing to declare a virtual destructor in a polymorphic base class causes catastrophic Undefined Behavior and Memory Leaks:\n\nWhat Happens Without a Virtual Destructor:\n- If you delete a derived class object through a base class pointer (Base *b = new Derived(); delete b;):\n- If the base destructor is NON-virtual, the compiler uses Static Binding based on the pointer type (Base*).\n- It invokes ONLY Base's destructor! The Derived class destructor is NEVER executed!\n- Consequence: Any heap memory, open sockets, or file handles allocated inside Derived are permanently leaked, and derived cleanup logic never runs.\n\nSolution: Declare virtual ~Base() = default; in every base class with virtual functions.",
    "bullet_points": [
      "Deleting derived objects through base pointers requires a virtual destructor.",
      "Without virtual destructor, only base destructor runs; derived destructor is skipped.",
      "Causes memory leaks and undefined behavior. Rule: Polymorphic base classes must have virtual destructors."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class Base {\npublic:\n    virtual ~Base() = default; // MANDATORY for polymorphic base classes!\n};\nclass Derived : public Base {\n    int *data;\npublic:\n    Derived() { data = new int[100]; }\n    ~Derived() override { delete[] data; } // Correctly invoked upon delete!\n};"
    },
    "pro_tip": "Golden Rule: 'If a class has even ONE virtual function, its destructor MUST be virtual.'",
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
    "sort_order": 18
  },
  {
    "id": "int-cpp-019",
    "topic_id": "topic-cpp",
    "title": "What is a Pure Virtual Function and an Abstract Class in C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Abstract classes define interfaces and contracts in C++:\n\n1. Pure Virtual Function:\n   - A virtual function declared with '= 0' at the end of its signature (e.g. virtual void draw() = 0;).\n   - Has no implementation in the base class (though C++ allows an optional pure virtual body outside the class).\n   - Mandates that any concrete subclass MUST override this method; failing to do so makes the subclass abstract as well.\n2. Abstract Class:\n   - Any class containing at least ONE pure virtual function is an Abstract Class.\n   - Cannot be instantiated directly (Shape s; causes compile error: 'cannot instantiate abstract class').\n   - Can only be used as base class pointers or references pointing to concrete derived class objects.",
    "bullet_points": [
      "Pure virtual function has syntax '= 0' and forces subclasses to provide an override.",
      "A class with at least one pure virtual function is an Abstract Class.",
      "Abstract classes cannot be instantiated directly; used as polymorphic interface pointers."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class Shape { // Abstract Class\npublic:\n    virtual double area() const = 0; // Pure Virtual Function\n    virtual ~Shape() = default;\n};\nclass Circle : public Shape {\n    double r;\npublic:\n    Circle(double r) : r(r) {}\n    double area() const override { return 3.14159 * r * r; }\n};"
    },
    "pro_tip": "Interviewer follow-up: 'Can a pure virtual function have a function body?' Answer: Yes! It can provide default helper logic, but must still be overridden by derived classes.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Amazon",
      "Apple"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 19
  },
  {
    "id": "int-cpp-020",
    "topic_id": "topic-cpp",
    "title": "What is Object Slicing in C++, and how do you prevent it?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Object Slicing occurs when an object of a derived class is assigned or passed by VALUE to a base class object:\n\nWhy It Occurs:\n- A Derived class contains Base class members PLUS additional Derived-specific members, making sizeof(Derived) > sizeof(Base).\n- When passed by value (void func(Base b)), the compiler copies only the Base portion of the object into 'b', 'slicing off' and completely discarding all derived members and the derived vptr!\n- Polymorphism is completely destroyed; 'b' behaves purely as a Base object.\n\nPrevention:\n- ALWAYS pass polymorphic objects by Reference or Pointer (void func(const Base &b) or void func(Base *b)).\n- Prevent value copying by declaring the base class copy constructor as deleted (= delete) or protected.",
    "bullet_points": [
      "Object Slicing occurs when a derived object is passed by value to a base object.",
      "The derived members and vtable pointer are sliced off, destroying polymorphism.",
      "Prevent by passing by reference (Base&) or pointer (Base*)."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "Derived d;\nBase b = d; // SLICED! Derived fields discarded; b is only a Base object.\n\n// Prevention:\nvoid process(const Base &b) { // Safe: Preserves derived identity and polymorphism\n    b.speak();\n}"
    },
    "pro_tip": "A favorite conceptual question to test whether a candidate understands value vs reference semantics in C++.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Bloomberg"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 20
  },
  {
    "id": "int-cpp-021",
    "topic_id": "topic-cpp",
    "title": "What are the 'override' and 'final' specifiers introduced in C++11?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Standardized in C++11 to catch bugs and restrict inheritance:\n\n1. 'override' Specifier:\n   - Explicitly tells the compiler that the method is intended to override a virtual method in a base class.\n   - Compiler Verification: If the base method does not exist, or if signatures differ slightly (e.g. missing const, different parameter type), the compiler throws a compile-time error instead of silently creating an unrelated overloaded method!\n2. 'final' Specifier:\n   - When applied to a virtual method: Prevents any derived class from overriding that method.\n   - When applied to a class: Prevents the class from being inherited at all (class FinalClass final : public Base {};).",
    "bullet_points": [
      "'override' ensures the compiler verifies the method matches a base virtual signature.",
      "Prevents silent bugs caused by mismatched parameter types or constness.",
      "'final' prohibits further method overriding or class inheritance."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class Base {\n    virtual void render(int quality) const;\n};\nclass Derived : public Base {\n    // Compiler catches typos immediately!\n    void render(int quality) const override; \n    void display() final; // Derived classes cannot override display\n};"
    },
    "pro_tip": "Always use 'override' on every overriding method in modern C++ code.",
    "company_tags": [
      "Google",
      "Microsoft",
      "Amazon"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 21
  },
  {
    "id": "int-cpp-022",
    "topic_id": "topic-cpp",
    "title": "What is the Diamond Problem in C++ Multiple Inheritance, and how does Virtual Inheritance solve it?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "The Diamond Problem arises when a class D inherits from two classes B and C, which both inherit from a common base class A:\n\nProblem:\n- Without virtual inheritance, class D inherits TWO separate copies of class A's members (one via B and one via C)!\n- Any access to A's members (d.x) causes ambiguity compile errors: 'request for member x is ambiguous'.\n- Duplicates memory and causes state synchronization desynchronization.\n\nSolution: Virtual Inheritance (class B : virtual public A, class C : virtual public A):\n- Instructs the compiler to ensure that ONLY ONE shared instance of the base class A exists within the most derived object D.\n- The compiler inserts a virtual base table pointer (vbptr) to offset access to the single shared A subobject.",
    "bullet_points": [
      "Multiple inheritance without virtual inheritance creates duplicate base class copies.",
      "Causes ambiguity errors when accessing common base members.",
      "Virtual inheritance (virtual public Base) ensures exactly one shared base instance exists."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class A { public: int val; };\nclass B : virtual public A {}; // Virtual inheritance\nclass C : virtual public A {}; // Virtual inheritance\nclass D : public B, public C {}; // D has exactly ONE instance of A!\n\nD obj;\nobj.val = 42; // Completely unambiguous!"
    },
    "pro_tip": "Note: In virtual inheritance, the MOST derived class (D) is responsible for invoking the virtual base class (A) constructor.",
    "company_tags": [
      "Google",
      "Amazon",
      "Apple",
      "NVIDIA"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 22
  },
  {
    "id": "int-cpp-023",
    "topic_id": "topic-cpp",
    "title": "Can a constructor or a destructor be declared virtual in C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "1. Can a Constructor be Virtual? NO!\n   - When an object is constructed, its memory has just been allocated, but its vptr has not yet been initialized to point to any vtable.\n   - Virtual dispatch requires a vptr/vtable to exist; you cannot invoke virtual dispatch to create an object whose type is needed to look up the vtable in the first place!\n   - To construct objects polymorphically, use the Virtual Constructor Idiom (Factory Pattern or Clone pattern: virtual Base* clone() const).\n\n2. Can a Destructor be Virtual? YES and MANDATORY!\n   - Destructors MUST be virtual in base classes to ensure derived class destructors are properly invoked when deleting derived objects through base class pointers.",
    "bullet_points": [
      "Constructors CANNOT be virtual; vptr does not exist before construction.",
      "Destructors CAN and MUST be virtual in polymorphic base classes.",
      "Simulate virtual construction using Factory Method or Clone Pattern."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "// Virtual Constructor idiom via clone()\nclass Animal {\npublic:\n    virtual Animal* clone() const = 0; // Virtual Copy Constructor idiom\n    virtual ~Animal() = default;      // Virtual Destructor\n};"
    },
    "pro_tip": "A standard classic trick question. Answer definitively: 'Constructors cannot be virtual; destructors must be virtual for polymorphic hierarchies.'",
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
    "sort_order": 23
  },
  {
    "id": "int-cpp-024",
    "topic_id": "topic-cpp",
    "title": "What is the difference between Public, Protected, and Private Inheritance in C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Inheritance access specifiers govern how base members are exposed to outside callers and subclasses of the derived class:\n\n1. Public Inheritance (class D : public B):\n   - Models an 'IS-A' relationship.\n   - Public members of B remain public in D; protected remain protected.\n   - Liskov Substitution Principle holds (D can be passed anywhere B is expected).\n2. Protected Inheritance (class D : protected B):\n   - Public and protected members of B become PROTECTED in D.\n   - Outside callers cannot access B's public interface; only subclasses of D can.\n3. Private Inheritance (class D : private B):\n   - Models an 'Implemented-In-Terms-Of' relationship (similar to composition).\n   - All public and protected members of B become PRIVATE in D.\n   - Outside callers cannot pass D as a B pointer (is-a relationship is broken).",
    "bullet_points": [
      "Public: Preserves access levels (IS-A relationship).",
      "Protected: Public members become protected; private to outside world.",
      "Private: All inherited members become private (Implemented-In-Terms-Of)."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class Base { public: void speak(); };\nclass PubDerived : public Base {};  // pub.speak() is public\nclass PrivDerived : private Base {}; // priv.speak() is private!"
    },
    "pro_tip": "Prefer composition (holding an instance of Base) over private inheritance unless you need access to protected members or need to override virtual functions.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Qualcomm"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 24
  },
  {
    "id": "int-cpp-025",
    "topic_id": "topic-cpp",
    "title": "What is Function Hiding (Name Hiding) in C++ inheritance?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "In C++, declaring a function in a derived class with the same NAME as a function in the base class HIDES all base class functions with that name, even if they have different parameter signatures (different overloads!):\n\nWhy It Occurs:\n- In C++, name lookup happens BEFORE overload resolution.\n- When the compiler searches for 'func' starting from the derived class scope, as soon as it finds 'func' in Derived, it stops searching parent scopes, completely hiding base overloads!\n\nSolution:\n- Bring base class overloads into derived scope using the 'using' declaration: using Base::func;.",
    "bullet_points": [
      "Declaring a function in a derived class hides ALL base functions with that name.",
      "Hiding occurs even if parameter types differ (overloading across scopes is blocked).",
      "Restore base overloads using: using Base::function_name;."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class Base {\npublic:\n    void show(int x) {}\n};\nclass Derived : public Base {\npublic:\n    using Base::show; // Un-hides Base::show(int)\n    void show(std::string s) {} // Overload\n};\nDerived d;\nd.show(10); // Compiles cleanly thanks to 'using Base::show'!"
    },
    "pro_tip": "This is one of the most frustrating compile errors for developers unfamiliar with C++ name lookup rules.",
    "company_tags": [
      "Google",
      "Microsoft",
      "Bloomberg"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 25
  },
  {
    "id": "int-cpp-026",
    "topic_id": "topic-cpp",
    "title": "What is the 'curiously recurring template pattern' (CRTP) in C++, and how does it achieve Static Polymorphism?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "CRTP is an advanced C++ idiom where a derived class inherits from a template base class specialized with the derived class itself:\n\nSyntax: class Derived : public Base<Derived> { };\n\nStatic Polymorphism:\n- Traditional runtime polymorphism uses virtual functions, incurring vtable pointer lookup overhead and preventing compiler inlining.\n- CRTP enables polymorphism at COMPILE TIME (Zero-Cost Abstraction):\n- The base class casts 'this' to static_cast<Derived*>(this) and invokes derived methods directly.\n- The compiler resolves calls at compile time with zero indirection and inlines methods completely for maximum CPU speed!\n\nApplications: High-performance numerical libraries (Eigen), compile-time interface enforcement, and mixin classes.",
    "bullet_points": [
      "CRTP: class Derived : public Base<Derived>.",
      "Achieves compile-time static polymorphism with zero vtable/vptr overhead.",
      "Allows direct compiler inlining of polymorphic method calls."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "template <typename Derived>\nclass Base {\npublic:\n    void interface() {\n        static_cast<Derived*>(this)->implementation(); // Static dispatch!\n    }\n};\nclass Derived : public Base<Derived> {\npublic:\n    void implementation() { std::cout << \"CRTP Executed\\n\"; }\n};"
    },
    "pro_tip": "Used extensively in low-latency HFT trading engines where virtual function pointer dereferencing is too slow.",
    "company_tags": [
      "Jane Street",
      "Citadel",
      "Bloomberg",
      "Google"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 26
  },
  {
    "id": "int-cpp-027",
    "topic_id": "topic-cpp",
    "title": "What is RAII (Resource Acquisition Is Initialization) in C++? Why is it the most important idiom in C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "RAII is the core programming idiom that distinguishes modern C++ from C and makes C++ exception-safe without manual garbage collection:\n\nCore Principles of RAII:\n1. Resource Bound to Lifetime: Any resource (heap memory, file handle, database connection, mutex lock) is acquired during object construction (inside constructor).\n2. Automatic Destruction: The resource is automatically released in the destructor.\n3. Stack Unwinding Guarantee: When an object goes out of scope (normally, via return, or due to an exception being thrown), C++ runtime stack unwinding is GUARANTEED to invoke its destructor.\n4. Zero Leaks: Eliminates manual memory management and guarantees no resource leaks even under exceptional error paths.",
    "bullet_points": [
      "Resources are acquired in constructors and automatically released in destructors.",
      "Stack unwinding guarantees destructors run when exceptions are thrown.",
      "Powers smart pointers (unique_ptr), locks (lock_guard), and file streams (fstream)."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "void safe_file_write() {\n    std::ofstream file(\"log.txt\"); // Acquired in constructor\n    file << \"Processing...\";\n    if (error_occurred()) throw std::runtime_error(\"Fail\");\n    // file destructor runs automatically and closes handle even on exception!\n}"
    },
    "pro_tip": "Always state: 'In modern C++, you almost never write delete or free(). RAII handles 100% of resource management.'",
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Apple"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 27
  },
  {
    "id": "int-cpp-028",
    "topic_id": "topic-cpp",
    "title": "What is the difference between std::unique_ptr, std::shared_ptr, and std::weak_ptr?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Modern C++ (C++11) smart pointers manage dynamic heap memory automatically via RAII:\n\n1. std::unique_ptr<T>:\n   - Exclusive Ownership: Exactly ONE unique_ptr owns the heap object at any time.\n   - Cannot be copied; can ONLY be moved (std::move).\n   - Zero Overhead: Same memory footprint and speed as a raw pointer.\n2. std::shared_ptr<T>:\n   - Shared Ownership: Multiple shared_ptrs can own the same object.\n   - Maintains an internal heap Reference Count in a control block.\n   - When a shared_ptr is copied, reference count increments; when destroyed, it decrements. Deallocates object when count reaches 0.\n3. std::weak_ptr<T>:\n   - Non-owning Observer: Observes an object managed by shared_ptr WITHOUT incrementing the reference count.\n   - Used to break circular dependencies and avoid memory leaks. Must call lock() to convert to shared_ptr before accessing.",
    "bullet_points": [
      "unique_ptr: Exclusive ownership, non-copyable, zero overhead.",
      "shared_ptr: Shared ownership via reference counting control block.",
      "weak_ptr: Non-owning observer that breaks circular reference cycles."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "auto u = std::make_unique<int>(10); // Exclusive ownership\n// auto u2 = u; // COMPILE ERROR: Cannot copy unique_ptr!\nauto u2 = std::move(u); // Valid: Ownership transferred to u2\n\nauto s1 = std::make_shared<int>(20); // Ref count = 1\nauto s2 = s1;                         // Ref count = 2"
    },
    "pro_tip": "Default to std::unique_ptr for 90% of use cases. Only reach for std::shared_ptr when ownership is truly shared.",
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
    "sort_order": 28
  },
  {
    "id": "int-cpp-029",
    "topic_id": "topic-cpp",
    "title": "Why should you prefer std::make_unique and std::make_shared over 'new'?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Introduced in C++14 (make_unique) and C++11 (make_shared):\n\nKey Advantages:\n1. Exception Safety:\n   - Consider: process(std::shared_ptr<T>(new T()), std::shared_ptr<U>(new U()));\n   - In C++11/14, compiler evaluation order is unspecified. If 'new T()' runs, then 'new U()' runs and throws std::bad_alloc before the first shared_ptr constructor runs, T is leaked forever!\n   - std::make_shared<T>() guarantees atomic allocation with no leak window.\n2. Performance Optimization (make_shared):\n   - 'new T()' performs TWO separate heap allocations: one for object T, and one for the shared_ptr control block.\n   - std::make_shared allocates both the object AND the control block in a SINGLE contiguous heap chunk, cutting heap allocation overhead in half and improving CPU cache locality.",
    "bullet_points": [
      "Eliminates exception safety memory leak hazards in multi-argument function calls.",
      "make_shared bundles object and control block into a single contiguous heap allocation.",
      "Cleaner syntax that removes redundant type name repetition."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "// Exception-unsafe and 2 heap allocations:\nstd::shared_ptr<Widget> w(new Widget());\n\n// Exception-safe, 1 single combined allocation, cache-friendly:\nauto w_safe = std::make_shared<Widget>();"
    },
    "pro_tip": "Note on make_shared caveat: Because object and control block share one allocation block, if a weak_ptr is alive, the memory for the object cannot be deallocated until all weak_ptrs expire.",
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 29
  },
  {
    "id": "int-cpp-030",
    "topic_id": "topic-cpp",
    "title": "How does std::weak_ptr break Circular Dependencies in std::shared_ptr?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "A Circular Dependency causes an irreversible memory leak when using shared_ptr:\n\nHow the Leak Occurs:\n- If Node A holds shared_ptr<Node> to Node B, and Node B holds shared_ptr<Node> to Node A.\n- Even if external pointers to A and B are destroyed, A's reference count is 1 (held by B) and B's reference count is 1 (held by A).\n- Neither count can ever reach 0! Both destructors are permanently blocked, causing a permanent memory leak.\n\nSolution: Use std::weak_ptr:\n- Break the cycle by changing one reference (e.g. child to parent) to std::weak_ptr.\n- weak_ptr does NOT increment the strong reference count.\n- When the parent's external pointer is destroyed, its count drops to 0, destroying parent and child cleanly.",
    "bullet_points": [
      "Cyclic shared_ptr references keep reference counts >= 1, preventing deallocation.",
      "weak_ptr references objects without incrementing the strong reference count.",
      "Use weak_ptr for child-to-parent pointers, observer lists, and caches."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "struct B; // Forward declaration\nstruct A {\n    std::shared_ptr<B> b;\n    ~A() { std::cout << \"~A\\n\"; }\n};\nstruct B {\n    std::weak_ptr<A> a; // weak_ptr breaks circular reference cycle!\n    ~B() { std::cout << \"~B\\n\"; }\n};"
    },
    "pro_tip": "Demonstrating cyclic reference resolution proves production-grade memory architecture skills.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Google",
      "Bloomberg"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 30
  },
  {
    "id": "int-cpp-031",
    "topic_id": "topic-cpp",
    "title": "What is the Rule of Three, Rule of Five, and Rule of Zero in C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Fundamental guidelines governing resource management in C++ classes:\n\n1. Rule of Three (C++98):\n   - If a class requires a user-defined Destructor, Copy Constructor, or Copy Assignment Operator, it almost certainly requires ALL THREE!\n   - Rationale: Managing raw resources (like heap pointers) means default member-wise copies will cause double-free errors.\n2. Rule of Five (C++11):\n   - With move semantics, if you define any of the Big Three, you must explicitly declare or delete all FIVE special member functions:\n     1. Destructor\n     2. Copy Constructor\n     3. Copy Assignment Operator\n     4. Move Constructor\n     5. Move Assignment Operator\n   - Failing to define move operations prevents the compiler from generating them, leaving classes falling back to slow copies.\n3. Rule of Zero (Modern C++ Best Practice):\n   - Design classes so that you write ZERO custom destructors or copy/move operations!\n   - Use standard RAII containers (std::vector, std::string, std::unique_ptr). The compiler-generated defaults will manage everything perfectly.",
    "bullet_points": [
      "Rule of Three (C++98): Destructor, Copy Constructor, Copy Assignment.",
      "Rule of Five (C++11): Adds Move Constructor and Move Assignment Operator.",
      "Rule of Zero: Leverage standard RAII types (unique_ptr, vector) to write zero custom destructor/copy logic."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "// Rule of Zero: Clean, leak-free, zero boilerplate!\nclass Person {\n    std::string name;       // RAII string\n    std::vector<int> scores;// RAII vector\n    // Compiler generates all 5 special member functions correctly!\n};"
    },
    "pro_tip": "Stating 'Favor the Rule of Zero using RAII member types' signals modern C++ expertise.",
    "company_tags": [
      "Amazon",
      "Google",
      "Microsoft",
      "Meta"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 31
  },
  {
    "id": "int-cpp-032",
    "topic_id": "topic-cpp",
    "title": "What is Custom Deleter in std::unique_ptr, and how do you wrap C APIs (like FILE* or malloc)?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "std::unique_ptr allows specifying a custom deleter to manage non-heap or legacy C resources:\n\nSyntax:\n- Type: std::unique_ptr<T, DeleterType>\n- The deleter is invoked automatically when the unique_ptr goes out of scope instead of default 'delete'.\n\nExample Wrapping C File Handles (fclose):\n- With decltype and lambda or function pointer:\n  auto file_deleter = [](FILE *f) { if (f) fclose(f); };\n  std::unique_ptr<FILE, decltype(file_deleter)> pFile(fopen(\"test.txt\", \"r\"), file_deleter);\n- When pFile goes out of scope (even if exceptions are thrown), fclose() runs automatically with zero leaks!",
    "bullet_points": [
      "unique_ptr supports custom deleters to manage C resources (FILE*, sockets, malloc).",
      "The deleter type is part of the unique_ptr template signature.",
      "Guarantees deterministic cleanup via RAII for legacy C libraries."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "// Wrapping C FILE* safely in C++:\nauto file_cleanup = [](FILE *fp) { if (fp) fclose(fp); };\nstd::unique_ptr<FILE, decltype(file_cleanup)> file(fopen(\"data.csv\", \"w\"), file_cleanup);\nif (file) {\n    fputs(\"Hello RAII\\n\", file.get());\n} // Automatically calls fclose(file.get()) here!"
    },
    "pro_tip": "Notice: In std::shared_ptr, the deleter is NOT part of the template type (type erasure), making shared_ptr with custom deleters simpler to pass around.",
    "company_tags": [
      "Google",
      "Apple",
      "Bloomberg"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 32
  },
  {
    "id": "int-cpp-033",
    "topic_id": "topic-cpp",
    "title": "What is placement new in C++, and where is it used?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Placement new constructs an object in-place at a pre-allocated raw memory address without allocating new heap memory:\n\nSyntax: new (address) ClassName(args...);\n\nMechanics:\n- Standard 'new Widget()' does two things: 1. Allocates raw memory via operator new; 2. Runs Widget constructor.\n- Placement new bypasses memory allocation entirely and ONLY executes the constructor on the provided memory buffer.\n\nDestruction Rule:\n- You CANNOT use 'delete ptr' on a placement new object (because delete would attempt to deallocate the pre-allocated buffer).\n- You MUST explicitly invoke the destructor manually: ptr->~ClassName();.\n\nApplications: Custom memory pools, Arena allocators, and STL containers (std::vector uses placement new to construct elements in pre-allocated capacity).",
    "bullet_points": [
      "Constructs an object at a specified pre-allocated memory buffer address.",
      "Does not allocate heap memory; only invokes constructor.",
      "Destruction requires explicit destructor call: obj->~ClassName();."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "alignas(Widget) char buffer[sizeof(Widget)]; // Pre-allocated stack memory\n\n// Construct object in buffer:\nWidget *w = new (buffer) Widget(10);\n\n// Must destroy manually (do NOT call delete!):\nw->~Widget();"
    },
    "pro_tip": "Interviewers follow up: 'Where is placement new used in the STL?' Answer: In std::vector::push_back/emplace_back and std::optional.",
    "company_tags": [
      "NVIDIA",
      "Epic Games",
      "Google",
      "Jane Street"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 33
  },
  {
    "id": "int-cpp-034",
    "topic_id": "topic-cpp",
    "title": "What is the difference between delete and delete[] in C++? What happens if mismatched?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Memory deallocation in C++ must strictly match the allocation operator used:\n\n1. delete ptr (Single Object Deallocation):\n   - Used for objects allocated with single 'new'.\n   - Invokes the destructor for that SINGLE object once, then frees the memory block.\n2. delete[] arr (Array Deallocation):\n   - Used for arrays allocated with 'new Type[N]'.\n   - The runtime stores the array element count in a hidden chunk header ('over-allocation').\n   - delete[] reads this count, calls the destructor for EVERY element in the array in reverse order, and frees the entire buffer.\n\nMismatching (Undefined Behavior):\n- Calling delete on an array calls the destructor ONLY for the first element, leaking all remaining (N-1) elements and corrupting heap allocator metadata.\n- Calling delete[] on a single object reads garbage as array length, calling destructors on invalid memory and crashing.",
    "bullet_points": [
      "delete calls single destructor; delete[] calls destructors for every array element.",
      "Mismatching new/delete or new[]/delete[] is Undefined Behavior.",
      "Causes heap metadata corruption and resource leaks."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "Widget *single = new Widget();\ndelete single;   // Correct\n\nWidget *array = new Widget[10];\ndelete[] array;  // Correct (Calls 10 destructors)\n// delete array; // FATAL: Undefined Behavior!"
    },
    "pro_tip": "Simple rule: If you typed brackets in new, you MUST type brackets in delete[]. In modern C++, prefer std::vector over new[].",
    "company_tags": [
      "TCS",
      "Infosys",
      "Amazon",
      "Microsoft"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 34
  },
  {
    "id": "int-cpp-035",
    "topic_id": "topic-cpp",
    "title": "What is the difference between passing by value, passing by pointer, and passing by const reference in C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Comparison of semantics, performance, and caller safety:\n\n1. Pass by Value (void func(Widget w)):\n   - Invokes the copy constructor to duplicate the object on the stack.\n   - Modifying 'w' does not affect the caller.\n   - Expensive for large objects (strings, vectors).\n2. Pass by Pointer (void func(Widget *w)):\n   - Copies an 8-byte pointer address.\n   - Requires null checks (w != nullptr).\n   - Modifies caller's object directly.\n3. Pass by Const Reference (void func(const Widget &w)):\n   - Zero copying overhead (acts as an internal pointer alias).\n   - Cannot be null (guaranteed safe to use without null checks).\n   - 'const' qualifier prevents accidental modifications to the caller's object.\n   - Modern C++ Standard Idiom for passing non-primitive arguments.",
    "bullet_points": [
      "Pass-by-value triggers copy constructor; expensive for containers.",
      "Pass-by-pointer copies address but requires null checks.",
      "Pass-by-const-reference (const T&) is the universal modern C++ standard: fast, safe, non-null."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "// Preferred modern C++ idiom for read-only parameters:\nvoid analyze(const std::vector<std::string> &data) {\n    // Fast: Zero copy overhead, cannot be null, read-only\n}"
    },
    "pro_tip": "For primitive types (int, double, char), pass by value directly because copying a 4-byte int is faster than pointer dereferencing.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 35
  },
  {
    "id": "int-cpp-036",
    "topic_id": "topic-cpp",
    "title": "What is the difference between an lvalue and an rvalue in C++11? What is an Rvalue Reference (&&)?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "C++11 overhauled the value category system to power move semantics:\n\n1. lvalue (Locator Value):\n   - An expression with an identifiable identity and memory address (e.g. named variables: x, str, vec[0]).\n   - Can appear on the left side of '='; you can take its address with '&'.\n2. rvalue (Read / Ephemeral Value):\n   - A temporary value with no persistent memory identity (e.g. literals: 42, expressions: x + y, temporary objects returned by value: func()).\n   - Will be destroyed at the end of the full expression.\n3. Rvalue Reference (Type&&):\n   - Introduced in C++11 to bind specifically to temporary rvalues.\n   - Signals that the referred-to object is temporary and can have its internal resources 'pilfered' or moved without copying.",
    "bullet_points": [
      "lvalue: Named object with persistent memory address (&x is valid).",
      "rvalue: Ephemeral temporary object about to be destroyed (x + y).",
      "Rvalue reference (&&) binds to temporaries, enabling move semantics."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "int x = 10;\nint &lref = x;   // lvalue reference binds to lvalue\n// int &&rref = x; // COMPILE ERROR: rvalue reference cannot bind to lvalue!\nint &&rref = 10; // Valid: Binds to temporary rvalue literal 10"
    },
    "pro_tip": "Crucial insight: Even though 'rref' is declared as an rvalue reference, the variable 'rref' ITSELF has a name, so 'rref' is an lvalue!",
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
    "sort_order": 36
  },
  {
    "id": "int-cpp-037",
    "topic_id": "topic-cpp",
    "title": "What does std::move actually do in C++? Does it move anything at runtime?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "NO! std::move does NOT move anything at runtime and emits ZERO machine code instructions!\n\nWhat std::move Actually Is:\n- std::move is purely a compile-time static cast: static_cast<std::remove_reference_t<T>&&>(arg).\n- It unconditionally casts an lvalue expression into an rvalue reference (xvalue).\n- Role: It acts as an invitation to the compiler to select the Move Constructor or Move Assignment Operator instead of the Copy Constructor for subsequent operations.\n\nState of Moved-From Object:\n- The C++ standard mandates that a moved-from object must be left in a 'valid but unspecified state'.\n- It is safe to destroy or reassign, but you should not read its specific contents without reinitializing.",
    "bullet_points": [
      "std::move does not move anything; it is a purely compile-time cast to an rvalue reference (&&).",
      "Emits zero runtime CPU instructions.",
      "Signals permission to pilfer resources via Move Constructor.",
      "Moved-from objects are in a 'valid but unspecified' state."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "std::string a = \"Heavy text data\";\nstd::string b = std::move(a); // Casts 'a' to rvalue -> invokes Move Constructor!\n// 'b' now owns the heap string data; 'a' is now empty (valid but unspecified)."
    },
    "pro_tip": "Interviewer trap: 'Does std::move(x) do anything if called on a standalone line by itself?' Answer: No! It is a no-op cast.",
    "company_tags": [
      "Google",
      "Amazon",
      "Apple",
      "Bloomberg"
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
    "title": "How does a Move Constructor work, and why MUST it be marked 'noexcept'?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "A Move Constructor transfers ownership of heap resources from a source rvalue object into the new object in O(1) time:\n\nMechanics:\n1. Steal Resource: Point internal pointer to source object's heap buffer (data = other.data;).\n2. Reset Source: Set the source object's pointer to nullptr (other.data = nullptr;) so that when 'other' is destroyed, its destructor does not delete the stolen memory buffer!\n\nWhy 'noexcept' is STRICTLY MANDATORY:\n- When std::vector dynamically expands and resizes, it reallocates elements from the old buffer to the new buffer.\n- To maintain the Strong Exception Guarantee (if an exception occurs, the vector remains in its previous state):\n  - If the Move Constructor is marked 'noexcept', std::vector uses fast move constructors.\n  - If the Move Constructor is NOT marked noexcept (or omitted), std::vector refuses to move and falls back to SLOW COPY CONSTRUCTORS! (Using std::move_if_noexcept).",
    "bullet_points": [
      "Move constructor steals heap pointers in O(1) time and nullifies the source pointer.",
      "Must be marked 'noexcept' so std::vector uses it during reallocation.",
      "Without 'noexcept', std::vector falls back to slow copy operations to preserve exception safety."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class MyVector {\n    int *data; size_t size;\npublic:\n    // Move Constructor:\n    MyVector(MyVector &&other) noexcept \n        : data(other.data), size(other.size) {\n        other.data = nullptr; // Nullify stolen pointer!\n        other.size = 0;\n    }\n};"
    },
    "pro_tip": "Always mark move constructors and move assignment operators 'noexcept'!",
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
    "id": "int-cpp-039",
    "topic_id": "topic-cpp",
    "title": "What is Perfect Forwarding and std::forward in C++ templates?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Perfect Forwarding allows a template wrapper function to accept arguments and forward them to another target function preserving their exact value category (lvalueness or rvalueness) and constness:\n\nMechanics:\n1. Universal Reference / Forwarding Reference (T&& in template deduction context):\n   - If passed an lvalue, T deduces to lvalue reference (T&), and T&& collapses to T& (Reference Collapsing rules).\n   - If passed an rvalue, T deduces to non-reference type, and T&& remains an rvalue reference (T&&).\n2. std::forward<T>(arg):\n   - Conditionally casts 'arg' back to an rvalue IF AND ONLY IF it was passed as an rvalue originally.\n   - If passed an lvalue, it preserves it as an lvalue.\n\nUse Case: Powers std::make_unique, std::make_shared, and container emplace methods (emplace_back).",
    "bullet_points": [
      "Perfect forwarding preserves argument value category (lvalue vs rvalue) across function wrappers.",
      "Uses Universal References (T&&) combined with Reference Collapsing rules.",
      "std::forward<T>(arg) conditionally casts to rvalue only if argument was an rvalue."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "template <typename T>\nvoid wrapper(T&& arg) { // Universal / Forwarding Reference\n    target(std::forward<T>(arg)); // Perfect Forwarding!\n}"
    },
    "pro_tip": "Interviewer trick: 'When is T&& an rvalue reference vs universal reference?' Answer: T&& is a universal reference ONLY when type deduction is taking place (template function or auto&&).",
    "company_tags": [
      "Google",
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
    "id": "int-cpp-040",
    "topic_id": "topic-cpp",
    "title": "What are the Reference Collapsing rules in C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "In C++, you cannot directly declare a reference to a reference (int& & is illegal syntax). However, references to references can arise during template type deduction or typedefs:\n\nReference Collapsing Rules (Logical OR with &):\n- &  +  &  -->  &\n- &  +  && -->  &\n- && +  &  -->  &\n- && +  && -->  &&\n\nRule Summary: If ANY of the references is an lvalue reference (&), it collapses to an lvalue reference (&). ONLY an rvalue reference to an rvalue reference (&& + &&) collapses to an rvalue reference (&&)!\n\nThis rule forms the mathematical foundation of Universal References and std::forward.",
    "bullet_points": [
      "References collapse during template instantiation.",
      "An lvalue reference (&) always wins: & + &, & + &&, && + & all collapse to &.",
      "Only && + && collapses to &&."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "template <typename T>\nvoid func(T&& x); // If called with int&, T=int&, T&& -> int& && -> collapses to int&"
    },
    "pro_tip": "Explaining reference collapsing proves that you understand template metaprogramming at an expert level.",
    "company_tags": [
      "Google",
      "Microsoft",
      "Jane Street"
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
    "title": "What is the difference between push_back() and emplace_back() in std::vector?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Both append elements to the end of a vector, but differ in construction and copying:\n\n1. push_back(val):\n   - Takes an existing object (by const& or &&).\n   - If you pass constructor arguments, a temporary object must be created first, then copied or moved into the vector, and the temporary destroyed.\n2. emplace_back(args...):\n   - Takes arbitrary constructor arguments using variadic templates and perfect forwarding.\n   - Constructs the element IN-PLACE directly in the vector's uninitialized backing storage using placement new!\n   - Completely eliminates creating temporary objects, copy constructors, and move constructors.\n   - Vastly superior performance for complex objects.",
    "bullet_points": [
      "push_back requires an existing object or temporary, invoking copy/move.",
      "emplace_back constructs elements in-place inside the vector via placement new.",
      "Eliminates temporary object construction and move overhead."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "struct Employee {\n    Employee(std::string name, int id);\n};\nstd::vector<Employee> list;\n// push_back creates temporary, moves it, destroys temporary:\nlist.push_back(Employee(\"Alice\", 101));\n\n// emplace_back constructs directly in vector memory:\nlist.emplace_back(\"Alice\", 101); // Faster!"
    },
    "pro_tip": "Modern best practice: Prefer emplace_back over push_back for objects with constructors.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 41
  },
  {
    "id": "int-cpp-042",
    "topic_id": "topic-cpp",
    "title": "What is Return Value Optimization (RVO) and Copy Elision in C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Return Value Optimization (RVO) is a compiler optimization where the compiler avoids copying or moving temporary objects returned by value from functions:\n\nMechanics:\n- Normally, returning an object by value from a function would allocate the object inside the function stack frame, copy/move it to the caller's stack frame upon return, and destroy the local object.\n- With RVO, the caller allocates space on its stack and passes a hidden pointer to the function. The function constructs the object DIRECTLY in the caller's memory space!\n- Guaranteed Copy Elision (C++17): Mandatory in C++17 for prvalues (e.g. return Widget(10);). The compiler is legally required to elide the copy/move, even if the copy constructor has observable side-effects.\n- Named RVO (NRVO): Optional optimization when returning a named local variable.",
    "bullet_points": [
      "RVO constructs the returned object directly in the caller's memory frame.",
      "Eliminates both copy constructor and move constructor executions.",
      "C++17 made copy elision mandatory for temporary prvalues."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "Widget createWidget() {\n    return Widget(); // Guaranteed Copy Elision (C++17): Zero copy/move overhead!\n}\nWidget w = createWidget(); // Constructed directly in w's memory"
    },
    "pro_tip": "Trap: Never write 'return std::move(local_var);' when returning local variables! Calling std::move disables RVO, forcing a move instead of zero-cost direct construction!",
    "company_tags": [
      "Google",
      "Amazon",
      "Apple"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 42
  },
  {
    "id": "int-cpp-043",
    "topic_id": "topic-cpp",
    "title": "What are C++ Templates, and why must template definitions reside in Header files?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Templates enable Generic Programming by generating type-specific code at compile time from a single blueprint:\n\nWhy Template Definitions Must Be in Header Files:\n- In standard C++, compilation happens per translation unit (.cpp file) in isolation.\n- A template is NOT compiled into machine code until it is instantiated with concrete types (e.g. MyVector<int>).\n- If a template definition is placed in a .cpp file, when main.cpp includes only the header, the compiler cannot see the implementation body and cannot generate the machine code for MyVector<int>.\n- The linker then fails with: 'undefined reference to MyVector<int>::func()'.\n- Therefore, template class and function definitions must be placed directly inside header files so the compiler can instantiate them on-demand.",
    "bullet_points": [
      "Templates generate type-specific code at compile time (monomorphization).",
      "The compiler needs the full template definition to instantiate code for concrete types.",
      "Placing template implementations in .cpp files causes linker 'undefined reference' errors."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "// In my_math.h: Entire template definition resides in header\ntemplate <typename T>\nT add(T a, T b) {\n    return a + b;\n}"
    },
    "pro_tip": "Mention the rare alternative: Explicit Template Instantiation in the .cpp file (e.g. template class MyVector<int>;), though it restricts usage strictly to those pre-instantiated types.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Qualcomm"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 43
  },
  {
    "id": "int-cpp-044",
    "topic_id": "topic-cpp",
    "title": "What is Template Specialization (Full vs Partial Specialization)?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Template specialization allows customizing template implementations for specific data types:\n\n1. Full Specialization:\n   - All template parameters are specialized for concrete types.\n   - Syntax: template <> class Container<bool> { ... };\n   - Can be applied to both Class templates and Function templates.\n   - Standard Example: std::vector<bool> is a fully specialized class that packs booleans into 1 bit per element rather than 1 byte.\n2. Partial Specialization:\n   - Only a subset of template parameters are specialized, or parameters are specialized for pointer/reference forms (e.g. Container<T*>).\n   - Allowed ONLY on Class templates! Standard C++ strictly forbids partial specialization of Function templates (use function overloading instead).",
    "bullet_points": [
      "Full specialization provides custom logic for specific types (e.g. vector<bool>).",
      "Partial specialization specializes a subset of parameters (e.g. Container<T*>).",
      "Partial specialization is supported for class templates, but FORBIDDEN for function templates."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "// Generic template\ntemplate <typename T> class Printer { void print() { /* generic */ } };\n\n// Partial specialization for all pointer types:\ntemplate <typename T> class Printer<T*> { void print() { /* pointer logic */ } };\n\n// Full specialization for bool:\ntemplate <> class Printer<bool> { void print() { /* bit logic */ } };"
    },
    "pro_tip": "Interviewer trap: 'Can you partially specialize a function template?' Answer: No! Overload the function template instead.",
    "company_tags": [
      "Google",
      "Microsoft",
      "Bloomberg"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 44
  },
  {
    "id": "int-cpp-045",
    "topic_id": "topic-cpp",
    "title": "What is the difference between 'typename' and 'class' in C++ template parameter lists?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "1. In Template Parameter Declarations:\n   - template <typename T> and template <class T> are 100% syntactically and semantically identical. 'typename' was introduced in C++98 to clarify that T does not have to be a class (it can be a primitive like int).\n2. Disambiguating Dependent Types (MANDATORY use of typename):\n   - When accessing a nested type inside a template that depends on a template parameter (e.g. T::iterator), the compiler does not know if iterator is a static variable (value) or a type definition (typedef/using).\n   - The C++ standard mandates that dependent names are assumed to be VALUES by default.\n   - You MUST prefix dependent types with the 'typename' keyword: typename T::iterator it;, otherwise compilation fails!",
    "bullet_points": [
      "In template parameter lists (<typename T> vs <class T>), both are completely identical.",
      "'typename' is mandatory to disambiguate Dependent Types (e.g., typename T::const_iterator).",
      "Without 'typename', compilers assume dependent members are static member variables."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "template <typename Container>\nvoid print_all(const Container &c) {\n    // 'typename' is mandatory here to inform compiler this is a type!\n    typename Container::const_iterator it = c.begin();\n}"
    },
    "pro_tip": "Always explain the Dependent Type disambiguation use case: that is why 'typename' was introduced into C++.",
    "company_tags": [
      "Google",
      "Amazon",
      "Apple"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 45
  },
  {
    "id": "int-cpp-046",
    "topic_id": "topic-cpp",
    "title": "What are Non-Type Template Parameters (NTTP) in C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "A Non-Type Template Parameter allows passing a compile-time value (such as an integer, pointer, or enum) as a template argument instead of a data type:\n\nStandard Example: std::array<T, N>\n- std::array<int, 5> passes the integer 5 as an NTTP.\n\nKey Attributes:\n1. Compile-Time Evaluation: The argument must be a compile-time constant expression (constexpr).\n2. Stack Allocation: Enables fixed-size arrays without heap allocation overhead.\n3. Distinct Types: std::array<int, 5> and std::array<int, 10> are two completely distinct, incompatible types at compile time.",
    "bullet_points": [
      "Allows passing compile-time values (integers, enums) instead of types.",
      "Powers fixed-capacity stack containers like std::array<T, N>.",
      "Different values produce distinct, incompatible types at compile time."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "template <typename T, size_t Size>\nclass FixedBuffer {\n    T buffer[Size]; // Stack allocated with exact compile-time size!\n};\nFixedBuffer<int, 128> buf; // 128 is an NTTP"
    },
    "pro_tip": "C++20 significantly expanded NTTP to allow floating-point values and structural class types.",
    "company_tags": [
      "NVIDIA",
      "Intel",
      "Amazon"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 46
  },
  {
    "id": "int-cpp-047",
    "topic_id": "topic-cpp",
    "title": "What is SFINAE (Substitution Failure Is Not An Error) in C++ templates?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "SFINAE is a foundational C++ template rule that enables compile-time introspection and conditional template overload selection:\n\nMechanics:\n- When a compiler attempts to instantiate an overloaded function template with a concrete type, if substituting that type causes an invalid type or expression, the compiler does NOT emit an error.\n- Instead, it silently discards (removes) that specific template candidate from the overload resolution set and inspects remaining candidates!\n- Enabled via std::enable_if (C++11) and std::void_t (C++17).\n\nModern Evolution:\n- SFINAE is verbose and produces cryptic compiler error messages.\n- C++20 replaced SFINAE with Concepts and Constraints (requires clause), making compile-time constraints readable and clean.",
    "bullet_points": [
      "SFINAE: Substitution failure discards the candidate without emitting a compile error.",
      "Enables conditional template compilation based on type traits (std::enable_if).",
      "Replaced in modern C++20 by clean Concepts and 'requires' clauses."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "// SFINAE with std::enable_if (Compiles only for integer types):\ntemplate <typename T>\ntypename std::enable_if<std::is_integral<T>::value, void>::type\nprocess(T val) {\n    std::cout << \"Integral type\\n\";\n}"
    },
    "pro_tip": "Mention C++20 Concepts immediately: 'In C++20, we replace SFINAE with template <std::integral T> void process(T val);'.",
    "company_tags": [
      "Google",
      "Microsoft",
      "Bloomberg"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 47
  },
  {
    "id": "int-cpp-048",
    "topic_id": "topic-cpp",
    "title": "What are C++20 Concepts and Constraints, and how do they improve template code?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Concepts (introduced in C++20) provide first-class compile-time validation for template parameters:\n\nKey Advantages over SFINAE:\n1. Human-Readable Error Messages: If a type fails a Concept constraint, the compiler outputs a clear 2-line error explaining which requirement failed, rather than 200 lines of template instantiation dumps.\n2. Readable Syntax: Uses the 'requires' clause or replaces 'typename' directly (template <std::integral T>).\n3. Constrained Auto: Allows auto parameters constrained by concepts (void sort(std::sortable auto &c);).\n4. Fast Compilation: Compiles much faster than complex SFINAE enable_if type-trait machinery.",
    "bullet_points": [
      "C++20 Concepts enforce compile-time constraints on template arguments.",
      "Replaces cryptic 200-line SFINAE template error dumps with clear diagnostic messages.",
      "Supports 'requires' clauses and constrained auto parameters."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "// Clean C++20 Concept constraint:\ntemplate <typename T>\nconcept Numeric = std::is_arithmetic_v<T>;\n\ntemplate <Numeric T>\nT multiply(T a, T b) {\n    return a * b;\n}"
    },
    "pro_tip": "Demonstrating knowledge of C++20 Concepts shows you are up-to-date with cutting-edge modern C++.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Google",
      "Meta"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 48
  },
  {
    "id": "int-cpp-049",
    "topic_id": "topic-cpp",
    "title": "What are Variadic Templates in C++11, and how do you unpack Parameter Packs?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Variadic Templates (C++11) allow templates to accept an arbitrary number of template arguments of arbitrary types:\n\nSyntax:\n- template <typename... Args> declares a Template Parameter Pack.\n- Args... args declares a Function Parameter Pack.\n- sizeof...(Args) queries the number of arguments in the pack at compile time.\n\nUnpacking Parameter Packs:\n1. C++11/14: Recursive function template unpacking (base case function + recursive pack expansion).\n2. C++17 Fold Expressions (Best Practice): (args + ...) or ((std::cout << args << ' '), ...) unpacks and evaluates operations over the entire pack in a single expression without recursion!",
    "bullet_points": [
      "Variadic templates accept an arbitrary number of types (typename... Args).",
      "sizeof...(Args) returns the argument count at compile time.",
      "C++17 Fold Expressions unpack parameters in a single line without recursion."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "// C++17 Fold Expression unpacking:\ntemplate <typename... Args>\nauto sum(Args... args) {\n    return (args + ...); // Unary right fold: (arg1 + (arg2 + arg3))\n}\nint total = sum(1, 2, 3, 4, 5); // 15"
    },
    "pro_tip": "Fold expressions power modern logging frameworks, tuple utilities, and factory functions (make_shared).",
    "company_tags": [
      "Google",
      "Apple",
      "Bloomberg"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 49
  },
  {
    "id": "int-cpp-050",
    "topic_id": "topic-cpp",
    "title": "What is constexpr vs consteval in C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "C++ provides explicit specifiers for compile-time computation:\n\n1. constexpr (C++11/14):\n   - Indicates that a function or variable CAN be evaluated at compile time if its arguments are compile-time constants.\n   - Dual Nature: If called with runtime arguments, a constexpr function executes at runtime as a normal function without errors.\n2. consteval (Immediate Functions, C++20):\n   - STRICTLY MANDATES compile-time evaluation.\n   - If a consteval function cannot be evaluated at compile time (or is called with runtime variables), compilation FAILS with a compile error!\n   - Guarantees zero runtime execution overhead.",
    "bullet_points": [
      "constexpr: Can evaluate at compile time; falls back to runtime if given runtime inputs.",
      "consteval (C++20): MUST evaluate at compile time; runtime invocation causes compile error.",
      "Moves computations from runtime CPU cycles to build-time compiler evaluation."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "constexpr int square(int x) { return x * x; }\nconsteval int cube(int x) { return x * x * x; } // C++20 immediate function\n\nint runtime_val = 5;\nsquare(runtime_val); // Valid: Runs at runtime\n// cube(runtime_val);   // COMPILE ERROR: Must evaluate at compile time!"
    },
    "pro_tip": "Compile-time computation eliminates startup latency in performance-critical applications.",
    "company_tags": [
      "Amazon",
      "NVIDIA",
      "Intel"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 50
  },
  {
    "id": "int-cpp-051",
    "topic_id": "topic-cpp",
    "title": "How does std::vector work internally? What is Capacity vs Size and Geometric Growth?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "std::vector is a dynamically resizable array stored contiguously on the heap:\n\n1. Size vs Capacity:\n   - size(): The number of elements currently stored in the vector.\n   - capacity(): The total allocated memory space (in elements) available before the next reallocation is triggered.\n2. Geometric Growth (Amortized O(1)):\n   - When size reaches capacity, the vector reallocates: Allocates a new contiguous array with 1.5x (MSVC) or 2.0x (GCC/Clang) the old capacity.\n   - Moves/copies existing elements over, and deallocates the old buffer.\n   - Geometric growth ensures that appending n elements takes O(n) total work, yielding Amortized O(1) time complexity per push_back.\n3. Optimization:\n   - Call vec.reserve(N) in advance if the expected size is known to eliminate ALL intermediate reallocations and pointer copying overhead!",
    "bullet_points": [
      "size() is element count; capacity() is allocated storage.",
      "Doubles (2x in GCC) or 1.5x (MSVC) upon exceeding capacity, giving amortized O(1) append.",
      "vec.reserve(N) pre-allocates memory, avoiding expensive reallocations."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "std::vector<int> vec;\nvec.reserve(1000); // Allocates capacity for 1000 items in ONE allocation!\nfor (int i = 0; i < 1000; ++i) vec.push_back(i);"
    },
    "pro_tip": "Clarify reserve() vs resize(): reserve() increases capacity without creating elements (size unchanged); resize() alters size and default-constructs new elements.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Google",
      "Adobe"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 51
  },
  {
    "id": "int-cpp-052",
    "topic_id": "topic-cpp",
    "title": "What is Iterator Invalidation in C++? What causes it in std::vector?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Iterator Invalidation occurs when operations on an STL container cause existing iterators, pointers, or references to point to freed, moved, or corrupted memory:\n\nCauses in std::vector:\n1. Reallocation on Insertion (push_back / insert):\n   - If vector.size() == vector.capacity(), adding an element forces the vector to allocate a new memory buffer elsewhere and delete the old buffer.\n   - ALL existing iterators, pointers, and references across the entire vector are immediately rendered DANGLING and invalid!\n2. Non-Reallocating Insertion:\n   - If capacity is sufficient, only iterators at and after the insertion point are invalidated.\n3. Deletion (erase / pop_back):\n   - All iterators at and after the erased element are invalidated because subsequent elements shift left.\n\nSafe Idiom when Erasing during Iteration:\n- Use the iterator returned by erase(): it = vec.erase(it); or use C++20 std::erase_if(vec, predicate).",
    "bullet_points": [
      "Reallocation invalidates ALL iterators, pointers, and references to the vector.",
      "Erasure invalidates iterators at and after the erased element.",
      "Safe loop erasure: it = vec.erase(it); or C++20 std::erase_if(vec, pred)."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "std::vector<int> vec = {1, 2, 3, 4};\nfor (auto it = vec.begin(); it != vec.end(); /* no increment */) {\n    if (*it % 2 == 0) {\n        it = vec.erase(it); // Returns valid iterator to next element!\n    } else {\n        ++it;\n    }\n}"
    },
    "pro_tip": "This is one of the most common bug sources tested in C++ technical interviews.",
    "company_tags": [
      "Amazon",
      "Google",
      "Bloomberg",
      "NVIDIA"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 52
  },
  {
    "id": "int-cpp-053",
    "topic_id": "topic-cpp",
    "title": "What is the difference between std::map and std::unordered_map?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Comparison of data structure, complexity, and ordering:\n\n1. std::map (Sorted Associative Container):\n   - Backing Data Structure: Self-balancing Red-Black Tree.\n   - Ordering: Elements stored in strict sorted order by key (via operator< or custom Comparator).\n   - Time Complexity: Search, Insertion, Deletion are all strictly O(log n) guaranteed.\n   - Key Requirement: Requires operator< to establish strict weak ordering.\n2. std::unordered_map (Hash Table):\n   - Backing Data Structure: Hash Table with bucket arrays and collision chaining.\n   - Ordering: Elements stored in arbitrary order.\n   - Time Complexity: O(1) average case search/insertion; O(n) worst case (hash collisions).\n   - Key Requirement: Requires std::hash<Key> specialization and operator== equality.",
    "bullet_points": [
      "std::map: Red-Black Tree, sorted order, guaranteed O(log n).",
      "std::unordered_map: Hash table, unordered, O(1) average lookup.",
      "Use map when in-order traversal or range queries (lower_bound) are required."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "std::map<int, std::string> sortedMap; // O(log n), keys are sorted\nstd::unordered_map<int, std::string> hashMap; // O(1) average lookup"
    },
    "pro_tip": "In competitive programming, std::unordered_map can be hacked to O(n^2) with custom anti-hash inputs; use custom splitmix64 hashes or std::map.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Google",
      "Paypal"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 53
  },
  {
    "id": "int-cpp-054",
    "topic_id": "topic-cpp",
    "title": "Why is std::vector<bool> considered an antipattern in the C++ Standard Library?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "std::vector<bool> is a notorious historical misstep in the C++ Standard Library caused by premature optimization:\n\nWhy It Is Flawed:\n1. Space Optimization Trap: To save memory, the standard library specializes std::vector<bool> to pack 8 boolean flags into a single 1-byte integer (1 bit per boolean) rather than 1 byte per boolean.\n2. It Is NOT an STL Container: The C++ standard mandates that a standard container's reference type must be a true reference (T&). Because hardware memory addresses cannot address individual bits, vector<bool>::operator[] returns a temporary proxy object (std::vector<bool>::reference), NOT a bool&!\n3. Breaks Generic Code: auto &ref = vec[0]; fails to compile! It breaks generic algorithms that expect true references.\n4. Thread Safety Disaster: Writing to two distinct indices (vec[0] and vec[1]) concurrently from different threads causes race conditions because both bits reside within the exact same byte in RAM!\n\nAlternative: Use std::vector<char> or std::vector<uint8_t>, or std::bitset<N> for fixed bitsets.",
    "bullet_points": [
      "Packs booleans into 1 bit per element, returning proxy objects instead of bool&.",
      "Breaks generic algorithms expecting true references (auto &b = v[0] fails).",
      "Concurrent writes to adjacent indices cause race conditions on the shared byte."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "// FAILS TO COMPILE:\nstd::vector<bool> vb = {true, false};\n// auto &ref = vb[0]; // COMPILE ERROR: Cannot bind non-const lvalue reference to proxy object!"
    },
    "pro_tip": "Cite this historical artifact to show you understand standard library design flaws.",
    "company_tags": [
      "Google",
      "Bloomberg",
      "Apple"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 54
  },
  {
    "id": "int-cpp-055",
    "topic_id": "topic-cpp",
    "title": "What is the difference between std::deque, std::vector, and std::list?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Comparison of three fundamental sequence containers:\n\n1. std::vector:\n   - Single contiguous memory buffer. O(1) random access.\n   - Fastest traversal due to maximum CPU cache locality. Slow insertion at front (O(n)).\n2. std::deque (Double-Ended Queue):\n   - Array of fixed-size chunks (paged memory chunks).\n   - O(1) fast insertion and deletion at BOTH front and back!\n   - O(1) random access (slightly slower than vector due to two-level pointer dereferencing).\n   - Does NOT require moving existing elements when expanding front or back.\n3. std::list (Doubly-Linked List):\n   - Doubly-linked node elements scattered across the heap.\n   - O(1) insertion/deletion anywhere once iterator is known.\n   - O(n) traversal with heavy CPU cache misses and 24-byte pointer overhead per node.\n   - Rarely used in modern high-performance code.",
    "bullet_points": [
      "std::vector: Single contiguous array, best cache performance, fast back insertion.",
      "std::deque: Chunked array, O(1) insertion at both front and back.",
      "std::list: Doubly-linked list, O(1) splicing, poor cache locality."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "std::deque<int> dq;\ndq.push_front(10); // O(1) push at front!\ndq.push_back(20);  // O(1) push at back!"
    },
    "pro_tip": "std::stack and std::queue use std::deque as their default underlying container adapter, NOT std::vector!",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Intel"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 55
  },
  {
    "id": "int-cpp-056",
    "topic_id": "topic-cpp",
    "title": "How does std::lower_bound vs std::upper_bound work in C++ STL?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Binary search algorithms operating on sorted ranges in O(log n) time:\n\n1. std::lower_bound(begin, end, val):\n   - Returns an iterator to the FIRST element in the sorted range that is NOT LESS THAN val (i.e. element >= val).\n   - If val exists, points to the first occurrence of val.\n2. std::upper_bound(begin, end, val):\n   - Returns an iterator to the FIRST element that is STRICTLY GREATER THAN val (i.e. element > val).\n   - Always points past the last occurrence of val.\n\nRange of Duplicate Elements:\n- Range [lower_bound, upper_bound) encompasses ALL occurrences of val in the sorted range (equivalent to std::equal_range).",
    "bullet_points": [
      "lower_bound finds the first element >= val (first occurrence).",
      "upper_bound finds the first element > val (element past last occurrence).",
      "Both operate in O(log n) time on sorted random-access ranges."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "std::vector<int> v = {10, 20, 20, 20, 30};\nauto low = std::lower_bound(v.begin(), v.end(), 20); // Points to index 1\nauto up  = std::upper_bound(v.begin(), v.end(), 20); // Points to index 4 (value 30)\nint count = up - low; // Count of 20s = 3"
    },
    "pro_tip": "A mandatory algorithm for solving LeetCode binary search problems efficiently.",
    "company_tags": [
      "Amazon",
      "Google",
      "Uber",
      "Meta"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 56
  },
  {
    "id": "int-cpp-057",
    "topic_id": "topic-cpp",
    "title": "What is the Erase-Remove Idiom in C++ (and C++20 std::erase)?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "The standard C++98/11 idiom to delete elements matching a condition from an STL sequence container:\n\nWhy std::remove alone does NOT erase:\n- In C++ STL design, generic algorithms (<algorithm>) operate purely on iterators, knowing nothing about container memory or sizes.\n- std::remove(begin, end, val) slides all non-matching elements to the front and returns an iterator to the new logical end.\n- It does NOT resize the container or call destructors on trailing elements!\n\nErase-Remove Idiom:\nvec.erase(std::remove(vec.begin(), vec.end(), val), vec.end());\n- std::remove shifts elements; vec.erase() physically destroys the trailing elements and shrinks size().\n\nC++20 Uniform Erasure (Best Practice):\nstd::erase(vec, val); or std::erase_if(vec, predicate); handles everything in a single line!",
    "bullet_points": [
      "std::remove only shifts elements; does not shrink the container size.",
      "Erase-remove idiom: vec.erase(std::remove(..., val), vec.end()).",
      "C++20 introduced clean non-member functions: std::erase(vec, val) and std::erase_if()."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "std::vector<int> v = {1, 2, 3, 2, 4};\n// Classic C++11 idiom:\nv.erase(std::remove(v.begin(), v.end(), 2), v.end()); // v becomes {1, 3, 4}\n\n// C++20 modern syntax:\nstd::erase(v, 2);"
    },
    "pro_tip": "Asking why std::remove cannot erase elements tests whether the candidate understands the separation between STL algorithms and containers.",
    "company_tags": [
      "Google",
      "Microsoft",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 57
  },
  {
    "id": "int-cpp-058",
    "topic_id": "topic-cpp",
    "title": "What is std::string_view (C++17), and how does it eliminate string allocations?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "std::string_view provides a lightweight, non-owning reference (view) to an existing sequence of characters:\n\nHow It Works:\n- Implemented as a simple struct containing: 1. A const char* pointer to character data; 2. A size_t length (16 bytes total).\n- Zero Allocations: Substrings (substr), prefix trimming, and passing string literals create a new view in O(1) time without allocating heap memory or copying characters!\n- Contrast with const std::string&: If caller passes a string literal (\"hello\"), const std::string& forces an allocation of a temporary std::string object on the heap.\n\nCaution (Dangling Views):\n- Since string_view is non-owning, if the underlying string is destroyed or modified, the string_view becomes dangling.",
    "bullet_points": [
      "Lightweight, non-owning view of a character buffer (pointer + size, 16 bytes).",
      "Substrings and string parameter passing execute in O(1) with zero heap allocations.",
      "Take care not to let the viewed string expire before the string_view."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "// Zero allocation string parameter:\nvoid process(std::string_view sv) {\n    std::cout << sv.substr(0, 4) << '\\n'; // O(1) substring without copy!\n}\nprocess(\"Constant string literal\"); // Zero temporary heap allocations"
    },
    "pro_tip": "Modern C++ API design rule: Use std::string_view for read-only string parameters.",
    "company_tags": [
      "Google",
      "Meta",
      "Amazon",
      "Apple"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 58
  },
  {
    "id": "int-cpp-059",
    "topic_id": "topic-cpp",
    "title": "What is std::span (C++20), and how does it generalize array viewing?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "std::span (C++20) is the generalized counterpart of std::string_view for arbitrary contiguous sequences (arrays, vectors, C-arrays):\n\nKey Attributes:\n1. Non-Owning View: Consists of a pointer to first element and element count.\n2. Universal Interface: A function taking std::span<int> can accept a C-style array (int arr[10]), std::vector<int>, or std::array<int, 10> without any copying or memory allocations.\n3. Eliminates Pointer+Size APIs: Replaces legacy C-style void func(int *arr, size_t len) with clean, bounds-safe span syntax.",
    "bullet_points": [
      "Non-owning view over any contiguous sequence of typed objects.",
      "Unifies APIs across C-arrays, std::vector, and std::array without copying.",
      "Standardized in C++20."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "void print_span(std::span<const int> s) {\n    for (int x : s) std::cout << x << ' ';\n}\nint c_arr[] = {1, 2, 3};\nstd::vector<int> v = {4, 5, 6};\nprint_span(c_arr); // Works seamlessly\nprint_span(v);     // Works seamlessly"
    },
    "pro_tip": "Pair this with std::string_view to demonstrate a cohesive grasp of modern C++ view types.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Bloomberg"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 59
  },
  {
    "id": "int-cpp-060",
    "topic_id": "topic-cpp",
    "title": "What is std::optional (C++17), and when should you use it over pointers or sentinel values?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "std::optional<T> represents a value that may or may not be present (a vocabulary type for nullable values):\n\nKey Advantages:\n1. Value Semantics & Stack Storage: Stores the object T directly inside the optional on the stack (along with a boolean flag). Zero heap allocation overhead!\n2. Eliminates Sentinel Traps: No need for misleading sentinel values (like returning -1 for not found, or nullptr).\n3. Type Safety: Callers must explicitly check has_value() or use value_or() before accessing.",
    "bullet_points": [
      "Nullable value type stored on the stack with zero heap allocation.",
      "Replaces misleading sentinel return values (-1, empty strings, null pointers).",
      "value_or(fallback) provides safe default extraction."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "std::optional<User> find_user(int id) {\n    if (id == 1) return User{\"Alice\"};\n    return std::nullopt; // Explicitly empty\n}\nauto u = find_user(2);\nstd::cout << u.value_or(User{\"Guest\"}).name;"
    },
    "pro_tip": "Calling opt.value() on an empty optional throws std::bad_optional_access; prefer value_or().",
    "company_tags": [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 60
  },
  {
    "id": "int-cpp-061",
    "topic_id": "topic-cpp",
    "title": "What is std::variant (C++17), and how does it implement a Type-Safe Union?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "std::variant<Types...> is a type-safe, stack-allocated tagged union introduced in C++17:\n\nAdvantages over C-style Unions:\n1. Type Safety: Remembers which type is currently active and throws std::bad_variant_access on illegal type access.\n2. Non-POD Object Support: Safely calls constructors and destructors for complex types (like std::string or std::vector), which C unions cannot do.\n3. std::visit (Pattern Matching): Enables processing variants using overloaded visitor lambdas.",
    "bullet_points": [
      "Type-safe, stack-allocated tagged union supporting non-trivial C++ types.",
      "Throws std::bad_variant_access if accessed with the wrong type.",
      "Processed cleanly via std::visit and overloaded visitor patterns."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "std::variant<int, std::string> v = \"Hello\";\n// Access via std::visit pattern matching:\nstd::visit([](auto&& arg) {\n    std::cout << arg << '\\n';\n}, v);"
    },
    "pro_tip": "std::variant is commonly used to implement AST nodes, state machines, and error-or-value results.",
    "company_tags": [
      "Google",
      "Apple",
      "Bloomberg"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 61
  },
  {
    "id": "int-cpp-062",
    "topic_id": "topic-cpp",
    "title": "What is std::any (C++17), and how does it differ from void*?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "std::any is a type-safe container that can hold a single value of ANY copy-constructible type:\n\nDifferences from void*:\n1. Type Safety: Stores RTTI type information. Accessing via std::any_cast<T>(a) verifies the exact type; throws std::bad_any_cast if mismatched (void* casts blindly).\n2. Lifetime Management: Automatically invokes destructors when reassigned or destroyed, preventing memory leaks.\n3. Small Object Optimization (SOO): Small types fit directly inside std::any without heap allocation.",
    "bullet_points": [
      "Type-safe container holding any copy-constructible object.",
      "Manages object lifetimes and destructors automatically.",
      "std::any_cast<T> verifies type safety at runtime via RTTI."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "std::any a = 10;\na = std::string(\"Dynamic text\");\nstd::cout << std::any_cast<std::string>(a) << '\\n';"
    },
    "pro_tip": "Use std::variant when the set of possible types is known in advance; use std::any for completely arbitrary dynamic types.",
    "company_tags": [
      "Microsoft",
      "Adobe",
      "Amazon"
    ],
    "frequency": "MEDIUM",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 62
  },
  {
    "id": "int-cpp-063",
    "topic_id": "topic-cpp",
    "title": "What is the Small String Optimization (SSO) in modern std::string implementations?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Small String Optimization (SSO) is an internal memory optimization implemented by all modern standard C++ library engines (libstdc++, libc++, MSVC):\n\nHow SSO Works:\n- A standard std::string object occupies 24 or 32 bytes on the stack (pointer, size, capacity).\n- Instead of immediately allocating a tiny buffer on the heap for short strings, std::string repurposes its internal stack capacity buffer to store short strings DIRECTLY ON THE STACK!\n- Capacity Threshold: Strings up to 15 characters (GCC/Clang, 64-bit) or 22 characters (MSVC) require ZERO HEAP ALLOCATION!\n- Heap allocation is triggered only when string length exceeds the internal SSO buffer.\n\nPerformance Impact: Drastically reduces heap allocation fragmentation in real-world systems.",
    "bullet_points": [
      "Stores short strings directly inside the std::string stack object (15-22 chars).",
      "Completely eliminates heap memory allocation for short strings.",
      "Zero fragmentation and maximum CPU cache locality."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "std::string short_str = \"Hello\"; // SSO: Stored entirely on Stack! Zero malloc.\nstd::string long_str = \"This string is way too long to fit in SSO buffer\"; // Heap allocated"
    },
    "pro_tip": "Mention SSO when discussing string performance and memory profiling.",
    "company_tags": [
      "Google",
      "Facebook/Meta",
      "Apple",
      "Jane Street"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 63
  },
  {
    "id": "int-cpp-064",
    "topic_id": "topic-cpp",
    "title": "How does Stack Unwinding work during C++ Exception Handling?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "When an exception is thrown (throw ex;), the C++ runtime begins Stack Unwinding:\n\nExecution Mechanics:\n1. Search for Catch Block: The runtime traverses the call stack upward searching for an enclosing try block with a matching catch handler.\n2. Automatic Destructor Invocation: As stack frames are unwound and popped, the runtime GUARANTEES that destructors are invoked for all fully constructed local stack objects in reverse order of construction!\n3. Terminates if Uncaught: If no matching catch handler is found in the entire call stack, std::terminate() is called, aborting the process immediately.\n\nCritical Rule: Destructors MUST NEVER THROW EXCEPTIONS! If a destructor throws an exception while stack unwinding is already in progress, C++ invokes std::terminate() immediately.",
    "bullet_points": [
      "Stack unwinding pops frames and guarantees local object destructors are executed.",
      "Foundational to RAII exception safety.",
      "Throwing an exception from inside a destructor during stack unwinding aborts immediately."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "void risky() {\n    Widget w; // Destructor guaranteed to run during stack unwinding!\n    throw std::runtime_error(\"Fatal error\");\n}"
    },
    "pro_tip": "Mark all destructors 'noexcept' (default in C++11) to guarantee they never throw.",
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Bloomberg"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 64
  },
  {
    "id": "int-cpp-065",
    "topic_id": "topic-cpp",
    "title": "What are the 3 Exception Safety Guarantees in C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Defined by David Abrahams, these guarantees describe an operation's behavior when an exception is thrown:\n\n1. Basic Guarantee:\n   - If an exception is thrown, no resources are leaked (memory, locks, file handles are freed).\n   - All objects remain in a valid, internally consistent state, though data may be altered.\n2. Strong Guarantee (Commit or Rollback / Transactional):\n   - If an operation fails, the state of the program remains EXACTLY as it was before the operation began (no side effects).\n   - Achieved using the Copy-and-Swap idiom.\n3. Nothrow / Noexcept Guarantee:\n   - The operation is mathematically guaranteed to NEVER throw an exception under any circumstances.\n   - Mandatory for destructors, move constructors, swap functions, and memory deallocation routines.",
    "bullet_points": [
      "Basic Guarantee: No resource leaks; objects left in valid state.",
      "Strong Guarantee: Transactional rollback to pre-call state upon exception.",
      "Nothrow Guarantee: Operation is guaranteed never to throw (marked noexcept)."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "// Strong Exception Safety via Copy-and-Swap:\nvoid updateData(std::vector<int> &vec) {\n    auto temp = vec;      // 1. Copy\n    temp.push_back(42);   // 2. Mutate copy (if throws, vec is untouched!)\n    vec = std::move(temp);// 3. Commit non-throwing move\n}"
    },
    "pro_tip": "Always state that move constructors and destructors must fulfill the Nothrow Guarantee.",
    "company_tags": [
      "Google",
      "Amazon",
      "Apple",
      "Microsoft"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 65
  },
  {
    "id": "int-cpp-066",
    "topic_id": "topic-cpp",
    "title": "What is the 'noexcept' specifier in C++11, and how does it optimize performance?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "The 'noexcept' specifier declares that a function will not throw exceptions:\n\nPerformance Benefits:\n1. Eliminates Unwinding Tables: The compiler does not need to generate exception handling stack unwinding code or landing pads for noexcept functions, shrinking binary size and accelerating calls.\n2. Enables Move Semantics in STL: std::vector::push_back only uses Move Constructors if they are marked noexcept. Without noexcept, it falls back to expensive copy constructors to maintain the strong exception guarantee.\n\nViolation Behavior: If a noexcept function attempts to throw an exception, std::terminate() is called immediately without unwinding.",
    "bullet_points": [
      "Declares that a function is guaranteed not to throw exceptions.",
      "Enables std::vector to use fast move constructors instead of copies.",
      "Reduces binary size by removing exception unwinding landing pads."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "void fast_swap(Widget &a, Widget &b) noexcept {\n    // Compiler generates optimized code with zero exception tracking\n}"
    },
    "pro_tip": "Rule: Mark destructors, move constructors, move assignment operators, and swap functions 'noexcept'.",
    "company_tags": [
      "Amazon",
      "Google",
      "NVIDIA",
      "Meta"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 66
  },
  {
    "id": "int-cpp-067",
    "topic_id": "topic-cpp",
    "title": "What is std::thread, and why must every thread be either joined (join) or detached (detach)?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "std::thread (C++11) represents a single thread of execution mapped directly to an OS thread:\n\nDestructor Trap:\n- If a std::thread object is destroyed while still 'joinable' (i.e. Neither join() nor detach() has been called), its destructor immediately invokes std::terminate(), crashing the process!\n\nOptions:\n1. join(): Blocks the calling thread until the child thread finishes execution. Ensures resources are cleaned up safely.\n2. detach(): Separates the thread from the std::thread object, allowing it to execute independently in the background as a daemon.\n\nC++20 std::jthread (Joining Thread):\n- Automatically joins upon destruction (RAII) and supports cooperative cancellation tokens (std::stop_token).",
    "bullet_points": [
      "Destroying a joinable std::thread object invokes std::terminate(), crashing the app.",
      "join() halts caller until thread finishes; detach() allows background execution.",
      "C++20 std::jthread automatically joins upon destruction, preventing crashes."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "void worker() { std::cout << \"Working\\n\"; }\n\n// C++11: Must join manually\nstd::thread t(worker);\nt.join(); // Safe!\n\n// C++20: RAII auto-joining thread\nstd::jthread jt(worker); // Automatically joins in destructor!"
    },
    "pro_tip": "Highlight std::jthread in C++20 as the modern, safe alternative that prevents std::terminate() crashes.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 67
  },
  {
    "id": "int-cpp-068",
    "topic_id": "topic-cpp",
    "title": "What is std::mutex and std::lock_guard vs std::unique_lock in C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "C++11 provides RAII wrappers for mutex synchronization:\n\n1. std::lock_guard<std::mutex>:\n   - Strict RAII wrapper. Acquires lock upon construction; releases lock in destructor.\n   - Cannot be manually unlocked or relocked; non-movable and non-copyable.\n   - Minimal overhead, maximum safety for simple critical sections.\n2. std::unique_lock<std::mutex>:\n   - Flexible RAII wrapper. Allows deferred locking (std::defer_lock), manual unlock() and lock(), and timed locking.\n   - Movable: Can transfer lock ownership between scopes.\n   - Mandatory for use with std::condition_variable (condition_variable requires the ability to unlock while waiting and relock upon notification).\n3. std::scoped_lock (C++17): Deadlock-free locking of multiple mutexes simultaneously using deadlock avoidance algorithms.",
    "bullet_points": [
      "lock_guard: Lightweight strict RAII lock for basic critical sections.",
      "unique_lock: Flexible lock supporting manual unlock/relock, deferred locking, and condition_variables.",
      "std::scoped_lock (C++17) safely locks multiple mutexes without deadlock."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "std::mutex mtx;\nvoid safe_increment(int &count) {\n    std::lock_guard<std::mutex> lock(mtx); // RAII lock\n    ++count;\n} // Automatically unlocked here even if exception occurs!"
    },
    "pro_tip": "Mention std::scoped_lock(m1, m2) in C++17 to acquire multiple locks safely without deadlock risk.",
    "company_tags": [
      "Amazon",
      "Google",
      "Microsoft",
      "Bloomberg"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 68
  },
  {
    "id": "int-cpp-069",
    "topic_id": "topic-cpp",
    "title": "How does std::condition_variable work in C++? Why is a while loop required for wait()?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "std::condition_variable enables threads to block until notified by another thread that a condition is met:\n\nMechanics:\n- Must be paired with std::unique_lock<std::mutex>.\n- cv.wait(lock): Atomically releases the mutex and suspends the thread.\n- When notified via cv.notify_one() or notify_all(), the thread wakes up and atomically re-acquires the mutex.\n\nWhy a while loop is MANDATORY:\n1. Spurious Wakeups: Under POSIX and OS kernel scheduling, threads can wake up from wait without any thread sending a notification!\n2. Race Conditions: Between the notification and the waking thread re-acquiring the lock, another thread might have consumed the resource.\n- Syntax: cv.wait(lock, [&]{ return !queue.empty(); }); automatically wraps the predicate in a while loop.",
    "bullet_points": [
      "Atomically releases mutex and blocks thread until notified.",
      "Must use std::unique_lock (not lock_guard) to allow unlocking while waiting.",
      "Predicate while loop is mandatory to protect against Spurious Wakeups."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "std::condition_variable cv;\nstd::mutex mtx;\nstd::queue<int> q;\n\n// Consumer thread:\nstd::unique_lock<std::mutex> lock(mtx);\ncv.wait(lock, [&]{ return !q.empty(); }); // Safe predicate loop\nint val = q.front(); q.pop();"
    },
    "pro_tip": "A standard multithreading interview question asked by trading firms and systems companies.",
    "company_tags": [
      "Jane Street",
      "Citadel",
      "Amazon",
      "Google"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 69
  },
  {
    "id": "int-cpp-070",
    "topic_id": "topic-cpp",
    "title": "What are C++11 std::atomic operations, and what is std::memory_order?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "std::atomic<T> provides lock-free, thread-safe access to shared variables using hardware CPU atomic instructions (like CMPXCHG / CAS):\n\nKey Attributes:\n1. Lock-Free Atomicity: Operations like fetch_add(), compare_exchange_strong() execute in hardware without OS mutex locks.\n2. Memory Ordering Models (std::memory_order):\n   - memory_order_seq_cst (Default): Sequentially Consistent. Total global order across all threads; safest but slowest due to full memory fences.\n   - memory_order_acquire / memory_order_release: Synchronizes reads and writes between threads without enforcing global total order across unrelated threads.\n   - memory_order_relaxed: Guarantees atomicity only; no synchronization or ordering constraints (fastest).",
    "bullet_points": [
      "std::atomic enables lock-free thread synchronization via CPU hardware CAS instructions.",
      "Default memory_order_seq_cst guarantees total global instruction ordering.",
      "Acquire-Release semantics synchronize producer-consumer pairs without full memory fence overhead."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "std::atomic<int> counter{0};\ncounter.fetch_add(1, std::memory_order_relaxed); // Lock-free atomic increment"
    },
    "pro_tip": "Discussing Acquire-Release semantics and memory models immediately establishes top-tier systems engineering credentials.",
    "company_tags": [
      "Apple",
      "Google",
      "Jane Street",
      "NVIDIA"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 70
  },
  {
    "id": "int-cpp-071",
    "topic_id": "topic-cpp",
    "title": "What is std::future and std::async in C++11?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "std::async provides a high-level abstraction for asynchronous task execution, returning a std::future<T>:\n\nMechanics:\n- std::async launches a callable either on a new thread (std::launch::async) or lazily upon request (std::launch::deferred).\n- std::future<T> holds the computation result (or exception) once completed.\n- fut.get() blocks the calling thread until the result is ready and returns it.\n\nTrap (Destructor Blocking):\n- The destructor of a std::future returned by std::async(launch::async) BLOCKS until the asynchronous task finishes!",
    "bullet_points": [
      "std::async executes tasks asynchronously, returning a std::future<T>.",
      "fut.get() blocks until the asynchronous computation finishes and yields the result.",
      "Exceptions thrown in the async task are captured and re-thrown upon fut.get()."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "auto fut = std::async(std::launch::async, []() {\n    // compute heavy task\n    return 42;\n});\nstd::cout << fut.get(); // Blocks and prints 42"
    },
    "pro_tip": "Always specify launch policy explicitly (std::launch::async) to avoid implementation-dependent deferred execution.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Bloomberg"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 71
  },
  {
    "id": "int-cpp-072",
    "topic_id": "topic-cpp",
    "title": "What is the difference between auto and decltype in C++11/14?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Both perform compile-time type deduction, but follow different deduction rules:\n\n1. auto (Value Type Deduction):\n   - Deduces type from the initializing expression, stripping top-level const and references (just like template type deduction)!\n   - int x = 10; const int &r = x; auto a = r; -> 'a' is deduced as plain 'int' (not const, not a reference).\n2. decltype(expr) (Exact Entity Type Deduction):\n   - Queries the EXACT declared type of an expression, PRESERVING const and references!\n   - decltype(r) b = x; -> 'b' is deduced as const int&.\n3. decltype(auto) (C++14):\n   - Deduces type using auto syntax, but applies decltype rules (preserves references and constness in generic return types).",
    "bullet_points": [
      "auto strips top-level const and references during deduction.",
      "decltype(expr) inspects exact type, preserving const and references.",
      "decltype(auto) (C++14) preserves references in return type deduction."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "const int x = 10;\nauto a = x;            // a is int (const stripped)\ndecltype(x) b = x;     // b is const int\n\n// C++14 generic forwarding return:\ndecltype(auto) getRef(std::vector<int>& v) { return v[0]; } // Returns int&"
    },
    "pro_tip": "Use decltype(auto) when writing generic wrapper functions that forward return references.",
    "company_tags": [
      "Google",
      "Microsoft",
      "Amazon"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 72
  },
  {
    "id": "int-cpp-073",
    "topic_id": "topic-cpp",
    "title": "What are Lambda Expressions in C++11, and what do Capture Clauses ([=], [&], [this]) do?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "A Lambda Expression is an anonymous inline function object (closure) defined directly at the call site:\n\nSyntax: [capture](parameters) -> return_type { body }\n\nCapture Clauses:\n1. [] : Captures nothing from enclosing scope.\n2. [=] : Captures all enclosing local variables by VALUE (copies them into closure).\n3. [&] : Captures all enclosing local variables by REFERENCE (fast, but danger of dangling reference if lambda outlives scope!).\n4. [this] : Captures the current class object pointer by reference.\n5. Init Capture (C++14): [ptr = std::move(p)] allows moving non-copyable types (like unique_ptr) into closures!\n\nInternal Implementation: The compiler generates a unique, anonymous class (functor) with an overloaded operator().",
    "bullet_points": [
      "Defines inline anonymous function objects (closures).",
      "[=] captures by value; [&] captures by reference.",
      "C++14 init-capture allows moving unique_ptrs into closures ([p = std::move(ptr)])."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "int multiplier = 3;\nauto triple = [multiplier](int x) { return x * multiplier; };\nstd::cout << triple(5); // 15"
    },
    "pro_tip": "Warning on [&]: Capturing by reference when returning lambdas or passing to async threads creates catastrophic dangling references.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 73
  },
  {
    "id": "int-cpp-074",
    "topic_id": "topic-cpp",
    "title": "What is the difference between std::function and a raw Function Pointer or Lambda?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Comparison of function wrappers and execution overhead:\n\n1. Raw Function Pointer:\n   - Simple 8-byte code address. Fastest execution, zero memory overhead.\n   - Cannot capture state or bind closures.\n2. Stateless Lambda:\n   - Generates an anonymous functor class. Compiles directly into inline machine code with zero overhead.\n   - Automatically converts to a raw function pointer if it has an empty capture list [].\n3. std::function<R(Args...)> (Polymorphic Function Wrapper):\n   - General-purpose type-erased wrapper capable of storing ANY callable (function pointer, lambda with captures, member function, functor).\n   - Overhead: Performs Type Erasure, holds dynamic heap storage if captures exceed Small Buffer Optimization (SBO), and invokes via virtual function indirection (~2x-3x slower than raw calls).",
    "bullet_points": [
      "Raw function pointers cannot capture state.",
      "Stateless lambdas are inlined with zero overhead and convert to function pointers.",
      "std::function uses type erasure and indirect dispatch, with small overhead."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "// Type-erased wrapper accepting lambdas with captures:\nstd::function<int(int)> func = [offset = 5](int x) { return x + offset; };"
    },
    "pro_tip": "Rule: In template functions, use template <typename F> void call(F&& func) for zero-overhead inlining instead of std::function.",
    "company_tags": [
      "Amazon",
      "Google",
      "Bloomberg"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 74
  },
  {
    "id": "int-cpp-075",
    "topic_id": "topic-cpp",
    "title": "What is Constexpr If (if constexpr) in C++17?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "constexpr if (C++17) evaluates conditional statements at COMPILE TIME, completely discarding unselected branches from code generation:\n\nWhy It Revolutionized C++:\n- In standard 'if (condition)', ALL branches must be valid, well-formed code and compile cleanly, even if the condition is known at compile time.\n- With 'if constexpr (condition)', the discarded branch is NOT compiled or instantiated for that type!\n- Replaces hundreds of lines of complex SFINAE enable_if boilerplate with simple, readable if-else logic.",
    "bullet_points": [
      "Evaluates conditions at compile time, discarding non-selected branches completely.",
      "Discarded branches do not need to be valid for the instantiated type.",
      "Replaces complex SFINAE template specialization with simple if-else blocks."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "template <typename T>\nauto get_value(T t) {\n    if constexpr (std::is_pointer_v<T>) {\n        return *t; // Compiled ONLY if T is a pointer!\n    } else {\n        return t;  // Compiled ONLY if T is a value!\n    }\n}"
    },
    "pro_tip": "Highlight if constexpr as one of the single biggest quality-of-life improvements in modern C++ template metaprogramming.",
    "company_tags": [
      "Google",
      "Microsoft",
      "Meta"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 75
  },
  {
    "id": "int-cpp-076",
    "topic_id": "topic-cpp",
    "title": "What is the difference between const and constexpr in C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "1. const: Specifies that a variable's value cannot be modified after initialization. It can be initialized at runtime with runtime values (e.g. const int val = rand();).\n2. constexpr: Strictly indicates that a variable or function is a compile-time constant evaluated during compilation. Its initializer MUST be a constant expression known to the compiler at build time.\n- All constexpr variables are implicitly const, but not all const variables are constexpr.",
    "bullet_points": [
      "const prevents modification, but can be initialized at runtime.",
      "constexpr guarantees compile-time constant evaluation.",
      "All constexpr variables are implicitly const."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "int x = rand();\nconst int c = x;     // Valid: Runtime constant\n// constexpr int ce = x; // COMPILE ERROR: x is not a compile-time constant!"
    },
    "pro_tip": "Use constexpr wherever possible to move computations to compile time.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Apple"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 76
  },
  {
    "id": "int-cpp-077",
    "topic_id": "topic-cpp",
    "title": "What are User-Defined Literals in C++11?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "User-Defined Literals allow creating custom suffix operators for literals (e.g. 100_km, 5s, \"hello\"s):\n\nSyntax: ReturnType operator\"\" _suffix(unsigned long long val);\n\nStandard Library Examples:\n- std::chrono literals: 500ms, 10s, 2h.\n- std::string literals: \"hello\"s (creates std::string directly instead of const char*).",
    "bullet_points": [
      "Enables custom literal suffixes via operator\"\" _suffix.",
      "Used by std::chrono (500ms, 2h) and std::string (\"text\"s).",
      "User suffixes must start with an underscore (_)."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "using namespace std::chrono_literals;\nauto duration = 500ms; // std::chrono::milliseconds"
    },
    "pro_tip": "Standard library literal suffixes do NOT start with an underscore; user-defined ones MUST start with an underscore.",
    "company_tags": [
      "Google",
      "Bloomberg"
    ],
    "frequency": "MEDIUM",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 77
  },
  {
    "id": "int-cpp-078",
    "topic_id": "topic-cpp",
    "title": "What is the 'volatile' keyword in C++ vs Java? Why is C++ volatile NOT for multithreading?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "CRITICAL ARCHITECTURAL DIFFERENCE:\n\n1. In Java: 'volatile' guarantees CPU cache visibility and inserts memory barriers, making it foundational for multithreading synchronization.\n2. In C++: 'volatile' has ZERO multithreading synchronization guarantees! It does NOT insert memory barriers, does NOT make operations atomic, and does NOT prevent instruction reordering across threads!\n\nRole in C++: Strictly for hardware memory-mapped I/O and signal handlers. For multithreading in C++, ALWAYS use std::atomic.",
    "bullet_points": [
      "C++ volatile provides NO thread synchronization, atomicity, or memory fences.",
      "In C++, volatile is strictly for hardware memory-mapped I/O and signal handlers.",
      "For multithreading in C++, use std::atomic."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "// WRONG in C++ multithreading:\nvolatile bool flag = false; // Does NOT prevent race conditions!\n\n// CORRECT in C++:\nstd::atomic<bool> flag = false; // Thread-safe with memory ordering"
    },
    "pro_tip": "This is one of the most famous traps for developers transitioning between Java and C++.",
    "company_tags": [
      "Google",
      "Apple",
      "Jane Street"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 78
  },
  {
    "id": "int-cpp-079",
    "topic_id": "topic-cpp",
    "title": "What is Structured Binding in C++17?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Structured Bindings (C++17) allow unpacking tuples, pairs, structs, and arrays into distinct named variables in a single statement:\n\nSyntax: auto [a, b, c] = tuple_or_struct;\n\nSupports:\n- std::pair and std::tuple.\n- Plain structures with public data members.\n- Fixed-size C-arrays.",
    "bullet_points": [
      "Unpacks pairs, tuples, structs, and arrays into named variables.",
      "Eliminates verbose std::tie and p.first / p.second boilerplate.",
      "Supports auto [x, y], auto& [x, y], and const auto& [x, y]."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "std::map<std::string, int> ages = {{\"Alice\", 25}};\nfor (const auto& [name, age] : ages) {\n    std::cout << name << \": \" << age << '\\n';\n}"
    },
    "pro_tip": "Clean and ubiquitous in modern C++17 codebases.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Meta"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 79
  },
  {
    "id": "int-cpp-080",
    "topic_id": "topic-cpp",
    "title": "What is Type Erasure in C++, and how does std::function or std::any implement it?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Type Erasure is a design pattern that provides a non-template polymorphic interface while hiding the underlying concrete type:\n\nMechanics:\n- Uses an abstract base class (Concept) and a templated derived class (Model) internally.\n- The container holds a pointer to the abstract base class.\n- Allows holding heterogeneous types that share common operations without exposing template arguments in the public interface.",
    "bullet_points": [
      "Hides concrete types behind a unified non-template interface.",
      "Combines templates with inheritance and vtables internally.",
      "Powers std::function, std::any, and modern plugin architectures."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "// std::function erases the concrete lambda/functor type:\nstd::function<void()> f = []() { std::cout << \"Type erased!\\n\"; };"
    },
    "pro_tip": "Mentioning the Concept/Model pattern demonstrates mastery of advanced C++ patterns.",
    "company_tags": [
      "Bloomberg",
      "Google",
      "Adobe"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 80
  },
  {
    "id": "int-cpp-081",
    "topic_id": "topic-cpp",
    "title": "What is the difference between std::lock and std::scoped_lock in C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "1. std::lock(m1, m2) (C++11): A function that locks multiple mutexes using a deadlock-avoidance algorithm, but does NOT manage their unlock! Requires manual unlock or std::adopt_lock.\n2. std::scoped_lock (C++17): The modern RAII wrapper that acquires multiple mutexes atomically without deadlock upon construction AND automatically unlocks them all in its destructor.",
    "bullet_points": [
      "std::lock avoids deadlocks but requires manual unlock or adopt_lock.",
      "std::scoped_lock (C++17) provides all-in-one deadlock-free RAII locking.",
      "Standard best practice for locking multiple mutexes."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "std::mutex m1, m2;\nvoid transfer() {\n    std::scoped_lock lock(m1, m2); // Deadlock-free RAII locking of both mutexes\n}"
    },
    "pro_tip": "Always prefer std::scoped_lock in C++17+.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Goldman Sachs"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 81
  },
  {
    "id": "int-cpp-082",
    "topic_id": "topic-cpp",
    "title": "What is std::unique_ptr with array types (std::unique_ptr<T[]>)?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "std::unique_ptr has a template specialization for dynamic arrays (std::unique_ptr<T[]>):\n\nKey Differences from Single Object:\n1. Invokes delete[]: Automatically calls delete[] instead of delete upon destruction.\n2. operator[]: Provides indexed bracket access (p[i]), but removes operator* and operator->.",
    "bullet_points": [
      "Specialization std::unique_ptr<T[]> manages dynamic arrays.",
      "Automatically calls delete[] upon destruction.",
      "Provides operator[] for direct indexing."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "auto arr = std::make_unique<int[]>(10); // Allocates array of 10 ints\narr[0] = 42; // Indexed access\n// delete[] called automatically!"
    },
    "pro_tip": "Prefer std::vector over unique_ptr<T[]> unless a non-resizable fixed buffer is strictly needed.",
    "company_tags": [
      "Qualcomm",
      "Intel",
      "Amazon"
    ],
    "frequency": "MEDIUM",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 82
  },
  {
    "id": "int-cpp-083",
    "topic_id": "topic-cpp",
    "title": "What is the Inline Variable feature in C++17?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Prior to C++17, defining a static member variable in a header file caused duplicate symbol linker errors if included in multiple .cpp files, requiring definition in a separate .cpp file.\n\nInline Variables (C++17):\n- Adding 'inline' (inline static int count = 0;) allows defining and initializing static variables directly inside header files!\n- The linker guarantees that all translation units share exactly ONE instance of the variable.",
    "bullet_points": [
      "Allows defining static class members directly in headers.",
      "Linker unifies multiple definitions across translation units.",
      "Eliminates boilerplate definitions in separate .cpp files."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class Config {\npublic:\n    inline static const std::string VERSION = \"1.0.0\"; // C++17 inline variable\n};"
    },
    "pro_tip": "Essential for header-only C++ libraries.",
    "company_tags": [
      "Google",
      "Microsoft"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 83
  },
  {
    "id": "int-cpp-084",
    "topic_id": "topic-cpp",
    "title": "What is std::align and alignas in C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Controls memory alignment for high-performance SIMD instructions and cache line optimization:\n\n1. alignas(N): Sets explicit alignment for a variable or struct (e.g. alignas(64) struct CacheLinePadded; to prevent false sharing).\n2. alignof(T): Queries the alignment requirement of type T.\n3. std::align: Adjusts a pointer buffer to conform to specified alignment boundaries.",
    "bullet_points": [
      "alignas specifies custom alignment (e.g. 64-byte cache line alignment).",
      "alignof queries alignment requirements.",
      "Prevents CPU false sharing in concurrent multi-threaded data structures."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "struct alignas(64) ThreadData {\n    int count; // Padded to 64 bytes to eliminate false sharing!\n};"
    },
    "pro_tip": "Used extensively in lock-free queues and GPU SIMD compute pipelines.",
    "company_tags": [
      "NVIDIA",
      "Intel",
      "Jane Street"
    ],
    "frequency": "MEDIUM",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 84
  },
  {
    "id": "int-cpp-085",
    "topic_id": "topic-cpp",
    "title": "What is False Sharing in C++ Multithreading, and how do you prevent it?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "False Sharing is a severe performance degradation that occurs in multi-threaded CPU systems:\n\nMechanics:\n- Multi-core CPUs synchronize memory in 64-byte Cache Lines.\n- If Thread A modifies variable X on Core 1, and Thread B modifies variable Y on Core 2, and both X and Y happen to reside in the SAME 64-byte cache line:\n- Core 1's write invalidates Core 2's entire cache line!\n- The cache line is bounced back and forth across CPU cores (Cache Line Bouncing), slowing execution by 100x!\n\nPrevention:\n- Pad variables to separate cache lines using alignas(hardware_destructive_interference_size) (C++17).",
    "bullet_points": [
      "Independent variables on the same 64-byte cache line trigger mutual cache invalidations.",
      "Causes severe performance degradation due to cache line bouncing.",
      "Prevent via alignas(64) or std::hardware_destructive_interference_size."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "struct alignas(64) WorkerSlot {\n    int counter; // Resides on its own isolated 64-byte cache line!\n};"
    },
    "pro_tip": "A legendary systems interview question asked by trading firms and operating systems teams.",
    "company_tags": [
      "Citadel",
      "Jane Street",
      "Apple",
      "NVIDIA"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 85
  },
  {
    "id": "int-cpp-086",
    "topic_id": "topic-cpp",
    "title": "What is the difference between std::sort and std::stable_sort?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "1. std::sort:\n   - Implemented as Introsort (QuickSort + HeapSort + InsertionSort).\n   - Unstable: Does NOT preserve the relative order of equivalent elements.\n   - O(n log n) average and worst case.\n2. std::stable_sort:\n   - Implemented as MergeSort.\n   - Stable: GUARANTEES that equivalent elements preserve their original relative order.\n   - Requires additional O(n) temporary memory buffer.",
    "bullet_points": [
      "std::sort is unstable (Introsort, O(n log n)).",
      "std::stable_sort preserves original relative order of equal elements (MergeSort).",
      "stable_sort requires O(n) extra memory buffer."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "// stable_sort maintains original secondary order\nstd::stable_sort(records.begin(), records.end(), byPriority);"
    },
    "pro_tip": "Use stable_sort when sorting multi-column tables (e.g. sort by name, then by age).",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "TCS"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 86
  },
  {
    "id": "int-cpp-087",
    "topic_id": "topic-cpp",
    "title": "What is the spaceship operator (<=>) in C++20 (Three-Way Comparison)?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Introduced in C++20, the Three-Way Comparison operator (<=>) automatically generates all 6 relational comparison operators (==, !=, <, <=, >, >=) from a single definition:\n\nMechanics:\n- auto operator<=>(const ClassName&) const = default;\n- Evaluates to: strong_ordering::less, strong_ordering::equal, or strong_ordering::greater.\n- Eliminates writing dozens of repetitive comparison operator overloads.",
    "bullet_points": [
      "C++20 spaceship operator (<=>) generates all 6 relational operators automatically.",
      "Defaulting it (= default) generates lexicographical member-wise comparisons.",
      "Returns strong_ordering, weak_ordering, or partial_ordering."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "struct Point {\n    int x, y;\n    auto operator<=>(const Point&) const = default; // Generates ==, !=, <, <=, >, >=\n};\nPoint p1{1, 2}, p2{1, 3};\nif (p1 < p2) { /* Works out of the box! */ }"
    },
    "pro_tip": "Highlight how <=> simplifies boilerplate in modern C++20 class design.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 87
  },
  {
    "id": "int-cpp-088",
    "topic_id": "topic-cpp",
    "title": "What are C++20 Coroutines and co_yield, co_await, co_return?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "C++20 Coroutines are stackless functions that can suspend execution and resume later, preserving local state:\n\nKeywords:\n1. co_await expr: Suspends execution until an operation finishes without blocking OS threads.\n2. co_yield expr: Suspends execution and yields a value to the caller (enables Python-like generators).\n3. co_return expr: Returns from a coroutine.\n\nStackless Design: Coroutine state is allocated on the heap (promise object), requiring tiny memory footprint.",
    "bullet_points": [
      "Stackless coroutines that suspend and resume execution.",
      "co_await for non-blocking async, co_yield for generators, co_return for results.",
      "State preserved in heap-allocated promise objects."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "// Conceptual C++20 generator coroutine\nGenerator<int> range(int start, int end) {\n    for (int i = start; i < end; ++i) {\n        co_yield i; // Suspends and yields value\n    }\n}"
    },
    "pro_tip": "Major architectural addition in C++20 for high-performance network services.",
    "company_tags": [
      "Meta",
      "Microsoft",
      "Google"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 88
  },
  {
    "id": "int-cpp-089",
    "topic_id": "topic-cpp",
    "title": "What is the difference between deep copy, move, and copy-on-write in C++ strings?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "1. Deep Copy: Allocates new memory buffer and duplicates all characters.\n2. Move: Steals the pointer in O(1) time and nullifies source.\n3. Copy-on-Write (COW): Multiple strings share the same buffer with a reference count until one writes (modifies), triggering an actual copy.\n- Note: COW was BANNED in C++11 for std::string because multithreaded reference counting overhead negated benefits and broke iterator invalidation rules.",
    "bullet_points": [
      "Deep copy duplicates data buffer completely.",
      "Move transfers ownership in O(1) time.",
      "Copy-on-write (COW) was banned in C++11 due to multithreading concurrency issues."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "std::string s1 = \"test\";\nstd::string s2 = s1;            // Deep copy\nstd::string s3 = std::move(s1); // Move: O(1) ownership transfer"
    },
    "pro_tip": "Mentioning that COW was banned in C++11 proves deep knowledge of language standard evolution.",
    "company_tags": [
      "Google",
      "Apple"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 89
  },
  {
    "id": "int-cpp-090",
    "topic_id": "topic-cpp",
    "title": "What is std::shared_mutex (C++17) and Reader-Writer Locks?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "std::shared_mutex provides Reader-Writer locking to optimize concurrent read throughput:\n\nLock Modes:\n1. Shared Lock (std::shared_lock<std::shared_mutex>): Multiple reader threads can hold the lock simultaneously.\n2. Exclusive Lock (std::unique_lock<std::shared_mutex>): Only one writer thread can hold the lock, excluding all readers and writers.\n\nIdeal for read-heavy caches and lookup dictionaries.",
    "bullet_points": [
      "Reader-Writer lock for read-heavy concurrent data structures.",
      "Multiple readers acquire shared_lock; single writer acquires unique_lock.",
      "Eliminates read lock contention while protecting writes."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "std::shared_mutex rw_mtx;\nint read_data() {\n    std::shared_lock lock(rw_mtx); // Multiple readers allowed\n    return data;\n}\nvoid write_data(int val) {\n    std::unique_lock lock(rw_mtx); // Exclusive write lock\n    data = val;\n}"
    },
    "pro_tip": "Standard pattern for caching systems and concurrent database indexes.",
    "company_tags": [
      "Amazon",
      "Bloomberg",
      "Google"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 90
  },
  {
    "id": "int-cpp-091",
    "topic_id": "topic-cpp",
    "title": "What is the difference between dynamic binding and static binding in C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "1. Static Binding (Early Binding): Resolved at compile time based on reference/pointer type. Used for non-virtual methods, static methods, and overloaded functions. Direct CALL instruction, zero overhead, inlineable.\n2. Dynamic Binding (Late Binding): Resolved at runtime based on actual object residing in memory using vtables and vptrs. Used for virtual functions. Indirect CALL instruction.",
    "bullet_points": [
      "Static binding: Compile-time resolution based on declared type (fast, non-virtual).",
      "Dynamic binding: Runtime resolution via vtable based on actual object.",
      "Dynamic binding enables runtime polymorphism at the cost of indirection."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "Base *b = new Derived();\nb->nonVirtual(); // Static binding: Base::nonVirtual()\nb->virtualFunc(); // Dynamic binding: Derived::virtualFunc()"
    },
    "pro_tip": "A fundamental OOP concept tested in all technical rounds.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 91
  },
  {
    "id": "int-cpp-092",
    "topic_id": "topic-cpp",
    "title": "What is an Initializer List constructor in C++11 (std::initializer_list)?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "std::initializer_list<T> allows classes to accept curly-bracket braced initialization lists (e.g. std::vector<int> v = {1, 2, 3};):\n\nMechanics:\n- Backed by a temporary array of const elements.\n- Provides begin(), end(), and size().\n- Elements are read-only (copied into container).",
    "bullet_points": [
      "Enables curly-brace syntax for custom collections (MyList l = {1, 2, 3}).",
      "Backed by a temporary array of const T.",
      "Constructor takes precedence over other constructors in braced initialization."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class IntList {\npublic:\n    IntList(std::initializer_list<int> list) {\n        for (int x : list) add(x);\n    }\n};\nIntList list = {10, 20, 30};"
    },
    "pro_tip": "Be careful: auto v = {1}; deduces to std::initializer_list<int>, not int!",
    "company_tags": [
      "Amazon",
      "Microsoft"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 92
  },
  {
    "id": "int-cpp-093",
    "topic_id": "topic-cpp",
    "title": "What is std::bind vs Lambda expressions in modern C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "std::bind (C++11) binds function arguments using placeholders (_1, _2).\n\nWhy Lambdas Replaced std::bind:\n- Lambdas are vastly more readable, easier to debug, and faster because compilers inline lambdas directly, whereas std::bind can prevent inlining.\n- Modern C++ guidelines recommend avoiding std::bind completely in favor of lambdas.",
    "bullet_points": [
      "std::bind binds function arguments using placeholders (_1, _2).",
      "Lambdas are faster, inlineable, and far more readable.",
      "Effective Modern C++ rule: Prefer lambdas over std::bind."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "// Lambda is vastly cleaner than std::bind:\nauto add5 = [](int x) { return x + 5; };"
    },
    "pro_tip": "Mention Effective Modern C++ Item 34: 'Prefer lambdas to std::bind'.",
    "company_tags": [
      "Google",
      "Amazon"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 93
  },
  {
    "id": "int-cpp-094",
    "topic_id": "topic-cpp",
    "title": "What is the difference between inline and macro in C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "1. Macro (#define): Handled by preprocessor via raw string substitution. No type checking, ignores namespaces and access modifiers, causes side-effect bugs (SQUARE(x++)).\n2. Inline function (inline): Handled by compiler. Full type checking, obeys class scopes and access specifiers, evaluates arguments safely once.",
    "bullet_points": [
      "Macros do blind textual substitution; inline functions enforce full type safety.",
      "Inline functions obey class scope, namespaces, and access specifiers.",
      "Inline functions evaluate arguments safely once."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "inline int square(int x) { return x * x; } // Safe, typed, fast"
    },
    "pro_tip": "Always prefer inline functions and constexpr over macros in C++.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 94
  },
  {
    "id": "int-cpp-095",
    "topic_id": "topic-cpp",
    "title": "What is the Friend class and Friend function in C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "The 'friend' keyword grants an external function or another class access to private and protected members of the declaring class:\n\nProperties:\n1. Non-Mutual: If A is a friend of B, B is NOT automatically a friend of A.\n2. Non-Inherited: Friendship is not inherited by subclasses.\n3. Common Use Case: Overloading stream operators (operator<< and operator>>) which must be non-member functions.",
    "bullet_points": [
      "Grants private and protected access to specific external functions or classes.",
      "Friendship is not mutual and not inherited.",
      "Standard for implementing operator<< and operator>>."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class Box {\n    int width = 10;\n    friend void printWidth(const Box &b);\n};\nvoid printWidth(const Box &b) { std::cout << b.width; }"
    },
    "pro_tip": "Use friendship sparingly to avoid breaking encapsulation.",
    "company_tags": [
      "Amazon",
      "Infosys",
      "TCS"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 95
  },
  {
    "id": "int-cpp-096",
    "topic_id": "topic-cpp",
    "title": "How does Operator Overloading work in C++? What operators cannot be overloaded?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "Operator overloading allows custom types to define behaviors for built-in C++ operators (using operator+ syntax):\n\nOperators That CANNOT Be Overloaded:\n1. . (Dot member access operator)\n2. .* (Pointer-to-member operator)\n3. :: (Scope resolution operator)\n4. ?: (Ternary conditional operator)\n5. sizeof (Size-of operator)\n6. typeid (RTTI operator)",
    "bullet_points": [
      "Defines custom behaviors for standard C++ operators.",
      "Cannot overload: ., .*, ::, ?:, sizeof, typeid.",
      "Cannot create new operators or alter operator precedence."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "struct Complex {\n    double r, i;\n    Complex operator+(const Complex &other) const {\n        return {r + other.r, i + other.i};\n    }\n};"
    },
    "pro_tip": "A standard classic viva question: 'Which 5 operators cannot be overloaded in C++?'",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 96
  },
  {
    "id": "int-cpp-097",
    "topic_id": "topic-cpp",
    "title": "What is Memory Pool (Custom Allocator) in C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "A Memory Pool pre-allocates a large continuous memory block and manages fixed-size chunk allocations manually:\n\nBenefits:\n- Eliminates heap fragmentation.\n- Allocation and deallocation are O(1) in a few CPU cycles (zero lock contention or free-list traversal).\n- Standard STL containers accept custom allocators (std::vector<int, CustomAlloc>).",
    "bullet_points": [
      "Pre-allocates memory and dishes out fixed-size blocks in O(1) time.",
      "Eliminates heap fragmentation and dynamic allocation lock contention.",
      "Integrates with STL containers via custom allocator templates."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "// High-frequency trading systems use custom memory pools for order books."
    },
    "pro_tip": "Used in game engines (EA, Epic) and low-latency trading (Jane Street, Citadel).",
    "company_tags": [
      "Citadel",
      "Epic Games",
      "Jane Street"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 97
  },
  {
    "id": "int-cpp-098",
    "topic_id": "topic-cpp",
    "title": "What is std::bitset in C++, and when is it preferred over vector<bool>?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "std::bitset<N> represents a fixed-size sequence of N bits allocated on the stack:\n\nAdvantages:\n- Stack-allocated with zero heap overhead.\n- Supports bitwise operators (&, |, ^, <<, >>) directly.\n- Fast: Packaged into CPU word registers.",
    "bullet_points": [
      "Fixed-size bit array stored on the stack.",
      "Supports direct bitwise boolean logic operations.",
      "Fast and memory-efficient for bitmask flags."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "std::bitset<8> flags;\nflags.set(3); // Set bit 3 to 1"
    },
    "pro_tip": "Use std::bitset when size is known at compile time.",
    "company_tags": [
      "Amazon",
      "Microsoft"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 98
  },
  {
    "id": "int-cpp-099",
    "topic_id": "topic-cpp",
    "title": "What is the difference between const member function and non-const member function in C++?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "A const member function (void func() const) promises not to modify any member variables of the object:\n\nRules:\n1. 'this' pointer becomes const ClassName* const.\n2. CAN be invoked on both const and non-const objects (non-const methods CANNOT be called on const objects!).\n3. Exception: Member variables declared with 'mutable' CAN still be modified inside const functions (used for mutexes, cache fields).",
    "bullet_points": [
      "const member functions cannot mutate object state.",
      "Mandatory for methods invoked on const objects.",
      "'mutable' keyword allows specific fields (like mutexes) to be modified in const methods."
    ],
    "code_snippet": {
      "language": "cpp",
      "code": "class User {\n    std::string name;\n    mutable std::mutex mtx; // Allowed to lock inside const methods!\npublic:\n    std::string getName() const {\n        std::lock_guard lock(mtx);\n        return name;\n    }\n};"
    },
    "pro_tip": "Always mark all read-only getters 'const'.",
    "company_tags": [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 99
  },
  {
    "id": "int-cpp-100",
    "topic_id": "topic-cpp",
    "title": "What is Undefined Behavior in C++ vs Compiler Warnings? What are Sanitizers?",
    "category": "CORE_CS",
    "subject": "CPP",
    "subject_label": "C++",
    "answer": "1. Undefined Behavior (UB): Operations where the C++ standard imposes no requirements. Compilers assume UB never happens and optimize aggressively, causing silent corruption or crashes.\n2. Sanitizers (ASan, UBSan, TSan): Compiler runtime instrumentation tools that catch memory bugs, undefined behavior, and data races instantly with low overhead.",
    "bullet_points": [
      "UB allows compilers to make assumptions that lead to silent data bugs.",
      "AddressSanitizer (-fsanitize=address) detects memory leaks and buffer overflows.",
      "ThreadSanitizer (-fsanitize=thread) detects data races in concurrent code."
    ],
    "code_snippet": {
      "language": "bash",
      "code": "# Compiling with AddressSanitizer and UndefinedBehaviorSanitizer in GCC/Clang:\ng++ -fsanitize=address,undefined -g main.cpp -o app\n./app"
    },
    "pro_tip": "Sanitizers are the gold standard for testing modern C++ code before production.",
    "company_tags": [
      "Google",
      "Apple",
      "Meta"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 100
  },
  {
    "id": "int-python-001",
    "topic_id": "topic-python",
    "title": "What does 'Everything is an object' mean in Python?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "In Python, every entity is a first-class object that descends from the universal base type 'object':\n\nWhat This Means in Practice:\n1. Primitives are Objects: Integers, floats, booleans, and strings are full heap-allocated PyObject instances with attributes, methods, and a type pointer (e.g. (5).bit_length() or True.__class__).\n2. Functions & Classes are Objects: Functions, classes, and modules are first-class citizen objects! You can pass functions as arguments, assign them to variables, store them in dictionaries, and inspect their internal attributes (__doc__, __name__, __code__).\n3. CPython Structure: Every object in CPython is backed by a struct PyObject containing an ob_refcnt (reference counter) and an ob_type (pointer to its type object).",
    "bullet_points": [
      "Every entity (primitives, functions, classes, modules) is a first-class object.",
      "Numbers have built-in methods (e.g., (10).to_bytes(2, 'big')).",
      "Every CPython object has ob_refcnt and ob_type header fields."
    ],
    "code_snippet": {
      "language": "python",
      "code": "# Functions as first-class objects:\ndef greet(name):\n    return f\"Hello, {name}\"\n\nfn = greet # Assigned to variable\nprint(fn.__name__) # Inspected attribute\nprint((42).bit_length()) # Primitive invoking method"
    },
    "pro_tip": "Explain: Even the 'type' of an object is itself an object of type 'type', creating an elegant metaclass architecture.",
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
    "title": "What is the difference between '==' and 'is' in Python?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Comparison of Value Equality vs Identity Equality:\n\n1. '==' (Value Equality):\n   - Tests whether the values or contents of two objects are equal.\n   - Invokes the magic method __eq__() (e.g. a == b evaluates to a.__eq__(b)).\n2. 'is' (Identity Equality):\n   - Tests whether two reference variables point to the exact same physical memory address in RAM.\n   - Compares object memory IDs (equivalent to id(a) == id(b)).\n   - Much faster because it only compares raw pointer addresses without calling methods.",
    "bullet_points": [
      "'==' checks value/content equality via __eq__().",
      "'is' checks memory identity (id(a) == id(b)).",
      "Always use 'is' when checking for None (e.g., 'if x is None:')."
    ],
    "code_snippet": {
      "language": "python",
      "code": "a = [1, 2, 3]\nb = [1, 2, 3]\nprint(a == b) # True: Identical contents\nprint(a is b) # False: Two distinct lists allocated in RAM\n\nc = a\nprint(a is c) # True: Both point to the exact same memory address"
    },
    "pro_tip": "Rule from PEP 8: Always use 'is' or 'is not' when comparing against singletons like None, True, or False.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Google",
      "TCS"
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
    "title": "What is Duck Typing and Dynamic Typing in Python?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Python combines Dynamic Typing with Duck Typing:\n\n1. Dynamic Typing:\n   - Variable types are bound dynamically at runtime, not statically declared at compile-time.\n   - A variable is merely a named tag pointing to an object in memory; it can point to an int, then later to a list.\n2. Duck Typing ('If it walks like a duck and quacks like a duck, it is a duck'):\n   - Python does NOT check an object's explicit class inheritance hierarchy.\n   - Instead, it checks whether the object possesses the required methods or behaviors at runtime.\n   - Example: A function reading data does not care if the argument is a File, a StringIO buffer, or a Network socket\u2014as long as it implements a read() method, it works seamlessly!",
    "bullet_points": [
      "Dynamic typing binds types to objects at runtime rather than variable names.",
      "Duck typing verifies capabilities (methods present) rather than inheritance classes.",
      "Emphasizes EAFP: 'Easier to Ask for Forgiveness than Permission'."
    ],
    "code_snippet": {
      "language": "python",
      "code": "class FileLogger:\n    def write(self, msg): print(\"File: \" + msg)\nclass ConsoleLogger:\n    def write(self, msg): print(\"Console: \" + msg)\n\ndef log_data(logger): # Works with ANY object providing a .write() method\n    logger.write(\"System event\")"
    },
    "pro_tip": "Contrast Duck Typing with EAFP (try-except) vs LBYL ('Look Before You Leap', isinstance checks). Python favors EAFP.",
    "company_tags": [
      "Amazon",
      "Google",
      "Infosys"
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
    "title": "What is the difference between Mutable and Immutable types in Python?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Mutability dictates whether an object's in-memory state can be modified after creation:\n\n1. Immutable Types:\n   - int, float, complex, bool, str, tuple, frozenset, bytes.\n   - Once allocated in memory, their contents CANNOT be changed.\n   - Any modifying operation (e.g. s += '!') allocates a brand-new object in memory and updates the reference variable.\n   - Hashable: Immutable objects with immutable members can be used as Dictionary keys and Set elements.\n2. Mutable Types:\n   - list, dict, set, bytearray, user-defined class objects.\n   - Can be modified in-place without changing their memory address (id).\n   - Unhashable: Cannot be used as dictionary keys (raises TypeError: unhashable type).",
    "bullet_points": [
      "Immutable: int, str, tuple, frozenset (cannot modify state in-place).",
      "Mutable: list, dict, set (modified in-place at same memory address).",
      "Only immutable hashable objects can serve as dictionary keys and set members."
    ],
    "code_snippet": {
      "language": "python",
      "code": "# Immutable string: Creates new object in memory\ns = \"hello\"\nprint(id(s))\ns += \" world\"\nprint(id(s)) # Different memory address!\n\n# Mutable list: Mutates in-place\nlst = [1, 2]\nprint(id(lst))\nlst.append(3)\nprint(id(lst)) # Exact same memory address!"
    },
    "pro_tip": "Trap question: 'Is a tuple always hashable?' Answer: No! A tuple containing a mutable list (e.g., (1, [2, 3])) is unhashable and raises TypeError.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "TCS",
      "Cognizant"
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
    "title": "What is the Small Integer Caching trap in CPython ([-5, 256])?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "CPython pre-allocates and caches an array of small integer objects at startup to optimize memory and performance:\n\nMechanics:\n- Range: Integers from -5 to 256 inclusive are cached globally in memory.\n- Any integer assignment within [-5, 256] returns the shared cached singleton PyObject.\n- Integers outside this range (e.g. 257 or -6) allocate distinct heap objects on each creation.\n- Therefore: a = 256; b = 256; a is b evaluates to True.\n- But: a = 257; b = 257; a is b evaluates to False (in interactive REPL)!\n- Note on Compiler Constant Folding: In a script file, Python's peephole optimizer co-locates identical literals in code object co_consts, so 'a is b' for 257 might be True in a script, but False in REPL.",
    "bullet_points": [
      "CPython pre-allocates an integer cache for numbers from -5 to 256.",
      "Integers in this range share memory references, making 'is' return True.",
      "Never use 'is' to compare numbers; always use '==' for value equality."
    ],
    "code_snippet": {
      "language": "python",
      "code": "x = 256; y = 256\nprint(x is y) # True (Both point to cached singleton)\n\nu = 257; v = 257\nprint(u is v) # False in REPL (Two distinct heap allocations!)\nprint(u == v) # True (Value equality)"
    },
    "pro_tip": "Explain that -5 to 256 was chosen because empirical studies of Python code showed these numbers represent over 80% of all integer references.",
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
    "sort_order": 5
  },
  {
    "id": "int-python-006",
    "topic_id": "topic-python",
    "title": "What is String Interning in CPython?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "String Interning is an optimization where CPython ensures that only one copy of distinct string objects is kept in memory:\n\nMechanics:\n1. Automatic Interning: CPython automatically interns compile-time string constants that look like valid Python identifiers (ASCII letters, digits, underscores) up to a certain length.\n2. Manual Interning: Developers can explicitly force interning using sys.intern(s).\n3. Performance Benefit: When strings are interned, comparing them for equality becomes a lightning-fast single CPU pointer comparison (s1 is s2) rather than an O(n) character-by-character scan.\n4. Crucial for Dictionaries: Python interns dictionary keys internally to accelerate hash table lookups.",
    "bullet_points": [
      "CPython deduplicates identifier-like strings in an internal dictionary.",
      "Manual interning available via sys.intern(string).",
      "Enables O(1) pointer comparison instead of O(n) character equality checks."
    ],
    "code_snippet": {
      "language": "python",
      "code": "import sys\na = sys.intern(\"hello dynamic string with spaces!\")\nb = sys.intern(\"hello dynamic string with spaces!\")\nprint(a is b) # True: Guaranteed to share same memory address!"
    },
    "pro_tip": "Mention that interned strings accelerate dictionary key lookups across all Python namespaces and object __dict__ attributes.",
    "company_tags": [
      "Google",
      "Bloomberg",
      "Amazon"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 6
  },
  {
    "id": "int-python-007",
    "topic_id": "topic-python",
    "title": "What does the id() function in Python return?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "id(object) returns the unique identity integer of an object:\n\nKey Attributes:\n1. Lifetime Guarantee: Guaranteed to be unique and constant for this object during its entire lifetime.\n2. In CPython: id() returns the actual physical memory address (pointer) where the PyObject resides in RAM!\n3. Lifetime Recycling Trap: Two objects with non-overlapping lifetimes may share the exact same id() if the first object is garbage collected and the memory is recycled by the allocator.",
    "bullet_points": [
      "id() returns the unique integer identity of an object.",
      "In CPython, it returns the actual memory address in RAM.",
      "id() values can be recycled if an object is garbage collected and its memory reused."
    ],
    "code_snippet": {
      "language": "python",
      "code": "x = [1, 2, 3]\nprint(hex(id(x))) # Prints physical memory address: e.g. 0x7f8a9b2c3d40"
    },
    "pro_tip": "Trap: 'id(list()) == id(list())' evaluates to True because the first list is created, measured, and destroyed immediately, and the second list reuses the freed memory slot!",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Infosys"
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
    "title": "What is the difference between Shallow Copy and Deep Copy in Python? How does the 'copy' module work?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "The copy module handles duplicating compound objects:\n\n1. Shallow Copy (copy.copy(obj) or list.copy() or obj[:]):\n   - Constructs a new compound object.\n   - Inserts references to the objects found in the original.\n   - If the object contains nested mutable objects (e.g. lists within a list), the nested objects are NOT duplicated! Modifying a nested list in the copy mutates the original!\n2. Deep Copy (copy.deepcopy(obj)):\n   - Recursively copies the compound object AND all child objects contained within it.\n   - Traverses the entire object graph and maintains a memo dictionary to handle circular references safely without infinite recursion.\n   - Original and cloned objects share zero mutable references.",
    "bullet_points": [
      "Shallow copy copies the outer container; nested objects are shared by reference.",
      "Deep copy recursively duplicates the container and all nested objects.",
      "deepcopy maintains a memo dictionary to prevent infinite loops on circular references."
    ],
    "code_snippet": {
      "language": "python",
      "code": "import copy\noriginal = [[1, 2], [3, 4]]\nshallow = copy.copy(original)\ndeep = copy.deepcopy(original)\n\noriginal[0][0] = 99\nprint(shallow[0][0]) # 99 (Affected! Shared nested reference)\nprint(deep[0][0])    # 1  (Unaffected! Independent duplicate)"
    },
    "pro_tip": "Always use copy.deepcopy when duplicating configurations or complex nested JSON data structures.",
    "company_tags": [
      "Amazon",
      "Google",
      "Microsoft",
      "TCS"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 8
  },
  {
    "id": "int-python-009",
    "topic_id": "topic-python",
    "title": "What is the difference between __str__ and __repr__ in Python?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Both methods return string representations of an object, but serve different audiences:\n\n1. __repr__() (For Developers):\n   - Goal: Unambiguous and precise.\n   - Should look like valid Python code that could recreate the object (e.g. eval(repr(obj)) == obj).\n   - Invoked by repr(obj) and the interactive REPL console.\n2. __str__() (For End Users):\n   - Goal: Readable and user-friendly.\n   - Formatted for clean logging and human readability.\n   - Invoked by str(obj) and print(obj).\n\nFallback Rule: If __str__ is not defined, Python automatically falls back to __repr__. But if __repr__ is missing, Python does NOT fall back to __str__ (it prints default <object at 0x...>). Always implement __repr__ first!",
    "bullet_points": [
      "__repr__ is for developers: unambiguous, ideally executable code.",
      "__str__ is for end-users: human-readable and clean.",
      "If __str__ is missing, Python falls back to __repr__."
    ],
    "code_snippet": {
      "language": "python",
      "code": "import datetime\nnow = datetime.date(2026, 9, 14)\nprint(str(now))  # '2026-09-14' (Clean format for users)\nprint(repr(now)) # 'datetime.date(2026, 9, 14)' (Unambiguous code for developers)"
    },
    "pro_tip": "Golden Rule: 'Always define __repr__ on all custom classes. Define __str__ only when a distinct human-friendly display is needed.'",
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 9
  },
  {
    "id": "int-python-010",
    "topic_id": "topic-python",
    "title": "What makes an object Hashable in Python? What is the __hash__ contract?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "An object is Hashable if it has a hash value that never changes during its lifetime and can be compared to other objects:\n\nHashable Requirements:\n1. Implements __hash__() returning an integer.\n2. Implements __eq__() for equality comparison.\n3. Equality Contract: If a == b evaluates to True, then hash(a) == hash(b) MUST BE EQUAL!\n\nDefault Behavior:\n- User-defined classes are hashable by default (hash derived from id(), equality by identity).\n- If a class overrides __eq__(), Python automatically sets __hash__ = None, making instances unhashable to prevent breaking the contract!\n- To restore hashability on a class with custom __eq__, you must explicitly implement __hash__.",
    "bullet_points": [
      "Hashable objects require __hash__() and __eq__().",
      "If a == b is True, hash(a) MUST equal hash(b).",
      "Overriding __eq__ sets __hash__ = None by default to preserve contract safety."
    ],
    "code_snippet": {
      "language": "python",
      "code": "class Point:\n    def __init__(self, x, y): self.x, self.y = x, y\n    def __eq__(self, other):\n        return isinstance(other, Point) and (self.x, self.y) == (other.x, other.y)\n    def __hash__(self):\n        return hash((self.x, self.y)) # Hash derived from immutable fields"
    },
    "pro_tip": "Mutable objects (lists, dicts) are deliberately unhashable because mutating an object inside a dict bucket would lose its location!",
    "company_tags": [
      "Amazon",
      "Google",
      "Bloomberg"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 10
  },
  {
    "id": "int-python-011",
    "topic_id": "topic-python",
    "title": "What is the walrus operator (:=) in Python 3.8+?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "The Walrus Operator (:=) is the Assignment Expression operator standardized in PEP 572 (Python 3.8):\n\nMechanics:\n- Allows assigning a value to a variable WITHIN an expression, while simultaneously returning that value.\n\nBenefits:\n- Eliminates redundant function calls in while loops, if statements, and list comprehensions.\n- Avoids repetitive code without having to compute expressions twice.",
    "bullet_points": [
      "Assignment expression operator: assigns values to variables inside expressions.",
      "Eliminates duplicate function evaluations in while loops and if conditions.",
      "Standardized in Python 3.8 (PEP 572)."
    ],
    "code_snippet": {
      "language": "python",
      "code": "# Reading chunks in a while loop cleanly:\nwith open('data.txt') as f:\n    while (chunk := f.read(1024)): # Assigns and checks truthiness in one line!\n        process(chunk)"
    },
    "pro_tip": "Also widely used in list comprehensions to avoid recomputing expensive functions: [y for x in data if (y := expensive(x)) > 0].",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Meta"
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
    "title": "What is the difference between 'del obj' and garbage collecting an object in Python?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "1. 'del obj' Does NOT delete memory directly!\n   - 'del obj' simply deletes the variable binding 'obj' from the current namespace dictionary and DECREMENTS the object's internal reference counter (ob_refcnt) by 1.\n2. When Garbage Collection Actually Occurs:\n   - Memory is only freed when the object's reference counter reaches exactly 0 (or when the cyclic GC detects unreachable islands of isolation).\n   - If other variables, lists, or functions hold references to the object, calling 'del obj' leaves the underlying object alive in memory!",
    "bullet_points": [
      "'del' removes the variable name from scope and decrements reference count.",
      "'del' does not physically deallocate memory directly.",
      "Deallocation occurs only when the reference count reaches zero."
    ],
    "code_snippet": {
      "language": "python",
      "code": "a = [1, 2, 3]\nb = a # Reference count is 2\ndel a # Reference count drops to 1; list is NOT destroyed!\nprint(b) # [1, 2, 3] Still fully alive in RAM"
    },
    "pro_tip": "Cite the CPython __del__ method: An object's __del__ is invoked only when its reference count drops to 0, not necessarily when 'del name' is typed.",
    "company_tags": [
      "Google",
      "Amazon",
      "Apple"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 12
  },
  {
    "id": "int-python-013",
    "topic_id": "topic-python",
    "title": "How does Python's list work internally? What is its Growth Pattern?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "In CPython, a list is implemented as a dynamic array of pointers (PyObject** ob_item):\n\nInternals & Growth Factor:\n1. Dynamic Resizing: Backed by a contiguous array of pointers on the heap.\n2. Over-Allocation (Geometric Growth):\n   - When appending, if size exceeds allocated capacity, CPython over-allocates extra slots.\n   - Growth Formula: new_allocated = (size_t)newsize + (newsize >> 3) + (newsize < 9 ? 3 : 6);\n   - Grows by ~12.5% plus constant offsets (e.g. 0 -> 4 -> 8 -> 16 -> 25 -> 35 -> 46 -> 58...).\n3. Time Complexities:\n   - Index lookup (lst[i]): O(1) random access.\n   - Append (lst.append(x)): Amortized O(1).\n   - Pop from end (lst.pop()): O(1).\n   - Insert/Pop at beginning (lst.insert(0, x)): O(n) (shifts all pointers in memory).",
    "bullet_points": [
      "CPython list is an array of object pointers, not a linked list.",
      "Uses geometric over-allocation (~12.5% expansion) for amortized O(1) appends.",
      "O(1) random index access; O(n) for insertions or deletions at index 0."
    ],
    "code_snippet": {
      "language": "python",
      "code": "import sys\nlst = []\nfor i in range(10):\n    print(f\"Len: {len(lst)}, Allocated Bytes: {sys.getsizeof(lst)}\")\n    lst.append(i)"
    },
    "pro_tip": "When asked: 'What data structure to use for fast O(1) front insertions?' Answer: collections.deque (implemented as a doubly-linked list of 64-element blocks).",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Google",
      "Uber"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 13
  },
  {
    "id": "int-python-014",
    "topic_id": "topic-python",
    "title": "How does Python's Dictionary work internally (Compact Dict in Python 3.6+)?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Python 3.6+ introduced PyPy-inspired Compact Dictionaries, cutting RAM consumption by 20-30% while preserving insertion order:\n\nInternals:\n1. Two Separate Arrays:\n   - Sparse Indices Array (hash table): An array of small integers (e.g. [-1, 0, -1, 1]) indexed by hash.\n   - Dense Entries Array: A contiguous array of entries storing [hash, key_ptr, value_ptr] strictly in insertion order!\n2. Collision Resolution: Uses Open Addressing with Random Probing (perturbation shift): perturb >>= 5; i = (5*i + 1 + perturb) & mask.\n3. Insertion Order Guarantee: Because elements are appended to the dense entries array in arrival order, iterating over a dictionary naturally preserves insertion order (standardized in Python 3.7).",
    "bullet_points": [
      "Uses two arrays: a sparse indices array and a dense entries array.",
      "Reduces memory consumption by 30% compared to legacy Python 3.5 dicts.",
      "Guarantees insertion order preservation out of the box (Python 3.7+)."
    ],
    "code_snippet": {
      "language": "python",
      "code": "# Python 3.7+ dictionaries preserve insertion order by default:\nd = {'z': 1, 'a': 2, 'm': 3}\nprint(list(d.keys())) # Guaranteed: ['z', 'a', 'm']"
    },
    "pro_tip": "Explain that collision resolution in Python dicts uses Open Addressing with pseudo-random perturbation, NOT separate chaining linked lists like Java HashMap.",
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
    "sort_order": 14
  },
  {
    "id": "int-python-015",
    "topic_id": "topic-python",
    "title": "What is the difference between list, tuple, and set in terms of memory and performance?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Comparison across mutability, storage, and search complexity:\n\n1. list: Mutable dynamic array. Larger memory footprint due to over-allocated capacity. O(1) indexed lookup, O(n) search (linear scan).\n2. tuple: Immutable fixed-size array. Tiny memory footprint (exact sizing, zero over-allocation). CPython pools small empty/short tuples for reuse. Cannot be modified in-place.\n3. set: Mutable hash table storing unique keys with dummy values. Consumes the most memory due to hash table sparseness, but provides O(1) average-case membership testing (in operator), vastly outperforming lists on large lookups.",
    "bullet_points": [
      "list: Mutable, dynamic array, O(n) lookup via 'in'.",
      "tuple: Immutable, lowest memory overhead, exact sizing.",
      "set: Hash table, largest memory footprint, O(1) membership testing via 'in'."
    ],
    "code_snippet": {
      "language": "python",
      "code": "import sys\nprint(sys.getsizeof([1, 2, 3])) # ~120 bytes (list with capacity)\nprint(sys.getsizeof((1, 2, 3))) # ~64 bytes (tuple, compact)"
    },
    "pro_tip": "Rule of thumb: Always convert lists to sets (set(lst)) before performing frequent 'x in collection' membership checks.",
    "company_tags": [
      "Amazon",
      "Infosys",
      "TCS"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 15
  },
  {
    "id": "int-python-016",
    "topic_id": "topic-python",
    "title": "What is collections.defaultdict vs standard dict.setdefault()?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Both handle missing dictionary keys gracefully:\n\n1. dict.setdefault(key, default):\n   - Returns the value if key exists; otherwise inserts key with default and returns it.\n   - Trap: Evaluates the default expression eagerly on every call, even if the key is already present! (e.g. d.setdefault(k, []) instantiates a new list object every time).\n2. collections.defaultdict(default_factory):\n   - Takes a callable factory (e.g. list, int, set).\n   - Evaluates the factory lazily ONLY when a missing key is accessed via d[key].\n   - Cleaner, more idiomatic, and faster in loops.",
    "bullet_points": [
      "defaultdict calls factory lazily only when a missing key is accessed.",
      "dict.setdefault evaluates fallback values eagerly on every invocation.",
      "defaultdict is cleaner and faster for grouping and frequency counting."
    ],
    "code_snippet": {
      "language": "python",
      "code": "from collections import defaultdict\n# Grouping words by length cleanly:\nwords_by_len = defaultdict(list)\nfor word in [\"cat\", \"dog\", \"elephant\"]:\n    words_by_len[len(word)].append(word) # No key check needed!"
    },
    "pro_tip": "Notice: Calling d[missing_key] on a defaultdict inserts the key into the dictionary. To inspect without insertion, use 'if key in d:'.",
    "company_tags": [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 16
  },
  {
    "id": "int-python-017",
    "topic_id": "topic-python",
    "title": "What is collections.Counter and its most common methods?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "collections.Counter is a dictionary subclass designed specifically for counting hashable items:\n\nKey Methods:\n1. Counter(iterable): Tallies frequencies of elements automatically in O(n) time.\n2. c.most_common(k): Returns the top-k most frequent elements as (element, count) tuples in O(n log k) time using heap algorithms.\n3. Missing Keys: Accessing a non-existent key returns 0 instead of raising KeyError.\n4. Arithmetic Operations: Supports addition (+), subtraction (-), intersection (&), and union (|).",
    "bullet_points": [
      "Specialized dictionary for counting frequencies of hashable elements in O(n).",
      "most_common(k) retrieves top-k frequent elements via internal heaps.",
      "Missing keys return 0 rather than raising KeyError."
    ],
    "code_snippet": {
      "language": "python",
      "code": "from collections import Counter\ncounts = Counter(\"abracadabra\")\nprint(counts.most_common(2)) # [('a', 5), ('b', 2)]\nprint(counts['z'])            # 0 (no KeyError)"
    },
    "pro_tip": "Crucial utility for LeetCode string and frequency interview questions.",
    "company_tags": [
      "Amazon",
      "Google",
      "Bloomberg"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 17
  },
  {
    "id": "int-python-018",
    "topic_id": "topic-python",
    "title": "What is collections.deque, and why is it preferred over list for Stacks and Queues?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "collections.deque (Double-Ended Queue) is implemented in C as a doubly-linked list of fixed-size 64-element memory blocks:\n\nPerformance Comparison:\n1. Insertion at Left (appendleft / popleft):\n   - deque: O(1) time complexity.\n   - list.insert(0, x) / list.pop(0): O(n) time complexity (shifts all pointers in RAM)!\n2. Append / Pop Right:\n   - Both are O(1).\n3. Thread Safety: deque's append(), appendleft(), pop(), and popleft() are atomic operations protected by GIL in CPython, making it safe for single-item producer-consumer queues without mutex locks.\n4. Maxlen: Supports rolling buffers with fixed maximum capacity (deque(maxlen=N)).",
    "bullet_points": [
      "deque provides O(1) appends and pops from BOTH left and right ends.",
      "list.pop(0) is O(n), making lists terrible for queues.",
      "deque operations are thread-safe and atomic under CPython GIL."
    ],
    "code_snippet": {
      "language": "python",
      "code": "from collections import deque\nq = deque([1, 2, 3])\nq.appendleft(0) # O(1) prepend!\nval = q.popleft() # O(1) dequeue!"
    },
    "pro_tip": "Always use collections.deque when implementing BFS (Breadth-First Search) algorithms.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Google",
      "Uber"
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
    "title": "What is collections.namedtuple vs typing.NamedTuple?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Both create lightweight, immutable tuple-like objects accessible via named field attributes:\n\n1. collections.namedtuple (Python 2.6+):\n   - Factory function: Point = namedtuple('Point', ['x', 'y']).\n   - Generates an immutable class with zero per-instance dict overhead.\n2. typing.NamedTuple (Python 3.6+):\n   - Class-based syntax with type hints and default values.\n   - Cleaner, supports inheritance of methods, and integrates seamlessly with mypy static type checkers.",
    "bullet_points": [
      "Creates lightweight immutable objects with named attribute access.",
      "Exact same memory footprint as regular tuples (no per-instance __dict__).",
      "typing.NamedTuple adds type annotations and clean class-based syntax."
    ],
    "code_snippet": {
      "language": "python",
      "code": "from typing import NamedTuple\nclass Coordinate(NamedTuple):\n    x: float\n    y: float\n    label: str = \"Origin\"\n\npt = Coordinate(1.5, 2.5)\nprint(pt.x, pt[0]) # Accessible via attribute or index"
    },
    "pro_tip": "Compare with dataclass: NamedTuple is immutable and indexable like a tuple; dataclass is mutable by default.",
    "company_tags": [
      "Google",
      "Microsoft",
      "Amazon"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 19
  },
  {
    "id": "int-python-020",
    "topic_id": "topic-python",
    "title": "What are Dataclasses in Python 3.7+ (@dataclass), and how do they differ from regular classes?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Introduced in PEP 557 (Python 3.7), the @dataclass decorator automatically generates boilerplate methods for data-holding classes:\n\nAuto-Generated Methods:\n- __init__(), __repr__(), __eq__(), __hash__(), and comparison operators (__lt__, __gt__).\n\nKey Parameters:\n1. frozen=True: Makes instances immutable (attempts to mutate fields raise FrozenInstanceError) and automatically generates __hash__.\n2. slots=True (Python 3.10+): Generates __slots__, cutting memory consumption by 50% and preventing dynamic attribute assignment.\n3. field(default_factory=...): Required for mutable default arguments like lists or dicts.",
    "bullet_points": [
      "Auto-generates __init__, __repr__, and __eq__ from type annotations.",
      "frozen=True creates immutable hashable records.",
      "slots=True (Python 3.10) cuts memory by eliminating per-instance __dict__."
    ],
    "code_snippet": {
      "language": "python",
      "code": "from dataclasses import dataclass, field\n@dataclass(frozen=True, slots=True)\nclass User:\n    id: int\n    name: str\n    tags: list = field(default_factory=list)"
    },
    "pro_tip": "Always mention slots=True on dataclasses to demonstrate modern performance optimization skills.",
    "company_tags": [
      "Amazon",
      "Google",
      "Netflix"
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
    "title": "What is the time complexity of common operations on Python lists, dicts, and sets?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Time complexity reference for CPython:\n\n1. List:\n   - Append / Pop end: O(1) amortized.\n   - Insert / Delete at index k: O(n) (shifting elements).\n   - Index lookup (lst[i]): O(1).\n   - Search ('x in lst'): O(n) linear scan.\n2. Dictionary:\n   - Get / Set / Delete: O(1) average; O(n) worst case (hash collisions).\n   - Iteration: O(n).\n3. Set:\n   - Add / Remove / Membership ('x in s'): O(1) average; O(n) worst case.\n   - Union / Intersection (s1 & s2): O(min(len(s1), len(s2))).",
    "bullet_points": [
      "List append and pop are O(1); search and front insertion are O(n).",
      "Dict key lookups and insertions are O(1) average.",
      "Set membership testing ('x in s') is O(1) average."
    ],
    "code_snippet": {
      "language": "python",
      "code": "# O(1) membership check using set:\nallowed_ids = {101, 102, 103} # set lookup is O(1) average\nif user_id in allowed_ids:\n    proceed()"
    },
    "pro_tip": "A standard core theory question in software engineering rounds.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 21
  },
  {
    "id": "int-python-022",
    "topic_id": "topic-python",
    "title": "How does the heapq module implement Min-Heaps in Python? How do you implement a Max-Heap?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Python's heapq module implements a binary Min-Heap directly on top of standard Python lists (heapq is not an object class, but a module of functions):\n\nKey Functions:\n1. heapq.heappush(heap, item): Pushes item in O(log n) time.\n2. heapq.heappop(heap): Pops and returns the smallest item in O(log n) time.\n3. heapq.heapify(list): Transforms a list into a valid min-heap in-place in O(n) linear time!\n\nImplementing a Max-Heap:\n- Python does not provide a separate max-heap class.\n- Standard Idiom: Multiply values by -1 when pushing, and multiply by -1 when popping!",
    "bullet_points": [
      "heapq implements binary Min-Heap in-place on lists.",
      "heappush and heappop operate in O(log n); heapify runs in O(n) linear time.",
      "Implement Max-Heap by inverting sign (-val) on push and pop."
    ],
    "code_snippet": {
      "language": "python",
      "code": "import heapq\n# Max-Heap by negating values:\nmax_heap = []\nfor val in [10, 30, 20]:\n    heapq.heappush(max_heap, -val) # Push negative\n\nlargest = -heapq.heappop(max_heap) # Pop and negate back -> 30"
    },
    "pro_tip": "Mention heapq.nlargest(k, iterable) and nsmallest(k, iterable) for finding top-k elements without manual loops.",
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
    "sort_order": 22
  },
  {
    "id": "int-python-023",
    "topic_id": "topic-python",
    "title": "What is the difference between sort() and sorted() in Python?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "1. list.sort():\n   - An in-place method available ONLY on lists.\n   - Modifies the original list directly and returns None.\n   - Does not allocate new list memory (O(1) auxiliary space).\n2. sorted(iterable):\n   - A built-in function that accepts ANY iterable (list, tuple, dict, set, generator).\n   - Leaves the original collection untouched.\n   - Builds and returns a brand-new sorted list.\n\nAlgorithm: Both use Timsort (hybrid of MergeSort and InsertionSort) running in O(n log n) worst-case and O(n) best-case (adaptive on partially sorted data). Stable sort.",
    "bullet_points": [
      "list.sort() sorts in-place and returns None (O(1) space).",
      "sorted() accepts any iterable and returns a new sorted list.",
      "Both use Timsort: O(n log n) worst-case, O(n) best-case, stable."
    ],
    "code_snippet": {
      "language": "python",
      "code": "lst = [3, 1, 2]\nres = sorted(lst) # lst remains [3, 1, 2]; res is [1, 2, 3]\nlst.sort()        # lst modified in-place to [1, 2, 3]"
    },
    "pro_tip": "Always mention Timsort by name: Tim Peters invented it for Python, and it was subsequently adopted by Java and Rust.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 23
  },
  {
    "id": "int-python-024",
    "topic_id": "topic-python",
    "title": "What is the bisect module in Python, and how does it implement Binary Search?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "The bisect module provides bisection algorithms for maintaining sorted lists without re-sorting on insertions:\n\nKey Functions:\n1. bisect_left(arr, x): Locates the insertion point for x in sorted arr to maintain sorted order. If x already exists, returns the index to the left of existing entries (first occurrence).\n2. bisect_right(arr, x) (or bisect()): Returns index to the right of existing entries.\n3. insort_left() / insort_right(): Inserts element x into sorted list maintaining sorted order (O(n) due to list shifting).",
    "bullet_points": [
      "Implements binary search insertion point lookup in O(log n) time.",
      "bisect_left finds first occurrence; bisect_right finds position after duplicates.",
      "Used for grade lookups, range queries, and interval matching."
    ],
    "code_snippet": {
      "language": "python",
      "code": "import bisect\ngrades = [60, 70, 80, 90]\nletters = ['F', 'D', 'C', 'B', 'A']\n# Grade lookup in O(log n):\nscore = 85\nidx = bisect.bisect(grades, score)\nprint(letters[idx]) # 'B'"
    },
    "pro_tip": "Indispensable tool for solving binary search problems in Python technical rounds.",
    "company_tags": [
      "Amazon",
      "Google",
      "Bloomberg"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 24
  },
  {
    "id": "int-python-025",
    "topic_id": "topic-python",
    "title": "What is the Mutable Default Argument trap in Python functions? How do you fix it?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "The Mutable Default Argument bug is the single most notorious trap in Python:\n\nWhy the Bug Occurs:\n- In Python, function definitions are executable statements evaluated ONCE when the module is loaded (at definition time), NOT every time the function is called!\n- The default argument (e.g. items=[]) is created once and stored in the function's internal __defaults__ tuple attribute.\n- Every subsequent invocation of the function that does not supply an argument shares the EXACT SAME list object in memory! Appending to it mutates the shared list across calls.\n\nIdiomatic Solution: Use None as default sentinel value, and initialize inside function body.",
    "bullet_points": [
      "Default arguments are evaluated once at function definition time, not call time.",
      "Mutable defaults ([], {}) are stored in __defaults__ and shared across all calls.",
      "Fix: Default to None and initialize inside the function (if items is None: items = [])."
    ],
    "code_snippet": {
      "language": "python",
      "code": "# DANGEROUS BUG:\ndef append_to(val, items=[]):\n    items.append(val)\n    return items\nprint(append_to(1)) # [1]\nprint(append_to(2)) # [1, 2] Unexpectedly retained state!\n\n# SAFE IDIOMATIC FIX:\ndef append_to_safe(val, items=None):\n    if items is None:\n        items = []\n    items.append(val)\n    return items"
    },
    "pro_tip": "This question is asked in almost every senior Python engineering interview without exception.",
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
    "sort_order": 25
  },
  {
    "id": "int-python-026",
    "topic_id": "topic-python",
    "title": "What is the LEGB Scope Rule in Python?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "When a variable is accessed, Python searches 4 nested scopes in strict sequential order (LEGB):\n\n1. L - Local: Variables declared inside the currently executing function or lambda.\n2. E - Enclosing (Nonlocal): Names in the local scope of any enclosing outer functions (from nearest to furthest in nested closures).\n3. G - Global (Module): Names declared at the top level of the current module file, or marked with 'global'.\n4. B - Built-in: Built-in names pre-loaded into Python (e.g. range, len, print, Exception).\n\nIf the identifier is not found in any of the 4 LEGB scopes, Python raises NameError.",
    "bullet_points": [
      "Resolution order: Local -> Enclosing -> Global -> Built-in.",
      "Searches outward from innermost scope to global module, ending at built-ins.",
      "Raises NameError if variable is not resolved across all 4 scopes."
    ],
    "code_snippet": {
      "language": "python",
      "code": "x = \"Global\" # G\ndef outer():\n    x = \"Enclosing\" # E\n    def inner():\n        x = \"Local\" # L\n        print(x) # Resolves to Local\n    inner()"
    },
    "pro_tip": "Remember: Rebinding a global or enclosing variable inside a local function requires explicit 'global' or 'nonlocal' keywords.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 26
  },
  {
    "id": "int-python-027",
    "topic_id": "topic-python",
    "title": "What is the difference between 'global' and 'nonlocal' keywords in Python?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Both allow modifying variables residing outside the current local function scope:\n\n1. 'global':\n   - Binds the identifier to the module-level Global scope.\n   - Instructs the compiler to rebind or create a variable in the module's global namespace, bypassing local and enclosing scopes.\n2. 'nonlocal' (Python 3+):\n   - Binds the identifier to the nearest Enclosing function scope (excluding global).\n   - Mandatory for modifying outer variables within nested closures without polluting the global namespace.\n   - Raises SyntaxError if no matching variable is found in enclosing scopes.",
    "bullet_points": [
      "'global' rebinds variables in the top-level module global scope.",
      "'nonlocal' rebinds variables in the nearest enclosing function scope (closures).",
      "'nonlocal' cannot bind to global scope."
    ],
    "code_snippet": {
      "language": "python",
      "code": "def make_counter():\n    count = 0 # Enclosing scope\n    def increment():\n        nonlocal count # Rebinds enclosing variable\n        count += 1\n        return count\n    return increment"
    },
    "pro_tip": "Without 'nonlocal', writing 'count += 1' raises UnboundLocalError because Python treats assignments as local declarations by default.",
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft"
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
    "title": "What are Closures in Python, and how does Late-Binding in Loops cause bugs?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "A Closure is a nested function that retains access to variables from its enclosing lexical scope even after the outer function has completed execution:\n\nLate-Binding in Loops Trap:\n- Functions in Python bind variables by LOOKUP, not by value at definition time!\n- In: funcs = [lambda: i for i in range(3)]\n- The lambdas do not save the value of 'i' at each loop iteration. Instead, they store a reference to the single variable 'i'.\n- When the lambdas are called later, the loop has completed, and 'i' equals 2. Calling all 3 lambdas returns 2, 2, 2!\n\nSolution: Use Default Argument Binding: [lambda i=i: i for i in range(3)] binds 'i' by value at definition time.",
    "bullet_points": [
      "Closure: Inner function retaining access to enclosing scope variables.",
      "Late-binding: Closures look up variable values when CALLED, not when defined.",
      "Fix loop closures by binding as default argument: lambda i=i: i."
    ],
    "code_snippet": {
      "language": "python",
      "code": "# Late-binding bug:\nfuncs = [lambda: i for i in range(3)]\nprint([f() for f in funcs]) # [2, 2, 2] Bug!\n\n# Solution via default argument binding:\nfuncs_fixed = [lambda i=i: i for i in range(3)]\nprint([f() for f in funcs_fixed]) # [0, 1, 2] Correct!"
    },
    "pro_tip": "One of the top 5 most frequently asked Python screening questions across tech companies.",
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Uber"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 28
  },
  {
    "id": "int-python-029",
    "topic_id": "topic-python",
    "title": "What is the difference between *args and **kwargs in Python function definitions?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Used to create flexible functions accepting variable numbers of arguments:\n\n1. *args (Positional Arguments Tuple):\n   - Collects arbitrary positional arguments into a single immutable Tuple.\n   - Syntax parameter name can be anything (e.g. *values), but *args is standard PEP 8 convention.\n2. **kwargs (Keyword Arguments Dictionary):\n   - Collects arbitrary keyword arguments (named parameters) into a standard Dictionary.\n\nArgument Unpacking:\n- Calling func(*lst) unpacks list elements into positional arguments.\n- Calling func(**dict) unpacks dictionary key-value pairs into keyword arguments.",
    "bullet_points": [
      "*args collects arbitrary positional arguments into a tuple.",
      "**kwargs collects arbitrary keyword arguments into a dictionary.",
      "* and ** can also be used at call sites to unpack iterables and dictionaries."
    ],
    "code_snippet": {
      "language": "python",
      "code": "def print_everything(*args, **kwargs):\n    print(\"Positional:\", args)   # Tuple\n    print(\"Keyword:\", kwargs)    # Dict\n\nprint_everything(1, 2, name=\"Alice\")"
    },
    "pro_tip": "Order of parameters in function definitions must strictly be: positional -> *args -> keyword-only -> **kwargs.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 29
  },
  {
    "id": "int-python-030",
    "topic_id": "topic-python",
    "title": "What are Positional-Only and Keyword-Only parameters in Python 3.8+ (/ and *)?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Python 3.8 standardized explicit parameter syntax using '/' and '*':\n\n1. Positional-Only Parameters (/):\n   - Any parameters before the slash (/) MUST be passed positionally. Callers cannot pass them by name (e.g. func(x=1) raises TypeError).\n   - Allows library authors to change parameter names in future releases without breaking caller code.\n2. Keyword-Only Parameters (*):\n   - Any parameters after an asterisk (*) MUST be passed as named keyword arguments.\n   - Prevents bugs where callers pass booleans or configuration flags positionally without clarity.",
    "bullet_points": [
      "/ marks all preceding parameters as Positional-Only.",
      "* marks all subsequent parameters as Keyword-Only.",
      "Enforces clean, explicit API design."
    ],
    "code_snippet": {
      "language": "python",
      "code": "# x is positional-only, y is standard, z is keyword-only:\ndef configure(x, /, y, *, z):\n    pass\n\nconfigure(1, 2, z=3)      # Valid\n# configure(x=1, 2, z=3)  # TypeError: x is positional-only!\n# configure(1, 2, 3)      # TypeError: z is keyword-only!"
    },
    "pro_tip": "Standard library built-ins (like len() or pow()) use positional-only arguments.",
    "company_tags": [
      "Amazon",
      "Google",
      "Microsoft"
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
    "title": "What is the difference between __init__ and __new__ in Python?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Object creation in Python is split into two distinct steps:\n\n1. __new__(cls, *args, **kwargs) (Constructor / Allocator):\n   - A static method (takes 'cls' as first argument) responsible for physically creating and returning a new instance of the class.\n   - Invoked BEFORE __init__.\n   - Must return an instance of 'cls' (or a subclass) for Python to subsequently invoke __init__.\n   - Use Cases: Subclassing immutable types (like int, str, tuple), implementing the Singleton Pattern, and custom Metaclass factory logic.\n2. __init__(self, *args, **kwargs) (Initializer):\n   - An instance method (takes 'self' as first argument) responsible for initializing member attributes on the newly created instance.\n   - Returns None (returning a value from __init__ raises TypeError).",
    "bullet_points": [
      "__new__ creates and returns the object instance (takes 'cls').",
      "__init__ initializes object attributes (takes 'self').",
      "__new__ is used to build Singletons and subclass immutable types (tuple, int)."
    ],
    "code_snippet": {
      "language": "python",
      "code": "# Implementing Singleton via __new__:\nclass Singleton:\n    _instance = None\n    def __new__(cls, *args, **kwargs):\n        if cls._instance is None:\n            cls._instance = super().__new__(cls)\n        return cls._instance"
    },
    "pro_tip": "A legendary interview question. Remember: If __new__ returns an object that is NOT an instance of cls, __init__ is skipped completely!",
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
    "sort_order": 31
  },
  {
    "id": "int-python-032",
    "topic_id": "topic-python",
    "title": "What is the difference between Instance Methods, Class Methods (@classmethod), and Static Methods (@staticmethod)?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Comparison of binding and implicit first arguments:\n\n1. Instance Method (def func(self, ...)):\n   - Implicit 1st Argument: Receives 'self' (the specific instance).\n   - Can access and modify instance state (self.x) and class state (self.__class__).\n2. Class Method (@classmethod def func(cls, ...)):\n   - Implicit 1st Argument: Receives 'cls' (the class itself, not an instance).\n   - Can access and modify class-level state.\n   - Primary Use Case: Alternative factory constructors (e.g. User.from_json(str) or Date.from_timestamp(ts)).\n3. Static Method (@staticmethod def func(...)):\n   - Receives NO implicit first argument (neither self nor cls).\n   - Behaves like a plain regular function namespaced inside the class.\n   - Cannot modify instance or class state directly. Used for self-contained utility functions.",
    "bullet_points": [
      "Instance method takes 'self'; accesses instance attributes.",
      "@classmethod takes 'cls'; used for alternative factory constructors.",
      "@staticmethod takes no implicit argument; pure utility function."
    ],
    "code_snippet": {
      "language": "python",
      "code": "class Date:\n    def __init__(self, year, month, day): self.year = year\n    @classmethod\n    def from_string(cls, date_str): # Factory constructor\n        y, m, d = map(int, date_str.split('-'))\n        return cls(y, m, d)\n    @staticmethod\n    def is_valid_year(year): return year > 0"
    },
    "pro_tip": "Highlight factory constructors: @classmethod is the standard Pythonic alternative to overloaded constructors in Java/C++.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Amazon",
      "Microsoft"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 32
  },
  {
    "id": "int-python-033",
    "topic_id": "topic-python",
    "title": "What is the Method Resolution Order (MRO) in Python? How does C3 Linearization work?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Method Resolution Order (MRO) defines the exact hierarchical order in which Python searches classes for attributes and methods in Multiple Inheritance:\n\nAlgorithm: C3 Linearization (standardized in Python 2.3):\n- Enforces 3 fundamental properties:\n  1. Children precede parents: Subclasses are checked before superclasses.\n  2. Monotonicity: Preserves the local precedence order declared in class definition (class D(B, C) checks B before C).\n  3. Consistency: Superclass resolution order is preserved across all descendants without conflicts.\n\nInspecting MRO: Inspect ClassName.__mro__ or ClassName.mro().\n- If an inheritance hierarchy violates C3 linearization (e.g. circular diamond conflict), Python refuses to create the class at definition time and throws TypeError: Cannot create a consistent method resolution order (MRO)!",
    "bullet_points": [
      "MRO determines the search path for methods in multiple inheritance.",
      "Calculated using the C3 Linearization algorithm.",
      "Inspect via ClassName.__mro__; invalid hierarchies raise TypeError at definition time."
    ],
    "code_snippet": {
      "language": "python",
      "code": "class A: pass\nclass B(A): pass\nclass C(A): pass\nclass D(B, C): pass\n\nprint(D.__mro__) # (D, B, C, A, object)"
    },
    "pro_tip": "Explain super(): Calling super().method() does NOT call the direct parent; it calls the NEXT class in the MRO chain!",
    "company_tags": [
      "Google",
      "Amazon",
      "Meta",
      "Bloomberg"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 33
  },
  {
    "id": "int-python-034",
    "topic_id": "topic-python",
    "title": "How does super() work in Python multiple inheritance, and why is it cooperative?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "In Python, super() is NOT a reference to the direct parent class! It delegates to the NEXT class in the object's dynamic Method Resolution Order (MRO):\n\nCooperative Multiple Inheritance:\n- In a diamond inheritance hierarchy (D inherits from B and C, which both inherit from A):\n- When D calls super().__init__(), it calls B.__init__().\n- If B ALSO calls super().__init__(), it does NOT call A; it calls C.__init__()!\n- Only when C calls super().__init__() does it call A.__init__().\n- Cooperative Guarantee: Every class in the hierarchy gets initialized exactly ONCE in a deterministic linear sequence without duplicating constructor calls.",
    "bullet_points": [
      "super() delegates to the next class in the runtime MRO, not just the parent.",
      "Guarantees every class in a diamond hierarchy is executed exactly once.",
      "Requires all classes in the hierarchy to use super() cooperatively."
    ],
    "code_snippet": {
      "language": "python",
      "code": "class A: def test(self): print(\"A\")\nclass B(A): def test(self): print(\"B\"); super().test()\nclass C(A): def test(self): print(\"C\"); super().test()\nclass D(B, C): def test(self): print(\"D\"); super().test()\n\nD().test() # Prints: D -> B -> C -> A (Follows MRO!)"
    },
    "pro_tip": "Demonstrating cooperative MRO execution is a hallmark of senior Python architects.",
    "company_tags": [
      "Google",
      "Apple",
      "Uber"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 34
  },
  {
    "id": "int-python-035",
    "topic_id": "topic-python",
    "title": "What is the @property decorator in Python, and how does it implement Encapsulation?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "The @property decorator allows defining getter, setter, and deleter methods that are accessed using natural dot-notation attribute syntax:\n\nKey Advantages:\n1. Pythonic Encapsulation: Start with simple public attributes (obj.x). If validation, lazy computation, or access logging is needed later, convert it to a @property without breaking external client code!\n2. Validation: The @prop.setter method intercepts assignments to validate values before setting them.\n3. Read-Only Properties: Defining only a getter (without @prop.setter) makes the attribute read-only (attempting assignment raises AttributeError).",
    "bullet_points": [
      "Allows methods to be accessed as natural attributes (obj.temp instead of obj.get_temp()).",
      "Enables adding validation logic without breaking existing client APIs.",
      "Omitting the setter creates read-only computed properties."
    ],
    "code_snippet": {
      "language": "python",
      "code": "class Celsius:\n    def __init__(self, temp=0):\n        self._temp = temp\n    @property\n    def temp(self): return self._temp\n    @temp.setter\n    def temp(self, val):\n        if val < -273.15: raise ValueError(\"Below absolute zero!\")\n        self._temp = val"
    },
    "pro_tip": "Emphasize: Do not write Java-style get_x() and set_x() in Python; use @property.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "TCS"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 35
  },
  {
    "id": "int-python-036",
    "topic_id": "topic-python",
    "title": "What are Name Mangling and Private Attributes (__var) in Python?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Python has no true access specifiers (no public, private, protected keywords). Instead, it uses naming conventions and Name Mangling:\n\n1. Single Underscore (_var):\n   - A non-enforced convention indicating 'internal / protected' use.\n   - Ignored by 'from module import *'.\n2. Double Leading Underscore (__var):\n   - Name Mangling: The Python interpreter automatically transforms the identifier into _ClassName__var in the class's bytecode.\n   - Purpose: To prevent accidental attribute name collisions in subclasses (avoiding overriding internal base state).\n   - NOT True Security: The attribute is still accessible from outside via obj._ClassName__var.\n   - Python Philosophy: 'We are all consenting adults here.'",
    "bullet_points": [
      "Single underscore (_var) is a convention for internal implementation details.",
      "Double underscore (__var) triggers Name Mangling: rewritten to _ClassName__var.",
      "Prevents subclass attribute collisions; does not provide true private security."
    ],
    "code_snippet": {
      "language": "python",
      "code": "class BankAccount:\n    def __init__(self):\n        self.__balance = 1000 # Name mangled\n\nacc = BankAccount()\n# print(acc.__balance)       # AttributeError!\nprint(acc._BankAccount__balance) # 1000 (Mangled name access)"
    },
    "pro_tip": "Always state the Guido van Rossum quote: 'We are all consenting adults here'\u2014Python trusts developers not to access private members.",
    "company_tags": [
      "Amazon",
      "Google",
      "Infosys"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 36
  },
  {
    "id": "int-python-037",
    "topic_id": "topic-python",
    "title": "What are __slots__ in Python classes, and how do they reduce memory usage by 50%?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "By default, every Python class instance maintains an internal dictionary (__dict__) to dynamically store instance attributes:\n\nWhy __dict__ is Heavy:\n- A dictionary has memory overhead (hash table, pointer arrays) consuming ~150-200 bytes per instance, even for tiny classes.\n\n__slots__ Optimization:\n- Defining __slots__ = ('x', 'y') explicitly reserves a fixed, compact array of pointer slots directly in the CPyObject struct.\n- Completely ELIMINATES the per-instance __dict__ and __weakref__!\n- Memory Reduction: Drops per-instance RAM usage by 50-70%, allowing programs to instantiate millions of objects effortlessly.\n- Speed Bonus: Accessing slotted attributes is ~20% faster than dict lookups.\n- Constraint: Instances cannot have arbitrary new dynamic attributes assigned at runtime.",
    "bullet_points": [
      "__slots__ eliminates the per-instance __dict__, allocating a compact fixed-size array.",
      "Reduces memory consumption by 50-70% when creating millions of objects.",
      "Prevents dynamic assignment of attributes not declared in __slots__."
    ],
    "code_snippet": {
      "language": "python",
      "code": "class SlottedPoint:\n    __slots__ = ('x', 'y') # Only allows x and y\n    def __init__(self, x, y): self.x, self.y = x, y\n\npt = SlottedPoint(1, 2)\n# pt.z = 3 # AttributeError: 'SlottedPoint' object has no attribute 'z'"
    },
    "pro_tip": "Crucial for high-scale data processing, ORMs, and game state entities.",
    "company_tags": [
      "Amazon",
      "Google",
      "Bloomberg",
      "Meta"
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
    "title": "What are Abstract Base Classes (ABCs) in Python, and how does the 'abc' module work?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Python's abc module implements formal Abstract Base Classes (similar to interfaces in Java):\n\nKey Mechanics:\n1. Metaclass ABCMeta (or inheriting from abc.ABC):\n   - Marks the class as an abstract base class.\n2. @abstractmethod Decorator:\n   - Declares abstract methods that MUST be overridden by concrete subclasses.\n   - Prevents instantiation of any class with unimplemented abstract methods (raises TypeError: Can't instantiate abstract class with abstract methods).\n3. Virtual Subclasses (abc.register): Allows a class to register as an implementation of an ABC without direct inheritance (satisfying isinstance checks via duck typing).",
    "bullet_points": [
      "abc.ABC defines formal interfaces with @abstractmethod.",
      "Subclasses must implement all abstract methods before instantiation is permitted.",
      "Enforces structural API contracts across large engineering codebases."
    ],
    "code_snippet": {
      "language": "python",
      "code": "from abc import ABC, abstractmethod\nclass Repository(ABC):\n    @abstractmethod\n    def save(self, entity): pass\n\nclass SqlRepo(Repository):\n    def save(self, entity): print(\"Saved to SQL\")\n\n# r = Repository() # TypeError: Can't instantiate abstract class"
    },
    "pro_tip": "Mention that ABCs bridge Duck Typing with formal type safety (isinstance checks).",
    "company_tags": [
      "Google",
      "Microsoft",
      "Amazon"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 38
  },
  {
    "id": "int-python-039",
    "topic_id": "topic-python",
    "title": "What are Metaclasses in Python, and what is the relationship between 'type' and 'object'?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "A Metaclass is a 'class of a class'\u2014the blueprint that defines how classes themselves are constructed:\n\nCore Principles:\n1. Classes are Objects: Just as an instance is an object created from a class, a class is an object created from a Metaclass!\n2. Default Metaclass is 'type': By default, all Python classes are instances of the built-in metaclass 'type'.\n   - Calling type(name, bases, dict) dynamically generates and returns a brand-new Class object at runtime!\n3. Custom Metaclasses (class Meta(type)):\n   - Override __new__ or __init__ to intercept, validate, or modify class definitions before they are created.\n   - Used by Django ORM (mapping class fields to database columns), Pydantic, and API schema validators.",
    "bullet_points": [
      "Metaclass is the class of a class (defines how classes are constructed).",
      "The default metaclass for all classes is built-in 'type'.",
      "Used by frameworks (Django ORM, Pydantic) to validate schemas and inject methods."
    ],
    "code_snippet": {
      "language": "python",
      "code": "# Custom Metaclass enforcing uppercase method names:\nclass EnforceUpperMeta(type):\n    def __new__(cls, name, bases, dct):\n        for attr, val in dct.items():\n            if callable(val) and not attr.startswith('__') and not attr.isupper():\n                raise TypeError(f\"Method '{attr}' must be UPPERCASE!\")\n        return super().__new__(cls, name, bases, dct)"
    },
    "pro_tip": "Explain: 'object is an instance of type, and type is a subclass of object.' This is Python's famous circular bootstrapping architecture!",
    "company_tags": [
      "Google",
      "Meta",
      "Microsoft"
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
    "title": "What is the __call__ magic method in Python?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "The __call__ method allows an instance of a class to be called directly as if it were a regular function (obj(*args, **kwargs)):\n\nBenefits:\n1. Stateful Callables: Functions in Python cannot maintain persistent encapsulated state cleanly without closures or global variables. A callable class instance bundles persistent state with function invocation syntax.\n2. Class-Based Decorators: Classes implementing __call__ can act as clean, structured decorators with initialization parameters.\n3. callable(obj): Returns True for any object implementing __call__.",
    "bullet_points": [
      "__call__ allows class instances to be invoked like functions (obj()).",
      "Combines persistent object state with function call syntax.",
      "Powers class-based decorators and strategy pattern implementations."
    ],
    "code_snippet": {
      "language": "python",
      "code": "class Multiplier:\n    def __init__(self, factor):\n        self.factor = factor\n    def __call__(self, x):\n        return x * self.factor\n\ndouble = Multiplier(2)\nprint(double(5)) # 10 (Invokes __call__)"
    },
    "pro_tip": "Standard pattern used in PyTorch neural network layers (torch.nn.Module implements __call__).",
    "company_tags": [
      "Amazon",
      "Apple",
      "OpenAI"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 40
  },
  {
    "id": "int-python-041",
    "topic_id": "topic-python",
    "title": "How does Garbage Collection work in Python (Reference Counting + Generational Cyclic GC)?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "CPython manages memory through a dual-mechanism architecture:\n\n1. Primary Mechanism: Reference Counting (Deterministic, Instant):\n   - Every PyObject contains an internal ob_refcnt counter.\n   - Incremented when referenced; decremented when variable leaves scope or 'del' is used.\n   - The instant ob_refcnt reaches 0, the object's memory is deallocated immediately.\n   - Handles 90% of memory reclamation with zero latency.\n2. Secondary Mechanism: Generational Cyclic GC (Handles Circular References):\n   - Reference counting fails on circular references (A points to B, B points to A; counts never hit 0).\n   - CPython runs a generational tracing GC (gc module) dividing container objects into 3 generations (Gen 0, 1, 2).\n   - Periodically detects unreachable islands of isolation using a double-pointer traversal algorithm and frees them.",
    "bullet_points": [
      "Reference Counting reclaims memory instantly when reference count hits 0.",
      "Cyclic Garbage Collector detects and frees circular reference islands.",
      "Uses 3 generations (Gen 0, 1, 2) based on survival thresholds."
    ],
    "code_snippet": {
      "language": "python",
      "code": "import sys\na = []\nprint(sys.getrefcount(a)) # 2 (Variable 'a' + getrefcount parameter copy)\nb = a\nprint(sys.getrefcount(a)) # 3"
    },
    "pro_tip": "Explain: sys.getrefcount() always returns 1 higher than expected because passing the object to getrefcount() creates a temporary reference on its stack frame!",
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
    "sort_order": 41
  },
  {
    "id": "int-python-042",
    "topic_id": "topic-python",
    "title": "How does CPython's Generational Garbage Collector work (Generations 0, 1, and 2)?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "The Cyclic GC categorizes container objects (lists, dicts, tuples, custom classes) into 3 generations based on the Weak Generational Hypothesis:\n\nGenerations:\n- Gen 0 (Youngest): Newly allocated container objects. Collected very frequently.\n- Gen 1: Objects that survived at least one collection cycle in Gen 0.\n- Gen 2 (Oldest): Long-lived objects that survived Gen 1 collections. Collected least frequently.\n\nCollection Thresholds (gc.get_threshold()):\n- Default thresholds: (700, 10, 10).\n- When net allocations in Gen 0 exceed 700, a Gen 0 collection triggers.\n- When Gen 0 has been collected 10 times, a Gen 1 collection triggers.\n- When Gen 1 has been collected 10 times, a full Gen 2 collection triggers.",
    "bullet_points": [
      "Weak Generational Hypothesis: Most objects die young.",
      "3 Generations: Gen 0 (frequent), Gen 1 (intermediate), Gen 2 (rare).",
      "Thresholds configured via gc.set_threshold()."
    ],
    "code_snippet": {
      "language": "python",
      "code": "import gc\nprint(gc.get_threshold()) # (700, 10, 10)\ngc.collect() # Forces a manual full generational collection cycle"
    },
    "pro_tip": "In high-throughput microservices (e.g. Instagram/Meta), tuning or temporarily disabling the cyclic GC during web request lifecycles yielded massive throughput improvements.",
    "company_tags": [
      "Meta/Instagram",
      "Google",
      "Amazon"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 42
  },
  {
    "id": "int-python-043",
    "topic_id": "topic-python",
    "title": "How does CPython solve Circular References? Explain the reachability algorithm.",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "The Cyclic GC uses a pointer reachability algorithm to detect circular reference islands without touching global references:\n\nStep-by-step Algorithm:\n1. Collects candidate container objects in a doubly-linked list.\n2. Copies each candidate's ob_refcnt into a temporary gc_refs field.\n3. Traverses the internal pointers of each container object (using tp_traverse in C). For every referenced object in the candidate pool, it DECREMENTS that object's gc_refs counter by 1.\n4. Result: Any references originating from WITHIN the candidate group are canceled out!\n5. If an object still has gc_refs > 0, it must have an external reference from outside the candidate pool (reachable). It and all objects reachable from it are marked as live.\n6. Any remaining objects with gc_refs == 0 are an isolated circular island and are deallocated!",
    "bullet_points": [
      "Copies reference counts into temporary gc_refs fields.",
      "Decrements gc_refs for all internal references between candidate objects.",
      "Objects with gc_refs == 0 have zero external references and are collected."
    ],
    "code_snippet": {
      "language": "python",
      "code": "class Node:\n    def __init__(self): self.peer = None\n\na = Node(); b = Node()\na.peer = b; b.peer = a # Circular reference\ndel a; del b # Ref counts are 1; Cyclic GC detects and clears island"
    },
    "pro_tip": "An iconic CPython internals question. Explaining the gc_refs subtraction mechanism proves deep engine mastery.",
    "company_tags": [
      "Google",
      "Apple",
      "Meta",
      "Bloomberg"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 43
  },
  {
    "id": "int-python-044",
    "topic_id": "topic-python",
    "title": "What is PyMalloc in CPython, and how does it organize memory into Arenas, Pools, and Blocks?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "PyMalloc is CPython's specialized small-object memory allocator optimized for objects <= 512 bytes:\n\nWhy It Exists: Python constantly allocates and destroys tiny objects (ints, strings, tuples). Relying on the OS system malloc() causes severe heap fragmentation and heavy lock contention.\n\n3-Tier Architecture:\n1. Arenas (256 KB): Allocated from the OS using system malloc(). Aligned to 256KB boundaries.\n2. Pools (4 KB): Each Arena is carved into 64 Pools matching the OS virtual memory page size (4KB). Each pool is dedicated to a single size class (e.g. 16 bytes, 32 bytes... up to 512 bytes).\n3. Blocks: Each Pool is divided into fixed-size Blocks. Allocating and freeing a block is O(1) in a few CPU instructions via singly-linked free-lists.",
    "bullet_points": [
      "PyMalloc manages objects <= 512 bytes to prevent OS heap fragmentation.",
      "3 Tiers: Arenas (256KB) -> Pools (4KB) -> Blocks (size classes).",
      "Large allocations (> 512 bytes) fall back to the standard OS malloc()."
    ],
    "code_snippet": {
      "language": "python",
      "code": "# PyMalloc runs automatically under the hood for all small Python objects\n# Inspect memory consumption:\nimport sys\nprint(sys.getsizeof(1)) # 28 bytes (Managed by PyMalloc)"
    },
    "pro_tip": "Explain: Because PyMalloc arenas are rarely completely empty, memory freed inside Python is often retained by PyMalloc pools rather than returned to the OS kernel immediately.",
    "company_tags": [
      "Google",
      "Dropbox",
      "Meta"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 44
  },
  {
    "id": "int-python-045",
    "topic_id": "topic-python",
    "title": "Why does Python not release memory back to the Operating System immediately after deleting objects?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "When large objects are deleted, process memory reported by the OS (RSS in top/htop) often does not decrease:\n\nReasons:\n1. PyMalloc Arena Retention: Memory is managed in 256KB Arenas. An Arena can only be freed back to the OS via free() if EVERY SINGLE 4KB pool and block inside that arena is completely empty. If even one tiny 16-byte object remains alive in the arena, the entire 256KB arena must be retained in RAM!\n2. C Library Fragmentation: The underlying glibc malloc heap allocator rarely releases memory from the middle of the heap back to the OS; it can only adjust the top heap break pointer (sbrk).\n3. Recycling: Python retains this allocated memory pool to serve future object allocations instantly without slow OS system calls.",
    "bullet_points": [
      "Arenas can only be released to OS if 100% of their blocks are empty.",
      "A single surviving object pins the entire 256KB arena in process RAM.",
      "Retained memory is reused internally for future allocations."
    ],
    "code_snippet": {
      "language": "python",
      "code": "# Force cyclic GC and suggest OS release (Linux only):\nimport gc, ctypes\ngc.collect()\n# libc = ctypes.CDLL(\"libc.so.6\")\n# libc.malloc_trim(0) # Advises glibc to release free heap to OS"
    },
    "pro_tip": "In containerized microservices (Docker), explain: Use multiple smaller processes or malloc_trim to avoid OOM kills.",
    "company_tags": [
      "Amazon",
      "Meta",
      "Google"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 45
  },
  {
    "id": "int-python-046",
    "topic_id": "topic-python",
    "title": "What is the weakref module in Python, and when should you use Weak References?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "The weakref module allows creating references to objects without incrementing their reference count:\n\nUse Cases:\n1. Breaking Circular References: Circular links between parent and child objects can use weakref.ref or weakref.proxy to avoid memory leaks.\n2. Caching Large Objects (weakref.WeakValueDictionary):\n   - When an object in the cache has no other strong references elsewhere in the application, it is automatically removed and collected by GC immediately!\n   - Prevents caches from holding stale objects in memory forever.\n\nLimitation: Primitives (int, str, tuple) do not support weak references.",
    "bullet_points": [
      "weakref references objects without incrementing reference count.",
      "Enables objects to be garbage collected while still observed.",
      "WeakValueDictionary auto-evicts entries when values are deleted elsewhere."
    ],
    "code_snippet": {
      "language": "python",
      "code": "import weakref\nclass Heavy:\n    pass\nh = Heavy()\ncache = weakref.WeakValueDictionary()\ncache['key'] = h\nprint('key' in cache) # True\n\ndel h # Only strong reference destroyed\nprint('key' in cache) # False (Auto-evicted from cache!)"
    },
    "pro_tip": "Ideal for building memory-sensitive image caches and graph parent pointers.",
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 46
  },
  {
    "id": "int-python-047",
    "topic_id": "topic-python",
    "title": "What are Python Bytecode (.pyc files) and the Python Virtual Machine (PVM)?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "How Python executes source code under the hood:\n\nExecution Pipeline:\n1. Parsing: Python parses .py source text into an Abstract Syntax Tree (AST).\n2. Bytecode Compilation: Compiles the AST into platform-independent intermediate Bytecode instructions (stored in __pycache__/*.pyc files).\n3. PVM Execution: The Python Virtual Machine (a stack-based virtual machine written in C) executes the bytecode instructions in a loop (ceval.c).\n\nWhy .pyc Files Exist: If the source .py file has not been modified since the last run, Python skips parsing and compilation, loading the cached .pyc bytecode directly for vastly faster startup times.",
    "bullet_points": [
      "Python source compiles to intermediate bytecode instructions (.pyc).",
      "The Python Virtual Machine (PVM) is a stack-based interpreter executing bytecode.",
      "__pycache__ saves compiled bytecode to accelerate application startup."
    ],
    "code_snippet": {
      "language": "python",
      "code": "import dis\ndef add(a, b): return a + b\n# Disassemble bytecode instructions:\ndis.dis(add)"
    },
    "pro_tip": "Using the 'dis' module to inspect bytecode on a whiteboard shows deep Python internals understanding.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "TCS"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 47
  },
  {
    "id": "int-python-048",
    "topic_id": "topic-python",
    "title": "What is the __pycache__ directory, and can Python run without it?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "1. Role of __pycache__:\n   - Stores pre-compiled bytecode files (.pyc) tagged with the Python version (e.g. module.cpython-311.pyc).\n   - Created automatically when a module is imported.\n2. Running Without __pycache__:\n   - Yes, Python can run completely without generating .pyc files!\n   - Set the environment variable PYTHONDONTWRITEBYTECODE=1 or pass the -B flag to the interpreter: python -B script.py.\n   - Widely used in Docker containers and CI/CD pipelines to keep file systems clean and reduce image size.",
    "bullet_points": [
      "Caches compiled bytecode per Python version to accelerate imports.",
      "Disable via PYTHONDONTWRITEBYTECODE=1 or python -B.",
      "Standard practice in serverless functions and ephemeral Docker containers."
    ],
    "code_snippet": {
      "language": "bash",
      "code": "# Disable bytecode caching:\nexport PYTHONDONTWRITEBYTECODE=1\npython -B app.py"
    },
    "pro_tip": "A practical DevOps and production engineering question.",
    "company_tags": [
      "Amazon",
      "Netflix",
      "Google"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 48
  },
  {
    "id": "int-python-049",
    "topic_id": "topic-python",
    "title": "What is Monkey Patching in Python, and what are its risks?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Monkey Patching is the technique of dynamically modifying or replacing classes, methods, or modules at runtime without altering the original source code:\n\nHow It Works: Because classes and modules are mutable objects, you can reassign their attribute functions at runtime (e.g. MyClass.func = custom_func).\n\nValid Use Cases:\n- Unit testing and mocking external network dependencies (unittest.mock).\n- Hot-patching third-party library bugs in production without waiting for upstream releases.\n\nRisks:\n- Destroys debuggability: Stack traces point to patched methods, confusing engineers.\n- Fragile: Upstream library updates can silently break patched assumptions.",
    "bullet_points": [
      "Dynamically modifies or replaces methods and attributes at runtime.",
      "Standard in testing frameworks for mocking network and database calls.",
      "Anti-pattern in application logic; causes severe debugging headaches."
    ],
    "code_snippet": {
      "language": "python",
      "code": "import requests\ndef fake_get(url): return \"Mocked Response\"\n# Monkey-patching the requests library for testing:\nrequests.get = fake_get\nprint(requests.get(\"https://api.com\")) # Uses mocked function"
    },
    "pro_tip": "Rule: Confine monkey-patching strictly to test suites using unittest.mock.patch.",
    "company_tags": [
      "Amazon",
      "Google",
      "Bloomberg"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 49
  },
  {
    "id": "int-python-050",
    "topic_id": "topic-python",
    "title": "What is the difference between getattr(), setattr(), hasattr(), and delattr()?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Built-in reflection functions for dynamic attribute access:\n\n1. getattr(obj, name, default=None): Retrieves attribute by string name. Returns default if missing, or raises AttributeError.\n2. setattr(obj, name, value): Dynamically sets or updates attribute value by string name.\n3. hasattr(obj, name): Checks boolean existence of an attribute (returns True/False).\n4. delattr(obj, name): Deletes the named attribute from the object.\n\nUse Case: Deserializing dynamic JSON payloads into object attributes, building dynamic plugin loaders.",
    "bullet_points": [
      "Reflection functions for dynamic attribute access via string names.",
      "getattr(obj, 'field', default) provides safe fallback access.",
      "Foundation of dynamic ORMs, serialization libraries, and plugin registries."
    ],
    "code_snippet": {
      "language": "python",
      "code": "class Config:\n    host = \"localhost\"\n\n# Dynamic reflection access:\nport = getattr(Config, \"port\", 8080) # Returns default 8080\nsetattr(Config, \"port\", 9000)        # Dynamically set attribute"
    },
    "pro_tip": "Essential for building dynamic, metadata-driven architectures in Python.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Amazon"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 50
  },
  {
    "id": "int-python-051",
    "topic_id": "topic-python",
    "title": "What is the difference between an Iterable and an Iterator in Python? What is the Iterator Protocol?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "The Iterator Protocol defines how iteration operates across all Python objects:\n\n1. Iterable (Container):\n   - Any object capable of returning an iterator when passed to iter(obj).\n   - Must implement the __iter__() method (or legacy __getitem__()).\n   - Examples: list, tuple, dict, str, set, file objects.\n2. Iterator (Stream Producer):\n   - A stateful object representing a stream of data.\n   - Must implement TWO methods:\n     1. __next__(): Returns the next item in sequence. When no elements remain, MUST raise StopIteration!\n     2. __iter__(): Returns 'self' (so iterators can be used in for loops directly).\n   - Maintains an internal cursor position; once consumed, an iterator cannot be reset.",
    "bullet_points": [
      "Iterable implements __iter__() returning an iterator.",
      "Iterator implements __next__() and raises StopIteration when exhausted.",
      "Iterators are stateful and consume elements on-demand in O(1) space."
    ],
    "code_snippet": {
      "language": "python",
      "code": "numbers = [1, 2]       # Iterable\nit = iter(numbers)     # Iterator\nprint(next(it))        # 1\nprint(next(it))        # 2\n# print(next(it))      # Raises StopIteration!"
    },
    "pro_tip": "Show how a for loop actually works: It calls iter() to get an iterator, then repeatedly calls next() inside a try-except block capturing StopIteration.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 51
  },
  {
    "id": "int-python-052",
    "topic_id": "topic-python",
    "title": "How does the 'yield' keyword work in Python? What is a Generator Function?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "A Generator Function is a function that contains one or more 'yield' statements instead of 'return':\n\nExecution Mechanics:\n1. Returns Generator Object: When called, the function body does NOT execute immediately! It returns a generator iterator object.\n2. Suspension: When next(gen) is called, execution advances until it hits a 'yield' statement. It evaluates the expression, yields the value to the caller, and SUSPENDS execution, freezing its entire local execution frame (local variables, instruction pointer).\n3. Resumption: The next time next(gen) is called, execution resumes immediately after the yield statement with all local variables perfectly intact.\n4. Termination: When the function exits normally, it raises StopIteration.\n\nMemory Advantage: Lazily generates values one-at-a-time (O(1) memory space) rather than materializing a massive million-item list in RAM (O(n) space).",
    "bullet_points": [
      "yield pauses function execution and yields a value, preserving local state.",
      "next() resumes execution right after the yield statement.",
      "Consumes O(1) constant memory regardless of dataset size."
    ],
    "code_snippet": {
      "language": "python",
      "code": "def count_up(max_val):\n    n = 1\n    while n <= max_val:\n        yield n # Pauses and yields\n        n += 1\n\nfor num in count_up(3): print(num) # Prints 1, 2, 3"
    },
    "pro_tip": "Always cite processing 100GB log files line-by-line: A generator uses 0 extra RAM, whereas readlines() crashes with OutOfMemoryError.",
    "company_tags": [
      "Amazon",
      "Google",
      "Microsoft",
      "Netflix"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 52
  },
  {
    "id": "int-python-053",
    "topic_id": "topic-python",
    "title": "What is the difference between a Generator Expression and a List Comprehension?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Comparison of syntax, evaluation, and memory footprint:\n\n1. List Comprehension ([x for x in data]):\n   - Eager Evaluation: Computes all elements immediately in memory.\n   - Produces a full, materialized list object.\n   - Fast for repeated access or indexing, but consumes O(n) memory proportional to the size of data.\n2. Generator Expression ((x for x in data)):\n   - Lazy Evaluation: Produces a generator object; evaluates elements on-demand only when iterated.\n   - Consumes O(1) constant memory regardless of whether the dataset has 10 items or 10 billion items!\n   - Ideal for one-pass pipelines (e.g. sum(x * x for x in data)).",
    "bullet_points": [
      "List comprehension uses square brackets []; eagerly materializes all items (O(n) RAM).",
      "Generator expression uses parentheses (); lazily evaluates on-demand (O(1) RAM).",
      "Generator expressions cannot be indexed (g[0] fails) and can only be consumed once."
    ],
    "code_snippet": {
      "language": "python",
      "code": "import sys\n# 10,000,000 items in list vs generator:\nlst_comp = [x * 2 for x in range(10_000_000)] # Consumes ~800 MB RAM!\ngen_expr = (x * 2 for x in range(10_000_000)) # Consumes ~100 BYTES RAM!"
    },
    "pro_tip": "Highlight memory efficiency: If you are feeding data directly into sum(), min(), or max(), ALWAYS use a generator expression without outer brackets: sum(x for x in data).",
    "company_tags": [
      "Amazon",
      "Google",
      "Infosys"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 53
  },
  {
    "id": "int-python-054",
    "topic_id": "topic-python",
    "title": "What is the 'yield from' expression in Python 3.3+?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Introduced in PEP 380, 'yield from' delegates generation to a sub-generator:\n\nKey Capabilities:\n1. Flattens Iterables: Replaces verbose nested loops: 'for item in subgen: yield item' becomes simply 'yield from subgen'.\n2. Bidirectional Communication (Coroutines): Automatically forwards values sent via .send(), exceptions thrown via .throw(), and closures via .close() directly between the caller and the sub-generator.\n3. Captures Sub-generator Return Values: If the sub-generator executes 'return result', yield from captures it: result = yield from subgen.",
    "bullet_points": [
      "Delegates iteration to a sub-generator or iterable.",
      "Replaces verbose 'for x in subgen: yield x' loops.",
      "Transparently forwards send(), throw(), and captures return values."
    ],
    "code_snippet": {
      "language": "python",
      "code": "def flatten(nested):\n    for item in nested:\n        if isinstance(item, list):\n            yield from flatten(item) # Recursive sub-generator delegation\n        else:\n            yield item\n\nprint(list(flatten([1, [2, [3, 4]], 5]))) # [1, 2, 3, 4, 5]"
    },
    "pro_tip": "Explain: 'yield from' was the foundational building block used to build early Python asyncio coroutines before async/await was introduced.",
    "company_tags": [
      "Google",
      "Dropbox",
      "Meta"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 54
  },
  {
    "id": "int-python-055",
    "topic_id": "topic-python",
    "title": "How does the generator send() method work, and how does it transform a generator into a Coroutine?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "In Python, generators are not just data producers; they can also CONSUME data via the send() method:\n\nMechanics:\n1. Bi-directional Flow: A yield expression can receive a value: val = (yield output).\n2. send(value): Resumes the generator and passes 'value' into the yield expression as its return value.\n3. Priming: A generator must be advanced to its first yield statement (via next(gen) or gen.send(None)) before values can be sent to it.\n\nUse Case: Classic coroutines, stateful event processing, and streaming data parsers.",
    "bullet_points": [
      "gen.send(value) injects a value into the generator at the paused yield expression.",
      "Transforms a generator into a consumer coroutine.",
      "Must be primed with next(gen) or gen.send(None) before sending data."
    ],
    "code_snippet": {
      "language": "python",
      "code": "def running_averager():\n    total, count = 0.0, 0\n    average = None\n    while True:\n        val = yield average # Receives value from send() and yields current average\n        total += val\n        count += 1\n        average = total / count\n\navg = running_averager()\nnext(avg) # Prime generator\nprint(avg.send(10)) # 10.0\nprint(avg.send(20)) # 15.0"
    },
    "pro_tip": "This illustrates classic Python coroutine mechanics prior to Python 3.5's async/await syntax.",
    "company_tags": [
      "Amazon",
      "Google",
      "Bloomberg"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 55
  },
  {
    "id": "int-python-056",
    "topic_id": "topic-python",
    "title": "What is the itertools module, and what are its most powerful functions?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "The itertools module provides fast, memory-efficient C-implemented iterator building blocks:\n\nTop 6 Itertools Functions:\n1. itertools.chain(*iterables): Chains multiple iterables into a single continuous stream without memory allocation.\n2. itertools.islice(iterable, start, stop, step): Slices any generator or iterator in O(1) memory space.\n3. itertools.count(start, step) / cycle(seq) / repeat(elem): Infinite generator streams.\n4. itertools.groupby(iterable, key): Groups consecutive elements sharing the same key (requires sorting first!).\n5. itertools.product(*iterables): Cartesian product (replaces nested for loops).\n6. itertools.permutations() / combinations(): Combinatorial generators.",
    "bullet_points": [
      "High-performance C-implemented iterator functions for memory-efficient pipelines.",
      "chain() merges streams without copying; islice() slices generators lazily.",
      "product() and combinations() generate combinatorial sequences on-demand."
    ],
    "code_snippet": {
      "language": "python",
      "code": "import itertools\n# Cartesian product (replaces 2 nested loops):\nfor color, size in itertools.product(['red', 'blue'], ['S', 'M']):\n    print(color, size)"
    },
    "pro_tip": "Mention itertools.groupby caveat: It only groups CONSECUTIVE items. You must sort the iterable by key before passing to groupby().",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Google",
      "Apple"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 56
  },
  {
    "id": "int-python-057",
    "topic_id": "topic-python",
    "title": "What is a Decorator in Python, and how does it work under the hood?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "A Decorator is a higher-order function that takes another function as an argument, extends or modifies its behavior without modifying its source code, and returns the modified function:\n\nSyntactic Sugar (@decorator):\n- Placing @my_decorator above def func(): is exact syntactic sugar for:\n  func = my_decorator(func)\n\nStandard Structure:\n- An outer function that accepts the original function.\n- An inner wrapper function (*args, **kwargs) that executes pre-logic, calls original func, executes post-logic, and returns the result.\n- Returns the inner wrapper.",
    "bullet_points": [
      "Higher-order function that extends target function behavior without modifying it.",
      "@decorator is syntactic sugar for: func = decorator(func).",
      "Inner wrapper accepts (*args, **kwargs) and returns the function's result."
    ],
    "code_snippet": {
      "language": "python",
      "code": "def my_logger(func):\n    def wrapper(*args, **kwargs):\n        print(f\"Calling {func.__name__}\")\n        result = func(*args, **kwargs)\n        print(f\"{func.__name__} finished\")\n        return result\n    return wrapper\n\n@my_logger\ndef add(a, b): return a + b"
    },
    "pro_tip": "Notice: Always accept *args and **kwargs in the wrapper and return the function result to preserve argument and return transparency.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 57
  },
  {
    "id": "int-python-058",
    "topic_id": "topic-python",
    "title": "Why MUST you use @functools.wraps in Python decorators?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "When a function is decorated, the original function is replaced by the inner wrapper function:\n\nWhat Breaks Without @wraps:\n- The decorated function loses its original identity! Its __name__ becomes 'wrapper', its __doc__ string is wiped, and its __module__ is overwritten.\n- This breaks introspection tools, debuggers, sphinx documentation generators, and IDE autocomplete!\n\nRole of @functools.wraps(func):\n- Decorating the wrapper with @wraps(func) copies all metadata (__name__, __doc__, __annotations__, __module__) and preserves the underlying function in __wrapped__.",
    "bullet_points": [
      "Without @wraps, decorated functions lose their __name__, __doc__, and identity.",
      "@functools.wraps copies original metadata onto the wrapper.",
      "Preserves access to the original unwrapped function via __wrapped__."
    ],
    "code_snippet": {
      "language": "python",
      "code": "import functools\ndef clean_decorator(func):\n    @functools.wraps(func) # Preserves metadata!\n    def wrapper(*args, **kwargs):\n        return func(*args, **kwargs)\n    return wrapper\n\n@clean_decorator\ndef greet(): \"\"\"Greets user\"\"\"\nprint(greet.__name__) # 'greet' (NOT 'wrapper'!)\nprint(greet.__doc__)  # 'Greets user'"
    },
    "pro_tip": "Always include @functools.wraps whenever writing a decorator in technical interviews.",
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
    "sort_order": 58
  },
  {
    "id": "int-python-059",
    "topic_id": "topic-python",
    "title": "How do you write a Decorator that accepts Arguments in Python?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "A decorator that accepts arguments requires THREE nested function layers (a Decorator Factory):\n\n3 Nested Layers:\n1. Outer Layer (Decorator Factory): Accepts the decorator's custom configuration arguments (e.g. retries=3, timeout=5).\n2. Middle Layer (Actual Decorator): Accepts the target function (func) to be decorated.\n3. Inner Layer (Wrapper): Accepts the target function's arguments (*args, **kwargs), executes custom logic, and returns the result.\n\nEvaluation: @repeat(times=3) evaluates repeat(times=3) first, which returns the middle decorator, which then wraps the function.",
    "bullet_points": [
      "Requires 3 nested functions (Decorator Factory -> Decorator -> Wrapper).",
      "Outer function accepts decorator arguments; middle function accepts target function.",
      "Inner wrapper accepts function arguments and executes logic."
    ],
    "code_snippet": {
      "language": "python",
      "code": "import functools\ndef repeat(times):\n    def decorator(func): # Actual decorator\n        @functools.wraps(func)\n        def wrapper(*args, **kwargs): # Execution wrapper\n            for _ in range(times):\n                result = func(*args, **kwargs)\n            return result\n        return wrapper\n    return decorator\n\n@repeat(times=3)\ndef ping(): print(\"Ping!\")"
    },
    "pro_tip": "Interviewers frequently ask candidates to write a @retry(max_attempts=3, delay=1) decorator on the whiteboard.",
    "company_tags": [
      "Google",
      "Amazon",
      "Uber",
      "Stripe"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 59
  },
  {
    "id": "int-python-060",
    "topic_id": "topic-python",
    "title": "How does functools.lru_cache work, and what are its requirements?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "functools.lru_cache wraps a function with a Least Recently Used (LRU) memoization cache:\n\nMechanics:\n- Stores function call arguments and return values in an internal dictionary.\n- When invoked with identical arguments, it bypasses computation and returns the cached result in O(1) time.\n- Evicts the least recently accessed results when size exceeds maxsize (default 128).\n\nStrict Requirement:\n- ALL arguments passed to the cached function MUST BE HASHABLE (immutable)! Passing a mutable list or dictionary raises TypeError: unhashable type.\n- Cache Inspection: func.cache_info() returns hits, misses, maxsize, and currsize. func.cache_clear() clears the cache.",
    "bullet_points": [
      "Memoizes function calls using an in-memory LRU cache.",
      "All function arguments must be hashable.",
      "Inspect performance via func.cache_info() and reset via func.cache_clear()."
    ],
    "code_snippet": {
      "language": "python",
      "code": "import functools\n@functools.lru_cache(maxsize=128)\ndef fib(n):\n    if n < 2: return n\n    return fib(n - 1) + fib(n - 2) # Converts O(2^n) exponential into O(n) linear!"
    },
    "pro_tip": "Highlight how lru_cache optimizes recursive dynamic programming algorithms from exponential to linear time.",
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
    "sort_order": 60
  },
  {
    "id": "int-python-061",
    "topic_id": "topic-python",
    "title": "What are Class Decorators in Python, and how do they differ from function decorators?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "A Class Decorator is a decorator applied directly to a class definition (@decorator class MyClass:):\n\nMechanics:\n- Takes a Class object as its argument (cls), modifies or extends its methods or attributes, and returns the class.\n- Standard Examples: @dataclass, @functools.total_ordering.\n- Advantages: Less invasive than metaclasses; simple to compose and read.\n- Class-as-Decorator: Conversely, a class implementing __init__ and __call__ can act as a decorator for functions.",
    "bullet_points": [
      "Applied to class definitions; receives class object (cls) as parameter.",
      "Modifies class attributes and methods before returning the class.",
      "Simpler and more composable alternative to metaclasses."
    ],
    "code_snippet": {
      "language": "python",
      "code": "def add_timestamp(cls):\n    cls.created_at = \"2026-09-14\"\n    return cls\n\n@add_timestamp\nclass Order:\n    pass\nprint(Order.created_at) # '2026-09-14'"
    },
    "pro_tip": "Always cite @dataclass as the premier standard library example of a class decorator.",
    "company_tags": [
      "Google",
      "Amazon",
      "Apple"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 61
  },
  {
    "id": "int-python-062",
    "topic_id": "topic-python",
    "title": "What is the Global Interpreter Lock (GIL) in CPython, and why does it exist?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "The GIL is a mutual exclusion lock used by CPython to prevent multiple native OS threads from executing Python bytecode simultaneously:\n\nWhy It Exists in CPython:\n1. Memory Management Safety: CPython's memory management relies heavily on Reference Counting (ob_refcnt). Without the GIL, concurrent multi-threaded modifications to reference counts would cause catastrophic race conditions and memory leaks.\n2. Easy C Extension Integration: The GIL made wrapping legacy C libraries (NumPy, OpenSSL) into Python effortless because C extensions didn't need to be thread-safe.\n\nConcurrency Impact:\n- CPU-Bound Tasks: Multi-threading CANNOT utilize multiple CPU cores! Running 4 CPU-heavy threads on a 4-core machine is often SLOWER than a single thread due to GIL thread-switching lock contention.\n- I/O-Bound Tasks: Multi-threading works exceptionally well! When a thread executes blocking I/O (network, disk, time.sleep), it releases the GIL, allowing other threads to run concurrently.\n- Python 3.13 Free-Threaded (PEP 703): Standardizing an optional build to disable the GIL completely.",
    "bullet_points": [
      "GIL restricts CPython execution to a single thread at a time.",
      "Protects CPython's reference counting memory management from race conditions.",
      "Multi-threading does NOT accelerate CPU-bound tasks; use multiprocessing instead."
    ],
    "code_snippet": {
      "language": "python",
      "code": "# Multi-threading works for I/O bound tasks (GIL released during I/O):\nimport threading, time\ndef io_task():\n    time.sleep(1) # Releases GIL while sleeping!\nthreads = [threading.Thread(target=io_task) for _ in range(10)]"
    },
    "pro_tip": "Always mention Python 3.13's experimental Free-Threaded build (PEP 703) to show you are tracking the future of Python.",
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
    "sort_order": 62
  },
  {
    "id": "int-python-063",
    "topic_id": "topic-python",
    "title": "When should you use threading vs multiprocessing vs asyncio in Python?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Comparison matrix across Python concurrency paradigms:\n\n1. multiprocessing (CPU-Bound Tasks):\n   - Spawns independent OS processes, each with its own private Python interpreter and independent GIL.\n   - Scales across multiple physical CPU cores (e.g. video encoding, machine learning, cryptography, heavy math).\n   - Trade-off: High memory overhead and inter-process communication (IPC / serialization) cost.\n2. threading (I/O-Bound Tasks with Blocking APIs):\n   - Lightweight OS threads sharing the same process memory space.\n   - Excellent for network downloads, file reads, and database queries using legacy synchronous libraries.\n3. asyncio (High-Concurrency I/O-Bound Tasks):\n   - Single-threaded, event-driven cooperative multitasking using coroutines (async/await).\n   - Supports 100,000+ concurrent network connections with minimal RAM overhead (no OS thread stack overhead). Requires non-blocking async libraries (aiohttp, asyncpg).",
    "bullet_points": [
      "multiprocessing: Multi-core parallelism for CPU-bound computations.",
      "threading: Concurrent I/O using blocking synchronous libraries.",
      "asyncio: High-scale non-blocking concurrent I/O (100k+ connections)."
    ],
    "code_snippet": {
      "language": "python",
      "code": "# Decision Rule:\n# CPU-bound (math/crypto)       -> multiprocessing\n# I/O-bound (legacy blocking)    -> threading\n# I/O-bound (high-scale network) -> asyncio"
    },
    "pro_tip": "This is the golden concurrency interview matrix across all senior software engineer interviews.",
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
    "sort_order": 63
  },
  {
    "id": "int-python-064",
    "topic_id": "topic-python",
    "title": "How does asyncio work internally? Explain the Event Loop, Coroutines, and Tasks.",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "asyncio provides single-threaded cooperative multitasking based on an Event Loop and non-blocking OS selectors (epoll/kqueue):\n\nCore Components:\n1. Event Loop: A continuous loop that monitors registered network sockets and file descriptors. When a socket becomes ready for reading/writing, it wakes up the corresponding paused coroutine.\n2. Coroutine (async def): A function that can suspend execution at 'await' expressions, returning control back to the Event Loop to run other tasks.\n3. Task (asyncio.create_task()): Wraps a coroutine into an active Future scheduled immediately on the Event Loop for concurrent execution.\n4. Cooperative Multitasking: Execution NEVER preempts! A coroutine MUST explicitly yield control via 'await'. If a coroutine executes a synchronous blocking call (time.sleep() or heavy while loop), the ENTIRE EVENT LOOP HANGS!",
    "bullet_points": [
      "Event loop multiplexes asynchronous tasks on a single thread using OS epoll.",
      "'await' suspends coroutines, yielding control back to the event loop.",
      "Cooperative: Calling blocking synchronous code freezes the entire application!"
    ],
    "code_snippet": {
      "language": "python",
      "code": "import asyncio\nasync def fetch_data(id):\n    await asyncio.sleep(1) # Non-blocking sleep: Yields control to event loop\n    return f\"Data {id}\"\n\nasync def main():\n    results = await asyncio.gather(fetch_data(1), fetch_data(2)) # Concurrent!"
    },
    "pro_tip": "Cardinal Rule: Never call blocking synchronous functions (like requests.get or time.sleep) inside async def; use httpx/aiohttp and asyncio.sleep.",
    "company_tags": [
      "Google",
      "Amazon",
      "Meta",
      "Bloomberg"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 64
  },
  {
    "id": "int-python-065",
    "topic_id": "topic-python",
    "title": "What does asyncio.gather() vs asyncio.wait() do?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "1. asyncio.gather(*coros_or_tasks):\n   - High-level utility to run multiple awaitables concurrently.\n   - Returns an aggregated list of results in the EXACT order the tasks were passed.\n   - Option: return_exceptions=True captures exceptions as return values instead of failing the entire batch immediately.\n2. asyncio.wait(tasks, return_when=...):\n   - Lower-level control over task completion.\n   - Accepts return_when conditions: FIRST_COMPLETED, FIRST_EXCEPTION, ALL_COMPLETED.\n   - Returns a tuple of two sets: (done_tasks, pending_tasks).",
    "bullet_points": [
      "gather() aggregates results in ordered sequence; ideal for fetching parallel data.",
      "wait() returns (done, pending) sets based on FIRST_COMPLETED or ALL_COMPLETED.",
      "gather(return_exceptions=True) prevents one failure from aborting other tasks."
    ],
    "code_snippet": {
      "language": "python",
      "code": "# High-level concurrent execution:\nresults = await asyncio.gather(\n    fetch_user(),\n    fetch_orders(),\n    return_exceptions=True\n)"
    },
    "pro_tip": "Use asyncio.wait with FIRST_COMPLETED when implementing timeouts or racing redundant requests.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "Netflix"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 65
  },
  {
    "id": "int-python-066",
    "topic_id": "topic-python",
    "title": "How does the Context Manager Protocol work in Python (__enter__ and __exit__)?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "The 'with' statement automates deterministic resource management via the Context Manager protocol:\n\nExecution Flow:\n1. Invokes __enter__(): Sets up the resource (opens file, acquires lock). The return value of __enter__() is bound to the 'as target' variable.\n2. Executes Body: The statements inside the 'with' block execute.\n3. Invokes __exit__(exc_type, exc_val, exc_tb): GUARANTEED to execute upon exiting the block (normally or via exception!).\n\nException Handling in __exit__:\n- If an exception occurred inside the block, its type, value, and traceback are passed to __exit__.\n- If __exit__ returns True, the exception is SUPPRESSED (swallowed).\n- If __exit__ returns False (or None), the exception is re-raised automatically.",
    "bullet_points": [
      "__enter__() acquires resource and binds to 'as' variable.",
      "__exit__() guarantees cleanup even if exceptions are thrown inside the block.",
      "Returning True from __exit__ suppresses exceptions; returning False re-raises."
    ],
    "code_snippet": {
      "language": "python",
      "code": "class ManagedFile:\n    def __init__(self, filename):\n        self.filename = filename\n    def __enter__(self):\n        self.file = open(self.filename, 'w')\n        return self.file\n    def __exit__(self, exc_type, exc_val, exc_tb):\n        if self.file: self.file.close() # Guaranteed cleanup\n        return False # Do not suppress exceptions"
    },
    "pro_tip": "Always state: '__exit__ is Python's RAII mechanism for deterministic resource cleanup.'",
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Apple"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 66
  },
  {
    "id": "int-python-067",
    "topic_id": "topic-python",
    "title": "What is @contextlib.contextmanager, and how does it create Context Managers using Generators?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "The @contextlib.contextmanager decorator transforms a simple generator function into a full context manager without writing a class with __enter__ and __exit__:\n\nMechanics:\n1. Code BEFORE 'yield': Acts as __enter__() (acquires resource).\n2. The 'yield' expression: Hands the resource to the 'as target' variable and pauses.\n3. Code AFTER 'yield' (inside finally block): Acts as __exit__() (cleans up resource).\n\nGolden Rule: Always wrap the yield in a try-finally block so cleanup is guaranteed even if the caller throws an exception inside the with block!",
    "bullet_points": [
      "Converts generator functions into context managers via decorators.",
      "Code before yield runs on enter; code in finally block runs on exit.",
      "Must wrap yield in try...finally for guaranteed exception cleanup."
    ],
    "code_snippet": {
      "language": "python",
      "code": "from contextlib import contextmanager\n@contextmanager\ndef open_db_session():\n    db = connect()\n    try:\n        yield db # Passed to 'as' variable\n    finally:\n        db.close() # Guaranteed cleanup!"
    },
    "pro_tip": "This is standard practice in FastAPI, SQLAlchemy, and Flask applications.",
    "company_tags": [
      "Amazon",
      "FastAPI/Tiangolo",
      "Google"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 67
  },
  {
    "id": "int-python-068",
    "topic_id": "topic-python",
    "title": "What is Exception Chaining in Python (raise from)?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Python 3 introduced explicit Exception Chaining using 'raise NewException from OriginalException':\n\nMechanics:\n- Links the cause of an exception in the __cause__ attribute (e.g. raise DatabaseError(\"Query failed\") from sql_err).\n- The traceback outputs both exceptions clearly: 'The above exception was the direct cause of the following exception...'.\n- Suppressing Context: 'raise NewException from None' clears __cause__ and __context__, suppressing ugly underlying internal stack traces.",
    "bullet_points": [
      "'raise from' explicitly links root-cause exceptions in __cause__.",
      "Preserves complete debugging diagnostics across abstraction boundaries.",
      "'raise NewException from None' suppresses internal tracebacks."
    ],
    "code_snippet": {
      "language": "python",
      "code": "try:\n    int(\"not a number\")\nexcept ValueError as e:\n    raise ApplicationError(\"Bad user input\") from e"
    },
    "pro_tip": "Essential for library authors to hide internal network/driver details from end-users.",
    "company_tags": [
      "Google",
      "Microsoft"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 68
  },
  {
    "id": "int-python-069",
    "topic_id": "topic-python",
    "title": "What is the difference between else and finally blocks in Python try-except statements?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Complete anatomy of try-except-else-finally:\n\n1. 'try': Contains the code that may raise an exception.\n2. 'except': Executes ONLY if a matching exception occurs in the try block.\n3. 'else': Executes ONLY if NO exception was raised in the try block! (Keeps the try block minimal and avoids catching unintended exceptions).\n4. 'finally': ALWAYS executes under all circumstances (normal exit, exception raised, or return statement executed). Used for guaranteed resource cleanup.",
    "bullet_points": [
      "except executes only on exception.",
      "else executes only when NO exception was raised in try.",
      "finally executes unconditionally for cleanup."
    ],
    "code_snippet": {
      "language": "python",
      "code": "try:\n    data = parse_payload()\nexcept ValidationError:\n    handle_error()\nelse:\n    save_to_database(data) # Only runs if parse_payload succeeded!\nfinally:\n    close_connection()      # Always runs"
    },
    "pro_tip": "Emphasize the 'else' block: It is a unique Python feature that separates risky code from subsequent actions.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 69
  },
  {
    "id": "int-python-070",
    "topic_id": "topic-python",
    "title": "What is the difference between staticmethod and classmethod in terms of inheritance?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "When invoked through a derived subclass:\n\n1. @classmethod:\n   - Receives the ACTUAL derived subclass as 'cls' (polymorphic factory).\n   - Subclasses can inherit factory methods that instantiate instances of the subclass directly!\n2. @staticmethod:\n   - Has no reference to the calling class. Always behaves identically regardless of whether called from Base or Derived.",
    "bullet_points": [
      "classmethod dynamically binds to the calling subclass via cls.",
      "Enables polymorphic alternative constructors inherited by subclasses.",
      "staticmethod has no class binding."
    ],
    "code_snippet": {
      "language": "python",
      "code": "class Base:\n    @classmethod\n    def create(cls): return cls()\nclass Derived(Base): pass\n\nobj = Derived.create()\nprint(type(obj)) # Derived (Correctly instantiates subclass!)"
    },
    "pro_tip": "Always use classmethod for factory constructors in inheritable classes.",
    "company_tags": [
      "Amazon",
      "Microsoft"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 70
  },
  {
    "id": "int-python-071",
    "topic_id": "topic-python",
    "title": "What is the __missing__ method in Python dictionaries?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "__missing__(self, key) is a hook method called by dict.__getitem__ when a requested key is NOT found in the dictionary:\n\nMechanics:\n- Defined in dictionary subclasses.\n- Standard collections.defaultdict is implemented entirely by overriding __missing__!\n- Allows building custom auto-vivifying dictionaries and lazy loaders.",
    "bullet_points": [
      "Invoked when a key is not found in dict[key] lookups.",
      "Powers collections.defaultdict under the hood.",
      "Used to build auto-nesting dictionaries and lazy caches."
    ],
    "code_snippet": {
      "language": "python",
      "code": "class CaseInsensitiveDict(dict):\n    def __missing__(self, key):\n        return self[key.lower()]"
    },
    "pro_tip": "Notice: __missing__ is ONLY called for d[key] bracket lookups, NOT for d.get(key)!",
    "company_tags": [
      "Google",
      "Bloomberg"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 71
  },
  {
    "id": "int-python-072",
    "topic_id": "topic-python",
    "title": "What are Python Descriptors (__get__, __set__, __delete__)?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Descriptors are the low-level attribute access protocol that powers properties, methods, @classmethod, @staticmethod, and ORM fields (Django/SQLAlchemy):\n\nDescriptor Protocol Methods:\n1. __get__(self, instance, owner): Invoked when attribute is read.\n2. __set__(self, instance, value): Invoked when attribute is set.\n3. __delete__(self, instance): Invoked when attribute is deleted.\n\nData vs Non-Data Descriptors:\n- Data Descriptor: Implements __set__ (or __delete__). Takes precedence over instance __dict__.\n- Non-Data Descriptor: Implements only __get__ (like methods). Instance __dict__ takes precedence.",
    "bullet_points": [
      "Low-level protocol governing attribute access (__get__, __set__, __delete__).",
      "Powers properties, methods, staticmethods, and ORM column mappings.",
      "Data descriptors override instance __dict__ lookups."
    ],
    "code_snippet": {
      "language": "python",
      "code": "# Integer validation descriptor:\nclass PositiveInteger:\n    def __set_name__(self, owner, name): self.name = name\n    def __set__(self, instance, value):\n        if value <= 0: raise ValueError(\"Must be positive!\")\n        instance.__dict__[self.name] = value\n    def __get__(self, instance, owner):\n        return instance.__dict__.get(self.name)"
    },
    "pro_tip": "Explaining Descriptors proves you understand Python's internal attribute resolution mechanics.",
    "company_tags": [
      "Google",
      "Meta",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 72
  },
  {
    "id": "int-python-073",
    "topic_id": "topic-python",
    "title": "What is the difference between __getattr__ and __getattribute__ in Python?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "1. __getattribute__(self, name):\n   - UNCONDITIONALLY invoked on EVERY single attribute access (e.g. obj.x).\n   - Overriding it intercepts every access; must call super().__getattribute__() to avoid infinite recursion!\n2. __getattr__(self, name):\n   - Fallback method invoked ONLY when the attribute is NOT found in the instance's __dict__ or class tree.\n   - Used for lazy loading, dynamic proxies, and RPC client stubs.",
    "bullet_points": [
      "__getattribute__ is called on EVERY attribute lookup.",
      "__getattr__ is a fallback called ONLY when attribute does not exist.",
      "Overriding __getattribute__ without super() causes infinite recursion."
    ],
    "code_snippet": {
      "language": "python",
      "code": "class DynamicProxy:\n    def __getattr__(self, name):\n        return f\"Dynamic handler for {name}\"\n\np = DynamicProxy()\nprint(p.non_existent_method) # Returns string without raising AttributeError"
    },
    "pro_tip": "Use __getattr__ for 99% of proxy use cases; avoid __getattribute__ unless writing deep profilers.",
    "company_tags": [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 73
  },
  {
    "id": "int-python-074",
    "topic_id": "topic-python",
    "title": "What are Match-Case statements in Python 3.10+ (Structural Pattern Matching)?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Structural Pattern Matching (PEP 634) introduced 'match-case' in Python 3.10:\n\nFeatures:\n- Deep destructuring of sequences, mappings, and class objects.\n- Value and type extraction with guard clauses (if condition).\n- Wildcard '_' acts as default fallback case.",
    "bullet_points": [
      "Structural pattern matching destructures objects, sequences, and mappings.",
      "Supports guard conditions (case [x, y] if x > 0:).",
      "Vastly superior to nested if-elif chains."
    ],
    "code_snippet": {
      "language": "python",
      "code": "def handle_command(cmd):\n    match cmd:\n        case [\"move\", x, y]: print(f\"Moving to {x}, {y}\")\n        case [\"quit\"]: print(\"Quitting\")\n        case _: print(\"Unknown command\")"
    },
    "pro_tip": "A modern Python 3.10+ feature that modernizes parsing and state dispatch.",
    "company_tags": [
      "Amazon",
      "Meta",
      "Google"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 74
  },
  {
    "id": "int-python-075",
    "topic_id": "topic-python",
    "title": "What is the GIL removal in Python 3.13 (PEP 703 Free-Threaded CPython)?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Python 3.13 introduces an experimental build option (--disable-gil) to run CPython without the Global Interpreter Lock:\n\nHow Free-Threading Replaces the GIL:\n1. Biased Reference Counting: Differentiates local single-threaded references (fast) from shared multi-threaded references.\n2. Mimalloc Memory Allocator: Thread-safe, lock-free memory allocation from Microsoft Research.\n3. Thread-Safe Dictionaries: Synchronized internal maps.\n- Result: True multi-core CPU parallelism for Python multi-threading!",
    "bullet_points": [
      "Python 3.13 introduces experimental build without the GIL (PEP 703).",
      "Uses Biased Reference Counting and Mimalloc allocator for thread safety.",
      "Enables true multi-core CPU parallelism in standard Python threads."
    ],
    "code_snippet": {
      "language": "bash",
      "code": "# Running Python 3.13 without the GIL:\npython3.13t app.py"
    },
    "pro_tip": "Stating PEP 703 and free-threaded CPython shows elite industry awareness.",
    "company_tags": [
      "Meta",
      "Google",
      "OpenAI"
    ],
    "frequency": "HIGH",
    "difficulty": "HARD",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 75
  },
  {
    "id": "int-python-076",
    "topic_id": "topic-python",
    "title": "What is the difference between deepcopy and pickle in Python?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "1. copy.deepcopy: Duplicates in-memory Python objects directly into new Python objects in RAM.\n2. pickle: Serializes Python objects into a raw byte stream for storage on disk or transmission over networks, and deserializes back.\n- Security Risk: Unpickling untrusted data allows arbitrary remote code execution via __reduce__.",
    "bullet_points": [
      "deepcopy clones objects in RAM.",
      "pickle serializes objects into byte streams for disk/network.",
      "Never unpickle untrusted data (severe remote code execution risk)."
    ],
    "code_snippet": {
      "language": "python",
      "code": "import pickle\ndata = {'id': 1, 'active': True}\nserialized = pickle.dumps(data) # Byte stream\nrestored = pickle.loads(serialized)"
    },
    "pro_tip": "Recommend json, protobuf, or msgpack over pickle for cross-language APIs.",
    "company_tags": [
      "Amazon",
      "Google"
    ],
    "frequency": "MEDIUM",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 76
  },
  {
    "id": "int-python-077",
    "topic_id": "topic-python",
    "title": "What is the difference between staticmethod and normal function in Python module?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "A static method inside a class is functionally identical to a module-level function, except it lives in the class namespace.\n- Use module functions for general utilities; use static methods when logically coupled to a class.",
    "bullet_points": [
      "Staticmethod lives in class namespace; module function lives in module namespace.",
      "Functionally identical in execution and performance.",
      "Use staticmethod when conceptually bound to class domain."
    ],
    "code_snippet": {
      "language": "python",
      "code": "class MathUtils:\n    @staticmethod\n    def add(a, b): return a + b"
    },
    "pro_tip": "Keep it simple: It is an organizational design choice.",
    "company_tags": [
      "TCS",
      "Infosys"
    ],
    "frequency": "MEDIUM",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 77
  },
  {
    "id": "int-python-078",
    "topic_id": "topic-python",
    "title": "How does the 'dis' module work, and how do you disassemble Python functions?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "The 'dis' module disassembles Python bytecode into human-readable instructions, showing opcodes (LOAD_FAST, BINARY_OP, STORE_FAST).\n- Used for performance tuning and analyzing CPython optimization.",
    "bullet_points": [
      "dis.dis() disassembles bytecode into human-readable opcodes.",
      "Reveals compiler constant folding and instruction counts.",
      "Essential for performance benchmarking."
    ],
    "code_snippet": {
      "language": "python",
      "code": "import dis\ndef calc(x): return x * 2 + 1\ndis.dis(calc)"
    },
    "pro_tip": "Shows instruction-level insight into Python execution.",
    "company_tags": [
      "Google",
      "Apple"
    ],
    "frequency": "MEDIUM",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 78
  },
  {
    "id": "int-python-079",
    "topic_id": "topic-python",
    "title": "What is the Global Variable trap in Python functions (UnboundLocalError)?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "If a variable is assigned ANYWHERE inside a function, Python marks it as LOCAL for the entire function at compile time!\n- Reading it BEFORE the assignment raises UnboundLocalError: local variable referenced before assignment.\n- Fix: Declare 'global var' explicitly if mutating global state.",
    "bullet_points": [
      "Assigning to a variable inside a function marks it as local throughout.",
      "Reading it before assignment raises UnboundLocalError.",
      "Fix via explicit 'global' keyword."
    ],
    "code_snippet": {
      "language": "python",
      "code": "count = 10\ndef increment():\n    # count += 1 # UnboundLocalError!\n    global count\n    count += 1"
    },
    "pro_tip": "A standard debugging question in code screening rounds.",
    "company_tags": [
      "Amazon",
      "TCS",
      "Wipro"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 79
  },
  {
    "id": "int-python-080",
    "topic_id": "topic-python",
    "title": "What is the difference between __eq__ and __ne__ in modern Python?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "In modern Python 3, if a class implements __eq__(), Python automatically provides a fallback implementation for __ne__() by inverting the result of __eq__ (not (a == b)).\n- You rarely need to implement __ne__() manually.",
    "bullet_points": [
      "Python 3 automatically delegates __ne__ to not (__eq__).",
      "Implementing __eq__ is sufficient for equality.",
      "Custom __ne__ is only needed for specialized short-circuits."
    ],
    "code_snippet": {
      "language": "python",
      "code": "class Item:\n    def __init__(self, val): self.val = val\n    def __eq__(self, other): return self.val == other.val\n# != works automatically!"
    },
    "pro_tip": "Highlight that Python 3 fixed this boilerplate requirement from Python 2.",
    "company_tags": [
      "TCS",
      "Infosys"
    ],
    "frequency": "MEDIUM",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 80
  },
  {
    "id": "int-python-081",
    "topic_id": "topic-python",
    "title": "What is the difference between str and bytes in Python 3?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Python 3 enforces strict separation between text and raw binary data:\n\n1. str: Human-readable text represented as Unicode code points (UTF-8).\n2. bytes: Raw, immutable sequence of 8-bit integers (0 to 255).\n- Convert text to bytes via str.encode('utf-8'); convert bytes to text via bytes.decode('utf-8').",
    "bullet_points": [
      "str represents Unicode text; bytes represents raw 8-bit bytes.",
      "str.encode() converts text to bytes; bytes.decode() converts bytes to text.",
      "Never concatenate str with bytes (raises TypeError)."
    ],
    "code_snippet": {
      "language": "python",
      "code": "text = \"Hello World\"\nraw = text.encode('utf-8') # bytes\nrecovered = raw.decode('utf-8') # str"
    },
    "pro_tip": "This clean separation was the primary breaking change in Python 3.",
    "company_tags": [
      "Amazon",
      "Microsoft"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 81
  },
  {
    "id": "int-python-082",
    "topic_id": "topic-python",
    "title": "What is __del__ in Python, and why is it unreliable?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "__del__ is the destructor invoked when an object's reference count drops to zero.\n\nWhy It Is Unreliable:\n- Non-deterministic: Circular references or program termination can postpone or skip __del__ execution entirely.\n- Exceptions inside __del__ are ignored.\n- Best Practice: Never use __del__ for resource cleanup; use Context Managers (with statement)!",
    "bullet_points": [
      "__del__ executes when reference count hits 0.",
      "Unreliable timing; may never execute upon program termination.",
      "Use Context Managers ('with' statement) for deterministic cleanup."
    ],
    "code_snippet": {
      "language": "python",
      "code": "class FileHandler:\n    def __del__(self):\n        print(\"Cleaned up\") # Unreliable!"
    },
    "pro_tip": "Analogous to finalize() in Java: deprecated in practice in favor of with / try-finally.",
    "company_tags": [
      "Google",
      "Amazon"
    ],
    "frequency": "HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 82
  },
  {
    "id": "int-python-083",
    "topic_id": "topic-python",
    "title": "What is the difference between copy.copy() and [:] for copying lists?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Both produce a Shallow Copy of the list with identical performance.\n- [:] is idiomatic slice syntax; copy.copy() is universal across arbitrary types.",
    "bullet_points": [
      "Both perform a shallow copy of the list.",
      "Slice syntax (lst[:]) is compact and idiomatic.",
      "copy.copy() works generically across all compound types."
    ],
    "code_snippet": {
      "language": "python",
      "code": "original = [1, 2, 3]\nc1 = original[:]\nc2 = original.copy()\n# c1 and c2 are independent shallow copies"
    },
    "pro_tip": "Note that list.copy() was introduced in Python 3.3 for clarity.",
    "company_tags": [
      "TCS",
      "Infosys"
    ],
    "frequency": "MEDIUM",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 83
  },
  {
    "id": "int-python-084",
    "topic_id": "topic-python",
    "title": "What is any() and all() in Python, and how do they short-circuit?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "1. any(iterable): Returns True if AT LEAST ONE element is truthy. Short-circuits immediately upon the first truthy element!\n2. all(iterable): Returns True ONLY if ALL elements are truthy. Short-circuits immediately upon the first falsy element!\n- Short-circuiting avoids evaluating remaining elements in generators.",
    "bullet_points": [
      "any() returns True on first truthy element (short-circuits).",
      "all() returns False on first falsy element (short-circuits).",
      "Combines powerfully with generator expressions for high performance."
    ],
    "code_snippet": {
      "language": "python",
      "code": "# Efficient short-circuiting check:\nhas_admin = any(user.is_admin for user in users)"
    },
    "pro_tip": "Always pass generator expressions directly into any/all without brackets.",
    "company_tags": [
      "Amazon",
      "Microsoft"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 84
  },
  {
    "id": "int-python-085",
    "topic_id": "topic-python",
    "title": "What is zip() and itertools.zip_longest() in Python?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "1. zip(*iterables): Aggregates elements from each iterable into tuples, stopping when the SHORTEST iterable is exhausted (strict=True in Python 3.10 raises error on length mismatch).\n2. itertools.zip_longest(*iterables, fillvalue=None): Continues until the LONGEST iterable is exhausted, padding missing values with fillvalue.",
    "bullet_points": [
      "zip() stops at shortest iterable (supports strict=True in 3.10).",
      "zip_longest() stops at longest iterable, padding with fillvalue.",
      "Standard for parallel iteration over multiple collections."
    ],
    "code_snippet": {
      "language": "python",
      "code": "from itertools import zip_longest\nnames = ['Alice', 'Bob']\nscores = [100, 95, 80]\nprint(list(zip_longest(names, scores, fillvalue='N/A')))"
    },
    "pro_tip": "Mention Python 3.10's zip(..., strict=True) to prevent silent data truncation bugs.",
    "company_tags": [
      "Amazon",
      "Google"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 85
  },
  {
    "id": "int-python-086",
    "topic_id": "topic-python",
    "title": "What is the difference between reversed() and list.reverse()?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "1. list.reverse(): Modifies the list in-place and returns None (O(1) auxiliary space).\n2. reversed(seq): Built-in function that returns a reverse iterator without modifying the original sequence (lazy, O(1) space).",
    "bullet_points": [
      "list.reverse() reverses in-place and returns None.",
      "reversed() returns a reverse iterator leaving original unchanged.",
      "reversed() works on any object implementing __reversed__ or __len__ + __getitem__."
    ],
    "code_snippet": {
      "language": "python",
      "code": "lst = [1, 2, 3]\nfor x in reversed(lst): print(x) # 3, 2, 1 (lst untouched!)\nlst.reverse()                     # lst becomes [3, 2, 1]"
    },
    "pro_tip": "Use reversed() in loops to preserve the original list.",
    "company_tags": [
      "TCS",
      "Infosys"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 86
  },
  {
    "id": "int-python-087",
    "topic_id": "topic-python",
    "title": "What is enumerate() in Python, and why is it preferred over range(len())?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "enumerate(iterable, start=0) yields (index, element) pairs directly.\n\nWhy Preferred over range(len()):\n- Readability: Clean, idiomatic unpacking: for i, val in enumerate(lst).\n- Eliminates redundant index lookups (lst[i]).\n- Works on ANY iterable (generators, sets), whereas range(len()) works only on indexed sequences.",
    "bullet_points": [
      "Yields (index, item) tuples cleanly.",
      "Eliminates clumsy 'range(len(lst))' loops.",
      "Supports custom start index: enumerate(lst, start=1)."
    ],
    "code_snippet": {
      "language": "python",
      "code": "fruits = ['apple', 'banana']\nfor idx, fruit in enumerate(fruits, start=1):\n    print(f\"{idx}: {fruit}\")"
    },
    "pro_tip": "Flag range(len(x)) as a code smell during Python interviews.",
    "company_tags": [
      "Amazon",
      "Microsoft",
      "TCS"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 87
  },
  {
    "id": "int-python-088",
    "topic_id": "topic-python",
    "title": "What is the difference between functools.partial and lambdas?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "functools.partial pre-binds specific arguments to a callable:\n- partial objects are pickleable (can be passed across multiprocessing processes), whereas lambdas often fail pickling!\n- partial objects support introspection (.func, .args, .keywords).",
    "bullet_points": [
      "partial pre-binds arguments to a function.",
      "partial objects are pickleable for multiprocessing.",
      "Lambdas provide more flexible expression syntax."
    ],
    "code_snippet": {
      "language": "python",
      "code": "from functools import partial\ndef multiply(x, y): return x * y\ndouble = partial(multiply, 2) # Pre-binds x=2\nprint(double(10)) # 20"
    },
    "pro_tip": "Use partial when passing callbacks to multiprocessing pools.",
    "company_tags": [
      "Google",
      "Amazon"
    ],
    "frequency": "MEDIUM",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 88
  },
  {
    "id": "int-python-089",
    "topic_id": "topic-python",
    "title": "What are Global and Local namespaces (globals() and locals())?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Python namespaces are dictionaries mapping variable names to object references:\n\n1. globals(): Returns the dictionary of the current module namespace.\n2. locals(): Returns the dictionary of the current function call frame.\n- Python code executes by resolving lookups inside these internal dictionaries.",
    "bullet_points": [
      "Namespaces are dictionaries mapping identifier names to objects.",
      "globals() inspects module-level dictionary.",
      "locals() inspects current stack frame dictionary."
    ],
    "code_snippet": {
      "language": "python",
      "code": "x = 100\nprint('x' in globals()) # True"
    },
    "pro_tip": "Modifying locals() inside a function does not update actual local variables in CPython.",
    "company_tags": [
      "Amazon",
      "Microsoft"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 89
  },
  {
    "id": "int-python-090",
    "topic_id": "topic-python",
    "title": "What is sys.argv in Python?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "sys.argv is a list containing command-line arguments passed to the script:\n- sys.argv[0] is the script name.\n- sys.argv[1:] are the arguments passed by the user (always strings).\n- For complex CLI apps, use the standard 'argparse' module.",
    "bullet_points": [
      "sys.argv stores command-line arguments as strings.",
      "sys.argv[0] is the script file name.",
      "Use argparse for production command-line parsing."
    ],
    "code_snippet": {
      "language": "python",
      "code": "import sys\nprint(\"Script name:\", sys.argv[0])\nprint(\"Arguments:\", sys.argv[1:])"
    },
    "pro_tip": "Standard scripting question in interview screenings.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 90
  },
  {
    "id": "int-python-091",
    "topic_id": "topic-python",
    "title": "What is the difference between append() and extend() in Python lists?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "1. list.append(item): Adds 'item' as a SINGLE element to the end of the list. If you pass a list, it nests that entire list as a single child element (e.g. [1, [2, 3]]).\n2. list.extend(iterable): Iterates over 'iterable' and appends each element individually to the end (e.g. [1, 2, 3]). Equivalent to +=.",
    "bullet_points": [
      "append() adds argument as a single element (nests lists).",
      "extend() iterates and adds all elements of the iterable.",
      "lst.extend(other) is equivalent to lst += other."
    ],
    "code_snippet": {
      "language": "python",
      "code": "a = [1, 2]; a.append([3, 4]) # [1, 2, [3, 4]]\nb = [1, 2]; b.extend([3, 4]) # [1, 2, 3, 4]"
    },
    "pro_tip": "A standard basic interview check.",
    "company_tags": [
      "TCS",
      "Cognizant",
      "Wipro"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 91
  },
  {
    "id": "int-python-092",
    "topic_id": "topic-python",
    "title": "What is the 'pass' statement in Python?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "'pass' is a null statement (no-op). The Python parser requires a statement block after colons (def, class, if, try). 'pass' satisfies the syntax requirement without executing any code.",
    "bullet_points": [
      "Null statement / placeholder (no-op).",
      "Satisfies syntax requirements in empty functions, classes, and exception blocks.",
      "Replaced by implementation code during development."
    ],
    "code_snippet": {
      "language": "python",
      "code": "class CustomError(Exception):\n    pass # Valid empty class definition"
    },
    "pro_tip": "Clean placeholder in stubbed architectures.",
    "company_tags": [
      "TCS",
      "Infosys"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 92
  },
  {
    "id": "int-python-093",
    "topic_id": "topic-python",
    "title": "What is the difference between remove(), pop(), and clear() in Python lists?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "1. list.remove(val): Searches for the first occurrence of 'val' and deletes it. Raises ValueError if not found. Returns None.\n2. list.pop(index=-1): Removes and RETURNS the item at 'index' (default last element). Raises IndexError if empty.\n3. list.clear(): Removes all elements from the list in-place.",
    "bullet_points": [
      "remove(val) removes by value; raises ValueError if missing.",
      "pop(index) removes and returns element by index.",
      "clear() empties the entire list in-place."
    ],
    "code_snippet": {
      "language": "python",
      "code": "lst = ['a', 'b', 'c']\nitem = lst.pop(1) # Removes and returns 'b'\nlst.remove('a')   # Removes 'a'"
    },
    "pro_tip": "Always check: pop() returns the item; remove() returns None.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 93
  },
  {
    "id": "int-python-094",
    "topic_id": "topic-python",
    "title": "What is __file__ and __name__ == '__main__' in Python?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "1. __file__: Path to the currently executing script.\n2. if __name__ == '__main__':\n   - __name__ is set to '__main__' when the script is executed directly from the terminal.\n   - __name__ is set to the module name when imported by another script.\n   - Prevents code from running automatically when imported as a library.",
    "bullet_points": [
      "__name__ is '__main__' only when executed directly.",
      "Allows a file to act as both an executable script and an importable library.",
      "Guards entry point execution."
    ],
    "code_snippet": {
      "language": "python",
      "code": "if __name__ == '__main__':\n    print(\"Executed directly!\")"
    },
    "pro_tip": "Universal standard in all Python scripts.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Wipro",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 94
  },
  {
    "id": "int-python-095",
    "topic_id": "topic-python",
    "title": "What is the difference between string isdigit(), isnumeric(), and isdecimal()?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "1. isdecimal(): Strict Unicode decimals (0-9).\n2. isdigit(): Decimals plus superscripts and subscripts (e.g. 2\u00b2).\n3. isnumeric(): All numeric characters including fractions and Roman numerals (e.g. \u00bd).",
    "bullet_points": [
      "isdecimal: Strict base-10 digits (0-9).",
      "isdigit: Digits + superscripts/subscripts.",
      "isnumeric: All numeric glyphs (fractions, Roman numerals)."
    ],
    "code_snippet": {
      "language": "python",
      "code": "s = '\u00b2'\nprint(s.isdigit())   # True\nprint(s.isdecimal()) # False"
    },
    "pro_tip": "Good trivia for data preprocessing pipelines.",
    "company_tags": [
      "Google"
    ],
    "frequency": "MEDIUM",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 95
  },
  {
    "id": "int-python-096",
    "topic_id": "topic-python",
    "title": "What is the difference between range() in Python 2 and Python 3?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "1. Python 2: range() created and materialized a full list in memory. xrange() was the lazy generator version.\n2. Python 3: range() is an immutable sequence type that generates numbers on-demand (O(1) memory space). xrange() was removed.",
    "bullet_points": [
      "Python 2 range() created a full list in memory.",
      "Python 3 range() is an immutable lazy sequence type.",
      "Python 3 range consumes O(1) constant memory regardless of range size."
    ],
    "code_snippet": {
      "language": "python",
      "code": "r = range(1_000_000_000) # O(1) memory in Python 3!"
    },
    "pro_tip": "Highlight memory efficiency.",
    "company_tags": [
      "TCS",
      "Infosys"
    ],
    "frequency": "HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 96
  },
  {
    "id": "int-python-097",
    "topic_id": "topic-python",
    "title": "How does the 'assert' statement work in Python, and why should it NOT be used for security checks?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "assert condition, message raises AssertionError if condition is False.\n\nWhy It Must NOT Be Used for Security/Validation:\n- Running Python with the optimize flag (python -O or python -OO) STRIPS ALL ASSERT STATEMENTS FROM BYTECODE!\n- If you use assert to check user authentication or permissions, passing -O disables the checks completely, opening critical security bypasses!\n- Use: if not valid: raise PermissionError().",
    "bullet_points": [
      "assert raises AssertionError on False.",
      "Disabled completely when Python runs with optimization flags (python -O).",
      "Never use assert for production validation or security checks."
    ],
    "code_snippet": {
      "language": "python",
      "code": "# DANGEROUS SECURITY FLAW:\n# assert user.is_admin, \"Access denied\" # Stripped under python -O!\n\n# SECURE:\nif not user.is_admin:\n    raise PermissionError(\"Access denied\")"
    },
    "pro_tip": "A favorite cybersecurity question for backend Python engineers.",
    "company_tags": [
      "Amazon",
      "Google",
      "CrowdStrike"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 97
  },
  {
    "id": "int-python-098",
    "topic_id": "topic-python",
    "title": "What is the difference between join() and '+' for string concatenation?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "1. '+' Concatenation in Loops:\n   - Strings are immutable. In each loop iteration, '+' creates a new string object and copies all previous characters, resulting in O(n^2) quadratic time complexity.\n2. str.join(list):\n   - Calculates the exact total buffer length required in one pass.\n   - Allocates memory once and copies characters in O(n) linear time!\n   - Hundreds of times faster for large lists of strings.",
    "bullet_points": [
      "'+' in loops takes O(n^2) quadratic time due to repeated reallocations.",
      "str.join() allocates memory once and executes in O(n) linear time.",
      "Always use join() for concatenating collections of strings."
    ],
    "code_snippet": {
      "language": "python",
      "code": "words = [\"hello\", \"world\", \"python\"]\n# Fast and idiomatic:\nresult = \" \".join(words)"
    },
    "pro_tip": "Standard code review rule in all Python teams.",
    "company_tags": [
      "TCS",
      "Infosys",
      "Amazon"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "EASY",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 98
  },
  {
    "id": "int-python-099",
    "topic_id": "topic-python",
    "title": "What is a Generator's close() and throw() method?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "1. gen.close(): Terminates the generator by raising GeneratorExit inside it. If caught, the generator must exit or raise GeneratorExit.\n2. gen.throw(type, val): Raises an exception at the point where the generator was suspended, allowing the generator to catch and handle it.",
    "bullet_points": [
      "close() raises GeneratorExit to terminate generator.",
      "throw() raises an exception at the suspended yield point.",
      "Used for clean teardown of generator resources."
    ],
    "code_snippet": {
      "language": "python",
      "code": "def worker():\n    try:\n        while True: yield\n    finally:\n        print(\"Cleaned up\")\nw = worker(); next(w)\nw.close() # Prints 'Cleaned up'"
    },
    "pro_tip": "Part of advanced generator lifecycle management.",
    "company_tags": [
      "Google",
      "Microsoft"
    ],
    "frequency": "MEDIUM",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 99
  },
  {
    "id": "int-python-100",
    "topic_id": "topic-python",
    "title": "What is the difference between synchronous, multi-threaded, and asynchronous Python architectures?",
    "category": "CORE_CS",
    "subject": "PYTHON",
    "subject_label": "Python",
    "answer": "Summary of Python concurrency models:\n\n1. Synchronous: Sequential execution, blocking I/O. Simple, but throughput is limited to single-thread latency.\n2. Multi-threaded: Preemptive OS threads, GIL limits to single CPU core. Best for blocking I/O.\n3. Asynchronous (asyncio): Single-threaded cooperative event loop. Non-blocking I/O scaling to 100k+ concurrent connections with minimal RAM.\n4. Multiprocessing: Multiple OS processes, bypasses GIL for full multi-core CPU scaling.",
    "bullet_points": [
      "Synchronous: Blocking, single-threaded.",
      "Multi-threaded: I/O bound concurrent execution under GIL.",
      "Asynchronous: Event-driven cooperative non-blocking I/O.",
      "Multiprocessing: True multi-core parallelism bypassing GIL."
    ],
    "code_snippet": {
      "language": "python",
      "code": "# High-level architectural choice:\n# CPU heavy -> multiprocessing\n# Web scrapers / APIs -> asyncio\n# File conversion -> threading"
    },
    "pro_tip": "A perfect comprehensive conclusion to a Python systems interview.",
    "company_tags": [
      "Google",
      "Amazon",
      "Meta",
      "Microsoft"
    ],
    "frequency": "VERY_HIGH",
    "difficulty": "MEDIUM",
    "is_hidden": false,
    "is_deleted": false,
    "sort_order": 100
  }
];
