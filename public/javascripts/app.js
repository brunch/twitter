(function(/*! Brunch !*/) {
  'use strict';

  if (!this.require) {
    var modules = {};
    var cache = {};
    var __hasProp = ({}).hasOwnProperty;

    var expand = function(root, name) {
      var results = [], parts, part;
      if (/^\.\.?(\/|$)/.test(name)) {
        parts = [root, name].join('/').split('/');
      } else {
        parts = name.split('/');
      }
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part == '..') {
          results.pop();
        } else if (part != '.' && part != '') {
          results.push(part);
        }
      }
      return results.join('/');
    };

    var getFullPath = function(path, fromCache) {
      var store = fromCache ? cache : modules;
      var dirIndex;
      if (__hasProp.call(store, path)) return path;
      dirIndex = expand(path, './index');
      if (__hasProp.call(store, dirIndex)) return dirIndex;
    };
    
    var cacheModule = function(name, path, contentFn) {
      var module = {id: path, exports: {}};
      try {
        cache[path] = module.exports;
        contentFn(module.exports, function(name) {
          return require(name, dirname(path));
        }, module);
        cache[path] = module.exports;
      } catch (err) {
        delete cache[path];
        throw err;
      }
      return cache[path];
    };

    var require = function(name, root) {
      var path = expand(root, name);
      var fullPath;

      if (fullPath = getFullPath(path, true)) {
        return cache[fullPath];
      } else if (fullPath = getFullPath(path, false)) {
        return cacheModule(name, fullPath, modules[fullPath]);
      } else {
        throw new Error("Cannot find module '" + name + "'");
      }
    };

    var dirname = function(path) {
      return path.split('/').slice(0, -1).join('/');
    };

    this.require = function(name) {
      return require(name, '');
    };

    this.require.brunch = true;
    this.require.define = function(bundle) {
      for (var key in bundle) {
        if (__hasProp.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    };
  }
}).call(this);
(this.require.define({
  "application": function(exports, require, module) {
    (function() {
  var Application, NavigationController, SessionController, SidebarController, TwitterApplication, mediator, routes, support,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  mediator = require('mediator');

  Application = require('chaplin/application');

  SessionController = require('controllers/session_controller');

  NavigationController = require('controllers/navigation_controller');

  SidebarController = require('controllers/sidebar_controller');

  routes = require('routes');

  support = require('chaplin/lib/support');

  module.exports = TwitterApplication = (function(_super) {

    __extends(TwitterApplication, _super);

    function TwitterApplication() {
      TwitterApplication.__super__.constructor.apply(this, arguments);
    }

    TwitterApplication.prototype.title = 'Tweet your brunch';

    TwitterApplication.prototype.initialize = function() {
      TwitterApplication.__super__.initialize.apply(this, arguments);
      new SessionController();
      new NavigationController();
      new SidebarController();
      this.initRouter(routes, {
        pushState: false
      });
      if (support.propertyDescriptors && Object.seal) Object.seal(mediator);
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    return TwitterApplication;

  })(Application);

}).call(this);

  }
}));
(this.require.define({
  "controllers/controller": function(exports, require, module) {
    (function() {
  var ChaplinController, Controller,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  ChaplinController = require('chaplin/controllers/controller');

  module.exports = Controller = (function(_super) {

    __extends(Controller, _super);

    function Controller() {
      Controller.__super__.constructor.apply(this, arguments);
    }

    return Controller;

  })(ChaplinController);

}).call(this);

  }
}));
(this.require.define({
  "controllers/navigation_controller": function(exports, require, module) {
    (function() {
  var Controller, Navigation, NavigationController, NavigationView, mediator,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Controller = require('./controller');

  mediator = require('mediator');

  Navigation = require('models/navigation');

  NavigationView = require('views/navigation_view');

  module.exports = NavigationController = (function(_super) {

    __extends(NavigationController, _super);

    function NavigationController() {
      NavigationController.__super__.constructor.apply(this, arguments);
    }

    NavigationController.prototype.historyURL = 'logout';

    NavigationController.prototype.initialize = function() {
      NavigationController.__super__.initialize.apply(this, arguments);
      this.model = new Navigation();
      return this.view = new NavigationView({
        model: this.model
      });
    };

    NavigationController.prototype.logout = function() {
      mediator.publish('!logout');
      return Backbone.history.navigate('//');
    };

    return NavigationController;

  })(Controller);

}).call(this);

  }
}));
(this.require.define({
  "controllers/session_controller": function(exports, require, module) {
    (function() {
  var Controller, LoginView, SessionController, Twitter, User, mediator, utils,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  mediator = require('mediator');

  utils = require('lib/utils');

  User = require('models/user');

  Controller = require('./controller');

  Twitter = require('lib/services/twitter');

  LoginView = require('views/login_view');

  module.exports = SessionController = (function(_super) {

    __extends(SessionController, _super);

    function SessionController() {
      this.logout = __bind(this.logout, this);
      this.serviceProviderSession = __bind(this.serviceProviderSession, this);
      this.loginAttempt = __bind(this.loginAttempt, this);
      this.triggerLogin = __bind(this.triggerLogin, this);
      SessionController.__super__.constructor.apply(this, arguments);
    }

    SessionController.serviceProviders = {
      twitter: new Twitter()
    };

    SessionController.prototype.loginStatusDetermined = false;

    SessionController.prototype.loginView = null;

    SessionController.prototype.serviceProviderName = null;

    SessionController.prototype.initialize = function() {
      this.subscribeEvent('loginAttempt', this.loginAttempt);
      this.subscribeEvent('serviceProviderSession', this.serviceProviderSession);
      this.subscribeEvent('logout', this.logout);
      this.subscribeEvent('userData', this.userData);
      this.subscribeEvent('!showLogin', this.showLoginView);
      this.subscribeEvent('!login', this.triggerLogin);
      this.subscribeEvent('!logout', this.triggerLogout);
      return this.getSession();
    };

    SessionController.prototype.loadSDKs = function() {
      var name, serviceProvider, _ref, _results;
      _ref = SessionController.serviceProviders;
      _results = [];
      for (name in _ref) {
        serviceProvider = _ref[name];
        _results.push(serviceProvider.loadSDK());
      }
      return _results;
    };

    SessionController.prototype.createUser = function(userData) {
      var user;
      user = new User(userData);
      return mediator.setUser(user);
    };

    SessionController.prototype.getSession = function() {
      var name, serviceProvider, _ref, _results;
      this.loadSDKs();
      _ref = SessionController.serviceProviders;
      _results = [];
      for (name in _ref) {
        serviceProvider = _ref[name];
        _results.push(serviceProvider.done(serviceProvider.getLoginStatus));
      }
      return _results;
    };

    SessionController.prototype.showLoginView = function() {
      console.debug('SessionController#showLoginView');
      if (this.loginView) return;
      this.loadSDKs();
      return this.loginView = new LoginView({
        serviceProviders: SessionController.serviceProviders
      });
    };

    SessionController.prototype.hideLoginView = function() {
      if (!this.loginView) return;
      this.loginView.dispose();
      return this.loginView = null;
    };

    SessionController.prototype.triggerLogin = function(serviceProviderName) {
      var serviceProvider;
      serviceProvider = SessionController.serviceProviders[serviceProviderName];
      if (!serviceProvider.isLoaded()) {
        mediator.publish('serviceProviderMissing', serviceProviderName);
        return;
      }
      mediator.publish('loginAttempt', serviceProviderName);
      return serviceProvider.triggerLogin();
    };

    SessionController.prototype.loginAttempt = function() {};

    SessionController.prototype.serviceProviderSession = function(session) {
      this.serviceProviderName = session.provider.name;
      console.debug('SessionController#serviceProviderSession', session, this.serviceProviderName);
      this.hideLoginView();
      session.id = session.userId;
      delete session.userId;
      this.createUser(session);
      return this.publishLogin();
    };

    SessionController.prototype.publishLogin = function() {
      this.loginStatusDetermined = true;
      mediator.publish('login', mediator.user);
      return mediator.publish('loginStatus', true);
    };

    SessionController.prototype.triggerLogout = function() {
      return mediator.publish('logout');
    };

    SessionController.prototype.logout = function() {
      this.loginStatusDetermined = true;
      if (mediator.user) {
        mediator.user.dispose();
        mediator.user = null;
      }
      this.serviceProviderName = null;
      this.showLoginView();
      return mediator.publish('loginStatus', false);
    };

    SessionController.prototype.userData = function(data) {
      return mediator.user.set(data);
    };

    return SessionController;

  })(Controller);

}).call(this);

  }
}));
(this.require.define({
  "controllers/sidebar_controller": function(exports, require, module) {
    (function() {
  var Controller, SidebarController, SidebarView, StatusView,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Controller = require('./controller');

  SidebarView = require('views/sidebar_view');

  StatusView = require('views/status_view');

  module.exports = SidebarController = (function(_super) {

    __extends(SidebarController, _super);

    function SidebarController() {
      SidebarController.__super__.constructor.apply(this, arguments);
    }

    SidebarController.prototype.initialize = function() {
      return this.view = new SidebarView();
    };

    return SidebarController;

  })(Controller);

}).call(this);

  }
}));
(this.require.define({
  "controllers/tweets_controller": function(exports, require, module) {
    (function() {
  var Controller, Tweets, TweetsController, TweetsView,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Controller = require('./controller');

  Tweets = require('models/tweets');

  TweetsView = require('views/tweets_view');

  module.exports = TweetsController = (function(_super) {

    __extends(TweetsController, _super);

    function TweetsController() {
      TweetsController.__super__.constructor.apply(this, arguments);
    }

    TweetsController.prototype.historyURL = '';

    TweetsController.prototype.index = function(params) {
      this.collection = new Tweets();
      return this.view = new TweetsView({
        collection: this.collection
      });
    };

    return TweetsController;

  })(Controller);

}).call(this);

  }
}));
(this.require.define({
  "initialize": function(exports, require, module) {
    (function() {
  var Application;

  Application = require('./application');

  $(function() {
    var app;
    app = new Application();
    return app.initialize();
  });

}).call(this);

  }
}));
(this.require.define({
  "lib/services/service_provider": function(exports, require, module) {
    (function() {
  var ServiceProvider, Subscriber, utils;

  utils = require('lib/utils');

  Subscriber = require('chaplin/lib/subscriber');

  module.exports = ServiceProvider = (function() {

    _(ServiceProvider.prototype).defaults(Subscriber);

    ServiceProvider.prototype.loading = false;

    function ServiceProvider() {
      _(this).extend($.Deferred());
      utils.deferMethods({
        deferred: this,
        methods: ['triggerLogin', 'getLoginStatus'],
        onDeferral: this.loadSDK
      });
    }

    ServiceProvider.prototype.disposed = false;

    ServiceProvider.prototype.dispose = function() {
      if (this.disposed) return;
      this.unsubscribeAllEvents();
      this.disposed = true;
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    return ServiceProvider;

  })();

  /*
  
    Standard methods and their signatures:
  
    loadSDK: ->
      # Load a script like this:
      utils.loadLib 'http://example.org/foo.js', @sdkLoadHandler, @reject
  
    sdkLoadHandler: =>
      # Init the SDK, then resolve
      someSDK.init(foo: 'bar')
      @resolve()
  
    isLoaded: ->
      # Return a Boolean
      Boolean window.someSDK and someSDK.login
  
    # Trigger login popup
    triggerLogin: (loginContext) ->
      callback = _(@loginHandler).bind(this, @loginHandler)
      someSDK.login callback
  
    # Callback for the login popup
    loginHandler: (loginContext, response) =>
  
      if response
        # Publish successful login
        mediator.publish 'loginSuccessful',
          provider: this, loginContext: loginContext
  
        # Publish the session
        mediator.publish 'serviceProviderSession',
          provider: this
          userId: response.userId
          accessToken: response.accessToken
          # etc.
  
      else
        mediator.publish 'loginFail', provider: this, loginContext: loginContext
  
    getLoginStatus: (callback = @loginStatusHandler, force = false) ->
      someSDK.getLoginStatus callback, force
  
    loginStatusHandler: (response) =>
      return unless response
      mediator.publish 'serviceProviderSession',
        provider: this
        userId: response.userId
        accessToken: response.accessToken
        # etc.
  */

}).call(this);

  }
}));
(this.require.define({
  "lib/services/twitter": function(exports, require, module) {
    (function() {
  var ServiceProvider, Twitter, mediator, utils,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  mediator = require('mediator');

  utils = require('lib/utils');

  ServiceProvider = require('lib/services/service_provider');

  module.exports = Twitter = (function(_super) {
    var consumerKey;

    __extends(Twitter, _super);

    consumerKey = 'w0uohox9lTgpKETJmscYIQ';

    Twitter.prototype.name = 'twitter';

    function Twitter() {
      this.loginStatusHandler = __bind(this.loginStatusHandler, this);
      this.loginHandler = __bind(this.loginHandler, this);
      this.sdkLoadHandler = __bind(this.sdkLoadHandler, this);      Twitter.__super__.constructor.apply(this, arguments);
      this.subscribeEvent('!logout', this.logout);
    }

    Twitter.prototype.loadSDK = function() {
      if (this.state() === 'resolved' || this.loading) return;
      this.loading = true;
      return utils.loadLib("http://platform.twitter.com/anywhere.js?id=" + consumerKey + "&v=1", this.sdkLoadHandler, this.reject);
    };

    Twitter.prototype.sdkLoadHandler = function() {
      var _this = this;
      this.loading = false;
      return twttr.anywhere(function(T) {
        mediator.publish('sdkLoaded');
        _this.T = T;
        return _this.resolve();
      });
    };

    Twitter.prototype.isLoaded = function() {
      return Boolean(window.twttr);
    };

    Twitter.prototype.publish = function(event, callback) {
      return this.T.trigger(event, callback);
    };

    Twitter.prototype.subscribe = function(event, callback) {
      return this.T.bind(event, callback);
    };

    Twitter.prototype.unsubscribe = function(event) {
      return this.T.unbind(event);
    };

    Twitter.prototype.triggerLogin = function(loginContext) {
      var callback;
      callback = _(this.loginHandler).bind(this, loginContext);
      this.T.signIn();
      this.subscribe('authComplete', function(event, currentUser, accessToken) {
        return callback({
          currentUser: currentUser,
          accessToken: accessToken
        });
      });
      return this.subscribe('signOut', function() {
        console.log('SIGNOUT EVENT');
        return callback();
      });
    };

    Twitter.prototype.publishSession = function(response) {
      var user;
      user = response.currentUser;
      mediator.publish('serviceProviderSession', {
        provider: this,
        userId: user.id,
        accessToken: response.accessToken || twttr.anywhere.token
      });
      return mediator.publish('userData', user.attributes);
    };

    Twitter.prototype.loginHandler = function(loginContext, response) {
      console.debug('Twitter#loginHandler', loginContext, response);
      if (response) {
        mediator.publish('loginSuccessful', {
          provider: this,
          loginContext: loginContext
        });
        return this.publishSession(response);
      } else {
        return mediator.publish('loginFail', {
          provider: this,
          loginContext: loginContext
        });
      }
    };

    Twitter.prototype.getLoginStatus = function(callback, force) {
      if (callback == null) callback = this.loginStatusHandler;
      if (force == null) force = false;
      console.debug('Twitter#getLoginStatus');
      return callback(this.T);
    };

    Twitter.prototype.loginStatusHandler = function(response) {
      console.debug('Twitter#loginStatusHandler', response);
      if (response.currentUser) {
        return this.publishSession(response);
      } else {
        return mediator.publish('logout');
      }
    };

    Twitter.prototype.logout = function() {
      var _ref;
      console.log('Twitter#logout');
      return typeof twttr !== "undefined" && twttr !== null ? (_ref = twttr.anywhere) != null ? typeof _ref.signOut === "function" ? _ref.signOut() : void 0 : void 0 : void 0;
    };

    return Twitter;

  })(ServiceProvider);

}).call(this);

  }
}));
(this.require.define({
  "lib/support": function(exports, require, module) {
    (function() {
  var chaplinSupport, support, utils;

  utils = require('lib/utils');

  chaplinSupport = require('chaplin/lib/support');

  module.exports = support = utils.beget(chaplinSupport);

}).call(this);

  }
}));
(this.require.define({
  "lib/utils": function(exports, require, module) {
    (function() {
  var chaplinUtils, mediator, utils;

  mediator = require('mediator');

  chaplinUtils = require('chaplin/lib/utils');

  module.exports = utils = chaplinUtils.beget(chaplinUtils);

  _(utils).extend({
    facebookImageURL: function(fbId, type) {
      var accessToken, params;
      if (type == null) type = 'square';
      params = {
        type: type
      };
      if (mediator.user) {
        accessToken = mediator.user.get('accessToken');
        if (accessToken) params.access_token = accessToken;
      }
      return "https://graph.facebook.com/" + fbId + "/picture?" + ($.param(params));
    }
  });

}).call(this);

  }
}));
(this.require.define({
  "lib/view_helper": function(exports, require, module) {
    (function() {

  Handlebars.registerHelper('transform_if_retweeted', function(options) {
    var data;
    if (this.retweeted_status) {
      data = _.clone(this.retweeted_status);
      data.retweeter = this.user;
      return options.fn(data);
    } else {
      return options.fn(this);
    }
  });

  Handlebars.registerHelper('auto_link', function(options) {
    return new Handlebars.SafeString(twttr.txt.autoLink(options.fn(this)));
  });

  Handlebars.registerHelper('format_date', function(options) {
    var date;
    date = new Date(options.fn(this));
    return new Handlebars.SafeString(moment(date).fromNow());
  });

  Handlebars.registerHelper('unless_is_web', function(source, options) {
    var string;
    string = source === 'web' ? '' : options.fn(this);
    return new Handlebars.SafeString(string);
  });

}).call(this);

  }
}));
(this.require.define({
  "mediator": function(exports, require, module) {
    (function() {
  var createMediator, mediator;

  createMediator = require('chaplin/lib/create_mediator');

  module.exports = mediator = createMediator({
    createRouterProperty: true,
    createUserProperty: true
  });

}).call(this);

  }
}));
(this.require.define({
  "models/collection": function(exports, require, module) {
    (function() {
  var ChaplinCollection, Collection,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  ChaplinCollection = require('chaplin/models/collection');

  module.exports = Collection = (function(_super) {

    __extends(Collection, _super);

    function Collection() {
      Collection.__super__.constructor.apply(this, arguments);
    }

    return Collection;

  })(ChaplinCollection);

}).call(this);

  }
}));
(this.require.define({
  "models/model": function(exports, require, module) {
    (function() {
  var ChaplinModel, Model,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  ChaplinModel = require('chaplin/models/model');

  module.exports = Model = (function(_super) {

    __extends(Model, _super);

    function Model() {
      Model.__super__.constructor.apply(this, arguments);
    }

    return Model;

  })(ChaplinModel);

}).call(this);

  }
}));
(this.require.define({
  "models/navigation": function(exports, require, module) {
    (function() {
  var Model, Navigation,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Model = require('./model');

  module.exports = Navigation = (function(_super) {

    __extends(Navigation, _super);

    function Navigation() {
      Navigation.__super__.constructor.apply(this, arguments);
    }

    Navigation.prototype.defaults = {
      items: [
        {
          href: '/',
          title: 'Home'
        }, {
          href: '/mentions',
          title: 'Mentions'
        }, {
          href: '/logout',
          title: 'Logout'
        }
      ]
    };

    return Navigation;

  })(Model);

}).call(this);

  }
}));
(this.require.define({
  "models/status": function(exports, require, module) {
    (function() {
  var Model, Status, mediator,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  mediator = require('mediator');

  Model = require('./model');

  module.exports = Status = (function(_super) {

    __extends(Status, _super);

    function Status() {
      Status.__super__.constructor.apply(this, arguments);
    }

    Status.prototype.minLength = 1;

    Status.prototype.maxLength = 140;

    Status.prototype.validate = function(attributes) {
      var text;
      text = attributes.text;
      if ((!text) || (text.length < this.minLength) || (text.length > this.maxLength)) {
        return 'Invalid text';
      }
    };

    Status.prototype.calcCharCount = function(value) {
      return this.maxLength - value;
    };

    Status.prototype.sync = function(method, model, options) {
      var provider, timeout,
        _this = this;
      provider = mediator.user.get('provider');
      timeout = setTimeout(options.error.bind(options, 'Timeout error'), 4000);
      provider.T.Status.update(model.get('text'), function(tweet) {
        window.clearTimeout(timeout);
        mediator.publish('tweet:add', tweet.attributes);
        return options.success(tweet.attributes);
      });
    };

    return Status;

  })(Model);

}).call(this);

  }
}));
(this.require.define({
  "models/tweet": function(exports, require, module) {
    (function() {
  var Model, Tweet,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Model = require('./model');

  module.exports = Tweet = (function(_super) {

    __extends(Tweet, _super);

    function Tweet() {
      Tweet.__super__.constructor.apply(this, arguments);
    }

    return Tweet;

  })(Model);

}).call(this);

  }
}));
(this.require.define({
  "models/tweets": function(exports, require, module) {
    (function() {
  var Collection, Tweet, Tweets, mediator,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  mediator = require('mediator');

  Collection = require('./collection');

  Tweet = require('./tweet');

  module.exports = Tweets = (function(_super) {

    __extends(Tweets, _super);

    function Tweets() {
      this.addTweet = __bind(this.addTweet, this);
      this.processTweets = __bind(this.processTweets, this);
      Tweets.__super__.constructor.apply(this, arguments);
    }

    Tweets.prototype.model = Tweet;

    Tweets.prototype.initialize = function() {
      Tweets.__super__.initialize.apply(this, arguments);
      _(this).extend($.Deferred());
      this.getTweets();
      this.subscribeEvent('login', this.getTweets);
      this.subscribeEvent('logout', this.reset);
      return this.subscribeEvent('tweet:add', this.addTweet);
    };

    Tweets.prototype.getTweets = function() {
      var provider, user;
      console.debug('Tweets#getTweets');
      user = mediator.user;
      if (!user) return;
      provider = user.get('provider');
      if (provider.name !== 'twitter') return;
      this.trigger('loadStart');
      return provider.T.currentUser.homeTimeline(this.processTweets);
    };

    Tweets.prototype.processTweets = function(response) {
      var tweets,
        _this = this;
      tweets = (response != null ? response.array : void 0) ? _(response.array).map(function(tweet) {
        return tweet.attributes;
      }) : [];
      console.debug('Tweets#processTweets', tweets);
      this.trigger('load');
      this.reset(tweets);
      return this.resolve();
    };

    Tweets.prototype.addTweet = function(tweet) {
      return this.add(tweet, {
        at: 0
      });
    };

    return Tweets;

  })(Collection);

}).call(this);

  }
}));
(this.require.define({
  "models/user": function(exports, require, module) {
    (function() {
  var Model, User, mediator,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  mediator = require('mediator');

  Model = require('./model');

  module.exports = User = (function(_super) {

    __extends(User, _super);

    function User() {
      this.initializeMethods = __bind(this.initializeMethods, this);
      User.__super__.constructor.apply(this, arguments);
    }

    User.prototype.initialize = function() {
      User.__super__.initialize.apply(this, arguments);
      return mediator.on('userMethods', this.initializeMethods);
    };

    User.prototype.initializeMethods = function(methods) {
      var _this = this;
      return Object.keys(methods).filter(function(method) {
        return !_this[method];
      }).forEach(function(method) {
        return _this[method] = methods[method];
      });
    };

    return User;

  })(Model);

}).call(this);

  }
}));
(this.require.define({
  "routes": function(exports, require, module) {
    (function() {

  module.exports = function(match) {
    match('', 'tweets#index');
    match('@:user', 'user#show');
    return match('logout', 'navigation#logout');
  };

}).call(this);

  }
}));
(this.require.define({
  "views/composite_view": function(exports, require, module) {
    (function() {
  var CompositeView, View,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  View = require('views/view');

  module.exports = CompositeView = (function(_super) {

    __extends(CompositeView, _super);

    function CompositeView() {
      this.dispose = __bind(this.dispose, this);
      this.render = __bind(this.render, this);
      CompositeView.__super__.constructor.apply(this, arguments);
    }

    CompositeView.prototype.initialize = function() {
      CompositeView.__super__.initialize.apply(this, arguments);
      return this.subViews = [];
    };

    CompositeView.prototype.attachView = function(view) {
      return this.subViews.push(view);
    };

    CompositeView.prototype.renderSubViews = function() {
      var _this = this;
      return _(this.subViews).forEach(function(view) {
        return _this.$(view.containerSelector).append(view.render().el);
      });
    };

    CompositeView.prototype.render = function() {
      CompositeView.__super__.render.apply(this, arguments);
      return this.renderSubViews();
    };

    CompositeView.prototype.dispose = function() {
      var _this = this;
      CompositeView.__super__.dispose.apply(this, arguments);
      return _(this.subViews).forEach(function(view) {
        return view.dispose();
      });
    };

    return CompositeView;

  })(View);

}).call(this);

  }
}));
(this.require.define({
  "views/login_view": function(exports, require, module) {
    (function() {
  var LoginView, View, mediator, template, utils,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  mediator = require('mediator');

  utils = require('lib/utils');

  View = require('./view');

  template = require('./templates/login');

  module.exports = LoginView = (function(_super) {

    __extends(LoginView, _super);

    function LoginView() {
      LoginView.__super__.constructor.apply(this, arguments);
    }

    LoginView.prototype.template = template;

    LoginView.prototype.id = 'login';

    LoginView.prototype.containerSelector = '#content-container';

    LoginView.prototype.autoRender = true;

    LoginView.prototype.initialize = function(options) {
      LoginView.__super__.initialize.apply(this, arguments);
      console.debug('LoginView#initialize', this.el, this.$el, options, options.serviceProviders);
      return this.initButtons(options.serviceProviders);
    };

    LoginView.prototype.initButtons = function(serviceProviders) {
      var buttonSelector, failed, loaded, loginHandler, serviceProvider, serviceProviderName, _results;
      console.debug('LoginView#initButtons', serviceProviders);
      _results = [];
      for (serviceProviderName in serviceProviders) {
        serviceProvider = serviceProviders[serviceProviderName];
        buttonSelector = "." + serviceProviderName;
        this.$(buttonSelector).addClass('service-loading');
        loginHandler = _(this.loginWith).bind(this, serviceProviderName, serviceProvider);
        this.delegate('click', buttonSelector, loginHandler);
        loaded = _(this.serviceProviderLoaded).bind(this, serviceProviderName, serviceProvider);
        serviceProvider.done(loaded);
        failed = _(this.serviceProviderFailed).bind(this, serviceProviderName, serviceProvider);
        _results.push(serviceProvider.fail(failed));
      }
      return _results;
    };

    LoginView.prototype.loginWith = function(serviceProviderName, serviceProvider, e) {
      console.debug('LoginView#loginWith', serviceProviderName, serviceProvider);
      e.preventDefault();
      if (!serviceProvider.isLoaded()) return;
      mediator.publish('login:pickService', serviceProviderName);
      return mediator.publish('!login', serviceProviderName);
    };

    LoginView.prototype.serviceProviderLoaded = function(serviceProviderName) {
      return this.$("." + serviceProviderName).removeClass('service-loading');
    };

    LoginView.prototype.serviceProviderFailed = function(serviceProviderName) {
      return this.$("." + serviceProviderName).removeClass('service-loading').addClass('service-unavailable').attr('disabled', true).attr('title', "Error connecting. Please check whether you areblocking " + (utils.upcase(serviceProviderName)) + ".");
    };

    return LoginView;

  })(View);

}).call(this);

  }
}));
(this.require.define({
  "views/navigation_view": function(exports, require, module) {
    (function() {
  var NavigationView, View, mediator, template,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  mediator = require('mediator');

  View = require('./view');

  template = require('./templates/navigation');

  module.exports = NavigationView = (function(_super) {

    __extends(NavigationView, _super);

    function NavigationView() {
      NavigationView.__super__.constructor.apply(this, arguments);
    }

    NavigationView.prototype.template = template;

    NavigationView.prototype.id = 'navigation';

    NavigationView.prototype.containerSelector = '#navigation-container';

    NavigationView.prototype.autoRender = true;

    NavigationView.prototype.initialize = function() {
      NavigationView.__super__.initialize.apply(this, arguments);
      this.subscribeEvent('loginStatus', this.render);
      return this.subscribeEvent('startupController', this.render);
    };

    return NavigationView;

  })(View);

}).call(this);

  }
}));
(this.require.define({
  "views/sidebar_view": function(exports, require, module) {
    (function() {
  var CompositeView, SidebarView, StatsView, StatusView, mediator, template,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  mediator = require('mediator');

  CompositeView = require('./composite_view');

  StatsView = require('./stats_view');

  StatusView = require('./status_view');

  template = require('./templates/sidebar');

  module.exports = SidebarView = (function(_super) {

    __extends(SidebarView, _super);

    function SidebarView() {
      this.loginStatusHandler = __bind(this.loginStatusHandler, this);
      SidebarView.__super__.constructor.apply(this, arguments);
    }

    SidebarView.prototype.template = template;

    SidebarView.prototype.id = 'sidebar';

    SidebarView.prototype.containerSelector = '#sidebar-container';

    SidebarView.prototype.autoRender = true;

    SidebarView.prototype.initialize = function() {
      SidebarView.__super__.initialize.apply(this, arguments);
      this.attachView(new StatusView());
      this.attachView(new StatsView());
      this.subscribeEvent('loginStatus', this.loginStatusHandler);
      return this.subscribeEvent('userData', this.render);
    };

    SidebarView.prototype.loginStatusHandler = function(loggedIn) {
      if (loggedIn) {
        this.model = mediator.user;
      } else {
        this.model = null;
      }
      return this.render();
    };

    return SidebarView;

  })(CompositeView);

}).call(this);

  }
}));
(this.require.define({
  "views/stats_view": function(exports, require, module) {
    (function() {
  var StatsView, View, mediator, template,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  mediator = require('mediator');

  View = require('./view');

  template = require('./templates/stats');

  module.exports = StatsView = (function(_super) {

    __extends(StatsView, _super);

    function StatsView() {
      this.loginStatusHandler = __bind(this.loginStatusHandler, this);
      StatsView.__super__.constructor.apply(this, arguments);
    }

    StatsView.prototype.template = template;

    StatsView.prototype.className = 'stats';

    StatsView.prototype.tagName = 'ul';

    StatsView.prototype.containerSelector = '#stats-container';

    StatsView.prototype.initialize = function() {
      StatsView.__super__.initialize.apply(this, arguments);
      this.subscribeEvent('loginStatus', this.loginStatusHandler);
      return this.subscribeEvent('userData', this.render);
    };

    StatsView.prototype.loginStatusHandler = function(loggedIn) {
      if (loggedIn) {
        this.model = mediator.user;
      } else {
        this.model = null;
      }
      return this.render();
    };

    return StatsView;

  })(View);

}).call(this);

  }
}));
(this.require.define({
  "views/status_view": function(exports, require, module) {
    (function() {
  var Status, StatusView, View, mediator, template,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  mediator = require('mediator');

  Status = require('models/status');

  View = require('./view');

  template = require('./templates/status');

  module.exports = StatusView = (function(_super) {

    __extends(StatusView, _super);

    function StatusView() {
      this.render = __bind(this.render, this);
      this.createStatus = __bind(this.createStatus, this);
      this.updateStatusText = __bind(this.updateStatusText, this);
      this.updateCharacterCount = __bind(this.updateCharacterCount, this);
      this.loginStatusHandler = __bind(this.loginStatusHandler, this);
      StatusView.__super__.constructor.apply(this, arguments);
    }

    StatusView.prototype.template = template;

    StatusView.prototype.id = 'status';

    StatusView.prototype.className = 'status';

    StatusView.prototype.containerSelector = '#status-container';

    StatusView.prototype.initialize = function() {
      StatusView.__super__.initialize.apply(this, arguments);
      this.subscribeEvent('loginStatus', this.loginStatusHandler);
      return this.subscribeEvent('userData', this.render);
    };

    StatusView.prototype.loginStatusHandler = function(loggedIn) {
      if (loggedIn) {
        this.model = new Status();
      } else {
        this.model = null;
      }
      return this.render();
    };

    StatusView.prototype.updateCharacterCount = function(valid, count) {
      var $charCount, $createButton;
      $charCount = this.$('.status-character-count');
      $createButton = this.$('.status-create-button');
      $charCount.text(count);
      if (valid) {
        $charCount.removeClass('status-character-count-invalid');
        return $createButton.removeAttr('disabled');
      } else {
        if (count !== 140) $charCount.addClass('status-character-count-invalid');
        return $createButton.attr('disabled', 'disabled');
      }
    };

    StatusView.prototype.updateStatusText = function(event) {
      var count, text, valid;
      text = $(event.currentTarget).val();
      valid = this.model.set({
        text: text
      });
      count = this.model.calcCharCount(text.length);
      return this.updateCharacterCount(valid, count);
    };

    StatusView.prototype.createStatus = function(event) {
      var _this = this;
      return this.model.save({}, {
        error: function(model, error) {
          return console.error('Tweet error', error);
        },
        success: function(model, attributes) {
          console.debug('Tweet success', attributes);
          return _this.$('.status-text').val('').trigger('keydown');
        }
      });
    };

    StatusView.prototype.render = function() {
      var _this = this;
      StatusView.__super__.render.apply(this, arguments);
      _(['keyup', 'keydown']).each(function(eventName) {
        return _this.delegate(eventName, '.status-text', _this.updateStatusText);
      });
      return this.delegate('click', '.status-create-button', this.createStatus);
    };

    return StatusView;

  })(View);

}).call(this);

  }
}));
(this.require.define({
  "views/templates/login": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<div class=\"login-note\">\n  <h3>Tweet your brunch</h3>\n  <img class=\"sign-in-button twitter\" src=\"https://si0.twimg.com/images/dev/buttons/sign-in-with-twitter-l.png\" alt=\"Sign in with Twitter\" /> \n</div>\n";});
  }
}));
(this.require.define({
  "views/templates/navigation": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n  <div class=\"navbar-inner\">\n    <div class=\"container\">\n      <div class=\"nav-collapse\">\n        <ul class=\"nav\">\n          ";
  foundHelper = helpers.items;
  stack1 = foundHelper || depth0.items;
  stack2 = helpers.each;
  tmp1 = self.program(2, program2, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  stack1 = stack2.call(depth0, stack1, tmp1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </ul>\n      </div>\n    </div>\n  </div>\n";
  return buffer;}
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n            <li class=\"nav-item\">\n              <a class=\"nav-item-link\" href=\"#";
  stack1 = depth0.href;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "this.href", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\">\n                <div class=\"nav-item-icon-container\">\n                  <span class=\"nav-item-icon\"></span>\n                </div>\n                <span class=\"nav-item-title\">";
  stack1 = depth0.title;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "this.title", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</span>\n              </a>\n            </li>\n          ";
  return buffer;}

  foundHelper = helpers.if_logged_in;
  stack1 = foundHelper || depth0.if_logged_in;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  if(foundHelper && typeof stack1 === functionType) { stack1 = stack1.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack1, tmp1); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;});
  }
}));
(this.require.define({
  "views/templates/sidebar": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <div class=\"account-summary-container\">\n    <div class=\"account-summary\">\n      <img class=\"account-summary-avatar avatar size32\" src=\"";
  foundHelper = helpers.profile_image_url;
  stack1 = foundHelper || depth0.profile_image_url;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "profile_image_url", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\" alt=\"";
  foundHelper = helpers.name;
  stack1 = foundHelper || depth0.name;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\">\n      <div class=\"account-summary-content\">\n        <strong class=\"account-summary-full-name\">";
  foundHelper = helpers.name;
  stack1 = foundHelper || depth0.name;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</strong>\n        <small class=\"account-summary-metadata\">View my profile page</small>\n      </div>\n    </div>\n  </div>\n  <div class=\"stats-container\" id=\"stats-container\"></div>\n  <div class=\"status-container\" id=\"status-container\"></div>\n";
  return buffer;}

function program3(depth0,data) {
  
  
  return "\n  <div class=\"app-description\">\n    Tweet your brunch is a simple twitter client built with <a href=\"http://brunch.io/\">Brunch</a> &amp; <a href=\"https://github.com/paulmillr/brunch-with-chaplin\">Brunch with Chaplin</a>.\n  </div>\n";}

  foundHelper = helpers.if_logged_in;
  stack1 = foundHelper || depth0.if_logged_in;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.program(3, program3, data);
  if(foundHelper && typeof stack1 === functionType) { stack1 = stack1.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack1, tmp1); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;});
  }
}));
(this.require.define({
  "views/templates/stats": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


  buffer += "<li class=\"stat-tweets\"><strong>";
  foundHelper = helpers.statuses_count;
  stack1 = foundHelper || depth0.statuses_count;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "statuses_count", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</strong> tweets</li>\n<li class=\"stat-following\"><strong>";
  foundHelper = helpers.friends_count;
  stack1 = foundHelper || depth0.friends_count;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "friends_count", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</strong> following</li>\n<li class=\"stat-followers\"><strong>";
  foundHelper = helpers.followers_count;
  stack1 = foundHelper || depth0.followers_count;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "followers_count", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</strong> followers</li>\n";
  return buffer;});
  }
}));
(this.require.define({
  "views/templates/status": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, tmp1, self=this, functionType="function", blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  
  return "\n  <textarea class=\"status-text\" placeholder=\"What's happening?\"></textarea>\n  <div class=\"status-info\">\n    <span class=\"status-character-count\">140</span>\n    <button class=\"status-create-button btn btn-primary\" disabled>Tweet</button>\n  </div>\n";}

  foundHelper = helpers.if_logged_in;
  stack1 = foundHelper || depth0.if_logged_in;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  if(foundHelper && typeof stack1 === functionType) { stack1 = stack1.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack1, tmp1); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;});
  }
}));
(this.require.define({
  "views/templates/tweet": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n  <div class=\"tweet-content\">\n    <header class=\"tweet-header\">\n      <a href=\"https://twitter.com/";
  foundHelper = helpers.user;
  stack1 = foundHelper || depth0.user;
  stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.screen_name);
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "user.screen_name", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\">\n        <img class=\"avatar\" src=\"";
  foundHelper = helpers.user;
  stack1 = foundHelper || depth0.user;
  stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.profile_image_url);
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "user.profile_image_url", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\" alt=\"\" />\n        <strong class=\"tweet-author-full-name\">\n          ";
  foundHelper = helpers.user;
  stack1 = foundHelper || depth0.user;
  stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.name);
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "user.name", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\n        </strong>\n      </a>\n    </header>\n    <p class=\"tweet-text\">";
  foundHelper = helpers.auto_link;
  stack1 = foundHelper || depth0.auto_link;
  tmp1 = self.program(2, program2, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  if(foundHelper && typeof stack1 === functionType) { stack1 = stack1.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack1, tmp1); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</p>\n    <footer class=\"tweet-footer\">\n      <a href=\"http://twitter.com/";
  foundHelper = helpers.user;
  stack1 = foundHelper || depth0.user;
  stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.screen_name);
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "user.screen_name", { hash: {} }); }
  buffer += escapeExpression(stack1) + "/status/";
  foundHelper = helpers.id_str;
  stack1 = foundHelper || depth0.id_str;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "id_str", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\">\n        <time class=\"tweet-created-at\" datetime=\"";
  foundHelper = helpers.created_at;
  stack1 = foundHelper || depth0.created_at;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "created_at", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\">\n          ";
  foundHelper = helpers.format_date;
  stack1 = foundHelper || depth0.format_date;
  tmp1 = self.program(4, program4, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  if(foundHelper && typeof stack1 === functionType) { stack1 = stack1.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack1, tmp1); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </time>\n      </a>\n      ";
  foundHelper = helpers.source;
  stack1 = foundHelper || depth0.source;
  foundHelper = helpers.unless_is_web;
  stack2 = foundHelper || depth0.unless_is_web;
  tmp1 = self.program(6, program6, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  if(foundHelper && typeof stack2 === functionType) { stack1 = stack2.call(depth0, stack1, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, stack1, tmp1); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      ";
  foundHelper = helpers.retweeter;
  stack1 = foundHelper || depth0.retweeter;
  stack2 = helpers['if'];
  tmp1 = self.program(8, program8, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  stack1 = stack2.call(depth0, stack1, tmp1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </footer>\n  </div>\n";
  return buffer;}
function program2(depth0,data) {
  
  var stack1;
  foundHelper = helpers.text;
  stack1 = foundHelper || depth0.text;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "text", { hash: {} }); }
  return escapeExpression(stack1);}

function program4(depth0,data) {
  
  var stack1;
  foundHelper = helpers.created_at;
  stack1 = foundHelper || depth0.created_at;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "created_at", { hash: {} }); }
  return escapeExpression(stack1);}

