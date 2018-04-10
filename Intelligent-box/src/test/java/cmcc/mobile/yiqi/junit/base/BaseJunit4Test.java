package cmcc.mobile.yiqi.junit.base;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractTransactionalJUnit4SpringContextTests;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;
import org.springframework.transaction.annotation.Transactional;

/**
 * 基类,主要就是用来加载配置文件的
 */
@SuppressWarnings("deprecation")
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({ "classpath:spring-config.xml", "classpath:spring-mvc-config.xml", "classpath:spring-mybatis-config-test.xml" })
@Transactional
@TransactionConfiguration(transactionManager = "transactionManager", defaultRollback = true)
public class BaseJunit4Test extends AbstractTransactionalJUnit4SpringContextTests {

	// 模拟request,response
	protected MockHttpServletRequest request;
	protected MockHttpServletResponse response;
	

	// 执行测试方法之前初始化模拟request,response
	@Before
	public void setUp() {

		// 模拟request response
		request = new MockHttpServletRequest();
		request.setCharacterEncoding("UTF-8");
		response = new MockHttpServletResponse();

	}

	@Test
	public void baseTest() {
		System.out.println("");
	}
}
