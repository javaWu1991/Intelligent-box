package cmcc.mobile.yiqi.utils;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.InetAddress;
import java.net.Socket;
import java.net.UnknownHostException;

import com.alibaba.fastjson.JSONObject;

public class SocketUtil {
	
	 private final static int PORT = 888;


	    
	    //向客户端发送消息
		public static void getMessage(JSONObject object){
	    	Socket socket;
			try {
				socket = new Socket("127.0.0.1", PORT);
				OutputStream os = socket.getOutputStream();//字节输出流
		  		byte[] byte1 = new byte[5];
				byte1[0] = (byte) 0xA5 ; 
				byte1[1] = 'S' ;
				byte1[2] = 0x00 ;
				byte[] byte2 = new byte[2];
				byte[] byte6 = new byte[4];
				byte6[0] = 'S' ;
				byte6[1] = 0x00 ;
				byte6[2] = (byte) ((byte)object.toJSONString().length()/256) ;
				byte6[3] = (byte) ((byte)object.toJSONString().length()%256) ;					
				byte[] byte5 = new byte[object.toJSONString().length()] ;
				byte5 = object.toJSONString().getBytes() ;
				byte[] byte7 = new byte[4+object.toJSONString().length()] ;
				System.arraycopy(byte6, 0, byte7, 0, byte6.length);
				System.arraycopy(byte5, 0, byte7, byte6.length, byte5.length);
				short rc = CRC16Util.crc16_short(byte7, 0, byte7.length) ;
				byte2 = SocketUtil.shortToByteArray(rc);
				byte[] byte8 = new byte[1] ;
				byte8[0] = 0x5A ;
				byte[] byte9 = new byte[3] ;
				System.arraycopy(byte2, 0, byte9, 0, byte2.length);
				System.arraycopy(byte8, 0, byte9, byte2.length, byte8.length);
				byte1[3] = (byte) ((byte)object.toJSONString().length()/256) ;
				byte1[4] = (byte) ((byte)object.toJSONString().length()%256) ;
				byte[] byte3 = new byte[object.toJSONString().length()] ;
				byte3 = object.toJSONString().getBytes() ;
				byte[] byte4 = new byte[8+object.toJSONString().length()] ;
				System.arraycopy(byte1, 0, byte4, 0, byte1.length);
				System.arraycopy(byte3, 0, byte4, byte1.length, byte3.length);
				System.arraycopy(byte9, 0, byte4, byte1.length + byte3.length, byte9.length);
				os.write(byte4);
				os.flush();
		    	socket.shutdownOutput();
		    	os.close();
		    	socket.close();
			} catch (UnknownHostException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}   	
	    }
	    
//	    public static void main(String[] args) {
//	    	  Socket socket;
//			try {
//				socket = new Socket("127.0.0.1",PORT);
//				  //2、获取输出流，向服务器端发送信息
//		    	  OutputStream os = socket.getOutputStream();//字节输出流
//		    	  PrintWriter pw =new PrintWriter(os);//将输出流包装成打印流
//		    	  JSONObject object = new JSONObject() ;
//		    	  object.put("cmd", "register") ;
//		    	  JSONObject jsonObject = new JSONObject() ;
//		    	  jsonObject.put("devno", "12312") ;
//		    	  object.put("data",jsonObject);
//		    	  
//		    	  pw.write(object.toJSONString()+'\n');
//		    	  pw.flush();
//		    	 socket.shutdownOutput();
//		    	 //3、获取输入流，并读取服务器端的响应信息
//		    	 InputStream is = socket.getInputStream();
//		    	 BufferedReader br = new BufferedReader(new InputStreamReader(is));
//		    	 String info = null;
//		    	 info=br.readLine();
//		    	 if(info!=null){
//		    	  System.out.println("我是客户端，服务器说："+info);
//		    	 }
//		    	 //4、关闭资源
//		    	 br.close();
//		    	 is.close();
//		    	 pw.close();
//		    	 os.close();
//		    	 socket.close();
//			} catch (UnknownHostException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			} catch (IOException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
//	    	
//	    }
	    
	    public static byte[] shortToByteArray(short s) {
			   byte[] shortBuf = new byte[2];
			   for(int i=0;i<2;i++) {
			      int offset = (shortBuf.length - 1 -i)*8;
			      shortBuf[i] = (byte)((s>>>offset)&0xff);
			   }
			   return shortBuf;
			  }
	    
	    public static byte[] deleteAt(byte[] bs, int index)
	    {
	        int length = bs.length - 1;
	        byte[] ret = new byte[length];
	         
	        if(index == bs.length - 1)
	        {
	            System.arraycopy(bs, 0, ret, 0, length);
	        }
	        else if(index < bs.length - 1)
	        {
	            for(int i = index; i < length; i++)
	            {
	                bs[i] = bs[i + 1];
	            }
	             
	            System.arraycopy(bs, 0, ret, 0, length);
	        }
	         
	        return ret;
	    }
}
