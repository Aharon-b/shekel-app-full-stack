package com.ab.shekelapp.threads;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@ComponentScan("com.ab.shekelapp")
@PropertySource("classpath:scheduled.properties")
@EnableScheduling
public class ScheduledHandler {
    /* Empty */
}
