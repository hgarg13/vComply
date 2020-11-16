const mongoose = require("mongoose");
/**
 * @description: It setup the user schema in the mongo database
 */
const userSchema = new mongoose.Schema({
	user_id: Number,
	name: String
});

module.exports = mongoose.model("User", userSchema);