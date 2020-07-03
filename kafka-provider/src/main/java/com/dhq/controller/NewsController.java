package com.dhq.controller;

import com.alibaba.fastjson.JSON;
import com.dhq.entity.News;
import com.dhq.producer.ProducerService;
import com.dhq.service.NewsService;
import com.dhq.utils.RestResult;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.header.Headers;
import org.apache.kafka.common.header.internals.RecordHeaders;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
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
    private ProducerService producerService;

    @Autowired
    private KafkaTemplate kafkaTemplate;

    @GetMapping("/add")
    public RestResult add() {
        String uuid = UUID.randomUUID().toString().replaceAll("-", "");
        News news = newsService.getNews(uuid);
        boolean b = newsService.save(news);
        if (b) {
//            String value = JSON.toJSONString(news);
//            ProducerRecord producerRecord = new ProducerRecord("user",null,null,null,value);
//            ListenableFuture<SendResult<String, String>> future = kafkaTemplate.send(producerRecord);
//            future.addCallback(success -> LOG.info("KafkaMessageProducer 发送消息成功！"),
//                    fail -> LOG.error("KafkaMessageProducer 发送消息失败！"));

            String jsonStr="{\"headers\":{\"domain_id\":\"orgRootDomain\",\"method\":\"updateOne\",\"module\":\"user\"},\"payload\":\"{\\\"code\\\":null,\\\"gender\\\":\\\"U\\\",\\\"key_status_zw\\\":\\\"NONE\\\",\\\"nation\\\":null,\\\"memo\\\":\\\"PPPPPPPPPPPPPPPPPPPPPPPPPPP\\\",\\\"type\\\":\\\"common\\\",\\\"icon_id\\\":null,\\\"domain_id\\\":\\\"orgRootDomain\\\",\\\"employee_card\\\":null,\\\"domain_name\\\":null,\\\"zhiji\\\":\\\"zhiji1000\\\",\\\"passport\\\":null,\\\"political_status\\\":null,\\\"mobilephone\\\":\\\"13811239914\\\",\\\"id\\\":\\\"Q62ad1e12940e000\\\",\\\"org_name\\\":\\\"中国航天\\\",\\\"email\\\":\\\"chenbingfeng@bjsasc.com\\\",\\\"user_status\\\":\\\"10\\\",\\\"last_updated\\\":\\\"2020-05-27T09:10:40.000+0000\\\",\\\"address\\\":null,\\\"date_created\\\":\\\"2020-05-11T07:20:06.000+0000\\\",\\\"telephone\\\":null,\\\"ca_e\\\":\\\"chen@bjsasc.com\\\",\\\"sort\\\":0,\\\"classification\\\":\\\"CF20\\\",\\\"icbc_code\\\":null,\\\"native_place\\\":null,\\\"marital_status\\\":null,\\\"login_name\\\":\\\"chen\\\",\\\"pinyin\\\":null,\\\"cengci\\\":\\\"cengci1100\\\",\\\"driving_license\\\":null,\\\"org_id\\\":\\\"orgRootDomain\\\",\\\"idcard\\\":null,\\\"name\\\":\\\"chen\\\",\\\"ext_str\\\":\\\"zhiwu1000\\\",\\\"ext_int\\\":\\\"70\\\",\\\"certificate_type\\\":null,\\\"secret_code\\\":\\\"10\\\",\\\"status\\\":\\\"ACTIVE\\\",\\\"key_status_fxw\\\":\\\"NONE\\\"}\"}";
//            producerService.sendMsg("topic-bjsasc-uims-iam",jsonStr);

                        ProducerRecord producerRecord = new ProducerRecord("topic-bjsasc-uims-iam",null,null,null,jsonStr);
            ListenableFuture<SendResult<String, String>> future = kafkaTemplate.send(producerRecord);
            future.addCallback(success -> LOG.info("KafkaMessageProducer 发送消息成功！"),
                    fail -> LOG.error("KafkaMessageProducer 发送消息失败！"));
        }
        return RestResult.warperMsgOk("消息发送成功", news);
    }


}

