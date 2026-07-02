package com.upm.putrastudentcab.ejb;

import com.upm.putrastudentcab.entity.Trip;
import jakarta.ejb.Local;
import java.util.List;

@Local
public interface TripServiceLocal {
    Trip saveTrip(Trip trip);
    List<Trip> getAllTrips();
}