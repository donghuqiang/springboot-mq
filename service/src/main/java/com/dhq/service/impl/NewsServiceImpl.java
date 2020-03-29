package com.dhq.service.impl;

import com.dhq.entity.News;
import com.dhq.mapper.NewsMapper;
import com.dhq.service.NewsService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author dhq
 * @since 2020-03-29
 */
@Service
public class NewsServiceImpl extends ServiceImpl<NewsMapper, News> implements NewsService {

}
