package cmcc.mobile.yiqi.entity;

public class TAppTaskParticipants {
    private Long id;
    
    private Long uid;

	private Long taskid;

    private String participants;

    private Integer readtype;

    private String message;

    private Integer ownertype;
    
	private Integer finishType;
	
	private String fileurl;
	
    private Integer canceltype;
    
    public TAppTaskParticipants(){}
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getUid() {
		return uid;
	}

	public void setUid(Long uid) {
		this.uid = uid;
	}
    
    public Long getTaskid() {
        return taskid;
    }

    public void setTaskid(Long taskid) {
        this.taskid = taskid;
    }

    public String getParticipants() {
        return participants;
    }

    public void setParticipants(String participants) {
        this.participants = participants == null ? null : participants.trim();
    }

    public Integer getReadtype() {
        return readtype;
    }

    public void setReadtype(Integer readtype) {
        this.readtype = readtype;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message == null ? null : message.trim();
    }

    public Integer getOwnerType() {
        return ownertype;
    }

    public void setOwnerType(Integer ownerType) {
        this.ownertype = ownerType;
    }
	public Integer getFinishType() {
		return finishType;
	}

	public void setFinishType(Integer finishType) {
		this.finishType = finishType;
	}

	public String getFileurl() {
		return fileurl;
	}

	public void setFileurl(String fileurl) {
		this.fileurl = fileurl;
	}

	public Integer getCanceltype() {
		return canceltype;
	}

	public void setCanceltype(Integer canceltype) {
		this.canceltype = canceltype;
	}
}