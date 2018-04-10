package cmcc.mobile.yiqi.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import cmcc.mobile.yiqi.entity.SysRole;
import cmcc.mobile.yiqi.entity.SysUseRole;
import cmcc.mobile.yiqi.utils.CheckoutUtil;
import cmcc.mobile.yiqi.utils.JsonResult;
import cmcc.mobile.yiqi.web.service.IAuthorityService;

@Controller
@RequestMapping("/web/authority")
public class AuthorityController {
	@Autowired
	private IAuthorityService authorityService;

	@RequestMapping(value = "getAllResource")
	@ResponseBody
	public JsonResult getAllResource() {
		return new JsonResult(true, "", authorityService.getAllResource());

	}

	@RequestMapping(value = "/getAllRole")
	@ResponseBody
	public JsonResult getAllRole() {
		return new JsonResult(true, "", authorityService.getAllRole());

	}

	@RequestMapping(value = "addRole", method = RequestMethod.POST)
	@ResponseBody
	public JsonResult addRole(SysRole sysRole) {
		if (!CheckoutUtil.checkOutParam(sysRole, new String[] { "role", "description", "resource_ids" })) {
			return CheckoutUtil.lackParam();
		}
		authorityService.addRole(sysRole);
		return new JsonResult(true, "", null);
	}

	@RequestMapping(value = "updateRole", method = RequestMethod.POST)
	@ResponseBody
	public JsonResult updateRole(SysRole sysRole) {
		if (!CheckoutUtil.checkOutParam(sysRole, new String[] { "id" })) {
			return CheckoutUtil.lackParam();
		}
		authorityService.updateRole(sysRole);
		return new JsonResult(true, "", null);
	}

	@RequestMapping(value = "deleteRole", method = RequestMethod.POST)
	@ResponseBody
	public JsonResult deleteRole(Long id) {
		if (!CheckoutUtil.checkOutParam(new Object[] { id })) {
			return CheckoutUtil.lackParam();
		}
		authorityService.deleteRole(id);
		return new JsonResult(true, "", null);
	}

	@RequestMapping(value = "addUserRole", method = RequestMethod.POST)
	@ResponseBody
	public JsonResult addUserRole(String roleId, Integer cid, Integer uid) {
		if (!CheckoutUtil.checkOutParam(new Object[] { uid, roleId })) {
			return CheckoutUtil.lackParam();
		}
		String[] roleIds = roleId.split(",");
		for (String string : roleIds) {
			authorityService.addUserRole(new SysUseRole(uid, cid, Integer.valueOf(string)));
		}
		return new JsonResult(true, "", null);
	}

	@RequestMapping(value = "deleteUserRole")
	@ResponseBody
	public JsonResult deleteUserRole(String id) {
		if (!CheckoutUtil.checkOutParam(new Object[] { id })) {
			return CheckoutUtil.lackParam();
		}
		String[] ids = id.split(",");
		for (String string : ids) {
			authorityService.deleteUserRole(Integer.valueOf(string));
		}
		return new JsonResult(true, "删除成功", null);
	}

	@RequestMapping(value = "updateUserRole")
	@ResponseBody
	public JsonResult updateUserRole(String roleId, Integer cid, Integer uid) {
		if (!CheckoutUtil.checkOutParam(new Object[] { uid })) {
			return CheckoutUtil.lackParam();
		}
		if (StringUtils.isEmpty(roleId)) {
			roleId = "";
		}
		authorityService.updateUserRole(roleId, cid, uid);
		return new JsonResult(true, "", null);
	}

	@RequestMapping(value = "getUserRoleByUidCid")
	@ResponseBody
	public JsonResult getUserRoleByUidCid(Integer uid, Integer cid) {
		if (!CheckoutUtil.checkOutParam(new Object[] { uid })) {
			return CheckoutUtil.lackParam();
		}
		if (cid == null) {
			cid = 0;
		}
		return new JsonResult(true, "", authorityService.getUserRoleByUidCid(uid, cid));
	}

	// @RequiresPermissions("role")
	@RequestMapping("/role")
	public ModelAndView role() {
		ModelAndView view = new ModelAndView("authority/role");
		return view;
	}
}
