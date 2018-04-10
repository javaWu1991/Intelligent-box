package cmcc.mobile.yiqi.vo;

import org.springframework.web.multipart.MultipartFile;

/**
 * 消息必达参数类
 * 
 * @author zhangxs
 *
 */
public class MustReachMessageVo extends PageVo {
	private Long id;
	private Integer type; // 通知方式 1:应用内 2:短信 3:电话

	private Long createTime; // 消息发送时间

	private Long cid; // 发送人所在企业

	private Long uid; // 发送人关联主键

	private String uname;

	private String message; // 文字消息内容

	private MultipartFile media; // 录音文件

	private MultipartFile[] images; // 图片文件

	private String receivers; // 接收人,以英文逗号分隔

	private String mediaUrl;

	private String imageUrl;

	private Integer createType;

	private Long reachId;

	private Integer unConfirmCount;

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

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Integer getCreateType() {
		return createType;
	}

	public void setCreateType(Integer createType) {
		this.createType = createType;
	}

	public String getUname() {
		return uname;
	}

	public void setUname(String uname) {
		this.uname = uname;
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

	public String getReceivers() {
		return receivers;
	}

	public void setReceivers(String receivers) {
		this.receivers = receivers;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	public Long getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Long createTime) {
		this.createTime = createTime;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
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

	public MultipartFile getMedia() {
		return media;
	}

	public void setMedia(MultipartFile media) {
		this.media = media;
	}

	public MultipartFile[] getImages() {
		return images;
	}

	public void setImages(MultipartFile[] images) {
		this.images = images;
	}

}
