var consumersite;
(function (consumersite) {
    var vm;
    (function (vm) {
        var Declarations = (function () {
            function Declarations(declarations) {
                //REFACTOR: Issue with srv.cls.DeclarationInfoViewModel, ALL ARE NUMBERS!
                //PS: I hate myself for this.
                this.isNumberTrue = function (compare) {
                    return compare == 0;
                };
                this.convertBooleanToNumber = function (bool) {
                    if (bool) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                };
                this.getDeclarations = function () { return declarations; };
            }
            Object.defineProperty(Declarations.prototype, "additionalInformationCheckboxIndicator", {
                //Government Monitoring Page
                //Do you want to disclose this info?
                get: function () {
                    return this.getDeclarations().additionalInformationCheckboxIndicator;
                },
                set: function (additionalInformationCheckboxIndicator) {
                    this.getDeclarations().additionalInformationCheckboxIndicator = additionalInformationCheckboxIndicator;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Declarations.prototype, "ethnicityId", {
                //Are you hispanic or latino?
                get: function () {
                    return this.getDeclarations().ethnicityId;
                },
                set: function (ethnicityId) {
                    this.getDeclarations().ethnicityId = ethnicityId;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Declarations.prototype, "race", {
                //Are you Alaska Natice, Black or AA, etc.
                get: function () {
                    return this.getDeclarations().race;
                },
                set: function (race) {
                    this.getDeclarations().race = race;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Declarations.prototype, "sexId", {
                //Are you male or female?
                get: function () {
                    return this.getDeclarations().sexId;
                },
                set: function (sexId) {
                    this.getDeclarations().sexId = sexId;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Declarations.prototype, "outstandingJudgmentsIndicator", {
                //Declarations Page
                //a
                get: function () {
                    return this.getDeclarations().outstandingJudgmentsIndicator;
                },
                set: function (value) {
                    this.getDeclarations().outstandingJudgmentsIndicator = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Declarations.prototype, "bankrupcyIndicator", {
                //b        
                get: function () {
                    return this.getDeclarations().bankrupcyIndicator;
                },
                set: function (value) {
                    this.getDeclarations().bankrupcyIndicator = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Declarations.prototype, "propertyForeclosedIndicator", {
                //c
                get: function () {
                    return this.getDeclarations().propertyForeclosedIndicator;
                },
                set: function (value) {
                    this.getDeclarations().propertyForeclosedIndicator = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Declarations.prototype, "partyToLawsuitIndicator", {
                //d
                get: function () {
                    return this.getDeclarations().partyToLawsuitIndicator;
                },
                set: function (value) {
                    this.getDeclarations().partyToLawsuitIndicator = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Declarations.prototype, "obligatedLoanIndicator", {
                //e
                get: function () {
                    return this.getDeclarations().obligatedLoanIndicator;
                },
                set: function (value) {
                    this.getDeclarations().obligatedLoanIndicator = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Declarations.prototype, "presentlyDelinquentIndicator", {
                //f
                get: function () {
                    return this.getDeclarations().presentlyDelinquentIndicator;
                },
                set: function (value) {
                    this.getDeclarations().presentlyDelinquentIndicator = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Declarations.prototype, "alimonyChildSupportObligation", {
                //g
                get: function () {
                    return this.getDeclarations().alimonyChildSupportObligation;
                },
                set: function (value) {
                    this.getDeclarations().alimonyChildSupportObligation = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Declarations.prototype, "downPaymentIndicator", {
                //h
                get: function () {
                    return this.getDeclarations().downPaymentIndicator;
                },
                set: function (value) {
                    this.getDeclarations().downPaymentIndicator = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Declarations.prototype, "noteEndorserIndicator", {
                //i
                get: function () {
                    return this.getDeclarations().noteEndorserIndicator;
                },
                set: function (value) {
                    this.getDeclarations().noteEndorserIndicator = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Declarations.prototype, "propertyAsPrimaryResidence", {
                //j - from borrower/coborrower view model
                //k - from borrower/coborrower view model
                //l
                get: function () {
                    return this.getDeclarations().propertyAsPrimaryResidence;
                },
                set: function (value) {
                    this.getDeclarations().propertyAsPrimaryResidence = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Declarations.prototype, "ownershipInterestLastThreeYears", {
                //m
                get: function () {
                    return this.getDeclarations().ownershipInterestLastThreeYears;
                },
                set: function (value) {
                    this.getDeclarations().ownershipInterestLastThreeYears = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Declarations.prototype, "hasOwnershipInterestLastThreeYears", {
                get: function () {
                    return this.isNumberTrue(this.getDeclarations().ownershipInterestLastThreeYears);
                },
                set: function (hasOwnershipInterestLastThreeYears) {
                    /*Read-Only*/
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Declarations.prototype, "typeOfProperty", {
                //n
                get: function () {
                    return this.getDeclarations().typeOfProperty;
                },
                set: function (typeOfProperty) {
                    this.getDeclarations().typeOfProperty = typeOfProperty;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Declarations.prototype, "priorPropertyTitleType", {
                //o
                get: function () {
                    return this.getDeclarations().priorPropertyTitleType;
                },
                set: function (priorPropertyTitleType) {
                    this.getDeclarations().priorPropertyTitleType = priorPropertyTitleType;
                },
                enumerable: true,
                configurable: true
            });
            return Declarations;
        })();
        vm.Declarations = Declarations;
    })(vm = consumersite.vm || (consumersite.vm = {}));
})(consumersite || (consumersite = {}));
//# sourceMappingURL=declarations.viewModel.js.map