package cmcc.mobile.yiqi.web.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cmcc.mobile.yiqi.base.Constants;
import cmcc.mobile.yiqi.entity.SysUseRole;
import cmcc.mobile.yiqi.entity.TAppArea;
import cmcc.mobile.yiqi.entity.TAppCompany;
import cmcc.mobile.yiqi.entity.TAppPosition;
import cmcc.mobile.yiqi.entity.TAppUser;
import cmcc.mobile.yiqi.entity.TAppUserCompany;
import cmcc.mobile.yiqi.entity.dao.TAppAreaMapper;
import cmcc.mobile.yiqi.entity.dao.TAppCompanyMapper;
import cmcc.mobile.yiqi.entity.dao.TAppPositionMapper;
import cmcc.mobile.yiqi.entity.dao.TAppUserCompanyMapper;
import cmcc.mobile.yiqi.entity.dao.TAppUserMapper;
import cmcc.mobile.yiqi.utils.JsonResult;
import cmcc.mobile.yiqi.utils.PageHelper;
import cmcc.mobile.yiqi.utils.RandomUtil;
import cmcc.mobile.yiqi.vo.AppOrganizationVo;
import cmcc.mobile.yiqi.vo.PageVo;
import cmcc.mobile.yiqi.web.service.IAppOrganizationService;
import cmcc.mobile.yiqi.web.service.IAppUserServices;
import cmcc.mobile.yiqi.web.service.IAuthorityService;
import cmcc.mobile.yiqi.web.service.ICompanyService;

/**
 * 
 * @author zzw 有关公司的各种操作
 */

@Service("companyService")
public class CompanyServiceImpl implements ICompanyService {

	@Autowired
	private TAppCompanyMapper tAppCompanyMapper;
	@Autowired
	private TAppUserCompanyMapper tAppUserCompanyMapper;
	@Autowired
	private TAppUserMapper tAppUserMapper;
	@Autowired
	private IAppUserServices appUserServices;

	@Autowired
	private TAppPositionMapper positionMapper;

	@Autowired
	private IAppOrganizationService organizationService;

	@Autowired
	private IAuthorityService authorityService;

	@Autowired
	private TAppAreaMapper tAppAreaMapper;

	/**
	 * 增加公司 公司表增加记录 关联表增加记录
	 * 
	 * @param companyCode
	 *            TODO
	 */
	@Override
	public void addCompany(String account, TAppCompany company, String tpassword, String tname) {

		company.setCreate_time(new Date().getTime());
		company.setStatus(TAppCompany.VALID);
		company.setCode(RandomUtil.createRandomCharData(6));
		company.setCreator(account);
		company.setIsHide(0);// 设置企业默认高管模式为不生效
		tAppCompanyMapper.insert(company);
		TAppUserCompany tAppUserCompany = new TAppUserCompany();
		tAppUserCompany.setCid(company.getId());
		// tAppUserCompany.setUid(userId);
		tAppUserCompany.setAccount(account);
		tAppUserCompany.setStatus(TAppUserCompany.VALID);
		tAppUserCompany.setType(TAppUserCompany.COMMON_ADMIN);
		tAppUserCompanyMapper.insert(tAppUserCompany);
		if (tpassword != null && tname != null && account != null) {
			appUserServices.apiRegister(tname, account, tpassword, null, true);
			TAppUser user = tAppUserMapper.selectByAccount(account);
			authorityService.addUserRole(new SysUseRole(Integer.valueOf(user.getId().toString()), Integer.valueOf(company.getId().toString()),
					SysUseRole.COMPANY_MANAGER));
			//
			user.setStatus(Constants.USER_CAN_USE);
			user.setPassword(null);
			tAppUserMapper.updateByPrimaryKeySelective(user);
		}
		if (tname != null) {
			TAppUser tAppUser = tAppUserMapper.selectByAccount(account);
			if (StringUtils.isNotEmpty(tAppUser.getName()) && tAppUser.getName().equals(account)) {
				tAppUser.setName(tname);
			}
			tAppUser.setStatus(Constants.USER_CAN_USE);
			tAppUser.setPassword(null);
			tAppUserMapper.updateByPrimaryKeySelective(tAppUser);
			authorityService.addUserRole(new SysUseRole(Integer.valueOf(tAppUser.getId().toString()), Integer.valueOf(company.getId().toString()),
					SysUseRole.COMPANY_MANAGER));
		}
	}

