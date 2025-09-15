package com.example.restaurant.management.Payload;

import com.example.restaurant.management.Excetion.FieldErrorMessage;

import java.util.List;

public class ResponseData {
    private int status;
    private String message;
    private Object data;
    private String token;
    private boolean success;
    private List<FieldErrorMessage> errors;

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public List<FieldErrorMessage> getErrors() {
        return errors;
    }

    public void setErrors(List<FieldErrorMessage> errors) {
        this.errors = errors;
    }
}
