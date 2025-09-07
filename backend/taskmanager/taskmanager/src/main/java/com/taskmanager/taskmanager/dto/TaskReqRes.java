package com.taskmanager.taskmanager.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.taskmanager.taskmanager.entity.Task; // ✅ Correct Task import
import lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class TaskReqRes {

    private int statusCode;
    private String error;
    private String message;
    private String token;
    private String refreshToken;
    private String expirationTime;

    private long id;
    private String title;
    private String description;
    private String dueDate;
    private String priority;
    private String status;
    private String assignedTo;

    // to get the feild in the assigned feild
    private String assignedBy;

    private Task task; // ✅ Uses your entity
    private List<Task> taskList;
}
