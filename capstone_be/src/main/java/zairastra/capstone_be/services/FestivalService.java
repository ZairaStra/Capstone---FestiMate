package zairastra.capstone_be.services;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import zairastra.capstone_be.entities.*;
import zairastra.capstone_be.entities.enums.UnitStatus;
import zairastra.capstone_be.entities.enums.UnitType;
import zairastra.capstone_be.payloads.FestivalRegistrationDTO;
import zairastra.capstone_be.repositories.AccomodationTypeRepository;
import zairastra.capstone_be.repositories.CampingRepository;
import zairastra.capstone_be.repositories.CampingUnitRepository;
import zairastra.capstone_be.repositories.FestivalRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class FestivalService {

    @Autowired
    private FestivalRepository festivalRepository;

    @Autowired
    private CampingRepository campingRepository;

    @Autowired
    private CampingUnitRepository campingUnitRepository;

    @Autowired
    private AccomodationTypeRepository accomodationTypeRepository;

    @Transactional
    public Festival createFestival(FestivalRegistrationDTO payload, Admin admin, String campingMap, Map<UnitType, Double> pricesByUnitType) {
        Festival festival = new Festival(
                payload.name(),
                payload.coverImg(),
                payload.city(),
                payload.country(),
                payload.startDate(),
                payload.endDate(),
                payload.maxNumbPartecipants(),
                payload.dailyPrice(),
                admin
        );

        if (payload.campingMap() != null && !payload.campingMap().isEmpty()) {
            festival.setCampingMap(payload.campingMap());
        }

        festivalRepository.save(festival);

        if (campingMap != null && !campingMap.isEmpty()) {
            Camping camping = new Camping();
            camping.setFestival(festival);
            camping.setName(festival.getName() + " Camping");
            camping.setOpeningDate(festival.getStartDate());
            camping.setClosingDate(festival.getEndDate());

            campingRepository.save(camping);

            List<String> svgElements = parseSvgElements(campingMap);
            Map<UnitType, List<String>> unitsByType = new HashMap<>();
            for (String label : svgElements) {
                String[] parts = label.split("-");
                try {
                    UnitType type = UnitType.valueOf(parts[0]);
                    unitsByType.computeIfAbsent(type, k -> new ArrayList<>()).add(parts[1]);
                } catch (IllegalArgumentException e) {

                }
            }

            for (Map.Entry<UnitType, List<String>> entry : unitsByType.entrySet()) {
                UnitType type = entry.getKey();
                List<String> spotCodes = entry.getValue();

                //TODO: ricordati che nel FE devi prevedere uno spazio per il settaggio del prezzo per singola tipologia di unità
                double pricePerNight = pricesByUnitType.getOrDefault(type, 20.0);

                AccomodationType accomodationType = new AccomodationType();
                accomodationType.setCamping(camping);
                accomodationType.setUnitType(type);
                accomodationType.setUnitCapacity(getCapacityFromUnitType(type));
                accomodationType.setPricePerNight(pricePerNight);

                accomodationTypeRepository.save(accomodationType);

                for (String spotCode : spotCodes) {
                    CampingUnit unit = new CampingUnit();
                    unit.setAccomodationType(accomodationType);
                    unit.setSpotCode(spotCode);
                    unit.setStatus(UnitStatus.AVAILABLE);

                    campingUnitRepository.save(unit);
                }
            }

            int totalCapacity = 0;
            for (AccomodationType accType : accomodationTypeRepository.findByCamping(camping)) {
                int unitsCount = (int) campingUnitRepository.countByAccomodationType(accType);
                totalCapacity += accType.getUnitCapacity() * unitsCount;
            }
            camping.setCapacity(totalCapacity);

            campingRepository.save(camping);
        }

        return festival;
    }

    private List<String> parseSvgElements(String svgContent) {
        List<String> labels = new ArrayList<>();
        try {
            Document doc = Jsoup.parse(svgContent, "", org.jsoup.parser.Parser.xmlParser());
            Elements elementsWithId = doc.select("[id], [data-label]");
            for (Element el : elementsWithId) {
                String label = el.hasAttr("data-label") ? el.attr("data-label") : el.attr("id");
                if (label != null && !label.isEmpty()) {
                    labels.add(label.trim());
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return labels;
    }

    private int getCapacityFromUnitType(UnitType type) {
        return switch (type) {
            case TENT1 -> 1;
            case TENT2 -> 2;
            case TENT4, BUNGALOW4 -> 4;
            case TENT6 -> 6;
            case BUBBLE2 -> 2;
        };
    }

}
