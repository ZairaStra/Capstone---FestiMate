package zairastra.capstone_be.config;


import com.cloudinary.Cloudinary;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {
    
    //TODO: rimuovere questo primo pezzo
    @Autowired
    private RequestMappingHandlerMapping handlerMapping;

    @PostConstruct
    public void logEndpoints() {
        System.out.println("=== ENDPOINTS REGISTRATI ===");
        handlerMapping.getHandlerMethods().forEach((key, value) -> {
            System.out.println(key + " -> " + value);
        });
        System.out.println("============================");
    }

    @Bean
    public Cloudinary getImageUploader(@Value("${cloudinary.name}") String name,
                                       @Value("${cloudinary.key}") String apiKey,
                                       @Value("${cloudinary.secret}") String apiSecret) {

        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", name);
        config.put("api_key", apiKey);
        config.put("api_secret", apiSecret);
        return new Cloudinary(config);
    }
}
