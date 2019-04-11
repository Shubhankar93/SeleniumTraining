package seleniumPackage;

import java.io.FileInputStream;
import java.io.FileNotFoundException;

import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

public class ReadDataFromExcel {

	public static void main(String[] args) throws Exception {
		FileInputStream fis = new FileInputStream("D:\\TestVineet2.xls");
		HSSFWorkbook wb = new HSSFWorkbook(fis);
		HSSFSheet ws = wb.getSehet("Vineet1");
		int maxRow = ws.getLastRowNum();
		for(int i=0; i<=maxRow-1; i++)
		{
			for (int j=0; j<=1; j++ )
			{
				String val = ws.getRow(i).getCell(j).getStringCellValue();
				System.out.print(val);
			}
			System.out.println();
		}
	}

}
