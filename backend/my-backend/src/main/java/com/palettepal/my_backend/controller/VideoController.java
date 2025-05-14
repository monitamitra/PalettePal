package com.palettepal.my_backend.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.palettepal.my_backend.model.Like;
import com.palettepal.my_backend.model.Video;
import com.palettepal.my_backend.repository.LikeRepository;
import com.palettepal.my_backend.repository.VideoRepository;
import com.palettepal.my_backend.security.UserPrincipal;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/videos")
public class VideoController {
    
    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private LikeRepository likeRepository;

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

    @GetMapping("/liked")
    public List<Video> getLikedVideos(@AuthenticationPrincipal UserPrincipal 
        userPrincipal) {

        List<Like> likes = likeRepository.findByUserId(userPrincipal.getId());
        List<String> videoIds = new ArrayList<>();
        for (Like like : likes) {
            videoIds.add(like.getVideoId());
        }

        return videoRepository.findAllById(videoIds);
    }

    @GetMapping("/search")
    public List<Video> searchVideos(@RequestParam String query) {
        return videoRepository.searchByQuery(query);
    }

}
