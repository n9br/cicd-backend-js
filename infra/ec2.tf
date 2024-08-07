provider "aws" {
  region = var.aws_region
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.58.0"
    }
  }

  # Terraform State Bucket
  backend "s3" {
    bucket  = "cicd-otf-state"
    key     = "state/express.tfstate"
    region  = "eu-central-1"
    encrypt = true
    # dynamodb_table = "mycomponents_tf_lockid"
  }
}

resource "aws_instance" "express-api" {
  ami           = "ami-071de147bf3f27475" # Replace with your chosen AMI
  instance_type = "t2.micro"
  subnet_id     = aws_subnet.cicd-subnet-pub-1a.id
  # associate_public_ip_address = true
  vpc_security_group_ids = [aws_security_group.cicd-sg.id]
  key_name               = "0730"
  user_data              = file("./user_data.sh")
  tags = {
    Name = "ExpressAPI"
  }
}

output "express-api-ip" {
  value = aws_instance.express-api.public_ip
}

