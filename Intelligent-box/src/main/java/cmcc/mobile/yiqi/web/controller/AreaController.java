package cmcc.mobile.yiqi.web.controller;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import cmcc.mobile.yiqi.base.BaseController;
import cmcc.mobile.yiqi.entity.TAppArea;
import cmcc.mobile.yiqi.entity.dao.TAppAreaMapper;
import cmcc.mobile.yiqi.utils.JsonResult;

/**
 * 
 * @author wubj
 *
 */
@Controller
@RequestMapping("/web/city")
public class AreaController extends BaseController {
	@Autowired
	TAppAreaMapper tAppAreaMapper;
	
	/**
	 * 新增省市区
	 */
	@RequestMapping("/addcity")
	@ResponseBody
	public JsonResult addcity(String name, int parent_id, int level) {
		if (StringUtils.isNotEmpty(name) && StringUtils.isNotEmpty(Integer.toString(level))) {
			TAppArea appArea = new TAppArea();
			appArea.setLevel(level);
			appArea.setName(name);
			appArea.setParent_id(parent_id);
			int count = tAppAreaMapper.selectAreaCount(appArea) ;
			if(count!=0){
				return new JsonResult(false, "该区域已经存在", null);
			}
			tAppAreaMapper.insertSelective(appArea);
		} else {
			return new JsonResult(false, "参数错误", null);
		}
		return new JsonResult(true, "新增成功", null);
	}

	/**
	 * 修改省市区
	 */
	@RequestMapping("/editcity")
	@ResponseBody
	public JsonResult editcity(TAppArea appArea) {
		if ( null != appArea.getId() && StringUtils.isNotEmpty(appArea.getName())) {
			tAppAreaMapper.updateByPrimaryKeySelective(appArea);
		} else {
			return new JsonResult(false, "参数错误", null);
		}

		return new JsonResult(true, "修改成功", null);
	}

	/**
	 * 删除省市区
	 */
	@RequestMapping("/deletecity")
	@ResponseBody
	public JsonResult deletecity(Long id) {
		Long did = id ;
		tAppAreaMapper.deletecity(did) ;
		return new JsonResult(true, "删除成功", null);
	}

	/**
	 * 省市区三级联动
	 */
	@RequestMapping("/arealist")
	@ResponseBody
	public JsonResult arealist(Integer id) {
		if (null != id && StringUtils.isNotEmpty(id.toString())) {
			List<TAppArea> tAppArea = tAppAreaMapper.selectParent(id);
			return new JsonResult(true, "查询成功", tAppArea);
		} else {
			return new JsonResult(false, "参数错误", null);
		}

	}

	/**
	 * 省市区list
	 */
	@RequestMapping("/areaview")
	@ResponseBody
	public JsonResult areaview(Integer level) {
		// 获取省
		List<TAppArea> list = tAppAreaMapper.selectarea(level);

		return new JsonResult(true, "查询成功", list);

	}

	/**
	 * 省市区页面
	 */
	@RequestMapping("/area")
	public ModelAndView area(Integer level) {
		ModelAndView view = new ModelAndView("common/area");
		// 省
		List<TAppArea> list = tAppAreaMapper.selectarea(level);
		view.addObject("apparea", list);

		return view;
	}


	/**
	 * 区域管理员页面
	 */
	@RequestMapping("/areaAdmin")
	public ModelAndView areaadmin(String cid) {
		ModelAndView view = new ModelAndView("system/areaAdmin");
		return view;
	}


}
