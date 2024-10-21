-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 02, 2024 at 12:52 AM
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
-- Database: `kanban-board`
--

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `taskName` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `createdDate` date DEFAULT NULL,
  `dueDate` date DEFAULT NULL,
  `assignee` varchar(100) DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'To Do',
  `position` int(11) NOT NULL DEFAULT 0,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `taskName`, `description`, `createdDate`, `dueDate`, `assignee`, `status`, `position`, `user_id`) VALUES
(2, 'wqe', ' weqwew', '2024-07-24', '2024-07-25', 'eqweqwe', 'To Do', 0, 1),
(4, '123@gmail.com', ' 123', '2024-07-30', '2024-08-02', '123', 'In Progress', 1, 2),
(7, '123', ' 1', '2024-07-30', '2024-07-31', '1', 'In Progress', 0, 2),
(8, '123', ' 1', '2024-07-30', '2024-07-31', '1', 'In Progress', 2, 2);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`) VALUES
(1, 'lee@gmail.com', '$2y$10$E0/Kv4qIAbRgCw76XjxAwebZtlL6XTAwrT/41fk4g8P0gT9QiaDCa'),
(2, '123@gmail.com', '$2y$10$4fwkUKbpYy4z4zy4cK0Bp.RUGz.2P9KdJFCJsDDt1O2O14Fdm9QPW'),
(3, '1234@gmail.com', '$2y$10$0B433F69Mt0efEJSfSrcH.06DAX23/A5hVzxNxI8CWyMcZkMv1dy6'),
(7, '12345@gmail.com', '$2y$10$aZG04NQzh3VOQujuSFGy9O5AMpPICuzbSA4CM1xu7LKTGS1OwERxi');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
