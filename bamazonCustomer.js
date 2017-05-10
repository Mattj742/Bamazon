var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');
var credentials = require('./mysql.js');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "root",

    password: credentials,
    database: "Bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    inventory();
});

var productIdArray = [];
var inventoryArray = [];

function inventory() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        var table = new Table({
            head: ['Product ID', 'Product Name', 'Price'],
            colWidths: [15, 50, 15]
        });
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, "$" + res[i].price]);
            productIdArray.push(res[i].item_id);
            inventoryArray.push(res[i]);
        }
        console.log(table.toString());
        shop();
    });
}

function shop() {
	connection.query("SELECT * FROM products", function(err, res) {
    inquirer.prompt([{
        name: "product",
        type: "message",
        message: "What is the ID of the product you would like to buy?",
        validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
        }
    }, {
        name: "quantity",
        type: "message",
        message: "How many units would you like to buy?",
        validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
        }
    }]).then(function(answer) {
            connection.query("SELECT * FROM products WHERE item_id=?", [answer.product], function(err, res) {
                    // get the information of the chosen item
                    var chosenItem;
                  	for (var i = 0; i < res.length; i++) {
                    	if (parseInt(answer.product) === res[i].item_id) {
                    		chosenItem = res[i];
                    	}
                    }
                    if (parseInt(answer.quantity) > chosenItem.stock_quantity) {
                        console.log("Insufficient quantity");
                        shop();
                    } else {
                        var customerPrice = chosenItem.price * answer.quantity;
                        var remaining_stock = chosenItem.stock_quantity - answer.quantity;

                        connection.query("UPDATE products SET ? WHERE ?", [{
                            stock_quantity: remaining_stock
                        }, {
                            item_id: answer.product
                        }], function(error) {
                            if (error) throw err; 
                            console.log("Your total purchase: $" + customerPrice + ". Please come back soon!");
                            connection.end()                           
                        });

                }
            })
    });
});
}
