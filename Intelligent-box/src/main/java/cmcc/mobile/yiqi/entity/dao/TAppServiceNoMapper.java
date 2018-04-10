package cmcc.mobile.yiqi.entity.dao;

import java.util.List;
import java.util.Map;


import cmcc.mobile.yiqi.entity.TAppServiceNo;

import cmcc.mobile.yiqi.vo.AppServiceNoVo;

public interface TAppServiceNoMapper {
	int deleteByPrimaryKey(Long id);

	int insert(TAppServiceNo record);

	int insertSelective(TAppServiceNo record);

	TAppServiceNo selectByPrimaryKey(Long id);

	int updateByPrimaryKeySelective(TAppServiceNo record);

	int updateByPrimaryKeyWithBLOBs(TAppServiceNo record);

	int updateByPrimaryKey(TAppServiceNo record);

	List<AppServiceNoVo> selectByHistroyNotice(Map<String, Object> map);

	List<TAppServiceNo> findByOriginNotice(Long record);

	List<TAppServiceNo> selectAllParams(Map<String, Object> map);

	Long selectCountAllParams(Map<String, Object> map);

	int selectCountByHistroyNotice(Map<String, Object> map);
}