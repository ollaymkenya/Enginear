const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    password: "olimkenya",
    host: "localhost",
    port: 5432,
    database: "enginear"
})

module.exports = pool;