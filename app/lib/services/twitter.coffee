mediator = require 'mediator'
utils = require 'lib/utils'
ServiceProvider = require 'lib/services/service_provider'

module.exports = class Twitter extends ServiceProvider
  consumerKey = 'w0uohox9lTgpKETJmscYIQ'
  name: 'twitter'

  constructor: ->
    super
    @subscribeEvent '!logout', @logout

  load: ->
    return if @state() is 'resolved' or @loading
    @loading = true

    utils.loadLib "http://platform.twitter.com/anywhere.js?id=#{consumerKey}&v=1", @sdkLoadHandler, @reject

  sdkLoadHandler: =>
    @loading = false
    # Init the SDK, then resolve
    twttr.anywhere (T) =>
      mediator.publish 'sdkLoaded'
      @T = T
      @resolve()

  isLoaded: ->
    # Return a Boolean
    Boolean window.twttr

  publish: (event, callback) ->
    @T.trigger event, callback

  subscribe: (event, callback) ->
    @T.bind event, callback

  unsubscribe: (event) ->
    @T.unbind event

  # Trigger login popup
  triggerLogin: (loginContext) ->
    callback = _(@loginHandler).bind(this, loginContext)
    @T.signIn()
    @subscribe 'authComplete', (event, currentUser, accessToken) ->
      callback {currentUser, accessToken}
    @subscribe 'signOut', ->
      console.log 'Signout event'
      callback()

  # Publish session & userData events and
  # add all twttr api methods to @api.
  publishSession: (response) ->
    user = response.currentUser

    mediator.publish 'serviceProviderSession',
      provider: this
      userId: user.id
      accessToken: response.accessToken or twttr.anywhere.token
    mediator.publish 'userData', user.attributes

  # Callback for the login popup
  loginHandler: (loginContext, response) =>
    console.debug 'Twitter#loginHandler', loginContext, response
    if response
      # Publish successful login
      mediator.publish 'loginSuccessful',
        provider: this, loginContext: loginContext

      # Publish the session
      @publishSession response
    else
      mediator.publish 'loginFail', provider: this, loginContext: loginContext

  getLoginStatus: (callback = @loginStatusHandler, force = false) ->
    console.debug 'Twitter#getLoginStatus'
    callback @T

  loginStatusHandler: (response) =>
    console.debug 'Twitter#loginStatusHandler', response
    if response.currentUser
      @publishSession response
    else
      mediator.publish 'logout'

  # Handler for the global logout event
  logout: ->
    console.log 'Twitter#logout'
    twttr?.anywhere?.signOut?()
