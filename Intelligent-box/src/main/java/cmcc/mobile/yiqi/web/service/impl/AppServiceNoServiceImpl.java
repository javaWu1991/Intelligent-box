package cmcc.mobile.yiqi.web.service.impl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.gexin.rp.sdk.base.payload.APNPayload;
import com.gexin.rp.sdk.template.TransmissionTemplate;

import cmcc.mobile.yiqi.entity.TAppCompany;
import cmcc.mobile.yiqi.entity.TAppServiceNo;
import cmcc.mobile.yiqi.entity.TAppServicePush;
import cmcc.mobile.yiqi.entity.TAppOrganization;
import cmcc.mobile.yiqi.entity.TAppUser;
import cmcc.mobile.yiqi.entity.TAppUserClient;

import cmcc.mobile.yiqi.entity.dao.TAppOrganizationMapper;

import cmcc.mobile.yiqi.entity.dao.TAppServiceNoMapper;
import cmcc.mobile.yiqi.entity.dao.TAppServicePushMapper;
import cmcc.mobile.yiqi.entity.dao.TAppUserClientMapper;
import cmcc.mobile.yiqi.entity.dao.TAppUserMapper;
import cmcc.mobile.yiqi.utils.JsonResult;
import cmcc.mobile.yiqi.utils.Push2AppUtil;

import cmcc.mobile.yiqi.vo.AppOrganizationVo;
import cmcc.mobile.yiqi.vo.AppServiceNoVo;
import cmcc.mobile.yiqi.vo.PageVo;
import cmcc.mobile.yiqi.web.service.IAppOrganizationService;

import cmcc.mobile.yiqi.web.service.TAppServiceNoService;

/**
 * 
 * @author xwp
 *
 */
@Service
public class AppServiceNoServiceImpl implements TAppServiceNoService {

	@Autowired
	private TAppServiceNoMapper message;

	@Autowired
	private TAppOrganizationMapper appOrganizationMapper;

	@Autowired
	private TAppServicePushMapper appSendMessageMapper;

	@Autowired
	private TAppUserMapper appUserMapper;

	@Autowired
	private TAppUserClientMapper userClientMapper;

	@Autowired
	private IAppOrganizationService organizationService;

	@Override
	public String selectReceivers(Long id) {
		List<TAppServicePush> list = appSendMessageMapper.selectReceivers(id);
		JSONArray array = new JSONArray();
		for (TAppServicePush tAppSendMessage : list) {
			JSONObject json = new JSONObject();
			json.put("cid", tAppSendMessage.getCid());
			json.put("org_id", tAppSendMessage.getOrg_id());
			array.add(json);
		}
		return array.toString();
	}

	@Override
	public JsonResult checkMessageUpdate(AppServiceNoVo vo) {

		Map<String, Object> map = new HashMap<String, Object>();
		map.put("appid", vo.getAppid());
		// map.put("orgid", vo.getOrgId());
		map.put("createTime", vo.getCreateTime());
		map.put("startRow", 0);
		map.put("endRow", 1);
		long count = message.selectCountAllParams(map);
		List<TAppServiceNo> messages = message.selectAllParams(map);
		return new JsonResult(true, "" + count, CollectionUtils.isNotEmpty(messages) ? messages.get(0) : null);
	}

	@Override
	public JsonResult selectAllParams(AppServiceNoVo vo) {

		// String[] ids = vo.getOrgs().split(",");
		// List<Long> list = new ArrayList<Long>();
		// for (String string : ids) {
		// list.add(Long.parseLong(string));
		// }
		Map<String, Object> map = new HashMap<String, Object>();
		// map.put("cid", vo.getCid());
		// map.put("list", list);
		map.put("appid", vo.getAppid());
		map.put("startRow", vo.getStartRow());
		map.put("endRow", vo.getEndRow());

		List<TAppServiceNo> list1 = message.selectAllParams(map);
		/*
		 * if (CollectionUtils.isEmpty(list)) { System.out.println(list); }
		 */
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		for (TAppServiceNo tAppMessage : list1) {
			tAppMessage.setTime(format.format(new Date(tAppMessage.getCreateTime())));
		}
		long count = message.selectCountAllParams(map);

		JsonResult result = new JsonResult(true, "", list1);
		PageVo pageVo = new PageVo();
		pageVo.setPageNo(vo.getPageNo());
		pageVo.setPageSize(vo.getPageSize());
		pageVo.setTotalCountAndPageTotal((int) count);

		result.setPageVo(pageVo);
		return result;
	}

	@Override
	public int deleteByPrimaryKey(Long id) {
		appSendMessageMapper.deleteByMessageId(id);
		return message.deleteByPrimaryKey(id);
	}

	@Override
	public int insert(TAppServiceNo record) {

		return message.insert(record);
	}

