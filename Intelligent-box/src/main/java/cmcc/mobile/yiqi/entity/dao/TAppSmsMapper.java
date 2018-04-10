package cmcc.mobile.yiqi.entity.dao;

import java.util.List;

import cmcc.mobile.yiqi.entity.TSmsRecord;

public interface TAppSmsMapper {

	int insertSmsRecord(TSmsRecord record);
	
	List<TSmsRecord> selectWaitSendSm();
	
	int updateSmsRecord(TSmsRecord record);
	
	int deleteSmsRecord(String id);
}
