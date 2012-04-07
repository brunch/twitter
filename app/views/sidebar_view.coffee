mediator = require 'mediator'
CompositeView = require 'views/composite_view'
StatusView = require 'views/status_view'
template = require './templates/sidebar'

module.exports = class SidebarView extends CompositeView

  # This is a workaround.
  # In the end you might want to used precompiled templates.
  @template = template

  id: 'sidebar'
  containerSelector: '#sidebar-container'
  autoRender: true

  initialize: ->
    super
    @attachView new StatusView()
    @subscribeEvent 'loginStatus', @loginStatusHandler
    @subscribeEvent 'userData', @render

  loginStatusHandler: (loggedIn) =>
    if loggedIn
      @model = mediator.user
    else
      @model = null
    @render()
