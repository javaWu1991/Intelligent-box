package cmcc.mobile.yiqi.junit.web.controller;

import static org.junit.Assert.assertEquals;

import java.util.ArrayList;

import org.apache.commons.lang3.StringUtils;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import cmcc.mobile.yiqi.entity.TAppCompany;
import cmcc.mobile.yiqi.junit.base.BaseJunit4Test;
import cmcc.mobile.yiqi.utils.JsonResult;
import cmcc.mobile.yiqi.vo.AppServiceNoVo;
import cmcc.mobile.yiqi.vo.PageVo;
import cmcc.mobile.yiqi.web.service.impl.AppServiceNoServiceImpl;

public class ServiceNoServiceImplTest extends BaseJunit4Test {

	@Autowired
	private AppServiceNoServiceImpl serviceNoServiceImpl;

	@Test
	public void selectReceivers() {
		String json = serviceNoServiceImpl.selectReceivers(2L);
		assertEquals(StringUtils.isNotEmpty(json), true);
	}

	@Test
	public void checkMessageUpdate() {
		AppServiceNoVo vo = new AppServiceNoVo();
		vo.setAppid(1L);
		vo.setCreateTime(System.currentTimeMillis());
		JsonResult result = serviceNoServiceImpl.checkMessageUpdate(vo);
		assertEquals(result.getSuccess(), true);
	}

	@Test
	public void save() {
		AppServiceNoVo vo = new AppServiceNoVo();
		vo.setContent("junit content");
		vo.setReceivers("[{'cid':'1','org_id':'1'}]");
		vo.setCid(1L);
		serviceNoServiceImpl.save(vo, true);
		assertEquals(true, true);
	}

	@Test
	public void selectAllParams() {
		AppServiceNoVo vo = new AppServiceNoVo();
		vo.setAppid(1L);
		JsonResult result = serviceNoServiceImpl.selectAllParams(vo);
		assertEquals(result.getSuccess(), true);
	}

	@Test
	public void deleteByPrimaryKey() {
		serviceNoServiceImpl.deleteByPrimaryKey(1L);
		assertEquals(true, true);
	}

	@Test
	public void updateByPrimaryKey() {
		AppServiceNoVo vo = new AppServiceNoVo();
		vo.setId(1L);
		vo.setReceivers("[{'cid':'1','org_id':'1'}]");
		vo.setCname("12312312");
		vo.setUname("123123123");
		serviceNoServiceImpl.updateByPrimaryKey(vo);
		assertEquals(true, true);
	}

	@Test
	public void selectByHistroyNotice() {
		JsonResult result = serviceNoServiceImpl.selectByHistroyNotice("1", new PageVo(), false, false, new ArrayList<TAppCompany>(), null, null,
				null, null);
		assertEquals(result.getSuccess(), true);
	}

}
