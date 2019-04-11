var HtmlReporter = require('protractor-beautiful-reporter');
 
exports.config = {
   // your config here ...
		framework: 'jasmine',  
		  seleniumAddress: 'http://localhost:4444/wd/hub',
		  //specs: ['spec.js', 'spec1.js' ],
		  specs: ['spec.js'],
   onPrepare: function() {
      // Add a screenshot reporter and store screenshots to `/tmp/screenshots`:
      jasmine.getEnv().addReporter(new HtmlReporter({
         baseDirectory: 'tmp/screenshots'
      }).getJasmine2Reporter());
   }
}