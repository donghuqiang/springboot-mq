package com.dhq.eventListener;

public class MessageListener implements EventListener {

    @Override
    public void handleEvent(Event event) {
        event.callback();
    }
}