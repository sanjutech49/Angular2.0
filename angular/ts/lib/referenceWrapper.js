// this class exists so that there is a shared reference and 
// updates done on this reference will propagate across all controllers
var lib;
(function (lib) {
    var referenceWrapper = (function () {
        function referenceWrapper(ref) {
            this.ref = ref;
        }
        return referenceWrapper;
    })();
    lib.referenceWrapper = referenceWrapper;
    function mergeContext(value, context) {
        return angular.extend(value, context);
    }
    lib.mergeContext = mergeContext;
})(lib || (lib = {}));
//# sourceMappingURL=referenceWrapper.js.map