package com.taskmanager.taskmanager.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tasks")
@Data
public class Task {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(name = "title",length = 50)
    private String title;

    @Column(name = "description",length = 250)
    private String description;

    @Column(name = "duedate",length = 50)
    private String dueDate;

    @Column(name = "priority",length = 50)
    private String priority;

    @Column(name = "status",length = 50)
    private String status;

    @Column(name = "assignedTo",length = 50)
    private String assignedTo;

    // this is add the assigned by in the feild
    @Column(name = "assignedBy", length = 50)
    private String assignedBy;

    // parameter get changed to add assigned by in the feild.
    public Task(String title, String description, String dueDate, String priority, String status, String assignedTo,String assignedBy) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.status = status;
        this.assignedTo = assignedTo;
        this.assignedBy = assignedBy;
    }

    public Task() {
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDueDate() {
        return dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }

    // to add the assigned by feild
    public String getAssignedBy() { return assignedBy; }
    public void setAssignedBy(String assignedBy) { this.assignedBy = assignedBy; }

    @Override
    public String toString() {
        return "Task{" +
                "title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", dueDate='" + dueDate + '\'' +
                ", priority='" + priority + '\'' +
                ", status='" + status + '\'' +
                ", assignedTo='" + assignedTo + '\'' +
                '}';
    }


}

