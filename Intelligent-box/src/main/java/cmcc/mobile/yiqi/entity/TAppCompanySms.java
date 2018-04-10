package cmcc.mobile.yiqi.entity;

public class TAppCompanySms {
	public static Integer MEETING_CREATE=0;
	public static Integer MEETING_UPDATE=1;
	public static Integer MEETING_QUICKSTART=2;
	public static Integer MEETING_START=3;
	
    private Integer id;

    private Integer mid;

    private String sid;

    private Integer type;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getMid() {
        return mid;
    }

    public void setMid(Integer mid) {
        this.mid = mid;
    }

    public String getSid() {
        return sid;
    }

    public void setSid(String sid) {
        this.sid = sid == null ? null : sid.trim();
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

	public TAppCompanySms( Integer mid, String sid, Integer type) {
		super();
		this.mid = mid;
		this.sid = sid;
		this.type = type;
	}

	public TAppCompanySms() {
	}
    
    
}