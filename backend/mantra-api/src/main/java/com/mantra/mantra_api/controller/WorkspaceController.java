package com.mantra.mantra_api.controller;

import com.mantra.mantra_api.entity.Workspace;
import com.mantra.mantra_api.entity.User;
import com.mantra.mantra_api.repository.WorkspaceRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/workspaces")
public class WorkspaceController {

    private final WorkspaceRepository workspaceRepository;

    public WorkspaceController(WorkspaceRepository workspaceRepository) {
        this.workspaceRepository = workspaceRepository;
    }

    private User getCurrentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof User) {
            return (User) auth.getPrincipal();
        }
        return null;
    }

    @PostMapping
    public ResponseEntity<?> createWorkspace(@RequestBody Workspace workspace) {
        User user = getCurrentUser();
        if (user != null) {
            workspace.setOwnerId(user.getId());
        }
        Workspace saved = workspaceRepository.save(workspace);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<?> listWorkspaces() {
        User user = getCurrentUser();
        if (user != null) {
            return ResponseEntity.ok(workspaceRepository.findByOwnerId(user.getId()));
        }
        return ResponseEntity.ok(workspaceRepository.findAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWorkspace(@PathVariable Long id) {
        if (!workspaceRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Workspace not found"));
        }
        workspaceRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Workspace deleted successfully"));
    }
}
