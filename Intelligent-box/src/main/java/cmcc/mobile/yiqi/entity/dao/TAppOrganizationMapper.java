package cmcc.mobile.yiqi.entity.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import cmcc.mobile.yiqi.entity.TAppOrganization;

public interface TAppOrganizationMapper {
	int deleteByPrimaryKey(Long id);

	int insert(TAppOrganization record);

	int insertSelective(TAppOrganization record);

	TAppOrganization selectByPrimaryKey(Long id);

	int updateByPrimaryKeySelective(TAppOrganization record);

	int updateByPrimaryKey(TAppOrganization record);

	List<TAppOrganization> selectByCompanyId(Long id);

	List<TAppOrganization> selectOrgByCidAndHigherId(TAppOrganization org);

	List<TAppOrganization> selectAllByCidsUid(Map<String, Object> map);

	List<TAppOrganization> selectAllByUid(Long id);

	List<TAppOrganization> selectByNameAndCid(@Param("orgName") String parentName, @Param("cid") Long company);

	TAppOrganization selectByPathAndCid(@Param("path") String path, @Param("cid") Long company);

	List<TAppOrganization> selectAllByUserId(Long userId);

	TAppOrganization selctByOrgName(String orgName);

}