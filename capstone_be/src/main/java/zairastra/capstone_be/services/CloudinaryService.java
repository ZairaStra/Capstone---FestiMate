package zairastra.capstone_be.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import zairastra.capstone_be.exceptions.BadRequestException;

import java.io.IOException;
import java.util.Map;

@Service
@Slf4j
public class CloudinaryService {
    private final Cloudinary cloudinary;

    @Autowired
    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String uploadFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File is empty");
        }

        try {
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap("resource_type", "auto")
            );
            String url = (String) uploadResult.get("secure_url");
            log.info("File uploaded to Cloudinary: " + url);
            return url;
        } catch (IOException e) {
            log.error("Cloudinary upload failed", e);
            throw new BadRequestException("Error uploading file to Cloudinary: " + e.getMessage());
        }
    }
}
