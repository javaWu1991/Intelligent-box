package cmcc.mobile.yiqi.entity.dao;

import cmcc.mobile.yiqi.entity.TAppbakExcel;

public interface TAppbakExcelMapper {
    int deleteByPrimaryKey(Long id);

    int insert(TAppbakExcel record);

    int insertSelective(TAppbakExcel record);

    TAppbakExcel selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(TAppbakExcel record);

    int updateByPrimaryKey(TAppbakExcel record);
}