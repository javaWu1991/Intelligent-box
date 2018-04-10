package cmcc.mobile.yiqi.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import cmcc.mobile.yiqi.base.BaseController;

@Controller
@RequestMapping("/web/static")
public class StaticController extends BaseController {

	@RequestMapping("/{filename}")
	public ModelAndView goPage(@PathVariable String filename) {
		return new ModelAndView("/static/" + filename);
	}

}
