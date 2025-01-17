# TaskManagementSystem
Project Overview
This project is a Task Management System designed and implemented using AWS Serverless Services. The system enables efficient task management for a field team, allowing:
•	Admins to create, assign, and manage tasks.
•	Team Members to view and update their assigned tasks.
•	Real-time notifications, status updates, and deadline tracking to ensure a seamless workflow.
The system leverages the scalability, reliability, and cost-effectiveness of serverless architecture to handle tasks efficiently.
________________________________________
Features
1. Admin Features
•	Task Creation: Admins can create tasks, specifying details such as title, description, priority, and deadline.
 
•	Task Assignment: Admins can assign tasks to specific team members.
•	Task Monitoring: Admins have an overview of all tasks, including their status, deadlines, and team assignments.
 
2. Team Member Features
•	Task Dashboard: Team members log in to view their assigned tasks.
 
•	Task Updates: Team members can update the status of their tasks (e.g., "In Progress", "Completed").
•	Notifications: Team members receive alerts for new tasks, approaching deadlines, and updates.
 
3. Core System Features
•	Real-time Notifications: Using AWS SNS and Lambda for instant alerts.
•	Status Updates: Task progress tracked and updated in real time.
•	Deadline Tracking: Automated reminders for upcoming or missed deadlines.
•	Secure Access: Role-based authentication and authorization.
________________________________________
Architecture
The system uses AWS Serverless Services, ensuring scalability, low maintenance, and cost-effectiveness. The architecture includes:
AWS Services
1.	Amazon API Gateway
o	Provides RESTful endpoints for admin and team member interactions.
2.	Amazon DynamoDB
o	Stores task data, user information, and status updates.
3.	Amazon Cognito
o	Manages user authentication and role-based authorization.
4.	AWS Simple Notification Service (SNS)
o	Sends notifications for task updates and deadlines.
5.	AWS CloudWatch
o	Monitors application performance and logs errors.
6.	AWS S3 (Optional)
o	Stores static files or task-related documents.
________________________________________
Installation and Setup
Prerequisites
•	AWS Account
•	Node.js installed locally
•	AWS CLI configured
•	Visual Studio Code 
Steps
1.	Clone the Repository:
2.	git clone task-management-system
cd task-management-system
3.	Install Dependencies:
npm install
4.	Deploy AWS Resources:
o	Use the AWS Serverless Application Model (SAM) or AWS CDK.
o	Example deployment with SAM:
sam deploy --guided
5.	Configure Environment Variables: Update config.js with required AWS resource identifiers (DynamoDB table name, SNS topic ARN, etc.).
6.	Run the Application: Access the API endpoints through the deployed API Gateway URL.
________________________________________
Usage
1. Admin Workflow
•	Log in using Cognito credentials.
•	Use the Admin Dashboard to create and assign tasks.
•	Monitor task progress and receive notifications.
2. Team Member Workflow
•	Log in using Cognito credentials.
•	Access the Task Dashboard to view assigned tasks.
•	Update task status as needed.
________________________________________
API Endpoints
Admin Endpoints
•	POST /tasks: Create a new task.
•	PUT /tasks/{taskId}/assign: Assign a task to a team member.
•	GET /tasks: Fetch all tasks.
Team Member Endpoints
•	GET /tasks: Fetch assigned tasks.
•	PUT /tasks/{taskId}/update: Update task status.
________________________________________
Notifications
Triggers
•	Task Assignment: Notify team member of a new task.
________________________________________
Database Design
DynamoDB Schema
Tables
1.	Tasks Table
o	taskId: Primary Key
o	title: String
o	description: String
o	assignedTo: String (User ID)
o	status: String (e.g., "Pending", "In Progress", "Completed")
o	deadline: Timestamp
2.	Users Table
o	userId: Primary Key
o	role: String ("Admin" or "Team Member")
o	name: String
o	email: String
________________________________________
Future Enhancements
•	Integrate AI for task prioritization based on deadlines and workload.
•	Add a mobile application for offline task management.
•	Implement analytics for task performance and team productivity.
•	A more seamless workflow
•	Add notifications for deadlines and task status change for admin
________________________________________
Contributing
Contributions are welcome! Please fork the repository, create a feature branch, and submit a pull request.
________________________________________
License
This project is licensed under the MIT License. See LICENSE for more details.
________________________________________
Contact
For inquiries, contact the project maintainer at darkeykafui@gmail.com.


