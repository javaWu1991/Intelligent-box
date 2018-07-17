package cmcc.mobile.yiqi.web.service;

import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.alibaba.fastjson.JSONObject;

import cmcc.mobile.yiqi.entity.TAppProduct;
import cmcc.mobile.yiqi.entity.THeartbeat;
import cmcc.mobile.yiqi.utils.CheckResult;
import cmcc.mobile.yiqi.utils.JsonResult;
import cmcc.mobile.yiqi.vo.PageVo;
import cmcc.mobile.yiqi.vo.PayVo;

public interface IntelligentBoxService {

	JsonResult uploadImages(MultipartFile mr, String path);

	JsonResult getImages();

	JsonResult addProduct(TAppProduct tAppProduct, MultipartFile mr);

	JsonResult getProductList(String code, String type);

	JsonResult updateProductList(TAppProduct tAppProduct, MultipartFile mr);

	JsonResult getProductDetail(Long productId);

	JsonResult upShelves(String code, Integer number, Long productId, long userId, long corpId);

	JsonResult downShelves(Long productId, long userId, long corpId);

	JsonResult openDoor(String code, Long productId, Long userId);

	JsonResult upBox(Long productId, Integer number, long userId, long corpId);

	JsonResult getProductListByCorpId(Long corpId, String productName, Long machineId, Integer status, PageVo pageVo);

	JsonResult updateProduct(TAppProduct tAppProduct, Long userId, Long corpId);

	String weixinPayH5(Long productId, String ip, String code);

	JsonResult getOrderList(Long corpId);

	JsonResult orderListTime(Long corpId, String type, String time);

	JsonResult orderDetail(Long userId, Integer status, String productName, Long startTime, Long endTime,
			PageVo pageVo, Long corpId);

	JsonResult refundAction(Long productId, String orderCode, String money);

	void notify(Map map);

	void insertMachindeRegister(JSONObject json);

	JsonResult configMachine(int hbtime, int led_on, int senstive,String devno);

	String weixinPayMobile(Long productId);

	void updateDoor(JSONObject json);

	void insertHeartbeat(JSONObject json);

	THeartbeat selectTHeartbeat(Long productId);

	JsonResult addMachine(Long corpId, String buind);

	JsonResult getMachineRegister(Integer status, Long startTime, Long endTime,
			PageVo pageVo, Long corpId);

	JsonResult getMachineHeartbeat(Integer status, Long startTime, Long endTime, PageVo pageVo, Long corpId);


	JsonResult getMachineOpenDoor(Integer status, Long startTime, Long endTime, PageVo pageVo, Long corpId);

	JsonResult getMachineList(Integer status, Long startTime, Long endTime, PageVo pageVo, Long corpId, String type);

	JsonResult getCompanyList();

	JsonResult bindingCompany(String[] machineId, String[] buind, Long corpId, String roomCode);

	JsonResult uploadBuind(MultipartFile mr, String buind, String desc);

	CheckResult getBuind(String buind, String devno);

	JsonResult getBuindList(String buind, PageVo pageVo);

	JsonResult deleteBinding(String machineId);

	Long selectCorpId(String parameter);

	JsonResult addDefaultProduct(TAppProduct tAppProduct, MultipartFile mr);

	JsonResult getDefaultProductList();

	JsonResult updateDefaultProduct(TAppProduct tAppProduct, MultipartFile mr);

}
