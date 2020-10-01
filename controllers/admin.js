const { validationResult } = require("express-validator");

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

const bcrpyt = require('bcryptjs');

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
        res.redirect('/500');
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
            path: '/chat',
            users: users,
            user: req.user.rows[0]
        })
    } catch (error) {
        res.redirect('/500');
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
        res.redirect('/500');
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
            path: '/chat',
            otherUser: otherUser.rows[0],
            users: users,
            chatRoom: req.params.chatRoomId,
            currentUser: req.user.rows[0].user_uid,
            messages: messages,
            user: req.user.rows[0]
        })
    } catch (error) {
        res.redirect('/500');
    }
}

exports.getFavorites = async (req, res, next) => {
    const user = req.user.rows[0];
    const typesOfServices = await TypeOfService.getAll();
    const userCarTypes = await UserTypes.getAllUsersCars(req.user.rows[0].user_uid);
    const userCarBrands = await UserBrands.getAllUsersBrands(req.user.rows[0].user_uid);
    let userFavs;
    try {
        if (user.account_uid === "4dbc4cb7-7ee6-4d04-a1ba-364ea6a5c949") {
            userFavs = await ClientFavoriteMechanic.getEnginearsFavClients(req.user.rows[0].user_uid);
        } else {
            userFavs = await ClientFavoriteMechanic.getClientFavEnginears(req.user.rows[0].user_uid);
        }
        const users = [];
        for (let i = 0; i < userFavs.length; i++) {
            if (user.account_uid === "4dbc4cb7-7ee6-4d04-a1ba-364ea6a5c949") {
                const eginearData = await User.getUser(userFavs[i].client_uid);
                users.push(eginearData.rows[0]);
            } else {
                const eginearData = await User.getUser(userFavs[i].enginear_uid);
                users.push(eginearData.rows[0]);
            }
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
    } catch (error) {
        res.redirect('/500');
    }
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
        res.redirect('/500');
    }
}

exports.getUserProfile = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const uzer = await User.getUser(userId);
        const user = uzer.rows[0]
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
        res.render('admin/userProfile', {
            title: 'Profile',
            path: '/profile',
            user: user,
            jobs: jobs
        });
    } catch (error) {
        res.redirect('/500');
    }
}

exports.getChangePassword = (req, res, next) => {
    const user = req.user.rows[0];
    res.render('admin/changePassword', {
        title: 'change password',
        path: 'admin/changePassword',
        user: user,
        errorMessage: ''
    });
}


exports.postChangePassword = async (req, res, next) => {
    const errors = validationResult(req);
    const user = req.user.rows[0]
    const currentUser = await User.getUser(user.user_uid);
    const authPassword = await bcrpyt.compare(req.body.oldPassword, currentUser.rows[0].password);
    try {
        if (!authPassword) {
            return res.render('admin/changePassword', {
                title: 'change password',
                path: 'admin/changePassword',
                user: user,
                errorMessage: 'Input your valid old password'
            });
        }
        if (req.body.newPassword !== req.body.confirmPassword) {
            return res.render('admin/changePassword', {
                title: 'change password',
                path: 'admin/changePassword',
                user: user,
                errorMessage: 'Make sure your confirm password and new password are equal'
            });
        }
        if (!errors.isEmpty()) {
            return res.render('admin/changePassword', {
                title: 'change password',
                path: 'admin/changePassword',
                user: user,
                errorMessage: errors.array()[0].msg
            });
        }
    } catch (error) {
        res.redirect('/500');
    }
    const newPassword = req.body.newPassword;
    const newHashedPassword = await bcrpyt.hash(newPassword, 12);
    await User.changePassword(user.user_uid, newHashedPassword);
    res.redirect("/profile");
}

exports.editProfile = async (req, res, next) => {
    try {
        const user = req.user.rows[0];
        res.render('admin/editProfile', {
            title: 'Edit Profile',
            path: 'admin/editProfile',
            user: user,
            errorMessage: ''
        });
    } catch (error) {
        res.redirect('/500');
    }
}

exports.postEditProfile = async (req, res, next) => {
    const user = req.user.rows[0];
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('admin/editProfile', {
            title: 'change password',
            path: 'admin/editProfile',
            user: user,
            errorMessage: errors.array()[0].msg
        });
    }
    try {
        const email = req.body.email;
        const site = req.body.site;
        const telephone = req.body.telephone;
        let image;
        if (!req.file) {
            image = user.profile_pic;
        } else {
            image = path.join('profile', req.file.filename);
        }
        await User.editDetails(user.user_uid, email, site, telephone, image);
        res.redirect('/profile');
    } catch (error) {
        res.redirect('/500');
    }
}

exports.postJob = async (req, res, next) => {
    try {
        const enginearId = req.params.enginearId;
        const clientId = req.user.rows[0].user_uid;
        const typeOfServiceId = req.body.typeOfService;
        const typeOfCar = req.body.typeOfCar;
        const brandOfCar = req.body.brandOfCar;
        const newjob = await new Job(clientId, enginearId, typeOfCar, brandOfCar, typeOfServiceId);
        await newjob.save();
        res.redirect('/profile');
    } catch (error) {
        res.redirect('/500');
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
        res.redirect('/500');
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
        res.redirect('/500');
    }
}