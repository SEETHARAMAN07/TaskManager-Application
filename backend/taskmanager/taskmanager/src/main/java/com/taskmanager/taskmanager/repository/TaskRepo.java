package com.taskmanager.taskmanager.repository;

import com.taskmanager.taskmanager.entity.OurUsers;
import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.scheduling.config.Task;
import com.taskmanager.taskmanager.entity.Task;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TaskRepo extends JpaRepository<Task, Integer> {

    @Override
    Optional<Task> findById(Integer integer);

    @Query("SELECT t FROM Task t WHERE LOWER(t.assignedTo) = LOWER(:username)")
    List<Task> findByAssignedToIgnoreCase(@Param("username") String username);

    List<Task> findByAssignedTo(String email);
}
