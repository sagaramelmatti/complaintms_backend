-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 30, 2023 at 08:15 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `complaintms`
--

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `locationId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`, `locationId`, `createdAt`, `updatedAt`) VALUES
(1, 'BBSR CORPORATE OFFICE', 1, '2023-05-27 10:16:44', '2023-05-27 10:16:44'),
(2, 'IT', 2, '2023-05-27 10:17:04', '2023-05-27 10:17:04'),
(3, 'PROCUREMENT', 2, '2023-05-27 10:17:32', '2023-05-27 10:17:32'),
(4, 'LOGISTICS', 2, '2023-05-27 10:18:49', '2023-05-27 10:18:49'),
(5, 'STORES', 2, '2023-05-27 10:18:58', '2023-05-27 10:18:58'),
(6, 'OPERATION', 2, '2023-05-27 10:19:07', '2023-05-27 10:19:07'),
(7, 'MECHANICAL', 2, '2023-05-27 10:19:21', '2023-05-27 10:19:21'),
(8, 'E & I', 2, '2023-05-27 10:20:15', '2023-05-27 10:20:15'),
(9, 'HRA', 2, '2023-05-27 10:20:30', '2023-05-27 10:20:30'),
(10, 'HSE', 2, '2023-05-27 10:20:45', '2023-05-27 10:20:45'),
(11, 'SECURITY', 2, '2023-05-27 10:21:39', '2023-05-27 10:21:39'),
(12, 'PROJECT PLANNING & CIVIL', 2, '2023-05-27 10:22:31', '2023-05-27 10:22:31'),
(13, 'FINANCE & EXCISE', 2, '2023-05-27 10:24:39', '2023-05-27 10:24:39'),
(14, 'PCD', 2, '2023-05-27 10:25:22', '2023-05-27 10:25:22'),
(15, 'IT', 3, '2023-05-27 10:27:27', '2023-05-27 10:27:27'),
(16, 'FINANCE & EXCISE', 3, '2023-05-27 10:27:40', '2023-05-27 10:27:40'),
(17, 'SPH', 3, '2023-05-27 10:31:17', '2023-05-27 10:31:17'),
(18, 'STORES', 3, '2023-05-27 10:31:34', '2023-05-27 10:31:34'),
(19, 'OPERATION', 3, '2023-05-27 10:32:39', '2023-05-27 10:32:39'),
(20, 'MECHANICAL', 3, '2023-05-27 10:33:09', '2023-05-27 10:33:09'),
(21, 'SECURITY', 3, '2023-05-27 10:33:34', '2023-05-27 10:33:34'),
(22, 'HSE', 3, '2023-05-27 10:34:35', '2023-05-27 10:34:35'),
(23, 'HRA', 3, '2023-05-27 10:34:49', '2023-05-27 10:34:49'),
(24, 'E & I', 3, '2023-05-27 10:35:01', '2023-05-27 10:35:01'),
(25, 'PCD', 3, '2023-05-27 10:35:46', '2023-05-27 10:35:46'),
(26, 'LOGISTICS', 3, '2023-05-27 10:35:58', '2023-05-27 10:35:58'),
(27, 'PROJECT PLANNING & CIVIL', 3, '2023-05-27 10:36:32', '2023-05-27 10:36:32'),
(28, 'PROCUREMENT', 3, '2023-05-27 10:39:04', '2023-05-27 10:39:04'),
(29, 'RM & L', 3, '2023-05-27 10:44:38', '2023-05-27 10:44:38');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
