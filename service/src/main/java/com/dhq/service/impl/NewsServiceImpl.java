package com.dhq.service.impl;

import com.dhq.entity.News;
import com.dhq.mapper.NewsMapper;
import com.dhq.service.NewsService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author com.dhq
 * @since 2020-03-29
 */
@Service
public class NewsServiceImpl extends ServiceImpl<NewsMapper, News> implements NewsService {

    public News getNews(String uuid) {
        News news = new News();
        news.setId(uuid);
        news.setTitle("新冠肺炎情况通报");
        news.setCreateuser("张三");
        news.setRemark("尽快清除病毒");
        news.setSignature("");
        return news;
    }
}