	@Override
	public int save(AppServiceNoVo record, Boolean isJunit) {
		// 保存服务号
		TAppServiceNo mess = new TAppServiceNo();
		BeanUtils.copyProperties(record, mess);
		mess.setCreateTime(System.currentTimeMillis());
		int isOK = message.insertSelective(mess);
		long msg_id = mess.getId();
		// 保存发送公司或部门
		List<TAppServicePush> list = JSONArray.parseArray(record.getReceivers(), TAppServicePush.class);
		Map<String, TAppServicePush> sendMessageMap = new HashMap<String, TAppServicePush>();
		for (TAppServicePush appSendMessage : list) {
			initSendMessage(sendMessageMap, appSendMessage);

		}

		Map<Object, Object> cidMap = new HashMap<>();
		List<Long> cidList = new ArrayList<>();
		for (Map.Entry<String, TAppServicePush> entry : sendMessageMap.entrySet()) {
			TAppServicePush message = entry.getValue();
			message.setPush_id(msg_id);
			message.setCreatetime(new Date());
			if (!cidMap.containsKey(message.getCid())) {
				cidMap.put(message.getCid(), message.getCid());
				cidList.add(message.getCid());
				// cidMap.put(message.getOrg_id(), message.getOrg_id());
				// cidList.add(message.getOrg_id());
			}
			appSendMessageMapper.insert(message);
		}

		/**
		 * 去掉重复手机号
		 */
		Map<String, String> lUsers = new HashMap<String, String>();
		Map<String, Object> maps = new HashMap<String, Object>();
		List<String> strings = new ArrayList<String>();

		// 发送对象为公司的话
		maps.put("cids", cidList);
		if (mess.getCid() == 0) {
			for (Long cid : cidList) {
				List<AppOrganizationVo> organizations = organizationService.selectAllOrganization(cid);
				for (AppOrganizationVo appOrganizationVo : organizations) {
					List<TAppUser> users = appUserMapper.selectAllByOrgId(appOrganizationVo.getId());
					for (TAppUser tAppUser : users) {
						if (!lUsers.containsKey(tAppUser.getMobile())) {
							lUsers.put(tAppUser.getAccount(), tAppUser.getMobile());
							strings.add(tAppUser.getAccount().toString());
						}
					}
				}
			}
		} else {
			for (Map.Entry<String, TAppServicePush> entry : sendMessageMap.entrySet()) {
				TAppServicePush message = entry.getValue();
				List<TAppUser> users = appUserMapper.selectAllByOrgId(message.getOrg_id());
				for (TAppUser tAppUser : users) {
					if (!lUsers.containsKey(tAppUser.getMobile())) {
						lUsers.put(tAppUser.getAccount(), tAppUser.getMobile());
						strings.add(tAppUser.getAccount().toString());
					}
				}
			}
		}
		// 控制手机号
		if (CollectionUtils.isNotEmpty(strings) && strings.size() > 0) {
			maps.put("list", strings);
		}

		List<TAppUserClient> AllClients = userClientMapper.selectByAccount(maps);
		List<TAppUserClient> Android = new ArrayList<>();
		List<TAppUserClient> IOS = new ArrayList<>();
		if (CollectionUtils.isNotEmpty(AllClients)) {
			for (TAppUserClient tAppUserClient : AllClients) {
				if (tAppUserClient.getPhoneType() == 1) {
					Android.add(tAppUserClient);
				} else {
					IOS.add(tAppUserClient);
				}
			}

			Push2AppUtil util = new Push2AppUtil();
			TransmissionTemplate template = new TransmissionTemplate();
			template.setTransmissionType(2);
			JSONObject object = new JSONObject();
			object.put("type", 2);
			object.put("title", "服务号推送");
			object.put("content", mess.getTitle());
			object.put("url", util.getServiceDetailUrl() + mess.getId());
			template.setTransmissionContent(object.toJSONString());

			/**
			 * ios透传模板
			 */

			APNPayload.DictionaryAlertMsg alertMsg = new APNPayload.DictionaryAlertMsg();
			alertMsg.setTitle("服务号： " + mess.getTitle());
			// 通知文本消息字符串
			alertMsg.setBody(mess.getDetail());
			// 指定执行按钮所使用的Localizable.strings
			alertMsg.setActionLocKey("滑动查看");
			try {
				// util.AppPush(template);
				if (!isJunit) {
					util.AppPush(template, Android);
					util.IOSApnPush(alertMsg, IOS, object.toJSONString());
				}
			} catch (Exception e) {
				e.printStackTrace();
			} finally {

			}

		}

		/**
		 * 发送短信提醒
		 */

		// String messageTemplate = "管理员：" + record.getUname() + "发布了一条新公告《" +
		// mess.getTitle() + "》，请打开个人助理APP查看详情！";
		//
		// SMTemp smTemp = SMTemp.CUSTOM_MESSAGE;
		//
		// String[] telNos = strings.toArray(new String[] {});
		// smsSender.sendMassMessage(SmsUtils.SMS_TYPE_CUSTOM, telNos,
		// smTemp.createMessage(String.valueOf(messageTemplate)),
		// smTemp.getPriority(), smTemp.isRealTime(), null);
		//
		maps = null;
		lUsers = null;
		Android = null;
		IOS = null;
		strings = null;
		sendMessageMap = null;
		cidList = null;
		cidMap = null;

		return isOK;
	}

