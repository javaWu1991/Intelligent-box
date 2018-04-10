package cmcc.mobile.yiqi.entity.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import cmcc.mobile.yiqi.entity.SysRole;

public interface SysRoleMapper {
    int deleteByPrimaryKey(Long id);

    int insert(SysRole record);

    int insertSelective(SysRole record);

    SysRole selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(SysRole record);

    int updateByPrimaryKey(SysRole record);
    @Select("<script>select DISTINCT r.* from sys_role r,sys_user_role ur where ur.uid=#{uid}  <if test =\"cid!=null\" >and  ur.cid=#{cid}</if>  and ur.rid=r.id</script>")
    List<SysRole> byUidCid(@Param("uid") Integer uid,@Param("cid") Integer cid);
@Select("select * from sys_role where available = 1")
	List<SysRole> quetyAll();
}