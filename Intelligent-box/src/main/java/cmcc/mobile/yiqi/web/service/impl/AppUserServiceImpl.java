package cmcc.mobile.yiqi.web.service.impl;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import cmcc.mobile.yiqi.base.Constants;
import cmcc.mobile.yiqi.entity.SysUseRole;
import cmcc.mobile.yiqi.entity.TAppCompany;
import cmcc.mobile.yiqi.entity.TAppOrganization;
import cmcc.mobile.yiqi.entity.TAppPosition;
import cmcc.mobile.yiqi.entity.TAppUser;
import cmcc.mobile.yiqi.entity.TAppUserCompany;
import cmcc.mobile.yiqi.entity.TAppUserOrg;
import cmcc.mobile.yiqi.entity.dao.SysUseRoleMapper;
import cmcc.mobile.yiqi.entity.dao.TAppCompanyMapper;
import cmcc.mobile.yiqi.entity.dao.TAppOrganizationMapper;
import cmcc.mobile.yiqi.entity.dao.TAppPositionMapper;
import cmcc.mobile.yiqi.entity.dao.TAppUserCompanyMapper;
import cmcc.mobile.yiqi.entity.dao.TAppUserMapper;
import cmcc.mobile.yiqi.entity.dao.TAppUserOrgMapper;
import cmcc.mobile.yiqi.entity.dao.TAppbakExcelMapper;
import cmcc.mobile.yiqi.utils.CheckoutUtil;
import cmcc.mobile.yiqi.utils.ExportExcelUtils;
import cmcc.mobile.yiqi.utils.JsonResult;
import cmcc.mobile.yiqi.utils.RandomUtil;
import cmcc.mobile.yiqi.vo.AppCompanyVo;
import cmcc.mobile.yiqi.vo.AppOrganizationVo;
import cmcc.mobile.yiqi.vo.AppUserVo;
import cmcc.mobile.yiqi.vo.DeleteExportExcelVo;
import cmcc.mobile.yiqi.vo.ExportExcelVo;
import cmcc.mobile.yiqi.vo.PageVo;
import cmcc.mobile.yiqi.vo.RegisterCompanyVo;
import cmcc.mobile.yiqi.web.service.IAppOrganizationService;
import cmcc.mobile.yiqi.web.service.IAppUserServices;
import cmcc.mobile.yiqi.web.service.IAuthorityService;

/**
 * 
 * @author zhangxs
 *
 */
@Service
public class AppUserServiceImpl implements IAppUserServices {

	@Autowired
	private TAppUserMapper appUserMapper;

	@Autowired
	private TAppUserCompanyMapper appUserCompanyMapper;

	@Autowired
	private TAppCompanyMapper appCompanyMapper;

	@Autowired
	private TAppOrganizationMapper appOrganizationMapper;

	@Autowired
	private TAppUserOrgMapper appUserOrgMapper;

	@Autowired
	private TAppbakExcelMapper appbakExcelMapper;

	@Autowired
	private TAppUserCompanyMapper userCompanyMapper;

	@Autowired
	private TAppCompanyMapper tAppCompanyMapper;

	@Autowired
	private TAppPositionMapper postionMapper;

	@Autowired
	private IAppOrganizationService appOrganizationService;

	@Autowired
	private IAuthorityService authorityService;
	
	@Autowired
	private SysUseRoleMapper sysUseRoleMapper ;

	private static Logger logger = Logger.getLogger(AppUserServiceImpl.class);

	@Override
	public JsonResult webRegister(RegisterCompanyVo vo, TAppUser user) {

		TAppCompany company = new TAppCompany();
		company.setCode(RandomUtil.createRandomCharData(6));
		company.setAdress(vo.getDetailAddress());
		company.setAreaId(Long.parseLong(vo.getAreaId()));
		company.setCityId(Integer.parseInt(vo.getCityId()));
		company.setProvinceId(Integer.parseInt(vo.getProvinceId()));
		company.setAreaName(vo.getAreaName());
		company.setCityName(vo.getCityName());
		company.setProvinceName(vo.getProvinceName());
		company.setContacts(vo.getName());
		company.setContactsMobile(vo.getMobile());
		company.setCreate_time(System.currentTimeMillis());
		company.setName(vo.getCompanyName());
		company.setStatus(Constants.COMPANY_ADMIN);
		company.setCreator("Web 用户注册");
		tAppCompanyMapper.insertSelective(company);
		/**
		 * 添加关联表
		 */
		TAppUserCompany userCompany = new TAppUserCompany();
		userCompany.setAccount(user.getAccount());
		userCompany.setAreaid(Integer.parseInt(vo.getAreaId()));

		userCompany.setProvincename(vo.getProvinceName());
		userCompany.setCityname(vo.getCityName());
		userCompany.setAreaname(vo.getAreaName());
		userCompany.setUid(user.getId());
		userCompany.setType(Constants.COMPANY_ADMIN);
		userCompany.setStatus(1);
		userCompany.setCid(company.getId());
		userCompanyMapper.insertSelective(userCompany);

		/**
		 * 设置角色
		 */

		authorityService.addUserRole(
				new SysUseRole(Integer.parseInt(user.getId().toString()), Integer.parseInt(company.getId().toString()), SysUseRole.COMPANY_MANAGER));

		return new JsonResult(true, "企业注册成功，请登录！", null);

	}

	@Override
	public int selectCompanyByAccount(String account) {
		return appUserCompanyMapper.selectCountByAccountAndType(account, 1);
	}

