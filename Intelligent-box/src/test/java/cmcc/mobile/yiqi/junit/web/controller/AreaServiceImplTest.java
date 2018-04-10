package cmcc.mobile.yiqi.junit.web.controller;

import static org.junit.Assert.assertEquals;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import cmcc.mobile.yiqi.junit.base.BaseJunit4Test;
import cmcc.mobile.yiqi.utils.JsonResult;
import cmcc.mobile.yiqi.vo.AppUserVo;
import cmcc.mobile.yiqi.web.service.impl.AreaServiceImpl;

public class AreaServiceImplTest extends BaseJunit4Test{

	@Autowired
	private AreaServiceImpl areaServiceImpl;
	
	
	
	
	/**
	 * false 该部门下人员已删除
	 */
	@Test
	public void updateCompany4() {
		AppUserVo recond = new AppUserVo();
		recond.setId(88L);
		recond.setName("zz");
		recond.setTid("1000");
		recond.setCityname("hz");
		recond.setOrgId(100L);
		recond.setEmail("18720932424@139.com");
		recond.setCid(1L);
		recond.setAreaid(1);
		
		JsonResult result = areaServiceImpl.updateCompany(recond);
		assertEquals(result.getSuccess(), false);
	}
	
	
	
	//更新区域管理员 
	// true 人员信息修改成功
	@Test
	public void updateCompany() {
		AppUserVo recond = new AppUserVo();
		recond.setId(88L);
		recond.setName("zz");
		recond.setTid("1000");
		recond.setCityname("hz");
		recond.setOrgId(8L);
		recond.setEmail("18720932424@139.com");
		
		JsonResult result = areaServiceImpl.updateCompany(recond);
		assertEquals(result.getSuccess(), true);
	}
	
	
	//更新区域管理员 
	// true 人员信息修改成功
	@Test
	public void updateCompany2() {
		AppUserVo recond = new AppUserVo();
		recond.setId(88L);
		recond.setName("zz");
		recond.setTid("1000");
		recond.setCityname("hz");
		recond.setOrgId(8L);
		recond.setEmail("18720932424@139.com");
		recond.setCid(1L);
		recond.setAreaid(1);
		
		JsonResult result = areaServiceImpl.updateCompany(recond);
		assertEquals(result.getSuccess(), true);
	}
		
		
	//更新区域管理员
	//false 参数错误！ID不可为空
	@Test
	public void updateCompany3() {
		AppUserVo recond = new AppUserVo();	
		JsonResult result = areaServiceImpl.updateCompany(recond);
		assertEquals(result.getSuccess(), false);
	}
	
	

	
	
	
	//删除区域
	@Test
	public void deleteArea(){
		JsonResult result = areaServiceImpl.deleteArea("1","1","1");
		assertEquals(result.getSuccess(), true);
	}
	
	//false
	@Test
	public void deleteArea2(){
		JsonResult result = areaServiceImpl.deleteArea("10000","1","1");
		assertEquals(result.getSuccess(), false);
	}
	
	//更新区域信息
	@Test
	public void updateAreaStatus(){
		JsonResult result = areaServiceImpl.updateAreaStatus("1", 2);
		assertEquals(result.getSuccess(), true);
	}
	
	//false
	@Test
	public void updateAreaStatus2(){
		JsonResult result = areaServiceImpl.updateAreaStatus("100000", 200);
		assertEquals(result.getSuccess(), false);
	}
	
	
	
}
