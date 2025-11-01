package com.fairshare.backend.service;

import com.fairshare.backend.dsa.heap.BehaviorMaxHeap;
import com.fairshare.backend.dsa.tree.AVLTree;
import com.fairshare.backend.model.RoommateBehavior;
import com.fairshare.backend.repository.RoommateBehaviorRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class BehaviorService {

    private final RoommateBehaviorRepository repo;

    public BehaviorService(RoommateBehaviorRepository repo) {
        this.repo = repo;
    }

    public List<RoommateBehavior> getAll() {
        return repo.findAll();
    }

    public RoommateBehavior addOrUpdate(String name, String email, double scoreDelta) {
        var behavior = repo.findByEmail(email).orElse(new RoommateBehavior(name, email, 50));
        double newScore = Math.min(100, Math.max(0, behavior.getBehaviorScore() + scoreDelta));
        behavior.setBehaviorScore(newScore);
        return repo.save(behavior);
    }

    public List<RoommateBehavior> getRanked() {
        List<RoommateBehavior> all = repo.findAll();
        AVLTree<RoommateBehavior> tree = new AVLTree<>();
        all.forEach(tree::insert);
        return tree.inOrder(); // return sorted order by behaviorScore
    }


    public List<RoommateBehavior> getTopPerformers(int k) {
        BehaviorMaxHeap<RoommateBehavior> heap = new BehaviorMaxHeap<>();
        repo.findAll().forEach(r -> heap.insert(r, r.getBehaviorScore()));
        return heap.getTopK(k);
    }

    public void delete(UUID id) {
        repo.deleteById(id);
    }
}
