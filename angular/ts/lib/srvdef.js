/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
var srvDef;
(function (srvDef) {
    (function (ServiceResponseStatus) {
        ServiceResponseStatus[ServiceResponseStatus["Succeeded"] = 0] = "Succeeded";
        ServiceResponseStatus[ServiceResponseStatus["Failed"] = 1] = "Failed";
    })(srvDef.ServiceResponseStatus || (srvDef.ServiceResponseStatus = {}));
    var ServiceResponseStatus = srvDef.ServiceResponseStatus;
    var getServiceHeader = function () {
        return {};
    };
    var ServiceBase = (function () {
        function ServiceBase($location, $http) {
            this.$location = $location;
            this.$http = $http;
        }
        ServiceBase.prototype.post = function (methodName, data, successHandler, errorHandler, config) {
            // add the service header to the call
            data.header = getServiceHeader();
            // add default errorHandler here
            if (errorHandler == null) {
            }
            // add a default successhander if not is passed in
            if (successHandler == null)
                successHandler = function (sr) { return sr.Response; };
            return this.$http.post(methodName, data, config).then(function (r) { return r.data.Status == 0 /* Succeeded */ ? successHandler(r.data) : errorHandler(r.data); }, function (r) { return errorHandler(r.data); });
        };
        ServiceBase.prototype.get = function (methodName, data, successHandler, errorHandler, config) {
            if (errorHandler == null) {
            }
            if (data != null) {
                config = config || {};
                config.params = data;
            }
            return this.$http.get(methodName, config).then(function (r) { return r.data.Status == 0 /* Succeeded */ ? successHandler(r.data) : errorHandler(r.data); }, function (r) { return errorHandler(r.data); });
        };
        ServiceBase.$inject = ['$location', '$http'];
        return ServiceBase;
    })();
    srvDef.ServiceBase = ServiceBase;
})(srvDef || (srvDef = {}));
//# sourceMappingURL=srvdef.js.map