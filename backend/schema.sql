
-- cхема БД для проекта. 

CREATE TABLE IF NOT EXISTS users (
    user_id     serial4 PRIMARY KEY,
    name        text NOT NULL,
    username    text NOT NULL UNIQUE,
    password    text NOT NULL,              -- тутт bcrypt-хеш
    icon        text DEFAULT 'default.jpg',
    description text
);

CREATE TABLE IF NOT EXISTS points (
    point_id    serial4 PRIMARY KEY,
    description text,
    lat         numeric NOT NULL,
    lng         numeric NOT NULL
);

CREATE TABLE IF NOT EXISTS userpoints (
    user_id  int4 NOT NULL REFERENCES users(user_id),
    point_id int4 NOT NULL REFERENCES points(point_id),
    PRIMARY KEY (user_id, point_id)
);

CREATE TABLE IF NOT EXISTS friends (
    id           serial4 PRIMARY KEY,
    requester_id int4 REFERENCES users(user_id),
    addressee_id int4 REFERENCES users(user_id),


    status       text CHECK (status IN ('send', 'accepted', 'declined')),

    
    CHECK (requester_id <> addressee_id),
    UNIQUE (requester_id, addressee_id)
);