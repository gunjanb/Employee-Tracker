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
          //provide user all emp names AND IDselect emp whos managers need to be chnaged \
          //provie manager names
          //get emp id ffrom all emps info on step 1 to get manager is
          //update manager_id where emp first name and last name = empmangtobechANGED
          promptForUpdateManager();

          break;

        case "Delete an employee":
          //provide list of all emp
          //get emp  for deletion
          //check if not manager if manager dont delete
          //delete
          promptForDeleteAnEmployee();
          break;

        case "Delete a department":
          //delete a dept if not associated with any role
          //all depts names with id in
          //ask which department to remove
          //find roles with that dep name
          //if no roles are attached then del the dep
          promptForDeleteDepartment();
          break;

        case "Delete a role":
          //delete a role if not associated with any emp
          //provide all roles (id)for
          //get role needs to be deleted and find role_id for role
          //get all employess name where role_id is same
          //if we getback an emp with same role_id which need to be deted then cant delete a role
          promptForDeleteRole();
          break;

        case "View the total utilized buget of a department":
          promptForBudgetUtilization();
          break;

        case "View employees by Manager":
          query
            .viewAllEmployeesbyManager(connection)
            .then((answer) => {
              console.table(answer);
              startApp();
            })
            .catch((err) => {
              console.log(err);
            });
          break;

        case "View employees by Department":
          query
            .viewAllEmployeesbyDepartment(connection)
            .then((answer) => {
              console.table(answer);
              startApp();
            })
            .catch((err) => {
              console.log(err);
            });
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

//provide list of all emp
//get emp  for deletion
//check if not manager if manager dont delete
//delete
// var index;
function promptForDeleteAnEmployee() {
  query.viewEmployeesNames(connection).then((allEmps) => {
    // let managersNameArray = allEmps.map(
    //   (item) => item.first_name + " " + item.last_name
    // );
    console.log("allemps from index.js", allEmps);
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
            //console.log(answer);
            //startApp();
            console.log(
              "all managesr name from index after query",
              managersName
            );
            const managersNameArray = managersName.map((item) => item.fullName);
            console.log("manager array from index", managersNameArray);
            isManagerTrue = managersNameArray.includes(empObj.deleteEmp);
            if (isManagerTrue) {
              console.log("Cannt Delete as selected Emp is a Manager ");
              startApp();
            } else {
              console.log("all emp is available after 1st query", allEmps);
              console.log(empObj.deleteEmp);
              query
                .viewEmployeesNamesAndId(connection)
                .then((EmpNamesWithId) => {
                  console.log(EmpNamesWithId);
                  // const EmpObjToBeDeleted = EmpNamesWithId.filter((item) => {
                  //   item.fullName == empObj.deleteEmp;
                  // });
                  // const index = EmpNamesWithId.findIndex(
                  //   (item) => item.fullName === empObj.deleteEmp
                  // );
                  var index;
                  for (var i = 0; i < EmpNamesWithId.length; i++) {
                    if (EmpNamesWithId[i].fullName === empObj.deleteEmp) {
                      index = EmpNamesWithId[i].id;
                    }
                  }
                  console.log(index);
                  query
                    .deleteAnEmployee(connection, index)
                    .then((answer) => {
                      console.log(answer);
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
}

//provide user all emp names AND IDselect emp whos managers need to be chnaged \
//provie manager names
//get emp id from all emps info on step 1 to get manager is
//update manager_id where emp first name and last name = empmangtobechANGED
function promptForUpdateManager() {
  query
    .viewEmployeesNamesAndId(connection)
    .then((empsInfo) => {
      const empChoices = empsInfo.map((item) => item.fullName);
      console.log(empsInfo);
      console.log(empChoices);

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
          console.log(answer.emps);
          const empSelected = answer.emps;
          query
            .allManagerNames(connection)
            .then((managerNamesId) => {
              // console.log(answer);
              // startApp();
              const managerChoices = managerNamesId.map(
                (item) => item.fullName
              );
              console.log("managerchoices", managerChoices);
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
                  console.log(managerSelected.name);
                  const managerIndex = managerNamesId.findIndex(
                    (element) => element.fullName === managerSelected.name
                  );
                  console.log(managerIndex);
                  const managerId = managerNamesId[managerIndex].id;
                  console.log(managerId);
                  console.log(empSelected);
                  query
                    .updateManagersName(connection, managerId, empSelected)
                    .then((answer) => {
                      console.log(answer);
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
}

//delete a role if not associated with any emp
//provide all roles (id)for
//get role needs to be deleted and find role_id for role
//get all employess name where role_id is same
//if we getback an emp with same role_id which need to be deted then cant delete a role
function promptForDeleteRole() {
  query
    .viewRoleNames(connection)
    .then((roleInfo) => {
      console.log(roleInfo);
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
          console.log(selectedRole.role);
          console.log(roleInfo);
          // const selectedRoleIndex = roleInfo.findIndex((element) => {
          //   element.title == selectedRole.role;
          // });
          var selectedRoleId;
          for (var i = 0; i < roleInfo.length; i++) {
            if (roleInfo[i].title === selectedRole.role) {
              selectedRoleId = roleInfo[i].id;
            }
          }
          // console.log(selectedRoleIndex);
          // const selectedRoleId = roleInfo[selectedRoleIndex].id;
          console.log(selectedRoleId);

          query
            .empsWithRoleId(connection, selectedRoleId)
            .then((employeesWithRole) => {
              console.log(employeesWithRole.length);
              if (employeesWithRole.length > 0) {
                console.log(
                  "Cannot Delete a Role as employees are associated with it"
                );
              } else {
                query
                  .deleteRole(connection, selectedRoleId)
                  .then((res) => {
                    console.log(res);
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
}

//delete a dept if not associated with any role
//all depts names with id in
//ask which department to remove
//find roles with that dep name
//if no roles are attached then del the dep
function promptForDeleteDepartment() {
  query
    .viewDepartment(connection)
    .then((res) => {
      console.log(res);
      const deptChoices = res.map((item) => item.dept_name);
      console.log(deptChoices);
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
          console.log(selectedDept.dept);
          // var deptIndex = res.findIndex((element) => {
          //   element.dept_name == selectedDept.dept;
          // });
          // const dept_id = res[deptIndex].id;
          // console.log(dept_id);
          var dept_id;
          for (var i = 0; i < res.length; i++) {
            if (res[i].dept_name === selectedDept.dept) {
              dept_id = res[i].id;
            }
          }

          console.log(dept_id);

          query
            .rolesWithDeptId(connection, dept_id)
            .then((rolesWithDept) => {
              console.log(rolesWithDept.length);
              if (rolesWithDept.length > 0) {
                console.log(
                  "Cannot delete Department as roles are associated with it "
                );
              } else {
                query
                  .deleteDepartment(connection, dept_id)
                  .then((res) => {
                    console.log(res);
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
}
const promptForViewDepartments = () => {
  query
    .viewDepartment(connection)
    .then((rows) => {
      //console.log(rows);
      console.table("Departments", rows);
      startApp();
    })
    .catch((err) => {
      console.log(err);
    });
};

const promptForViewRoles = () => {
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
};

const promptForViewEmployees = () => {
  query
    .viewEmployees(connection)
    .then((rows) => {
      console.table("Employees", rows);
      startApp();
    })
    .catch((err) => {
      console.log(err);
    });
};

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
          console.log(answer);
          startApp();
        })
        .catch((err) => {
          console.log(err);
        });
    });
};

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
            console.log(answer);
            startApp();
          })
          .catch((err) => {
            console.log(err);
          });
      });
  });
};
