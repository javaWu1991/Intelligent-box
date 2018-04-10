package cmcc.mobile.yiqi.web.service;

import org.springframework.web.multipart.MultipartFile;

import cmcc.mobile.yiqi.entity.TAppProduct;
import cmcc.mobile.yiqi.utils.JsonResult;

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

	JsonResult getProductListByCorpId(long corpId, String productName, Integer status);

	JsonResult updateProduct(TAppProduct tAppProduct, Long userId, Long corpId);

	String weixinPayH5(double money, Long productId, String ip);

}
