package com.upm.putrastudentcab.bean;

import com.upm.putrastudentcab.entity.Trip;
import jakarta.annotation.PostConstruct;
import jakarta.ejb.EJB;
import jakarta.faces.view.ViewScoped;
import jakarta.inject.Named;
import com.upm.putrastudentcab.ejb.TripServiceLocal;

import java.io.Serializable;
import java.util.List;

@Named("tripHistoryBean")
@ViewScoped
public class TripHistoryBean implements Serializable {

    @EJB
    private TripServiceLocal tripService;

    private List<Trip> trips;

    @PostConstruct
    public void init() {
        trips = tripService.getAllTrips();
    }

    public List<Trip> getTrips() {
        return trips;
    }

    public double getTotalFareCollected() {
        return trips.stream()
                .mapToDouble(t -> t.getFare() == null ? 0.0 : t.getFare().doubleValue())
                .sum();
    }

    public String getTotalFareCollectedFormatted() {
        return String.format("%.2f", getTotalFareCollected());
    }
}