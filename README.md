# Serverless Bills Dashboard

This project is a cost-effective, serverless web application for managing family bills. It features a secure login for each family member, an API for managing bill entries, and a simple dashboard to view them.

The entire application is designed to run within the **AWS Free Tier** for low to moderate usage.

## Architecture ⚙️

The application uses a modern serverless architecture on AWS:

* **Frontend**: A React single-page application hosted on **Amazon S3**.
* **CDN**: **Amazon CloudFront** to serve the frontend securely over HTTPS and provide fast, global access.
* **Authentication**: **Amazon Cognito** for managing user sign-up, sign-in, and securing the API.
* **API**: A REST API built with **Amazon API Gateway**.
* **Backend Logic**: **AWS Lambda** functions (written in Python) to handle business logic.
* **Database**: **Amazon DynamoDB**, a NoSQL database, for storing user and bill data in a cost-effective, pay-per-request model.
* **CI/CD**: **GitHub Actions** for automated deployment of both backend and frontend infrastructure.

## Getting Started 🚀

To deploy this application to your own AWS account, please follow the detailed instructions in **[GETTING_STARTED.md](./GETTING_STARTED.md)**.

## Local Development 💻

For instructions on how to run and test the application on your local machine before deploying, see the **[LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md)** guide.