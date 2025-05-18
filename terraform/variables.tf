variable "region" {
  type        = string
  description = "AWS region"
  default     = "us-east-1"
}

variable "s3_bucket_name" {
  type        = string
  description = "AWS bucket to save terraform state"
  default     = "terraform-state-ecs-bucket"
}

variable "env" {
  type        = string
  description = "Envirionment"
  default     = "dev"
}

variable "access_key" {
  type        = string
  description = "aws access key"
  nullable    = false
}

variable "secret_key" {
  type        = string
  description = "aws secret key"
  nullable    = false
}

variable "public_key_to_pair_key" {
  type        = string
  description = "Public key to pair key for connect with ec2"
  nullable    = false
}

variable "vpc_default_id" {
  type        = string
  description = "id from vpc default"
  nullable    = false
}

variable "vpc_default_public_subnet_id" {
  type        = string
  description = "subnet public id from vpc default"
  nullable    = false
}



variable "mongo_uri" {
  type        = string
  description = "mongo uri"
  nullable    = false
}

variable "aws_access_key_id" {
  type        = string
  description = "aws access key id"
  nullable    = false
}
variable "aws_secret_access_key" {
  type        = string
  description = "aws secret taccess key"
  nullable    = false
}
variable "aws_sqs_queue_name" {
  type        = string
  description = "aws sqs queue name"
  nullable    = false
}
variable "aws_sqs_queue_url" {
  type        = string
  description = "aws sqs queue url"
  nullable    = false
}

