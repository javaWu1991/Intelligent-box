package cmcc.mobile.yiqi.web.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import cmcc.mobile.yiqi.base.BaseController;
import cmcc.mobile.yiqi.base.Constants;
import cmcc.mobile.yiqi.entity.SysUseRole;
import cmcc.mobile.yiqi.entity.TAppCompany;
import cmcc.mobile.yiqi.entity.TAppOrganization;
import cmcc.mobile.yiqi.entity.TAppUpdateLog;
import cmcc.mobile.yiqi.entity.TAppUser;
import cmcc.mobile.yiqi.entity.TAppUserCompany;
import cmcc.mobile.yiqi.entity.dao.TAppCompanyMapper;
import cmcc.mobile.yiqi.entity.dao.TAppUpdateLogMapper;
import cmcc.mobile.yiqi.entity.dao.TAppUserCompanyMapper;
import cmcc.mobile.yiqi.utils.CheckoutUtil;
import cmcc.mobile.yiqi.utils.FileUpload;
import cmcc.mobile.yiqi.utils.JsonResult;
import cmcc.mobile.yiqi.utils.RandomUtil;
import cmcc.mobile.yiqi.vo.AppOrganizationVo;
import cmcc.mobile.yiqi.vo.AppUserVo;
import cmcc.mobile.yiqi.vo.PageVo;
import cmcc.mobile.yiqi.vo.RegisterCompanyVo;
import cmcc.mobile.yiqi.web.service.IAppOrganizationService;
import cmcc.mobile.yiqi.web.service.IAppUserServices;
import cmcc.mobile.yiqi.web.service.IAuthorityService;
import cmcc.mobile.yiqi.web.service.ICompanyService;
import cmcc.mobile.yiqi.web.service.TAppAreaService;

/**
 * 
 * @author zhangxs
 *
 */
@Controller
@RequestMapping("/web/system")
public class SystemUserController extends BaseController {

	@Autowired
	private IAppUserServices appUserService;

	@Autowired
	private IAppOrganizationService appOrganizationService;

	@Autowired
	private ICompanyService companyService;

	@Autowired
	private TAppAreaService AreaService;

	@Autowired
	private IAppUserServices userServices;

	@Autowired
	private TAppUserCompanyMapper appUserCompanyMapper;

	@Autowired
	private TAppCompanyMapper tAppCompanyMapper;

	@Autowired
	private IAuthorityService authorityService;

	@Autowired
	private TAppUpdateLogMapper updateLogMapper;

	/***
	 * 通过手机号获取用户名
	 * 
	 * @param account
	 * @return
	 */
	@RequestMapping("/getNameByAccount")
	@ResponseBody
	public JsonResult getNameByAccount(String account) {
		if (StringUtils.isNotEmpty(account)) {
			if (CheckoutUtil.checkMobile(account)) {
				TAppUser user = userServices.selectByAccount(account);
				if (null != user) {
					return new JsonResult(true, "", user.getName());
				}
				return new JsonResult(true, "", "");
			}
			return new JsonResult(false, "手机号码格式错误！", "");
		}
		return new JsonResult(false, "请填写手机号！", "");
	}

	/**
	 * 设置企业管理员
	 * 
	 * @param cid
	 * @param account
	 * @return
	 */
	@RequestMapping("setCustomerManager")
	@ResponseBody
	public JsonResult setCustomerManager(Long cid, Long account) {
		int i = tAppCompanyMapper.setCustomerManager(cid, account);
		TAppUserCompany company = appUserCompanyMapper.selectByUIDCID(account.toString(), cid);
		if (null != company) {
			authorityService.deleteUserRoleByUidCidRid(SysUseRole.CUSTOMER_MANAGER.toString(), Integer.valueOf(cid.toString()),
					Integer.valueOf(userServices.selectByAccount(account.toString()).getId().toString()));
			authorityService.addUserRole(new SysUseRole(Integer.valueOf(userServices.selectByAccount(account.toString()).getId().toString()),
					Integer.valueOf(cid.toString()), SysUseRole.CUSTOMER_MANAGER));
			return new JsonResult(i == 1 ? true : false, "", null);
		}
		return new JsonResult(false, "关联数据查询失败！", null);
	}

