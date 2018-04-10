package cmcc.mobile.yiqi.utils;

import java.util.Random;

public class RandomNumUtil {
	 public static String genRandomNum(){
	        //35是因为数组是从0开始的，26个字母+10个数字
	        final int maxNum = 36;
	        int i; //生成的随机数
	        int count = 0; //生成的密码的长度
	        char[] str = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' };
	        StringBuffer pwd = new StringBuffer("");
	        Random r = new Random();
	        while(count < 19){
	         //生成随机数，取绝对值，防止生成负数，
	       
	         i = Math.abs(r.nextInt(maxNum)); //生成的数最大为36-1
	       
	         if (i >= 0 && i < str.length) {
	          pwd.append(str[i]);
	          count ++;
	         }
	        }
	        String time = String.valueOf(System.currentTimeMillis()) ;
	        return time+pwd.toString();
	     }
	 public static String getStringRandom(){  
		 String val = "";  
	        Random random = new Random();  
	          
	        //参数length，表示生成几位随机数  
	        for(int i = 0; i < 32; i++) {  
	              
	            String charOrNum = random.nextInt(2) % 2 == 0 ? "char" : "num";  
	            //输出字母还是数字  
	            if( "char".equalsIgnoreCase(charOrNum) ) {  
	                //输出是大写字母还是小写字母  
	                int temp = random.nextInt(2) % 2 == 0 ? 65 : 97;  
	                val += (char)(random.nextInt(26) + temp);  
	            } else if( "num".equalsIgnoreCase(charOrNum) ) {  
	                val += String.valueOf(random.nextInt(10));  
	            }  
	        }  
	        return val;  
		}  
	  public static void main(String[] args) {
	      System.out.println(getStringRandom());
	     
	    }  
}
