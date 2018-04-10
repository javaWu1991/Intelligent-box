package cmcc.mobile.yiqi.web.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import cmcc.mobile.yiqi.entity.BannerImg;
import cmcc.mobile.yiqi.entity.TAppProduct;
import cmcc.mobile.yiqi.entity.TOpenBoxLog;
import cmcc.mobile.yiqi.entity.TProductLog;
import cmcc.mobile.yiqi.entity.dao.IntelligentBoxMapper;
import cmcc.mobile.yiqi.entity.dao.TAppProductMapper;
import cmcc.mobile.yiqi.entity.dao.TOpenBoxLogMapper;
import cmcc.mobile.yiqi.utils.FileUpload;
import cmcc.mobile.yiqi.utils.IntelligentUtil;
import cmcc.mobile.yiqi.utils.JsonResult;
import cmcc.mobile.yiqi.utils.RandomNumUtil;
import cmcc.mobile.yiqi.utils.RandomUtil;
import cmcc.mobile.yiqi.vo.ConsumeVo;
import cmcc.mobile.yiqi.vo.Product;
import cmcc.mobile.yiqi.web.service.IWeixinPayService;
import cmcc.mobile.yiqi.web.service.IntelligentBoxService;
import javassist.compiler.ast.NewExpr;

@Service
public class IntelligentBoxServiceImpl implements IntelligentBoxService{

