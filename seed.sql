USE employee_db;

INSERT INTO departments (dept_name)  VALUES ('IT'),('HR'),('Sales'),('Legal');

INSERT INTO roles ( title,salary,department_id) VALUES ( 'Sales Manager',30000.00, 3),
('Engineer',25000.00,1),
('Lawyer',  40000.00,4),
('Project Manager',	35000.00,	1), ('HR admin'	,28000.00,	2),
('Sales person'  ,  24000.00, 3); 

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
  ( 'David', 'Jenkins', 1, 1),
  ( 'Jessica', 'Williams', 4, 2),
  ( 'Julian', 'Crosby', 3, NULL),
  ( 'Jackeline','Albright', 2, 2),
  ( 'Benjamin' , 'Brown', 5,NULL ),
  ( 'Paul ', 'Carter', 2, 2),
  ( 'Carol', 'Sawyer', 6, 1);