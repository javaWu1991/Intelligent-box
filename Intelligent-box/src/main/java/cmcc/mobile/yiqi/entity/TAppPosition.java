package cmcc.mobile.yiqi.entity;

import java.io.Serializable;

public class TAppPosition implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 191780478181409467L;
	//职位ID
	private Long id;
	//公司ID
	private Long cid;
	//职位名称
	private String positionName;
	//职位级别
	private Long level;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Long getCid() {
		return cid;
	}
	public void setCid(Long cid) {
		this.cid = cid;
	}
	public String getPositionName() {
		return positionName;
	}
	public void setPositionName(String positionName) {
		this.positionName = positionName;
	}
	public Long getLevel() {
		return level;
	}
	public void setLevel(Long level) {
		this.level = level;
	}
	@Override
	public String toString() {
		return "TAppPosition [id=" + id + ", cid=" + cid + ", positionName=" + positionName + ", level=" + level + "]";
	}

	
}
