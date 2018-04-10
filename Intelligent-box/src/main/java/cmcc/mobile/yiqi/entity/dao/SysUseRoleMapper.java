package cmcc.mobile.yiqi.entity.dao;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import cmcc.mobile.yiqi.entity.SysUseRole;

public interface SysUseRoleMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(SysUseRole record);

    int insertSelective(SysUseRole record);

    SysUseRole selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(SysUseRole record);

    int updateByPrimaryKey(SysUseRole record);
    
    @Select("<script>select * from sys_user_role where uid = #{uid} <if test=\"cid!=null\"> and cid = #{cid}</if></script>")
    List<SysUseRole> byUidCid(@Param("uid")Integer uid,@Param("cid")Integer cid);

    @Delete("<script>delete from sys_user_role where uid = #{uid} <if test=\"cid!=null\"> and cid = #{cid}</if></script>")
    int deleteByUidCid(@Param("uid")Integer uid,@Param("cid")Integer cid);

    @Insert("insert into sys_user_role(uid,cid,rid) values(#{r.uid},#{r.cid},#{r.rid}) on duplicate key update uid = #{r.uid},cid  = #{r.cid}, rid = #{r.rid}")
    int insertForUpdate(@Param("r")SysUseRole record);
    @Delete("delete from sys_user_role where uid = #{uid} and cid  = #{cid} and  rid = #{rid} ")
	int deleteUserRoleByUidCidRid(@Param("rid")String rid, @Param("cid")Integer cid, @Param("uid")Integer uid);
}