package practiceSelenium;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.Set;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.interactions.Actions;

public class TestSelenium {

	public static void main(String[] args) {
		System.setProperty("webdriver.chrome.driver", "C:\\Users\\SHUBHANKAR\\Desktop\\eclipse\\chromedriver.exe");
		WebDriver driver=new ChromeDriver();
		driver.get("http://www.naukri.com");
		driver.manage().window().maximize();
		
		//***************************** Method-1 ****************************************
		//String parent = driver.getWindowHandle();
		//Set<String> allwindows = driver.getWindowHandles();
		int totalWindows = driver.getWindowHandles().size();
		System.out.println(totalWindows);
		//Iterator<String> it = allWindow.iterator();
		/*Iterator<String> it = allwindows.iterator();
		String parentWin = it.next();
		driver.switchTo().window(parentWin);
		System.out.println(driver.getTitle());
		String childWin = it.next();
		driver.switchTo().window(childWin);
		System.out.println(driver.getTitle());
		int totalWindows1 = driver.getWindowHandles().size();
		System.out.println(totalWindows1);
		String childWin1 = it.next();
		driver.switchTo().window(childWin1);
		System.out.println(driver.getTitle());
		String parent = driver.getWindowHandle();
		System.out.println(driver.getTitle());	*/	
		for (String winHandle:driver.getWindowHandles()){
			driver.switchTo().window(winHandle);
		}
		System.out.println(driver.getTitle());
		
		
		
		
		
		

	}

}
