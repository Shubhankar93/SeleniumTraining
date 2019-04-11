package seleniumPackage;


import java.io.FileOutputStream;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.interactions.Actions;

public class WriteToExcelFromWebTable {
	public static void main(String[] args) throws Exception {
		HSSFWorkbook wb = new HSSFWorkbook();
		HSSFSheet ws = wb.createSheet("MyData");
		HSSFRow row = ws.createRow(0);
		HSSFCell cell = row.createCell(0);
		cell.setCellValue("Hello World");
		FileOutputStream fos = new FileOutputStream("D://MyTestData.xls");
		wb.write(fos);
		fos.close();
	}
}
