DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
 id INT NOT NULL AUTO_INCREMENT,
 product_name VARCHAR(100) NOT NULL,
 department_name VARCHAR (40) NOT NULL,
 price DECIMAL(10,4) NOT NULL,
 stock_quantity INTEGER (11) NOT NULL,
 product_sales DECIMAL(10,4) NOT NULL,
 PRIMARY KEY (id)
);

INSERT INTO products(product_name,department_name,price,stock_quantity, product_sales)
VALUES ("Cosrx Toner", "Health & Beauty", 19.00, 50, 0);

INSERT INTO products(product_name,department_name,price,stock_quantity, product_sales)
VALUES ("Sci-Fi Novel", "Books", 15.95, 100, 0);

INSERT INTO products(product_name,department_name,price,stock_quantity, product_sales)
VALUES ("Jenga", "Toys & Games", 17.99, 20, 0);

INSERT INTO products(product_name,department_name,price,stock_quantity, product_sales)
VALUES ("Shirt Dress", "Clothing", 47.50, 25, 0);

INSERT INTO products(product_name,department_name,price,stock_quantity, product_sales)
VALUES ("Navy Shorts", "Clothing", 29.99, 15, 0);

INSERT INTO products(product_name,department_name,price,stock_quantity, product_sales)
VALUES ("No-Noise Headphones", "Electronics", 39.99, 15, 0);

INSERT INTO products(product_name,department_name,price,stock_quantity, product_sales)
VALUES ("Chocolate Bars", "Food", 9.99, 39, 0);

INSERT INTO products(product_name,department_name,price,stock_quantity, product_sales)
VALUES ("Ginger Candy", "Food", 11.64, 29, 0);

INSERT INTO products(product_name,department_name,price,stock_quantity, product_sales)
VALUES ("Navy Blue Earrings", "Jewelry", 12.99, 6, 0);

INSERT INTO products(product_name,department_name,price,stock_quantity, product_sales)
VALUES ("Shampoo", "Health & Beauty", 8.99, 3, 0);

CREATE TABLE departments (
department_id INT NOT NULL AUTO_INCREMENT,
department_name VARCHAR(100) NOT NULL,
over_head_costs INTEGER(11) NOT NULL,
product_sales DECIMAL(10,4) NOT NULL,
PRIMARY KEY(department_id)
);

INSERT INTO departments(department_name, over_head_costs, product_sales)
VALUES ("Health and Beauty", 400, 0);

INSERT INTO departments(department_name, over_head_costs, product_sales)
VALUES ("Books", 400, 0);

INSERT INTO departments(department_name, over_head_costs, product_sales)
VALUES ("Toys & Games", 400, 0);

INSERT INTO departments(department_name, over_head_costs, product_sales)
VALUES ("Clothing", 400, 0);

INSERT INTO departments(department_name, over_head_costs, product_sales)
VALUES ("Electronics", 400, 0);

INSERT INTO departments(department_name, over_head_costs, product_sales)
VALUES ("Food", 400, 0);

INSERT INTO departments(department_name, over_head_costs, product_sales)
VALUES ("Jewelry", 400, 0);

SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) AS product_sales, (SUM(products.product_sales)-departments.over_head_costs) AS total_profits
 FROM products LEFT JOIN departments ON products.department_name = departments.department_name GROUP BY products.department_name;


SELECT * FROM bamazon_db.products;

SELECT * FROM bamazon_db.departments;

