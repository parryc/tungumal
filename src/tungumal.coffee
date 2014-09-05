class Lexr
  # Current options:
  # othography - sets the orthography
  constructor: (options) -> 
    for key, option of options
      @[key] = option

  words: {}
  wordAttributesMap: []
  wordConfigurableAttributes: {}
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
    else
      wordAttributes = attributes

    @words[word] = new Word(word, wordAttributes, @orthography)

  addN: (word, attributes) ->
    @add(word, 'noun', attributes)

  addV: (word, attributes) ->
    @add(word, 'verb', attributes)

  w: (word) ->
    @words[word]


class Word
  constructor: (@lemma,options,@orthography) ->
    for key, option of options
      @[key] = option

  has: (type, needle) ->
    if type is 'orthography'
      @_getOrthographyRegExp(needle,false).test(@lemma)

  doesNotHave: (type, needle) ->
    if type is 'orthography'
      !@has(type, needle)

  #returns list of graphs based on path in dot form
  #ex: vowels.front.unrounded
  _getOrthographyPath: (path) ->
    split = path.split('.')
    temp = @orthography
    for part in split
      temp = temp[part]
    return temp

  # takes orthography path in dot form
  # ex: vowels.back.unrounded
  # returns either the string version of the regexp or the actual regexp object
  _getOrthographyRegExp: (path, asString) ->
    letterSet = []
    letters = @_getOrthographyPath(path)
    # Return all ngraphs. ngraphs are surrounded by parens
    # "s(sz)z(dz)" => [s,sz,z,dz] 
    graphs = letters.match(/(?!\()([^\()])*(?=\))|[^\(\)]/gi)
    stringForm = '('+graphs.join('|')+')'
    if asString
      stringForm
    else
      new RegExp(stringForm,'gi')

if typeof module isnt 'undefined' and module.exports?
    exports.Lexr = Lexr
    exports.Word = Word
