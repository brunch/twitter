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
    @subscribeEvent 'tweet:add', @addTweet

  getTweets: ->
    console.debug 'Tweets#getTweets'

    user = mediator.user
    return unless user

    provider = user.get 'provider'
    return unless provider.name is 'twitter'

    @trigger 'loadStart'
    provider.T.currentUser.homeTimeline @processTweets

  processTweets: (response) =>
    console.debug 'Tweets#processTweets', response

    # Trigger before updating the collection to hide the loading spinner
    @trigger 'load'

    tweets = if response?.array
      _(response.array).map (tweet) => tweet.attributes
    else
      []
    
    # Update the collection
    @reset tweets
    
    # Resolve the Deferred
    @resolve()

  addTweet: (tweet) =>
    @add tweet, at: 0
