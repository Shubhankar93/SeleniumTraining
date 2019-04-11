package Test;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class Test3 {

	public static void main(String[] args) {
		System.setProperty("webdriver.chrome.driver", "C:\\Users\\SHUBHANKAR\\Desktop\\eclipse\\chromedriver.exe");
		WebDriver driver=new ChromeDriver();
		driver.get("https://angularjs.org");
		driver.findElement(By.xpath("//*[@ng-model='yourName']")).sendKeys("Guru99");
		
		                              

	}

}
