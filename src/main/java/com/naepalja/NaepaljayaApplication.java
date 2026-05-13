package com.naepalja;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * 내팔자야 — AI 기반 사주명리 웹앱 메인 클래스
 */
@SpringBootApplication
@EnableScheduling
public class NaepaljayaApplication {

    public static void main(String[] args) {
        SpringApplication.run(NaepaljayaApplication.class, args);
    }
}
