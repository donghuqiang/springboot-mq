package com.dhq.controller;


import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.dhq.entity.News;
import com.dhq.service.NewsService;
import com.dhq.utils.RestResult;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.activemq.command.ActiveMQMapMessage;
import org.apache.activemq.command.ActiveMQTopic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.core.JmsMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import javax.jms.Destination;
import javax.jms.JMSException;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
    @Autowired
    private NewsService newsService;

    @Autowired
    private JmsMessagingTemplate jmsMessagingTemplate;

    @GetMapping("/list")
    public List<News> list() {
        QueryWrapper<News> queryWrapper = new QueryWrapper<>();
        List<News> list = newsService.list(queryWrapper);
        return list;
    }

    @GetMapping("/add")
    public RestResult add() throws JMSException, JsonProcessingException {
        String uuid = UUID.randomUUID().toString().replaceAll("-", "");
        News news = newsService.getNews(uuid);
        boolean b = newsService.save(news);

        if (b) {
            ObjectMapper objectMapper = new ObjectMapper();
            String objectToJson = objectMapper.writeValueAsString(news);
            ActiveMQMapMessage message = new ActiveMQMapMessage();
            message.setObject("entity", objectToJson);
            Destination destination = new ActiveMQTopic("default_activemq.news");
            jmsMessagingTemplate.convertAndSend(destination, message);
        }
        return RestResult.warperMsgOk("新增成功", news);
    }

    //更新
    @PostMapping("/update")
    public RestResult update(@RequestBody News news) throws IOException {
        newsService.updateById(news);
        return RestResult.warperOk("保存成功");
    }


    public Map<String, String> mappingToMap(News news) {
        Map<String, String> map = new HashMap<>();
        map.put("id", news.getId());
        map.put("title", news.getTitle());
        map.put("createuser", news.getCreateuser());
        map.put("remark", news.getRemark());
        return map;
    }

}

