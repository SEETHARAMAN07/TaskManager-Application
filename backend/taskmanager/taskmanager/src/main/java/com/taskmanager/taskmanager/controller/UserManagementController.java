package com.taskmanager.taskmanager.controller;

import com.taskmanager.taskmanager.dto.ReqRes;
import com.taskmanager.taskmanager.dto.TaskReqRes;
import com.taskmanager.taskmanager.entity.OurUsers;
import com.taskmanager.taskmanager.entity.Task;
import com.taskmanager.taskmanager.service.UsersManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class UserManagementController {
    @Autowired
    private UsersManagementService usersManagementService;

    @PostMapping("/auth/register")
    public ResponseEntity<ReqRes> register(@RequestBody ReqRes reg){
        return ResponseEntity.ok(usersManagementService.register(reg));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<ReqRes> login(@RequestBody ReqRes req){
        return ResponseEntity.ok(usersManagementService.login(req));
    }

    @PostMapping("/auth/refresh")
    public ResponseEntity<ReqRes> refreshToken(@RequestBody ReqRes req){
        return ResponseEntity.ok(usersManagementService.refreshToken(req));
    }


    @GetMapping("/admin/get-all-users")
    public ResponseEntity<ReqRes> getAllUsers(){
        return ResponseEntity.ok(usersManagementService.getAllUsers());

    }

    @GetMapping("/admin/get-users/{userId}")
    public ResponseEntity<ReqRes> getUSerByID(@PathVariable Integer userId){
        return ResponseEntity.ok(usersManagementService.getUsersById(userId));

    }

    @PutMapping("/admin/update/{userId}")
    public ResponseEntity<ReqRes> updateUser(@PathVariable Integer userId, @RequestBody OurUsers reqres){
        return ResponseEntity.ok(usersManagementService.updateUser(userId, reqres));
    }

    @GetMapping("/adminuser/get-profile")
    public ResponseEntity<ReqRes> getMyProfile(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        ReqRes response = usersManagementService.getMyInfo(email);
        return  ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/admin/delete/{userId}")
    public ResponseEntity<ReqRes> deleteUSer(@PathVariable Integer userId){
        return ResponseEntity.ok(usersManagementService.deleteUser(userId));
    }

//////////////////////////////// to do tasks ///////////////////////
    // to implemet tasks to save in the table

    // below url i added both user and the admin can user this for posttask
//    @PostMapping("/admin/posttask")
    @PostMapping({"/admin/posttask", "/user/posttask"}) // for both
    public ResponseEntity<TaskReqRes> postTask(@RequestBody TaskReqRes taskReqRes)
    {
        return ResponseEntity.ok(usersManagementService.posttask(taskReqRes));
    }

    // to get usernames
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/admin/getusernames")
    public List<String> getAllEmployeeNames() {
        return usersManagementService.getAllUserNames();
    }


    @GetMapping("/admin/tasks")
    public List<Task> getTasks() {
        return usersManagementService.getAllTasks();
    }

    // to delete tasks

//    @DeleteMapping("/admin/deleteTask/{id}")
    // for both users and the admin can delete the tasks
    @DeleteMapping({"/admin/deleteTask/{id}", "/user/deletetask/{id}"})
    public ResponseEntity<String> deleteTask(@PathVariable Long id) {
        boolean isDeleted = usersManagementService.deleteTask(id);
        if (isDeleted) {
            return ResponseEntity.ok("Task deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");
        }
    }

// to update the tasks by the admin

    @PutMapping("/admin/updateTask/{id}")
    public ResponseEntity<String> updateTask(@PathVariable Long id, @RequestBody TaskReqRes taskReqRes) {
        taskReqRes.setId(id); // Set the id from URL into DTO manually
        String result = usersManagementService.updateTask(taskReqRes);
        if (result.equals("Task updated successfully!")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
        }
    }


    // to get respective tasks of the employee by username

    @GetMapping("/user/employee/{username}")
    public List<Task> getTasksByEmployee(@PathVariable String username) {
        System.out.println("Fetching tasks for username: " + username);  // Debugging log
        List<Task> tasks = usersManagementService.getTasksByUsername(username);
        return tasks;
    }


    //to update status by the employee

    @PutMapping("/user/updatestatus/{id}")
    public ResponseEntity<String> updateTaskStatus(@PathVariable int id, @RequestBody Map<String, String> request) {
        String newStatus = request.get("status");
        String result = usersManagementService.updateTaskStatus(id, newStatus);
        if (result.equals("Status updated successfully!")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
        }
    }

//to update the user status


    @PutMapping("/admin/updateuserstatus/{id}")
    public ResponseEntity<String> updateStatus(@PathVariable Integer id, @RequestBody Map<String, String> payload) {
        String newStatus = payload.get("status");
        boolean result = usersManagementService.updateUserStatus(id, newStatus);

        if (result) {
            return ResponseEntity.ok("Status updated successfully");
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }








}
