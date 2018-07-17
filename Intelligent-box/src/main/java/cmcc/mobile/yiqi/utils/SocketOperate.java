package cmcc.mobile.yiqi.utils;
import java.io.BufferedWriter;
import java.io.IOException; 
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.Socket;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import com.alibaba.fastjson.JSONObject;
import com.sun.org.apache.regexp.internal.recompile;

import cmcc.mobile.yiqi.web.service.IntelligentBoxService;
import cmcc.mobile.yiqi.web.service.impl.WeixinPayServiceImpl; 


/** 
* 多线程处理socket接收的数据 
* @author 吴奔江
* 
*/ 
public class SocketOperate extends Thread{ 
	private static final Logger logger = LoggerFactory.getLogger(SocketOperate.class);
	private Socket socket; 
	public static Map<String, Socket> list = new HashMap<String,Socket>() ;
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
					byte[] temp = new byte[1024]; 
					int length = 0; 	
					while((length = in.read(temp)) != -1){ 
						break; 
					} 
					//Byte start = 
					if(temp[0]==-91&&temp[length-1]==90&&temp[1]==83&&temp[2]==0){
						for(int i=0;i<5;i++){
							deleteAt(temp, 0) ;
						}
						deleteAt(temp, length-6) ;
						deleteAt(temp, length-7) ;
					}
					String str ="" ;
					str += new String(temp,0,length-8); 
					JSONObject object = new JSONObject();
					JSONObject jsonObject = object.parseObject(str) ;
					JSONObject cmd = new JSONObject() ;
					byte[] byte1 = new byte[5];
					byte1[0] = (byte) 0xA5 ; 
					byte1[1] = 'S' ;
					byte1[2] = 0x00 ;
					byte[] byte2 = new byte[2];
								
