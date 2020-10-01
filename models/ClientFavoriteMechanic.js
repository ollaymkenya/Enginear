const pool = require("../utils/db");
const { v4: uuidv4 } = require('uuid');

class ClentFavoriteMechanic {
    constructor(enginearId, clientId) {
        this.id = uuidv4();
        this.enginearId = enginearId;
        this.clientId = clientId;
    }

    async save() {
        const userFavEng = await pool.query("insert INTO client_favorite_mechanic(client_favorite_mechanic_uid, enginear_uid, client_uid)VALUES($1, $2, $3) RETURNING *", [this.id, this.enginearId, this.clientId]);
        return userFavEng;
    }

    static async getClientFavEnginears(id) {
        const cFes = await pool.query("SELECT * FROM uzer JOIN client_favorite_mechanic ON client_favorite_mechanic.client_uid = uzer.user_uid  WHERE uzer.user_uid = $1",[id]);
        return cFes.rows;
    }

    static async getEnginearsFavClients(id) {
        const cFes = await pool.query("SELECT * FROM uzer JOIN client_favorite_mechanic ON client_favorite_mechanic.enginear_uid = uzer.user_uid WHERE uzer.user_uid = $1",[id]);
        return cFes.rows;
    }

    static async unlike(clientId, enginearId){
        const unlike = await pool.query("DELETE FROM client_favorite_mechanic WHERE client_uid = $1 AND enginear_uid = $2 RETURNING *", [clientId, enginearId]);
        return unlike;
    }
}

module.exports = ClentFavoriteMechanic;