package com.myeongseong;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * 명성(命星) — AI 기반 사주명리 웹앱 메인 클래스
 */
@SpringBootApplication
@EnableScheduling
public class MyeongseongApplication {

    public static void main(String[] args) {
        SpringApplication.run(MyeongseongApplication.class, args);
    }
}
