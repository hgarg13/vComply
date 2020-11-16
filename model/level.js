const mongoose = require("mongoose");
/**
 * @description: It setup the user schema in the mongo database
 */
const levelSchema = new mongoose.Schema({
	workflow_id: String,
	type: String,
	approver_ids: Array,
	order: Number,
	next: Number,
	status: String //open/close
});

module.exports = mongoose.model("Level", levelSchema);

// configure workflow


//action(wf_id,user_id, level,action)