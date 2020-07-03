package com.dhq.controller;

import com.dhq.entity.News;
import com.dhq.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;

import java.io.IOException;

@Controller
public class PageController {
    @Autowired
    private NewsService newsService;

    @Value("${webSocket.url}")
    private String webSocketUrl;

    @GetMapping(value = "/index")
    public String index(ModelMap modelMap){
        modelMap.addAttribute("webSocketUrl",webSocketUrl);
        return "index.html";
    }

    @GetMapping(value = "/edit")
    public String edit(ModelMap modelMap) throws IOException {
        String uuid="6fbd9f80f9a74bffa2085f5a538bfbf6";
        News news = newsService.getById(uuid);
        modelMap.addAttribute("entity",news);
        return "edit.html";
    }
}
