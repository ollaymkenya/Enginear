const pool = require("../utils/db");
const { v4: uuidv4 } = require('uuid');

class Feedback {
    constructor(feedback) {
        this.id = uuidv4();
        this.feedback = feedback;
    }

    async save() {
        const review = await pool.query("INSERT INTO feedback(feedback_uid, feedback)VALUES($1, $2) RETURNING *", [this.id, this.feedback]);
        return review.rows[0];
    }

    static async getAll(id) {
        const reviews = await pool.query("SELECT * FROM job JOIN feedback ON feedback.feedback_uid = job.feedback_uid WHERE job.client_uid = $1 OR job.enginear_uid = $1", [id]);
        return reviews.rows;
    }
}

module.exports = Feedback;