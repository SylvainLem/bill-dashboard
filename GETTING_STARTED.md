# Getting Started Guide 🚀

Follow these steps to deploy the Serverless Bills Dashboard to your AWS account.

## 1. Prerequisites

Before you begin, ensure you have the following installed and configured:
* An **AWS Account**.
* **AWS CLI**: Configured with credentials for an IAM user. [Installation Guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).
* **AWS SAM CLI**: The Serverless Application Model CLI for deploying the backend. [Installation Guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html).
* **Node.js and npm**: For managing the frontend. [Download](https://nodejs.org/).
* **Docker**: Required by the SAM CLI to build your functions in a Lambda-like environment. [Download](https://www.docker.com/products/docker-desktop/).
* A **GitHub Account**.

## 2. Initial AWS Setup

1.  **Create Two S3 Buckets:** You need two **globally unique** S3 buckets.
    * **Deployment Bucket:** This is for SAM to store your packaged code. Example: `my-bills-app-sam-artifacts-12345`.
    * **Frontend Bucket:** This is to host your static website. Example: `my-bills-app-frontend-12345`.
    
2.  **Create an IAM User:** For security, create an IAM user with programmatic access (`Access key ID` and `Secret access key`) and attach policies that grant sufficient permissions for the deployment (e.g., `AdministratorAccess` for simplicity, or more granular permissions for production).

## 3. GitHub Repository Setup

1.  **Push Code to GitHub:** Initialize a git repository in your project folder and push it to a new repository on your GitHub account.

2.  **Add Repository Secrets:** In your GitHub repository, go to **Settings > Secrets and variables > Actions** and add the following secrets:
    * `AWS_ACCESS_KEY_ID`: The Access Key ID of your IAM user.
    * `AWS_SECRET_ACCESS_KEY`: The Secret Access Key of your IAM user.

## 4. First Deployment

1.  **Update Workflow File:** Open the `.github/workflows/deploy.yml` file.
2.  **Replace Placeholders:**
    * Replace `us-east-1` with your preferred AWS region.
    * Replace `YOUR_UNIQUE_S3_BUCKET_FOR_DEPLOYMENT` with your SAM deployment bucket name.
    * Replace `YOUR_UNIQUE_S3_BUCKET_FOR_FRONTEND` with your frontend hosting bucket name.

3.  **Commit and Push:** Commit these changes to your `main` branch. This will trigger the GitHub Action to deploy the backend. The first run might fail on the frontend step, which is expected.

## 5. Connect Frontend to Backend

1.  **Get CloudFormation Outputs:** Go to the AWS CloudFormation console in your region. Find the stack named `my-bills-app` and click on it. Go to the **Outputs** tab. You will find the values for the API endpoint, Cognito User Pool ID, and User Pool Client ID.

2.  **Create `aws-exports.js`:**
    * In the `frontend/src/` directory, rename `aws-exports.js.template` to `aws-exports.js`.
    * Open the new file and fill in the placeholder values with the outputs from CloudFormation.

3.  **Commit and Push Again:** Commit the new `aws-exports.js` file. The GitHub Action will run again, this time successfully building and deploying your configured frontend.

## 6. Final AWS Configuration (Manual Steps)

1.  **Enable S3 Static Website Hosting:**
    * Navigate to your frontend S3 bucket.
    * Go to the **Properties** tab.
    * Scroll down to **Static website hosting** and click **Edit**.
    * Enable it and set the **Index document** to `index.html`. Save changes.

2.  **Create a CloudFront Distribution:**
    * Navigate to the CloudFront console and create a distribution.
    * For **Origin domain**, select your frontend S3 bucket.
    * For **S3 bucket access**, select **Yes use OAI** and create a new Origin Access Identity.
    * Select **Redirect HTTP to HTTPS** for the viewer protocol policy.
    * Click **Create distribution**. This can take 5-10 minutes to deploy.

## 7. Create Your First User

1.  Navigate to the **Amazon Cognito** console.
2.  Select your user pool (e.g., `my-bills-app-user-pool`).
3.  Go to the **Users** tab and click **Create user**.
4.  Fill out the form to create your first user. The user will receive an email with a temporary password.

You can now access your application using your CloudFront domain name!