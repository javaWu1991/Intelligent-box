package cmcc.mobile.yiqi.utils;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.text.SimpleDateFormat;
import java.util.Collection;
import java.util.Date;
import java.util.Iterator;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFClientAnchor;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.util.CellRangeAddress;

import cmcc.mobile.yiqi.entity.TAppbakExcel;
import cmcc.mobile.yiqi.entity.dao.TAppbakExcelMapper;
import cmcc.mobile.yiqi.vo.ExportExcelVo;

/**
 * 导出工具类
 * 
 * @author zhangxs
 *
 */
public class ExportExcelUtils {

	/**
	 * 通讯录备份导出，并根据需求决定是否是要导出以及备份
	 * 
	 * @param cid
	 * @param fileName
	 * @param headers
	 * @param dataset
	 * @param isNeedBak
	 * @param request
	 * @param pattern
	 * @return
	 */
	@SuppressWarnings({ "deprecation" })
	public static HSSFWorkbook exportExcel(TAppbakExcelMapper excelMapper, String cid, String fileName,
			String[] headers, Collection<ExportExcelVo> dataset, Boolean isNeedBak, HttpServletRequest request,
			SimpleDateFormat pattern) {
		// 声明一个工作薄
		HSSFWorkbook workbook = new HSSFWorkbook();
		// 生成一个表格
		HSSFSheet sheet = workbook.createSheet();
		sheet.setActive(true);
		// 设置表格默认列宽度为15个字节
		sheet.setDefaultColumnWidth((short) 18);
		// 生成一个样式
		HSSFCellStyle style = workbook.createCellStyle();
		// 设置这些样式
		style.setFillForegroundColor(HSSFColor.SKY_BLUE.index);
		style.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
		style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
		style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
		style.setBorderRight(HSSFCellStyle.BORDER_THIN);
		style.setBorderTop(HSSFCellStyle.BORDER_THIN);
		style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
		// 生成一个字体
		HSSFFont font = workbook.createFont();
		font.setColor(HSSFColor.VIOLET.index);
		font.setFontHeightInPoints((short) 12);
		font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
		// 把字体应用到当前的样式
		style.setFont(font);
		// 生成并设置另一个样式
		HSSFCellStyle style2 = workbook.createCellStyle();
		style2.setFillForegroundColor(HSSFColor.LIGHT_YELLOW.index);
		style2.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
		style2.setBorderBottom(HSSFCellStyle.BORDER_THIN);
		style2.setBorderLeft(HSSFCellStyle.BORDER_THIN);
		style2.setBorderRight(HSSFCellStyle.BORDER_THIN);
		style2.setBorderTop(HSSFCellStyle.BORDER_THIN);
		style2.setAlignment(HSSFCellStyle.ALIGN_CENTER);
		style2.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
		// 生成另一个字体
		HSSFFont font2 = workbook.createFont();
		font2.setBoldweight(HSSFFont.BOLDWEIGHT_NORMAL);
		// 把字体应用到当前的样式
		style2.setFont(font2);
		/*
		 * // 声明一个画图的顶级管理器 HSSFPatriarch patriarch =
		 * sheet.createDrawingPatriarch(); // 定义注释的大小和位置,详见文档 HSSFComment
		 * comment = patriarch.createComment(new HSSFClientAnchor(0, 0, 0, 0,
		 * (short) 4, 2, (short) 6, 5)); // 设置注释内容 comment.setString(new
		 * HSSFRichTextString("可以在POI中添加注释！")); //
		 * 设置注释作者，当鼠标移动到单元格上是可以在状态栏中看到该内容. comment.setAuthor("leno");
		 */
		// 产生表格标题行
		HSSFRow row0 = sheet.createRow(0);
		CellRangeAddress cra = new CellRangeAddress(0, 0, 0, 6);

		HSSFCell cell0 = row0.createCell((short) 0);
		cell0.setCellValue("说明：姓名,手机号码,部门,职位(不填职级默认则职级默认为1，短号最长为6位数字)为必填项，且必须使用该模板进行导入！");
		sheet.addMergedRegion(cra);

		HSSFRow row1 = sheet.createRow(1);
		for (short i = 0; i < headers.length; i++) {
			HSSFCell cell = row1.createCell(i);
			cell.setCellStyle(style);
			HSSFRichTextString text = new HSSFRichTextString(headers[i]);
			cell.setCellValue(text);
		}
		// 遍历集合数据，产生数据行
		Iterator<ExportExcelVo> it = dataset.iterator();
		int index = 1;
		while (it.hasNext()) {
			index++;
			HSSFRow row = sheet.createRow(index);
			ExportExcelVo t = (ExportExcelVo) it.next();
			// 利用反射，根据javabean属性的先后顺序，动态调用getXxx()方法得到属性值
			Field[] fields = t.getClass().getDeclaredFields();
			for (short i = 0; i < fields.length; i++) {
				HSSFCell cell = row.createCell(i);
				cell.setCellStyle(style2);
				Field field = fields[i];
				String fieldName = field.getName();
				String getMethodName = "get" + fieldName.substring(0, 1).toUpperCase() + fieldName.substring(1);
				try {
					Class<? extends ExportExcelVo> tCls = t.getClass();
					Method getMethod = tCls.getMethod(getMethodName, new Class[] {});
					Object value = getMethod.invoke(t, new Object[] {});
					// 判断值的类型后进行强制类型转换
					String textValue = null;

					if (value instanceof Integer) {
						Integer bValue = (Integer) value;
						textValue = "男";
						if (bValue == 0) {
							textValue = "女";
						}
					} else if (value instanceof Date) {
						Date date = (Date) value;
						textValue = pattern.format(date);
					} else if (value instanceof byte[]) {
						// 有图片时，设置行高为60px;
						row.setHeightInPoints(60);
						// 设置图片所在列宽度为80px,注意这里单位的一个换算
						sheet.setColumnWidth(i, (short) (35.7 * 80));
						HSSFClientAnchor anchor = new HSSFClientAnchor(0, 0, 1023, 255, (short) 6, index, (short) 6,
								index);
						anchor.setAnchorType(2);
					} else {
						// 其它数据类型都当作字符串简单处理
						if (null != value) {
							textValue = value.toString();
						}
					}
					// 如果不是图片数据，就利用正则表达式判断textValue是否全部由数字组成
					if (textValue != null) {
						Pattern p = Pattern.compile("^//d+(//.//d+)?$");
						Matcher matcher = p.matcher(textValue);
						if (matcher.matches()) {
							// 是数字当作double处理
							cell.setCellValue(Double.parseDouble(textValue));
						} else {
							HSSFRichTextString richString = new HSSFRichTextString(textValue);
							cell.setCellValue(richString);
						}
					}
				} catch (ArrayIndexOutOfBoundsException e) {

				} catch (SecurityException e) {
					e.printStackTrace();
				} catch (NoSuchMethodException e) {
					e.printStackTrace();
				} catch (IllegalArgumentException e) {
					e.printStackTrace();
				} catch (IllegalAccessException e) {
					e.printStackTrace();
				} catch (InvocationTargetException e) {
					e.printStackTrace();
				} finally {
					// 清理资源
					dataset = null;
				}
			}
		}

		if (isNeedBak) {
			/**
			 * 保存至服务器 根据公司编号建立文件夹
			 */
			String realPath = "/upload/excel/" + cid + "/";
			String filePath = "/upload/excel/" + cid + "/";
			String FILE_PATH = FileUpload.class.getResource("/").getFile();
			FILE_PATH = FILE_PATH.substring(0, FILE_PATH.lastIndexOf("/"));
			FILE_PATH = FILE_PATH.substring(0, FILE_PATH.lastIndexOf("/"));
			filePath = FILE_PATH.substring(0, FILE_PATH.lastIndexOf("/")) + filePath;
			// 新建一输出流
			FileOutputStream fout = null;
			try {
				File file = new File(filePath);
				if (!file.exists()) {
					file.mkdirs();
				}
				String path = filePath + fileName + ".xls";
				file = new File(path);
				if (!file.exists()) {
					file.createNewFile();
				}
				fout = new FileOutputStream(file);
				workbook.write(fout);
				// 保存备份信息至数据库
				TAppbakExcel excel = new TAppbakExcel();
				excel.setBakCount(0);
				excel.setBakPath(realPath + fileName + ".xls");
				String username = request.getSession().getAttribute("userName").toString();
				excel.setBakResource(username + " - " + pattern.format(new Date()) + " - 操作备份");
				excel.setCid(Long.parseLong(cid));
				excel.setCreateTime(System.currentTimeMillis());
				excelMapper.insertSelective(excel);
			} catch (Exception e) {
				e.printStackTrace();
			} finally {
				try {
					if(null != fout){
						fout.flush();
						fout.close();
					}
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return workbook;
	}
}
