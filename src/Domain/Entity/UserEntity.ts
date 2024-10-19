export type UserEntity = {
    name: string;
    password: string;
    canLoginWithPassword?: boolean;
    tags?: string;
    permissions?: UserPermissionType[];
    topicPermissions?: TopicPermissionsType[];
}

export type UserPermissionType = {
    vhost: string;
    readRegexp?: string;
    writeRegexp?: string;
    configureRegexp?: string;
}

export type TopicPermissionsType = {
    vhost: string;
    exchange?: string;
    readRegexp?: string;
    writeRegexp?: string;
}

