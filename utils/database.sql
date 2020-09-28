-- creating table uzer
CREATE TABLE uzer
(
    user_uid UUID NOT NULL PRIMARY KEY,
    first_name VARCHAR(15) NOT NULL,
    last_name VARCHAR(15) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telephone NUMERIC NOT NULL,
    password VARCHAR(120) NOT NULL,
    profile_pic VARCHAR(120) NOT NULL,
    address_uid UUID REFERENCES address(address_uid) NOT NULL,
    account_uid UUID REFERENCES account(account_uid) NOT NULL,
    UNIQUE(email)
);

CREATE TABLE user_types_of_cars
(
    user_types_of_cars_uid UUID PRIMARY KEY NOT NULL,
    user_uid UUID REFERENCES uzer(user_uid) NOT NULL,
    type_of_car_uid UUID REFERENCES type_of_car(type_of_car_uid) NOT NULL
);

CREATE TABLE user_brands_of_cars
(
    user_brands_of_cars_uid UUID PRIMARY KEY NOT NULL,
    user_uid UUID REFERENCES uzer(user_uid) NOT NULL,
    brand_of_car_uid UUID REFERENCES brand_of_car(brand_of_car_uid) NOT NULL
);

-- creating table address
CREATE TABLE address
(
    address_uid UUID NOT NULL PRIMARY KEY,
    address VARCHAR(50) NOT NULL
);

CREATE TABLE client_favorite_mechanic
(
    client_favorite_mechanic_uid UUID NOT NULL PRIMARY KEY,
    enginear_uid UUID REFERENCES uzer(user_uid) NOT NULL,
    client_uid UUID REFERENCES uzer(user_uid) NOT NULL
)

CREATE TABLE user_chat_room
(
    user_chat_room_uid UUID NOT NULL PRIMARY KEY,
    user_uid UUID REFERENCES uzer(user_uid) NOT NULL,
    user2_uid UUID REFERENCES uzer(user_uid) NOT NULL,
    chatroom_uid UUID REFERENCES chatroom(chatroom_uid) NOT NULL
)

CREATE TABLE chatroom
(
    chatroom_uid UUID NOT NULL PRIMARY KEY
)

-- creating table account
CREATE TABLE account
(
    account_uid UUID NOT NULL PRIMARY KEY,
    account_name VARCHAR(50) NOT NULL
);

-- creating table type_of_car
CREATE TABLE type_of_car
(
    type_of_car_uid UUID NOT NULL PRIMARY KEY,
    type_of_car_name TEXT NOT NULL
);

-- creating table brand_of_car
CREATE TABLE brand_of_car
(
    brand_of_car_uid UUID NOT NULL PRIMARY KEY,
    brand_of_car_name VARCHAR(50) NOT NULL
);

-- inserting into types of cars
insert INTO type_of_car
    (type_of_car_uid, type_of_car_name)
VALUES
    (uuid_generate_v4(), 'car');
insert INTO type_of_car
    (type_of_car_uid, type_of_car_name)
VALUES
    (uuid_generate_v4(), 'minibus');
insert INTO type_of_car
    (type_of_car_uid, type_of_car_name)
VALUES
    (uuid_generate_v4(), 'truck');

-- inserting into brand of cars
insert INTO brand_of_car
    (brand_of_car_uid, brand_of_car_name)
VALUES
    (uuid_generate_v4(), 'Mercedes');
insert INTO brand_of_car
    (brand_of_car_uid, brand_of_car_name)
VALUES
    (uuid_generate_v4(), 'BMW');
insert INTO brand_of_car
    (brand_of_car_uid, brand_of_car_name)
VALUES
    (uuid_generate_v4(), 'VolksWagen');
insert INTO brand_of_car
    (brand_of_car_uid, brand_of_car_name)
VALUES
    (uuid_generate_v4(), 'Toyota');
insert INTO brand_of_car
    (brand_of_car_uid, brand_of_car_name)
VALUES
    (uuid_generate_v4(), 'Suzuki');
insert INTO brand_of_car
    (brand_of_car_uid, brand_of_car_name)
VALUES
    (uuid_generate_v4(), 'Land Rover');
insert INTO brand_of_car
    (brand_of_car_uid, brand_of_car_name)
VALUES
    (uuid_generate_v4(), 'Subaru');
insert INTO brand_of_car
    (brand_of_car_uid, brand_of_car_name)
VALUES
    (uuid_generate_v4(), 'Nissan');
insert INTO brand_of_car
    (brand_of_car_uid, brand_of_car_name)
VALUES
    (uuid_generate_v4(), 'Peugot');
insert INTO brand_of_car
    (brand_of_car_uid, brand_of_car_name)
VALUES
    (uuid_generate_v4(), 'Mitsubishi');
insert INTO brand_of_car
    (brand_of_car_uid, brand_of_car_name)
VALUES
    (uuid_generate_v4(), 'Mazda');
insert INTO brand_of_car
    (brand_of_car_uid, brand_of_car_name)
VALUES
    (uuid_generate_v4(), 'Lexus');
insert INTO brand_of_car
    (brand_of_car_uid, brand_of_car_name)
VALUES
    (uuid_generate_v4(), 'Audi');
insert INTO brand_of_car
    (brand_of_car_uid, brand_of_car_name)
VALUES
    (uuid_generate_v4(), 'Ford');
insert INTO brand_of_car
    (brand_of_car_uid, brand_of_car_name)
VALUES
    (uuid_generate_v4(), 'Kia');
insert INTO brand_of_car
    (brand_of_car_uid, brand_of_car_name)
VALUES
    (uuid_generate_v4(), 'Tesla');

-- inserting into account
insert INTO account
    (account_uid, account)
VALUES
    (uuid_generate_v4(), "client");
insert INTO account
    (account_uid, account)
VALUES
    (uuid_generate_v4(), "mechanic");

-- inserting into address
insert INTO address
    (address_uid, address)
VALUES
    (uuid_generate_v4(), 'Nairobi');
insert INTO address
    (address_uid, address)
VALUES
    (uuid_generate_v4(), 'Mombasa');
insert INTO address
    (address_uid, address)
VALUES
    (uuid_generate_v4(), 'Kisumu');
insert INTO address
    (address_uid, address)
VALUES
    (uuid_generate_v4(), 'Nakuru');
insert INTO address
    (address_uid, address)
VALUES
    (uuid_generate_v4(), 'Ruiru');
insert INTO address
    (address_uid, address)
VALUES
    (uuid_generate_v4(), 'Eldoret');
insert INTO address
    (address_uid, address)
VALUES
    (uuid_generate_v4(), 'Kikuyu');
insert INTO address
    (address_uid, address)
VALUES
    (uuid_generate_v4(), 'Thika');
insert INTO address
    (address_uid, address)
VALUES
    (uuid_generate_v4(), 'Meru');
insert INTO address
    (address_uid, address)
VALUES
    (uuid_generate_v4(), 'Kangundo-Tala');