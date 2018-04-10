package cmcc.mobile.yiqi.vo;

import java.util.List;

import cmcc.mobile.yiqi.entity.TAppCompany;

public class AppCompanyVo extends TAppCompany {
	private List<AppOrganizationVo> orgList;

	public List<AppOrganizationVo> getOrgList() {
		return orgList;
	}

	public void setOrgList(List<AppOrganizationVo> orgList) {
		this.orgList = orgList;
	}
	
}
