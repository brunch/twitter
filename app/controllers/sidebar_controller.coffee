Controller = require 'controllers/controller'
SidebarView = require 'views/sidebar_view'
StatusView = require 'views/status_view'

module.exports = class NavigationController extends Controller
  initialize: ->
    @view = new SidebarView()
