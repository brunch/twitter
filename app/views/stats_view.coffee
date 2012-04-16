mediator = require 'mediator'
View = require './view'
template = require './templates/stats'

module.exports = class StatsView extends View
  template: template
  className: 'stats'
  tagName: 'ul'
  containerSelector: '#stats-container'

  initialize: ->
    super
    @subscribeEvent 'loginStatus', @loginStatusHandler
    @subscribeEvent 'userData', @render

  loginStatusHandler: (loggedIn) =>
    if loggedIn
      @model = mediator.user
    else
      @model = null
    @render()
