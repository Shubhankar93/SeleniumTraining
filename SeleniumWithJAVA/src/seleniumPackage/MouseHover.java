package seleniumPackage;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.interactions.Actions;

public class MouseHover {

	public static void main(String[] args) {
		System.setProperty("webdriver.chrome.driver", "C:\\Users\\SHUBHANKAR\\Desktop\\eclipse\\chromedriver.exe");
		WebDriver driver=new ChromeDriver();
		driver.get("http://www.naukri.com");
		driver.manage().window().maximize();
		
		Actions action = new Actions(driver);
		action.moveToElement(driver.findElement(By.xpath("/html/body/div[2]/div/ul/li[2]/a/div"))).build().perform();

		
	}

}
