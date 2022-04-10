#!/bin/bash

# "az container" docs
# https://docs.microsoft.com/en-us/cli/azure/container?view=azure-cli-latest

# terraform
# https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/container_group

if [ $# -lt 1 ]; then
    echo "Need app name"
    exit 1
fi

# get private and public keys
source ./.env

if [[ -z "$VAPID_PUBLIC_KEY" || -z "$VAPID_PUBLIC_KEY" ]];then
    echo "Either public or private key not found in environment variables"
    exit 1
fi

APP_NAME=$1

echo "App name is: $APP_NAME"

#  check if exists
EXISTING=$(az group list --query "[?name=='node_push_rg'].name" --output tsv)

if [ "$EXISTING" != "node_push_rg" ];then
    # Create Resource Group
    echo "Creating resource group: node_push_rg"
    az group create \
    --location eastus \
    --name node_push_rg

fi

# create container
# does not work because there is no https cert and no redirect from 80 to 443
az container create \
-g node_push_rg \
--name $APP_NAME \
--image wstrellis/node_push:0.0.1 \
--ports 443 \
--environment-variables HTTP_PORT=443 VAPID_PUBLIC_KEY=$VAPID_PUBLIC_KEY  VAPID_PRIVATE_KEY=$VAPID_PRIVATE_KEY \
--dns-name-label wstrellis-node-push \
--cpu 1 \
--memory 1

# delete container
# az container delete --name node-push -g node_push_rg
