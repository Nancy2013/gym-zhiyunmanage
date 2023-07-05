
interface resposeType<T = unknown> {
    data: T;
    message: string;
    success: boolean | string;
    [par: string]: any;
}

interface requestType<T = unknown> {
    baseURL?: string;
    url: string;
    type?: string;
    data?: T;
    params?: T;
    method?: string;
    headers?: T;
    timeout?: number;
    responseType?: T,
    isDownload?: boolean
    /**
     * 是否不校验code
     */
    notCheck?: boolean
    /**
     * 是否不传递token
     */
    notToken?: boolean
}

interface pendingType<T = unknown> {
   url?: string;
   method?: string;
   params: T;
   data: T;
   cancel: Function
}

declare module 'js-md5';