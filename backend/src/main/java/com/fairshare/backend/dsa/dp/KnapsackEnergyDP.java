package com.fairshare.backend.dsa.dp;

import java.util.ArrayList;
import java.util.List;

/**
 * 0/1 Knapsack to choose a set of energy tasks/items under a unit/budget limit
 * that maximizes "benefit".
 *
 * Inputs:
 *  - weights[i]  : cost/units (int, scaled if needed)
 *  - values[i]   : benefit (int)
 *  - capacity    : limit (int)
 *
 * Returns indices selected.
 */
public class KnapsackEnergyDP {

    public static List<Integer> solve(int[] weights, int[] values, int capacity) {
        int n = weights.length;
        int[][] dp = new int[n + 1][capacity + 1];

        for (int i = 1; i <= n; i++) {
            int w = weights[i - 1];
            int v = values[i - 1];
            for (int c = 0; c <= capacity; c++) {
                dp[i][c] = dp[i - 1][c];
                if (w <= c) {
                    dp[i][c] = Math.max(dp[i][c], dp[i - 1][c - w] + v);
                }
            }
        }

        // reconstruct chosen items
        List<Integer> chosen = new ArrayList<>();
        int c = capacity;
        for (int i = n; i >= 1; i--) {
            if (dp[i][c] != dp[i - 1][c]) {
                chosen.add(i - 1);
                c -= weights[i - 1];
            }
        }
        return chosen;
    }
}
