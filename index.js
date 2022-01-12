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
        choices: ["View Employees", "View Departments", "View Employees By Department", "View Roles", "Add Department", "Add Employee", "Remove Employee", "Update Employee", "Add Role", "End"]
    }]).then(({task}) => {
        console.log(task);
        console.log('======================');
        //if task selected is view employees, run view employees query function, run through the array of choices, and apply each function
        if(task === "View Employees"){
            viewEmp();
        } else if(task === "View Departments") {
            viewDept();
        }
        
        else if (task === "View Employees By Department") {
            viewByDept();
        } else if (task === "View Roles") {
            viewRoles();
        } else if (task === "Add Department") {
            addDept();
        } else if (task === "Add Employee") {
            addEmp();
        } else if (task === "Remove Employee") {
            remEmp();
        } else if (task === "Update Employee") {
            updateEmp();
        } else if (task === "Add Role") {
            addRole();
        } else if (task === "End") {
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

//function to view by department, first they must make an inquirer to pick from the list
function viewByDept() {
    inquirer.prompt([{
        type: "list",
        name: "departmentChoice",
        message: "What Department to you want to view?",
        choices: ["Engineering", "Research and Development", "Accounts Payable"]
    }]).then(({departmentChoice}) => {
        const sql = `SELECT employees.first_name,employees.last_name, roles.title, departments.name AS department
                    FROM employees
                    JOIN roles ON employees.role_id = roles.id
                    JOIN departments ON departments.id = roles.department_id
                    WHERE departments.name = ?`;
        //run the query, display the table, then take them back to the main prompt
        db.query(sql, departmentChoice,(err,res) => {
            if (err) throw err;
            console.table(res);
            mainPrompt();
        })
        
    })
}

//function to view roles
function viewRoles(){
    const sql = `SELECT title, salary FROM roles`;
    db.query(sql,(err,res) => {
        if (err) throw err;
        console.table(res);
        mainPrompt();
    })
}

//function to add a department
function addDept() {
    inquirer.prompt([{
        type: "input",
        name: "department_name",
        message: "what is the name of the department"
    },
    {
        type: "input",
        name: "department_id",
        message: "give your department a numerical value"
    }
    ]).then((answer) => {
        const sql = `INSERT INTO departments SET ?`;
        const query = `SELECT * FROM departments`;
        db.query(sql, {
            id: answer.department_id,
            name: answer.department_name
        },(err,res) => {
            if(err) throw err;
            console.log("you have created a new department, please see the list below");
            
        })

        db.query(query, (err,res) => {
            if(err) throw err;
            console.table(res);
            mainPrompt();
        })
    })
}

//function to add an employee
function addEmp() {
    inquirer.prompt([
        {
            type: "input",
            name: "first_name",
            message: "What is the first name?"
    },
    {
        type: "input",
        name: "last_name",
        message: "What is the last name?"
    },
    {
        type: "input",
        name: "role_id",
        message: "What is their role? 1= Jr. Engineer, 2= Sr. Engineer, 3= Jr. Scientist, 4= Sr. Scientist, 5= Jr. Accountant, 6= Sr. Accountant",
        choices: [1,2,3,4,5,6]
    }
]).then((answer) => {
    console.log(`creating your employee entry for ${answer.first_name} ${answer.last_name} with role id ${answer.role_id}`);
    const sql = `INSERT INTO employees SET ?`
    db.query(sql, {
        first_name: answer.first_name,
        last_name: answer.last_name,
        role_id: answer.role_id
    },(err,res) => {
        if (err) throw err;
        console.table(res);
        mainPrompt();
    });
});
}

//function to remove an employee based on ID
function remEmp() {
    const query = `SELECT * from employees`;
    db.query(query, (err,res) => {
        if (err) throw err;
        console.table(res);
        console.log("please enter an empoloyee ID number you want to remove below:")
    })

    inquirer.prompt([{
        type: "input",
        name: "roleID",
        message: "Enter the ID number for the employee you want to remove"
    }]).then((response) => {
        const sql = `DELETE FROM employees WHERE id = ?`
        db.query(sql, response.roleID, (err,res) => {
            if (err) throw err;
            console.table(res);
            console.log("Employee Removed!");
            mainPrompt();
        })
    })
}
//function to update an employee based on ID
function updateEmp() {
    const query = `SELECT * from employees`;
    db.query(query, (err,res) => {
        if (err) throw err;
        console.table(res);
        console.log("please enter an empoloyee ID number you want to update below, and answer the prompts:")
    })

    inquirer.prompt([{
        type: "input",
        name: "employeeID",
        message: "Enter the ID for the employee to update"
    },
{
    type: "input",
    name: "role_id",
    message: "What is their role? 1= Jr. Engineer, 2= Sr. Engineer, 3= Jr. Scientist, 4= Sr. Scientist, 5= Jr. Accountant, 6= Sr. Accountant",
    choices: [1,2,3,4,5,6]
}]).then((answer) => {
    const sql = `UPDATE employees SET role_id = ${answer.role_id} WHERE id = ${answer.employeeID}`;
    db.query(sql,(err,res) => {
        if (err) throw err;
        console.table(res);
        mainPrompt();
    })
        

    })

}


//function to add role
function addRole() {
    inquirer.prompt([{
        type: "input",
        name: "role_id",
        message: "give this role a numeric value"
    },
    {
        type: "input",
        name: "role_title",
        message: "What is the name of this role"
    },
    {
        type: "input",
        name: "role_salary",
        message: "What is the salary?"
    },
    {
        type: "input",
        name: "department_id",
        message: "What is the department ID?"
    }

    ]).then((answer) => {
        const sql = `INSERT INTO roles SET ?`;
        const query = `SELECT * FROM roles`;
        db.query(sql, {
            id: answer.role_id,
            title: answer.role_title,
            salary: answer.role_salary,
            department_id: answer.department_id
        },(err,res) => {
            if(err) throw err;
            console.log("you have created a new role, please see the list below");
            
        })

        db.query(query, (err,res) => {
            if(err) throw err;
            console.table(res);
            mainPrompt();
        })
    })
}

//function to view departments
function viewDept() {
    const sql = `SELECT * FROM departments`;
    db.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        mainPrompt();
    })
}



