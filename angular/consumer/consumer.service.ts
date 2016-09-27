/// <reference path='../../Scripts/typings/angularjs/angular.d.ts'/>
/// <reference path="../ts/generated/viewModels.ts" />	
/// <reference path="../ts/extendedviewmodels/extendedviewmodels.ts" />
/// <reference path="../ts/generated/enums.ts" />
/// <reference path="../ts/lib/srvdef.ts" />


module docusign {
    'use strict';

    export interface IDocusignService {

        //constants
        EMPTY_GUID: string;
        
        //GeneralSettings and Methods
        log(value: any, messageType?: string): void;

        //AuthenticationContext methods
        authenticationContext: cls.SecureLinkAuthenticationViewModel;       //has accessor methods defined
        getAuthenticationContext(): cls.SecureLinkAuthenticationViewModel;  //This should be called once to initialize
        removeAuthenticationContext(): boolean;                             //Removes all authentication from the app.
        getUserAccountId(): number;

        //LoanViewModel
        save(): ng.IPromise<cls.LoanViewModel>;          //Saves the loanViewModel and returns the updated one.
        loadLoanViewModel(): ng.IPromise<cls.LoanViewModel>; //a method that will load the loanViewModel.
        refreshLoanViewModel(): ng.IPromise<cls.LoanViewModel>; //This will pull the data from the server guaranteed
        

        //Loan Utility Methods
        getBorrowers(authContext: cls.SecureLinkAuthenticationViewModel, loanViewModel: cls.LoanViewModel): srv.IBorrowerViewModel[];
        getAuthenticatedBorrowers(authContext: cls.SecureLinkAuthenticationViewModel, loanViewModel: cls.LoanViewModel): srv.IBorrowerViewModel[];
        getAuthenticatedButUnconsentedBorrowers(authContext: cls.SecureLinkAuthenticationViewModel, loanViewModel: cls.LoanViewModel): srv.IBorrowerViewModel[]; //returns a list of borrowers who have been authenticated but have not yet consented on the loanApp.
        isCoBorrowerValid(coBorrower: srv.IBorrowerViewModel);
        haveAllBorrowersEConsented(authContext: cls.SecureLinkAuthenticationViewModel, loanViewModel: cls.LoanViewModel): boolean;
        haveAllAuthenticatedBorrowersEConsented(authContext: cls.SecureLinkAuthenticationViewModel, loanViewModel: cls.LoanViewModel): boolean;
        hasBorrowerEConsented(authContext: cls.SecureLinkAuthenticationViewModel, loanViewModel: cls.LoanViewModel): boolean;
        hasCoBorrowerEConsented(authContext: cls.SecureLinkAuthenticationViewModel, loanViewModel: cls.LoanViewModel): boolean;
        isPrimaryApplication(authContext: cls.SecureLinkAuthenticationViewModel, loanViewModel: cls.LoanViewModel): boolean;

        //Docusign Variables
        docusignSigningRoom: any; //This is a variable so we can pass the url from the EInstructionController to the eSigningRoom controller.
        isESigningComplete(authContext: cls.SecureLinkAuthenticationViewModel, loanViewModel: cls.LoanViewModel): boolean;
        showSuccessModal: boolean;

        //Generic API Methods
        get<T>(url: string): ng.IPromise<T>;
        post<T>(url: string, data: any): ng.IPromise<T>;

        //SessionStorage
        getFromSessionStorage<T>(key: string): T;
        setInSessionStorage(key: string, value: any): void;
        removeFromSessionStorage(key: string): void;
        clearSessionStorage(): void;

    }

    docusignSVC.$inject = ['apiRoot', 'isSecureLinkTestMode', '$http', '$resource', '$q'];  //apiRoot and isSecureLinkTestMode are app values loaded in consumer.module.ts

    function docusignSVC(apiRoot: string, isSecureLinkTestMode: boolean, $http: ng.IHttpService, $resource: ng.resource.IResourceService, $q: ng.IQService): IDocusignService {
        return new DocusignService(apiRoot, isSecureLinkTestMode, $http, $resource, $q);
    }

    class DocusignService implements IDocusignService {
        constructor(
            private apiRoot: string,
            private isSecureLinkTestMode: boolean,
            private $http: ng.IHttpService,
            private $resource: ng.resource.IResourceService,
            private $q: ng.IQService) {
            //Set local properties from injected values and services
            this.useSessionStorage = this.isSecureLinkTestMode
        }

