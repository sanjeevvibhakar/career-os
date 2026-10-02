export interface DsaProblemSeed {
  id: number;
  topicId: number;
  name: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  source: 'STRIVER_A2Z' | 'NEETCODE_150' | 'GRIND_75' | 'LEETCODE';
  sourceUrl: string;
  pattern: string;
  level?: number;
  whyAtWork?: string;
  whyInInterview?: string;
}

export interface DsaTopicSeed {
  id: number;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export const DSA_TOPICS: DsaTopicSeed[] = [
  { id: 1, name: 'Arrays & Hashing', icon: '📦', color: '#3b82f6', description: 'Array manipulation, hashing, frequency maps' },
  { id: 2, name: 'Sorting', icon: '🔄', color: '#6366f1', description: 'Merge sort, quick sort, counting sort' },
  { id: 3, name: 'Two Pointers', icon: '👉', color: '#8b5cf6', description: 'Opposite direction, same direction, fast/slow' },
  { id: 4, name: 'Sliding Window', icon: '🪟', color: '#a855f7', description: 'Fixed window, variable window, shrink/expand' },
  { id: 5, name: 'Binary Search', icon: '🔍', color: '#ec4899', description: 'Search space reduction, binary search on answer' },
  { id: 6, name: 'Strings', icon: '📝', color: '#f43f5e', description: 'String manipulation, pattern matching' },
  { id: 7, name: 'Recursion', icon: '🔁', color: '#f97316', description: 'Base case, recursive case, call stack' },
  { id: 8, name: 'Linked List', icon: '🔗', color: '#eab308', description: 'Singly, doubly, fast/slow pointers, reversal' },
  { id: 9, name: 'Stack & Queue', icon: '📚', color: '#84cc16', description: 'LIFO, FIFO, monotonic stack, deque' },
  { id: 10, name: 'Binary Trees', icon: '🌳', color: '#22c55e', description: 'Traversals, DFS, BFS, tree properties' },
  { id: 11, name: 'BST', icon: '🌲', color: '#14b8a6', description: 'Search, insert, delete, validate BST' },
  { id: 12, name: 'Heap / Priority Queue', icon: '⛰️', color: '#06b6d4', description: 'Min heap, max heap, top-K problems' },
  { id: 13, name: 'Graphs', icon: '🕸️', color: '#0ea5e9', description: 'BFS, DFS, topological sort, shortest path' },
  { id: 14, name: 'Dynamic Programming', icon: '🧮', color: '#6366f1', description: '1D DP, 2D DP, knapsack, subsequences' },
  { id: 15, name: 'Greedy', icon: '🎯', color: '#f59e0b', description: 'Local optimal, activity selection, scheduling' },
  { id: 16, name: 'Backtracking', icon: '♟️', color: '#ef4444', description: 'Exhaustive search, pruning, constraint satisfaction' },
  { id: 17, name: 'Tries', icon: '🔤', color: '#10b981', description: 'Prefix tree, word search, autocomplete' },
  { id: 18, name: 'Bit Manipulation', icon: '💻', color: '#8b5cf6', description: 'XOR, AND, OR, bit shifting, masks' },
  { id: 19, name: 'Intervals', icon: '📐', color: '#f43f5e', description: 'Merge, insert, overlap detection' },
  { id: 20, name: 'Math & Geometry', icon: '📊', color: '#06b6d4', description: 'Matrix operations, modular arithmetic' },
];

export const DSA_PROBLEMS: DsaProblemSeed[] = [
  // Topic 1: Arrays & Hashing
  { id: 1, topicId: 1, name: 'Two Sum', difficulty: 'EASY', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/two-sum/', pattern: 'Hash Map Lookup' },
  { id: 2, topicId: 1, name: 'Contains Duplicate', difficulty: 'EASY', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/contains-duplicate/', pattern: 'Hash Set' },
  { id: 3, topicId: 1, name: 'Valid Anagram', difficulty: 'EASY', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/valid-anagram/', pattern: 'Frequency Count' },
  { id: 4, topicId: 1, name: 'Group Anagrams', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/group-anagrams/', pattern: 'Hash Map + Sorting Key' },
  { id: 5, topicId: 1, name: 'Top K Frequent Elements', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/top-k-frequent-elements/', pattern: 'Bucket Sort / Heap' },
  { id: 6, topicId: 1, name: 'Product of Array Except Self', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/product-of-array-except-self/', pattern: 'Prefix/Suffix Product' },
  { id: 7, topicId: 1, name: 'Longest Consecutive Sequence', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/longest-consecutive-sequence/', pattern: 'Hash Set + Sequence Start' },
  { id: 8, topicId: 1, name: 'Maximum Subarray (Kadane)', difficulty: 'MEDIUM', source: 'STRIVER_A2Z', sourceUrl: 'https://leetcode.com/problems/maximum-subarray/', pattern: "Kadane's Algorithm" },
  { id: 9, topicId: 1, name: 'Sort Colors (Dutch Flag)', difficulty: 'MEDIUM', source: 'STRIVER_A2Z', sourceUrl: 'https://leetcode.com/problems/sort-colors/', pattern: 'Dutch National Flag' },
  { id: 10, topicId: 1, name: 'Next Permutation', difficulty: 'MEDIUM', source: 'STRIVER_A2Z', sourceUrl: 'https://leetcode.com/problems/next-permutation/', pattern: 'Array Manipulation' },

  // Topic 3: Two Pointers
  { id: 11, topicId: 3, name: 'Valid Palindrome', difficulty: 'EASY', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/valid-palindrome/', pattern: 'Two Pointers Inward' },
  { id: 12, topicId: 3, name: 'Two Sum II - Sorted Array', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/', pattern: 'Two Pointers + Sorted' },
  { id: 13, topicId: 3, name: '3Sum', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/3sum/', pattern: 'Sort + Two Pointers' },
  { id: 14, topicId: 3, name: 'Container With Most Water', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/container-with-most-water/', pattern: 'Greedy Two Pointers' },
  { id: 15, topicId: 3, name: 'Trapping Rain Water', difficulty: 'HARD', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/trapping-rain-water/', pattern: 'Two Pointers / Prefix Max' },

  // Topic 4: Sliding Window
  { id: 16, topicId: 4, name: 'Best Time to Buy and Sell Stock', difficulty: 'EASY', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', pattern: 'Min So Far + Max Profit' },
  { id: 17, topicId: 4, name: 'Longest Substring Without Repeating Characters', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', pattern: 'Variable Window + Hash Set' },
  { id: 18, topicId: 4, name: 'Longest Repeating Character Replacement', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/longest-repeating-character-replacement/', pattern: 'Variable Window + Frequency' },
  { id: 19, topicId: 4, name: 'Minimum Window Substring', difficulty: 'HARD', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/minimum-window-substring/', pattern: 'Variable Window + Two Maps' },
  { id: 20, topicId: 4, name: 'Max Consecutive Ones III', difficulty: 'MEDIUM', source: 'STRIVER_A2Z', sourceUrl: 'https://leetcode.com/problems/max-consecutive-ones-iii/', pattern: 'Variable Window + Count' },

  // Topic 5: Binary Search
  { id: 21, topicId: 5, name: 'Binary Search', difficulty: 'EASY', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/binary-search/', pattern: 'Standard Binary Search' },
  { id: 22, topicId: 5, name: 'Search a 2D Matrix', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/search-a-2d-matrix/', pattern: 'Binary Search on Flattened' },
  { id: 23, topicId: 5, name: 'Koko Eating Bananas', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/koko-eating-bananas/', pattern: 'Binary Search on Answer' },
  { id: 24, topicId: 5, name: 'Find Minimum in Rotated Sorted Array', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/', pattern: 'Modified Binary Search' },
  { id: 25, topicId: 5, name: 'Search in Rotated Sorted Array', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/', pattern: 'Modified Binary Search' },

  // Topic 8: Linked List
  { id: 26, topicId: 8, name: 'Reverse Linked List', difficulty: 'EASY', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/reverse-linked-list/', pattern: 'Iterative Pointer Swap' },
  { id: 27, topicId: 8, name: 'Merge Two Sorted Lists', difficulty: 'EASY', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/merge-two-sorted-lists/', pattern: 'Merge Two Pointers' },
  { id: 28, topicId: 8, name: 'Linked List Cycle', difficulty: 'EASY', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/linked-list-cycle/', pattern: 'Floyd Tortoise & Hare' },
  { id: 29, topicId: 8, name: 'Remove Nth Node From End', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', pattern: 'Two Pointer Gap' },
  { id: 30, topicId: 8, name: 'Reorder List', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/reorder-list/', pattern: 'Find Mid + Reverse + Merge' },

  // Topic 9: Stack & Queue
  { id: 31, topicId: 9, name: 'Valid Parentheses', difficulty: 'EASY', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/valid-parentheses/', pattern: 'Stack Matching' },
  { id: 32, topicId: 9, name: 'Min Stack', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/min-stack/', pattern: 'Auxiliary Stack' },
  { id: 33, topicId: 9, name: 'Daily Temperatures', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/daily-temperatures/', pattern: 'Monotonic Stack' },
  { id: 34, topicId: 9, name: 'Largest Rectangle in Histogram', difficulty: 'HARD', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/largest-rectangle-in-histogram/', pattern: 'Monotonic Stack' },

  // Topic 10: Binary Trees
  { id: 35, topicId: 10, name: 'Maximum Depth of Binary Tree', difficulty: 'EASY', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', pattern: 'DFS Recursion' },
  { id: 36, topicId: 10, name: 'Invert Binary Tree', difficulty: 'EASY', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/invert-binary-tree/', pattern: 'DFS Swap' },
  { id: 37, topicId: 10, name: 'Same Tree', difficulty: 'EASY', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/same-tree/', pattern: 'DFS Compare' },
  { id: 38, topicId: 10, name: 'Binary Tree Level Order Traversal', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', pattern: 'BFS Queue' },
  { id: 39, topicId: 10, name: 'Lowest Common Ancestor', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/', pattern: 'DFS Path Finding' },
  { id: 40, topicId: 10, name: 'Diameter of Binary Tree', difficulty: 'EASY', source: 'STRIVER_A2Z', sourceUrl: 'https://leetcode.com/problems/diameter-of-binary-tree/', pattern: 'DFS Height + Diameter' },
  { id: 41, topicId: 10, name: 'Binary Tree Maximum Path Sum', difficulty: 'HARD', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/', pattern: 'DFS Max Gain' },

  // Topic 12: Heap
  { id: 42, topicId: 12, name: 'Kth Largest Element in a Stream', difficulty: 'EASY', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/', pattern: 'Min Heap of Size K' },
  { id: 43, topicId: 12, name: 'Last Stone Weight', difficulty: 'EASY', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/last-stone-weight/', pattern: 'Max Heap' },
  { id: 44, topicId: 12, name: 'K Closest Points to Origin', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/k-closest-points-to-origin/', pattern: 'Max Heap of Size K' },
  { id: 45, topicId: 12, name: 'Find Median from Data Stream', difficulty: 'HARD', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/find-median-from-data-stream/', pattern: 'Two Heaps Pattern' },
  { id: 46, topicId: 12, name: 'Task Scheduler', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/task-scheduler/', pattern: 'Greedy + Heap' },

  // Topic 13: Graphs
  { id: 47, topicId: 13, name: 'Number of Islands', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/number-of-islands/', pattern: 'BFS/DFS Grid Traversal' },
  { id: 48, topicId: 13, name: 'Clone Graph', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/clone-graph/', pattern: 'BFS/DFS + HashMap' },
  { id: 49, topicId: 13, name: 'Course Schedule', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/course-schedule/', pattern: 'Topological Sort / Cycle Detection' },
  { id: 50, topicId: 13, name: 'Course Schedule II', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/course-schedule-ii/', pattern: 'Topological Sort (Kahn)' },
  { id: 51, topicId: 13, name: 'Pacific Atlantic Water Flow', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/pacific-atlantic-water-flow/', pattern: 'Multi-source BFS/DFS' },
  { id: 52, topicId: 13, name: 'Rotting Oranges', difficulty: 'MEDIUM', source: 'STRIVER_A2Z', sourceUrl: 'https://leetcode.com/problems/rotting-oranges/', pattern: 'Multi-source BFS' },

  // Topic 14: Dynamic Programming
  { id: 53, topicId: 14, name: 'Climbing Stairs', difficulty: 'EASY', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/climbing-stairs/', pattern: '1D DP / Fibonacci' },
  { id: 54, topicId: 14, name: 'House Robber', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/house-robber/', pattern: '1D DP Skip/Take' },
  { id: 55, topicId: 14, name: 'Coin Change', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/coin-change/', pattern: 'Unbounded Knapsack' },
  { id: 56, topicId: 14, name: 'Longest Increasing Subsequence', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/longest-increasing-subsequence/', pattern: 'LIS Pattern' },
  { id: 57, topicId: 14, name: 'Longest Common Subsequence', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/longest-common-subsequence/', pattern: '2D DP String Matching' },
  { id: 58, topicId: 14, name: 'Edit Distance', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/edit-distance/', pattern: '2D DP String Operations' },
  { id: 59, topicId: 14, name: 'Partition Equal Subset Sum', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/partition-equal-subset-sum/', pattern: 'Subset Sum DP' },

  // Topic 15: Greedy
  { id: 60, topicId: 15, name: 'Jump Game', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/jump-game/', pattern: 'Greedy Reachability' },
  { id: 61, topicId: 15, name: 'Jump Game II', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/jump-game-ii/', pattern: 'BFS-like Greedy' },

  // Topic 16: Backtracking
  { id: 62, topicId: 16, name: 'Subsets', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/subsets/', pattern: 'Include/Exclude Recursion' },
  { id: 63, topicId: 16, name: 'Combination Sum', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/combination-sum/', pattern: 'Backtrack + Target Sum' },
  { id: 64, topicId: 16, name: 'Permutations', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/permutations/', pattern: 'Swap Backtracking' },
  { id: 65, topicId: 16, name: 'N-Queens', difficulty: 'HARD', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/n-queens/', pattern: 'Constraint Backtracking' },
  { id: 66, topicId: 16, name: 'Word Search', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/word-search/', pattern: 'Grid Backtracking' },

  // Topic 17: Tries
  { id: 67, topicId: 17, name: 'Implement Trie (Prefix Tree)', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/implement-trie-prefix-tree/', pattern: 'Trie Implementation' },
  { id: 68, topicId: 17, name: 'Design Add and Search Words', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/', pattern: 'Trie + DFS Wildcard' },
  { id: 69, topicId: 17, name: 'Word Search II', difficulty: 'HARD', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/word-search-ii/', pattern: 'Trie + Grid Backtracking' },

  // Topic 18: Bit Manipulation
  { id: 70, topicId: 18, name: 'Single Number', difficulty: 'EASY', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/single-number/', pattern: 'XOR All Elements' },
  { id: 71, topicId: 18, name: 'Number of 1 Bits', difficulty: 'EASY', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/number-of-1-bits/', pattern: 'Brian Kernighan' },
  { id: 72, topicId: 18, name: 'Counting Bits', difficulty: 'EASY', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/counting-bits/', pattern: 'DP + Bit Manipulation' },
  { id: 73, topicId: 18, name: 'Reverse Bits', difficulty: 'EASY', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/reverse-bits/', pattern: 'Bit Shifting' },

  // Topic 19: Intervals
  { id: 74, topicId: 19, name: 'Merge Intervals', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/merge-intervals/', pattern: 'Sort + Merge Overlapping' },
  { id: 75, topicId: 19, name: 'Insert Interval', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/insert-interval/', pattern: 'Merge + Insert' },
  { id: 76, topicId: 19, name: 'Non-overlapping Intervals', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/non-overlapping-intervals/', pattern: 'Greedy Interval Scheduling' },

  // Topic 20: Math & Geometry
  { id: 77, topicId: 20, name: 'Rotate Image', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/rotate-image/', pattern: 'Transpose + Reverse' },
  { id: 78, topicId: 20, name: 'Spiral Matrix', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/spiral-matrix/', pattern: 'Layer-by-Layer Traversal' },
  { id: 79, topicId: 20, name: 'Set Matrix Zeroes', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/set-matrix-zeroes/', pattern: 'In-place Marking' },
  { id: 80, topicId: 20, name: 'Pow(x, n)', difficulty: 'MEDIUM', source: 'NEETCODE_150', sourceUrl: 'https://leetcode.com/problems/powx-n/', pattern: 'Binary Exponentiation' },
];
