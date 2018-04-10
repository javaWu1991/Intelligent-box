package cmcc.mobile.yiqi.vo;

public class MeetUserVo {
	private Long id;
private String name;
private Integer status;
private Integer isRead;
private Long meetingOften;
private String mobileNo;
private Integer sex;
private String meetingNote;

public MeetUserVo(Long id, String name, Integer status, Integer isRead, Long meetingOften, String mobileNo,
		Integer sex,String meetingNote) {
	super();
	this.id = id;
	this.name = name;
	this.status = status;
	this.isRead = isRead;
	this.meetingOften = meetingOften;
	this.mobileNo = mobileNo;
	this.sex = sex;
	this.meetingNote = meetingNote;
}

public String getMeetingNote() {
	return meetingNote;
}

public void setMeetingNote(String meetingNote) {
	this.meetingNote = meetingNote;
}

public Integer getSex() {
	return sex;
}
public void setSex(Integer sex) {
	this.sex = sex;
}
public String getMobileNo() {
	return mobileNo;
}
public void setMobileNo(String mobileNo) {
	this.mobileNo = mobileNo;
}
public Long getId() {
	return id;
}
public void setId(Long id) {
	this.id = id;
}
public String getName() {
	return name;
}
public void setName(String name) {
	this.name = name;
}
public Integer getStatus() {
	return status;
}
public void setStatus(Integer status) {
	this.status = status;
}
public Integer getIsRead() {
	return isRead;
}
public void setIsRead(Integer isRead) {
	this.isRead = isRead;
}
public Long getMeetingOften() {
	return meetingOften;
}
public void setMeetingOften(Long meetingOften) {
	this.meetingOften = meetingOften;
}


public MeetUserVo() {
	super();
}

}
