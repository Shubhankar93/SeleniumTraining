package seleniumPackage;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.interactions.Actions;

public class RightClick {

	public static void main(String[] args) {
		System.setProperty("webdriver.chrome.driver", "D:\\Study\\Workspace\\chromedriver.exe");
		WebDriver driver = new ChromeDriver();
		driver.navigate().to("http://demo.automationtesting.in/Index.html");
		Actions objAction = new Actions(driver);
		objAction.contextClick(driver.findElement(By.id("email"))).build().perform();	
	}

}
