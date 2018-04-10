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

	    @SuppressWarnings("resource")
		public static void main(String[] args) throws UnknownHostException, IOException {
//	        try {
//	            ServerSocket server =  new ServerSocket(PORT);
//	            System.out.println("server is listenning...");
//	            while(true){//不断循环随时等待新的客户端接入服务器
//	                Socket clientSocket = server.accept();
//	                bufferedReader = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
//	                channelToken = bufferedReader.readLine();
//	                socketList.put(channelToken,clientSocket);   //保存会话ID和socket
//	                //System.out.println(socketList.get(channelToken));
//	                //System.out.println(socketList);
//	                new ServerThread(clientSocket,socketList);
//	            }
//	        } catch (IOException e) {
//	            e.printStackTrace();
//	        }
	    	  Socket socket = new Socket("localhost",PORT,InetAddress.getByName("127.0.0.1"),8001);
	    	  //2、获取输出流，向服务器端发送信息
	    	  OutputStream os = socket.getOutputStream();//字节输出流
	    	  PrintWriter pw =new PrintWriter(os);//将输出流包装成打印流
	    	  JSONObject object = new JSONObject() ;
	    	  object.put("machine_id", "1245676897") ;
	    	  object.put("container_number", "1234567890");
	    	  object.put("isOpen", true);
	    	  pw.write(object.toJSONString());
	    	  pw.flush();
	    	 socket.shutdownOutput();
	    	 //3、获取输入流，并读取服务器端的响应信息
	    	 InputStream is = socket.getInputStream();
	    	 BufferedReader br = new BufferedReader(new InputStreamReader(is));
	    	 String info = null;
	    	 info=br.readLine();
	    	 if(info!=null){
	    	  System.out.println("我是客户端，服务器说："+info);
	    	 }
//	    	 
//	    	 //4、关闭资源
//	    	 br.close();
//	    	 is.close();
//	    	 pw.close();
//	    	 os.close();
//	    	 socket.close();
	    }
	    
	    //向客户端发送消息
	    @SuppressWarnings("static-access")
		public void getMessage(JSONObject object) throws UnknownHostException, IOException{
	    	Socket socket = new Socket("localhost", 888,InetAddress.getByName("127.0.0.1"),8002) ;
	    	 //2、获取输出流，向服务器端发送信息
	    	  OutputStream os = socket.getOutputStream();//字节输出流
	    	  PrintWriter pw =new PrintWriter(os);//将输出流包装成打印流
	    	  object.put("machine_id", "1245676897") ;
	    	  object.put("container_number", "1234567890");
	    	  object.put("isOpen", true);
	    	  object.put("port", 80888);
	    	  pw.write(object.toJSONString());
	    	  pw.flush();
	    	 socket.shutdownOutput();
	    	 //3、获取输入流，并读取服务器端的响应信息
	    	 InputStream is = socket.getInputStream();
	    	 BufferedReader br = new BufferedReader(new InputStreamReader(is));
	    	 String info = null;
	    	 info=br.readLine();
    		 JSONObject obj = new JSONObject() ;
	    	 if(info!=null){
	    		 obj.parseObject(info) ;
	    		 
	    	 }
	    	 //4、关闭资源
	    	 br.close();
	    	 is.close();
	    	 pw.close();
	    	 os.close();
	    	 socket.close();	    	
	    	
	    }
}
