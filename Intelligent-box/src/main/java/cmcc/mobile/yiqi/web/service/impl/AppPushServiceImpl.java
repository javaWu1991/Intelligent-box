package cmcc.mobile.yiqi.web.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cmcc.mobile.yiqi.entity.TAppServicePush;
import cmcc.mobile.yiqi.entity.dao.TAppServicePushMapper;
import cmcc.mobile.yiqi.web.service.IAppServicePush;


@Service
public class AppPushServiceImpl implements IAppServicePush {

	@Autowired
	private TAppServicePushMapper sendMessage;
	@Override
	public int insert(TAppServicePush message) {
		// TODO Auto-generated method stub
		return sendMessage.insert(message);
	}

}
