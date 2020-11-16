const mongoose = require("mongoose");
/**
 * @description: It setup the user schema in the mongo database
 */
const userActionSchema = new mongoose.Schema({
	level_id: String,
	user_id: Number,
	action: String
});

module.exports = mongoose.model("UserAction", userActionSchema);

// configure workflow


//action(wf_id,user_id, level,action)