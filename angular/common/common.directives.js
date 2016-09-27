var impDirectives = angular.module('iMP.Directives', ['common', 'ui.bootstrap.dateparser']);



angular.module('iMP.Directives').directive('impCreditCardCheck', impCreditCardCheck);


function impCreditCardCheck() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attributes, ngModel) {

            function creditCardCheck(creditCardNumber) {
                var isValidCreditCard = function (ccNumber) {
                    var ccNumberLength = ccNumber.length,
                        mul = 0,
                        prodArr = [
                            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                            [0, 2, 4, 6, 8, 1, 3, 5, 7, 9]
                        ],
                        sum = 0;

                    if (ccNumberLength < 16 || ccNumberLength > 16) {
                        return false;
                    }

                    while (ccNumberLength--) {
                        sum += prodArr[mul][parseInt(ccNumber.charAt(ccNumberLength), 10)];
                        mul ^= 1;
                    }
                    return sum % 10 === 0 && sum > 0;
                };

                ngModel.$setValidity('imp-credit-card-check', isValidCreditCard(creditCardNumber)); //This works!

                return creditCardNumber;
            }

            ngModel.$parsers.push(creditCardCheck);
            ngModel.$formatters.push(creditCardCheck);
        },
    };
}

angular.module('iMP.Directives').directive('impAutofocus', impAutofocus);

/**
* @desc Focuses element on load.
*/
function impAutofocus($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            if (attrs.impAutofocus !== "false") {
                $timeout(function () {
                    element[0].focus();
                });        
            }
        }
    }
}

angular.module('iMP.Directives').directive('impRefocus', impRefocus);

/**
* @desc Refocuses element after html renders and sets cursor at the end of the field.
*/
function impRefocus($timeout) {
    return {
        restrict: 'A',
        terminal: true,
        transclude: true,
        link: function (scope, element, attrs) {
            var refocus = scope.$eval(attrs.impRefocus);
            var isminus = scope.$eval(attrs.impIsMinus);
            if (!refocus)
                return;

            $timeout(function () {
              
                var strLength = element[0].value.length * 2;
                element[0].focus();
                element[0].setSelectionRange(strLength, strLength);

                if (isminus)
                    element[0].value = "-";
            });
        }
    };
}

/**
* @desc Set top position of content container based on contextual bar container height
*/
impDirectives.directive('setBodyContainerPosition', function ($timeout, NavigationSvc) {
    return {       
        restrict: 'A',
        scope: {          
        },
        link: function (scope, element) {
            NavigationSvc.setBodyPosition();          
        }  
    };
});

impDirectives.directive('impIconInfo', function () {
    return {
        restrict: 'E',
        scope: {
            hasValue: '=?'
        },
        link: function (scope, element) {

            // Set default flag to true if hasValue is not specified.
            if (angular.isUndefined(scope.hasValue))
                scope.hasValue = true;

            scope.flag = scope.hasValue;

        },
        template:
            '<div ng-class="{\'imp-icon-info-on\': hasValue, \'imp-icon-info-off\': !hasValue}"></div>'
    };
});

impDirectives.directive('impPopover', function ($http, $templateCache, $compile, $timeout) {

    return {
        restrict: 'A',
        scope: true,
        compile: function (tElem, tAttrs) {
            // Add bootstrap tooltip directive.
            if (!tElem.attr('tooltip-html-unsafe')) {
                tElem.attr('tooltip-html-unsafe', '{{tooltip}}');
            }
            return function (scope, element, attrs) {
                function loadTemplate() {
                    var factory = angular.element('<div></div>');
                    // Get the template html.
                    $http.get(attrs.impPopover, { cache: $templateCache }).success(function (result) {
                        factory.html(result);
                        $compile(factory)(scope);
                        $timeout(function () {
                            scope.tooltip = factory.html();
                        });
                    });
                }
                // Remove our direcive to avoid infinite loop.
                element.removeAttr('imp-popover');
                // Compile this element to attach tooltip binding.
                $compile(element)(scope);

                // Watch model to recompile the tooltip.
                if (attrs.hasOwnProperty("watch")) {
                    scope.$watch(attrs.watch, function () {
                        loadTemplate();
                    }, true);
                } else {
                    loadTemplate();
                }
            };
        }
    };
});

impDirectives.directive('impLockPopup', function (modalPopoverFactory, loanService) {
    return {
        restrict: 'E',
        bindToController: true,
        controller: function () {
            this.getLock = function (loanId, userAccountId, event) {
                loanService.lazyLoad(srv.lazyLoadControllerName.loanLockHistory, loanId, userAccountId).success(function (data) {
                    loan.lockHistory = data.loanLockHistoryList;
                    modalPopoverFactory.openModalPopover('angular/contextualbar/details/lockhistory.html', {}, loan.lockHistory, event);
                }).
                error(function (error) {
                    console.error('Error on lock history lazy load. Error: ' + String(error));
                });
            };
            
        },
        link: function (scope, element, attrs, controller) {
            element.on('click', function (event) {
                controller.getLock(attrs.loanid, attrs.useraccountid, event);
            });
        }
    };
});

impDirectives.directive("impNavSearch", function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            model: '=',
            submit: '&',
            clear: '&'
        },
        templateUrl: 'angular/navigation/search.html'
    };
});

// This directive is used for a drop-down list based on the EnumerationValue list.
impDirectives.directive("impOptions", function () {
    return {
        restrict: "E",
        scope: {
            options: '=',
            model: '=',
            change: '&',
            focus: '&',
            disabled: '=',
        },
        template:
            '<select ng-model="model" ng-change="change()" ng-focus="focus()" ng-disabled="disabled" class="imp-ddl" style="width:135px;">' +
              '<option ng-repeat="option in options | orderBy:\'Code\'" ng-disabled="option.isDisabled" ng-selected="model.EnumerationValueId == option.EnumerationValueId" ng-value="option">{{ option.Description }}</option>' +
            '</select>'
    };
});

impDirectives.directive("impLoanPositionBanner", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            color: '@',
            number: '@'
        },
        link: function (scope, element) {
            var ctx = element[0].getContext('2d');

            drawLoanPositionBanner(ctx, scope.color, scope.number);
        },
        template:
        '<canvas class="imp-loan-position-banner" width="27" height="18"></canvas>'
    };
});

impDirectives.directive("impLock", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            color: '@',
            number: '@'
        },
        link: function (scope, element) {
            var ctx = element[0].getContext('2d');

            scope.$watch(
                function (scope) {

                    return scope.number;
                },
                function (newValue) {
                    drawLock(ctx, scope.color, newValue);
                }
            );

            scope.$watch(
                function (scope) {

                    return scope.color;
                },
                function (newValue) {
                    drawLock(ctx, newValue, scope.number);
                }
            );
        },
        template:
        '<canvas class="imp-lock" width="25" height="25" ></canvas>'
    };
});

impDirectives.directive("impCircle", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            size: '@',
            color: '@',
            lineColor: '@',
            isPlus: '@',
            hoverColor: '@'
        },
        link: function (scope, element) {
            var ctx = element[0].getContext('2d');

            drawMinusPlus(ctx, scope.color, scope.lineColor, scope.isPlus, scope.size);

            if (scope.isPlus === 'false' && scope.hoverColor) {
                element.bind('mouseover', function () {
                    drawMinusPlus(ctx, scope.hoverColor, scope.lineColor, scope.isPlus, scope.size);
                });
                element.bind('mouseout', function () {
                    drawMinusPlus(ctx, scope.color, scope.lineColor, scope.isPlus, scope.size);
                });
            }
        },
        template:
        '<canvas width="26" height="26" class="imp-circle"></canvas>'
    };
});

