# Serverless-To-Do-App

A fully serverless task management system hosted entirely on AWS. This project demonstrates a clean serverless backend using AWS Lambda, API Gateway, and DynamoDB, along with a modern frontend hosted on S3 and CloudFront.

---

## 📦 Tech Stack

- **Backend**: AWS Lambda (Python), API Gateway, DynamoDB
- **Frontend**: HTML, CSS, JavaScript
- **Infrastructure**: S3 (static hosting)
- **Security**: IAM roles, API Gateway Resource Policies, CORS configuration


![Diagram](https://github.com/Tasneemsherif/Serverless-To-Do-App/blob/main/diagram.png)

---

## 🚀 Features

- Create, Read, Update, Delete (CRUD) tasks via AWS APIGatway RESTful API
- Fully serverless and scalable architecture
- Secured API with IAM and resource policies
- S3-hosted frontend fully integrated with backend API
- Responsive frontend interface

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET    | `/tasks` | List all tasks |
| GET    | `/tasks/{id}` | Get specific task |
| POST   | `/tasks` | Create new task |
| PUT    | `/tasks/{id}` | Update existing task |
| DELETE | `/tasks/{id}` | Delete task |

---

## 🔒 Security

- **IAM Role-based Access Control**
- **API Gateway Resource Policy** restricting invocation to specific IAM roles/users.
- **CORS** properly configured to allow frontend integration.

---

## 🛠️ Deployment Steps

### 1️⃣ Backend Deployment

- implement a lambda policy and role to access Cloudwatch and DynamoDB

![img](https://github.com/Tasneemsherif/Serverless-To-Do-App/blob/main/demo/LambdaPolicy.png)

![img](https://github.com/Tasneemsherif/Serverless-To-Do-App/blob/main/demo/LambdaRole.png)
   
- Deploy 4 Lambda functions Create, Read, Update, Delete (CRUD) tasks


- Create API Gateway REST API
![img](https://github.com/Tasneemsherif/Serverless-To-Do-App/blob/main/demo/APIGateway.png)

- Connect Lambda integrations to API Gateway
![img](https://github.com/Tasneemsherif/Serverless-To-Do-App/blob/main/demo/APIGatewayIntegration.png)

- Configure Resource Policy and CORS

### 2️⃣ DynamoDB Table

- Create table: `Tasks`
- Partition Key: `id` (String)

![img](https://github.com/Tasneemsherif/Serverless-To-Do-App/blob/main/demo/DynamoDB.png)

### 3️⃣ Frontend Deployment

- Create S3 bucket for static website hosting, add a bucket policy
![img](https://github.com/Tasneemsherif/Serverless-To-Do-App/blob/main/demo/S3Buckets.png)

![img](https://github.com/Tasneemsherif/Serverless-To-Do-App/blob/main/demo/S3BucketPolicy.png)

![img](https://github.com/Tasneemsherif/Serverless-To-Do-App/blob/main/demo/S3Hosting.png)

- Upload content from `frontend/` folder
![img](github.com/Tasneemsherif/Serverless-To-Do-App/blob/main/demo/S3Buckets.png)

- Enable public read access

### 4️⃣ Testing

- Use Postman collection for full API tests
- Validate frontend end-to-end integration

---

## 🖼️ Demo

### ✅ API Testing via Postman

*Postman collection includes full CRUD testing screenshots*
- Create Task
![Create Task](https://github.com/Tasneemsherif/Serverless-To-Do-App/blob/main/demo/create-task.png)

- Read Tasks
![Read Tasks](https://github.com/Tasneemsherif/Serverless-To-Do-App/blob/main/demo/list-tasks.png)

- Update Task
![Update Task](https://github.com/Tasneemsherif/Serverless-To-Do-App/blob/main/demo/update-task-status.png)

- Delete Task
![Delete Task](https://github.com/Tasneemsherif/Serverless-To-Do-App/blob/main/demo/delete-task.png)

- Read Tasks after delete
![Read Tasks after delete](https://github.com/Tasneemsherif/Serverless-To-Do-App/blob/main/demo/list-after-delete.png)

### ✅ Frontend Demo

*Modern and responsive UI demo*

![UI Demo](https://github.com/Tasneemsherif/Serverless-To-Do-App/blob/main/demo/Serverless-TodoApp.mp4)


### ✅ CloudWatch 

![img](https://github.com/Tasneemsherif/Serverless-To-Do-App/blob/main/demo/cloudwatch.png)

---
