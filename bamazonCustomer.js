var mysql = require("mysql");
var inquirer = require("inquirer");


var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    // username
    user: "root",

    // password
    password: "",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    showItems();
});

function showItems() {
    console.log("Welcome to Bamazon! Your one stop destination for shopping.");
    console.log("");
    inquirer.prompt({
        type: "confirm",
        name: "seeSale",
        message: "Would you like to see the items for sale?"
    }).then(function (answer) {
        if (answer.seeSale) {
            var query = "SELECT * FROM products";
            connection.query(query, function (err, res) {
                console.log("");
                for (var i = 0; i < res.length; i++) {
                    console.log("Product ID: " + res[i].id + "|| Product Name: " + res[i].product_name + "|| Product Price (in $): " + res[i].price);
                }

                placeOrder();
            })

        } else {
            console.log("Thank You. Please shop again!");
            connection.end();
        }
    })
}

function placeOrder() {
    console.log("");
    inquirer.prompt([
        {
            name: "id",
            type: "input",
            message: "Please input the ID of the product you wish to purchase:",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }

        },
        {
            name: "quantity",
            type: "input",
            message: "Please indicate the quantity of products you wish to purchase:",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }


    ]).then(function (answer) {
        var query = "SELECT * FROM products WHERE ?";
        connection.query(query, { id: answer.id }, function (err, res) {

            for (var i = 0; i < res.length; i++) {
                
                var product = res[i].product_name;

                if (res[i].stock_quantity == 0 || res[i].stock_quantity < answer.quantity) {
                    
                    console.log("\r\nInsufficient Quantity! Please check back later.")
                    connection.end();

                } else {
                    var totalPrice = res[i].price * answer.quantity;
                    var newQuantity = res[i].stock_quantity - answer.quantity;
                    var productSales = res[i].price * answer.quantity;
                    
                    var query = "UPDATE products SET ? WHERE ?";
                    connection.query(query, [{ stock_quantity: newQuantity },{ id: answer.id }], function (err, res) {
                        console.log("\r\nHere are the details of your order:");
                        console.log("Product ID: " + answer.id + "|| Product Name: " + product + " || Total Price in $: " + totalPrice);
                        // confirmSale();
                        
                    })
                    var query = "UPDATE products SET ? WHERE ?";
                    connection.query(query,[{product_sales: productSales}, {id: answer.id}], function(err,res){
                     connection.end();
                        
                    })


                }

            }
        })
    })
}
