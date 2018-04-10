package cmcc.mobile.yiqi.api.controller;

import java.io.IOException;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import cmcc.mobile.yiqi.utils.CheckoutUtil;
import cmcc.mobile.yiqi.utils.FileUpload;
import cmcc.mobile.yiqi.utils.JsonResult;

@Controller
@RequestMapping("util")
public class ApiUtilController {
	@RequestMapping(value = "upload", method = RequestMethod.POST)
	@ResponseBody
	public JsonResult uploadFile(@RequestParam(value = "base64", required = false) String[] base64, String[] fileName,
			String path) {
		String discPath = "";
		if (base64.length != fileName.length) {
			return new JsonResult(false, "参数错误", null);
		}
		try {
			for (int i = 0; i < base64.length; i++) {
				discPath = discPath + FileUpload.uploadByBase64(base64[i], fileName[i], path) + ",";
			}

		} catch (IOException e) {
			return new JsonResult(false, e.getMessage(), null);
		}
		return new JsonResult(true, discPath.substring(0, discPath.length() - 1), null);
	}

	@RequestMapping(value = "uploadForFile", method = RequestMethod.POST)
	@ResponseBody
	public JsonResult uploadFileForFile(@RequestParam(value = "files", required = false) MultipartFile[] files,
			String path) {
		if (files==null||files.length==0||path==null) {
			return CheckoutUtil.lackParam();
		}
		String fileString = "";
		if (files != null && files.length > 0) {
			for (MultipartFile file : files) {
				if (!file.isEmpty()) {
					try {
						fileString += (FileUpload.uploadFile(file, path) + ",");
					} catch (IOException e) {
						return new JsonResult(false, e.getMessage(), null);
					}
				}
			}

		}
		return new JsonResult(true, fileString, null);
	}

	@RequestMapping(value = "uploadImg", method = RequestMethod.POST)
	@ResponseBody
	// 图片上传
	public static String uploadImg(MultipartFile file, String path, Boolean isCompress, Integer w, Integer h)
			throws IOException {
		return FileUpload.uploadImg(file, path, isCompress, w, h);

	}
}
