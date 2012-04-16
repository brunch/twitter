mediator = require 'mediator'
CompositeView = require './composite_view'
StatsView = require './stats_view'
StatusView = require './status_view'
template = require './templates/sidebar'

module.exports = class SidebarView extends CompositeView
  template: template

  id: 'sidebar'
  containerSelector: '#sidebar-container'
  autoRender: true

  initialize: ->
    super
    @attachView new StatusView()
    @attachView new StatsView()
    @subscribeEvent 'loginStatus', @loginStatusHandler
    @subscribeEvent 'userData', @render

  loginStatusHandler: (loggedIn) =>
    if loggedIn
      @model = mediator.user
    else
      @model = null
    @render()
