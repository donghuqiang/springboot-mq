package com.dhq.eventListener;

import java.io.Serializable;
import java.util.Date;

/**
 * @author: dhq
 * @date: 2020/5/26
 * @description:
 */
public interface Event extends Serializable {
    Object getSource();
    Date getWhen();
    String getMessage();

    /**
     * 事件回调函数
     */
    void callback();
}