        docusignSigningRoom: any = null;
        //isESigningComplete: boolean = false;
        showSuccessModal: boolean = false;

        private m_authenticationContext: cls.SecureLinkAuthenticationViewModel = null;
        private m_loanViewModel: cls.LoanViewModel = null;

        private AUTHENTICATION_ERROR_MSG: string = 'AUTHENTICATION_ERROR';//error message
        public EMPTY_GUID: string = "00000000-0000-0000-0000-000000000000";//empty Guid constant

        private useSessionStorage: boolean = false;
        
        //----------------------------------------------------------//
        //
        // Logging
        //
        //----------------------------------------------------------//

        log = (value: any, messageType?: string): void => {
            //aalt 2015-9-28 Log messages to the console if they are errors, otherwise hide them unless we are in test mode
            if (messageType === "error" || this.isSecureLinkTestMode) {
                console.log(value);
            }
        }


        //----------------------------------------------------------//
        //
        // Authentication Context
        //
        //----------------------------------------------------------//

        //Get and Set methods for private member variables
        get authenticationContext(): cls.SecureLinkAuthenticationViewModel {
            return this.m_authenticationContext;
        }

        getAuthenticationContext(): cls.SecureLinkAuthenticationViewModel {
            if (this.m_authenticationContext != null) {
                return this.m_authenticationContext;
            }

            // Try local storage.  e.g. if the user hits page refresh
            if (this.useSessionStorage) {
                var localStorage_AuthenticationContext = this.getFromSessionStorage<cls.SecureLinkAuthenticationViewModel>(this.AUTHENTICATION_CONTEXT_KEY);
                if (localStorage_AuthenticationContext != null) {
                    this.m_authenticationContext = localStorage_AuthenticationContext;
                    return this.m_authenticationContext;
                }
            }

            //returning null means it could not be found!!!
            return null;
        }

        set authenticationContext(_authContext: cls.SecureLinkAuthenticationViewModel) {
            this.setAuthenticationContext(_authContext);
        }

        private setAuthenticationContext(_authContext: cls.SecureLinkAuthenticationViewModel): void {
            this.m_authenticationContext = _authContext;
            //Set the value in local storage
            if (this.useSessionStorage) {
                this.setInSessionStorage(this.AUTHENTICATION_CONTEXT_KEY, _authContext);
            }
        }

        removeAuthenticationContext = (): boolean => {
            this.authenticationContext = null;
            this.m_loanViewModel = null;
            //this.loanApp = null;
            if (this.useSessionStorage) {
                this.removeFromSessionStorage(this.AUTHENTICATION_CONTEXT_KEY); //Call this after to completely remove it, the line above resets it to null.
                this.removeFromSessionStorage(this.LOAN_VIEW_MODEL_KEY);
            }
            return true;
        }
      


        //----------------------------------------------------------//
        //
        // Loan View Model
        //
        //----------------------------------------------------------//

        //This should be called once to get the loanViewModel from local storage if available
        private getLoanViewModel(): cls.LoanViewModel {
            if (this.m_loanViewModel != null) {
                return this.m_loanViewModel;
            }

            // Try local storage.  e.g. if the user hits page refresh
            if (this.useSessionStorage) {
                var localStorageObj = this.getFromSessionStorage<cls.LoanViewModel>(this.LOAN_VIEW_MODEL_KEY);
                if (localStorageObj != null) {
                    this.m_loanViewModel = localStorageObj;
                    return localStorageObj;
                }
            }

            //returning null means it could not be found!!!
            return null;
        }

        set loanViewModel(loanViewModel: cls.LoanViewModel) {
            this.setLoanViewModel(loanViewModel);
        }

        private setLoanViewModel(loanViewModel: cls.LoanViewModel): void {
            this.m_loanViewModel = loanViewModel;
            
            //Set the value in local storage
            if (this.useSessionStorage) {
                this.setInSessionStorage(this.LOAN_VIEW_MODEL_KEY, loanViewModel);
            }
        }

