class Lexr
  # Current options:
  # othography - sets the orthography
  constructor: (options) -> 
    for key, option of options
      @[key] = option

  words: {}
  wordAttributesMap: []
  wordConfigurableAttributes: {}
  rules: {}
  # internal util   
  
  _typeIsArray = Array.isArray || ( value ) -> return {}.toString.call( value ) is '[object Array]'   
  

  wordConfig: (wordType, arrayConfig) ->
    @wordAttributesMap[wordType] = arrayConfig

  
  # add a new word, with attributes
  add: (word, type, attributes) ->
    wordAttributes = {}
    if _typeIsArray attributes
      for el, idx in attributes
        wordAttributes[@wordAttributesMap[type][idx]] = el
    else if attributes isnt undefined
        wordAttributes = attributes

    # defaults - this will need to be configurable
    if type is 'noun'
      wordAttributes.number = 's'
      wordAttributes.case = 'nom'
    if type is 'verb'
      wordAttributes.person = ''
      wordAttributes.tense = 'inf'

    wordAttributes.type = type

    @words[word] = new Word(word, wordAttributes, @rules)

  addN: (word, attributes) ->
    @add(word, 'noun', attributes)

  addV: (word, attributes) ->
    @add(word, 'verb', attributes)

  addRule: (part,ruleSet) ->
    ruleParts = ruleSet.split(';')
    match = @_compileMatch(ruleParts[0])
    change = ruleParts[1]
    options = ruleParts[2] #if the change is dependent on some attribute of the word, e.g.             #in Hungarian
    

    @rules[part] = () ->
      word = @current
      if match.test(@current)
        word += change

      word = Rewrite.rewrite(word)
      @current = word
      return @

  w: (word) ->
    @words[word]

  _compileMatch: (criteria) ->
    if criteria is ''
      criteria = '.*'
    else
      criteria = 'fill this in later'

    return new RegExp(criteria,'gi')

class Word
  constructor: (@lemma,options,rules) ->
    #set the current form of the word to the lemma
    #TODO: add stemmer
    @current = @lemma
    for key, option of options
      @[key] = option
    for name, rule of rules
      @[name] = rule


  has: (type, needle) ->
    if type is 'orthography'
      Orthography.getRegExp(needle,false).test(@lemma)

  doesNotHave: (type, needle) ->
    if type is 'orthography'
      !@has(type, needle)


  toS: () ->
    @current

# The orthography is global
# TODO: support for multiple scripts
class Orthography
  constructor: () ->

  orthography: {}

  @setOrthography: (orthography) ->
    @orthography = orthography

  #returns list of graphs based on path in dot form
  #ex: vowels.front.unrounded
  @getPath: (path) ->
    split = path.split('.')
    temp = @orthography
    for part in split
      temp = temp[part]
    return temp

  # takes orthography path in dot form
  # ex: vowels.back.unrounded
  # returns either the string version of the regexp or the actual regexp object
  @getRegExp: (path, asString) ->
    letterSet = []
    letters = @getPath(path)
    # Return all ngraphs. ngraphs are surrounded by parens
    # "s(sz)z(dz)" => [s,sz,z,dz] 
    graphs = letters.match(/(?!\()([^\()])*(?=\))|[^\(\)]/gi)
    stringForm = '('+graphs.join('|')+')'
    if asString
      stringForm
    else
      new RegExp(stringForm,'gi')


# Rewrite rules are accessed by every word and are language specific, rather than
# word specific
class Rewrite
  constructor: () ->

  @rules: []

  @add: (match, replace) ->
    output = {}

    if replace is '0'
      output.replace = ''
    else
      output.replace = replace

    #get the 3 parts of the match, the before, match, and after
    parts = match.split(/\(|\)/g)
    compiledMatch = ''
    for part in parts
      compiledMatch += @_compile(part)
    console.log(compiledMatch)
    output.match = new RegExp(compiledMatch,'gi')
    console.log(output)
    Rewrite.rules.push(output)

  @rewrite: (word) ->
    for rule in Rewrite.rules
      word = word.replace(rule.match,rule.replace)
    return word

  @_compile: (regex) ->
    __expandCondition = (condition) ->
      # Replace groups with correct orthography
      expandedCondition = condition
      groups = condition.match(/<([^<>]*)>/gi)
      if groups?
        for group in groups
          #make sure they're non-matching groups
          groupRegexp = "(?:"+Orthography.getRegExp(group.replace(/<|>/gi,""))+")"
          expandedCondition = expandedCondition.replace(group,groupRegexp)
          console.log(expandedCondition)
    __expandCondition(regex)

if typeof module isnt 'undefined' and module.exports?
    exports.Lexr = Lexr
    exports.Word = Word
    exports.Rewrite = Rewrite
    exports.Orthography = Orthography
