resource "aws_key_pair" "key_pair_aws_intance" {
  key_name   = "aws_local_instance_users_service"
  public_key = var.public_key_to_pair_key
}

/**
resource "tls_private_key" "rsa" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "key_pair_aws_intance" {
  key_name   = "aws_local_instance"
  public_key = tls_private_key.rsa.public_key_openssh
}

resource "local_file" "tf-key" {
  content  = tls_private_key.rsa.private_key_pem
  filename = "tfKey"
}
**/
