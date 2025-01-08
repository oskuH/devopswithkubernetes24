#!/bin/bash

NAMESPACE="local-log-output"

kubectl config use-context k3d-k3s-default

kubectl create namespace $NAMESPACE || true

kubectl config set-context --current --namespace=$NAMESPACE

kubectl apply -k overlays/local

kubectl rollout status deployment ping-pong-dep
kubectl rollout status deployment log-output-dep

kubectl get services -o wide