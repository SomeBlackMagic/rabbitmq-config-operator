import {Core} from "@framework/App";
import BaseApiController, {ApiControllerInterface} from "@framework/HttpKernel/BaseApiController";
import {TacticianCommandBus} from "@framework/Tactician/TacticianCommandBus";
import {Context} from 'koa';
import Router from "koa-router";
import {container, injectable} from "tsyringe";

@injectable()
export default class PrometheusApiController extends BaseApiController implements ApiControllerInterface {
    public registerRoutes(): Router {
        const router = new Router({prefix: '/api/v2/'});
        router
            .post('alerts', this.alerts.bind(this));
        return router;
    }

    /**
     *
     * @param {Application.Context} ctx
     * @returns {Promise<void>}
     * @private
     */
    private async alerts(ctx: Context): Promise<void> {
        const bus = Core.app().get<TacticianCommandBus>('command-bus')

        // const response = await bus.handle(new ProcessAlertsCommand(ctx.state.id, ctx.request.body as PrometheusAlertEntity[]))

        ctx.status = 500;
        ctx.body = {};
    }


}

container.register('ApiControllerInterface', PrometheusApiController)