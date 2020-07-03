package com.dhq.producer;

import com.alibaba.fastjson.JSON;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;
import org.springframework.util.concurrent.ListenableFuture;

/**
 * @author: dhq
 * @date: 2020/5/26
 * @description:
 */
@Service
public class ProducerService {
    private static final Logger LOG = LoggerFactory.getLogger(ProducerService.class);
    @Autowired
    private KafkaTemplate kafkaTemplate;

    public void sendMsg(String topic,Object obj){
        String value = JSON.toJSONString(obj);
        ProducerRecord producerRecord = new ProducerRecord(topic,null,null,null,value);
        ListenableFuture<SendResult<String, String>> future = kafkaTemplate.send(producerRecord);
        future.addCallback(success -> LOG.info("KafkaMessageProducer 发送消息成功！"),
                fail -> LOG.error("KafkaMessageProducer 发送消息失败！"));
    }

}
