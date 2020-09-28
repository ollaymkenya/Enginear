const pool = require("../utils/db");
const { v4: uuidv4 } = require('uuid');

class CarType {
    constructor(name) {
        this.id = uuidv4();
        this.name = name;
    }

    async save() {
        const carType = await pool.query("insert INTO type_of_car(type_of_car_uid, type_of_car_name)VALUES($1, $2) RETURNING *", [this.id, this.name])
        return carType;
    }

    static async getCarTypes(){
        const carTypes = await pool.query("SELECT * FROM type_of_car");
        return carTypes.rows;
    }

    static async getCarType(id) {
        const carType = await pool.query("SELECT * FROM type_of_car WHERE type_of_car_uid = $1", [id]);
        return carType;
    }
}

module.exports = CarType;