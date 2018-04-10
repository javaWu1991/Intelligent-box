package cmcc.mobile.yiqi.entity;

public class TAppUserCompany {

	public final static Integer SUPER_ADMIN = 0;
	public final static Integer COMMON_ADMIN = 1;
	public final static Integer STAFF = 2;

	public final static Integer LAPSE = 0;
	public final static Integer VALID = 1;
	public final static Integer DELETED = 2;

	private Long id;

	private Long uid;

	private Long cid;

	private Integer type;

	private Integer status;

	private String account;

	private Integer areaid;
	
	private Integer cityid ;
	
	private Integer provinceid ;
	
	private String areaname ;
	
	private String cityname ;
	
	private String provincename ;
	

	public Integer getAreaid() {
		return areaid;
	}

	public void setAreaid(Integer areaid) {
		this.areaid = areaid;
	}

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

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public String getAccount() {
		return account;
	}

	public void setAccount(String account) {
		this.account = account;
	}

	public String getAreaname() {
		return areaname;
	}

	public void setAreaname(String areaname) {
		this.areaname = areaname;
	}

	public String getCityname() {
		return cityname;
	}

	public void setCityname(String cityname) {
		this.cityname = cityname;
	}

	public String getProvincename() {
		return provincename;
	}

	public void setProvincename(String provincename) {
		this.provincename = provincename;
	}

	public Integer getCityid() {
		return cityid;
	}

	public void setCityid(Integer cityid) {
		this.cityid = cityid;
	}

	public Integer getProvinceid() {
		return provinceid;
	}

	public void setProvinceid(Integer provinceid) {
		this.provinceid = provinceid;
	}


	

}