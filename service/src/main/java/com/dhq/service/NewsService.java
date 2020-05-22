package com.dhq.service;

import com.dhq.entity.News;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * <p>
 * 服务类
 * </p>
 *
 * @author com.dhq
 * @since 2020-03-29
 */
public interface NewsService extends IService<News> {
    News getNews(String uuid);
}
