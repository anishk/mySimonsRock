'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('MyCtrl1', [function() {

  }])
  .controller('MyCtrl2', [function() {

  }])
  .controller('AboutCtrl', [function() {

  }])
  .controller('ReportIssueCtrl', ['$scope', '$rootScope','$http', '$location',
    function($scope, $rootScope, $http, $location) {
        if(window.device) {
            window.plugin.email.open({
                to:      [$rootScope.metadata.reportissueEmail],
                subject: 'myCampus Mobile ( ' + $rootScope.tenant + ' ) Issue reporting',
                body:    '\n\n\n\n\n\n\n<h3>Device Details</h3><br/><p>' +
                    'Platform : ' + window.device.platform  + '<br/>' +
                    'UUID : ' + window.device.uuid  + '<br/>' +
                    'Device version : ' + window.device.version  + '<br/>' +
                    'Device model : ' + window.device.model  + '<br/>' +
                    'Build Version : ' + $rootScope.metadata.version  + '<br/>' +
                    '</p>',
                isHtml:  true
            });
        }else {
            apprise("This feature is not available on Emulator", {'verify':false, 'textYes':"Ok"}, function(r) {

            });
        }
        $location.path("/home");
    }])
  .controller('SendFeedbackCtrl', ['$scope', '$rootScope','$http', '$location',
        function($scope, $rootScope, $http, $location) {
        if(window.device) {
            window.plugin.email.open({
                to:      [$rootScope.metadata.feedbackEmail],
                subject: 'myCampus Mobile ( ' + $rootScope.tenant + ' ) Feedback',
                body:    '\n\n\n\n\n\n\n<h3>Device Details</h3><br/><p>' +
                    'Platform : ' + window.device.platform  + '<br/>' +
                    'UUID : ' + window.device.uuid  + '<br/>' +
                    'Device version : ' + window.device.version  + '<br/>' +
                    'Device model : ' + window.device.model  + '<br/>' +
                    'Build Version : ' + $rootScope.metadata.version  + '<br/>' +
                    '</p>',
                isHtml:  true
            });
        }else {
            apprise("This feature is not available on Emulator", {'verify':false, 'textYes':"Ok"}, function(r) {

            });
        }
        $location.path("/home");
  }])
  .controller('DeviceCtrl', ['$scope','$rootScope', function($scope, $rootScope) {
/*
        alert (window.device);
        alert (window.device.name);
*/
//        var onDeviceReady = function() {
//            alert ("Device : " + device);
//            alert ("Device name " + device.name);
//            alert ("window Device name : " + window.device.name);
//            alert ("window Device uuid : " + window.device.uuid);
            $scope.devicename = window.device.name;
            $scope.deviceuuid = window.device.uuid;
            $scope.deviceplatform = window.device.platform;
            $scope.deviceversion = window.device.version;
            $scope.devicemodel = window.device.model;
//            $scope.$apply();
//        };

//        document.addEventListener("deviceready", onDeviceReady, false);

        $rootScope.showlogin=false;
        MyCampusApp.homeScreenDisplayed = false;

  }])


  .controller('LoginCtrl', ['$scope', '$rootScope','$http', '$location',
                        function($scope, $rootScope, $http, $location) {
            $rootScope.showlogin=false;
            $("#loginUsername").focus();
            $rootScope.login = function() {
            if ($("#loginUsername").val().length == 0) {
                alert('Please enter your username.');
                return false;
            }
            if ($("#loginPassword").val().length == 0) {
                alert('Please enter your password.');
                return false;
            }
            var username = $("#loginUsername").val();
            var password = $("#loginPassword").val();
            var data = "username=" + username + "&password=" + password;
            window['authFunction'](username, password, $http, $rootScope, function(data) {
                if(data.error) {
                    apprise(data.error, {'verify':false, 'textYes':"Ok"}, function(r) {
                        $rootScope.ticket = null;
                        $rootScope.loggedin = false;
                        $rootScope.userroles = null;
                        $.jStorage.deleteKey('username');
                        $.jStorage.deleteKey('password');
                        $.jStorage.deleteKey('ticket');
                    });
                }else {
                    var ticket = data.ticket;
                    $rootScope.ticket = ticket;
                    $rootScope.userroles = data.roles;
                    $.jStorage.set('username', username);
                    $.jStorage.set('password', password);
                    $.jStorage.set('ticket', ticket);
                    if($rootScope.loggedin == true) {
                    }else {
                        $rootScope.loggedin = true;
                        $location.path("/home");
                    }

                }
            }, function(data) {
                //alert("Error call back" + data);
                apprise("Error occured while processing this request.", {'verify':false, 'textYes':"Ok"}, function(r) {
                    $rootScope.ticket = null;
                    $rootScope.loggedin = false;
                    $rootScope.userroles = null;
                    $.jStorage.deleteKey('username');
                    $.jStorage.deleteKey('password');
                    $.jStorage.deleteKey('ticket');
                });
            });
//            $rootScope.authenticate(username, password, function(data) {
//                alert ("Susccess called back " + data);
//            }, function(data) {
//               alert("Error call back" + data);
//            });
            /*MyCampusApp.invokeService($rootScope, $http, "services/authenticate/login", "POST", data,
                function(data, status, headers, config) {
                //console.log("Success Data : " + data);
                //alert ("Success : " + data);
                if(data.error) {
                    apprise(data.error, {'verify':false, 'textYes':"Ok"}, function(r) {
                        $rootScope.ticket = null;
                        $rootScope.loggedin = false;
                        $.jStorage.deleteKey('username');
                        $.jStorage.deleteKey('password');
                        $.jStorage.deleteKey('ticket');
                    });
                }else {
                    var ticket = data.ticket;
                    $rootScope.ticket = ticket;
                    $rootScope.loggedin = true;
                    $.jStorage.set('username', username);
                    $.jStorage.set('password', password);
                    $.jStorage.set('ticket', ticket);
                    $location.path("/home");
                }
            }, function(data, status, headers, config) {
                console.log("Error Data : " + data);
                alert ("Error : " + data);
            });  */

           /* var url="";
            if(window.device) {
                url=authUrl;
            }else {
                url = "/comet/websimulator/json?url=" + authUrl;
                data = {method:'POST', body: data};
            }
            $http.post(url, data).
                success(function(data, status, headers, config) {
                    //console.log("Success Data : " + data);
                    //alert ("Success : " + data);
                    if(data.error) {
                        apprise(data.error, {'verify':false, 'textYes':"Ok"}, function(r) {
                            $rootScope.ticket = null;
                            $rootScope.loggedin = false;
                            $.jStorage.deleteKey('username');
                            $.jStorage.deleteKey('password');
                            $.jStorage.deleteKey('ticket');
                        });
                    }else {
                        var ticket = data.ticket;
                        $rootScope.ticket = ticket;
                        $rootScope.loggedin = true;
                        $.jStorage.set('username', username);
                        $.jStorage.set('password', password);
                        $.jStorage.set('ticket', ticket);
                        $location.path("/home");
                    }
                }).
                error(function(data, status, headers, config) {
                    console.log("Error Data : " + data);
                    alert ("Error : " + data);
                });*/
        };

  }])


  .controller('SettingsCtrl', ['$rootScope', '$scope','$http', '$location', '$window', '$sce', '$route', '$compile',
        function($rootScope, $scope, $http , $location, $window, $sce, $route, $compile){
        //$scope.serverUrl = "http://localhost:8081/";
        $scope.serverUrlChange = function() {
            $rootScope.serverUrl = $scope.serverUrl;
            $.jStorage.set('serverUrl', $rootScope.serverUrl);
            //window.localStorage.setItem('serverUrl', $rootScope.serverUrl);
        };
        $scope.tenantChange = function() {
            $rootScope.tenant = $scope.tenant;
            $.jStorage.set('tenant', $rootScope.tenant);
            //window.localStorage.setItem('tenant', $rootScope.tenant);
        };
        $rootScope.showlogin=false;
        MyCampusApp.homeScreenDisplayed = false;

        $scope.grid = function() {
            $rootScope.hslayout="grid";
            $('#gridbtn').attr('class', 'btn btn-primary');
            $('#listbtn').attr('class', 'btn btn-befault');
        };

        $scope.list = function() {
            $rootScope.hslayout="list";
            $('#gridbtn').attr('class', 'btn btn-default');
            $('#listbtn').attr('class', 'btn btn-primary');
        };

        if($rootScope.hslayout=="list") {
            $('#gridbtn').attr('class', 'btn btn-default');
            $('#listbtn').attr('class', 'btn btn-primary');
        } else {
            $('#gridbtn').attr('class', 'btn btn-primary');
            $('#listbtn').attr('class', 'btn btn-befault');
        }

        $scope.resetmyapp = function() {
             var tenant = MyCampusApp.config.tenant;
             $.jStorage.deleteKey(tenant + '-metadata');
             $location.path("/home");
        }
    }])
  .controller('HomeCtrl', ['$rootScope', '$scope','$http', '$location', '$window', '$sce', '$route', '$compile',
        function($rootScope, $scope, $http , $location, $window, $sce, $route, $compile) {
        //alert("Home controller called..");
        //alert ("Home Controller called");
            setTimeout(function() {

        MyCampusApp.homeRoute = $route;
        if(window.device) {
            if($.jStorage.get('username')) {
                $rootScope.loggedin = true;
            }else {
                $rootScope.loggedin = false;
            }
        }
        if($rootScope.loggedin) {
            $rootScope.loginclass  = "fa fa-power-off fa-2x";
            $rootScope.logintext = "Logout";
        }else {
            $rootScope.loginclass  = "fa fa-user fa-2x";
            $rootScope.logintext = "Login";
        }


        if(!$rootScope.hslayout) {
            $rootScope.hslayout = 'grid';
        }

        /** Get the Tenant information **/
        var tenant = MyCampusApp.config.tenant;

        if($.jStorage.get('tenant')) {
            tenant = $.jStorage.get('tenant');
        }


        /**
         * Update the Root scope model for Home screen
         */
        //alert ("Before fillRootScopeForHome ");
        MyCampusApp.fillRootScopeForHome($rootScope, $sce, tenant, $window, $location, $route, $http);

        if(window.device) {
            var allIcons, allScreens, dock, dockIcons, icon, stage, _i, _len, _results;
            allIcons = [];
            dockIcons = [];
            $.each($rootScope.apps, function(index, val) {
                if(val.showInHome) {
                    allIcons.push(new Icon(val.name, val.displayname, "#app/" + val.name + "/" + val.name, val.logo));
                }
                if(val.showInDock) {
                    dockIcons.push(new DockIcon(val.name, val.displayname, "#app/" + val.name + "/" + val.name, val.logo));
                }
            });
            var docWidth  = $(document).width();
            var winWidth = $(window).width();
            if(docWidth != winWidth) {
                docWidth = docWidth - 15;
            }
            Stage.prototype.screenWidth = docWidth; //$(window).width() + 16;
            allScreens = $('#allScreens');
            //allScreens.Touchable();
            if($.isNumeric($rootScope.metadata.iconWidth)) {
                stage = new Stage(allIcons, $rootScope.metadata.iconWidth);
            }else {
                stage = new Stage(allIcons, 64);
            }
            //stage = new Stage(allIcons);
            stage.addScreensTo(allScreens);
            stage.addIndicatorsTo('#indicators');
            $rootScope.stage = stage;
            dock = $('#dock');
            _results = [];
            for (_i = 0, _len = dockIcons.length; _i < _len; _i++) {
                icon = dockIcons[_i];
                _results.push(dock.append(icon.markup));
            }
            /*var hammertime = Hammer(allScreens).on("swipeleft", function(event) {
                stage.previous();
            });
            var hammertime = Hammer(allScreens).on("swiperight", function(event) {
                stage.next();
            });*/

            /*allScreens.bind('touchablemove', function(e, touch) {
                if (touch.currentDelta.x < -5) {
                    stage.next();
                }
                if (touch.currentDelta.x > 5) {
                    return stage.previous();
                }
            });*/
        }

        //alert ("After fillRootScopeForHome ");
            /*if($rootScope.hslayout == 'grid') {
                var gridTemplate = '<div class="col-xs-3 col-sm-1 col-md-6" ng-repeat="app in apps">' +
                    '<a href="#app/{{app.name}}/{{app.name}}" class="thumbnail">' +
                    '<img id="logo-{{app.name}}" src="{{app.logo}}"  alt="..."/>'+
                    '<div style="text-align:center;">{{app.displayname}}</div>'+
                    '</a>'+
                    '</div>';
                var component = $compile($(gridTemplate))($scope);
                $('#homeContainer').append(component);
            }
            if($rootScope.hslayout == 'list') {
                var listTemplate = '<ul class="media-list list-group">'+
                    '<li class="media list-group-item" ng-repeat="app in apps">'+
                    '<a href="#app/{{app.name}}/{{app.name}}" class="pull-left">'+
                    '<img class="media-object thumbnail"  style="width:5em;height:5em;" id="logo-{{app.name}}" src="{{app.logo}}"  alt="...">'+
                    '</a>'+
                    '<div class="media-body">'+
                    '<h4 class="media-heading">{{app.displayname}}</h4>'+
                    '<p>{{app.description}}</p>'+
                    '</div>'+
                    '</li>'+
                    '</ul>';
                var component = $compile($(listTemplate))($scope);
                $('#homeContainer').append(component);

            }*/


        var baseUrl = MyCampusApp.config.serverUrl; //"http://localhost:8081/";
        if($rootScope.serverUrl != undefined) {
            baseUrl = $rootScope.serverUrl;
        }
        if(!$rootScope.routeloaded) {
            $rootScope.routeloaded = true;

        }
        //alert ("BEfore updateAppLogos");
        MyCampusApp.updateAppLogos(tenant);
        //alert ("After updateAppLogos");
        if( window.device) {  //Check and update metadata

            var processLogosDir = function(logosDir) {
                var logosDirPath = logosDir.toNativeURL();
                if($rootScope.metadata) {
                    $rootScope.updateCheck = function() {
                        MyCampusApp.checkAndUpdateMetadata(tenant, baseUrl, $http, $rootScope.metadata.version, $route,
                            $rootScope, $scope, $sce, logosDirPath);
                    };
                    MyCampusApp.checkAndUpdateMetadata(tenant, baseUrl, $http, $rootScope.metadata.version, $route,
                        $rootScope, $scope, $sce, logosDirPath);
                }else {
                    $rootScope.updateCheck = function() {
                        MyCampusApp.checkAndUpdateMetadata(tenant, baseUrl, $http, -1, $route, $rootScope, $scope, $sce, logosDirPath);
                    };
                    MyCampusApp.checkAndUpdateMetadata(tenant, baseUrl, $http, -1, $route, $rootScope, $scope, $sce, logosDirPath);
                }
            };

            var onFileSystemSuccess =  function(fileSystem) {
                fileSystem.root.getDirectory("MyCampusMobile-" + tenant ,{create:true},processLogosDir,null);
            };

            if(window.LocalFileSystem) {
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, null);
            }

        }else {
            $http.jsonp(baseUrl + "/metaData/index/" + tenant + "?callback=JSON_CALLBACK").
                success ( function(data) {

                MyCampusApp.refreshMetdata(data, $rootScope, $scope, $sce, tenant, baseUrl, $route);
            })
        }
        //alert ("End Home control");
        //$scope.$apply();

            /*var allScreens = $('#allScreens');
            allScreens.Touchable();
            alert ("before adding touch event");

            allScreens.bind('touchablemove', function(e, touch) {
                if (touch.currentDelta.x < -5) {
                    alert ("Next");
                }
                if (touch.currentDelta.x > 5) {
                    alert("Previous");
                }
            });*/
            }, 500);

  }])
  .controller('AppCtrl', ['$scope','$routeParams', '$compile','$http', '$rootScope','$sce','$window',
        '$location',
        function($scope, $routeParams, $compile, $http, $rootScope, $sce, $window, $location) {
        MyCampusApp.homeScreenDisplayed=false;
        $scope.appname = $routeParams.appid;
        $scope.pageid = $routeParams.pageid;
            if($scope.appname == $scope.pageid) {
                $rootScope.back = function() {
                    $location.path("/home");
                };
            }else {
                $rootScope.back = function() {
                    $window.history.back();
                };
            }
        $rootScope.showlogin=false;
        var appDef = function(appid) {
            var app;
            var i;
            for(i=0; i<$scope.metadata.apps.length; i++) {
                var tempApp = $scope.metadata.apps[i]
                if(tempApp.id == appid || tempApp.name == appid) {
                    //alert (tempApp.name);
                    app = tempApp;
                    break;
                }
            }
            return app;
        };
        var pageDef = function (appDefinition, pageId) {
            var pageDef;
            var i;
            for(i=0; i<appDefinition.pages.length; i++) {
                var tempPage = appDefinition.pages[i]
                if(tempPage.pageid == pageId ) {
                    //alert (tempApp.name);
                    pageDef = tempPage;
                    break;
                }
            }
            return pageDef;
        };
        var appDefinition = appDef($scope.appname);

        if(window.device && appDefinition.networkrequired) {
            var networkState = navigator.connection.type;
            if(networkState == "none" || networkState == "unknown") {
                var backToPrevPage = function() {
                    $window.history.back();
                };
                navigator.notification.alert("Oops! You are not connected to Internet. Please check your settings and try again",
                    backToPrevPage,'No Network','Ok');
                return;
            }
        }
        try {
            $rootScope.appDisplayName = appDefinition.displayname;
            var pageDefinition = pageDef(appDefinition, $scope.pageid);
            console.log ("page Def : " + pageDefinition);
            window.eval(pageDefinition.pageprocessor);
            var pageProcessorName = 'pageprocessor' + pageDefinition.pageid;
            //Invoke the Pre processor

            if(window[pageProcessorName] != undefined) {
                window[pageProcessorName](pageDefinition, $scope, $routeParams, $compile,
                    $http, $rootScope, $sce, $window, $location);
            }
        }catch(e) {
            $.unblockUI();
            apprise("Unknown error occured while processing the request.!", {'verify':false, 'textYes':"Ok"}, function(r) {
                $rootScope.back();
            });
        }

         if(true) {
             return;
         }
            /*
		if($scope.appname == 'Courses') {
			var content = '<div class="container"><div class="list-group">' +
	  				'<a href="#" class="list-group-item">' +
	  					'<img style="width:50px;height:50px;"src="img/events.png" class="img-thumbnail"></img' +
						'<h4 class="list-group-item-heading">List group item heading</h4>'+
						'<p class="list-group-item-text">content..</p>'+
	  				'</a>'+
	  				'<a href="#" class="list-group-item">'+
						'<h4 class="list-group-item-heading">List group item heading</h4>'+
						'<p class="list-group-item-text">content..</p>'+
	  				'</a>'+
	  				'<a href="#" class="list-group-item">'+
						'<h4 class="list-group-item-heading">List group item heading</h4>'+
						'<p class="list-group-item-text">content..</p>'+
	  				'</a>'+
	  				'<a href="#" class="list-group-item">'+
						'<h4 class="list-group-item-heading">List group item heading</h4>'+
						'<p class="list-group-item-text">content..</p>'+
	  				'</a>'+
	  				'<a href="#" class="list-group-item">'+
						'<h4 class="list-group-item-heading">List group item heading</h4>'+
						'<p class="list-group-item-text">content..</p>'+
	  				'</a>'+
	  				'<a href="#" class="list-group-item">'+
						'<h4 class="list-group-item-heading">List group item heading</h4>'+
						'<p class="list-group-item-text">content..</p>'+
	  				'</a>'+
	  				'<a href="#" class="list-group-item">'+
						'<h4 class="list-group-item-heading">List group item heading</h4>'+
						'<p class="list-group-item-text">content..</p>'+
	  				'</a>'+
	  				'<a href="#" class="list-group-item">'+
						'<h4 class="list-group-item-heading">List group item heading</h4>'+
						'<p class="list-group-item-text">content..</p>'+
	  				'</a>'+
	  				'<a href="#" class="list-group-item">'+
						'<h4 class="list-group-item-heading">List group item heading</h4>'+
						'<p class="list-group-item-text">content..</p>'+
	  				'</a>'+
	  				'<a href="#" class="list-group-item">'+
						'<h4 class="list-group-item-heading">List group item heading</h4>'+
						'<p class="list-group-item-text">content..</p>'+
	  				'</a>'+
	  				'<a href="#" class="list-group-item">'+
						'<h4 class="list-group-item-heading">List group item heading</h4>'+
						'<p class="list-group-item-text">content..</p>'+
	  				'</a>'+
	  				'<a href="#" class="list-group-item">'+
						'<h4 class="list-group-item-heading">List group item heading</h4>'+
						'<p class="list-group-item-text">content..</p>'+
	  				'</a>'+
	  				'<a href="#" class="list-group-item">'+
						'<h4 class="list-group-item-heading">List group item heading</h4>'+
						'<p class="list-group-item-text">content..</p>'+
	  				'</a>'+

				'</div></div>';

			var component = $compile($(content))($scope);
			$('#appContent').append(component);
		}else if($scope.appname == 'Events') {

			var content = '<div class="container-fluid">'+
    '<div data-ng-controller="FeedCtrl">'+
        '<div class="row-fluid">'+
            '<h4>Feed Reader using AngularJS</h4>'+
            '<form>'+
                '<div class="input-prepend span12">'+
              '<div class="btn-group">'+
                '<button class="btn btn-info" type="button" tabindex="-1">{{loadButonText}}</button>'+
                '<button class="btn btn-info dropdown-toggle" data-toggle="dropdown" tabindex="-1">'+
                  '<span class="caret"></span>'+
                '</button>'+
                '<ul class="dropdown-menu">'+
                  '<li><a ng-click="feedSrc=\'http://rss.cnn.com/rss/cnn_topstories.rss\';loadFeed($event);">CNN</a></li>'+
                  '<li><a ng-click="feedSrc=\'http://news.ycombinator.com/rss\';loadFeed($event)">Hacker News</a></li>'+
                  '<li><a ng-click="feedSrc=\'http://feeds2.feedburner.com/Mashable\';loadFeed($event)">Mashable</a></li>'+
                  '<li><a ng-click="feedSrc=\'http://feeds.huffingtonpost.com/huffingtonpost/raw_feed\';loadFeed($event)">Huffington Post</a></li>'+
                  '<li><a ng-click="feedSrc=\'http://feeds.feedburner.com/TechCrunch\';loadFeed($event)">TechCrunch</a></li>'+
                '</ul>'+
              '</div>'+
                    '<input type="text" class="span10" autocomplete="off" placeholder="Enter Feed URL" data-ng-model="feedSrc" />'+
            '</div>'+
               '<div class="input-prepend" ng-show="feeds.length > 0">'+
              '<span c32lass="add-on"><i class="icon-search"></i></span>'+
                   '<input class="span12" type="text" placeholder="Search" data-ng-model="filterText" />'+
               '</div>'+
            '</form>'+
        '</div>'+
        '<div class="row-fluid">'+
            '<ul class="list-group">'+
                '<span class="badge badge-warning" ng-show="feeds.length > 0">{{(feeds | filter:filterText).length}} Items</span>'+
                '<a><li class="list-group-item" ng-repeat="feed in feeds | filter:filterText">'+
                    '<h5><a href="{{feed.link}}">{{feed.title}}</a></h5>'+
                    '<p class="text-left">{{feed.contentSnippet}}</p>'+
                    '<span class="small">{{feed.publishedDate}}</span>'+
                '</li></a>'+
            '</ul>'+
        '</div>'+
    '</div>'+
'</div>';

    	  	var component = $compile($(content))($scope);
    $.blockUI();
		var feed = new google.feeds.Feed("http://rss.cnn.com/rss/cnn_topstories.rss");
		feed.setNumEntries(-1);
		feed.setResultFormat(google.feeds.Feed.JSON);
		feed.load(function(result) {
		if (!result.error) {

		  $scope.feeds=result.feed.entries;
		  var data = '<div class="row-fluid">'+
		              '<ul class="list-group">'+
		                  '<li class="list-group-item" ng-repeat="feed in feeds | filter:filterText">'+
		                      '<a><h5><a href="{{feed.link}}">{{feed.title}}</a></h5>'+
		                      '<p class="text-left">{{feed.contentSnippet}}</p>'+
		                      '<span class="small">{{feed.publishedDate}}</span></a>'+
		                  '</li>'+
		              '</ul>'+
        			'</div>';



		  setTimeout(function() {
		  var data1 = $compile($(data))($scope);
			$('#appContent').append(data1);
			$scope.$apply();
			$.unblockUI();
		  }, 1000);

	  	}
		});

		}else if($scope.appname == 'Directory') {
			$.blockUI();
		  	var template = '<div class="input-prepend" ng-show="feeds.length > 0">'+
              				'<span c32lass="add-on"><i class="icon-search"></i></span>'+
              			     '<input class="span12" type="text" placeholder="Search" data-ng-model="filterText" />'+
              			 '</div>'+
              		 '<div class="row-fluid">'+
		              '<ul class="list-group">'+
		                  '<a><li class="list-group-item" ng-repeat="entry in direntries | filter:filterText">'+
		                      '<h5><a href="#">{{entry.LN}}, {{entry.FN}}</a></h5>'+
		                      '<p class="text-left">{{entry.title}}</p>'+
		                  '</li></a>'+
		              '</ul>'+
        			'</div>';

            var url = 'http://www.newriver.edu/mobile/NRCTC_EMLOYEE_DIRECTORY.xml';
            var proxyurl = "http://localhost:8081/comet/websimulator/xml?url=" + url;

			$http.get(proxyurl, {"responseType" : "xml",
			"transformResponse" : function(data) {
					var jsonData = $.xml2json(data);
					return jsonData;
				} } ).
				success(function(data){
					$scope.direntries = data.NR_DIR;
				    var data1 = $compile($(template))($scope);
					$('#appContent').append(data1);
					$scope.$apply();
					$.unblockUI();
				});

		}else if($scope.appname == 'Maps') {
            var mapCanvas = '<div id="MapsMapCanvas" style="width:100%;height:89%;position:absolute;"></div>';
            $("#appContent").append($(mapCanvas));
            $("#MapsMapCanvas").gmap({"center": "12.93166,77.62270", "zoom": 15, "disableDefaultUI": false, "callback": function () {
                var self = this;
                var i = 0;

                if (pagedef.mapmarkers) {
                    var markers = pagedef.mapmarkers.split("@@");
                    i = 0;
                    $.each(markers, function (key, val) {
                        var loc = val.split(":");
                        setTimeout(function () {
                            self.addMarker({"position": loc[0] + "," + loc[1], "animation": google.maps.Animation.DROP }).click(function () {
                                self.openInfoWindow({ "content": loc[2]}, this);
                            });
                        }, i * 200);
                        i++;
                    });
                }
            }});
        }   */

	  	//$scope.content=;
		//alert ("app id : " + $routeParams.appid);
  }])
  .controller('FeedCtrl', ['$scope','FeedService','$compile',  function($scope,Feed, $compile) {
	$scope.loadButonText="Load";
    $scope.loadFeed=function(e){
		//alert ("Load feed called : " + $scope.feedSrc);
		var feed = new google.feeds.Feed($scope.feedSrc);
		feed.setNumEntries(-1);
		feed.setResultFormat(google.feeds.Feed.JSON);
		feed.load(function(result) {
		if (!result.error) {
		  }
		  $scope.feeds=result.feed.entries;
		  $scope.$apply();
		});

        //Feed.parseFeed($scope.feedSrc, $scope);
        //.then(function(res){
        //    $scope.loadButonText=angular.element(e.target).text();
        //    alert ("Res : " + res);
            //$scope.feeds=res.data.responseData.feed.entries;
        //});
    }
  }])
  .controller('HelpCtrl', ['$scope', '$compile',  function($scope,$compile) {

  }])
