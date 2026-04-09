package com.example.restaurant.management.Service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileService {
    String saveFile(MultipartFile file, String type) throws IOException;
    Resource loadFileAsResource(String folder ,String fileName);
    void deleteFile(String folder ,String fileName);
}
