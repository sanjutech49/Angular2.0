/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../global/global.ts" />	
var util;
(function (util) {
    (function (ServiceResponseStatus) {
        ServiceResponseStatus[ServiceResponseStatus["Succeeded"] = 0] = "Succeeded";
        ServiceResponseStatus[ServiceResponseStatus["Failed"] = 1] = "Failed";
    })(util.ServiceResponseStatus || (util.ServiceResponseStatus = {}));
    var ServiceResponseStatus = util.ServiceResponseStatus;
    (function (ServiceEventStatus) {
        ServiceEventStatus[ServiceEventStatus["beforeCall"] = 0] = "beforeCall";
        ServiceEventStatus[ServiceEventStatus["afterCall"] = 1] = "afterCall";
    })(util.ServiceEventStatus || (util.ServiceEventStatus = {}));
    var ServiceEventStatus = util.ServiceEventStatus;
    var httpMethod;
    (function (httpMethod) {
        httpMethod[httpMethod["get"] = 0] = "get";
        httpMethod[httpMethod["post"] = 1] = "post";
        httpMethod[httpMethod["put"] = 2] = "put";
        httpMethod[httpMethod["delete"] = 3] = "delete";
    })(httpMethod || (httpMethod = {}));
    var httpUtil = (function () {
        function httpUtil(httpUIBlockService, $http, apiRoot) {
            var _this = this;
            this.httpUIBlockService = httpUIBlockService;
            this.$http = $http;
            this.apiRoot = apiRoot;
            this.request = function (callBack, serviceEventOrMesssge, errorHandler, config, successHandler) {
                return callBack(successHandler, errorHandler);
            };
            this.post = function (methodPath, data, serviceEventOrMesssge, errorHandler, config, successHandler) {
                var postFunc = function () {
                    return _this.$http.post(_this.apiRoot + methodPath, data, _this.setServiceHeader(config));
                };
                return _this.call(postFunc, serviceEventOrMesssge, errorHandler, config, successHandler);
            };
            this.defaultSuccessHandler = function (sr) { return sr.data.response; };
            this.get = function (methodPath, queryParams, serviceEventOrMesssge, errorHandler, config, successHandler) {
                var getFunc = function () {
                    return _this.$http.get(_this.apiRoot + methodPath, _this.setServiceHeader(config, queryParams));
                };
                return _this.call(getFunc, serviceEventOrMesssge, errorHandler, config, successHandler);
            };
            this.call = function (promiseFunc, serviceEventOrMesssge, errorHandler, config, successHandler) {
                // get the service event handler
                var serviceEvent = _this.getServiceEventHandler(serviceEventOrMesssge);
                var successHandlerWrapper = _this.getInternalSuccessHandler(serviceEvent, successHandler);
                // use the internal error handler if no handler is passed in
                var errorHandlerWrapper = _this.getInternalErrorHandler(serviceEvent, errorHandler);
                // this event handler is for UI or custom tasks that are called before and after the request
                serviceEvent(0 /* beforeCall */);
                return promiseFunc().then(function (response) { return successHandlerWrapper(response); }, function (response) { return errorHandlerWrapper(response); });
            };
            this.getServiceEventHandler = function (serviceEventOrMesssge) {
                if (!serviceEventOrMesssge)
                    return function (serviceEvent) {
                    };
                else if (typeof serviceEventOrMesssge === 'string')
                    return _this.httpUIBlockService.getServiceEventMethod(serviceEventOrMesssge);
                else
                    return serviceEventOrMesssge;
            };
            this.getInternalSuccessHandler = function (serviceEvent, successHandler) {
                // use the internal success handler if no handler is passed in
                //var successHandler = successHandler || this.defaultSuccessHandler;
                return function (serviceResponse) {
                    serviceEvent(1 /* afterCall */);
                    return successHandler(serviceResponse);
                };
            };
            this.getInternalErrorHandler = function (serviceEvent, errorHandler) {
                // use the internal error handler if no handler is passed in
                var errorHandler = errorHandler || _this.defaultErrorHandler;
                return function (data) {
                    serviceEvent(1 /* afterCall */);
                    return errorHandler(data);
                };
            };
            // TODO, we will inject the default error handler - add some sort of error handling
            this.defaultErrorHandler = function (data) {
                return data;
            };
            // TODO, we will the default serviceHeader
            this.setServiceHeader = function (config, queryParams) {
                queryParams = queryParams || {};
                config = config || {};
                config.params = queryParams;
                // set all service header here
                queryParams.CallTimestamp = Date.now();
                queryParams.UserID = 'Joker';
                return config;
            };
            this.getServiceHeader = function () {
                return { CallTimestamp: Date.now(), UserID: 'Joker' };
            };
        }
        httpUtil.$inject = ['HttpUIBlockService', '$http', 'apiRoot'];
        httpUtil.className = 'httpUtil';
        return httpUtil;
    })();
    util.httpUtil = httpUtil;
    moduleRegistration.registerService(moduleNames.services, httpUtil);
})(util || (util = {}));
//# sourceMappingURL=httpUtil.js.map