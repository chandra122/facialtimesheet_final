DROP DATABASE IF EXISTS facialtimesheet_db;
CREATE DATABASE facialtimesheet_db;
USE facialtimesheet_db;

CREATE TABLE employee (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE timesheet (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    check_in DATETIME NOT NULL,
    check_out DATETIME,
    mood VARCHAR(50),
    entry_status VARCHAR(20),
    FOREIGN KEY (employee_id) REFERENCES employee(id)
); 