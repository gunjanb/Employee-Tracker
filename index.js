const inquirer = require("inquirer");
const cTable = require("console.table");
const logo = require("asciiart-logo");
const mysql = require("mysql");
const Query = require("./query.js");
const query = new Query();
const connection = require("./connection.js");
regexNumber = /^[0-9]*\d$/;

//connecting to data base
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

//starting the main prompt
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
          "View employees by Department",
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
          promptForViewDepartments();
          break;
        case "View all roles":
          promptForViewRoles();
          break;
        case "View all employees":
          promptForViewEmployees();
          break;
        case "Add a department":
          promptForAddDepartment();
          break;
        case "Add a role":
          promptForAddRole();
          break;
        case "Add an employee":
          promptForAddEmployee();
          break;
        case "Update employee role":
          promptForUpdateEmployeeRole();
          break;
        case "Update employee managers":
          promptForUpdateManager();
          break;
        case "Delete an employee":
          promptForDeleteAnEmployee();
          break;
        case "Delete a department":
          promptForDeleteDepartment();
          break;
        case "Delete a role":
          promptForDeleteRole();
          break;
        case "View the total utilized buget of a department":
          promptForBudgetUtilization();
          break;
        case "View employees by Manager":
          promptForViewAllEmpsByManagers();
          break;
        case "View employees by Department":
          promptForViewAllEmpByDepartments();
          break;
        case "Quit":
          console.log(
            logo({
              name: "Exiting from Employee Database",
              logoColor: "green",
              borderColor: "yellow",
            }).render()
          );
          query.quit(connection);
          break;
        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};

//prompts for different actions

