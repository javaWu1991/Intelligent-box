package cmcc.mobile.yiqi.entity.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import cmcc.mobile.yiqi.entity.TAppTaskParticipants;

public interface TAppTaskParticipantsMapper {
    int deleteByPrimaryKey(Long id);
    
    int deleteParTask(Long taskid);
    
    int cancelTask(Long taskid);

    int insert(TAppTaskParticipants record);

    int insertSelective(TAppTaskParticipants record);

    TAppTaskParticipants selectByPrimaryKey(Long id);
    
    public List<TAppTaskParticipants> selectTask(Long uid);
    
    public List<TAppTaskParticipants> selectReadTask(Long uid);
    
    public List<TAppTaskParticipants> selectDoneTask(Long uid);
    
    public List<TAppTaskParticipants> selectAllTask(Long uid);
    
    public String selectMyCreateTask(Long taskid);
    
    public List<TAppTaskParticipants> selectParTask(@Param("uid")Long uid,@Param("taskid")Long taskid);
    
    public List<TAppTaskParticipants> aptMessage(Long taskId);
    
    public List<TAppTaskParticipants> selectFileTask(Long uid);
    
    public List<TAppTaskParticipants> selectTaskDetails(TAppTaskParticipants record);
    
    int endParTask(Long taskid);
    
    int oriUpdateMessage(TAppTaskParticipants record);
    
    int updateReadType(TAppTaskParticipants record);
    
    int updateMessage(TAppTaskParticipants record);
    
    int updateByPrimaryKeySelective(TAppTaskParticipants record);

    int updateByPrimaryKey(TAppTaskParticipants record);
}