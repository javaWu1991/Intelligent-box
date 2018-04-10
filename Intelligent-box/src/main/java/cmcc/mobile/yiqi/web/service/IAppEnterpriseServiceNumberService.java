package cmcc.mobile.yiqi.web.service;

import java.util.List;

import cmcc.mobile.yiqi.entity.TAppEnterpriseServiceNumber;

public interface IAppEnterpriseServiceNumberService {

	
	
	List<TAppEnterpriseServiceNumber> selectByPrimaryKey(Long id, Long sid);

	int deleteBylevelKey(Long id);
	
	int insert(TAppEnterpriseServiceNumber record);
	
//	int updateByPrimaryKey(long id);

	int updateByPrimaryKey(TAppEnterpriseServiceNumber record);

	List<TAppEnterpriseServiceNumber> selectByFMenuKey(Long fMenu, Long sid);

	List<TAppEnterpriseServiceNumber> selectByInnLevelKey(Long level, Long sid);

	List<TAppEnterpriseServiceNumber> selectByLevelKey(Long fmenu, Long level, Long sid);

	List<TAppEnterpriseServiceNumber> selectBySid(Long sid);
}
