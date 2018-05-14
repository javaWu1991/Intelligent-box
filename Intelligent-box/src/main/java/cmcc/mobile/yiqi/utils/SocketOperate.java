package cmcc.mobile.yiqi.utils;
import java.io.IOException; 
import java.io.InputStream;
import java.io.PrintWriter; 
import java.net.Socket;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSONObject;

import cmcc.mobile.yiqi.entity.dao.IntelligentBoxMapper; 


/** 
* 多线程处理socket接收的数据 
* @author 吴奔江
* 
*/ 
public class SocketOperate extends Thread{ 
	
	private Socket socket; 
	private List<Socket> list = new ArrayList<Socket>() ;
	@Autowired
	private IntelligentBoxMapper intelligentBoxMapper ;
		public SocketOperate(Socket socket) { 
			this.socket=socket; 
		} 
		@SuppressWarnings("static-access") 
		public void run() { 
			try{ 

				InputStream in= socket.getInputStream(); 

				PrintWriter out=new PrintWriter(socket.getOutputStream()); 


				while(true){ 
					//读取客户端发送的信息 
					String strXML = ""; 
					byte[] temp = new byte[1024]; 
					int length = 0; 			
					list.add(socket) ;
					while((length = in.read(temp)) != -1){ 
						strXML += new String(temp,0,length); 
					} 
					if("end".equals(strXML)){ 
						System.out.println("准备关闭socket"); 
						break; 
					} 
					if("".equals(strXML)) 
						continue; 
					JSONObject object = new JSONObject();
					JSONObject jsonObject = object.parseObject(strXML) ;
					if(jsonObject.getInteger("port")==null){
						jsonObject.put("port", socket.getPort()) ;
						intelligentBoxMapper.insertSocket(jsonObject);
					}else{
					for(Socket socket : list){
						if(socket.getPort()==object.getIntValue("port")){
							PrintWriter out1=new PrintWriter(socket.getOutputStream()); 
							out1.println(strXML);
						}
					}
					}
					out.flush(); 
					out.close(); 
				} 
				socket.close(); 
				System.out.println("socket stop....."); 

			}catch(IOException ex){ 

			}finally{ 

			} 
		} 
	}