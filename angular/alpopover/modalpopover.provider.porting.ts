

//        class ModalPopoverWindow {

//	  .directive('modalpopoverWindow', ['$modalpopoverStack', '$timeout', '$document', function ($modalpopoverStack, $timeout, $document) {
//	  	var templateUrl = 'template/modalpopover/window.html';

//	  	return {
//	  	    restrict: 'EA',
//	  	    scope: {
//	  	        index: '@',
//	  	        animate: '=',
//	  	        left: '@',
//	  	        top: '@',
//	  	        height: '@',
//	  	        width: '@',
//	  	        arrowRight: '@',
//	  	        className: '@',
//	  	        verticalPopupPositionPerHeight: '@',
//	  	        horisontalPopupPositionPerWidth: '@'
//	  	    },
//	  	    replace: true,
//	  	    transclude: true,
//	  	    templateUrl: templateUrl,
//	  	    link: function (scope, element, attrs) {
//	  	        scope.modalPosition = {};
//	  	        scope.isOpen = false;

//	  	        $timeout(function () {
//	  	            // trigger CSS transitions
//	  	            scope.animate = true;


//	  	            if (scope.verticalPopupPositionPerHeight == undefined) {
//	  	                scope.verticalPopupPositionPerHeight = 0;
//	  	            }

//	  	            if (scope.horisontalPopupPositionPerWidth == undefined) {
//	  	                scope.horisontalPopupPositionPerWidth = 0.5;
//	  	            }

//	  	            // Position the modal to the bottom center of the triggering element.
//	  	            scope.modalPosition.top = parseFloat(scope.top) + parseFloat(scope.height) - (parseFloat(element[0].offsetHeight) * scope.verticalPopupPositionPerHeight);//  + ;

//	  	            if (scope.arrowRight)
//	  	                scope.modalPosition.left = parseFloat(scope.left) + (parseFloat(scope.width) / 2) - (parseFloat(element[0].offsetWidth) * scope.horisontalPopupPositionPerWidth);
//                    else
//	  	                scope.modalPosition.left = parseFloat(scope.left) + (parseFloat(scope.width) / 2) - (parseFloat(element[0].offsetWidth) * scope.horisontalPopupPositionPerWidth);

//	  	            scope.modalPosition.top += 'px';
//	  	            scope.modalPosition.left += 'px';
//	  	        });

//                // Closes the popover if clicked elsewhere outside.
//	  	        function onDocumentClick(event) {
//	  	            var isChild = $(element).find(event.target).length > 0;

//	  	            if (!isChild && (scope.isOpen))
//	  	                scope.close();
//	  	        };

//                // Attach the click event listener to the document in order to handle the popover close.
//	  	        $document.on("click", onDocumentClick);

//                // Clean up.
//	  	        element.on('$destroy', function () {
//	  	            var modal = $modalpopoverStack.getTop();
//	  	            if (modal) {
//	  	                $modalpopoverStack.dismiss(modal.key, 'backdrop click');
//	  	                scope.isOpen = false;
//	  	                $document.off("click", onDocumentClick);
//	  	            }
//	  	        });

//                // Remove the popover element.
//	  	        scope.close = function () {
//	  	            element.remove();
//	  	        };

//                // Mark the popover as open.    
//	  	        $timeout(function () {
//	  	            scope.isOpen = true;
//	  	        });	  	        
//	  	    }
//	  	};
//	  }])

//	  .directive('modalpopoverTransclude', function () {
//	  	return {
//	  		link: function ($scope, $element, $attrs, controller, $transclude) {
//	  			$transclude($scope.$parent, function (clone) {
//	  				$element.empty();
//	  				$element.append(clone);
//	  			});
//	  		}
//	  	};
//	  })

//	  .factory('$modalpopoverStack', ['$transition', '$timeout', '$document', '$compile', '$rootScope', '$$stackedMap',
//		function ($transition, $timeout, $document, $compile, $rootScope, $$stackedMap) {

//			var backdropDomEl, backdropScope;
//			var openedWindows = $$stackedMap.createNew();
//			var $modalpopoverStack = {};

//			function backdropIndex() {
//				var topBackdropIndex = -1;
//				var opened = openedWindows.keys();
//				for (var i = 0; i < opened.length; i++) {
//					if (openedWindows.get(opened[i]).value.backdrop) {
//						topBackdropIndex = i;
//					}
//				}
//				return topBackdropIndex;
//			}

//			$rootScope.$watch(backdropIndex, function (newBackdropIndex) {
//				if (backdropScope) {
//					backdropScope.index = newBackdropIndex;
//				}
//			});

