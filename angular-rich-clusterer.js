'use strict';

(function () {

    /*
     * exposes 'ngRichClusterer' angular module
     */
    var ngRichClusterer = angular.module('ngRichClusterer', []);

    /*
     * Directive 'rich-map' to generate google maps
     */
    ngRichClusterer.directive('richMap', [
        '$log',
        function ($log) {
            if (angular.isUndefined(google) || angular.isUndefined(google.maps)) {
                $log.log('google maps is not injected into the project.');
                return {};
            }
            return {
                restrict: 'EA',
                replace: true,
                transclude: true,
                template: '<div class="rich-google-map" style="width: 100%;height: 100%;"></div>',
                link: function (scope, element) {
                    var map, markers, mapOptions;

                    mapOptions = angular.extend({
                        center: new google.maps.LatLng(-34.397, 150.644),
                        zoom: 8
                    }, scope.options || {});

                    map = new google.maps.Map(element[0], mapOptions);
                    if (scope.markers) {
                        markers = [];
                        if (angular.isArray(scope.markers)) {
                            var marker;
                            for (var i = 0; i <= scope.markers.length; i += 1) {
                                marker = angular.extend({
                                    map: map
                                }, scope.markers[i]);
                                markers.push(new RichMarker(marker));
                            }
                        }
                    }
                    else if (scope.clusterMarkers) {
                        markers = [];
                        if (angular.isArray(scope.clusterMarkers)) {
                            var marker;
                            for (var i = 0; i <= scope.clusterMarkers.length; i += 1) {
                                marker = angular.extend({}, scope.clusterMarkers[i]);
                                markers.push(new RichMarker(marker));
                            }
                            scope.cluster = new MarkerClusterer(map, markers, scope.clusterMarkersOptions || null);
                        }
                    }
                }
            };
        }
    ]);
}());