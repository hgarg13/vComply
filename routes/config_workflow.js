const express = require('express');
const router = express.Router();
const WorkflowModel = require('../model/workflow');
const LevelModel = require('../model/level');

/*
data = {
	_id: null,
	status: active,
	levels: [
		{workflow_id,type,approver_ids,order,status:open}
	]
}
*/
router.post('/', async (req, res, next) => {
	let data = req.body.data;
	let id = await WorkflowModel.create({ status: 'active' });
	for (let level of data.levels) {
		let levelData = {
			workflow_id: id._id,
			type: level.type,
			approver_ids: level.approver_ids,
			order: level.order,
			status: "open"
		}
		if(level.type == 'Sequential') {
			levelData.next = level.approver_ids[0]
		}
		await LevelModel.create(levelData);
	}
	res.send('Workflow configured Successfully');
});

module.exports = router;
