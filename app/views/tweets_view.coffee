mediator = require 'mediator'
CollectionView = require 'views/base/collection_view'
TweetView = require 'views/tweet_view'
template = require 'views/templates/tweets'

module.exports = class TweetsView extends CollectionView
  template: template

  tagName: 'div' # This is not directly a list but contains a list
  id: 'tweets'

  container: '#content-container'
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
    super
    @showHideLoginNote()
