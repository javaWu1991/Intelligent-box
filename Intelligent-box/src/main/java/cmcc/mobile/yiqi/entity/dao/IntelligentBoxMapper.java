package cmcc.mobile.yiqi.entity.dao;

import java.util.List;

import com.alibaba.fastjson.JSONObject;

import cmcc.mobile.yiqi.entity.BannerImg;
import cmcc.mobile.yiqi.entity.TProductLog;
import cmcc.mobile.yiqi.vo.ConsumeVo;
import cmcc.mobile.yiqi.vo.Product;

public interface IntelligentBoxMapper {

	List<String> selectAll();

	void insertSelective(BannerImg bannerImg);

	void addReplenishment(TProductLog tProductLog);

	ConsumeVo selectByProduct(Long product_id);

	void insertOrder(Product product);

	void insertSocket(JSONObject jsonObject);

}