	@Override
	public List<TAppUser> selectAll() {
		return appUserMapper.selectAll();
	}

	@Override
	public TAppUser selectByAccount(String account) {
		return appUserMapper.selectByAccount(account);
	}

	@Override
	public int updatePasswordByApp(TAppUser userVo) {
		return appUserMapper.updatePasswordByApp(userVo);
	}

	@Override
	public int deleteByPrimaryKey(Long id) {
		return 0;
	}

	@Override
	public int insert(TAppUser record) {
		return appUserMapper.insert(record);
	}

	@Override
	public JsonResult deleteOrgUser(String orgId, String id) {
		for (String ids : id.split(",")) {
			if (StringUtils.isNotEmpty(ids)) {
				Long userId = Long.parseLong(ids);
				TAppUserOrg userOrg = appUserOrgMapper.selectByOidUid(Long.parseLong(orgId), userId);
				if (null != userOrg) {
					appUserOrgMapper.deleteByPrimaryKey(userOrg.getId());
				}
			}
		}
		return new JsonResult(true, "操作成功！", null);
	}

	@Override
	public JsonResult toTop(String id, String orgId, Integer sort) {
		TAppUserOrg userOrg = appUserOrgMapper.selectByOidUid(Long.parseLong(orgId), Long.parseLong(id));
		if (null != userOrg) {
			userOrg.setSort(sort);
			appUserOrgMapper.updateByPrimaryKeySelective(userOrg);
		}
		return new JsonResult(true, "操作成功！", null);
	}

	@Override
	public JsonResult setCompanyIsHide(String cid, int status, HttpServletRequest request) {
		if (StringUtils.isEmpty(cid)) {
			return new JsonResult(false, "参数错误！", null);
		}
		TAppCompany company = appCompanyMapper.selectByPrimaryKey(Long.parseLong(cid));
		if (null != company) {
			if (status != company.getIsHide()) {
				company.setIsHide(status);
				appCompanyMapper.updateByPrimaryKeySelective(company);
				request.getSession().setAttribute("company", company);
				return new JsonResult(true, "设置成功！", null);
			}
			return new JsonResult(false, "该项设置已变更！", null);
		}
		return new JsonResult(false, "公司已被删除！", null);
	}

	@Override
	public JsonResult updateByPrimaryKeySelective(AppUserVo userVo) {
		TAppUser user = new TAppUser();
		if (null == userVo.getId()) {
			return new JsonResult(false, "参数错误！ID不可为空", null);
		}
		TAppUser appUser = appUserMapper.selectByPrimaryKey(userVo.getId());
		BeanUtils.copyProperties(userVo, user);
		user.setUpdateTime(System.currentTimeMillis());
		user.setStatus(null);
		appUserMapper.updateByPrimaryKeySelective(user);

		if (userVo.getOrgId() != null) {
			TAppUserOrg userOrg = appUserOrgMapper.selectByOidUid(userVo.getOrgId(), user.getId());
			if (null != userOrg) {
				Boolean changeOrg = false;
				if (StringUtils.isNotEmpty(userVo.getChangeOrgId()) && StringUtils.isNotEmpty(userVo.getChangeOrgName())
						&& Long.parseLong(userVo.getChangeOrgId()) != userVo.getOrgId()) {
					// 修改人员部门
					userOrg.setOid(Long.parseLong(userVo.getChangeOrgId()));
				}
				userOrg.setShortNum(userVo.getShortNum());
				userOrg.setPositionId(userVo.getJobId());
				userOrg.setEmail(userVo.getEmail());
				userOrg.setSort(userVo.getSort());
				userOrg.setStatus(userVo.getStatus());
				appUserOrgMapper.updateByPrimaryKeySelective(userOrg);
				if (changeOrg) {
					return new JsonResult(true, "信息修改成功，您已将<" + userVo.getName() + ">移动到【" + userVo.getChangeOrgName() + "】！", null);
				}
			} else {
				return new JsonResult(false, "该部门下人员已删除！", null);
			}
		}
		return new JsonResult(true, "人员信息修改成功！", null);
	}

	/**
	 * 
	 * @param record
	 * @param isAdmin
	 *            是否注册为管理员
	 * @return
	 */