//			function removeModalWindow(modalInstance) {

//				var modalWindow = openedWindows.get(modalInstance).value;

//				//clean up the stack
//				openedWindows.remove(modalInstance);

//				//remove window DOM element
//				removeAfterAnimate(modalWindow.modalDomEl, modalWindow.modalScope, 300, function () {
//					modalWindow.modalScope.$destroy();
//					checkRemoveBackdrop();
//				});
//			}

//			function checkRemoveBackdrop() {
//				//remove backdrop if no longer needed
//				if (backdropDomEl && backdropIndex() == -1) {
//					var backdropScopeRef = backdropScope;
//					removeAfterAnimate(backdropDomEl, backdropScope, 150, function () {
//						backdropScopeRef.$destroy();
//						backdropScopeRef = null;
//					});
//					backdropDomEl = undefined;
//					backdropScope = undefined;
//				}
//			}

//			function removeAfterAnimate(domEl, scope, emulateTime, done) {
//				// Closing animation
//				scope.animate = false;

//				var transitionEndEventName = $transition.transitionEndEventName;
//				if (transitionEndEventName) {
//					// transition out
//					var timeout = $timeout(afterAnimating, emulateTime);

//					domEl.bind(transitionEndEventName, function () {
//						$timeout.cancel(timeout);
//						afterAnimating();
//						scope.$apply();
//					});
//				} else {
//					// Ensure this call is async
//					$timeout(afterAnimating);
//				}

//				function afterAnimating() {
//					if (afterAnimating.done) {
//						return;
//					}
//					afterAnimating.done = true;

//					domEl.remove();
//					if (done) {
//						done();
//					}
//				}
//			}

//			$document.bind('keydown', function (evt) {
//				var modal;

//				if (evt.which === 27) {
//					modal = openedWindows.top();
//					if (modal && modal.value.keyboard) {
//						evt.preventDefault();
//						$rootScope.$apply(function () {
//							$modalpopoverStack.dismiss(modal.key, 'escape key press');
//						});
//					}
//				}
//			});

//			$modalpopoverStack.open = function (modalInstance, modal) {

//				openedWindows.add(modalInstance, {
//					deferred: modal.deferred,
//					modalScope: modal.scope,
//					backdrop: modal.backdrop,
//					keyboard: modal.keyboard
//				});

//				var body = $document.find('body').eq(0),
//					currBackdropIndex = backdropIndex();

//			    var bodyRect = document.body.getBoundingClientRect(),
//				elemRect = modal.scope.event.target.getBoundingClientRect(),
//				offsetTop = elemRect.top - bodyRect.top,
//				offsetLeft = elemRect.left - bodyRect.left;

//				var angularDomEl = angular.element('<div modalpopover-window></div>');
//				angularDomEl.attr({
//					'template-url': modal.windowTemplateUrl,
//					'window-class': modal.windowClass,
//					'size': modal.size,
//					'index': openedWindows.length() - 1,
//					'animate': 'animate',
//					'left': offsetLeft,
//					'top': offsetTop,
//					'height': modal.scope.event.target.offsetHeight,
//					'width': modal.scope.event.target.offsetWidth,
//					'arrow-right': modal.arrowRight,
//					'class-name': modal.className,
//					'vertical-popup-position-per-height': modal.verticalPopupPositionPerHeight,
//					'horisontal-popup-position-per-width': modal.horisontalPopupPositionPerWidth,
//				}).html(modal.content);

//				var modalDomEl = $compile(angularDomEl)(modal.scope);

//				openedWindows.top().value.modalDomEl = modalDomEl;
//				body.append(modalDomEl);
//			};

//			$modalpopoverStack.close = function (modalInstance, result) {
//				var modalWindow = openedWindows.get(modalInstance);
//				if (modalWindow) {
//					modalWindow.value.deferred.resolve(result);
//					removeModalWindow(modalInstance);
//				}
//			};

//			$modalpopoverStack.dismiss = function (modalInstance, reason) {
//				var modalWindow = openedWindows.get(modalInstance);
//				if (modalWindow) {
//					modalWindow.value.deferred.reject(reason);
//					removeModalWindow(modalInstance);
//				}
//			};

//			$modalpopoverStack.dismissAll = function (reason) {
//				var topModal = this.getTop();
//				while (topModal) {
//					this.dismiss(topModal.key, reason);
//					topModal = this.getTop();
//				}
//			};

//			$modalpopoverStack.getTop = function () {
//				return openedWindows.top();
//			};

//			return $modalpopoverStack;
//		}])

//	  .provider('$modalpopover', function () {

