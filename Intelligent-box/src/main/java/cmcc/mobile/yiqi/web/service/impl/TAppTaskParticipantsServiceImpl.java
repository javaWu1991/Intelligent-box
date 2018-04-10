package cmcc.mobile.yiqi.web.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cmcc.mobile.yiqi.entity.TAppTaskParticipants;
import cmcc.mobile.yiqi.entity.dao.TAppTaskParticipantsMapper;
import cmcc.mobile.yiqi.web.service.TAppTaskParticipantsService;

@Service
public class TAppTaskParticipantsServiceImpl implements TAppTaskParticipantsService{
	@Autowired
	private TAppTaskParticipantsMapper taskParService;
	
	@Override
	public int deleteByPrimaryKey(Long id) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int insert(TAppTaskParticipants record) {
		// TODO Auto-generated method stub
		return taskParService.insert(record);
	}

	@Override
	public int insertSelective(TAppTaskParticipants record) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public TAppTaskParticipants selectByPrimaryKey(Long id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public int updateByPrimaryKeySelective(TAppTaskParticipants record) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int updateByPrimaryKey(TAppTaskParticipants record) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public List<TAppTaskParticipants> selectTask(Long uid) {
		// TODO Auto-generated method stub
		return taskParService.selectTask(uid);
	}

	@Override
	public List<TAppTaskParticipants> selectReadTask(Long uid) {
		// TODO Auto-generated method stub
		return taskParService.selectReadTask(uid);
	}

	@Override
	public List<TAppTaskParticipants> selectParTask(Long uid, Long taskid) {
		// TODO Auto-generated method stub
		return taskParService.selectParTask(uid, taskid);
	}

	@Override
	public int updateReadType(TAppTaskParticipants record) {
		// TODO Auto-generated method stub
		return taskParService.updateReadType(record);
	}

	@Override
	public int updateMessage(TAppTaskParticipants record) {
		// TODO Auto-generated method stub
		return taskParService.updateMessage(record);
	}

	@Override
	public List<TAppTaskParticipants> aptMessage(Long taskId) {
		// TODO Auto-generated method stub
		return taskParService.aptMessage(taskId);
	}

	@Override
	public List<TAppTaskParticipants> selectDoneTask(Long uid) {
		// TODO Auto-generated method stub
		return taskParService.selectDoneTask(uid);
	}

	@Override
	public List<TAppTaskParticipants> selectAllTask(Long uid) {
		// TODO Auto-generated method stub
		return taskParService.selectAllTask(uid);
	}

	@Override
	public int deleteParTask(Long taskid) {
		// TODO Auto-generated method stub
		return taskParService.deleteParTask(taskid);
	}

	@Override
	public int oriUpdateMessage(TAppTaskParticipants record) {
		// TODO Auto-generated method stub
		return taskParService.oriUpdateMessage(record);
	}

	@Override
	public int endParTask(Long taskid) {
		// TODO Auto-generated method stub
		return taskParService.endParTask(taskid);
	}

	@Override
	public List<TAppTaskParticipants> selectFileTask(Long uid) {
		// TODO Auto-generated method stub
		return taskParService.selectFileTask(uid);
	}

	@Override
	public List<TAppTaskParticipants> selectTaskDetails(TAppTaskParticipants record) {
		// TODO Auto-generated method stub
		return taskParService.selectTaskDetails(record);
	}

	@Override
	public String selectMyCreateTask(Long taskid) {
		// TODO Auto-generated method stub
		return taskParService.selectMyCreateTask(taskid);
	}

	@Override
	public int cancelTask(Long taskid) {
		// TODO Auto-generated method stub
		return taskParService.cancelTask(taskid);
	}



}
