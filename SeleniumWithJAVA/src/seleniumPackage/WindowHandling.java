package seleniumPackage;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.Set;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class WindowHandling {

	public static void main(String[] args) {
		System.setProperty("webdriver.chrome.driver", "C:\\Users\\SHUBHANKAR\\Desktop\\eclipse\\chromedriver.exe");
		WebDriver driver=new ChromeDriver();
		driver.get("http://www.naukri.com");
		driver.manage().window().maximize();
		
		//*************** Method-1 ************************
		
		String parent = driver.getWindowHandle(); 
		System.out.println("Parent Window Name " +parent);
		int windowCount = driver.getWindowHandles().size();
		System.out.println(windowCount);
		Set<String> allWindows = driver.getWindowHandles();
		ArrayList <String> tabs = new ArrayList<>(allWindows);
		driver.switchTo().window(tabs.get(2));
		String window1 = driver.getTitle();
		System.out.println(window1);
		driver.switchTo().window(parent);
		String window2 = driver.getTitle();
		System.out.println("Parent Window Name after switch: " +window2);
		
		//******************** Method-2 ********************
		 
		String parentWindow = driver.getWindowHandle();
		System.out.println ("Parent Window Handler Name = " +parentWindow);
		String parentWindowtitle= driver.getTitle();
		System.out.println ("Parent Window Title is = " +parentWindowtitle);
		Set<String> allWindow= driver.getWindowHandles();
		Iterator<String> it = allWindow.iterator();
		String parenWin = it.next();
		System.out.println ("Parent Window handler name = " +parenWin);
		String childWin1 = it.next();
		System.out.println ("Child Window handler name = " +childWin1);
		driver.switchTo().window(childWin1);
		String childWindowTitle1 = driver.getTitle();
		System.out.println ("Child Window Title is = " +childWindowTitle1);
		String childWin2 = it.next();
		System.out.println ("Child Window handler name = " +childWin2);
		driver.switchTo().window(childWin2);
		String childWindowTitle2 = driver.getTitle();
		System.out.println ("Child Window Title is = " +childWindowTitle2);
		                                                                   
		
	
	}

}