	@RequestMapping("deleteCustomerManager")
	@ResponseBody
	public JsonResult deleteCustomerManager(Long cid) {
		int i = tAppCompanyMapper.deleteCustomerManager(cid);
		return new JsonResult(i == 1 ? true : false, "", null);
	}

	/**
	 * web注册企业
	 * 
	 * @param vo
	 * @return
	 */
	@RequestMapping("/register")
	@ResponseBody
	public JsonResult register(RegisterCompanyVo vo) {
		JsonResult result = checkValiCode(vo.getMobile(), vo.getSmsTime(), vo.getCode(), vo.getValiCode());
		if (result.getSuccess()) {
			/**
			 * 校验手机号码是否注册过公司
			 */
			int count = appUserService.selectCompanyByAccount(vo.getMobile());
			if (count > 0) {
				return new JsonResult(false, "该账号已注册企业，请直接登陆！", null);
			}

			if (StringUtils.isEmpty(vo.getName())) {
				return new JsonResult(false, "请输入管理员姓名！", null);
			}

			if (StringUtils.isEmpty(vo.getCompanyName())) {
				return new JsonResult(false, "请输入公司名称！", null);
			}

			if (StringUtils.isEmpty(vo.getPassword())) {
				return new JsonResult(false, "请输入密码！", null);
			}

			if (StringUtils.isEmpty(vo.getEmail())) {
				return new JsonResult(false, "请输入邮箱！", null);
			}

			if (StringUtils.isEmpty(vo.getProvinceId()) || StringUtils.isEmpty(vo.getCityId()) || StringUtils.isEmpty(vo.getAreaId())) {
				return new JsonResult(false, "请选择省市区！", null);
			}
			/**
			 * isAdminRegister true 表示注册账号可以在本地库存在
			 */
			result = appUserService.apiRegister(vo.getName(), vo.getMobile(), vo.getPassword(), null, true);
			if (result.getSuccess()) {
				TAppUser user = (TAppUser) result.getModel();
				return appUserService.webRegister(vo, user);
			}
		}
		return result;
	}

//	/**
//	 * 批量导入数据
//	 * 
//	 * @param cid
//	 * @param excel
//	 * @return
//	 */
//	@RequestMapping("/importExcel")
//	@ResponseBody
//	public JsonResult importExcel(String cid, MultipartFile excel, HttpServletRequest request, HttpServletResponse response) {
//		return appUserService.importExcel(cid, excel, request, response, false, false, null);
//	}

	/**
	 * 导出通讯录
	 * 
	 * @param cid
	 * @param excel
	 * @param request
	 * @param response
	 * @return
	 */
//	@RequestMapping("/exportExcel")
//	public void importExcel(String cid, HttpServletRequest request, HttpServletResponse response) {
//		appUserService.export(cid, true, request, response);
//	}

	/**
	 * 新增部门信息
	 * 
	 * @param cid
	 * @param orgId
	 * @param vo
	 * @return
	 */
	@RequestMapping("/addOrUpdateOrg")
	@ResponseBody
	public JsonResult addOrg(AppOrganizationVo vo) {
		return appOrganizationService.insertOrUpdate(vo);
	}

	/**
	 * 删除部门
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping("/deleteOrg")
	@ResponseBody
	public JsonResult deleteOrganization(String id) {
		return appOrganizationService.deleteByPrimaryKey(Long.parseLong(id));
	}

	/**
	 * 获取所有部门
	 * 
	 * @param request
	 * @param orgId
	 * @return
	 */
	@RequestMapping("/orgs")
	@ResponseBody
	public JsonResult getOrgsByCompany(HttpServletRequest request, String orgId) {
		String companyId = (String) request.getSession().getAttribute("companyId");
		List<TAppOrganization> list = appUserService.selectOrgByCidAndHigherId(Long.parseLong(companyId), orgId);
		return new JsonResult(true, "", list);
	}

