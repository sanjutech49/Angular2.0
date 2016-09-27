/// <reference path='../../../../scripts/typings/d3/d3.d.ts' />
var directive;
(function (directive) {
    'use strict';
    var ProgressSpinner = (function () {
        function ProgressSpinner() {
            var _this = this;
            this.restrict = 'E';
            this.templateUrl = '/angular/consumersite/directives/progressSpinner/progressSpinner.html';
            this.scope = {
                'width': '@',
                'height': '@',
                'percent': '=',
                'animInit': '='
            };
            this.pi = Math.PI;
            this.controller = function ($scope) {
                $scope.log = function (variable) {
                    console.log(variable);
                };
                $scope.$watch('percent', function (newVal) {
                    _this.transition($scope.percent);
                });
            };
            this.link = {
                post: function ($scope, elem, attr, controller) {
                    elem.css({ 'height': $scope.height, 'width': $scope.width });
                    _this.setUpSVG($scope);
                    _this.setRadius();
                    _this.addText();
                    if ($scope.animInit) {
                        _this.drawCircles();
                        _this.transition($scope.percent);
                    }
                    else {
                        _this.drawCircles($scope.percent);
                        _this.setText($scope.percent);
                    }
                }
            };
        }
        ProgressSpinner.createNew = function (args) {
            return new ProgressSpinner();
        };
        ProgressSpinner.prototype.setUpSVG = function ($scope) {
            // set up margins
            var el = d3.select('.spinner'), elWidth = parseInt($scope.height, 10), elHeight = parseInt($scope.width, 10), margin = { top: 5, right: 5, bottom: 5, left: 5 };
            this.width = elWidth - margin.left - margin.right;
            this.height = elHeight - margin.top - margin.bottom;
            // create svg element
            this.svg = el.append("svg").attr("width", elWidth).attr("height", elHeight).append("g").attr("transform", "translate(" + elWidth / 2 + "," + elHeight / 2 + ")");
        };
        ProgressSpinner.prototype.setRadius = function () {
            this.radius = Math.min(this.width, this.height) / 2;
        };
        ProgressSpinner.prototype.drawCircles = function (percent, forColor, backColor) {
            if (percent === void 0) { percent = 0; }
            this.arc = d3.svg.arc().innerRadius(this.radius * 0.8).outerRadius(this.radius * 1.0).startAngle(0);
            //Need to paramitize the color
            this.backgound = this.svg.append("path").datum({ endAngle: 2 * this.pi }).style("fill", "#ddd").attr("d", this.arc);
            //Need to paramitize the color & endAngle
            this.foreground = this.svg.append("path").datum({ endAngle: percent * 2 * this.pi }).style("fill", "#1FB25A").attr("d", this.arc);
        };
        ProgressSpinner.prototype.addText = function (textColor) {
            var _this = this;
            this.status = this.svg.append('text').text(function (d) {
                return _this.formatPercentString(0);
            }).attr('text-anchor', 'middle').attr('y', '5px').attr("font-size", function () {
                return (_this.radius * 0.55).toString() + 'px';
            }).attr("fill", "#515151");
            //Need to paramitize the color
        };
        ProgressSpinner.prototype.setText = function (percent) {
            this.status.text(this.formatPercentString(percent));
        };
        ProgressSpinner.prototype.transition = function (percent) {
            var _this = this;
            var newAngle = percent * 2 * this.pi;
            this.status.text(this.formatPercentString(percent));
            this.foreground.transition().duration(750).attrTween("d", function (d) {
                // To interpolate between the two angles, we use the default d3.interpolate.
                // (Internally, this maps to d3.interpolateNumber, since both of the
                // arguments to d3.interpolate are numbers.) The returned function takes a
                // single argument t and returns a number between the starting angle and the
                // ending angle. When t = 0, it returns d.endAngle; when t = 1, it returns
                // newAngle; and for 0 < t < 1 it returns an angle in-between.
                var interpolate = d3.interpolate(d.endAngle, newAngle);
                // The return value of the attrTween is also a function: the function that
                // we want to run for each tick of the transition. Because we used
                // attrTween("d"), the return value of this last function will be set to the
                // "d" attribute at every tick. (It's also possible to use transition.tween
                // to run arbitrary code for every tick, say if you want to set multiple
                // attributes from a single function.) The argument t ranges from 0, at the
                // start of the transition, to 1, at the end.
                return function (t) {
                    // Calculate the current arc angle based on the transition time, t. Since
                    // the t for the transition and the t for the interpolate both range from
                    // 0 to 1, we can pass t directly to the interpolator.
                    //
                    // Note that the interpolated angle is written into the element's bound
                    // data object! This is important: it means that if the transition were
                    // interrupted, the data bound to the element would still be consistent
                    // with its appearance. Whenever we start a new arc transition, the
                    // correct starting angle can be inferred from the data.
                    d.endAngle = interpolate(t);
                    // Lastly, compute the arc path given the updated data! In effect, this
                    // transition uses data-space interpolation: the data is interpolated
                    // (that is, the end angle) rather than the path string itself.
                    // Interpolating the angles in polar coordinates, rather than the raw path
                    // string, produces valid intermediate arcs during the transition.
                    return _this.arc(d);
                };
            });
        };
        ProgressSpinner.prototype.formatPercentString = function (percent) {
            return (percent.toFixed(2) * 100).toString().substring(0, 2) + '%';
        };
        ProgressSpinner.className = 'progressSpinner';
        ProgressSpinner.$inject = [];
        return ProgressSpinner;
    })();
    directive.ProgressSpinner = ProgressSpinner;
    moduleRegistration.registerDirective(consumersite.moduleName, ProgressSpinner);
})(directive || (directive = {}));
;
//# sourceMappingURL=progressSpinnerDirective.js.map