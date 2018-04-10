package cmcc.mobile.yiqi.base;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
/**
 * @Describe:参数格式判断工具
 */
public class ParamFormatTool {

	/**
	 * 判断手机号码的格式是否正确
	 */
	public static boolean isFormatPhoneNo(String phoneNo) {
		if (phoneNo != null && phoneNo.startsWith("1") && phoneNo.length() == 11) {
			Pattern pattern = Pattern.compile("^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$");
			Matcher matcher = pattern.matcher(phoneNo);
			return matcher.matches();
		} else {
			return false;
		}
	}

	/**
	 * 判断用户姓名的格式是否正确
	 */
	public static boolean isFormatUserName(String userName) {
		if (userName != null && userName.length() != 0) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * 判断用户身份证的格式是否正确
	 */
	public static boolean isFormatIdCard(String idCard) {
		if (idCard != null && (idCard.length() == 18 || idCard.length() == 15)) {
			if (idCard.length()==15){
				Pattern pattern = Pattern.compile("[\\d]{15}");
				Matcher matcher = pattern.matcher(idCard);
				return matcher.matches();
			}else{
				Pattern pattern = Pattern.compile("[\\d]{17}[\\d|X]");
				Matcher matcher = pattern.matcher(idCard);
				return matcher.matches();
			}
		} else {
			return false;
		}
	}

	/**
	 * 判断地址的格式是否正确
	 */
	public static boolean isFormatAddress(String address) {
		if (address == null) {
			return false;
		} else {
			//[\\w|[\\u4E00-\\u9FA5]]*?省[\\w|[\u4E00-\u9FA5]]*?市[\\w|[\u4E00-\u9FA5]]*?[县|区][\\w|[\u4E00-\u9FA5]]*?路[\\w|[\u4E00-\u9FA5]]*
			Pattern p = Pattern.compile("[\\w|[\u4E00-\u9FA5]]*?市[\\w|[\u4E00-\u9FA5]]*?[县|区][\\w|[\u4E00-\u9FA5]]*", Pattern.CASE_INSENSITIVE);
			Matcher m = p.matcher(address);
			return m.find();
		}
	}
	
	/**
	 * 判断姓名列表的格式是否正确
	 */
	public static boolean isFormatNameList(List<String> nameList) {
		if (nameList == null||nameList.size()==0) {
			return false;
		} else {
			for(String name : nameList){
				if(name==null||name.equals("")){
					return false;
				}
			}
			return true;
		}
	}
	
	/**
	 * 判断地址坐标的格式是否正确
	 * 验证规则比较简单，有待优化
	 */
	public static boolean isFormatAddrCoordinate(String coordinate) {
		Pattern pattern = Pattern.compile("[\\d]+[.][\\d]{1,6}[,][\\d]+[.][\\d]{1,6}");
		Matcher matcher = pattern.matcher(coordinate);
		return matcher.matches();
	}
	
	/**
	 * 判断日期格式是否为yyyyMMdd
	 * @param args
	 */
	public static boolean isYYYYMMDD(String date){
		Pattern pattern = Pattern.compile("[\\d]{4}([0][1-9]|[1][0-2])([0][1-9]|[1-2][\\d]|[3][0-1])");
		Matcher matcher = pattern.matcher(date);
		return matcher.matches();
	}
	
	/**
	 * 判断日期格式是否为yyyy-MM-dd HH:mm:ss
	 * @param args
	 */
	public static boolean isYYYY_MM_DD_HH_MM_SS(String date){
		Pattern pattern = Pattern.compile("[\\d]{4}-([0][1-9]|[1][0-2])-([0][1-9]|[1-2][\\d]|[3][0-1]) (([0-1][0-9])|2[0-3]):[0-5][0-9]:[0-5][0-9]");
		Matcher matcher = pattern.matcher(date);
		return matcher.matches();
	}
	
	/**
	 * 判断日期格式是否为yyyy-MM-dd
	 * @param args
	 */
	public static boolean isYYYY_MM_DD(String date){
		Pattern pattern = Pattern.compile("[\\d]{4}-([0][1-9]|[1][0-2])-([0][1-9]|[1-2][\\d]|[3][0-1])");
		Matcher matcher = pattern.matcher(date);
		return matcher.matches();
	}
	
	/**
	 * 判断日期格式是否为yyyy-MM
	 * @param args
	 */
	public static boolean isYYYY_MM(String date){
		Pattern pattern = Pattern.compile("[\\d]{4}-([0][1-9]|[1][0-2])");
		Matcher matcher = pattern.matcher(date);
		return matcher.matches();
	}
	
	/**
	 * 判断日期格式是否为yyyy
	 * @param args
	 */
	public static boolean isYYYY(String date){
		Pattern pattern = Pattern.compile("[\\d]{4}");
		Matcher matcher = pattern.matcher(date);
		return matcher.matches();
	}
	
	/**
	 * 判断日期格式是否为yyyyMMddhhmmss,
	 * 并非完全准确，比如2月20号，输出为true
	 * @param args
	 */
	public static boolean isYYYYMMDDHHMISS(String date){
		Pattern pattern = Pattern.compile("[\\d]{4}([0][1-9]|[1][0-2])([0][1-9]|[1-2][\\d]|[3][0-1])([0-1][\\d]|[2][0-3])([0-5][\\d])([0-5][\\d])");
		Matcher matcher = pattern.matcher(date);
		return matcher.matches();
	}

	public static void main(String args[]) {
		//System.out.println(isFormatAddress("浙江省杭州市西湖区环城北路杭州大酒店"));
/*		List<String> nameList = new ArrayList<String>();
		nameList.add("jack");
		System.out.println(nameList.size());
		System.out.println(isFormatNameList(nameList));*/
		//Scanner sc = new Scanner(System.in);
		//String input = sc.next();
		//System.out.println(isYYYYMMDD(input));
		String input = "2015-12-31 00:12:26";
		System.out.println(isYYYY_MM_DD_HH_MM_SS(input));
		
	}
}
