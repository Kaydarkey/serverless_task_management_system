const express = require("express");
const router = express.Router();
const { SNSClient, SubscribeCommand, PublishCommand } = require("@aws-sdk/client-sns");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { ScanCommand } = require("@aws-sdk/lib-dynamodb");

// Configure AWS SDK clients
const dynamoDBClient = new DynamoDBClient({ region: process.env.REGION });
const snsClient = new SNSClient({ region: process.env.REGION });

// Function to send email notifications
const sendEmailNotification = async (email, topicArn, subject, message) => {
  try {
    // Step 1: Subscribe the email
    const subscribeParams = {
      Protocol: "email", // Email protocol
      TopicArn: topicArn,
      Endpoint: email, // Target email address
    };

    console.log(`Subscribing ${email} to topic ${topicArn}...`);
    const subscriptionResult = await snsClient.send(new SubscribeCommand(subscribeParams));
    console.log(`Subscription request sent. Subscription ARN (pending confirmation): ${subscriptionResult.SubscriptionArn}`);

    console.log(`Note: The email owner must confirm the subscription before receiving messages.`);

    // Step 2: Publish a message to the topic
    const publishParams = {
      TopicArn: topicArn,
      Subject: subject,
      Message: message,
    };

    console.log(`Publishing message to topic ${topicArn}...`);
    const publishResult = await snsClient.send(new PublishCommand(publishParams));
    console.log(`Message published successfully. Message ID: ${publishResult.MessageId}`);
  } catch (error) {
    console.error(`Error sending email notification: ${error.message}`);
  }
};

// Fetch members from the "Members" table
const getUsers = async () => {
  const params = { TableName: "Members" };
  const data = await dynamoDBClient.send(new ScanCommand(params));
  return data.Items;
};

// Fetch tasks from the "Tasks" table
const getTasks = async () => {
  const params = { TableName: "Tasks" };
  const data = await dynamoDBClient.send(new ScanCommand(params));
  return data.Items;
};

// Admin Dashboard
router.get("/dashboard", async (req, res) => {
  try {
    const [tasks, users] = await Promise.all([getTasks(), getUsers()]);
    res.render("dashboard", { tasks, members: users });
  } catch (error) {
    console.error("Error loading dashboard:", error);
    res.status(500).send("Error loading dashboard.");
  }
});

// Create Task Form
router.get("/create-task", async (req, res) => {
  try {
    const members = await getUsers();
    res.render("admin/create-task", { members });
  } catch (error) {
    console.error("Error loading create task page:", error);
    res.status(500).send("Error loading create task page.");
  }
});

// Create a new task
router.post("/tasks/create-task", async (req, res) => {
  const { title, description, assignedTo, deadline } = req.body;

  const params = {
    TableName: "Tasks",
    Item: {
      task_Id: Date.now().toString(),
      title,
      description,
      assignedTo,
      deadline,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };

  try {
    // Save the task to the database
    await dynamoDBClient.send(new PutCommand(params));

    // Fetch member details to get the email address
    const members = await getUsers();
    const member = members.find((user) => user.name === assignedTo);
    console.log("Member:", members);

    if (member) {
      // Send email notification
      const email = member.email; // Assumes `email` field exists in "Members" table
      const subject = `New Task Assigned: ${title}`;
      const message = `Dear ${member.name},\n\nYou have been assigned a new task:\n\nTitle: ${title}\nDescription: ${description}\nDeadline: ${deadline}\n\nPlease log in to view more details.\n\nThank you.`;

      await sendEmailNotification(email, process.env.SNS_TOPIC_ARN, subject, message);
    }

    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).send("Error creating task.");
  }
});

module.exports = router;
