package seleniumPackage;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;

public class CretaeAndWriteToExcel {

	public static void main(String[] args) throws IOException {
		HSSFWorkbook wb = new HSSFWorkbook();
		HSSFSheet ws = wb.createSheet("DataSheet");
		HSSFRow row = ws.createRow(0);
		HSSFCell cell = row.createCell(0);
		cell.setCellValue("Hello World");
		
		FileOutputStream fos = new FileOutputStream("D://TestData.xls");	
		wb.write(fos);
		fos.close();
	}

}
