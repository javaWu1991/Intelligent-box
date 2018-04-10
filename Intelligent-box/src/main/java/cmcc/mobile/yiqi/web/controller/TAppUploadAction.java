package cmcc.mobile.yiqi.web.controller;

import java.io.File;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

@Controller
public class TAppUploadAction {

	/**
	 * 上传图片
	 * @param file
	 * @param request
	 * @param model
	 * @return
	 */

    @RequestMapping(value = "/upload.do")  
    public String upload(@RequestParam(value = "file", required = false) MultipartFile file, HttpServletRequest request, ModelMap model) {  
  
        String path = request.getSession().getServletContext().getRealPath("upload");  
        String fileName = file.getOriginalFilename();  
        System.out.println(path);  
        File targetFile = new File(path, fileName);  
        if(!targetFile.exists()){  
            targetFile.mkdirs();  
        }  
        //保存  
        try {  
            file.transferTo(targetFile);  
            System.out.println(targetFile);
        } catch (Exception e) {  
            e.printStackTrace();  
        }  
        //获得图片存储路径
        model.addAttribute("fileUrl", request.getContextPath()+"/upload/"+fileName);
        return "result";  
    }  
}
