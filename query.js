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
        let rows = res.map((row) => row.dept_name);
        resolve(rows);
      });
    });
  }

  viewEmployees(connection) {
    const query =
      "SELECT  employees.first_name, employees.last_name, title,salary, dept_name AS department, CONCAT(employeeManager.first_name + ' ' + employeeManager.last_name) AS manager " +
      "FROM employees " +
      "INNER JOIN roles ON employees.role_id = roles.id " +
      "INNER JOIN departments ON roles.department_id = departments.id " +
      "INNER JOIN employees AS employeeManager ON  employees.manager_id = employeeManager.id;";
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
        `SELECT CONCAT(first_name, ' ', last_name) AS fullName FROM employees`,
        (err, res) => {
          if (err) {
            reject(err);
          }
          let nameArray = res.map((row) => row.fullName);
          // console.log(nameArray);
          resolve(nameArray);
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
        let role = res.map((row) => row.title);
        resolve(role);
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

  //
  // allManagerNames(connection) {
  //   return new Promise((resolve, reject) => {
  //     connection.query(
  //       `SELECT id ,first_name , last_name, role_id FROM employees AS e WHERE e.manager_id = e.id`,
  //       (err, res) => {
  //         if (err) {
  //           reject(err);
  //         }
  //         console.log(res);
  //         resolve(res);
  //       }
  //     );
  //   });
  // }

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

  quit(connection) {
    connection.end();
  }
}

module.exports = Query;
