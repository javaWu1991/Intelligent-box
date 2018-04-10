package cmcc.mobile.yiqi.utils;

import cmcc.mobile.yiqi.vo.PageVo;

/**
 * 响应前端请求
 * 
 * @author zhangxs
 *
 */
public class JsonResult {
	private Boolean success;
	private String message;
	private String encoding = "UTF-8";
	private Object model;
	private PageVo pageVo;

	public JsonResult(Boolean success, String message, Object model, PageVo pageVo) {
		this.success = success;
		this.message = message;
		this.model = model;
		this.pageVo = pageVo;
	}

	public JsonResult(Boolean success, String message, Object model) {
		this.success = success;
		this.message = message;
		this.model = model;
	}

	public PageVo getPageVo() {
		return pageVo;
	}

	public void setPageVo(PageVo pageVo) {
		this.pageVo = pageVo;
	}

	public JsonResult() {
	}

	public Boolean getSuccess() {
		return success;
	}

	public void setSuccess(Boolean success) {
		this.success = success;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getEncoding() {
		return encoding;
	}

	public void setEncoding(String encoding) {
		this.encoding = encoding;
	}

	public Object getModel() {
		return model;
	}

	public void setModel(Object model) {
		this.model = model;
	}
}
