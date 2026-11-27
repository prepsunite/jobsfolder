export const COGNIZANT_EXTRA = [
  {
    number: 47,
    title: 'GenC Code-Quality Complexity Gate',
    fnName: 'countComplexFunctions',
    description: 'A Cognizant GenC static-analysis gate flags any function whose cyclomatic complexity <code>complexity[i] &gt; maxComp</code> OR whose line count <code>lines[i] &gt; maxLines</code>. Return the number of flagged functions.',
    constraints: ['1 <= complexity.length == lines.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'complexity = [5, 12, 8, 15], lines = [40, 30, 120, 150], maxComp = 10, maxLines = 100', output: '3' },
      { title: 'Test Case 2', input: 'complexity = [5, 10], lines = [50, 100], maxComp = 10, maxLines = 100', output: '0' },
      { title: 'Test Case 3', input: 'complexity = [11], lines = [10], maxComp = 10, maxLines = 100', output: '1' },
      { title: 'Test Case 4', input: 'complexity = [1], lines = [101], maxComp = 10, maxLines = 100', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countComplexFunctions(int[] complexity, int[] lines, int maxComp, int maxLines) {
        int bad = 0;
        for (int i = 0; i < complexity.length; i++) if (complexity[i] > maxComp || lines[i] > maxLines) bad++;
        return bad;
    }
}`,
    pythonSolution: `def countComplexFunctions(complexity, lines, maxComp, maxLines):
    return sum(1 for c, l in zip(complexity, lines) if c > maxComp or l > maxLines)`
  },
  {
    number: 48,
    title: 'Sprint Story-Point Velocity Average',
    fnName: 'sprintsMeetingVelocity',
    description: 'Given completed story points across sprints <code>points</code> and target velocity <code>target</code>, return how many sprints achieved <code>points[i] &gt;= target</code>.',
    constraints: ['1 <= points.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'points = [20, 35, 30, 18, 40], target = 30', output: '3' },
      { title: 'Test Case 2', input: 'points = [10, 15], target = 20', output: '0' },
      { title: 'Test Case 3', input: 'points = [50], target = 50', output: '1' },
      { title: 'Test Case 4', input: 'points = [0, 0, 1], target = 1', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int sprintsMeetingVelocity(int[] points, int target) {
        int cnt = 0;
        for (int p : points) if (p >= target) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def sprintsMeetingVelocity(points, target):
    return sum(1 for p in points if p >= target)`
  },
  {
    number: 49,
    title: 'Automata String Vowel-Consonant Balance',
    fnName: 'countBalancedWords',
    description: 'Given an array of lowercase words <code>words</code>, a word is balanced if its count of vowels (<code>a,e,i,o,u</code>) equals its count of consonants. Return how many words are balanced.',
    constraints: ['1 <= words.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'words = ["code", "java", "genc", "auto"]', output: '2' },
      { title: 'Test Case 2', input: 'words = ["aei", "bcd"]', output: '0' },
      { title: 'Test Case 3', input: 'words = ["ab", "ba", "ou"]', output: '2' },
      { title: 'Test Case 4', input: 'words = ["book"]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countBalancedWords(String[] words) {
        int bal = 0;
        for (String w : words) {
            int v = 0;
            for (char c : w.toCharArray()) if ("aeiou".indexOf(c) >= 0) v++;
            if (v * 2 == w.length()) bal++;
        }
        return bal;
    }
}`,
    pythonSolution: `def countBalancedWords(words):
    return sum(1 for w in words if sum(1 for c in w if c in 'aeiou') * 2 == len(w))`
  },
  {
    number: 50,
    title: 'Campus Interview Panel Slot Matcher',
    fnName: 'maxCandidatesInterviewed',
    description: 'Given candidate readiness times <code>ready</code> and panelist free slot start times <code>slots</code> (each panelist interviews 1 candidate with <code>ready[i] &lt;= slots[j]</code>), return the maximum number of candidates that can be interviewed.',
    constraints: ['1 <= ready.length, slots.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'ready = [10, 20, 30], slots = [15, 25, 28]', output: '2' },
      { title: 'Test Case 2', input: 'ready = [50, 60], slots = [10, 20]', output: '0' },
      { title: 'Test Case 3', input: 'ready = [1, 2, 3], slots = [1, 2, 3]', output: '3' },
      { title: 'Test Case 4', input: 'ready = [5], slots = [10, 20]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxCandidatesInterviewed(int[] ready, int[] slots) {
        int[] r = ready.clone(), s = slots.clone();
        Arrays.sort(r); Arrays.sort(s);
        int i = 0, j = 0, cnt = 0;
        while (i < r.length && j < s.length) {
            if (r[i] <= s[j]) { cnt++; i++; j++; }
            else j++;
        }
        return cnt;
    }
}`,
    pythonSolution: `def maxCandidatesInterviewed(ready, slots):
    r, s = sorted(ready), sorted(slots)
    i = j = cnt = 0
    while i < len(r) and j < len(s):
        if r[i] <= s[j]: cnt += 1; i += 1; j += 1
        else: j += 1
    return cnt`
  }
];
