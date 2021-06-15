const inquirer = require("inquirer");
const cTable = require("console.table");
const logo = require("asciiart-logo");
const mysql = require("mysql");
const Query = require("./query.js");
const query = new Query();
// require("dotenv").config();
const connection = require("./connection.js");

// const connection = mysql.createConnection({
//   host: "localhost",
//   // Your port; if not 3306
//   port: 3306,
//   // Your username
//   user: process.env.DB_USER,
//   // Be sure to update with your own MySQL password!
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

connection.connect((err) => {
  if (err) throw err;
  //console.log("connected as id " + connection.threadId + "\n");
  console.log(
    logo({
      name: "Welcome to Employee Database",
      logoColor: "green",
      borderColor: "yellow",
    }).render()
  );
  startApp();
});

const startApp = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update employee role",
          "Update employee managers",
          "View employees by Manager",
          "Delete an employee",
          "Delete a department",
          "Delete a role",
          "View the total utilized buget of a department",
          "Quit",
        ],
      },
    ])
    .then((answer) => {
      switch (answer.action) {
        case "View all departments":
          query
            .viewDepartment(connection)
            .then((rows) => {
              console.log(rows);
              console.table("Departments", rows);
              startApp();
            })
            .catch((err) => {
              console.log(err);
            });
          break;

        case "View all roles":
          query
            .viewRoles(connection)
            .then((rows) => {
              console.log(rows);
              console.table("Roles", rows);
              startApp();
            })
            .catch((err) => {
              console.log(err);
            });
          break;

        case "View all employees":
          query
            .viewEmployees(connection)
            .then((rows) => {
              console.table("Employees", rows);
              startApp();
            })
            .catch((err) => {
              console.log(err);
            });
          break;

        case "Add a department":
          inquirer
            .prompt([
              {
                type: "input",
                name: "departmentName",
                message: "Please enter Department name you want to enter",
                validate: (departmentName) => {
                  if (departmentName) {
                    return true;
                  } else {
                    return "Please enter a department name.";
                  }
                },
              },
            ])
            .then((answer) => {
              query
                .addDepartment(answer.departmentName, connection)
                .then((answer) => {
                  console.log(answer);
                  startApp();
                })
                .catch((err) => {
                  console.log(err);
                });
            });
          break;
        case "Add a role":
          addRole(title, salary, deptID, connection);
          break;

        case "Add an employee":
          break;

        case "Update employee role":
          break;

        case "Update employee managers":
          break;

        case "Delete an employee":
          break;

        case "Delete a department":
          break;

        case "Delete a role":
          break;

        case "View the total utilized buget of a department":
          break;

        case "View employees by Manager":
          break;

        case "Quit":
          query.quit(connection);
          break;

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};

// function viewDepartment() {
//   connection.query(`SELECT * FROM departments`, (err, res) => {
//     if (err) throw err;
//     console.log("\n");
//     console.table("Deparments", res);
//     startApp();
//   });
// }

// function viewRoles() {
//   connection.query(`SELECT * FROM roles`, (err, res) => {
//     if (err) throw err;
//     role = res.map((row) => row.title);
//     console.log("\n");
//     console.table("Roles", role);
//     startApp();
//   });
// }

// function viewEmployees() {
//   connection.query(
//     `SELECT CONCAT(first_name, ' ', last_name) AS fullName FROM employees`,
//     (err, res) => {
//       if (err) throw err;
//       console.log(res);
//       names = res.map((row) => row.fullName);
//       console.log("\n");
//       console.table("Employees", names);
//       startApp();
//     }
//   );
// }

// function addDepartment(departmentName) {
//   connection.query(
//     `INSERT INTO departments SET ?`,
//     [
//       {
//         dept_name: departmentName,
//       },
//     ],
//     (err, results) => {
//       if (err) throw err;
//       console.log("\n Department added Successfully \n");
//       startApp();
//     }
//   );
// }
