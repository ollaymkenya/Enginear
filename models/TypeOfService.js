const pool = require("../utils/db");
const { v4: uuidv4 } = require('uuid');

class TypeOfService {
    constructor(name) {
        this.id = uuidv4();
        this.name = name;
    }

    async save() {
        const typeOfService = await pool.query("INSERT INTO type_of_service (type_of_service_uid, name) VALUES($1, $2) RETURNING *", [this.id, this.name]);
        return typeOfService.rows[0];
    }

    static async getAll(){
        const typeOfServices = await pool.query("SELECT * FROM type_of_service");
        return typeOfServices.rows;
    }
}

module.exports = TypeOfService;