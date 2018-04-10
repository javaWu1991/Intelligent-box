package cmcc.mobile.yiqi.api.controller;

import java.io.FileNotFoundException;
import java.net.ConnectException;
import java.security.NoSuchAlgorithmException;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.TypeMismatchException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.multiaction.NoSuchRequestHandlingMethodException;

import cmcc.mobile.yiqi.utils.JsonResult;
import cmcc.mobile.yiqi.vo.PageVo;


@Controller
public class ApiController { 

	@RequestMapping(value={"/api","/"})
	@ResponseBody
	public JsonResult Api() {
		return new JsonResult(true,"this is API service",null);
	}
	
	@RequestMapping(value={"/**"})
	@ResponseBody
	public JsonResult Api_no_service() {
		return new JsonResult(false,"This API interface does not exist",null);
	}
	

	@ModelAttribute("PageVo")
	public PageVo getPageInfo(@RequestParam(value = "pageNo", required = false) Integer pageNo,
			@RequestParam(value = "pageSize", required = false) Integer pageSize) {
		PageVo pageVo = new PageVo();
		if(pageNo != null)
			pageVo.setPageNo(pageNo);
		if(pageSize != null)
			pageVo.setPageNo(pageSize);
		return pageVo;
	}
	
	@RequestMapping(value = "forward",method=RequestMethod.POST)
	public ModelAndView forwardPage(String viewPath, String data) {
		ModelAndView model=new ModelAndView(viewPath);
		model.addObject("data", data);
		return model;
	}
	
	/**
	 * 全局异常处理
	 * 
	 * @return
	 */
	@ExceptionHandler(Exception.class)
	@ResponseBody
	public JsonResult ExceptionHandler(Exception exception, HttpServletResponse response) {
		String message = "";
		if (exception instanceof NumberFormatException) {
			message = "参数类型错误！";
		} else if (exception instanceof NoSuchRequestHandlingMethodException) {// 404
			message = "路径请求错误！";
		} else if (exception instanceof MissingServletRequestParameterException 
				|| exception instanceof TypeMismatchException
				|| exception instanceof HttpMessageNotReadableException) { // 400
			message = "接口请求错误(参数类型不匹配或参数缺失)！";
		} else if (exception instanceof NoSuchAlgorithmException) {
			message = "短信网关异常！";
		} else if (exception instanceof BindException) {
			message = "参数绑定错误！";
		} else if (exception instanceof NullPointerException) {
			message = "参数不可为空！";
		} else if (exception instanceof FileNotFoundException) {
			message = "所选文件不存在！";
		} else if (exception instanceof RuntimeException) {
			message = "内部错误！";
		} else if (exception instanceof ConnectException) {
			message = "请求连接错误！";
		} else if (exception instanceof MaxUploadSizeExceededException) {
			Long size = (((MaxUploadSizeExceededException) exception).getMaxUploadSize()) / 1024;
			message = "上传文件大小应小于" + size + "KB（" + size / 1024 + "MB）";
		} else {
			message = "系统错误！";
		}
		System.out.println("CQOA-Server " + message + " -trycatch- :" + exception.getMessage() + "\n");
		exception.printStackTrace();
		return new JsonResult(false, message + "   错误原因：" + exception.getMessage(), null);
	}
}

