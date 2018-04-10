package cmcc.mobile.yiqi.entity.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import cmcc.mobile.yiqi.entity.TAppUser;
import cmcc.mobile.yiqi.entity.TAppUserCompany;
import cmcc.mobile.yiqi.vo.AppUserVo;
import cmcc.mobile.yiqi.vo.DeleteExportExcelVo;

public interface TAppUserMapper {
	int deleteByPrimaryKey(Long id);

	int insert(TAppUser record);

	int insertSelective(TAppUser record);

	TAppUser selectByPrimaryKey(Long id);
	
	int updatePasswordByApp(TAppUser record);

	int updateByPrimaryKeySelective(TAppUser record);

	int updateByPrimaryKey(TAppUser record);

	TAppUser loginCheck(TAppUser user);

	List<TAppUser> selectAllByParams(AppUserVo userVo);

	int selectCountByParams(AppUserVo userVo);

	List<TAppUser> selectAllByOrgId(@Param("id") Long id);

	TAppUser selectByPhone(String mobile);

	TAppUser selectByAccount(@Param("account") String account);

	TAppUser selectByID(String mobile);

	List<DeleteExportExcelVo> selectExportUser(@Param("cid") Long cid);

	List<TAppUser> selectAllByOrgIdPage(AppUserVo vo);

	int selectCountByOrgIdPage(AppUserVo vo);

	List<TAppUser> selectAll();
	@Select("select mobile from t_app_user where id in (${ids})")
	List<String> getMobileByIds(@Param("ids")String ids);
	
	List<TAppUser> selectPendingApproval(String cid);

	List<TAppUserCompany> selectAllByParam(AppUserVo userVo);

	int selectCountByParam(AppUserVo userVo);

	//获取客户经理
	List<TAppUser> selectAllCustomer(AppUserVo userVo);
	//获取客户经理数量
	int selectCountCustomer(AppUserVo userVo);
	
	Long selectParId(@Param("account")String account);

	String selectHeardUrl(Long userId);

	TAppUser selectByMobileAndName(Map<String, Object> map);

	
}