					//客户端注册到服务端
					if(jsonObject.getString("cmd").equals("register")){
						logger.info("我是服务端，客户端说："+jsonObject);
						JSONObject json = object.parseObject(jsonObject.getString("data")) ;
						list.put(json.getString("devno"), socket) ;
						boxService.insertMachindeRegister(json) ;						
						cmd.put("cmd", "register") ;
						JSONObject data = new JSONObject() ;
						data.put("rescode", 0) ;
						data.put("resmsg", "ok");
						cmd.put("data", data) ;
						byte[] byte4 = getByte(cmd, byte1, byte2) ;
 						OutputStream  out= socket.getOutputStream(); 
 						out.write(byte4);
						out.flush();
					}
					//向客户端发送升级指令
					if(jsonObject.getString("cmd").equals("upgrade")){
						logger.info("我是服务端，客户端说："+jsonObject);
						JSONObject json = object.parseObject(jsonObject.getString("data")) ;
						boxService.insertMachindeRegister(json) ;						
						cmd.put("cmd", "upgrade") ;
						JSONObject data = new JSONObject() ;
						data.put("rescode", 0) ;
						data.put("resmsg", "ok");
						cmd.put("data", data) ;
						byte[] byte4 = getByte(cmd, byte1, byte2) ;
 						OutputStream  out= socket.getOutputStream(); 
 						out.write(byte4);
						out.flush();
					}
					//客户端上传升级结果
					if(jsonObject.getString("cmd").equals("upgrade")&&jsonObject.getString("src")!=null&&jsonObject.getString("src").equals("box")){
						logger.info("接收到升级反馈的结果"+jsonObject);
						JSONObject json = object.parseObject(jsonObject.getString("data")) ;	
						//进行开门状态入库
						boxService.updateDoor(json) ;
					}
					//心跳服务用于保证链接正常
					if(jsonObject.getString("cmd").equals("heartbeat")){
						logger.info("我是服务端，客户端说："+jsonObject);
						JSONObject json = object.parseObject(jsonObject.getString("data")) ;
						logger.info("解析参数："+json);
						//收到心跳进行入库
						boxService.insertHeartbeat(json);
						cmd.put("cmd", "heartbeat") ; 
						JSONObject data = new JSONObject() ;
						data.put("rescode", 0) ;
						data.put("resmsg", "ok");
						cmd.put("data", data) ;
						byte[] byte4 = getByte(cmd, byte1, byte2) ;
 						OutputStream  out= socket.getOutputStream(); 
 						out.write(byte4);
						out.flush();
					}
					//参数设置
//					if(jsonObject.getString("cmd").equals("config")){
//						logger.info("我是服务端，客户端说："+jsonObject);
//						JSONObject json = object.parseObject(jsonObject.getString("data")) ;	
//						if(json.getString("devno")!=null&&json.getString("company")!=null){
//						list.put(json.getString("company"), socket) ;	
//						byte[] byte6 = new byte[4];
//						byte6[0] = 'S' ;
//						byte6[1] = 0x00 ;
//						byte6[2] = (byte) ((byte)jsonObject.toJSONString().length()/256) ;
//						byte6[3] = (byte) ((byte)jsonObject.toJSONString().length()%256) ;					
//						byte[] byte5 = new byte[jsonObject.toJSONString().length()] ;
//						byte5 = jsonObject.toJSONString().getBytes() ;
//						byte[] byte7 = new byte[4+cmd.toJSONString().length()] ;
//						System.arraycopy(byte6, 0, byte7, 0, byte6.length);
//						System.arraycopy(byte5, 0, byte7, byte6.length, byte5.length);
//						short rc = CRC16Util.crc16_short(byte7, 0, byte7.length) ;
//						byte2 = SocketUtil.shortToByteArray(rc);
//						byte[] byte8 = new byte[1] ;
//						byte8[0] = 0x5A ;
//						byte[] byte9 = new byte[3] ;
//						System.arraycopy(byte2, 0, byte9, 0, byte2.length);
//						System.arraycopy(byte8, 0, byte9, byte2.length, byte8.length);
//						byte1[3] = (byte) ((byte)jsonObject.toJSONString().length()/256) ;
//						byte1[4] = (byte) ((byte)jsonObject.toJSONString().length()%256) ;
//						byte[] byte3 = new byte[jsonObject.toJSONString().length()] ;
//						byte3 = cmd.toJSONString().getBytes() ;
//						byte[] byte4 = new byte[8+jsonObject.toJSONString().length()] ;
//						System.arraycopy(byte1, 0, byte4, 0, byte1.length);
//						System.arraycopy(byte3, 0, byte4, byte1.length, byte3.length);
//						System.arraycopy(byte9, 0, byte4, byte1.length + byte3.length, byte9.length);
// 						OutputStream  out= list.get(json.getString("devno")).getOutputStream();  
// 						out.write(byte4);
//						out.flush();
//						}else{
//							BufferedWriter  out=new BufferedWriter(new OutputStreamWriter(list.get(json.getString("company")).getOutputStream())); 
//							out.write(jsonObject.toJSONString());
//							out.flush();
//						}
//					}
					//告诉服务端开门
					if(jsonObject.getString("cmd").equals("open_door")){
						jsonObject.put("cmd", "door_open") ;
						logger.info("我是服务端，客户端说："+jsonObject);
						JSONObject json = object.parseObject(jsonObject.getString("data")) ;	
						byte[] byte4 = getByte(jsonObject, byte1, byte2) ;
 						OutputStream  out= list.get(json.getString("devno")).getOutputStream();  
 						out.write(byte4);
						out.flush();
						logger.info("下发开门指令成功："+jsonObject);
					}
					//服务端接收开门结果
					if(jsonObject.getString("cmd").equals("door_open")&&jsonObject.getString("src")!=null&&jsonObject.getString("src").equals("box")){
						logger.info("接收到开门反馈的结果"+jsonObject);
						JSONObject json = object.parseObject(jsonObject.getString("data")) ;	
						//进行开门状态入库
						boxService.updateDoor(json) ;
						System.out.println(json);
					}
				} 

			}catch(IOException ex){ 
				ex.printStackTrace();

			}finally{ 
				try {
					socket.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			} 
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
		   
		   public static byte[] getByte(JSONObject cmd,byte[] byte1,byte[] byte2){
			   byte[] byte6 = new byte[4];
				byte6[0] = 'S' ;
				byte6[1] = 0x00 ;
				byte6[2] = (byte) ((byte)cmd.toJSONString().length()/256) ;
				byte6[3] = (byte) ((byte)cmd.toJSONString().length()%256) ;					
				byte[] byte5 = new byte[cmd.toJSONString().length()] ;
				byte5 = cmd.toJSONString().getBytes() ;
				byte[] byte7 = new byte[4+cmd.toJSONString().length()] ;
				System.arraycopy(byte6, 0, byte7, 0, byte6.length);
				System.arraycopy(byte5, 0, byte7, byte6.length, byte5.length);
				short rc = CRC16Util.crc16_short(byte7, 0, byte7.length) ;
				byte2 = SocketUtil.shortToByteArray(rc);
				byte[] byte8 = new byte[1] ;
				byte8[0] = 0x5A ;
				byte[] byte9 = new byte[3] ;
				System.arraycopy(byte2, 0, byte9, 0, byte2.length);
				System.arraycopy(byte8, 0, byte9, byte2.length, byte8.length);
				byte1[3] = (byte) ((byte)cmd.toJSONString().length()/256) ;
				byte1[4] = (byte) ((byte)cmd.toJSONString().length()%256) ;
				byte[] byte3 = new byte[cmd.toJSONString().length()] ;
				byte3 = cmd.toJSONString().getBytes() ;
				byte[] byte4 = new byte[8+cmd.toJSONString().length()] ;
				System.arraycopy(byte1, 0, byte4, 0, byte1.length);
				System.arraycopy(byte3, 0, byte4, byte1.length, byte3.length);
				System.arraycopy(byte9, 0, byte4, byte1.length + byte3.length, byte9.length);
				return byte4;
		   }
	}