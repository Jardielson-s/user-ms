resource "aws_instance" "ubuntu_instance" {
  ami                         = "ami-0a0e5d9c7acc336f1"
  instance_type               = "t2.micro"
  subnet_id                   = var.vpc_default_public_subnet_id
  vpc_security_group_ids      = [aws_security_group.allow_access_types.id]
  key_name                    = aws_key_pair.key_pair_aws_intance.key_name
  associate_public_ip_address = true

  depends_on = [
    aws_security_group.allow_access_types
  ]

  user_data = <<-EOF
              #!/bin/bash

              sudo apt-get update -y
              sudo apt-get upgrade -y
              
              # Instalar Node.js (versão 16 ou mais recente)
              curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
              sudo apt-get install -y nodejs
              
              # Instalar o NestJS CLI globalmente
              sudo npm install -g @nestjs/cli
              
              # Criar o diretório e a aplicação NestJS
              cd /home/ubuntu
              sudo apt update -y
              sudo apt install -y nginx

              # NodeJs
              sudo wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.39.3/install.sh | bash
              sudo source ~/.profile
              sudo nvm install 22

              git clone https://github.com/Jardielson-s/user-ms.git
              cd user-ms
              sudo echo "MONGO_URI=${var.mongo_uri}" >> .env
              sudo echo "AWS_REGION=${var.region}" >> .env
              sudo echo "AWS_ACCESS_KEY_ID=${var.aws_access_key_id}" >> .env
              sudo echo "AWS_SECRET_ACCESS_KEY=${var.aws_secret_access_key}" >> .env
              sudo echo "AWS_SQS_QUEUE_NAME=${var.aws_sqs_queue_name}" >> .env
              sudo echo "AWS_SQS_QUEUE_URL=${var.aws_sqs_queue_url}" >> .env

              sudo npm install --force

              # # Configurar o Nginx como Proxy Reverso
              # sudo rm /etc/nginx/sites-enabled/default
              # sudo bash -c 'echo "server {
              #   listen 80;
              #   server_name _;

              #   location / {
              #     proxy_pass http://localhost:3000;
              #     proxy_http_version 1.1;
              #     proxy_set_header Upgrade \$http_upgrade;
              #     proxy_set_header Connection 'upgrade';
              #     proxy_set_header Host \$host;
              #     proxy_cache_bypass \$http_upgrade;
              #   }
              # }" > /etc/nginx/sites-available/default'
              
              # sudo systemctl restart nginx
              # sudo systemctl enable nginx
              EOF


  tags = {
    Name = "ubuntu-instance"
  }
}


resource "aws_security_group" "allow_access_types" {
  name   = "allow_access_types_user_service"
  vpc_id = var.vpc_default_id
  ingress {
    description = "SSH to ec2"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    # ipv6_cidr_blocks = ["::/0"]
  }

  ingress {
    description = "HTTP to ec2"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    # ipv6_cidr_blocks = ["::/0"]
  }

  ingress {
    description = "HTTPS to ec2"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    # ipv6_cidr_blocks = ["::/0"]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    # ipv6_cidr_blocks = ["::/0"] # Allow outgoing traffic to any IPv6 address
  }
}