	@Override
	public JsonResult insertSelective(AppUserVo record, Boolean isAdmin, HttpServletRequest request) {

		if (StringUtils.isEmpty(record.getPassword())) {
			record.setPassword(record.getMobile());
		}
		JsonResult result = this.apiRegister(record.getName(), record.getMobile(), record.getPassword(), record.getSex(), true);
		if (result.getSuccess()) {
			TAppUser user = (TAppUser) result.getModel();
			// appUserMapper.updateByPrimaryKeySelective(user);
			// 如果注册为管理员
			if (isAdmin) {
				// 更新相关用户信息
				TAppUserCompany userCompany = new TAppUserCompany();
				userCompany.setCid(record.getCid());
				userCompany.setStatus(1);
				userCompany.setUid(user.getId());
				userCompany.setAccount(user.getAccount());
				SysUseRole role = new SysUseRole();
				role.setUid(Integer.valueOf(user.getId().toString()));
				if (null != record.getCid()) {
					role.setCid(Integer.valueOf(record.getCid().toString()));
				} else {
					role.setCid(0);
				}

				if (record.getType()==null ||record.getType()==1) {
					TAppUserCompany company = appUserCompanyMapper.selectByCidAccountType(record.getCid(), user.getAccount(),
							Constants.COMPANY_ADMIN);
					if (null != company) {
						return new JsonResult(false, "管理员已存在，不可重复添加！", null);
					}
					userCompany.setType(Constants.COMPANY_ADMIN);
					role.setRid(SysUseRole.COMPANY_MANAGER);
				} else if (record.getAreaid() != null) {
					TAppUserCompany company = appUserCompanyMapper.selectByCidAccountType(record.getCid(), user.getAccount(), Constants.AREA_ADMIN);
					if (null != company) {
						return new JsonResult(false, "区域经理已存在，不可重复添加！", null);
					}
					userCompany.setType(Constants.AREA_ADMIN);
					role.setRid(SysUseRole.AREA_MANAGER);
				} else if (record.getType()==2) {
					TAppUserCompany company = appUserCompanyMapper.selectByCidAccountType(record.getCid(), user.getAccount(),
							Constants.CUSTOMER_ADMIN);
					if (null != company) {
						return new JsonResult(false, "客户经理已存在，不可重复添加！", null);
					}
					userCompany.setType(Constants.CUSTOMER_ADMIN);
					role.setRid(SysUseRole.CUSTOMER_MANAGER);
				}
				appUserCompanyMapper.insertSelective(userCompany) ;
				sysUseRoleMapper.insertSelective(role) ;
			}			
			result.setModel(user);
			result.setMessage("添加成功！");
		}
		return result;
	}

	@Override
	public TAppUser selectByPrimaryKey(Long id) {
		return appUserMapper.selectByPrimaryKey(id);
	}

	@Override
	public int updateByPrimaryKeySelective(TAppUser record) {
		return appUserMapper.updateByPrimaryKeySelective(record);
	}

	@Override
	public int updateByPrimaryKey(TAppUser record) {
		return 0;
	}

	/**
	 * 登陆校验
	 */
	public TAppUser loginCheck(String account, String password) {
		TAppUser user = new TAppUser();
		user.setAccount(account);
		user.setPassword(password);
		return appUserMapper.loginCheck(user);
	}

	/**
	 * 根据用户id查找所属公司 isApi 是否Api登陆
	 */
	@Override
	public List<TAppCompany> findCompanyByUser(Long id, String account, Boolean isApi) {

		List<TAppCompany> companies = new ArrayList<>();

		/**
		 * App登陆接口，以用户部门关联表关联到部门，通过部门获取关联的公司
		 */
//		if (isApi) {
//			List<TAppOrganization> orgs = appOrganizationMapper.selectAllByUid(id);
//			List<Long> ids = new ArrayList<Long>();
//			for (TAppOrganization tAppOrganization : orgs) {
//				ids.add(tAppOrganization.getCid());
//			}
//			if (CollectionUtils.isNotEmpty(ids)) {
//
//				companies = appCompanyMapper.selectByPrimaryKeys(ids);
//				Map<String, Object> map = new HashMap<String, Object>();
//				map.put("uid", id);
//				map.put("list", ids);
//				for (TAppCompany company : companies) {
//					StringBuffer idString = new StringBuffer();
//					StringBuffer nameString = new StringBuffer();
//					StringBuffer emails = new StringBuffer();
//					StringBuffer shortNum = new StringBuffer();
//					for (TAppOrganization tAppOrganization : orgs) {
//						if (company.getId().equals(tAppOrganization.getCid())) {
//							idString.append(tAppOrganization.getId() + ",");
//							nameString.append(tAppOrganization.getOrgName() + "/" + tAppOrganization.getJobName() + ",");
//							emails.append(StringUtils.isEmpty(tAppOrganization.getEmail()) ? "" : tAppOrganization.getEmail() + ",");
//							if (StringUtils.isNotEmpty(tAppOrganization.getShortNum())
//									&& !shortNum.toString().contains(tAppOrganization.getShortNum())) {
//								shortNum.append(tAppOrganization.getShortNum() + ",");
//							}
//						}
//					}
//
//					String num = "";
//					if (StringUtils.isNotEmpty(shortNum) && shortNum.toString().contains(",")) {
//						num = shortNum.toString().substring(0, shortNum.toString().lastIndexOf(","));
//					}
//					company.setShortNum(num);
//					company.setOrgId(idString.toString().substring(0, idString.toString().lastIndexOf(",")));
//					company.setOrgName(nameString.toString().substring(0, nameString.toString().lastIndexOf(",")));
//					/**
//					 * 对邮箱展示内容处理
//					 */
//					String strs = emails.toString();
//					String email = "";
//					String[] strings = strs.split(",");
//					for (String string : strings) {
//						if (StringUtils.isNotEmpty(string) && !email.contains(string)) {
//							email += string + ",";
//						}
//					}
//
//					if (StringUtils.isNotEmpty(email)) {
//						company.setEmails(email.substring(0, email.lastIndexOf(",")));
//					} else {
//						company.setEmails("");
//					}
//				}
//			}
//		} else {
			List<TAppUserCompany> list = appUserCompanyMapper.selectAllByAccount(account);
			List<Long> ids = new ArrayList<Long>();
			for (TAppUserCompany tAppUserCompany : list) {
				ids.add(tAppUserCompany.getCid());
			}
			if (CollectionUtils.isNotEmpty(list)) {
				companies = appCompanyMapper.selectByPrimaryKeys(ids);
				// Map<String, Object> map = new HashMap<String, Object>();
				// map.put("uid", id);
				// map.put("list", ids);
				//
				// List<TAppOrganization> orgs =
				// appOrganizationMapper.selectAllByCidsUid(map);
				//
				// for (TAppCompany company : companies) {
				// for (TAppOrganization tAppOrganization : orgs) {
				// if (company.getId().equals(tAppOrganization.getCid())) {
				// company.setOrgId(tAppOrganization.getId().toString());
				// }
				// }
				// }
			}
		//}

		return companies;
	}

