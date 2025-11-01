package com.fairshare.backend.dsa.heap;

import java.util.*;

public class BehaviorMaxHeap<T> {

    private static class Pair<T> {
        T data;
        double score;
        Pair(T data, double score) { this.data = data; this.score = score; }
    }

    private PriorityQueue<Pair<T>> heap;

    public BehaviorMaxHeap() {
        heap = new PriorityQueue<>((a, b) -> Double.compare(b.score, a.score));
    }

    public void insert(T data, double score) {
        heap.offer(new Pair<>(data, score));
    }

    public List<T> getTopK(int k) {
        List<T> result = new ArrayList<>();
        Iterator<Pair<T>> it = heap.iterator();
        int i = 0;
        while (it.hasNext() && i < k) {
            result.add(it.next().data);
            i++;
        }
        return result;
    }

    public int size() { return heap.size(); }
}
