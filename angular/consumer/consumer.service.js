/// <reference path='../../Scripts/typings/angularjs/angular.d.ts'/>
/// <reference path="../ts/generated/viewModels.ts" />	
/// <reference path="../ts/extendedviewmodels/extendedviewmodels.ts" />
/// <reference path="../ts/generated/enums.ts" />
/// <reference path="../ts/lib/srvdef.ts" />
var docusign;
(function (docusign) {
    'use strict';
    docusignSVC.$inject = ['apiRoot', 'isSecureLinkTestMode', '$http', '$resource', '$q']; //apiRoot and isSecureLinkTestMode are app values loaded in consumer.module.ts
    function docusignSVC(apiRoot, isSecureLinkTestMode, $http, $resource, $q) {
        return new DocusignService(apiRoot, isSecureLinkTestMode, $http, $resource, $q);
    }
    var DocusignService = (function () {
        function DocusignService(apiRoot, isSecureLinkTestMode, $http, $resource, $q) {
            var _this = this;
            this.apiRoot = apiRoot;
            this.isSecureLinkTestMode = isSecureLinkTestMode;
            this.$http = $http;
            this.$resource = $resource;
            this.$q = $q;
            this.docusignSigningRoom = null;
            //isESigningComplete: boolean = false;
            this.showSuccessModal = false;
            this.m_authenticationContext = null;
            this.m_loanViewModel = null;
            this.AUTHENTICATION_ERROR_MSG = 'AUTHENTICATION_ERROR'; //error message
            this.EMPTY_GUID = "00000000-0000-0000-0000-000000000000"; //empty Guid constant
            this.useSessionStorage = false;
            //----------------------------------------------------------//
            //
            // Logging
            //
            //----------------------------------------------------------//
            this.log = function (value, messageType) {
                //aalt 2015-9-28 Log messages to the console if they are errors, otherwise hide them unless we are in test mode
                if (messageType === "error" || _this.isSecureLinkTestMode) {
                    console.log(value);
                }
            };
            this.removeAuthenticationContext = function () {
                _this.authenticationContext = null;
                _this.m_loanViewModel = null;
                //this.loanApp = null;
                if (_this.useSessionStorage) {
                    _this.removeFromSessionStorage(_this.AUTHENTICATION_CONTEXT_KEY); //Call this after to completely remove it, the line above resets it to null.
                    _this.removeFromSessionStorage(_this.LOAN_VIEW_MODEL_KEY);
                }
                return true;
            };
            //Saves the loanViewModel and returns the updated one.
            this.save = function () {
                var q = _this.$q.defer();
                alert('saving');
                var loanViewModel = _this.loanViewModel;
                loanViewModel.prepareSave();
                var userAccountId = _this.getUserAccountId();
                var url = 'loanex/MegaSave?userAccountId=' + userAccountId;
                _this.post(url, loanViewModel).then(
                //success
                function (response) {
                    if (response.ErrMsg == null) {
                        var loanViewModel = response;
                        _this.setLoanViewModel(loanViewModel);
                        //this.setAppState();
                        q.resolve(loanViewModel);
                    }
                    else {
                        q.reject(response);
                    }
                }, 
                //error
                function (error) {
                    q.reject(error);
                });
                return q.promise;
            };
            //Guaranteed to load the loanViewModel fresh from the server
            this.refreshLoanViewModel = function () {
                if (_this.m_authenticationContext == null) {
                    _this.log('authentication context not set', 'error');
                    return null;
                }
                var q = _this.$q.defer();
                var url = 'SecureLink/GetLoanViewModel';
                _this.post(url, _this.m_authenticationContext).then(function (response) {
                    var loanViewModel = response;
                    if (loanViewModel != null) {
                        this.setLoanViewModel(loanViewModel);
                        q.resolve(this.m_loanViewModel);
                    }
                    else {
                        q.reject(response);
                    }
                }.bind(_this), function (err) {
                    q.reject(err);
                }.bind(_this));
                return q.promise;
            };
            //Should be called only from the config to load the loan
            this.loadLoanViewModel = function () {
                var q = _this.$q.defer();
                var loanViewModel = _this.getLoanViewModel();
                if (loanViewModel != null) {
                    q.resolve(loanViewModel);
                    return q.promise;
                }
                else {
                    return _this.refreshLoanViewModel();
                }
            };
            //----------------------------------------------------------//
            //
            // Loan Utility Methods
            //
            //----------------------------------------------------------//
            this.getUserAccountId = function () {
                var authenticationContext = _this.getAuthenticationContext();
                if (authenticationContext != null) {
                    //always return primary borrowers userAccountId
                    return authenticationContext.borrower.userAccountId;
                }
                return null;
            };
            //returns a list of borrowers who have been authenticated but have not yet consented on the loanApp.
            this.getAuthenticatedButUnconsentedBorrowers = function (authContext, loanViewModel) {
                var borrowers = [];
                var loanApplicationId = authContext.loanApplicationId;
                var borrowerId = authContext.borrower.borrowerId;
                var coBorrowerId = authContext.coBorrower.borrowerId;
                var borrower = _this.getBorrower(loanViewModel, borrowerId);
                var coBorrower = _this.getCoBorrower(loanViewModel, coBorrowerId);
                var authenticatedBorrowers = _this.getAuthenticatedBorrowers(authContext, loanViewModel);
                for (var i = 0; i < authenticatedBorrowers.length; i++) {
                    var borrower = authenticatedBorrowers[i];
                    if (!_this.hasEConsented(borrower)) {
                        borrowers.push(borrower);
                    }
                }
                return borrowers;
            };
            this.haveAllBorrowersEConsented = function (authContext, loanViewModel) {
                var borrowerId = authContext.borrower.borrowerId;
                var coBorrowerId = authContext.coBorrower.borrowerId;
                var borrower = _this.getBorrower(loanViewModel, borrowerId);
                var coBorrower = _this.getCoBorrower(loanViewModel, coBorrowerId);
                var hasCoBorrower = _this.isCoBorrowerValid(coBorrower);
                return _this.hasEConsented(borrower) && (!hasCoBorrower || _this.hasEConsented(coBorrower));
            };
            this.haveAllAuthenticatedBorrowersEConsented = function (authContext, loanViewModel) {
                var borrowerId = authContext.borrower.borrowerId;
                var coBorrowerId = authContext.coBorrower.borrowerId;
                var borrower = _this.getBorrower(loanViewModel, borrowerId);
                var coBorrower = _this.getCoBorrower(loanViewModel, coBorrowerId);
                if (authContext.isContinueWithoutLogin) {
                    if (authContext.isBorrowerContinueWithout) {
                        return _this.hasEConsented(borrower);
                    }
                    else {
                        return _this.hasEConsented(coBorrower);
                    }
                }
                else {
                    return _this.haveAllBorrowersEConsented(authContext, loanViewModel);
                }
            };
            this.hasBorrowerEConsented = function (authContext, loanViewModel) {
                var borrowerId = authContext.borrower.borrowerId;
                var coBorrowerId = authContext.coBorrower.borrowerId;
                var borrower = _this.getBorrower(loanViewModel, borrowerId);
                return _this.hasEConsented(borrower);
            };
            this.hasCoBorrowerEConsented = function (authContext, loanViewModel) {
                var coBorrowerId = authContext.coBorrower.borrowerId;
                var coBorrower = _this.getCoBorrower(loanViewModel, coBorrowerId);
                return _this.hasEConsented(coBorrower);
            };
            this.hasEConsented = function (_borrower) {
                return (_borrower.eConsent.consentStatus === 1 /* Accept */);
            };
            this.isESigningComplete = function (authContext, loanViewModel) {
                var isESigningComplete = false;
                var loanApplicationId = authContext.loanApplicationId;
                var loanApp = _this.getActiveLoanApp(loanViewModel, loanApplicationId);
                if (loanApp != null) {
                    if (loanApp.eSign != null) {
                        _this.log(loanApp.eSign);
                        if (loanApp.eSign.signingStatus == 2) {
                            isESigningComplete = true;
                        }
                    }
                }
                return isESigningComplete;
            };
            this.getBorrower = function (loanViewModel, borrowerId) {
                var borrower = null;
                var transactionInfo = loanViewModel["transactionInfo"];
                var borrowers = transactionInfo.borrowers;
                return _.find(borrowers, function (item) {
                    return item.borrowerId.toLowerCase() === borrowerId.toLowerCase();
                });
            };
            this.getCoBorrower = function (loanViewModel, coBorrowerId) {
                var borrower = null;
                var transactionInfo = loanViewModel["transactionInfo"];
                var borrowers = transactionInfo.borrowers;
                return _.find(borrowers, function (item) {
                    return item.borrowerId.toLowerCase() === coBorrowerId.toLowerCase();
                });
            };
            this.getBorrowers = function (authContext, loanViewModel) {
                var borrowers = [];
                var borrowerId = authContext.borrower.borrowerId;
                var coBorrowerId = authContext.coBorrower.borrowerId;
                var borrower = _this.getBorrower(loanViewModel, borrowerId);
                var coBorrower = _this.getCoBorrower(loanViewModel, coBorrowerId);
                borrowers.push(borrower);
                if (_this.isCoBorrowerValid(coBorrower)) {
                    borrowers.push(coBorrower);
                }
                return borrowers;
            };
            this.getAuthenticatedBorrowers = function (authContext, loanViewModel) {
                var borrowers = [];
                var authBorrower = authContext.borrower;
                var authCoBorrower = authContext.coBorrower;
                var borrowerId = authContext.borrower.borrowerId;
                var coBorrowerId = authContext.coBorrower.borrowerId;
                var borrower = _this.getBorrower(loanViewModel, borrowerId);
                var coBorrower = _this.getCoBorrower(loanViewModel, coBorrowerId);
                if (authBorrower.isAuthenticated) {
                    borrowers.push(borrower);
                }
                if (authCoBorrower.isAuthenticated) {
                    borrowers.push(coBorrower);
                }
                return borrowers;
            };
            this.isCoBorrowerValid = function (coBorrower) {
                return coBorrower != null && coBorrower.borrowerId !== _this.EMPTY_GUID;
            };
            this.isCoBorrowerAuthenticated = function (coBorrower) {
                var authCoBorrower = _this.m_authenticationContext.coBorrower;
                return authCoBorrower.isAuthenticated;
            };
            this.isPrimaryApplication = function (authContext, loanViewModel) {
                var loanApplicationId = authContext.loanApplicationId;
                var loanApp = _this.getActiveLoanApp(loanViewModel, loanApplicationId);
                return loanApp.isPrimary;
            };
            //----------------------------------------------------------//
            //
            // Generic API Methods
            //
            //----------------------------------------------------------//
            this.get = function (url) {
                var q = _this.$q.defer();
                var fullUrl = _this.apiRoot + url;
                _this.log('GET ' + fullUrl);
                _this.$http.get(fullUrl).success(function (response) {
                    this.log(response);
                    if (response.ErrMsg == null) {
                        q.resolve(response);
                    }
                    else {
                        q.reject(response);
                    }
                }.bind(_this)).error(function (error) {
                    this.log(error, 'error');
                    q.reject(error);
                }.bind(_this));
                return q.promise;
            };
            this.getSync = function (url) {
                var q = _this.$q.defer();
                var fullUrl = _this.apiRoot + url;
                _this.log('GET ' + fullUrl);
                jQuery.ajax({
                    url: fullUrl,
                    success: function (response) {
                        this.log(response);
                        if (response.ErrMsg == null) {
                            q.resolve(response);
                        }
                        else {
                            q.reject(response);
                        }
                    }.bind(_this),
                    error: function (error) {
                        this.log(error, 'error');
                        q.reject(error);
                    }.bind(_this),
                    async: false
                });
                return q.promise;
            };
            this.post = function (url, data) {
                var q = _this.$q.defer();
                var fullUrl = _this.apiRoot + url;
                _this.log('POST ' + fullUrl);
                _this.$http.post(fullUrl, data).success(function (response) {
                    this.log(response);
                    if (response.ErrMsg == null) {
                        q.resolve(response);
                    }
                    else {
                        q.reject(response);
                    }
                }.bind(_this)).error(function (error) {
                    this.log(error, 'error');
                    q.reject(error);
                }.bind(_this));
                return q.promise;
            };
            //----------------------------------------------------------//
            //
            // Local Storage
            //
            //----------------------------------------------------------//
            ////Local Storage Wrapper around storejs
            ////  https://github.com/marcuswestin/store.js
            ////  Then Include this on the page <script src="~/Scripts/store/store.min.js"></script>
            ////  https://raw.githubusercontent.com/borisyankov/DefinitelyTyped/master/storejs/storejs.d.ts
            ////  /// <reference path="../../scripts/store/storejs.d.ts" />
            ////  set(key: string, value: any): any;
            ////  get(key: string): any;
            this.AUTHENTICATION_CONTEXT_KEY = "SecureLinkAuthenticationViewModel"; //Key for setting and getting AuthenticationContext from local storage
            this.LOAN_VIEW_MODEL_KEY = "SecureLinkLoanViewModel"; //Key for setting and getting AuthenticationContext from local storage
            //----------------------------------------------------------//
            //
            // Session Storage
            //
            //----------------------------------------------------------//
            ////Session Storage Wrapper around window.sessionStorage
            this.checkSessionStorage = function () {
                if (window.sessionStorage == null) {
                    _this.log('sessionStorage is not supported by the browser. Please disable "Private Mode", or upgrade to a modern browser.', 'error');
                    return false;
                }
                return true;
            };
            this.getFromSessionStorage = function (key) {
                if (_this.checkSessionStorage()) {
                    return JSON.parse(window.sessionStorage.getItem(key));
                }
            };
            this.setInSessionStorage = function (key, value) {
                if (_this.checkSessionStorage()) {
                    window.sessionStorage.setItem(key, JSON.stringify(value));
                }
            };
            this.removeFromSessionStorage = function (key) {
                if (_this.checkSessionStorage()) {
                    window.sessionStorage.removeItem(key);
                }
            };
            this.clearSessionStorage = function () {
                if (_this.checkSessionStorage()) {
                    window.sessionStorage.clear();
                }
            };
            //Set local properties from injected values and services
            this.useSessionStorage = this.isSecureLinkTestMode;
        }
        Object.defineProperty(DocusignService.prototype, "authenticationContext", {
            //----------------------------------------------------------//
            //
            // Authentication Context
            //
            //----------------------------------------------------------//
            //Get and Set methods for private member variables
            get: function () {
                return this.m_authenticationContext;
            },
            set: function (_authContext) {
                this.setAuthenticationContext(_authContext);
            },
            enumerable: true,
            configurable: true
        });
        DocusignService.prototype.getAuthenticationContext = function () {
            if (this.m_authenticationContext != null) {
                return this.m_authenticationContext;
            }
            // Try local storage.  e.g. if the user hits page refresh
            if (this.useSessionStorage) {
                var localStorage_AuthenticationContext = this.getFromSessionStorage(this.AUTHENTICATION_CONTEXT_KEY);
                if (localStorage_AuthenticationContext != null) {
                    this.m_authenticationContext = localStorage_AuthenticationContext;
                    return this.m_authenticationContext;
                }
            }
            //returning null means it could not be found!!!
            return null;
        };
        DocusignService.prototype.setAuthenticationContext = function (_authContext) {
            this.m_authenticationContext = _authContext;
            //Set the value in local storage
            if (this.useSessionStorage) {
                this.setInSessionStorage(this.AUTHENTICATION_CONTEXT_KEY, _authContext);
            }
        };
        //----------------------------------------------------------//
        //
        // Loan View Model
        //
        //----------------------------------------------------------//
        //This should be called once to get the loanViewModel from local storage if available
        DocusignService.prototype.getLoanViewModel = function () {
            if (this.m_loanViewModel != null) {
                return this.m_loanViewModel;
            }
            // Try local storage.  e.g. if the user hits page refresh
            if (this.useSessionStorage) {
                var localStorageObj = this.getFromSessionStorage(this.LOAN_VIEW_MODEL_KEY);
                if (localStorageObj != null) {
                    this.m_loanViewModel = localStorageObj;
                    return localStorageObj;
                }
            }
            //returning null means it could not be found!!!
            return null;
        };
        Object.defineProperty(DocusignService.prototype, "loanViewModel", {
            set: function (loanViewModel) {
                this.setLoanViewModel(loanViewModel);
            },
            enumerable: true,
            configurable: true
        });
        DocusignService.prototype.setLoanViewModel = function (loanViewModel) {
            this.m_loanViewModel = loanViewModel;
            //Set the value in local storage
            if (this.useSessionStorage) {
                this.setInSessionStorage(this.LOAN_VIEW_MODEL_KEY, loanViewModel);
            }
        };
        //This should be called once to get the loanViewModel from local storage if available
        DocusignService.prototype.getActiveLoanApp = function (loanViewModel, loanApplicationId) {
            var transactionInfo = loanViewModel["transactionInfo"];
            var loanApps = transactionInfo.loanApplications;
            if (loanApps.length === 1) {
                return loanApps[0];
            }
            else {
                return _.find(loanApps, function (item) {
                    return item.loanApplicationId.toLowerCase() === loanApplicationId.toLowerCase(); //remember to match on case as well, since 71abfb15-1a36-43ba-8e2c-726d79964814 != 71ABFB15-1A36-43BA-8E2C-726D79964814.
                });
            }
        };
        return DocusignService;
    })();
    angular.module('docusign').factory('docusignSVC', docusignSVC);
})(docusign || (docusign = {}));
//# sourceMappingURL=consumer.service.js.map