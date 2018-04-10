package cmcc.mobile.yiqi.web.service;

import java.util.List;

import cmcc.mobile.yiqi.entity.TAppCompany;
import cmcc.mobile.yiqi.entity.TAppUser;
import cmcc.mobile.yiqi.entity.TAppUserCompany;
import cmcc.mobile.yiqi.utils.JsonResult;
import cmcc.mobile.yiqi.vo.PageVo;

public interface ICompanyService {
	TAppCompany selectByPrimaryKey(Long id);

	public void addCompany(String account, TAppCompany company, String tpassword, String tname);

	public void deleteCompany(Long userId, Long companyId);

	public boolean updateCompany(Long userId, TAppCompany tAppCompany);

	public List<TAppCompany> getCompany(Long userId, String name, Object areaId, PageVo pagevo);

	public List<TAppUserCompany> getCompanyByUid(Long userId, String name, PageVo pagevo);

	public List<TAppUser> getUserByCid(Long cid);

	JsonResult getByCode(String code);

	List<TAppCompany> selectCompanyByAreaId(Integer areaId);



}