// add an employee
const promptForAddEmployee = () => {
  var deptName;
  var roleID;
  var firstName;
  var lastName;
  query.viewRoles(connection).then((rolesInfo) => {
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
              console.log("");
              console.log(res);
              console.log("");
              startApp();
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          query
            .viewManagersWithDepartmantandRoles(connection)
            .then((managerInfo) => {
              var managerArray = managerInfo.filter(
                (item) => item.department === deptName
              );
              var managersNameForSelection = managerArray.map(
                (item) => item.first_name + " " + item.last_name
              );

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
                      console.log("");
                      console.log(res);
                      console.log("");
                      startApp();
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                });
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
};

// budget cal
const promptForBudgetUtilization = () => {
  query
    .viewDepartment(connection)
    .then((answer) => {
      let deptChoices = answer.map((row) => row.dept_name);
      inquirer
        .prompt([
          {
            type: "list",
            name: "dept",
            message: "Which Department Budget do you want to calculate?",
            choices: deptChoices,
          },
        ])
        .then((emp) => {
          query
            .viewEmployees(connection)
            .then((empInfo) => {
              var budget = 0;
              empInfo.forEach((element) => {
                if (element.department === emp.dept) {
                  budget = budget + element.salary;
                }
              });
              console.log("");
              console.log(
                emp.dept + " Department budget uitization is " + " $" + budget
              );
              console.log("");
              startApp();
            })
            .catch((err) => {
              console.log(err);
            });
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

//update emp role
const promptForUpdateEmployeeRole = () => {
  // generate employee and role choices dynamically from db
  query.viewEmployees(connection).then((answer) => {
    console.log("");
    console.table(
      "Please see the Roles Employee is currently in and make choice appropriately",
      answer
    );
    console.log("");
    query.viewEmployeesNames(connection).then((employeeChoices) => {
      query.viewRoleNames(connection).then((roleInfo) => {
        let roleChoices = roleInfo.map((row) => row.title);
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
                console.log("");
                console.log(answer);
                console.log("");
                startApp();
              })
              .catch((err) => {
                console.log(err);
              });
          });
      });
    });
  });
};

//Del Emp
const promptForDeleteAnEmployee = () => {
  query.viewEmployeesNames(connection).then((allEmps) => {
    inquirer
      .prompt([
        {
          type: "list",
          name: "deleteEmp",
          message: "Please select an employee to be deleted",
          choices: allEmps,
        },
      ])
      .then((empObj) => {
        query
          .allManagerNames(connection)
          .then((managersName) => {
            const managersNameArray = managersName.map((item) => item.fullName);
            isManagerTrue = managersNameArray.includes(empObj.deleteEmp);
            if (isManagerTrue) {
              console.log("");
              console.log("Cannt Delete as selected Emp is a Manager ");
              console.log("");
              startApp();
            } else {
              query
                .viewEmployeesNamesAndId(connection)
                .then((EmpNamesWithId) => {
                  var index;
                  for (var i = 0; i < EmpNamesWithId.length; i++) {
                    if (EmpNamesWithId[i].fullName === empObj.deleteEmp) {
                      index = EmpNamesWithId[i].id;
                    }
                  }
                  query
                    .deleteAnEmployee(connection, index)
                    .then((answer) => {
                      console.log("");
                      console.log(answer);
                      console.log("");
                      startApp();
                    })
                    .catch((err) => {
                      console.log(err);
                    });
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
  });
};

//update manager
const promptForUpdateManager = () => {
  query
    .viewEmployeesNamesAndId(connection)
    .then((empsInfo) => {
      const empChoices = empsInfo.map((item) => item.fullName);
      inquirer
        .prompt([
          {
            type: "list",
            name: "emps",
            message:
              "Please select an employee who's managers needs to be updated",
            choices: empChoices,
          },
        ])
        .then((answer) => {
          const empSelected = answer.emps;
          query
            .allManagerNames(connection)
            .then((managerNamesId) => {
              const managerChoices = managerNamesId.map(
                (item) => item.fullName
              );
              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "name",
                    message: "Please select a Manager for an employee",
                    choices: managerChoices,
                  },
                ])
                .then((managerSelected) => {
                  const managerIndex = managerNamesId.findIndex(
                    (element) => element.fullName === managerSelected.name
                  );
                  const managerId = managerNamesId[managerIndex].id;
                  query
                    .updateManagersName(connection, managerId, empSelected)
                    .then((answer) => {
                      console.log("");
                      console.log(answer);
                      console.log("");
                      startApp();
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                });
            })
            .catch((err) => {
              console.log(err);
            });
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

// delete role
const promptForDeleteRole = () => {
  query
    .viewRoleNames(connection)
    .then((roleInfo) => {
      const roleChoices = roleInfo.map((row) => row.title);
      inquirer
        .prompt([
          {
            type: "list",
            name: "role",
            message: "Please select a role to be deleted",
            choices: roleChoices,
          },
        ])
        .then((selectedRole) => {
          var selectedRoleId;
          for (var i = 0; i < roleInfo.length; i++) {
            if (roleInfo[i].title === selectedRole.role) {
              selectedRoleId = roleInfo[i].id;
            }
          }

          query
            .empsWithRoleId(connection, selectedRoleId)
            .then((employeesWithRole) => {
              if (employeesWithRole.length > 0) {
                console.log("");
                console.log(
                  "Cannot Delete a Role as employees are associated with it"
                );
                console.log("");
                startApp();
              } else {
                query
                  .deleteRole(connection, selectedRoleId)
                  .then((res) => {
                    console.log("");
                    console.log(res);
                    console.log("");
                    startApp();
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
    })
    .catch((err) => {
      console.log(err);
    });
};

//delete dep
const promptForDeleteDepartment = () => {
  query
    .viewDepartment(connection)
    .then((res) => {
      const deptChoices = res.map((item) => item.dept_name);
      inquirer
        .prompt([
          {
            type: "list",
            name: "dept",
            message: "Please select a department to be deleted",
            choices: deptChoices,
          },
        ])
        .then((selectedDept) => {
          var dept_id;
          for (var i = 0; i < res.length; i++) {
            if (res[i].dept_name === selectedDept.dept) {
              dept_id = res[i].id;
            }
          }

          query
            .rolesWithDeptId(connection, dept_id)
            .then((rolesWithDept) => {
              if (rolesWithDept.length > 0) {
                console.log("");
                console.log(
                  "Cannot delete Department as roles are associated with it "
                );
                console.log("");
                startApp();
              } else {
                query
                  .deleteDepartment(connection, dept_id)
                  .then((res) => {
                    console.log("");
                    console.log(res);
                    console.log("");
                    startApp();
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
    })
    .catch((err) => {
      console.log(err);
    });
};

// view dept
const promptForViewDepartments = () => {
  query
    .viewDepartment(connection)
    .then((rows) => {
      console.log("\n");
      console.table("Departments", rows);
      startApp();
    })
    .catch((err) => {
      console.log(err);
    });
};

//view role
const promptForViewRoles = () => {
  query
    .viewRoles(connection)
    .then((rows) => {
      console.log("\n");
      console.table("Roles", rows);
      startApp();
    })
    .catch((err) => {
      console.log(err);
    });
};

//view emp
const promptForViewEmployees = () => {
  query
    .viewEmployees(connection)
    .then((rows) => {
      console.log("");
      console.table("Employees", rows);
      startApp();
    })
    .catch((err) => {
      console.log(err);
    });
};

//add dept
const promptForAddDepartment = () => {
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
          console.log("");
          console.log(answer);
          console.log("");
          startApp();
        })
        .catch((err) => {
          console.log(err);
        });
    });
};

// Add role
const promptForAddRole = () => {
  //collect all departments from db
  query.viewDepartment(connection).then((Alldepts) => {
    let deptChoices = Alldepts.map((row) => row.dept_name);
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
          message: "Please enter salary for current role you want to add.",
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
          choices: deptChoices,
        },
      ])
      .then((ans) => {
        query
          .addRole(ans.roleTitle, ans.salary, ans.chooseDept, connection)
          .then((answer) => {
            console.log("");
            console.log(answer);
            console.log("");
            startApp();
          })
          .catch((err) => {
            console.log(err);
          });
      });
  });
};

// view all emp by manager
const promptForViewAllEmpsByManagers = () => {
  query
    .viewAllEmployeesbyManager(connection)
    .then((answer) => {
      console.table("Employees With their Managers", answer);
      startApp();
    })
    .catch((err) => {
      console.log(err);
    });
};

// view all emp by dept
const promptForViewAllEmpByDepartments = () => {
  query
    .viewAllEmployeesbyDepartment(connection)
    .then((answer) => {
      console.table("All Employees with Departments", answer);
      startApp();
    })
    .catch((err) => {
      console.log(err);
    });
};
