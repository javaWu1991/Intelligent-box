package cmcc.mobile.yiqi.entity;

public class TAppUpdateLog {
	private Long id;

	private String filePath;

	private String appVersion;

	private String appShowVersion;

	private Long createTime;

	private String updaterName;

	private String updateDes;

	private Integer isAllUpdate;

	private String updateUser;

	private Integer isGrayUpdate;

	private Integer appType;
	
	

	public Integer getIsGrayUpdate() {
		return isGrayUpdate;
	}

	public void setIsGrayUpdate(Integer isGrayUpdate) {
		this.isGrayUpdate = isGrayUpdate;
	}

	public Integer getAppType() {
		return appType;
	}

	public void setAppType(Integer appType) {
		this.appType = appType;
	}

	public Integer getIsAllUpdate() {
		return isAllUpdate;
	}

	public void setIsAllUpdate(Integer isAllUpdate) {
		this.isAllUpdate = isAllUpdate;
	}

	public String getUpdateUser() {
		return updateUser;
	}

	public void setUpdateUser(String updateUser) {
		this.updateUser = updateUser;
	}

	public String getUpdateDes() {
		return updateDes;
	}

	public void setUpdateDes(String updateDes) {
		this.updateDes = updateDes;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFilePath() {
		return filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath == null ? null : filePath.trim();
	}

	public String getAppVersion() {
		return appVersion;
	}

	public void setAppVersion(String appVersion) {
		this.appVersion = appVersion == null ? null : appVersion.trim();
	}

	public String getAppShowVersion() {
		return appShowVersion;
	}

	public void setAppShowVersion(String appShowVersion) {
		this.appShowVersion = appShowVersion == null ? null : appShowVersion.trim();
	}

	public Long getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Long createTime) {
		this.createTime = createTime;
	}

	public String getUpdaterName() {
		return updaterName;
	}

	public void setUpdaterName(String updaterName) {
		this.updaterName = updaterName == null ? null : updaterName.trim();
	}
}