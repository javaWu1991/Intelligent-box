package cmcc.mobile.yiqi.entity.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import cmcc.mobile.yiqi.entity.TAppUserOrg;

public interface TAppUserOrgMapper {
	int deleteByPrimaryKey(Long id);

	int insert(TAppUserOrg record);

	int insertSelective(TAppUserOrg record);

	TAppUserOrg selectByPrimaryKey(Long id);

	int updateByPrimaryKeySelective(TAppUserOrg record);

	int updateByPrimaryKey(TAppUserOrg record);

	TAppUserOrg selectByOidUid(@Param("oid") Long orgId, @Param("uid") Long id);

	List<TAppUserOrg> selectAllByOid(@Param("oid") Long orgId);

	int updateUserOrg(@Param("uid") Long uid, @Param("oid") Long oid, @Param("cid") Long cid,
			@Param("positionId") Long positionId, @Param("shortNum") String shortNum);
	
	@Select("select count(distinct uid) from t_app_userorg where oid = #{oid}")
	Long countPeopleByOid(@Param("oid")Long oid);
	
	@Select("select distinct * from t_app_userorg where position_id = #{position_id}")
	List<TAppUserOrg> selectAllByPositionId(@Param("position_id")Integer id);
}