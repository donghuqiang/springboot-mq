package com.dhq;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * @author: com.dhq
 * @date: 2020/5/21
 * @description:
 */
@EnableTransactionManagement
@MapperScan("com.dhq.mapper")
@SpringBootApplication
public class KafkaProviderApplication {
    public static void main(String[] args) {
        SpringApplication.run(KafkaProviderApplication.class, args);
    }
}
