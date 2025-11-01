package com.fairshare.backend.dsa.tree;

import java.util.*;

public class AVLTree<T extends Comparable<T>> {
    private class Node {
        T key;
        Node left, right;
        int height;
        Node(T key) { this.key = key; height = 1; }
    }

    private Node root;

    public void insert(T key) { root = insertRec(root, key); }

    private Node insertRec(Node node, T key) {
        if (node == null) return new Node(key);
        int cmp = key.compareTo(node.key);
        if (cmp < 0) node.left = insertRec(node.left, key);
        else if (cmp > 0) node.right = insertRec(node.right, key);
        else return node; // duplicate

        node.height = 1 + Math.max(height(node.left), height(node.right));
        return balance(node);
    }

    private int height(Node n) { return n == null ? 0 : n.height; }

    private Node balance(Node n) {
        int bf = height(n.left) - height(n.right);
        if (bf > 1) {
            if (height(n.left.left) >= height(n.left.right)) return rotateRight(n);
            n.left = rotateLeft(n.left);
            return rotateRight(n);
        }
        if (bf < -1) {
            if (height(n.right.right) >= height(n.right.left)) return rotateLeft(n);
            n.right = rotateRight(n.right);
            return rotateLeft(n);
        }
        return n;
    }

    private Node rotateLeft(Node y) {
        Node x = y.right, T2 = x.left;
        x.left = y; y.right = T2;
        y.height = 1 + Math.max(height(y.left), height(y.right));
        x.height = 1 + Math.max(height(x.left), height(x.right));
        return x;
    }

    private Node rotateRight(Node y) {
        Node x = y.left, T2 = x.right;
        x.right = y; y.left = T2;
        y.height = 1 + Math.max(height(y.left), height(y.right));
        x.height = 1 + Math.max(height(x.left), height(x.right));
        return x;
    }

    public List<T> inOrder() {
        List<T> res = new ArrayList<>();
        inOrderRec(root, res);
        return res;
    }

    private void inOrderRec(Node node, List<T> res) {
        if (node != null) {
            inOrderRec(node.left, res);
            res.add(node.key);
            inOrderRec(node.right, res);
        }
    }
}
