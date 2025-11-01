package com.fairshare.backend.service;

import com.fairshare.backend.model.Roommate;
import com.fairshare.backend.repository.RoommateRepository;
import com.fairshare.backend.dsa.tree.AVLTree;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class RoommateService {
    private final RoommateRepository repo;

    public RoommateService(RoommateRepository repo) {
        this.repo = repo;
    }

    public List<Roommate> getAll() {
        return repo.findAll();
    }

    public Roommate add(Roommate r) {
        r.calculateBehaviorScore();
        return repo.save(r);
    }

    public void delete(UUID id) {
        repo.deleteById(id);
    }

    /**
     * ✅ Use AVL Tree for Sorted Order
     */
    public List<Roommate> getSortedByBehavior() {
        AVLTree<Roommate> tree = new AVLTree<>();
        repo.findAll().forEach(tree::insert);
        return tree.inOrder(); // returns ascending order by behavior score
    }

    /**
     * ✅ Use Max Heap to get Top N Roommates by Behavior Score
     */
    public List<Roommate> getTopPerformers(int n) {
        PriorityQueue<Roommate> maxHeap =
                new PriorityQueue<>((a, b) -> Double.compare(b.getBehaviorScore(), a.getBehaviorScore()));
        maxHeap.addAll(repo.findAll());

        List<Roommate> top = new ArrayList<>();
        for (int i = 0; i < n && !maxHeap.isEmpty(); i++) top.add(maxHeap.poll());
        return top;
    }
}
