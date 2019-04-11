describe('Enter GURU99 Name', function() {
  
  it('should add a Name as GURU99', function() {
    browser.get('https://angularjs.org');
    browser.driver.manage().window().maximize();
    element(by.model('yourName')).sendKeys('GURU99');
     var guru= element(by.xpath('html/body/div[2]/div[1]/div[2]/div[2]/div/h1'));
   expect(guru.getText()).toEqual('Hello GURU99!');
 
     });
  
 
  it('get title test', function(){
    browser.get('https://juliemr.github.io/protractor-demo/');
    expect(browser.getTitle()).toEqual('Supe1r Calculator');
    browser.sleep('5000');
  });
  
  it ('Window Handling in Protractor', function(){
	  browser.get('https://www.naukri.com');
	  browser.switchTo().frame(element)
  });
     
});
