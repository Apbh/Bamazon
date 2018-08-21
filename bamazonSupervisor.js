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
    console.log("");
    console.log("****** Product Sales by Department ******");
    console.log("");
    var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) AS product_sales, (SUM(products.product_sales)-departments.over_head_costs) AS total_profits FROM products LEFT JOIN departments ON products.department_name = departments.department_name GROUP BY products.department_name";
    connection.query(query, function(err,res){
        if (err) {console.log (err)} else{
        for (var i = 0; i < res.length; i++){
            // console.log(res);
            console.table([
                {
                    Department_ID:res[i].department_id,
                    Department_name:res[i].department_name,
                    Costs:res[i].over_head_costs,
                    Product_sales:res[i].product_sales,
                    Total_Profits: res[i].total_profits 
                }
            ]);
        }
    }
    connection.end();
    })
}

function createNewDepartment(){
    inquirer.prompt([
        {
            type:"input",
            name:"dname",
            message: "Please input the name of the new department:"
        },
        {
            type:"input",
            name:"costs",
            message:"Please input the overhead costs for the new department:"
        },
        {
            type:"input",
            name:"productSales",
            message:"Please input a 0 for product sales of new department:"
        }
    ]).then(function(answer){
        connection.query("INSERT into departments SET ?", {
         department_name:answer.dname,
         over_head_costs:answer.costs,
         product_sales:answer.productSales   
    }, function (err, res){
        console.log("\r\nNew Department Added!");
        connection.end();
    })
})
}

