mediator = require 'mediator'
utils = require 'lib/utils'
ServiceProvider = require 'lib/services/service_provider'

module.exports = class Twitter extends ServiceProvider
  consumerKey = 'w0uohox9lTgpKETJmscYIQ'
  name: 'twitter'
  api: {}

  loadSDK: ->
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

  # Trigger login popup
  triggerLogin: (loginContext) ->
    callback = _(@loginHandler).bind(this, @loginHandler)
    @T.signIn callback

  # Callback for the login popup
  loginHandler: (loginContext, response) =>
    console.debug 'Twitter#loginHandler'
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
    callback @T

  loginStatusHandler: (response) =>
    if response.currentUser
      user = response.currentUser
      for attr, value of user when typeof value is 'function'
        @api[attr] = value
      @api.updateStatus = response.Status.update
      mediator.publish 'serviceProviderSession',
        provider: this
        userId: user.id
        accessToken: twttr.anywhere.token
      mediator.publish 'userData', user.attributes
    else
      mediator.publish 'logout'

  # Handler for the global logout event
  logout: ->
    # Clear the status properties
    @T.logout()
    @T = null
