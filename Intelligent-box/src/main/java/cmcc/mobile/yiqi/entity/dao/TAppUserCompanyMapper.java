package cmcc.mobile.yiqi.entity.dao;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import cmcc.mobile.yiqi.entity.TAppUser;
import cmcc.mobile.yiqi.entity.TAppUserCompany;
import cmcc.mobile.yiqi.vo.AppUserVo;

public interface TAppUserCompanyMapper {
	int deleteByPrimaryKey(Long id);

	int insert(TAppUserCompany record);

	int insertSelective(TAppUserCompany record);

	TAppUserCompany selectByPrimaryKey(Long id);

	int updateByPrimaryKeySelective(TAppUserCompany record);

	int updateByPrimaryKey(TAppUserCompany record);

	List<TAppUserCompany> selectAllByUID(Long id);

	TAppUserCompany selectByUIDCID(@Param("account") String account, @Param("cid") Long cid);

	/**
	 * 
	 * 根据uid和type查询关联关系，type可传null
	 */
	List<TAppUserCompany> selectByAccountAndType(@Param("account") String id, @Param("type") Integer type, @Param("startRow") Integer pageNo,
			@Param("endRow") Integer pageSize);

	int selectCountByAccountAndType(@Param("account") String id, @Param("type") Integer type);

	List<TAppUser> selectByCid(@Param("cid") Long id, @Param("type") Integer type);

	List<TAppUserCompany> selectByName(@Param("account") String account, @Param("name") String name, @Param("startRow") Integer pageNo,
			@Param("endRow") Integer pageSize);

	int selectCountByName(@Param("account") String account, @Param("name") String name);

	void deleteByCid(@Param("cid") Long id);

	List<TAppUserCompany> selectAllByAccount(@Param("account") String account);

	List<AppUserVo> selectAllByParam(AppUserVo userVo);

	int selectCountByParam(AppUserVo userVo);

	int updateByAreaAdmin(TAppUserCompany userCompany);

	@Select("select  GROUP_CONCAT(areaid)  from t_app_user_company where account = #{account}  and areaid is not null group by account")
	Object getAreaId(@Param("account") String account);

	int selectCountByAreraAccount(Integer areaid, String account);

	int selectCountByAreraAccount(TAppUserCompany userCompany);

	TAppUserCompany selectByUIDCID(TAppUserCompany companys);

	TAppUserCompany selectByCidAccountType(@Param("cid") Long i, @Param("account") String account, @Param("type") int j);
	@Delete("delete from t_app_user_company where account = #{account} and cid= #{cid} and type = #{type} ")
	int deleteByCidAccountType(@Param("cid") Long i, @Param("account") String account, @Param("type") int j);
}