impDirectives.directive("impTriangle", function () {
    return {
        restrict: "E",
        replace: true,
        link: function (scope, element) {
            var ctx = element[0].getContext('2d');

            drawSubTabTriangle(ctx, "#1FAC58");
        },
        template:
        '<canvas class="canvas" style="display: block;"  height="15" width="15"></canvas>'
    };
});

impDirectives.directive('impTabset', function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        controller: function ($scope) {
            $scope.templateUrl = '';
            var tabs = $scope.tabs = [];
            var controller = this;

            this.selectTab = function (tab) {
                if (tab.manageSelectedState){
                if (tab.isDisabled !== true) {
                    angular.forEach(tabs, function (t) {
                        t.isSelected = false;
                    });
                    tab.isSelected = true;
                }
                }
            };

            this.setTabTemplate = function (templateUrl) {
                $scope.templateUrl = templateUrl;
            };

            this.addTab = function (tab) {
                if (tab.manageSelectedState) {
                if (tab.isSelected === true) {
                    controller.selectTab(tab);
                }
                else if (tabs.length === 0) {
                    controller.selectTab(tab);
                }
                }
                tabs.push(tab);
            };
        },
        templateUrl: function (tElement, tAttrs) {
            return tAttrs.tabsetTemplateUrl;
        }
    };
});

impDirectives.directive('impTab', function () {
    return {
        restrict: 'E',
        replace: true,
        require: '^impTabset',
        scope: {
            id: '@',
            title: '@',
            templateUrl: '@',
            specificClass: '@',
            showMark: '=?',
            isSelected: '=?',
            isDisabled: '=?',
            checkColor: "=?",
            isCheckAvailable: '=?',
            manageSelectedState: '=?'
        },
        link: function (scope, element, attrs, tabsetController) {

            scope.manageSelectedState = scope.manageSelectedState == null || scope.manageSelectedState == undefined ? true : scope.manageSelectedState;
            tabsetController.addTab(scope);

            scope.select = function () {
                if (scope.manageSelectedState)
                tabsetController.selectTab(scope);
            }


            scope.$watch('isSelected', function () {
                if (scope.isSelected) {
                    tabsetController.setTabTemplate(scope.templateUrl);
                }
            });
        },
        templateUrl: function (tElement, tAttrs) {
            return tAttrs.tabTemplateUrl;
        }
    };
});


impDirectives.directive('impPrintPdf', function ($timeout, $compile, $log, mailroomService) {
    return {
        restrict: 'E',
        bindToController: true,
        scope: {
        },
        controller: function () {
            this.printPdf = function (fileItemId, userAccountId) {
                mailroomService.getPDFFile(fileItemId, userAccountId).success(function (data) {
                    if (data) {
                        var file = new Blob([data], { type: 'application/pdf' });
                        var fileURL = URL.createObjectURL(file);
                        var iframe = document.frames ? document.frames["printf"] : document.getElementById("printf");
                        var ifWin = iframe.contentWindow || iframe;
                        iframe.focus();
                        iframe.src = fileURL;
                        $timeout(function () {
                            ifWin.print();
                        }, 1000);
                    }
                    else
                        $log.error('Failed to retrieve file data.');
                }).
                error(function (error) {
                    $log.error('Failed to retrieve file data.', error);
                });

            }
        },
        link: function (scope, element, attrs, controller) {
            var iframePrint = "<div class='imp-workbench-icon-print'>\
                                    <iframe name='printf' id='printf' style='display:none'></iframe>\
                                </div>"
            element.append($compile(iframePrint)(scope));
            element.on('click', function (event) {
                controller.printPdf(attrs.fileitemid, attrs.useraccountid);
            });
        }
    };
});

impDirectives.directive('impContextualButton', function () {
    return {
        restrict: 'E',
        bindToController: true,
        controllerAs: 'ctrl',
        scope: {
            executeCommand: '=?',
            items: '=?',
            selectedItem: '=?',
            cssClassAction: '@',
            cssClassDropdown: '@',
            cssClassDropdownMenu: '@'
        },
        controller: function () {
            this.select = function (item) {
                this.selectedItem = item;
            }          
        },
        templateUrl: 'angular/common/contextualbutton.html'
    };
});

impDirectives.directive('sortable', function ($timeout) {
    return function (scope, element, attributes) {
        $(element).sortable({
            stop: function (event, ui) {
                scope.$apply(function () {
                    scope.syncOrder($(element).sortable('toArray'));
                });
            }
        });
    };
});

impDirectives.directive('impValRequired', function ($http, $compile, $templateCache) {
    return {
        restrict: 'A',
        scope: {
            impValRequired: '@'
        },
        link: function (scope, element, attrs) {

            var elem = $(element).parent().find('select'),
            corners = ['top center', 'bottom center'],
            flipIt = elem.parents('span.top').length > 0;
            // Check we have a valid error message
            if (scope.impValRequired != "") {
                elem.qtip({
                    content: "<span>" + scope.impValRequired + "</span>",
                    overwrite: false,
                    position: {
                        my: corners[flipIt ? 0 : 1],
                        at: corners[flipIt ? 1 : 0],
                        viewport: $(window)
                    },
                    show: 'focus',
                    hide: {
                        when: { event: 'unfocus' }
                    },
                    style: {
                        classes: 'ui-tooltip-red' // Make it red... the classic error colour!
                    }
                })

                    // If we have a tooltip on this element already, just update its content
                    .qtip('option', 'content.text', "<span>" + scope.impValRequired + "</span>");
            }
                // If the error is empty, remove the qTip
            else {
                elem.qtip('destroy');
            }

        }

    }
});

impDirectives.directive('impTooltip', function ($http, $compile, $templateCache) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            var content = "<div>LockedOn</div><br/><div>02/02/2014</div>";
            var elem = $(element),
            corners = ['top center', 'bottom center'],
            flipIt = elem.parents('span.top').length > 0;
            // Check we have a valid  message
            if (content != "") {
                elem.qtip({
                    content: content,
                    position: {
                        my: corners[flipIt ? 0 : 1],
                        at: corners[flipIt ? 1 : 0],
                        viewport: $(window)
                    },
                    show: 'click',
                    hide: {
                        when: { event: 'click' },
                        effect: { type: 'slide' }
                    }
                });
            }

            else { elem.qtip('destroy'); }

        }

    }
});

/**
 *  Add the attribute to the $scope (e.g. $scope.someMenu = 'exampleMenu'
 *  Assign this to the directive <div imp-context-menu="someMenu"...>
 *  Expand contextMenus object with more lists
 *  Ternary operators should be working <div imp-context-menu="{{ condition ? 'firstmenu' : 'secondmenu' }}"
 */