        //Saves the loanViewModel and returns the updated one.
        save = (): ng.IPromise<cls.LoanViewModel> => {
            var q = this.$q.defer();

            alert('saving');
            var loanViewModel = this.loanViewModel;
            loanViewModel.prepareSave();
            var userAccountId = this.getUserAccountId();
            var url = 'loanex/MegaSave?userAccountId=' + userAccountId;
            this.post(url, loanViewModel).then(
                //success
                (response: any) => {
                    if (response.ErrMsg == null) {
                        var loanViewModel = response;
                        this.setLoanViewModel(loanViewModel);
                        //this.setAppState();
                        q.resolve(loanViewModel);
                    } else {
                        q.reject(response);
                    }
                },
                //error
                (error) => {
                    q.reject(error);
                });

            return q.promise;
        }

        //Guaranteed to load the loanViewModel fresh from the server
        refreshLoanViewModel = (): ng.IPromise<cls.LoanViewModel> => {
            if (this.m_authenticationContext == null) {
                this.log('authentication context not set', 'error');
                return null;
            }
            var q = this.$q.defer();
            var url = 'SecureLink/GetLoanViewModel';
            this.post(url, this.m_authenticationContext).then(function (response) {
                var loanViewModel = response;
                if (loanViewModel != null) {
                    this.setLoanViewModel(loanViewModel);
                    q.resolve(this.m_loanViewModel);
                } else {
                    q.reject(response);
                }
            }.bind(this), function (err) {
                    q.reject(err);
                }.bind(this));
            return q.promise;
        }

        //Should be called only from the config to load the loan
        loadLoanViewModel = (): ng.IPromise<cls.LoanViewModel> => {
            var q = this.$q.defer();
            var loanViewModel = this.getLoanViewModel();
            if (loanViewModel != null) {
                q.resolve(loanViewModel);
                return q.promise;
            } else {
                return this.refreshLoanViewModel();
            }
        }

        //----------------------------------------------------------//
        //
        // Loan Utility Methods
        //
        //----------------------------------------------------------//

        getUserAccountId = (): number => {
            var authenticationContext = this.getAuthenticationContext();
            if (authenticationContext != null) {
                //always return primary borrowers userAccountId
                return authenticationContext.borrower.userAccountId;
            }
            return null;
        }

        //returns a list of borrowers who have been authenticated but have not yet consented on the loanApp.
        getAuthenticatedButUnconsentedBorrowers = (authContext: cls.SecureLinkAuthenticationViewModel, loanViewModel: cls.LoanViewModel): srv.IBorrowerViewModel[]=> {
            var borrowers: srv.IBorrowerViewModel[] = [];

            var loanApplicationId = authContext.loanApplicationId;
            var borrowerId = authContext.borrower.borrowerId;
            var coBorrowerId = authContext.coBorrower.borrowerId;
            var borrower = this.getBorrower(loanViewModel, borrowerId);
            var coBorrower = this.getCoBorrower(loanViewModel, coBorrowerId);
            var authenticatedBorrowers = this.getAuthenticatedBorrowers(authContext, loanViewModel);

            for (var i = 0; i < authenticatedBorrowers.length; i++) {
                var borrower = authenticatedBorrowers[i];
                if (!this.hasEConsented(borrower)) {
                    borrowers.push(borrower);
                }
            }
            return borrowers;
        }

        haveAllBorrowersEConsented = (authContext: cls.SecureLinkAuthenticationViewModel, loanViewModel: cls.LoanViewModel): boolean => {
            var borrowerId = authContext.borrower.borrowerId;
            var coBorrowerId = authContext.coBorrower.borrowerId;
            var borrower = this.getBorrower(loanViewModel, borrowerId);
            var coBorrower = this.getCoBorrower(loanViewModel, coBorrowerId);
            var hasCoBorrower = this.isCoBorrowerValid(coBorrower);

            return this.hasEConsented(borrower) && (!hasCoBorrower || this.hasEConsented(coBorrower));
        }

        haveAllAuthenticatedBorrowersEConsented = (authContext: cls.SecureLinkAuthenticationViewModel, loanViewModel: cls.LoanViewModel): boolean => {
            var borrowerId = authContext.borrower.borrowerId;
            var coBorrowerId = authContext.coBorrower.borrowerId;
            var borrower = this.getBorrower(loanViewModel, borrowerId);
            var coBorrower = this.getCoBorrower(loanViewModel, coBorrowerId);

            if (authContext.isContinueWithoutLogin) {
                if (authContext.isBorrowerContinueWithout) {
                    return this.hasEConsented(borrower);
                } else {
                    return this.hasEConsented(coBorrower);
                }
            } else {
                return this.haveAllBorrowersEConsented(authContext, loanViewModel);
            }
        }

