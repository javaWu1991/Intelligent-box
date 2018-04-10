package cmcc.mobile.yiqi.entity.dao;

import java.util.List;
import org.apache.ibatis.annotations.Param;
import cmcc.mobile.yiqi.entity.TAppServicePush;

public interface TAppServicePushMapper {
	int insert(TAppServicePush message);

	int insertSelective(TAppServicePush record);

	TAppServicePush selectByPrimaryKey(Long id);

	int updateByPrimaryKeySelective(TAppServicePush record);

	int updateByPrimaryKey(TAppServicePush record);

	List<TAppServicePush> selectReceivers(@Param("id") Long id);

	void deleteByMessageId(@Param("id") Long id);
}
