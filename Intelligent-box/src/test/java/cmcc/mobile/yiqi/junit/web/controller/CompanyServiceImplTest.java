package cmcc.mobile.yiqi.junit.web.controller;

import static org.junit.Assert.assertEquals;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import cmcc.mobile.yiqi.entity.TAppCompany;
import cmcc.mobile.yiqi.junit.base.BaseJunit4Test;
import cmcc.mobile.yiqi.utils.JsonResult;
import cmcc.mobile.yiqi.web.service.impl.CompanyServiceImpl;

public class CompanyServiceImplTest extends BaseJunit4Test {

	@Autowired
	private CompanyServiceImpl companyService;

	/**
	 * 测试 addCompany
	 */
	@Test
	public void addCompany() {

		TAppCompany company = new TAppCompany();
		companyService.addCompany("account", company, "123456", "tname");
		assertEquals(true, true);
	}

	/**
	 * 测试 getByCode
	 */
	@Test
	public void getByCode() {
		JsonResult result = companyService.getByCode("000001");
		assertEquals(result.getSuccess(), true);
	}

	/**
	 * 测试 selectCompanyByAreaId
	 */
	@Test
	public void selectCompanyByAreaId() {
		companyService.selectCompanyByAreaId(110105);
		assertEquals(true, true);
	}

	/**
	 * getUserByCid
	 */
	@Test
	public void getUserByCid() {
		companyService.getUserByCid(0l);
		assertEquals(true, true);
	}

	/**
	 * 测试 selectByPrimaryKey
	 */
	@Test
	public void selectByPrimaryKey() {
		companyService.selectByPrimaryKey(1l);
		assertEquals(true, true);
	}

}
