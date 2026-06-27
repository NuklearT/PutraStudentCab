package com.upm.putrastudentcab.ejb;

import jakarta.ejb.Stateless;

@Stateless
public class FareCalculatorBean implements FareCalculatorLocal {

    private static final double BASE_FARE = 2.00;
    private static final double RATE_PER_KM = 0.80;
    private static final double RATE_PER_MIN = 0.15;

    @Override
    public double calculateFare(double distanceKm, double durationMin) {
        double fare = BASE_FARE + (distanceKm * RATE_PER_KM) + (durationMin * RATE_PER_MIN);
        return Math.round(fare * 100.0) / 100.0;
    }
}