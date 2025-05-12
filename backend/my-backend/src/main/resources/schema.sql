DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS users;

CREATE TABLE likes ( id SERIAL PRIMARY KEY, user_id VARCHAR NOT NULL,
    video_id VARCHAR(255),
    mood VARCHAR(255),
    skill_level VARCHAR(255)
);

CREATE TABLE users (
    id VARCHAR PRIMARY KEY, 
    username VARCHAR(255), 
    password VARCHAR(255)
);