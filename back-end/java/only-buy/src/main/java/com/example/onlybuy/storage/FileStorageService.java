package com.example.onlybuy.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@Service
public class FileStorageService {
    private static final Set<String> ALLOWED_TYPES =
            Set.of("image/jpeg", "image/png", "image/webp");
    private final Path uploadPath;

    public FileStorageService(
            @Value("${app.upload.directory}") String directory) {
        this.uploadPath = Paths.get(directory)
                .toAbsolutePath()
                .normalize();

        try {
            Files.createDirectories(uploadPath);
        } catch (IOException e) {
            throw new RuntimeException("Cannot create upload directory", e);
        }
    }

    public String saveAvatar(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new IllegalArgumentException("Invalid image type");
        }

        try {
            String extension = switch (file.getContentType()) {
                case "image/jpeg" -> ".jpg";
                case "image/png" -> ".png";
                case "image/webp" -> ".webp";
                default -> throw new IllegalArgumentException("Invalid image type");
            };

            String filename = UUID.randomUUID() + extension;

            Path destination = uploadPath.resolve("avatars")
                    .resolve(filename)
                    .normalize();

            Files.createDirectories(destination.getParent());

            Files.copy(file.getInputStream(), destination);

            return "/uploads/avatars/" + filename;

        } catch (IOException e) {
            throw new RuntimeException("Cannot save avatar", e);
        }
    }
}