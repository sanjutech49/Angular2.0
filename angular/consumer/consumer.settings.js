var docusign;
(function (docusign) {
    var settings = (function () {
        function settings() {
        }
        //Will be set by razor
        settings.apiRoot = '';
        settings.isSecureLinkTestMode = false;
        settings.isTokenValid = false;
        settings.authenticationViewModel = null;
        return settings;
    })();
    docusign.settings = settings;
})(docusign || (docusign = {}));
//# sourceMappingURL=consumer.settings.js.map