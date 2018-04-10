package cmcc.mobile.yiqi.entity;

import java.util.Date;

public class TAppServicePush {
	public Long id;
	public Long push_id;
	public Long cid;
	public Long org_id;
	public String patch_id;
	public String full_patch;
	public String cname;
	public String dname;
	public Date createtime;
	
	
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Long getPush_id() {
		return push_id;
	}
	public void setPush_id(Long push_id) {
		this.push_id = push_id;
	}
	public Long getCid() {
		return cid;
	}
	public void setCid(Long cid) {
		this.cid = cid;
	}
	public Long getOrg_id() {
		return org_id;
	}
	public void setOrg_id(Long org_id) {
		this.org_id = org_id;
	}
	public String getPatch_id() {
		return patch_id;
	}
	public void setPatch_id(String patch_id) {
		this.patch_id = patch_id;
	}
	public String getFull_patch() {
		return full_patch;
	}
	public void setFull_patch(String full_patch) {
		this.full_patch = full_patch;
	}
	public String getCname() {
		return cname;
	}
	public void setCname(String cname) {
		this.cname = cname;
	}
	public String getDname() {
		return dname;
	}
	public void setDname(String dname) {
		this.dname = dname;
	}
	public Date getCreatetime() {
		return createtime;
	}
	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}
	

	
	
}
