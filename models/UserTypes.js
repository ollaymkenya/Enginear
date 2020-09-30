const pool = require("../utils/db");
const { v4: uuidv4 } = require('uuid');

class UserTypes {
    constructor(userId, typeId) {
        this.id = uuidv4();
        this.userId = userId;
        this.typeId = typeId;
    }

    async save() {
        const userCarType = await pool.query("INSERT INTO user_types_of_cars (user_types_of_cars_uid, user_uid, type_of_car_uid) VALUES($1, $2, $3) RETURNING *", [this.id, this.userId, this.typeId]);
        return userCarType;
    }

    static async getAllUsersCars(id){
        const userCarTypes = await pool.query("SELECT * FROM user_types_of_cars JOIN type_of_car ON type_of_car.type_of_car_uid = user_types_of_cars.type_of_car_uid WHERE user_types_of_cars.user_uid = $1", [id]);
        return userCarTypes.rows;
    }
}

module.exports = UserTypes;