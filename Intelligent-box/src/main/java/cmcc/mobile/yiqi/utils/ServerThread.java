package cmcc.mobile.yiqi.utils;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.Socket;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map.Entry;

public class ServerThread extends Thread{
	private Socket client;
    private PrintWriter out;
    private  HashMap<String, Socket> clientList = new HashMap<>();

    public ServerThread(Socket socket,HashMap<String, Socket> socketList) throws IOException{
        super();
        client = socket;
        clientList = socketList;

        start();
    }

    @Override
    public void run(){
        Socket socket;
        System.out.println("Client: "+getName()+" come in...");

        //每当客户端连接上,就向相应的客户端进行回应
        Iterator<Entry<String, Socket>> entries = clientList.entrySet().iterator(); 
        while (entries.hasNext()){
        	Entry<String, Socket> entry = entries.next(); 
            System.out.println(entry.getKey());
            if (!String.valueOf(entry.getKey()).equals("")) {
                System.out.println(entry.getValue());
                System.out.println("-------------");
                socket = entry.getValue();
                if (socket!=null) {
                    try {
                        out = new PrintWriter(socket.getOutputStream());  //回复client的ID
                        out.println(entry.getKey());
                        out.flush();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }
}
