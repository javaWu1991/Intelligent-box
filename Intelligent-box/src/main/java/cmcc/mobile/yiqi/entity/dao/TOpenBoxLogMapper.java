package cmcc.mobile.yiqi.entity.dao;

import cmcc.mobile.yiqi.entity.TOpenBoxLog;

public interface TOpenBoxLogMapper {
    int deleteByPrimaryKey(Long id);

    int insert(TOpenBoxLog record);

    int insertSelective(TOpenBoxLog record);

    TOpenBoxLog selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(TOpenBoxLog record);

    int updateByPrimaryKey(TOpenBoxLog record);
}