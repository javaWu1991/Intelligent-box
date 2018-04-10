package cmcc.mobile.yiqi.entity;

import java.util.List;

public class TAppEnterpriseServiceNumber {

	private Long id;
	private String name;

	private String link;
	
	private Long fMenu;
	
	private Long level;
	
	private List<TAppEnterpriseServiceNumber> children;
	
	private  Long sid; 
	
	public Long getSid() {
		return sid;
	}

	public void setSid(Long sid) {
		this.sid = sid;
	}

	public List<TAppEnterpriseServiceNumber> getChildren() {
		return children;
	}

	public void setChildren(List<TAppEnterpriseServiceNumber> children) {
		this.children = children;
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

	public String getLink() {
		return link;
	}

	public void setLink(String link) {
		this.link = link;
	}

	public Long getfMenu() {
		return fMenu;
	}

	public void setfMenu(Long fMenu) {
		this.fMenu = fMenu;
	}

	public Long getLevel() {
		return level;
	}

	public void setLevel(Long level) {
		this.level = level;
	}

	
	
	
}
