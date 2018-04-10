package cmcc.mobile.yiqi.entity.dao;

import cmcc.mobile.yiqi.entity.TSysLog;

public interface TSysLogMapper {
    int deleteByPrimaryKey(Long id);

    int insert(TSysLog record);

    int insertSelective(TSysLog record);

    TSysLog selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(TSysLog record);

    int updateByPrimaryKey(TSysLog record);
}