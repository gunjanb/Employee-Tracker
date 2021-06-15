//const connection = require("./connection");
//var value;
class Query {
  //METHODS
  // viewdepartment(connection) {
  //   connection.query(`SELECT * FROM departments`, (err, res) => {
  //     if (err) throw err;
  //     value = res;

  //     console.log("value", value);
  //     console.log("res", res);
  //     return res;
  //   });
  // }

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

  viewRoles(connection) {
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

  // addRole(title, salary, department_id, connection) {
  //   return new Promise((resolve, reject) => {
  //     connection.query();
  //   });
  // }
  quit(connection) {
    connection.end();
  }
}

module.exports = Query;
