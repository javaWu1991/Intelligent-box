package cmcc.mobile.yiqi.web.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Enumeration;
import java.util.List;
import java.util.Properties;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import cmcc.mobile.yiqi.base.BaseController;
import cmcc.mobile.yiqi.base.Constants;
import cmcc.mobile.yiqi.entity.SysRole;
import cmcc.mobile.yiqi.entity.TAppCompany;
import cmcc.mobile.yiqi.entity.TAppUpdateLog;
import cmcc.mobile.yiqi.entity.TAppUser;
import cmcc.mobile.yiqi.entity.dao.SysRoleMapper;
import cmcc.mobile.yiqi.entity.dao.TAppUpdateLogMapper;
import cmcc.mobile.yiqi.entity.dao.TAppUserCompanyMapper;
import cmcc.mobile.yiqi.utils.JsonResult;
import cmcc.mobile.yiqi.vo.AppUserVo;
import cmcc.mobile.yiqi.web.service.IAppUserServices;
import cmcc.mobile.yiqi.web.service.ICompanyService;
import cmcc.mobile.yiqi.web.service.IntelligentBoxService;

@Controller
@RequestMapping("/web")
public class LoginController extends BaseController {

	@Autowired
	private IAppUserServices appUserService;

	@Autowired
	private ICompanyService companyService;
	@Autowired
	private IntelligentBoxService boxService;

	@Autowired
	private TAppUserCompanyMapper userCompanyMapper;

	@Autowired
	private TAppUpdateLogMapper updateLogMapper;

	@Autowired
	private SysRoleMapper sysRoleMapper;

	/**
	 * 登陆跳转
	 *
	 * @return
	 */
	@RequestMapping("/login")
	public ModelAndView login() {
		return new ModelAndView("login");
	}

	/**
	 * 进入功能页面
	 *
	 * @return
	 */
	@RequestMapping("/microApp/list")
	public ModelAndView microApp(AppUserVo vo) {
		BeanUtils.copyProperties(vo, new TAppUser());
		return new ModelAndView("/microApp/list");
	}

	/**
	 * 跳转超级管理员页面
	 *
	 * @return
	 */
	@RequestMapping("/microApp/lists")
	public ModelAndView microApps() {
		return new ModelAndView("/microApp/lists");
	}

	/**
	 * 找回密码界面
	 *
	 * @return
	 */
	@RequestMapping("/forgot")
	public ModelAndView forgot() {
		return new ModelAndView("forgot");
	}

	/**
	 * 注册界面
	 *
	 * @return
	 */
	@RequestMapping("/register")
	public ModelAndView register() {
		return new ModelAndView("register");
	}

