package cmcc.mobile.yiqi.entity.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import cmcc.mobile.yiqi.entity.TAppEnterpriseServiceNumber;

public interface TAppEnterpriseServiceNumberMapper {
	
	List<TAppEnterpriseServiceNumber> selectByPrimaryKey(@Param("id") Long id, @Param("sid") Long sid);

	List<TAppEnterpriseServiceNumber> selectByLevelKey(@Param("fMenu") Long fMenu, @Param("level") Long level, @Param("sid") Long sid);

	int deleteBylevelKey(Long id);
	
	int insert(TAppEnterpriseServiceNumber record);
	
	int updateByPrimaryKey(TAppEnterpriseServiceNumber record);

	List<TAppEnterpriseServiceNumber> selectByFMenuKey(@Param("fMenu") Long fMenu, @Param("sid") Long sid);

	List<TAppEnterpriseServiceNumber> selectByInnLevelKey(@Param("level") Long level, @Param("sid") Long sid);

	List<TAppEnterpriseServiceNumber> selectBySid(Long sid);
	

}
