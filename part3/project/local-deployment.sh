#!/bin/bash

NAMESPACE="local-project"

kubectl config use-context k3d-k3s-default

kubectl create namespace $NAMESPACE || true

kubectl config set-context --current --namespace=$NAMESPACE

kubectl apply -k overlays/local

kubectl rollout status deployment frontend-dep
kubectl rollout status deployment todo-backend-dep

kubectl get services -o wide