(function () {
    'use strict';
    angular.module('iMP.Filters', []);

    angular.module('iMP.Filters')
        .filter('impExcerpt', impExcerpt)
        .filter('impPercentage', impPercentage)
        .filter('impRound', impRound)
        .filter('impRoundPrecision', impRoundPrecision)
        .filter('impAbs', impAbs)
        .filter('impNegativeParenthesis', impNegativeParenthesis)
        .filter('impGroupBy', ['$parse', impGroupBy])
        .filter('getByProperty', getByProperty)
        .filter('impCurrency', impCurrency)
        .filter('numberFixedLength', numberFixedLength)
        .filter('hideZero', hideZero)
        .filter('impFormatTelephone', impFormatTelephone)
        .filter('impCurrencyAllowCustomStringValues', impCurrencyAllowCustomStringValues)
        .filter('creditCardType', creditCardType)

    /**
    * @desc Creates an excerpt for strings longer than the specified length.
    */
    function impExcerpt() {
        return function (input, length) {
            if (!length)
                length = 60;

            if (input && input.toString().length > length + 3)
                return input.toString().substring(0, length) + '...';

            return input;
        };
    }

    function hideZero() {
        return function (input) {
            if (input != null && !isNaN(input))
                var value = parseFloat(input)
            
            if (value != null && value == 0.00)
                return null;

            return input;
        }
    }
    /**
    * @desc Adds a percentage sign to a non-empty binding value.
    */
    function impPercentage() {
    return function (input) {
        var retVal = '';
        if ($.trim(input).length > 0) {
            retVal = input + ' %';
        }

        return retVal;
    };
    }

    /**
    * @desc Rounds a decimal value to the specified number of decimal places.
    */
    function impRound() {
    return function (input, decimalPlaces) {
        var retVal = '';
        if ($.trim(input).length > 0 && !isNaN(input)) {
            retVal = parseFloat(input).toFixed(decimalPlaces);
        }

        return retVal;
    };
    }


    /**
       * @desc Rounds a decimal value to the specified number of decimal places.
     */
    function impRoundPrecision() {
        return function (input, digits) {
            var retVal = '';
            if ($.trim(input).length > 0 && !isNaN(input)) {
                var multiplicator = Math.pow(10, digits)
                retVal = parseFloat(Math.round(input * multiplicator) / multiplicator);
            }

            return retVal;
        };
    }

    function impAbs() {
        return function (input) {
            var retVal = '';
            if ($.trim(input).length > 0 && !isNaN(input)) {
                retVal = Math.abs(parseFloat(input));
            }

            return retVal;
        };
    }

    /**
    * @desc Formats negative values with parenthesis as needed for the UI: for example: -5.20 will become (5.20)
    */
    function impNegativeParenthesis() {
    return function (input, suffix) {
        if (suffix == undefined || suffix == null) {
            suffix = "";
            }

        if ($.trim(input).length > 0 && !isNaN(input) && input < 0) {
            return "(" + Math.abs(input) + suffix + ")";
        }
        else {
            return input + suffix;
        }
    };
    }

/*
* impGroupBy
*
* Define when a group break occurs in a list of items
*
* @param {array}  the list of items
* @param {String} then name of the field in the item from the list to group by
* @returns {array}	the list of items with an added field name named with "_new"
*					appended to the group by field name
*
* @example		<div ng-repeat="item in MyList  | impGroupBy:'groupfield'" >
*				<h2 ng-if="item.groupfield_CHANGED">{{item.groupfield}}</h2>
*
*				Typically you'll want to include Angular's orderBy filter first
*/
    function impGroupBy($parse) {
    return function (list, group_by) {

        var filtered = [];
        var prev_item = null;
        var group_changed = false;
        // this is a new field which is added to each item where we append "_CHANGED"
        // to indicate a field change in the list
        //was var new_field = group_by + '_CHANGED'; - JB 12/17/2013
        var new_field = 'group_by_CHANGED';

        // loop through each item in the list
        angular.forEach(list, function (item) {

            group_changed = false;

            // if not the first item
            if (prev_item !== null) {

                // check if any of the group by field changed

                //force group_by into Array
                group_by = angular.isArray(group_by) ? group_by : [group_by];

                //check each group by parameter
                for (var i = 0, len = group_by.length; i < len; i++) {
                    if ($parse(group_by[i])(prev_item) !== $parse(group_by[i])(item)) {
                        group_changed = true;
                    }
                }


            } // otherwise we have the first item in the list which is new
            else {
                group_changed = true;
            }

            // if the group changed, then add a new field to the item
            // to indicate this
            if (group_changed) {
                item[new_field] = true;
            } else {
                item[new_field] = false;
            }

            filtered.push(item);
            prev_item = item;

        });

        return filtered;
    };
    }

/**
        * @example var found = $filter('getByProperty')('id', fish_id, $scope.fish);
        */
    function getByProperty() {
    return function (propertyName, propertyValue, collection) {
        var i = 0, len = collection.length;
        for (; i < len; i++) {
            if (collection[i][propertyName] == +propertyValue) {
                return collection[i];
            }
        }
        return null;
    }
    }

    /*
    * @desc filter for currency with negative number displayed with - instead ()
    */
    function impCurrency($filter) {
        return function (value, currencySymbol, decimalPlaces) {
        var retVal = '';
        var currencySym = (currencySymbol === undefined) ? '$' : currencySymbol;
        var decPlaces = (decimalPlaces === undefined) ? '2' : decimalPlaces;
        if ($.trim(value).length > 0) {

            if (value < 0)
                retVal = $filter('currency')(value, currencySym, decPlaces).replace('(', '-').replace(')', '');
            else retVal = $filter('currency')(value, currencySym, decPlaces);
        }

        return retVal;
    };
    }

    function impCurrencyAllowCustomStringValues($filter) {
    return function (value, currencySymbol, decimalPlaces) {
        if (isNaN(value) || value === '')
            return value;
        
        return impCurrency($filter)(value, currencySymbol, decimalPlaces);
    };
    }

    /**
    * @desc Formats a number to be at least minNumberOfDigits by adding leading zeros
    */
    function numberFixedLength() {
    return function (input, minNumberOfDigits) {
        var num = parseInt(input, 10);
        minNumberOfDigits = parseInt(minNumberOfDigits, 10);
        if (isNaN(num) || isNaN(minNumberOfDigits)) {
            return n;
        }
        num = '' + num;
        while (num.length < minNumberOfDigits) {
            num = '0' + num;
        }

        return num;
    };
    }

    function impFormatTelephone() {
        return function (tel) {
            if (!tel) { return ''; }

            var value = tel.toString().trim().replace(/^\+/, '');

            if (value.match(/[^0-9]/)) {
                return tel;
            }

            var country, city, number;

            switch (value.length) {
                case 10: // +1PPP####### -> C (PPP) ###-####
                    country = 1;
                    city = value.slice(0, 3);
                    number = value.slice(3);
                    break;

                case 11: // +CPPP####### -> CCC (PP) ###-####
                    country = value[0];
                    city = value.slice(1, 4);
                    number = value.slice(4);
                    break;

                case 12: // +CCCPP####### -> CCC (PP) ###-####
                    country = value.slice(0, 3);
                    city = value.slice(3, 5);
                    number = value.slice(5);
                    break;

                default:
                    return tel;
            }

            if (country == 1) {
                country = "";
            }

            number = number.slice(0, 3) + '-' + number.slice(3);

            return (country + " (" + city + ") " + number).trim();
        };
    };
    
    function creditCardType() {
        return function (ccnumber) {
            if (!ccnumber) { return ''; }
            
            ccnumber = ccnumber.toString().replace(/\s+/g, '');

            if (/^(6011)|^(622(1(2[6-9]|[3-9][0-9])|[2-8][0-9]{2}|9([01][0-9]|2[0-5])))|^(64[4-9])|^65/.test(ccnumber)) {
                cardType = "discover";
            }
            if (/^5[1-5]/.test(ccnumber)) {
                cardType = "masterCard";
            }
            if (/^4/.test(ccnumber)) {
                cardType = "visa"
            }

            return cardType;
        };
    };

})();


