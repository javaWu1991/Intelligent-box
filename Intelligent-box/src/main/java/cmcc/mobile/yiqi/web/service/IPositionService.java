package cmcc.mobile.yiqi.web.service;

import java.util.List;

import org.springframework.stereotype.Service;

import cmcc.mobile.yiqi.entity.TAppPosition;
import cmcc.mobile.yiqi.utils.JsonResult;

/**
 * 公司职位相关方法
 * @author zhengshuang
 *
 */

@Service("positionService")
public interface IPositionService {

	public List<TAppPosition> queryAllPosition(Integer cid);
	
	public JsonResult addPosition(TAppPosition position);

	public JsonResult updatePosition(TAppPosition position);
	
	public JsonResult deleteById(Integer id);
}
