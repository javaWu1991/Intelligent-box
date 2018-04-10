package cmcc.mobile.yiqi.web.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cmcc.mobile.yiqi.entity.SysResource;
import cmcc.mobile.yiqi.entity.SysRole;
import cmcc.mobile.yiqi.entity.SysUseRole;
import cmcc.mobile.yiqi.entity.dao.SysResourceMapper;
import cmcc.mobile.yiqi.entity.dao.SysRoleMapper;
import cmcc.mobile.yiqi.entity.dao.SysUseRoleMapper;
import cmcc.mobile.yiqi.utils.ShiroUtil;
import cmcc.mobile.yiqi.web.service.IAuthorityService;

@Service
public class AuthorityServiceImpl implements IAuthorityService {

	@Autowired
	SysUseRoleMapper sysUseRoleMapper;

	@Autowired
	SysRoleMapper sysRoleMapper;

	@Autowired
	SysResourceMapper sysResourceMapper;

	@Override
	public Set<String> getRoleIdentify(Integer uid, Integer cid) {
		List<SysRole> sysroles = sysRoleMapper.byUidCid(uid, cid);
		Set<String> roles = new HashSet<>();
		for (SysRole sysRole : sysroles) {
			roles.add(sysRole.getRole());
		}
		return roles;
	}

	@Override
	public Set<String> getRoleIdentify(Integer rid) {
		SysRole role = sysRoleMapper.selectByPrimaryKey(Long.parseLong(rid.toString()));
		Set<String> roles = new HashSet<>();
		roles.add(role.getRole());
		return roles;
	}

	@Override
	public Set<String> getPermission(Integer uid, Integer cid) {
		List<SysRole> sysroles = sysRoleMapper.byUidCid(uid, cid);
		String resourcesId = "";
		for (SysRole sysRole : sysroles) {
			resourcesId += sysRole.getResource_ids() + ",";
		}
		Set<String> resourcesSet = new HashSet<>();
		if (resourcesId.indexOf(",") != -1) {
			resourcesId = resourcesId.substring(0, resourcesId.length() - 1);
			List<SysResource> resources = sysResourceMapper.byIds(resourcesId);
			for (SysResource sysResource : resources) {
				resourcesSet.add(sysResource.getPermission());
			}
		}
		return resourcesSet;
	}

	@Override
	public Set<String> getPermission(Integer rid) {
		SysRole role = sysRoleMapper.selectByPrimaryKey(Long.parseLong(rid.toString()));
		Set<String> resourcesSet = new HashSet<>();
		String resourcesId = role.getResource_ids();
//		if (resourcesId.lastIndexOf(",") != -1) {
//			resourcesId = resourcesId.substring(0, resourcesId.length() - 1);
//		}
		List<SysResource> resources = sysResourceMapper.byIds(resourcesId);
		for (SysResource sysResource : resources) {
			resourcesSet.add(sysResource.getPermission());
		}
		return resourcesSet;
	}

	@Override
	public List<SysResource> getAllResource() {
		return sysResourceMapper.queryAll();
	}

	@Override
	public List<SysRole> getAllRole() {
		return sysRoleMapper.quetyAll();

	}

	@Override
	public void addRole(SysRole sysRole) {
		sysRoleMapper.insertSelective(sysRole);
		ShiroUtil.clearAllCache();
	}

	@Override
	public void updateRole(SysRole sysRole) {
		sysRoleMapper.updateByPrimaryKeySelective(sysRole);
		ShiroUtil.clearAllCache();
	}

	@Override
	public void deleteRole(Long id) {
		sysRoleMapper.deleteByPrimaryKey(id);
		ShiroUtil.clearAllCache();
	}

	@Override
	public void addUserRole(SysUseRole sysUseRole) {
		sysUseRoleMapper.insertForUpdate(sysUseRole);
	}

	@Override
	public void updateUserRole(String roleId, Integer cid, Integer uid) {
		if (cid == null) {
			cid = 0;
		}
		sysUseRoleMapper.deleteByUidCid(uid, cid);
		String[] roleIds = roleId.split(",");
		for (String string : roleIds) {
			if (string.length() > 0) {
				addUserRole(new SysUseRole(uid, cid, Integer.valueOf(string)));
			}
		}
	}

	@Override
	public void deleteUserRole(Integer id) {
		sysUseRoleMapper.deleteByPrimaryKey(id);
	}

	@Override
	public void deleteUserRoleByUidCidRid(String roleId, Integer cid, Integer uid) {
		sysUseRoleMapper.deleteUserRoleByUidCidRid(roleId, cid, uid);
	}

	
	@Override
	public List<SysUseRole> getUserRoleByUidCid(Integer uid, Integer cid) {
		return sysUseRoleMapper.byUidCid(uid, cid);
	}
}
