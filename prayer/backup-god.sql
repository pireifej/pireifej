-- MySQL dump 10.19  Distrib 10.3.29-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: god
-- ------------------------------------------------------
-- Server version	10.3.29-MariaDB-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `category` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(50) NOT NULL,
  `active` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'healing',1),(2,'surgery',1),(3,'family',1),(4,'pet',1),(5,'love',1),(6,'life',1),(7,'children',0),(8,'general',1),(9,'hope',1),(10,'inspiration',1),(11,'marriage',1),(12,'travel',1),(13,'strength',1),(14,'peace',1),(15,'leaders',1),(16,'finances',1),(17,'salvation',1),(18,'emotions',0),(19,'sexual',0),(20,'drugs',0),(21,'suicide',1);
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prayers`
--

DROP TABLE IF EXISTS `prayers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `prayers` (
  `prayer_id` int(11) NOT NULL AUTO_INCREMENT,
  `prayer_title` varchar(100) NOT NULL,
  `prayer_file_name` varchar(100) NOT NULL,
  `fk_category_id` int(11) DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `prayer_text` mediumtext DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`prayer_id`),
  KEY `fk_category_id` (`fk_category_id`),
  CONSTRAINT `prayers_ibfk_1` FOREIGN KEY (`fk_category_id`) REFERENCES `category` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prayers`
--

LOCK TABLES `prayers` WRITE;
/*!40000 ALTER TABLE `prayers` DISABLE KEYS */;
INSERT INTO `prayers` VALUES (1,'Before a Surgery','surgery1',2,'joy,accept,relief,cure,surgeon,speedy,fast',NULL,1),(2,'Prayer After A Surgery','surgery2',2,'done,past,healing,strength',NULL,0),(3,'Prayer For Healing','healing1',8,'courage,praise,help,body,spirit,touch',NULL,1),(4,'Prayer For Healing','healing2',8,'give,health,strength,peace',NULL,0),(5,'Prayer For Healing','healing3',8,'mercy,restore,purify,clean,strength',NULL,0),(8,'Prayer For Healing','healing6',8,'heal,healing,mess',NULL,0),(10,'A Prayer For a Family','family1',8,'family,families,protect,bless,newborn,hospital,wrong',NULL,1),(11,'General Prayer','general1',8,'strength,empower,challenge,challenges',NULL,1),(12,'For our Animal Friends','pet1',4,'pet,dog,cat,dogs,cats',NULL,1),(13,'Soulmate Prayer','love1',8,'partner,wife,husband,soulmate',NULL,1),(14,'Parents Prayer for Their Children','children1',3,'children,child,kids,kid,son,daughter',NULL,1),(15,'A Prayer for Hope','hope1',8,'hope,helpless,help',NULL,1),(16,'An Inspirational Prayer','inspiration1',8,'anxiety,worry,trust',NULL,1),(17,'Prayer for my Marriage','marriage1',11,'marriage,married,wedding',NULL,1),(18,'Safe Travels','travel1',12,'travel,vacation,trip',NULL,1),(19,'Give Me Strength','strength1',13,'strength,strong',NULL,1),(20,'A Prayer for Inner Peace','peace1',14,'peace,worried,anxios,troubled,depressed,sad',NULL,1),(21,'Government Leader','leaders1',8,'leader,leaders,US,USA,United,States,President',NULL,1),(22,'Financial Blessing','finances1',8,'money,finance,finances',NULL,1),(23,'A Prayer for Salvation','salvation1',17,NULL,NULL,1),(24,'Prayer for Emotional Healing','emotions1',8,'emotions,sad,lonely,negative,despair,crazy',NULL,1),(25,'Modesty and Pure Thoughts','sexual1',8,'pure,purity,sex,sexual,conduct,problem,problems',NULL,1),(26,'Addiction to Drugs','drugs1',8,'drug,drugs,pill,pills,addiction',NULL,1),(27,'Suicide','suicide1',21,'null',NULL,1),(28,'Baby Lives','life1',8,'baby,abortion,babies',NULL,1),(32,'Prayer for Families','family2',8,'joy,worries,watch,protect,worry,family',NULL,0),(33,' St. Michael the Archangel Novena','general2',8,'Michael,Archangel,Novena',NULL,0),(34,'Final Prayer - St. Michael the Archangel Novena','general3',8,'Final, Michael, archangel',NULL,0),(37,'You decide for me!','youdecide',8,NULL,NULL,1);
/*!40000 ALTER TABLE `prayers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `request`
--

