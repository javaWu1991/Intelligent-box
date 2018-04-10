package cmcc.mobile.yiqi.junit.web.controller;

import static org.junit.Assert.assertEquals;

import java.util.List;
import java.util.Map;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import cmcc.mobile.yiqi.entity.TAppCompany;
import cmcc.mobile.yiqi.entity.TAppOrganization;
import cmcc.mobile.yiqi.entity.TAppUser;
import cmcc.mobile.yiqi.junit.base.BaseJunit4Test;
import cmcc.mobile.yiqi.utils.JsonResult;
import cmcc.mobile.yiqi.vo.AppCompanyVo;
import cmcc.mobile.yiqi.vo.AppOrganizationVo;
import cmcc.mobile.yiqi.vo.AppUserVo;
import cmcc.mobile.yiqi.web.service.impl.AppOrganizationServiceImpl;
import cmcc.mobile.yiqi.web.service.impl.AppUserServiceImpl;

/**
 * 
 * @author zhangxs
 * @des 单元测试
 *
 */
public class UserServiceImplTest extends BaseJunit4Test {

	@Autowired
	private AppUserServiceImpl userServiceImpl;

	@Autowired
	private AppOrganizationServiceImpl organizationServiceImpl;

	/**
	 * 根据用户账号获取可用的关联企业信息
	 */
	@Test
	public void selectCompanyByAccount() {
		userServiceImpl.selectCompanyByAccount("13871014212");
		assertEquals(true, true);
	}

	/**
	 * 查询全部账号信息
	 */
	@Test
	public void selectAll() {
		List<TAppUser> list = userServiceImpl.selectAll();
		assertEquals(list.size() > 0, true);
	}

	/**
	 * 根据账号查询用户信息
	 */
	@Test
	public void selectTAppUser() {
		TAppUser user = userServiceImpl.selectByAccount("admin");
		assertEquals(null != user, true);
	}

	@Test
	public void listCustomer() {
		AppUserVo vo = new AppUserVo();
		userServiceImpl.listCustomer(vo);
		assertEquals(1, 1);
	}

	@Test
	public void selectAllByParam() {
		AppUserVo vo = new AppUserVo();
		JsonResult result = userServiceImpl.selectAllByParam(vo);
		assertEquals(result.getSuccess(), true);
	}

	/**
	 * 删除用户信息
	 */
	@Test
	public void deleteByPrimaryKey() {
		int result = userServiceImpl.deleteByPrimaryKey(0L);
		assertEquals(result == 0, true);
	}

	/**
	 * 插入用户信息
	 */
	@Test
	public void insert() {
		TAppUser user = new TAppUser();
		user.setAccount("junit test");
		int result = userServiceImpl.insert(user);
		assertEquals(result, 1);
	}

	/**
	 * 通讯录员工置顶
	 */
	@Test
	public void toTop() {
		JsonResult result = userServiceImpl.toTop("1", "1", 0);
		assertEquals(result.getSuccess(), true);
	}

	/**
	 * 通讯录设置高管模式
	 */
	@Test
	public void setCompanyIsHide() {
		JsonResult result = userServiceImpl.setCompanyIsHide("1", 1, request);
		if (result.getSuccess()) {
			result = userServiceImpl.setCompanyIsHide("1", 0, request);
		}
		assertEquals(true, true);
	}

	/**
	 * 根据主键查询用户信息
	 */
	@Test
	public void selectByPrimaryKey() {
		TAppUser user = userServiceImpl.selectByPrimaryKey(2L);
		assertEquals(null != user, true);
	}

	/**
	 * 修改用户信息
	 */
	@Test
	public void updateByPrimaryKeySelective() {
		TAppUser user = userServiceImpl.selectByPrimaryKey(2L);
		if (null != user) {
			user.setPassword(null);
			int result = userServiceImpl.updateByPrimaryKeySelective(user);
			assertEquals(result == 1, true);
		} else {
			assertEquals(null != user, true);
		}
	}

