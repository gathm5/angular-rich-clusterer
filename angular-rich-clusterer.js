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
        '$timeout',
        function ($log, $timeout) {
            if (angular.isUndefined(google) || angular.isUndefined(google.maps)) {
                $log.log('google maps is not injected into the project.');
                return {};
            }
            return {
                restrict: 'EA',
                replace: true,
                transclude: true,
                scope: {
                    markers: '=',
                    clusterMarkers: '=',
                    styles: '='
                },
                template: '<div class="rich-google-map" style="width: 100%;height: 100%;"></div>',
                link: function (scope, element, attr) {
                    var map, markers, mapOptions;
                    var MarkerConstructor = RichMarker || google.maps.Marker;

                    markers = [];
                    mapOptions = angular.extend({
                        center: new google.maps.LatLng(-34.397, 150.644),
                        zoom: 3
                    }, scope.options || {});

                    map = new google.maps.Map(element[0], mapOptions);
                    function markInMap() {
                        var i;
                        if (markers.length > 0) {
                            for (i = 0; i < markers.length; i += 1) {
                                markers[i].unset(null);
                            }
                            markers.length = 0;
                        }
                        if (angular.isArray(scope.markers)) {
                            var marker;
                            var position;
                            for (i = 0; i < scope.markers.length; i += 1) {
                                marker = angular.extend({
                                    map: map
                                }, scope.markers[i]);
                                if (marker.position.lat) {
                                    position = new google.maps.LatLng(marker.position.lat, marker.position.lng);
                                    marker.position = position;
                                }
                                markers.push(new MarkerConstructor(marker));
                            }
                        }
                    }

                    $timeout(function () {
                        if (scope.markers) {
                            markInMap();
                            attr.$observe('markers', function (newMarkers, oldMarkers) {
                                if (newMarkers !== oldMarkers) {
                                    markInMap();
                                }
                            });
                        }
                        else if (scope.clusterMarkers) {
                            var position;
                            markers = [];
                            if (angular.isArray(scope.clusterMarkers)) {
                                var marker;
                                for (var i = 0; i < scope.clusterMarkers.length; i += 1) {
                                    marker = angular.extend({}, scope.clusterMarkers[i]);
                                    if (!angular.isUndefined(marker.position.lat)) {
                                        position = new google.maps.LatLng(marker.position.lat, marker.position.lng);
                                        marker.position = position;
                                    }
                                    marker.flat = true;
                                    markers.push(new RichMarker(marker));
                                }
                                scope.cluster = new MarkerClusterer(map, markers, scope.styles || null);
                            }
                        }
                    }, 100);

                    /*
                     var clusterStyles = [
                     {
                     textColor: 'white',
                     url: 'images/yeoman.png',
                     height: 50,
                     width: 50
                     },
                     {
                     textColor: 'white',
                     url: 'images/yeoman.png',
                     height: 50,
                     width: 50
                     },
                     {
                     textColor: 'white',
                     url: 'images/yeoman.png',
                     height: 50,
                     width: 50
                     }
                     ];

                     $scope.mcOptions = {
                     gridSize: 50,
                     styles: clusterStyles,
                     maxZoom: 15
                     };
                     */

                }
            };
        }
    ]);
}());