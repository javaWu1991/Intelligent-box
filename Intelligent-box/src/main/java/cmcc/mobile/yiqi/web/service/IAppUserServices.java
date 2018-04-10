package cmcc.mobile.yiqi.web.service;

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;

import cmcc.mobile.yiqi.entity.TAppCompany;
import cmcc.mobile.yiqi.entity.TAppOrganization;
import cmcc.mobile.yiqi.entity.TAppUser;
import cmcc.mobile.yiqi.utils.JsonResult;
import cmcc.mobile.yiqi.vo.AppCompanyVo;
import cmcc.mobile.yiqi.vo.AppUserVo;
import cmcc.mobile.yiqi.vo.RegisterCompanyVo;

/**
 * 
 * @author zhangxs
 *
 */
public interface IAppUserServices {

	int deleteByPrimaryKey(Long id);

	int insert(TAppUser record);

	JsonResult insertSelective(AppUserVo record, Boolean isAdmin, HttpServletRequest request);

	TAppUser selectByPrimaryKey(Long id);

	int updateByPrimaryKeySelective(TAppUser record);

	int updateByPrimaryKey(TAppUser userVo);

	TAppUser loginCheck(String account, String password);

	List<TAppCompany> findCompanyByUser(Long id, String account, Boolean isApi);

	JsonResult selectAllByParams(AppUserVo userVo);

	JsonResult updateByPrimaryKeySelective(AppUserVo userVo);

	List<AppCompanyVo> companyOrgUser(long parseLong);

	JsonResult apiRegister(String name, String mobile, String pass, Integer sex, Boolean isAdminRegister);
	
	
	 List<TAppOrganization> selectOrgByCidAndHigherId(Long companyId, String orgId);

	JsonResult selectAllByOrgId(AppUserVo vo);

	JsonResult updateAdminStatus(String id, String cid, int oldStatus);

	JsonResult deleteUserCompany(String id, String cid, String uid,String rid);

	JsonResult deleteOrgUser(String orgId, String id);

	JsonResult importExcel(String cid, MultipartFile excel, HttpServletRequest request, HttpServletResponse response, Boolean isExport,
			Boolean isJunit, HSSFWorkbook workbook);

	void export(String cid, Boolean isNeedBak, HttpServletRequest request, HttpServletResponse response);

	JsonResult toTop(String id, String orgId, Integer sort);

	JsonResult setCompanyIsHide(String cid, int status, HttpServletRequest request);

	HashMap<String, Long> selectAllUsersByOrgid(Long orgId);

	List<TAppUser> selectUsersByOrgId(Long orgId);

	List<TAppUser> selectAll();

	TAppUser selectByAccount(String account);

	int updatePasswordByApp(TAppUser userVo);

	List<TAppUser> selectPendingApproval(String cid);

	JsonResult selectAllByParam(AppUserVo userVo);

	Long getCountPeolpeByOid(Long id);

	Long getCountPeopleByCid(Long cid);

	int selectCompanyByAccount(String account);

	JsonResult webRegister(RegisterCompanyVo vo, TAppUser user);

	JsonResult listCustomer(AppUserVo userVo);

	JsonResult insertSelectiveAreaManager(AppUserVo userVo, Boolean isAdmin, HttpServletRequest request);

	Long selectParId(String account);

	JsonResult resetPassword(String account);
}
