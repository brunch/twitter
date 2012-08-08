mediator = require 'mediator'
Status = require 'models/status'
View = require 'views/base/view'
template = require 'views/templates/status'

module.exports = class StatusView extends View
  template: template
  id: 'status'
  className: 'status'
  container: '#status-container'

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
      # TODO: check this in model.
      $charCount.addClass 'status-character-count-invalid' unless count is 140
      $createButton.attr 'disabled', 'disabled'

  updateStatusText: (event) =>
    text = $(event.currentTarget).val()
    valid = @model.set {text}
    count = @model.calcCharCount text.length
    @updateCharacterCount valid, count

  createStatus: (event) =>
    @model.save {},
      error: (model, error) =>
        console.error 'Tweet error', error
      success: (model, attributes) =>
        console.debug 'Tweet success', attributes
        @$('.status-text').val('').trigger('keydown')

  render: =>
    super
    _(['keyup', 'keydown']).each (eventName) =>
      @delegate eventName, '.status-text', @updateStatusText
    @delegate 'click', '.status-create-button', @createStatus
