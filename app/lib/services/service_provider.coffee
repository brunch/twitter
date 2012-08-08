utils = require 'lib/utils'
Chaplin = require 'chaplin'

module.exports = class ServiceProvider
  # Mixin a Subscriber
  _(ServiceProvider.prototype).defaults Chaplin.Subscriber

  loading: false

  constructor: ->
    #console.debug 'ServiceProvider#constructor'

    # Mixin a Deferred
    _(this).extend $.Deferred()

    utils.deferMethods
      deferred: this
      methods: ['triggerLogin', 'getLoginStatus']
      onDeferral: @loadSDK

  # Disposal
  # --------

  disposed: false

  dispose: ->
    return if @disposed

    # Unbind handlers of global events
    @unsubscribeAllEvents()

    # Finished
    #console.debug 'ServiceProvider#dispose', this, 'finished'
    @disposed = true

    # You're frozen when your heart’s not open
    Object.freeze? this

###

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

###