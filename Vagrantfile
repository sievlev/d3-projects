# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/bionic64"
  config.vm.network "forwarded_port", guest: 8080, host: 8080, host_ip: "127.0.0.1"

  config.vm.provider "virtualbox" do |vb|
     vb.memory = "1024"
  end
  config.vm.provision "shell", inline: <<-SHELL
     apt update
     apt install -y nodejs npm
  SHELL
end
