package com.dhq.controller;


import com.alibaba.fastjson.JSON;
import com.dhq.entity.News;
import com.dhq.service.NewsService;
import com.dhq.utils.RestResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.util.concurrent.ListenableFuture;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * <p>
 * 前端控制器
 * </p>
 *
 * @author com.dhq
 * @since 2020-03-05
 */
@RestController
@RequestMapping("/news")
public class NewsController {
    private static final Logger LOG = LoggerFactory.getLogger(NewsController.class);
    @Autowired
    private NewsService newsService;

    @Autowired
    private KafkaTemplate kafkaTemplate;

    @GetMapping("/add")
    public RestResult add() {
        String uuid = UUID.randomUUID().toString().replaceAll("-", "");
        News news = newsService.getNews(uuid);
        boolean b = newsService.save(news);
        if (b) {
//            kafkaTemplate.send("user", JSON.toJSONString(news));
            ListenableFuture<SendResult<String, String>> future = kafkaTemplate.send("user", JSON.toJSONString(news));
            future.addCallback(success -> LOG.info("KafkaMessageProducer 发送消息成功！"),
                    fail -> LOG.error("KafkaMessageProducer 发送消息失败！"));
        }
        return RestResult.warperMsgOk("消息发送成功", news);
    }


}