        hasBorrowerEConsented = (authContext: cls.SecureLinkAuthenticationViewModel, loanViewModel: cls.LoanViewModel): boolean => {
            var borrowerId = authContext.borrower.borrowerId;
            var coBorrowerId = authContext.coBorrower.borrowerId;
            var borrower = this.getBorrower(loanViewModel, borrowerId);

            return this.hasEConsented(borrower);
        }

        hasCoBorrowerEConsented = (authContext: cls.SecureLinkAuthenticationViewModel, loanViewModel: cls.LoanViewModel): boolean => {
            var coBorrowerId = authContext.coBorrower.borrowerId;
            var coBorrower = this.getCoBorrower(loanViewModel, coBorrowerId);
            return this.hasEConsented(coBorrower);
        }

        hasEConsented = (_borrower: srv.IBorrowerViewModel): boolean => {
            return (_borrower.eConsent.consentStatus === srv.ConsentStatusEnum.Accept);
        }


        isESigningComplete = (authContext: cls.SecureLinkAuthenticationViewModel, loanViewModel: cls.LoanViewModel): boolean => {
            var isESigningComplete: boolean = false;
            var loanApplicationId = authContext.loanApplicationId;
            var loanApp = this.getActiveLoanApp(loanViewModel, loanApplicationId);
            if (loanApp != null) {
                if (loanApp.eSign != null) {
                    this.log(loanApp.eSign);
                    if (loanApp.eSign.signingStatus == 2) {
                        isESigningComplete = true;
                    }
                }
            }
            return isESigningComplete;
        }

        private getBorrower = (loanViewModel: cls.LoanViewModel, borrowerId: string): srv.IBorrowerViewModel => {
            var borrower: srv.IBorrowerViewModel = null;
            var transactionInfo = loanViewModel["transactionInfo"];
            var borrowers = transactionInfo.borrowers;
            return _.find(borrowers, function (item: any) {
                return item.borrowerId.toLowerCase() === borrowerId.toLowerCase();
            });
        }

        private getCoBorrower = (loanViewModel: cls.LoanViewModel, coBorrowerId: string): srv.IBorrowerViewModel=> {
            var borrower: srv.IBorrowerViewModel = null;
            var transactionInfo = loanViewModel["transactionInfo"];
            var borrowers = transactionInfo.borrowers;
            return _.find(borrowers, function (item: any) {
                return item.borrowerId.toLowerCase() === coBorrowerId.toLowerCase();
            });
        }

        getBorrowers = (authContext: cls.SecureLinkAuthenticationViewModel, loanViewModel: cls.LoanViewModel): srv.IBorrowerViewModel[]=> {
            var borrowers: srv.IBorrowerViewModel[] = [];
            var borrowerId = authContext.borrower.borrowerId;
            var coBorrowerId = authContext.coBorrower.borrowerId;
            var borrower = this.getBorrower(loanViewModel, borrowerId);
            var coBorrower = this.getCoBorrower(loanViewModel, coBorrowerId);

            borrowers.push(borrower);

            if (this.isCoBorrowerValid(coBorrower)) {
                borrowers.push(coBorrower);
            }
            return borrowers;
        }

        getAuthenticatedBorrowers = (authContext: cls.SecureLinkAuthenticationViewModel, loanViewModel: cls.LoanViewModel): srv.IBorrowerViewModel[]=> {
            var borrowers: srv.IBorrowerViewModel[] = [];
            var authBorrower = authContext.borrower;
            var authCoBorrower = authContext.coBorrower;
            var borrowerId = authContext.borrower.borrowerId;
            var coBorrowerId = authContext.coBorrower.borrowerId;
            var borrower = this.getBorrower(loanViewModel, borrowerId);
            var coBorrower = this.getCoBorrower(loanViewModel, coBorrowerId);
            if (authBorrower.isAuthenticated) {
                borrowers.push(borrower);
            }
            if (authCoBorrower.isAuthenticated) {
                borrowers.push(coBorrower);
            }
            return borrowers;
        }

