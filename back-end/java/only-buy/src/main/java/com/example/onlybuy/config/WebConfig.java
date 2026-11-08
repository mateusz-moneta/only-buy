package com.example.onlybuy.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

import java.nio.file.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Value("${app.upload.directory}")
    private String uploadDirectory;

    @Override
    public void addResourceHandlers(
            ResourceHandlerRegistry registry) {

        Path path = Paths.get(uploadDirectory)
                .toAbsolutePath()
                .normalize();

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(path.toUri().toString());
    }
}