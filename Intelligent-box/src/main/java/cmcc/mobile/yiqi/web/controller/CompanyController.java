package cmcc.mobile.yiqi.web.controller;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.github.pagehelper.PageInfo;

import cmcc.mobile.yiqi.api.controller.ApiController;
import cmcc.mobile.yiqi.base.Constants;
import cmcc.mobile.yiqi.base.ParamFormatTool;
import cmcc.mobile.yiqi.entity.TAppCompany;
import cmcc.mobile.yiqi.entity.TAppUser;
import cmcc.mobile.yiqi.entity.dao.TAppUserCompanyMapper;
import cmcc.mobile.yiqi.entity.dao.TAppUserMapper;
import cmcc.mobile.yiqi.utils.CheckoutUtil;
import cmcc.mobile.yiqi.utils.FileUpload;
import cmcc.mobile.yiqi.utils.JsonResult;
import cmcc.mobile.yiqi.vo.PageVo;
import cmcc.mobile.yiqi.web.service.IAppUserServices;
import cmcc.mobile.yiqi.web.service.ICompanyService;

/**
 * 
 * @author zzw
 */

@Controller
@RequestMapping("/web/company")
public class CompanyController extends ApiController {

	private static Logger logger = Logger.getLogger(CompanyController.class);
	@Autowired
	private ICompanyService companyServer;
	@Autowired
	private TAppUserCompanyMapper tAppUserCompanyMapper;
	@Autowired
	private TAppUserMapper tAppUserMapper;
	@Autowired
	private IAppUserServices userServices;

	@RequestMapping("getByAreaId")
	@ResponseBody
	public JsonResult getByAreaId(Integer areaId) {
		return new JsonResult(true, "", companyServer.selectCompanyByAreaId(areaId));

	}

	@RequestMapping(value = "getCountPeople", method = RequestMethod.GET)
	@ResponseBody
	public JsonResult getCountPeopleByCid(Long cid) {
		return new JsonResult(true, "", userServices.getCountPeopleByCid(cid));

	}

	@RequestMapping(value = "/addCompany", method = RequestMethod.POST)
	@ResponseBody
	public JsonResult addCompany(@RequestParam(value = "logoFile", required = false) MultipartFile file, HttpServletRequest httpServletRequest,
			String account, TAppCompany tAppCompany, String Tpassword, String Tname) throws IOException {
		// Long sessionUserId =
		// Long.valueOf(httpServletRequest.getSession().getAttribute("userId").toString());
		String companyName = tAppCompany.getName();
		if (StringUtils.isEmpty(companyName) || companyName.length() > 60) {
			logger.error("传参出错");
			return new JsonResult(false, Constants.PARAMETERS_NOT_FORMAT, null);
		}
		if (file != null && !file.isEmpty()) {
			if (!CheckoutUtil.checkOutType(file, CheckoutUtil.LOGOTYPE)) {
				return new JsonResult(false, Constants.PARAMETERS_NOT_FORMAT, null);
			}
			String img = FileUpload.uploadFile(file, "companyLogo");
			tAppCompany.setLogo(img);
		}
		if (!StringUtils.isEmpty(account) && !ParamFormatTool.isFormatPhoneNo(account)) {
			return new JsonResult(false, Constants.PARAMETERS_NOT_FORMAT, null);
		}

		companyServer.addCompany(account, tAppCompany, Tpassword, Tname);
		return new JsonResult(true, "新增成功", null);
	}

	@RequestMapping(value = "/deleteCompany", method = RequestMethod.POST)
	@ResponseBody
	public JsonResult deleteCompany(HttpServletRequest httpServletRequest, String companyId) {

		Object userID = httpServletRequest.getSession().getAttribute("userId");
		if (userID == null) {
			return new JsonResult(false, "请先登录", "");
		}
		Long sessionUserId = Long.valueOf(userID.toString());
		if (StringUtils.isEmpty(companyId)) {
			return new JsonResult(false, "companyID为必传字段", null);
		}

		String[] companyIds = companyId.split(",");
		for (String string : companyIds) {
			companyServer.deleteCompany(sessionUserId, Long.valueOf(string));
		}
		return new JsonResult(true, "删除成功", null);
	}