	/**
	 * 登陆校验
	 *
	 * @param account
	 * @param password
	 * @return
	 */
	@RequestMapping("/checkPass")
	@ResponseBody
	public JsonResult checkPass(String account, String password, HttpServletRequest request) {
		if (StringUtils.isNotEmpty(account) && StringUtils.isNotEmpty(password)) {
			TAppUser user = appUserService.loginCheck(account, password);
			if (null != user) {
				if (user.getStatus() == 0) {
					return new JsonResult(false, "该账号已停用，请联系管理员！", null);
				}

				List<SysRole> syslist = sysRoleMapper.byUidCid(Integer.parseInt(user.getId().toString()), null);
				if (CollectionUtils.isEmpty(syslist)) {
					return new JsonResult(false, "权限不足，无法登陆管理平台！", null);
				}
				List<TAppCompany> companies = new ArrayList<TAppCompany>();
				HttpSession session = request.getSession();
				for (SysRole sysRole : syslist) {
					TAppCompany company = new TAppCompany();
					session.setAttribute("rid", sysRole.getId());
					// ADMIN 管理员登陆
					if (sysRole.getRole().equalsIgnoreCase(Constants.ADMIN_MANAGER)) {
						session.setAttribute("isAdminLogin", true);
						company.setId(0L);
						company.setRoleId(sysRole.getId());
						company.setName(sysRole.getDescription());
					}
					// 区域经理/后勤人员登陆
					else if (sysRole.getRole().equalsIgnoreCase(Constants.AREA_MANAGER)
							|| sysRole.getRole().equalsIgnoreCase(Constants.CUSTOMER_MANAGER)) {
						company.setId(0L);
						company.setRoleId(sysRole.getId());
						company.setName(sysRole.getDescription());
					}
					// 企业管理员
					else if (sysRole.getRole().equalsIgnoreCase(Constants.COMPANY_MANAGER)) {
						List<TAppCompany> list = appUserService.findCompanyByUser(user.getId(), user.getAccount(), false);
						if (CollectionUtils.isNotEmpty(list)) {
							//H5登录通过设备编码查询企业信息判断登录用户是否是当前企业管理人员
							if(request.getParameter("code")!=null){
								Long corpId = boxService.selectCorpId(request.getParameter("code")) ;
								int type = 0 ;
								for(int i=0;i<list.size();i++){
									TAppCompany tAppCompany = list.get(i);
									if(corpId.equals(tAppCompany.getId())){
										type =1 ;
										company = list.get(0);
										company.setRoleId(sysRole.getId());
										//将登陆信息保存到session										
										session.setAttribute("companyId", list.get(0).getId());
										session.setAttribute("companyName", list.get(0).getName());
										session.setAttribute("isSuper", "0".equalsIgnoreCase(list.get(0).getId().toString()));
										break ;
									}
								}
								if(type==0){
									return new JsonResult(false, "该用户不是该酒店管理人员不可登录！", null);
								}
							}else{
							
							company = list.get(0);
							company.setRoleId(sysRole.getId());
							//将登陆信息保存到session
							
							session.setAttribute("companyId", list.get(0).getId());
							session.setAttribute("companyName", list.get(0).getName());
							session.setAttribute("isSuper", "0".equalsIgnoreCase(list.get(0).getId().toString()));
							}
						}
					}
					if (company.getId() != null) {
						companies.add(company);
					}
				}

				if (CollectionUtils.isEmpty(companies) || companies.size() == 0) {
					return new JsonResult(false, "非法的用户身份，不可登陆！", null);
				}

//				Collections.sort(companies, new Comparator<TAppCompany>() {
//					@Override
//					public int compare(TAppCompany o1, TAppCompany o2) {
//						return o1.getId().compareTo(o2.getId());
//					}
//				});

				session.setAttribute("companys", companies);
				session.setAttribute("user", user);
				session.setAttribute("userId", user.getId());
				session.setAttribute("userName", user.getName());
				//session.setAttribute("areaId", userCompanyMapper.getAreaId(user.getAccount()));
				
				UsernamePasswordToken token = new UsernamePasswordToken(account, password);
				// shiro相关，登陆
				Subject subject = SecurityUtils.getSubject();
				subject.login(token);
				return new JsonResult(true, "登录成功!", companies);
			} else {
				return new JsonResult(false, "用户名或密码错误！", null);
			}
		} else {
			return new JsonResult(false, "用户名或密码不可为空！", null);
		}
	}

	/**
	 * 选择集团跳转
	 *
	 * @param company
	 * @param request
	 * @return
	 */
	@RequestMapping("/checkLogin")
	@ResponseBody
	public JsonResult checkLogin(String id, String name, HttpServletRequest request, String roleId) {
		if (StringUtils.isNotEmpty(id) && StringUtils.isNotEmpty(name)) {

			HttpSession session = request.getSession();

			if (Integer.parseInt(id) != 0) {
				TAppCompany company = companyService.selectByPrimaryKey(Long.parseLong(id));
				session.setAttribute("company", company);
			}

			session.setAttribute("rid", roleId);
			session.setAttribute("companyId", id);
			session.setAttribute("companyName", name);
			session.setAttribute("isSuper", "0".equalsIgnoreCase(id));
			return new JsonResult(true, "", null);
		}
		return new JsonResult(false, "请选择集团登陆！", null);
	}

	@RequestMapping("/exit")
	public String exit(HttpServletRequest request) {
		// 清除 session
		Enumeration<String> em = request.getSession().getAttributeNames();
		while (em.hasMoreElements()) {
			request.getSession().removeAttribute(em.nextElement().toString());
		}
		// shiro相关，退出登录
		Subject subject = SecurityUtils.getSubject();
		subject.logout();
		return "redirect:/web/login.htm";
	}

}
