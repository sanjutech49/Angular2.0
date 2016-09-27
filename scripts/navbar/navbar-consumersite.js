(function () { // Navbar and dropdowns
    "use strict";
    var MEDIUM_BREAKPOINT = 768;
    var LARGE_BREAKPOINT = 1280;
    var MAIN_NAVBAR_HEIGHT = 60;

    // Pricing
    //
    // Toggle
    //
    //var pricingToggle = document.getElementsByClassName('pricing-navbar-toggle'),
    //    pricingClose = document.getElementsByClassName('pricing-navbar-close'),
    //    pricingCollapse = document.getElementsByClassName('pricing-navbar-collapse');

    //function togglePricingMenu(evt) {
    //    var index = 0;
    //    for (var i = 0; i < pricingToggle.length; i++) {
    //        if (pricingToggle[i] === evt.target || pricingToggle[i] === evt.target.parentElement || pricingClose[i] === evt.target || pricingClose[i] === evt.target.parentElement) {
    //            index = i;
    //            pricingClose[index].classList.toggle('in');
    //        }
    //    }
    //    if (pricingCollapse) {
    //        pricingCollapse[index].classList.toggle('collapse');
    //        pricingCollapse[index].classList.toggle('in');
    //    }
    //    var pricingNavbar = document.getElementsByClassName('pricing-navbar')[0];
    //    pricingNavbar.classList.toggle('front');
    //}

    //pricingToggle[0].addEventListener('click', togglePricingMenu, false);
    //pricingClose[0].addEventListener('click', togglePricingMenu, false);

    // Loan App Navbar
    //
    // Toggle
    //
    //var loanAppToggle = document.getElementsByClassName('loan-app-navbar-toggle'),
    //    loanAppClose = document.getElementsByClassName('loan-app-navbar-close'),
    //    loanAppCollapse = document.getElementsByClassName('loan-app-navbar-collapse');

    //function toggleloanAppMenu(evt) {
    //    loanAppClose[0].classList.toggle('in');
    //    loanAppCollapse[0].classList.toggle('collapse');
    //    loanAppCollapse[0].classList.toggle('in');
    //}

    //loanAppToggle[0].addEventListener('click', toggleloanAppMenu, false);
    //loanAppClose[0].addEventListener('click', toggleloanAppMenu, false);


    //
    // Scroll
    //
    // On up-down scroll lock the loan-app-navbar to the top of the screen
    //
    function lockLoanAppNavbar() {
        var scrollY = window.scrollY;
        var loanAppNavbar = document.getElementsByClassName('loan-app-navbar')[0];
        if (loanAppNavbar != null) {
            if (loanAppNavbar.style.marginTop != "0px") {
                loanAppNavbar.style.marginTop = "0px";
            }
        }
        var loanAppNavbarLogo = document.getElementById('loanAppNavbarLogo');
        if (loanAppNavbarLogo != null) {
            loanAppNavbarLogo.style.display = 'block';
        }
    };

    function unlockLoanAppNavbar() {
        var loanAppNavbar = document.getElementsByClassName('loan-app-navbar')[0];
        if (loanAppNavbar != null) {
            //Show the logo that is in the loan-app-navbar
            var loanAppNavbarLogo = document.getElementById('loanAppNavbarLogo');
            var scrollY = window.scrollY;
            if (loanAppNavbarLogo != null) {
                if (scrollY > 28) {
                    loanAppNavbarLogo.style.display = 'block';
                } else {
                    loanAppNavbarLogo.style.display = 'none';
                }
            }
            if (scrollY > 5) {
                var newMarginTop = MAIN_NAVBAR_HEIGHT - scrollY;
                if (newMarginTop <= 0) {
                    newMarginTop = 0;
                    if (loanAppNavbar.style.marginTop != "0px") {
                        loanAppNavbar.style.marginTop = "0px";
                    }
                } else {
                    loanAppNavbar.style.marginTop = newMarginTop + "px";
                }
            } else if (loanAppNavbar.style.marginTop != MAIN_NAVBAR_HEIGHT + "px") {
                loanAppNavbar.style.marginTop = MAIN_NAVBAR_HEIGHT + "px";
            }
        }
    }

    function onWindowScroll() {
        if (window.innerWidth < MEDIUM_BREAKPOINT) {
            lockLoanAppNavbar();
        } else {
            unlockLoanAppNavbar();
        }
    }

    window.addEventListener('scroll', onWindowScroll, false);


    //
    // Resize
    //
    // On resize lock the loan-app-navbar to the top if the screen is narrow
    //
    function onResize() {
        if (window.innerWidth < MEDIUM_BREAKPOINT) {
            lockLoanAppNavbar();
        } else {
            unlockLoanAppNavbar();
        }
    }

    // Event listeners
    window.addEventListener('resize', onResize, false);

})();
