package cmcc.mobile.yiqi.web.service.impl;

import java.util.List;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cmcc.mobile.yiqi.entity.TAppPosition;
import cmcc.mobile.yiqi.entity.TAppUserOrg;
import cmcc.mobile.yiqi.entity.dao.TAppPositionMapper;
import cmcc.mobile.yiqi.entity.dao.TAppUserOrgMapper;
import cmcc.mobile.yiqi.utils.JsonResult;
import cmcc.mobile.yiqi.web.service.IPositionService;

@Service
public class PositionServiceImpl implements IPositionService {

	@Autowired
	private TAppPositionMapper tAppPositionMapper;

	@Autowired
	private TAppUserOrgMapper userOrgMapper;

	@Override
	public List<TAppPosition> queryAllPosition(Integer cid) {
		List<TAppPosition> list = tAppPositionMapper.selectAllByCid(cid);
		return list;
	}

	@Override
	public JsonResult addPosition(TAppPosition position) {
		/**
		 * 新增职位检查重名
		 */
		List<TAppPosition> list = tAppPositionMapper.selectByCidAndName(position);

		if (CollectionUtils.isNotEmpty(list)) {
			return new JsonResult(false, "同职级下已存在相同名称的职位，请修改后提交！", null);
		}
		tAppPositionMapper.addPosition(position);
		return new JsonResult(true, "添加成功！", null);
	}

	@Override
	public JsonResult updatePosition(TAppPosition position) {
		List<TAppPosition> list = tAppPositionMapper.selectByCidAndName(position);
		if (CollectionUtils.isNotEmpty(list)) {
			for (TAppPosition tAppPosition : list) {
				if (!position.getId().equals(tAppPosition.getId())) {
					return new JsonResult(false, "同职级下已存在相同名称的职位，请修改后提交！", null);
				}
			}
		}
		tAppPositionMapper.updatePosition(position);
		return new JsonResult(true, "编辑成功！", null);
	}

	@Override
	public JsonResult deleteById(Integer id) {
		List<TAppUserOrg> list = userOrgMapper.selectAllByPositionId(id);
		if (CollectionUtils.isNotEmpty(list)) {
			return new JsonResult(false, "当前职位下有用户存在，不可删除！", null);
		}
		int i = tAppPositionMapper.deleteById(id);
		if (i == 1) {
			return new JsonResult(true, "删除成功！", null);
		}
		return new JsonResult(false, "职位已删除！", null);
	}

}
