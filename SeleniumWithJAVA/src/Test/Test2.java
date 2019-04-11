package Test;

import java.util.Iterator;
import java.util.Set;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class Test2 {

	public static void main(String[] args) {
		System.setProperty("webdriver.chrome.driver", "C:\\Users\\SHUBHANKAR\\Desktop\\eclipse\\chromedriver.exe");
		WebDriver driver = new ChromeDriver();
		driver.get("https://www.naukri.com/");
		//driver.manage().window().maximize();
		String parent = driver.getWindowHandle();
		Set<String> allWindow= driver.getWindowHandles();
		Iterator<String>it = allWindow.iterator();
		driver.switchTo().window(it.next());
		System.out.println(driver.getTitle());
		driver.switchTo().window(it.next());
		System.out.println(driver.getTitle());
		driver.switchTo().window(it.next());
		System.out.println(driver.getTitle());
		driver.switchTo().window(it.next());
		System.out.println(driver.getTitle());
		System.out.println(driver.getWindowHandles().size());
		

	}

}
