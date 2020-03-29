package com.dhq.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableField;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 
 * </p>
 *
 * @author dhq
 * @since 2020-03-29
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("t_news")
public class News extends Model<News> {

    private static final long serialVersionUID = 1L;

    @TableId("ID")
    private String id;

    @TableField("TITLE")
    private String title;

    @TableField("REMARK")
    private String remark;

    @TableField("CREATEUSER")
    private String createuser;

    @TableField("SIGNATURE")
    private String signature;


    @Override
    protected Serializable pkVal() {
        return this.id;
    }

}
