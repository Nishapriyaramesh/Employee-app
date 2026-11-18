-- 1. Basic Select
SELECT * FROM employees;

-- 2. Join (Get employees and their department names)
SELECT e.first_name, e.last_name, d.name AS department
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id;

-- 3. Aggregate (Count employees per department)
SELECT d.name AS department, COUNT(e.id) AS employee_count
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id
GROUP BY d.name;

-- 4. Filtered Report (Find employees in Engineering)
SELECT * FROM employees e
JOIN departments d ON e.department_id = d.id
WHERE d.name = 'Engineering';

-- 5. Update (Promote an employee)
UPDATE employees SET department_id = 2 WHERE email = 'alice@test.com';

-- 6. Transaction (Move an employee to a new department safely)
BEGIN;
INSERT INTO departments (name) VALUES ('Research & Development');
UPDATE employees 
SET department_id = (SELECT id FROM departments WHERE name = 'Research & Development') 
WHERE email = 'bob@test.com';
COMMIT;

-- 7. Index Justification (Task 27)
-- Query: SELECT * FROM employees WHERE email = 'alice@test.com';
-- An index should be created on the 'email' column because it is used heavily in the login and search routes. 
-- Creating an index on 'email' makes this specific query run in O(log n) time instead of scanning the whole table.
CREATE INDEX idx_employees_email ON employees(email);