	/**
	 * 
	 * @return
	 */
	@RequestMapping("/getAllOrgsByCompany")
	@ResponseBody
	public JsonResult getAllOrgsByCompany(HttpServletRequest request) {
		String companyId = (String) request.getSession().getAttribute("companyId");
		if (StringUtils.isNotEmpty(companyId)) {
			List<AppOrganizationVo> list = appOrganizationService.selectAllOrganization(Long.parseLong(companyId));
			return new JsonResult(true, "", list);
		}
		return new JsonResult(false, "登陆失效！", null);
	}

	/**
	 * 获取部门下人员
	 * 
	 * @param request
	 * @param orgId
	 * @return
	 */
	@RequestMapping("/users")
	@ResponseBody
	public JsonResult getUsersByOrgs(HttpServletRequest request, AppUserVo vo) {
		String companyId = (String) request.getSession().getAttribute("companyId");
		if (StringUtils.isNotEmpty(companyId)) {
			vo.setCid(Long.parseLong(companyId));
			return appUserService.selectAllByOrgId(vo);
		}
		return new JsonResult(false, "登陆失效！", null);
	}

	/**
	 * 获取部门下子部门及员工
	 * 
	 * @param request
	 * @param vo
	 * @return
	 */
	@RequestMapping("/usersByOrgs")
	@ResponseBody
	public JsonResult getUsersByOrgId(HttpServletRequest request, AppUserVo vo) {
		String companyId = (String) request.getSession().getAttribute("companyId");
		List<TAppOrganization> list = appUserService.selectOrgByCidAndHigherId(Long.parseLong(companyId), vo.getOrgId().toString());
		List<AppOrganizationVo> vos = new ArrayList<>();
		for (TAppOrganization tAppOrganization : list) {
			AppOrganizationVo oVo = new AppOrganizationVo();
			BeanUtils.copyProperties(tAppOrganization, oVo);
			vos.add(oVo);
		}
		List<TAppUser> list2 = appUserService.selectUsersByOrgId(vo.getOrgId());
		AppOrganizationVo resu = new AppOrganizationVo();
		resu.setOrgs(vos);
		resu.setUsers(list2);
		return new JsonResult(true, "", resu);
	}

	/* 部门下人员信息管理 */
	/**
	 * 新增用户
	 * 
	 * @param co
	 * @return
	 */
	@RequestMapping("/saveUser")
	@ResponseBody
	public JsonResult saveOrUpdateUser(AppUserVo vo, HttpServletRequest request) {
		TAppUser user = appUserService.selectByAccount(vo.getMobile());
		if (null != user) {
			if (!user.getName().equals(vo.getName())) {
				return new JsonResult(false, "已存在<" + user.getAccount() + ">账号用户名【" + user.getName() + "】与【" + vo.getName() + "】不相符！", null);
			}
		}
		vo.setPassword(vo.getMobile());
		return appUserService.insertSelective(vo, false, request);
	}

	/**
	 * 删除部门用户
	 * 
	 * @param orgId
	 *            部门id
	 * @param id
	 *            用户id
	 * @return
	 */
	@RequestMapping("/deleteOrgUser")
	@ResponseBody
	public JsonResult deleteOrgUser(String orgId, String id) {
		return appUserService.deleteOrgUser(orgId, id);
	}

	/**
	 * 公司id ： cid 真实姓名 ：name 联系电话 ：mobile
	 * 
	 * @param userVo
	 * @return
	 */
	@RequestMapping("/list")
	@ResponseBody
	public JsonResult adminList(AppUserVo userVo) {
		JsonResult result = appUserService.selectAllByParams(userVo);
		return result;
	}

	/**
	 * 
	 * 获取区域管理员
	 * 
	 * @param userVo
	 * @return
	 */
	@RequestMapping("/listarea")
	@ResponseBody
	public JsonResult listarea(AppUserVo userVo) {
		JsonResult result = appUserService.selectAllByParam(userVo);
		return result;
	}

