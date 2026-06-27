package com.upm.putrastudentcab.ejb;

import jakarta.ejb.Local;

@Local
public interface FareCalculatorLocal {
    double calculateFare(double distanceKm, double durationMin);
}