package com.example.restaurant.management.Excetion;

import org.springframework.http.HttpStatus;

public class FieldValidationException  extends RuntimeException{
    private final String fieldName;
    private final String message;
    private final HttpStatus status;

    public FieldValidationException(String fieldName, String message,  HttpStatus status) {
        this.fieldName = fieldName;
        this.message = message;
        this.status = HttpStatus.BAD_REQUEST;
    }

    public String getFieldName() {
        return fieldName;
    }

    @Override
    public String getMessage() {
        return message;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
