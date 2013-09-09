'use strict';


// Declare app level module which depends on filters, and services
angular.module('branch.config', []).constant(
	'config',
	{
		service : {
			url : 'http://localhost\\:8080/themis',
            url_noescp : 'http://localhost:8080/themis'
		}

	}
);