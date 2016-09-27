var fileUploadDirective = angular.module('iMP.Directives');

fileUploadDirective.directive('fileSelect', ['$q', function ($q) {

    return {
        restrict: 'A',
        scope: {
            fileTypes: '=?',
            preSelectFnm: '=?'
        },
        link: function (scope, $elem, attrs) {
            var openFileInput = function () {
                // gets or creates an input on the DOM.
                var id = '__global_file_input'
                , html = '<input type="file" id="' + id + '" style="display:none" multiple' + (scope.fileTypes ? ' accept="' + scope.fileTypes + '"' : '') + ' />'
                , input = $('#' + id)
                , deferred = $q.defer();

                if (input.length == 0) {
                    input = $(html);
                    $('#upload-files').append(input);
                }

                input[0].value = null;

                // fired when the file input changes.
                var onInputChange = function (event) {
                    var files = event.target.files;
                    if (files != null && files.length > 0) {
                        deferred.resolve(files);
                    } else {
                        deferred.reject();
                    }
                };

                input.unbind('change');

                input.bind('change', function (event) {
                    scope.$apply(function () { onInputChange(event); });

                });

                // simulate a click on the input to open the file selector.
                input.trigger('click');

                return deferred.promise;
            };

            $elem.bind('click', function (event) {
                var updateScope = function (files) {
                    for (var i = 0; i < files.length; i++) {
                        if (scope.$parent.importFnmCtrl){
                            scope.$parent.importFnmCtrl.files.push(files[i]);
                        }
                        if (scope.$parent.uploadFiles) {
                            scope.$parent.uploadFiles.files.push(files[i]);
                        }
                    if (scope.preSelectFnm)
                        scope.$parent.importFnmCtrl.markFirstAsPrimaryFNM();
                    }
                };
                
                openFileInput().then(updateScope);
            });
        }
    };
}]);