	/**
	 * 查询所有管理员列表
	 */
	@Override
	public JsonResult selectAllByParams(AppUserVo userVo) {
		List<TAppUser> list = appUserMapper.selectAllByParams(userVo);
		int count = appUserMapper.selectCountByParams(userVo);

		JsonResult result = new JsonResult(true, "", list);
		PageVo vo = new PageVo(userVo.getPageNo(), userVo.getPageSize());
		vo.setTotalCountAndPageTotal(count);
		result.setPageVo(vo);
		return result;
	}

	@Override
	public List<TAppOrganization> selectOrgByCidAndHigherId(Long companyId, String orgId) {
		TAppOrganization org = new TAppOrganization();
		org.setCid(companyId);
		if (StringUtils.isNotEmpty(orgId)) {
			org.setHigherId(Long.parseLong(orgId));
		} else
			org.setHigherId(0L);
		List<TAppOrganization> orgs = appOrganizationMapper.selectOrgByCidAndHigherId(org);
		return orgs;
	}

	// 根据部门查询总人数
	@Override
	public Long getCountPeolpeByOid(Long id) {
		return appUserOrgMapper.countPeopleByOid(id);
	}

	// 根据公司id查询公司总人数
	@Override
	public Long getCountPeopleByCid(Long cid) {
		List<TAppOrganization> organizations = selectOrgByCidAndHigherId(cid, null);
		Long count = 0l;
		for (TAppOrganization tAppOrganization : organizations) {
			count += getCountPeolpeByOid(tAppOrganization.getId());
		}
		return count;
	}

	/**
	 * 获取管理公司的组织架构
	 */
	@Override
	public List<AppCompanyVo> companyOrgUser(long parseLong) {
		// List<TAppCompany> companies = this.findCompanyByUser(parseLong);
		TAppCompany company = appCompanyMapper.selectByPrimaryKey(parseLong);
		if (null != company) {
			List<AppCompanyVo> companyVos = new ArrayList<>();
			AppCompanyVo vo = new AppCompanyVo();
			BeanUtils.copyProperties(company, vo);

			/**
			 * 获取一级部门
			 */
			TAppOrganization organization = new TAppOrganization();
			organization.setCid(company.getId());
			organization.setHigherId(0L);

			List<TAppOrganization> orgs = appOrganizationMapper.selectOrgByCidAndHigherId(organization);

			// 获取所有部门，遍历获取所有部门下员工
			List<AppOrganizationVo> orgVos = orgUsers(orgs);

			vo.setOrgList(orgVos);
			companyVos.add(vo);
			return companyVos;
		}
		return null;
	}

	/**
	 * 递归获取部门元素，包括多个部门或者人员 传入一个一级部门，递归查询下面所有部门信息
	 */
	public List<AppOrganizationVo> orgUsers(List<TAppOrganization> orgs) {
		List<AppOrganizationVo> list = new ArrayList<>();
		for (TAppOrganization tAppOrganization : orgs) {
			// 查询所有部门下人员
			AppOrganizationVo orgVo = new AppOrganizationVo();
			BeanUtils.copyProperties(tAppOrganization, orgVo);
			List<TAppUser> users = appUserMapper.selectAllByOrgId(tAppOrganization.getId());
			for (TAppUser tAppUser : users) {
				tAppUser.setPassword(null);
			}
			orgVo.setUsers(users);
			// 查询次级部门
			tAppOrganization.setHigherId(tAppOrganization.getId());
			List<TAppOrganization> childOrg = appOrganizationMapper.selectOrgByCidAndHigherId(tAppOrganization);
			// 递归
			if (CollectionUtils.isNotEmpty(childOrg)) {
				List<AppOrganizationVo> childs = orgUsers(childOrg);
				orgVo.setOrgs(childs);
			}
			// 参数封装
			list.add(orgVo);
		}
		return list;
	}

	@Override
	public HashMap<String, Long> selectAllUsersByOrgid(Long orgId) {
		return null;
	}

	@Override
	public List<TAppUser> selectUsersByOrgId(Long orgId) {
		List<TAppUser> users = appUserMapper.selectAllByOrgId(orgId);
		return users;
	}

