drop database if exists SPM_DB;
create database if not exists SPM_DB;
use SPM_DB;

create table Power_types (
  Power_type varchar(10) primary key
);

INSERT INTO Power_types VALUES("Electric");
INSERT INTO Power_types VALUES("Petrol");
INSERT INTO Power_types VALUES("Generic");
INSERT INTO Power_types VALUES("Battery");

create table Series (
  Series int(6) primary key,
  Description varchar(20),
  Product_group varchar(20),
  Power_type varchar(10),
  foreign key(Power_type) references Power_types(Power_type)
);

INSERT INTO Series VALUES(1000, "AK 30", "Battery and Charger", "Battery");


create table Descriptions (
  id int(10) auto_increment primary key,
  xQM_No int(20),
  Series_No int(20),
  Models varchar(30),
  Symptoms varchar(100),
  Description_of_failure varchar(100),
  Technician varchar(10),
  Closed boolean,
  Date_raised date,
  image_location varchar(200),
  Fault_type varchar(50),
  foreign key (Series_No) references Series(Series)
);

INSERT INTO Descriptions VALUES(1,404211, 1000, "AK 30", "Chips on outer casing", "Battery does not charge", "CW", FALSE, "2018-07-18", "img/IMG_0420.jpeg","Premature wear");
INSERT INTO Descriptions VALUES(2,404211, 1000, "AK 30", "Chips on outer casing", "Battery does not charge", "CW", FALSE, "2018-07-18", "","Premature wear");

create table Parts (
  id int(10) auto_increment primary key,
  xQM_No int(20),
  Warranty_No varchar(20),
  Serial_No varchar(20),
  Date_of_sale varchar(20),
  Date_of_failure varchar(20),
  Part_number varchar(20),
  Comments varchar(150),
  Sent_to_manufacture boolean,
  Date_added varchar(20),
  foreign key (xQM_No) references Descriptions(id)
);

INSERT INTO Parts VALUES (1, 1, "WR-129916", "5 10 474 526", "2017-04-05", '2018-05-03', "4601 640 0102", "test comment", FALSE, "2000-01-01");
INSERT INTO Parts VALUES (2, 1, "WR-129916", "5 10 474 526", "2017-04-05", "2018-05-03", "4601 640 0102", "test comment", FALSE, "2000-01-01");


create table Users (
  id int(10) auto_increment primary key,
  email varchar(60),
  pass varchar(60)
);

INSERT INTO Users VALUES(1, "test", "098f6bcd4621d373cade4e832627b4f6");