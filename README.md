# Serverless-To-Do-App

A fully serverless task management system hosted entirely on AWS. This project demonstrates a clean serverless backend using AWS Lambda, API Gateway, and DynamoDB, along with a frontend hosted on S3.

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

1. **IAM Role & Policy**  
   - Create `LambdaDynamoRole` with permissions for DynamoDB and CloudWatch.
![img](https://github.com/Tasneemsherif/Serverless-To-Do-App/blob/main/demo/LambdaPolicy.png)

![img](https://github.com/Tasneemsherif/Serverless-To-Do-App/blob/main/demo/LambdaRole.png)
   
2. **Lambda Functions**  
   - Deploy `CreateItem`, `ListItems`, `GetItem`, `UpdateItem`, `DeleteItem`
   - Set environment variable `TABLE_NAME=TodoTable`.  

3. **API Gateway**  
   - Create `TodoAPI` REST API.  
   - Resources: `/items` and `/items/{id}`.  
   - Methods: GET, POST on `/items`; GET, PUT, DELETE on `/items/{id}`.  
   - Enable **Lambda Proxy integration**, configure CORS, and attach a Resource Policy.
![img](https://github.com/Tasneemsherif/Serverless-To-Do-App/blob/main/demo/APIGateway.png)

![img](https://github.com/Tasneemsherif/Serverless-To-Do-App/blob/main/demo/APIGatewayIntegration.png)


### 2️⃣ DynamoDB Table

- **DynamoDB** table `TodoTable` with partition key `id` (String).  
- On-demand billing mode.

![img](https://github.com/Tasneemsherif/Serverless-To-Do-App/blob/main/demo/DynamoDB.png)

### 3️⃣ Frontend Deployment

1. **S3 Bucket**  
   - Enable static website hosting.

![img](https://github.com/Tasneemsherif/Serverless-To-Do-App/blob/main/demo/S3Hosting.png)

   - Apply public-read.
  
2. **Upload**  
   - Copy `index.html` and `app.js` from `s3-frontend/`.

![img](https://github.com/Tasneemsherif/Serverless-To-Do-App/blob/main/demo/S3Buckets.png)

3. **CORS**  
   - JSON configuration to allow frontend origin.

![img](https://github.com/Tasneemsherif/Serverless-To-Do-App/blob/main/demo/S3BucketPolicy.png)

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

🎥 [Watch Demo Video](https://drive.google.com/file/d/1P-ZRl-xN6LoAmLI3j7nogrdYpuSWsUTY/view?usp=sharing)


### ✅ CloudWatch 

![img](https://github.com/Tasneemsherif/Serverless-To-Do-App/blob/main/demo/cloudwatch.png)

---

## 🔮 Future Improvements

- **Authentication** with AWS Cognito  
- **Infrastructure as Code** (Terraform / AWS SAM)  
- **CI/CD** via AWS CodePipeline

---
