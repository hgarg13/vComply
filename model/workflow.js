const mongoose = require("mongoose");
/**
 * @description: It setup the user schema in the mongo database
 */
const workflowSchema = new mongoose.Schema({
	status: String // [default active]
});

module.exports = mongoose.model("Workflow", workflowSchema);

// configure-workflow


//action(wf_id,user_id, level,action)