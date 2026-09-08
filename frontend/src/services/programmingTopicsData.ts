import type { ProgrammingTopic, ProgrammingProblem } from '@/types/technical';

export const PROGRAMMING_TOPICS: ProgrammingTopic[] = [
  {
    id: 'syntax-basics',
    title: 'Syntax & Operators',
    cluster: 'Stage 1: Foundations',
    description: 'Variables, data types, arithmetic & bitwise operators, ternary conditionals, and ASCII values.',
    iconName: 'Code2',
    category: 'SYNTAX_BASICS',
    order: 1,
  },
  {
    id: 'loops-conditions',
    title: 'Loops & Conditionals',
    cluster: 'Stage 1: Foundations',
    description: 'While and for loop mechanics, nested branches, digit extraction, and summation algorithms.',
    iconName: 'Terminal',
    category: 'SYNTAX_BASICS',
    order: 2,
  },
  {
    id: 'number-logic',
    title: 'Number Theory & Math',
    cluster: 'Stage 2: Logic Building',
    description: 'Prime check, Palindrome, Armstrong, Factorial, GCD/LCM, and Fibonacci sequences.',
    iconName: 'Hash',
    category: 'NUMBER_LOGIC',
    order: 3,
  },
  {
    id: 'patterns',
    title: 'Star & Number Patterns',
    cluster: 'Stage 2: Logic Building',
    description: 'Inverted pyramids, hollow diamonds, Floyd\'s triangle, Pascal\'s triangle, and nested loops.',
    iconName: 'Shuffle',
    category: 'PATTERNS',
    order: 4,
  },
  {
    id: 'arrays-basic',
    title: '1D Arrays (Fundamentals)',
    cluster: 'Stage 3: Core Data Structures',
    description: 'Min/Max, reverse in-place, sorted validation, frequency hashing, and linear scanning.',
    iconName: 'Layers',
    category: 'ARRAYS',
    order: 5,
  },
  {
    id: 'arrays-logic',
    title: '1D Arrays (Logic & Pointers)',
    cluster: 'Stage 3: Core Data Structures',
    description: 'Second largest, remove duplicates, left rotate by K, move zeroes, and missing number.',
    iconName: 'Sliders',
    category: 'ARRAYS',
    order: 6,
  },
  {
    id: 'matrices',
    title: '2D Arrays & Matrices',
    cluster: 'Stage 3: Core Data Structures',
    description: 'Matrix addition, transpose, rotate 90 degrees, row with max 1s, and spiral traversal.',
    iconName: 'Grid',
    category: 'ARRAYS',
    order: 7,
  },
  {
    id: 'strings-basic',
    title: 'Strings & Characters',
    cluster: 'Stage 4: Text Processing',
    description: 'Vowel/consonant counts, reverse string, palindrome string, and ASCII case toggling.',
    iconName: 'Type',
    category: 'STRINGS',
    order: 8,
  },
  {
    id: 'strings-logic',
    title: 'String Logic & Anagrams',
    cluster: 'Stage 4: Text Processing',
    description: 'Anagram check, string compression (RLE), longest common prefix, and substring search.',
    iconName: 'Sparkles',
    category: 'STRINGS',
    order: 9,
  },
  {
    id: 'recursion',
    title: 'Recursion & Backtracking',
    cluster: 'Stage 5: Advanced Logic',
    description: '1 to N recursion, Tower of Hanoi, recursive power, and power set generation.',
    iconName: 'Cpu',
    category: 'RECURSION',
    order: 10,
  },
  {
    id: 'searching-sorting',
    title: 'Searching & Sorting',
    cluster: 'Stage 5: Advanced Logic',
    description: 'Binary search (iterative/recursive), bubble sort, selection sort, and merge sort.',
    iconName: 'Search',
    category: 'SEARCHING_SORTING',
    order: 11,
  },
  {
    id: 'bit-manipulation',
    title: 'Bitwise Hacks & Math',
    cluster: 'Stage 5: Advanced Logic',
    description: 'Odd/even check, power of 2, count set bits, and single non-repeating number.',
    iconName: 'Binary',
    category: 'BIT_MANIPULATION',
    order: 12,
  },
];

