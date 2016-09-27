/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../ts/lib/common.util.ts" />
/// <reference path="../../../ts/global/global.ts" />
var consumersite;
(function (consumersite) {
    var FilePickerController = (function () {
        function FilePickerController(enums, $modalInstance) {
            var _this = this;
            this.enums = enums;
            this.$modalInstance = $modalInstance;
            this.controllerAsName = "filePickerCtrl";
            this.dismiss = function () {
                _this.$modalInstance.dismiss('cancel');
            };
            this.uploadMulti = function () {
                var that = _this;
                angular.forEach(_this.fileList, function (file) {
                    if (file.size > that._maxSize) {
                        alert("The file " + file.name + " exceeds the maximum file size of 48 MB.");
                    }
                    else if (!_.contains(that._supportedExtensions, that.getFileExtension(file.name.toLowerCase()))) {
                        alert("The file " + file.name + " is not in an approved format.");
                    }
                    else {
                        that._fileArray.push(file);
                    }
                });
            };
            this.removeFile = function (fileName) {
                var that = _this;
                angular.forEach(_this.fileArray, function (file, index) {
                    if (file.name === fileName) {
                        that._fileArray.splice(index, 1);
                    }
                });
            };
            this.uploadFiles = function () {
                if (_this.validateFileSizeAndExtensions) {
                    _this.$modalInstance.close(_this.fileArray);
                }
                else {
                    alert("One or more files exceed the maximum size of 48 MB or are of the wrong format.");
                }
            };
            this.validateFileSizeAndExtensions = function () {
                for (var i = 0; i < _this.fileArray.length; i++) {
                    if (_this.fileArray[i].size > _this._maxSize || !_.contains(_this._supportedExtensions, _this.getFileExtension(_this.fileArray[i].name.toLowerCase()))) {
                        return false;
                    }
                }
                ;
                return true;
            };
            this.getFileExtension = function (filename) {
                return filename.split(".").pop();
            };
            this._fileArray = new Array();
            this._supportedExtensions = _.values(this.enums.DocumentContentType);
            this._maxSize = 48 * 1024 * 1024;
        }
        Object.defineProperty(FilePickerController.prototype, "fileList", {
            get: function () {
                return this._fileList;
            },
            set: function (value) {
                this._fileList = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FilePickerController.prototype, "fileArray", {
            get: function () {
                return this._fileArray;
            },
            set: function (value) {
                // read only
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FilePickerController.prototype, "hasSelectedFiles", {
            get: function () {
                return this.fileArray.length > 0;
            },
            set: function (value) {
                // read only
            },
            enumerable: true,
            configurable: true
        });
        FilePickerController.className = 'filePickerController';
        FilePickerController.$inject = [];
        return FilePickerController;
    })();
    consumersite.FilePickerController = FilePickerController;
    moduleRegistration.registerController(consumersite.moduleName, FilePickerController);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=filePicker.controller.js.map