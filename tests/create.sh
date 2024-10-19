#kind get clusters
#kind create cluster --config=kind.yaml --name=rabbitmq-admin

#kubectl create serviceaccount adminer
#kubectl create clusterrolebinding adminer \
#  --clusterrole=cluster-admin \
#  --serviceaccount=default:adminer
#
#kubectl create token adminer

kubectl cluster-info --context kind-rabbitmq-admin

kustomize build ../resources | kubectl apply -f -

kubectl apply -f resources/rabbitmqadmin-connection.yaml
kubectl apply -f resources/rabbitmqadmin-mixed-config.yaml
