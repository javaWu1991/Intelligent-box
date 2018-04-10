package cmcc.mobile.yiqi.api.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.druid.util.StringUtils;

import cmcc.mobile.yiqi.entity.TAppPosition;
import cmcc.mobile.yiqi.utils.JsonResult;
import cmcc.mobile.yiqi.web.service.IPositionService;

/**
 * 职位管理接口
 * 
 * @author zhengshuang
 *
 */
@Controller
@RequestMapping("/position")
public class ApiPositionController extends ApiController {

	@Autowired
	private IPositionService positionService;

	@RequestMapping(value = "/list/{cid:\\d+}")
	@ResponseBody
	public JsonResult list(@PathVariable Integer cid) {
		if (cid == null) {
			return new JsonResult(false, "传参出错，请选择对应公司", "");
		}
		List<TAppPosition> positions = positionService.queryAllPosition(cid);
		return new JsonResult(true, "", positions);
	}

	/**
	 * 新增职位
	 * @param position
	 * @return
	 */
	@RequestMapping(value = "add", method = RequestMethod.POST)
	@ResponseBody
	public JsonResult addPosition(TAppPosition position) {
		if (position.getCid() == null || StringUtils.isEmpty(position.getPositionName()) || position.getLevel() == null) {
			return new JsonResult(false, "传参不合法，部分参数为空", "");
		}
		return positionService.addPosition(position);
	}

	@RequestMapping(value = "update", method = RequestMethod.POST)
	@ResponseBody
	public JsonResult updatePosition(TAppPosition position) {
		if (position.getId() == null || (StringUtils.isEmpty(position.getPositionName()) && position.getLevel() == null)) {
			return new JsonResult(false, "传参不合法，没有指定职位或没有更新内容", "");
		}
		return positionService.updatePosition(position);
	}

	/**
	 * 删除职位判断是否有人员关联
	 * 
	 * @param id
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "delete/{id}", method = RequestMethod.DELETE)
	@ResponseBody
	public JsonResult updatePosition(@PathVariable Integer id, HttpServletRequest request) {
		return positionService.deleteById(id);
	}
}
