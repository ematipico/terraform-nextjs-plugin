provider "aws" {
  profile = "token"
  region  = "eu-west-1"
  version = "~> 2.0"
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

  lifecycle {
    create_before_destroy = true
  }

  stage_description = "Deployment md5: ${md5(
    format("%s%s",
      file("../app/gateway.terraform.tf.json"),
      file("../app/lambdas.terraform.tf.json"),
    ))}"
}