impDirectives.directive('impContextMenu', function ($compile) {
    var contextMenus =
        {
            pdfMenu: "<ul id='contextmenu-node' class='condition-arrow-box'>\
                        <li class='contextmenu-item' ng-click='downloadDocument($event)'> <span>Download a copy</span> </li>\
                        <li class='contextmenu-item' ng-click='unassignFromItem($event)'> <span>Unassign from item</span> </li>\
                        <li class='contextmenu-item' ng-click='rejectDocument($event)' style='color: grey'> <span>Reject document</span> </li>\
                        <li class='contextmenu-item' ng-click='deleteFromDocVault($event)' style='color: grey'><span>Delete from DocVault</span> </li>\
                        <li class='contextmenu-item' ng-click='browseDocVault($event)'> <span>Browse DocVault</span> </li>\
                       </ul>",
            docVaultMenu: "<ul id='contextmenu-node' class='condition-arrow-box'>\
                                <li class='contextmenu-item' ng-click='browseDocVault($event)'> <span>Browse DocVault</span> </li>\
                                <li class='contextmenu-item' ng-repeat='doc in filteredDocuments' ng-click='assignDocument(doc)'> <span> {{ doc.Name }} </span> </li>\
                            </ul>",
            documentclassificationMenu: "<ul id='contextmenu-node' class='condition-arrow-box'>\
                <li class='contextmenu-item' ng-click='classifyDocument(document)'> Classify Document </li>\
                <li class='contextmenu-item' ng-click='rejectDocument(document)'> Reject Document </li>\
                <li class='contextmenu-item-disabled' ng-click='deleteFromDocVault()'> Delete from DocVault </li>\
                </ul>",

            exampleMenu: "<ul id='contextmenu-node' class='condition-arrow-box'>\
                                <li class='contextmenu-item'> <span>Example</span> </li>\
                                <li class='contextmenu-item'> <span>Example Option</span> </li>\
                            </ul>"
        }

    impContextMenu = {};
    impContextMenu.restrict = "A";
    impContextMenu.link = function (lScope, lElem, lAttr) {
        lElem.on("contextmenu", function (e) {

            // remove the previous node
            if ($("#contextmenu-node")) {
                $("#contextmenu-node").remove();
            }

            // instantiate a correct menu object
            var selectedmenu = $(contextMenus[lScope[lAttr.impContextMenu]]);

            // prevent default action and propagation
            e.preventDefault();
            e.stopPropagation();

            // compile menu and append it
            lElem.append($compile(selectedmenu)(lScope));

            return false;
        });
    };
    return impContextMenu;
});

impDirectives.directive('impDate', function ($filter, dateParser, $timeout) {
    return {
        require: 'ngModel',
        scope: {
            onBlurFn: '&?',
            dateFormatPatterns: '@'
        },
        link: function (scope, element, attrs, ngModelCtrl) {

            var dateFormat = "MM/dd/yyyy";

            if (scope.dateFormatPatterns != null && scope.dateFormatPatterns != undefined) {
                dateFormat = scope.dateFormatPatterns;
            }

            var listener = function () {
                if (ngModelCtrl.$modelValue == null)
                    return;
                var value = element.val();

                if (!common.date.isValidDate(value, true) || value == "" || value == null || value == undefined)
                    return;

                var modelDate = new Date(parseDate(ngModelCtrl.$modelValue));

                if (isNaN(modelDate.getDate()) || modelDate.getYear() > 3000) {
                    if (!isNaN(new Date(attrs.min))) {
                        value = attrs.min;
                        element.val($filter('date')(value, dateFormat));
                    }
                    else {
                        value = "01/01/1900";
                        element.val(value);
                    }
                }
                else {
                    element.val($filter('date')(value, dateFormat));
                }


            }

            function parseDate(viewValue) {
                if (!viewValue) {
                    return null;
                } else if (angular.isDate(viewValue) && !isNaN(viewValue)) {
                    return viewValue;
                } else if (angular.isString(viewValue)) {
                    var date = dateParser.parse(moment(viewValue).format('MM/DD/YYYY'), dateFormat);
                    if (isNaN(date)) {
                        return undefined;
                    } else {
                        return date;
                    }
                } else {
                    return undefined;
                }
            }

            ngModelCtrl.$parsers.push(parseDate);
            ngModelCtrl.$formatters.push(function (value) {
                return $filter('date')(value, dateFormat);
            });

            ngModelCtrl.$render = function () {
                element.val($filter('date')(ngModelCtrl.$viewValue, dateFormat));
            }

            var onBlur = function () {
                listener();
                if (angular.isDefined(attrs.onBlurFn)) {
                    scope.onBlurFn();
                }

                if (!common.date.isValidDate(element.val(), true)) {
                    $timeout(function () { element.val(null); });
                }
            }

            element.bind('blur', onBlur);
            element.bind('keydown', function (event) {
                var key = event.keyCode;
                var defaultKeys = key == 8 || key == 9 || key == 37 || key == 39;

                // key = 8 - backspace, so the user can delete the whole date
                if (key == 8) return;

                // prevent user from entering letters
                if (key < 48 || key > 105) {
                    if (!defaultKeys)
                        event.preventDefault();
                }
                else if (key > 57 && key < 96) {
                    event.preventDefault();
                }
                if (element.val().length > 9 && !defaultKeys)
                    event.preventDefault();

                var dateSpacerOccurance = dateFormat.split("/").length - 1;

                value = element.val();

                if (dateSpacerOccurance == 1) {
                    if ((value.length == 2) && !defaultKeys)
                        value = value + '/';
                } else if (dateSpacerOccurance == 2) {
                    if ((value.length == 2 || value.length == 5) && !defaultKeys)
                        value = value + '/';
                }

                //ONLY WORKS with 'min' parameter in HTML included
                if (attrs.min && !defaultKeys)
                {
                    var numberEntered = isNaN(String.fromCharCode(event.keyCode)) ? String.fromCharCode(event.keyCode - 48) : String.fromCharCode(event.keyCode);
                    var minimalDate = attrs.min.split("/");


                    switch (minimalDate.length)
                    {
                        case 2: //Disable enetering values lower then defined in 'min' parameter for mm/yyyy date format
                            if (value.split("/").length == 1) {
                                var typedMonth = value.split("/")[0] + numberEntered;   //reading typed month from input field
                                var minMonth = minimalDate[0];                          //reading predefined minimal required month

                                if (parseInt(typedMonth) < parseInt(minMonth.substring(0, typedMonth.length)))  //checking if the typed month is bigger then required minimal month
                                    event.preventDefault();
                            }
                            else if (value.split("/").length > 1) {
                                var typedYear = value.split("/")[1] + numberEntered;    //reading typed year from input field
                                var minYear = minimalDate[1];                           //reading predefined minimal required year

                                if (parseInt(typedYear) < parseInt(minYear.substring(0, typedYear.length))) //checking if the typed year is bigger then required minimal year
                                    event.preventDefault();
                            }

                            break;


                        case 3: //Disable enetering values lower then defined in 'min' parameter for mm/dd/yyyy date format
                            if (value.split("/").length == 1) {
                                var typedMonth = value.split("/")[0] + numberEntered;
                                var minMonth = minimalDate[0];

                                if (parseInt(typedMonth) < parseInt(minMonth.substring(0, typedMonth.length)))
                                    event.preventDefault();
                            }
                            else if (value.split("/").length == 2) {
                                var typedDay = value.split("/")[1] + numberEntered;
                                var minDay = minimalDate[1];

                                if (parseInt(typedDay) < parseInt(minDay.substring(0, typedDay.length)))
                                    event.preventDefault();
                            }
                            else if (value.split("/").length == 3) {
                                var typedYear = value.split("/")[2] + numberEntered;
                                var minYear = minimalDate[2];

                                if (parseInt(typedYear) < parseInt(minYear.substring(0, typedYear.length)))
                                    event.preventDefault();
                            }

                            break;
                    }
                }

                element.val(value);
            });
            element.bind('focus', function () {
                this.select();
                element.bind('mouseup', function (event) {
                    event.preventDefault();
                    element.unbind("mouseup");
                })
            })
        }
    }

});

