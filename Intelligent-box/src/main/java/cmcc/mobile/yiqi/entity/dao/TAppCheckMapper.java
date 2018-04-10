package cmcc.mobile.yiqi.entity.dao;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import cmcc.mobile.yiqi.entity.TAppCheck;
import tk.mybatis.mapper.common.Mapper;
import tk.mybatis.mapper.common.MySqlMapper;

public interface TAppCheckMapper extends Mapper<TAppCheck>,MySqlMapper<TAppCheck> {
	
	@Select("SELECT * from t_app_check where pmid = #{pmid} order by createTime desc limit 1")
	public TAppCheck selectLatestCheckByPmId(@Param("pmid")Long pmId);
	
	@Select("SELECT * from t_app_check where pmid = #{pmid} order by createTime limit 1,1")
	public TAppCheck selectSecondCheckByPmId(@Param("pmid")Long pmId);
}