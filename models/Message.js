const pool = require("../utils/db");
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

class Message {
    constructor(from, to, message, chatRoom) {
        this.id = uuidv4();
        this.from = from;
        this.to = to;
        this.message = message;
        this.time = moment().format("h:mm a");
        this.chatRoom = chatRoom;
    }

    async save() {
        const message = await pool.query("INSERT INTO message(message_uid, from_uid, to_uid, message, time, chatroom_uid)VALUES($1, $2, $3, $4, $5, $6) RETURNING *", [this.id, this.from, this.to, this.message, this.time, this.chatRoom]);
        return message.rows[0];
    }

    static async getAll(chatRoomId){
        const messages = await pool.query("SELECT * FROM message WHERE chatroom_uid = $1", [chatRoomId]);
        return messages.rows;
    }
}

module.exports = Message;