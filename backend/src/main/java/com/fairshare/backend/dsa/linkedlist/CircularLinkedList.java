package com.fairshare.backend.dsa.linkedlist;

import java.util.List;

public class CircularLinkedList<T> {

    private static class Node<T> {
        T data;
        Node<T> next;
        Node(T data) { this.data = data; }
    }

    private Node<T> head;
    private Node<T> current;

    public CircularLinkedList(List<T> items) {
        if (items == null || items.isEmpty()) return;
        Node<T> prev = null;
        for (T item : items) {
            Node<T> node = new Node<>(item);
            if (head == null) head = node;
            else prev.next = node;
            prev = node;
        }
        prev.next = head; // make circular
        current = head;
    }

    public T getCurrent() {
        return current != null ? current.data : null;
    }

    public T next() {
        if (current != null) current = current.next;
        return getCurrent();
    }
}
