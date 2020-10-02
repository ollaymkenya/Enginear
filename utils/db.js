const Pool = require('pg').Pool;

const pool = new Pool({
    user: "uhzqnzjxlgangt",
    password: "olimkenya",
    host: "ec2-18-211-86-133.compute-1.amazonaws.com",
    port: 5432,
    database: "decupenudj2sae",
    password: "c3ccb89f8cfb97855f837dfd1a3949efd391c775fab8b9c8088d39e12de8409e",
    URI: "postgres://uhzqnzjxlgangt:c3ccb89f8cfb97855f837dfd1a3949efd391c775fab8b9c8088d39e12de8409e@ec2-18-211-86-133.compute-1.amazonaws.com:5432/decupenudj2sae"
})

module.exports = pool;