	/**
	 * 
	 * 查询session里的userid可管理公司或归属公司，已type区分
	 */
	@RequestMapping("/selectCompany")
	@ResponseBody
	public JsonResult selectCompanyByUid(HttpServletRequest httpServletRequest, PageVo pagevo, String name) {
		Object userID = httpServletRequest.getSession().getAttribute("userId");
		Object areaId = httpServletRequest.getSession().getAttribute("areaId");
		// PageHelper.startPage(pagevo);
		if (userID == null) {
			return new JsonResult(false, "请先登录", "");
		}
		Long sessionUserId = Long.valueOf(userID.toString());
		List<TAppCompany> companys = companyServer.getCompany(sessionUserId, name, areaId, pagevo);
		PageInfo<TAppCompany> companysPage = new PageInfo<>(companys);
		if (null == companys || companys.size() == 0) {
			return new JsonResult(false, "无企业信息", companysPage);
		} else {
			return new JsonResult(true, "success", companysPage);
		}

	}

	@RequestMapping("selectByCode")
	@ResponseBody
	public JsonResult selectByCode(String code) {
		return new JsonResult(true, "", companyServer.getByCode(code));

	}

	/**
	 * 查询session里的userid可管理公司总和
	 */
	@RequestMapping("/selectCountCompanyByUid")
	@ResponseBody
	public Object selectCountCompanyByUid(HttpServletRequest httpServletRequest, Integer type) {
		Object userID = httpServletRequest.getSession().getAttribute("userId");
		if (userID == null) {
			return new JsonResult(false, "请先登录", "");
		}
		Long sessionUserId = Long.valueOf(userID.toString());
		TAppUser tAppUser = tAppUserMapper.selectByPrimaryKey(sessionUserId);
		return tAppUserCompanyMapper.selectCountByAccountAndType(tAppUser.getAccount(), type);
	}

	/**
	 * 更新公司信息 只需传需要更新字段 ID必传
	 */
	@RequestMapping(value = "/updateCompany", method = RequestMethod.POST)
	@ResponseBody
	public JsonResult updateCompany(@RequestParam(value = "logoFile", required = false) MultipartFile file, HttpServletRequest httpServletRequest,
			TAppCompany tAppCompany) throws IOException {
		Object userID = httpServletRequest.getSession().getAttribute("userId");
		if (userID == null) {
			return new JsonResult(false, "请先登录", "");
		}
		if (tAppCompany.getId() == null) {
			return new JsonResult(false, "公司ID必传", "");
		}
		Long sessionUserId = Long.valueOf(userID.toString());
		if (file != null && !file.isEmpty()) {
			String img = FileUpload.uploadFile(file, "companyLogo");
			tAppCompany.setLogo(img);
		}
		boolean status = companyServer.updateCompany(sessionUserId, tAppCompany);
		if (status) {
			return new JsonResult(true, "更新成功", null);
		} else {
			return new JsonResult(false, "更新失败，权限错误", null);
		}
	}

	/**
	 * 更新公司状态 只需传需要更新字段 ID必传
	 */
	@RequestMapping(value = "/updateCompanyState", method = RequestMethod.POST)
	@ResponseBody
	public JsonResult updateCompanyState(HttpServletRequest httpServletRequest, String companyId, Integer state) {
		boolean status = false;
		Object userID = httpServletRequest.getSession().getAttribute("userId");
		if (userID == null) {
			return new JsonResult(false, "请先登录", "");
		}
		if (companyId == null || state == null) {
			return new JsonResult(false, "公司ID和状态必传", "");
		}
		String[] companyIds = companyId.split(",");
		for (String string : companyIds) {
			Long sessionUserId = Long.valueOf(userID.toString());
			TAppCompany tAppCompany = new TAppCompany();
			tAppCompany.setId(Long.valueOf(string));
			tAppCompany.setStatus(state);
			status = companyServer.updateCompany(sessionUserId, tAppCompany);
		}
		if (status) {
			return new JsonResult(true, "更新成功", null);
		} else {
			return new JsonResult(true, "更新失败，权限错误", null);
		}
	}

	@RequestMapping("/selectUserByCid")
	@ResponseBody
	public JsonResult selectUserByCid(Long cid) {
		return new JsonResult(true, null, companyServer.getUserByCid(cid));
	}

	/**
	 * 页面
	 */
	@RequestMapping("/list")
	public String list() {
		return "company/list";
	}

	/**
	 * 页面
	 */
	@RequestMapping("/position")
	public String position() {
		return "company/position";
	}

	/**
	 * 页面
	 */
	@RequestMapping("/menu")
	public String menu() {
		return "company/menu";
	}

	/**
	 * 页面
	 */
	@RequestMapping("/externalMenu")
	public String externalMenu() {
		return "company/externalMenu";
	}
}
