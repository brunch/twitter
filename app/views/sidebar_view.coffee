mediator = require 'mediator'
View = require 'views/view'
template = require './templates/sidebar'

module.exports = class SidebarView extends View

  # This is a workaround.
  # In the end you might want to used precompiled templates.
  @template = template

  id: 'sidebar'
  containerSelector: '#sidebar-container'
  autoRender: true

  initialize: ->
    super
    @subscribeEvent 'loginStatus', @loginStatusHandler
    @subscribeEvent 'userData', @render
    @delegate 'keyup', '.composable-tweet-text', @updateCharacterCount
    @delegate 'click', '.composable-tweet-send-button', @createTweet

  loginStatusHandler: (loggedIn) =>
    if loggedIn
      @model = mediator.user
    else
      @model = null
    @render()

  updateCharacterCount: (event) =>
    max = 140
    $charCount = @$('.composable-tweet-character-count')
    $send = @$('.composable-tweet-send-button')
    count = $(event.currentTarget).val().length
    charsLeft = max - count
    $charCount.text charsLeft
    if charsLeft < 0 or charsLeft is max
      unless charsLeft is max
        $charCount.addClass 'composable-tweet-character-count-invalid'
      $send.attr 'disabled', 'disabled'
    else
      $charCount.removeClass 'composable-tweet-character-count-invalid'
      $send.removeAttr 'disabled'

  createTweet: (event) =>
    api = mediator.user.get('provider').api
    text = @$('.composable-tweet-text').val()
    api.updateStatus text, (tweet) =>
      console.log 'New tweet:', tweet
