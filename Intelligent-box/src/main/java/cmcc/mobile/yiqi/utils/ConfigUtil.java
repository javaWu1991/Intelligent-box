package cmcc.mobile.yiqi.utils;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Map;
import java.util.Properties;
import java.util.SortedMap;
import java.util.TreeMap;
import org.apache.commons.configuration.Configuration;
import org.apache.log4j.Logger;
/**
 * 相关配置参数 
 * 创建者 吴奔江 
 * 创建时间 2017年7月31日
 */
public class ConfigUtil {
	private static Configuration configs;
	public  static final String API_KEY = "xaj19910531xaj19910531xaj1991053";// API密钥
	public  static final String APP_ID = "";
    public  static final String MCH_ID = "";
    public  static final String APP_SECRET = "";
    public  static final String CERT_PATH = "" ;
	public  static String imgUrl ;//图片域名地址
	protected Logger LOG = Logger.getLogger(getClass());

    private Properties config = new Properties();

    static {
        try {
            ConfigUtil config = ConfigUtil.load("info.properties");

            imgUrl = config.get("imgUrl") ;
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private ConfigUtil(String configFile) {
        try {
            InputStream is = getConfigFileStream(configFile);
            if (is != null) {
                config.load(new InputStreamReader(is));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private InputStream getConfigFileStream(String configFile) {
        InputStream is = null;
        try {
            File file = new File(configFile);
            if (file.exists()) {
                is = new FileInputStream(file);
            } else {
                //                file = new File(ConfigUtil.class.getResource("/").getPath() + configFile);
                file = new File(Thread.currentThread().getContextClassLoader()
                        .getResource("info.properties").getFile());
                if (file.exists()) {
                    is = new FileInputStream(file);
                } else {
                    is = ConfigUtil.class.getResourceAsStream(configFile);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return is;
    }
            
    public static ConfigUtil load(String configFile) {
        return new ConfigUtil(configFile);
    }

    public String get(String key) {
        return config.getProperty(key);
    }

    public int getInt(String key) {
        String value = get(key);
        if (value == null) {
            return 0;
        }
        return Integer.parseInt(value);
    }

    public boolean getBool(String key) {
        String value = get(key);
        if (value == null) {
            return false;
        }
        return Boolean.parseBoolean(value);
    }
    
    public long getLong(String key){
    	String value = get(key);
        if (value == null) {
            return -1L;
        }
        return Long.parseLong(value);
    }
	/**
	 * 微信基础接口地址
	 */
	// 获取token接口(GET)
	public final static String TOKEN_URL = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET";
	// oauth2授权接口(GET)
	public final static String OAUTH2_URL = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code";
	// 刷新access_token接口（GET）
	public final static String REFRESH_TOKEN_URL = "https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=APPID&grant_type=refresh_token&refresh_token=REFRESH_TOKEN";
	// 菜单创建接口（POST）
	public final static String MENU_CREATE_URL = "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=ACCESS_TOKEN";
	// 菜单查询（GET）
	public final static String MENU_GET_URL = "https://api.weixin.qq.com/cgi-bin/menu/get?access_token=ACCESS_TOKEN";
	// 菜单删除（GET）
	public final static String MENU_DELETE_URL = "https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=ACCESS_TOKEN";
	/**
	 * 微信支付接口地址
	 */
	// 微信支付统一接口(POST)
	public final static String UNIFIED_ORDER_URL = "https://api.mch.weixin.qq.com/pay/unifiedorder";
	// 微信退款接口(POST)
	public final static String REFUND_URL = "https://api.mch.weixin.qq.com/secapi/pay/refund";
	// 订单查询接口(POST)
	public final static String CHECK_ORDER_URL = "https://api.mch.weixin.qq.com/pay/orderquery";
	// 关闭订单接口(POST)
	public final static String CLOSE_ORDER_URL = "https://api.mch.weixin.qq.com/pay/closeorder";
	// 退款查询接口(POST)
	public final static String CHECK_REFUND_URL = "https://api.mch.weixin.qq.com/pay/refundquery";
	// 对账单接口(POST)
	public final static String DOWNLOAD_BILL_URL = "https://api.mch.weixin.qq.com/pay/downloadbill";
	// 短链接转换接口(POST)
	public final static String SHORT_URL = "https://api.mch.weixin.qq.com/tools/shorturl";
	// 接口调用上报接口(POST)
	public final static String REPORT_URL = "https://api.mch.weixin.qq.com/payitil/report";
    
	/**
	 * 基础参数
	 * @Author  吴奔江
	 * @param packageParams  void
	 * @Date	2017年7月31日
	 * 更新日志
	 * 2017年7月31日  吴奔江 首次创建
	 *
	 */
	public static void commonParams(SortedMap<Object, Object> packageParams) {
		// 生成随机字符串
		String currTime = PayCommonUtil.getCurrTime();
		String strTime = currTime.substring(8, currTime.length());
		String strRandom = PayCommonUtil.buildRandom(4) + "";
		String nonce_str = strTime + strRandom;
		packageParams.put("nonce_str", nonce_str);// 随机字符串
	}

	/**
	 * 该接口主要用于扫码原生支付模式一中的二维码链接转成短链接(weixin://wxpay/s/XXXXXX)，减小二维码数据量，提升扫描速度和精确度
	 * @Author  吴奔江
	 * @param urlCode  void
	 * @Date	2017年7月31日
	 * 更新日志
	 * 2017年7月31日  吴奔江 首次创建
	 *
	 */
	@SuppressWarnings("rawtypes")
	public static void shorturl(String urlCode) {
		try {
			String key = ConfigUtil.API_KEY; // key
			SortedMap<Object, Object> packageParams = new TreeMap<Object, Object>();
			ConfigUtil.commonParams(packageParams);
			packageParams.put("long_url", urlCode);// URL链接
			String sign = PayCommonUtil.createSign("UTF-8", packageParams, key);
			packageParams.put("sign", sign);// 签名
			String requestXML = PayCommonUtil.getRequestXml(packageParams);
			String resXml = HttpUtil.postData(ConfigUtil.SHORT_URL, requestXML);
			Map map = XMLUtil.doXMLParse(resXml);
			String returnCode = (String) map.get("return_code");
			if ("SUCCESS".equals(returnCode)) {
				String resultCode = (String) map.get("return_code");
				if ("SUCCESS".equals(resultCode)) {
					urlCode = (String) map.get("short_url");
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}