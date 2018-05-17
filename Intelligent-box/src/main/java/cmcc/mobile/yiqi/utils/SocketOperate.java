package cmcc.mobile.yiqi.utils;
import java.io.BufferedWriter;
import java.io.IOException; 
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.net.Socket;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSONObject;
import cmcc.mobile.yiqi.entity.dao.IntelligentBoxMapper;
import cmcc.mobile.yiqi.web.service.IntelligentBoxService; 


/** 
* 多线程处理socket接收的数据 
* @author 吴奔江
* 
*/ 
public class SocketOperate extends Thread{ 
	
	private Socket socket; 
	private Map<String, Socket> list = new HashMap<String,Socket>() ;
	ApplicationContext applicationContext = ApplicationContextHelper.getApplicationContext();
	IntelligentBoxService boxService = (IntelligentBoxService) applicationContext.getBean("BoxService") ;
		public SocketOperate(Socket socket) { 
			this.socket=socket; 
		} 
		@SuppressWarnings("static-access") 
		public void run() { 
			try{ 

				InputStream in= socket.getInputStream(); 
				while(true){ 
					//读取客户端发送的信息 
					String strXML = ""; 
					byte[] temp = new byte[1024]; 
					int length = 0; 			
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
					JSONObject cmd = new JSONObject() ;
					//客户端注册到服务端
					if(jsonObject.getString("cmd").equals("register")){
						System.out.println("我是服务端，客户端说："+jsonObject);
						JSONObject json = object.parseObject(jsonObject.getString("data")) ;
						list.put(json.getString("devno"), socket) ;
						boxService.insertMachindeRegister(json.getString("devno")) ;						
						cmd.put("cmd", "register") ;
						JSONObject data = new JSONObject() ;
						data.put("rescode", 0) ;
						data.put("resmsg", "ok");
						cmd.put("data", data) ;
						BufferedWriter  out=new BufferedWriter(new OutputStreamWriter(socket.getOutputStream())); 
						out.write(cmd.toJSONString()+'\n');
						out.flush();
					}
					//心跳服务用于保证链接正常
					if(jsonObject.getString("cmd").equals("heartbeat")){
						System.out.println("我是服务端，客户端说："+jsonObject);
						JSONObject json = object.parseObject(jsonObject.getString("data")) ;
						list.put(json.getString("devno"), socket) ;
						//intelligentBoxMapper.insertMachindeRegister(json.getString("devno")) ;
						cmd.put("cmd", "heartbeat") ; 
						JSONObject data = new JSONObject() ;
						data.put("rescode", 0) ;
						data.put("resmsg", "ok");
						cmd.put("data", data) ;
						BufferedWriter  out=new BufferedWriter(new OutputStreamWriter(socket.getOutputStream())); 
						out.write(cmd.toJSONString()+'\n');
						out.flush();
					}
					//参数设置
					if(jsonObject.getString("cmd").equals("config")){
						System.out.println("我是服务端，客户端说："+jsonObject);
						JSONObject json = object.parseObject(jsonObject.getString("data")) ;	
						if(json.getString("devno")!=null&&json.getString("company")!=null){
						list.put(json.getString("company"), socket) ;	
						BufferedWriter  out=new BufferedWriter(new OutputStreamWriter(list.get(json.getString("devno")).getOutputStream())); 
						out.write(jsonObject.toJSONString()+'\n');
						out.flush();
						}else{
							BufferedWriter  out=new BufferedWriter(new OutputStreamWriter(list.get(json.getString("company")).getOutputStream())); 
							out.write(jsonObject.toJSONString()+'\n');
							out.flush();
						}
					}
					//开门
					if(jsonObject.getString("cmd").equals("open_door")){
						System.out.println("我是服务端，客户端说："+jsonObject);
						JSONObject json = object.parseObject(jsonObject.getString("data")) ;	
						if(json.getString("devno")!=null&&json.getString("company")!=null){
						list.put(json.getString("company"), socket) ;	
						BufferedWriter  out=new BufferedWriter(new OutputStreamWriter(list.get(json.getString("devno")).getOutputStream())); 
						out.write(jsonObject.toJSONString()+'\n');
						out.flush();
						}else{
							BufferedWriter  out=new BufferedWriter(new OutputStreamWriter(list.get(json.getString("company")).getOutputStream())); 
							out.write(jsonObject.toJSONString()+'\n');
							out.flush();
						}
					}
					
				} 
				socket.close(); 
				System.out.println("socket stop....."); 

			}catch(IOException ex){ 

			}finally{ 

			} 
		} 
	}