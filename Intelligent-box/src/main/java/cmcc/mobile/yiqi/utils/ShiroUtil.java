package cmcc.mobile.yiqi.utils;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.mgt.RealmSecurityManager;
import org.apache.shiro.subject.Subject;

import cmcc.mobile.yiqi.shiro.UserRealm;

public class ShiroUtil {

	public static void clearAllCache() {
		RealmSecurityManager securityManager = (RealmSecurityManager) SecurityUtils.getSecurityManager();
		Subject subject = SecurityUtils.getSubject();
		UserRealm userRealm = (UserRealm) securityManager.getRealms().iterator().next();
		userRealm.clearCachedAuthenticationInfo(subject.getPrincipals());
		userRealm.clearCachedAuthorizationInfo(subject.getPrincipals());
	}
}