	@Override
	public int insertSelective(TAppServiceNo record) {

		return 0;
	}

	@Override
	public TAppServiceNo selectByPrimaryKey(Long id) {
		return message.selectByPrimaryKey(id);
	}

	@Override
	public int updateByPrimaryKeySelective(TAppServiceNo record) {

		return message.updateByPrimaryKeySelective(record);
	}

	@Override
	public int updateByPrimaryKeyWithBLOBs(TAppServiceNo record) {

		return message.updateByPrimaryKeyWithBLOBs(record);
	}

	@Override
	public int updateByPrimaryKey(AppServiceNoVo record) {
		appSendMessageMapper.deleteByMessageId(record.getId());

		TAppServiceNo entity = new TAppServiceNo();
		BeanUtils.copyProperties(record, entity);
		/**
		 * 保存发送对象
		 */
		List<TAppServicePush> list = JSONArray.parseArray(record.getReceivers(), TAppServicePush.class);
		Map<String, TAppServicePush> sendMessageMap = new HashMap<String, TAppServicePush>();
		for (TAppServicePush appSendMessage : list) {
			initSendMessage(sendMessageMap, appSendMessage);
		}

		for (Map.Entry<String, TAppServicePush> entry : sendMessageMap.entrySet()) {
			TAppServicePush message = entry.getValue();
			message.setPush_id(entity.getId());
			message.setCreatetime(new Date());
			appSendMessageMapper.insert(message);
		}

		sendMessageMap = null;
		return message.updateByPrimaryKeySelective(entity);
	}

	@Override
	public JsonResult selectByHistroyNotice(String cid, PageVo vo, Boolean isSuper, Object isAdminLogin, List<TAppCompany> companies, String title,
			String beginTime, String endTime, Long appid) {
		/**
		 * 如果以超级管理员身份登陆 admin 登陆，查询所有公告
		 */
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("startRow", vo.getStartRow());
		map.put("endRow", vo.getEndRow());
		map.put("title", title);
		if (null != beginTime) {
			map.put("beginTime", Long.parseLong(beginTime));
		}
		if (null != endTime) {
			map.put("endTime", Long.parseLong(endTime));
		}

		if (appid != null) {
			map.put("appid", appid);
		}
		// 超级管理员发布公告
		// if (isSuper) {
		// map.put("ids", null);
		// map.put("cid", null);
		// } else {
		// // 公司管理员发布
		// map.put("ids", "1");
		// map.put("cid", cid);
		// }

		List<AppServiceNoVo> list = message.selectByHistroyNotice(map);
		int count = message.selectCountByHistroyNotice(map);
		vo.setTotalCountAndPageTotal(count);
		map = null;
		return new JsonResult(true, "", list, vo);
	}

	@Override
	public List<TAppServiceNo> findByOriginNotice(Long record) {

		return message.findByOriginNotice(record);
	}

	private Map<String, TAppServicePush> initSendMessage(Map<String, TAppServicePush> sendMessageMap, TAppServicePush appSendMessage) {
		if (appSendMessage.getOrg_id() == null) {
			sendMessageMap.put(appSendMessage.getCid() + "|", appSendMessage);
		} else {
			if (!sendMessageMap.containsKey(appSendMessage.getCid() + "|"))
				initOrg(sendMessageMap, appSendMessage);
		}
		return sendMessageMap;
	}

	private void initOrg(Map<String, TAppServicePush> sendMessageMap, TAppServicePush appSendMessage) {
		// key: cid+|+orgid
		sendMessageMap.put(appSendMessage.getCid() + "|" + appSendMessage.getOrg_id(), appSendMessage);
		TAppOrganization appOrganization = new TAppOrganization();
		appOrganization.setCid(appSendMessage.getCid());
		appOrganization.setHigherId(appSendMessage.getOrg_id());
		List<TAppOrganization> orgs = appOrganizationMapper.selectOrgByCidAndHigherId(appOrganization);
		for (TAppOrganization organization : orgs) {
			TAppServicePush sendMessage = new TAppServicePush();
			sendMessage.setCid(appSendMessage.getCid());
			sendMessage.setCname(appSendMessage.getCname());
			sendMessage.setOrg_id(organization.getId());
			sendMessage.setDname(organization.getOrgName());
			sendMessageMap.put(organization.getCid() + "|" + organization.getId(), sendMessage);
			initOrg(sendMessageMap, sendMessage);
		}
	}
}
