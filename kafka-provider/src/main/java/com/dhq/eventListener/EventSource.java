package com.dhq.eventListener;

public interface EventSource {

    /**
     * 增加监听器
     * @param listener
     */
    void addListener(EventListener listener);
    
    /**
     * 通知监听器
     */
    void notifyListener();
}