function program6(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        via <span class=\"tweet-source\">";
  foundHelper = helpers.source;
  stack1 = foundHelper || depth0.source;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "source", { hash: {} }); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</span>\n      ";
  return buffer;}

function program8(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <p class=\"tweet-retweeter\">\n          Retweeted by <a class=\"tweet-retweeter-username\" href=\"https://twitter.com/";
  foundHelper = helpers.retweeter;
  stack1 = foundHelper || depth0.retweeter;
  stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.screen_name);
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "retweeter.screen_name", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\">";
  foundHelper = helpers.retweeter;
  stack1 = foundHelper || depth0.retweeter;
  stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.screen_name);
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "retweeter.screen_name", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</a>\n        </p>\n      ";
  return buffer;}

  foundHelper = helpers.transform_if_retweeted;
  stack1 = foundHelper || depth0.transform_if_retweeted;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  if(foundHelper && typeof stack1 === functionType) { stack1 = stack1.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack1, tmp1); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;});
  }
}));
(this.require.define({
  "views/templates/tweets": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<header class=\"tweets-header\">\n  <h3>Tweets</h3>\n</header>\n<div class=\"tweets\"></div>\n";});
  }
}));
(this.require.define({
  "views/tweet_view": function(exports, require, module) {
    (function() {
  var TweetView, View, template,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  template = require('./templates/tweet');

  View = require('./view');

  module.exports = TweetView = (function(_super) {

    __extends(TweetView, _super);

    function TweetView() {
      TweetView.__super__.constructor.apply(this, arguments);
    }

    TweetView.prototype.template = template;

    TweetView.prototype.className = 'tweet';

    return TweetView;

  })(View);

}).call(this);

  }
}));
(this.require.define({
  "views/tweets_view": function(exports, require, module) {
    (function() {
  var CollectionView, TweetView, TweetsView, mediator, template,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  mediator = require('mediator');

  CollectionView = require('chaplin/views/collection_view');

  TweetView = require('./tweet_view');

  template = require('./templates/tweets');

  module.exports = TweetsView = (function(_super) {

    __extends(TweetsView, _super);

    function TweetsView() {
      TweetsView.__super__.constructor.apply(this, arguments);
    }

    TweetsView.prototype.template = template;

    TweetsView.prototype.tagName = 'div';

    TweetsView.prototype.id = 'tweets';

    TweetsView.prototype.containerSelector = '#content-container';

    TweetsView.prototype.listSelector = '.tweets';

    TweetsView.prototype.fallbackSelector = '.fallback';

    TweetsView.prototype.initialize = function() {
      TweetsView.__super__.initialize.apply(this, arguments);
      return this.subscribeEvent('loginStatus', this.showHideLoginNote);
    };

    TweetsView.prototype.getView = function(item) {
      return new TweetView({
        model: item
      });
    };

    TweetsView.prototype.showHideLoginNote = function() {
      return this.$('.tweets, .tweets-header').css('display', mediator.user ? 'block' : 'none');
    };

    TweetsView.prototype.render = function() {
      console.log('TweetsView#render', this, this.$el);
      TweetsView.__super__.render.apply(this, arguments);
      return this.showHideLoginNote();
    };

    TweetsView.prototype.afterRender = function() {
      TweetsView.__super__.afterRender.apply(this, arguments);
      return console.log('TweetsView#afterRender', this.containerSelector, $(this.containerSelector));
    };

    return TweetsView;

  })(CollectionView);

}).call(this);

  }
}));
(this.require.define({
  "views/view": function(exports, require, module) {
    (function() {
  var ChaplinView, View,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  ChaplinView = require('chaplin/views/view');

  module.exports = View = (function(_super) {

    __extends(View, _super);

    function View() {
      View.__super__.constructor.apply(this, arguments);
    }

    return View;

  })(ChaplinView);

}).call(this);

  }
}));
