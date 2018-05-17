package cmcc.mobile.yiqi.web.service;

import java.util.List;

import cmcc.mobile.yiqi.entity.TAppCompany;
import cmcc.mobile.yiqi.entity.TAppServiceNo;
import cmcc.mobile.yiqi.utils.JsonResult;

import cmcc.mobile.yiqi.vo.AppServiceNoVo;
import cmcc.mobile.yiqi.vo.PageVo;

public interface TAppServiceNoService {

	int deleteByPrimaryKey(Long id);
 
	int insert(TAppServiceNo record);

	int insertSelective(TAppServiceNo record);

	TAppServiceNo selectByPrimaryKey(Long id);

	int updateByPrimaryKeySelective(TAppServiceNo record);

	int updateByPrimaryKeyWithBLOBs(TAppServiceNo record);

	int updateByPrimaryKey(AppServiceNoVo record);

	JsonResult selectByHistroyNotice(String cid, PageVo vo, Boolean isSuper, Object isAdminLogin,
			List<TAppCompany> list, String title, String beginTime, String endTime,Long appid);

	List<TAppServiceNo> findByOriginNotice(Long record);

	//int save(AppServiceNoVo record,Boolean isJunit);

	String selectReceivers(Long id);

	JsonResult selectAllParams(AppServiceNoVo vo);

	JsonResult checkMessageUpdate(AppServiceNoVo vo);
}
