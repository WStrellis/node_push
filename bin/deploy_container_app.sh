#!/bin/bash

# container app create
# https://docs.microsoft.com/en-us/cli/azure/containerapp?view=azure-cli-latest#az-containerapp-create

# example arm template
# https://docs.microsoft.com/en-us/azure/container-apps/azure-resource-manager-api-spec?tabs=yaml#container-app-examples

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
CONTAINERAPPS_ENVIRONMENT="$1-cae"
LOCATION="eastus"

echo "App name is: $APP_NAME"

#  check if exists
EXISTING=$(az group list --query "[?name=='node_push_rg'].name" --output tsv)

if [ "$EXISTING" != "node_push_rg" ];then
    # Create Resource Group
    echo "Creating resource group: node_push_rg"
    az group create \
    --location $LOCATION \
    --name node_push_rg

fi

# create container app environment
#  check if exists
EXISTING_ENV=$(az containerapp env list --query "[?name=='node-push-cae'].name" --output tsv)

if [ "$EXISTING_ENV" != "node-push-cae" ];then
    # Create container app environment
    echo "Creating environment: $CONTAINERAPPS_ENVIRONMENT"
    az containerapp env create \
    --name $CONTAINERAPPS_ENVIRONMENT \
    --resource-group node_push_rg \
    --location $LOCATION

fi

az containerapp create \
  --name $APP_NAME \
  --resource-group node_push_rg \
  --environment $CONTAINERAPPS_ENVIRONMENT \
  --image wstrellis/node_push:0.0.1 \
  --target-port 80 \
  --ingress 'external' \
  --cpu 0.5 \
  --memory 1.0Gi \
  --env-vars HTTP_PORT=80 VAPID_PUBLIC_KEY=$VAPID_PUBLIC_KEY  VAPID_PRIVATE_KEY=$VAPID_PRIVATE_KEY \
  --query properties.configuration.ingress.fqdn


# delete all resources
# az group delete --name node_push_rg