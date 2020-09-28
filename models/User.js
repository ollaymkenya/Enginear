const path = require('path');

const pool = require("../utils/db");
const { v4: uuidv4 } = require('uuid');

class User {
    constructor(first_name, last_name, email, telephone, account, location, password) {
        this.id = uuidv4();
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.telephone = telephone;
        this.location = location;
        this.account = account;
        this.profile_pic = path.join('profile', 'ClipartKey_297748.png');
        this.password = password;
    }

    async save() {
        const newUser = await pool.query(
            "INSERT INTO uzer (user_uid, first_name, last_name, email, telephone, profile_pic, address_uid, account_uid, password) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
            [
                this.id,
                this.first_name,
                this.last_name,
                this.email,
                this.telephone,
                this.profile_pic,
                this.location,
                this.account,
                this.password,
            ]
        );
        return newUser
    }

    static async getEnginears(id) {
        const allusers = await pool.query("SELECT * FROM uzer WHERE uzer.account_uid = $1", ['4dbc4cb7-7ee6-4d04-a1ba-364ea6a5c949']);
        const favUsers = await pool.query("SELECT * FROM client_favorite_mechanic");
        let users = allusers.rows;
        let favUserz = favUsers.rows;
        for(let i = 0; i < favUserz.length; i++){
            let found = users.findIndex((user) =>  user.user_uid === favUserz[i].enginear_uid && favUserz[i].client_uid === id);
            if(found !== -1){
                users[found].client_favorite_mechanic_uid = favUserz[i].client_favorite_mechanic_uid;
                users[found].client_uid = favUserz[i].client_uid;
            }
        }
        return users;
    }

    static async getUsers(id) {
        const users = await pool.query("SELECT * FROM uzer");
        return users.rows;
    }

    static async getUser(id) {
        const user = await pool.query("SELECT * FROM uzer WHERE user_uid = $1", [id]);
        return user;
    }

    static async getUserAndRoom(id1, id2) {
        const user = await pool.query("SELECT * FROM uzer LEFT JOIN user_chat_room ON user_chat_room.user_uid = uzer.user_uid WHERE (user_chat_room.user_uid = $1 AND user_chat_room.user2_uid = $2) OR (user_chat_room.user_uid = $2 AND user_chat_room.user2_uid = $1)", [id1, id2]);
        return user.rows;
    }

    static async getUserWithEmail(email) {
        const user = await pool.query("SELECT * FROM uzer WHERE email = $1", [email]);
        return user;
    }

    static async getClientFavEnginears(id) {
        const cFes = await pool.query("SELECT * FROM uzer JOIN client_favorite_mechanic ON client_uid = uzer.user_uid WHERE uzer.user_uid = $1", [id]);
        return cFes.rows;
    }
}

module.exports = User;