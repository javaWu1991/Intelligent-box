package cmcc.mobile.yiqi.web.service;

import java.util.List;
import java.util.Set;

import cmcc.mobile.yiqi.entity.SysResource;
import cmcc.mobile.yiqi.entity.SysRole;
import cmcc.mobile.yiqi.entity.SysUseRole;

public interface IAuthorityService {

	Set<String> getRoleIdentify(Integer uid, Integer cid);

	Set<String> getRoleIdentify(Integer rid);

	Set<String> getPermission(Integer uid, Integer cid);

	List<SysResource> getAllResource();

	void addRole(SysRole sysRole);

	void updateRole(SysRole sysRole);

	void deleteRole(Long id);

	List<SysRole> getAllRole();

	void addUserRole(SysUseRole sysUseRole);

	void deleteUserRole(Integer id);

	List<SysUseRole> getUserRoleByUidCid(Integer uid, Integer cid);

	void updateUserRole(String roleId, Integer cid, Integer uid);

	void deleteUserRoleByUidCidRid(String roleId, Integer cid, Integer uid);

	Set<String> getPermission(Integer rid);

}