	@Autowired
	private IntelligentBoxMapper intelligentBoxMapper ;
	@Autowired
	private TAppProductMapper tAppProductMapper ;
	@Autowired
	private TOpenBoxLogMapper tOpenBoxLogMapper ;
	@Autowired
	private IWeixinPayService weixinPayService;
	@Override
	public JsonResult uploadImages(MultipartFile mr) {
		 /**
         * 查询banner图是否超过最多限制如果超过删除不上传
         */
        if (intelligentBoxMapper.selectAll().size() < 3 && mr.getSize() > 0) {
            String picurl = "";
            try {
                if (!mr.isEmpty()) {
                    picurl = FileUpload.uploadFile(mr, "banner");
                }
            } catch (IOException e) {
                return new JsonResult(false, "文件上传失败！", null);
            }
            BannerImg bannerImg = new BannerImg();
            bannerImg.setCreateTime(System.currentTimeMillis());
            bannerImg.setImgUrl(picurl);
            intelligentBoxMapper.insertSelective(bannerImg);
            return new JsonResult(true, "图片上传成功", bannerImg);
        }
        return new JsonResult(false, "图片上传失败", null);
	}
	/**
	 * 获取banner图
	 */
	@Override
	public JsonResult getImages() {
		 List<String> list = intelligentBoxMapper.selectAll();
		return new JsonResult(true,"获取成功",list);
	}
	/**
	 * 添加产品
	 */
	@Override
	public JsonResult addProduct(TAppProduct tAppProduct, MultipartFile mr) {
		 String picurl = "";
         try {
             if (!mr.isEmpty()) {
                 picurl = FileUpload.uploadFile(mr, "product");
             }
         } catch (IOException e) {
             return new JsonResult(false, "文件上传失败！", null);
         }
         tAppProduct.setProductImg(picurl);
         tAppProduct.setStatus(1);
         tAppProduct.setCreateTime(System.currentTimeMillis());
         if(tAppProductMapper.insertSelective(tAppProduct)==1){
        	 return new JsonResult(true,"添加成功",null) ;
         }
         
		return new JsonResult(false,"添加失败",null) ;
	}
	/**
	 * 获取产品列表
	 */
	@Override
	public JsonResult getProductList(String code) {
		List<TAppProduct> tAppProducts = tAppProductMapper.selectByMachineId(code) ;
		if(tAppProducts.size()==0||tAppProducts==null){
			return new JsonResult(false,"该编码不存在",null) ;
			
		}
		return new JsonResult(true,"获取成功！",tAppProducts) ;
	}
	/**
	 * 更新产品
	 */
	@Override
	public JsonResult updateProductList(TAppProduct tAppProduct, MultipartFile mr) {
		 String picurl = "";
         try {
             if (null !=mr) {
                 picurl = FileUpload.uploadFile(mr, "product");
                 tAppProduct.setProductImg(picurl);
             }
         } catch (IOException e) {
             return new JsonResult(false, "文件上传失败！", null);
         }
         tAppProduct.setUpdateTime(System.currentTimeMillis());
         if(tAppProductMapper.updateByPrimaryKeySelective(tAppProduct)==1){
        	 return new JsonResult(true,"更新成功",null) ;
         }
		return new JsonResult(false,"更新失败",null) ;
	}
	/**
	 * 获取产品详情
	 */
	@Override
	public JsonResult getProductDetail(Long productId) {
		TAppProduct tAppProduct = tAppProductMapper.selectByPrimaryKey(productId) ;
		if(tAppProduct==null){
			return new JsonResult(false, "产品不存在",null);
		}
		return new JsonResult(true, "获取成功！",tAppProduct);
	}
	/**
	 * 一键上架
	 */
	@Override
	public JsonResult upShelves(String code,Integer number,Long productId,long userId,long corpId) {
		//数量如果是0则只是更改下架的产品状态否则则更改下架的产品的同事也要更改缺货的产品数量
		TAppProduct tAppProduct = new TAppProduct() ;
		tAppProduct.setMachineId(code) ;
		tAppProduct.setStatus(1);
		//查询下架的产品
		List<TAppProduct> taAppProducts = tAppProductMapper.selectByMachine(code) ;
		if(taAppProducts.size()!=0){
			tAppProductMapper.updateByCode(tAppProduct) ;
			insertReplenishment(taAppProducts, userId, corpId, 0, 2);
		}else if(number!=null && productId!=null){
			//查询需要补货的产品
			List<TAppProduct> tAppProducts = new ArrayList<>() ;
			tAppProducts.add(tAppProductMapper.selectByPrimaryKey(productId)) ;
			insertReplenishment(taAppProducts, userId, corpId, number, 1);
			tAppProduct.setProductNumber(number);
			tAppProduct.setId(productId);
			tAppProductMapper.updateByNumber(tAppProduct) ;
		}
		return new JsonResult(true,"上架成功！",null);
	}
	/**
	 * 下架
	 */
	@Override
	public JsonResult downShelves(Long  productId,long userId,long corpId) {
		TAppProduct tAppProduct = new TAppProduct() ;
		tAppProduct.setId(productId);
		tAppProduct.setStatus(0);
		tAppProductMapper.updateByPrimaryKeySelective(tAppProduct) ;
		List<TAppProduct> tAppProducts = new ArrayList<>() ;
		tAppProducts.add(tAppProductMapper.selectByPrimaryKey(productId)) ;
		insertReplenishment(tAppProducts, userId, corpId, 0,0);
		return new JsonResult(true,"下架成功",null);
	}
	/**
	 * 下发开门指令
	 * 并本地记录开门时间
	 */
	@Override
	public JsonResult openDoor(String code, String containerNumber,long userId) {
		//下发开门指令
		boolean isOpen = IntelligentUtil.openDooR(code,containerNumber) ;
		//查询货柜产品
		TAppProduct tAppProduct = new TAppProduct() ;
		tAppProduct.setContainerNumber(containerNumber);
		tAppProduct.setMachineId(code);
		tAppProduct = tAppProductMapper.selectByMachineIdAndContainerNumber(tAppProduct) ;
		TOpenBoxLog tOpenBoxLog = new TOpenBoxLog() ;
		tOpenBoxLog.setProductName(tAppProduct.getProductName());
		tOpenBoxLog.setType(1);
		tOpenBoxLog.setUserId(userId);
		//记录开门状态
		if(isOpen){
			tOpenBoxLog.setStatus(1);
		}else{
			tOpenBoxLog.setStatus(0);
		}
		insertOpenDoorLog(tOpenBoxLog);
		return new JsonResult(isOpen,isOpen?"开门成功":"开门失败机器异常",null);
	}

