package cmcc.mobile.yiqi.web.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import cmcc.mobile.yiqi.entity.TAppUser;
import cmcc.mobile.yiqi.entity.TAppUserCompany;
import cmcc.mobile.yiqi.entity.TAppUserOrg;
import cmcc.mobile.yiqi.entity.dao.TAppAreaMapper;
import cmcc.mobile.yiqi.entity.dao.TAppUserCompanyMapper;
import cmcc.mobile.yiqi.entity.dao.TAppUserMapper;
import cmcc.mobile.yiqi.entity.dao.TAppUserOrgMapper;
import cmcc.mobile.yiqi.utils.JsonResult;
import cmcc.mobile.yiqi.vo.AppUserVo;
import cmcc.mobile.yiqi.web.service.IAuthorityService;
import cmcc.mobile.yiqi.web.service.TAppAreaService;

@Service
public class AreaServiceImpl implements TAppAreaService {

	@Autowired
	TAppAreaMapper areaMapper;
	@Autowired
	private TAppUserMapper appUserMapper;
	@Autowired
	private TAppUserOrgMapper appUserOrgMapper;

	@Autowired
	private TAppUserCompanyMapper appUserCompanyMapper;

	@Autowired
	private IAuthorityService authorityService;

	// 修改区域管理员
	@Override
	public JsonResult updateCompany(AppUserVo recond) {

		TAppUser user = new TAppUser();
		if (null == recond.getId() && null == recond.getTid()) {
			return new JsonResult(false, "参数错误！ID不可为空", null);
		}
		BeanUtils.copyProperties(recond, user);
		user.setUpdateTime(System.currentTimeMillis());
		// user.setPassword(recond.getPassword()) ;
		user.setId(Long.valueOf(recond.getUid()));
		user.setMobile(recond.getMobile());
		user.setName(recond.getName());
		user.setSex(recond.getSex());
		appUserMapper.updateByPrimaryKeySelective(user);
		if (null == recond.getCid() && null == recond.getAreaid()) {
			return new JsonResult(true, "人员信息修改成功！", null);
		}
//		TAppUserCompany userCompany = new TAppUserCompany();
//		userCompany.setAreaid(0 == recond.getAreaid() ? 0 == recond.getCityid() ? recond.getProvinceid() : recond.getCityid() : recond.getAreaid());
//		userCompany.setProvinceid(recond.getProvinceid());
//		userCompany.setCityid(recond.getCityid());
//		userCompany.setAreaname(recond.getAreaname());
//		userCompany.setProvincename(recond.getProvincename());
//		userCompany.setCityname(recond.getCityname());
//		Long id = Long.valueOf(recond.getTid());
//		userCompany.setId(id);
//		appUserCompanyMapper.updateByAreaAdmin(userCompany);
		return new JsonResult(true, "人员信息修改成功！", null);

	}

	@Override
	public JsonResult deleteArea(String tid, String uid,String rid) {
		appUserCompanyMapper.deleteByPrimaryKey(Long.parseLong(tid));
		authorityService.deleteUserRoleByUidCidRid(rid, Integer.parseInt("0"), Integer.parseInt(uid));
		return new JsonResult(true, "删除成功", null);
	}

	@Override
	public JsonResult updateAreaStatus(String tid, int status) {
		TAppUserCompany company = new TAppUserCompany();
		company.setStatus(status);
		company.setId(Long.valueOf(tid));
		int result = appUserCompanyMapper.updateByPrimaryKeySelective(company);
		if (result == 1) {
			return new JsonResult(true, "操作成功", null);
		} else {
			return new JsonResult(false, "操作失败", null);
		}
	}

}