//	  	var $modalpopoverProvider = {
//	  		options: {
//	  			backdrop: true, //can be also false or 'static'
//	  			keyboard: true
//	  		},
//	  		$get: ['$injector', '$rootScope', '$q', '$http', '$templateCache', '$controller', '$modalpopoverStack',
//			  function ($injector, $rootScope, $q, $http, $templateCache, $controller, $modalpopoverStack) {

//			  	var $modalpopover = {};

//			  	function getTemplatePromise(options) {
//			  		return options.template ? $q.when(options.template) :
//                      $http.get(angular.isFunction(options.templateUrl) ? (options.templateUrl)() : options.templateUrl,
//                        { cache: $templateCache }).then(function (result) {
//                        	return result.data;
//                        });
//			  	}

//			  	function getResolvePromises(resolves) {
//			  		var promisesArr = [];
//			  		angular.forEach(resolves, function (value) {
//			  			if (angular.isFunction(value) || angular.isArray(value)) {
//			  				promisesArr.push($q.when($injector.invoke(value)));
//			  			}
//			  		});
//			  		return promisesArr;
//			  	}

//			  	$modalpopover.open = function (modalOptions, event) {

//			  		var modalResultDeferred = $q.defer();
//			  		var modalOpenedDeferred = $q.defer();

//			  		//prepare an instance of a modal to be injected into controllers and returned to a caller
//			  		var modalInstance = {
//			  			result: modalResultDeferred.promise,
//			  			opened: modalOpenedDeferred.promise,
//			  			close: function (result) {
//			  				$modalpopoverStack.close(modalInstance, result);
//			  			},
//			  			dismiss: function (reason) {
//			  				$modalpopoverStack.dismiss(modalInstance, reason);
//			  			}
//			  		};

//			  		//merge and clean up options
//			  		modalOptions = angular.extend({}, $modalpopoverProvider.options, modalOptions);
//			  		modalOptions.resolve = modalOptions.resolve || {};

//			  		//verify options
//			  		if (!modalOptions.template && !modalOptions.templateUrl) {
//			  			throw new Error('One of template or templateUrl options is required.');
//			  		}

//			  		var templateAndResolvePromise =
//                      $q.all([getTemplatePromise(modalOptions)].concat(getResolvePromises(modalOptions.resolve)));


//			  		templateAndResolvePromise.then(function resolveSuccess(tplAndVars) {

//			  			var modalScope = (modalOptions.scope || $rootScope).$new();
//			  			modalScope.$close = modalInstance.close;
//			  			modalScope.$dismiss = modalInstance.dismiss;
//			  			modalScope.event = event;

//			  			var ctrlInstance, ctrlLocals = {};
//			  			var resolveIter = 1;

//			  			//controllers
//			  			if (modalOptions.controller) {
//			  				ctrlLocals.$scope = modalScope;
//			  				ctrlLocals.$modalInstance = modalInstance;
//			  				angular.forEach(modalOptions.resolve, function (value, key) {
//			  					ctrlLocals[key] = tplAndVars[resolveIter++];
//			  				});

//			  				ctrlInstance = $controller(modalOptions.controller, ctrlLocals);
//			  				if (modalOptions.controllerAs) {
//			  					modalScope[modalOptions.controllerAs] = ctrlInstance;
//			  				}
//			  			}

//			  			$modalpopoverStack.open(modalInstance, {
//			  				scope: modalScope,
//			  				deferred: modalResultDeferred,
//			  				content: tplAndVars[0],
//			  				backdrop: modalOptions.backdrop,
//			  				keyboard: modalOptions.keyboard,
//			  				backdropClass: modalOptions.backdropClass,
//			  				windowClass: modalOptions.windowClass,
//			  				windowTemplateUrl: modalOptions.windowTemplateUrl,
//			  				size: modalOptions.size,
//			  				arrowRight: modalOptions.arrowRight,
//			  				className: modalOptions.className,
//			  				verticalPopupPositionPerHeight: modalOptions.verticalPopupPositionPerHeight,
//			  				horisontalPopupPositionPerWidth: modalOptions.horisontalPopupPositionPerWidth
//			  			});

//			  		}, function resolveError(reason) {
//			  			modalResultDeferred.reject(reason);
//			  		});

//			  		templateAndResolvePromise.then(function () {
//			  			modalOpenedDeferred.resolve(true);
//			  		}, function () {
//			  			modalOpenedDeferred.reject(false);
//			  		});

//			  		return modalInstance;
//			  	};

//			  	return $modalpopover;
//			  }]
//	  	};

//	  	return $modalpopoverProvider;
//	  });
//})();