	@Override
	public JsonResult selectAllByOrgId(AppUserVo vo) {
		JsonResult result = new JsonResult(true, "", null);
		// vo.setOrgId(null);
		List<Long> list = new ArrayList<>();
		if (null != vo.getOrgId()) {
			list.add(vo.getOrgId());
		} else {
			List<AppOrganizationVo> vos = appOrganizationService.selectAllOrganization(vo.getCid());
			for (AppOrganizationVo appOrganizationVo : vos) {
				list.add(appOrganizationVo.getId());
			}
		}

		vo.setOrgIds(list);

		List<TAppUser> users = appUserMapper.selectAllByOrgIdPage(vo);

		result.setModel(users);
		int count = appUserMapper.selectCountByOrgIdPage(vo);
		PageVo pageVo = new PageVo();
		pageVo.setPageNo(vo.getPageNo());
		pageVo.setPageSize(vo.getPageSize());
		pageVo.setTotalCountAndPageTotal(count);
		result.setPageVo(pageVo);
		return result;
	}

	
	
	
	@Override
	public JsonResult apiRegister(String name, String mobile, String pass, Integer sex, Boolean isAdminRegister) {
		// 根据手机号查询用户是否注册过
		TAppUser appUser = appUserMapper.selectByAccount(mobile);
		JsonResult result = new JsonResult();
		// 如果不是管理员注册 APP端注册，校验账户是否是否已存在
		if (null != appUser) {
			if (!isAdminRegister) {
				return new JsonResult(false, "该号码已注册，请直接登陆！", appUser);
			} else {
				return new JsonResult(true, null, appUser);
			}
		} else {
			/**
			 * 注册到本地
			 */
			appUser = new TAppUser();
			appUser.setMobile(mobile);
			appUser.setPassword(pass);
			appUser.setSex(null == sex ? 1 : sex);
			appUser.setName(StringUtils.isEmpty(name) ? mobile : name);
			appUser.setAccount(mobile);
			appUser.setStatus(Constants.USER_CAN_USE);
			appUser.setCreateTime(System.currentTimeMillis());
			appUserMapper.insertSelective(appUser);
			result.setSuccess(true);
			result.setModel(appUser);
		}
		return new JsonResult(true, "注册成功！", appUser);
	}

	/**
	 * 停用，禁用
	 */
	@Override
	public JsonResult updateAdminStatus(String account, String cid, int oldStatus) {
		TAppUserCompany companys = new TAppUserCompany();
		companys.setAccount(account);
		companys.setCid(Long.parseLong(cid));
		TAppUserCompany company = appUserCompanyMapper.selectByUIDCID(companys);
		if (null != company) {
			// oldStatus = oldStatus == 1 ? 0 : oldStatus;
			company.setStatus(oldStatus);
			appUserCompanyMapper.updateByPrimaryKeySelective(company);
		}

		return new JsonResult(true, "操作成功！", null);
	}

	@Override
	public JsonResult deleteUserCompany(String account, String cid, String uid, String rid) {
		TAppUserCompany companys = new TAppUserCompany();
		companys.setAccount(account);
		companys.setCid(Long.parseLong(cid));
		TAppUserCompany company = appUserCompanyMapper.selectByUIDCID(companys);
		if (null != company) {
			appUserCompanyMapper.deleteByPrimaryKey(company.getId());
			/**
			 * 删除角色权限
			 */
			authorityService.deleteUserRoleByUidCidRid(rid, Integer.parseInt(cid), Integer.parseInt(uid));
		}
		return new JsonResult(true, "操作成功！", null);
	}

