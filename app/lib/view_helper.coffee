# Application-specific view helpers
# ---------------------------------

Handlebars.registerHelper 'transform_if_retweeted', (options) ->
  if this.retweeted_status
    data = _.clone(this.retweeted_status)
    data.retweeter = this.user
    options.fn(data)
  else
    options.fn(this)

Handlebars.registerHelper 'auto_link', (options) ->
  new Handlebars.SafeString twttr.txt.autoLink options.fn this

Handlebars.registerHelper 'format_date', (options) ->
  date = new Date options.fn this
  new Handlebars.SafeString moment(date).fromNow()

Handlebars.registerHelper 'unless_is_web', (source, options) ->
  string = if source is 'web' then '' else options.fn this
  new Handlebars.SafeString string
