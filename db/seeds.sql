INSERT INTO departments (name)
VALUES 
("Engineering"),
("Research and Development"),
("Accounts Payable");
INSERT INTO roles (title, salary, department_id)
VALUES
("Junior Engineer", 50000,1),
("Senior Engineer", 70000,1),
("Junior Scientist", 55000,2),
("Senior Scientist", 80000,2),
("Junior Accountant", 40000,3),
("Senior Accountant", 65000,3);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
("Adam", "Lewis", 4, NULL),
("Justin", "Rennington", 3, 1),
("Jinny", "Weasley", 2, NULL),
("Perry", "Botter", 1, 2),
("Gregory", "Pots", 3, 1),
("Denise", "Darwin", 6, NULL),
("Ingrid", "Van-Jinkle", 5, 6),
("Adrian", "DeVille", 5, 6);







