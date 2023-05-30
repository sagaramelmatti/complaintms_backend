-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 30, 2023 at 08:16 AM
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
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `departmentId` int(11) DEFAULT NULL,
  `locationId` int(11) NOT NULL,
  `userType` varchar(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `status`, `departmentId`, `locationId`, `userType`, `createdAt`, `updatedAt`) VALUES
(1, 'V Rama Krishna', 'rama.krishna@brplind.com', '$2a$08$Tigi8D5bsErvkqwaN2o4eebwwyYf5gqFUmvkP3DGh2oUp5VERWuva', 'A', 1, 1, 'A', '2023-05-27 11:23:40', '2023-05-27 11:23:40'),
(2, 'debasish dey', 'debasish.dey@brplind.com', '$2a$08$Tigi8D5bsErvkqwaN2o4eebwwyYf5gqFUmvkP3DGh2oUp5VERWuva', 'A', 1, 1, 'S', '2023-05-27 11:29:22', '2023-05-27 11:29:22'),
(3, 'Roopesh Kumar', 'roopesh.kumar@brplind.com', '$2a$08$Tigi8D5bsErvkqwaN2o4eebwwyYf5gqFUmvkP3DGh2oUp5VERWuva', 'A', 1, 2, 'S', '2023-05-27 11:51:17', '2023-05-27 11:51:17'),
(4, 'prabhudatta mohanty', 'prabhudatta.mohanty@brplind.com', '$2a$08$Tigi8D5bsErvkqwaN2o4eebwwyYf5gqFUmvkP3DGh2oUp5VERWuva', 'A', 1, 3, 'S', '2023-05-27 12:02:42', '2023-05-27 12:02:42'),
(6, 'sagar melmatti', 'sagarmelmatti@gmail.com', '$2a$08$pje0utGWEPGzjWht3vyPv.IEFkk8v68q8Fz3H9RkC9kXEU83XOss2', 'A', 1, 1, 'U', '2023-05-27 11:24:24', '2023-05-27 11:24:24');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
