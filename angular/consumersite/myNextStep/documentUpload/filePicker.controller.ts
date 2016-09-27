/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../ts/lib/common.util.ts" />
/// <reference path="../../../ts/global/global.ts" />

module consumersite {

    export class FilePickerController {

        private _fileList: FileList;

        private _fileArray: File[];

        private _supportedExtensions: any[];

        private _maxSize: number;

        public static className = 'filePickerController';

        public controllerAsName: string = "filePickerCtrl";

        static $inject = [];

        constructor(private enums: any, private $modalInstance: angular.ui.bootstrap.IModalServiceInstance) {
            this._fileArray = new Array<File>();
            this._supportedExtensions = _.values(this.enums.DocumentContentType);
            this._maxSize = 48 * 1024 * 1024;
        }

        public dismiss = () => {
            this.$modalInstance.dismiss('cancel');
        }

        public get fileList(): FileList {
            return this._fileList;
        }

        public set fileList(value: FileList) {
            this._fileList = value;
        }

        public get fileArray(): File[] {
            return this._fileArray;
        }

        public set fileArray(value: File[]) {
            // read only
        }

        public get hasSelectedFiles(): boolean {
            return this.fileArray.length > 0;
        }

        public set hasSelectedFiles(value: boolean) {
            // read only
        }

        public uploadMulti = () => {
            var that = this;            

            angular.forEach(this.fileList, function (file) {
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

        public removeFile = (fileName: string) => {
            var that = this;
            angular.forEach(this.fileArray, function (file, index) {
                if (file.name === fileName) {
                    that._fileArray.splice(index, 1);
                }
            });
        };

        public uploadFiles = () => {
            if (this.validateFileSizeAndExtensions) {
                this.$modalInstance.close(this.fileArray);
            }
            else {
                alert("One or more files exceed the maximum size of 48 MB or are of the wrong format.");
            }
        };

        private validateFileSizeAndExtensions = (): boolean => {
            for (var i = 0; i < this.fileArray.length; i++) {
                if (this.fileArray[i].size > this._maxSize || !_.contains(this._supportedExtensions, this.getFileExtension(this.fileArray[i].name.toLowerCase()))) {
                    return false;
                }
            };
            return true;
        }

        private getFileExtension = (filename: string): string => {
            return filename.split(".").pop();
        }

    }

    moduleRegistration.registerController(consumersite.moduleName, FilePickerController);
}