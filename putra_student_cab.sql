-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 27, 2026 at 08:06 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `putra_student_cab`
--

-- --------------------------------------------------------

--
-- Table structure for table `trip`
--

CREATE TABLE `trip` (
  `id` int(11) NOT NULL,
  `origin_lat` double DEFAULT NULL,
  `origin_lng` double DEFAULT NULL,
  `dest_lat` double DEFAULT NULL,
  `dest_lng` double DEFAULT NULL,
  `distance_km` double DEFAULT NULL,
  `duration_min` double DEFAULT NULL,
  `fare` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trip`
--

INSERT INTO `trip` (`id`, `origin_lat`, `origin_lng`, `dest_lat`, `dest_lng`, `distance_km`, `duration_min`, `fare`, `created_at`) VALUES
(1, 2.992092190438225, 101.76999449729921, 2.991558087039792, 101.70840024948122, 10.196200000000001, 15.198333333333332, 12.44, '2026-06-27 08:20:17'),
(2, 2.991558087039792, 101.70844316482545, 2.966764042052082, 101.71545982360841, 6.955, 11.208333333333334, 9.25, '2026-06-27 08:22:25'),
(3, 2.995215378190078, 101.70878648757936, 2.996058048174884, 101.57559871673585, 29.8421, 34.46666666666667, 31.04, '2026-06-27 08:23:21'),
(4, 2.996079476517009, 101.5755343437195, 2.9952223425047655, 101.70880794525148, 25.4523, 30.291666666666668, 26.91, '2026-06-27 17:39:16'),
(5, 2.9952083, 101.7087851, 2.9698448, 101.7142236, 8.1772, 12.95, 10.48, '2026-06-27 17:58:24'),
(6, 2.9952083, 101.7087851, 2.9952467, 101.5750705, 30.3216, 36.19666666666667, 31.69, '2026-06-27 18:02:41');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `trip`
--
ALTER TABLE `trip`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `trip`
--
ALTER TABLE `trip`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
