mediator = require 'mediator'
Collection = require 'models/collection'
Tweet = require 'models/tweet'

module.exports = class Tweets extends Collection
  model: Tweet

  initialize: ->
    super

    # Mixin a Deferred
    _(this).extend $.Deferred()

    @getTweets()
    @subscribeEvent 'login', @getTweets
    @subscribeEvent 'logout', @reset

  getTweets: ->
    console.debug 'Tweets#getTweets'

    user = mediator.user
    return unless user

    provider = user.get 'provider'
    return unless provider.name is 'twitter'

    @trigger 'loadStart'
    provider.T.currentUser.homeTimeline @processTweets

  processTweets: (response) =>
    console.debug 'Tweets#processTweets', response, response.array

    # Trigger before updating the collection to hide the loading spinner
    @trigger 'load'

    tweets = if response and response.array then response.array else []
    
    # Update the collection
    @reset tweets
    
    # Resolve the Deferred
    @resolve()