	/**
	 * 删除公司 根据userid获取该userid可管理的所有公司，若需要删除的公司在该列表内则删除
	 */
	public void deleteCompany(Long userId, Long companyId) {
		TAppUser tAppUser = tAppUserMapper.selectByPrimaryKey(userId);
		List<TAppUserCompany> tAppUserCompanies = tAppUserCompanyMapper.selectByAccountAndType(tAppUser.getAccount(), null, null, null);
		for (TAppUserCompany tAppUserCompany : tAppUserCompanies) {
			if (tAppUserCompany.getType().equals(TAppUserCompany.SUPER_ADMIN) || tAppUserCompany.getCid().equals(companyId)
					|| tAppUserCompany.getType().equals(TAppUserCompany.SUPER_ADMIN)) {
				TAppCompany tAppCompany = new TAppCompany();
				tAppCompany.setId(companyId);
				tAppCompany.setStatus(TAppCompany.DELETED);
				updateCompany(userId, tAppCompany);
				// tAppCompanyMapper.deleteByPrimaryKey(companyId);
				// tAppUserCompanyMapper.deleteByCid(companyId);
				if (tAppUserCompany.getCid() != null && tAppUserCompany.getCid() > 0) {
					tAppUserCompany.setStatus(TAppUserCompany.DELETED);
					tAppUserCompanyMapper.updateByPrimaryKeySelective(tAppUserCompany);
				}
				break;
			}
		}
	}

	/**
	 * 更新公司信息 只需传需要更新字段
	 */
	public boolean updateCompany(Long userId, TAppCompany tAppCompany) {
		// 如果要判断数据权限，要考虑超级管理员，还要考虑区域管理员，比较麻烦，先放一放
		// boolean status = false;
		// TAppUser tAppUser = tAppUserMapper.selectByPrimaryKey(userId);
		// List<TAppUserCompany> tAppUserCompanies =
		// tAppUserCompanyMapper.selectByAccountAndType(tAppUser.getAccount(),
		// null, null, null);
		// for (TAppUserCompany tAppUserCompany : tAppUserCompanies) {
		// if (tAppUserCompany.getCid() == null ||
		// tAppUserCompany.getCid().equals(tAppCompany.getId())) {
		// int i = tAppCompanyMapper.updateByPrimaryKeySelective(tAppCompany);
		// status = i == 1 ? true : false;
		// break;
		// }
		// }
		// return status;

		boolean status = false;
		if (!isAllow(userId, tAppCompany.getId())) {
			return status;
		}
		TAppUser tAppUser = tAppUserMapper.selectByPrimaryKey(userId);
		if (null != tAppUser) {
			int i = tAppCompanyMapper.updateByPrimaryKeySelective(tAppCompany);
			status = i == 1 ? true : false;
		}
		return status;
	}

	/**
	 * 查询user可管理的公司
	 */
	@Override
	public List<TAppCompany> getCompany(Long userId, String name, Object areaId, PageVo pagevo) {
		String areaIds = "";
		List<TAppArea> areas = new ArrayList<>();
		if (areaId != null) {
			for (String string : areaId.toString().split(",")) {
				areas.addAll(tAppAreaMapper.byDeepId(Integer.valueOf(string), 5));
			}
			for (TAppArea tAppArea : areas) {
				areaIds = areaIds + tAppArea.getId() + ",";
			}
			areaIds = areaIds.substring(0, areaIds.length() - 1);
		}
		PageHelper.startPage(pagevo);
		Subject subject = SecurityUtils.getSubject();
		if (subject.hasRole(SysUseRole.ADMIN_MANAGER_ROLE)) {
			return tAppCompanyMapper.selectUnDeleteCompany(null, null, name);
		} else if (subject.hasRole(SysUseRole.AREA_MANAGER_ROLE)) {
			return tAppCompanyMapper.selectUnDeleteCompany(null, areaIds, name);
		} 
			TAppUser appUser = appUserServices.selectByPrimaryKey(userId);
			return tAppCompanyMapper.selectUnDeleteCompany(Long.valueOf(appUser.getAccount()), null, name);
	}

