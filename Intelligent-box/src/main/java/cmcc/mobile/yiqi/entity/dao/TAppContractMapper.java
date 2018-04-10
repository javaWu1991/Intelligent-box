package cmcc.mobile.yiqi.entity.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import cmcc.mobile.yiqi.entity.TAppContract;
import tk.mybatis.mapper.common.Mapper;

public interface TAppContractMapper extends Mapper<TAppContract> {
	
	@Select("select * from t_app_contract where (name like #{param} or number like #{param}) and cid = #{cid}")
	List<TAppContract> queryForNameNumber(@Param("param")String param,@Param("cid")String cid);
	
}