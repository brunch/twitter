mediator = require 'mediator'
utils = require 'lib/utils'

# Registers several Handlebars helpers

# Partials
# --------

Handlebars.registerHelper 'partial', (partialName, options) ->
  new Handlebars.SafeString(
    Handlebars.VM.invokePartial(
      Handlebars.partials[partialName], partialName, options.hash
    )
  )

# Generators
# ----------

# Facebook image URLs
Handlebars.registerHelper 'fb_img_url', (fbId, type) ->
  new Handlebars.SafeString utils.facebookImageURL(fbId, type)

# Conditional evaluation
# ----------------------

# Choose block by user login status
Handlebars.registerHelper 'if_logged_in', (options) ->
  if mediator.user
    options.fn(this)
  else
    options.inverse(this)

# Map helpers
# -----------

# Make 'with' behave a little more mustachey
Handlebars.registerHelper 'with', (context, options) ->
  if not context or Handlebars.Utils.isEmpty context
    options.inverse(this)
  else
    options.fn(context)

# Inverse for 'with'
Handlebars.registerHelper 'without', (context, options) ->
  inverse = options.inverse
  options.inverse = options.fn
  options.fn = inverse
  Handlebars.helpers.with.call(this, context, options)

# Evaluate block with context being current user
Handlebars.registerHelper 'with_user', (options) ->
  context = mediator.user.toJSON() or {}
  Handlebars.helpers.with.call(this, context, options)

Handlebars.registerHelper 'auto_link', (options) ->
  new Handlebars.SafeString twttr.txt.autoLink options.fn this

Handlebars.registerHelper 'format_date', (options) ->
  date = new Date options.fn this
  new Handlebars.SafeString moment(date).fromNow()

Handlebars.registerHelper 'unless_source_is_web', (source, options) ->
  string = if source is 'web' then '' else options.fn this
  new Handlebars.SafeString string
