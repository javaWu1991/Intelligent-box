package cmcc.mobile.yiqi.entity;

public class TAppbakExcel {
    private Long id;

    private Long cid;

    private String bakPath;

    private Integer status;

    private Long createTime;

    private Long updateTime;

    private Integer bakCount;

    private String bakResource;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCid() {
        return cid;
    }

    public void setCid(Long cid) {
        this.cid = cid;
    }

    public String getBakPath() {
        return bakPath;
    }

    public void setBakPath(String bakPath) {
        this.bakPath = bakPath == null ? null : bakPath.trim();
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }

    public Long getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Long updateTime) {
        this.updateTime = updateTime;
    }

    public Integer getBakCount() {
        return bakCount;
    }

    public void setBakCount(Integer bakCount) {
        this.bakCount = bakCount;
    }

    public String getBakResource() {
        return bakResource;
    }

    public void setBakResource(String bakResource) {
        this.bakResource = bakResource == null ? null : bakResource.trim();
    }
}