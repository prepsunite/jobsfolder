export const ADOBE_QUESTIONS = [
  {
    number: 1,
    title: 'Photoshop Layer Opacity Bounds',
    fnName: 'countVisibleLayers',
    description: 'In an Adobe Photoshop document, layers have opacity values <code>opacities</code> (0..100) and visibility flags <code>visible</code> (0 or 1). Return how many layers are visible AND have opacity strictly greater than <code>minOpacity</code>.',
    constraints: ['1 <= opacities.length == visible.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'opacities = [100, 50, 20, 80], visible = [1, 1, 1, 0], minOpacity = 30', output: '2' },
      { title: 'Test Case 2', input: 'opacities = [10, 20], visible = [1, 1], minOpacity = 50', output: '0' },
      { title: 'Test Case 3', input: 'opacities = [60], visible = [1], minOpacity = 60', output: '0' },
      { title: 'Test Case 4', input: 'opacities = [75, 90], visible = [1, 1], minOpacity = 50', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countVisibleLayers(int[] opacities, int[] visible, int minOpacity) {
        int cnt = 0;
        for (int i = 0; i < opacities.length; i++) if (visible[i] == 1 && opacities[i] > minOpacity) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countVisibleLayers(opacities, visible, minOpacity):
    return sum(1 for o, v in zip(opacities, visible) if v == 1 and o > minOpacity)`
  },
  {
    number: 2,
    title: 'Canvas Bounding Box Area',
    fnName: 'boundingBoxArea',
    description: 'Given axis-aligned rectangles on an Illustrator artboard <code>rects</code> <code>[x1, y1, x2, y2]</code>, return the area of the smallest axis-aligned bounding box that encloses all rectangles.',
    constraints: ['1 <= rects.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'rects = [[0, 0, 4, 3], [2, 1, 6, 5]]', output: '30' },
      { title: 'Test Case 2', input: 'rects = [[1, 1, 3, 4]]', output: '6' },
      { title: 'Test Case 3', input: 'rects = [[-2, -2, 0, 0], [1, 1, 2, 2]]', output: '16' },
      { title: 'Test Case 4', input: 'rects = [[0, 0, 5, 0]]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long boundingBoxArea(int[][] rects) {
        long minX = Long.MAX_VALUE, minY = Long.MAX_VALUE, maxX = Long.MIN_VALUE, maxY = Long.MIN_VALUE;
        for (int[] r : rects) {
            minX = Math.min(minX, r[0]); minY = Math.min(minY, r[1]);
            maxX = Math.max(maxX, r[2]); maxY = Math.max(maxY, r[3]);
        }
        return (maxX - minX) * (maxY - minY);
    }
}`,
    pythonSolution: `def boundingBoxArea(rects):
    minX = min(r[0] for r in rects); minY = min(r[1] for r in rects)
    maxX = max(r[2] for r in rects); maxY = max(r[3] for r in rects)
    return (maxX - minX) * (maxY - minY)`
  },
  {
    number: 3,
    title: 'Premiere Pro Timeline Clip Coverage',
    fnName: 'coveredTimelineSeconds',
    description: 'Given video clip intervals <code>clips</code> <code>[start, end]</code> on a Premiere Pro timeline, merge overlapping clips and return the total covered duration.',
    constraints: ['0 <= clips.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'clips = [[1, 5], [3, 8], [10, 12]]', output: '9' },
      { title: 'Test Case 2', input: 'clips = [[0, 10], [2, 4]]', output: '10' },
      { title: 'Test Case 3', input: 'clips = []', output: '0' },
      { title: 'Test Case 4', input: 'clips = [[5, 7], [7, 10]]', output: '5' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long coveredTimelineSeconds(int[][] clips) {
        if (clips.length == 0) return 0;
        Arrays.sort(clips, (a, b) -> Integer.compare(a[0], b[0]));
        long total = 0; int s = clips[0][0], e = clips[0][1];
        for (int i = 1; i < clips.length; i++) {
            if (clips[i][0] <= e) e = Math.max(e, clips[i][1]);
            else { total += e - s; s = clips[i][0]; e = clips[i][1]; }
        }
        return total + (e - s);
    }
}`,
    pythonSolution: `def coveredTimelineSeconds(clips):
    if not clips: return 0
    clips.sort()
    total = 0; s, e = clips[0]
    for a, b in clips[1:]:
        if a <= e: e = max(e, b)
        else: total += e - s; s, e = a, b
    return total + (e - s)`
  },
  {
    number: 4,
    title: 'PDF Page Range Parser Count',
    fnName: 'countPrintedPages',
    description: 'An Acrobat print dialog receives a comma-separated range string <code>spec</code> like <code>"1-3,5,7-9"</code>. Assuming valid non-overlapping ascending ranges, return total pages to print.',
    constraints: ['1 <= spec.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'spec = "1-3,5,7-9"', output: '7' },
      { title: 'Test Case 2', input: 'spec = "10"', output: '1' },
      { title: 'Test Case 3', input: 'spec = "1-100"', output: '100' },
      { title: 'Test Case 4', input: 'spec = "2,4,6,8"', output: '4' }
    ],
    javaSolution: `public class Solution {
    public static long countPrintedPages(String spec) {
        long total = 0;
        for (String part : spec.split(",")) {
            if (part.contains("-")) {
                String[] ab = part.split("-");
                total += Long.parseLong(ab[1]) - Long.parseLong(ab[0]) + 1;
            } else total += 1;
        }
        return total;
    }
}`,
    pythonSolution: `def countPrintedPages(spec):
    total = 0
    for part in spec.split(','):
        if '-' in part:
            a, b = map(int, part.split('-'))
            total += b - a + 1
        else:
            total += 1
    return total`
  },
  {
    number: 5,
    title: 'RGB Grayscale Luminance Threshold',
    fnName: 'countBrightPixels',
    description: 'In an image matrix <code>pixels</code> where each entry is grayscale intensity (0..255), invert every pixel (<code>255 - p</code>) and count how many inverted pixels are strictly greater than <code>thresh</code>.',
    constraints: ['1 <= pixels.length, pixels[0].length <= 500'],
    testCases: [
      { title: 'Test Case 1', input: 'pixels = [[0, 200], [100, 255]], thresh = 150', output: '2' },
      { title: 'Test Case 2', input: 'pixels = [[255, 255]], thresh = 0', output: '0' },
      { title: 'Test Case 3', input: 'pixels = [[0]], thresh = 254', output: '1' },
      { title: 'Test Case 4', input: 'pixels = [[128, 127]], thresh = 127', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countBrightPixels(int[][] pixels, int thresh) {
        int cnt = 0;
        for (int[] row : pixels) for (int p : row) if (255 - p > thresh) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countBrightPixels(pixels, thresh):
    return sum(1 for row in pixels for p in row if 255 - p > thresh)`
  },
  {
    number: 6,
    title: 'Hex Color Channel Distance',
    fnName: 'colorManhattanDistance',
    description: 'Given two 6-digit hex color strings <code>c1</code> and <code>c2</code> (e.g. <code>"FF0080"</code>), compute the Manhattan distance <code>|R1 - R2| + |G1 - G2| + |B1 - B2|</code>.',
    constraints: ['c1.length == c2.length == 6'],
    testCases: [
      { title: 'Test Case 1', input: 'c1 = "FF0000", c2 = "00FF00"', output: '510' },
      { title: 'Test Case 2', input: 'c1 = "102030", c2 = "102030"', output: '0' },
      { title: 'Test Case 3', input: 'c1 = "000000", c2 = "010203"', output: '6' },
      { title: 'Test Case 4', input: 'c1 = "FFFFFF", c2 = "000000"', output: '765' }
    ],
    javaSolution: `public class Solution {
    public static int colorManhattanDistance(String c1, String c2) {
        int d = 0;
        for (int i = 0; i < 6; i += 2) {
            int a = Integer.parseInt(c1.substring(i, i + 2), 16);
            int b = Integer.parseInt(c2.substring(i, i + 2), 16);
            d += Math.abs(a - b);
        }
        return d;
    }
}`,
    pythonSolution: `def colorManhattanDistance(c1, c2):
    return sum(abs(int(c1[i:i+2], 16) - int(c2[i:i+2], 16)) for i in (0, 2, 4))`
  },
  {
    number: 7,
    title: 'Font Glyph Kerning Width',
    fnName: 'totalLineWidth',
    description: 'Given character widths <code>widths</code> (26 ints for <code>a..z</code>) and a lowercase string <code>text</code>, each character adds <code>widths[c]</code> and each adjacent pair of identical characters adds a kerning bonus of <code>-1</code>. Return total width.',
    constraints: ['1 <= text.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'widths = [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10], text = "book"', output: '39' },
      { title: 'Test Case 2', input: 'widths = [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5], text = "aaa"', output: '13' },
      { title: 'Test Case 3', input: 'widths = [4,6,8,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10], text = "abc"', output: '18' },
      { title: 'Test Case 4', input: 'widths = [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7], text = "z"', output: '7' }
    ],
    javaSolution: `public class Solution {
    public static long totalLineWidth(int[] widths, String text) {
        long w = 0;
        for (int i = 0; i < text.length(); i++) {
            w += widths[text.charAt(i) - 'a'];
            if (i > 0 && text.charAt(i) == text.charAt(i - 1)) w -= 1;
        }
        return w;
    }
}`,
    pythonSolution: `def totalLineWidth(widths, text):
    w = sum(widths[ord(c) - ord('a')] for c in text)
    w -= sum(1 for i in range(1, len(text)) if text[i] == text[i - 1])
    return w`
  },
  {
    number: 8,
    title: 'Matrix Horizontal Flip Symmetry',
    fnName: 'countAsymmetricPixels',
    description: 'Given a binary sprite matrix <code>grid</code>, count how many pairs of cells <code>(r, c)</code> and <code>(r, C - 1 - c)</code> (with <code>c &lt; C / 2</code>) have different values.',
    constraints: ['1 <= grid.length, grid[0].length <= 500'],
    testCases: [
      { title: 'Test Case 1', input: 'grid = [[1, 0, 1], [0, 1, 1]]', output: '1' },
      { title: 'Test Case 2', input: 'grid = [[1, 1], [0, 0]]', output: '0' },
      { title: 'Test Case 3', input: 'grid = [[1, 0], [0, 1]]', output: '2' },
      { title: 'Test Case 4', input: 'grid = [[1]]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countAsymmetricPixels(int[][] grid) {
        int R = grid.length, C = grid[0].length, diff = 0;
        for (int r = 0; r < R; r++) {
            for (int c = 0; c < C / 2; c++) {
                if (grid[r][c] != grid[r][C - 1 - c]) diff++;
            }
        }
        return diff;
    }
}`,
    pythonSolution: `def countAsymmetricPixels(grid):
    R, C = len(grid), len(grid[0])
    return sum(1 for r in range(R) for c in range(C // 2) if grid[r][c] != grid[r][C - 1 - c])`
  },
  {
    number: 9,
    title: 'Vector Path Simplify Collinear',
    fnName: 'countCornerPoints',
    description: 'Given a polyline of 2D integer points <code>pts</code> where consecutive points are distinct, count how many interior points form a non-collinear corner (i.e. cross product of <code>(p[i]-p[i-1])</code> and <code>(p[i+1]-p[i])</code> is non-zero).',
    constraints: ['2 <= pts.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'pts = [[0, 0], [1, 1], [2, 2], [2, 5]]', output: '1' },
      { title: 'Test Case 2', input: 'pts = [[0, 0], [0, 1], [1, 1], [1, 0]]', output: '2' },
      { title: 'Test Case 3', input: 'pts = [[0, 0], [5, 5]]', output: '0' },
      { title: 'Test Case 4', input: 'pts = [[0, 0], [1, 0], [2, 0], [3, 0]]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countCornerPoints(int[][] pts) {
        int corners = 0;
        for (int i = 1; i + 1 < pts.length; i++) {
            long dx1 = pts[i][0] - pts[i - 1][0], dy1 = pts[i][1] - pts[i - 1][1];
            long dx2 = pts[i + 1][0] - pts[i][0], dy2 = pts[i + 1][1] - pts[i][1];
            if (dx1 * dy2 - dy1 * dx2 != 0) corners++;
        }
        return corners;
    }
}`,
    pythonSolution: `def countCornerPoints(pts):
    cnt = 0
    for i in range(1, len(pts) - 1):
        dx1, dy1 = pts[i][0] - pts[i-1][0], pts[i][1] - pts[i-1][1]
        dx2, dy2 = pts[i+1][0] - pts[i][0], pts[i+1][1] - pts[i][1]
        if dx1 * dy2 - dy1 * dx2 != 0: cnt += 1
    return cnt`
  },
  {
    number: 10,
    title: 'Bitmask Brush Feature Combinations',
    fnName: 'countValidBrushPresets',
    description: 'A brush engine supports <code>k</code> boolean flags (<code>0..k-1</code>). Given bitmasks <code>presets</code> and an incompatible pair mask <code>badPairMask</code> (exactly 2 bits set), count how many presets do NOT have both bits of <code>badPairMask</code> enabled.',
    constraints: ['1 <= presets.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'presets = [3, 1, 2, 7, 4], badPairMask = 3', output: '3' },
      { title: 'Test Case 2', input: 'presets = [6, 7], badPairMask = 6', output: '0' },
      { title: 'Test Case 3', input: 'presets = [0, 1, 2, 4], badPairMask = 5', output: '4' },
      { title: 'Test Case 4', input: 'presets = [15], badPairMask = 12', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countValidBrushPresets(int[] presets, int badPairMask) {
        int cnt = 0;
        for (int p : presets) if ((p & badPairMask) != badPairMask) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countValidBrushPresets(presets, badPairMask):
    return sum(1 for p in presets if (p & badPairMask) != badPairMask)`
  },
  {
    number: 11,
    title: 'Keyframe Interpolation Gap Max',
    fnName: 'maxKeyframeJump',
    description: 'Animation keyframes are placed at sorted times <code>frames</code> with values <code>vals</code>. Return the maximum absolute rate of change <code>|vals[i] - vals[i-1]| // (frames[i] - frames[i-1])</code> across consecutive keyframes.',
    constraints: ['2 <= frames.length == vals.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'frames = [0, 2, 5, 6], vals = [0, 10, 19, 29]', output: '10' },
      { title: 'Test Case 2', input: 'frames = [1, 5], vals = [20, 4]', output: '4' },
      { title: 'Test Case 3', input: 'frames = [0, 10], vals = [5, 5]', output: '0' },
      { title: 'Test Case 4', input: 'frames = [0, 3, 4], vals = [0, 15, 21]', output: '6' }
    ],
    javaSolution: `public class Solution {
    public static long maxKeyframeJump(int[] frames, int[] vals) {
        long best = 0;
        for (int i = 1; i < frames.length; i++) {
            long rate = Math.abs((long) vals[i] - vals[i - 1]) / (frames[i] - frames[i - 1]);
            best = Math.max(best, rate);
        }
        return best;
    }
}`,
    pythonSolution: `def maxKeyframeJump(frames, vals):
    return max(abs(vals[i] - vals[i-1]) // (frames[i] - frames[i-1]) for i in range(1, len(frames)))`
  },
  {
    number: 12,
    title: 'Creative Cloud Asset Tag Filter',
    fnName: 'countAssetsWithAllTags',
    description: 'Each asset has a bitmask of tags <code>assetMasks[i]</code>. Return how many assets contain every tag in <code>queryMask</code>.',
    constraints: ['1 <= assetMasks.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'assetMasks = [7, 5, 3, 1], queryMask = 5', output: '2' },
      { title: 'Test Case 2', input: 'assetMasks = [2, 4], queryMask = 1', output: '0' },
      { title: 'Test Case 3', input: 'assetMasks = [15, 14, 12], queryMask = 12', output: '3' },
      { title: 'Test Case 4', input: 'assetMasks = [0], queryMask = 0', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countAssetsWithAllTags(int[] assetMasks, int queryMask) {
        int cnt = 0;
        for (int m : assetMasks) if ((m & queryMask) == queryMask) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countAssetsWithAllTags(assetMasks, queryMask):
    return sum(1 for m in assetMasks if (m & queryMask) == queryMask)`
  },
  {
    number: 13,
    title: 'DP Minimum Canvas Cut Cost',
    fnName: 'minRenderPasses',
    description: 'A sequence of draw commands has shader IDs <code>shaders</code>. Adjacent commands with the same shader batch into one render pass, and you may skip at most <code>1</code> command to merge its neighbors. Wait: simply return the minimum number of contiguous shader runs if you are allowed to delete at most ONE element from <code>shaders</code>.',
    constraints: ['1 <= shaders.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'shaders = [1, 2, 1, 3]', output: '2' },
      { title: 'Test Case 2', input: 'shaders = [5, 5, 5]', output: '1' },
      { title: 'Test Case 3', input: 'shaders = [1, 2, 3, 4]', output: '3' },
      { title: 'Test Case 4', input: 'shaders = [7]', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minRenderPasses(int[] shaders) {
        int n = shaders.length;
        if (n <= 1) return 0;
        int runs = 1;
        for (int i = 1; i < n; i++) if (shaders[i] != shaders[i - 1]) runs++;
        int best = runs;
        for (int i = 0; i < n; i++) {
            int cur = runs;
            boolean diffL = (i > 0 && shaders[i] != shaders[i - 1]);
            boolean diffR = (i + 1 < n && shaders[i] != shaders[i + 1]);
            if (i == 0) { if (diffR) cur--; }
            else if (i == n - 1) { if (diffL) cur--; }
            else {
                if (diffL && diffR) {
                    if (shaders[i - 1] == shaders[i + 1]) cur -= 2;
                    else cur -= 1;
                }
            }
            best = Math.min(best, cur);
        }
        return best;
    }
}`,
    pythonSolution: `def minRenderPasses(shaders):
    n = len(shaders)
    if n <= 1: return 0
    runs = 1 + sum(1 for i in range(1, n) if shaders[i] != shaders[i - 1])
    best = runs
    for i in range(n):
        cur = runs
        dl = i > 0 and shaders[i] != shaders[i - 1]
        dr = i + 1 < n and shaders[i] != shaders[i + 1]
        if i == 0:
            if dr: cur -= 1
        elif i == n - 1:
            if dl: cur -= 1
        else:
            if dl and dr:
                cur -= 2 if shaders[i - 1] == shaders[i + 1] else 1
        best = min(best, cur)
    return best`
  },
  {
    number: 14,
    title: '2D Flood-Fill Pixel Count',
    fnName: 'floodFillCount',
    description: 'Given an integer color grid <code>img</code> and start cell <code>(sr, sc)</code>, return how many cells belong to the 4-connected region of the same color as <code>img[sr][sc]</code>.',
    constraints: ['1 <= img.length, img[0].length <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'img = [[1, 1, 2], [1, 2, 2], [1, 0, 2]], sr = 0, sc = 0', output: '4' },
      { title: 'Test Case 2', input: 'img = [[3, 3], [3, 3]], sr = 1, sc = 1', output: '4' },
      { title: 'Test Case 3', input: 'img = [[1, 2], [2, 1]], sr = 0, sc = 0', output: '1' },
      { title: 'Test Case 4', input: 'img = [[5]], sr = 0, sc = 0', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int floodFillCount(int[][] img, int sr, int sc) {
        int R = img.length, C = img[0].length, target = img[sr][sc];
        boolean[][] vis = new boolean[R][C];
        Queue<int[]> q = new ArrayDeque<>();
        vis[sr][sc] = true; q.add(new int[]{sr, sc});
        int cnt = 0; int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        while (!q.isEmpty()) {
            int[] cur = q.poll(); cnt++;
            for (int[] d : dirs) {
                int nr = cur[0] + d[0], nc = cur[1] + d[1];
                if (nr >= 0 && nr < R && nc >= 0 && nc < C && !vis[nr][nc] && img[nr][nc] == target) {
                    vis[nr][nc] = true; q.add(new int[]{nr, nc});
                }
            }
        }
        return cnt;
    }
}`,
    pythonSolution: `from collections import deque
def floodFillCount(img, sr, sc):
    R, C = len(img), len(img[0])
    target = img[sr][sc]
    vis = {(sr, sc)}; q = deque([(sr, sc)])
    while q:
        r, c = q.popleft()
        for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
            nr, nc = r+dr, c+dc
            if 0 <= nr < R and 0 <= nc < C and (nr, nc) not in vis and img[nr][nc] == target:
                vis.add((nr, nc)); q.append((nr, nc))
    return len(vis)`
  },
  {
    number: 15,
    title: 'Audio Track Normalization Peak',
    fnName: 'countClippedSamples',
    description: 'An audio clip has integer amplitudes <code>samples</code>. When amplified by integer factor <code>gain</code>, any sample whose new absolute value exceeds <code>32767</code> clips. Return total clipped samples.',
    constraints: ['1 <= samples.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'samples = [10000, -20000, 5000, 16384], gain = 2', output: '2' },
      { title: 'Test Case 2', input: 'samples = [100, -100], gain = 10', output: '0' },
      { title: 'Test Case 3', input: 'samples = [-32768], gain = 1', output: '1' },
      { title: 'Test Case 4', input: 'samples = [16383, -16383], gain = 2', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countClippedSamples(int[] samples, int gain) {
        int cnt = 0;
        for (int s : samples) if (Math.abs((long) s * gain) > 32767) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countClippedSamples(samples, gain):
    return sum(1 for s in samples if abs(s * gain) > 32767)`
  },
  {
    number: 16,
    title: 'Gradient Stop Interpolation Check',
    fnName: 'maxGradientStopGap',
    description: 'A CSS/SVG gradient has sorted stop positions <code>stops</code> (0..100). Return the maximum gap between consecutive stops (including from <code>0</code> to <code>stops[0]</code> and <code>stops[-1]</code> to <code>100</code>).',
    constraints: ['1 <= stops.length <= 10^4', '0 <= stops[i] <= 100'],
    testCases: [
      { title: 'Test Case 1', input: 'stops = [20, 50, 90]', output: '40' },
      { title: 'Test Case 2', input: 'stops = [0, 100]', output: '100' },
      { title: 'Test Case 3', input: 'stops = [50]', output: '50' },
      { title: 'Test Case 4', input: 'stops = [10, 20, 30, 80]', output: '50' }
    ],
    javaSolution: `public class Solution {
    public static int maxGradientStopGap(int[] stops) {
        int best = Math.max(stops[0], 100 - stops[stops.length - 1]);
        for (int i = 1; i < stops.length; i++) best = Math.max(best, stops[i] - stops[i - 1]);
        return best;
    }
}`,
    pythonSolution: `def maxGradientStopGap(stops):
    pts = [0] + stops + [100]
    return max(pts[i] - pts[i - 1] for i in range(1, len(pts)))`
  },
  {
    number: 17,
    title: 'SVG Path Command Counter',
    fnName: 'countMoveToCommands',
    description: 'An SVG path string <code>d</code> contains uppercase command letters (<code>M, L, C, Z, H, V</code>) and numbers/spaces. Return how many subpaths start with <code>\'M\'</code>.',
    constraints: ['1 <= d.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'd = "M 0 0 L 10 10 Z M 20 20 L 30 30 Z"', output: '2' },
      { title: 'Test Case 2', input: 'd = "L 10 10 Z"', output: '0' },
      { title: 'Test Case 3', input: 'd = "M0 0Z"', output: '1' },
      { title: 'Test Case 4', input: 'd = "MMM"', output: '3' }
    ],
    javaSolution: `public class Solution {
    public static int countMoveToCommands(String d) {
        int cnt = 0;
        for (int i = 0; i < d.length(); i++) if (d.charAt(i) == 'M') cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countMoveToCommands(d):
    return d.count('M')`
  },
  {
    number: 18,
    title: 'DP Tile Mosaic Coloring Ways',
    fnName: 'countBannerColorings',
    description: 'A <code>1 x n</code> banner of <code>n</code> panels is painted with <code>k</code> colors such that no two adjacent panels have the same color. Return the number of valid colorings modulo <code>10^9 + 7</code>.',
    constraints: ['1 <= n <= 10^5', '1 <= k <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 3, k = 2', output: '2' },
      { title: 'Test Case 2', input: 'n = 3, k = 3', output: '12' },
      { title: 'Test Case 3', input: 'n = 1, k = 5', output: '5' },
      { title: 'Test Case 4', input: 'n = 2, k = 1', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long countBannerColorings(int n, int k) {
        long MOD = 1_000_000_007L;
        long ans = k % MOD;
        for (int i = 1; i < n; i++) ans = (ans * (k - 1)) % MOD;
        return ans;
    }
}`,
    pythonSolution: `def countBannerColorings(n, k):
    MOD = 10**9 + 7
    if n == 1: return k % MOD
    return (k * pow(k - 1, n - 1, MOD)) % MOD`
  },
  {
    number: 19,
    title: '90-Degree Artboard Rotation Check',
    fnName: 'isRotatedMatch',
    description: 'Given two <code>n x n</code> binary matrices <code>a</code> and <code>b</code>, return <code>true</code> if rotating <code>a</code> clockwise by 90 degrees produces <code>b</code>, else <code>false</code>.',
    constraints: ['1 <= n <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'a = [[1, 0], [0, 0]], b = [[0, 1], [0, 0]]', output: 'true' },
      { title: 'Test Case 2', input: 'a = [[1, 0], [0, 0]], b = [[1, 0], [0, 0]]', output: 'false' },
      { title: 'Test Case 3', input: 'a = [[1, 2], [3, 4]], b = [[3, 1], [4, 2]]', output: 'true' },
      { title: 'Test Case 4', input: 'a = [[5]], b = [[5]]', output: 'true' }
    ],
    javaSolution: `public class Solution {
    public static boolean isRotatedMatch(int[][] a, int[][] b) {
        int n = a.length;
        for (int r = 0; r < n; r++) {
            for (int c = 0; c < n; c++) {
                if (a[r][c] != b[c][n - 1 - r]) return false;
            }
        }
        return true;
    }
}`,
    pythonSolution: `def isRotatedMatch(a, b):
    n = len(a)
    return all(a[r][c] == b[c][n - 1 - r] for r in range(n) for c in range(n))`
  },
  {
    number: 20,
    title: 'Layer Z-Order Swap Count',
    fnName: 'countOutOfOrderPairs',
    description: 'Given layer Z-indices <code>zOrder</code> (distinct integers), count how many pairs <code>(i, j)</code> with <code>i &lt; j</code> have <code>zOrder[i] &gt; zOrder[j]</code>.',
    constraints: ['1 <= zOrder.length <= 2000'],
    testCases: [
      { title: 'Test Case 1', input: 'zOrder = [3, 1, 2]', output: '2' },
      { title: 'Test Case 2', input: 'zOrder = [1, 2, 3]', output: '0' },
      { title: 'Test Case 3', input: 'zOrder = [4, 3, 2, 1]', output: '6' },
      { title: 'Test Case 4', input: 'zOrder = [10]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long countOutOfOrderPairs(int[] zOrder) {
        long inv = 0;
        for (int i = 0; i < zOrder.length; i++) {
            for (int j = i + 1; j < zOrder.length; j++) if (zOrder[i] > zOrder[j]) inv++;
        }
        return inv;
    }
}`,
    pythonSolution: `def countOutOfOrderPairs(zOrder):
    return sum(1 for i in range(len(zOrder)) for j in range(i + 1, len(zOrder)) if zOrder[i] > zOrder[j])`
  },
  {
    number: 21,
    title: 'Bitmap Run-Length Compression Ratio',
    fnName: 'countPixelRuns',
    description: 'In a 1D scanline of pixel colors <code>row</code>, count how many maximal contiguous runs of identical colors exist.',
    constraints: ['1 <= row.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'row = [1, 1, 2, 2, 2, 1]', output: '3' },
      { title: 'Test Case 2', input: 'row = [5, 5, 5]', output: '1' },
      { title: 'Test Case 3', input: 'row = [1, 2, 3, 4]', output: '4' },
      { title: 'Test Case 4', input: 'row = [0]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countPixelRuns(int[] row) {
        int runs = 1;
        for (int i = 1; i < row.length; i++) if (row[i] != row[i - 1]) runs++;
        return runs;
    }
}`,
    pythonSolution: `def countPixelRuns(row):
    return 1 + sum(1 for i in range(1, len(row)) if row[i] != row[i - 1])`
  },
  {
    number: 22,
    title: 'Render Farm Frame Batching',
    fnName: 'minRenderBatches',
    description: 'A render queue has frame complexities <code>frames</code> (processed in order). Each batch can hold total complexity at most <code>cap</code>. Return minimum batches needed.',
    constraints: ['1 <= frames.length <= 10^5', 'max(frames) <= cap <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'frames = [4, 3, 2, 5, 1], cap = 7', output: '3' },
      { title: 'Test Case 2', input: 'frames = [2, 2, 2], cap = 6', output: '1' },
      { title: 'Test Case 3', input: 'frames = [5, 5, 5], cap = 5', output: '3' },
      { title: 'Test Case 4', input: 'frames = [1], cap = 10', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int minRenderBatches(int[] frames, int cap) {
        int batches = 1; long cur = 0;
        for (int f : frames) {
            if (cur + f > cap) { batches++; cur = f; }
            else cur += f;
        }
        return batches;
    }
}`,
    pythonSolution: `def minRenderBatches(frames, cap):
    batches, cur = 1, 0
    for f in frames:
        if cur + f > cap: batches += 1; cur = f
        else: cur += f
    return batches`
  },
  {
    number: 23,
    title: 'Bezier Control Point Parity',
    fnName: 'countValidCubicSegments',
    description: 'In a flat coordinate array <code>coords</code> of length <code>n</code>, a valid cubic Bezier chain needs <code>2</code> start coords plus <code>6 * k</code> coords for <code>k</code> segments. Return how many complete cubic segments can be formed.',
    constraints: ['0 <= coords.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'coords = [0, 0, 1, 2, 3, 4, 5, 6, 7, 8]', output: '1' },
      { title: 'Test Case 2', input: 'coords = [0, 0]', output: '0' },
      { title: 'Test Case 3', input: 'coords = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]', output: '2' },
      { title: 'Test Case 4', input: 'coords = []', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countValidCubicSegments(int[] coords) {
        if (coords.length < 8) return 0;
        return (coords.length - 2) / 6;
    }
}`,
    pythonSolution: `def countValidCubicSegments(coords):
    return max(0, (len(coords) - 2) // 6)`
  },
  {
    number: 24,
    title: 'Aspect Ratio Exact Match Count',
    fnName: 'countMatchingAspectRatios',
    description: 'Given image dimensions <code>dims</code> <code>[width, height]</code> and target ratio <code>wTarget : hTarget</code>, count how many images have exact aspect ratio <code>width * hTarget == height * wTarget</code>.',
    constraints: ['1 <= dims.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'dims = [[1920, 1080], [1280, 720], [800, 600]], wTarget = 16, hTarget = 9', output: '2' },
      { title: 'Test Case 2', input: 'dims = [[100, 100], [200, 100]], wTarget = 1, hTarget = 1', output: '1' },
      { title: 'Test Case 3', input: 'dims = [[640, 480]], wTarget = 16, hTarget = 9', output: '0' },
      { title: 'Test Case 4', input: 'dims = [[400, 300], [800, 600]], wTarget = 4, hTarget = 3', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countMatchingAspectRatios(int[][] dims, int wTarget, int hTarget) {
        int cnt = 0;
        for (int[] d : dims) if ((long) d[0] * hTarget == (long) d[1] * wTarget) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countMatchingAspectRatios(dims, wTarget, hTarget):
    return sum(1 for w, h in dims if w * hTarget == h * wTarget)`
  },
  {
    number: 25,
    title: 'Bitwise Alpha Mask Composite',
    fnName: 'countOpaqueCorners',
    description: 'Given a matrix <code>alpha</code> (0..255), count how many of the 4 corner cells (or fewer if <code>R==1</code> or <code>C==1</code>, distinct corner positions) have alpha equal to <code>255</code>.',
    constraints: ['1 <= alpha.length, alpha[0].length <= 100'],
    testCases: [
      { title: 'Test Case 1', input: 'alpha = [[255, 0, 255], [0, 0, 0], [128, 0, 255]]', output: '3' },
      { title: 'Test Case 2', input: 'alpha = [[255]]', output: '1' },
      { title: 'Test Case 3', input: 'alpha = [[0, 10], [20, 30]]', output: '0' },
      { title: 'Test Case 4', input: 'alpha = [[255, 100, 255]]', output: '2' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countOpaqueCorners(int[][] alpha) {
        int R = alpha.length, C = alpha[0].length, cnt = 0;
        Set<Long> seen = new HashSet<>();
        int[][] corners = {{0,0},{0,C-1},{R-1,0},{R-1,C-1}};
        for (int[] p : corners) {
            long key = (long) p[0] * C + p[1];
            if (seen.add(key) && alpha[p[0]][p[1]] == 255) cnt++;
        }
        return cnt;
    }
}`,
    pythonSolution: `def countOpaqueCorners(alpha):
    R, C = len(alpha), len(alpha[0])
    pts = {(0,0), (0,C-1), (R-1,0), (R-1,C-1)}
    return sum(1 for r, c in pts if alpha[r][c] == 255)`
  },
  {
    number: 26,
    title: 'DP Maximum Non-Overlapping Ad Slots',
    fnName: 'maxCreativeCampaignValue',
    description: 'Creative campaigns have intervals <code>[start, end, value]</code>. Two campaigns cannot overlap (<code>end1 <= start2</code> is allowed). Return the maximum total value achievable.',
    constraints: ['1 <= campaigns.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'campaigns = [[1, 3, 50], [2, 5, 20], [3, 6, 40]]', output: '90' },
      { title: 'Test Case 2', input: 'campaigns = [[1, 4, 100], [2, 3, 60]]', output: '100' },
      { title: 'Test Case 3', input: 'campaigns = [[0, 2, 10], [2, 4, 20], [4, 6, 30]]', output: '60' },
      { title: 'Test Case 4', input: 'campaigns = [[5, 10, 25]]', output: '25' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long maxCreativeCampaignValue(int[][] campaigns) {
        int n = campaigns.length;
        Arrays.sort(campaigns, (a, b) -> Integer.compare(a[1], b[1]));
        int[] ends = new int[n];
        for (int i = 0; i < n; i++) ends[i] = campaigns[i][1];
        long[] dp = new long[n + 1];
        for (int i = 0; i < n; i++) {
            int idx = upperBound(ends, i, campaigns[i][0]);
            dp[i + 1] = Math.max(dp[i], dp[idx] + campaigns[i][2]);
        }
        return dp[n];
    }
    private static int upperBound(int[] a, int hi, int val) {
        int l = 0, r = hi;
        while (l < r) {
            int m = (l + r) / 2;
            if (a[m] <= val) l = m + 1; else r = m;
        }
        return l;
    }
}`,
    pythonSolution: `import bisect
def maxCreativeCampaignValue(campaigns):
    campaigns.sort(key=lambda x: x[1])
    ends = [c[1] for c in campaigns]
    dp = [0] * (len(campaigns) + 1)
    for i, (s, e, v) in enumerate(campaigns):
        j = bisect.bisect_right(ends, s, 0, i)
        dp[i + 1] = max(dp[i], dp[j] + v)
    return dp[-1]`
  },
  {
    number: 27,
    title: 'PDF Bookmark Tree Depth',
    fnName: 'maxBookmarkDepth',
    description: 'Given a tree of PDF bookmarks with <code>parent[i]</code> (<code>-1</code> for top-level bookmarks), return the maximum nesting level (top-level = 1).',
    constraints: ['1 <= parent.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'parent = [-1, 0, 1, 0]', output: '3' },
      { title: 'Test Case 2', input: 'parent = [-1, -1]', output: '1' },
      { title: 'Test Case 3', input: 'parent = [-1, 0, 1, 2, 3]', output: '5' },
      { title: 'Test Case 4', input: 'parent = [-1]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int maxBookmarkDepth(int[] parent) {
        int n = parent.length;
        int[] memo = new int[n];
        int best = 0;
        for (int i = 0; i < n; i++) best = Math.max(best, d(i, parent, memo));
        return best;
    }
    private static int d(int i, int[] p, int[] memo) {
        if (p[i] == -1) return 1;
        if (memo[i] != 0) return memo[i];
        return memo[i] = 1 + d(p[i], p, memo);
    }
}`,
    pythonSolution: `def maxBookmarkDepth(parent):
    memo = {}
    def d(i):
        if parent[i] == -1: return 1
        if i in memo: return memo[i]
        memo[i] = 1 + d(parent[i])
        return memo[i]
    return max(d(i) for i in range(len(parent)))`
  },
  {
    number: 28,
    title: 'Smart Crop Margin Finder',
    fnName: 'cropMarginPixels',
    description: 'Given a binary image <code>img</code> where <code>1</code> is foreground and <code>0</code> is background, return how many rows at the top and bottom are completely background (<code>0</code>).',
    constraints: ['1 <= img.length, img[0].length <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'img = [[0, 0, 0], [0, 1, 0], [0, 0, 0], [0, 0, 0]]', output: '3' },
      { title: 'Test Case 2', input: 'img = [[1, 0], [0, 1]]', output: '0' },
      { title: 'Test Case 3', input: 'img = [[0, 0], [0, 0]]', output: '2' },
      { title: 'Test Case 4', input: 'img = [[0], [1], [0]]', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int cropMarginPixels(int[][] img) {
        int R = img.length, first = -1, last = -1;
        for (int r = 0; r < R; r++) {
            boolean fg = false;
            for (int v : img[r]) if (v == 1) { fg = true; break; }
            if (fg) { if (first == -1) first = r; last = r; }
        }
        if (first == -1) return R;
        return first + (R - 1 - last);
    }
}`,
    pythonSolution: `def cropMarginPixels(img):
    fg = [r for r, row in enumerate(img) if any(row)]
    if not fg: return len(img)
    return fg[0] + (len(img) - 1 - fg[-1])`
  },
  {
    number: 29,
    title: 'Color Palette Quantization Error',
    fnName: 'totalQuantizationError',
    description: 'Given pixel values <code>vals</code> and a sorted palette <code>palette</code>, each pixel snaps to the closest value in <code>palette</code>. Return the sum of squared snapping errors <code>(v - p)^2</code>.',
    constraints: ['1 <= vals.length <= 10^4', '1 <= palette.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'vals = [10, 22, 35], palette = [0, 20, 40]', output: '129' },
      { title: 'Test Case 2', input: 'vals = [5, 10], palette = [5, 10]', output: '0' },
      { title: 'Test Case 3', input: 'vals = [3], palette = [0]', output: '9' },
      { title: 'Test Case 4', input: 'vals = [1, 9], palette = [5]', output: '32' }
    ],
    javaSolution: `public class Solution {
    public static long totalQuantizationError(int[] vals, int[] palette) {
        long err = 0;
        for (int v : vals) {
            int l = 0, r = palette.length - 1;
            while (l < r) {
                int m = (l + r) / 2;
                if (palette[m] < v) l = m + 1; else r = m;
            }
            long best = Math.abs((long) v - palette[l]);
            if (l > 0) best = Math.min(best, Math.abs((long) v - palette[l - 1]));
            err += best * best;
        }
        return err;
    }
}`,
    pythonSolution: `import bisect
def totalQuantizationError(vals, palette):
    err = 0
    for v in vals:
        i = bisect.bisect_left(palette, v)
        cand = []
        if i < len(palette): cand.append(abs(v - palette[i]))
        if i > 0: cand.append(abs(v - palette[i - 1]))
        d = min(cand)
        err += d * d
    return err`
  },
  {
    number: 30,
    title: 'Layer Group Flatten Depth',
    fnName: 'countMaxNestedGroups',
    description: 'A layer hierarchy string uses <code>\'[\'</code> to open a group and <code>\']\'</code> to close a group (valid nesting). Return the maximum nesting depth.',
    constraints: ['1 <= tree.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'tree = "[[][[]]]"', output: '3' },
      { title: 'Test Case 2', input: 'tree = "[]"', output: '1' },
      { title: 'Test Case 3', input: 'tree = "[][]"', output: '1' },
      { title: 'Test Case 4', input: 'tree = "[[[[]]]]"', output: '4' }
    ],
    javaSolution: `public class Solution {
    public static int countMaxNestedGroups(String tree) {
        int d = 0, best = 0;
        for (int i = 0; i < tree.length(); i++) {
            if (tree.charAt(i) == '[') best = Math.max(best, ++d);
            else if (tree.charAt(i) == ']') d--;
        }
        return best;
    }
}`,
    pythonSolution: `def countMaxNestedGroups(tree):
    d = best = 0
    for c in tree:
        if c == '[': d += 1; best = max(best, d)
        elif c == ']': d -= 1
    return best`
  },
  {
    number: 31,
    title: 'OS Process Starvation Counter',
    fnName: 'countStarvedProcesses',
    description: 'Processes arrive with priority <code>prio[i]</code> and wait time <code>wait[i]</code>. A process is starved if <code>wait[i] > maxWait</code> AND <code>prio[i] >= minPrio</code>. Count starved processes.',
    constraints: ['1 <= prio.length == wait.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'prio = [1, 5, 4, 2], wait = [100, 50, 120, 200], maxWait = 80, minPrio = 3', output: '1' },
      { title: 'Test Case 2', input: 'prio = [5, 5], wait = [90, 100], maxWait = 80, minPrio = 4', output: '2' },
      { title: 'Test Case 3', input: 'prio = [1], wait = [10], maxWait = 10, minPrio = 1', output: '0' },
      { title: 'Test Case 4', input: 'prio = [3], wait = [11], maxWait = 10, minPrio = 3', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countStarvedProcesses(int[] prio, int[] wait, int maxWait, int minPrio) {
        int cnt = 0;
        for (int i = 0; i < prio.length; i++) if (wait[i] > maxWait && prio[i] >= minPrio) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countStarvedProcesses(prio, wait, maxWait, minPrio):
    return sum(1 for p, w in zip(prio, wait) if w > maxWait and p >= minPrio)`
  },
  {
    number: 32,
    title: 'Shader Pipeline Stage Dependency',
    fnName: 'canCompileShaders',
    description: 'Given <code>n</code> shader modules and dependencies <code>deps</code> <code>[a, b]</code> (<code>b</code> must compile before <code>a</code>), return <code>true</code> if all shaders can be compiled (no cycle), else <code>false</code>.',
    constraints: ['1 <= n <= 10^4', '0 <= deps.length <= 5 * 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 3, deps = [[1, 0], [2, 1]]', output: 'true' },
      { title: 'Test Case 2', input: 'n = 2, deps = [[0, 1], [1, 0]]', output: 'false' },
      { title: 'Test Case 3', input: 'n = 4, deps = [[1, 0], [2, 0], [3, 1], [3, 2]]', output: 'true' },
      { title: 'Test Case 4', input: 'n = 1, deps = []', output: 'true' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static boolean canCompileShaders(int n, int[][] deps) {
        List<List<Integer>> g = new ArrayList<>();
        int[] ind = new int[n];
        for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        for (int[] d : deps) { g.get(d[1]).add(d[0]); ind[d[0]]++; }
        Queue<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < n; i++) if (ind[i] == 0) q.add(i);
        int vis = 0;
        while (!q.isEmpty()) {
            int u = q.poll(); vis++;
            for (int v : g.get(u)) if (--ind[v] == 0) q.add(v);
        }
        return vis == n;
    }
}`,
    pythonSolution: `from collections import deque
def canCompileShaders(n, deps):
    g = [[] for _ in range(n)]; ind = [0] * n
    for a, b in deps: g[b].append(a); ind[a] += 1
    q = deque([i for i in range(n) if ind[i] == 0]); vis = 0
    while q:
        u = q.popleft(); vis += 1
        for v in g[u]:
            ind[v] -= 1
            if ind[v] == 0: q.append(v)
    return vis == n`
  },
  {
    number: 33,
    title: 'Pixel Histogram Mode Intensity',
    fnName: 'dominantPixelIntensity',
    description: 'Given grayscale pixel intensities <code>pixels</code>, return the most frequent intensity (if tied, return the smallest intensity).',
    constraints: ['1 <= pixels.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'pixels = [10, 20, 10, 30, 20]', output: '10' },
      { title: 'Test Case 2', input: 'pixels = [255]', output: '255' },
      { title: 'Test Case 3', input: 'pixels = [5, 5, 2, 2, 2]', output: '2' },
      { title: 'Test Case 4', input: 'pixels = [0, 1, 2, 3]', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int dominantPixelIntensity(int[] pixels) {
        Map<Integer, Integer> freq = new HashMap<>();
        int bestVal = pixels[0], bestCnt = 0;
        for (int p : pixels) {
            int c = freq.getOrDefault(p, 0) + 1;
            freq.put(p, c);
            if (c > bestCnt || (c == bestCnt && p < bestVal)) { bestCnt = c; bestVal = p; }
        }
        return bestVal;
    }
}`,
    pythonSolution: `from collections import Counter
def dominantPixelIntensity(pixels):
    cnt = Counter(pixels)
    return min(cnt.keys(), key=lambda x: (-cnt[x], x))`
  },
  {
    number: 34,
    title: 'Font Fallback Chain Lookup',
    fnName: 'firstAvailableFontIndex',
    description: 'Given a priority list of requested font IDs <code>requested</code> and a set of installed font IDs <code>installed</code>, return the 0-based index of the first requested font that is installed, or <code>-1</code>.',
    constraints: ['1 <= requested.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'requested = [10, 20, 30], installed = [5, 30, 20]', output: '1' },
      { title: 'Test Case 2', input: 'requested = [1, 2], installed = [3, 4]', output: '-1' },
      { title: 'Test Case 3', input: 'requested = [7], installed = [7]', output: '0' },
      { title: 'Test Case 4', input: 'requested = [4, 5, 6], installed = []', output: '-1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int firstAvailableFontIndex(int[] requested, int[] installed) {
        Set<Integer> s = new HashSet<>();
        for (int x : installed) s.add(x);
        for (int i = 0; i < requested.length; i++) if (s.contains(requested[i])) return i;
        return -1;
    }
}`,
    pythonSolution: `def firstAvailableFontIndex(requested, installed):
    s = set(installed)
    for i, f in enumerate(requested):
        if f in s: return i
    return -1`
  },
  {
    number: 35,
    title: 'Diagonal Canvas Checkerboard Sum',
    fnName: 'checkerboardDarkSum',
    description: 'Given an <code>n x m</code> matrix <code>grid</code>, return the sum of elements at cells <code>(r, c)</code> where <code>(r + c)</code> is even.',
    constraints: ['1 <= grid.length, grid[0].length <= 500'],
    testCases: [
      { title: 'Test Case 1', input: 'grid = [[1, 2, 3], [4, 5, 6]]', output: '9' },
      { title: 'Test Case 2', input: 'grid = [[10]]', output: '10' },
      { title: 'Test Case 3', input: 'grid = [[1, 1], [1, 1]]', output: '2' },
      { title: 'Test Case 4', input: 'grid = [[2, 9], [8, 3]]', output: '5' }
    ],
    javaSolution: `public class Solution {
    public static long checkerboardDarkSum(int[][] grid) {
        long s = 0;
        for (int r = 0; r < grid.length; r++)
            for (int c = 0; c < grid[0].length; c++)
                if ((r + c) % 2 == 0) s += grid[r][c];
        return s;
    }
}`,
    pythonSolution: `def checkerboardDarkSum(grid):
    return sum(grid[r][c] for r in range(len(grid)) for c in range(len(grid[0])) if (r + c) % 2 == 0)`
  },
  {
    number: 36,
    title: 'Asset License Expiry Window',
    fnName: 'countExpiringSoon',
    description: 'Given license expiry days <code>expiryDays</code>, current day <code>today</code>, and alert window <code>window</code>, count licenses expiring in <code>[today, today + window]</code> inclusive.',
    constraints: ['1 <= expiryDays.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'expiryDays = [10, 15, 25, 35], today = 12, window = 15', output: '2' },
      { title: 'Test Case 2', input: 'expiryDays = [5, 6], today = 10, window = 5', output: '0' },
      { title: 'Test Case 3', input: 'expiryDays = [10, 20], today = 10, window = 10', output: '2' },
      { title: 'Test Case 4', input: 'expiryDays = [100], today = 50, window = 0', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countExpiringSoon(int[] expiryDays, int today, int window) {
        int cnt = 0;
        for (int d : expiryDays) if (d >= today && d <= today + window) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countExpiringSoon(expiryDays, today, window):
    return sum(1 for d in expiryDays if today <= d <= today + window)`
  },
  {
    number: 37,
    title: 'DP Minimum Brush Strokes',
    fnName: 'minBrushStrokes',
    description: 'A 1D canvas of target heights <code>heights</code> is painted using horizontal strokes (each stroke raises a contiguous range by 1). Return the minimum number of strokes required.',
    constraints: ['1 <= heights.length <= 10^5', '0 <= heights[i] <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'heights = [1, 2, 3, 2, 1]', output: '3' },
      { title: 'Test Case 2', input: 'heights = [3, 1, 2, 4]', output: '6' },
      { title: 'Test Case 3', input: 'heights = [0, 0, 0]', output: '0' },
      { title: 'Test Case 4', input: 'heights = [5]', output: '5' }
    ],
    javaSolution: `public class Solution {
    public static long minBrushStrokes(int[] heights) {
        long strokes = heights[0];
        for (int i = 1; i < heights.length; i++) {
            if (heights[i] > heights[i - 1]) strokes += heights[i] - heights[i - 1];
        }
        return strokes;
    }
}`,
    pythonSolution: `def minBrushStrokes(heights):
    return heights[0] + sum(max(0, heights[i] - heights[i - 1]) for i in range(1, len(heights)))`
  },
  {
    number: 38,
    title: 'Video Frame Drop Recovery',
    fnName: 'longestSmoothPlayback',
    description: 'Given frame render times <code>renderMs</code> and deadline <code>budgetMs</code>, return the longest contiguous streak of frames with <code>renderMs[i] <= budgetMs</code>.',
    constraints: ['1 <= renderMs.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'renderMs = [12, 15, 20, 10, 11, 14, 25], budgetMs = 16', output: '3' },
      { title: 'Test Case 2', input: 'renderMs = [30, 40], budgetMs = 16', output: '0' },
      { title: 'Test Case 3', input: 'renderMs = [16, 16, 16], budgetMs = 16', output: '3' },
      { title: 'Test Case 4', input: 'renderMs = [5], budgetMs = 10', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int longestSmoothPlayback(int[] renderMs, int budgetMs) {
        int cur = 0, best = 0;
        for (int r : renderMs) {
            cur = (r <= budgetMs) ? cur + 1 : 0;
            best = Math.max(best, cur);
        }
        return best;
    }
}`,
    pythonSolution: `def longestSmoothPlayback(renderMs, budgetMs):
    cur = best = 0
    for r in renderMs:
        cur = cur + 1 if r <= budgetMs else 0
        best = max(best, cur)
    return best`
  },
  {
    number: 39,
    title: 'Vector Grid Manhattan Path Count',
    fnName: 'countGridPathsMod',
    description: 'Count distinct paths from top-left <code>(0, 0)</code> to bottom-right <code>(R-1, C-1)</code> in a grid with obstacles (<code>1</code> = blocked, <code>0</code> = open), moving only right or down, modulo <code>10^9 + 7</code>.',
    constraints: ['1 <= R, C <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'grid = [[0, 0, 0], [0, 1, 0], [0, 0, 0]]', output: '2' },
      { title: 'Test Case 2', input: 'grid = [[1, 0], [0, 0]]', output: '0' },
      { title: 'Test Case 3', input: 'grid = [[0, 0], [0, 0]]', output: '2' },
      { title: 'Test Case 4', input: 'grid = [[0]]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static long countGridPathsMod(int[][] grid) {
        int R = grid.length, C = grid[0].length;
        long MOD = 1_000_000_007L;
        long[] dp = new long[C];
        dp[0] = grid[0][0] == 0 ? 1 : 0;
        for (int r = 0; r < R; r++) {
            for (int c = 0; c < C; c++) {
                if (grid[r][c] == 1) dp[c] = 0;
                else if (c > 0) dp[c] = (dp[c] + dp[c - 1]) % MOD;
            }
        }
        return dp[C - 1];
    }
}`,
    pythonSolution: `def countGridPathsMod(grid):
    R, C = len(grid), len(grid[0])
    MOD = 10**9 + 7
    dp = [0] * C
    dp[0] = 1 if grid[0][0] == 0 else 0
    for r in range(R):
        for c in range(C):
            if grid[r][c] == 1: dp[c] = 0
            elif c > 0: dp[c] = (dp[c] + dp[c - 1]) % MOD
    return dp[-1]`
  },
  {
    number: 40,
    title: 'Bitwise RGB Channel Packing',
    fnName: 'packRgbHexInt',
    description: 'Pack three 8-bit color channels <code>r, g, b</code> (0..255) into a single 24-bit integer <code>(r &lt;&lt; 16) | (g &lt;&lt; 8) | b</code>.',
    constraints: ['0 <= r, g, b <= 255'],
    testCases: [
      { title: 'Test Case 1', input: 'r = 255, g = 0, b = 0', output: '16711680' },
      { title: 'Test Case 2', input: 'r = 0, g = 255, b = 0', output: '65280' },
      { title: 'Test Case 3', input: 'r = 1, g = 2, b = 3', output: '66051' },
      { title: 'Test Case 4', input: 'r = 0, g = 0, b = 0', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int packRgbHexInt(int r, int g, int b) {
        return (r << 16) | (g << 8) | b;
    }
}`,
    pythonSolution: `def packRgbHexInt(r, g, b):
    return (r << 16) | (g << 8) | b`
  },
  {
    number: 41,
    title: 'Document Revision Merge Conflicts',
    fnName: 'countOverlappingEdits',
    description: 'Two editors submit sorted non-overlapping line-range edits <code>editsA</code> and <code>editsB</code> (each <code>[start, end]</code> inclusive). Return how many pairs <code>(a, b)</code> overlap.',
    constraints: ['0 <= editsA.length, editsB.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'editsA = [[1, 5], [10, 12]], editsB = [[4, 11]]', output: '2' },
      { title: 'Test Case 2', input: 'editsA = [[1, 3]], editsB = [[4, 6]]', output: '0' },
      { title: 'Test Case 3', input: 'editsA = [[2, 4]], editsB = [[4, 5]]', output: '1' },
      { title: 'Test Case 4', input: 'editsA = [], editsB = [[1, 2]]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countOverlappingEdits(int[][] editsA, int[][] editsB) {
        int i = 0, j = 0, cnt = 0;
        while (i < editsA.length && j < editsB.length) {
            if (Math.max(editsA[i][0], editsB[j][0]) <= Math.min(editsA[i][1], editsB[j][1])) cnt++;
            if (editsA[i][1] < editsB[j][1]) i++;
            else j++;
        }
        return cnt;
    }
}`,
    pythonSolution: `def countOverlappingEdits(editsA, editsB):
    i = j = cnt = 0
    while i < len(editsA) and j < len(editsB):
        if max(editsA[i][0], editsB[j][0]) <= min(editsA[i][1], editsB[j][1]): cnt += 1
        if editsA[i][1] < editsB[j][1]: i += 1
        else: j += 1
    return cnt`
  },
  {
    number: 42,
    title: 'Palette Contrast Ratio Pairs',
    fnName: 'countHighContrastPairs',
    description: 'Given sorted luminance values <code>lum</code> and minimum difference <code>minDiff</code>, count how many pairs <code>(i, j)</code> with <code>i &lt; j</code> satisfy <code>lum[j] - lum[i] >= minDiff</code>.',
    constraints: ['1 <= lum.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'lum = [10, 30, 60, 100], minDiff = 40', output: '4' },
      { title: 'Test Case 2', input: 'lum = [10, 20, 30], minDiff = 50', output: '0' },
      { title: 'Test Case 3', input: 'lum = [0, 100], minDiff = 100', output: '1' },
      { title: 'Test Case 4', input: 'lum = [5], minDiff = 1', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long countHighContrastPairs(int[] lum, int minDiff) {
        long cnt = 0; int r = 0, n = lum.length;
        for (int l = 0; l < n; l++) {
            while (r < n && lum[r] - lum[l] < minDiff) r++;
            cnt += n - r;
        }
        return cnt;
    }
}`,
    pythonSolution: `def countHighContrastPairs(lum, minDiff):
    cnt = r = 0; n = len(lum)
    for l in range(n):
        while r < n and lum[r] - lum[l] < minDiff: r += 1
        cnt += n - r
    return cnt`
  },
  {
    number: 43,
    title: 'Thumbnail Cache Eviction Memory',
    fnName: 'minEvictionsForMemory',
    description: 'Thumbnails occupy memory <code>sizes</code>. Given total used memory exceeding target by <code>needFree</code> bytes, return the minimum number of thumbnails to evict so freed bytes <code>>= needFree</code> (or <code>-1</code> if impossible).',
    constraints: ['1 <= sizes.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'sizes = [20, 50, 10, 40], needFree = 80', output: '2' },
      { title: 'Test Case 2', input: 'sizes = [10, 20], needFree = 50', output: '-1' },
      { title: 'Test Case 3', input: 'sizes = [100], needFree = 0', output: '0' },
      { title: 'Test Case 4', input: 'sizes = [30, 30, 30], needFree = 60', output: '2' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minEvictionsForMemory(int[] sizes, long needFree) {
        if (needFree <= 0) return 0;
        Arrays.sort(sizes);
        long freed = 0; int cnt = 0;
        for (int i = sizes.length - 1; i >= 0; i--) {
            freed += sizes[i]; cnt++;
            if (freed >= needFree) return cnt;
        }
        return -1;
    }
}`,
    pythonSolution: `def minEvictionsForMemory(sizes, needFree):
    if needFree <= 0: return 0
    freed = cnt = 0
    for s in sorted(sizes, reverse=True):
        freed += s; cnt += 1
        if freed >= needFree: return cnt
    return -1`
  },
  {
    number: 44,
    title: 'Raster Scanline Span Union',
    fnName: 'maxConcurrentOverlays',
    description: 'Given overlay intervals <code>overlays</code> <code>[start, end)</code> on a video timeline, return the maximum number of overlays active at the same moment.',
    constraints: ['1 <= overlays.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'overlays = [[1, 5], [2, 6], [5, 8]]', output: '2' },
      { title: 'Test Case 2', input: 'overlays = [[1, 10], [2, 9], [3, 8]]', output: '3' },
      { title: 'Test Case 3', input: 'overlays = [[1, 2], [2, 3]]', output: '1' },
      { title: 'Test Case 4', input: 'overlays = [[0, 5]]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxConcurrentOverlays(int[][] overlays) {
        int n = overlays.length;
        int[] s = new int[n], e = new int[n];
        for (int i = 0; i < n; i++) { s[i] = overlays[i][0]; e[i] = overlays[i][1]; }
        Arrays.sort(s); Arrays.sort(e);
        int i = 0, j = 0, cur = 0, best = 0;
        while (i < n) {
            if (s[i] < e[j]) { cur++; best = Math.max(best, cur); i++; }
            else { cur--; j++; }
        }
        return best;
    }
}`,
    pythonSolution: `def maxConcurrentOverlays(overlays):
    s = sorted(x[0] for x in overlays); e = sorted(x[1] for x in overlays)
    i = j = cur = best = 0
    while i < len(s):
        if s[i] < e[j]: cur += 1; best = max(best, cur); i += 1
        else: cur -= 1; j += 1
    return best`
  },
  {
    number: 45,
    title: 'Bitwise Flag Toggle Parity',
    fnName: 'finalFeatureState',
    description: 'Starting with feature bitmask <code>0</code>, apply toggle operations <code>toggles</code> where each integer <code>b</code> flips bit <code>b</code> (<code>mask ^= (1 &lt;&lt; b)</code>). Return the final integer bitmask.',
    constraints: ['1 <= toggles.length <= 10^5', '0 <= toggles[i] <= 30'],
    testCases: [
      { title: 'Test Case 1', input: 'toggles = [0, 1, 0, 2]', output: '6' },
      { title: 'Test Case 2', input: 'toggles = [3, 3]', output: '0' },
      { title: 'Test Case 3', input: 'toggles = [0, 1, 2]', output: '7' },
      { title: 'Test Case 4', input: 'toggles = [4]', output: '16' }
    ],
    javaSolution: `public class Solution {
    public static int finalFeatureState(int[] toggles) {
        int mask = 0;
        for (int b : toggles) mask ^= (1 << b);
        return mask;
    }
}`,
    pythonSolution: `def finalFeatureState(toggles):
    m = 0
    for b in toggles: m ^= (1 << b)
    return m`
  },
  {
    number: 46,
    title: 'Text Box Word-Wrap Line Count',
    fnName: 'countWrappedLines',
    description: 'Given word lengths <code>wordLens</code> and box width <code>maxWidth</code> (with 1-space gap between words on the same line), greedily pack words onto lines. Return total lines needed.',
    constraints: ['1 <= wordLens.length <= 10^5', 'max(wordLens) <= maxWidth <= 10^6'],
    testCases: [
      { title: 'Test Case 1', input: 'wordLens = [3, 4, 2, 5], maxWidth = 8', output: '2' },
      { title: 'Test Case 2', input: 'wordLens = [5, 5, 5], maxWidth = 5', output: '3' },
      { title: 'Test Case 3', input: 'wordLens = [2, 2, 2], maxWidth = 8', output: '1' },
      { title: 'Test Case 4', input: 'wordLens = [7], maxWidth = 10', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countWrappedLines(int[] wordLens, int maxWidth) {
        int lines = 1, cur = wordLens[0];
        for (int i = 1; i < wordLens.length; i++) {
            if (cur + 1 + wordLens[i] <= maxWidth) cur += 1 + wordLens[i];
            else { lines++; cur = wordLens[i]; }
        }
        return lines;
    }
}`,
    pythonSolution: `def countWrappedLines(wordLens, maxWidth):
    lines, cur = 1, wordLens[0]
    for w in wordLens[1:]:
        if cur + 1 + w <= maxWidth: cur += 1 + w
        else: lines += 1; cur = w
    return lines`
  },
  {
    number: 47,
    title: 'Color Channel Clamp Sum',
    fnName: 'clampedChannelSum',
    description: 'Given pixel channel deltas <code>vals</code>, clamp each value into <code>[0, 255]</code> and return the sum of clamped values.',
    constraints: ['1 <= vals.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'vals = [-10, 128, 300]', output: '383' },
      { title: 'Test Case 2', input: 'vals = [0, 255]', output: '255' },
      { title: 'Test Case 3', input: 'vals = [-5, -10]', output: '0' },
      { title: 'Test Case 4', input: 'vals = [500, 500]', output: '510' }
    ],
    javaSolution: `public class Solution {
    public static long clampedChannelSum(int[] vals) {
        long s = 0;
        for (int v : vals) s += Math.max(0, Math.min(255, v));
        return s;
    }
}`,
    pythonSolution: `def clampedChannelSum(vals):
    return sum(max(0, min(255, v)) for v in vals)`
  },
  {
    number: 48,
    title: 'Sprite Sheet Packing Rows',
    fnName: 'totalSpriteSheetHeight',
    description: 'Given sprite widths <code>w</code> and heights <code>h</code> placed left-to-right on shelves of width <code>sheetW</code> (starting a new shelf when <code>curW + w[i] &gt; sheetW</code>), where each shelf height equals the tallest sprite on that shelf, return total sheet height.',
    constraints: ['1 <= w.length == h.length <= 10^4', 'max(w) <= sheetW <= 10^6'],
    testCases: [
      { title: 'Test Case 1', input: 'w = [40, 50, 30, 60], h = [20, 30, 10, 25], sheetW = 100', output: '55' },
      { title: 'Test Case 2', input: 'w = [10, 10, 10], h = [5, 12, 8], sheetW = 30', output: '12' },
      { title: 'Test Case 3', input: 'w = [50, 50], h = [10, 20], sheetW = 50', output: '30' },
      { title: 'Test Case 4', input: 'w = [20], h = [15], sheetW = 20', output: '15' }
    ],
    javaSolution: `public class Solution {
    public static long totalSpriteSheetHeight(int[] w, int[] h, int sheetW) {
        long totalH = 0; int curW = 0, rowH = 0;
        for (int i = 0; i < w.length; i++) {
            if (curW + w[i] > sheetW) {
                totalH += rowH;
                curW = w[i]; rowH = h[i];
            } else {
                curW += w[i]; rowH = Math.max(rowH, h[i]);
            }
        }
        return totalH + rowH;
    }
}`,
    pythonSolution: `def totalSpriteSheetHeight(w, h, sheetW):
    totalH = curW = rowH = 0
    for wi, hi in zip(w, h):
        if curW + wi > sheetW:
            totalH += rowH; curW = wi; rowH = hi
        else:
            curW += wi; rowH = max(rowH, hi)
    return totalH + rowH`
  },
  {
    number: 49,
    title: 'Document Search Highlight Segments',
    fnName: 'countMergedHighlights',
    description: 'Given search-match character spans <code>spans</code> <code>[start, end]</code> (inclusive), merge overlapping or touching spans (<code>s2 <= e1 + 1</code>) and return the number of merged highlight spans.',
    constraints: ['0 <= spans.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'spans = [[1, 3], [4, 6], [10, 12]]', output: '2' },
      { title: 'Test Case 2', input: 'spans = [[0, 2], [2, 5]]', output: '1' },
      { title: 'Test Case 3', input: 'spans = []', output: '0' },
      { title: 'Test Case 4', input: 'spans = [[1, 1], [3, 3], [5, 5]]', output: '3' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countMergedHighlights(int[][] spans) {
        if (spans.length == 0) return 0;
        Arrays.sort(spans, (a, b) -> Integer.compare(a[0], b[0]));
        int cnt = 1, e = spans[0][1];
        for (int i = 1; i < spans.length; i++) {
            if (spans[i][0] <= e + 1) e = Math.max(e, spans[i][1]);
            else { cnt++; e = spans[i][1]; }
        }
        return cnt;
    }
}`,
    pythonSolution: `def countMergedHighlights(spans):
    if not spans: return 0
    spans.sort()
    cnt, e = 1, spans[0][1]
    for a, b in spans[1:]:
        if a <= e + 1: e = max(e, b)
        else: cnt += 1; e = b
    return cnt`
  },
  {
    number: 50,
    title: 'Export Preset Bitmask Minimum Set',
    fnName: 'minPresetsToCoverAll',
    description: 'Given <code>n</code> required features (<code>0..n-1</code>) where <code>n &lt;= 12</code>, and preset masks <code>presets</code>, return the minimum number of presets whose bitwise OR covers all <code>n</code> features, or <code>-1</code> if impossible.',
    constraints: ['1 <= n <= 12', '1 <= presets.length <= 50'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 3, presets = [1, 2, 4, 3]', output: '2' },
      { title: 'Test Case 2', input: 'n = 4, presets = [15, 1, 2]', output: '1' },
      { title: 'Test Case 3', input: 'n = 3, presets = [1, 2]', output: '-1' },
      { title: 'Test Case 4', input: 'n = 4, presets = [3, 12, 5, 10]', output: '2' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minPresetsToCoverAll(int n, int[] presets) {
        int full = (1 << n) - 1;
        int[] dp = new int[1 << n];
        Arrays.fill(dp, 1000000);
        dp[0] = 0;
        for (int p : presets) {
            for (int m = 0; m <= full; m++) {
                if (dp[m] < 1000000) dp[m | p] = Math.min(dp[m | p], dp[m] + 1);
            }
        }
        return dp[full] >= 1000000 ? -1 : dp[full];
    }
}`,
    pythonSolution: `def minPresetsToCoverAll(n, presets):
    full = (1 << n) - 1
    dp = [10**9] * (1 << n)
    dp[0] = 0
    for p in presets:
        for m in range(full + 1):
            if dp[m] + 1 < dp[m | p]:
                dp[m | p] = dp[m] + 1
    return -1 if dp[full] >= 10**9 else dp[full]`
  }
];
