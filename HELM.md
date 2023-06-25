# Helm Installation

## Installation
```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
```
```bash
helm install my-nginx bitnami/nginx --version 15.0.2 --values custom-values.yaml
```

## Source
https://artifacthub.io/packages/helm/bitnami/nginx