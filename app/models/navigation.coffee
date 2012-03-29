Model = require 'models/model'

module.exports = class Navigation extends Model
  defaults:
    items: [
      {href: '/', title: 'Home'}
      {href: '/mentions', title: 'Mentions'}
      {href: '/logout', title: 'Logout'}
    ]
