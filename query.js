const connection = require("connection.js");

class Query {
  //METHODS
  viewdepartment() {
    connection.query(`SELECT * FROM department`, (err, res) => {
      if (err) throw err;

      //   if (res.length > 0) {
      return res;
      //   }else
    });
  }

  quit() {
    connection.end();
  }
}

module.exports = Query;
