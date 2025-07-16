-- Active: 1751403823678@@127.0.0.1@5432@tdd_test
-- Create a new user
INSERT INTO users (id, name, email, created_at, updated_at)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;
