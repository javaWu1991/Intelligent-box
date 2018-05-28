package cmcc.mobile.yiqi.vo;

import java.io.Serializable;

import cmcc.mobile.yiqi.entity.TAppCheck;

public class CheckVo implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = -6287935528835645342L;
	
	private Long checkTime;
	private String message;
	private Boolean isPass ;
	private String departmentName;
	private String assigneeName;
	private String assigneeId;
	private Long checkId;
	
	public CheckVo() {
		super();
	}

	public CheckVo(TAppCheck tAppCheck) {
		super();
		this.checkTime = tAppCheck.getCreateTime()==null ?System.currentTimeMillis() :tAppCheck.getCreateTime();
		this.message = tAppCheck.getMessage();
		this.isPass = tAppCheck.getIsPass() == null ?false :tAppCheck.getIsPass();
		this.departmentName = tAppCheck.getDepartmentName();
		this.assigneeName = tAppCheck.getAssigneeName();
		this.assigneeId =tAppCheck.getAssigneeId();
		this.checkId = tAppCheck.getId();
	}

	public Long getCheckId() {
		return checkId;
	}

	public void setCheckId(Long checkId) {
		this.checkId = checkId;
	}

	public Long getCheckTime() {
		return checkTime;
	}

	public void setCheckTime(Long checkTime) {
		this.checkTime = checkTime;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Boolean getIsPass() {
		return isPass;
	}

	public void setIsPass(Boolean isPass) {
		this.isPass = isPass;
	}

	public String getDepartmentName() {
		return departmentName;
	}

	public void setDepartmentName(String departmentName) {
		this.departmentName = departmentName;
	}

	public String getAssigneeName() {
		return assigneeName;
	}

	public void setAssigneeName(String assigneeName) {
		this.assigneeName = assigneeName;
	}

	public String getAssigneeId() {
		return assigneeId;
	}

	public void setAssigneeId(String assigneeId) {
		this.assigneeId = assigneeId;
	}

}