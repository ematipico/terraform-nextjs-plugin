provider "aws" {
  profile = "token"
  region  = "eu-west-1"
  version = "~> 2.0"
}

locals {
  groupname = "WebApi"

  lambda_iam_role = "arn:aws:iam::202020202020:role/lambda_execution_role"

  aws_region = "${data.aws_region.current.name}"
}

variable "env" {
  default = "dev"
}

resource "aws_api_gateway_rest_api" "CustomKey" {
  name        = "WebApi"
  description = "Web API"
}

resource "aws_api_gateway_stage" "CustomKey" {
  stage_name    = "dev"
  rest_api_id   = "${aws_api_gateway_rest_api.CustomKey.id}"
  deployment_id = "${aws_api_gateway_deployment.CustomKey.id}"
}

resource "aws_api_gateway_deployment" "CustomKey" {
  rest_api_id = "${aws_api_gateway_rest_api.CustomKey.id}"
  stage_name  = "dev"
}
