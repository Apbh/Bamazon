var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",


    port: 3306,

    //  username
    user: "root",

    // password
    password: "",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

    showMenu();
});

function showMenu() {
    console.log("");
    inquirer.prompt({
        type: "list",
        name: "action",
        message: "Please select an option from the menu below",
        choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product"
        ]
    }).then(function (answer) {
        switch (answer.action) {
            case "View Products for Sale":
                viewProducts();
                break;

            case "View Low Inventory":
                viewLowInventory();
                break;

            case "Add to Inventory":
                addToInventory();
                break;

            case "Add New Product":
                addProduct();
                break;
        }

    })
}

function viewProducts() {
    console.log("*******Products available for sale *******");
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        console.log("");
        for (var i = 0; i < res.length; i++) {
            console.log("Product ID: " + res[i].id + "|| Product Name: " + res[i].product_name + "|| Product Price (in $): " + res[i].price + "||Quantity: " + res[i].stock_quantity);
        }
        console.log("");
        continueSession();
    })
}

function viewLowInventory() {
    console.log("****** Low Inventory ******")
    var query = "SELECT * FROM products WHERE stock_quantity < 5";
    connection.query(query, function (err, res) {
        if (res.length === 0) {
            console.log("\r\nNo inventory shortages at this time.");
            showMenu();
        } else {
            console.log("");
            console.log("These products are running low in supply with quantities less than 5 units.")
            for (var i = 0; i < res.length; i++) {
                console.log("");
                console.log("Product ID: " + res[i].id + "|| Product Name: " + res[i].product_name + "|| Product Price (in $): " + res[i].price + "|| Quantity: " + res[i].stock_quantity);
            }
            console.log("");
            continueSession();
        }

    })
}

function addToInventory() {
    console.log("");
    console.log("****** Add to Inventory ******");
    console.log("");

    inquirer.prompt([
        {
            type: "input",
            name: "productId",
            message: "Please indicate the ID of the product you wish to add more of:",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }

        },
        {
            type: "input",
            name: "quantity",
            message: "Please indicate the quantity you wish to add:",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }

        }
    ]).then(function (answer) {
        connection.query('SELECT * FROM products WHERE id = ?', [answer.productId], function (err, res) {

            connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: res[0].stock_quantity + parseInt(answer.quantity) }, { id: answer.productId }], function (err, res) {
                if (err) throw err;
                console.log("\r\nProduct quantity updated!");
                continueSession();
            })

        })

    })
}

function addProduct() {
    console.log("\r\nPlease provide information for the product to be added:");
    console.log("");
    inquirer.prompt([
        {
            name: "productName",
            type: "input",
            message: "Please input the name of the new product:"
        },
        {
            name: "productDepartment",
            type: "input",
            message: "Please input product department:"
        },
        {
            name: "productPrice",
            type: "input",
            message: "Please input a price (in $) for the product:"
        },
        {
            name: "productQuantity",
            type: "input",
            message: "Please input a product quantity:"
        },
        {
            name: "productSales",
            type: "input",
            message: "Please input 0 for a new product:"
        }
    ]).then(function (answer) {
        connection.query("INSERT into products SET ?", {
            product_name: answer.productName,
            department_name: answer.productDepartment,
            price: answer.productPrice,
            stock_quantity: answer.productQuantity,
            product_sales: answer.productSales
        }, function (err, res) {
            console.log("\r\n****** New Product Added! ******");
            continueSession();
        })
    })
}

function continueSession() {
    console.log("");
    inquirer.prompt({
        name: "continue",
        type: "confirm",
        message: "Do you wish to continue your session?"
    }).then(function (answer) {
        if (answer.continue) {
            showMenu();
        } else {
            console.log("\r\nThank you.")
            connection.end();
        }
    })
}
