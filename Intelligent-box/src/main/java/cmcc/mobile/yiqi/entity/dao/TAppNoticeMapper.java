package cmcc.mobile.yiqi.entity.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import cmcc.mobile.yiqi.entity.TAppNotice;
import cmcc.mobile.yiqi.vo.AppServiceNumberVo;

public interface TAppNoticeMapper {
	
    int deleteByPrimaryKey(Long id);
    
    int deleteByNoticeId(Long noticeId);

    int insert(TAppNotice record);

    int insertSelective(TAppNotice record);

    TAppNotice selectByPrimaryKey(Long id);
    
    List<TAppNotice>  selectByUserKey(Long uid);
    
    List<TAppNotice>  selectByGoalKey(Long goal);

    int updateByPrimaryKeySelective(TAppNotice record);

    int updateByPrimaryKeyWithBLOBs(TAppNotice record);

    int updateByPrimaryKey(TAppNotice record);
    
    int selectTotalRecord(TAppNotice record);
    
    List<TAppNotice> selectByPages(@Param("startRow") Integer startRow,@Param("endRow") Integer endRow,
    		@Param("uid") String uid,@Param("status") Integer status,@Param ("sid") Long sid);

	int selectServiceTotalRecord(AppServiceNumberVo appServiceNotice);

	List<AppServiceNumberVo> selectByServicePages(@Param("startRow") Integer startRow,@Param("endRow") Integer endRow, 
			@Param("Uid") String Uid, @Param("Status") Integer Status, @Param ("Sid") Long Sid);
	
}