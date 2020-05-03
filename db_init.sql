drop database if exists SPM_DB;
create database if not exists SPM_DB;
use SPM_DB;

create table Series (
  id int(10) auto_increment primary key,
  Series int(6),
  Description varchar(20),
  Product_group varchar(20),
  Power_type varchar(10)
);

INSERT INTO Series VALUES(1, 1000, "AK 30", "Battery and Charger", "Battery");

create table Descriptions (
  id int(10) auto_increment UNIQUE,
  xQM_No int(10) primary key,
  Series_No int(20),
  Models varchar(30),
  Symptoms varchar(100),
  Description_of_failure varchar(100),
  Technician varchar(10),
  Closed boolean,
  Date_raised varchar(30),
  image_location varchar(200),
  Fault_type varchar(50)
);

INSERT INTO Descriptions (xQM_No,Series_No,Models,Symptoms,Description_of_failure,Technician,Closed,Date_raised,image_location,Fault_type) VALUES
(0, 0, "No xQM no.", "No xQM no.", "No xQM no.", "", FALSE, "2000-02-02", "","");

create table Parts (
  id int(10) auto_increment primary key,
  xQM_No int(10),
  Warranty_No varchar(20),
  Serial_No varchar(20),
  Date_of_sale varchar(20),
  Date_of_failure varchar(20),
  Part_number varchar(20),
  Comments varchar(150),
  Sent_to_manufacture boolean,
  Date_added varchar(20),
  foreign key (xQM_No) references Descriptions(xQM_No)
);


create table Users (
  id int(10) auto_increment primary key,
  email varchar(60),
  pass varchar(60)
);

INSERT INTO Users VALUES(1, "test", "098f6bcd4621d373cade4e832627b4f6");