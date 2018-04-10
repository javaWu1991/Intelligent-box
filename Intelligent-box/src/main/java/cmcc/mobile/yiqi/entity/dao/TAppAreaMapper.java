package cmcc.mobile.yiqi.entity.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import cmcc.mobile.yiqi.entity.TAppArea;

public interface TAppAreaMapper {
	int deleteByPrimaryKey(Integer id);

	// int insert(TAppArea appArea);

	int insertSelective(TAppArea record);

	TAppArea selectByPrimaryKey();

	int updateByPrimaryKeySelective(TAppArea record);

	int updateByPrimaryKey(TAppArea record);

	@Select("call showChildLst(${id},${deep})")
	List<TAppArea> byDeepId(@Param("id") Integer id, @Param("deep") Integer deep);

	int editarea(TAppArea appArea);

	int deletecity(Long did);

	List<TAppArea> selectParent(Integer id);

	List<TAppArea> selectarea(Integer level);

	int selectAreaCount(TAppArea appArea);

}