	/**
	 * 根据名称查询公司
	 * 
	 * @param pageSize
	 * @param pageNo
	 * @param type
	 */
	public List<TAppUserCompany> getCompanyByUid(Long userId, String name, PageVo pageVo) {
		TAppUser tAppUser = tAppUserMapper.selectByPrimaryKey(userId);
		pageVo.setTotalCountAndPageTotal(tAppUserCompanyMapper.selectCountByName(tAppUser.getAccount(), name));
		List<TAppUserCompany> tAppUserCompanies = tAppUserCompanyMapper.selectByName(tAppUser.getAccount(), name, pageVo.getStartRow(),
				pageVo.getEndRow());
		return tAppUserCompanies;
	}

	@Override
	public JsonResult getByCode(String code) {
		TAppCompany company = tAppCompanyMapper.byCode(code);
		if (null != company) {
			if (company.getStatus() == Constants.COMPANY_WAIT_VALIDATE) {
				return new JsonResult(false, "企业审核中！", null);
			}
			if (company.getStatus() == Constants.COMPANY_DELETED) {
				return new JsonResult(false, "企业已删除！", null);
			}
			if (company.getStatus() == Constants.COMPANY_CANT_USE) {
				return new JsonResult(false, "企业已禁用！", null);
			}
			List<TAppPosition> list = positionMapper.selectAllByCid(Integer.parseInt(company.getId().toString()));
			List<AppOrganizationVo> organizations = organizationService.selectAllOrganization(company.getId());
			company.setOrganizations(organizations);
			company.setPositions(list);
			return new JsonResult(true, "", company);
		}
		return new JsonResult(false, "企业编码不存在！", null);
	}

	@Override
	public List<TAppCompany> selectCompanyByAreaId(Integer areaId) {

		List<TAppArea> areas = tAppAreaMapper.byDeepId(areaId, 5);
		String areaIds = "";
		for (TAppArea tAppArea : areas) {
			areaIds = areaIds + tAppArea.getId() + ",";
		}
		areaIds = areaIds.substring(0, areaIds.length() - 1);
		return tAppCompanyMapper.getCompanyByAreaIds(areaIds);
	}

	/**
	 * 查询公司里的所有user
	 */
	public List<TAppUser> getUserByCid(Long cid) {
		return tAppUserCompanyMapper.selectByCid(cid, null);
	}

	public TAppCompany selectByPrimaryKey(Long id) {
		return tAppCompanyMapper.selectByPrimaryKey(id);
	}

	private boolean isAllow(Long uid, Long cid) {
		TAppUser tAppUser = tAppUserMapper.selectByPrimaryKey(uid);
		Subject subject = SecurityUtils.getSubject();
		if (subject.hasRole(SysUseRole.ADMIN_MANAGER_ROLE)) {
			return true;
		} else if (subject.hasRole(SysUseRole.AREA_MANAGER_ROLE)) {
			List<TAppCompany> tAppCompanies = tAppCompanyMapper.selectUnDeleteCompany(null,
					tAppUserCompanyMapper.getAreaId(tAppUser.getAccount()).toString(), null);
			for (TAppCompany tAppCompany : tAppCompanies) {
				if (tAppCompany.getId().equals(cid)) {
					return true;
				}
			}
		} else if (subject.hasRole(SysUseRole.CUSTOMER_MANAGER_ROLE)) {
			TAppCompany tAppCompany = tAppCompanyMapper.byAccount(tAppUser.getAccount());
			return tAppCompany.getId().equals(cid);
		}
		return false;
	}
}