DROP TABLE IF EXISTS `request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `request` (
  `request_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `active` tinyint(1) DEFAULT NULL,
  `request_date_time` datetime DEFAULT NULL,
  `request_title` varchar(50) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `fk_category_id` int(11) DEFAULT NULL,
  `request_text` varchar(500) DEFAULT NULL,
  `other_person` varchar(50) DEFAULT NULL,
  `picture` varchar(255) DEFAULT NULL,
  `fk_prayer_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`request_id`),
  KEY `fk_category_id` (`fk_category_id`),
  KEY `fk_prayer_id` (`fk_prayer_id`),
  CONSTRAINT `fk_prayer_id` FOREIGN KEY (`fk_prayer_id`) REFERENCES `prayers` (`prayer_id`),
  CONSTRAINT `request_ibfk_1` FOREIGN KEY (`fk_category_id`) REFERENCES `category` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=553 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `request`
--

LOCK TABLES `request` WRITE;
/*!40000 ALTER TABLE `request` DISABLE KEYS */;
INSERT INTO `request` VALUES (552,105,1,NULL,'pray for my kids','2021-08-16 03:22:55',8,'I want my kids to be free of covid','Gabriel','XDbf59pt.jpg',3);
/*!40000 ALTER TABLE `request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rosary`
--

DROP TABLE IF EXISTS `rosary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rosary` (
  `rosary_id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `session_id` varchar(50) DEFAULT NULL,
  `fk_user_id` int(11) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `user_order` int(11) DEFAULT NULL,
  `my_turn` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`rosary_id`),
  KEY `fk_user_id` (`fk_user_id`),
  CONSTRAINT `rosary_ibfk_1` FOREIGN KEY (`fk_user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rosary`
--

LOCK TABLES `rosary` WRITE;
/*!40000 ALTER TABLE `rosary` DISABLE KEYS */;
/*!40000 ALTER TABLE `rosary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `user_name` varchar(50) DEFAULT NULL,
  `password` varchar(200) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `real_name` varchar(50) DEFAULT NULL,
  `location` varchar(50) DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_title` varchar(25) DEFAULT NULL,
  `user_about` varchar(50) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `gender` varchar(20) DEFAULT NULL,
  `picture` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_name_unique` (`user_name`)
) ENGINE=InnoDB AUTO_INCREMENT=120 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('Singwala','$2b$05$tFyMEzcUKsekS9NfYiGFzOA5v5Ml0mQaTZTcZKgipujJI8U3vDiSW','Singwala08@hotmail.com','Singwala','New Windsor, NY',1,41,'Mrs.','Praying for my family & for others','2021-02-14 15:52:00','female','dIb7Yxut.jpg'),('Jiri1948@gmail.com','$2b$05$Gvq2M./CDOrhrSx5L1zWAevY70mRekpWGgEwo7LOqxZOEpVMnXrVG','jiri1948@gmail.com','Jiri','3 ON THE GREEN new windsor ny',1,43,'honesty','I’m  very good and honest person full with love fo','2021-03-28 23:47:49','male','lw8zWWny.jpg'),('kimchung80','$2b$05$PoG7p2hNgxvgnq1S.Pmae.QWKiPX/b6N/mdrXI1EAUU13l8pteUHi','kimchung80@gmail.com','Kimberly','',1,61,'Engineer','To support my bffffffff','2021-08-11 20:17:10',NULL,'0F5D7E33-1324-4E85-B4B3-25C4D54AED31.jpeg'),('pireifej','$2b$05$5BKiAV0je7q9HPK0cLFWJOTa6TRhSSp93x/V1n1qMpB.4DgqBp7JW','pireifej@gmail.com','Paul','NJ',1,105,'Creator','I created this website to encourage prayer.','2021-08-16 03:21:41',NULL,'L7UbMRyt.jpg'),('Jack','$2b$05$p.i5BV.emL9qKdl8O3hO2.W.rCossY.NBPBNbVNgAX2ynFDhApesK','andrewanimation@gmail.com','Jack','CTU',1,106,'Badass','Getting things done','2021-02-12 18:05:40',NULL,'zo5Ro4RN.jpg'),('10101437702988656','$2b$05$ifmSJJt3GX7MLRF/Fa6KGutcmPK/aodBipqULhSR3hF3VZYc0f/kC','facebook','Paul Ireifej','facebook',1,107,'facebook','facebook','2021-06-24 17:16:09',NULL,'facebook');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_request`
--

DROP TABLE IF EXISTS `user_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_request` (
  `request_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`request_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_request`
--

LOCK TABLES `user_request` WRITE;
/*!40000 ALTER TABLE `user_request` DISABLE KEYS */;
INSERT INTO `user_request` VALUES (552,105,'2021-08-16 03:37:01');
/*!40000 ALTER TABLE `user_request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visitors`
--

DROP TABLE IF EXISTS `visitors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `visitors` (
  `visitor_id` int(11) NOT NULL AUTO_INCREMENT,
  `visitor_details` longtext DEFAULT NULL,
  `visitor_timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`visitor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visitors`
--

LOCK TABLES `visitors` WRITE;
/*!40000 ALTER TABLE `visitors` DISABLE KEYS */;
INSERT INTO `visitors` VALUES (8,'{appName:Netscape,onLine:true,appVersion:5.0 (Windows),cookieEnabled:true,language:en-US,userAgent:Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0}','2021-08-11 03:41:14'),(9,'{appName:Netscape,onLine:true,appVersion:5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36,cookieEnabled:true,language:en-US,userAgent:Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36,latitude:40.3991924,longitude:-74.23421549999999,accuracy:106}','2021-08-11 03:41:41'),(10,'{appName:Netscape,onLine:true,appVersion:5.0 (Linux; Android 11; Pixel 3a XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36,cookieEnabled:true,language:en-US,userAgent:Mozilla/5.0 (Linux; Android 11; Pixel 3a XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36,latitude:40.3991859,longitude:-74.2342256,accuracy:12.50100040435791}','2021-08-11 03:42:14'),(11,'{appName:Netscape,onLine:true,appVersion:5.0 (Linux; Android 11; Pixel 3a XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36,cookieEnabled:true,language:en-US,userAgent:Mozilla/5.0 (Linux; Android 11; Pixel 3a XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36,latitude:40.3991847,longitude:-74.2342154,accuracy:12.477999687194824}','2021-08-11 03:42:28'),(12,'{appName:Netscape,onLine:true,appVersion:5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15,cookieEnabled:true,language:en-us,userAgent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15,latitude:40.399151494957145,longitude:-74.23437440652422,accuracy:65}','2021-08-11 03:43:12'),(13,'{appName:Netscape,onLine:true,appVersion:5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1,cookieEnabled:true,language:en-us,userAgent:Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1}','2021-08-11 03:45:11'),(14,'{appName:Netscape,onLine:true,appVersion:5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36,cookieEnabled:true,language:en-US,userAgent:Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36,latitude:40.435712,longitude:-74.1605376,accuracy:2856.351123730402}','2021-08-11 19:15:05'),(15,'{appName:Netscape,onLine:true,appVersion:5.0 (Linux; Android 11; Pixel 3a XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36,cookieEnabled:true,language:en-US,userAgent:Mozilla/5.0 (Linux; Android 11; Pixel 3a XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36,latitude:40.3991484,longitude:-74.2342603,accuracy:27.768999099731445}','2021-08-12 02:40:12'),(16,'{appName:Netscape,onLine:true,appVersion:5.0 (compatible; Dataprovider.com),cookieEnabled:true,language:en-US,userAgent:Mozilla/5.0 (compatible; Dataprovider.com)}','2021-08-12 06:59:07'),(17,'{appName:Netscape,onLine:true,appVersion:5.0 (Windows NT 6.1; WOW64) AppleWebKit/534+ (KHTML, like Gecko) BingPreview/1.0b,cookieEnabled:true,language:en-US,userAgent:Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/534+ (KHTML, like Gecko) BingPreview/1.0b}','2021-08-12 16:01:11'),(18,'{appName:Netscape,onLine:true,appVersion:5.0 (Linux; Android 11; Pixel 3a XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36,cookieEnabled:true,language:en-US,userAgent:Mozilla/5.0 (Linux; Android 11; Pixel 3a XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36,latitude:40.3989908,longitude:-74.2340689,accuracy:23.514999389648438}','2021-08-13 02:39:18'),(19,'{appName:Netscape,onLine:true,appVersion:5.0 (Linux; Android 11; Pixel 3a XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36,cookieEnabled:true,language:en-US,userAgent:Mozilla/5.0 (Linux; Android 11; Pixel 3a XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36,latitude:40.3991392,longitude:-74.234193,accuracy:12.022000312805176}','2021-08-13 02:43:29'),(20,'{appName:Netscape,onLine:true,appVersion:5.0 (Linux; Android 11; Pixel 3a XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36,cookieEnabled:true,language:en-US,userAgent:Mozilla/5.0 (Linux; Android 11; Pixel 3a XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36,latitude:40.3991601,longitude:-74.234238,accuracy:11.553000450134277}','2021-08-13 02:44:11'),(21,'{appName:Netscape,onLine:true,appVersion:5.0 (Linux; Android 11; Pixel 3a XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36,cookieEnabled:true,language:en-US,userAgent:Mozilla/5.0 (Linux; Android 11; Pixel 3a XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36,latitude:40.3991502,longitude:-74.2342458,accuracy:11.618000030517578}','2021-08-13 02:49:21'),(22,'{appName:Netscape,onLine:true,appVersion:5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/92.0.4515.119 Safari/537.36,cookieEnabled:true,language:en-US,userAgent:Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/92.0.4515.119 Safari/537.36}','2021-08-13 03:37:00'),(23,'{appName:Netscape,onLine:true,appVersion:5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.119 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html),cookieEnabled:true,language:en-US,userAgent:Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.119 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)}','2021-08-13 16:33:28'),(24,'{appName:Netscape,onLine:true,appVersion:5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36,cookieEnabled:true,language:en-US,userAgent:Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36,latitude:40.4031584,longitude:-74.2296598,accuracy:1546.8951514068983}','2021-08-15 03:31:15'),(25,'{appName:Netscape,onLine:true,appVersion:5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36,cookieEnabled:true,language:en-US,userAgent:Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36,latitude:40.4031584,longitude:-74.2296598,accuracy:1546.8951514068983}','2021-08-15 03:31:41'),(26,'{appName:Netscape,onLine:true,appVersion:5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36,cookieEnabled:true,language:en-US,userAgent:Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36,latitude:40.4031584,longitude:-74.2296598,accuracy:1546.8951514068983}','2021-08-15 03:38:03'),(27,'{appName:Netscape,onLine:true,appVersion:5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/92.0.4515.119 Safari/537.36,cookieEnabled:true,language:en-US,userAgent:Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/92.0.4515.119 Safari/537.36}','2021-08-16 05:35:02'),(28,'{appName:Netscape,onLine:true,appVersion:5.0 (Windows NT 6.1; WOW64) AppleWebKit/534+ (KHTML, like Gecko) BingPreview/1.0b,cookieEnabled:true,language:en-US,userAgent:Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/534+ (KHTML, like Gecko) BingPreview/1.0b}','2021-08-16 22:46:27'),(29,'{appName:Netscape,onLine:true,appVersion:5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36,cookieEnabled:true,language:en-US,userAgent:Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36,latitude:40.4031584,longitude:-74.2296598,accuracy:1546.8951514068983}','2021-08-17 14:00:54'),(30,'{appName:Netscape,onLine:true,appVersion:5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 196.0.0.21.120 (iPhone13,2; iOS 14_6; en_US; en-US; scale','2021-08-17 17:08:57'),(31,'{appName:Netscape,onLine:true,appVersion:5.0 (Linux; Android 11; Pixel 3a XL Build/RQ3A.210805.001.A1; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/92.0.4515.159 Mobile Safari/537.36 Instagram 201.0.0.26.112 Android (30/11; 400dpi; 1080x2040; Google/google; Pixel 3a XL; bonito; bonito; en_US; 311618467),cookieEnabled:true,language:en-US,userAgent:Mozilla/5.0 (Linux; Android 11; Pixel 3a XL Build/RQ3A.210805.001.A1; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/92.0.4515.159 Mobile Safari/537.36 Instagram 201.0.0.26.112 Android (30/11; 400dpi; 1080x2040; Google/google; Pixel 3a XL; bonito; bonito; en_US; 311618467),latitude:40.7992061,longitude:-74.4697229,accuracy:14.076000213623047}','2021-08-18 21:22:34'),(32,'{appName:Netscape,onLine:true,appVersion:5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36,cookieEnabled:true,language:en-US,userAgent:Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36,latitude:39.2371263,longitude:-76.8096171,accuracy:11.336999893188477}','2021-08-19 00:56:47');
/*!40000 ALTER TABLE `visitors` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-08-18 20:02:58
