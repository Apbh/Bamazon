var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require('console.table');


var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    //afterconnection only runs after workbench has been connection, important to run it within callback func
    displayOptions();
});

function displayOptions(){
    console.log("\r\nBamazon welcomes the Supervisor!")
    console.log("");
    inquirer.prompt({
        type:"list",
        name:"menu",
        message:"Please select an option below:",
        choices: [
            "View Product Sales by Department",
            "Create New Department"
        ]
    }).then(function(answer){
        switch (answer.menu){
            case "View Product Sales by Department":
            viewProductSales();
            break;

            case  "Create New Department":
            createNewDepartment();
            break;
        }

    })
}

function viewProductSales(){
    console.log("****** Product Sales by Department ******");
    console.log("");
    var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales";
    query+= "FROM products LEFT JOIN departments ON products.department_name = departments.department_id";
    query+= "GROUP BY products.department_name";
    connection.query(query, function(res,err){
        for (var i = 0; i < res.length; i++){
            console.log(res);
            // console.log([
            //     {
            //         Department_ID:res[i].id,
            //         Department_name:res[i].department_name,
            //         Costs:res[i].over_head_costs,
            //         Product_sales:res[i].product_sales
            //     }
            // ]);
        }
    })
}

