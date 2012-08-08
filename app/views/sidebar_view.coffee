mediator = require 'mediator'
CompositeView = require 'views/composite_view'
StatsView = require 'views/stats_view'
StatusView = require 'views/status_view'
template = require 'views/templates/sidebar'

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
