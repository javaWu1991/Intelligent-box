package cmcc.mobile.yiqi.api.controller;

import java.text.SimpleDateFormat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import cmcc.mobile.yiqi.entity.TAppGpsPosition;
import cmcc.mobile.yiqi.utils.JsonResult;
import cmcc.mobile.yiqi.web.service.IAppGpsPositionService;




@Controller
@RequestMapping("/gps")
public class ApiGpsPositionController {

	
	@Autowired 
	private IAppGpsPositionService  gpsPosition;
	
	SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	
	@RequestMapping(value = "/add", method = RequestMethod.POST)
	@ResponseBody            
	public JsonResult addPosition(TAppGpsPosition record ){
	    if(record.getTime()==null){
		record.setTime(df.format(System.currentTimeMillis()));
	    }
         int  gps=gpsPosition.addPosition(record);
         
 		if(gps!=0){
			return new JsonResult(true, "增加成功", gps);
		}else
			return new JsonResult(false, "error", null);
		
	}
	
	
	
}
