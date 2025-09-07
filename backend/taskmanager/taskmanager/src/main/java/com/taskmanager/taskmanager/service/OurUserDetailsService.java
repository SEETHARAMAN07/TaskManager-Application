package com.taskmanager.taskmanager.service;


import com.taskmanager.taskmanager.repository.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


// this is used to fetch the datas
// this is called by daoauthentication provider
@Service
public class OurUserDetailsService implements UserDetailsService {

    @Autowired
    private UsersRepo usersRepo;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // fetch user from the database
        return usersRepo.findByEmail(username).orElseThrow();
    }
}
