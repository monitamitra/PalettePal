COPY videos(video_id, title, description, channel_title, publish_time, thumbnail_url, video_url, duration_minutes, formatted_duration)
FROM '/docker-entrypoint-initdb.d/videos.csv'
DELIMITER ','
CSV HEADER;