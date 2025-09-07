package com.taskmanager.taskmanager.service;

import com.taskmanager.taskmanager.dto.ReqRes;
import com.taskmanager.taskmanager.dto.TaskReqRes;
import com.taskmanager.taskmanager.entity.OurUsers;
import com.taskmanager.taskmanager.entity.Task;
import com.taskmanager.taskmanager.repository.TaskRepo;
import com.taskmanager.taskmanager.repository.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
public class UsersManagementService {

    @Autowired
    private UsersRepo usersRepo;
    @Autowired
    private JWTUtils jwtUtils;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private TaskRepo taskRepo;


//    public ReqRes register(ReqRes registrationRequest){
//        ReqRes resp = new ReqRes();
//
//        try {
//            OurUsers ourUser = new OurUsers();
//            ourUser.setEmail(registrationRequest.getEmail());
//            ourUser.setName(registrationRequest.getName());
//            ourUser.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
//
//            // Set default role and status
//            ourUser.setRole("USER");
//            ourUser.setStatus("PENDING");
//
//            OurUsers ourUsersResult = usersRepo.save(ourUser);
//
//            if (ourUsersResult.getId() > 0) {
//                resp.setOurUsers(ourUsersResult);
//                resp.setMessage("User Saved Successfully");
//                resp.setStatusCode(200);
//            }
//
//        } catch (Exception e) {
//            resp.setStatusCode(500);
//            resp.setError(e.getMessage());
//        }
//        return resp;
//    }
    // this register is to check the alredy register user
public ReqRes register(ReqRes registrationRequest) {
    ReqRes resp = new ReqRes();

    try {
        // Check if email already exists
        Optional<OurUsers> existingUser = usersRepo.findByEmail(registrationRequest.getEmail());
        if (existingUser.isPresent()) {
            resp.setStatusCode(400);
            resp.setMessage("Email already exists. Unable to register.");
            return resp;
        }

        OurUsers ourUser = new OurUsers();
        ourUser.setEmail(registrationRequest.getEmail());
        ourUser.setName(registrationRequest.getName());
        ourUser.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));

        // Set default role and status
        ourUser.setRole("USER");
        ourUser.setStatus("PENDING");

        OurUsers ourUsersResult = usersRepo.save(ourUser);

        if (ourUsersResult.getId() > 0) {
            resp.setOurUsers(ourUsersResult);
            resp.setMessage("User Saved Successfully");
            resp.setStatusCode(200);
        }

    } catch (Exception e) {
        resp.setStatusCode(500);
        resp.setError(e.getMessage());
    }
    return resp;
}


    // authentication manager is to check the credentials is correct return authcation object else error
