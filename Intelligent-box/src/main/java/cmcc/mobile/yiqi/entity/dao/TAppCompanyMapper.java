package cmcc.mobile.yiqi.entity.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import cmcc.mobile.yiqi.entity.TAppCompany;
import cmcc.mobile.yiqi.entity.TAppUserCompany;
import cmcc.mobile.yiqi.vo.CompanyListVo;

public interface TAppCompanyMapper {
    int deleteByPrimaryKey(Long id);

    int insert(TAppCompany record);

    int insertSelective(TAppCompany record);

    TAppCompany selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(TAppCompany record);

    int updateByPrimaryKey(TAppCompany record);

	List<TAppCompany> selectByPrimaryKeys(List<Long> ids);
	
	  
    List<CompanyListVo> selectByIdList(@Param("item")List<TAppUserCompany> tAppUserCompanys);

	List<TAppCompany> selectUnDeleteCompany(@Param("managerId")Long managerId,@Param("areaId")String areaId,@Param("name")String name);
	
	
	@Select("select * from t_app_company where code = #{code}")
	TAppCompany byCode(@Param("code")String code);
	
	
	@Select("select count(*) from t_app_company where creator=#{creator} and status!=3")
	int getCountCompanyByCreator(String account);
@Select("select * from t_app_company where areaId in (${areaIds})")
	List<TAppCompany> getCompanyByAreaIds(@Param("areaIds")String areaIds);
@Update("update t_app_company set managerId = #{account} where id =#{cid}")
int setCustomerManager(@Param("cid")Long cid, @Param("account")Long account);
@Update("update t_app_company set managerId = null where id =#{cid}")
int deleteCustomerManager(@Param("cid")Long cid);
@Select("select * from t_app_company where managerId = #{account}")
TAppCompany byAccount(@Param("account")String account);

}