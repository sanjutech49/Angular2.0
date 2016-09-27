// This file (LiabilityService.ts - ver 1.0) has been has been automatically generated, do not modify! 
/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	
var srv;
(function (srv) {
    var LiabilityService = (function () {
        function LiabilityService(httpUtil) {
            var _this = this;
            this.httpUtil = httpUtil;
            this.ApplyCommentLiabilityGeneric = function (debtViewModel, userAccountId, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LiabilityService/ApplyCommentLiability'; }
                return _this.httpUtil.post(methodPath, { debtViewModel: debtViewModel, userAccountId: userAccountId }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.ApplyCommentLiability = function (debtViewModel, userAccountId, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LiabilityService/ApplyCommentLiability'; }
                return _this.ApplyCommentLiabilityGeneric(debtViewModel, userAccountId, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.ApplyCommentCollectionGeneric = function (debtViewModel, userAccountId, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LiabilityService/ApplyCommentCollection'; }
                return _this.httpUtil.post(methodPath, { debtViewModel: debtViewModel, userAccountId: userAccountId }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.ApplyCommentCollection = function (debtViewModel, userAccountId, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LiabilityService/ApplyCommentCollection'; }
                return _this.ApplyCommentCollectionGeneric(debtViewModel, userAccountId, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.ApplyCommentPublicRecordGeneric = function (publicRecordViewModel, userAccountId, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LiabilityService/ApplyCommentPublicRecord'; }
                return _this.httpUtil.post(methodPath, { publicRecordViewModel: publicRecordViewModel, userAccountId: userAccountId }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.ApplyCommentPublicRecord = function (publicRecordViewModel, userAccountId, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LiabilityService/ApplyCommentPublicRecord'; }
                return _this.ApplyCommentPublicRecordGeneric(publicRecordViewModel, userAccountId, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.CreateLiabilityRecordsGeneric = function (debtAccountOwnershipType, borrowerId, secondaryBorrowerId, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LiabilityService/CreateLiabilityRecords'; }
                return _this.httpUtil.get(methodPath, { debtAccountOwnershipType: debtAccountOwnershipType, borrowerId: borrowerId, secondaryBorrowerId: secondaryBorrowerId }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.CreateLiabilityRecords = function (debtAccountOwnershipType, borrowerId, secondaryBorrowerId, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LiabilityService/CreateLiabilityRecords'; }
                return _this.CreateLiabilityRecordsGeneric(debtAccountOwnershipType, borrowerId, secondaryBorrowerId, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.ConvertLiabilityOwnershipGeneric = function (debtVm, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LiabilityService/ConvertLiabilityOwnership'; }
                return _this.httpUtil.post(methodPath, { debtVm: debtVm }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.ConvertLiabilityOwnership = function (debtVm, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LiabilityService/ConvertLiabilityOwnership'; }
                return _this.ConvertLiabilityOwnershipGeneric(debtVm, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.ApplyCommentReoGeneric = function (pledgedAssetVm, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LiabilityService/ApplyCommentReo'; }
                return _this.httpUtil.post(methodPath, { pledgedAssetVm: pledgedAssetVm }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.ApplyCommentReo = function (pledgedAssetVm, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LiabilityService/ApplyCommentReo'; }
                return _this.ApplyCommentReoGeneric(pledgedAssetVm, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.RefreshPledgedAssetsGeneric = function (realEstateVm, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LiabilityService/RefreshPledgedAssets'; }
                return _this.httpUtil.post(methodPath, { realEstateVm: realEstateVm }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.RefreshPledgedAssets = function (realEstateVm, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LiabilityService/RefreshPledgedAssets'; }
                return _this.RefreshPledgedAssetsGeneric(realEstateVm, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
        }
        LiabilityService.className = 'LiabilityService';
        LiabilityService.$inject = ['httpUtil'];
        return LiabilityService;
    })();
    srv.LiabilityService = LiabilityService;
})(srv || (srv = {}));
moduleRegistration.registerService(moduleNames.services, srv.LiabilityService);
//# sourceMappingURL=LiabilityService.js.map