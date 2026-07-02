package com.upm.putrastudentcab.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Entity
@Table(name = "trip")
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "origin_lat")
    private Double originLat;

    @Column(name = "origin_lng")
    private Double originLng;

    @Column(name = "dest_lat")
    private Double destLat;

    @Column(name = "dest_lng")
    private Double destLng;

    @Column(name = "origin_label", length = 255)
    private String originLabel;

    @Column(name = "dest_label", length = 255)
    private String destLabel;

    @Column(name = "distance_km")
    private Double distanceKm;

    @Column(name = "duration_min")
    private Double durationMin;

    @Column(name = "fare")
    private Double fare;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public Double getOriginLat() { return originLat; }
    public void setOriginLat(Double originLat) { this.originLat = originLat; }
    public Double getOriginLng() { return originLng; }
    public void setOriginLng(Double originLng) { this.originLng = originLng; }
    public Double getDestLat() { return destLat; }
    public void setDestLat(Double destLat) { this.destLat = destLat; }
    public Double getDestLng() { return destLng; }
    public void setDestLng(Double destLng) { this.destLng = destLng; }
    public String getOriginLabel() { return originLabel; }
    public void setOriginLabel(String originLabel) { this.originLabel = originLabel; }
    public String getDestLabel() { return destLabel; }
    public void setDestLabel(String destLabel) { this.destLabel = destLabel; }
    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }
    public Double getDurationMin() { return durationMin; }
    public void setDurationMin(Double durationMin) { this.durationMin = durationMin; }
    public Double getFare() { return fare; }
    public void setFare(Double fare) { this.fare = fare; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // ── Display-ready formatted values for EL (avoids EL static-method import issues) ──
    public String getOriginDisplay() {
        return (originLabel != null && !originLabel.isBlank())
                ? originLabel
                : (originLat == null ? "—" : String.format("%.5f, %.5f", originLat, originLng));
    }

    public String getDestDisplay() {
        return (destLabel != null && !destLabel.isBlank())
                ? destLabel
                : (destLat == null ? "—" : String.format("%.5f, %.5f", destLat, destLng));
    }

    public String getDistanceKmFormatted() {
        return distanceKm == null ? "—" : String.format("%.2f", distanceKm);
    }

    public String getDurationMinFormatted() {
        return durationMin == null ? "—" : String.format("%.1f", durationMin);
    }

    public String getFareFormatted() {
        return fare == null ? "—" : String.format("%.2f", fare);
    }

    public String getCreatedAtFormatted() {
        return createdAt == null ? "—" : createdAt.format(DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm"));
    }
}