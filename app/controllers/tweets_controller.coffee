Controller = require 'controllers/base/controller'
Tweets = require 'models/tweets'
TweetsView = require 'views/tweets_view'

module.exports = class TweetsController extends Controller
  historyURL: ''

  index: (params) ->
    #console.debug 'PostsController#index'
    @collection = new Tweets()
    @view = new TweetsView collection: @collection
