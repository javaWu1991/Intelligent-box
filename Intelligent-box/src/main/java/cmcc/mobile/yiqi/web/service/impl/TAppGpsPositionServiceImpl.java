package cmcc.mobile.yiqi.web.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cmcc.mobile.yiqi.entity.TAppGpsPosition;
import cmcc.mobile.yiqi.entity.dao.TAppGpsPositionMapper;
import cmcc.mobile.yiqi.web.service.IAppGpsPositionService;


@Service
public class TAppGpsPositionServiceImpl implements IAppGpsPositionService {

	@Autowired
	 private TAppGpsPositionMapper  gpsPositionMapper;
	@Override
	public int addPosition(TAppGpsPosition record) {
		// TODO Auto-generated method stub
		return gpsPositionMapper.addPosition(record);
	}

	
	
	
	
	
}
