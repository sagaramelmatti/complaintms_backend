-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 30, 2023 at 08:46 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 7.4.33

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
-- Table structure for table `complaints`
--

CREATE TABLE `complaints` (
  `id` int(11) NOT NULL,
  `title` varchar(500) DEFAULT NULL,
  `description` varchar(5000) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `departmentId` int(11) DEFAULT NULL,
  `locationId` int(11) NOT NULL,
  `status` varchar(20) DEFAULT NULL,
  `comment` varchar(300) DEFAULT NULL,
  `complaint_added_date` datetime DEFAULT NULL,
  `complaint_resolved_date` datetime DEFAULT NULL,
  `ticketNumber` int(11) DEFAULT NULL,
  `ticketNumberSequance` varchar(10) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'BBSR OFFICE', '2023-05-27 09:26:27', '2023-05-27 09:26:27'),
(2, 'PELLET PLANT JAJPUR', '2023-05-27 09:27:03', '2023-05-27 09:27:03'),
(3, 'BENEFICATION PLANT BARBIL', '2023-05-27 09:28:29', '2023-05-27 09:28:29');

-- --------------------------------------------------------

--
-- Table structure for table `location_users`
--

CREATE TABLE `location_users` (
  `id` int(11) NOT NULL,
  `locationId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `location_users`
--

INSERT INTO `location_users` (`id`, `locationId`, `userId`, `createdAt`, `updatedAt`) VALUES
(1, 1, 2, '2023-05-30 12:08:24', '2023-05-30 12:08:24'),
(2, 1, 3, '2023-05-30 12:09:38', '2023-05-30 12:09:38'),
(3, 2, 2, '2023-05-30 12:10:01', '2023-05-30 12:10:01'),
(4, 2, 3, '2023-05-30 12:10:01', '2023-05-30 12:10:01'),
(5, 3, 4, '2023-05-30 12:14:01', '2023-05-30 12:14:01'),
(6, 3, 5, '2023-05-30 12:14:01', '2023-05-30 12:14:01');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'admin', '2023-03-16 16:51:05', '2023-03-16 16:51:05'),
(2, 'user', '2023-03-16 16:49:41', '2023-03-16 16:49:41'),
(3, 'supervisor', '2023-05-21 11:13:40', '2023-05-21 11:13:40');

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
(5, 'Bibhudatta Pradhan', 'bibhudatta.pradhan@brplind.com', '$2a$08$Tigi8D5bsErvkqwaN2o4eebwwyYf5gqFUmvkP3DGh2oUp5VERWuva', 'A', 1, 3, 'S', '2023-05-30 08:41:37', '2023-05-30 08:41:37');

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `roleId` int(11) NOT NULL,
  `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`) VALUES
('2023-05-30 08:36:05', '2023-05-30 08:36:05', 1, 1),
('2023-05-30 08:36:21', '2023-05-30 08:36:21', 3, 2),
('2023-05-30 08:36:35', '2023-05-30 08:36:35', 3, 3),
('2023-05-30 08:36:58', '2023-05-30 08:36:58', 3, 4),
('2023-05-30 08:43:35', '2023-05-30 08:43:35', 3, 5);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `complaints`
--
ALTER TABLE `complaints`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `location_users`
--
ALTER TABLE `location_users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `locationId` (`locationId`,`userId`),
  ADD KEY `locationId_2` (`locationId`,`userId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`roleId`,`userId`),
  ADD KEY `userId` (`userId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `complaints`
--
ALTER TABLE `complaints`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `location_users`
--
ALTER TABLE `location_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `location_users`
--
ALTER TABLE `location_users`
  ADD CONSTRAINT `location_users_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `location_users_ibfk_2` FOREIGN KEY (`locationId`) REFERENCES `locations` (`id`);

--
-- Constraints for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
