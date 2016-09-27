(function () {
	'use strict';
    angular.module('loanApplication')
		.controller('personalController', personalController);

    personalController.$inject = ['$log', '$scope', '$modal', '$modalStack', 'personalSvc', 'BroadcastSvc', 'simpleModalWindowFactory', 'modalPopoverFactory', 'NavigationSvc',
        'wrappedLoan', 'isVisible', 'manageAccountService', 'controllerData', 'applicationData', 'personalUtilities', '$state', '$timeout'];

    function personalController($log, $scope, $modal,$modalStack, personalSvc, BroadcastSvc, simpleModalWindowFactory, modalPopoverFactory, NavigationSvc,
        wrappedLoan, isVisible, manageAccountService, controllerData, applicationData, personalUtilities, $state, $timeout) {
		var vm = this;
		//properties
		vm.wrappedLoan = wrappedLoan;
        vm.controllerData = controllerData;
        vm.applicationData = applicationData;

        vm.toggleTabs = toggleTabs;
       
		vm.phoneFunctions = [];
		//vm.wrappedLoan.ref.active.switchCoBorrowerToBorrower = false;
        vm.showPersonalTab = false;
        vm.showErrorMessage = false;	
        vm.openOnEmailBlur = [];
        vm.openOnEmailBlur.opened = false;

		vm.isVisible = isVisible.value;

        //TO DO: move from server side       

		//Controller methods
		vm.showCitizenshipModal = showCitizenshipModal;
        vm.onUSCitizenChange = onUSCitizenChange;
		vm.onPermanentAlienChange = onPermanentAlienChange;
		vm.onMaritalStatusActionChanged = onMaritalStatusActionChanged;
		vm.onIsSpouseOnTheLoanChange = onIsSpouseOnTheLoanChange;
		vm.onIsSpouseOnTheTitleChange = onIsSpouseOnTheTitleChange;		
		vm.populateCoBorrowerEmail = populateCoBorrowerEmail;
		vm.onTitleHeldInChange = onTitleHeldInChange;		
		//vm.collapseExpand = collapseExpand;
		vm.showNamesAndManner = showNamesAndManner;
		vm.onEnterPress = onEnterPress;
		vm.getHowDidYouHearAboutUsData = getHowDidYouHearAboutUsData();

		vm.manageAccountsModal = manageAccountsModal;
		vm.onEmailBlur = onEmailBlur;
		vm.validatePermanentAlien = validatePermanentAlien;
		vm.setCbSectionWhenEmailIsEmpty = setCbSectionWhenEmailIsEmpty;
		vm.closeAllModals = closeAllModals();

		vm.hasError = hasError;
		vm.startsWithProspect = startsWithProspect;
		vm.cleanupUsername = cleanupUsername;

		function cleanupUsername(userAccount) {
		    if (startsWithProspect(userAccount.username))
		        userAccount.username = '';
		}
		function startsWithProspect(username) {
		    return (!common.string.isNullOrWhiteSpace(username) && username.startsWith('newprospect'));
		}

		$scope.$watch(function () {
		    return wrappedLoan.ref.active.getCoBorrower().userAccount.username + wrappedLoan.ref.active.getBorrower().userAccount.username;
		}, function (){
		    if (!!wrappedLoan.ref.active.getBorrower().userAccount.username)
		        cleanupUsername(wrappedLoan.ref.active.getBorrower().userAccount);
		    if (wrappedLoan.ref.active.getCoBorrower()) {
		        if (!!wrappedLoan.ref.active.getCoBorrower().userAccount.username)
		            cleanupUsername(wrappedLoan.ref.active.getCoBorrower().userAccount);
		    }
		});

		function hasError(userAccount) {
		    if (!userAccount) return false;
		    var hasError = vm.wrappedLoan.ref.sixPiecesAcquiredForAllLoanApplications && userAccount.isOnlineUser && userAccount.username.trim() == "";
		    return hasError;
		}

		function getHowDidYouHearAboutUsData() {
		    if (vm.wrappedLoan.ref.loanId == null) {
		        personalSvc.getHowDidYouHearAboutUsData.get({ loanId: '00000000-0000-0000-0000-000000000000', useraccountId: vm.applicationData.currentUserId })
                 .$promise.then(function (data) {
                     vm.applicationData.lookup.howDidYouHearAboutUsList = data.howDidYouHearAboutUsList;
                 },
                function (error) {
                    console.log(error);
                });
		    }
		    else if (vm.applicationData.lookup.howDidYouHearAboutUsList.length == 0) {
		        personalSvc.getHowDidYouHearAboutUsData.get({ loanId: vm.wrappedLoan.ref.loanId, useraccountId: vm.applicationData.currentUserId })
                 .$promise.then(function (data) {
                     vm.applicationData.lookup.howDidYouHearAboutUsList = data.howDidYouHearAboutUsList;
		        },
                function (error) {
                    console.log(error);
		        });
		    }
		}


		function closeAllModals() {
		    $modalStack.dismissAll('close');
		}

		function setCbSectionWhenEmailIsEmpty()
		{		  
		    if (!vm.wrappedLoan.ref.active.getCoBorrower().userAccount.username || vm.wrappedLoan.ref.active.getCoBorrower().userAccount.username.trim() == '') {
		        vm.wrappedLoan.ref.active.getBorrower().maritalStatus = -1;
		        vm.wrappedLoan.ref.active.isCoBorrowerSectionShown = false;
		        vm.wrappedLoan.ref.active.isSpouseOnTheLoan = false;
		    }
		}

		function toggleTabs() {
		    NavigationSvc.LoanAppTabs.all.isDisabled = vm.wrappedLoan.ref.active.areTabsDisabled();
		}

		function validatePermanentAlien(permanentAlien) {
		    if (permanentAlien)
		        return '0 -19px';
		    else if (!permanentAlien && vm.wrappedLoan.ref.sixPiecesAcquiredForAllLoanApplications)
		        return '0 -38px';
		    else
		        return '0 0px';
		}

		

        function onUSCitizenChange($event) {
            var checkbox = $event.target;
		    if (checkbox.id == "cbBorrowerCitizen") {
		        if (!checkbox.checked)
		            vm.wrappedLoan.ref.active.getBorrower().permanentAlien = true;
		        else
		            vm.wrappedLoan.ref.active.getBorrower().permanentAlien = false;
		    }
		    else if (checkbox.id == "cbCoBorrowerCitizen") {
		        if (!checkbox.checked)
		            vm.wrappedLoan.ref.active.getCoBorrower().permanentAlien = true;
		        else
		            vm.wrappedLoan.ref.active.getCoBorrower().permanentAlien = false;
            }
        };

        loadPersonalDataOnInit();
		function onPermanentAlienChange($event) {
			var checkbox = $event.target;
			if (!checkbox.checked) {
				showCitizenshipModal();
			}
		};

		function onEnterPress($event) {
            //32 for sapce and 13 for enter
		    if ($event.keyCode == 13 || $event.keyCode == 32) {
		        var id = $event.currentTarget.firstElementChild.id;
		        var event = {};
		        event.target = $event.target.firstElementChild;
		        switch(id) {
		            case "cbBorrowerTwoYearsOnJob":
		                vm.wrappedLoan.ref.active.getBorrower().isEmployedTwoYears = !vm.wrappedLoan.ref.active.getBorrower().isEmployedTwoYears;
		                break;
		            case "cbCoBorrowerTwoYearsOnJob": 
		                vm.wrappedLoan.ref.active.getCoBorrower().isEmployedTwoYears = !vm.wrappedLoan.ref.active.getCoBorrower().isEmployedTwoYears;
		                break;
		            case "cbBorrowerCitizen":
		                vm.wrappedLoan.ref.active.getBorrower().usCitizen = !vm.wrappedLoan.ref.active.getBorrower().usCitizen;
		                event.target.checked = vm.wrappedLoan.ref.active.getBorrower().uSCitizen;
		                vm.onUSCitizenChange(event);
		                break;
                    case "cbCoBorrowerCitizen":
                        vm.wrappedLoan.ref.active.getCoBorrower().usCitizen = !vm.wrappedLoan.ref.active.getCoBorrower().usCitizen;
                        event.target.checked = vm.wrappedLoan.ref.active.getCoBorrower().uSCitizen;
		                vm.onUSCitizenChange(event);
		                break;
		            case "cbBorrowerPermanentResidentAlien":
		                vm.wrappedLoan.ref.active.getBorrower().permanentAlien = !vm.wrappedLoan.ref.active.getBorrower().permanentAlien;
		                event.target.checked = vm.wrappedLoan.ref.active.getBorrower().permanentAlien;
		                vm.onPermanentAlienChange(event);
		                break;
		            case "cbCoBorrowerPermanentResidentAlien":
		                vm.wrappedLoan.ref.active.getCoBorrower().permanentAlien = !vm.wrappedLoan.ref.active.getCoBorrower().permanentAlien;
		                event.target.checked = vm.wrappedLoan.ref.active.getCoBorrower().permanentAlien;
		                vm.onPermanentAlienChange(event);
		                break;
		        }
		    }
		    if ($event.keyCode == 32) $event.preventDefault();
		};

		function showCitizenshipModal() {
			var modalInstance = $modal.open({
				templateUrl: 'angular/loanapplication/personal/citizenshipmodal.html',
				controller: function ($scope, $modalInstance) {
					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};
				},
				size: 'sm',
				resolve: {
					items: function () {
						//return $scope.items;
					}
				}
			});
		}; 

        function loadPersonalDataOnInit() {

            vm.showPersonalTab = true;
            vm.showErrorMessage = false;           
            vm.disableFields = false;
            
            vm.wrappedLoan.ref.active.getBorrower().originalUsername = vm.wrappedLoan.ref.active.getBorrower().username;

            vm.wrappedLoan.ref.active.getCoBorrower().maritalStatus = vm.wrappedLoan.ref.active.getBorrower().maritalStatus;

            showNamesAndManner();
            populateCoBorrowerEmail();
            toggleTabs();
            // Now we always have loanId
            if ($state.current.name == 'loanCenter.loan.loanScenario.sections' && vm.wrappedLoan.ref.loanAmount == 0)
                vm.wrappedLoan.ref.active.isBorrowerSectionShown = false;
            else
                vm.wrappedLoan.ref.active.isBorrowerSectionShown = true;
		}

		function onMaritalStatusActionChanged(triggerTitleChange) {
			//when marrital status is changed, set coBorrowers status to match borrowers for "switch" functionality purpose
		    vm.wrappedLoan.ref.active.getCoBorrower().maritalStatus = vm.wrappedLoan.ref.active.getBorrower().maritalStatus;

            vm.wrappedLoan.ref.active.triggerMaritalStatusRules();
            populateCoBorrowerEmail();
            accountStatus();
			//pre-select the fields for Title Information section
			if (triggerTitleChange)
				onTitleHeldInChange();
			else
				showNamesAndManner();
		};
		
		function onIsSpouseOnTheLoanChange(triggerTitleChange) {
            
		    vm.wrappedLoan.ref.active.onIsSpouseOnTheLoanChange(triggerTitleChange);
		  
		    toggleTabs();

		    populateCoBorrowerEmail();

			if (triggerTitleChange)
				onTitleHeldInChange();
			else
			    showNamesAndManner();

			accountStatus();

			vm.wrappedLoan.ref.areSixPiecesAcquiredForAllLoanApplications();
		};
		
		function populateCoBorrowerEmail() {
		    if (vm.wrappedLoan.ref.active.getCoBorrower().userAccount.username == "" || vm.wrappedLoan.ref.active.getCoBorrower().userAccount.username == null) {
		        vm.wrappedLoan.ref.active.getCoBorrower().userAccount.username = vm.wrappedLoan.ref.active.getBorrower().userAccount.username;
		        vm.wrappedLoan.ref.active.getCoBorrower().userAccount.originalUsername = vm.wrappedLoan.ref.active.getBorrower().userAccount.username;
		    }
		}

		function onIsSpouseOnTheTitleChange() {
		    vm.wrappedLoan.ref.active.titleInfo.namesOnTitle = personalUtilities.getBorrowerAndCoBorrowerNames(vm.wrappedLoan.ref.active.getBorrower(), vm.wrappedLoan.ref.active.getCoBorrower(), vm.wrappedLoan.ref.active.isSpouseOnTheLoan, vm.wrappedLoan.ref.active.isSpouseOnTheTitle, vm.wrappedLoan.ref.active.titleInfo.nameOfPartner);
		};

		function onTitleHeldInChange() {
		    vm.wrappedLoan.ref.active.showNamesAndManner = personalUtilities.onTitleHeldInChange(vm.wrappedLoan.ref.active);
		}

		function showNamesAndManner() {
            if (vm.wrappedLoan.ref.active.titleInfo.titleHeldIn == 0) {
                vm.wrappedLoan.ref.active.showNamesAndManner = true;
                vm.wrappedLoan.ref.active.titleInfo.namesOnTitle = personalUtilities.getBorrowerAndCoBorrowerNames(vm.wrappedLoan.ref.active.getBorrower(), vm.wrappedLoan.ref.active.getCoBorrower(), vm.wrappedLoan.ref.active.isSpouseOnTheLoan, vm.wrappedLoan.ref.active.isSpouseOnTheTitle, vm.wrappedLoan.ref.active.titleInfo.nameOfPartner);
			}
			else {
                vm.wrappedLoan.ref.active.showNamesAndManner = false;
                vm.wrappedLoan.ref.active.titleInfo.namesOnTitle = "";
			}
		}

		function onEmailBlur(borrowerInfo, username) {
		    if (username != null && username.trim() === '') {
		        accountStatus();
		        return;
		    }
		    vm.openOnEmailBlur.opened = true;
		    vm.openOnEmailBlur.isCoBorrower = borrowerInfo.isCoBorrower;
		    manageAccountService.existingUser(vm.wrappedLoan, borrowerInfo.userAccount.username, borrowerInfo.isCoBorrower, null, accountStatus);
		}

		function accountStatus() {
		    if (vm.wrappedLoan.ref.active.isSpouseOnTheLoan) {
		        vm.wrappedLoan.ref.active.getCoBorrower().userAccount.isCoBorrower = true;
		    }
		     
		    var openModel = vm.openOnEmailBlur.isCoBorrower ?vm.wrappedLoan.ref.active.getCoBorrower().userAccount:vm.wrappedLoan.ref.active.getBorrower().userAccount;
		    vm.openOnEmailBlur.opened = vm.openOnEmailBlur.opened && !openModel.isOnlineUser && (vm.wrappedLoan.ref.active.getBorrower().userAccount.username != vm.wrappedLoan.ref.active.getCoBorrower().userAccount.username && vm.openOnEmailBlur.isCoBorrower || !vm.openOnEmailBlur.isCoBorrower);

		    if (vm.openOnEmailBlur.opened) {
		        var element = vm.openOnEmailBlur.isCoBorrower ? document.getElementById('coborrowerEmail') : document.getElementById('borrowerEmail');
		        $timeout(function () {
		            element.click();
		            vm.openOnEmailBlur.opened = false;
		        }, 10); 
		        
		    }

		}
         
		function manageAccountsModal(model, isCoBorrower, event) {
		    if (model.username == null || model.username == undefined || model.username.trim() === '') {
		        return;
		    }

            //next conditions are for joint account
		    if (isCoBorrower && model.username == vm.wrappedLoan.ref.active.getBorrower().userAccount.username && !(model.userAccountId > 0)) {
		        model = angular.copy(vm.wrappedLoan.ref.active.getBorrower().userAccount);
		        model.userAccountId = 0;

		    } else if (vm.wrappedLoan.ref.active.getBorrower().userAccount.username ==
                vm.wrappedLoan.ref.active.getCoBorrower().userAccount.originalUsername && !(model.userAccountId > 0)) {
		        var username = model.username;
		        model = new cls.UserAccountViewModel();
		        model.username = username;
		        model.originalUsername = username;
		        model.isOnlineUser = false;
		        model.userAccountId = 0;
		    }
		    model.isCoBorrower = isCoBorrower;

		    var manageUserAccount = new cls.ManageUserAccountsViewModel();
		    manageUserAccount.userAccount = model;
		    if (vm.openOnEmailBlur.opened)
		    {
		        manageUserAccount.automaticallyOpen = true;
		    }
		    var confirmationPopup = manageAccountService.openManageAccount(vm.wrappedLoan, manageUserAccount, event, accountStatus, vm.applicationData);
		    confirmationPopup.result.then(function () {
		     
		    });  
			 
		}
	}

})();