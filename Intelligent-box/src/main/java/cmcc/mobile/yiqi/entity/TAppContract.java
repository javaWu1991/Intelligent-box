package cmcc.mobile.yiqi.entity;

import javax.persistence.*;

@Table(name = "t_app_contract")
public class TAppContract {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 合同编号
     */
    private String number;

    /**
     * 合同名称
     */
    private String name;

    /**
     * 合同价格
     */
    private String money;

    /**
     * 合同承办人
     */
    private String companyCommander;

    /**
     * 对方主体名称
     */
    private String companyName;

    private Long createTime;

    private Long updateTime;

    /**
     * 未更新天数
     */
    private Integer noUpdateDay;

    /**
     * 合同创建人
     */
    private Long creator;

    /**
     * 状态说明
     */
    private String statusExplain;

    /**
     * 公司id
     */
    private Long cid;

    /**
     * 准备状态 1
起草状态 2
审批状态 3
签署状态 4
执行状态 5
结束状态 6
     */
    private Integer status;

    /**
     * @return id
     */
    public Long getId() {
        return id;
    }

    /**
     * @param id
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * 获取合同编号
     *
     * @return number - 合同编号
     */
    public String getNumber() {
        return number;
    }

    /**
     * 设置合同编号
     *
     * @param number 合同编号
     */
    public void setNumber(String number) {
        this.number = number;
    }

    /**
     * 获取合同名称
     *
     * @return name - 合同名称
     */
    public String getName() {
        return name;
    }

    /**
     * 设置合同名称
     *
     * @param name 合同名称
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * 获取合同价格
     *
     * @return money - 合同价格
     */
    public String getMoney() {
        return money;
    }

    /**
     * 设置合同价格
     *
     * @param money 合同价格
     */
    public void setMoney(String money) {
        this.money = money;
    }

    /**
     * 获取合同承办人
     *
     * @return companyCommander - 合同承办人
     */
    public String getCompanyCommander() {
        return companyCommander;
    }

    /**
     * 设置合同承办人
     *
     * @param companyCommander 合同承办人
     */
    public void setCompanyCommander(String companyCommander) {
        this.companyCommander = companyCommander;
    }

    /**
     * 获取对方主体名称
     *
     * @return companyName - 对方主体名称
     */
    public String getCompanyName() {
        return companyName;
    }

    /**
     * 设置对方主体名称
     *
     * @param companyName 对方主体名称
     */
    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    /**
     * @return createTime
     */
    public Long getCreateTime() {
        return createTime;
    }

    /**
     * @param createTime
     */
    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }

    /**
     * @return updateTime
     */
    public Long getUpdateTime() {
        return updateTime;
    }

    /**
     * @param updateTime
     */
    public void setUpdateTime(Long updateTime) {
        this.updateTime = updateTime;
    }

    /**
     * 获取未更新天数
     *
     * @return noUpdateDay - 未更新天数
     */
    public Integer getNoUpdateDay() {
        return noUpdateDay;
    }

    /**
     * 设置未更新天数
     *
     * @param noUpdateDay 未更新天数
     */
    public void setNoUpdateDay(Integer noUpdateDay) {
        this.noUpdateDay = noUpdateDay;
    }

    /**
     * 获取合同创建人
     *
     * @return creator - 合同创建人
     */
    public Long getCreator() {
        return creator;
    }

    /**
     * 设置合同创建人
     *
     * @param creator 合同创建人
     */
    public void setCreator(Long creator) {
        this.creator = creator;
    }

    /**
     * 获取状态说明
     *
     * @return statusExplain - 状态说明
     */
    public String getStatusExplain() {
        return statusExplain;
    }

    /**
     * 设置状态说明
     *
     * @param statusExplain 状态说明
     */
    public void setStatusExplain(String statusExplain) {
        this.statusExplain = statusExplain;
    }

    /**
     * 获取公司id
     *
     * @return cid - 公司id
     */
    public Long getCid() {
        return cid;
    }

    /**
     * 设置公司id
     *
     * @param cid 公司id
     */
    public void setCid(Long cid) {
        this.cid = cid;
    }

    /**
     * 获取准备状态 1
起草状态 2
审批状态 3
签署状态 4
执行状态 5
结束状态 6
     *
     * @return status - 准备状态 1
起草状态 2
审批状态 3
签署状态 4
执行状态 5
结束状态 6
     */
    public Integer getStatus() {
        return status;
    }

    /**
     * 设置准备状态 1
起草状态 2
审批状态 3
签署状态 4
执行状态 5
结束状态 6
     *
     * @param status 准备状态 1
起草状态 2
审批状态 3
签署状态 4
执行状态 5
结束状态 6
     */
    public void setStatus(Integer status) {
        this.status = status;
    }
}