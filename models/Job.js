const pool = require("../utils/db");
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
class Job {
    constructor(clientId, enginearId, typeOfCarId, brandOfCarId, typeOfServiceId) {
        this.id = uuidv4();
        this.clientId = clientId;
        this.enginearId = enginearId;
        this.typeOfCarId = typeOfCarId;
        this.brandOfCarId = brandOfCarId;
        this.typeOfServiceId = typeOfServiceId;
        this.reviewId = null;
        this.feedbackId = null;
        this.time = moment().format("MMM Do YY, h:mm a");
    }

    async save() {
        const userFavEng = await pool.query("insert INTO job(job_uid, client_uid, enginear_uid, type_of_car_uid, brand_of_car_uid, type_of_service_uid, review_uid, feedback_uid, time)VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *", [this.id, this.clientId, this.enginearId, this.typeOfCarId, this.brandOfCarId, this.typeOfServiceId, this.reviewId, this.feedbackId, this.time]);
        return userFavEng;
    }

    static async addReview(id, reviewId) {
        const addedReview = await pool.query("UPDATE job SET review_uid = $1 WHERE job_uid = $2 RETURNING *", [reviewId, id]);
        return addedReview.rows[0];
    }

    static async addFeedback(id, feedbackId) {
        const addedReview = await pool.query("UPDATE job SET feedback_uid = $1 WHERE job_uid = $2 RETURNING *", [feedbackId, id]);
        return addedReview.rows[0];
    }

    static async getClientJobs(id) {
        const usrerJobs = await pool.query("SELECT * FROM job JOIN uzer ON uzer.user_uid = job.enginear_uid JOIN type_of_car ON type_of_car.type_of_car_uid = job.type_of_car_uid JOIN brand_of_car ON brand_of_car.brand_of_car_uid = job.brand_of_car_uid JOIN type_of_service ON type_of_service.type_of_service_uid = job.type_of_service_uid LEFT JOIN review ON review.review_uid = job.review_uid LEFT JOIN feedback ON feedback.feedback_uid = job.feedback_uid WHERE job.client_uid = $1", [id]);
        return usrerJobs.rows;
    }

    static async getEngJobs(id) {
        const usrerJobs = await pool.query("SELECT * FROM job JOIN uzer ON uzer.user_uid = job.client_uid JOIN type_of_car ON type_of_car.type_of_car_uid = job.type_of_car_uid JOIN brand_of_car ON brand_of_car.brand_of_car_uid = job.brand_of_car_uid JOIN type_of_service ON type_of_service.type_of_service_uid = job.type_of_service_uid LEFT JOIN review ON review.review_uid = job.review_uid LEFT JOIN feedback ON feedback.feedback_uid = job.feedback_uid WHERE job.enginear_uid = $1", [id]);
        return usrerJobs.rows;
    }

    static async getJobsDone(id) {
        const jobsCount= await pool.query("SELECT job_uid FROM job WHERE job.enginear_uid = $1", [id]);
        return jobsCount.rows.length;
    }
}

module.exports = Job;