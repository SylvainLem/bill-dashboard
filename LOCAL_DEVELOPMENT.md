# Local Development & Testing 💻

This guide explains how to run the backend API, database, and frontend on your local machine for rapid development and testing.

## 1. Running the Local Database

The Lambda function needs a database. We'll use DynamoDB Local via Docker.

1.  **Start the Container**: Run this command in your terminal. It will download the image and start a local DynamoDB instance.
    ```bash
    docker run -p 8000:8000 amazon/dynamodb-local
    ```
    Keep this terminal running.

2.  **Create the Table**: The local database is empty. Open a *new* terminal and run this command to create the necessary table. Note that we use a predictable name like `my-bills-app-Bills` in the `app.py` for local testing.
    ```bash
    aws dynamodb create-table \
        --table-name my-bills-app-Bills \
        --attribute-definitions AttributeName=userId,AttributeType=S AttributeName=billId,AttributeType=S \
        --key-schema AttributeName=userId,KeyType=HASH AttributeName=billId,KeyType=RANGE \
        --billing-mode PAY_PER_REQUEST \
        --endpoint-url http://localhost:8000
    ```

## 2. Running the Backend API

The **AWS SAM CLI** emulates API Gateway and Lambda locally.

1.  **Navigate to the Backend**: Open another terminal in the `backend/` directory.

2.  **Start the Local API**: Run the following command:
    ```bash
    sam local start-api
    ```
    This starts a web server at `http://127.0.0.1:3000` that listens for requests and invokes your Lambda function code. Your Python code has logic to automatically detect that it's running locally and will connect to `http://localhost:8000` for the database.

## 3. Testing the API

Since the local API is not protected by Cognito, you can't test it directly from the frontend easily. The best way to test the API endpoints is with a tool like **Postman** or `curl`.

When you make a request, you need to simulate the user ID that Cognito would normally provide. You can do this by creating a mock event.

Alternatively, use `sam local invoke` to test the function's logic directly.

1.  **Create `event.json`** in the `backend/` folder:
    ```json
    {
      "httpMethod": "POST",
      "path": "/bills",
      "body": "{\"name\": \"Internet Bill\", \"amount\": 59.99, \"dueDate\": \"2025-10-01\"}",
      "requestContext": {
        "authorizer": {
          "claims": {
            "sub": "local-user-123"
          }
        }
      }
    }
    ```

2.  **Invoke the function**:
    ```bash
    # From the backend/ directory
    sam local invoke BillsFunction -e event.json
    ```

## 4. Running the Frontend

1.  **Navigate to the Frontend**: Open a terminal in the `frontend/` directory.
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Start the Dev Server**:
    ```bash
    npm start
    ```
    This will open your React application in a browser, usually at `http://localhost:3000`. Note that this port might conflict with the SAM API. If so, `npm start` will prompt you to use a different one (e.g., `3001`).