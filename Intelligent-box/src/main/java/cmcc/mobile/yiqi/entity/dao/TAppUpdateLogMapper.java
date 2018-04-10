package cmcc.mobile.yiqi.entity.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import cmcc.mobile.yiqi.entity.TAppUpdateLog;

public interface TAppUpdateLogMapper {
	int deleteByPrimaryKey(Long id);

	int insert(TAppUpdateLog record);

	int insertSelective(TAppUpdateLog record);

	TAppUpdateLog selectByPrimaryKey(Long id);

	int updateByPrimaryKeySelective(TAppUpdateLog record);

	int updateByPrimaryKey(TAppUpdateLog record);

	TAppUpdateLog selectNewVersionByVersion(@Param("type") Integer type);

	List<TAppUpdateLog> selectByMap(Map<String, Object> map);

	int selectCountByMap(Map<String, Object> map);
}