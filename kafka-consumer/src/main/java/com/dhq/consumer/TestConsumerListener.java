package com.dhq.consumer;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.listener.MessageListener;
import org.springframework.stereotype.Component;

/**
 * 消费者监听器
 */
@Component
public class TestConsumerListener implements MessageListener<String, String> {


    /**
     * 消费消息
     *
     * @param record 消息
     */
    @Override
    public void onMessage(ConsumerRecord<String, String> record) {

        System.out.println(record);
    }
}