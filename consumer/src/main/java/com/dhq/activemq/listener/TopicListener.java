package com.dhq.activemq.listener;

import com.dhq.entity.News;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

import javax.jms.JMSException;
import javax.jms.MapMessage;
import javax.jms.Message;

/**
 * 发布/订阅模型
 */
@Component
public class TopicListener {
    //topic模式的消费者
    @JmsListener(destination = "${spring.activemq.topic-name}", containerFactory = "topicConsumerListener")
    public void readActiveQueue(Message message) throws JMSException {
        MapMessage mapMessage = (MapMessage) message;
        //接受字符串类型
        String info = mapMessage.getString("info");
        System.out.println("topic接受到：" + info);
    }

    /**
     * 监听新闻消息
     *
     * @param message
     * @throws JMSException
     * @throws JsonProcessingException
     */
    @JmsListener(destination = "default_activemq.news", containerFactory = "topicConsumerListener")
    public void readActiveTop(Message message) throws JMSException, JsonProcessingException {
        MapMessage mapMessage = (MapMessage) message;
        String info = mapMessage.getString("entity");
        ObjectMapper objectMapper = new ObjectMapper();
        News news = objectMapper.readValue(info, News.class);
        System.out.println("添加新闻消息监听==topic接受到：" + info);
    }
}