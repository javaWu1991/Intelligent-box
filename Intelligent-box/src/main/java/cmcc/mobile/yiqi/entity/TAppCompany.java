package cmcc.mobile.yiqi.entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import cmcc.mobile.yiqi.vo.AppOrganizationVo;

public class TAppCompany implements Serializable {
	/**
	* 
	*/
	private static final long serialVersionUID = -7516972828996885646L;
	// 失效
	public final static Integer LAPSE = 0;
	// 有效
	public final static Integer VALID = 1;
	// 待审核
	public final static Integer UNDETERMINED = 2;
	// 已删除
	public final static Integer DELETED = 3;

	public final static Integer NOHIDE = 0;

	public final static Integer HIDE = 1;

	private Long id;

	private String name;

	private Long create_time;

	private Integer status;

	private Long areaId;

	private String adress;

	private String scale;

	private String code;

	private String logo;

	private String contacts;

	private String contactsMobile;

	private Integer isHide;

	private Double longitude;

	private Double latitude;

	private String creator;

	private Integer provinceId;

	private Integer cityId;

	private String provinceName;

	private String cityName;

	private String areaName;

	private Long managerId;

	private String orgId;

	private String orgName;

	private String emails;

	private String shortNum;
	
	private Long roleId;
	
	private String appId ;
	
	private String mchId ;
	
	

	public String getAppId() {
		return appId;
	}

	public void setAppId(String appId) {
		this.appId = appId;
	}

	public String getMchId() {
		return mchId;
	}

	public void setMchId(String mchId) {
		this.mchId = mchId;
	}

	public Long getRoleId() {
		return roleId;
	}

	public void setRoleId(Long roleId) {
		this.roleId = roleId;
	}

	public String getShortNum() {
		return shortNum;
	}

	public void setShortNum(String shortNum) {
		this.shortNum = shortNum;
	}

	public String getEmails() {
		return emails;
	}

	public void setEmails(String emails) {
		this.emails = emails;
	}

	private List<TAppPosition> positions = new ArrayList<>();// 公司职位列表

	private List<AppOrganizationVo> organizations = new ArrayList<>();

	public String getOrgId() {
		return orgId;
	}

	public void setOrgId(String orgId) {
		this.orgId = orgId;
	}

	public String getOrgName() {
		return orgName;
	}

	public void setOrgName(String orgName) {
		this.orgName = orgName;
	}

	public List<TAppPosition> getPositions() {
		return positions;
	}

	public void setPositions(List<TAppPosition> positions) {
		this.positions = positions;
	}

	public List<AppOrganizationVo> getOrganizations() {
		return organizations;
	}

	public void setOrganizations(List<AppOrganizationVo> organizations) {
		this.organizations = organizations;
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
		this.name = name == null ? null : name.trim();
	}

	public Long getCreate_time() {
		return create_time;
	}

	public void setCreate_time(Long create_time) {
		this.create_time = create_time;
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public Long getAreaId() {
		return areaId;
	}

	public void setAreaId(Long areaId) {
		this.areaId = areaId;
	}

	public String getAdress() {
		return adress;
	}

	public void setAdress(String adress) {
		this.adress = adress == null ? null : adress.trim();
	}

	public String getScale() {
		return scale;
	}

	public void setScale(String scale) {
		this.scale = scale == null ? null : scale.trim();
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code == null ? null : code.trim();
	}

	public String getLogo() {
		return logo;
	}

	public void setLogo(String logo) {
		this.logo = logo == null ? null : logo.trim();
	}

	public String getContacts() {
		return contacts;
	}

	public void setContacts(String contacts) {
		this.contacts = contacts == null ? null : contacts.trim();
	}

	public String getContactsMobile() {
		return contactsMobile;
	}

	public void setContactsMobile(String contactsMobile) {
		this.contactsMobile = contactsMobile == null ? null : contactsMobile.trim();
	}

	public Integer getIsHide() {
		return isHide;
	}

	public void setIsHide(Integer isHide) {
		this.isHide = isHide;
	}

	public Double getLongitude() {
		return longitude;
	}

	public void setLongitude(Double longitude) {
		this.longitude = longitude;
	}

	public Double getLatitude() {
		return latitude;
	}

	public void setLatitude(Double latitude) {
		this.latitude = latitude;
	}

	public String getCreator() {
		return creator;
	}

	public void setCreator(String creator) {
		this.creator = creator == null ? null : creator.trim();
	}

	public Integer getProvinceId() {
		return provinceId;
	}

	public void setProvinceId(Integer provinceId) {
		this.provinceId = provinceId;
	}

	public Integer getCityId() {
		return cityId;
	}

	public void setCityId(Integer cityId) {
		this.cityId = cityId;
	}

	public String getProvinceName() {
		return provinceName;
	}

	public void setProvinceName(String provinceName) {
		this.provinceName = provinceName == null ? null : provinceName.trim();
	}

	public String getCityName() {
		return cityName;
	}

	public void setCityName(String cityName) {
		this.cityName = cityName == null ? null : cityName.trim();
	}

	public String getAreaName() {
		return areaName;
	}

	public void setAreaName(String areaName) {
		this.areaName = areaName == null ? null : areaName.trim();
	}

	public Long getManagerId() {
		return managerId;
	}

	public void setManagerId(Long managerId) {
		this.managerId = managerId;
	}
}