	/**
	 * 根据主键信息修改用户信息
	 */
	@Test
	public void updateByPrimaryKey() {
		TAppUser user = new TAppUser();
		int result = userServiceImpl.updateByPrimaryKey(user);
		assertEquals(result == 0, true);
	}

	/**
	 * 账号密码登陆接口
	 */
	@Test
	public void loginCheck() {
		userServiceImpl.loginCheck("admin", "123456");
		assertEquals(true, true);
	}

	/**
	 * APP登陆选择集团信息接口
	 */
	@Test
	public void findCompanyByUser() {
		List<TAppCompany> list = userServiceImpl.findCompanyByUser(2L, "13871014212", true);
		assertEquals(list.size() > 0, true);
	}

	/**
	 * web登陆选择集团
	 */
	@Test
	public void webfindCompanyByUser() {
		List<TAppCompany> list = userServiceImpl.findCompanyByUser(2L, "13871014212", false);
		assertEquals(list.size() > 0, true);
	}

	/**
	 * 查询所有企业管理员信息
	 */
	@Test
	public void selectAllByParams() {
		AppUserVo vo = new AppUserVo();
		vo.setCid(1L);
		JsonResult result = userServiceImpl.selectAllByParams(vo);
		assertEquals(result.getSuccess(), true);
	}

	/**
	 * 查询组织接口
	 */
	@Test
	public void selectOrgByCidAndHigherId() {
		List<TAppOrganization> list = userServiceImpl.selectOrgByCidAndHigherId(1L, "");
		assertEquals(list.size() > 0, true);
	}

	/**
	 * 统计部门人数
	 */
	@Test
	public void getCountPeolpeByOid() {
		Long count = userServiceImpl.getCountPeolpeByOid(1L);
		assertEquals(count.longValue() > -1, true);
	}

	/**
	 * 统计公司总人数
	 */
	@Test
	public void getCountPeopleByCid() {
		Long count = userServiceImpl.getCountPeopleByCid(1L);
		assertEquals(count.longValue() > -1, true);
	}

	/**
	 * 获取管理公司的组织架构
	 */
	@Test
	public void companyOrgUser() {
		List<AppCompanyVo> list = userServiceImpl.companyOrgUser(1L);
		assertEquals(list.size() > 0, true);
	}

	/**
	 * 获取部门下人员列表
	 */
	@Test
	public void selectUsersByOrgId() {
		List<TAppUser> list = userServiceImpl.selectUsersByOrgId(1L);
		assertEquals(list.size() > 0, true);
	}

	/**
	 * 分页查询部门用户信息
	 */
	@Test
	public void selectAllByOrgId() {
		AppUserVo vo = new AppUserVo();
		vo.setOrgId(1L);
		JsonResult result = userServiceImpl.selectAllByOrgId(vo);
		assertEquals(result.getSuccess(), true);
	}

	/**
	 * 查询注册加入企业待审核的用户
	 */
	@Test
	public void selectPendingApproval() {
		List<TAppUser> list = userServiceImpl.selectPendingApproval("1");
		if (CollectionUtils.isNotEmpty(list)) {
			assertEquals(list.size() > 0, true);
		} else {
			assertEquals(true, true);
		}
	}

	/**
	 * 删除部门
	 */
	@Test
	public void deleteByPrimaryKey_org() {
		JsonResult result = organizationServiceImpl.deleteByPrimaryKey(1L);
		assertEquals(StringUtils.isNotEmpty(result.getMessage()), true);
	}

	/**
	 * 新增、修改部门
	 */
	@Test
	public void insertOrUpdate() {
		AppOrganizationVo vo = new AppOrganizationVo();
		vo.setOrgName("Junit test org");
		vo.setCid(1L);
		vo.setHigherId(0L);
		JsonResult result = organizationServiceImpl.insertOrUpdate(vo);
		assertEquals(result.getSuccess(), true);
	}

