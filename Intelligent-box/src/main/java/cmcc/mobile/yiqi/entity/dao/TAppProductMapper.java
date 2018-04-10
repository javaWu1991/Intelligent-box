package cmcc.mobile.yiqi.entity.dao;

import java.util.List;

import cmcc.mobile.yiqi.entity.TAppProduct;

public interface TAppProductMapper {
    int deleteByPrimaryKey(Long id);

    int insertSelective(TAppProduct record);

    TAppProduct selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(TAppProduct record);

	List<TAppProduct> selectByMachineId(String machineId);

	TAppProduct selectByMachineIdAndContainerNumber(TAppProduct tAppProduct);

	void updateByCode(TAppProduct tAppProduct);

	void updateByNumber(TAppProduct tAppProduct);

	List<TAppProduct> selectByMachine(String machineId);

	List<TAppProduct> selectByCorp(TAppProduct tAppProduct);

}