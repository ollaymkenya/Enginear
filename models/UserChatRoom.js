const pool = require("../utils/db");
const { v4: uuidv4 } = require('uuid');

class UserChatRoom {
    constructor(userId, user2Id, chatRoomId) {
        this.id = uuidv4();
        this.userId = userId;
        this.user2Id = user2Id;
        this.chatRoomId = chatRoomId;
    }

    async save() {
        const userChatRoom = await pool.query("INSERT INTO user_chat_room (user_chat_room_uid, user_uid, user2_uid, chatroom_uid) VALUES($1, $2, $3, $4) RETURNING *", [this.id, this.userId, this.user2Id, this.chatRoomId]);
        return userChatRoom;
    }

    static async getUserChatRoom(chatRoomId){
        const userChatRoom = await pool.query("SELECT * FROM user_chat_room WHERE chatroom_uid = $1", [chatRoomId]);
        return userChatRoom.rows[0];
    }

    static async getUserChatRooms(userId){
        const userChatRooms = await pool.query("SELECT * FROM user_chat_room WHERE user_uid = $1 OR user2_uid = $1", [userId]);
        return userChatRooms.rows;
    }
}

module.exports = UserChatRoom;