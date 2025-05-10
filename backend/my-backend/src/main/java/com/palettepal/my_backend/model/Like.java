package com.palettepal.my_backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "likes")
public class Like {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ID;

    private Long userId;
    private String videoID;
    private String mood;
    private String skillLevel;
    private boolean liked;

    // Constructors
    public Like() {

    }

    public Like(Long userID, String videoID, String mood, String skillLevel, 
    boolean liked) {
        this.userId = userID;
        this.videoID = videoID;
        this.mood = mood;
        this.skillLevel = skillLevel;
        this.liked= liked;
    }

    // getters and setters
    public Long getId() { return ID; }
    public Long getUserID() { return userId; }
    public void setuserID(Long userID) { this.userId = userID; }

    public String getVideoID() { return videoID; }
    public void setVideoID(String videoID) { this.videoID = videoID; }

    public String getMood() { return mood; }
    public void setMood(String mood) { this.mood = mood; }

    public String getSkillLevel() { return skillLevel; }
    public void setSkillLevel(String skillLevel) { this.skillLevel = skillLevel; }

    public boolean isLiked() { return liked; }
    public void setLiked(boolean liked) { this.liked = liked; }
    
}
