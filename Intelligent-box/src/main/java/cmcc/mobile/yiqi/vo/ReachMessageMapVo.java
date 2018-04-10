package cmcc.mobile.yiqi.vo;

public class ReachMessageMapVo {

	private Long id;

	private String mediaUrl; // 录音保存地址

	private String imageUrl;

	private Long createTime; // 消息发送时间

	private Long uid; // 发送人关联主键

	private String message; // 文字消息内容

	private Integer unConfirmCount; // 确认人数

	private Long reachId;

	private String name;

	private Integer confirmStatus; // 接收人确认状态 1:未确认 2:已确认

	private Long confirmTime; // 确认时间

	private Integer type;

	private Integer status;

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getMediaUrl() {
		return mediaUrl;
	}

	public void setMediaUrl(String mediaUrl) {
		this.mediaUrl = mediaUrl;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	public Long getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Long createTime) {
		this.createTime = createTime;
	}

	public Long getUid() {
		return uid;
	}

	public void setUid(Long uid) {
		this.uid = uid;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Integer getUnConfirmCount() {
		return unConfirmCount;
	}

	public void setUnConfirmCount(Integer unConfirmCount) {
		this.unConfirmCount = unConfirmCount;
	}

	public Long getReachId() {
		return reachId;
	}

	public void setReachId(Long reachId) {
		this.reachId = reachId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getConfirmStatus() {
		return confirmStatus;
	}

	public void setConfirmStatus(Integer confirmStatus) {
		this.confirmStatus = confirmStatus;
	}

	public Long getConfirmTime() {
		return confirmTime;
	}

	public void setConfirmTime(Long confirmTime) {
		this.confirmTime = confirmTime;
	}
}
