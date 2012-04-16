mediator = require 'mediator'
CollectionView = require 'chaplin/views/collection_view'
TweetView = require './tweet_view'
template = require './templates/tweets'

module.exports = class TweetsView extends CollectionView
  template: template

  tagName: 'div' # This is not directly a list but contains a list
  id: 'tweets'

  containerSelector: '#content-container'
  listSelector: '.tweets' # Append the item views to this element
  fallbackSelector: '.fallback'

  initialize: ->
    super # Will render the list itself and all items
    @subscribeEvent 'loginStatus', @showHideLoginNote

  # The most important method a class inheriting from CollectionView
  # must overwrite.
  getView: (item) ->
    # Instantiate an item view
    new TweetView model: item

  # Show/hide a login appeal if not logged in
  showHideLoginNote: ->
    @$('.tweets, .tweets-header').css 'display', if mediator.user then 'block' else 'none'

  render: ->
    console.log 'TweetsView#render', this, @$el
    super
    @showHideLoginNote()

  afterRender: ->
    super
    console.log 'TweetsView#afterRender', @containerSelector, $(@containerSelector)
