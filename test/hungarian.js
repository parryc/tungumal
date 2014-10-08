var should = require('chai').should(),
	Lexr = require('../src/tungumal.js').Lexr,
	Orthography = require('../src/tungumal.js').Orthography,
	Rewrite = require('../src/tungumal.js').Rewrite,
	Word = require('../src/tungumal.js').Word;


before(function() {
	hun = new Lexr({});
	Orthography.setOrthography({
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
	})

	hun.wordConfig('noun',['nmap1','nmap2']);
	hun.wordConfig('verb',['vmap1','vmap2']);

	hun.addV('ért',['vmap1value','vmap2value']);
	hun.addN('herceg',['nmap1value','nmap2value']);
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

	});

	describe('after creation', function(){
		it('should print to string correctly', function(){
			hun.w('ért').toS().should.equal('ért')
		});
	});
});