	/**
	 * 记录开门log
	 */
	private void insertOpenDoorLog(TOpenBoxLog tOpenBoxLog){
		tOpenBoxLogMapper.insertSelective(tOpenBoxLog) ;
	}
	/**
	 * 单个上架产品
	 */
	@Override
	public JsonResult upBox(Long productId, Integer number,long userId,long corpId) {
		TAppProduct tAppProduct = new TAppProduct() ;
		tAppProduct.setId(productId); ;
		tAppProduct.setStatus(1);
		tAppProduct.setProductNumber(number);
		tAppProductMapper.updateByPrimaryKeySelective(tAppProduct) ;
		List<TAppProduct> tAppProducts = new ArrayList<>() ;
		tAppProducts.add(tAppProductMapper.selectByPrimaryKey(productId)) ;
		insertReplenishment(tAppProducts, userId, corpId, number,number==0?0:2);
		return new JsonResult(true,"上架成功",null) ;
	}
	/**
	 * 记录补货log
	 */
	private void insertReplenishment(List<TAppProduct> taAppProducts,long userId,long corpId,int productNumber,int type){
		for(TAppProduct tAppProduct : taAppProducts){
			TProductLog tProductLog = new TProductLog() ;
			tProductLog.setContainerNumber(tAppProduct.getContainerNumber());
			tProductLog.setCorpId(corpId);
			tProductLog.setCreateTime(System.currentTimeMillis());
			tProductLog.setCreateUserId(userId);
			tProductLog.setMachineId(tAppProduct.getMachineId());
			tProductLog.setProductNumber(productNumber);
			tProductLog.setType(type);
			intelligentBoxMapper.addReplenishment(tProductLog) ;
		}
	}
	/**
	 * 管理页面获取产品
	 */
	@Override
	public JsonResult getProductListByCorpId(long corpId,String productName,Integer status) {
		TAppProduct tAppProduct = new TAppProduct() ;
		tAppProduct.setCorpId(corpId);
		tAppProduct.setStatus(status);
		tAppProduct.setProductName(productName);
		List<TAppProduct> tAppProducts = tAppProductMapper.selectByCorp(tAppProduct);
		if(tAppProducts.size()==0||tAppProducts==null){
			return new JsonResult(false,"该编码不存在",null) ;
			
		}
		return new JsonResult(true,"获取成功！",tAppProducts) ;
	}
	/**
	 * 更新产品
	 */
	@Override
	public JsonResult updateProduct(TAppProduct tAppProduct,Long userId,Long corpId) {
		int type = 0 ;
		List<TAppProduct> taAppProducts = new ArrayList<>() ;
		tAppProduct.setUpdateTime(System.currentTimeMillis());
		if(tAppProductMapper.updateByPrimaryKeySelective(tAppProduct)==1){
			switch(tAppProduct.getStatus()){
			 case 3 : type=0 ;
			 break ;
			 case 1 : type=2 ;
			 break ;
			 case 4 : type=4 ;
			 break ;
			 case 2 : type=3 ;			 	
			}
		tAppProduct = tAppProductMapper.selectByPrimaryKey(tAppProduct.getId()) ;
		taAppProducts.add(tAppProduct) ;
		insertReplenishment(taAppProducts, userId, corpId, 0, type);
       	return new JsonResult(true,"更新成功",null) ;
        }
		return new JsonResult(false,"更新失败",null) ;
	}
	/**
	 * 支付接口
	 */
	@Override
	public String weixinPayH5(double money, Long productId,String ip) {
		ConsumeVo consumeVo = intelligentBoxMapper.selectByProduct(productId) ;
		Product product = new Product() ;
		product.setAppId(consumeVo.getAppId());
		product.setMchId(consumeVo.getMchId());
		product.setProductId(String.valueOf(productId));
		product.setProductName(consumeVo.getProductName());
		product.setOutTradeNo(RandomNumUtil.genRandomNum());
		product.setTotalFee(String.valueOf(money));
		product.setSpbillCreateIp(ip);
		String mweb_url = weixinPayService.weixinPayH5(product) ;
		return mweb_url ;
	}

	
}
