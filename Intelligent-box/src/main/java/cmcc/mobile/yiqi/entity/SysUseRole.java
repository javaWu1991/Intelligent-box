package cmcc.mobile.yiqi.entity;

public class SysUseRole {
	public final static Integer ADMIN_MANAGER = 1;
	public final static Integer COMPANY_MANAGER = 2;
	public final static Integer AREA_MANAGER = 3 ;
public final static Integer CUSTOMER_MANAGER = 4; 


public final static String ADMIN_MANAGER_ROLE = "admin";
public final static String COMPANY_MANAGER_ROLE = "companyManager";
public final static String AREA_MANAGER_ROLE = "areaManager" ;
public final static String CUSTOMER_MANAGER_ROLE = "customerManager"; 


private Integer id;

    private Integer uid;

    private Integer cid;

    private Integer rid;

    
    
    
    public SysUseRole() {
		super();
	}

	public SysUseRole(Integer uid, Integer cid, Integer rid) {
		super();
		this.uid = uid;
		this.cid = cid;
		this.rid = rid;
	}

	public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUid() {
        return uid;
    }

    public void setUid(Integer uid) {
        this.uid = uid;
    }

    public Integer getCid() {
        return cid;
    }

    public void setCid(Integer cid) {
        this.cid = cid;
    }

    public Integer getRid() {
        return rid;
    }

    public void setRid(Integer rid) {
        this.rid = rid;
    }
}