package cmcc.mobile.yiqi.web.service;

import cmcc.mobile.yiqi.utils.JsonResult;
import cmcc.mobile.yiqi.vo.AppUserVo;

public interface TAppAreaService {



	JsonResult updateCompany(AppUserVo recond);

	JsonResult deleteArea(String tid,String uid, String rid);

	JsonResult updateAreaStatus(String tid,int status);

}