        //This should be called once to get the loanViewModel from local storage if available
        private getActiveLoanApp(loanViewModel: cls.LoanViewModel, loanApplicationId: string): srv.ILoanApplicationViewModel {
            var transactionInfo = loanViewModel["transactionInfo"];
            var loanApps = transactionInfo.loanApplications;

            if (loanApps.length === 1) {
                return loanApps[0];
            }
            else {
                return _.find(loanApps, function (item: any) {
                    return item.loanApplicationId.toLowerCase() === loanApplicationId.toLowerCase(); //remember to match on case as well, since 71abfb15-1a36-43ba-8e2c-726d79964814 != 71ABFB15-1A36-43BA-8E2C-726D79964814.
                });
            }
        }

        isCoBorrowerValid = (coBorrower: srv.IBorrowerViewModel) => {
            return coBorrower != null && coBorrower.borrowerId !== this.EMPTY_GUID;
        }

        private isCoBorrowerAuthenticated = (coBorrower: srv.IBorrowerViewModel) => {
            var authCoBorrower = this.m_authenticationContext.coBorrower;
            return authCoBorrower.isAuthenticated;
        }


        isPrimaryApplication = (authContext: cls.SecureLinkAuthenticationViewModel, loanViewModel: cls.LoanViewModel) => {
            var loanApplicationId = authContext.loanApplicationId;
            var loanApp = this.getActiveLoanApp(loanViewModel, loanApplicationId);
            return loanApp.isPrimary;
        }

        
        //----------------------------------------------------------//
        //
        // Generic API Methods
        //
        //----------------------------------------------------------//


        get = <T>(url: string): ng.IPromise<T> => {
            var q = this.$q.defer();
            var fullUrl = this.apiRoot + url;
            this.log('GET ' + fullUrl);

            this.$http.get(fullUrl).success(function (response: any) {
                this.log(response);
                if (response.ErrMsg == null) {
                    q.resolve(response);
                } else {
                    q.reject(response);
                }
            }.bind(this)).error(function (error) {
                this.log(error, 'error');
                q.reject(error);
            }.bind(this));

            return q.promise;
        }

        getSync = <T>(url: string): ng.IPromise<T> => {
            var q = this.$q.defer();
            var fullUrl = this.apiRoot + url;
            this.log('GET ' + fullUrl);

            jQuery.ajax({
                url: fullUrl,
                success: function (response) {
                    this.log(response);
                    if (response.ErrMsg == null) {
                        q.resolve(response);
                    } else {
                        q.reject(response);
                    }
                }.bind(this),
                error: function (error) {
                    this.log(error, 'error');
                    q.reject(error);
                }.bind(this),
                async: false
            });

            return q.promise;
        }

        post = <T>(url: string, data: any): ng.IPromise<T> => {
            var q = this.$q.defer();

            var fullUrl = this.apiRoot + url;
            this.log('POST ' + fullUrl);
            this.$http.post(fullUrl, data).success(function (response: any) {
                this.log(response);
                if (response.ErrMsg == null) {
                    q.resolve(response);
                } else {
                    q.reject(response);
                }
            }.bind(this)).error(function (error) {
                this.log(error, 'error');
                q.reject(error);
            }.bind(this));

            return q.promise;
        }
        
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
        private AUTHENTICATION_CONTEXT_KEY = "SecureLinkAuthenticationViewModel"; //Key for setting and getting AuthenticationContext from local storage
        private LOAN_VIEW_MODEL_KEY = "SecureLinkLoanViewModel"; //Key for setting and getting AuthenticationContext from local storage
        
        //----------------------------------------------------------//
        //
        // Session Storage
        //
        //----------------------------------------------------------//
        
        ////Session Storage Wrapper around window.sessionStorage
        private checkSessionStorage = (): boolean => {
            if (window.sessionStorage == null) {
                this.log('sessionStorage is not supported by the browser. Please disable "Private Mode", or upgrade to a modern browser.', 'error');
                return false;
            }
            return true;
        }
        getFromSessionStorage = <T>(key: string): T => {
            if (this.checkSessionStorage()) {
                return JSON.parse(window.sessionStorage.getItem(key));
            }
        }
        setInSessionStorage = (key: string, value: any): void => {
            if (this.checkSessionStorage()) {
                window.sessionStorage.setItem(key, JSON.stringify(value));
            }
        }
        removeFromSessionStorage = (key: string): void => {
            if (this.checkSessionStorage()) {
                window.sessionStorage.removeItem(key);
            }
        }
        clearSessionStorage = (): void => {
            if (this.checkSessionStorage()) {
                window.sessionStorage.clear();
            }
        }

    }


    angular.module('docusign').factory('docusignSVC', docusignSVC);
}