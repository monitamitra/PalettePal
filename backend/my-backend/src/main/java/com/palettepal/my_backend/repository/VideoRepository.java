package com.palettepal.my_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.palettepal.my_backend.model.Video;

public interface VideoRepository extends JpaRepository<Video, String> {
    @Query("SELECT v FROM Video v WHERE LOWER(v.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(v.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Video> searchByQuery(@Param("query") String query);

}
