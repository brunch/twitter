mediator = require 'mediator'
Status = require 'models/status'
View = require 'views/view'
template = require './templates/status'

module.exports = class StatusView extends View
  @template: template
  id: 'status'
  className: 'status'
  containerSelector: '#status-container'
  autoRender: no

  initialize: ->
    super
    @subscribeEvent 'loginStatus', @loginStatusHandler
    @subscribeEvent 'userData', @render

  loginStatusHandler: (loggedIn) =>
    if loggedIn
      @model = new Status()
    else
      @model = null
    @render()

  updateCharacterCount: (valid, count) =>
    $charCount = @$('.status-character-count')
    $createButton = @$('.status-create-button')
    $charCount.text count
    if valid
      $charCount.removeClass 'status-character-count-invalid'
      $createButton.removeAttr 'disabled'
    else
      $charCount.addClass 'status-character-count-invalid'
      $createButton.attr 'disabled', 'disabled'

  updateStatusText: (event) =>
    text = $(event.currentTarget).val()
    @updateCharacterCount (@model.set {text}), @model.calcCharCount text.length

  createStatus: (event) =>
    @model.save {},
      error: (model, error) =>
        console.log 'Tweet error', error
      success: (model, attributes) =>
        console.log 'Tweet success', attributes

  render: =>
    super
    console.log 'Render', this
    # @delegate 'keyup', '.status-text', @updateStatusText
    _(['keyup', 'keydown']).each (eventName) =>
      @delegate eventName, '.status-text', @updateStatusText
    # @modelBind 'change:text', @updateCharacterCount
    @delegate 'click', '.status-create-button', @createStatus
