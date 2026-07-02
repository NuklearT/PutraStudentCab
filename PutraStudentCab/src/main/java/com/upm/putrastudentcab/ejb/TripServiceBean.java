package com.upm.putrastudentcab.ejb;

import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import com.upm.putrastudentcab.entity.Trip;

import java.util.List;

@Stateless
public class TripServiceBean implements TripServiceLocal {

    @PersistenceContext(unitName = "PutraStudentCabPU")
    private EntityManager em;

    @Override
    public Trip saveTrip(Trip trip) {
        em.persist(trip);
        return trip;
    }

    @Override
    public List<Trip> getAllTrips() {
        return em.createQuery("SELECT t FROM Trip t ORDER BY t.createdAt DESC", Trip.class)
                 .getResultList();
    }
}