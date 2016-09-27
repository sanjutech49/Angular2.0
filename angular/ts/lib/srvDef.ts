/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />

module srvDef {

    export enum ServiceResponseStatus {
        Succeeded = 0,
        Failed = 1
    }

    export interface callBack<T, TResult> {
        (value: T): TResult;
    }

    export interface serviceResponseCallBack<T> extends callBack<ServiceResponse<T>, T> {
    }

    export interface ServiceHeader {
    }

    export interface ServiceResponse<T> {
        Response: T;
        Status: ServiceResponseStatus;
        Header: ServiceHeader;
        ErrorMsg: string;
        Exception: string;
    }

    var getServiceHeader = (): ServiceHeader => {
        return {};
    }

    export class ServiceBase<T> {

        static $inject = ['$location', '$http'];

        constructor(private $location: ng.ILocationService, private $http: ng.IHttpService) {
        }

        post(methodName: string, data: any, successHandler?: serviceResponseCallBack<T>, errorHandler?: serviceResponseCallBack<T>, config?: ng.IRequestShortcutConfig): ng.IPromise<T> {

            // add the service header to the call
            data.header = getServiceHeader();

            // add default errorHandler here
            if (errorHandler == null) {
            }

            // add a default successhander if not is passed in
            if (successHandler == null)
                successHandler = (sr: ServiceResponse<T>) => sr.Response;

            return this.$http.post<ServiceResponse<T>>(methodName, data, config).then(r => r.data.Status == ServiceResponseStatus.Succeeded ? successHandler(r.data) : errorHandler(r.data), r=> errorHandler(r.data));
        }

        get(methodName: string, data: any, successHandler: serviceResponseCallBack<T>, errorHandler?: serviceResponseCallBack<T>, config?: ng.IRequestShortcutConfig): ng.IPromise<T> {

            if (errorHandler == null) {
                // add default errorHandler here
            }

            if (data != null) {
                config = config || {};
                config.params = data;
            }

            return this.$http.get<ServiceResponse<T>>(methodName, config).
                then(r => r.data.Status == ServiceResponseStatus.Succeeded ? successHandler(r.data) : errorHandler(r.data), r => errorHandler(r.data));
        }
    }
}