	/**
	 * 新增管理员信息
	 * 
	 * @param userVo
	 * @return
	 */
	@RequestMapping(value = "/add", method = RequestMethod.POST)
	@ResponseBody
	public JsonResult saveAdmin(AppUserVo userVo, HttpServletRequest request) {
		HttpSession session = request.getSession() ;
		long corpId = Long.valueOf(session.getAttribute("companyId").toString()) ;
		// 客户经理、企业管理员
		if (null != userVo && null == userVo.getAreaid()) {
			if(userVo.getCid()==null){
				userVo.setCid(corpId);
			}
			return appUserService.insertSelective(userVo, true, request);
		}
		// 区域经理
		if (null != userVo && null != userVo.getProvinceid()) {
			return appUserService.insertSelectiveAreaManager(userVo, true, request);
		}
		return new JsonResult(false, "参数错误！", null);
	}

	/**
	 * 获取管理员信息
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	@ResponseBody
	public JsonResult getAdmin(@PathVariable String id) {
		if (StringUtils.isNotEmpty(id)) {
			TAppUser user = appUserService.selectByPrimaryKey(Long.parseLong(id));
			if (null != user && user.getStatus() == 1) {
				user.setPassword("");
				return new JsonResult(true, "", user);
			} else {
				return new JsonResult(false, "该用户已被停用！", null);
			}
		}
		return new JsonResult(false, "参数错误！", null);
	}

	/**
	 * 修改
	 * 
	 * @param id
	 * @param userVo
	 * @return
	 */
	@RequestMapping("/updateAdmin")
	@ResponseBody
	public JsonResult updateAdmin(AppUserVo userVo) {
		appUserService.updateByPrimaryKeySelective(userVo);
		return new JsonResult(true, "信息修改成功！", null);
	}

	/**
	 * 修改密码接口
	 * 
	 * @param id
	 * @param oldPass
	 * @param newPass
	 * @return
	 */
	@RequestMapping("/updatePassword")
	@ResponseBody
	public JsonResult updatePassword(String id, String oldPass, String newPass) {
		// MD5Encoder.encode(arg0)
		if (StringUtils.isNotEmpty(id) && StringUtils.isNotEmpty(oldPass) && StringUtils.isNotEmpty(newPass)) {
			TAppUser user = appUserService.selectByPrimaryKey(Long.parseLong(id));
			if (null != user) {
				if (RandomUtil.MD5(oldPass).equals(user.getPassword())) {
					user.setPassword(newPass);
					appUserService.updateByPrimaryKeySelective(user);
					return new JsonResult(true, "密码修改成功！", "");
				}
				return new JsonResult(false, "密码校验错误！请重新输入", null);
			}
			return new JsonResult(false, "查询用户不存在！", null);
		}
		return new JsonResult(false, "参数缺失！", null);
	}

	/**
	 * 
	 * @param id
	 * @param oldPass
	 * @param newPass
	 * @return
	 */
	@RequestMapping("/updatePasswordBycode")
	@ResponseBody
	public JsonResult updatePassword(String account, String pass, String smsTime, String code, String valiCode) {
		Boolean isTrue = CheckoutUtil.checkMobile(account);
		if (!isTrue) {
			return new JsonResult(false, "", null);
		}

		JsonResult result = checkValiCode(account, smsTime, code, valiCode);
		if (!result.getSuccess()) {
			return result;
		}

		if (StringUtils.isNotEmpty(pass)) {
			TAppUser user = appUserService.selectByAccount(account);
			if (null != user) {
				if (user.getStatus() == Constants.USER_CAN_USE) {
					if (RandomUtil.MD5(pass).equals(user.getPassword())) {
						return new JsonResult(false, "您的密码未修改！", null);
					}
					user.setPassword(pass);
					user.setUpdateTime(System.currentTimeMillis());
					userServices.updateByPrimaryKeySelective(user);
					return new JsonResult(true, "密码已重置！", null);
				}
				return new JsonResult(false, "账户状态异常，禁止重置密码！", null);
			}
			return new JsonResult(false, "查询用户不存在！", null);
		}
		return new JsonResult(false, "参数缺失！", null);
	}