public ReqRes login(ReqRes loginRequest) {
    ReqRes response = new ReqRes();
    try {
        // Fetch user from DB
        var user = usersRepo.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user is approved
        if (!"APPROVED".equalsIgnoreCase(user.getStatus())) {
            response.setStatusCode(403);
            response.setMessage("Your account is not approved by the admin.");
            return response;
        }

        // Authenticate credentials
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        // Generate tokens
        var jwt = jwtUtils.generateToken(user);
        var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);

        // Set response
        response.setStatusCode(200);
        response.setToken(jwt);
        response.setRole(user.getRole());
        response.setStatus(user.getStatus()); // Optional, for frontend
        response.setRefreshToken(refreshToken);
        response.setExpirationTime("24Hrs");
        response.setMessage("Successfully Logged In");

    } catch (Exception e) {
        response.setStatusCode(500);
        response.setMessage(e.getMessage());
    }
    return response;
}






    public ReqRes refreshToken(ReqRes refreshTokenReqiest){
        ReqRes response = new ReqRes();
        try{
            String ourEmail = jwtUtils.extractUsername(refreshTokenReqiest.getToken());
            OurUsers users = usersRepo.findByEmail(ourEmail).orElseThrow();
            if (jwtUtils.isTokenValid(refreshTokenReqiest.getToken(), users)) {
                var jwt = jwtUtils.generateToken(users);
                response.setStatusCode(200);
                response.setToken(jwt);
                response.setRefreshToken(refreshTokenReqiest.getToken());
                response.setExpirationTime("24Hr");
                response.setMessage("Successfully Refreshed Token");
            }
            response.setStatusCode(200);
            return response;

        }catch (Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
            return response;
        }
    }


    public ReqRes getAllUsers() {
        ReqRes reqRes = new ReqRes();

        try {
            List<OurUsers> result = usersRepo.findAll();
            if (!result.isEmpty()) {
                reqRes.setOurUsersList(result);
                reqRes.setStatusCode(200);
                reqRes.setMessage("Successful");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("No users found");
            }
            return reqRes;
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred: " + e.getMessage());
            return reqRes;
        }
    }


    public ReqRes getUsersById(Integer id) {
        ReqRes reqRes = new ReqRes();
        try {
            OurUsers usersById = usersRepo.findById(id).orElseThrow(() -> new RuntimeException("User Not found"));
            reqRes.setOurUsers(usersById);
            reqRes.setStatusCode(200);
            reqRes.setMessage("Users with id '" + id + "' found successfully");
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred: " + e.getMessage());
        }
        return reqRes;
    }


    public ReqRes deleteUser(Integer userId) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> userOptional = usersRepo.findById(userId);
            if (userOptional.isPresent()) {
                usersRepo.deleteById(userId);
                reqRes.setStatusCode(200);
                reqRes.setMessage("User deleted successfully");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for deletion");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while deleting user: " + e.getMessage());
        }
        return reqRes;
    }

    public ReqRes updateUser(Integer userId, OurUsers updatedUser) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> userOptional = usersRepo.findById(userId);
            if (userOptional.isPresent()) {
                OurUsers existingUser = userOptional.get();
                existingUser.setEmail(updatedUser.getEmail());
                existingUser.setName(updatedUser.getName());
                existingUser.setCity(updatedUser.getCity());
                existingUser.setRole(updatedUser.getRole());

                // Check if password is present in the request
                if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                    // Encode the password and update it
                    existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
                }

                OurUsers savedUser = usersRepo.save(existingUser);
                reqRes.setOurUsers(savedUser);
                reqRes.setStatusCode(200);
                reqRes.setMessage("User updated successfully");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for update");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while updating user: " + e.getMessage());
        }
        return reqRes;
    }


    public ReqRes getMyInfo(String email){
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> userOptional = usersRepo.findByEmail(email);
            if (userOptional.isPresent()) {
                reqRes.setOurUsers(userOptional.get());
                reqRes.setStatusCode(200);
                reqRes.setMessage("successful");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for update");
            }

        }catch (Exception e){
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while getting user info: " + e.getMessage());
        }
        return reqRes;

    }



    // to implement the posttask


    public TaskReqRes posttask(TaskReqRes registrationRequest){
        TaskReqRes resp = new TaskReqRes();

        try {
            Task task = new Task();
            task.setTitle(registrationRequest.getTitle());
            task.setDescription(registrationRequest.getDescription());
            task.setDueDate(registrationRequest.getDueDate());
            task.setPriority(registrationRequest.getPriority());
            task.setStatus(registrationRequest.getStatus());
            task.setAssignedTo(registrationRequest.getAssignedTo());
            // to add the assigned by in the feild
            task.setAssignedBy(registrationRequest.getAssignedBy());
            Task posttask = taskRepo.save(task);
            if (posttask.getId()>0) {
                resp.setTask((posttask));
                resp.setMessage("post Saved Successfully");
                resp.setStatusCode(200);
            }

        }catch (Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }


    public List<String> getAllUserNames() {
        return usersRepo.findAllUserNames();
    }

    public List<Task> getAllTasks() {
        return taskRepo.findAll();
    }


    //to delete tasks
    public boolean deleteTask(Long id) {
        if (taskRepo.existsById(Math.toIntExact(id))) {
            taskRepo.deleteById(Math.toIntExact(id));
            return true;
        }
        return false;
    }

    // to update the tasks by clicking the edit button in admin

    public String updateTask(TaskReqRes taskReqRes) {
        Optional<Task> optionalTask = taskRepo.findById(Math.toIntExact(taskReqRes.getId()));

        if (optionalTask.isPresent()) {
            Task task = optionalTask.get();
            task.setTitle(taskReqRes.getTitle());
            task.setDescription(taskReqRes.getDescription());
            task.setDueDate(taskReqRes.getDueDate());
            task.setPriority(taskReqRes.getPriority());
            task.setStatus(taskReqRes.getStatus());
            task.setAssignedTo(taskReqRes.getAssignedTo());

            taskRepo.save(task);
            return "Task updated successfully!";
        } else {
            return "Task not found!";
        }
    }


    // to get the respective tasks by their by username of the employee

    public List<Task> getTasksByUsername(String username) {
        System.out.println("Looking up tasks for assignedTo: " + username);
        return taskRepo.findByAssignedToIgnoreCase(username.trim());
    }

    // to update the status by employee

    public String updateTaskStatus(int id, String newStatus) {
        Optional<Task> optionalTask = taskRepo.findById((int) id); // Cast int to long here
        if (optionalTask.isPresent()) {
            Task task = optionalTask.get();
            task.setStatus(newStatus);
            taskRepo.save(task);
            return "Status updated successfully!";
        } else {
            return "Task not found!";
        }
    }


    // to update the status of the user
    public boolean updateUserStatus(Integer id, String newStatus) {
        Optional<OurUsers> optionalUser = usersRepo.findById(id);
        if (optionalUser.isPresent()) {
            OurUsers user = optionalUser.get();
            user.setStatus(newStatus);
            usersRepo.save(user);
            return true;
        }
        return false;
    }

}