.controller('MainController', function($rootScope, $scope, analytics){

    $rootScope.$on("$routeChangeStart", function(){
        $rootScope.loading = true;
        $.blockUI();
    });

    $rootScope.$on("$routeChangeSuccess", function(){
        $rootScope.loading = false;
        $.unblockUI();
    });

    var scrollItems = [];

    for (var i=1; i<=100; i++) {
        scrollItems.push("Item " + i);
    }

    $scope.scrollItems = scrollItems;
    $scope.invoice = {payed: true};

    $scope.userAgent =  navigator.userAgent;
    /*$scope.chatUsers = [
        { name: "Carlos  Flowers", online: true },
        { name: "Byron Taylor", online: true },
        { name: "Jana  Terry", online: true },
        { name: "Darryl  Stone", online: true },
        { name: "Fannie  Carlson", online: true },
        { name: "Holly Nguyen", online: true },
        { name: "Bill  Chavez", online: true },
        { name: "Veronica  Maxwell", online: true },
        { name: "Jessica Webster", online: true },
        { name: "Jackie  Barton", online: true },
        { name: "Crystal Drake", online: false },
        { name: "Milton  Dean", online: false },
        { name: "Joann Johnston", online: false },
        { name: "Cora  Vaughn", online: false },
        { name: "Nina  Briggs", online: false },
        { name: "Casey Turner", online: false },
        { name: "Jimmie  Wilson", online: false },
        { name: "Nathaniel Steele", online: false },
        { name: "Aubrey  Cole", online: false },
        { name: "Donnie  Summers", online: false },
        { name: "Kate  Myers", online: false },
        { name: "Priscilla Hawkins", online: false },
        { name: "Joe Barker", online: false },
        { name: "Lee Norman", online: false },
        { name: "Ebony Rice", online: false }
    ]*/

});