export const PROGRAMMING_150_EXPANDED_SEED: ProgrammingProblem[] = [
  // ── 1. SYNTAX & OPERATORS ──
  {
    id: 'p150-1',
    title: 'Check Even or Odd without Modulo Operator',
    slug: 'check-even-or-odd-bitwise',
    track: 'PROGRAMMING_150',
    level: 'BASIC',
    category: 'SYNTAX_BASICS',
    categoryLabel: 'Basic Syntax & Operators',
    topicId: 'syntax-basics',
    description: 'Given an integer N, determine whether the number is Even or Odd without using the modulo (%) or division (/) operator.',
    constraints: ['-10^9 <= N <= 10^9'],
    sampleInput: 'N = 7',
    sampleOutput: 'Odd',
    explanation: 'The binary representation of 7 is 0111. The least significant bit (LSB) is 1. Performing bitwise AND with 1 (7 & 1) yields 1, signifying an odd number. For even numbers, LSB is always 0.',
    solutions: {
      java: `public class Solution {
    public static String checkEvenOdd(int n) {
        if ((n & 1) == 0) return "Even";
        return "Odd";
    }
}`,
      python: `def check_even_odd(n: int) -> str:
    return "Even" if (n & 1) == 0 else "Odd"`,
      cpp: `#include <string>

std::string checkEvenOdd(int n) {
    return (n & 1) == 0 ? "Even" : "Odd";
}`,
      c: `const char* checkEvenOdd(int n) {
    return (n & 1) == 0 ? "Even" : "Odd";
}`
    },
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    hints: ['Examine the binary format of integers. What distinguishes even from odd numbers at the lowest bit?'],
    companyTags: ['TCS', 'Wipro', 'Capgemini']
  },
  {
    id: 'p150-8',
    title: 'Leap Year Validation & Days in Month',
    slug: 'leap-year-validation',
    track: 'PROGRAMMING_150',
    level: 'BASIC',
    category: 'SYNTAX_BASICS',
    categoryLabel: 'Basic Syntax & Operators',
    topicId: 'syntax-basics',
    description: 'Given a calendar year Y, determine if it is a leap year. A year is leap if divisible by 400, or divisible by 4 but NOT divisible by 100.',
    constraints: ['1 <= Y <= 9999'],
    sampleInput: 'Y = 2024',
    sampleOutput: 'true',
    explanation: '2024 is divisible by 4 and not by 100, so it is a leap year. 1900 is divisible by 4 and 100, but not 400, so it is not a leap year.',
    solutions: {
      java: `public class Solution {
    public static boolean isLeapYear(int year) {
        return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
    }
}`,
      python: `def is_leap_year(year: int) -> bool:
    return (year % 400 == 0) or (year % 4 == 0 and year % 100 != 0)`,
      cpp: `bool isLeapYear(int year) {
    return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
}`,
      c: `int isLeapYear(int year) {
    return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
}`
    },
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    hints: ['Order the conditional checks carefully: check divisible by 400 first.'],
    companyTags: ['Infosys', 'Cognizant']
  },

  // ── 2. LOOPS & CONDITIONALS ──
  {
    id: 'p150-9',
    title: 'Digital Root: Sum of Digits until Single Digit',
    slug: 'digital-root-sum-of-digits',
    track: 'PROGRAMMING_150',
    level: 'BASIC',
    category: 'SYNTAX_BASICS',
    categoryLabel: 'Loops & Conditionals',
    topicId: 'loops-conditions',
    description: 'Given a non-negative integer N, repeatedly add all its digits until the result has only one digit.',
    constraints: ['0 <= N <= 10^9'],
    sampleInput: 'N = 38',
    sampleOutput: '2 (3 + 8 = 11 -> 1 + 1 = 2)',
    explanation: 'Can be solved using a while loop summing digits, or using the mathematical congruence formula: N == 0 ? 0 : 1 + (N - 1) % 9.',
    solutions: {
      java: `public class Solution {
    public static int addDigits(int num) {
        if (num == 0) return 0;
        return 1 + (num - 1) % 9;
    }
}`,
      python: `def add_digits(num: int) -> int:
    if num == 0:
        return 0
    return 1 + (num - 1) % 9`,
      cpp: `int addDigits(int num) {
        if (num == 0) return 0;
        return 1 + (num - 1) % 9;
}`,
      c: `int addDigits(int num) {
    if (num == 0) return 0;
    return 1 + (num - 1) % 9;
}`
    },
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    hints: ['Think about modulo 9 arithmetic for digital roots.'],
    companyTags: ['Amazon', 'TCS Prime']
  },

  // ── 3. NUMBER THEORY & MATH ──
  {
    id: 'p150-2',
    title: 'Reverse a Number and Check Palindrome',
    slug: 'reverse-number-palindrome',
    track: 'PROGRAMMING_150',
    level: 'BASIC',
    category: 'NUMBER_LOGIC',
    categoryLabel: 'Number Theory & Logic',
    topicId: 'number-logic',
    description: 'Given an integer N, reverse its digits and determine if it is a palindrome. Note that negative numbers are not considered palindromes.',
    constraints: ['0 <= N <= 10^9'],
    sampleInput: 'N = 1221',
    sampleOutput: 'Reversed: 1221, Is Palindrome: true',
    explanation: 'Extract digits using modulo 10 and build the reversed number by multiplying the running sum by 10. Finally, compare with original number.',
    solutions: {
      java: `public class Solution {
    public static boolean isPalindrome(int n) {
        if (n < 0) return false;
        int original = n;
        long reversed = 0;
        while (n > 0) {
            reversed = reversed * 10 + (n % 10);
            n /= 10;
        }
        return original == (int) reversed;
    }
}`,
      python: `def is_palindrome(n: int) -> bool:
    if n < 0: return False
    original, rev = n, 0
    while n > 0:
        rev = rev * 10 + (n % 10)
        n //= 10
    return original == rev`,
      cpp: `bool isPalindrome(int n) {
    if (n < 0) return false;
    long original = n, rev = 0;
    while (n > 0) {
        rev = rev * 10 + (n % 10);
        n /= 10;
    }
    return original == rev;
}`,
      c: `int isPalindrome(int n) {
    if (n < 0) return 0;
    long original = n, rev = 0;
    while (n > 0) {
        rev = rev * 10 + (n % 10);
        n /= 10;
    }
    return original == rev;
}`
    },
    timeComplexity: 'O(log10(N))',
    spaceComplexity: 'O(1)',
    hints: ['Extract last digit with % 10, then discard with / 10.'],
    companyTags: ['Infosys', 'Cognizant', 'TCS']
  },
  {
    id: 'p150-3',
    title: 'Check Armstrong Number (Narcissistic Number)',
    slug: 'armstrong-number',
    track: 'PROGRAMMING_150',
    level: 'BASIC',
    category: 'NUMBER_LOGIC',
    categoryLabel: 'Number Theory & Logic',
    topicId: 'number-logic',
    description: 'An Armstrong number of order K is a number that is the sum of its own digits each raised to the power of the total number of digits (K). Return true if N is an Armstrong number, otherwise false.',
    constraints: ['1 <= N <= 10^8'],
    sampleInput: 'N = 153',
    sampleOutput: 'true',
    explanation: '153 has 3 digits. 1^3 + 5^3 + 3^3 = 1 + 125 + 27 = 153. Hence, 153 is an Armstrong number.',
    solutions: {
      java: `public class Solution {
    public static boolean isArmstrong(int n) {
        int original = n, digits = String.valueOf(n).length();
        long sum = 0, temp = n;
        while (temp > 0) {
            sum += Math.pow(temp % 10, digits);
            temp /= 10;
        }
        return sum == original;
    }
}`,
      python: `def is_armstrong(n: int) -> bool:
    s = str(n)
    d = len(s)
    return sum(int(c) ** d for c in s) == n`,
      cpp: `#include <cmath>

bool isArmstrong(int n) {
    int original = n, digits = 0, temp = n;
    while (temp > 0) { digits++; temp /= 10; }
    long long sum = 0; temp = n;
    while (temp > 0) {
        sum += std::pow(temp % 10, digits);
        temp /= 10;
    }
    return sum == original;
}`,
      c: `#include <math.h>

int isArmstrong(int n) {
    int original = n, digits = 0, temp = n;
    while (temp > 0) { digits++; temp /= 10; }
    long long sum = 0; temp = n;
    while (temp > 0) {
        sum += (long long)pow(temp % 10, digits);
        temp /= 10;
    }
    return sum == original;
}`
    },
    timeComplexity: 'O(log10(N))',
    spaceComplexity: 'O(1)',
    hints: ['First count digits, then accumulate sum of power of each digit.'],
    companyTags: ['Accenture', 'TCS', 'HCL']
  },
  {
    id: 'p150-10',
    title: 'Greatest Common Divisor (GCD) & LCM (Euclidean Algorithm)',
    slug: 'gcd-lcm-euclidean',
    track: 'PROGRAMMING_150',
    level: 'BASIC',
    category: 'NUMBER_LOGIC',
    categoryLabel: 'Number Theory & Logic',
    topicId: 'number-logic',
    description: 'Given two integers A and B, compute their Greatest Common Divisor (GCD) and Lowest Common Multiple (LCM) using Euclidean algorithm.',
    constraints: ['1 <= A, B <= 10^9'],
    sampleInput: 'A = 24, B = 36',
    sampleOutput: 'GCD = 12, LCM = 72',
    explanation: 'GCD(A, B) = GCD(B, A % B) until B becomes 0. LCM is computed using the identity: LCM(A, B) = (A * B) / GCD(A, B).',
    solutions: {
      java: `public class Solution {
    public static long gcd(long a, long b) {
        while (b != 0) {
            long temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
    public static long lcm(long a, long b) {
        return (a / gcd(a, b)) * b;
    }
}`,
      python: `def gcd(a: int, b: int) -> int:
    while b:
        a, b = b, a % b
    return a

def lcm(a: int, b: int) -> int:
    return (a // gcd(a, b)) * b`,
      cpp: `long long gcd(long long a, long long b) {
    while (b != 0) {
        long long temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

long long lcm(long long a, long long b) {
    return (a / gcd(a, b)) * b;
}`,
      c: `long long gcd(long long a, long long b) {
    while (b != 0) {
        long long temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

long long lcm(long long a, long long b) {
    return (a / gcd(a, b)) * b;
}`
    },
    timeComplexity: 'O(log(min(A, B)))',
    spaceComplexity: 'O(1)',
    hints: ['Divide before multiplying when computing LCM to avoid integer overflow.'],
    companyTags: ['Wipro', 'TCS', 'Cognizant']
  },
  {
    id: 'p150-23',
    title: 'Prime Number Check in O(sqrt(N))',
    slug: 'prime-number-check-sqrt',
    track: 'PROGRAMMING_150',
    level: 'BASIC',
    category: 'NUMBER_LOGIC',
    categoryLabel: 'Number Theory & Logic',
    topicId: 'number-logic',
    description: 'Given an integer N, determine if it is a prime number in O(sqrt(N)) time complexity.',
    constraints: ['1 <= N <= 10^12'],
    sampleInput: 'N = 29',
    sampleOutput: 'true',
    explanation: 'A number is prime if it has no divisors other than 1 and itself. Any composite number must have a factor <= sqrt(N). We only test numbers of form 6k +/- 1.',
    solutions: {
      java: `public class Solution {
    public static boolean isPrime(long n) {
        if (n <= 1) return false;
        if (n <= 3) return true;
        if (n % 2 == 0 || n % 3 == 0) return false;
        for (long i = 5; i * i <= n; i += 6) {
            if (n % i == 0 || n % (i + 2) == 0) return false;
        }
        return true;
    }
}`,
      python: `def is_prime(n: int) -> bool:
    if n <= 1: return False
    if n <= 3: return True
    if n % 2 == 0 or n % 3 == 0: return False
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    return True`,
      cpp: `bool isPrime(long long n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 == 0 || n % 3 == 0) return false;
    for (long long i = 5; i * i <= n; i += 6) {
        if (n % i == 0 || n % (i + 2) == 0) return false;
    }
    return true;
}`,
      c: `int isPrime(long long n) {
    if (n <= 1) return 0;
    if (n <= 3) return 1;
    if (n % 2 == 0 || n % 3 == 0) return 0;
    for (long long i = 5; i * i <= n; i += 6) {
        if (n % i == 0 || n % (i + 2) == 0) return 0;
    }
    return 1;
}`
    },
    timeComplexity: 'O(sqrt(N))',
    spaceComplexity: 'O(1)',
    hints: ['Check divisibility by 2 and 3 first, then check steps of 6 (6k +/- 1).'],
    companyTags: ['TCS Digital', 'Accenture', 'Infosys']
  },

  // ── 4. STAR & NUMBER PATTERNS ──
  {
    id: 'p150-4',
    title: 'Print Inverted Pyramid & Hollow Diamond Patterns',
    slug: 'star-patterns-hollow-pyramid',
    track: 'PROGRAMMING_150',
    level: 'MEDIUM',
    category: 'PATTERNS',
    categoryLabel: 'Pattern Printing & Nested Loops',
    topicId: 'patterns',
    description: 'Given an integer N, generate an inverted pyramid of stars where row i contains (2*(N-i) - 1) stars preceded by i spaces.',
    constraints: ['1 <= N <= 20'],
    sampleInput: 'N = 4',
    sampleOutput: `*******\n *****\n  ***\n   *`,
    explanation: 'For row i from 0 to N-1, print i spaces followed by 2*(N-i) - 1 asterisks.',
    solutions: {
      java: `public class Solution {
    public static void printInvertedPyramid(int n) {
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < i; j++) System.out.print(" ");
            for (int k = 0; k < 2 * (n - i) - 1; k++) System.out.print("*");
            System.out.println();
        }
    }
}`,
      python: `def print_inverted_pyramid(n: int):
    for i in range(n):
        print(" " * i + "*" * (2 * (n - i) - 1))`,
      cpp: `#include <iostream>

void printInvertedPyramid(int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++) std::cout << " ";
        for (int k = 0; k < 2 * (n - i) - 1; k++) std::cout << "*";
        std::cout << "\\n";
    }
}`,
      c: `#include <stdio.h>

void printInvertedPyramid(int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++) printf(" ");
        for (int k = 0; k < 2 * (n - i) - 1; k++) printf("*");
        printf("\\n");
    }
}`
    },
    timeComplexity: 'O(N^2)',
    spaceComplexity: 'O(1)',
    hints: ['Analyze the formula for spaces (i) and stars (2*(N-i) - 1) for each row i.'],
    companyTags: ['Capgemini', 'Wipro', 'Infosys']
  },
  {
    id: 'p150-11',
    title: 'Pascal\'s Triangle N-th Row Generation',
    slug: 'pascals-triangle-row',
    track: 'PROGRAMMING_150',
    level: 'MEDIUM',
    category: 'PATTERNS',
    categoryLabel: 'Pattern Printing & Nested Loops',
    topicId: 'patterns',
    description: 'Given row index N (0-indexed), return the N-th row of Pascal\'s triangle in O(N) time without calculating complete factorials.',
    constraints: ['0 <= N <= 30'],
    sampleInput: 'N = 4',
    sampleOutput: '[1, 4, 6, 4, 1]',
    explanation: 'Each element is C(n, k). The next element can be derived from the previous: element = prev * (n - k + 1) / k.',
    solutions: {
      java: `import java.util.*;

public class Solution {
    public static List<Integer> getRow(int rowIndex) {
        List<Integer> row = new ArrayList<>();
        long val = 1;
        row.add(1);
        for (int i = 1; i <= rowIndex; i++) {
            val = val * (rowIndex - i + 1) / i;
            row.add((int) val);
        }
        return row;
    }
}`,
      python: `def get_row(row_index: int) -> list[int]:
    row = [1]
    val = 1
    for i in range(1, row_index + 1):
        val = val * (row_index - i + 1) // i
        row.append(val)
    return row`,
      cpp: `#include <vector>

std::vector<int> getRow(int rowIndex) {
    std::vector<int> row;
    row.push_back(1);
    long long val = 1;
    for (int i = 1; i <= rowIndex; i++) {
        val = val * (rowIndex - i + 1) / i;
        row.push_back(val);
    }
    return row;
}`,
      c: `void getRow(int rowIndex, int* result) {
    result[0] = 1;
    long long val = 1;
    for (int i = 1; i <= rowIndex; i++) {
        val = val * (rowIndex - i + 1) / i;
        result[i] = (int)val;
    }
}`
    },
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1) auxiliary',
    hints: ['Compute next element from current: next = current * (N - k) / (k + 1).'],
    companyTags: ['Amazon', 'Infosys SP', 'TCS Prime']
  },

  // ── 5. 1D ARRAYS (FUNDAMENTALS) ──
  {
    id: 'p150-12',
    title: 'Reverse an Array In-Place (Two Pointers)',
    slug: 'reverse-array-in-place',
    track: 'PROGRAMMING_150',
    level: 'BASIC',
    category: 'ARRAYS',
    categoryLabel: 'Arrays & Vectors',
    topicId: 'arrays-basic',
    description: 'Given an array of integers, reverse the array in-place without allocating extra space for another array.',
    constraints: ['1 <= N <= 10^5'],
    sampleInput: 'arr = [1, 2, 3, 4, 5]',
    sampleOutput: '[5, 4, 3, 2, 1]',
    explanation: 'Use two pointers: left at 0 and right at N-1. Swap elements at left and right, then increment left and decrement right until left >= right.',
    solutions: {
      java: `public class Solution {
    public static void reverseArray(int[] arr) {
        int left = 0, right = arr.length - 1;
        while (left < right) {
            int temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;
            left++;
            right--;
        }
    }
}`,
      python: `def reverse_array(arr: list[int]):
    left, right = 0, len(arr) - 1
    while left < right:
        arr[left], arr[right] = arr[right], arr[left]
        left += 1
        right -= 1`,
      cpp: `#include <vector>

void reverseArray(std::vector<int>& arr) {
    int left = 0, right = arr.size() - 1;
    while (left < right) {
        std::swap(arr[left++], arr[right--]);
    }
}`,
      c: `void reverseArray(int arr[], int n) {
    int left = 0, right = n - 1;
    while (left < right) {
        int temp = arr[left];
        arr[left] = arr[right];
        arr[right] = temp;
        left++; right--;
    }
}`
    },
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    hints: ['Initialize two pointers at opposite ends and swap towards the middle.'],
    companyTags: ['TCS', 'Cognizant', 'Accenture']
  },

  // ── 6. 1D ARRAYS (LOGIC & POINTERS) ──
  {
    id: 'p150-5',
    title: 'Find Second Largest Element in Array (Single Pass)',
    slug: 'second-largest-element-single-pass',
    track: 'PROGRAMMING_150',
    level: 'MEDIUM',
    category: 'ARRAYS',
    categoryLabel: 'Arrays & Vectors',
    topicId: 'arrays-logic',
    description: 'Given an array of integers of size N, find the second largest distinct element without sorting the array.',
    constraints: ['2 <= N <= 10^5', '-10^9 <= arr[i] <= 10^9'],
    sampleInput: 'arr = [12, 35, 1, 10, 34, 1]',
    sampleOutput: '34',
    explanation: 'Maintain two variables: largest and secondLargest. If arr[i] > largest, update secondLargest = largest and largest = arr[i]. Else if arr[i] > secondLargest and arr[i] != largest, update secondLargest.',
    solutions: {
      java: `public class Solution {
    public static int getSecondLargest(int[] arr) {
        int largest = Integer.MIN_VALUE, secondLargest = Integer.MIN_VALUE;
        for (int num : arr) {
            if (num > largest) {
                secondLargest = largest;
                largest = num;
            } else if (num > secondLargest && num != largest) {
                secondLargest = num;
            }
        }
        return secondLargest == Integer.MIN_VALUE ? -1 : secondLargest;
    }
}`,
      python: `def get_second_largest(arr: list[int]) -> int:
    largest = second = float('-inf')
    for num in arr:
        if num > largest:
            second, largest = largest, num
        elif num > second and num != largest:
            second = num
    return -1 if second == float('-inf') else second`,
      cpp: `#include <vector>
#include <climits>

int getSecondLargest(const std::vector<int>& arr) {
    int largest = INT_MIN, secondLargest = INT_MIN;
    for (int num : arr) {
        if (num > largest) {
            secondLargest = largest;
            largest = num;
        } else if (num > secondLargest && num != largest) {
            secondLargest = num;
        }
    }
    return secondLargest == INT_MIN ? -1 : secondLargest;
}`,
      c: `#include <limits.h>

int getSecondLargest(int arr[], int n) {
    int largest = INT_MIN, secondLargest = INT_MIN;
    for (int i = 0; i < n; i++) {
        if (arr[i] > largest) {
            secondLargest = largest;
            largest = arr[i];
        } else if (arr[i] > secondLargest && arr[i] != largest) {
            secondLargest = arr[i];
        }
    }
    return secondLargest == INT_MIN ? -1 : secondLargest;
}`
    },
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    hints: ['Keep track of both largest and second largest simultaneously in a single iteration.'],
    companyTags: ['TCS Digital', 'Cognizant GenC Next', 'Amazon']
  },
  {
    id: 'p150-13',
    title: 'Left Rotate Array by K Places (Reversal Algorithm)',
    slug: 'rotate-array-k-places',
    track: 'PROGRAMMING_150',
    level: 'MEDIUM',
    category: 'ARRAYS',
    categoryLabel: 'Arrays & Vectors',
    topicId: 'arrays-logic',
    description: 'Given an array of size N, rotate the array to the left by K steps in O(N) time and O(1) extra space.',
    constraints: ['1 <= N <= 10^5', '0 <= K <= 10^9'],
    sampleInput: 'arr = [1, 2, 3, 4, 5], K = 2',
    sampleOutput: '[3, 4, 5, 1, 2]',
    explanation: '1) Reverse first K elements [0..K-1]. 2) Reverse remaining elements [K..N-1]. 3) Reverse whole array [0..N-1].',
    solutions: {
      java: `public class Solution {
    public static void rotateLeft(int[] arr, int k) {
        int n = arr.length;
        k %= n;
        reverse(arr, 0, k - 1);
        reverse(arr, k, n - 1);
        reverse(arr, 0, n - 1);
    }
    private static void reverse(int[] arr, int l, int r) {
        while (l < r) {
            int t = arr[l]; arr[l] = arr[r]; arr[r] = t;
            l++; r--;
        }
    }
}`,
      python: `def rotate_left(arr: list[int], k: int):
    n = len(arr)
    k %= n
    def rev(l, r):
        while l < r:
            arr[l], arr[r] = arr[r], arr[l]
            l += 1; r -= 1
    rev(0, k - 1)
    rev(k, n - 1)
    rev(0, n - 1)`,
      cpp: `#include <vector>
#include <algorithm>

void rotateLeft(std::vector<int>& arr, int k) {
    int n = arr.size();
    k %= n;
    std::reverse(arr.begin(), arr.begin() + k);
    std::reverse(arr.begin() + k, arr.end());
    std::reverse(arr.begin(), arr.end());
}`,
      c: `void reverseRange(int arr[], int l, int r) {
    while (l < r) {
        int t = arr[l]; arr[l] = arr[r]; arr[r] = t;
        l++; r--;
    }
}
void rotateLeft(int arr[], int n, int k) {
    k %= n;
    reverseRange(arr, 0, k - 1);
    reverseRange(arr, k, n - 1);
    reverseRange(arr, 0, n - 1);
}`
    },
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    hints: ['Handle K > N by performing K = K % N first.'],
    companyTags: ['Infosys', 'Capgemini', 'TCS Prime']
  },

  // ── 7. 2D ARRAYS & MATRICES ──
  {
    id: 'p150-14',
    title: 'Transpose & Rotate Matrix by 90 Degrees Clockwise',
    slug: 'rotate-matrix-90-degrees',
    track: 'PROGRAMMING_150',
    level: 'MEDIUM',
    category: 'ARRAYS',
    categoryLabel: '2D Arrays & Matrix Traversal',
    topicId: 'matrices',
    description: 'Given an N x N 2D matrix, rotate the matrix by 90 degrees clockwise in-place without allocating a second matrix.',
    constraints: ['1 <= N <= 500'],
    sampleInput: 'matrix = [[1, 2], [3, 4]]',
    sampleOutput: '[[3, 1], [4, 2]]',
    explanation: 'Two-step in-place transformation: 1) Transpose matrix (swap matrix[i][j] with matrix[j][i]). 2) Reverse each individual row.',
    solutions: {
      java: `public class Solution {
    public static void rotate(int[][] matrix) {
        int n = matrix.length;
        // Step 1: Transpose
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int temp = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = temp;
            }
        }
        // Step 2: Reverse rows
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n / 2; j++) {
                int temp = matrix[i][j];
                matrix[i][j] = matrix[i][n - 1 - j];
                matrix[i][n - 1 - j] = temp;
            }
        }
    }
}`,
      python: `def rotate_matrix(matrix: list[list[int]]):
    n = len(matrix)
    # Transpose
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    # Reverse rows
    for row in matrix:
        row.reverse()`,
      cpp: `#include <vector>
#include <algorithm>

void rotate(std::vector<std::vector<int>>& matrix) {
    int n = matrix.size();
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            std::swap(matrix[i][j], matrix[j][i]);
        }
    }
    for (int i = 0; i < n; i++) {
        std::reverse(matrix[i].begin(), matrix[i].end());
    }
}`,
      c: `void rotate(int n, int matrix[n][n]) {
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            int temp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = temp;
        }
    }
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n / 2; j++) {
            int temp = matrix[i][j];
            matrix[i][j] = matrix[i][n - 1 - j];
            matrix[i][n - 1 - j] = temp;
        }
    }
}`
    },
    timeComplexity: 'O(N^2)',
    spaceComplexity: 'O(1)',
    hints: ['Transpose swaps rows into columns; reversing rows completes the 90° clockwise rotation.'],
    companyTags: ['Amazon', 'Microsoft', 'TCS Prime']
  },

  // ── 8. STRINGS & CHARACTERS ──
  {
    id: 'p150-15',
    title: 'Count Vowels, Consonants, Digits & Spaces in String',
    slug: 'count-character-types-string',
    track: 'PROGRAMMING_150',
    level: 'BASIC',
    category: 'STRINGS',
    categoryLabel: 'Strings & Character Arrays',
    topicId: 'strings-basic',
    description: 'Given a string S, compute the count of vowels, consonants, numerical digits, and whitespace characters.',
    constraints: ['1 <= S.length <= 10^5'],
    sampleInput: 'S = "TCS NQT 2026 Batch!"',
    sampleOutput: 'Vowels: 1, Consonants: 5, Digits: 4, Spaces: 3',
    explanation: 'Iterate through each character, convert to lowercase for uniform check, and classify using ASCII ranges or set containment.',
    solutions: {
      java: `public class Solution {
    public static int[] countTypes(String s) {
        int vowels = 0, consonants = 0, digits = 0, spaces = 0;
        String vStr = "aeiouAEIOU";
        for (char c : s.toCharArray()) {
            if (Character.isDigit(c)) digits++;
            else if (Character.isWhitespace(c)) spaces++;
            else if (Character.isLetter(c)) {
                if (vStr.indexOf(c) != -1) vowels++;
                else consonants++;
            }
        }
        return new int[]{vowels, consonants, digits, spaces};
    }
}`,
      python: `def count_types(s: str) -> dict:
    vowels = consonants = digits = spaces = 0
    v_set = set("aeiouAEIOU")
    for c in s:
        if c.isdigit(): digits += 1
        elif c.isspace(): spaces += 1
        elif c.isalpha():
            if c in v_set: vowels += 1
            else: consonants += 1
    return {"vowels": vowels, "consonants": consonants, "digits": digits, "spaces": spaces}`,
      cpp: `#include <string>
#include <cctype>

struct Counts { int vowels, consonants, digits, spaces; };
Counts countTypes(const std::string& s) {
    Counts c{0, 0, 0, 0};
    for (char ch : s) {
        if (std::isdigit(ch)) c.digits++;
        else if (std::isspace(ch)) c.spaces++;
        else if (std::isalpha(ch)) {
            char lower = std::tolower(ch);
            if (lower == 'a' || lower == 'e' || lower == 'i' || lower == 'o' || lower == 'u')
                c.vowels++;
            else c.consonants++;
        }
    }
    return c;
}`,
      c: `#include <ctype.h>

void countTypes(const char* s, int* v, int* c, int* d, int* sp) {
    *v = *c = *d = *sp = 0;
    while (*s) {
        if (isdigit(*s)) (*d)++;
        else if (isspace(*s)) (*sp)++;
        else if (isalpha(*s)) {
            char low = tolower(*s);
            if (low == 'a' || low == 'e' || low == 'i' || low == 'o' || low == 'u') (*v)++;
            else (*c)++;
        }
        s++;
    }
}`
    },
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    hints: ['Check if character is an alphabet before classifying into vowel vs consonant.'],
    companyTags: ['Wipro', 'Infosys', 'Cognizant']
  },

  // ── 9. STRING LOGIC & ANAGRAMS ──
  {
    id: 'p150-6',
    title: 'Valid Anagram Check (Frequency Hash)',
    slug: 'valid-anagram-check',
    track: 'PROGRAMMING_150',
    level: 'MEDIUM',
    category: 'STRINGS',
    categoryLabel: 'Strings & Character Arrays',
    topicId: 'strings-logic',
    description: 'Given two strings s and t, return true if t is an anagram of s (contains the exact same characters with the exact same frequencies), and false otherwise.',
    constraints: ['1 <= s.length, t.length <= 5 * 10^4', 's and t contain lowercase English letters.'],
    sampleInput: 's = "anagram", t = "nagaram"',
    sampleOutput: 'true',
    explanation: 'Use a fixed array of size 26 to count character frequencies. Increment for s and decrement for t. If all 26 buckets are 0, they are anagrams.',
    solutions: {
      java: `public class Solution {
    public static boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] count = new int[26];
        for (int i = 0; i < s.length(); i++) {
            count[s.charAt(i) - 'a']++;
            count[t.charAt(i) - 'a']--;
        }
        for (int c : count) {
            if (c != 0) return false;
        }
        return true;
    }
}`,
      python: `def is_anagram(s: str, t: str) -> bool:
    if len(s) != len(t): return False
    count = [0] * 26
    for c1, c2 in zip(s, t):
        count[ord(c1) - ord('a')] += 1
        count[ord(c2) - ord('a')] -= 1
    return all(c == 0 for c in count)`,
      cpp: `#include <string>

bool isAnagram(const std::string& s, const std::string& t) {
    if (s.length() != t.length()) return false;
    int count[26] = {0};
    for (size_t i = 0; i < s.length(); i++) {
        count[s[i] - 'a']++;
        count[t[i] - 'a']--;
    }
    for (int c : count) {
        if (c != 0) return false;
    }
    return true;
}`,
      c: `#include <string.h>

int isAnagram(const char* s, const char* t) {
    if (strlen(s) != strlen(t)) return 0;
    int count[26] = {0};
    for (int i = 0; s[i]; i++) {
        count[s[i] - 'a']++;
        count[t[i] - 'a']--;
    }
    for (int i = 0; i < 26; i++) {
        if (count[i] != 0) return 0;
    }
    return 1;
}`
    },
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1) [Fixed 26 buckets]',
    hints: ['Since input is limited to lowercase English letters, a 26-size integer array is optimal.'],
    companyTags: ['Amazon', 'Infosys', 'TCS']
  },
  {
    id: 'p150-16',
    title: 'String Compression (Run-Length Encoding)',
    slug: 'string-compression-rle',
    track: 'PROGRAMMING_150',
    level: 'MEDIUM',
    category: 'STRINGS',
    categoryLabel: 'Strings & Character Arrays',
    topicId: 'strings-logic',
    description: 'Given a character array chars, compress it using Run-Length Encoding: for each group of consecutive repeating characters, write character followed by count if count > 1.',
    constraints: ['1 <= chars.length <= 2000'],
    sampleInput: 'chars = ["a","a","b","b","c","c","c"]',
    sampleOutput: '["a","2","b","2","c","3"] (length = 6)',
    explanation: 'Use two pointers (i for reading groups and writeIndex for placing compressed result in-place).',
    solutions: {
      java: `public class Solution {
    public static int compress(char[] chars) {
        int write = 0, i = 0;
        while (i < chars.length) {
            char curr = chars[i];
            int count = 0;
            while (i < chars.length && chars[i] == curr) {
                i++; count++;
            }
            chars[write++] = curr;
            if (count > 1) {
                for (char c : String.valueOf(count).toCharArray()) {
                    chars[write++] = c;
                }
            }
        }
        return write;
    }
}`,
      python: `def compress(chars: list[str]) -> int:
    write = 0
    i = 0
    n = len(chars)
    while i < n:
        curr = chars[i]
        count = 0
        while i < n and chars[i] == curr:
            i += 1
            count += 1
        chars[write] = curr
        write += 1
        if count > 1:
            for c in str(count):
                chars[write] = c
                write += 1
    return write`,
      cpp: `#include <vector>
#include <string>

int compress(std::vector<char>& chars) {
    int write = 0, i = 0, n = chars.size();
    while (i < n) {
        char curr = chars[i];
        int count = 0;
        while (i < n && chars[i] == curr) { i++; count++; }
        chars[write++] = curr;
        if (count > 1) {
            for (char c : std::to_string(count)) chars[write++] = c;
        }
    }
    return write;
}`,
      c: `#include <stdio.h>

int compress(char* chars, int charsSize) {
    int write = 0, i = 0;
    while (i < charsSize) {
        char curr = chars[i];
        int count = 0;
        while (i < charsSize && chars[i] == curr) { i++; count++; }
        chars[write++] = curr;
        if (count > 1) {
            char buf[12];
            int len = sprintf(buf, "%d", count);
            for (int k = 0; k < len; k++) chars[write++] = buf[k];
        }
    }
    return write;
}`
    },
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    hints: ['Count consecutive occurrences and append count digits individually.'],
    companyTags: ['Microsoft', 'Amazon', 'TCS Prime']
  },

  // ── 10. RECURSION & BACKTRACKING ──
  {
    id: 'p150-7',
    title: 'Generate All Subsets / Power Set (Backtracking & Bitmask)',
    slug: 'power-set-subsets',
    track: 'PROGRAMMING_150',
    level: 'HARD',
    category: 'RECURSION',
    categoryLabel: 'Recursion & Backtracking',
    topicId: 'recursion',
    description: 'Given an integer array nums of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets.',
    constraints: ['1 <= nums.length <= 10', '-10 <= nums[i] <= 10'],
    sampleInput: 'nums = [1, 2, 3]',
    sampleOutput: '[[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]',
    explanation: 'For each element, we have two choices: include it in the current subset or exclude it. Using backtracking, we explore both choices recursively.',
    solutions: {
      java: `import java.util.*;

public class Solution {
    public static List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(nums, 0, new ArrayList<>(), result);
        return result;
    }
    private static void backtrack(int[] nums, int start, List<Integer> current, List<List<Integer>> result) {
        result.add(new ArrayList<>(current));
        for (int i = start; i < nums.length; i++) {
            current.add(nums[i]);
            backtrack(nums, i + 1, current, result);
            current.remove(current.size() - 1);
        }
    }
}`,
      python: `def subsets(nums: list[int]) -> list[list[int]]:
    result = []
    def backtrack(start, current):
        result.append(list(current))
        for i in range(start, len(nums)):
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()
    backtrack(0, [])
    return result`,
      cpp: `#include <vector>

void backtrack(const std::vector<int>& nums, int start, std::vector<int>& current, std::vector<std::vector<int>>& result) {
    result.push_back(current);
    for (size_t i = start; i < nums.size(); i++) {
        current.push_back(nums[i]);
        backtrack(nums, i + 1, current, result);
        current.pop_back();
    }
}
std::vector<std::vector<int>> subsets(const std::vector<int>& nums) {
    std::vector<std::vector<int>> result;
    std::vector<int> current;
    backtrack(nums, 0, current, result);
    return result;
}`,
      c: `// Backtracking logic in C uses dynamic array buffer
// See C++ implementation for exact iterative state`
    },
    timeComplexity: 'O(2^N)',
    spaceComplexity: 'O(N) recursion stack',
    hints: ['At each index, decide whether to include the element or skip it.'],
    companyTags: ['TCS Prime', 'Amazon', 'Microsoft']
  },
  {
    id: 'p150-17',
    title: 'Tower of Hanoi: Recursive Movement Steps',
    slug: 'tower-of-hanoi-steps',
    track: 'PROGRAMMING_150',
    level: 'MEDIUM',
    category: 'RECURSION',
    categoryLabel: 'Recursion & Backtracking',
    topicId: 'recursion',
    description: 'Solve the Tower of Hanoi puzzle with N disks using 3 rods (Source A, Auxiliary B, Destination C). Total moves required is 2^N - 1.',
    constraints: ['1 <= N <= 16'],
    sampleInput: 'N = 3, Source = "A", Aux = "B", Dest = "C"',
    sampleOutput: '7 moves: Move disk 1 from A to C, Move disk 2 from A to B...',
    explanation: '1) Move N-1 disks from Source to Aux using Dest. 2) Move disk N from Source to Dest. 3) Move N-1 disks from Aux to Dest using Source.',
    solutions: {
      java: `public class Solution {
    public static void hanoi(int n, char from, char aux, char to) {
        if (n == 0) return;
        hanoi(n - 1, from, to, aux);
        System.out.println("Move disk " + n + " from " + from + " to " + to);
        hanoi(n - 1, aux, from, to);
    }
}`,
      python: `def hanoi(n: int, from_rod: str, aux_rod: str, to_rod: str):
    if n == 0:
        return
    hanoi(n - 1, from_rod, to_rod, aux_rod)
    print(f"Move disk {n} from {from_rod} to {to_rod}")
    hanoi(n - 1, aux_rod, from_rod, to_rod)`,
      cpp: `#include <iostream>

void hanoi(int n, char from, char aux, char to) {
    if (n == 0) return;
    hanoi(n - 1, from, to, aux);
    std::cout << "Move disk " << n << " from " << from << " to " << to << "\\n";
    hanoi(n - 1, aux, from, to);
}`,
      c: `#include <stdio.h>

void hanoi(int n, char from, char aux, char to) {
    if (n == 0) return;
    hanoi(n - 1, from, to, aux);
    printf("Move disk %d from %c to %c\\n", n, from, to);
    hanoi(n - 1, aux, from, to);
}`
    },
    timeComplexity: 'O(2^N)',
    spaceComplexity: 'O(N) recursion stack',
    hints: ['Break problem into moving N-1 disks to helper peg, then moving bottom disk.'],
    companyTags: ['Cognizant', 'Wipro', 'Capgemini']
  },

  // ── 11. SEARCHING & SORTING ──
  {
    id: 'p150-18',
    title: 'Binary Search (Iterative & Recursive with Overflow Prevention)',
    slug: 'binary-search-iterative-recursive',
    track: 'PROGRAMMING_150',
    level: 'BASIC',
    category: 'SEARCHING_SORTING',
    categoryLabel: 'Searching & Sorting Algorithms',
    topicId: 'searching-sorting',
    description: 'Given a sorted array of distinct integers arr and a target value, return the index of target if found, otherwise return -1.',
    constraints: ['1 <= arr.length <= 10^5', '-10^9 <= arr[i], target <= 10^9'],
    sampleInput: 'arr = [-1, 0, 3, 5, 9, 12], target = 9',
    sampleOutput: '4',
    explanation: 'Divide search space in half each time by comparing target with middle element. Calculate mid as low + (high - low) / 2 to prevent 32-bit integer overflow.',
    solutions: {
      java: `public class Solution {
    public static int search(int[] nums, int target) {
        int low = 0, high = nums.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (nums[mid] == target) return mid;
            else if (nums[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return -1;
    }
}`,
      python: `def search(nums: list[int], target: int) -> int:
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = low + (high - low) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
      cpp: `#include <vector>

int search(const std::vector<int>& nums, int target) {
    int low = 0, high = (int)nums.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;
        else if (nums[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
      c: `int search(int nums[], int n, int target) {
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;
        else if (nums[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`
    },
    timeComplexity: 'O(log N)',
    spaceComplexity: 'O(1)',
    hints: ['Always use low + (high - low) / 2 instead of (low + high) / 2 to prevent overflow.'],
    companyTags: ['Amazon', 'TCS', 'Infosys', 'Cognizant']
  },

  // ── 12. BIT MANIPULATION HACKS ──
  {
    id: 'p150-19',
    title: 'Check if Number is Power of Two (Bitwise Trick)',
    slug: 'power-of-two-bitwise',
    track: 'PROGRAMMING_150',
    level: 'BASIC',
    category: 'BIT_MANIPULATION',
    categoryLabel: 'Bit Manipulation & Bit Hacks',
    topicId: 'bit-manipulation',
    description: 'Given an integer N, return true if it is a power of two. An integer N is a power of two if there exists an integer x such that N == 2^x.',
    constraints: ['-2^31 <= N <= 2^31 - 1'],
    sampleInput: 'N = 16',
    sampleOutput: 'true',
    explanation: 'A power of two in binary has exactly one set bit (e.g. 16 = 10000). Subtracting 1 inverts all bits up to the lowest set bit (15 = 01111). Therefore, (N & (N - 1)) == 0 for all powers of two.',
    solutions: {
      java: `public class Solution {
    public static boolean isPowerOfTwo(int n) {
        return n > 0 && (n & (n - 1)) == 0;
    }
}`,
      python: `def is_power_of_two(n: int) -> bool:
    return n > 0 and (n & (n - 1)) == 0`,
      cpp: `bool isPowerOfTwo(int n) {
    return n > 0 && (n & (n - 1)) == 0;
}`,
      c: `int isPowerOfTwo(int n) {
    return n > 0 && (n & (n - 1)) == 0;
}`
    },
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    hints: ['What happens when you do bitwise AND between 8 (1000) and 7 (0111)?'],
    companyTags: ['Google', 'Amazon', 'TCS Digital']
  },
  {
    id: 'p150-25',
    title: 'Find the Single Non-Repeating Number (XOR Property)',
    slug: 'single-number-xor',
    track: 'PROGRAMMING_150',
    level: 'BASIC',
    category: 'BIT_MANIPULATION',
    categoryLabel: 'Bit Manipulation & Bit Hacks',
    topicId: 'bit-manipulation',
    description: 'Given a non-empty array of integers nums, every element appears twice except for one. Find that single one in O(N) time and O(1) space.',
    constraints: ['1 <= nums.length <= 3 * 10^4', '-3 * 10^4 <= nums[i] <= 3 * 10^4'],
    sampleInput: 'nums = [4, 1, 2, 1, 2]',
    sampleOutput: '4',
    explanation: 'XOR properties: A ^ A = 0, and A ^ 0 = A. XORing all elements together cancels out all pairs, leaving only the single unique number.',
    solutions: {
      java: `public class Solution {
    public static int singleNumber(int[] nums) {
        int xor = 0;
        for (int num : nums) xor ^= num;
        return xor;
    }
}`,
      python: `def single_number(nums: list[int]) -> int:
    xor = 0
    for num in nums:
        xor ^= num
    return xor`,
      cpp: `#include <vector>

int singleNumber(const std::vector<int>& nums) {
    int xorVal = 0;
    for (int num : nums) xorVal ^= num;
    return xorVal;
}`,
      c: `int singleNumber(int nums[], int n) {
    int xorVal = 0;
    for (int i = 0; i < n; i++) xorVal ^= nums[i];
    return xorVal;
}`
    },
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    hints: ['Bitwise XOR of identical numbers is 0. XOR is associative and commutative.'],
    companyTags: ['Amazon', 'Infosys SP', 'Capgemini']
  }
];
