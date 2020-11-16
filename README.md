# Workflow

## Tech

* Node.js
* Express
* MongoDb

## Installation

Install the dependencies and devDependencies and start the server.
```sh
$ cd vComply
$ npm install
$ node ./bin/www
````


## APIS

### 1. configureWorkflow

It allows user to configure workflow and save it into the database

**URL** : `http://localhost:3000/configureWorkflow`

**Method** : `POST`
**Body** : {
	"data": {
		"levels": [
			{
				"type": "Sequential",
				"approver_ids": [1,4],
				"order": 1
			},
			{
				"type": "Any One",
				"approver_ids": [4,5],
				"order": 2
			},
			{
				"type": "Round Robin",
				"approver_ids": [2,3,5],
				"order": 3
			}
		]
	}
}

### 2. takeAction

Approve, reject, reject & remove from workflow actions can be taken.
1. Approve: This action will be marked as approved and the workflow will be active so that the next person in the approval workflow can take the approval actions. 
2. Reject: This action will be marked as rejected and the workflow will be terminated. 
3. Reject & Remove from workflow: This action will be marked as rejected but will be active so that the next person in the approval workflow can take the approval actions. 


**URL** : `http://localhost:3000/takeAction`

**Method** : `PUT`
**Body** : {
	"data": {
		"workflow_id": "5fb247780b70d241441d2292",
		"level_id": "5fb247790b70d241441d2295",
		"user_id": 5,
		"action_type": "approved"
	}
}

#### Notes

When server starts, by default 5 users are created in the database
1. Elsa Ingram
2. Paul Marsh
3. D Joshi
4. Nick Holden
5. John

Approver Ids is an array of user ids that are allowed to take action in the corresponding level

