export const HCLTECH_P2 = [
  {
    number: 31,
    title: 'Firmware Nibble-Swap Checksum',
    fnName: 'swapNibblesXor',
    description: 'In an HCLTech embedded firmware diagnostic, each byte <code>b</code> (0..255) has its upper 4 bits and lower 4 bits swapped: <code>((b &amp; 0x0F) &lt;&lt; 4) | (b &gt;&gt; 4)</code>. Given an array of bytes <code>bytes</code>, swap nibbles of every byte and return the XOR of all transformed bytes.',
    constraints: ['1 <= bytes.length <= 10^5', '0 <= bytes[i] <= 255'],
    testCases: [
      { title: 'Test Case 1', input: 'bytes = [18, 52]', output: '98' },
      { title: 'Test Case 2', input: 'bytes = [255, 255]', output: '0' },
      { title: 'Test Case 3', input: 'bytes = [1]', output: '16' },
      { title: 'Test Case 4', input: 'bytes = [0, 16]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int swapNibblesXor(int[] bytes) {
        int res = 0;
        for (int b : bytes) {
            int swapped = ((b & 0x0F) << 4) | (b >> 4);
            res ^= swapped;
        }
        return res;
    }
}`,
    pythonSolution: `def swapNibblesXor(bytes):
    res = 0
    for b in bytes:
        res ^= ((b & 0x0F) << 4) | (b >> 4)
    return res`
  },
  {
    number: 32,
    title: 'Autoscaler Pod Scale-Down Cooldown',
    fnName: 'countScaleDownEvents',
    description: 'A Kubernetes autoscaler checks CPU usage <code>cpu</code> every minute. If usage is strictly below <code>lowThresh</code>, it scales down and enters a <code>cooldown</code>-minute freeze (ignoring the next <code>cooldown</code> readings). Return the total number of scale-down events.',
    constraints: ['1 <= cpu.length <= 10^5', '0 <= cooldown <= 100'],
    testCases: [
      { title: 'Test Case 1', input: 'cpu = [20, 10, 15, 25, 10, 10], lowThresh = 30, cooldown = 2', output: '2' },
      { title: 'Test Case 2', input: 'cpu = [50, 60, 70], lowThresh = 30, cooldown = 1', output: '0' },
      { title: 'Test Case 3', input: 'cpu = [10, 10, 10, 10], lowThresh = 20, cooldown = 0', output: '4' },
      { title: 'Test Case 4', input: 'cpu = [30, 29], lowThresh = 30, cooldown = 5', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countScaleDownEvents(int[] cpu, int lowThresh, int cooldown) {
        int events = 0, i = 0;
        while (i < cpu.length) {
            if (cpu[i] < lowThresh) { events++; i += cooldown + 1; }
            else i++;
        }
        return events;
    }
}`,
    pythonSolution: `def countScaleDownEvents(cpu, lowThresh, cooldown):
    events = i = 0
    while i < len(cpu):
        if cpu[i] < lowThresh: events += 1; i += cooldown + 1
        else: i += 1
    return events`
  },
  {
    number: 33,
    title: 'VLAN Trunk Tag Filter',
    fnName: 'countAllowedFrames',
    description: 'A switch trunk port only forwards frames whose VLAN ID is in <code>allowedVlans</code> and not in <code>blockedVlans</code>. Given incoming frame VLAN IDs <code>frames</code>, return the count of forwarded frames.',
    constraints: ['1 <= frames.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'frames = [10, 20, 30, 10, 40], allowedVlans = [10, 20, 30], blockedVlans = [20]', output: '3' },
      { title: 'Test Case 2', input: 'frames = [1, 2, 3], allowedVlans = [4, 5], blockedVlans = []', output: '0' },
      { title: 'Test Case 3', input: 'frames = [100, 100], allowedVlans = [100], blockedVlans = [100]', output: '0' },
      { title: 'Test Case 4', input: 'frames = [5], allowedVlans = [5], blockedVlans = []', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countAllowedFrames(int[] frames, int[] allowedVlans, int[] blockedVlans) {
        Set<Integer> allow = new HashSet<>(), block = new HashSet<>();
        for (int x : allowedVlans) allow.add(x);
        for (int x : blockedVlans) block.add(x);
        int cnt = 0;
        for (int f : frames) if (allow.contains(f) && !block.contains(f)) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countAllowedFrames(frames, allowedVlans, blockedVlans):
    allow, block = set(allowedVlans), set(blockedVlans)
    return sum(1 for f in frames if f in allow and f not in block)`
  },
  {
    number: 34,
    title: 'BIOS Boot-Order Priority Resolver',
    fnName: 'firstBootableDevice',
    description: 'BIOS tries boot devices in order <code>order</code> (device names). Given a parallel list of all detected healthy devices <code>healthy</code>, return the name of the first device in <code>order</code> that is present in <code>healthy</code>, or <code>"NO_BOOT_DEVICE"</code>.',
    constraints: ['1 <= order.length <= 1000'],
    testCases: [
      { title: 'Test Case 1', input: 'order = ["USB", "NVME0", "PXE"], healthy = ["PXE", "NVME0"]', output: 'NVME0' },
      { title: 'Test Case 2', input: 'order = ["USB", "DVD"], healthy = ["NVME0"]', output: 'NO_BOOT_DEVICE' },
      { title: 'Test Case 3', input: 'order = ["SSD"], healthy = ["SSD"]', output: 'SSD' },
      { title: 'Test Case 4', input: 'order = ["PXE", "USB"], healthy = []', output: 'NO_BOOT_DEVICE' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static String firstBootableDevice(String[] order, String[] healthy) {
        Set<String> ok = new HashSet<>(Arrays.asList(healthy));
        for (String d : order) if (ok.contains(d)) return d;
        return "NO_BOOT_DEVICE";
    }
}`,
    pythonSolution: `def firstBootableDevice(order, healthy):
    ok = set(healthy)
    for d in order:
        if d in ok: return d
    return "NO_BOOT_DEVICE"`
  },
  {
    number: 35,
    title: 'Disk Contiguous Free Sector Span',
    fnName: 'largestFreeSectorBlock',
    description: 'Given a disk sector map <code>sectors</code> where <code>0</code> is free and <code>1</code> is allocated, return the length of the longest contiguous run of free sectors.',
    constraints: ['1 <= sectors.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'sectors = [1, 0, 0, 0, 1, 0, 0, 1]', output: '3' },
      { title: 'Test Case 2', input: 'sectors = [1, 1, 1]', output: '0' },
      { title: 'Test Case 3', input: 'sectors = [0, 0, 0, 0]', output: '4' },
      { title: 'Test Case 4', input: 'sectors = [0, 1, 0]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int largestFreeSectorBlock(int[] sectors) {
        int cur = 0, best = 0;
        for (int s : sectors) { if (s == 0) { cur++; best = Math.max(best, cur); } else cur = 0; }
        return best;
    }
}`,
    pythonSolution: `def largestFreeSectorBlock(sectors):
    cur = best = 0
    for s in sectors:
        cur = cur + 1 if s == 0 else 0
        if cur > best: best = cur
    return best`
  },
  {
    number: 36,
    title: 'Interrupt Vector Priority Mask',
    fnName: 'highestUnmaskedIrq',
    description: 'An 8-bit interrupt controller has pending IRQ bitmask <code>pending</code> and enabled mask <code>enabled</code> (bit <code>i</code> = 1 means IRQ <code>i</code> is pending/enabled). Lower IRQ index means higher priority. Return the highest-priority IRQ index (0..31) that is both pending and enabled, or <code>-1</code>.',
    constraints: ['0 <= pending, enabled <= 2^31 - 1'],
    testCases: [
      { title: 'Test Case 1', input: 'pending = 12, enabled = 10', output: '3' },
      { title: 'Test Case 2', input: 'pending = 5, enabled = 2', output: '-1' },
      { title: 'Test Case 3', input: 'pending = 1, enabled = 1', output: '0' },
      { title: 'Test Case 4', input: 'pending = 24, enabled = 24', output: '3' }
    ],
    javaSolution: `public class Solution {
    public static int highestUnmaskedIrq(int pending, int enabled) {
        int active = pending & enabled;
        if (active == 0) return -1;
        return Integer.numberOfTrailingZeros(active);
    }
}`,
    pythonSolution: `def highestUnmaskedIrq(pending, enabled):
    active = pending & enabled
    if active == 0: return -1
    return (active & -active).bit_length() - 1`
  },
  {
    number: 37,
    title: 'DNS TTL Cache Expiration Simulator',
    fnName: 'countDnsCacheHits',
    description: 'A DNS resolver receives queries <code>[timestamp, domainId]</code> sorted by <code>timestamp</code>. On a cache miss, it caches <code>domainId</code> with expiry <code>timestamp + ttl</code> (valid while <code>queryTime &lt; expiry</code>). Return total cache hits.',
    constraints: ['1 <= queries.length <= 10^5', '1 <= ttl <= 10^6'],
    testCases: [
      { title: 'Test Case 1', input: 'queries = [[0, 1], [5, 1], [10, 1], [12, 1]], ttl = 10', output: '2' },
      { title: 'Test Case 2', input: 'queries = [[1, 2], [2, 2], [3, 2]], ttl = 5', output: '2' },
      { title: 'Test Case 3', input: 'queries = [[0, 1], [0, 2], [0, 3]], ttl = 10', output: '0' },
      { title: 'Test Case 4', input: 'queries = [[10, 5], [15, 5]], ttl = 5', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countDnsCacheHits(int[][] queries, int ttl) {
        Map<Integer, Integer> exp = new HashMap<>();
        int hits = 0;
        for (int[] q : queries) {
            int t = q[0], id = q[1];
            if (exp.containsKey(id) && t < exp.get(id)) hits++;
            else exp.put(id, t + ttl);
        }
        return hits;
    }
}`,
    pythonSolution: `def countDnsCacheHits(queries, ttl):
    exp, hits = {}, 0
    for t, dom in queries:
        if dom in exp and t < exp[dom]: hits += 1
        else: exp[dom] = t + ttl
    return hits`
  },
  {
    number: 38,
    title: 'RAID-5 Parity Byte Recovery',
    fnName: 'recoverMissingBlock',
    description: 'In a RAID-5 stripe of <code>n</code> drives, one drive failed and its data array is missing. Given the remaining <code>n - 1</code> drive byte arrays <code>drives</code> (all equal length) and the <code>parity</code> byte array (XOR of all <code>n</code> drives), reconstruct and return the missing drive\'s byte array.',
    constraints: ['1 <= drives.length <= 10', '1 <= parity.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'drives = [[10, 20], [30, 40]], parity = [25, 60]', output: '[13, 0]' },
      { title: 'Test Case 2', input: 'drives = [[5, 7, 9]], parity = [5, 7, 9]', output: '[0, 0, 0]' },
      { title: 'Test Case 3', input: 'drives = [[1, 2], [3, 4]], parity = [0, 0]', output: '[2, 6]' },
      { title: 'Test Case 4', input: 'drives = [[255]], parity = [0]', output: '[255]' }
    ],
    javaSolution: `public class Solution {
    public static int[] recoverMissingBlock(int[][] drives, int[] parity) {
        int[] res = parity.clone();
        for (int[] d : drives) for (int i = 0; i < parity.length; i++) res[i] ^= d[i];
        return res;
    }
}`,
    pythonSolution: `def recoverMissingBlock(drives, parity):
    res = parity[:]
    for d in drives:
        for i, v in enumerate(d): res[i] ^= v
    return res`
  },
  {
    number: 39,
    title: 'CPU Thermal Throttling Duration',
    fnName: 'totalThrottleSeconds',
    description: 'Given per-second CPU temperatures <code>temps</code>, throttling activates when <code>temp &gt;= highTemp</code> and deactivates only when <code>temp &lt;= coolTemp</code> (hysteresis). Initially not throttling. Return total seconds spent throttling.',
    constraints: ['1 <= temps.length <= 10^5', 'coolTemp < highTemp'],
    testCases: [
      { title: 'Test Case 1', input: 'temps = [70, 85, 82, 75, 70, 88], highTemp = 85, coolTemp = 75', output: '3' },
      { title: 'Test Case 2', input: 'temps = [60, 70, 80], highTemp = 85, coolTemp = 70', output: '0' },
      { title: 'Test Case 3', input: 'temps = [90, 90, 90], highTemp = 85, coolTemp = 70', output: '3' },
      { title: 'Test Case 4', input: 'temps = [85, 75, 85], highTemp = 85, coolTemp = 75', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int totalThrottleSeconds(int[] temps, int highTemp, int coolTemp) {
        boolean throttled = false;
        int sec = 0;
        for (int t : temps) {
            if (!throttled && t >= highTemp) throttled = true;
            else if (throttled && t <= coolTemp) throttled = false;
            if (throttled) sec++;
        }
        return sec;
    }
}`,
    pythonSolution: `def totalThrottleSeconds(temps, highTemp, coolTemp):
    throttled, sec = False, 0
    for t in temps:
        if not throttled and t >= highTemp: throttled = True
        elif throttled and t <= coolTemp: throttled = False
        if throttled: sec += 1
    return sec`
  },
  {
    number: 40,
    title: 'FIFO Memory Page Fault Counter',
    fnName: 'countFifoPageFaults',
    description: 'An OS memory manager has <code>frames</code> physical page frames using FIFO replacement. Given a sequence of page requests <code>pages</code>, return the total number of page faults.',
    constraints: ['1 <= frames <= 1000', '1 <= pages.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'pages = [1, 3, 0, 3, 5, 6, 3], frames = 3', output: '6' },
      { title: 'Test Case 2', input: 'pages = [1, 2, 1, 2], frames = 2', output: '2' },
      { title: 'Test Case 3', input: 'pages = [1, 2, 3, 4], frames = 1', output: '4' },
      { title: 'Test Case 4', input: 'pages = [5, 5, 5], frames = 2', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countFifoPageFaults(int[] pages, int frames) {
        Set<Integer> inMem = new HashSet<>();
        Deque<Integer> q = new ArrayDeque<>();
        int faults = 0;
        for (int p : pages) {
            if (!inMem.contains(p)) {
                faults++;
                if (q.size() == frames) inMem.remove(q.poll());
                q.add(p); inMem.add(p);
            }
        }
        return faults;
    }
}`,
    pythonSolution: `def countFifoPageFaults(pages, frames):
    from collections import deque
    in_mem, q, faults = set(), deque(), 0
    for p in pages:
        if p not in in_mem:
            faults += 1
            if len(q) == frames: in_mem.remove(q.popleft())
            q.append(p); in_mem.add(p)
    return faults`
  },
  {
    number: 41,
    title: 'Cron Interval Trigger Counter',
    fnName: 'countCronRunsInWindow',
    description: 'A cron job starts at minute <code>startMin</code> and runs every <code>stepMin</code> minutes (<code>startMin, startMin + stepMin, ...</code>). How many times does it trigger within the inclusive window <code>[winStart, winEnd]</code>?',
    constraints: ['0 <= startMin <= 10^9', '1 <= stepMin <= 10^9', '0 <= winStart <= winEnd <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'startMin = 5, stepMin = 10, winStart = 12, winEnd = 45', output: '4' },
      { title: 'Test Case 2', input: 'startMin = 20, stepMin = 5, winStart = 0, winEnd = 15', output: '0' },
      { title: 'Test Case 3', input: 'startMin = 0, stepMin = 15, winStart = 0, winEnd = 60', output: '5' },
      { title: 'Test Case 4', input: 'startMin = 10, stepMin = 7, winStart = 10, winEnd = 10', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static long countCronRunsInWindow(long startMin, long stepMin, long winStart, long winEnd) {
        if (winEnd < startMin) return 0;
        long first = startMin;
        if (winStart > startMin) {
            long k = (winStart - startMin + stepMin - 1) / stepMin;
            first = startMin + k * stepMin;
        }
        if (first > winEnd) return 0;
        return (winEnd - first) / stepMin + 1;
    }
}`,
    pythonSolution: `def countCronRunsInWindow(startMin, stepMin, winStart, winEnd):
    if winEnd < startMin: return 0
    first = startMin if winStart <= startMin else startMin + ((winStart - startMin + stepMin - 1) // stepMin) * stepMin
    return 0 if first > winEnd else (winEnd - first) // stepMin + 1`
  },
  {
    number: 42,
    title: 'Serial Frame Start-Stop Extractor',
    fnName: 'extractValidPayloads',
    description: 'A serial byte stream <code>stream</code> wraps payloads between start marker <code>0xAA</code> (170) and end marker <code>0x55</code> (85) without nesting. Return an array containing the lengths of all valid complete frames found in order.',
    constraints: ['1 <= stream.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'stream = [170, 1, 2, 3, 85, 99, 170, 4, 85]', output: '[3, 1]' },
      { title: 'Test Case 2', input: 'stream = [170, 85, 170, 1, 2]', output: '[0]' },
      { title: 'Test Case 3', input: 'stream = [1, 2, 3, 85]', output: '[]' },
      { title: 'Test Case 4', input: 'stream = [170, 10, 20, 85]', output: '[2]' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static List<Integer> extractValidPayloads(int[] stream) {
        List<Integer> res = new ArrayList<>();
        boolean inFrame = false;
        int len = 0;
        for (int b : stream) {
            if (b == 170) { inFrame = true; len = 0; }
            else if (b == 85 && inFrame) { res.add(len); inFrame = false; }
            else if (inFrame) len++;
        }
        return res;
    }
}`,
    pythonSolution: `def extractValidPayloads(stream):
    res, in_f, length = [], False, 0
    for b in stream:
        if b == 170: in_f, length = True, 0
        elif b == 85 and in_f: res.append(length); in_f = False
        elif in_f: length += 1
    return res`
  },
  {
    number: 43,
    title: 'UPS Battery Runtime Drain',
    fnName: 'minutesBeforeShutdown',
    description: 'A datacenter UPS starts with <code>charge</code> watt-hours. Each minute <code>i</code>, server load consumes <code>draws[i]</code> watt-hours (if grid is down) or recharges <code>+rechargeRate</code> up to <code>maxCap</code> if <code>draws[i] == 0</code>. Return the 0-based minute when charge drops strictly below 0, or <code>-1</code> if it survives all minutes.',
    constraints: ['1 <= draws.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'charge = 100, draws = [40, 40, 0, 50], rechargeRate = 20, maxCap = 100', output: '3' },
      { title: 'Test Case 2', input: 'charge = 100, draws = [30, 30, 30], rechargeRate = 10, maxCap = 100', output: '-1' },
      { title: 'Test Case 3', input: 'charge = 50, draws = [60], rechargeRate = 10, maxCap = 100', output: '0' },
      { title: 'Test Case 4', input: 'charge = 80, draws = [0, 90], rechargeRate = 30, maxCap = 100', output: '-1' }
    ],
    javaSolution: `public class Solution {
    public static int minutesBeforeShutdown(int charge, int[] draws, int rechargeRate, int maxCap) {
        int cur = charge;
        for (int i = 0; i < draws.length; i++) {
            if (draws[i] == 0) cur = Math.min(maxCap, cur + rechargeRate);
            else { cur -= draws[i]; if (cur < 0) return i; }
        }
        return -1;
    }
}`,
    pythonSolution: `def minutesBeforeShutdown(charge, draws, rechargeRate, maxCap):
    cur = charge
    for i, d in enumerate(draws):
        if d == 0: cur = min(maxCap, cur + rechargeRate)
        else:
            cur -= d
            if cur < 0: return i
    return -1`
  },
  {
    number: 44,
    title: 'NIC Ring-Buffer Overrun Counter',
    fnName: 'countRingOverruns',
    description: 'A network card ring buffer has capacity <code>cap</code>. Given events <code>events</code> where positive integer <code>x</code> enqueues <code>x</code> packets (any packets exceeding <code>cap</code> are dropped as overruns) and negative <code>-y</code> drains up to <code>y</code> packets. Return total dropped packets.',
    constraints: ['1 <= events.length <= 10^5', '1 <= cap <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'events = [5, 8, -4, 6], cap = 10', output: '5' },
      { title: 'Test Case 2', input: 'events = [4, -10, 5], cap = 5', output: '0' },
      { title: 'Test Case 3', input: 'events = [15], cap = 10', output: '5' },
      { title: 'Test Case 4', input: 'events = [-5, 3], cap = 3', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long countRingOverruns(int[] events, int cap) {
        long cur = 0, dropped = 0;
        for (int e : events) {
            if (e > 0) {
                cur += e;
                if (cur > cap) { dropped += cur - cap; cur = cap; }
            } else cur = Math.max(0, cur + e);
        }
        return dropped;
    }
}`,
    pythonSolution: `def countRingOverruns(events, cap):
    cur = dropped = 0
    for e in events:
        if e > 0:
            cur += e
            if cur > cap: dropped += cur - cap; cur = cap
        else:
            cur = max(0, cur + e)
    return dropped`
  },
  {
    number: 45,
    title: 'Patch Window Reboot Minimizer',
    fnName: 'minRebootsRequired',
    description: 'Servers receive patches <code>patches</code> <code>[releaseDay, requiresReboot]</code> sorted by <code>releaseDay</code>. One reboot applies all pending patches released on or before that day. If we must reboot within <code>maxWait</code> days of the earliest unapplied reboot-requiring patch, return minimum reboots needed.',
    constraints: ['1 <= patches.length <= 10^5', '0 <= maxWait <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'patches = [[1, 1], [3, 1], [8, 1]], maxWait = 2', output: '2' },
      { title: 'Test Case 2', input: 'patches = [[1, 0], [5, 0]], maxWait = 1', output: '0' },
      { title: 'Test Case 3', input: 'patches = [[1, 1], [2, 1], [3, 1]], maxWait = 5', output: '1' },
      { title: 'Test Case 4', input: 'patches = [[10, 1]], maxWait = 0', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int minRebootsRequired(int[][] patches, int maxWait) {
        int reboots = 0;
        long coveredUntil = -1;
        for (int[] p : patches) {
            if (p[1] == 1 && p[0] > coveredUntil) {
                reboots++;
                coveredUntil = (long) p[0] + maxWait;
            }
        }
        return reboots;
    }
}`,
    pythonSolution: `def minRebootsRequired(patches, maxWait):
    reboots, covered = 0, -1
    for day, req in patches:
        if req == 1 and day > covered:
            reboots += 1; covered = day + maxWait
    return reboots`
  },
  {
    number: 46,
    title: 'Load-Balancer Sticky Session Router',
    fnName: 'routeStickyRequests',
    description: 'Given session IDs <code>sessions</code> and <code>numServers</code> healthy servers (0..numServers-1), each new session is assigned to <code>sessionId % numServers</code>, and subsequent requests for the same session stay on that server UNLESS that server is in <code>downServers</code>, in which case it re-pins to <code>(server + 1) % numServers</code> (assume at least 1 server is up, check linearly). Return final server for each request.',
    constraints: ['1 <= sessions.length <= 10^4', '1 <= numServers <= 100'],
    testCases: [
      { title: 'Test Case 1', input: 'sessions = [4, 5, 4], numServers = 4, downServers = [0]', output: '[1, 1, 1]' },
      { title: 'Test Case 2', input: 'sessions = [1, 2, 3], numServers = 3, downServers = []', output: '[1, 2, 0]' },
      { title: 'Test Case 3', input: 'sessions = [2, 2], numServers = 3, downServers = [2, 0]', output: '[1, 1]' },
      { title: 'Test Case 4', input: 'sessions = [10], numServers = 2, downServers = [1]', output: '[0]' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int[] routeStickyRequests(int[] sessions, int numServers, int[] downServers) {
        Set<Integer> down = new HashSet<>();
        for (int d : downServers) down.add(d);
        int[] res = new int[sessions.length];
        for (int i = 0; i < sessions.length; i++) {
            int s = sessions[i] % numServers;
            while (down.contains(s)) s = (s + 1) % numServers;
            res[i] = s;
        }
        return res;
    }
}`,
    pythonSolution: `def routeStickyRequests(sessions, numServers, downServers):
    down = set(downServers)
    res = []
    for sid in sessions:
        s = sid % numServers
        while s in down: s = (s + 1) % numServers
        res.append(s)
    return res`
  },
  {
    number: 47,
    title: 'GPIO Pin Debounce Filter',
    fnName: 'countStableTransitions',
    description: 'A hardware GPIO pin outputs binary samples <code>samples</code> (0 or 1). A state starts at <code>samples[0]</code>, and a transition to the opposite state is only accepted if the new state persists for at least <code>k</code> consecutive samples. Return total accepted transitions.',
    constraints: ['1 <= k <= samples.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'samples = [0, 1, 0, 1, 1, 1, 0, 0, 0], k = 3', output: '2' },
      { title: 'Test Case 2', input: 'samples = [0, 1, 1, 0, 0], k = 2', output: '2' },
      { title: 'Test Case 3', input: 'samples = [1, 1, 1, 1], k = 2', output: '0' },
      { title: 'Test Case 4', input: 'samples = [0, 1, 0, 1], k = 2', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countStableTransitions(int[] samples, int k) {
        int state = samples[0], run = 0, trans = 0;
        for (int s : samples) {
            if (s != state) {
                if (++run >= k) { state = s; run = 0; trans++; }
            } else run = 0;
        }
        return trans;
    }
}`,
    pythonSolution: `def countStableTransitions(samples, k):
    state, run, trans = samples[0], 0, 0
    for s in samples:
        if s != state:
            run += 1
            if run >= k: state, run, trans = s, 0, trans + 1
        else:
            run = 0
    return trans`
  },
  {
    number: 48,
    title: 'Log-Rotation Archive Pruner',
    fnName: 'minFilesToDelete',
    description: 'A server stores log files of sizes <code>sizes</code> (MB) from oldest to newest. Total storage must not exceed <code>maxMB</code>, and you must always keep at least the newest <code>minKeep</code> files. Deleting oldest files first, return how many files are deleted (or <code>-1</code> if even keeping only <code>minKeep</code> exceeds <code>maxMB</code>).',
    constraints: ['1 <= minKeep <= sizes.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'sizes = [50, 40, 30, 20, 10], maxMB = 60, minKeep = 2', output: '2' },
      { title: 'Test Case 2', input: 'sizes = [10, 10, 10], maxMB = 50, minKeep = 1', output: '0' },
      { title: 'Test Case 3', input: 'sizes = [10, 50, 50], maxMB = 60, minKeep = 2', output: '-1' },
      { title: 'Test Case 4', input: 'sizes = [30, 30, 30], maxMB = 60, minKeep = 2', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int minFilesToDelete(int[] sizes, long maxMB, int minKeep) {
        long total = 0;
        for (int s : sizes) total += s;
        int del = 0, limit = sizes.length - minKeep;
        while (total > maxMB && del < limit) total -= sizes[del++];
        return total <= maxMB ? del : -1;
    }
}`,
    pythonSolution: `def minFilesToDelete(sizes, maxMB, minKeep):
    total, del_cnt, limit = sum(sizes), 0, len(sizes) - minKeep
    while total > maxMB and del_cnt < limit:
        total -= sizes[del_cnt]; del_cnt += 1
    return del_cnt if total <= maxMB else -1`
  },
  {
    number: 49,
    title: 'Watchdog Heartbeat Miss Detector',
    fnName: 'countAlertTriggers',
    description: 'A watchdog expects heartbeats (<code>1</code> = received, <code>0</code> = missed) in array <code>beats</code>. An alert fires whenever <code>m</code> consecutive heartbeats are missed (and resets after firing). Return total alerts fired.',
    constraints: ['1 <= m <= beats.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'beats = [1, 0, 0, 0, 1, 0, 0, 0, 0], m = 3', output: '2' },
      { title: 'Test Case 2', input: 'beats = [0, 0, 0, 0, 0, 0], m = 2', output: '3' },
      { title: 'Test Case 3', input: 'beats = [1, 1, 1], m = 1', output: '0' },
      { title: 'Test Case 4', input: 'beats = [0, 1, 0, 1], m = 2', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countAlertTriggers(int[] beats, int m) {
        int miss = 0, alerts = 0;
        for (int b : beats) {
            if (b == 0) { if (++miss == m) { alerts++; miss = 0; } }
            else miss = 0;
        }
        return alerts;
    }
}`,
    pythonSolution: `def countAlertTriggers(beats, m):
    miss = alerts = 0
    for b in beats:
        if b == 0:
            miss += 1
            if miss == m: alerts += 1; miss = 0
        else:
            miss = 0
    return alerts`
  },
  {
    number: 50,
    title: 'Container Layer Deduplication Size',
    fnName: 'deduplicatedRegistryMB',
    description: 'Docker images are given as lists of layer hashes <code>images</code>, with a parallel map of layer sizes (given as <code>layerIds</code> and <code>layerSizes</code>). Return the total unique storage (MB) used by all images combined.',
    constraints: ['1 <= images.length <= 1000'],
    testCases: [
      { title: 'Test Case 1', input: 'images = [[1, 2, 3], [1, 2, 4]], layerIds = [1, 2, 3, 4], layerSizes = [100, 50, 30, 40]', output: '220' },
      { title: 'Test Case 2', input: 'images = [[1, 1], [1]], layerIds = [1], layerSizes = [80]', output: '80' },
      { title: 'Test Case 3', input: 'images = [[1], [2]], layerIds = [1, 2], layerSizes = [10, 20]', output: '30' },
      { title: 'Test Case 4', input: 'images = [[]], layerIds = [1], layerSizes = [100]', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long deduplicatedRegistryMB(int[][] images, int[] layerIds, int[] layerSizes) {
        Map<Integer, Integer> sz = new HashMap<>();
        for (int i = 0; i < layerIds.length; i++) sz.put(layerIds[i], layerSizes[i]);
        Set<Integer> used = new HashSet<>();
        for (int[] img : images) for (int id : img) used.add(id);
        long total = 0;
        for (int id : used) total += sz.getOrDefault(id, 0);
        return total;
    }
}`,
    pythonSolution: `def deduplicatedRegistryMB(images, layerIds, layerSizes):
    sz = dict(zip(layerIds, layerSizes))
    used = {lid for img in images for lid in img}
    return sum(sz[lid] for lid in used)`
  }
];
