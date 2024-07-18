terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.58.0"
    }
  }

  backend "s3" {
    bucket         	   = "cicd-otf-state"
    key              	   = "state/tofu.tfstate"
    # key              	   = "state/terraform.tfstate"
    region         	   = "eu-central-1"
    encrypt        	   = true
    # dynamodb_table = "mycomponents_tf_lockid"
  }
}

  provider "aws" {
  region = var.aws_region
}

resource "aws_instance" "app_server" {
  ami           = "ami-04e601abe3e1a910f"
  instance_type = "t2.micro"
}
