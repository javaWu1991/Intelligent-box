package cmcc.mobile.yiqi.web.service;

import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import cmcc.mobile.yiqi.entity.TAppProduct;
import cmcc.mobile.yiqi.utils.JsonResult;
import cmcc.mobile.yiqi.vo.PageVo;

public interface IntelligentBoxService {

	JsonResult uploadImages(MultipartFile mr);

	JsonResult getImages();

	JsonResult addProduct(TAppProduct tAppProduct, MultipartFile mr);

	JsonResult getProductList(String code);

	JsonResult updateProductList(TAppProduct tAppProduct, MultipartFile mr);

	JsonResult getProductDetail(Long productId);

	JsonResult upShelves(String code, Integer number, Long productId, long userId, long corpId);

	JsonResult downShelves(Long productId, long userId, long corpId);

	JsonResult openDoor(String code, String containerNumber, long userId);

	JsonResult upBox(Long productId, Integer number, long userId, long corpId);

	JsonResult getProductListByCorpId(Long corpId, String productName, Integer status, PageVo pageVo);

	JsonResult updateProduct(TAppProduct tAppProduct, Long userId, Long corpId);

	String weixinPayH5(double money, Long productId, String ip);

	JsonResult getOrderList(Long corpId);

	JsonResult orderListTime(Long corpId, String type, String time);

	JsonResult orderDetail(Long userId, Integer status, String productName, Long startTime, Long endTime,
			PageVo pageVo, Long corpId);

	JsonResult refundAction(Long productId, String orderCode, String money);

	void notify(Map map);

}
