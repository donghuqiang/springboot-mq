package com.dhq.eventListener;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class MySource implements EventSource {

    private List<EventListener> listeners = new ArrayList<EventListener>();

    private int value;

    @Override
    public void addListener(EventListener listener) {
        listeners.add(listener);
    }

    @Override
    public void notifyListener() {
        for (EventListener listener : listeners) {
            MessageEvent event = new MessageEvent();
            event.setSource(this);
            event.setWhen(new Date());
            event.setMessage("setValue " + value);
            listener.handleEvent(event);
        }
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
        notifyListener();
    }

    public static void main(String[] args) {
        MySource source = new MySource();
        source.addListener(new MessageListener());
        source.setValue(100);
    }
}