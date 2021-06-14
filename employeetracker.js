const inquirer = require("inquirer");
const Query = require("query.js");
const query = new Query();

const startApp = () => {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
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
    })
    .then((answer) => {
      switch (answer.action) {
        case "View all departments":
          let department = query.viewdepartment();
          console.log("\n");
          console.log(" ** Departments **");
          console.log("\n");
          console.table(department);
          break;

        case "View all roles":
          break;

        case "View all employees":
          break;

        case "Add a department":
          break;

        case "Add a role":
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
          query.quit();
          break;

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};

startApp();
