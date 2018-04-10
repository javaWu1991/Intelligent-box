package cmcc.mobile.yiqi.web.service;

import java.util.List;
import java.util.Map;

import cmcc.mobile.yiqi.entity.TAppOrganization;
import cmcc.mobile.yiqi.entity.TAppUser;
import cmcc.mobile.yiqi.utils.JsonResult;
import cmcc.mobile.yiqi.vo.AppOrganizationVo;

public interface IAppOrganizationService {

	JsonResult deleteByPrimaryKey(Long id);

	int insert(TAppOrganization record);

	int insertSelective(TAppOrganization record);

	TAppOrganization selectByPrimaryKey(Long id);

	int updateByPrimaryKeySelective(TAppOrganization record);

	int updateByPrimaryKey(TAppOrganization record);

	List<TAppOrganization> selectByCompanyId(Long id);

	List<TAppOrganization> selectOrgByCidAndHigherId(TAppOrganization org);

	JsonResult insertOrUpdate(AppOrganizationVo vo);

	Map<String, TAppUser> queryUsersByOrgIds(String[] orgIds);

	List<AppOrganizationVo> selectAllOrganization(long parseLong);

}
