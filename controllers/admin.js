const User = require("../models/User");
const ClientFavoriteMechanic = require('../models/ClientFavoriteMechanic');
const UserChatRoom = require("../models/UserChatRoom");
const ChatRoom = require("../models/ChatRoom");
const CarType = require("../models/CarType");
const CarBrand = require("../models/CarBrand");
const UserTypes = require("../models/UserTypes");
const UserBrands = require("../models/UserBrands");

exports.getHome = async (req, res, next) => {
    try {
        const users = await User.getEnginears(req.user.rows[0].user_uid);
        res.render('admin/home', {
            title: 'Home',
            path: '/home',
            users: users,
            currentUser: req.user.rows[0]
        });
    } catch (error) {
        console.log(error);
    }
}

exports.postLike = async (req, res, next) => {
    const clientFavEng = await new ClientFavoriteMechanic(req.params.likeId, req.user.rows[0].user_uid);
    clientFavEng.save();
    res.redirect('/home');
}

exports.postUnlike = async (req, res, next) => {
    const enginearId = req.params.unlikeId;
    const unlike = await ClientFavoriteMechanic.unlike(req.user.rows[0].user_uid, enginearId);
    console.log(unlike);
    res.redirect('/home');
}

exports.getChat = async (req, res, next) => {
    try {
        let users = await UserChatRoom.getUserChatRooms(req.user.rows[0].user_uid);
        for (let i = 0; i < users.length; i++) {
            if (users[i].user2_uid !== req.user.rows[0].user_uid) {
                let user = await User.getUserAndRoom(req.user.rows[0].user_uid, users[i].user2_uid);
                if(user[0].user_uid === req.user.rows[0].user_uid){
                    let user2= await User.getUser(user[0].user2_uid);
                    user2.rows[0].user_chat_room_uid = user[0].user_chat_room_uid;
                    user2.rows[0].chatroom_uid = user[0].chatroom_uid;
                    users[i] = user2.rows[0];
                }else{
                    users[i] = user[0];
                }
            }else{
                let user = await User.getUserAndRoom(req.user.rows[0].user_uid, users[i].user_uid);
                if(user[0].user_uid === req.user.rows[0].user_uid){
                    let user2= await User.getUser(user[0].user2_uid);
                    user2.user_chat_room_uid = user[0].user_chat_room_uid;
                    user2.chatroom_uid = user[0].chatroom_uid;
                    users[i] = user2;
                }else{
                    users[i] = user[0];
                }
            }
        }
        console.log(users);
        res.render('admin/chat', {
            title: "Chats",
            path: 'admin/chat',
            users: users
        })
    } catch (error) {
        console.log(error);
    }
}

exports.postChat = async (req, res, next) => {
    try {
        let firstUser = req.body.user;
        let secondUser = req.body.user2;
        const alluserRooms = await UserChatRoom.getUserChatRooms(secondUser);
        for (let i = 0; i < alluserRooms.length; i++) {
            if ((alluserRooms[i].user_uid === firstUser && alluserRooms[i].user2_uid === secondUser) || (alluserRooms[i].user_uid === secondUser && alluserRooms[i].user2_uid === firstUser)) {
                return res.redirect(`/chat/${alluserRooms[i].chatroom_uid}`);
            }
        }
        const newChatRoom = await new ChatRoom();
        await newChatRoom.save();
        const newUserChatRoom = await new UserChatRoom(firstUser, secondUser, newChatRoom.id);
        await newUserChatRoom.save();
        res.redirect(`/chat/${newChatRoom.id}`);
    } catch (error) {
        console.log(error);
    }
}

exports.getChatUser = async (req, res, next) => {
    try {
        let chatRoom = await UserChatRoom.getUserChatRoom(req.params.chatRoomId);
        let users = await UserChatRoom.getUserChatRooms(req.user.rows[0].user_uid);
        let otherUser;
        if (req.user.rows[0].user_uid !== chatRoom.user_uid) {
            otherUser = await User.getUser(chatRoom.user_uid);
        } else {
            otherUser = await User.getUser(chatRoom.user2_uid);
        }

        for (let i = 0; i < users.length; i++) {
            if (users[i].user2_uid !== req.user.rows[0].user_uid) {
                let user = await User.getUserAndRoom(req.user.rows[0].user_uid, users[i].user2_uid);
                if(user[0].user_uid === req.user.rows[0].user_uid){
                    let user2= await User.getUser(user[0].user2_uid);
                    user2.rows[0].user_chat_room_uid = user[0].user_chat_room_uid;
                    user2.rows[0].chatroom_uid = user[0].chatroom_uid;
                    users[i] = user2.rows[0];
                }else{
                    users[i] = user[0];
                }
            }else{
                let user = await User.getUserAndRoom(req.user.rows[0].user_uid, users[i].user_uid);
                if(user[0].user_uid === req.user.rows[0].user_uid){
                    let user2= await User.getUser(user[0].user2_uid);
                    user2.user_chat_room_uid = user[0].user_chat_room_uid;
                    user2.chatroom_uid = user[0].chatroom_uid;
                    users[i] = user2;
                }else{
                    users[i] = user[0];
                }
            }
        }
        console.log(users);
        res.render('admin/chatUser', {
            title: "ChatUser",
            path: 'admin/chatUser',
            otherUser: otherUser.rows[0],
            users: users
        })
    } catch (error) {
        console.log(error);
    }
}

exports.getFavorites = async (req, res, next) => {
    const userFavs = await User.getClientFavEnginears(req.user.rows[0].user_uid);
    const users = [];
    for (let i = 0; i < userFavs.length; i++) {
        const eginearData = await User.getUser(userFavs[i].enginear_uid);
        users.push(eginearData.rows[0]);
    }
    res.render('admin/favorite', {
        title: 'Favorites',
        path: '/favorite',
        users: users,
        currentUser: req.user.rows[0]
    });
}

exports.getProfile = async (req, res, next) => {
    const user = req.user.rows[0];
    console.log(user);
    res.render('admin/profile', {
        title: 'Profile',
        path: '/profile',
        user: user
    });
}

exports.getChangePassword = (req, res, next) => {
    res.render('admin/changePassword', {
        title: 'change password',
        path: 'admin/changePassword'
    });
}

exports.editProfile = (req, res, next) => {
    res.render('admin/editProfile', {
        title: 'change password',
        path: 'admin/editProfile'
    });
}