impDirectives.directive('impCurrency', function ($filter, $browser) {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            var listenerOnChange = function () {
                var value = element.val().replace(/,/g, '').replace('$', '');
                if (attrs.negativeValues)
                    element.val($filter('impCurrency')(value));
                else element.val($filter('currency')(value));

                if (attrs.displayCurrencySign == "false")
                    element.val(element.val().replace('$', ''))

                if (attrs.required) {
                    // Handle required flags and classes
                    if (value == 0 && attrs.canBeZero != "1") {
                        ngModelCtrl.$invalid = true;
                        element.removeClass("ng-pristine").removeClass("ng-valid-parse").removeClass("ng-valid").removeClass("ng-valid-required");
                        element.addClass("ng-invalid ng-invalid-required");
                    }
                    else {
                        ngModelCtrl.$invalid = false;
                        element.removeClass("ng-invalid ng-invalid-required");
                        element.addClass("ng-valid-parse").addClass("ng-valid").addClass("ng-valid-required");
                    }
                }

                // Credit tab - handle joint liability records 
                // Todo: Change this logic !!!!
                if (attrs.isLiability == "1" && angular.element(document.getElementById('divCreditTabContent')).controller() != undefined) {
                    angular.element(document.getElementById('divCreditTabContent')).controller().ProcessJointLiabilityRecords(attrs.liabilityInfoId);
                }

                if (attrs.decimalPlaces !== undefined) {
                    var decPlaces = (attrs.decimalPlaces === undefined) ? '2' : attrs.decimalPlaces;
                    var currencySign = attrs.displayCurrencySign != "false" ? '$' : '';

                    element.val($filter('impCurrency')(ngModelCtrl.$viewValue, currencySign, decPlaces));
                }
            }
            var decPlaces = (attrs.decimalPlaces === undefined) ? '2' : attrs.decimalPlaces;

            // format amount on key press
            var listenerOnKey = function (key) {
                var value = element.val().replace(/,/g, '').replace('$', '');

                // prevent formating if negative values are allowed and - is entered at the begining of the value
                if (attrs.negativeValues == "true" && element.val().substr(0, 1) == "-" && (key == 109 ||  key == 189))
                    return;

                if (key == 109 ||  key == 189)
                    value = value.replace('-', '');

                element.val($filter('number')(value));
            }

            // View -> Model
            ngModelCtrl.$parsers.push(function (viewValue) {
                if (viewValue == null || viewValue == undefined)
                    return 0.0;
                var valStr = String(viewValue).replace(/,/g, '').replace('$', '');
                var valRet = 0.0;
                try {
                    if (valStr == "-" || valStr == "")
                        return 0.0;

                    var valNum = parseFloat(valStr);
                    if (isNaN(valNum)) {
                        // @todo-cc: Error Logging
                        console.error("imp-currency directive [View -> Model] binding fail to parse:" + valStr + "for:" + viewValue);
                    }
                    else {
                        valRet = valNum;
                    }
                }
                catch (e) {
                    // @todo-cc: Error Logging
                    console.error("imp-currency directive [View -> Model] binding fail to parse:" + valStr + "for:" + viewValue);
                }
                return valRet;
            })

            // Model - > View
            ngModelCtrl.$render = function () {
                var currencySign = attrs.displayCurrencySign != "false" ? '$' : '';
                var viewValue = ngModelCtrl.$viewValue;
                if (attrs.negativeValues != "true" && viewValue != undefined && viewValue != null)
                    viewValue = String(viewValue).replace('-', '');
                if ((element.val().length > 2 || (element.val().substr(0, 1) != "." && element.val().substr(0, 1) != "-")))
                    element.val($filter('impCurrency')(viewValue, currencySign, decPlaces));
            }
            element.bind('blur', listenerOnChange)
            element.bind('keydown', function (event) {
                var key = event.keyCode
                // If the keys include the CTRL, SHIFT, ALT, C, V or META keys, or the arrow keys, do nothing.
                if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40) || key == 67 || key == 86 || key == 9 || key == 8 || key == 46 || key == 190 || key == 110)
                    return
                var isSelected = this.selectionStart == 0 && this.selectionEnd == this.value.length
                var allowNegativeValues = (key == 109 || key == 189) && attrs.negativeValues == "true" && (element.val().substr(0, 1) != "-" || isSelected == true);
                // prevent user from entering letters
                if ((0 <= key && key < 13) || (13 < key && key < 48) || (key > 105 && !allowNegativeValues)) {
                    event.preventDefault();
                }
                else if (key > 57 && key < 96) {
                    event.preventDefault();
                }

                // do not format number if zero is entered after . or after -
                if ((element.val().substr(element.val().length - 1) != "." || (key != 96 && key != 48)) && (element.val().substr(0, 1) != "-" || element.val().length > 2)) {
                    $browser.defer(function () { listenerOnKey(key); });
                }
            })
            element.bind('focus', function () {
                var value = element.val().replace(/,/g, '').replace('$', '');
                element.val($filter('number')(value));
                this.select();
                element.bind('mouseup', function (event){
                    event.preventDefault();
                    element.unbind("mouseup");
                })
            }
            )}
    }

});

impDirectives.directive('impPercentage', function ($parse, $browser, $filter) {
    return {
        restrict: 'A',
        require: '?ngModel',
        scope: {
            returnFloat: '=',
            roundThreeDecimals: '=',
            noDecimals: '=',
            additionalSpace: '=',
            alwaysThreeDecimals: '='
        },
        link: function (scope, element, attrs, ctrl) {

            var percentChar = '%';
            if (scope.additionalSpace)
                percentChar = ' ' + percentChar;

            ctrl.$formatters.push(function (value) {

                if (scope.alwaysThreeDecimals) {
                    if (scope.returnFloat) {
                        return parseFloat(Math.round(value * 1000) / 1000).toFixed(3) + percentChar;
                    } else {
                        return parseInt(value).toFixed(3) + percentChar;
                    }
                }

                if (scope.returnFloat && scope.roundThreeDecimals) {
                    return parseFloat(Math.round(value * 1000) / 1000) + percentChar;
                }

                if (scope.returnFloat) {
                    return parseFloat((value / 100) * 100).toFixed(2) + percentChar;
                }

                return parseInt(value) + percentChar;
            });

            // View -> Model
            ctrl.$parsers.push(function (viewValue) {
               
                if (scope.returnFloat && viewValue != undefined && viewValue != null) {
                    return parseFloat(String(viewValue).replace(' %', '').replace('%', ''));
                }
                return parseInt(String(viewValue).replace(' %', '').replace('%', ''));
            })

            var listenerOnChange = function () {
                var value = parseFloat(element.val());

                // add .000% to all numbers
                if (scope.alwaysThreeDecimals && value) {
                    value = ((value / 1000) * 1000).toFixed(3);
                    value = value.replace(' %', '').replace('%', '') + percentChar;
                    element.val(value);
                }
                // add .000% if input is round number
                else if (value % 1 == 0 && !scope.noDecimals) {
                    if (scope.roundThreeDecimals) 
                        value = ((value / 1000) * 1000).toFixed(3);
                    else
                        value = ((value / 100) * 100).toFixed(2); // changed due to bug 27187 - add .00% to downPaymentPercentage 
                    value = value.replace(' %', '').replace('%', '') + percentChar;
                    element.val(value);
                }
                    // else just add percentage symbol
                else {
                    value = element.val().replace(' %', '').replace('%', '') + percentChar;
                    element.val(value);
                }


            }
            element.bind('focus', function () {
                this.select();
                element.bind('mouseup', function (event) {
                    event.preventDefault();
                    element.unbind("mouseup");
                })
            })
            element.bind('blur', listenerOnChange)
            element.bind('keydown', function (event) {
                var key = event.keyCode
                // If the keys include the CTRL, SHIFT, ALT, C, V or META keys, or the arrow keys, do nothing.
                if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40) || key == 67 || key == 86 || key == 9 || key == 8 || key == 46 || key == 190 || key == 110)
                    return
                $browser.defer(listenerOnKey);
            })

            var listenerOnKey = function () {
                var value = element.val().replace(/,/g, '').replace('%', '');

                if (value.indexOf('.') > 0 && (value.length - value.indexOf('.') <= 3)) //Check if there is a decimal place and if it's smaller then 3
                    return;
                else
                element.val($filter('number')(value));
            }

            element.bind('change', listenerOnChange)
        }
    };
});

