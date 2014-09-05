var should = require('chai').should(),
	Lexr = require('../src/tungumal.js').Lexr,
	Word = require('../src/tungumal.js').Word;


before(function() {
	hun = new Lexr({
		"orthography":{
		    "vowels": {
		      "all": "áóúőűéíaoueiöü",
		      "back": "aáoóuú",
		      "front": {
		        "rounded": "öőüű",
		        "unrounded": "eéií"
		      },
		      "long": "áóúőűéí",
		      "short": "aoueiöü"
		    },
		    "consonants" : "bc(cs)d(dz)(dzs)fg(gy)hjkl(ly)mn(ny)prs(sz)t(ty)vz(zs)",
		    "sibilants": "s(sz)z(dz)",
		    "palatals": "jl(ly)n(ny)r"
		  }
		});

	hun.wordConfig('noun',['nmap1','nmap2']);
	hun.wordConfig('verb',['vmap1','vmap2']);

	hun.addV('ért',['vmap1value','vmap2value']);
	hun.addN('herceg'['nmap1value','nmap2value']);
});

describe('A word', function(){
	describe('on creation', function(){
		it('should match what orthography it has', function(){
			hun.w('ért').has('orthography','vowels.front.unrounded').should.equal(true);
		});

		it('should not match what orthography it does not have', function(){
			hun.w('ért').doesNotHave('orthography','vowels.back').should.equal(true);
		});

		it('should return its lemma', function(){
			hun.w('ért').lemma.should.equal('ért');
		});

		it('should return its attributes', function(){
			hun.w('ért').vmap1.should.equal('vmap1value');
			hun.w('ért').vmap2.should.equal('vmap2value');
		});

		// lexr.w('word').has('orthography','vowels.back')
		// lexr.w('werd').doesNotHave('orthography','vowels.front')
		// lexr.w('word').has('gender','male')

		// lexr.wordConfig(['gender','option1','option2'])
		// lexr.add('banan',['common','wut','yeah'])
		// 	new Word(word, options)
		// 	lexr.words.push(new Word((word, options)))
		// lexr.w('banan').gender


		lexr.w('ért').present
		lexr.configWordAttribute('vowelType',
			'orthography'
			['vowels.front.unrounded','vowels.front.rounded','vowels.back']
			);

		lexr.stem("remove en")

		#configureWordAttribute(name,
			type,
			options
		)
		lexr.addRule('present',{
			'1s':[
				"ik.;remove ik then +Vm; V > o,e,ö",
				";+Vk; V > o,e,ö"
				"proceeded by <vowels.front.unrounded>;+ok"
				"proceeded by <vowels.front.rounded>;+ek"
				"proceeded by <vowels.back>;+ök"

				],
			'2s':[
				"<consonants>{2}.;+Vsz; V > a,e,e",
				"<vowels.long>t.;+Vsz; V > a,e,e,",
				"<sibilants>.;+vl; V> o,e,ö",
				";+sz;"
			]
		})

		//add a stemmer.
		lexr.stem('verb','remove en');
		//don't need 3rd bit if there are no vowel replacements
		lexr.addRule('dutch-present',{
			'1s':[
				"" // wonen > woon
			],
			'2s,3s':[
				"t.;",
				";+t"
			],
			'1p,2p,3p':[";+en"]

		})
https://code.google.com/p/foma/wiki/MorphologicalAnalysisTutorial
-- flag diacritics!

		lexr.rewrite('<C>+(V)<C>+','(V)~2')
		won -> woon
		wont -> woont

# order
stem -> rule -> rewrite

## finnish noun example
## http://web.stanford.edu/~laurik/fsmbook/LSA-207/Assignments/Assingment%202.html
stem = null
//partitive
//I wonder if this is the best way to do it... 
//lexr.w('puu').s.ptv
s/p could have specific rules that change the attribute? 
lexr.w('puu').num('s').ptv
lexr.w('puu').s.ptv looks better though
lexr.addModifier('number',["s","p"])
	-> adds s() function which sets the number attribute to "s"
	-> adds p() function which sets the number attribute to "p"

#!!xxx what follows has not been added to stem yet
e.g.
var partial = lexr.w('puu').ptv()
partial.stem = ['ptv']
partial.p().stem = ['ptv','p']

or something. not sure if the partitive goes first or if the s/p goes first... 
I guess you wouldnt have to add s() since s()/nom() is the default for a lemma?

make it explicit. or have those as defaults and they can be overridden
lexr.lemma('noun',{
	'number':'s',
	'case':'nom'
})

lexr.addRule('p','!!nom',';+I')
lexr.addRule('ptv',";+Ta",'noun','number')
number would be default for noun, person for verbs?
hm if <V> always goes to (a|e|i...) then how to know which () to match?

lexr.rewrite('(a)I','o') aI -> oI; whatever is in the parens gets replaced
lexr.rewrite('(i)I','e')
# - = .*?  ??
lexr.rewrite('!<V> u|o - (a) I', '0')
lexr.rewrite('(aa)I','a') etc. for long vowels
lexr.rewrite('<V>(I)<V>','j')
lexr.rewrite('I','i')

# for syllable structure
lexr.rewrite('when bisyllabic, T','t')
lexr.rewrite('when monosyllabic, T','0')
>> use when form to check word attributes
#syllable(form, if so, otherwise), cause I am lazy right now
lexr.syllable('<C><V>+','monosyllabic','bisyllabic')
## lexr.w('puu').s().ptv() 
puuTa -> rewrite monosyllabic -> puuta
## lexr.w('puu').p().ptv()
puuITa
puuIta
puIta
puita

	});
});