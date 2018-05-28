package cmcc.mobile.yiqi.web.service;

import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.alibaba.fastjson.JSONObject;

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

	JsonResult openDoor(String code, Integer containerNumber, long userId);

	JsonResult upBox(Long productId, Integer number, long userId, long corpId);

	JsonResult getProductListByCorpId(Long corpId, String productName, Integer status, PageVo pageVo);

	JsonResult updateProduct(TAppProduct tAppProduct, Long userId, Long corpId);

	String weixinPayH5(Long productId, String ip, String code);

	JsonResult getOrderList(Long corpId);

	JsonResult orderListTime(Long corpId, String type, String time);

	JsonResult orderDetail(Long userId, Integer status, String productName, Long startTime, Long endTime,
			PageVo pageVo, Long corpId);

	JsonResult refundAction(Long productId, String orderCode, String money);

	void notify(Map map);

	void insertMachindeRegister(String string);

	JsonResult configMachine(int hbtime, int led_on, int senstive,String devno);

	String weixinPayMobile(Long productId);

	void updateDoor(JSONObject json);

}
