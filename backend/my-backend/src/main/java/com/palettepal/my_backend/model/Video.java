package com.palettepal.my_backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "videos")
public class Video {

    @Id
    @Column(name = "video_id")
    private String videoId;

    private String title;

    private String video_description;

    private String channel_title;

    private String publish_time;

    private String thumbnail_url;

    private String video_url;

    private double duration_minutes;

    private String formatted_duration;

    public Video() {}

    public Video(String videoId, String title, String description, String channelTitle,
                 String publishTime, String thumbnailUrl, String videoUrl,
                 double durationMinutes, String formattedDuration) {
        this.videoId = videoId;
        this.title = title;
        this.video_description = description;
        this.channel_title = channelTitle;
        this.publish_time = publishTime;
        this.thumbnail_url = thumbnailUrl;
        this.video_url = videoUrl;
        this.duration_minutes = durationMinutes;
        this.formatted_duration = formattedDuration;
    }

    // Getters and setters
    public String getVideoId() {
        return videoId;
    }

    public void setVideoId(String videoId) {
        this.videoId = videoId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return video_description;
    }

    public void setDescription(String description) {
        this.video_description = description;
    }

    public String getChannelTitle() {
        return channel_title;
    }

    public void setChannelTitle(String channelTitle) {
        this.channel_title = channelTitle;
    }

    public String getPublishTime() {
        return publish_time;
    }

    public void setPublishTime(String publishTime) {
        this.publish_time = publishTime;
    }

    public String getThumbnailUrl() {
        return thumbnail_url;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnail_url = thumbnailUrl;
    }

    public String getVideoUrl() {
        return video_url;
    }

    public void setVideoUrl(String videoUrl) {
        this.video_url = videoUrl;
    }

    public double getDurationMinutes() {
        return duration_minutes;
    }

    public void setDurationMinutes(double durationMinutes) {
        this.duration_minutes = durationMinutes;
    }

    public String getFormattedDuration() {
        return formatted_duration;
    }

    public void setFormattedDuration(String formattedDuration) {
        this.formatted_duration = formattedDuration;
    }

}
