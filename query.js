//const connection = require("./connection");

const { query } = require("./connection");

//var value;
class Query {
  viewRoles(connection) {
    const query =
      "SELECT  roles.id, title, salary,dept_name " +
      "FROM roles " +
      "INNER JOIN " +
      "departments ON roles.department_id = departments.id " +
      "ORDER BY title;";

    return new Promise((resolve, reject) => {
      connection.query(query, (err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    });
  }

  viewDepartment(connection) {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM departments`, (err, res) => {
        if (err) {
          return reject(err);
        }
        // let rows = res.map((row) => row.dept_name);
        resolve(res);
      });
    });
  }

  viewEmployees(connection) {
    const query =
      // "SELECT " +
      // "e.first_name, " +
      // "e.last_name, " +
      // "roles.title , " +
      // "roles.salary, " +
      // "departments.dept_name AS department, " +
      // "CONCAT(m.first_name + ' ' + m.last_name) AS manager " +
      // "FROM employees AS e " +
      // "LEFT OUTER JOIN employees AS m ON  e.manager_id = m.id " +
      // "INNER JOIN roles ON e.role_id = roles.id " +
      // "INNER JOIN departments ON roles.department_id = departments.id; ";
      // use LEFT OUTER JOIN to  show employees with no managers
      "SELECT " +
      "e.first_name, " +
      "e.last_name, " +
      "r.title AS `role`, " +
      "r.salary, " +
      "d.dept_name AS `department`, " +
      "CONCAT(m.first_name, ' ', m.last_name) as manager " +
      "FROM employees AS e " +
      "LEFT OUTER JOIN employees AS m ON e.manager_id = m.id " +
      "INNER JOIN `roles` AS r ON e.role_id = r.id " +
      "INNER JOIN departments AS d ON r.department_id = d.id " +
      "ORDER BY e.last_name, e.first_name;";
    return new Promise((resolve, reject) => {
      connection.query(query, (err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    });
  }

  viewEmployeesNames(connection) {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT  CONCAT(first_name, ' ', last_name) AS fullName FROM employees`,
        (err, res) => {
          if (err) {
            reject(err);
          }
          let nameArray = res.map((row) => row.fullName);
          console.log("emp names from res", res);
          resolve(nameArray);
        }
      );
    });
  }

  viewEmployeesNamesAndId(connection) {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT employees.id, CONCAT(first_name, ' ', last_name) AS fullName FROM employees`,
        (err, res) => {
          if (err) {
            reject(err);
          }

          resolve(res);
        }
      );
    });
  }

  viewRoleNames(connection) {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM roles`, (err, res) => {
        if (err) {
          reject(err);
        }
        // let role = res.map((row) => row.title);
        resolve(res);
      });
    });
  }

  addDepartment(deptName, connection) {
    return new Promise((resolve, reject) => {
      connection.query(
        `INSERT INTO departments SET ?`,
        [
          {
            dept_name: deptName,
          },
        ],
        (err, res) => {
          if (err) {
            reject(err);
          }
          //console.log(res);
          resolve("Department Name added Sucessfully!");
        }
      );
    });
  }

  addRole(title, salary, deptName, connection) {
    return new Promise((resolve, reject) => {
      connection.query(
        `INSERT INTO roles 
      SET 
       title = ?, 
       salary = ?,
       department_id = (SELECT id FROM departments
                        WHERE dept_name = ?)`,
        [title, salary, deptName],
        (err, res) => {
          if (err) {
            reject(err);
          }
          //console.log(res);
          resolve("Role added Sucessfully!");
        }
      );
    });
  }

  allManagerNames(connection) {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT id , CONCAT( first_name,' ',last_name) AS fullName FROM employees AS e WHERE e.manager_id = e.id`,
        (err, res) => {
          if (err) {
            reject(err);
          }
          console.log(res);
          resolve(res);
        }
      );
    });
  }

  allEmplyoeesNamesNotManager(connection) {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT id ,first_name , last_name FROM employees AS e WHERE e.manager_id != e.id`,
        (err, res) => {
          if (err) {
            reject(err);
          }
          console.log(res);
          resolve(res);
        }
      );
    });
  }

  viewManagersWithDepartmantandRoles(connection) {
    const query = `SELECT  employees.id,employees.first_name, employees.last_name, title,salary, dept_name AS department
  FROM employees
  INNER JOIN roles ON employees.role_id = roles.id 
  INNER JOIN departments ON roles.department_id = departments.id 
  WHERE employees.manager_id = employees.id;`;

    return new Promise((resolve, reject) => {
      connection.query(query, (err, res) => {
        if (err) {
          reject(err);
        }
        // console.log(res);
        resolve(res);
      });
    });
  }

  addEmployeeAsManager(connection, firstName, lastName, roleID) {
    return new Promise((resolve, reject) => {
      connection.query(
        `INSERT INTO employees
       SET
        first_name = ?,
        last_name = ?,
        role_id = ?,
        manager_id = (SELECT MAX(id)+1 FROM employees AS x)
                     `,
        [firstName, lastName, roleID],
        (err, res) => {
          if (err) {
            reject(err);
          }
          // console.log(res);
          resolve("Employee added Sucessfully");
        }
      );
    });
  }

  addEmployee(connection, firstName, lastName, roleId, managerName) {
    const managerNameArr = managerName.split(" ");
    const managerFirstName = managerNameArr[0];
    const managerLastName = managerNameArr[1];
    return new Promise((resolve, reject) => {
      connection.query(
        `INSERT INTO employees
       SET
        first_name = ?,
        last_name = ?,
        role_id = ?,
        manager_id = (SELECT id FROM employees AS x
                      WHERE first_name = ? AND
                            last_name = ?)`,
        [firstName, lastName, roleId, managerFirstName, managerLastName],
        (err, res) => {
          if (err) {
            reject(err);
          }
          // console.log(res);
          resolve("Employee added Sucessfully");
        }
      );
    });
  }

  updateEmployeeRole(connection, { employee, newRole }) {
    employee = employee.split(" ");
    const firstName = employee[0];
    const lastName = employee[1];
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE employees
      SET role_id = (SELECT id FROM roles
                     WHERE title = ?)
      WHERE (first_name = ? AND last_name = ?)`,
        [newRole, firstName, lastName],
        (err, res) => {
          if (err) {
            reject(err);
          }
          // console.log(res);
          resolve("Employee Role updated Sucessfully");
        }
      );
    });
  }

  deleteAnEmployee(connection, emp_id) {
    return new Promise((resolve, reject) => {
      connection.query(
        `DELETE FROM employees WHERE id = ?`,
        [emp_id],
        (err, res) => {
          if (err) {
            reject(err);
          }
          // console.log(res);
          resolve("Deleted an Employee Sucessfully");
        }
      );
    });
  }

  viewAllEmployeesbyManager(connection) {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT " +
        "CONCAT(m.first_name, ' ', m.last_name) as manager, " +
        "e.first_name, " +
        "e.last_name, " +
        "r.title AS `role`, " +
        "d.dept_name AS `department` " +
        "FROM employees AS e " +
        "LEFT OUTER JOIN employees AS m ON e.manager_id = m.id " +
        "INNER JOIN `roles` AS r ON e.role_id = r.id " +
        "INNER JOIN departments AS d ON r.department_id = d.id " +
        "ORDER BY manager;";
      connection.query(query, (err, res) => {
        if (err) {
          reject(err);
        }
        // console.log(res);
        resolve(res);
      });
    });
  }

  viewAllEmployeesbyDepartment(connection) {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT " +
        "CONCAT(m.first_name, ' ', m.last_name) as manager, " +
        "e.first_name, " +
        "e.last_name, " +
        "r.title AS `role`, " +
        "d.dept_name AS `department` " +
        "FROM employees AS e " +
        "LEFT OUTER JOIN employees AS m ON e.manager_id = m.id " +
        "INNER JOIN `roles` AS r ON e.role_id = r.id " +
        "INNER JOIN departments AS d ON r.department_id = d.id " +
        "ORDER BY department;";
      connection.query(query, (err, res) => {
        if (err) {
          reject(err);
        }
        // console.log(res);
        resolve(res);
      });
    });
  }

  updateManagersName(connection, managerId, empName) {
    empName = empName.split(" ");
    const firstName = empName[0];
    const lastName = empName[1];
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE employees
      SET manager_id = ?
      WHERE (first_name = ? AND last_name = ?)`,
        [managerId, firstName, lastName],
        (err, res) => {
          if (err) {
            reject(err);
          }
          // console.log(res);
          resolve("Employee's Manager Name updated Sucessfully");
        }
      );
    });
  }

  empsWithRoleId(connection, roleId) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT id, CONCAT(`first_name`, ' ', `last_name`) as fullName FROM employees WHERE role_id = ?",
        [roleId],
        (err, res) => {
          if (err) {
            reject(err);
          }
          console.log(res);
          resolve(res);
        }
      );
    });
  }

  deleteRole(connection, selectedRoleId) {
    return new Promise((resolve, reject) => {
      connection.query(
        `DELETE FROM roles WHERE id = ?`,
        [selectedRoleId],
        (err, res) => {
          if (err) {
            reject(err);
          }
          // console.log(res);
          resolve("Role Deleted Sucessfully");
        }
      );
    });
  }

  rolesWithDeptId(connection, dept_id) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT title FROM roles WHERE department_id = ?",
        [dept_id],
        (err, res) => {
          if (err) {
            reject(err);
          }
          // console.log(res);
          resolve(res);
        }
      );
    });
  }

  deleteDepartment(connection, dept_id) {
    return new Promise((resolve, reject) => {
      connection.query(
        `DELETE FROM departments WHERE id = ?`,
        [dept_id],
        (err, res) => {
          if (err) {
            reject(err);
          }
          // console.log(res);
          resolve("Department Deleted Sucessfully");
        }
      );
    });
  }
  quit(connection) {
    connection.end();
  }
}

module.exports = Query;
