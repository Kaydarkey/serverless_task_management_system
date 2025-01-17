/*
const express = require("express"); 
const router = express.Router();
const AWS = require('aws-sdk');

// Configure AWS SDK with my region
AWS.config.update({
    region: process.env.AWS_REGION,  
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY  
});

// Create a DynamoDB document client
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Fetch Assigned Tasks
router.get('/tasks', (req, res) => {
    const params = {
        TableName: 'Tasks',  // DynamoDB table name
    };

    dynamoDB.scan(params, (err, data) => {
        if (err) {
            console.error('Error fetching tasks from DynamoDB', err);
            res.status(500).send('Error fetching tasks');
        } else {
            // Pass tasks data to the tasks.ejs template
            console.log(data.Items);
            res.render('tasks', { tasks: data.Items });
        }
    });
});

// Updating Task Status
// Add debug logging to track request parameters and flow
router.post('/tasks/:task_Id/update', async (req, res) => {
    // Add validation for task_Id parameter
    if (!req.params.task_Id) {
        console.error('[ERROR] Missing task_Id parameter');
        return res.status(400).send('Missing task ID');
    }

    console.log('[DEBUG] POST /tasks/:task_Id/update');
    console.log('[DEBUG] task_Id:', req.params.task_Id); 
    console.log('[DEBUG] Request body:', req.body);
    
    const { task_Id } = req.params;
    const { status } = req.body;

    // Validate status is provided
    if (!status) {
        console.error('[ERROR] Missing status in request body');
        return res.status(400).send('Missing status parameter');
    }

    const params = {
        TableName: 'Tasks',
        Key: { task_Id },
        UpdateExpression: 'set #status = :status, updatedAt = :updatedAt',
        ExpressionAttributeNames: {
            '#status': 'status'
        },
        ExpressionAttributeValues: {
            ':status': status,
            ':updatedAt': new Date().toISOString()
        }
    };

    try {
        console.log('[DEBUG] DynamoDB update params:', params);
        await dynamoDB.update(params).promise();
        console.log('[DEBUG] Update successful');
        res.redirect('/member/tasks'); // Redirect to tasks page after successful update
    } catch (error) {
        console.error('[ERROR] Error updating task status:', error);
        res.status(500).send('Error updating task status');
    }
});

// Export the router
module.exports = router;
*/

const express = require("express");
const router = express.Router();
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { ScanCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

// Configure AWS SDK client
const dynamoDBClient = new DynamoDBClient({ region: process.env.AWS_REGION });

// Fetch Assigned Tasks
router.get('/tasks', async (req, res) => {
    const params = {
        TableName: 'Tasks',  // DynamoDB table name
    };

    try {
        const { Items } = await dynamoDBClient.send(new ScanCommand(params));
        console.log(Items);  // Log the fetched tasks
        res.render('tasks', { tasks: Items });
    } catch (err) {
        console.error('Error fetching tasks from DynamoDB', err);
        res.status(500).send('Error fetching tasks');
    }
});

// Updating Task Status
router.post('/tasks/:task_Id/update', async (req, res) => {
    // Add validation for task_Id parameter
    if (!req.params.task_Id) {
        console.error('[ERROR] Missing task_Id parameter');
        return res.status(400).send('Missing task ID');
    }

    console.log('[DEBUG] POST /tasks/:task_Id/update');
    console.log('[DEBUG] task_Id:', req.params.task_Id); 
    console.log('[DEBUG] Request body:', req.body);
    
    const { task_Id } = req.params;
    const { status } = req.body;

    // Validate status is provided
    if (!status) {
        console.error('[ERROR] Missing status in request body');
        return res.status(400).send('Missing status parameter');
    }

    const params = {
        TableName: 'Tasks',
        Key: { task_Id },
        UpdateExpression: 'set #status = :status, updatedAt = :updatedAt',
        ExpressionAttributeNames: {
            '#status': 'status'
        },
        ExpressionAttributeValues: {
            ':status': status,
            ':updatedAt': new Date().toISOString()
        }
    };

    try {
        console.log('[DEBUG] DynamoDB update params:', params);
        await dynamoDBClient.send(new UpdateCommand(params));
        console.log('[DEBUG] Update successful');
        res.redirect('/member/tasks'); // Redirect to tasks page after successful update
    } catch (error) {
        console.error('[ERROR] Error updating task status:', error);
        res.status(500).send('Error updating task status');
    }
});

// Export the router
module.exports = router;
