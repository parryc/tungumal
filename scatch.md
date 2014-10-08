word.p()

lexr.nouns.addRule('ptv',';+Ta')

# add some feckin' for loops.
@ruleSet['p'] = {}
@p = function() {
	rule = @rules[@type][function_name]
	word = @current
	parts = @rule.split(';')
	match = compileMatch(parts)
	change = parts[1]
	options = parts[2] #if the change is dependent on some attribute of the word, e.g. 					   #in Hungarian
	if match.test(word)
		word += change

	word = @rewrite(word)

	@current = word
	return @
}

rewrite: (word) ->
	for rule in @rules
		word.replace(rule.match,rule.replace)

('<V>(I)<V>','j')
--> /((?:a|e|i|o|u))(I)(?:(a|e|i|o|u))/gi, '$1j$3'

addRewrite: (match, replace)
	output = {}
	compile -> (regex)

	if replace is '0'
		output.replace = ''

	#get the 3 parts of the match, the before, match, and after
	parts = match.split(/\(|\)/g)
	compiledMatch = ''
	for part in parts:
		compiledMatch += compile(part)

	output.match = new RegExp(compiledMatch,'gi')