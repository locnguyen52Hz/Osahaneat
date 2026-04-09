package com.example.restaurant.management.Service.ServiceImp;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.Normalizer;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class FileServiceImp implements com.example.restaurant.management.Service.FileService {

    @Value("${fileUpLoad.rootPath}")
    private String UPLOAD_DIR;



    @Override
    public String saveFile(MultipartFile file, String type) throws IOException {
        Path uploadPath  = Paths.get(UPLOAD_DIR, type);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            throw new IllegalArgumentException("Tên file ko hợp lệ");
        }

        //chuẩn hóa tên file
        String extension = getFileExtension(originalFilename);
        String baseName = normalizeFileName(removeFileExtension(originalFilename));

        //Thêm timestamp
        String timeStamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH-mm-ss"));
        String finalFilename = baseName + "_" + timeStamp + "." + extension;

        Path filePath = uploadPath.resolve(finalFilename);
        file.transferTo(filePath);

        return finalFilename;

    }

    @Override
    public Resource loadFileAsResource(String folder ,String fileName) {
        try {
            Path basePath = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();
            Path targetPath =  basePath.resolve(Paths.get(folder,fileName)).normalize();

            if(!targetPath.startsWith(basePath)){
                throw new SecurityException("Invalid path");
            }

            Resource resource = new UrlResource(targetPath.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            }
        }catch (Exception e){
           System.out.println("Error load file: " + e.getMessage());

        }
        return null;
    }

    @Override
    public void deleteFile(String folder, String fileName) {
        if(fileName == null || fileName.isBlank()) return;
        try{
            Path filePath = Paths.get(UPLOAD_DIR,folder,fileName);
            Files.deleteIfExists(filePath);
        }catch (Exception e){
            System.out.println("Error deleting file: " + e.getMessage());
        }
    }


    // Lấy phần mở rộng file
    private String getFileExtension(String fileName) {
        int lastDot = fileName.lastIndexOf(".");
        if (lastDot == -1) return "";
        return fileName.substring(lastDot + 1);
    }

    // Xóa phần mở rộng
    private String removeFileExtension(String fileName) {
        int lastDot = fileName.lastIndexOf(".");
        if (lastDot == -1) return fileName;
        return fileName.substring(0, lastDot);
    }

    // Chuẩn hóa tên file: bỏ dấu, bỏ ký tự đặc biệt, chỉ giữ a-z0-9
    private String normalizeFileName(String input) {
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "") // bỏ dấu
                .replaceAll("[^a-zA-Z0-9]", "_") // thay ký tự đặc biệt = _
                .toLowerCase();
        return normalized.replaceAll("_+", "_"); // gộp nhiều _ thành 1
    }
}
