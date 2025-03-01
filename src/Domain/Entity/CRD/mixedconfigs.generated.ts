// /!\ WARNING :  THIS FILE IS AUTOGENERATED FROM A KUBERNETES CUSTOM RESOURCE DEFINITION FILE. DO NOT CHANGE IT, use crd-client-generator-ts to update it.
import {CustomObjectsApi} from "@kubernetes/client-node/dist/gen/api/customObjectsApi";

export type Result<T> = T | { error: any };

export type V1alpha1MixedConfig = {
  apiVersion: string;
  kind: string;
  metadata: {
    name?: string;
    namespace?: string;
    annotations?: {};
    labels?: {};
    resourceVersion?: string;
    generation?: number;
    deletionTimestamp?: string;
    deletionGracePeriodSeconds?: string;
    creationTimestamp?: string;
  };
  spec: {
    globalClustersRefs?: Array<string>;
    users?: Array<{
      name: string;
      password: string;
      canLoginWithPassword?: boolean;
      tags?: string;
      permissions?: Array<{
        vhost: string;
        readRegexp?: string;
        writeRegexp?: string;
        configureRegexp?: string;
      }>;
      topicPermissions?: Array<{
        vhost: string;
        exchange?: string;
        readRegexp?: string;
        writeRegexp?: string;
      }>;
    }>;
    vhosts?: Array<{
      name: string;
      description?: string;
      tags?: string;
      defaultQueueType?: "classic" | "quorum" | "stream";
    }>;
  };
  status: {
    conditions?: Array<{
      type?: string;
      status?: string;
      lastUpdatedTime?: string;
      reason?: string;
      message?: string;
    }>;
  };
};
export type V1alpha1undefined = {
  body: { items: V1alpha1MixedConfig[] };
};

export class V1alpha1MixedConfigClient {
  public constructor(private customObjects: CustomObjectsApi) {}
  public async getV1alpha1undefined(
    namespace: string
  ): Promise<Result<V1alpha1undefined>> {
    try {
      return await this.customObjects
        .listNamespacedCustomObject(
          "rabbitmq-admin.io",
          "undefined",
          namespace,
          "mixedconfigs"
        )
        .then((res) => {
          return res.body;
        })
        .catch((data) => {
          return data;
        });
    } catch (error) {
      return { error };
    }
  }

  public async getV1alpha1MixedConfig(
    namespace: string,
    V1alpha1MixedConfigName: string
  ): Promise<Result<V1alpha1MixedConfig>> {
    try {
      return await this.customObjects
        .getNamespacedCustomObject(
          "rabbitmq-admin.io",
          "undefined",
          namespace,
          "mixedconfigs",
          V1alpha1MixedConfigName
        )
        .then((res) => {
          return res.body;
        })
        .catch((data) => {
          return data;
        });
    } catch (error) {
      return { error };
    }
  }

  public async deleteV1alpha1MixedConfig(
    namespace: string,
    V1alpha1MixedConfigName: string
  ) {
    try {
      return await this.customObjects
        .deleteNamespacedCustomObject(
          "rabbitmq-admin.io",
          "undefined",
          namespace,
          "mixedconfigs",
          V1alpha1MixedConfigName
        )
        .then((res) => {
          return res.body;
        })
        .catch((data) => {
          return data;
        });
    } catch (error) {
      return { error };
    }
  }

  public async createV1alpha1MixedConfig(
    namespace: string,
    body: V1alpha1MixedConfig
  ): Promise<Result<V1alpha1MixedConfig>> {
    try {
      return await this.customObjects
        .createNamespacedCustomObject(
          "rabbitmq-admin.io",
          "undefined",
          namespace,
          "mixedconfigs",
          body
        )
        .then((res) => {
          return res.body;
        })
        .catch((data) => {
          return data;
        });
    } catch (error) {
      return { error };
    }
  }

  public async patchV1alpha1MixedConfig(
    namespace: string,
    V1alpha1MixedConfigName: string,
    body: Partial<V1alpha1MixedConfig>
  ): Promise<Result<V1alpha1MixedConfig>> {
    try {
      return await this.customObjects
        .patchNamespacedCustomObject(
          "rabbitmq-admin.io",
          "undefined",
          namespace,
          "mixedconfigs",
          V1alpha1MixedConfigName,
          body
        )
        .then((res) => {
          return res.body;
        })
        .catch((data) => {
          return data;
        });
    } catch (error) {
      return { error };
    }
  }
}
