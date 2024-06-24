kubectl apply -f keycloak-deployment.yaml
kubectl apply -f keycloak-postgres-deployment.yaml
kubectl apply -f keycloak-postgres-service.yaml
kubectl apply -f keycloak-service.yaml
kubectl apply -f postgres-data-new-kubernetes-persistentvolumeclaim.yaml
