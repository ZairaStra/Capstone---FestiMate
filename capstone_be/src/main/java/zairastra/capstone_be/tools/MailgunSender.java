package zairastra.capstone_be.tools;


import kong.unirest.core.HttpResponse;
import kong.unirest.core.JsonNode;
import kong.unirest.core.Unirest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import zairastra.capstone_be.entities.*;

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

    public void sendReservationEmail(PublicUser user, Festival festival, Reservation reservation) {
        log.info("Sending reservation confirmation email to: {}", user.getEmail());

        String subject = "Your FestiMate Reservation Confirmation";

        String textBody = String.format(
                """
                        Hi %s,\s
                        
                        Your reservation for the festival %s has been confirmed!
                        
                        - Location: %s, %s\n
                        
                        - Dates: %s → %s\n
                        
                        - Total Paid: €%.2f\n""",


                user.getName(),
                festival.getName(),
                festival.getCity(),
                festival.getCountry(),
                festival.getStartDate(),
                festival.getEndDate(),
                reservation.getTotalPrice()
        );

        if (!reservation.getCampingUnits().isEmpty()) {
            textBody += " Accommodation booked:\n";
            for (CampingUnit unit : reservation.getCampingUnits()) {
                textBody += String.format(
                        "   - %s (spot %s)\n",
                        unit.getAccomodationType().getUnitType(),
                        unit.getSpotCode()
                );
            }
        } else {
            textBody += " No accommodation booked.\n";
        }


        textBody += "\nWe look forward to seeing you there!\n" +
                "The FestiMate Team";

        try {
            HttpResponse<JsonNode> response = Unirest.post("https://api.mailgun.net/v3/" + this.domain + "/messages")
                    .basicAuth("api", this.apiKey)
                    .queryString("from", this.senderEmail)
                    .queryString("to", user.getEmail())
                    .queryString("subject", subject)
                    .queryString("text", textBody)
                    .asJson();

            if (response.isSuccess()) {
                log.info("Reservation email sent successfully! Reply from Mailgun: {}", response.getBody().toString());
            } else {
                log.error("Error sending reservation email. Status: {}, Error: {}", response.getStatus(), response.getBody().toString());
            }
        } catch (Exception e) {
            log.error("Unexpected error while sending reservation email to {}", user.getEmail(), e);
        }
    }

    public void sendCancellationEmail(PublicUser user, Festival festival, Reservation reservation) {
        log.info("Sending cancellation email to: {}", user.getEmail());

        String subject = "Your FestiMate Reservation Has Been Cancelled";

        String textBody = String.format(
                """
                        Hi %s,
                        
                        Unfortunately your reservation for the festival "%s" has been cancelled by our team.
                        
                        Below you will find the booking details:
                        
                        - Location: %s, %s
                        - Dates: %s → %s
                        - Tickets: %d
                        - Total Paid: €%.2f
                        
                        The refund will be issued via the same payment system you used for the booking in the next few days.
                        
                        For more informations you can contact our support team.
                        
                        We’re sorry for the inconvenience,
                        The FestiMate Team
                        """,
                user.getName(),
                festival.getName(),
                festival.getCity(), festival.getCountry(),
                festival.getStartDate(), festival.getEndDate(),
                reservation.getNumTickets(),
                reservation.getTotalPrice()
        );

        try {
            HttpResponse<JsonNode> response = Unirest.post("https://api.mailgun.net/v3/" + this.domain + "/messages")
                    .basicAuth("api", this.apiKey)
                    .queryString("from", this.senderEmail)
                    .queryString("to", user.getEmail())
                    .queryString("subject", subject)
                    .queryString("text", textBody)
                    .asJson();

            if (response.isSuccess()) {
                log.info("Cancellation email sent successfully! Reply from Mailgun: {}", response.getBody().toString());
            } else {
                log.error("Error sending cancellation email. Status: {}, Error: {}", response.getStatus(), response.getBody().toString());
            }
        } catch (Exception e) {
            log.error("Unexpected error while sending cancellation email to {}", user.getEmail(), e);
        }
    }
}
