package cmcc.mobile.yiqi.web.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cmcc.mobile.yiqi.entity.TAppOrganization;
import cmcc.mobile.yiqi.entity.TAppUser;
import cmcc.mobile.yiqi.entity.dao.TAppOrganizationMapper;
import cmcc.mobile.yiqi.entity.dao.TAppUserMapper;
import cmcc.mobile.yiqi.utils.JsonResult;
import cmcc.mobile.yiqi.vo.AppOrganizationVo;
import cmcc.mobile.yiqi.web.service.IAppOrganizationService;

@Service
public class AppOrganizationServiceImpl implements IAppOrganizationService {

	@Autowired
	private TAppOrganizationMapper appOrganizationMapper;

	@Autowired
	private TAppUserMapper appUserMapper;

	@Override
	public JsonResult deleteByPrimaryKey(Long id) {
		TAppOrganization org = appOrganizationMapper.selectByPrimaryKey(id);
		if (null != org) {
			TAppOrganization org1 = new TAppOrganization();
			org1.setCid(org.getCid());
			org1.setId(org.getId());
			List<TAppOrganization> orgs = new ArrayList<>();
			orgs.add(org1);
			List<AppOrganizationVo> vos = AllOrgs(orgs);
			if (CollectionUtils.isNotEmpty(vos.get(0).getOrgs())) {
				return new JsonResult(false, "该部门下有子部门，不可删除！", null);
			}
			List<TAppUser> users = appUserMapper.selectAllByOrgId(id);
			if (CollectionUtils.isEmpty(users)) {
				appOrganizationMapper.deleteByPrimaryKey(id);
				return new JsonResult(true, "操作成功！", null);
			}
			return new JsonResult(false, "该部门下有员工存在！不可删除", null);
		}
		return new JsonResult(false, "部门已删除！", null);
	}

	/**
	 * 获取公司所有组织结构
	 */
	@Override
	public List<AppOrganizationVo> selectAllOrganization(long parseLong) {
		TAppOrganization org = new TAppOrganization();
		org.setCid(parseLong);
		org.setHigherId(0L);
		List<TAppOrganization> first = appOrganizationMapper.selectOrgByCidAndHigherId(org);
		List<AppOrganizationVo> allOrgs = AllOrgs(first);
		return allOrgs;
	}

	public List<AppOrganizationVo> AllOrgs(List<TAppOrganization> orgs) {
		List<AppOrganizationVo> list = new ArrayList<>();
		for (TAppOrganization tAppOrganization : orgs) {
			// 查询所有部门下人员
			AppOrganizationVo orgVo = new AppOrganizationVo();
			BeanUtils.copyProperties(tAppOrganization, orgVo);
			// 查询次级部门
			tAppOrganization.setHigherId(tAppOrganization.getId());
			List<TAppOrganization> childOrg = appOrganizationMapper.selectOrgByCidAndHigherId(tAppOrganization);
			// 递归
			if (CollectionUtils.isNotEmpty(childOrg)) {
				List<AppOrganizationVo> childs = AllOrgs(childOrg);
				orgVo.setOrgs(childs);
			}
			// 参数封装
			list.add(orgVo);
		}
		return list;
	}

	@Override
	public int insert(TAppOrganization record) {
		return 0;
	}

	@Override
	public int insertSelective(TAppOrganization record) {
		record.setCreateTime(System.currentTimeMillis() / 1000);
		appOrganizationMapper.insertSelective(record);

		return 0;
	}

	@Override
	public JsonResult insertOrUpdate(AppOrganizationVo vo) {

		/**
		 * 校验部门名称
		 */
		List<TAppOrganization> list = appOrganizationMapper.selectByNameAndCid(vo.getOrgName(), vo.getCid());
		if (CollectionUtils.isNotEmpty(list)) {
			if (list.get(0).getOrgName().equals(vo.getOrgName())) {
				if (null == vo.getId()) {
					return new JsonResult(false, "该公司下已存在相同名称的部门，不可重复添加！", null);
				} else if (!vo.getId().equals(list.get(0).getId())) {
					return new JsonResult(false, "该公司下已存在相同名称的部门，请更换部门名称！", null);
				}
			}
		}

		vo.setCreateTime(System.currentTimeMillis());
		TAppOrganization organization = new TAppOrganization();
		BeanUtils.copyProperties(vo, organization);

		if (null == organization.getId()) {
			//organization.setSort(10);
			appOrganizationMapper.insertSelective(organization);
		}
		/**
		 * 新增维护fullPath与pathId字段
		 */
		String path = "";
		String pathId = "";
		if (organization.getHigherId() == 0) {
			path = organization.getOrgName();
			pathId = organization.getId().toString();
		} else {
			TAppOrganization org = appOrganizationMapper.selectByPrimaryKey(organization.getHigherId());
			if (null != org) {
				path = org.getFullPath() + "/" + organization.getOrgName();
				pathId = org.getId().toString() + "/" + organization.getId().toString();
			}
		}
		organization.setFullPath(path);
		organization.setPathId(pathId);
		organization.setUpdateTime(System.currentTimeMillis());
		appOrganizationMapper.updateByPrimaryKeySelective(organization);
		return new JsonResult(true, "操作成功！", organization);
	}

	@Override
	public TAppOrganization selectByPrimaryKey(Long id) {
		return null;
	}

	@Override
	public int updateByPrimaryKeySelective(TAppOrganization record) {
		return 0;
	}

	@Override
	public int updateByPrimaryKey(TAppOrganization record) {
		return 0;
	}

	@Override
	public List<TAppOrganization> selectByCompanyId(Long id) {
		return null;
	}

	@Override
	public List<TAppOrganization> selectOrgByCidAndHigherId(TAppOrganization org) {
		return appOrganizationMapper.selectOrgByCidAndHigherId(org);
	}

	/**
	 * 获取部门下所有人员信息
	 */
	@Override
	public Map<String, TAppUser> queryUsersByOrgIds(String[] orgIds) {

		if (orgIds == null || orgIds.length == 0)
			return null;

		Map<String, TAppUser> mapUsers = new HashMap<String, TAppUser>();
		List<TAppOrganization> orgs = new ArrayList<TAppOrganization>();
		for (String orgId : orgIds) {
			TAppOrganization appOrganization = new TAppOrganization();
			appOrganization.setId(Long.parseLong(orgId));
		}

		orgUsers(orgs, mapUsers);

		return mapUsers;
	}

	/**
	 * 递归获取部门下所有人员信息
	 * 
	 * @param orgs
	 * @param mapUsers
	 */
	private void orgUsers(List<TAppOrganization> orgs, Map<String, TAppUser> mapUsers) {
		for (TAppOrganization appOrganization : orgs) {
			// 查询所有部门下人员
			List<TAppUser> users = appUserMapper.selectAllByOrgId(appOrganization.getId());
			for (TAppUser tAppUser : users) {
				mapUsers.put(String.valueOf(tAppUser.getId()), tAppUser);
			}
			// 查询次级部门
			AppOrganizationVo tAppOrganization = new AppOrganizationVo();
			tAppOrganization.setHigherId(appOrganization.getId());
			List<TAppOrganization> childOrg = appOrganizationMapper.selectOrgByCidAndHigherId(tAppOrganization);
			// 递归
			if (CollectionUtils.isNotEmpty(childOrg)) {
				orgUsers(childOrg, mapUsers);
			}
		}
	}
}