impDirectives.directive('optionsDisabled', function ($parse) {
    var disableOptions = function (scope, attr, element, data, fnDisableIfTrue) {
        if (!data)
            return;

        // refresh the disabled options in the select element.
        $("option[value!=''][value!='?']", element).each(function (i, e) {
            var locals = {};
            locals[attr] = data[i];
            $(this).attr("disabled", fnDisableIfTrue(scope, locals));
        });
    };
    return {
        priority: 0,
        require: 'ngModel',
        restrict: "A",
        link: function (scope, iElement, iAttrs, ctrl) {
            // parse expression and build array of disabled options
            var expElements = iAttrs.optionsDisabled.match(/^\s*(.+)\s+for\s+(.+)\s+in\s+(.+)?\s*/);
            var attrToWatch = expElements[3];
            var fnDisableIfTrue = $parse(expElements[1]);
            scope.$watch(attrToWatch, function (newValue, oldValue) {
                if (newValue)
                    disableOptions(scope, expElements[2], iElement, newValue, fnDisableIfTrue);
            }, true);
            // handle model updates properly
            scope.$watch(iAttrs.ngModel, function (newValue, oldValue) {
                var disOptions = $parse(attrToWatch)(scope);
                if (newValue)
                    disableOptions(scope, expElements[2], iElement, disOptions, fnDisableIfTrue);
            });
        }
    };
});

impDirectives.directive('impPhone', function ($filter, $browser, $compile) {
    return {
        restrict: 'E',
        scope: {
            customFilters: '=?',
            phoneNumber: '=',
            selectedPhoneType: '=?',
            phoneTypesOptions: '=?',
            numberRequired: '=?',
            fieldsDisabled: '=?',
            triggerValidationOnInit: '=?',
            disablePhoneTypeOptions: '=?'
        },
        link: function (scope, element, attrs, ngModelCtrl) {
            scope.disablePhoneTypeOptions = (scope.disablePhoneTypeOptions == null || scope.disablePhoneTypeOptions == false) ? false : true;

            var phoneUI = "<div class='col-md-4'>\
                               <input type='text' ui-mask='(999) 999-9999' ng-model='phoneNumber' ng-disabled='fieldsDisabled' ng-class=\"{'imp-has-error': validatePhoneNumber()}\"/>\
                           </div>\
                           <div class='col-md-3' ng-hide='disablePhoneTypeOptions'>\
                                <div class='imp-span-ddl-container medium fleft' ng-class=\"{'imp-is-disabled': fieldsDisabled, 'imp-has-error': validatePhoneNumber()}\">\
                                   <select class='imp-ddl imp-psection-left-borderadius'\
                                    ng-model='selectedPhoneType'\
                                    ng-options='phoneType.value as phoneType.text for phoneType in phoneTypesOptions'\
                                    ng-disabled='fieldsDisabled'\
                                    ng-class=\"{'imp-has-error': validatePhoneNumber()}\">\
                                    </select>\
                                </div>\
                            </div>"

            element.append($compile(phoneUI)(scope));
            scope.innerCustomFilters = scope.customFilters ? scope.customFilters : [];

            scope.validatePhoneNumber = function () {
                return (!scope.phoneNumber || scope.phoneNumber.length < 10) && scope.numberRequired;
            };
           

            scope.colorErrors = function (selectedElement, dropdownElement, dropdownParentElement, selectedElementValue) {

                selectedElementNumbers = selectedElementValue ? selectedElementValue.replace('(', '').replace(')', '').replace('-', '').replace(' ', '').replace(/_/g, '') : '0';
                
            }

            var selectedElement = element.find('input');
            var dropdownElement = element.find('select');
            var dropdownParentElement = dropdownElement.parent();

            if (scope.fieldsDisabled) {
                dropdownParentElement.addClass('imp-is-disabled');
            }
            else {
                dropdownParentElement.removeClass('imp-is-disabled');
            }

            if (scope.numberRequired ) {
                scope.colorErrors(selectedElement, dropdownElement, dropdownParentElement, scope.phoneNumber);
            }

            var onBlur = function () {
                if (scope.innerCustomFilters) {
                    for (i = 0; i < scope.innerCustomFilters.length; i++) {
                        if ((scope.innerCustomFilters[i].executeOn == 'blur' || !scope.innerCustomFilters[i].executeOn) && !scope.innerCustomFilters[i].ruleFunction(selectedElement.val())) {
                            scope.innerCustomFilters[i].callBackFunction();
                            return;
                        }
                    }
                }

                if (scope.numberRequired) {
                    scope.colorErrors(selectedElement, dropdownElement, dropdownParentElement, scope.phoneNumber);
                }
            }

            var onKeyUp = function () {
                if (scope.innerCustomFilters) {
                    for (i = 0; i < scope.innerCustomFilters.length; i++) {
                        if (scope.innerCustomFilters[i].executeOn == 'onkeyup' && !scope.innerCustomFilters[i].ruleFunction(selectedElement.val())) {
                            scope.innerCustomFilters[i].callBackFunction();
                            return;
                        }
                    }
                }
            }

            selectedElement.bind('blur', onBlur)
            selectedElement.bind('keyup', onKeyUp)

        }
    }
});

