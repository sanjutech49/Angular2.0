var impdirectives;
(function (impdirectives) {
    var settings;
    (function (_settings) {
        var IMPTextareaSettings = (function () {
            function IMPTextareaSettings(settings) {
                this.settings = settings;
                this.numberOfRows = !!this.settings && !!this.settings.numberOfRows ? this.settings.numberOfRows : 6;
                this.numberOfCharacters = !!this.settings && !!this.settings.numberOfCharacters ? this.settings.numberOfCharacters : 750;
                this.message = !!this.settings && !!this.settings.message ? this.settings.message : 'You have reached max character length!';
            }
            return IMPTextareaSettings;
        })();
        _settings.IMPTextareaSettings = IMPTextareaSettings;
        var IMPTextboxSettings = (function () {
            function IMPTextboxSettings(settings) {
                this.settings = settings;
                this.textboxDescription = !!this.settings && !!this.settings.textboxDescription ? this.settings.textboxDescription : '';
            }
            return IMPTextboxSettings;
        })();
        _settings.IMPTextboxSettings = IMPTextboxSettings;
    })(settings = impdirectives.settings || (impdirectives.settings = {}));
})(impdirectives || (impdirectives = {}));
//# sourceMappingURL=impdirectives.settings.js.map