CREATE DATABASE IF NOT EXISTS putra_student_cab;

USE putra_student_cab;

DROP TABLE IF EXISTS trip;

CREATE TABLE trip (
    id            INT             NOT NULL AUTO_INCREMENT,
    origin_lat    DOUBLE          NULL,
    origin_lng    DOUBLE          NULL,
    origin_label  VARCHAR(255)    NULL,
    dest_lat      DOUBLE          NULL,
    dest_lng      DOUBLE          NULL,
    dest_label    VARCHAR(255)    NULL,
    distance_km   DOUBLE          NULL,
    duration_min  DOUBLE          NULL,
    fare          DOUBLE          NULL,
    created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);
