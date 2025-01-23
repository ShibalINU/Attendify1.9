-- MySQL dump 10.13  Distrib 8.4.2, for Win64 (x86_64)
--
-- Host: localhost    Database: attendify3
-- ------------------------------------------------------
-- Server version	8.4.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int DEFAULT NULL,
  `class_id` int DEFAULT NULL,
  `attendance_date` date NOT NULL,
  `status` enum('present','absent','excused','cutting','late') NOT NULL,
  `time_in` time DEFAULT NULL,
  `time_out` time DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  KEY `class_id` (`class_id`),
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `attendance_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance_archive`
--

DROP TABLE IF EXISTS `attendance_archive`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance_archive` (
  `id` int NOT NULL DEFAULT '0',
  `student_id` int DEFAULT NULL,
  `class_id` int DEFAULT NULL,
  `attendance_date` date NOT NULL,
  `status` enum('present','absent','excused','cutting','late') NOT NULL,
  `time_in` time DEFAULT NULL,
  `time_out` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance_archive`
--

LOCK TABLES `attendance_archive` WRITE;
/*!40000 ALTER TABLE `attendance_archive` DISABLE KEYS */;
INSERT INTO `attendance_archive` VALUES (1,35,41,'2025-01-21','absent','06:37:47',NULL),(2,35,40,'2025-01-21','absent','06:37:47',NULL),(3,35,39,'2025-01-21','absent','06:37:47',NULL),(4,36,41,'2025-01-21','absent','06:37:47',NULL),(5,36,40,'2025-01-21','absent','06:37:47',NULL),(6,36,39,'2025-01-21','absent','06:37:47',NULL),(7,37,41,'2025-01-21','absent','06:37:47',NULL),(8,37,40,'2025-01-21','absent','06:37:47',NULL),(9,37,39,'2025-01-21','absent','06:37:47',NULL),(10,38,41,'2025-01-21','absent','06:37:47',NULL),(11,38,40,'2025-01-21','absent','06:37:47',NULL),(12,38,39,'2025-01-21','absent','06:37:47',NULL),(13,39,41,'2025-01-21','absent','06:37:47',NULL),(14,39,40,'2025-01-21','absent','06:37:47',NULL),(15,39,39,'2025-01-21','absent','06:37:47',NULL),(16,40,41,'2025-01-21','present','07:33:00',NULL),(17,40,40,'2025-01-21','present','07:33:00',NULL),(18,40,39,'2025-01-21','present','07:33:00',NULL),(19,41,41,'2025-01-21','absent','06:37:47',NULL),(20,41,40,'2025-01-21','absent','06:37:47',NULL),(21,41,39,'2025-01-21','absent','06:37:47',NULL),(22,42,41,'2025-01-21','absent','06:37:47',NULL),(23,42,40,'2025-01-21','absent','06:37:47',NULL),(24,42,39,'2025-01-21','absent','06:37:47',NULL),(25,43,41,'2025-01-21','absent','06:37:47',NULL),(26,43,40,'2025-01-21','absent','06:37:47',NULL),(27,43,39,'2025-01-21','absent','06:37:47',NULL),(28,44,41,'2025-01-21','absent','06:37:47',NULL),(29,44,40,'2025-01-21','absent','06:37:47',NULL),(30,44,39,'2025-01-21','absent','06:37:47',NULL),(31,45,41,'2025-01-21','absent','06:37:47',NULL),(32,45,40,'2025-01-21','absent','06:37:47',NULL),(33,45,39,'2025-01-21','absent','06:37:47',NULL),(34,46,41,'2025-01-21','absent','06:37:47',NULL),(35,46,40,'2025-01-21','absent','06:37:47',NULL),(36,46,39,'2025-01-21','absent','06:37:47',NULL),(37,47,41,'2025-01-21','absent','06:37:47',NULL),(38,47,40,'2025-01-21','absent','06:37:47',NULL),(39,47,39,'2025-01-21','absent','06:37:47',NULL),(40,48,41,'2025-01-21','absent','06:37:47',NULL),(41,48,40,'2025-01-21','absent','06:37:47',NULL),(42,48,39,'2025-01-21','absent','06:37:47',NULL),(43,49,41,'2025-01-21','absent','06:37:47',NULL),(44,49,40,'2025-01-21','absent','06:37:47',NULL),(45,49,39,'2025-01-21','absent','06:37:47',NULL),(46,50,41,'2025-01-21','absent','06:37:47',NULL),(47,50,40,'2025-01-21','absent','06:37:47',NULL),(48,50,39,'2025-01-21','absent','06:37:47',NULL),(49,51,41,'2025-01-21','absent','06:37:47',NULL),(50,51,40,'2025-01-21','absent','06:37:47',NULL),(51,51,39,'2025-01-21','absent','06:37:47',NULL),(52,52,41,'2025-01-21','absent','06:37:47',NULL),(53,52,40,'2025-01-21','absent','06:37:47',NULL),(54,52,39,'2025-01-21','absent','06:37:47',NULL),(55,53,41,'2025-01-21','absent','06:37:47',NULL),(56,53,40,'2025-01-21','absent','06:37:47',NULL),(57,53,39,'2025-01-21','absent','06:37:47',NULL),(58,54,41,'2025-01-21','absent','06:37:47',NULL),(59,54,40,'2025-01-21','absent','06:37:47',NULL),(60,54,39,'2025-01-21','absent','06:37:47',NULL);
/*!40000 ALTER TABLE `attendance_archive` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classes`
--

DROP TABLE IF EXISTS `classes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subject_name` varchar(100) NOT NULL,
  `grade_section` varchar(20) NOT NULL,
  `day` enum('Monday','Tuesday','Wednesday','Thursday','Friday') NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `teacher_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `teacher_id` (`teacher_id`),
  CONSTRAINT `classes_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classes`
--

LOCK TABLES `classes` WRITE;
/*!40000 ALTER TABLE `classes` DISABLE KEYS */;
INSERT INTO `classes` VALUES (35,'Physical Education & Health 3','12-MAWD','Monday','08:00:00','10:00:00',20),(36,'Pagbasa at Pagsusuri','12-MAWD','Monday','10:30:00','12:00:00',19),(37,'Computer/Web Programming 4','12-MAWD','Monday','13:30:00','15:00:00',21),(38,'English for Academic & Prof','12-MAWD','Monday','15:00:00','16:30:00',22),(39,'Physical Science','12-MAWD','Tuesday','12:00:00','13:30:00',23),(40,'Computer/Web Programming 5','12-MAWD','Tuesday','13:30:00','15:00:00',21),(41,'Personal Development','12-MAWD','Tuesday','15:00:00','16:30:00',24),(42,'Pagbasa at Pagsusuri','12-MAWD','Wednesday','10:30:00','12:00:00',19),(43,'Computer/Web Programming 4','12-MAWD','Wednesday','13:30:00','15:00:00',21),(44,'English for Academic & Prof','12-MAWD','Wednesday','15:00:00','16:30:00',22),(45,'Physical Science','12-MAWD','Thursday','12:00:00','13:30:00',23),(46,'Computer/Web Programming 5','12-MAWD','Thursday','13:30:00','15:00:00',21),(47,'Personal Development','12-MAWD','Thursday','15:00:00','16:30:00',24),(48,'Homeroom','12-MAWD','Friday','07:00:00','08:30:00',24),(49,'Fil Sa Piling Larang (Tech)','12-MAWD','Friday','08:30:00','11:30:00',19),(50,'Practical Research 2','12-MAWD','Friday','12:00:00','15:00:00',25),(51,'Student Orgs & Clubs','12-MAWD','Friday','15:00:00','16:30:00',19),(54,'General Physics 1','12-STEM-A','Monday','07:30:00','10:30:00',33),(55,'General Chemistry 1','12-STEM-A','Monday','13:30:00','16:30:00',33),(56,'Personal Development','12-STEM-A','Monday','12:00:00','13:30:00',24),(57,'Personal Development','12-STEM-A','Wednesday','12:00:00','13:30:00',24),(58,'Practical Research 2','12-STEM-A','Tuesday','12:00:00','13:30:00',25),(59,'Practical Research 2','12-STEM-A','Thursday','12:00:00','13:30:00',25),(60,'Pagbasa at Pagsusuri','12-STEM-A','Tuesday','13:30:00','15:00:00',19),(61,'Pagbasa at Pagsusuri','12-STEM-A','Thursday','13:30:00','15:00:00',19),(62,'English for Academic & Prof','12-STEM-A','Tuesday','15:00:00','16:30:00',22),(63,'English for Academic & Prof','12-STEM-A','Thursday','15:00:00','16:30:00',22),(64,'Disaster Readiness and Risk Reduction','12-STEM-A','Wednesday','13:30:00','16:30:00',23),(65,'Physical Education & Health 3','12-STEM-A','Thursday','08:00:00','10:00:00',34),(66,'Homeroom','12-STEM-A','Friday','07:30:00','08:30:00',22),(67,'Student Orgs & Clubs','12-STEM-A','Friday','08:30:00','09:30:00',23),(68,'Fil Sa Piling Larang (Akademik)','12-STEM-A','Friday','12:30:00','15:30:00',19);
/*!40000 ALTER TABLE `classes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('guard','teacher','student','admin') NOT NULL,
  `rfid` varchar(20) DEFAULT NULL,
  `full_name` varchar(100) NOT NULL,
  `grade_section` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (19,'kim.chesca.quinones','password123','teacher',NULL,'Kim Chesca Quiñones',NULL),(20,'johnmel.napili','password123','teacher',NULL,'Johnmel Napili',NULL),(21,'harvey.plazo','password123','teacher',NULL,'Harvey Plazo',NULL),(22,'arnold.abella','password123','teacher',NULL,'Arnold Abella',NULL),(23,'jomar.rogas','password123','teacher',NULL,'Jomar Rica Rogas',NULL),(24,'julieann.quiñano','password123','teacher',NULL,'Julie Ann Quiñano',NULL),(25,'johnmarq.ramos','password123','teacher',NULL,'John Marq Ramos',NULL),(33,'juliet.locario','password123','teacher',NULL,'Locario, Juliet G.',NULL),(34,'johnharry.tejano','password123','teacher',NULL,'Tejano, John Harry',NULL),(35,'abante.jasper',NULL,'student','RFID001','Abante, Jasper','12-MAWD'),(36,'ante.james',NULL,'student','RFID002','Ante, James','12-MAWD'),(37,'balinagasa.isabela',NULL,'student','RFID003','Balinagasa, Isabela Chloie','12-MAWD'),(38,'buenaagua.robert',NULL,'student','RFID004','Buenaagua, Robert Marlon','12-MAWD'),(39,'cario.alex',NULL,'student','RFID005','Cario, Alex','12-MAWD'),(40,'caudilla.arron',NULL,'student','RFID006','Caudilla, Arron','12-MAWD'),(41,'chiba.yushiake',NULL,'student','RFID007','Chiba, Yushiake','12-MAWD'),(42,'constantino.sophia',NULL,'student','RFID008','Constantino, Sophia Kim','12-MAWD'),(43,'corono.bryan',NULL,'student','RFID009','Corono, Bryan','12-MAWD'),(44,'cortez.faith',NULL,'student','RFID010','Cortez, Faith','12-MAWD'),(45,'dimabayao.karl',NULL,'student','RFID011','Dimabayao, Karl Ancel','12-MAWD'),(46,'laganzon.ivan',NULL,'student','RFID012','Laganzon, Ivan Isaac','12-MAWD'),(47,'oropesa.vann',NULL,'student','RFID013','Oropesa, Vann','12-MAWD'),(48,'penas.joel',NULL,'student','RFID014','Penas, Joel Raphael','12-MAWD'),(49,'rabang.johnrey',NULL,'student','RFID015','Rabang, Johnrey','12-MAWD'),(50,'sanjuan.matt',NULL,'student','RFID016','San Juan, Matt','12-MAWD'),(51,'ros.henry',NULL,'student','RFID017','Ros, Henry James','12-MAWD'),(52,'rodriguez.nathaniel',NULL,'student','RFID018','Rodriguez, Nathaniel','12-MAWD'),(53,'sulda.rin',NULL,'student','RFID019','Sulda, Rin','12-MAWD'),(54,'zamora.daniel',NULL,'student','RFID020','Zamora, Daniel','12-MAWD'),(55,'arron.caudilla','password123','guard',NULL,'Arron Caudilla',NULL),(56,'mauro','password123','admin',NULL,'Mauro',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-21 17:50:26
