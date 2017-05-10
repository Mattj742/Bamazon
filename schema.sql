CREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE products (
item_id INT AUTO_INCREMENT NOT NULL,
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR(100) NOT NULL,
price DECIMAL(5,2) NOT NULL,
stock_quantity INT(4) NOT NULL,
PRIMARY KEY (item_id)
);

SELECT * FROM products;