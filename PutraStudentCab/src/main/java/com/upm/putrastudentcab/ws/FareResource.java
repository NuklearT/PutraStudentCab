package com.upm.putrastudentcab.ws;

import com.upm.putrastudentcab.ejb.FareCalculatorLocal;
import com.upm.putrastudentcab.ejb.TripServiceLocal;
import com.upm.putrastudentcab.entity.Trip;
import jakarta.ejb.EJB;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

@Path("fare")
public class FareResource {

    @EJB
    private FareCalculatorLocal fareCalculator;

    @EJB
    private TripServiceLocal tripService;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public FareResponse calculate(FareRequest req) {
        double fare = fareCalculator.calculateFare(req.distanceKm, req.durationMin);

        Trip trip = new Trip();
        trip.setOriginLat(req.originLat);
        trip.setOriginLng(req.originLng);
        trip.setDestLat(req.destLat);
        trip.setDestLng(req.destLng);
        trip.setOriginLabel(req.originLabel);
        trip.setDestLabel(req.destLabel);
        trip.setDistanceKm(req.distanceKm);
        trip.setDurationMin(req.durationMin);
        trip.setFare(fare);
        tripService.saveTrip(trip);

        FareResponse resp = new FareResponse();
        resp.fare = fare;
        return resp;
    }

    public static class FareRequest {
        public double originLat, originLng, destLat, destLng, distanceKm, durationMin;
        public String originLabel, destLabel;
    }
    public static class FareResponse {
        public double fare;
    }
}