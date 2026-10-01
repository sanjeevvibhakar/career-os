-- V3: Seed curated DSA problems from Striver A2Z + NeetCode 150 (pattern-based selection)
-- ~80 essential problems covering all 20 topics — expand as you progress

-- Topic 1: Arrays & Hashing (id=1)
INSERT INTO dsa_problem (topic_id, name, difficulty, source, source_url, pattern, striver_step, neetcode_category) VALUES
(1, 'Two Sum', 'EASY', 'NEETCODE_150', 'https://leetcode.com/problems/two-sum/', 'Hash Map Lookup', 'Step 3', 'Arrays & Hashing'),
(1, 'Contains Duplicate', 'EASY', 'NEETCODE_150', 'https://leetcode.com/problems/contains-duplicate/', 'Hash Set', 'Step 3', 'Arrays & Hashing'),
(1, 'Valid Anagram', 'EASY', 'NEETCODE_150', 'https://leetcode.com/problems/valid-anagram/', 'Frequency Count', 'Step 3', 'Arrays & Hashing'),
(1, 'Group Anagrams', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/group-anagrams/', 'Hash Map + Sorting Key', 'Step 3', 'Arrays & Hashing'),
(1, 'Top K Frequent Elements', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/top-k-frequent-elements/', 'Bucket Sort / Heap', 'Step 3', 'Arrays & Hashing'),
(1, 'Product of Array Except Self', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/product-of-array-except-self/', 'Prefix/Suffix Product', 'Step 3', 'Arrays & Hashing'),
(1, 'Longest Consecutive Sequence', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/longest-consecutive-sequence/', 'Hash Set + Sequence Start', 'Step 3', 'Arrays & Hashing'),
(1, 'Maximum Subarray (Kadane)', 'MEDIUM', 'STRIVER_A2Z', 'https://leetcode.com/problems/maximum-subarray/', 'Kadane''s Algorithm', 'Step 3', NULL),
(1, 'Sort Colors (Dutch Flag)', 'MEDIUM', 'STRIVER_A2Z', 'https://leetcode.com/problems/sort-colors/', 'Dutch National Flag', 'Step 3', NULL),
(1, 'Next Permutation', 'MEDIUM', 'STRIVER_A2Z', 'https://leetcode.com/problems/next-permutation/', 'Array Manipulation', 'Step 3', NULL);

-- Topic 3: Two Pointers (id=3)
INSERT INTO dsa_problem (topic_id, name, difficulty, source, source_url, pattern, striver_step, neetcode_category) VALUES
(3, 'Valid Palindrome', 'EASY', 'NEETCODE_150', 'https://leetcode.com/problems/valid-palindrome/', 'Two Pointers Inward', NULL, 'Two Pointers'),
(3, 'Two Sum II - Sorted Array', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/', 'Two Pointers + Sorted', NULL, 'Two Pointers'),
(3, '3Sum', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/3sum/', 'Sort + Two Pointers', 'Step 3', 'Two Pointers'),
(3, 'Container With Most Water', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/container-with-most-water/', 'Greedy Two Pointers', NULL, 'Two Pointers'),
(3, 'Trapping Rain Water', 'HARD', 'NEETCODE_150', 'https://leetcode.com/problems/trapping-rain-water/', 'Two Pointers / Prefix Max', 'Step 3', 'Two Pointers');

-- Topic 4: Sliding Window (id=4)
INSERT INTO dsa_problem (topic_id, name, difficulty, source, source_url, pattern, striver_step, neetcode_category) VALUES
(4, 'Best Time to Buy and Sell Stock', 'EASY', 'NEETCODE_150', 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', 'Min So Far + Max Profit', 'Step 3', 'Sliding Window'),
(4, 'Longest Substring Without Repeating Characters', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', 'Variable Window + Hash Set', 'Step 10', 'Sliding Window'),
(4, 'Longest Repeating Character Replacement', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/longest-repeating-character-replacement/', 'Variable Window + Frequency', 'Step 10', 'Sliding Window'),
(4, 'Minimum Window Substring', 'HARD', 'NEETCODE_150', 'https://leetcode.com/problems/minimum-window-substring/', 'Variable Window + Two Maps', 'Step 10', 'Sliding Window'),
(4, 'Max Consecutive Ones III', 'MEDIUM', 'STRIVER_A2Z', 'https://leetcode.com/problems/max-consecutive-ones-iii/', 'Variable Window + Count', 'Step 10', NULL);

-- Topic 5: Binary Search (id=5)
INSERT INTO dsa_problem (topic_id, name, difficulty, source, source_url, pattern, striver_step, neetcode_category) VALUES
(5, 'Binary Search', 'EASY', 'NEETCODE_150', 'https://leetcode.com/problems/binary-search/', 'Standard Binary Search', 'Step 4', 'Binary Search'),
(5, 'Search a 2D Matrix', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/search-a-2d-matrix/', 'Binary Search on Flattened', 'Step 4', 'Binary Search'),
(5, 'Koko Eating Bananas', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/koko-eating-bananas/', 'Binary Search on Answer', 'Step 4', 'Binary Search'),
(5, 'Find Minimum in Rotated Sorted Array', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/', 'Modified Binary Search', 'Step 4', 'Binary Search'),
(5, 'Search in Rotated Sorted Array', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/search-in-rotated-sorted-array/', 'Modified Binary Search', 'Step 4', 'Binary Search'),
(5, 'Book Allocation Problem', 'HARD', 'STRIVER_A2Z', 'https://www.naukri.com/code360/problems/allocate-books_1090540', 'Binary Search on Answer', 'Step 4', NULL);

-- Topic 8: Linked List (id=8)
INSERT INTO dsa_problem (topic_id, name, difficulty, source, source_url, pattern, striver_step, neetcode_category) VALUES
(8, 'Reverse Linked List', 'EASY', 'NEETCODE_150', 'https://leetcode.com/problems/reverse-linked-list/', 'Iterative Pointer Swap', 'Step 6', 'Linked List'),
(8, 'Merge Two Sorted Lists', 'EASY', 'NEETCODE_150', 'https://leetcode.com/problems/merge-two-sorted-lists/', 'Merge Two Pointers', 'Step 6', 'Linked List'),
(8, 'Linked List Cycle', 'EASY', 'NEETCODE_150', 'https://leetcode.com/problems/linked-list-cycle/', 'Floyd Tortoise & Hare', 'Step 6', 'Linked List'),
(8, 'Remove Nth Node From End', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', 'Two Pointer Gap', 'Step 6', 'Linked List'),
(8, 'Reorder List', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/reorder-list/', 'Find Mid + Reverse + Merge', 'Step 6', 'Linked List');

-- Topic 9: Stack & Queue (id=9)
INSERT INTO dsa_problem (topic_id, name, difficulty, source, source_url, pattern, striver_step, neetcode_category) VALUES
(9, 'Valid Parentheses', 'EASY', 'NEETCODE_150', 'https://leetcode.com/problems/valid-parentheses/', 'Stack Matching', 'Step 9', 'Stack'),
(9, 'Min Stack', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/min-stack/', 'Auxiliary Stack', 'Step 9', 'Stack'),
(9, 'Daily Temperatures', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/daily-temperatures/', 'Monotonic Stack', 'Step 9', 'Stack'),
(9, 'Next Greater Element I', 'EASY', 'STRIVER_A2Z', 'https://leetcode.com/problems/next-greater-element-i/', 'Monotonic Stack + Hash', 'Step 9', NULL),
(9, 'Largest Rectangle in Histogram', 'HARD', 'NEETCODE_150', 'https://leetcode.com/problems/largest-rectangle-in-histogram/', 'Monotonic Stack', 'Step 9', 'Stack');

-- Topic 10: Binary Trees (id=10)
INSERT INTO dsa_problem (topic_id, name, difficulty, source, source_url, pattern, striver_step, neetcode_category) VALUES
(10, 'Maximum Depth of Binary Tree', 'EASY', 'NEETCODE_150', 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', 'DFS Recursion', 'Step 13', 'Trees'),
(10, 'Invert Binary Tree', 'EASY', 'NEETCODE_150', 'https://leetcode.com/problems/invert-binary-tree/', 'DFS Swap', 'Step 13', 'Trees'),
(10, 'Same Tree', 'EASY', 'NEETCODE_150', 'https://leetcode.com/problems/same-tree/', 'DFS Compare', 'Step 13', 'Trees'),
(10, 'Binary Tree Level Order Traversal', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/binary-tree-level-order-traversal/', 'BFS Queue', 'Step 13', 'Trees'),
(10, 'Lowest Common Ancestor', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/', 'DFS Path Finding', 'Step 13', 'Trees'),
(10, 'Diameter of Binary Tree', 'EASY', 'STRIVER_A2Z', 'https://leetcode.com/problems/diameter-of-binary-tree/', 'DFS Height + Diameter', 'Step 13', NULL),
(10, 'Binary Tree Maximum Path Sum', 'HARD', 'NEETCODE_150', 'https://leetcode.com/problems/binary-tree-maximum-path-sum/', 'DFS Max Gain', 'Step 13', 'Trees');

-- Topic 13: Graphs (id=13)
INSERT INTO dsa_problem (topic_id, name, difficulty, source, source_url, pattern, striver_step, neetcode_category) VALUES
(13, 'Number of Islands', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/number-of-islands/', 'BFS/DFS Grid Traversal', 'Step 15', 'Graphs'),
(13, 'Clone Graph', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/clone-graph/', 'BFS/DFS + HashMap', 'Step 15', 'Graphs'),
(13, 'Course Schedule', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/course-schedule/', 'Topological Sort / Cycle Detection', 'Step 15', 'Graphs'),
(13, 'Course Schedule II', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/course-schedule-ii/', 'Topological Sort (Kahn)', 'Step 15', 'Graphs'),
(13, 'Pacific Atlantic Water Flow', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/pacific-atlantic-water-flow/', 'Multi-source BFS/DFS', 'Step 15', 'Graphs'),
(13, 'Rotten Oranges', 'MEDIUM', 'STRIVER_A2Z', 'https://leetcode.com/problems/rotting-oranges/', 'Multi-source BFS', 'Step 15', NULL),
(13, 'Dijkstra Shortest Path', 'MEDIUM', 'STRIVER_A2Z', 'https://www.geeksforgeeks.org/problems/implementing-dijkstra-set-1-adjacency-matrix/1', 'Dijkstra Priority Queue', 'Step 15', NULL);

-- Topic 14: Dynamic Programming (id=14)
INSERT INTO dsa_problem (topic_id, name, difficulty, source, source_url, pattern, striver_step, neetcode_category) VALUES
(14, 'Climbing Stairs', 'EASY', 'NEETCODE_150', 'https://leetcode.com/problems/climbing-stairs/', '1D DP / Fibonacci', 'Step 16', '1-D DP'),
(14, 'House Robber', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/house-robber/', '1D DP Skip/Take', 'Step 16', '1-D DP'),
(14, 'Coin Change', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/coin-change/', 'Unbounded Knapsack', 'Step 16', '1-D DP'),
(14, 'Longest Increasing Subsequence', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/longest-increasing-subsequence/', 'LIS Pattern', 'Step 16', '1-D DP'),
(14, 'Longest Common Subsequence', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/longest-common-subsequence/', '2D DP String Matching', 'Step 16', '2-D DP'),
(14, 'Edit Distance', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/edit-distance/', '2D DP String Operations', 'Step 16', '2-D DP'),
(14, '0/1 Knapsack', 'MEDIUM', 'STRIVER_A2Z', 'https://www.geeksforgeeks.org/problems/0-1-knapsack-problem0945/1', '0/1 Knapsack', 'Step 16', NULL),
(14, 'Partition Equal Subset Sum', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/partition-equal-subset-sum/', 'Subset Sum DP', 'Step 16', '1-D DP');

-- Topic 12: Heap / Priority Queue (id=12)
INSERT INTO dsa_problem (topic_id, name, difficulty, source, source_url, pattern, striver_step, neetcode_category) VALUES
(12, 'Kth Largest Element in a Stream', 'EASY', 'NEETCODE_150', 'https://leetcode.com/problems/kth-largest-element-in-a-stream/', 'Min Heap of Size K', 'Step 11', 'Heap'),
(12, 'Last Stone Weight', 'EASY', 'NEETCODE_150', 'https://leetcode.com/problems/last-stone-weight/', 'Max Heap', 'Step 11', 'Heap'),
(12, 'K Closest Points to Origin', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/k-closest-points-to-origin/', 'Max Heap of Size K', 'Step 11', 'Heap'),
(12, 'Find Median from Data Stream', 'HARD', 'NEETCODE_150', 'https://leetcode.com/problems/find-median-from-data-stream/', 'Two Heaps Pattern', 'Step 11', 'Heap'),
(12, 'Task Scheduler', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/task-scheduler/', 'Greedy + Heap', 'Step 11', 'Heap');

-- Topic 15: Greedy (id=15)
INSERT INTO dsa_problem (topic_id, name, difficulty, source, source_url, pattern, striver_step, neetcode_category) VALUES
(15, 'Maximum Subarray', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/maximum-subarray/', 'Kadane Greedy', NULL, 'Greedy'),
(15, 'Jump Game', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/jump-game/', 'Greedy Reachability', 'Step 12', 'Greedy'),
(15, 'Jump Game II', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/jump-game-ii/', 'BFS-like Greedy', 'Step 12', 'Greedy'),
(15, 'N Meetings in One Room', 'EASY', 'STRIVER_A2Z', 'https://www.geeksforgeeks.org/problems/n-meetings-in-one-room-1587115620/1', 'Activity Selection', 'Step 12', NULL);

-- Topic 16: Backtracking (id=16)
INSERT INTO dsa_problem (topic_id, name, difficulty, source, source_url, pattern, striver_step, neetcode_category) VALUES
(16, 'Subsets', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/subsets/', 'Include/Exclude Recursion', 'Step 7', 'Backtracking'),
(16, 'Combination Sum', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/combination-sum/', 'Backtrack + Target Sum', 'Step 7', 'Backtracking'),
(16, 'Permutations', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/permutations/', 'Swap Backtracking', 'Step 7', 'Backtracking'),
(16, 'N-Queens', 'HARD', 'NEETCODE_150', 'https://leetcode.com/problems/n-queens/', 'Constraint Backtracking', 'Step 7', 'Backtracking'),
(16, 'Word Search', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/word-search/', 'Grid Backtracking', 'Step 7', 'Backtracking');

-- Topic 17: Tries (id=17)
INSERT INTO dsa_problem (topic_id, name, difficulty, source, source_url, pattern, striver_step, neetcode_category) VALUES
(17, 'Implement Trie (Prefix Tree)', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/implement-trie-prefix-tree/', 'Trie Implementation', 'Step 17', 'Tries'),
(17, 'Design Add and Search Words', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/design-add-and-search-words-data-structure/', 'Trie + DFS Wildcard', 'Step 17', 'Tries'),
(17, 'Word Search II', 'HARD', 'NEETCODE_150', 'https://leetcode.com/problems/word-search-ii/', 'Trie + Grid Backtracking', 'Step 17', 'Tries');

-- Topic 18: Bit Manipulation (id=18)
INSERT INTO dsa_problem (topic_id, name, difficulty, source, source_url, pattern, striver_step, neetcode_category) VALUES
(18, 'Single Number', 'EASY', 'NEETCODE_150', 'https://leetcode.com/problems/single-number/', 'XOR All Elements', 'Step 8', 'Bit Manipulation'),
(18, 'Number of 1 Bits', 'EASY', 'NEETCODE_150', 'https://leetcode.com/problems/number-of-1-bits/', 'Bit Count / Brian Kernighan', 'Step 8', 'Bit Manipulation'),
(18, 'Counting Bits', 'EASY', 'NEETCODE_150', 'https://leetcode.com/problems/counting-bits/', 'DP + Bit Manipulation', 'Step 8', 'Bit Manipulation'),
(18, 'Reverse Bits', 'EASY', 'NEETCODE_150', 'https://leetcode.com/problems/reverse-bits/', 'Bit Shifting', 'Step 8', 'Bit Manipulation');

-- Topic 19: Intervals (id=19)
INSERT INTO dsa_problem (topic_id, name, difficulty, source, source_url, pattern, striver_step, neetcode_category) VALUES
(19, 'Merge Intervals', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/merge-intervals/', 'Sort + Merge Overlapping', NULL, 'Intervals'),
(19, 'Insert Interval', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/insert-interval/', 'Merge + Insert', NULL, 'Intervals'),
(19, 'Non-overlapping Intervals', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/non-overlapping-intervals/', 'Greedy Interval Scheduling', NULL, 'Intervals'),
(19, 'Meeting Rooms II', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/meeting-rooms-ii/', 'Min Heap / Sweep Line', NULL, 'Intervals');

-- Topic 20: Math & Geometry (id=20)
INSERT INTO dsa_problem (topic_id, name, difficulty, source, source_url, pattern, striver_step, neetcode_category) VALUES
(20, 'Rotate Image', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/rotate-image/', 'Transpose + Reverse', NULL, 'Math & Geometry'),
(20, 'Spiral Matrix', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/spiral-matrix/', 'Layer-by-Layer Traversal', NULL, 'Math & Geometry'),
(20, 'Set Matrix Zeroes', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/set-matrix-zeroes/', 'In-place Marking', NULL, 'Math & Geometry'),
(20, 'Pow(x, n)', 'MEDIUM', 'NEETCODE_150', 'https://leetcode.com/problems/powx-n/', 'Binary Exponentiation', NULL, 'Math & Geometry');
