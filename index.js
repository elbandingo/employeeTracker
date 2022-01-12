//create the require requests for mysql2, and inquirer
const mysql = require("mysql2");
const inquirer = require("inquirer");

//connect to the DB, let user know they are connected
const db = mysql.createConnection({
    host: 'localhost',
    user: 'adam',
    password: 'abc123',
    database: 'employees'
},
    console.log('Connected to the employees database')
);


//create the connection, and start main list function
db.connect((error) => {
    if(error) throw error;
    //run the main prompt and advise user the connection was successful
    console.log("You have connected to the database");
    mainPrompt();
})

//main menu inquirer function
function mainPrompt() {
    inquirer.prompt([
        {
        type: "list",
        name: "task",
        message: "Please make a selection",
        choices: ["View Employees", "View Employees By Department", "Add Employee", "Remove Employee", "Update Employee", "Add Role", "End"]
    }]).then(({task}) => {
        console.log(task);
        console.log('======================');
        //if task selected is view employees, run view employees query function, run through the array of choices, and apply each function
        if(task === "View Employees"){
            viewEmp();
        } else if (task === "View Employees By Department") {
            console.log("you chose view employees by department");
            //viewByDept();
        } else if (task === "Add Employee") {
            console.log("you chose add employee")
            //addEmp();
        } else if (task === "Remove Employee") {
            console.log("you chose remove employee")
            //remEmp();
        } else if (task === "Update Employee") {
            console.log("you chose update employee");
            //updateEmp();
        } else if (task === "Add Role") {
            console.log("you chose add role")
            //updateRole();
        } else if (task === "End") {
            console.log("You chose to end the program, goodbye");
            db.end();
        }
    })

}

//function for viewing all employees
function viewEmp() {
    const sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(m.first_name,' ',m.last_name) AS manager
    FROM employees
    LEFT JOIN roles ON employees.role_id = roles.id
    LEFT JOIN departments ON departments.id = roles.department_id
    LEFT JOIN employees m ON m.id = employees.manager_id`

    //query the DB for all employees
    db.query(sql, (err,res) => {
        if (err) throw err;
        console.table(res);
        //return to the main prompt again after showing table
        mainPrompt();
    })
}





