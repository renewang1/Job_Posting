const dbName = process.env.NODE_ENV === 'test' ? process.env.DB_TEST_NAME : process.env.DB_NAME

const dbParams = { 
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: dbName
};

module.exports = dbParams;