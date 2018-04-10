package cmcc.mobile.yiqi.entity.dao;

import org.apache.ibatis.annotations.Param;

import cmcc.mobile.yiqi.entity.TAppCompanyApply;

public interface TAppCompanyApplyMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(TAppCompanyApply record);

    int insertSelective(TAppCompanyApply record);

    TAppCompanyApply selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(TAppCompanyApply record);

    int updateByPrimaryKey(TAppCompanyApply record);
    
    TAppCompanyApply selectByCidAndUid(@Param("cid")Integer cid,@Param("aid")Integer aid);
}