const pool = require("../utils/db");
const { v4: uuidv4 } = require('uuid');

class ChatRoom {
    constructor() {
        this.id = uuidv4();
    }

    async save() {
        const chatRoom = await pool.query("INSERT INTO chatroom (chatroom_uid) VALUES($1) RETURNING *", [this.id]);
        return chatRoom;
    }
}

module.exports = ChatRoom;