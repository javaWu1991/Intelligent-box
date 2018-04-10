package cmcc.mobile.yiqi.vo;

import java.util.List;

import cmcc.mobile.yiqi.entity.TAppCompany;
import cmcc.mobile.yiqi.entity.TAppUser;

public class CompanyListVo extends TAppCompany{

	private List<TAppUser> tAppUsers;

	public List<TAppUser> gettAppUsers() {
		return tAppUsers;
	}

	public void settAppUsers(List<TAppUser> tAppUsers) {
		this.tAppUsers = tAppUsers;
	}
	
	
}