	/**
	 * 批量导入用户
	 */
	@Override
	public JsonResult importExcel(String cid, MultipartFile excel, HttpServletRequest request, HttpServletResponse response, Boolean isExport,
			Boolean isJunit, HSSFWorkbook workbook) {
		Long start = System.currentTimeMillis();
		Long company = 0L;
		if (StringUtils.isNotEmpty(cid)) {
			company = Long.parseLong(cid);
		} else {
			return new JsonResult(false, "请选择公司导入！", null);
		}

		/**
		 * 导出公司备份备份数据
		 */
		if (!isJunit) {
			this.export(cid, isExport, request, response);
		}

		Workbook work;
		Map<String, TAppOrganization> insertMap = new HashMap<String, TAppOrganization>();
		Map<Object, Object> mobileMap = new HashMap<Object, Object>();
		Map<String, String> shortNumMap = new HashMap<String, String>();
		Map<String, Object> jobMap = new HashMap<String, Object>();
		Map<String, List<TAppUser>> deptMap = new HashMap<String, List<TAppUser>>();
		try {
			if (isJunit) {
				work = workbook;
			} else {
				try {
					work = new HSSFWorkbook(new POIFSFileSystem(excel.getInputStream()));
				} catch (Exception e) {
					work = new XSSFWorkbook(excel.getInputStream());
				}
			}
			/**
			 * 遍历每个 sheet 页
			 */
			Sheet sheet = null;

			List<TAppUser> list = null;
			sheet = work.getSheetAt(0);
			// 查询所有职位
			List<TAppPosition> positions = postionMapper.selectAllByCid(Integer.parseInt(company.toString()));
			for (TAppPosition tAppPosition : positions) {
				jobMap.put(tAppPosition.getPositionName() + "/" + tAppPosition.getLevel(), tAppPosition);
			}

			Map<String, String> unJob = new HashMap<String, String>();

			for (int j = 2; j < sheet.getPhysicalNumberOfRows(); j++) {// 获取每行
				Row row = sheet.getRow(j);
				/**
				 * 校验手机号码是否有重复
				 */
				if (null != row) {
					String name = getCellValue(row.getCell(0));
					String mobile = getCellValue(row.getCell(1));
					String shortNum = getCellValue(row.getCell(2));
					String sex = getCellValue(row.getCell(3));
					String email = getCellValue(row.getCell(4));
					String dept = getCellValue(row.getCell(5));
					String job = getCellValue(row.getCell(6));
					String level = getCellValue(row.getCell(7));
					/*
					 * String parentDept = ""; Cell cell6 = row.getCell(7); if
					 * (null != cell6) { parentDept =
					 * cell6.getStringCellValue(); }
					 */
					if (StringUtils.isNotEmpty(name)) {
						if (StringUtils.isNotEmpty(dept)) {
							/**
							 * 校验手机号码是否正确
							 */

							Boolean mobileCheck = CheckoutUtil.checkMobile(mobile);
							if (!mobileCheck) {
								list = null;
								dept = null;
								mobileMap = null;
								shortNumMap = null;
								return new JsonResult(false, "第" + (j + 1) + "行" + mobile + " 手机号码不正确！", null);
							}

							if (StringUtils.isNotEmpty(shortNum) && !CheckoutUtil.checkShortNum(shortNum)) {
								list = null;
								dept = null;
								mobileMap = null;
								shortNumMap = null;
								return new JsonResult(false, "第" + (j + 1) + "行" + shortNum + " 短号号码格式不正确！", null);
							}

							if (mobileMap.containsKey(mobile)) {
								return new JsonResult(false, mobile + " 号码重复，请处理！", null);
							} else if (shortNumMap.containsKey(shortNum)) {
								return new JsonResult(false, shortNum + " 短号重复，请处理！", null);
							} else {
								mobileMap.put(mobile, mobile);
								// 如果填写短号，放入Map，校验唯一性
								if (StringUtils.isNotEmpty(shortNum)) {
									shortNumMap.put(shortNum, shortNum);
								}

								if (StringUtils.isEmpty(level)) {
									level = "1";
								}
								if (!jobMap.containsKey(job + "/" + level)) {
									unJob.put(job + "/" + level, job);
								}

								String key = (dept).trim();
								/**
								 * 封装数据
								 */
								TAppUser user = new TAppUser();
								user.setAccount(mobile);
								user.setMobile(mobile);
								user.setName(name);
								user.setJob(job + "/" + level);
								user.setSex(sex.equals("男") ? 1 : 0);
								user.setPassword(mobile);
								user.setEmail(email);
								user.setShortNum(shortNum);
								// -1 表示该用户已存在，但未通过注册激活账户
								// user.setStatus(-1);

								// 保存去掉重复之后的部门关联人员信息
								list = deptMap.get(key);
								if (CollectionUtils.isEmpty(list)) {
									list = new ArrayList<TAppUser>();
									deptMap.put(key, list);
								}
								list.add(user);
							}
						} else {
							list = null;
							dept = null;
							mobileMap = null;
							jobMap = null;
							unJob = null;
							return new JsonResult(false, "行号：" + (j + 1) + "的所属部门不可为空！", null);
						}
					} else {
						list = null;
						dept = null;
						jobMap = null;
						unJob = null;
						mobileMap = null;
						return new JsonResult(false, "行号：" + (j + 1) + "的员工姓名不可为空！", null);
					}
				}
			}

			// /**
			// * 插入职位信息
			// */
			for (Map.Entry<String, String> entry : unJob.entrySet()) {
				String[] jobLevel = entry.getKey().split("/");
				String name = jobLevel[0];
				String level = jobLevel[1];
				TAppPosition position = new TAppPosition();
				position.setCid(company);
				position.setLevel(StringUtils.isEmpty(level) ? 1L : Long.parseLong(level));
				position.setPositionName(name);
				postionMapper.addPosition(position);
				jobMap.put(entry.getKey(), position);
			}

			/**
			 * 校验部门关联信息是否完整
			 */
			for (Map.Entry<String, List<TAppUser>> entry : deptMap.entrySet()) {
				String fullPath = entry.getKey();
				String parentName = "";
				if (fullPath.indexOf("/") > 0) {
					parentName = fullPath.substring(0, fullPath.lastIndexOf("/"));
					// 如果上级部门不存在
					if (!deptMap.containsKey(parentName)) {
						return new JsonResult(false, "部门【" + parentName + "】不存在，请补全信息！", null);
					}
				}
			}

			/**
			 * 更新部门信息
			 */
			for (Map.Entry<String, List<TAppUser>> entry : deptMap.entrySet()) {
				String fullPath = entry.getKey();
				String orgName = fullPath;
				if (fullPath.indexOf("/") > 0) {
					orgName = fullPath.substring(fullPath.lastIndexOf("/") + 1);
				}
				// 查询部门信息
				TAppOrganization organization = appOrganizationMapper.selectByPathAndCid(fullPath, company);
				if (null != organization) {
					// List<TAppUserOrg> list3 =
					// appUserOrgMapper.selectAllByOid(organization.getId());
					// for (TAppUserOrg tAppUserOrg : list3) {
					// appUserOrgMapper.deleteByPrimaryKey(tAppUserOrg.getId());
					// }
					// 不删除已存在的部门用户关联信息
				} else {
					organization = new TAppOrganization();
					organization.setCid(company);
					organization.setCreateTime(System.currentTimeMillis() / 1000);
					organization.setFullPath(fullPath);
					organization.setOrgName(orgName);
					organization.setSource("管理员导入数据");
					appOrganizationMapper.insertSelective(organization);
				}

				insertMap.put(fullPath, organization);
			}

			for (Map.Entry<String, List<TAppUser>> entry : deptMap.entrySet()) {
				String fullPath = entry.getKey();
				String parentPath = "";
				// 是否有上级部门
				if (fullPath.indexOf("/") > 0) {
					parentPath = fullPath.substring(0, fullPath.lastIndexOf("/"));
				}
				/**
				 * 修改部门关联
				 */
				TAppOrganization child = insertMap.get(fullPath);
				if (StringUtils.isNotEmpty(parentPath)) {
					TAppOrganization parent = insertMap.get(parentPath);
					child.setHigherId(parent.getId());
					appOrganizationMapper.updateByPrimaryKeySelective(child);
				}
				/**
				 * 操作用户信息
				 */
				List<TAppUser> lUsers = (List<TAppUser>) entry.getValue();
				for (TAppUser tAppUser : lUsers) {
					/**
					 * 插入用户信息 如果存在就修改状态，修改其他信息
					 */
					TAppUser user = appUserMapper.selectByAccount(tAppUser.getAccount());
					if (null != user) {
						/*
						 * // 如果是管理员 将状态设置为未激活状态 TAppUserCompany userCompany =
						 * appUserCompanyMapper.selectByUIDCID(user.getId(),
						 * Long.parseLong(cid)); if (null == userCompany) {
						 * user.setStatus(-1); }
						 */
						user.setName(tAppUser.getName());
						user.setMobile(tAppUser.getMobile());
						user.setSex(tAppUser.getSex());
						user.setJob(tAppUser.getJob());
						user.setEmail(tAppUser.getEmail());
						user.setPassword(null);
						user.setUpdateTime(System.currentTimeMillis());
						appUserMapper.updateByPrimaryKeySelective(user);
						tAppUser.setId(user.getId());
					} else {
						// 冻结账户信息，激活时需要在小溪注册
						tAppUser.setStatus(-1);
						appUserMapper.insertSelective(tAppUser);
					}

					/**
					 * 插入部门与新增用户关联信息
					 */
					TAppUserOrg org = appUserOrgMapper.selectByOidUid(child.getId(), tAppUser.getId());
					if (null == org) {
						TAppUserOrg userOrg = new TAppUserOrg();
						userOrg.setOid(child.getId());
						userOrg.setStatus(1);
						userOrg.setUid(tAppUser.getId());
						userOrg.setShortNum(tAppUser.getShortNum());
						userOrg.setEmail(tAppUser.getEmail());
						TAppPosition position = (TAppPosition) jobMap.get(tAppUser.getJob() + "");
						userOrg.setPositionId(Integer.parseInt(position.getId().toString()));
						appUserOrgMapper.insertSelective(userOrg);
					} else {
						org.setShortNum(tAppUser.getShortNum());
						org.setEmail(tAppUser.getEmail());
						TAppPosition position = (TAppPosition) jobMap.get(tAppUser.getJob() + "");
						org.setPositionId(Integer.parseInt(position.getId().toString()));
						appUserOrgMapper.updateByPrimaryKeySelective(org);
					}
				}
			}
		} catch (FileNotFoundException e) {
			return new JsonResult(false, "导入模板不存在！", null);
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			deptMap = null;
			insertMap = null;
			mobileMap = null;
			jobMap = null;
			shortNumMap = null;
			// System.gc();
		}
		Long end = System.currentTimeMillis();
		String time = ((end - start) / 1000 / 60L) + "分" + ((end - start) / 1000 % 60) + "秒";
		return new JsonResult(true, "数据导入成功，耗时:" + time, null);
	}

