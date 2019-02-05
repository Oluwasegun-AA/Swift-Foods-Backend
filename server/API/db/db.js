
import bcrypt from 'bcryptjs';
import database from './Index';

/**
 * Create Tables
 */
async function createTables() {
  const dropTables = 'DROP TABLE IF EXISTS user_accounts, food_items, orders; DROP TYPE IF EXISTS user_role, status;';
  const enumAccount = "CREATE TYPE user_role AS ENUM ('User', 'Admin');";
  const enumRole = "CREATE TYPE status AS ENUM ('New' , 'Processing' , 'Cancelled', 'Complete');";
  const userAccounts = `CREATE TABLE IF NOT EXISTS user_accounts(
        user_id SERIAL PRIMARY KEY,
        user_name varchar(255) NOT NULL UNIQUE,
        user_role user_role DEFAULT 'User',
        user_email varchar(255) NOT NULL UNIQUE,
        user_password varchar(255) NOT NULL,
        created_date TIMESTAMP DEFAULT NOW(),
        modified_date varchar(255) DEFAULT NULL
      );`;
  const foodItems = `CREATE TABLE IF NOT EXISTS food_items(
        item_id SERIAL PRIMARY KEY,
        item_name varchar(255) NOT NULL UNIQUE,
        item_image varchar NOT NULL,
        item_price integer NOT NULL,
        item_tag varchar(255) NOT NULL,
        created_date TIMESTAMP DEFAULT NOW(),
        modified_date varchar(255) DEFAULT NULL
      );`;
  const orders = `CREATE TABLE IF NOT EXISTS orders(
        order_id SERIAL PRIMARY KEY,
        item_id integer NOT NULL,
        quantity integer NOT NULL,
        total_price integer NOT NULL,
        order_status status DEFAULT 'New',
        customer_address varchar NOT NULL,
        customer_id integer NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        modified_date varchar(255) DEFAULT NULL
      );`;
  const userData = `INSERT INTO user_accounts (user_name,user_role,user_email,user_password)
      VALUES ('testName', 'User', 'testEmail@address.com', '${bcrypt.hashSync('P@ssword', 10)}'),
      ('tester', 'Admin', 'tester@owner.com', '${bcrypt.hashSync('P@$$word123', 10)}'),
      ('segun', 'Admin', 'oluwasegun.adepoju@andela.com', '${bcrypt.hashSync('password', 10)}'),
      ('shegsteham', 'User', 'oluwasegun.adepoju@gmail.com', '${bcrypt.hashSync('password', 10)}'),
      ('tester', 'Admin', 'tester@owner.com', '${bcrypt.hashSync('P@$$word123', 10)}'),
      ('backEndTester', 'User', 'backendtester1@address.com', '${bcrypt.hashSync('backendtester123', 10)}');`;

  const orderData = `INSERT INTO orders (item_id, quantity, total_price, order_status,customer_id, customer_address)
      VALUES ('1', '2', '2000', 'New', '1', 'Andela EPIC Tower, Lagos' ),('2', '1','1000','Processing','2', 'Andela EPIC Tower, Ibadan' )`;

  const itemData = `INSERT INTO food_items (item_name,item_image,item_price,item_tag)
       VALUES ('Doughnut', 'https://via.placeholder.com/150', '2000', 'snacks'),
        ('Amala', 'https://via.placeholder.com/150', '5000', 'Local dish');`;

  const input = dropTables + enumAccount + enumRole + userAccounts + foodItems + orders;
  const create = userData + itemData + orderData;
  await database.query(input);
  await database.query(create);
}

module.exports = {
  createTables,
};

async function instantiateTables() {
  try {
    // create new tables
    await createTables();
    // eslint-disable-next-line no-console
    console.log('All Tables created successfully!');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}

instantiateTables();
