package com.taskmanager.taskmanager.repository;


import com.taskmanager.taskmanager.entity.OurUsers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UsersRepo extends JpaRepository<OurUsers, Integer> {

    Optional<OurUsers> findByEmail(String email);


    // to get all employee names

    @Query("SELECT u.name FROM OurUsers u")
    List<String> findAllUserNames();
}




