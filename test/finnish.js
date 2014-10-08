var should = require('chai').should(),
	Lexr = require('../src/tungumal.js').Lexr,
	Rewrite = require('../src/tungumal.js').Rewrite,
	Orthography = require('../src/tungumal.js').Orthography,
	Word = require('../src/tungumal.js').Word;


before(function() {
	fin = new Lexr();
	Orthography.setOrthography({
	    "V":"aeiou",
	    "C":"bcdfghjklmnprstvz"
	  });

	fin.addRule('p',';I');
	fin.addRule('ptv',';Ta');

	Rewrite.add('(I)','i')
	Rewrite.add('<C><V>+(T)','t')
	Rewrite.add('(T)','0')


	fin.addN('puu');

});

describe('A word', function(){
	describe('when conjugating', function(){
		it('should conjugate correctly', function(){
			fin.w('puu').p().ptv().toS().should.equal('puita');
		});
	});
});

