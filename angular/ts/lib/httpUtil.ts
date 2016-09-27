/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../global/global.ts" />	

module util {

    export enum ServiceResponseStatus {
        Succeeded = 0,
        Failed = 1
    }

    export interface CallBack<T, TResult> {
        (value: T): TResult;
    }

    export interface SuccessResponseCallBack<T> {
        (response: ng.IHttpPromiseCallbackArg<ServiceResponse<T>>): ng.IPromise<T>|T;
    }

    export interface ErrorResponseCallBack {
        (response: ng.IHttpPromiseCallbackArg<ServiceResponse<any>>): ng.IPromise<any>|any;
    }

    export interface ServiceHeader {
        CallTimestamp: number;
        ServiceDuration?: number;
        UserID: string;
        CallingIP?: string;
    }

    export interface ServiceResponse<T> {
        response: T;
        status: ServiceResponseStatus;
        header: ServiceHeader;
        errorMsg: string;
        exception: string;
    }

    interface ServiceInput<T> {
        Header: ServiceHeader;
        Input: T;
    }

    export enum ServiceEventStatus {
        beforeCall,
        afterCall
    }

    export interface ServiceEvent {
        (serviceEventStatus: ServiceEventStatus): void;
    }

    enum httpMethod {
        get,
        post,
        put,
        delete
    }

    export class httpUtil {

        static $inject = ['HttpUIBlockService', '$http', 'apiRoot'];
        static className = 'httpUtil';

        constructor(private httpUIBlockService: HttpUIBlockService, private $http: ng.IHttpService, private apiRoot) {
        }

        request = <T>(callBack:(successHandler: SuccessResponseCallBack<T>, errorHandler: ErrorResponseCallBack) => ng.IPromise<T>, serviceEventOrMesssge?: ServiceEvent|string, errorHandler?: ErrorResponseCallBack, config?: ng.IRequestShortcutConfig, successHandler?: SuccessResponseCallBack<T>): ng.IPromise<T> => {

            return callBack(successHandler, errorHandler);
        }

        post = <T>(methodPath: string, data: any, serviceEventOrMesssge?: ServiceEvent|string, errorHandler?: ErrorResponseCallBack, config?: ng.IRequestShortcutConfig, successHandler?: SuccessResponseCallBack<T>): ng.IPromise<T> => {

            var postFunc = (): ng.IHttpPromise<ServiceResponse<T>> => {
                return this.$http.post<ServiceResponse<T>>(this.apiRoot + methodPath, data, this.setServiceHeader(config));
            };

            return this.call(postFunc, serviceEventOrMesssge, errorHandler, config, successHandler);
        }

        defaultSuccessHandler = <T>(sr: any): T => sr.data.response;

        get = <T>(methodPath: string, queryParams?: any, serviceEventOrMesssge?: ServiceEvent|string, errorHandler?: ErrorResponseCallBack, config?: ng.IRequestShortcutConfig, successHandler?: SuccessResponseCallBack<T>): ng.IPromise<T> => {

            var getFunc = (): ng.IHttpPromise<ServiceResponse<T>> => {
                return this.$http.get<ServiceResponse<T>>(this.apiRoot + methodPath, this.setServiceHeader(config, queryParams));
            };

            return this.call(getFunc, serviceEventOrMesssge, errorHandler, config, successHandler);
        }

        private call = <T>(promiseFunc: () => ng.IHttpPromise<ServiceResponse<T>>, serviceEventOrMesssge?: ServiceEvent|string, errorHandler?: ErrorResponseCallBack, config?: ng.IRequestShortcutConfig, successHandler?: SuccessResponseCallBack<T>): ng.IPromise<T> => {

            // get the service event handler
            var serviceEvent: ServiceEvent = this.getServiceEventHandler(serviceEventOrMesssge);

            var successHandlerWrapper = this.getInternalSuccessHandler(serviceEvent, successHandler);

            // use the internal error handler if no handler is passed in
            var errorHandlerWrapper: ErrorResponseCallBack = this.getInternalErrorHandler(serviceEvent, errorHandler);

            // this event handler is for UI or custom tasks that are called before and after the request
            serviceEvent(ServiceEventStatus.beforeCall);

            return promiseFunc().then(response => successHandlerWrapper(response), response => errorHandlerWrapper(response));
        }

        private getServiceEventHandler = (serviceEventOrMesssge: ServiceEvent|string): ServiceEvent => {

            if (!serviceEventOrMesssge) // if null, return an empty function
                return serviceEvent => {};
            else if (typeof serviceEventOrMesssge === 'string')
                return this.httpUIBlockService.getServiceEventMethod(serviceEventOrMesssge);
            else
                return serviceEventOrMesssge;
        }

        private getInternalSuccessHandler = <T>(serviceEvent: ServiceEvent, successHandler: SuccessResponseCallBack<T>): SuccessResponseCallBack<T> => {

            // use the internal success handler if no handler is passed in
            //var successHandler = successHandler || this.defaultSuccessHandler;

            return serviceResponse => {
                serviceEvent(ServiceEventStatus.afterCall);
                return successHandler(serviceResponse);
            };
        }

        private getInternalErrorHandler = (serviceEvent: ServiceEvent, errorHandler: ErrorResponseCallBack): ErrorResponseCallBack => {

            // use the internal error handler if no handler is passed in
            var errorHandler = errorHandler || this.defaultErrorHandler;

            return data => {
                serviceEvent(ServiceEventStatus.afterCall);
                return errorHandler(data);
            };
      }

        // TODO, we will inject the default error handler - add some sort of error handling
        private defaultErrorHandler = data => {
            return data;
        }

        // TODO, we will the default serviceHeader
        private setServiceHeader = (config: ng.IRequestShortcutConfig, queryParams?: any): ng.IRequestShortcutConfig => {

            queryParams = queryParams || {};
            config = config || {};
            config.params = queryParams;

            // set all service header here
            queryParams.CallTimestamp = Date.now();
            queryParams.UserID = 'Joker';
            return config;
        }

        private getServiceHeader = (): ServiceHeader => {
            return { CallTimestamp: Date.now(), UserID: 'Joker' };
        }
    }

    moduleRegistration.registerService(moduleNames.services, httpUtil);
}


