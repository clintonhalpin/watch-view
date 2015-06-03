module.exports = function($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise("/preview");
    $stateProvider
        .state('index', {
          url: "/preview",
          templateUrl: "components/preview/html/index.html",
          controller: 'previewCtrl'
    });
}
