USE employee_db;

INSERT INTO departments (dept_name)  VALUES ('IT'),('HR'),('Sales'),('Legal');

INSERT INTO roles ( title,salary,department_id) VALUES 
('Engineer',40000.00,1),
('Software Intern', 30000.00,1),
('IT Manager',	50000.00,	1),
 ('HR admin'	,45000.00,	2),
('Lawyer'  ,  45000.00, 4) ,
('Legal Head' ,  46000.00, 4) ,
('Sales Head',47000.00, 3), 
('Salesperson',28000.00, 3),
('HR Head',45000.00,2);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
   ( 'Benjamin' , 'Brown', 3,1 ),
    ( 'David', 'Jenkins', 1, 1),
  ( 'Jessica', 'Williams', 1, 1),
   ( 'Julian', 'Crosby', 2, 3),
  ( 'Jackeline','Albright', 2, 3),
  ( 'Paul ', 'Carter', 3, 6),
  ( 'Carol', 'Sawyer', 3, 7),
  ('Maura','Cradwell',9,8),
  ( 'Amandeep', 'Singh', 4, 8),
    ( 'Ashish','Goel', 6, 10),
  ( 'Ranjana', 'Jaiswal', 5, 10),
  ( 'Ajay', 'Sharma', 5, 10),
  ( 'Aastha' , 'Devadi', 6,13 ),
  ( 'Anvita', 'Raina', 7, 14),
  ( 'Ujjaval','Bhardwaj', 7,15 ),
  ( 'Ankit ', 'Sud', 8, 14),
  ( 'Pradeep', 'Kumar', 8, 14);
  ( 'Pujitha', 'Pathak', 8, 15),
  ( 'Neha' , 'Punia', 3,19 ),
  ( 'Rashi ', 'Aggrawal', 6, 20),
  ( 'Anurag', 'Tomar', 7, 21);