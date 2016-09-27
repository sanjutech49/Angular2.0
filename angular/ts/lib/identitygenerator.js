/// <reference path="common.util.ts" />
var util;
(function (util) {
    var IdentityGenerator;
    (function (_IdentityGenerator) {
        function nextGuid() {
            return IdentityGenerator.nextGuid();
        }
        _IdentityGenerator.nextGuid = nextGuid;
        function setGuids(guids) {
            IdentityGenerator.setGuids(guids);
        }
        _IdentityGenerator.setGuids = setGuids;
        var IdentityGenerator = (function () {
            function IdentityGenerator() {
            }
            IdentityGenerator.getInstance = function () {
                if (!IdentityGenerator.instance) {
                    IdentityGenerator.instance = new IdentityGenerator();
                }
                return IdentityGenerator.instance;
            };
            IdentityGenerator.setGuids = function (guids) {
                if (!guids || guids.length == 0) {
                    console.log('setGuids: guids is empty');
                }
                IdentityGenerator.getInstance().guids = guids;
            };
            IdentityGenerator.nextGuid = function () {
                if (!IdentityGenerator.getInstance().guids || IdentityGenerator.getInstance().guids.length == 0) {
                    console.log('nextGuid: guids is empty');
                }
                if (IdentityGenerator.getInstance().guids.length % 1000 == 0) {
                    console.log('guid count = ' + IdentityGenerator.getInstance().guids.length);
                }
                var id = IdentityGenerator.getInstance().guids.pop();
                if (!id) {
                    console.log('id is undefined');
                }
                return id;
            };
            return IdentityGenerator;
        })();
    })(IdentityGenerator = util.IdentityGenerator || (util.IdentityGenerator = {}));
})(util || (util = {}));
//# sourceMappingURL=identitygenerator.js.map