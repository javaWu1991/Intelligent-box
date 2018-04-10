package cmcc.mobile.yiqi.web.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cmcc.mobile.yiqi.entity.TAppEnterpriseServiceNumber;
import cmcc.mobile.yiqi.entity.dao.TAppEnterpriseServiceNumberMapper;
import cmcc.mobile.yiqi.web.service.IAppEnterpriseServiceNumberService;


@Service
public class AppEnterpriseServiceNumberImpl implements IAppEnterpriseServiceNumberService{
	@Autowired	
	private TAppEnterpriseServiceNumberMapper servicempper;
	
	@Override
	public List<TAppEnterpriseServiceNumber> selectByLevelKey(Long fmenu ,Long level,Long sid) {
		// TODO Auto-generated method stub
		return servicempper.selectByLevelKey(fmenu,level, sid);
	}

	@Override
	public List<TAppEnterpriseServiceNumber> selectByPrimaryKey(Long id, Long sid) {
		// TODO Auto-generated method stub
		return servicempper.selectByPrimaryKey(id,sid);
	}
	@Override
	public int deleteBylevelKey(Long id){
		
		
		return servicempper.deleteBylevelKey(id);
		 
	 }

	@Override
	public int insert(TAppEnterpriseServiceNumber record) {
		// TODO Auto-generated method stub
		return servicempper.insert(record);
	}

	@Override
	public int updateByPrimaryKey(TAppEnterpriseServiceNumber record) {
		// TODO Auto-generated method stub
		return servicempper.updateByPrimaryKey(record);
	}


	@Override
	public List<TAppEnterpriseServiceNumber> selectByFMenuKey(Long fMenu, Long sid) {
		// TODO Auto-generated method stub
		return servicempper.selectByFMenuKey(fMenu,sid);
	}

	@Override
	public List<TAppEnterpriseServiceNumber> selectByInnLevelKey(Long level, Long sid) {
		// TODO Auto-generated method stub
		return servicempper.selectByInnLevelKey(level,sid);
	}

	@Override
	public List<TAppEnterpriseServiceNumber> selectBySid(Long sid) {
		// TODO Auto-generated method stub
		return servicempper.selectBySid(sid);
	}


	
}
