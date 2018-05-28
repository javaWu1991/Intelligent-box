package cmcc.mobile.yiqi.entity.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Insert;

import com.alibaba.fastjson.JSONObject;

import cmcc.mobile.yiqi.entity.BannerImg;
import cmcc.mobile.yiqi.entity.TAppProduct;
import cmcc.mobile.yiqi.entity.TOpenBoxLog;
import cmcc.mobile.yiqi.entity.TProductLog;
import cmcc.mobile.yiqi.entity.TRefund;
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

	void insertMachindeRegister(String machine);

	void insertMacineConfig(JSONObject jsonObject);

	void insertOpenDoor(TOpenBoxLog tBoxLog);

	void updateDoor(TOpenBoxLog tOpenBoxLog);

}
