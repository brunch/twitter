module.exports = (match) ->
  match '', 'tweets#index'
  match '@:user', 'user#show'
  match 'logout', 'navigation#logout'
