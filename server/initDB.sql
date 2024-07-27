
CREATE DATABASE IF NOT EXISTS lepassage;
CREATE USER IF NOT EXISTS 'lepassage'@'localhost' IDENTIFIED BY 'admin';
GRANT ALL PRIVILEGES ON lepassage.* TO 'lepassage'@'localhost';
FLUSH PRIVILEGES;
