package cmcc.mobile.yiqi.entity.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Insert;

import com.alibaba.fastjson.JSONObject;

import cmcc.mobile.yiqi.entity.BannerImg;
import cmcc.mobile.yiqi.entity.TAppProduct;
import cmcc.mobile.yiqi.entity.THeartbeat;
import cmcc.mobile.yiqi.entity.TIntelligentBuind;
import cmcc.mobile.yiqi.entity.TMachine;
import cmcc.mobile.yiqi.entity.TOpenBoxLog;
import cmcc.mobile.yiqi.entity.TProductLog;
import cmcc.mobile.yiqi.entity.TRefund;
import cmcc.mobile.yiqi.entity.TRegister;
import cmcc.mobile.yiqi.vo.ConsumeVo;
import cmcc.mobile.yiqi.vo.Product;
import cmcc.mobile.yiqi.vo.ProductVo;
import cmcc.mobile.yiqi.vo.RefundVo;

public interface IntelligentBoxMapper {

	List<String> selectAll(String imgUrl);

	void insertSelective(BannerImg bannerImg);

	void addReplenishment(TProductLog tProductLog);

	ConsumeVo selectByProduct(Long product_id);

	void insertOrder(Product product);

	void insertSocket(JSONObject jsonObject);

	List<ProductVo> getOrderList(Long corpId, Long userId, String type);

	List<ProductVo> getOrderList(Map<String, Object> map);

	List<ProductVo> getAllOrderList(Map<String, Object> map);

	List<ProductVo> getOrderDetail(Map<String, Object> map);

	int getOrderDetailCount(Map<String, Object> map);

	RefundVo selectByRefund(Long productId);

	void insetRefund(TRefund tRefund);

	void updateOrder(String orderCode);

	void updateOrderByCode(Product product);

	TAppProduct selectByCode(String orderCode);

	void insertMachindeRegister(TRegister tRegister);

	void insertMacineConfig(JSONObject jsonObject);

	void insertOpenDoor(TOpenBoxLog tBoxLog);

	void updateDoor(TOpenBoxLog tOpenBoxLog);

	TAppProduct selectByProductId(Long valueOf);

	TRegister selectRegister(String machineId);

	THeartbeat selectHeartbeat(String machineId);

	void insertHeartbeat(THeartbeat tHeartbeat);

	void updateHeartbeat(THeartbeat tHeartbeat);

	void updateRegister(TRegister tRegister);

	THeartbeat selectHeartbeatByProductId(Long productId);

	List<TRegister> getMachineRegister(Map<String, Object> map);

	List<THeartbeat> getMachineHeartbeat(Map<String, Object> map);

	List<TOpenBoxLog> getMachineOpenDoor(Map<String, Object> map);

	List<TMachine> getMachineList(Map<String, Object> map);

	void insertMachine(TMachine tMachine);

	void insetButh(Map<String, Object> map);

	void insertTIntelligent(TIntelligentBuind tIntelligentBuind);

	TIntelligentBuind selectBuind(String buind);

	List<TIntelligentBuind> getBuindList(Map<String, Object> map);

	TIntelligentBuind selectByBuind();

	void updateRegisterButh(Map<String, Object> map);

	void updateMachine(String machineId);

	void updateRegisterByMachineId(String machineId);

	Long selectCorpId(String parameter);

}