	/**
	 * 重置密码
	 * 
	 * @param account
	 */
	@RequestMapping("/resetPassword")
	@ResponseBody
	public JsonResult resetPassword(String account) {
		if (StringUtils.isNotEmpty(account)) {
			return appUserService.resetPassword(account);
		}
		return new JsonResult(false, "参数错误！", null);
	}

	/**
	 * 停用启用
	 * 
	 * @param id
	 *            用户id
	 * @param cid
	 *            公司id
	 * @param status
	 *            当前状态
	 * @return
	 */
	@RequestMapping("/updateStatus")
	@ResponseBody
	public JsonResult updateAdminStatus(String account, String cid, int status) {
		return appUserService.updateAdminStatus(account, cid, status);
	}

	@RequestMapping("/delete")
	@ResponseBody
	public JsonResult deleteUserCompany(String account, String cid, String id, String rid) {
		return appUserService.deleteUserCompany(account, cid, id, rid);
	}

	/**
	 * 置顶
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping("/toTop")
	@ResponseBody
	public JsonResult toTop(String id, String orgId, Integer sort) {

		return appUserService.toTop(id, orgId, sort);
	}

	/**
	 * 设置公司通讯录是否隐藏部门领导信息
	 * 
	 * @param cid
	 * @param status
	 * @return
	 */
	@RequestMapping("/setCompanyIsHide")
	@ResponseBody
	public JsonResult setCompanyIsHide(String cid, int status, HttpServletRequest request) {
		return appUserService.setCompanyIsHide(cid, status, request);
	}

	/**
	 * 修改区域管理员
	 */
	@RequestMapping("/editareaAdmin")
	@ResponseBody
	public JsonResult editareaAdmin(AppUserVo recond) {

		return AreaService.updateCompany(recond);
	}

	/**
	 * 删除区域管理员
	 */
	@RequestMapping("/deleteArea")
	@ResponseBody
	public JsonResult deteleArea(String tid, String uid, String rid) {

		return AreaService.deleteArea(tid, uid, rid);
	}

	// 停用 禁用
	@RequestMapping("/updateAreaStatus")
	@ResponseBody
	public JsonResult updateAreaStatus(String tid, int status) {

		return AreaService.updateAreaStatus(tid, status);
	}

	/**
	 * 页面
	 */
	// @RequiresPermissions(value = { "admin" })
	@RequestMapping("/customManager")
	public ModelAndView admin(String cid) {
		ModelAndView view = new ModelAndView("system/customManager");
		return view;
	}

	// @RequiresPermissions(value = { "admin" })
	@RequestMapping("/areaAdmin")
	public ModelAndView areaAdmin(String cid) {
		ModelAndView view = new ModelAndView("system/areaAdmin");
		return view;
	}

	@RequestMapping("/companyAdmin")
	public ModelAndView companyAdmin(String cid) {
		ModelAndView view = new ModelAndView("system/companyAdmin");
		if (StringUtils.isNotEmpty(cid)) {
			TAppCompany company = companyService.selectByPrimaryKey(Long.parseLong(cid));
			view.addObject("company", company);
		}
		return view;
	}

	@RequestMapping("/profile")
	public ModelAndView profile(HttpServletRequest request) {
		HttpSession session = request.getSession();
		String uid = session.getAttribute("userId").toString();
		TAppUser user = userServices.selectByPrimaryKey(Long.parseLong(uid));
		ModelAndView view = new ModelAndView("system/profile");
		view.addObject("currentUser", user);
		return view;
	}

	@RequestMapping("/password")
	public ModelAndView password() {
		ModelAndView view = new ModelAndView("system/password");
		return view;
	}

//	// @RequiresPermissions("report")
//	@RequestMapping("/report")
//	public ModelAndView report() {
//		ModelAndView view = new ModelAndView("system/report");
//		try {
//			InputStream in = new FileInputStream(new File(getClass().getClassLoader().getResource("message.properties").getFile()));
//			Properties pps = new Properties();
//			pps.load(in);
//			String ADAUrl = pps.getProperty("ADAUrl");
//			view.addObject("ADAUrl", ADAUrl);
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//		return view;
//	}

