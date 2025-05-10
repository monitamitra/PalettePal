DROP TABLE IF EXISTS likes;

CREATE TABLE likes ( id SERIAL PRIMARY KEY, user_id INT NOT NULL,
    video_id VARCHAR(255),
    mood VARCHAR(255),
    skill_level VARCHAR(255),
    liked BOOLEAN
);