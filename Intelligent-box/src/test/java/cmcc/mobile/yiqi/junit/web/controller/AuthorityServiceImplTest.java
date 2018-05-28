package cmcc.mobile.yiqi.junit.web.controller;

import static org.junit.Assert.assertEquals;

import java.util.List;
import java.util.Set;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import cmcc.mobile.yiqi.entity.SysUseRole;
import cmcc.mobile.yiqi.junit.base.BaseJunit4Test;
import cmcc.mobile.yiqi.web.service.impl.AuthorityServiceImpl;

public class AuthorityServiceImplTest extends BaseJunit4Test {

	@Autowired
	private AuthorityServiceImpl authorityService;

	/**
	 * 测试 getRoleIdentify
	 */
	@Test
	public void getRoleIdentify() {
		Set<String> roles = authorityService.getRoleIdentify(1, 0);
		assertEquals(roles.size() == 1, true);
	}

	/**
	 * 测试 getPermission
	 */
	@Test
	public void getPermission() {
		authorityService.getPermission(1, 2);
		// System.out.println(autho.size());
		assertEquals(true, true);
	}

	/**
	 * 测试获取 getAllResource
	 */
	@Test
	public void getAllResource() {
		authorityService.getAllResource();
		// System.out.println(lists.size());
		assertEquals(true, true);
	}

	/**
	 * 测试获取getAllRole
	 */
	@Test
	public void getAllRole() {
		authorityService.getAllRole();
		assertEquals(true, true);
	}

	/**
	 * 三个权限管理框架，单元测试不便
	 */

	/**
	 * 测试 addUserRole
	 */
	@Test
	public void addUserRole() {
		SysUseRole userRole = new SysUseRole();
		userRole.setCid(119);
		userRole.setRid(110);
		userRole.setUid(120);

		authorityService.addUserRole(userRole);
		System.out.println(userRole.getCid());
		assertEquals(true, true);
	}

	/**
	 * 测试 updateUserRole
	 */
	@Test
	public void updateUserRole() {
		String roleId = "1";
		Integer cid = 999;
		Integer uid = 998;
		authorityService.updateUserRole(roleId, cid, uid);
		assertEquals(true, true);
	}

	/**
	 * 测试 deleteUserRole
	 */
	@Test
	public void deleteUserRole() {

		authorityService.deleteUserRole(103);
		assertEquals(true, true);

	}

	/**
	 * 测试 deleteUserRoleByUidCidRid
	 */

	@Test
	public void deleteUserRoleByUidCidRid() {

		authorityService.deleteUserRoleByUidCidRid("2", 20207, 10);
		assertEquals(true, true);

	}

	/**
	 * 测试 getUserRoleByUidCid
	 */
	@Test
	public void getUserRoleByUidCid() {
		List<SysUseRole> list = authorityService.getUserRoleByUidCid(1, 0);
		System.out.println(list.size());
		assertEquals(true, true);
	}

}