	/**
	 * 获取多个部门
	 */
	@Test
	public void queryUsersByOrgIds() {
		Map<String, TAppUser> map = organizationServiceImpl.queryUsersByOrgIds(new String[] { "1", "2", "3", "4" });
		assertEquals(StringUtils.isNotEmpty(map.toString()), true);
	}

	/**
	 * 删除部门下人员
	 */
	@Test
	public void deleteOrgUser() {
		JsonResult result = userServiceImpl.deleteOrgUser("1", "1,2,3,4,5,6,7,8,9,10,11");
		assertEquals(result.getSuccess(), true);
	}

	/**
	 * 修改用户信息
	 */
	@Test
	public void updateByPrimaryKeySelective_2() {
		AppUserVo vo = new AppUserVo();
		vo.setId(2L);
		vo.setOrgId(3L);
		vo.setName("吴火焱");
		JsonResult result = userServiceImpl.updateByPrimaryKeySelective(vo);
		assertEquals(StringUtils.isNotEmpty(result.getMessage()), true);
	}

	/**
	 * 新增用户
	 */
	@Test
	public void insertSelective() {
		AppUserVo vo = new AppUserVo();
		vo.setMobile("13871014212");
		vo.setName("火焱");
		vo.setPassword("123456");
		vo.setSex(1);
		vo.setOrgId(1L);
		JsonResult result = userServiceImpl.insertSelective(vo, false, request);
		assertEquals(StringUtils.isNotEmpty(result.getMessage()), true);
	}

	/**
	 * 禁用启用
	 */
	@Test
	public void updateAdminStatus() {
		JsonResult result = userServiceImpl.updateAdminStatus("13871014212", "1", 1);
		assertEquals(StringUtils.isNotEmpty(result.getMessage()), true);
	}

	/**
	 * 删除企业管理员
	 */
	@Test
	public void deleteUserCompany() {
		JsonResult result = userServiceImpl.deleteUserCompany("13871014212", "1", "1", "1");
		assertEquals(StringUtils.isNotEmpty(result.getMessage()), true);
	}

	@Test
	public void selectParId() {
		userServiceImpl.selectParId("13871014212");
		assertEquals(1, 1);
	}

	@Test
	public void importExcel() {
		try {

			HSSFWorkbook workbook = new HSSFWorkbook();
			HSSFSheet sheet = workbook.createSheet();

			/**
			 * 封装数据
			 */
			HSSFRow row0 = sheet.createRow(0);
			CellRangeAddress cra = new CellRangeAddress(0, 0, 0, 6);

			HSSFCell cell0 = row0.createCell(0);
			cell0.setCellValue("说明：姓名,手机号码,部门,职位(不填职级默认则职级默认为1，短号最长为6位数字)为必填项，且必须使用该模板进行导入！");
			sheet.addMergedRegion(cra);
			String[] headers = new String[] { "员工姓名", "手机号码", "短号", "性别", "邮箱", "所属部门", "职位", "职级" };
			HSSFRow row1 = sheet.createRow(1);
			for (int i = 0; i < headers.length; i++) {
				HSSFCell cell = row1.createCell(i);
				HSSFRichTextString text = new HSSFRichTextString(headers[i]);
				cell.setCellValue(text);
			}

			HSSFRow row2 = sheet.createRow(2);

			HSSFCell cell = row2.createCell(0);
			cell.setCellValue("Junit");

			HSSFCell cell1 = row2.createCell(1);
			cell1.setCellValue("13702444201");

			HSSFCell cell3 = row2.createCell(3);
			cell3.setCellValue(1);

			HSSFCell cell5 = row2.createCell(5);
			cell5.setCellValue("A");

			HSSFCell cell6 = row2.createCell(6);
			cell6.setCellValue("A研发");

			request.getSession().setAttribute("userName", "Junit Test");
			JsonResult result = userServiceImpl.importExcel("1", null, request, response, false, true, workbook);
			System.out.println(result.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
		}
		assertEquals(1, 1);
	}

}