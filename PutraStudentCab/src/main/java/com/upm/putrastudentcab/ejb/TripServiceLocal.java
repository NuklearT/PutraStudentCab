package com.upm.putrastudentcab.ejb;

import jakarta.ejb.Local;
import com.upm.putrastudentcab.entity.Trip;

@Local
public interface TripServiceLocal {
    Trip saveTrip(Trip trip);
}