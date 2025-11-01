package com.fairshare.backend.dsa.dp;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

/**
 * Greedy + DP-inspired equal split:
 * - Split total into N nearly-equal parts (to 2 decimals).
 * - Distribute remainder cents greedily to minimize difference.
 */
public class FairSplitDP {

    public static List<BigDecimal> split(BigDecimal total, int n) {
        if (n <= 0) throw new IllegalArgumentException("split count must be > 0");
        total = total.setScale(2, RoundingMode.HALF_UP);

        BigDecimal[] divRem = total.multiply(BigDecimal.valueOf(100)).divideAndRemainder(BigDecimal.valueOf(n));
        int baseCents = divRem[0].intValue();           // floor cents per person
        int remainder = divRem[1].intValue();           // leftover cents

        List<BigDecimal> result = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            int cents = baseCents + (i < remainder ? 1 : 0);
            result.add(BigDecimal.valueOf(cents).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP));
        }
        return result;
    }
}
