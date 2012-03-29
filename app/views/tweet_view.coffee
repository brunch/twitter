template = require './templates/tweet'
View = require 'views/view'

module.exports = class TweetView extends View
  @template = template

  className: 'tweet'
