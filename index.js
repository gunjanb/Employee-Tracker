const inquirer = require("inquirer");
const cTable = require("console.table");
const logo = require("asciiart-logo");
const mysql = require("mysql");
const Query = require("./query.js");
const query = new Query();
// require("dotenv").config();
const connection = require("./connection.js");
regexNumber = /^[0-9]*\d$/;

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
          query.viewDepartment(connection).then((Alldepts) => {
            inquirer
              .prompt([
                {
                  type: "input",
                  name: "roleTitle",
                  message: "Please enter Role title you want to add.",
                  validate: (roleTitle) => {
                    if (roleTitle) {
                      return true;
                    } else {
                      return "Please enter a role name.";
                    }
                  },
                },
                {
                  type: "input",
                  name: "salary",
                  message:
                    "Please enter salary for current role you want to add.",
                  validate: (salary) => {
                    if (regexNumber.test(salary)) {
                      return true;
                    } else {
                      return "Please enter valid salary";
                    }
                  },
                },
                {
                  type: "list",
                  name: "chooseDept",
                  message: "Please select department for current role",
                  choices: Alldepts,
                },
              ])
              .then((ans) => {
                query
                  .addRole(
                    ans.roleTitle,
                    ans.salary,
                    ans.chooseDept,
                    connection
                  )
                  .then((answer) => {
                    console.log(answer);
                    startApp();
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              });
          });
          break;

        case "Add an employee":
          promptForAddEmployee();
          break;

        case "Update employee role":
          promptForUpdateEmployeeRole();
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
          promptForBudgetUtilization();
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
// var roleChoices;
var deptName;
var roleID;
var firstName;
var lastName;
function promptForAddEmployee() {
  query.viewRoles(connection).then((rolesInfo) => {
    console.table("roleinfo", rolesInfo);
    const roleChoices = rolesInfo.map((row) => row.title);

    inquirer
      .prompt([
        {
          type: "input",
          name: "firstName",
          message: "What is the new employee's first name?",
          validate: (firstName) => {
            if (firstName) {
              return true;
            } else {
              return "Please enter first name.";
            }
          },
        },
        {
          type: "input",
          name: "lastName",
          message: "What is the employee's last name?",
          validate: (lastName) => {
            if (lastName) {
              return true;
            } else {
              return "Please enter last name.";
            }
          },
        },
        {
          type: "list",
          name: "role",
          message: "Select the employee's role",
          choices: roleChoices,
        },
      ])
      .then((emp) => {
        console.log(rolesInfo);
        rolesInfo.forEach((element) => {
          if (element.title === emp.role) {
            roleID = element.id;
            deptName = element.dept_name;
          }
        });
        firstName = emp.firstName;
        lastName = emp.lastName;
        if (
          emp.role === "Sales Head" ||
          emp.role === "IT Manager" ||
          emp.role === "HR Head" ||
          emp.role === "Legal Head"
        ) {
          query
            .addEmployeeAsManager(connection, firstName, lastName, roleID)
            .then((res) => {
              console.log(res);
              startApp();
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          query
            .viewManagersWithDepartmantandRoles(connection)
            .then((managerInfo) => {
              console.table(managerInfo);
              console.log(roleID, deptName);
              var managerArray = managerInfo.filter(
                (item) => item.department === deptName
              );
              // console.log(managerArray);
              var managersNameForSelection = managerArray.map(
                (item) => item.first_name + " " + item.last_name
              );

              console.log(managersNameForSelection);
              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "managerName",
                    message: "Which Manager would you like to select",
                    choices: managersNameForSelection,
                  },
                ])
                .then((emp) => {
                  query
                    .addEmployee(
                      connection,
                      firstName,
                      lastName,
                      roleID,
                      emp.managerName
                    )
                    .then((res) => {
                      console.log(res);
                      startApp();
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                });
              // const managersLastName = managerArray.map((item) => item.last_name);
              //startApp();
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

function promptForBudgetUtilization() {
  query
    .viewDepartment(connection)
    .then((answer) => {
      //console.log(answer);
      inquirer
        .prompt([
          {
            type: "list",
            name: "dept",
            message: "Which Department Budget do you want to calculate?",
            choices: answer,
          },
        ])
        .then((emp) => {
          // console.log(emp.dept);
          query
            .viewEmployees(connection)
            .then((empInfo) => {
              console.log(emp.dept);
              var budget = 0;
              empInfo.forEach((element) => {
                if (element.department === emp.dept) {
                  budget = budget + element.salary;
                }
              });
              console.log(
                emp.dept + " Department budget uitization is " + " $" + budget
              );
              startApp();
            })
            .catch((err) => {
              console.log(err);
            });
        });
      //console.log(answer);
      // startApp();
    })
    .catch((err) => {
      console.log(err);
    });
}

function promptForUpdateEmployeeRole() {
  // generate employee and role choices dynamically from db
  query.viewEmployees(connection).then((answer) => {
    console.table(
      "Please see the Roles Employee is currently in and make choice appropriately",
      answer
    );
    query.viewEmployeesNames(connection).then((employeeChoices) => {
      query.viewRoleNames(connection).then((roleChoices) => {
        inquirer
          .prompt([
            {
              type: "list",
              name: "employee",
              message: "Please select the employee to update",
              choices: employeeChoices,
            },
            {
              type: "list",
              name: "newRole",
              message: "Please select the employee's new role",
              choices: roleChoices,
            },
          ])
          .then((updateRoleObj) => {
            query
              .updateEmployeeRole(connection, updateRoleObj)
              .then((answer) => {
                console.log(answer);
                startApp();
              })
              .catch((err) => {
                console.log(err);
              });
          });
      });
    });
  });
}
