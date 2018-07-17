package cmcc.mobile.yiqi.utils;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Random;

public class RandomUtil {
    private static byte[] lock = new byte[0];  
	  
    // 位数，默认是8位  
    private final static long w = 1000;  
	// 可以将字符转换赋值给int类型，查看其ASCII码
	public static void main(String[] args) {

		// 生成数字字母
		for (int i = 0; i < 1; i++)
			System.out.println(createRandomCharData(6));
	}

	// 根据指定长度生成字母和数字的随机数
	// 0~9的ASCII为48~57
	// A~Z的ASCII为65~90
	// a~z的ASCII为97~122
	public static String createRandomCharData(int length) {
		StringBuilder sb = new StringBuilder();
		Random rand = new Random();// 随机用以下三个随机生成器
		Random randdata = new Random();
		int data = 0;
		for (int i = 0; i < length; i++) {
			int index = rand.nextInt(3);
			// 目的是随机选择生成数字，大小写字母
			switch (index) {
			case 0:
				data = randdata.nextInt(10);// 仅仅会生成0~9
				sb.append(data);
				break;
			case 1:
				data = randdata.nextInt(26) + 65;// 保证只会产生65~90之间的整数
				sb.append((char) data);
				break;
			case 2:
				data = randdata.nextInt(26) + 97;// 保证只会产生97~122之间的整数
				sb.append((char) data);
				break;
			}
		}
		String result = sb.toString();
		return result.toUpperCase();
	}

	// 根据指定长度生成纯数字的随机数
	public static String createData(int length) {
		StringBuilder sb = new StringBuilder();
		Random rand = new Random();
		for (int i = 0; i < length; i++) {
			sb.append(rand.nextInt(10));
		}
		String data = sb.toString();
		return data;
	}

	public static String MD5(String sourceStr) {
		String result = "";
		try {
			MessageDigest md = MessageDigest.getInstance("MD5");
			md.update(sourceStr.getBytes());
			byte b[] = md.digest();
			int i;
			StringBuffer buf = new StringBuffer("");
			for (int offset = 0; offset < b.length; offset++) {
				i = b[offset];
				if (i < 0)
					i += 256;
				if (i < 16)
					buf.append("0");
				buf.append(Integer.toHexString(i));
			}
			result = buf.toString();
		} catch (NoSuchAlgorithmException e) {
			System.out.println(e);
		}
		return result;
	}
	
	  
	    public static String createID() {  
	        long r = 0;  
	        synchronized (lock) {  
	            r = (long) ((Math.random() + 1) * w);  
	        }  
	  
	        return System.currentTimeMillis() + String.valueOf(r).substring(1);  
	    }  
}