package zairastra.capstone_be.tools;


import kong.unirest.core.HttpResponse;
import kong.unirest.core.JsonNode;
import kong.unirest.core.Unirest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import zairastra.capstone_be.entities.User;

@Component
@Slf4j
public class MailgunSender {
    private String apiKey;
    private String domain;
    private String senderEmail;

    public MailgunSender(@Value("${mailgun.api.key}") String apiKey,
                         @Value("${mailgun.domain.name}") String domain,
                         @Value("${mailgun.sender.email}") String senderEmail) {
        this.apiKey = apiKey;
        this.domain = domain;
        this.senderEmail = senderEmail;
    }

    public void sendRegistrationEmail(User recipient) {
        log.info("Sending email to: {}", recipient.getEmail());

        String subject = "Welcome In FestiMate!";
        String textBody = String.format(
                """
                        Hi %s,\s
                        
                        Welcome to our platform! We're thrilled to have you on board!
                        Our journey together begins today, and we guarantee it will be full of unique events and experiences!
                        
                        Thank you for choosing us; we'll be committed to reciprocating your trust!
                        
                        The FestiMate Team""",

                recipient.getName()
        );
        try {
            HttpResponse<JsonNode> response = Unirest.post("https://api.mailgun.net/v3/" + this.domain + "/messages")
                    .basicAuth("api", this.apiKey)
                    .queryString("from", this.senderEmail)
                    .queryString("to", recipient.getEmail())
                    .queryString("subject", subject)
                    .queryString("text", textBody)
                    .asJson();

            if (response.isSuccess()) {
                log.info("Email sent successfully! Reply from Mailgun: {}", response.getBody().toString());
            } else {
                log.error("Error sending email. Status: {}, Error: {}", response.getStatus(), response.getBody().toString());
            }
        } catch (Exception e) {
            log.error("Unexpected error while sending email to {}", recipient.getEmail(), e);
        }
    }
}
