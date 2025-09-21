import json
import boto3
import os
import uuid
from decimal import Decimal

# Custom JSON encoder to handle DynamoDB Decimal types
class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, Decimal):
            return float(o)
        return super(DecimalEncoder, self).default(o)

# Check if running locally (AWS_SAM_LOCAL is set by SAM CLI)
if 'AWS_SAM_LOCAL' in os.environ:
    print("Running locally. Connecting to local DynamoDB.")
    dynamodb = boto3.resource('dynamodb', endpoint_url="http://host.docker.internal:8000")
    # For local, we use a fixed table name defined in the local setup guide
    TABLE_NAME = 'my-bills-app-Bills'
else:
    # Running in the AWS cloud
    dynamodb = boto3.resource('dynamodb')
    TABLE_NAME = os.environ.get('BILLS_TABLE_NAME')

table = dynamodb.Table(TABLE_NAME)

def lambda_handler(event, context):
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST,DELETE"
    }

    # Handle CORS preflight
    if event['httpMethod'] == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": headers,
            "body": ""
        }

    try:
        # The user's unique ID is passed by API Gateway from the Cognito token
        if 'AWS_SAM_LOCAL' in os.environ:
            user_id = "local-user-123"
        else:
            user_id = event['requestContext']['authorizer']['claims']['sub']
    except KeyError:
        return {
            "statusCode": 401,
            "body": json.dumps({"error": "Unauthorized. No user claims found."})
        }

    http_method = event['httpMethod']
    path = event['path']

    try:
        if http_method == "GET" and path == "/bills":
            print("Querying bills for user:", user_id)
            response = table.query(KeyConditionExpression=boto3.dynamodb.conditions.Key('userId').eq(user_id))
            print("Query result:", response)
            return { "statusCode": 200, "headers": headers, "body": json.dumps(response.get('Items', []), cls=DecimalEncoder) }

        elif http_method == "POST" and path == "/bills":
            bill_data = json.loads(event['body'], parse_float=Decimal)
            bill_data['userId'] = user_id
            bill_data['billId'] = str(uuid.uuid4())
            table.put_item(Item=bill_data)
            return { "statusCode": 201, "headers": headers, "body": json.dumps(bill_data, cls=DecimalEncoder) }

        elif http_method == "DELETE" and "billId" in event.get('pathParameters', {}):
            bill_id = event['pathParameters']['billId']
            table.delete_item(Key={'userId': user_id, 'billId': bill_id})
            return { "statusCode": 204, "headers": headers, "body": "" }

    except Exception as e:
        print(e)
        return { "statusCode": 500, "headers": headers, "body": json.dumps({"error": str(e)}) }

    return { "statusCode": 404, "headers": headers, "body": json.dumps({"error": "Not Found"}) }