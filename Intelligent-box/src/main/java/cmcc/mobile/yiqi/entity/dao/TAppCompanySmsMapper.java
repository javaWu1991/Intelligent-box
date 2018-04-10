package cmcc.mobile.yiqi.entity.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import cmcc.mobile.yiqi.entity.TAppCompanySms;

public interface TAppCompanySmsMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(TAppCompanySms record);

    int insertSelective(TAppCompanySms record);

    TAppCompanySms selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(TAppCompanySms record);

    int updateByPrimaryKey(TAppCompanySms record);
    
    @Select("select sid from t_app_company_sms where mid =#{mid}")
    List<String> getSidByMid(@Param("mid")Integer mid);
}