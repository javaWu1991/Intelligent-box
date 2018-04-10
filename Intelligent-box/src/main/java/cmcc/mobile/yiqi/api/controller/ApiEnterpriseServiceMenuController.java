package cmcc.mobile.yiqi.api.controller;

/**
 * @author yangzhao
 * @time 2016/7/7
 */
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import cmcc.mobile.yiqi.entity.TAppEnterpriseServiceNumber;
import cmcc.mobile.yiqi.utils.JsonResult;
import cmcc.mobile.yiqi.web.service.IAppEnterpriseServiceNumberService;

@Controller
@RequestMapping("/menu")
public class ApiEnterpriseServiceMenuController extends ApiController {

	@Autowired
	private IAppEnterpriseServiceNumberService servicemessage;
 
	/**
    * 查询接口,传入参数父菜单的id，菜单级别，返回菜单数据
    * post传递
    * @param fMenu
    * @param level
    * @return
    */

	@RequestMapping(value = "/select/{fMenu}/{level}/{sid}", method = RequestMethod.GET)
	@ResponseBody            
	public JsonResult getMenu( @PathVariable Long fMenu, @PathVariable Long level, @PathVariable Long sid){
		
		List<TAppEnterpriseServiceNumber> servicemenu=servicemessage.selectByLevelKey(fMenu,level,sid);

		if(servicemenu!=null){
			return new JsonResult(true, "查询成功", servicemenu);
		}else
			return new JsonResult(true, "error", null);
		
	}
	
	
	@RequestMapping(value = "/find/{sid:\\d+}", method = RequestMethod.GET)
	@ResponseBody  
	public JsonResult getSid( @PathVariable Long sid){
		
		List<TAppEnterpriseServiceNumber> servicemenu=servicemessage.selectBySid(sid);

		if(servicemenu!=null){
			return new JsonResult(true, "查询成功", servicemenu);
		}else
			return new JsonResult(true, "error", null);
		
	}
}
