import Koa from 'koa';
import * as Router from 'koa-router';
import combineRouters from 'koa-combine-routers';
import bodyParser from 'koa-bodyparser';
import * as http from 'http';
import {Core} from '../App';
import {EventBusInterface} from '@elementary-lab/standards/src/EventBusInterface';
import {SimpleEventBus} from '@elementary-lab/events/src/SimpleEventBus';
import {injectable} from "tsyringe";

@injectable()
export class WebServer {

    private config: WebServerConfigInterface;
    // private bus: EventBusInterface<SimpleEventBus>;
    private http: http.Server;
    private koa: Koa;
    private routers: any[] = [];
    private shuttingDown: boolean = false;
    // private metricRegistry: Registry;

    public constructor(config: WebServerConfigInterface, bus?: EventBusInterface<SimpleEventBus>) {
        this.config = config;
        // this.bus = bus ?? Core.app().bus();
    }

    public init(): WebServer {
        this.koa = new Koa();
        this.http = http.createServer(this.koa.callback());

        this.koa.use((ctx, next) => {
            if (this.shuttingDown) {
                ctx.status = 503;
                ctx.set('Connection', 'close');
                ctx.body = 'Server is in the process of shutting down';
            } else {
                return next();
            }
        });

        this.koa.use(bodyParser({
            enableTypes: ['json', 'form', 'text'],
            onerror: function (err, ctx) {
                ctx.throw('body parse error', 422);
            }
        }));

        const requestId = require('koa-requestid');
        this.koa.use(requestId());

        if (this.config.metrics.enabled === true) {
            this.registerMetric();
        }

        return this;
    }

    private registerMetric(): void {
        // this.metricRegistry = new client.Registry();
        // if (this.config.metrics.collectDefaultMetrics) {
        //     client.collectDefaultMetrics({register: this.metricRegistry, prefix: this.config.metrics.prefix});
        // }
        // this.bus.on(HttpEvents.REGISTER_METRIC, async (metricItem) => {
        //         this.metricRegistry.registerMetric(metricItem);
        // });
        // let router = require('koa-router')();
        // let routes = router.get('/metrics', async (ctx: Context) => {
        //     try {
        //         ctx.headers['content-type'] = this.metricRegistry.contentType;
        //         ctx.body = await this.metricRegistry.metrics();
        //     } catch (err) {
        //         Core.error('Grab metric failed', err, 'ApiServer');
        //         ctx.status = 500;
        //         ctx.set('Connection', 'close');
        //         ctx.body = err;
        //     }
        //
        // });
        // this.registerRoutes(routes);
    }

    public registerRoutes(router: Router): void {
        this.routers.push(router);
    }

    public start(): Promise<WebServer> {
        return new Promise<WebServer | any>((resolve, reject) => {
            this.koa.use(combineRouters(this.routers)());
            this.koa.use(async (ctx, next) => {
                try {
                    await next();
                } catch (err) {
                    reject(err);
                }
            });
            this.http.listen(this.config.port, () => {
                Core.info('Listening on:', [this.config.host, this.config.port], 'ApiServer');
                resolve(this);
            });
        });
    }

    public stop(): void {
        if (this.shuttingDown) {
            Core.info('Api server in already in progress graceful shutdown', null, 'ApiServer');
            // We already know we're shutting down, don't continue this function
            return;
        } else {
            this.shuttingDown = true;
        }
        this.http.close((err) => {
            if (err) {
                Core.emergency('Can not stop http server', {exception: err}, 'ApiServer');
            }
        });
    }
}

export class HttpEvents {
    public static readonly REGISTER_METRIC = 'Core.Http.REGISTER_METRIC';
}

export interface WebServerConfigInterface {
    host: string;
    port: number;
    timeout: number;
    metrics: {
        enabled: boolean;
        collectDefaultMetrics: boolean
        prefix: string;
    };
    probe: {
        enabled: boolean;
    },
    controllers?: string[]
}
