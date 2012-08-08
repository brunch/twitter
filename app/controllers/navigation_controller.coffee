Controller = require 'controllers/base/controller'
mediator = require 'mediator'
Navigation = require 'models/navigation'
NavigationView = require 'views/navigation_view'

module.exports = class NavigationController extends Controller
  historyURL: 'logout'

  initialize: ->
    super
    #console.debug 'NavigationController#initialize'
    @model = new Navigation()
    @view = new NavigationView model: @model

  logout: ->
    mediator.publish '!logout'
    Backbone.history.navigate('//')
