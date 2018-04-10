package cmcc.mobile.yiqi.api.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.FileNameMap;
import java.net.URLConnection;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.apache.shiro.authz.annotation.RequiresRoles;
import org.apache.shiro.mgt.RealmSecurityManager;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import cmcc.mobile.yiqi.entity.dao.TAppUserCompanyMapper;
import cmcc.mobile.yiqi.shiro.UserRealm;
import cmcc.mobile.yiqi.utils.FileUpload;
import cmcc.mobile.yiqi.web.service.ICompanyService;

@Controller
public class Tsetms {

	@Autowired
	TAppUserCompanyMapper tAppUserCompanyMapper;
	
	@Autowired
	ICompanyService companyservice;
	
	
	@RequestMapping("qqq")
	@ResponseBody
	public Object sss(){
	
	return null;	
	}
	
	@RequestMapping("qazxsw")
	@ResponseBody
	public Object nam123123e(Integer id) {
		return companyservice.selectCompanyByAreaId(id);
	}
	
	
	@RequestMapping("image")
	public void image_gif(HttpServletResponse response) throws IOException {
		File file = new File("D:/1.png");
		FileNameMap fileNameMap = URLConnection.getFileNameMap();
		String type = fileNameMap.getContentTypeFor("1.png");
		response.setContentType(type);
		FileInputStream is = new FileInputStream(file);
		ServletOutputStream out = response.getOutputStream();
		byte[] buffer = new byte[is.available()];
		is.read(buffer);
		out.write(buffer);
		is.close();
		out.flush();
		out.close();
	}

	@RequestMapping("jsp")
	public String name() {
		return "1.jsp";
	}

	@RequestMapping("html")
	public String name1() {
		return "index.html";
	}

	@RequestMapping("mhtml")
	public String name2() {
		return "111.mhtml";
	}

	@RequestMapping("test")
	public void sad() {
		String msg = "";
		String userName = "admin";
		String password = "123456";
		System.out.println(userName);
		System.out.println(password);
		UsernamePasswordToken token = new UsernamePasswordToken(userName, password);
		Subject subject = SecurityUtils.getSubject();
		subject.login(token);
		Session session = subject.getSession();
		session.setAttribute("userId", 1);
		session.setAttribute("companyId", 0);
		System.out.println(subject.isAuthenticated());
		System.out.println(subject.hasRole("admin"));
	}

	@RequestMapping("clear")
	public void clear() {
		RealmSecurityManager securityManager = (RealmSecurityManager) SecurityUtils.getSecurityManager();
		Subject subject = SecurityUtils.getSubject();
		UserRealm userRealm = (UserRealm) securityManager.getRealms().iterator().next();
		userRealm.clearCachedAuthenticationInfo(subject.getPrincipals());
		userRealm.clearCachedAuthorizationInfo(subject.getPrincipals());

	}

	@RequiresPermissions("organization:view")
	@RequestMapping("testqwe")
	public void asds() {
		System.out.println("123123123");

	}

	@RequiresPermissions("zsdasdasds")
	@RequestMapping("1")
	public void asds22() {
		System.out.println("123123123");

	}

	@RequiresRoles("admin")
	@RequestMapping("testadmin")
	public void asdsss() {
		System.out.println("123123123");
	}

	@RequiresRoles("hahah")
	@RequestMapping("testhaha")
	public void asdssssss() {
		System.out.println("123123123");
	}

	public static void main(String[] args) {
		String iString = "";
	}

	@RequestMapping("shangchuang")
	@ResponseBody
	public void asdname(String base64) throws IOException {
		FileUpload.uploadByBase64(base64, "1.jpg", "test");
	}

}
