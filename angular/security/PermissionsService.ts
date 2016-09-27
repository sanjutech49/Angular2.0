/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../ts/generated/viewModels.ts" />

module security {

    class PermissionsServices {

        static className = 'PermissionsServices';
        static $inject = ['apiRoot', '$http'];

        constructor(private apiRoot, private $http: ng.IHttpService) {
        }

    //    getPermission(userID: string): ng.IPromise<srv.IUserAccountsViewModel> {

    //        var url = this.apiRoot + 'User';

    //        return this.$http.get(url, { cache: true });
    //    }
    }
}