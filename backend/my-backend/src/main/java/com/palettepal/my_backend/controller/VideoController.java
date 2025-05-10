package com.palettepal.my_backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.palettepal.my_backend.model.Video;
import com.palettepal.my_backend.repository.VideoRepository;

@RestController
@RequestMapping("/videos")
public class VideoController {
    
    @Autowired
    private VideoRepository videoRepository;

    // Get all videos
    @GetMapping
    public List<Video> getAllVideos() {
        return videoRepository.findAll();
    }

    // Get video by ID
    @GetMapping("/{videoId}")
    public ResponseEntity<Video> getVideoById(@PathVariable String videoId) {
        Optional<Video> video = videoRepository.findById(videoId);
        return video.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }

    // Create new video
    @PostMapping
    public ResponseEntity<Video> createVideo(@RequestBody Video video) {
        Video saved = videoRepository.save(video);
        return ResponseEntity.ok(saved);
    }
}
