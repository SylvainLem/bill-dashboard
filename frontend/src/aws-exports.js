const awsmobile = {
    "aws_project_region": "ca-central-1", // e.g., "us-east-1"
    "aws_cognito_region": "ca-central-1",
    "aws_user_pools_id": "ca-central-1_lu0pDjH2V",
    "aws_user_pools_web_client_id": "1d8ps254nsitl67nrb3s14u96v",
    "oauth": {},
    "aws_cloud_logic_custom": [
        {
            "name": "ApiGateway", // This is a friendly name for your API
            "endpoint": "https://o2pncwj94e.execute-api.ca-central-1.amazonaws.com/prod",
            "region": "ca-central-1"
        }
    ]
};

export default awsmobile;