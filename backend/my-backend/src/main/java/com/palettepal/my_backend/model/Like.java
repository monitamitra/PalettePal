package com.palettepal.my_backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "likes")
public class Like {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String videoId;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    private String mood;
    private String skillLevel;

    // Constructors
    public Like() {}

    public Like(User user, String videoId, String mood, String skillLevel) {
        this.user = user;
        this.videoId = videoId;
        this.mood = mood;
        this.skillLevel = skillLevel;
    }

    // Getters and setters
    public Long getId() { return id; }
    public String getVideoId() { return videoId; }
    public void setVideoId(String videoId) { this.videoId = videoId; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getMood() { return mood; }
    public void setMood(String mood) { this.mood = mood; }
    public String getSkillLevel() { return skillLevel; }
    public void setSkillLevel(String skillLevel) { this.skillLevel = skillLevel; }
}