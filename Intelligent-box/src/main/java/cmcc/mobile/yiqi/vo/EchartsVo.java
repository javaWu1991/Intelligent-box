package cmcc.mobile.yiqi.vo;

import com.alibaba.fastjson.JSONObject;

/**
 *  name:marknum[0], 
    type:'line',  
    stack: '总量',  
    itemStyle : { normal: {label : {show: true},color:'#EA0000'}},  
    data:marname[0]  
 * @author Administrator
 *
 */
public class EchartsVo {
	private String name ;
	private String type ;
	private String stack ;
	private int[] data ;
	private JSONObject itemStyle ;
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getStack() {
		return stack;
	}
	public void setStack(String stack) {
		this.stack = stack;
	}

	public int[] getData() {
		return data;
	}
	public void setData(int[] data) {
		this.data = data;
	}
	public JSONObject getItemStyle() {
		return itemStyle;
	}
	public void setItemStyle(JSONObject itemStyle) {
		this.itemStyle = itemStyle;
	}
	
	
	
}