	/**
	 * 针对不同单元格类型转换，并返回单元格值
	 * 
	 * @param cell
	 * @return
	 */
	private String getCellValue(Cell cell) {
		String cellValue = "";
		if (null != cell) {
			DecimalFormat df = new DecimalFormat("#");
			switch (cell.getCellType()) {
			case Cell.CELL_TYPE_STRING:
				cellValue = cell.getRichStringCellValue().getString().trim();
				break;
			case Cell.CELL_TYPE_NUMERIC:
				cellValue = df.format(cell.getNumericCellValue()).toString();
				break;
			case Cell.CELL_TYPE_BOOLEAN:
				cellValue = String.valueOf(cell.getBooleanCellValue()).trim();
				break;
			case Cell.CELL_TYPE_FORMULA:
				cellValue = cell.getCellFormula();
				break;
			default:
				cellValue = "";
			}
		}
		return cellValue;
	}

	/**
	 * cid 公司id isNeedBak 是否需要进行通讯录备份至服务器
	 */
	@Override
	public void export(String cid, Boolean isNeedBak, HttpServletRequest request, HttpServletResponse response) {
		List<DeleteExportExcelVo> excels = appUserMapper.selectExportUser(Long.parseLong(cid));
		List<ExportExcelVo> list = new ArrayList<>();

		for (DeleteExportExcelVo deleteExportExcelVo : excels) {
			ExportExcelVo vo = new ExportExcelVo();
			BeanUtils.copyProperties(deleteExportExcelVo, vo);
			list.add(vo);
		}

		if (CollectionUtils.isNotEmpty(excels)) {
			String[] headers = new String[] { "员工姓名", "手机号码", "短号", "性别", "邮箱", "所属部门", "职位", "职级" };
			Collection<ExportExcelVo> excelVos = list;
			try {
				response.setContentType("application/vnd.ms-excel");// 设置生成的文件类型
				SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
				String companyName = request.getSession().getAttribute("companyName").toString();
				String fileName = "" + companyName + "公司通讯录 " + format.format(new Date()) + ".xls";
				response.setHeader("Content-Disposition", "filename=" + new String(fileName.getBytes("gb2312"), "iso8859-1"));
				HSSFWorkbook workbook = ExportExcelUtils.exportExcel(appbakExcelMapper, cid, fileName, headers, excelVos, isNeedBak, request, format);
				if (isNeedBak) {
					workbook.write(response.getOutputStream());
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	/**
	 * 查询注册加入企业待审核的用户
	 */
	@Override
	public List<TAppUser> selectPendingApproval(String cid) {
		try {
			List<TAppUser> result = appUserMapper.selectPendingApproval(cid);
			return result;
		} catch (Exception e) {
			logger.error("获取待审核用户失败，错误信息：" + e.getMessage());
			return null;
		}
	}

	@Override
	public JsonResult selectAllByParam(AppUserVo userVo) {
		List<TAppUserCompany> list = appUserMapper.selectAllByParam(userVo);
		int count = appUserMapper.selectCountByParam(userVo);

		JsonResult result = new JsonResult(true, "", list);
		PageVo vo = new PageVo(userVo.getPageNo(), userVo.getPageSize());
		vo.setTotalCountAndPageTotal(count);
		result.setPageVo(vo);
		return result;
	}

	@Override
	public JsonResult listCustomer(AppUserVo userVo) {
		List<TAppUser> list = appUserMapper.selectAllCustomer(userVo);
		int count = appUserMapper.selectCountCustomer(userVo);

		JsonResult result = new JsonResult(true, "", list);
		PageVo vo = new PageVo(userVo.getPageNo(), userVo.getPageSize());
		vo.setTotalCountAndPageTotal(count);
		result.setPageVo(vo);
		return result;
	}

	@Override
	public JsonResult insertSelectiveAreaManager(AppUserVo userVo, Boolean isAdmin, HttpServletRequest request) {
		if (null != userVo.getAccount()) {
			userVo.setMobile(userVo.getAccount());
		}

		if (StringUtils.isEmpty(userVo.getPassword())) {
			userVo.setPassword(RandomUtil.createData(6));
		}
		// 校验是否需要发送短信
		String template = "感谢您使用工作手机后台管理系统，初始密码:" + userVo.getPassword() + "，请尽快修改您的密码。账号登录地址："
				+ (String) request.getSession().getAttribute("admin_url") + "";
		TAppUser appUser = appUserMapper.selectByAccount(userVo.getMobile());
		if (null != appUser) {
			template = "感谢您使用工作手机后台管理系统，账号登录地址：" + (String) request.getSession().getAttribute("admin_url") + "";
		}

		JsonResult result = this.apiRegister(userVo.getName(), userVo.getMobile(), userVo.getPassword(), userVo.getSex(), true);
		if (result.getSuccess()) {
			TAppUser user = (TAppUser) result.getModel();
			// appUserMapper.updateByPrimaryKeySelective(user);
			// 如果注册为管理员
			if (isAdmin) {

				TAppUserCompany company = appUserCompanyMapper.selectByCidAccountType(userVo.getCid(), user.getAccount(), Constants.AREA_ADMIN);
				if (null != company) {
					return new JsonResult(false, "该用户已是区域管理员(暂支持一个区域)!", null);
				}
				// 更新相关用户信息
				TAppUserCompany userCompany = new TAppUserCompany();

				userVo.setAreaid(
						0 == userVo.getAreaid() ? 0 == userVo.getCityid() ? userVo.getProvinceid() : userVo.getCityid() : userVo.getAreaid());

				userCompany.setCid(userVo.getCid());
				userCompany.setStatus(1);
				userCompany.setType(Constants.AREA_ADMIN);
				userCompany.setUid(user.getId());
				userCompany.setAccount(user.getAccount());
				userCompany.setAreaid(userVo.getAreaid());
				userCompany.setCityid(userVo.getCityid());
				userCompany.setProvinceid(userVo.getProvinceid());
				userCompany.setCityname(userVo.getCityname());
				userCompany.setProvincename(userVo.getProvincename());
				userCompany.setAreaname(userVo.getAreaname());

				// int count =
				// appUserCompanyMapper.selectCountByAreraAccount(userCompany);
				// if (count != 0) {
				// return new JsonResult(false, "该区域管理员已经存在!", null);
				// }
				appUserCompanyMapper.insertSelective(userCompany);

				authorityService.addUserRole(new SysUseRole(Integer.valueOf(user.getId().toString()), 0, SysUseRole.AREA_MANAGER));
			}
			/**
			 * 插入部门关联信息
			 */
			if (userVo.getOrgId() != null) {
				TAppUserOrg userOrg = appUserOrgMapper.selectByOidUid(userVo.getOrgId(), user.getId());
				if (null == userOrg) {
					userOrg = new TAppUserOrg();
					userOrg.setOid(userVo.getOrgId());
					userOrg.setStatus(1);
					userOrg.setSort(userVo.getSort());
					userOrg.setUid(user.getId());
					userOrg.setShortNum(userVo.getShortNum());
					userOrg.setPositionId(userVo.getJobId());
					userOrg.setEmail(userVo.getEmail());
					appUserOrgMapper.insertSelective(userOrg);
				} else {
					return new JsonResult(false, "不可在同一部门下添加相同人员！", null);
				}
			}
			result.setModel(user);
			result.setMessage("添加成功！");
		}
		return result;
	}

	@Override
	public Long selectParId(String account) {
		return appUserMapper.selectParId(account);
	}

	@Override
	public JsonResult resetPassword(String account) {
		TAppUser user = appUserMapper.selectByAccount(account);
		if (null != user) {
			String newPass = RandomUtil.createData(6);
			user.setPassword(RandomUtil.MD5(newPass));
			appUserMapper.updatePasswordByApp(user);
		}
		return new JsonResult(false, "用户信息不存在！", null);
	}
}