//popupSettings is a complex object and consists of other parameters related to 
//date picker. Parameters are:
//- minData [default : 01/01/1900]
//- maxDate [default : 01/01/2020]
//- dateFormat [default : MM/dd/yyyy]
//- adultsOnly [default : true]
//- minAdultsAge [default : 18]
//- dateRegEx [default : ^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](17|18|19|20|21|22)?[0-9]{2})*$]
//- defaultValidationEnabled [default : true]
//These parameters can be used all at once or only one or none. The right way to 
//set these parameters inside directive is: [[ popup-settings="{minDate='01/01/1900', maxDate: '01/01/2015', etc..} ]] (without square brackets)
/****************************************************************************/
/****************************************************************************/
//Custom filters are made for those who wants to put some extra handling of dates in this directive. So, this parameter is an json array of functions and it has
//key-value structure for rule, callback and execution event on that rule. So, rule function should accept one parameter, value of directive, and return boolean whether 
//this rule passes or not, and its callback will do whatever if rule is false. Rules will be executed on event that is provided as parameter. If no event is provided
//function will be executed on blur.
//Correct way to pass this parameter to directive is: custom-filters="[{ruleFunction:function(){}, callBackFunction:function(){}, executeOn:'blur'},{ruleFunction:function(){}, callBackFunction:function(){}, executeOn:'onkeyup'},etc..]"
//Please make sure that keywords ruleFunction, callBackFunction and executeOn are written correctly and case sensitive.
/****************************************************************************/
/****************************************************************************/
impDirectives.directive('impDatePicker', function ($filter, dateFilter, datepickerPopupConfig, $timeout) {
    return {
        restrict: 'E',
        scope: {
            displayPicker: '=',
            model: '=ngModel',
            dateSettings: '=?',
            customFilters: '=?',
            triggerValidationOnInit: '=?',
            hasError: '=',
            setDefaultDate: '=?'
        },
        templateUrl: 'angular/common/datecontrol.html',
        link: function (scope, element, attrs, ngModelController) {
            
            scope.minDate = '01/01/1900';
            scope.maxDate = '01/01/2050';
            scope.dateFormat = 'MM/dd/yyyy';
            scope.adultsOnly = true;
            scope.minAdultsAge = 18;
            scope.defaultDateSettings = {};
            scope.innerCustomFilters = [];
            scope.dateRegEx = new RegExp("^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](17|18|19|20|21|22)?[0-9]{2})*$");
            scope.placeholder = '__/__/____';
            scope.hideErrorMessage = false;
            scope.customErrorMessage = '';
            scope.validateOnFocus = false;
            scope.disabled = false;
            scope.validateIsDate = false;
            scope.width = '100%'

            scope.innerCustomFilters = scope.customFilters ? scope.customFilters : [];
            scope.defaultDateSettings = scope.dateSettings = scope.dateSettings ? scope.dateSettings : { minDate: '', maxDate: '', dateFormat: '', adultsOnly: '', minAdultsAge: '', dateRegEx: '', placeholder: '', hideErrorMessage: '', customErrorMessage: '', validateOnFocus: '', disabled:'' };
            scope.defaultDateSettings.minDate = scope.dateSettings.minDate ? scope.dateSettings.minDate : scope.minDate;
            scope.defaultDateSettings.maxDate = scope.dateSettings.maxDate ? scope.dateSettings.maxDate : scope.maxDate;
            scope.defaultDateSettings.dateFormat = scope.dateSettings.dateFormat ? scope.dateSettings.dateFormat : scope.dateFormat;
            scope.defaultDateSettings.adultsOnly = scope.dateSettings.adultsOnly !== '' ? scope.dateSettings.adultsOnly : scope.adultsOnly;
            scope.defaultDateSettings.minAdultsAge = scope.dateSettings.minAdultsAge ? scope.dateSettings.minAdultsAge : scope.minAdultsAge;
            scope.defaultDateSettings.dateRegEx = scope.dateSettings.dateRegEx ? scope.dateSettings.dateRegEx : scope.dateRegEx;
            scope.defaultDateSettings.placeholder = scope.dateSettings.placeholder ? scope.dateSettings.placeholder : scope.placeholder;
            scope.defaultDateSettings.hideErrorMessage = scope.dateSettings.hideErrorMessage ? scope.dateSettings.hideErrorMessage : scope.hideErrorMessage;
            scope.defaultDateSettings.customErrorMessage = scope.dateSettings.customErrorMessage ? scope.dateSettings.customErrorMessage : scope.customErrorMessage;
            scope.defaultDateSettings.validateOnFocus = scope.dateSettings.validateOnFocus ? scope.dateSettings.validateOnFocus : scope.validateOnFocus;
            scope.defaultDateSettings.disabled = scope.dateSettings.disabled ? scope.dateSettings.disabled : scope.disabled;
            scope.defaultDateSettings.validateIsDate = scope.dateSettings.validateIsDate ? scope.dateSettings.validateIsDate : scope.validateIsDate;
            scope.defaultDateSettings.width = scope.dateSettings.width ? scope.dateSettings.width : scope.width;

            scope.$watch(
                'model',
		        function (value) {
		            if (value && value.length > 11) { //value = "2008-08-01T00:00:00" bugfix
		                if(scope.defaultDateSettings.dateFormat=='MM/dd/yyyy')
		                    scope.model = value.substring(5, 7) + '/' + value.substring(8, 10) + '/' + value.substring(0, 4);
		                else if(scope.defaultDateSettings.dateFormat=='MM/yyyy')
		                    scope.model = value.substring(5, 7) + '/' + value.substring(0, 4);
		        }
            });

            scope.expandTheDate = function (value) {
                if (!!value && value.length < 8) {
                    return value.substring(0, value.indexOf('/') + 1) + '01' + value.substring(value.indexOf('/'), value.length);
            }
                return value;
            }

            scope.shrinkTheDate = function (value) {
                if (!!value && value.length > 8) {
                    return value.replace(/\/([0-9]\w)\//g, '/');
            }
            }

            if (scope.defaultDateSettings.dateFormat == 'MM/dd/yyyy' || scope.defaultDateSettings.dateFormat == 'MM/dd/yy')
                scope.model = scope.expandTheDate(scope.model);
            else if (scope.defaultDateSettings.dateFormat == 'MM/yyyy')
                scope.model = scope.shrinkTheDate(scope.model);

            scope.model = dateFilter(scope.model, scope.defaultDateSettings.dateFormat);

            var defaultValidationEnabled = true;
            var closingDate = scope.minDate;

            if (scope.dateSettings.defaultValidationEnabled != undefined && scope.dateSettings.defaultValidationEnabled != null && scope.dateSettings.defaultValidationEnabled == false) {
                defaultValidationEnabled = scope.dateSettings.defaultValidationEnabled;
            }
            var closingDateValidationEnabled = false;
            if (scope.dateSettings.closingDateValidationEnabled != null && scope.dateSettings.closingDateValidationEnabled == true) {
                closingDateValidationEnabled = scope.dateSettings.closingDateValidationEnabled;
            }

            if (scope.dateSettings.closingDate != null && scope.dateSettings.closingDate != '0001-01-01T00:00:00') {
                closingDate = scope.dateSettings.closingDate;
            }
            else if (scope.setDefaultDate) {
                scope.model = moment().format('MM/DD/YYYY');
            }
            scope.defaultDateSettings.defaultValidationEnabled = defaultValidationEnabled;
            scope.defaultDateSettings.closingDateValidationEnabled = closingDateValidationEnabled;
            scope.defaultDateSettings.closingDate = closingDate;

            scope.isOpened = false;

            scope.open = function (event) {
                event.preventDefault();
                event.stopPropagation();

                scope.isOpened = true;
            };

            scope.colorErrors = function (selectedElement, button) {
                $(selectedElement).addClass('imp-has-error');
                if (button) {
                    $(button).addClass('imp-has-error');
            }
            }

            scope.getAge = function (birth) {

                var today = new Date();

                var age = today.getFullYear() - birth.getFullYear();
                var age_month = today.getMonth() - birth.getMonth();
                var age_day = today.getDate() - birth.getDate();

                if (age_month < 0 || (age_month == 0 && age_day < 0)) {
                    age = parseInt(age) - 1;
            }
                return age;
            }

            var index = scope.displayPicker ? 1 : 0;
            var selectedElement = element.find('input').eq(index);
            var errorLabel = $(element).find('span.imp-error-label');// $('span.imp-error-label');
            var button = element.find('button');
            var enteredDate = new Date(selectedElement.val());

            if (scope.triggerValidationOnInit) {
                if (!scope.model || ((isNaN(new Date(scope.model)) || !scope.defaultDateSettings.dateRegEx.test(scope.model)) &&
                    scope.model.indexOf('_') === -1)) {
                    scope.colorErrors(selectedElement, button);
            }
            }

            var onBlur = function () {
                var value = selectedElement.val();
                if (value && value.length == 10)
                    scope.model = value;
                if (scope.innerCustomFilters) {
                    for (i = 0; i < scope.innerCustomFilters.length; i++) {
                        if ((scope.innerCustomFilters[i].executeOn == 'blur' || !scope.innerCustomFilters[i].executeOn) && !scope.innerCustomFilters[i].ruleFunction(selectedElement.val())) {
                            scope.innerCustomFilters[i].callBackFunction(scope.$parent);
                            scope.$apply();
                        }
                    }

                    if (!common.date.isValidDate(scope.model, true)) {
                        $timeout(function () { scope.model = null; });
                    }
                }
                if (scope.defaultDateSettings.defaultValidationEnabled) {

                    $(selectedElement).removeClass('imp-has-error');
                    if (button) {
                        $(button).removeClass('imp-has-error');
                }
                    $(errorLabel).html('');

                    if ((new Date(selectedElement.val()) < new Date(scope.defaultDateSettings.minDate)) || (new Date(selectedElement.val()) > new Date(scope.defaultDateSettings.maxDate))) {
                        scope.colorErrors(selectedElement, button);
                        if (!scope.defaultDateSettings.hideErrorMessage) {
                            $(errorLabel).html('Invalid birthday');
                    }
                    }
                    else if (scope.defaultDateSettings.adultsOnly && scope.getAge(new Date(selectedElement.val())) < scope.defaultDateSettings.minAdultsAge) {
                        scope.colorErrors(selectedElement, button);
                        if (!scope.defaultDateSettings.hideErrorMessage) {
                            $(errorLabel).html('Must be over ' + scope.defaultDateSettings.minAdultsAge);
                    }
                }


            }


                if (scope.dateSettings.closingDateValidationEnabled) {
                    if (new Date(scope.model) < new Date(scope.defaultDateSettings.minDate)) {
                        scope.model = scope.defaultDateSettings.closingDate;
                }
            }

            }



            var onFocus = function () {
                if (scope.defaultDateSettings.validateOnFocus) {
                    var value = selectedElement.val();
                    if (scope.defaultDateSettings.defaultValidationEnabled) {
                        $(selectedElement).removeClass('imp-has-error');
                        if (button) {
                            $(button).removeClass('imp-has-error');
                    }
                        $(errorLabel).html('');

                        if ((new Date(selectedElement.val()) < new Date(scope.defaultDateSettings.minDate)) || (new Date(selectedElement.val()) > new Date(scope.defaultDateSettings.maxDate))) {
                            scope.colorErrors(selectedElement, button);
                            if (scope.defaultDateSettings.customErrorMessage)
                                $(errorLabel).html(scope.defaultDateSettings.customErrorMessage);
                    }
                }

                    if (scope.dateSettings.closingDateValidationEnabled) {
                        if (new Date(scope.model) < new Date(scope.defaultDateSettings.minDate)) {
                            scope.model = scope.defaultDateSettings.closingDate;
                    }
                }

            }
            }

            var onKeyUp = function (e) {
                if (scope.innerCustomFilters) {
                    for (i = 0; i < scope.innerCustomFilters.length; i++) {
                        if (scope.innerCustomFilters[i].executeOn == 'onkeyup' && !scope.innerCustomFilters[i].ruleFunction(selectedElement.val())) {
                            scope.innerCustomFilters[i].callBackFunction();
                            return;
                    }
                }
            }
                if (scope.defaultDateSettings.validateIsDate) {
                    if (new Date(scope.expandTheDate($(selectedElement).val())) == 'Invalid Date')
                        $(selectedElement).addClass('imp-has-error');
                    else if (!scope.hasError)
                        $(selectedElement).removeClass('imp-has-error');
            }
            }



            scope.maskDate = function (event) {
                if (event.keyCode !== 8) {
                    if (scope.defaultDateSettings.dateFormat == 'MM/dd/yyyy' || scope.defaultDateSettings.dateFormat == 'MM/dd/yy') {
                        if (event.target.value.length <= 10) {
                            if (event.target.value.length == 2) {
                                scope.model = event.target.value + '/';
                            }
                            else if (event.target.value.length == 5) {
                                scope.model = event.target.value + '/';
                            }
                            else if (event.target.value.indexOf('/') === -1 && event.target.value.length == 8) {
                                scope.model = event.target.value.substring(0, 2) + '/' + event.target.value.substring(3, 5) + '/' + scope.defaultDateSettings.dateFormat == 'MM/dd/yy' ? event.target.value.substring(8, 10) : event.target.value.substring(6, 10);
                        }
                        }
                        else {
                            scope.model = event.target.value.substring(0, 10);
                    }
                    }
                    else if (scope.defaultDateSettings.dateFormat == 'MM/yyyy') {
                        if (event.target.value.length <= 7) {
                            if (event.target.value.length == 2) {
                                scope.model = event.target.value + '/';
                        }
                        }
                        else {
                            scope.model = event.target.value.substring(0, 7);
                    }
                }
            }
            }

            selectedElement.bind('blur', onBlur)
            selectedElement.bind('focus', onFocus)
            selectedElement.bind('keyup', onKeyUp)
        },
        controller: function ($scope) {
            $scope.isToBody = function () {
                if ($scope.dateSettings)
                    return $scope.dateSettings.appendToBody;
                return false;
            }
        }
    }
});


impDirectives.directive("housingExpensesBarGraph", function () {
    return {
        restrict: "A",
        scope: {
            primaryValue: '@',
            referenceValue: '@',
            monthlyPaymentBarWidth: '@'
        },
        link: function (scope, element) {
            scope.$watch(
               function (scope) {

                   return scope.primaryValue;
               },
               function (newValue) {
                   var barWidth = 0;

                   var refValue = parseFloat(scope.referenceValue);
                   var primaryValue = parseFloat(newValue);
                   var maxBarWidth = parseFloat(scope.monthlyPaymentBarWidth);

                   if (primaryValue < refValue) {
                       barWidth = (primaryValue / refValue) * maxBarWidth;
                   } else {
                       barWidth = scope.monthlyPaymentBarWidth;
                   }

                   var changes = {
                       width: barWidth + 'px'
                   }

                   element.css(changes);
               }
           );
            scope.$watch(
                function (scope) {

                    return scope.referenceValue;
                },
                function (newValue) {
                    var barWidth = 0;
                    var refValue = parseFloat(newValue);
                    var primaryValue = parseFloat(scope.primaryValue);
                    var maxBarWidth = parseFloat(scope.monthlyPaymentBarWidth);

                    if (primaryValue < refValue) {
                        barWidth = (primaryValue / refValue) * maxBarWidth;
                    } else {
                        barWidth = scope.monthlyPaymentBarWidth;
                    }

                    var changes = {
                        width: barWidth + 'px'
                    }

                    element.css(changes);
                }
            );
        }
    };
});

impDirectives.directive("ltvBarGraph", function () {
    return {
        restrict: "A",
        scope: {
            ltvValue: '@',
            firstReference: '@',
            secondReference: '@',
            ltvBarHeight: '@'
        },
        link: function (scope, element) {
            scope.$watch(
               function (scope) {

                   return scope.ltvValue;
               },
               function (newValue) {
                   var ltvBarHeight = 0;

                   var refLtvVal1 = parseFloat(scope.firstReference);
                   var refLtvVal2 = parseFloat(scope.secondReference);
                   var ltvVal = parseFloat(newValue);
                   var maxValue = 100;
                   var opacityValue = 0;

                   var barHeight = parseFloat(scope.ltvBarHeight);

                   if (refLtvVal1 > maxValue) {
                       maxValue = refLtvVal1;
                   } else if (refLtvVal2 > maxValue) {
                       maxValue = refLtvVal2;
                   }

                   if (maxValue > ltvVal) {
                       ltvBarHeight = (ltvVal / maxValue) * barHeight;
                   } else {
                       ltvBarHeight = barHeight;
                   }

                   var opacityValue = ltvVal / maxValue;

                   var changes = {
                       height: ltvBarHeight + 'px',
                       opacity: opacityValue
                   }

                   element.css(changes);
               }
           );

            scope.$watch(
               function (scope) {

                   return scope.firstReference;
               },
               function (newValue) {
                   var newltvBarHeight = 0;

                   var refLtvVal1 = parseFloat(newValue);
                   var refLtvVal2 = parseFloat(scope.secondReference);
                   var ltvVal = parseFloat(scope.ltvValue);
                   var maxValue = 100;
                   var opacityValue = 0;

                   var barHeight = parseFloat(scope.ltvBarHeight);

                   if (refLtvVal1 > maxValue) {
                       maxValue = refLtvVal1;
                   } else if (refLtvVal2 > maxValue) {
                       maxValue = refLtvVal2;
                   }

                   if (maxValue > ltvVal) {
                       newltvBarHeight = (ltvVal / maxValue) * barHeight;
                   } else {
                       newltvBarHeight = barHeight;
                   }

                   var opacityValue = ltvVal / maxValue;

                   var changes = {
                       height: newltvBarHeight + 'px',
                       opacity: opacityValue
                   }

                   element.css(changes);
               }
           );

            scope.$watch(
              function (scope) {

                  return scope.secondReference;
              },
              function (newValue) {
                  var ltvBarHeight = 0;

                  var refLtvVal1 = parseFloat(scope.firstReference);
                  var refLtvVal2 = parseFloat(newValue);
                  var ltvVal = parseFloat(scope.ltvValue);
                  var maxValue = 100;
                  var opacityValue = 0;

                  var barHeight = parseFloat(scope.ltvBarHeight);

                  if (refLtvVal1 > maxValue) {
                      maxValue = refLtvVal1;
                  } else if (refLtvVal2 > maxValue) {
                      maxValue = refLtvVal2;
                  }

                  if (maxValue > ltvVal) {
                      ltvBarHeight = (ltvVal / maxValue) * barHeight;
                  } else {
                      ltvBarHeight = barHeight;
                  }

                  var opacityValue = ltvVal / maxValue;

                  var changes = {
                      height: ltvBarHeight + 'px',
                      opacity: opacityValue
                  }

                  element.css(changes);
              }
          );

        }
    };
});

impDirectives.directive("borrowerCashBarGraph", function () {
    return {
        restrict: "A",
        scope: {
            totalAmount: '@',
            cashFromToBorrower: '@',
            totalAmountBarWidth: '@'
        },
        link: function (scope, element) {
            scope.$watch(
               function (scope) {

                   return scope.totalAmount;
               },
               function (newValue) {
                   var barWidth = (scope.cashFromToBorrower / newValue) * scope.totalAmountBarWidth;
                   var changes = {
                       width: barWidth + 'px'
                   }

                   element.css(changes);
               }
           );
            scope.$watch(
                function (scope) {

                    return scope.cashFromToBorrower;
                },
                function (newValue) {
                    var barWidth = (newValue / scope.totalAmount) * scope.totalAmountBarWidth;
                    var changes = {
                        width: barWidth + 'px'
                    }

                    element.css(changes);
                }
            );
        }
    };
});

impDirectives.directive('backButton', function () {
    return {
        restrict: 'A',

        link: function (scope, element, attrs) {
            element.bind('click', goBack);

            function goBack() {
                history.back();
                scope.$apply();
            }
        }
    }
});

impDirectives.directive("loanDetailsTitle", function () {
    return {
        restrict: "A",
        scope: {
            productCode: '@'
        },
        link: function (scope, element, attrs) {

            scope.$watch(
               function (scope) {
                   if (element[0] && element[0].children[0] && element[0].children[0].children[0])
                       return element[0].children[0].children[0].offsetWidth;
               },
               function (newValue) {

                   if (element[0].offsetWidth <= newValue) {

                       element[0].children[1].style.display = 'block';
                   } else {
                       element[0].children[1].style.display = 'none';
                   }
               }
           );
            scope.$watch(
               function (scope) {

                   if (element[0] && element[0].children[0] && element[0].children[0].children[0] && element[0].children[0].children[0].children[0])
                       return element[0].children[0].children[0].children[0].offsetWidth;
               },
               function (newValue) {

                   var firstPartDivElement = element[0].children[0].children[0].children[0];
                   var containerPartDivElementWidth = element[0].children[0].children[0].offsetWidth;

                   if ((element[0].offsetWidth <= newValue)) {
                       firstPartDivElement.style.fontSize = '15px';
                   }



               }
           );
        }
    };
});

impDirectives.directive('selectItem', function () {
    return {
        restrict: 'A',

        link: function (scope, element, attrs) {
            element.bind('click', selectItem);

            function selectItem() {
                if (element.parent().hasClass("row")) {
                    element.parent().find('*').removeClass('selected');
                } else {
                    element.parent().parent().find('*').removeClass('selected');
                }

                element.addClass('selected');
            }
        }
    }
});

impDirectives.directive('contextualTabs', function () {
    return {
        restrict: 'E',

        controller: function ($scope, $element) {

        },

        link: function (scope, element, attrs, ctrls) {

        },

        templateUrl: 'angular/contextualbar/contextualtabs/contextualtabs.html'
    };
});

impDirectives.directive('gridHeight', function () {
    return {
        restrict: 'A',

        link: function (scope, element, attrs) {

            var changes = {
                height: $(window).height() - 230 + 'px'
            }
            element.css(changes);

            //detecting a browser resize
            scope.$watch(
              function (scope) {
                  return $(window).height();
              },
              function (newValue) {

                  var changes = {
                      height: newValue - 230 + 'px'
                  }

                  element.css(changes);
              }
          );

        }
    }
});

impDirectives.directive('impSelectOnClick', function () {
    return {
        restrict: 'A',
        link: function (scope, element) {
            var focusedElement;
            element.on('click', function () {
                if (focusedElement != this) {
                    this.select();
                    focusedElement = this;
                }
            });
            element.on('blur', function () {
                focusedElement = null;
            });
        }
    };
});

impDirectives.directive('scrollOnClick', function () {
    return {
        restrict: 'A',
        link: function (scope, $elm) {
            $elm.on('click', function () {
                $(window).scrollTo(0, 0);
            });
        }
    }
});

impDirectives.directive('impDocVault', function () {
    return {
        restrict: 'E',
        templateUrl: 'angular/documents/docvault/docvault.html',
        scope: {
            isFlyout: '=',
            showErrorContainer: '=',
            showLoader: '=',
            buttonSelected: '=?',
            buttonOptions: '=?',
            callButtonOption: '&?',
            changeButtonOption: '&?',
            groupedDocuments: '=',
            formatCategoryName: '&',
            toggleGrid: '&',
            encompassExportStatus: '=?',
            selectDisabled: '&?',
            documentSelectedChanged: '&',
            downloadDocument: '&',
            openMenu: '&',
            documentStatusData: '=?',
            documentStatusChanged: '&?',
            exportToEncompass: '&?',
            loanNumber: '=?',
            showDocumentHistory: '&',
            deleteDocument: '&?',
            selectAll: '&',
            unselectAll: '&',
            classifyDocuments: "&?",
            save: "&?",
            cancel: "&?",
            savingInProgres: "=?"
         },
        link: function(scope, elements, attrs) {

        }
    };
});