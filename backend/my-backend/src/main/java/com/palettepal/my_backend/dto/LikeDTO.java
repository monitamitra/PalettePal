// src/main/java/com/palettepal/my_backend/dto/LikeDTO.java
package com.palettepal.my_backend.dto;

public class LikeDTO {
    private Long id;
    private String videoId;
    private String mood;
    private String skillLevel;

    public LikeDTO(Long id, String videoId, String mood, String skillLevel) {
        this.id = id;
        this.videoId = videoId;
        this.mood = mood;
        this.skillLevel = skillLevel;
    }

    // Getters and setters
    public Long getId() { return id; }
    public String getVideoId() { return videoId; }
    public String getMood() { return mood; }
    public String getSkillLevel() { return skillLevel; }

    public void setId(Long id) { this.id = id; }
    public void setVideoId(String videoId) { this.videoId = videoId; }
    public void setMood(String mood) { this.mood = mood; }
    public void setSkillLevel(String skillLevel) { this.skillLevel = skillLevel; }
}
