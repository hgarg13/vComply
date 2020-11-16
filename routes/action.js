const express = require('express');
const router = express.Router();
const WorkflowModel = require('../model/workflow');
const LevelModel = require('../model/level');
const UserActionModel = require('../model/user_action');

router.put('/', async (req, res, next) => {
	try {
		let data = req.body.data;
		let wfData = await WorkflowModel.findOne({ _id: data.workflow_id })
		if (wfData.status != 'active') {
			return res.send(`Workflow Already ${wfData.status}`);
		}
		let level = await LevelModel.findOne({ _id: data.level_id });

		if (level.status == 'close') {
			return res.send('Level Already Closed');
		}
		let appr = await UserActionModel.findOne({level_id: data.level_id, user_id: data.user_id});
		if(appr && Object.keys(appr).length != 0) {
			throw new Error('You have already performed action in this level')
		}
		if (level.type == 'Sequential') {
			if (level.next == data.user_id) {
				if (data.action_type == 'approved') {
					let actionData = {
						level_id: data.level_id,
						user_id: data.user_id,
						action: data.action_type
					}
					await UserActionModel.create(actionData);
					if (data.user_id == level.approver_ids[level.approver_ids.length - 1]) {
						await LevelModel.findByIdAndUpdate({ _id: level._id }, { $set: { status: "close", next: null } });
					} else {
						let index = level.approver_ids.indexOf(data.user_id);
						let next = index + 1;
						await LevelModel.findByIdAndUpdate({ _id: level._id }, { $set: { next: level.approver_ids[next] } });
					}
				} else if (data.action_type == 'rejected') {
					let actionData = {
						level_id: data.level_id,
						user_id: data.user_id,
						action: data.action_type
					}
					await UserActionModel.create(actionData);
					await LevelModel.findByIdAndUpdate({ _id: data.level_id }, { $set: { status: "close", next: null } });
					await WorkflowModel.findByIdAndUpdate({ _id: data.workflow_id }, { $set: { status: "terminated" } });
					return res.send('This workflow was terminated');
				} else if (data.action_type == 'reject_remove_from_workflow') {
					let actionData = {
						level_id: data.level_id,
						user_id: data.user_id,
						action: data.action_type
					}
					await UserActionModel.create(actionData);
					if (data.user_id == level.approver_ids[level.approver_ids.length - 1]) {
						await LevelModel.findByIdAndUpdate({ _id: data.level_id }, { $set: { status: "close", next: null } });
					} else {
						let index = level.approver_ids.indexOf(data.user_id);
						let next = index + 1;
						await LevelModel.findByIdAndUpdate({ _id: level._id }, { $set: { next: level.approver_ids[next] } });
					}

				}
			} else {
				throw new Error('You are not allowed to take action in sequential level')
			}
		} else if (level.type == 'Round Robin') {
			if (!level.approver_ids.includes(data.user_id)) {
				throw new Error('Not a valid approver');
			}
			if (data.action_type == 'approved') {
				let actionData = {
					level_id: data.level_id,
					user_id: data.user_id,
					action: data.action_type
				}
				await UserActionModel.create(actionData);
			} else if (data.action_type == 'rejected') {
				let actionData = {
					level_id: data.level_id,
					user_id: data.user_id,
					action: data.action_type
				}
				await UserActionModel.create(actionData);
				await LevelModel.findByIdAndUpdate({ _id: data.level_id }, { $set: { status: "close" } });
				await WorkflowModel.findByIdAndUpdate({ _id: data.workflow_id }, { $set: { status: "terminated" } });
				return res.send('This workflow was terminated');
			} else if (data.action_type == 'reject_remove_from_workflow') {
				let actionData = {
					level_id: data.level_id,
					user_id: data.user_id,
					action: data.action_type
				}
				await UserActionModel.create(actionData);
			}
			let apprCount = await UserActionModel.countDocuments({ level_id: data.level_id })
			if (apprCount == level.approver_ids.length) {
				await LevelModel.findByIdAndUpdate({ _id: data.level_id }, { $set: { status: "close" } });
			}
		} else if (level.type == 'Any One') {
			if (!level.approver_ids.includes(data.user_id)) {
				throw new Error('Not a valid approver');
			}
			if (data.action_type == 'approved') {
				let actionData = {
					level_id: data.level_id,
					user_id: data.user_id,
					action: data.action_type
				}
				await UserActionModel.create(actionData);
				await LevelModel.findByIdAndUpdate({ _id: data.level_id }, { $set: { status: "close" } });
			} else if (data.action_type == 'rejected') {
				let actionData = {
					level_id: data.level_id,
					user_id: data.user_id,
					action: data.action_type
				}
				await UserActionModel.create(actionData);
				await LevelModel.findByIdAndUpdate({ _id: data.level_id }, { $set: { status: "close" } });
				await WorkflowModel.findByIdAndUpdate({ _id: data.workflow_id }, { $set: { status: "terminated" } });
				return res.send('This workflow was terminated');
			} else if (data.action_type == 'reject_remove_from_workflow') {
				let actionData = {
					level_id: data.level_id,
					user_id: data.user_id,
					action: data.action_type
				}
				await UserActionModel.create(actionData);
				await LevelModel.findByIdAndUpdate({ _id: data.level_id }, { $set: { status: "close" } });
			}
		} else {
			throw new Error('Not a valid level type')
		}

		let count = await LevelModel.countDocuments({ workflow_id: data.workflow_id, status: 'open' });
		if (count == 0) {
			await WorkflowModel.findByIdAndUpdate({ _id: data.workflow_id }, { $set: { status: "executed" } });
			return res.send('This workflow was executed successfully');
		} else {
			return res.send('Action taken successfully')
		}

	} catch (error) {
		console.log('error=====> ', error)
	}
});

module.exports = router;
