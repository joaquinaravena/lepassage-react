import os
from dotenv import load_dotenv

# Carga las variables del archivo .env
load_dotenv()

# Lee las variables del entorno
db_name = os.getenv('DB_NAME')
db_user = os.getenv('DB_USER')
db_password = os.getenv('DB_PASSWORD')

# Genera el contenido del script SQL
sql_content = f"""
CREATE DATABASE IF NOT EXISTS {db_name};
CREATE USER IF NOT EXISTS '{db_user}'@'localhost' IDENTIFIED BY '{db_password}';
GRANT ALL PRIVILEGES ON {db_name}.* TO '{db_user}'@'localhost';
FLUSH PRIVILEGES;
"""

# Escribe el contenido en un archivo initDB.sql
with open('initDB.sql', 'w') as file:
    file.write(sql_content)

print("initDB.sql has been generated.")
