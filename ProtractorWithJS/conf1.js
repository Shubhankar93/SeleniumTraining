var Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');

exports.config = {
		  framework: 'jasmine',  
		  seleniumAddress: 'http://localhost:4444/wd/hub',
		  //specs: ['spec.js', 'spec1.js' ],
		  specs: ['spec.js'],
   // ...
   onPrepare: function() {
      jasmine.getEnv().addReporter(
        new Jasmine2HtmlReporter({
          savePath: 'target/screenshots'
        })
      );
   }
}