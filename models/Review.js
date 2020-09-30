const pool = require("../utils/db");
const { v4: uuidv4 } = require('uuid');

class Review {
    constructor(star, rating, review) {
        this.id = uuidv4();
        this.star = star;
        this.rating = rating;
        this.review = review;
    }

    async save() {
        const review = await pool.query("INSERT INTO review(review_uid, star, rating, review)VALUES($1, $2, $3, $4) RETURNING *", [this.id, this.star, this.rating, this.review]);
        return review.rows[0];
    }

    static async getAll(id) {
        const reviews = await pool.query("SELECT * FROM job JOIN review ON review.review_uid = job.review_uid WHERE job.client_uid = $1 OR job.enginear_uid = $1", [id]);
        return reviews.rows;
    }

    static async getEngRating(id){
        const totalRating = await pool.query("SELECT enginear_uid, job.review_uid, review.star FROM job JOIN review ON review.review_uid = job.review_uid WHERE job.enginear_uid = $1", [id]);
        let totalUserRating = 0;
        for (let i = 0; i < totalRating.rows.length; i++) {
            totalUserRating += totalRating.rows[i].star;
        }
        return totalUserRating/totalRating.rows.length;
    }
}

module.exports = Review;