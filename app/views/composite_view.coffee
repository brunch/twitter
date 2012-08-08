View = require 'views/base/view'

module.exports = class CompositeView extends View
  initialize: ->
    super
    @subViews = []

  attachView: (view) ->
    @subViews.push view

  renderSubViews: ->
    _(@subViews).forEach (view) =>
      @$(view.container).append view.render().el

  render: =>
    super
    @renderSubViews()

  dispose: =>
    super
    _(@subViews).forEach (view) =>
      view.dispose()
