CREATE TABLE IF NOT EXISTS videos (
    video_id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    channel_title TEXT,
    publish_time TEXT,
    thumbnail_url TEXT,
    video_url TEXT,
    duration_minutes DOUBLE PRECISION,
    formatted_duration TEXT
);
