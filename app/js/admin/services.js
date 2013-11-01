'use strict';

angular.module('themis.service.guest', []).
    factory('Guest', ['$resource', 'config', function ($resource, config) {
        return $resource(config.service.url + '/guest/:uri/:userAlias/:emailAddress/:action', {}, {
            create: {method: 'PUT', params: {uri: "create"}, isArray: false}
        });
    }])
;
