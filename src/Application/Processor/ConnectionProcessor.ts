import {EventListener} from "@framework/Decorator/register";
import EventDispatcher from "@framework/EventDispatcher";
import {TacticianCommandBus} from "@framework/Tactician/TacticianCommandBus";
import {ConnectionAggregate} from "@RabbitMQConfigOperator/Domain/Entity/ConnectionAggregate";
import {ConnectionEntity} from "@RabbitMQConfigOperator/Domain/Entity/ConnectionEntity";
import {GlobalConnectionReady} from "@RabbitMQConfigOperator/Domain/Events/GlobalConnectionReady";
import GlobalConnectionWasAdded from "@RabbitMQConfigOperator/Domain/Events/GlobalConnectionWasAdded";
import GlobalConnectionWasModified from "@RabbitMQConfigOperator/Domain/Events/GlobalConnectionWasModified";
import {ConnectionLogic} from "@RabbitMQConfigOperator/Domain/Logic/ConnectionLogic";
import {RabbitMQConnectionFactory} from "@RabbitMQConfigOperator/Infrastructure/Factory/RabbitMQConnectionFactory";
import K8SCoreApiRepository from "@RabbitMQConfigOperator/Infrastructure/Repository/K8SCoreApiRepository";
import RabbitMQRepository from "@RabbitMQConfigOperator/Infrastructure/Repository/RabbitMQRepository";
import {ConnectionProvider} from "@RabbitMQConfigOperator/Infrastructure/Сonnection/ConnectionProvider";
import {inject, injectable} from "tsyringe";

@injectable()
// @registerIntoDIAsObject('ConnectionProcessor')
export default class ConnectionProcessor {

    public constructor(
        @inject(EventDispatcher) private readonly eventBus: EventDispatcher,
        @inject(TacticianCommandBus) private readonly commandBus: TacticianCommandBus,
        @inject(ConnectionLogic) private readonly connectionLogic: ConnectionLogic,
        @inject(K8SCoreApiRepository) private readonly k8sCoreApiRepository: K8SCoreApiRepository,
        // @inject(RabbitMQRepository) private readonly rabbitMQRepository: RabbitMQRepository,
        @inject(RabbitMQConnectionFactory) private readonly rabbitMQConnectionFactory: RabbitMQConnectionFactory,
        @inject(ConnectionProvider) private readonly connectionProvider: ConnectionProvider,

    ) {
        this.eventBus = eventBus;
        this.connectionLogic = connectionLogic;
        this.k8sCoreApiRepository = k8sCoreApiRepository;
        this.connectionProvider = connectionProvider;
        this.eventBus.registerListeners(this);
    }

    @EventListener('GlobalConnectionWasAdded')
    public async applyGlobalConnectionWasAdded(event: GlobalConnectionWasAdded) {
        const login = this.connectionLogic.fetchSecretField(event.object.spec.login)
        const pass = this.connectionLogic.fetchSecretField(event.object.spec.password)

        const loginString = await this.k8sCoreApiRepository.getSecretData(login.namespace, login.secretName, login.key)
        const passString = await this.k8sCoreApiRepository.getSecretData(pass.namespace, pass.secretName, pass.key)

        const client = this.rabbitMQConnectionFactory.makeClient(
            event.object.spec.https,
            event.object.spec.host,
            loginString,
            passString,
            event.object.spec.skipTLSVerification,
        );

        const connectionEntity = new ConnectionEntity(
            event.object.metadata.name,
            event.object.spec.fullControl,
            client

        )
        await this.connectionProvider.addNewConnection(connectionEntity);
        const connectionRepository = this.connectionProvider.getRepositoryByConnectionName(connectionEntity.name);
        const overview = await connectionRepository.getOverview()

        this.eventBus.dispatchEvent(new GlobalConnectionReady(
            event.object.metadata.name,
            true,
            overview.cluster_name,
            overview.rabbitmq_version,
            'Connection check successfully',
            '---'
        ));

    }

    @EventListener('GlobalConnectionWasModified')
    public applyGlobalConnectionWasModified(event: GlobalConnectionWasModified) {
        console.log('GlobalConnectionWasModified ' + event)
    }

}