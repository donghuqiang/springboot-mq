package com.dhq.eventListener;

public interface EventListener {

    /**
     * 事件触发
     * @param event
     */
    void handleEvent(Event event);
}