package cmcc.mobile.yiqi.entity.dao;

import java.util.List;

import cmcc.mobile.yiqi.entity.TAppPosition;

public interface TAppPositionMapper {

	List<TAppPosition> selectAllByCid(Integer cid);
	
	int addPosition(TAppPosition position);
	
	int updatePosition(TAppPosition position);
	
	int deleteById(Integer id);

	List<TAppPosition> selectByCidAndName(TAppPosition position);

}
