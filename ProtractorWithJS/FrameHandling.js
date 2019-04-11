describe('Frame Handling', function() {
	 it('Should Click on an Element Under Frame', function() {
		 	browser.waitForAngularEnabled(false);
		    browser.get('http://demo.automationtesting.in/Frames.html');   
		    browser.switchTo().frame('singleframe');
		    element(by.xpath("//input[@type='text']")).sendKeys('GURU99');
		     });
});