package Test;

import java.util.Set;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class Test1 {

	public static void main(String[] args) {
		System.setProperty("webdriver.chrome.driver", "C:\\Users\\SHUBHANKAR\\Desktop\\eclipse\\chromedriver.exe");
		WebDriver driver = new ChromeDriver();
		driver.get("https://www.naukri.com/");
		String parent = driver.getWindowHandle();
		Set<String> allHandles = driver.getWindowHandles(); 
		for (String handle : allHandles ){
			driver.switchTo().window(handle);
			System.out.println(driver.getTitle());
		}
		
		System.out.println(driver.getTitle());

	}

}
