package cmcc.mobile.yiqi.utils;

import cmcc.mobile.yiqi.vo.PageVo;

import com.github.pagehelper.Page;

public class PageHelper {
	
	/**
	 * 执行分页，在调用服务方法前调用此方法
	 * @see 
	 * <code>
	 * //PageHelper.startPage(1, 5);<br>
	 * PageHelper.startPage(pageVo);<br>
	 * taskList = taskService.selectTask(uid);<br>
	 * PageInfo<TAppTask> pageInfo = new PageInfo<TAppTask>(taskList);<br>
	 * </code>
	 * @param pageVo
	 * @return
	 */
	 public static Page<?> startPage(PageVo pageVo) {
		return com.github.pagehelper.PageHelper.startPage(pageVo.getPageNo(), pageVo.getPageSize());
	 }
}
