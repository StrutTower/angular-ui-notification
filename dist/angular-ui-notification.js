(function () {
    angular
        .module('ui-notification', [])
        .provider('notify', notify);

    function notify() {
        this.options = {
            delay: 5000,
            startTop: 10,
            startRight: 10,
            verticalSpacing: 10,
            horizontalSpacing: 10,
            positionX: 'center',
            positionY: 'top',
            replaceMessage: false,
            templateUrl: 'angular-ui-notification.html'
        };

        this.setOptions = function (options) {
            if (!angular.isObject(options)) {
                throw new Error('Options should be an object!');
            }
            this.options = angular.extend({}, this.options, options);
        };

        this.$get = getNotify;
        getNotify.$inject = ['$timeout', '$http', '$compile', '$templateCache', '$rootScope', '$sce', '$q', '$window'];
        function getNotify ($timeout, $http, $compile, $templateCache, $rootScope, $sce, $q, $window) {
            var options = this.options;

            var startTop = options.startTop;
            var startRight = options.startRight;
            var verticalSpacing = options.verticalSpacing;
            var horizontalSpacing = options.horizontalSpacing;
            var delay = options.delay;

            var messageElements = [];
            var isResizeBound = false;

            var notify = function (args, t) {
                var deferred = $q.defer();

                if (typeof args !== 'object') {
                    args = { message: args };
                }

                args.scope = args.scope ? args.scope : $rootScope;
                args.template = args.templateUrl ? args.templateUrl : options.templateUrl;
                args.delay = !angular.isUndefined(args.delay) ? args.delay : delay;
                args.type = t || options.type || 'btn-primary';
                args.positionY = args.positionY ? args.positionY : options.positionY;
                args.positionX = args.positionX ? args.positionX : options.positionX;
                args.replaceMessage = args.replaceMessage ? args.replaceMessage : options.replaceMessage;

                $http.get(args.template, { cache: $templateCache }).then(function (response) {

                    var scope = args.scope.$new();
                    scope.message = $sce.trustAsHtml(args.message);
                    scope.title = $sce.trustAsHtml(args.title);
                    scope.t = args.type.substr(0, 1);
                    scope.delay = args.delay;

                    var reposite = function () {
                        var j = 0;
                        var k = 0;
                        var lastTop = startTop;
                        var lastRight = startRight;
                        var lastPosition = [];
                        for (var i = messageElements.length - 1; i >= 0; i--) {
                            var element = messageElements[i];
                            if (args.replaceMessage && i < messageElements.length - 1) {
                                element.addClass('killed');
                                continue;
                            }
                            var elHeight = parseInt(element[0].offsetHeight);
                            var elWidth = parseInt(element[0].offsetWidth);
                            var position = lastPosition[element._positionY + element._positionX];

                            var top = (lastTop = position ? (j === 0 ? position : position + verticalSpacing) : startTop);
                            var right = lastRight + (k * (horizontalSpacing + elWidth));

                            if ((top + elHeight) > window.innerHeight) {
                                position = startTop;
                                k++;
                                j = 0;
                            }

                            element.css(element._positionY, top + 'px');
                            
                            switch (element._positionX) {
                                case 'center':
                                    element.addClass('center');
                                    break;
                                case 'left':
                                    element.addClass('left');
                                    break;
                                case 'right':
                                    element.addClass('right');
                                    break;
                            }
                            lastPosition[element._positionY + element._positionX] = top + elHeight;
                            j++;
                        }
                    };

                    var templateElement = $compile(response.data)(scope);
                    templateElement._positionY = args.positionY;
                    templateElement._positionX = args.positionX;
                    templateElement.addClass(args.type);
                    templateElement.bind('webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd click', function (e) {
                        e = e.originalEvent || e;
                        if ((e.propertyName === 'opacity')) {
                            templateElement.remove();
                            messageElements.splice(messageElements.indexOf(templateElement), 1);
                            reposite();
                        }
                        else if (e.type === 'click') {
                            templateElement.addClass('fast-killed');
                        }
                    });
                    if (angular.isNumber(args.delay)) {
                        $timeout(function () {
                            templateElement.addClass('killed');
                        }, args.delay);
                    }

                    angular.element(document.getElementsByTagName('body')).append(templateElement);
                    var offset = -(parseInt(templateElement[0].offsetHeight) + 50);
                    templateElement.css(templateElement._positionY, offset + 'px');
                    messageElements.push(templateElement);

                    scope._templateElement = templateElement;

                    scope.kill = function (isHard) {
                        if (isHard) {
                            messageElements.splice(messageElements.indexOf(scope._templateElement), 1);
                            scope._templateElement.remove();
                            $timeout(reposite);
                        } else {
                            scope._templateElement.addClass('killed');
                        }
                    };

                    $timeout(reposite);

                    if (!isResizeBound) {
                        angular.element($window).bind('resize', function (e) {
                            $timeout(reposite);
                        });
                        isResizeBound = true;
                    }

                    deferred.resolve(scope);

                }).catch(function (data) {
                    throw new Error('Template (' + args.template + ') could not be loaded. ' + data);
                });

                return deferred.promise;
            };

            notify.primary = function (args) {
                return this(args, 'btn-primary');
            };
            notify.danger = function (args) {
                return this(args, 'btn-danger');
            };
            notify.success = function (args) {
                return this(args, 'btn-success');
            };
            notify.info = function (args) {
                return this(args, 'btn-info');
            };
            notify.warning = function (args) {
                return this(args, 'btn-warning');
            };

            notify.clearAll = function () {
                angular.forEach(messageElements, function (element) {
                    element.addClass('killed');
                });
            };

            return notify;
        }
    }

    angular.module("ui-notification").run(["$templateCache", function($templateCache) {$templateCache.put("angular-ui-notification.html","<div class=\"ui-notification\">\r\n    <h3 data-ng-show=\"title\" data-ng-bind-html=\"title\"></h3>\r\n    <div class=\"message\" data-ng-bind-html=\"message\"></div>\r\n</div>");}]);
})();