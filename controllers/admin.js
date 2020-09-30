const path = require("path");

const User = require("../models/User");
const ClientFavoriteMechanic = require('../models/ClientFavoriteMechanic');
const UserChatRoom = require("../models/UserChatRoom");
const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Message");
const TypeOfService = require("../models/TypeOfService");
const UserTypes = require("../models/UserTypes");
const UserBrands = require("../models/UserBrands");
const Job = require("../models/Job");
const Review = require("../models/Review");
const Feedback = require("../models/Feedback");

exports.getHome = async (req, res, next) => {
    const typesOfServices = await TypeOfService.getAll();
    const userCarTypes = await UserTypes.getAllUsersCars(req.user.rows[0].user_uid);
    const userCarBrands = await UserBrands.getAllUsersBrands(req.user.rows[0].user_uid);
    try {
        const users = await User.getEnginears(req.user.rows[0].user_uid);
        for (let i = 0; i < users.length; i++) {
            const uzer = users[i];
            let rating = await Review.getEngRating(uzer.user_uid);
            let totalJobs = await Job.getJobsDone(uzer.user_uid);
            if (isNaN(rating)) {
                rating = 'not rated';
            }
            uzer.jobs = totalJobs;
            uzer.fullRating = rating;
        }
        res.render('admin/home', {
            title: 'Home',
            path: '/home',
            users: users,
            currentUser: req.user.rows[0],
            typesOfServices,
            userCarTypes,
            userCarBrands,
            user: req.user.rows[0]
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
    await ClientFavoriteMechanic.unlike(req.user.rows[0].user_uid, enginearId);
    res.redirect('/home');
}

exports.getChat = async (req, res, next) => {
    try {
        let users = await UserChatRoom.getUserChatRooms(req.user.rows[0].user_uid);
        for (let i = 0; i < users.length; i++) {
            if (users[i].user2_uid !== req.user.rows[0].user_uid) {
                let user = await User.getUserAndRoom(req.user.rows[0].user_uid, users[i].user2_uid);
                if (user[0].user_uid === req.user.rows[0].user_uid) {
                    let user2 = await User.getUser(user[0].user2_uid);
                    user2.rows[0].user_chat_room_uid = user[0].user_chat_room_uid;
                    user2.rows[0].chatroom_uid = user[0].chatroom_uid;
                    users[i] = user2.rows[0];
                } else {
                    users[i] = user[0];
                }
            } else {
                let user = await User.getUserAndRoom(req.user.rows[0].user_uid, users[i].user_uid);
                if (user[0].user_uid === req.user.rows[0].user_uid) {
                    let user2 = await User.getUser(user[0].user2_uid);
                    user2.user_chat_room_uid = user[0].user_chat_room_uid;
                    user2.chatroom_uid = user[0].chatroom_uid;
                    users[i] = user2;
                } else {
                    users[i] = user[0];
                }
            }
        }
        res.render('admin/chat', {
            title: "Chats",
            path: 'admin/chat',
            users: users,
            user: req.user.rows[0]
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
        const messages = await Message.getAll(req.params.chatRoomId);
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
                if (user[0].user_uid === req.user.rows[0].user_uid) {
                    let user2 = await User.getUser(user[0].user2_uid);
                    user2.rows[0].user_chat_room_uid = user[0].user_chat_room_uid;
                    user2.rows[0].chatroom_uid = user[0].chatroom_uid;
                    users[i] = user2.rows[0];
                } else {
                    users[i] = user[0];
                }
            } else {
                let user = await User.getUserAndRoom(req.user.rows[0].user_uid, users[i].user_uid);
                if (user[0].user_uid === req.user.rows[0].user_uid) {
                    let user2 = await User.getUser(user[0].user2_uid);
                    user2.user_chat_room_uid = user[0].user_chat_room_uid;
                    user2.chatroom_uid = user[0].chatroom_uid;
                    users[i] = user2;
                } else {
                    users[i] = user[0];
                }
            }
        }
        res.render('admin/chatUser', {
            title: "ChatUser",
            path: 'admin/chatUser',
            otherUser: otherUser.rows[0],
            users: users,
            chatRoom: req.params.chatRoomId,
            currentUser: req.user.rows[0].user_uid,
            messages: messages,
            user: req.user.rows[0]
        })
    } catch (error) {
        console.log(error);
    }
}

exports.getFavorites = async (req, res, next) => {
    const typesOfServices = await TypeOfService.getAll();
    const userCarTypes = await UserTypes.getAllUsersCars(req.user.rows[0].user_uid);
    const userCarBrands = await UserBrands.getAllUsersBrands(req.user.rows[0].user_uid);
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
        currentUser: req.user.rows[0],
        typesOfServices,
        userCarTypes,
        userCarBrands,
        user: req.user.rows[0]
    });
}

exports.getProfile = async (req, res, next) => {
    try {
        const user = req.user.rows[0];
        let jobs;
        if (user.account_uid === "4dbc4cb7-7ee6-4d04-a1ba-364ea6a5c949") {
            jobs = await Job.getEngJobs(user.user_uid);
            let rating = await Review.getEngRating(user.user_uid);
            let totalJobs = await Job.getJobsDone(user.user_uid);
            user.jobs = totalJobs;
            user.fullRating = rating;
        } else {
            jobs = await Job.getClientJobs(user.user_uid);
        }
        res.render('admin/profile', {
            title: 'Profile',
            path: '/profile',
            user: user,
            jobs: jobs
        });
    } catch (error) {
        console.log(error);
    }
}

exports.getChangePassword = (req, res, next) => {
    res.render('admin/changePassword', {
        title: 'change password',
        path: 'admin/changePassword'
    });
}

exports.editProfile = async (req, res, next) => {
    const user = req.user.rows[0];
    res.render('admin/editProfile', {
        title: 'change password',
        path: 'admin/editProfile',
        user: user
    });
}

exports.postEditProfile = async (req, res, next) => {
    const user = req.user.rows[0];
    const email = req.body.email;
    const site = req.body.site;
    const telephone = req.body.telephone;
    const image = path.join('profile', req.file.filename);
    await User.editDetails(user.user_uid, email, site, telephone, image);
    res.redirect('/profile');
}

exports.postJob = async (req, res, next) => {
    try {
        console.log(req.body);
        const enginearId = req.params.enginearId;
        const clientId = req.user.rows[0].user_uid;
        const typeOfServiceId = req.body.typeOfService;
        const typeOfCar = req.body.typeOfCar;
        const brandOfCar = req.body.brandOfCar;
        const newjob = await new Job(clientId, enginearId, typeOfCar, brandOfCar, typeOfServiceId);
        const job = await newjob.save();
        res.redirect('/profile');
    } catch (error) {
        console.log(error);
    }
}

exports.postReview = async (req, res, next) => {
    try {
        const star = req.body.ratingNumber;
        const rating = req.body.ratingInput;
        const review = req.body.comment;
        const newReview = await new Review(star, rating, review);
        const myReview = await newReview.save();
        await Job.addReview(req.params.jobId, myReview.review_uid);
        res.redirect("/profile");
    } catch (error) {
        console.log(error);
    }
}

exports.postFeedback = async (req, res, next) => {
    try {
        const feedback = req.body.feedback;
        const newFeedback = await new Feedback(feedback);
        const myFeedback = await newFeedback.save();
        await Job.addFeedback(req.params.jobId, myFeedback.feedback_uid);
        res.redirect("/profile");
    } catch (error) {
        console.log(error);
    }
}