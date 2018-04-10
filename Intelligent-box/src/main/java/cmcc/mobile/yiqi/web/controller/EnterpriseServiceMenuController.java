package cmcc.mobile.yiqi.web.controller;

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
@RequestMapping("fmenu")
public class EnterpriseServiceMenuController {

	@Autowired
	private IAppEnterpriseServiceNumberService servicemessage;
	
	
	/**
	 * 根据父菜单的ID查询结果，并返回
	 * @param fMenu
	 * @return
	 */
	@RequestMapping(value = "/select/{fMenu:\\d+}/{sid:\\d+}", method = RequestMethod.GET)
	@ResponseBody            
	public JsonResult getfMenu( @PathVariable Long fMenu,@PathVariable Long sid){
		
		List<TAppEnterpriseServiceNumber> servicemenu=servicemessage.selectByFMenuKey(fMenu, sid);

		if(servicemenu!=null){
			return new JsonResult(true, "查询成功", servicemenu);
		}else
			return new JsonResult(true, "error", null);
		
	}
	
	/*
	 * 根据菜单所处的等级进行查询
	 * 
	 */
	
	@RequestMapping(value = "/find/{level:\\d+}/{sid:\\d+}", method = RequestMethod.GET)
	@ResponseBody            
	public JsonResult getLevel( @PathVariable Long level, @PathVariable Long sid){
		
		List<TAppEnterpriseServiceNumber> servicemenu=servicemessage.selectByInnLevelKey(level, sid);

		if(servicemenu!=null){
			return new JsonResult(true, "查询成功", servicemenu);
		}else
			return new JsonResult(true, "error", null);		
	}
	
	/**
	 * 插入数据，post的方法
	 * @param record
	 * @return
	 */
	@RequestMapping(value = "/insert", method = RequestMethod.POST)
	@ResponseBody            
	public JsonResult insertMenu(TAppEnterpriseServiceNumber record){
		int serviceinsert=0;
	     serviceinsert=servicemessage.insert(record);
          if(serviceinsert!=0){
			return new JsonResult(true, "插入成功", serviceinsert);
          }else{
        	  
  			return new JsonResult(true, "插入数据错误", serviceinsert);

          }
		
	}
	/*
	 * 更新数据
	 */
	@RequestMapping(value = "/update", method = RequestMethod.POST)
	@ResponseBody            
	public JsonResult updateMenu(TAppEnterpriseServiceNumber record){
		int  serviceupdate=0;
	  serviceupdate=servicemessage.updateByPrimaryKey(record);

		if(serviceupdate!=0){
			return new JsonResult(true, "更新成功", serviceupdate);
		}else{
			return new JsonResult(true, "更新数据错误", serviceupdate);

		}
		
	}
	/*
	 * 删除数据，根据菜单的id进行删除
	 */
	@RequestMapping(value = "/delete/{id:\\d+}", method = RequestMethod.GET)
	@ResponseBody            
	public JsonResult deleteMenu(@PathVariable Long id){
		
	   int  deleteNumber=servicemessage.deleteBylevelKey(id);

	   if(deleteNumber==1){
			return new JsonResult(true, "删除成功", deleteNumber);
		}else{
			return new JsonResult(true, "删除数据失败", deleteNumber);

		}
	}
	
	/*
	 * 删除数据，根据菜单的id进行删除POST方法
	 */
	@RequestMapping(value = "/delete", method = RequestMethod.POST)
	@ResponseBody            
	public JsonResult deleteMenus( Long id){
		
	   int  deleteNumber=servicemessage.deleteBylevelKey(id);

	   if(deleteNumber==1){
			return new JsonResult(true, "删除成功", deleteNumber);
		}else{
			return new JsonResult(true, "删除数据失败", deleteNumber);

		}
	}
}
