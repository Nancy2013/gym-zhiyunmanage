import { _RouteRecordBase } from 'vue-router';

declare module 'vue-router'{
    interface _RouteRecordBase {
        icon?: string,
        title?: string,
        level?: number
    }
}