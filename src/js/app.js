'use strict';

require('./../bower_components/angular/angular.min.js');
require('./../bower_components/angular-ui-router/release/angular-ui-router.min.js');

angular.module('app', [
    'ui.router'
])

.config(["$urlRouterProvider", "$stateProvider", require('./routes') ])

.controller('previewCtrl', [ '$scope', require('./../components/preview/controllers/index.js') ])

// Fire it up 
angular.element(document).ready(function() {
    angular.bootstrap(document, ['app'])
});

