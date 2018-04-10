package cmcc.mobile.yiqi.web.controller;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.fastjson.JSONObject;

import cmcc.mobile.yiqi.base.BaseController;
import cmcc.mobile.yiqi.utils.FileUpload;

/**
 * 
 * @author zhangxs
 *
 */
@Controller
@RequestMapping("/web/edit")
public class EditerController extends BaseController {
	/**
	 * 跳转编辑器页面
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping("/toEdit")
	public ModelAndView toEdit(HttpServletRequest request) {
		return new ModelAndView("editplugins/demoEditer").addObject("company", "company");
	}

	/**
	 * 上传
	 * 
	 * @param file
	 * @param request
	 * @return
	 */
	@RequestMapping("/upload")
	@ResponseBody
	public JSONObject toUpload(MultipartFile upfile, HttpServletRequest request) {
		try {
			String path = FileUpload.uploadFile(upfile, "notice");
			if (StringUtils.isNotEmpty(path)) {
				JSONObject jsonObject = new JSONObject();
				jsonObject.put("url", path);
				jsonObject.put("state", "SUCCESS");
				return jsonObject;
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

}
