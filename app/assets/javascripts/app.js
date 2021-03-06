var app = angular.module('HNSearch', [
  'ui.router',
  'ngRoute',
  'templates',
  'HNSearch.controllers',
  'HNSearch.services',
  'angular-google-analytics'
])

.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', 'AnalyticsProvider', function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, AnalyticsProvider) {
  // setup CSRF token
  $httpProvider.defaults.headers.common["X-CSRF-TOKEN"] = $('meta[name="csrf-token"]').attr('content');

  // use JSON by default
  $httpProvider.defaults.headers.common.Accept = 'application/json';
  $httpProvider.useApplyAsync(true);

  // html 5 mode
  $locationProvider.html5Mode(true);

  // backward compat
  var hash = window.location.hash;
  var backwardCompatParams;
  if (hash.indexOf('#!/') === 0) {
    var parts = hash.substring(3).split('/');
    var type = parts.shift();
    var created_at = parts.shift();
    var v = parts.shift();
    var prefixedSearch, page;
    if (v === 'prefix') {
      prefixedSearch = true;
      page = parseInt(parts.shift());
    } else {
      prefixedSearch = false;
      page = parseInt(v);
    }
    var q = decodeURIComponent(parts.join('/'));

    var dateRange;
    switch (created_at) {
    case "last_24h": dateRange = "last24h"; break;
    case "past_week": dateRange = "pastWeek"; break;
    case "past_month": dateRange = "pastMonth"; break;
    default: dateRange = "all"; break;
    }

    backwardCompatParams = {
      query: q,
      type: type,
      dateRange: dateRange,
      prefix: prefixedSearch,
      page: page
    };
  }

  // routes
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('root', {
      url: '',
      abstract: true,
      templateUrl: 'layout.html',
    })
    .state('root.about', {
      url: '/about',
      views: {
        'main-header': { template: '<h1>About</h1>' },
        'main-content': { templateUrl: 'about.html' }
      }
    })
    .state('root.cool_apps', {
      url: '/cool_apps',
      views: {
        'main-header': { template: '<h1>Cool apps</h1>' },
        'main-content': { templateUrl: 'cool_apps.html' }
      }
    })
    .state('root.api', {
      url: '/api',
      views: {
        'main-header': { template: '<h1>HN Search API</h1>' },
        'main-content': { templateUrl: 'api.html' }
      }
    })
    .state('root.help', {
      url: '/help',
      views: {
        'main-header': { template: '<h1>Help</h1>' },
        'main-content': { templateUrl: 'help.html' }
      }
    })
    .state('settings', {
      abstract: true,
      templateUrl: 'layout.html',
      controller: 'SettingsCtrl'
    })
    .state('settings.edit', {
      url: '/settings',
      views: {
        'main-header': { template: '<h1>Settings</h1>' },
        'main-content': { templateUrl: 'settings.html' }
      }
    })
    .state('search', {
      abstract: true,
      templateUrl: 'layout.html',
      controller: 'SearchCtrl'
    })
    .state('search.story', {
      url: '/story/:id',
      views: {
        'col-2@search': { templateUrl: '_home-col-2.html' },
        'col-3@search': { templateUrl: '_home-col-3.html' },
        'main-header@search': { templateUrl: '_home-header.html' },
        'main-content@search': { templateUrl: 'home.html', controller: 'StoryCtrl' }
      }
    })
    .state('search.page', {
      url: '/:page',
      views: {
        'col-2@search': { templateUrl: '_home-col-2.html' },
        'col-3@search': { templateUrl: '_home-col-3.html' },
        'main-header@search': { templateUrl: '_home-header.html' },
        'main-content@search': { templateUrl: 'home.html' }
      },
      onEnter: ['$location', function($location) {
        if (backwardCompatParams) {
          $location.path('/').search(backwardCompatParams);
          backwardCompatParams = null;
        }
      }]
    })
    ;

    // GA
    AnalyticsProvider.setAccount('UA-32446386-3');
    AnalyticsProvider.useCrossDomainLinker(true);
    AnalyticsProvider.setCrossLinkDomains(['new-hn.algolia.com', 'hn.algolia.com']);
    AnalyticsProvider.trackPages(true);
    AnalyticsProvider.setPageEvent('$stateChangeSuccess');
}])

$(document).ready(function() {
  // sticky main
  var body = $('body');
  var scrollTopBtn = $('.scroll-to-top');
  var doc = $(document)
  doc.on("scroll", function(e) {
    if (body.attr('rel') === 'default') {
      return;
    }
    if (doc.scrollTop() > 100) {
      body.addClass('small-header');
      scrollTopBtn.addClass('in');
    } else {
      body.removeClass('small-header');
      scrollTopBtn.removeClass('in');
    }
  });
  //scroll top
  $('.scroll-to-top').on('click', function(e){
    e.preventDefault();
    doc.scrollTop(0);
  });
  doc.keydown(function(e){
    if (e.keyCode == 38)
      doc.scrollTop(0);
  });
});
