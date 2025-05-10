package com.palettepal.my_backend.model;

import jakarta.persistence.*;
import java.util.*;

@Entity
@Table(name = "videos")
public class Video {

    @Id
    @Column(name = "video_id", nullable = false, unique = true)
    private String videoId;

    private String title;

    @Column(length = 2000)
    private String description;

    private String channelTitle;

    private String publishTime;

    private String thumbnailUrl;

    private String videoUrl;

    private double durationMinutes;

    private String formattedDuration;

    @OneToMany(mappedBy = "video", cascade = CascadeType.ALL)
    private List<Like> likes = new ArrayList<>();

    public Video() {}

    public Video(String videoId, String title, String description, String channelTitle,
                 String publishTime, String thumbnailUrl, String videoUrl,
                 double durationMinutes, String formattedDuration) {
        this.videoId = videoId;
        this.title = title;
        this.description = description;
        this.channelTitle = channelTitle;
        this.publishTime = publishTime;
        this.thumbnailUrl = thumbnailUrl;
        this.videoUrl = videoUrl;
        this.durationMinutes = durationMinutes;
        this.formattedDuration = formattedDuration;
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
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getChannelTitle() {
        return channelTitle;
    }

    public void setChannelTitle(String channelTitle) {
        this.channelTitle = channelTitle;
    }

    public String getPublishTime() {
        return publishTime;
    }

    public void setPublishTime(String publishTime) {
        this.publishTime = publishTime;
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public double getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(double durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public String getFormattedDuration() {
        return formattedDuration;
    }

    public void setFormattedDuration(String formattedDuration) {
        this.formattedDuration = formattedDuration;
    }

    public List<Like> getLikes() {
        return likes;
    }

    public void setLikes(List<Like> likes) {
        this.likes = likes;
    }

}
