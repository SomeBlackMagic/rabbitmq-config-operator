kustomize-apply:
	kustomize build resources/ | kubectl apply -f -

kustomize-delete:
	kustomize build resources/ | kubectl delete -f -


generate-entity-from-crd:
	crd-client-generator-js resources/bases/rabbitmq-admin.io-globalconnection.yaml src/Domain/Entity/rabbitmq-admin.io-globalconnection.generated.ts
	crd-client-generator-js resources/bases/rabbitmq-admin.io-mixedconfigs.yaml src/Domain/Entity/rabbitmq-admin.io-mixedconfigs.generated.ts

docker-build:
	docker build -f .docker/image.Dockerfile . -t localhost/prometeus-alerting-middleware:local

docker-push:
	#docker push localhost:5000/prometeus-alerting-middleware:local
	kind load docker-image "localhost/prometeus-alerting-middleware:local"

docker-run:
	docker run -it prometeus-alerting-middleware:local bash