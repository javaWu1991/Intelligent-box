package cmcc.mobile.yiqi.api.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import cmcc.mobile.yiqi.base.Constants;
import cmcc.mobile.yiqi.base.ParamFormatTool;
import cmcc.mobile.yiqi.entity.TAppCompany;
import cmcc.mobile.yiqi.entity.dao.TAppCompanyMapper;
import cmcc.mobile.yiqi.utils.CheckoutUtil;
import cmcc.mobile.yiqi.utils.JsonResult;
import cmcc.mobile.yiqi.web.service.ICompanyService;

@Controller
@RequestMapping("company")
public class ApiCompanyController {
	@Autowired
	private ICompanyService companyServer;
	@Autowired
	private TAppCompanyMapper tAppCompanyMapper;

	/**
	 * APP注册企业
	 * 
	 * @param username
	 * @param account
	 * @param tAppCompany
	 * @param Tpassword
	 * @param Tname
	 * @return
	 * @throws IOException
	 */
	@RequestMapping(value = "/add", method = RequestMethod.POST)
	@ResponseBody
	public JsonResult addCompany(String username, String account, TAppCompany tAppCompany, String Tpassword, String Tname) throws IOException {

		if (!CheckoutUtil.checkOutParam(tAppCompany, new String[] { "name", "areaId", "adress" }, new Object[] { username, account })) {
			return CheckoutUtil.lackParam();
		}

		if (tAppCompanyMapper.getCountCompanyByCreator(account) > 0) {
			return new JsonResult(false, "该账号已创建过企业！", null);
		}
		String companyName = tAppCompany.getName();
		if (StringUtils.isEmpty(companyName) || companyName.length() > 60) {
			return new JsonResult(false, Constants.PARAMETERS_NOT_FORMAT, null);
		}
		if (account != null && !ParamFormatTool.isFormatPhoneNo(account)) {
			return new JsonResult(false, Constants.PARAMETERS_NOT_FORMAT, null);
		}
		Tname = username;
		companyServer.addCompany(account, tAppCompany, Tpassword, Tname);
		return new JsonResult(true, "新增成功", null);
	}

	/**
	 * 查询企业信息
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/queryById", method = RequestMethod.GET)
	public ModelAndView queryById(Long id) {
		ModelAndView view = new ModelAndView("h5/companyGeo");
		TAppCompany company = tAppCompanyMapper.selectByPrimaryKey(id);
		view.addObject("company", company);
		return view;
	}

	@RequestMapping(value = "/chart", method = RequestMethod.GET)
	public ModelAndView chart(Long id) {
		ModelAndView view = new ModelAndView("h5/orgChart");
		view.addObject("id", id);
		return view;
	}

	@RequestMapping(value = "/contact", method = RequestMethod.GET)
	public ModelAndView contact(Long id) {
		ModelAndView view = new ModelAndView("h5/companyContact");
		view.addObject("id", id);
		return view;
	}

}
