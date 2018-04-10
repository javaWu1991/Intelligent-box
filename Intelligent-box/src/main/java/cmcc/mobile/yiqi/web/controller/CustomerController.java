package cmcc.mobile.yiqi.web.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import cmcc.mobile.yiqi.base.BaseController;
import cmcc.mobile.yiqi.utils.JsonResult;
import cmcc.mobile.yiqi.vo.AppUserVo;
import cmcc.mobile.yiqi.web.service.IAppUserServices;

@Controller
@RequestMapping("/web/customer")
public class CustomerController extends BaseController {

	@Autowired
	private IAppUserServices appUserService;

	/**
	 * 新增客户经理信息
	 * 
	 * @param userVo
	 * @return
	 */
	@RequestMapping("/addCustomer")
	@ResponseBody
	public JsonResult addCustomer(AppUserVo userVo, HttpServletRequest request) {
		if (null != userVo) {
			return appUserService.insertSelective(userVo, true, request);
		}
		return new JsonResult(false, "参数错误！", null);
	}

	/**
	 * 获取客户经理
	 */
	@RequestMapping("/listCustomer")
	@ResponseBody
	public JsonResult listCustomer(AppUserVo userVo) {
		JsonResult result = appUserService.listCustomer(userVo);
		return result;
	}
}
