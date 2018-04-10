package cmcc.mobile.yiqi.vo;

import java.io.Serializable;
import java.util.List;

import cmcc.mobile.yiqi.entity.TAppOrganization;
import cmcc.mobile.yiqi.entity.TAppUser;

public class AppOrganizationVo extends TAppOrganization implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 5731129529186127821L;

	private List<TAppUser> users;

	private List<AppOrganizationVo> orgs;

	public List<AppOrganizationVo> getOrgs() {
		return orgs;
	}

	public void setOrgs(List<AppOrganizationVo> orgs) {
		this.orgs = orgs;
	}

	public List<TAppUser> getUsers() {
		return users;
	}

	public void setUsers(List<TAppUser> users) {
		this.users = users;
	}

}
