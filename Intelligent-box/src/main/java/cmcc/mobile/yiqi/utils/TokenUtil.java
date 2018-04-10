package cmcc.mobile.yiqi.utils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

public class TokenUtil {
	private static String TOKEN_KEY = "cmcc.mobile.yiqi.token";

	public static void saveToken(HttpServletRequest request) {
		HttpSession session = request.getSession(true);
		String token = System.currentTimeMillis() + "" + Math.random();
		session.setAttribute(TOKEN_KEY, token);
		request.setAttribute(TOKEN_KEY, token);
	}

	public static boolean isValidToken(HttpServletRequest request) {
		HttpSession session = request.getSession(true);
		String sToken = (String) session.getAttribute(TOKEN_KEY);
		String rToken = (String) request.getParameter(TOKEN_KEY);

		session.removeAttribute(TOKEN_KEY);

		if (sToken != null && !"".equals(sToken) && sToken.equals(rToken)) {
			return true;
		} else {
			return false;
		}
	}
}
