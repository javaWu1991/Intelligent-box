package cmcc.mobile.yiqi.entity.dao;

import java.util.List;
import java.util.Map;

import cmcc.mobile.yiqi.entity.TAppProduct;

public interface TAppProductMapper {
    int deleteByPrimaryKey(Long id);

    int insertSelective(TAppProduct record);

    TAppProduct selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(TAppProduct record);

	List<TAppProduct> selectByMachineId(Map<String, Object> map);

	TAppProduct selectByMachineIdAndContainerNumber(TAppProduct tAppProduct);

	void updateByCode(TAppProduct tAppProduct);

	void updateByNumber(TAppProduct tAppProduct);

	List<TAppProduct> selectByMachine(String machineId);

	List<TAppProduct> selectByCorp(Map<String, Object> map);

	int selectByCorpCount(Map<String, Object> map);

	TAppProduct selectByCode(String orderCode);

	void updateByPrimaryKey(TAppProduct tAppProduct);

	int selectByProductStatus(String machineId);

	int selectByDefaultProduct();

	int selectByDefaultProductAndContainerNumber(String containerNumber);

	int insertDefaultProduct(TAppProduct tAppProduct);

	List<TAppProduct> selectDefaultProduct();

	int updateDefaultProduct(TAppProduct tAppProduct);

	void insertButhProduct(List<TAppProduct> tAppProducts);

	void updateByMachine(TAppProduct tAppProduct);

}