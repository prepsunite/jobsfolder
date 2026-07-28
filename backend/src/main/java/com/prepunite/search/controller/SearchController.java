package com.prepunite.search.controller;

import com.prepunite.search.dto.GlobalSearchDto;
import com.prepunite.search.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping
    public ResponseEntity<GlobalSearchDto> search(@RequestParam(name = "q", required = false) String query) {
        return ResponseEntity.ok(searchService.search(query));
    }
}
