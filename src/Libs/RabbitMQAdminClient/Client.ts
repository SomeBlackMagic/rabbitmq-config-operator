import axios, {AxiosInstance, AxiosRequestConfig} from "axios";
import * as https from "node:https";

export default class Client {

    protected axiosInstance: AxiosInstance;

    public constructor(
        private host:string,
        private user:string,
        private pass:string,
        private isHttps: boolean = true,
        private skipTLSVerify: boolean = false,
        private axiosConfig:AxiosRequestConfig = {},
    ) {
        axiosConfig.httpsAgent = new https.Agent({
            rejectUnauthorized: this.skipTLSVerify
        });
        axiosConfig.baseURL = (isHttps ? 'https' : 'http') + '://' + this.host  + '/api';
        axiosConfig.auth = {
            username: this.user,
            password: this.pass
        }
        this.axiosInstance = axios.create(axiosConfig);
    }

    public async getOverview(): Promise<getOverviewResponse> {
        return await this.axiosInstance.get('/overview').then(res => {
            return res.data;
        })
    }
}

export interface getOverviewResponse {
    management_version: string
    rates_mode: string
    sample_retention_policies: object
    exchange_types: object[]
    product_version: string
    product_name: string
    rabbitmq_version: string
    cluster_name: string
    erlang_version: string
    erlang_full_version: string
    release_series_support_status: string
    disable_stats: boolean
    enable_queue_totals: boolean
    message_stats: object
    churn_rates:  object
    queue_totals:  object
    object_totals:  object
    statistics_db_event_queue: number
    node: string
    listeners: object[]
    contexts: object[]
}