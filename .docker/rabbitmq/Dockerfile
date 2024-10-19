ARG IMAGE_VERSION

FROM rabbitmq:${IMAGE_VERSION}

RUN set -eux \
    && apt update \
    && apt install -y curl \
    && curl -L https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/releases/download/3.11.1/rabbitmq_delayed_message_exchange-3.11.1.ez --output /opt/rabbitmq/plugins/rabbitmq_delayed_message_exchange-3.11.1.ez \
    && true

