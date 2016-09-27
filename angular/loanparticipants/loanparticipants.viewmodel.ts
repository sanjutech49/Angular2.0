module loancenter {
    'use strict';
    export function attachParticipantsViewModel(wrappedLoan) {
        wrappedLoan.ref.loanParticipants = {
            participantInformation: []
        }

        var numberOfParticipants = randomNumber(4, 12);

        for (var i = 0; i < numberOfParticipants; i++) {
            var person = createPerson();
            wrappedLoan.ref.loanParticipants.participantInformation.push(person);
        }

        //console.log(wrappedLoan.ref.loanParticipants);
    }

    function randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getCompanyTypes() {
        var companyTypes = [
            'CPA',
            'Doc Signing',
            'Employer',
            'Escrow',
            'Flood Insurance',
            'Hazard Insurance',
            'Property Management',
            'Home Warranty',
            'Survey',
            'Termite',
            'Mortgage Insurance',
            'Realtor',
            'Title Insurance',
            'Appraiser'
        ];

        return companyTypes;
    }

    export function getCompanyTypeLookups() {
        //ng - options="v.legalEntityTypeKey as v.legalEntityTypeString for (k, v) in companyTypes"
        var companyTypeLookups = [];
        var companyTypes = getCompanyTypes();

        for (var i = 0; i < companyTypes.length; i++) {
            companyTypeLookups.push({
                legalEntityTypeKey: i + 1,
                legalEntityTypeString: companyTypes[i]
            });
        }
        //console.log(companyTypeLookups);
        return companyTypeLookups;
    }

    function getCompanyType() {
        var companyTypes = getCompanyTypes();
        
        return companyTypes[randomNumber(0, 12)];
    }

    function getAreaCode() {
        return getPreFix();
    }

    function getPreFix() {
        return getRandomNumber(3);
    }

    function getSuffix() {
        return getRandomNumber(4);
    }

    function getLicenseNumber() {
        return getRandomNumber(12);
    }

    function getRandomNumber(length) {
        var number = [];
        for (var i = 0; i < length; i++) {
            number[i] = (randomNumber(0, 9)).toString();
        }
        return number.join('');
    }

    function getFirstName() {
        var name = [
            'Marilyn',
            'Deborah',
            'Timothy',
            'Kathleen',
            'Arthur',
            'Deborah',
            'Barbara',
            'Annette',
            'Flora',
            'Ann',
            'Nancy',
            'Porfirio',
            'Jonathan',
            'Leslie',
            'Barbara',
            'Mark',
            'Kathy',
            'Christopher',
            'Jeffrey',
            'Kimbra'
        ];

        return name[randomNumber(0, name.length - 1)];
    }

    function getMiddleIntial() {
        var name = [
            'J',
            'J',
            'F',
            'M',
            'C',
            'C',
            'R',
            'D',
            'E',
            'D',
            'G',
            'P',
            'J',
            'J',
            'M',
            'M',
            'S',
            'K',
            'R',
            'R',
        ];

        return name[randomNumber(0, name.length - 1)];
    }

    function getLastName() {
        var name = [
            'Bledsoe',
            'Loiselle',
            'Dostie',
            'Allen',
            'Young',
            'Chavez',
            'Crawford',
            'Aldrich',
            'Hudson',
            'Karr',
            'Ashton',
            'White',
            'McAdams',
            'Hanson',
            'Koontz',
            'Winters',
            'Betts',
            'Sweet',
            'Pennypacker',
            'Lafon'
        ];

        return name[randomNumber(0, name.length - 1)];
    }

    function getPhoneNumber(typeOfNumber = null) {
        var types = [
            'Other',
            'Home',
            'Mobile',
            'Office',
            'Fax'
        ];

        typeOfNumber = (typeOfNumber !== null) ? typeOfNumber : randomNumber(0, types.length - 1);

        var p = getPreFix(),
            s = getSuffix(),
            a = getAreaCode();

        return {
            areaCode: a,
            preFix: p,
            suffix: s,
            phoneNumber: '(' + a + ') ' + p + ' - ' + s,
            phoneNumberType: types[typeOfNumber]
        }
    }

    export function createEmptyPerson() {
        return {
            companyName: '',
            companyPhoneNumber: '',
            companyType: '',
            emailAddressList: [
                {
                    emailAddress: '',
                    emailType: "Office" //type Other, Home, Office
                }
            ],
            companyLicenseNumber: '',
            personalLicenseNumber: '',
            firstName: '',
            middleName: '',
            lastName: '',
            name: '',
            addressList: [{
                city: '',
                county: '',
                state: '',
                streetAddress: '',
                streetAddress1: '',
                streetAddress2: '',
                zipCode: ''
            }],
            phoneList: [
                {
                    areaCode: '',
                    preFix: '',
                    suffix: '',
                    phoneNumber: '',
                    phoneNumberType: 'Office'
                },
                {
                    areaCode: '',
                    preFix: '',
                    suffix: '',
                    phoneNumber: '',
                    phoneNumberType: 'Mobile'
                },
                {
                    areaCode: '',
                    preFix: '',
                    suffix: '',
                    phoneNumber: '',
                    phoneNumberType: 'Fax'
                },
            ],
            isRemoved: false
        };
    }

    function createPerson() {

        var firstName = getFirstName(),
            middle = getMiddleIntial(),
            last = getLastName(),
            phoneNumbers = [];

        phoneNumbers.push(getPhoneNumber(3));
        phoneNumbers.push(getPhoneNumber(2));
        phoneNumbers.push(getPhoneNumber(4));

        return {
            companyName: "Some Company",
            companyPhoneNumber: getPhoneNumber(),
            companyType: getCompanyType(), 
            emailAddressList: [
                {
                    emailAddress: firstName.toLowerCase() + '.' + last.toLowerCase() + '@somecompany.com',
                    emailType: "Office" //type Other, Home, Office
                }
            ],
            companyLicenseNumber: getLicenseNumber(),
            personalLicenseNumber: getLicenseNumber(),
            firstName: firstName,
            middleName: middle,
            lastName: last,
            name: firstName + ' ' + middle + ' ' + last,
            addressList: [{
                city: 'Reston',
                county: 'Fairfax',
                state: 'VA',
                streetAddress: '10304 Chamberlain Dr',
                streetAddress1: 'Apt 3',
                streetAddress2: '',
                zipCode: '22192'
            }],
            phoneList: phoneNumbers,
            isRemoved: false
        }
    }

}