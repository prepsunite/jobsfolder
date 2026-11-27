export const CISCO_QUESTIONS = [
  {
    number: 1,
    title: 'IPv4 Address Format Validator',
    fnName: 'isValidIPv4',
    description: 'Given a string <code>ip</code>, return <code>true</code> if it is a valid IPv4 address (4 dot-separated octets, each an integer in <code>[0, 255]</code> with no leading zeros unless the octet is <code>"0"</code>), and <code>false</code> otherwise.',
    constraints: ['1 <= ip.length <= 50'],
    testCases: [
      { title: 'Test Case 1', input: 'ip = "192.168.1.1"', output: 'true' },
      { title: 'Test Case 2', input: 'ip = "192.168.01.1"', output: 'false' },
      { title: 'Test Case 3', input: 'ip = "256.100.50.0"', output: 'false' },
      { title: 'Test Case 4', input: 'ip = "0.0.0.0"', output: 'true' }
    ],
    javaSolution: `public class Solution {
    public static boolean isValidIPv4(String ip) {
        String[] parts = ip.split("\\\\.", -1);
        if (parts.length != 4) return false;
        for (String p : parts) {
            if (p.isEmpty() || p.length() > 3) return false;
            if (p.length() > 1 && p.charAt(0) == '0') return false;
            for (char c : p.toCharArray()) if (!Character.isDigit(c)) return false;
            if (Integer.parseInt(p) > 255) return false;
        }
        return true;
    }
}`,
    pythonSolution: `def isValidIPv4(ip):
    parts = ip.split('.')
    if len(parts) != 4: return False
    for p in parts:
        if not p.isdigit() or (len(p) > 1 and p[0] == '0') or int(p) > 255: return False
    return True`
  },
  {
    number: 2,
    title: 'Dropped Packets in Burst Window',
    fnName: 'countDroppedPackets',
    description: 'A Cisco router processes incoming packets per second where <code>requests[i]</code> is the packet count at second <code>i</code>. Each second the router forwards at most <code>rate</code> packets, and excess packets enter a queue of capacity <code>maxQueue</code> (further excess is dropped). Return total dropped packets.',
    constraints: ['1 <= requests.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'requests = [5, 5, 5], rate = 2, maxQueue = 4', output: '5' },
      { title: 'Test Case 2', input: 'requests = [2, 2, 2], rate = 2, maxQueue = 0', output: '0' },
      { title: 'Test Case 3', input: 'requests = [10, 0, 0], rate = 3, maxQueue = 5', output: '2' },
      { title: 'Test Case 4', input: 'requests = [1, 2, 3], rate = 5, maxQueue = 2', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long countDroppedPackets(int[] requests, int rate, int maxQueue) {
        long q = 0, dropped = 0;
        for (int req : requests) {
            q += req; q -= Math.min(q, rate);
            if (q > maxQueue) { dropped += q - maxQueue; q = maxQueue; }
        }
        return dropped;
    }
}`,
    pythonSolution: `def countDroppedPackets(requests, rate, maxQueue):
    q = dropped = 0
    for req in requests:
        q += req; q -= min(q, rate)
        if q > maxQueue: dropped += q - maxQueue; q = maxQueue
    return dropped`
  },
  {
    number: 3,
    title: 'Count Set Bits in Subnet Mask',
    fnName: 'countSubnetPrefixBits',
    description: 'Given a 32-bit unsigned integer <code>mask</code> representing an IPv4 subnet mask, return its CIDR prefix length (number of <code>1</code> bits).',
    constraints: ['0 <= mask <= 2^32 - 1'],
    testCases: [
      { title: 'Test Case 1', input: 'mask = 4294967040', output: '24' },
      { title: 'Test Case 2', input: 'mask = 4294901760', output: '16' },
      { title: 'Test Case 3', input: 'mask = 0', output: '0' },
      { title: 'Test Case 4', input: 'mask = 4294967295', output: '32' }
    ],
    javaSolution: `public class Solution {
    public static int countSubnetPrefixBits(long mask) { return Long.bitCount(mask); }
}`,
    pythonSolution: `def countSubnetPrefixBits(mask): return mask.bit_count()`
  },
  {
    number: 4,
    title: 'ACL Rule First-Match Evaluator',
    fnName: 'evaluateAclPacket',
    description: 'A Cisco IOS ACL has rules <code>rules</code> <code>[srcIp, dstPort, action]</code> (1=PERMIT, 0=DENY; <code>-1</code> is wildcard). Given packet <code>[pktIp, pktPort]</code>, the first matching rule wins; if none match, implicit DENY (<code>0</code>) applies.',
    constraints: ['1 <= rules.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'rules = [[10, 80, 1], [-1, 80, 0], [-1, -1, 1]], pktIp = 20, pktPort = 80', output: '0' },
      { title: 'Test Case 2', input: 'rules = [[10, 443, 1]], pktIp = 10, pktPort = 443', output: '1' },
      { title: 'Test Case 3', input: 'rules = [[10, 80, 1]], pktIp = 99, pktPort = 80', output: '0' },
      { title: 'Test Case 4', input: 'rules = [[-1, -1, 1]], pktIp = 5, pktPort = 22', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int evaluateAclPacket(int[][] rules, int pktIp, int pktPort) {
        for (int[] r : rules) {
            if ((r[0] == -1 || r[0] == pktIp) && (r[1] == -1 || r[1] == pktPort)) return r[2];
        }
        return 0;
    }
}`,
    pythonSolution: `def evaluateAclPacket(rules, pktIp, pktPort):
    for ip, port, act in rules:
        if (ip == -1 or ip == pktIp) and (port == -1 or port == pktPort): return act
    return 0`
  },
  {
    number: 5,
    title: 'MAC Address Canonical Normalizer',
    fnName: 'normalizeMacAddresses',
    description: 'Switches export MAC addresses in mixed formats like <code>"00:1A:2B:3C:4D:5E"</code> or <code>"001a.2b3c.4d5e"</code> or <code>"00-1a-2b-3c-4d-5e"</code>. Strip separators (<code>:</code>, <code>-</code>, <code>.</code>), lowercase all hex digits, and format as <code>"xxxx.xxxx.xxxx"</code>.',
    constraints: ['1 <= macs.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'macs = ["00:1A:2B:3C:4D:5E", "AA-BB-CC-DD-EE-FF"]', output: '["001a.2b3c.4d5e", "aabb.ccdd.eeff"]' },
      { title: 'Test Case 2', input: 'macs = ["1234.5678.90AB"]', output: '["1234.5678.90ab"]' },
      { title: 'Test Case 3', input: 'macs = ["00-00-00-00-00-01"]', output: '["0000.0000.0001"]' },
      { title: 'Test Case 4', input: 'macs = ["FF:FF:FF:FF:FF:FF"]', output: '["ffff.ffff.ffff"]' }
    ],
    javaSolution: `public class Solution {
    public static String[] normalizeMacAddresses(String[] macs) {
        String[] res = new String[macs.length];
        for (int i = 0; i < macs.length; i++) {
            String h = macs[i].replace(":", "").replace("-", "").replace(".", "").toLowerCase();
            res[i] = h.substring(0, 4) + "." + h.substring(4, 8) + "." + h.substring(8, 12);
        }
        return res;
    }
}`,
    pythonSolution: `def normalizeMacAddresses(macs):
    res = []
    for m in macs:
        h = m.replace(':', '').replace('-', '').replace('.', '').lower()
        res.append(f"{h[:4]}.{h[4:8]}.{h[8:]}")
    return res`
  },
  {
    number: 6,
    title: 'Network Delay Time (OSPF Dijkstra)',
    fnName: 'networkDelayTime',
    description: 'Given <code>n</code> routers (1..n), directed edge latencies <code>times</code> <code>[u, v, w]</code>, and source router <code>k</code>, return the minimum time for all routers to receive an OSPF LSA, or <code>-1</code>.',
    constraints: ['1 <= n <= 100'],
    testCases: [
      { title: 'Test Case 1', input: 'times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2', output: '2' },
      { title: 'Test Case 2', input: 'times = [[1,2,1]], n = 2, k = 1', output: '1' },
      { title: 'Test Case 3', input: 'times = [[1,2,1]], n = 2, k = 2', output: '-1' },
      { title: 'Test Case 4', input: 'times = [], n = 1, k = 1', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int networkDelayTime(int[][] times, int n, int k) {
        List<List<int[]>> g = new ArrayList<>(); for (int i = 0; i <= n; i++) g.add(new ArrayList<>());
        for (int[] t : times) g.get(t[0]).add(new int[]{t[1], t[2]});
        int[] dist = new int[n + 1]; Arrays.fill(dist, Integer.MAX_VALUE); dist[k] = 0;
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));
        pq.add(new int[]{0, k});
        while (!pq.isEmpty()) {
            int[] cur = pq.poll();
            if (cur[0] > dist[cur[1]]) continue;
            for (int[] e : g.get(cur[1])) if (cur[0] + e[1] < dist[e[0]]) { dist[e[0]] = cur[0] + e[1]; pq.add(new int[]{dist[e[0]], e[0]}); }
        }
        int mx = 0;
        for (int i = 1; i <= n; i++) { if (dist[i] == Integer.MAX_VALUE) return -1; mx = Math.max(mx, dist[i]); }
        return mx;
    }
}`,
    pythonSolution: `def networkDelayTime(times, n, k):
    import heapq
    g = [[] for _ in range(n + 1)]
    for u, v, w in times: g[u].append((v, w))
    dist = [float('inf')] * (n + 1); dist[k] = 0; pq = [(0, k)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]: continue
        for v, w in g[u]:
            if d + w < dist[v]: dist[v] = d + w; heapq.heappush(pq, (dist[v], v))
    mx = max(dist[1:])
    return -1 if mx == float('inf') else mx`
  },
  {
    number: 7,
    title: 'STP Root-Bridge Election',
    fnName: 'electStpRootBridge',
    description: 'In Spanning Tree Protocol (STP), each switch has <code>[priority, macInt]</code>. The switch with the lowest <code>priority</code> wins; ties are broken by lowest <code>macInt</code>. Return the 0-based index of the elected Root Bridge.',
    constraints: ['1 <= switches.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'switches = [[32768, 500], [4096, 900], [4096, 200]]', output: '2' },
      { title: 'Test Case 2', input: 'switches = [[8192, 100], [4096, 999]]', output: '1' },
      { title: 'Test Case 3', input: 'switches = [[32768, 1]]', output: '0' },
      { title: 'Test Case 4', input: 'switches = [[0, 50], [0, 50]]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int electStpRootBridge(int[][] switches) {
        int best = 0;
        for (int i = 1; i < switches.length; i++) {
            if (switches[i][0] < switches[best][0] || (switches[i][0] == switches[best][0] && switches[i][1] < switches[best][1])) best = i;
        }
        return best;
    }
}`,
    pythonSolution: `def electStpRootBridge(switches):
    return min(range(len(switches)), key=lambda i: (switches[i][0], switches[i][1]))`
  },
  {
    number: 8,
    title: 'NAT Port-Translation Pool Exhaustion',
    fnName: 'countNatFailures',
    description: 'A NAT gateway has <code>poolSize</code> external ports. Events arrive as <code>["OPEN", flowId]</code> or <code>["CLOSE", flowId]</code>. OPEN allocates 1 port if available (else fails); CLOSE frees the port held by <code>flowId</code> if open. Return total failed OPENs.',
    constraints: ['1 <= events.length <= 10^4', '1 <= poolSize <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'poolSize = 2, events = [["OPEN", 1], ["OPEN", 2], ["OPEN", 3], ["CLOSE", 1], ["OPEN", 4]]', output: '1' },
      { title: 'Test Case 2', input: 'poolSize = 1, events = [["OPEN", 1], ["OPEN", 2]]', output: '1' },
      { title: 'Test Case 3', input: 'poolSize = 2, events = [["OPEN", 1], ["CLOSE", 1], ["OPEN", 2]]', output: '0' },
      { title: 'Test Case 4', input: 'poolSize = 1, events = [["CLOSE", 99], ["OPEN", 1]]', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countNatFailures(int poolSize, String[][] events) {
        Set<Integer> active = new HashSet<>();
        int fails = 0;
        for (String[] e : events) {
            int id = Integer.parseInt(e[1]);
            if (e[0].equals("OPEN")) {
                if (active.size() < poolSize) active.add(id); else fails++;
            } else active.remove(id);
        }
        return fails;
    }
}`,
    pythonSolution: `def countNatFailures(poolSize, events):
    active, fails = set(), 0
    for op, fid in events:
        if op == 'OPEN':
            if len(active) < poolSize: active.add(fid)
            else: fails += 1
        else:
            active.discard(fid)
    return fails`
  },
  {
    number: 9,
    title: 'ARP Cache Timeout Eviction',
    fnName: 'countArpMisses',
    description: 'An ARP table caches <code>ip</code> with expiry <code>t + timeout</code> (valid while <code>queryTime &lt; expiry</code>). Given sorted ARP lookups <code>lookups</code> <code>[t, ip]</code>, return total ARP cache misses.',
    constraints: ['1 <= lookups.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'lookups = [[0, 1], [5, 1], [10, 1], [12, 1]], timeout = 10', output: '2' },
      { title: 'Test Case 2', input: 'lookups = [[1, 1], [2, 1], [3, 1]], timeout = 5', output: '1' },
      { title: 'Test Case 3', input: 'lookups = [[0, 1], [0, 2]], timeout = 10', output: '2' },
      { title: 'Test Case 4', input: 'lookups = [[10, 5]], timeout = 1', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countArpMisses(int[][] lookups, int timeout) {
        Map<Integer, Integer> exp = new HashMap<>();
        int misses = 0;
        for (int[] l : lookups) {
            if (!exp.containsKey(l[1]) || l[0] >= exp.get(l[1])) { misses++; exp.put(l[1], l[0] + timeout); }
        }
        return misses;
    }
}`,
    pythonSolution: `def countArpMisses(lookups, timeout):
    exp, misses = {}, 0
    for t, ip in lookups:
        if ip not in exp or t >= exp[ip]: misses += 1; exp[ip] = t + timeout
    return misses`
  },
  {
    number: 10,
    title: 'CIDR Longest Prefix Match',
    fnName: 'longestPrefixRouteIndex',
    description: 'A routing table has binary prefix strings <code>prefixes</code> (e.g. <code>"110"</code>, <code>"1101"</code>). Given a 32-bit binary destination string <code>dest</code>, return the 0-based index of the longest prefix that matches the start of <code>dest</code> (or <code>-1</code> if none).',
    constraints: ['1 <= prefixes.length <= 1000'],
    testCases: [
      { title: 'Test Case 1', input: 'prefixes = ["10", "110", "1101"], dest = "11010011"', output: '2' },
      { title: 'Test Case 2', input: 'prefixes = ["00", "11"], dest = "101010"', output: '-1' },
      { title: 'Test Case 3', input: 'prefixes = ["", "1"], dest = "100"', output: '1' },
      { title: 'Test Case 4', input: 'prefixes = ["111"], dest = "111"', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int longestPrefixRouteIndex(String[] prefixes, String dest) {
        int bestIdx = -1, bestLen = -1;
        for (int i = 0; i < prefixes.length; i++) {
            if (dest.startsWith(prefixes[i]) && prefixes[i].length() > bestLen) {
                bestLen = prefixes[i].length(); bestIdx = i;
            }
        }
        return bestIdx;
    }
}`,
    pythonSolution: `def longestPrefixRouteIndex(prefixes, dest):
    best_i, best_l = -1, -1
    for i, p in enumerate(prefixes):
        if dest.startswith(p) and len(p) > best_l: best_l, best_i = len(p), i
    return best_i`
  },
  {
    number: 11,
    title: 'IPv4 Usable Host Count From Prefix',
    fnName: 'usableHostCount',
    description: 'Given CIDR prefix length <code>prefix</code> (<code>0 &lt;= prefix &lt;= 32</code>), return usable host addresses: for <code>prefix == 32</code> -> <code>1</code>, for <code>prefix == 31</code> -> <code>2</code>, otherwise <code>2^(32 - prefix) - 2</code>.',
    constraints: ['0 <= prefix <= 32'],
    testCases: [
      { title: 'Test Case 1', input: 'prefix = 24', output: '254' },
      { title: 'Test Case 2', input: 'prefix = 30', output: '2' },
      { title: 'Test Case 3', input: 'prefix = 31', output: '2' },
      { title: 'Test Case 4', input: 'prefix = 32', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static long usableHostCount(int prefix) {
        if (prefix == 32) return 1;
        if (prefix == 31) return 2;
        return (1L << (32 - prefix)) - 2;
    }
}`,
    pythonSolution: `def usableHostCount(prefix):
    if prefix == 32: return 1
    if prefix == 31: return 2
    return (1 << (32 - prefix)) - 2`
  },
  {
    number: 12,
    title: 'OSPF Path Cost Calculator',
    fnName: 'totalOspfPathCost',
    description: 'Cisco OSPF computes link cost as <code>max(1, refBwMbps // linkBwMbps)</code>. Given an array of link bandwidths along a path <code>linkBwMbps</code> and <code>refBwMbps</code>, return total OSPF path cost.',
    constraints: ['1 <= linkBwMbps.length <= 10^4', '1 <= linkBwMbps[i], refBwMbps <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'linkBwMbps = [100, 1000, 10], refBwMbps = 1000', output: '111' },
      { title: 'Test Case 2', input: 'linkBwMbps = [10000], refBwMbps = 100', output: '1' },
      { title: 'Test Case 3', input: 'linkBwMbps = [50, 50], refBwMbps = 100', output: '4' },
      { title: 'Test Case 4', input: 'linkBwMbps = [100], refBwMbps = 100', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static long totalOspfPathCost(int[] linkBwMbps, long refBwMbps) {
        long cost = 0;
        for (int bw : linkBwMbps) cost += Math.max(1L, refBwMbps / bw);
        return cost;
    }
}`,
    pythonSolution: `def totalOspfPathCost(linkBwMbps, refBwMbps):
    return sum(max(1, refBwMbps // bw) for bw in linkBwMbps)`
  },
  {
    number: 13,
    title: 'TCP Cumulative ACK Highest In-Order Seq',
    fnName: 'highestInOrderSeq',
    description: 'A TCP receiver expects packets <code>1, 2, 3, ...</code>. Given the arrival order of packet sequence numbers <code>arrivals</code> (1-indexed), return an array where index <code>i</code> is the highest contiguous sequence number received from <code>1</code> up to step <code>i</code>.',
    constraints: ['1 <= arrivals.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'arrivals = [2, 1, 4, 3, 5]', output: '[0, 2, 2, 4, 5]' },
      { title: 'Test Case 2', input: 'arrivals = [1, 2, 3]', output: '[1, 2, 3]' },
      { title: 'Test Case 3', input: 'arrivals = [3, 2, 1]', output: '[0, 0, 3]' },
      { title: 'Test Case 4', input: 'arrivals = [1]', output: '[1]' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int[] highestInOrderSeq(int[] arrivals) {
        Set<Integer> seen = new HashSet<>();
        int ack = 0;
        int[] res = new int[arrivals.length];
        for (int i = 0; i < arrivals.length; i++) {
            seen.add(arrivals[i]);
            while (seen.contains(ack + 1)) ack++;
            res[i] = ack;
        }
        return res;
    }
}`,
    pythonSolution: `def highestInOrderSeq(arrivals):
    seen, ack, res = set(), 0, []
    for a in arrivals:
        seen.add(a)
        while ack + 1 in seen: ack += 1
        res.append(ack)
    return res`
  },
  {
    number: 14,
    title: 'Packet Fragmentation Count',
    fnName: 'countIpFragments',
    description: 'Packets of total sizes <code>pktSizes</code> bytes (each has a 20-byte IP header; payload = <code>pktSize - 20</code>) traverse a link with MTU <code>mtu</code> (max payload per fragment = <code>((mtu - 20) // 8) * 8</code>). Return total IP fragments transmitted across all packets.',
    constraints: ['1 <= pktSizes.length <= 10^4', 'mtu >= 68', 'pktSizes[i] >= 20'],
    testCases: [
      { title: 'Test Case 1', input: 'pktSizes = [1500, 3000], mtu = 1500', output: '4' },
      { title: 'Test Case 2', input: 'pktSizes = [100], mtu = 1500', output: '1' },
      { title: 'Test Case 3', input: 'pktSizes = [20], mtu = 100', output: '1' },
      { title: 'Test Case 4', input: 'pktSizes = [1000], mtu = 500', output: '3' }
    ],
    javaSolution: `public class Solution {
    public static long countIpFragments(int[] pktSizes, int mtu) {
        int maxPay = ((mtu - 20) / 8) * 8;
        long frags = 0;
        for (int sz : pktSizes) {
            int pay = sz - 20;
            frags += (pay == 0) ? 1 : (pay + maxPay - 1) / maxPay;
        }
        return frags;
    }
}`,
    pythonSolution: `def countIpFragments(pktSizes, mtu):
    max_pay = ((mtu - 20) // 8) * 8
    return sum(1 if sz <= 20 else ((sz - 20) + max_pay - 1) // max_pay for sz in pktSizes)`
  },
  {
    number: 15,
    title: 'QoS Priority Queue Dispatch Order',
    fnName: 'qosDispatchOrder',
    description: 'Packets have <code>packetIds</code> and QoS priority classes <code>priorities</code> (0 = highest, 3 = lowest). Sort <code>packetIds</code> by ascending priority, preserving arrival order for equal priorities.',
    constraints: ['1 <= packetIds.length == priorities.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'packetIds = [10, 20, 30, 40], priorities = [2, 0, 1, 0]', output: '[20, 40, 30, 10]' },
      { title: 'Test Case 2', input: 'packetIds = [1, 2, 3], priorities = [1, 1, 1]', output: '[1, 2, 3]' },
      { title: 'Test Case 3', input: 'packetIds = [5, 6], priorities = [3, 0]', output: '[6, 5]' },
      { title: 'Test Case 4', input: 'packetIds = [9], priorities = [2]', output: '[9]' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int[] qosDispatchOrder(int[] packetIds, int[] priorities) {
        Integer[] idx = new Integer[packetIds.length];
        for (int i = 0; i < idx.length; i++) idx[i] = i;
        Arrays.sort(idx, (a, b) -> priorities[a] != priorities[b] ? Integer.compare(priorities[a], priorities[b]) : Integer.compare(a, b));
        int[] res = new int[idx.length];
        for (int i = 0; i < idx.length; i++) res[i] = packetIds[idx[i]];
        return res;
    }
}`,
    pythonSolution: `def qosDispatchOrder(packetIds, priorities):
    return [pid for pid, _ in sorted(zip(packetIds, priorities), key=lambda x: x[1])]`
  },
  {
    number: 16,
    title: 'Stateful Firewall Active Flow Counter',
    fnName: 'peakActiveFlows',
    description: 'A firewall tracks TCP flows <code>flows</code> <code>[startSec, endSec]</code> (half-open <code>[start, end)</code>). Return the peak number of concurrent active flows.',
    constraints: ['1 <= flows.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'flows = [[1, 5], [2, 6], [4, 8], [6, 9]]', output: '3' },
      { title: 'Test Case 2', input: 'flows = [[1, 2], [2, 3]]', output: '1' },
      { title: 'Test Case 3', input: 'flows = [[0, 10]]', output: '1' },
      { title: 'Test Case 4', input: 'flows = [[1, 5], [1, 5], [1, 5]]', output: '3' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int peakActiveFlows(int[][] flows) {
        int n = flows.length; int[] s = new int[n], e = new int[n];
        for (int i = 0; i < n; i++) { s[i] = flows[i][0]; e[i] = flows[i][1]; }
        Arrays.sort(s); Arrays.sort(e);
        int i = 0, j = 0, cur = 0, best = 0;
        while (i < n) {
            if (s[i] < e[j]) { cur++; best = Math.max(best, cur); i++; }
            else { cur--; j++; }
        }
        return best;
    }
}`,
    pythonSolution: `def peakActiveFlows(flows):
    s = sorted(f[0] for f in flows); e = sorted(f[1] for f in flows)
    i = j = cur = best = 0
    while i < len(s):
        if s[i] < e[j]: cur += 1; best = max(best, cur); i += 1
        else: cur -= 1; j += 1
    return best`
  },
  {
    number: 17,
    title: 'DNS Round-Robin Server Load',
    fnName: 'dnsRoundRobinCounts',
    description: 'A DNS server distributes <code>numQueries</code> requests in strict round-robin order across <code>numServers</code> healthy backends (0..numServers-1), skipping any server in <code>downServers</code>. Return an array of query counts handled by each server.',
    constraints: ['1 <= numServers <= 100', '0 <= numQueries <= 10^6'],
    testCases: [
      { title: 'Test Case 1', input: 'numQueries = 5, numServers = 3, downServers = [1]', output: '[3, 0, 2]' },
      { title: 'Test Case 2', input: 'numQueries = 6, numServers = 3, downServers = []', output: '[2, 2, 2]' },
      { title: 'Test Case 3', input: 'numQueries = 0, numServers = 2, downServers = []', output: '[0, 0]' },
      { title: 'Test Case 4', input: 'numQueries = 4, numServers = 2, downServers = [0]', output: '[0, 4]' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int[] dnsRoundRobinCounts(int numQueries, int numServers, int[] downServers) {
        boolean[] down = new boolean[numServers];
        for (int d : downServers) down[d] = true;
        List<Integer> up = new ArrayList<>();
        for (int i = 0; i < numServers; i++) if (!down[i]) up.add(i);
        int[] res = new int[numServers];
        for (int q = 0; q < numQueries; q++) res[up.get(q % up.size())]++;
        return res;
    }
}`,
    pythonSolution: `def dnsRoundRobinCounts(numQueries, numServers, downServers):
    down = set(downServers)
    up = [i for i in range(numServers) if i not in down]
    res = [0] * numServers
    for q in range(numQueries): res[up[q % len(up)]] += 1
    return res`
  },
  {
    number: 18,
    title: 'MPLS Label Stack Push-Pop Depth',
    fnName: 'maxMplsLabelDepth',
    description: 'An MPLS router processes operations <code>ops</code>: <code>"PUSH"</code> adds a label, <code>"POP"</code> removes the top label, and <code>"SWAP"</code> replaces the top label (depth unchanged). Starting at depth 0, return the maximum label stack depth reached.',
    constraints: ['1 <= ops.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'ops = ["PUSH", "PUSH", "SWAP", "POP", "PUSH", "PUSH"]', output: '3' },
      { title: 'Test Case 2', input: 'ops = ["PUSH", "POP"]', output: '1' },
      { title: 'Test Case 3', input: 'ops = ["PUSH", "PUSH", "PUSH"]', output: '3' },
      { title: 'Test Case 4', input: 'ops = ["SWAP"]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int maxMplsLabelDepth(String[] ops) {
        int cur = 0, best = 0;
        for (String op : ops) {
            if (op.equals("PUSH")) { cur++; best = Math.max(best, cur); }
            else if (op.equals("POP") && cur > 0) cur--;
        }
        return best;
    }
}`,
    pythonSolution: `def maxMplsLabelDepth(ops):
    cur = best = 0
    for op in ops:
        if op == 'PUSH': cur += 1; best = max(best, cur)
        elif op == 'POP' and cur > 0: cur -= 1
    return best`
  },
  {
    number: 19,
    title: 'DHCP IP Lease Pool Allocation',
    fnName: 'countSuccessfulDhcpLeases',
    description: 'A DHCP server manages integer host IDs <code>[startIp, endIp]</code> inclusive. Requests arrive as <code>["REQ", clientId]</code> (assigns lowest free IP if available) or <code>["REL", clientId]</code> (releases IP held by <code>clientId</code>). Return count of successful REQ allocations.',
    constraints: ['1 <= events.length <= 5000', '1 <= endIp - startIp + 1 <= 5000'],
    testCases: [
      { title: 'Test Case 1', input: 'startIp = 10, endIp = 11, events = [["REQ", 1], ["REQ", 2], ["REQ", 3], ["REL", 1], ["REQ", 3]]', output: '3' },
      { title: 'Test Case 2', input: 'startIp = 1, endIp = 1, events = [["REQ", 1], ["REQ", 2]]', output: '1' },
      { title: 'Test Case 3', input: 'startIp = 1, endIp = 3, events = [["REQ", 1], ["REQ", 2], ["REQ", 3]]', output: '3' },
      { title: 'Test Case 4', input: 'startIp = 5, endIp = 5, events = [["REL", 1], ["REQ", 1]]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countSuccessfulDhcpLeases(int startIp, int endIp, String[][] events) {
        TreeSet<Integer> free = new TreeSet<>();
        for (int ip = startIp; ip <= endIp; ip++) free.add(ip);
        Map<Integer, Integer> assigned = new HashMap<>();
        int ok = 0;
        for (String[] e : events) {
            int cid = Integer.parseInt(e[1]);
            if (e[0].equals("REQ")) {
                if (!free.isEmpty()) { int ip = free.pollFirst(); assigned.put(cid, ip); ok++; }
            } else if (assigned.containsKey(cid)) free.add(assigned.remove(cid));
        }
        return ok;
    }
}`,
    pythonSolution: `def countSuccessfulDhcpLeases(startIp, endIp, events):
    free = set(range(startIp, endIp + 1))
    assigned, ok = {}, 0
    for op, cid in events:
        if op == 'REQ':
            if free:
                ip = min(free); free.remove(ip); assigned[cid] = ip; ok += 1
        elif cid in assigned:
            free.add(assigned.pop(cid))
    return ok`
  },
  {
    number: 20,
    title: 'Port-Scan Intrusion Detector',
    fnName: 'countPortScanners',
    description: 'IDS logs connection attempts <code>[srcIp, dstPort]</code>. An IP is flagged as a port scanner if it probes at least <code>k</code> DISTINCT destination ports. Return the number of flagged source IPs.',
    constraints: ['1 <= logs.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'logs = [[1, 22], [1, 80], [1, 443], [2, 80], [2, 80]], k = 3', output: '1' },
      { title: 'Test Case 2', input: 'logs = [[10, 22], [10, 22], [10, 22]], k = 2', output: '0' },
      { title: 'Test Case 3', input: 'logs = [[1, 1], [2, 1]], k = 1', output: '2' },
      { title: 'Test Case 4', input: 'logs = [[5, 80]], k = 2', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countPortScanners(int[][] logs, int k) {
        Map<Integer, Set<Integer>> ports = new HashMap<>();
        for (int[] l : logs) ports.computeIfAbsent(l[0], z -> new HashSet<>()).add(l[1]);
        int flagged = 0;
        for (Set<Integer> s : ports.values()) if (s.size() >= k) flagged++;
        return flagged;
    }
}`,
    pythonSolution: `def countPortScanners(logs, k):
    from collections import defaultdict
    ports = defaultdict(set)
    for ip, p in logs: ports[ip].add(p)
    return sum(1 for s in ports.values() if len(s) >= k)`
  },
  {
    number: 21,
    title: 'Syslog Severity Level Filter',
    fnName: 'countCriticalSyslogs',
    description: 'Syslog severities range from 0 (Emergency) to 7 (Debug). Given log severity levels <code>levels</code> and max severity threshold <code>maxSev</code>, return how many messages are at or above urgency (<code>levels[i] &lt;= maxSev</code>).',
    constraints: ['1 <= levels.length <= 10^5', '0 <= maxSev <= 7'],
    testCases: [
      { title: 'Test Case 1', input: 'levels = [0, 3, 6, 7, 2], maxSev = 3', output: '3' },
      { title: 'Test Case 2', input: 'levels = [6, 7], maxSev = 2', output: '0' },
      { title: 'Test Case 3', input: 'levels = [0, 1, 2], maxSev = 7', output: '3' },
      { title: 'Test Case 4', input: 'levels = [4], maxSev = 4', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countCriticalSyslogs(int[] levels, int maxSev) {
        int cnt = 0;
        for (int l : levels) if (l <= maxSev) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countCriticalSyslogs(levels, maxSev):
    return sum(1 for l in levels if l <= maxSev)`
  },
  {
    number: 22,
    title: 'EtherChannel Link Aggregation Capacity',
    fnName: 'effectiveBundleBandwidth',
    description: 'An EtherChannel bundle combines parallel physical links with speeds <code>speeds</code> Mbps and operational status <code>isUp</code>. Total bundle capacity is the sum of speeds of UP links, capped at <code>maxBundleCap</code>. Return effective capacity.',
    constraints: ['1 <= speeds.length == isUp.length <= 100'],
    testCases: [
      { title: 'Test Case 1', input: 'speeds = [1000, 1000, 1000, 1000], isUp = [true, false, true, true], maxBundleCap = 2500', output: '2500' },
      { title: 'Test Case 2', input: 'speeds = [1000, 1000], isUp = [false, false], maxBundleCap = 2000', output: '0' },
      { title: 'Test Case 3', input: 'speeds = [500, 500], isUp = [true, true], maxBundleCap = 2000', output: '1000' },
      { title: 'Test Case 4', input: 'speeds = [10000], isUp = [true], maxBundleCap = 10000', output: '10000' }
    ],
    javaSolution: `public class Solution {
    public static long effectiveBundleBandwidth(int[] speeds, boolean[] isUp, long maxBundleCap) {
        long sum = 0;
        for (int i = 0; i < speeds.length; i++) if (isUp[i]) sum += speeds[i];
        return Math.min(maxBundleCap, sum);
    }
}`,
    pythonSolution: `def effectiveBundleBandwidth(speeds, isUp, maxBundleCap):
    return min(maxBundleCap, sum(s for s, up in zip(speeds, isUp) if up))`
  },
  {
    number: 23,
    title: 'BGP Local-Preference Best Route',
    fnName: 'selectBestBgpPath',
    description: 'BGP compares candidate routes <code>routes</code> <code>[localPref, asPathLen]</code>: higher <code>localPref</code> wins; ties are broken by shorter <code>asPathLen</code>; further ties by lower index. Return the 0-based index of the winning route.',
    constraints: ['1 <= routes.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'routes = [[100, 4], [200, 5], [200, 3]]', output: '2' },
      { title: 'Test Case 2', input: 'routes = [[150, 2], [100, 1]]', output: '0' },
      { title: 'Test Case 3', input: 'routes = [[100, 3], [100, 3]]', output: '0' },
      { title: 'Test Case 4', input: 'routes = [[50, 10]]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int selectBestBgpPath(int[][] routes) {
        int best = 0;
        for (int i = 1; i < routes.length; i++) {
            if (routes[i][0] > routes[best][0] || (routes[i][0] == routes[best][0] && routes[i][1] < routes[best][1])) best = i;
        }
        return best;
    }
}`,
    pythonSolution: `def selectBestBgpPath(routes):
    return min(range(len(routes)), key=lambda i: (-routes[i][0], routes[i][1], i))`
  },
  {
    number: 24,
    title: 'SNMP Interface Utilization Alert',
    fnName: 'countHighUtilInterfaces',
    description: 'An interface\'s utilization is high if <code>(inBytes[i] + outBytes[i]) * 100 &gt;= capacity[i] * threshPct</code>. Return the count of high-utilization interfaces.',
    constraints: ['1 <= inBytes.length == outBytes.length == capacity.length <= 10^4', 'capacity[i] > 0'],
    testCases: [
      { title: 'Test Case 1', input: 'inBytes = [400, 100], outBytes = [450, 200], capacity = [1000, 1000], threshPct = 80', output: '1' },
      { title: 'Test Case 2', input: 'inBytes = [500], outBytes = [300], capacity = [1000], threshPct = 80', output: '1' },
      { title: 'Test Case 3', input: 'inBytes = [0, 0], outBytes = [0, 0], capacity = [100, 100], threshPct = 1', output: '0' },
      { title: 'Test Case 4', input: 'inBytes = [900], outBytes = [200], capacity = [1000], threshPct = 95', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countHighUtilInterfaces(int[] inBytes, int[] outBytes, int[] capacity, int threshPct) {
        int cnt = 0;
        for (int i = 0; i < capacity.length; i++) {
            if ((long)(inBytes[i] + outBytes[i]) * 100 >= (long) capacity[i] * threshPct) cnt++;
        }
        return cnt;
    }
}`,
    pythonSolution: `def countHighUtilInterfaces(inBytes, outBytes, capacity, threshPct):
    return sum(1 for a, b, c in zip(inBytes, outBytes, capacity) if (a + b) * 100 >= c * threshPct)`
  },
  {
    number: 25,
    title: 'IPv6 Zero-Compression Group Counter',
    fnName: 'countAllZeroHextets',
    description: 'Given an expanded 8-hextet IPv6 address string <code>ipv6</code> (colon-separated), count how many hextets represent the value <code>0</code> (e.g. <code>"0000"</code> or <code>"0"</code>).',
    constraints: ['ipv6 has 8 colon-separated hex groups'],
    testCases: [
      { title: 'Test Case 1', input: 'ipv6 = "2001:0db8:0000:0000:0000:ff00:0042:8329"', output: '3' },
      { title: 'Test Case 2', input: 'ipv6 = "0000:0000:0000:0000:0000:0000:0000:0001"', output: '7' },
      { title: 'Test Case 3', input: 'ipv6 = "fe80:1:2:3:4:5:6:7"', output: '0' },
      { title: 'Test Case 4', input: 'ipv6 = "0:0:0:0:0:0:0:0"', output: '8' }
    ],
    javaSolution: `public class Solution {
    public static int countAllZeroHextets(String ipv6) {
        int cnt = 0;
        for (String h : ipv6.split(":")) if (Integer.parseInt(h, 16) == 0) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countAllZeroHextets(ipv6):
    return sum(1 for h in ipv6.split(':') if int(h, 16) == 0)`
  },
  {
    number: 26,
    title: 'Router Interface Flap Dampening',
    fnName: 'countDampenedInterfaces',
    description: 'Each interface state change (<code>0 -> 1</code> or <code>1 -> 0</code>) in <code>states</code> adds 1000 penalty points. If total penalty &gt;= <code>suppressThresh</code>, the interface is dampened. Given <code>interfaces</code> (array of state timelines), return how many interfaces get dampened.',
    constraints: ['1 <= interfaces.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'interfaces = [[1, 0, 1, 0], [1, 1, 1, 1]], suppressThresh = 2500', output: '1' },
      { title: 'Test Case 2', input: 'interfaces = [[0, 1, 0]], suppressThresh = 2000', output: '1' },
      { title: 'Test Case 3', input: 'interfaces = [[1, 1], [0, 0]], suppressThresh = 1000', output: '0' },
      { title: 'Test Case 4', input: 'interfaces = [[1, 0, 1]], suppressThresh = 3000', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countDampenedInterfaces(int[][] interfaces, int suppressThresh) {
        int damp = 0;
        for (int[] st : interfaces) {
            int pen = 0;
            for (int i = 1; i < st.length; i++) if (st[i] != st[i - 1]) pen += 1000;
            if (pen >= suppressThresh) damp++;
        }
        return damp;
    }
}`,
    pythonSolution: `def countDampenedInterfaces(interfaces, suppressThresh):
    return sum(1 for st in interfaces if sum(1000 for i in range(1, len(st)) if st[i] != st[i-1]) >= suppressThresh)`
  },
  {
    number: 27,
    title: 'RADIUS Auth Failover Server Picker',
    fnName: 'firstHealthyRadiusServer',
    description: 'RADIUS clients try servers <code>0..n-1</code> in order. A server is healthy if <code>rttMs[i] &gt;= 0 &amp;&amp; rttMs[i] &lt;= maxRtt</code>. Return the 0-based index of the first healthy server, or <code>-1</code>.',
    constraints: ['1 <= rttMs.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'rttMs = [-1, 250, 45, 30], maxRtt = 100', output: '2' },
      { title: 'Test Case 2', input: 'rttMs = [-1, 500], maxRtt = 200', output: '-1' },
      { title: 'Test Case 3', input: 'rttMs = [10, 20], maxRtt = 10', output: '0' },
      { title: 'Test Case 4', input: 'rttMs = [0], maxRtt = 0', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int firstHealthyRadiusServer(int[] rttMs, int maxRtt) {
        for (int i = 0; i < rttMs.length; i++) if (rttMs[i] >= 0 && rttMs[i] <= maxRtt) return i;
        return -1;
    }
}`,
    pythonSolution: `def firstHealthyRadiusServer(rttMs, maxRtt):
    for i, r in enumerate(rttMs):
        if 0 <= r <= maxRtt: return i
    return -1`
  },
  {
    number: 28,
    title: 'WRED Queue Drop Probability Threshold',
    fnName: 'countWredDrops',
    description: 'Weighted Random Early Detection (WRED) drops incoming packets when queue depth <code>depths[i] &gt;= maxThresh</code>. Return how many packets are guaranteed dropped.',
    constraints: ['1 <= depths.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'depths = [10, 40, 50, 65, 30], maxThresh = 50', output: '2' },
      { title: 'Test Case 2', input: 'depths = [10, 20, 30], maxThresh = 40', output: '0' },
      { title: 'Test Case 3', input: 'depths = [100, 100], maxThresh = 100', output: '2' },
      { title: 'Test Case 4', input: 'depths = [0], maxThresh = 1', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countWredDrops(int[] depths, int maxThresh) {
        int drops = 0;
        for (int d : depths) if (d >= maxThresh) drops++;
        return drops;
    }
}`,
    pythonSolution: `def countWredDrops(depths, maxThresh):
    return sum(1 for d in depths if d >= maxThresh)`
  },
  {
    number: 29,
    title: 'IPSec Tunnel Rekey Interval Count',
    fnName: 'countIpsecRekeys',
    description: 'An IPSec SA must rekey whenever EITHER <code>lifetimeSec</code> seconds pass OR <code>maxBytes</code> bytes are transferred since the last rekey. Given sequential 1-second traffic byte counts <code>bytesPerSec</code>, return total rekeys triggered.',
    constraints: ['1 <= bytesPerSec.length <= 10^5', '1 <= lifetimeSec, maxBytes <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'bytesPerSec = [100, 100, 100, 100, 100], lifetimeSec = 2, maxBytes = 250', output: '2' },
      { title: 'Test Case 2', input: 'bytesPerSec = [300, 300, 300], lifetimeSec = 10, maxBytes = 250', output: '3' },
      { title: 'Test Case 3', input: 'bytesPerSec = [10, 10], lifetimeSec = 5, maxBytes = 100', output: '0' },
      { title: 'Test Case 4', input: 'bytesPerSec = [50, 50, 50], lifetimeSec = 3, maxBytes = 150', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countIpsecRekeys(int[] bytesPerSec, int lifetimeSec, long maxBytes) {
        int sec = 0, rekeys = 0;
        long bytes = 0;
        for (int b : bytesPerSec) {
            sec++; bytes += b;
            if (sec >= lifetimeSec || bytes >= maxBytes) { rekeys++; sec = 0; bytes = 0; }
        }
        return rekeys;
    }
}`,
    pythonSolution: `def countIpsecRekeys(bytesPerSec, lifetimeSec, maxBytes):
    sec = b_acc = rekeys = 0
    for b in bytesPerSec:
        sec += 1; b_acc += b
        if sec >= lifetimeSec or b_acc >= maxBytes: rekeys += 1; sec = b_acc = 0
    return rekeys`
  },
  {
    number: 30,
    title: 'SD-WAN Path Latency SLA Selector',
    fnName: 'bestSdWanLink',
    description: 'An SD-WAN router has links with <code>latency</code>, <code>jitter</code>, and <code>lossPct</code>. Only links with <code>latency &lt;= maxLat &amp;&amp; jitter &lt;= maxJit &amp;&amp; lossPct &lt;= maxLoss</code> are eligible. Return the 0-based index of the eligible link with lowest <code>latency</code> (tie-break lowest index), or <code>-1</code>.',
    constraints: ['1 <= latency.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'latency = [50, 30, 20], jitter = [5, 15, 4], lossPct = [0, 0, 5], maxLat = 60, maxJit = 10, maxLoss = 1', output: '0' },
      { title: 'Test Case 2', input: 'latency = [100, 80], jitter = [2, 2], lossPct = [0, 0], maxLat = 50, maxJit = 5, maxLoss = 1', output: '-1' },
      { title: 'Test Case 3', input: 'latency = [40, 20, 20], jitter = [1, 1, 1], lossPct = [0, 0, 0], maxLat = 50, maxJit = 5, maxLoss = 1', output: '1' },
      { title: 'Test Case 4', input: 'latency = [10], jitter = [0], lossPct = [0], maxLat = 10, maxJit = 0, maxLoss = 0', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int bestSdWanLink(int[] latency, int[] jitter, int[] lossPct, int maxLat, int maxJit, int maxLoss) {
        int best = -1;
        for (int i = 0; i < latency.length; i++) {
            if (latency[i] <= maxLat && jitter[i] <= maxJit && lossPct[i] <= maxLoss) {
                if (best == -1 || latency[i] < latency[best]) best = i;
            }
        }
        return best;
    }
}`,
    pythonSolution: `def bestSdWanLink(latency, jitter, lossPct, maxLat, maxJit, maxLoss):
    elig = [i for i in range(len(latency)) if latency[i] <= maxLat and jitter[i] <= maxJit and lossPct[i] <= maxLoss]
    return min(elig, key=lambda i: (latency[i], i)) if elig else -1`
  },
  {
    number: 31,
    title: 'VXLAN VNI Tenant Isolation Check',
    fnName: 'countCrossTenantViolations',
    description: 'Packets arrive as <code>packets</code> <code>[srcVni, dstVni]</code>. A tenant isolation violation occurs if <code>srcVni != dstVni</code>. Return total violations.',
    constraints: ['1 <= packets.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'packets = [[100, 100], [100, 200], [300, 300], [200, 100]]', output: '2' },
      { title: 'Test Case 2', input: 'packets = [[10, 10], [20, 20]]', output: '0' },
      { title: 'Test Case 3', input: 'packets = [[1, 2]]', output: '1' },
      { title: 'Test Case 4', input: 'packets = [[5000, 5000]]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countCrossTenantViolations(int[][] packets) {
        int v = 0;
        for (int[] p : packets) if (p[0] != p[1]) v++;
        return v;
    }
}`,
    pythonSolution: `def countCrossTenantViolations(packets):
    return sum(1 for a, b in packets if a != b)`
  },
  {
    number: 32,
    title: 'NetFlow Top-Talker Source IP',
    fnName: 'topTalkerIp',
    description: 'Given NetFlow records with parallel arrays <code>srcIps</code> and <code>bytes</code>, return the source IP with the highest total bytes sent (tie-break lexicographically).',
    constraints: ['1 <= srcIps.length == bytes.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'srcIps = ["10.0.0.1", "10.0.0.2", "10.0.0.1"], bytes = [500, 800, 400]', output: '10.0.0.1' },
      { title: 'Test Case 2', input: 'srcIps = ["10.0.0.2", "10.0.0.1"], bytes = [100, 100]', output: '10.0.0.1' },
      { title: 'Test Case 3', input: 'srcIps = ["192.168.1.5"], bytes = [1024]', output: '192.168.1.5' },
      { title: 'Test Case 4', input: 'srcIps = ["1.1.1.1", "2.2.2.2"], bytes = [10, 20]', output: '2.2.2.2' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static String topTalkerIp(String[] srcIps, int[] bytes) {
        Map<String, Long> totals = new HashMap<>();
        for (int i = 0; i < srcIps.length; i++) totals.put(srcIps[i], totals.getOrDefault(srcIps[i], 0L) + bytes[i]);
        String best = null; long bestB = -1;
        for (Map.Entry<String, Long> e : totals.entrySet()) {
            if (e.getValue() > bestB || (e.getValue() == bestB && e.getKey().compareTo(best) < 0)) {
                best = e.getKey(); bestB = e.getValue();
            }
        }
        return best;
    }
}`,
    pythonSolution: `def topTalkerIp(srcIps, bytes):
    from collections import defaultdict
    tot = defaultdict(int)
    for ip, b in zip(srcIps, bytes): tot[ip] += b
    return min(tot.keys(), key=lambda ip: (-tot[ip], ip))`
  },
  {
    number: 33,
    title: 'MTU Path Discovery Minimum Bottleneck',
    fnName: 'pathBottleneckMtu',
    description: 'Given an array <code>mtus</code> of link MTUs along a routed path, return the effective Path MTU (minimum link MTU along the path).',
    constraints: ['1 <= mtus.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'mtus = [1500, 1492, 9000, 1400]', output: '1400' },
      { title: 'Test Case 2', input: 'mtus = [1500, 1500]', output: '1500' },
      { title: 'Test Case 3', input: 'mtus = [576]', output: '576' },
      { title: 'Test Case 4', input: 'mtus = [9000, 1500, 9000]', output: '1500' }
    ],
    javaSolution: `public class Solution {
    public static int pathBottleneckMtu(int[] mtus) {
        int mn = mtus[0];
        for (int m : mtus) mn = Math.min(mn, m);
        return mn;
    }
}`,
    pythonSolution: `def pathBottleneckMtu(mtus): return min(mtus)`
  },
  {
    number: 34,
    title: 'LLDP Neighbor Discovery Unique Ports',
    fnName: 'countActiveNeighbors',
    description: 'LLDP beacons arrive as <code>[localPort, remoteDeviceId]</code>. Return how many distinct local ports have at least one discovered neighbor.',
    constraints: ['0 <= beacons.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'beacons = [[1, 100], [1, 100], [2, 200], [4, 300]]', output: '3' },
      { title: 'Test Case 2', input: 'beacons = []', output: '0' },
      { title: 'Test Case 3', input: 'beacons = [[3, 1], [3, 2]]', output: '1' },
      { title: 'Test Case 4', input: 'beacons = [[1, 1], [2, 1]]', output: '2' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countActiveNeighbors(int[][] beacons) {
        Set<Integer> ports = new HashSet<>();
        for (int[] b : beacons) ports.add(b[0]);
        return ports.size();
    }
}`,
    pythonSolution: `def countActiveNeighbors(beacons):
    return len({b[0] for b in beacons})`
  },
  {
    number: 35,
    title: 'TTL Hop-Limit Expiry Drop Count',
    fnName: 'countTtlExpiredPackets',
    description: 'Packets enter a network with initial TTL <code>ttls[i]</code> and must traverse <code>hops[i]</code> routers (each hop decrements TTL by 1; if TTL reaches 0 before arriving at the final destination, i.e. <code>ttls[i] &lt;= hops[i]</code>? Wait: if <code>ttls[i] &lt; hops[i]</code>, it drops mid-route). Return total dropped packets.',
    constraints: ['1 <= ttls.length == hops.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'ttls = [5, 2, 10, 1], hops = [4, 3, 10, 2]', output: '2' },
      { title: 'Test Case 2', input: 'ttls = [64, 64], hops = [5, 10]', output: '0' },
      { title: 'Test Case 3', input: 'ttls = [1], hops = [1]', output: '0' },
      { title: 'Test Case 4', input: 'ttls = [0], hops = [1]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countTtlExpiredPackets(int[] ttls, int[] hops) {
        int drops = 0;
        for (int i = 0; i < ttls.length; i++) if (ttls[i] < hops[i]) drops++;
        return drops;
    }
}`,
    pythonSolution: `def countTtlExpiredPackets(ttls, hops):
    return sum(1 for t, h in zip(ttls, hops) if t < h)`
  },
  {
    number: 36,
    title: 'BGP Route Flap Penalty Decay',
    fnName: 'finalRoutePenalty',
    description: 'A route starts with penalty <code>pen</code>. Each quiet minute without a flap halves the penalty (integer floor: <code>pen // 2</code>), while each flap minute adds <code>+1000</code>. Given minute flags <code>flaps</code> (1=flap, 0=quiet), return final penalty.',
    constraints: ['1 <= flaps.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'pen = 0, flaps = [1, 0, 0, 1]', output: '1250' },
      { title: 'Test Case 2', input: 'pen = 1000, flaps = [0, 0, 0]', output: '125' },
      { title: 'Test Case 3', input: 'pen = 500, flaps = [1]', output: '1500' },
      { title: 'Test Case 4', input: 'pen = 0, flaps = [0, 0]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long finalRoutePenalty(long pen, int[] flaps) {
        for (int f : flaps) {
            if (f == 1) pen += 1000;
            else pen /= 2;
        }
        return pen;
    }
}`,
    pythonSolution: `def finalRoutePenalty(pen, flaps):
    for f in flaps:
        pen = pen + 1000 if f == 1 else pen // 2
    return pen`
  },
  {
    number: 37,
    title: 'Multicast IGMP Group Subscription Count',
    fnName: 'peakGroupSubscribers',
    description: 'Hosts send IGMP events <code>events</code> <code>["JOIN", hostId]</code> or <code>["LEAVE", hostId]</code> for a multicast group. Return the peak number of simultaneous subscribers.',
    constraints: ['1 <= events.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'events = [["JOIN", 1], ["JOIN", 2], ["JOIN", 1], ["LEAVE", 1], ["JOIN", 3]]', output: '2' },
      { title: 'Test Case 2', input: 'events = [["JOIN", 1], ["LEAVE", 1]]', output: '1' },
      { title: 'Test Case 3', input: 'events = [["LEAVE", 5]]', output: '0' },
      { title: 'Test Case 4', input: 'events = [["JOIN", 1], ["JOIN", 2], ["JOIN", 3]]', output: '3' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int peakGroupSubscribers(String[][] events) {
        Set<Integer> subs = new HashSet<>();
        int peak = 0;
        for (String[] e : events) {
            int id = Integer.parseInt(e[1]);
            if (e[0].equals("JOIN")) { subs.add(id); peak = Math.max(peak, subs.size()); }
            else subs.remove(id);
        }
        return peak;
    }
}`,
    pythonSolution: `def peakGroupSubscribers(events):
    subs, peak = set(), 0
    for op, hid in events:
        if op == 'JOIN': subs.add(hid); peak = max(peak, len(subs))
        else: subs.discard(hid)
    return peak`
  },
  {
    number: 38,
    title: 'HSRP Active Gateway Failover Count',
    fnName: 'countHsrpFailovers',
    description: 'In HSRP, router A has priority <code>prioA</code> and router B has priority <code>prioB</code> (higher wins; A wins ties). Each minute, <code>upA[i]</code> and <code>upB[i]</code> indicate if each router is up. Initially the highest-priority UP router is active (or -1 if both down). Return how many times the active router changes.',
    constraints: ['1 <= upA.length == upB.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'prioA = 110, prioB = 100, upA = [true, false, false, true], upB = [true, true, true, true]', output: '2' },
      { title: 'Test Case 2', input: 'prioA = 100, prioB = 100, upA = [true, true], upB = [true, true]', output: '0' },
      { title: 'Test Case 3', input: 'prioA = 110, prioB = 100, upA = [false, true], upB = [true, false]', output: '1' },
      { title: 'Test Case 4', input: 'prioA = 100, prioB = 100, upA = [false], upB = [false]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countHsrpFailovers(int prioA, int prioB, boolean[] upA, boolean[] upB) {
        int prev = -2, changes = 0;
        for (int i = 0; i < upA.length; i++) {
            int cur = -1;
            if (upA[i] && upB[i]) cur = (prioA >= prioB) ? 0 : 1;
            else if (upA[i]) cur = 0;
            else if (upB[i]) cur = 1;
            if (prev != -2 && cur != prev) changes++;
            prev = cur;
        }
        return changes;
    }
}`,
    pythonSolution: `def countHsrpFailovers(prioA, prioB, upA, upB):
    prev, changes = -2, 0
    for a, b in zip(upA, upB):
        cur = (0 if prioA >= prioB else 1) if (a and b) else (0 if a else (1 if b else -1))
        if prev != -2 and cur != prev: changes += 1
        prev = cur
    return changes`
  },
  {
    number: 39,
    title: 'Switch CAM Table Overflow Drops',
    fnName: 'countUnlearnedMacs',
    description: 'A switch MAC address table (CAM) holds at most <code>camCap</code> unique MAC addresses. Given incoming source MAC IDs <code>macs</code> in order, once the table is full, new unseen MACs cannot be learned. Return how many unique MACs fail to be learned.',
    constraints: ['1 <= macs.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'macs = [1, 2, 1, 3, 4, 2, 5], camCap = 3', output: '2' },
      { title: 'Test Case 2', input: 'macs = [1, 1, 1], camCap = 1', output: '0' },
      { title: 'Test Case 3', input: 'macs = [1, 2, 3], camCap = 0', output: '3' },
      { title: 'Test Case 4', input: 'macs = [10, 20], camCap = 5', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countUnlearnedMacs(int[] macs, int camCap) {
        Set<Integer> uniq = new HashSet<>();
        for (int m : macs) uniq.add(m);
        return Math.max(0, uniq.size() - camCap);
    }
}`,
    pythonSolution: `def countUnlearnedMacs(macs, camCap):
    return max(0, len(set(macs)) - camCap)`
  },
  {
    number: 40,
    title: 'Packet Checksum 16-Bit One-Complement Sum',
    fnName: 'internetChecksum16',
    description: 'Compute a simplified 16-bit checksum over an array of 16-bit unsigned words <code>words</code>: sum all words, fold any carry above 16 bits back into the lower 16 bits (<code>(s &amp; 0xFFFF) + (s &gt;&gt; 16)</code> until <code>s &lt;= 0xFFFF</code>), and return <code>s ^ 0xFFFF</code>.',
    constraints: ['1 <= words.length <= 10^4', '0 <= words[i] <= 65535'],
    testCases: [
      { title: 'Test Case 1', input: 'words = [0, 0]', output: '65535' },
      { title: 'Test Case 2', input: 'words = [65535]', output: '0' },
      { title: 'Test Case 3', input: 'words = [1, 2, 3]', output: '65529' },
      { title: 'Test Case 4', input: 'words = [65535, 1]', output: '65534' }
    ],
    javaSolution: `public class Solution {
    public static int internetChecksum16(int[] words) {
        long s = 0;
        for (int w : words) s += w;
        while (s > 0xFFFF) s = (s & 0xFFFF) + (s >> 16);
        return (int) (s ^ 0xFFFF);
    }
}`,
    pythonSolution: `def internetChecksum16(words):
    s = sum(words)
    while s > 0xFFFF: s = (s & 0xFFFF) + (s >> 16)
    return s ^ 0xFFFF`
  },
  {
    number: 41,
    title: 'VLAN Spanning-Tree Hop Count',
    fnName: 'maxTreeHopDistance',
    description: 'Given a tree of <code>n</code> switches (0..n-1) rooted at Root Bridge <code>0</code> with undirected edges <code>edges</code>, return the maximum hop distance from switch <code>0</code> to any other switch.',
    constraints: ['1 <= n <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 5, edges = [[0, 1], [0, 2], [1, 3], [3, 4]]', output: '3' },
      { title: 'Test Case 2', input: 'n = 1, edges = []', output: '0' },
      { title: 'Test Case 3', input: 'n = 4, edges = [[0, 1], [0, 2], [0, 3]]', output: '1' },
      { title: 'Test Case 4', input: 'n = 3, edges = [[0, 1], [1, 2]]', output: '2' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxTreeHopDistance(int n, int[][] edges) {
        List<List<Integer>> g = new ArrayList<>(); for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        for (int[] e : edges) { g.get(e[0]).add(e[1]); g.get(e[1]).add(e[0]); }
        int[] dist = new int[n]; Arrays.fill(dist, -1); dist[0] = 0;
        Deque<Integer> q = new ArrayDeque<>(); q.add(0);
        int mx = 0;
        while (!q.isEmpty()) {
            int u = q.poll(); mx = Math.max(mx, dist[u]);
            for (int v : g.get(u)) if (dist[v] == -1) { dist[v] = dist[u] + 1; q.add(v); }
        }
        return mx;
    }
}`,
    pythonSolution: `def maxTreeHopDistance(n, edges):
    from collections import deque
    g = [[] for _ in range(n)]
    for u, v in edges: g[u].append(v); g[v].append(u)
    dist = [-1]*n; dist[0] = 0; q = deque([0])
    while q:
        u = q.popleft()
        for v in g[u]:
            if dist[v] == -1: dist[v] = dist[u] + 1; q.append(v)
    return max(dist)`
  },
  {
    number: 42,
    title: 'ECMP Equal-Cost Multipath Hash Balance',
    fnName: 'ecmpFlowCounts',
    description: 'An ECMP router hashes 5-tuple flow IDs <code>flows</code> across <code>k</code> equal-cost paths using <code>flow % k</code>. Return an array of length <code>k</code> showing how many flows land on each path.',
    constraints: ['1 <= flows.length <= 10^5', '1 <= k <= 100'],
    testCases: [
      { title: 'Test Case 1', input: 'flows = [0, 1, 2, 3, 4, 5], k = 3', output: '[2, 2, 2]' },
      { title: 'Test Case 2', input: 'flows = [3, 6, 9], k = 3', output: '[3, 0, 0]' },
      { title: 'Test Case 3', input: 'flows = [10], k = 1', output: '[1]' },
      { title: 'Test Case 4', input: 'flows = [1, 2, 4], k = 2', output: '[2, 1]' }
    ],
    javaSolution: `public class Solution {
    public static int[] ecmpFlowCounts(int[] flows, int k) {
        int[] res = new int[k];
        for (int f : flows) res[((f % k) + k) % k]++;
        return res;
    }
}`,
    pythonSolution: `def ecmpFlowCounts(flows, k):
    res = [0] * k
    for f in flows: res[f % k] += 1
    return res`
  },
  {
    number: 43,
    title: 'NTP Clock Drift Skew Checker',
    fnName: 'countOutOfSyncNodes',
    description: 'Network nodes report clock offsets in milliseconds <code>offsets</code> relative to an NTP stratum-1 server. A node is out of sync if <code>abs(offsets[i]) &gt; maxSkewMs</code>. Return count of out-of-sync nodes.',
    constraints: ['1 <= offsets.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'offsets = [-5, 12, -20, 8, 0], maxSkewMs = 10', output: '2' },
      { title: 'Test Case 2', input: 'offsets = [10, -10], maxSkewMs = 10', output: '0' },
      { title: 'Test Case 3', input: 'offsets = [100], maxSkewMs = 50', output: '1' },
      { title: 'Test Case 4', input: 'offsets = [0, 0, 0], maxSkewMs = 0', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countOutOfSyncNodes(int[] offsets, int maxSkewMs) {
        int cnt = 0;
        for (int o : offsets) if (Math.abs(o) > maxSkewMs) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countOutOfSyncNodes(offsets, maxSkewMs):
    return sum(1 for o in offsets if abs(o) > maxSkewMs)`
  },
  {
    number: 44,
    title: 'Firewall Port-Range Overlap Merger',
    fnName: 'totalOpenPortCount',
    description: 'Given allowed TCP port ranges <code>ranges</code> <code>[startPort, endPort]</code> inclusive, return the total number of distinct open ports across all ranges.',
    constraints: ['1 <= ranges.length <= 10^4', '1 <= startPort <= endPort <= 65535'],
    testCases: [
      { title: 'Test Case 1', input: 'ranges = [[80, 80], [443, 443], [8000, 8005], [8003, 8010]]', output: '13' },
      { title: 'Test Case 2', input: 'ranges = [[1, 100], [50, 150]]', output: '150' },
      { title: 'Test Case 3', input: 'ranges = [[22, 22]]', output: '1' },
      { title: 'Test Case 4', input: 'ranges = [[10, 20], [30, 40]]', output: '22' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int totalOpenPortCount(int[][] ranges) {
        Arrays.sort(ranges, (a, b) -> Integer.compare(a[0], b[0]));
        int total = 0, curS = ranges[0][0], curE = ranges[0][1];
        for (int i = 1; i < ranges.length; i++) {
            if (ranges[i][0] <= curE + 1) curE = Math.max(curE, ranges[i][1]);
            else { total += curE - curS + 1; curS = ranges[i][0]; curE = ranges[i][1]; }
        }
        return total + (curE - curS + 1);
    }
}`,
    pythonSolution: `def totalOpenPortCount(ranges):
    r = sorted(ranges)
    total, s, e = 0, r[0][0], r[0][1]
    for a, b in r[1:]:
        if a <= e + 1: e = max(e, b)
        else: total += e - s + 1; s, e = a, b
    return total + e - s + 1`
  },
  {
    number: 45,
    title: 'BGP Prefix Aggregation Count',
    fnName: 'countUniquePrefixes',
    description: 'Given a list of CIDR route strings <code>routes</code> (e.g. <code>"10.1.0.0/16"</code>), deduplicate identical routes and return the count of unique prefixes.',
    constraints: ['1 <= routes.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'routes = ["10.0.0.0/8", "10.0.0.0/8", "192.168.1.0/24"]', output: '2' },
      { title: 'Test Case 2', input: 'routes = ["0.0.0.0/0"]', output: '1' },
      { title: 'Test Case 3', input: 'routes = ["1.1.1.0/24", "1.1.2.0/24"]', output: '2' },
      { title: 'Test Case 4', input: 'routes = ["172.16.0.0/12", "172.16.0.0/12", "172.16.0.0/12"]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countUniquePrefixes(String[] routes) {
        return new HashSet<>(Arrays.asList(routes)).size();
    }
}`,
    pythonSolution: `def countUniquePrefixes(routes): return len(set(routes))`
  },
  {
    number: 46,
    title: 'Data-Center Rack Power Cap',
    fnName: 'maxServersPowered',
    description: 'A data-center rack has power budget <code>maxWatts</code>. Candidate servers draw <code>watts</code> watts each. Return the maximum number of servers that can be powered simultaneously without exceeding <code>maxWatts</code>.',
    constraints: ['1 <= watts.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'watts = [300, 500, 200, 400], maxWatts = 900', output: '3' },
      { title: 'Test Case 2', input: 'watts = [1000, 1200], maxWatts = 800', output: '0' },
      { title: 'Test Case 3', input: 'watts = [250, 250], maxWatts = 500', output: '2' },
      { title: 'Test Case 4', input: 'watts = [100], maxWatts = 100', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxServersPowered(int[] watts, long maxWatts) {
        int[] w = watts.clone(); Arrays.sort(w);
        long used = 0; int cnt = 0;
        for (int x : w) { if (used + x <= maxWatts) { used += x; cnt++; } else break; }
        return cnt;
    }
}`,
    pythonSolution: `def maxServersPowered(watts, maxWatts):
    used = cnt = 0
    for w in sorted(watts):
        if used + w <= maxWatts: used += w; cnt += 1
        else: break
    return cnt`
  },
  {
    number: 47,
    title: 'TCP Retransmission Timeout Backoff',
    fnName: 'totalRtoWaitMs',
    description: 'TCP exponential backoff starts with initial RTO <code>initRto</code> ms and doubles on each retry (capped at <code>maxRto</code> ms). Return the total wait time across <code>retries</code> consecutive timeouts.',
    constraints: ['0 <= retries <= 30', '1 <= initRto <= maxRto <= 10^6'],
    testCases: [
      { title: 'Test Case 1', input: 'initRto = 200, maxRto = 1000, retries = 4', output: '2400' },
      { title: 'Test Case 2', input: 'initRto = 500, maxRto = 500, retries = 3', output: '1500' },
      { title: 'Test Case 3', input: 'initRto = 100, maxRto = 1000, retries = 0', output: '0' },
      { title: 'Test Case 4', input: 'initRto = 100, maxRto = 1000, retries = 3', output: '700' }
    ],
    javaSolution: `public class Solution {
    public static long totalRtoWaitMs(long initRto, long maxRto, int retries) {
        long total = 0, cur = initRto;
        for (int i = 0; i < retries; i++) {
            total += cur;
            cur = Math.min(maxRto, cur * 2);
        }
        return total;
    }
}`,
    pythonSolution: `def totalRtoWaitMs(initRto, maxRto, retries):
    total, cur = 0, initRto
    for _ in range(retries):
        total += cur
        cur = min(maxRto, cur * 2)
    return total`
  },
  {
    number: 48,
    title: 'Zero-Trust Microsegmentation Reachability',
    fnName: 'countReachableWorkloads',
    description: 'In a zero-trust mesh of <code>n</code> workloads (0..n-1), allowed directed firewall policies are <code>policies</code> <code>[src, dst]</code>. Starting from compromised workload <code>start</code>, return total workloads reachable (including <code>start</code>).',
    constraints: ['1 <= n <= 5000'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 5, policies = [[0, 1], [1, 2], [3, 4]], start = 0', output: '3' },
      { title: 'Test Case 2', input: 'n = 4, policies = [[0, 1], [1, 2], [2, 3]], start = 2', output: '2' },
      { title: 'Test Case 3', input: 'n = 3, policies = [], start = 1', output: '1' },
      { title: 'Test Case 4', input: 'n = 3, policies = [[0, 1], [1, 0]], start = 0', output: '2' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countReachableWorkloads(int n, int[][] policies, int start) {
        List<List<Integer>> g = new ArrayList<>(); for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        for (int[] p : policies) g.get(p[0]).add(p[1]);
        boolean[] vis = new boolean[n]; vis[start] = true;
        Deque<Integer> q = new ArrayDeque<>(); q.add(start);
        int cnt = 0;
        while (!q.isEmpty()) {
            int u = q.poll(); cnt++;
            for (int v : g.get(u)) if (!vis[v]) { vis[v] = true; q.add(v); }
        }
        return cnt;
    }
}`,
    pythonSolution: `def countReachableWorkloads(n, policies, start):
    from collections import deque
    g = [[] for _ in range(n)]
    for u, v in policies: g[u].append(v)
    vis = {start}; q = deque([start])
    while q:
        u = q.popleft()
        for v in g[u]:
            if v not in vis: vis.add(v); q.append(v)
    return len(vis)`
  },
  {
    number: 49,
    title: 'VRF Route-Target Import Filter',
    fnName: 'countImportedRoutes',
    description: 'A VRF imports VPN routes whose route-target matches ANY target in <code>importTargets</code>. Given route target lists <code>routeTargets</code> (one target integer per route), return count of imported routes.',
    constraints: ['1 <= routeTargets.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'routeTargets = [100, 200, 300, 100], importTargets = [100, 300]', output: '3' },
      { title: 'Test Case 2', input: 'routeTargets = [1, 2], importTargets = [3]', output: '0' },
      { title: 'Test Case 3', input: 'routeTargets = [5, 5], importTargets = [5]', output: '2' },
      { title: 'Test Case 4', input: 'routeTargets = [9], importTargets = []', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countImportedRoutes(int[] routeTargets, int[] importTargets) {
        Set<Integer> imp = new HashSet<>(); for (int t : importTargets) imp.add(t);
        int cnt = 0;
        for (int r : routeTargets) if (imp.contains(r)) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countImportedRoutes(routeTargets, importTargets):
    imp = set(importTargets)
    return sum(1 for r in routeTargets if r in imp)`
  },
  {
    number: 50,
    title: 'Telemetry Packet Loss Percentage',
    fnName: 'packetLossPercentFloor',
    description: 'Given total packets sent <code>sent</code> and acknowledged <code>acked</code> across a probe test (<code>0 &lt;= acked &lt;= sent</code>), return the integer-floor packet loss percentage <code>((sent - acked) * 100) // sent</code> (0 if sent == 0).',
    constraints: ['0 <= acked <= sent <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'sent = 1000, acked = 975', output: '2' },
      { title: 'Test Case 2', input: 'sent = 500, acked = 500', output: '0' },
      { title: 'Test Case 3', input: 'sent = 0, acked = 0', output: '0' },
      { title: 'Test Case 4', input: 'sent = 3, acked = 1', output: '66' }
    ],
    javaSolution: `public class Solution {
    public static long packetLossPercentFloor(long sent, long acked) {
        if (sent == 0) return 0;
        return ((sent - acked) * 100) / sent;
    }
}`,
    pythonSolution: `def packetLossPercentFloor(sent, acked):
    return 0 if sent == 0 else ((sent - acked) * 100) // sent`
  }
];
