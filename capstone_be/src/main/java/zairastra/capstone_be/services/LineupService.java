package zairastra.capstone_be.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import zairastra.capstone_be.entities.Artist;
import zairastra.capstone_be.entities.Festival;
import zairastra.capstone_be.entities.Lineup;
import zairastra.capstone_be.exceptions.BadRequestException;
import zairastra.capstone_be.exceptions.NotFoundException;
import zairastra.capstone_be.payloads.LineupRegistrationDTO;
import zairastra.capstone_be.payloads.LineupUpdateDTO;
import zairastra.capstone_be.repositories.ArtistRepository;
import zairastra.capstone_be.repositories.FestivalRepository;
import zairastra.capstone_be.repositories.LineupRepository;

import java.time.LocalDate;
import java.time.LocalTime;

@Service
@Slf4j
public class LineupService {

    @Autowired
    private LineupRepository lineupRepository;

    @Autowired
    private FestivalRepository festivalRepository;

    @Autowired
    private ArtistRepository artistRepository;

    public Lineup createLineup(LineupRegistrationDTO payload) {

        Festival festival = festivalRepository.findById(payload.festivalId())
                .orElseThrow(() -> new NotFoundException("Festival not found"));

        Artist artist = artistRepository.findById(payload.artistId())
                .orElseThrow(() -> new NotFoundException("Artist not found"));

        if (lineupRepository.existsByArtistAndDateAndStartTime(
                artist, payload.date(), payload.startTime())) {
            throw new BadRequestException("The artist " + artist.getName() +
                    " is already scheduled at this date and time in another festival");
        }

        Lineup newLineup = new Lineup(
                payload.date(),
                payload.startTime(),
                payload.endTime(),
                artist,
                festival
        );

        Lineup saved = lineupRepository.save(newLineup);
        log.info("Lineup has been created for festival " + festival.getName());

        return saved;
    }

    public Page<Lineup> findAllLineups(int page, int size, String sortBy) {

        if (size > 50) size = 50;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());

        return lineupRepository.findAll(pageable);
    }

    public Lineup findLineupById(Long id) {
        return lineupRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Lineup with id " + id + " not found"));
    }

    public Page<Lineup> findByFestival(Long festivalId, int page, int size, String sortBy) {

        if (size > 50) size = 50;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());

        Festival festival = festivalRepository.findById(festivalId)
                .orElseThrow(() -> new NotFoundException("Festival not found"));

        Page<Lineup> lineups = lineupRepository.findByFestival(festival, pageable);

        if (lineups.isEmpty()) {
            throw new NotFoundException("No lineup found for this festival");
        }

        return lineups;
    }

    public Page<Lineup> findByArtist(Long artistId, int page, int size, String sortBy) {

        if (size > 50) size = 50;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());

        Artist artist = artistRepository.findById(artistId)
                .orElseThrow(() -> new NotFoundException("Artist not found"));
        return lineupRepository.findByArtist(artist, pageable);
    }

    public Lineup updateLineup(Long id, LineupUpdateDTO payload) {
        Lineup lineup = findLineupById(id);
        Artist originalArtist = lineup.getArtist();
        LocalDate originalDate = lineup.getDate();
        LocalTime originalStartTime = lineup.getStartTime();

        if (payload.date() != null) lineup.setDate(payload.date());
        if (payload.startTime() != null) lineup.setStartTime(payload.startTime());
        if (payload.endTime() != null) lineup.setEndTime(payload.endTime());

        if (payload.artistId() != null && !payload.artistId().equals(lineup.getArtist().getId())) {
            Artist artist = artistRepository.findById(payload.artistId())
                    .orElseThrow(() -> new NotFoundException("Artist not found"));
            lineup.setArtist(artist);
        }

        if (payload.festivalId() != null && !payload.festivalId().equals(lineup.getFestival().getId())) {
            Festival festival = festivalRepository.findById(payload.festivalId())
                    .orElseThrow(() -> new NotFoundException("Festival not found"));
            lineup.setFestival(festival);
        }

        Artist artistToCheck = lineup.getArtist();
        LocalDate dateToCheck = lineup.getDate();
        LocalTime startTimeToCheck = lineup.getStartTime();

        if (!artistToCheck.equals(originalArtist)
                || !dateToCheck.equals(originalDate)
                || !startTimeToCheck.equals(originalStartTime)) {
            if (lineupRepository.existsByArtistAndDateAndStartTime(artistToCheck, dateToCheck, startTimeToCheck)) {
                throw new BadRequestException("The artist " + artistToCheck.getName() +
                        " is already scheduled at this date and time in another festival");
            }
        }

        Lineup updated = lineupRepository.save(lineup);
        log.info("Lineup has been updated");

        return updated;
    }

    public void deleteLineupById(Long id) {
        Lineup lineup = findLineupById(id);
        lineupRepository.delete(lineup);
        log.info("Lineup has been deleted");
    }
}