	// @RequiresPermissions("contacts")
	@RequestMapping("/contacts")
	public ModelAndView contact() {
		ModelAndView view = new ModelAndView("system/contacts");
		return view;
	}

	// @RequiresPermissions("pendingUser")
	@RequestMapping("/pendingUser")
	public ModelAndView pendingUser() {
		ModelAndView view = new ModelAndView("system/pendingUser");
		return view;
	}

	// @RequiresPermissions("companyInfo")
	@RequestMapping("/companyInfo")
	public ModelAndView companyInfo() {
		ModelAndView view = new ModelAndView("system/companyInfo");
		return view;
	}

	// @RequiresPermissions("area")
	@RequestMapping("/area")
	public ModelAndView area() {
		ModelAndView view = new ModelAndView("system/area");
		return view;
	}

	// @RequiresPermissions("version")
	@RequestMapping("/version")
	public ModelAndView version() {
		ModelAndView view = new ModelAndView("system/version");
		return view;
	}

	// @RequiresPermissions("service")
	@RequestMapping("/service")
	public ModelAndView service() {
		ModelAndView view = new ModelAndView("system/service");
		return view;
	}

	// @RequiresPermissions("service")
	@RequestMapping("/serverNumber")
	public ModelAndView serverNumber() {
		ModelAndView view = new ModelAndView("system/serverNumber");
		return view;
	}

	// @RequiresPermissions("service")
	@RequestMapping("/externalService")
	public ModelAndView externalService() {
		ModelAndView view = new ModelAndView("system/externalService");
		return view;
	}

	// @RequiresPermissions("service")
	@RequestMapping("/externalServerNumber")
	public ModelAndView externalServerNumber() {
		ModelAndView view = new ModelAndView("system/externalServerNumber");
		return view;
	}

	// @RequiresPermissions("news")
	@RequestMapping("/news")
	public ModelAndView news() {
		ModelAndView view = new ModelAndView("system/news");
		return view;
	}

	@RequestMapping("/welcome")
	public ModelAndView welcome() {
		ModelAndView view = new ModelAndView("system/welcome");
		return view;
	}
	@RequestMapping("/management")
	public ModelAndView management() {
		ModelAndView view = new ModelAndView("system/management");
		return view;
	}
	@RequestMapping("/managementView")
	public ModelAndView managementView() {
		ModelAndView view = new ModelAndView("system/managementView");
		return view;
	}
	@RequestMapping("/dubanManagement")
	public ModelAndView dubanManagement() {
		ModelAndView view = new ModelAndView("system/dubanManagement");
		return view;
	}
	@RequestMapping("/dubanExport")
	public ModelAndView dubanExport() {
		ModelAndView view = new ModelAndView("system/dubanExport");
		return view;
	}
	
	@RequestMapping("/update")
	public ModelAndView update() {
		ModelAndView view = new ModelAndView("system/update");
		return view;
	}

	public JsonResult checkValiCode(String account, String smsTime, String code, String valiCode) {
		if (StringUtils.isEmpty(smsTime)) {
			return new JsonResult(false, "请传入验证码生成时间！", null);
		}
		if (StringUtils.isEmpty(valiCode)) {
			return new JsonResult(false, "请传入加密过的验证码！", null);
		}
		if (StringUtils.isEmpty(code)) {
			return new JsonResult(false, "请输入验证码！", null);
		}
		if (code.trim().length() != 6) {
			return new JsonResult(false, "请输入6位验证码！", null);
		}
		/**
//		 * 验证码校验
//		 */
//		Long minute = (System.currentTimeMillis() - Long.parseLong(smsTime)) / 1000;
//
//		if (minute.intValue() > Integer.parseInt(smsVerificateDomain.getExpirationTime())) {
//			return new JsonResult(false, "验证码已失效！", null);
//		}
//		String encryptStr = SmMd5Encrypt.EncryptIndentifyingCode(account, String.valueOf(code), smsVerificateDomain.getSmsEncryptKey());
//		if (encryptStr.equals(valiCode)) {
//			return new JsonResult(true, "", null);
//		}
		return new JsonResult(false, "验证码错误！", null);
	}
}
