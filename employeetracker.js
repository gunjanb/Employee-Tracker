const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: "",
  // Be sure to update with your own MySQL password!
  password: "",
  database: "",
});

connection.connect((err) => {
  if (err) throw err;
  runSearch();
});

const runSearch = () => {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: ["", "", "", "", ""],
    })
    .then((answer) => {
      switch (answer.action) {
        case "":
          break;

        case "":
          break;

        case "":
          break;

        case "":
          break;

        case "":
          break;

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};
