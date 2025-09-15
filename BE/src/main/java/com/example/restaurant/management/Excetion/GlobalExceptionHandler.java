package com.example.restaurant.management.Excetion;


import com.example.restaurant.management.Payload.ResponseData;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.ArrayList;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler
    public ResponseEntity<ResponseData> handleEmailAlreadyExitsException(FieldValidationException exception) {
        ResponseData responseData = new ResponseData();
        responseData.setMessage(exception.getMessage());
        responseData.setStatus(exception.getStatus().value());
        responseData.setSuccess(false);
        List<FieldErrorMessage> errors = new ArrayList<>();
        errors.add(new FieldErrorMessage(exception.getFieldName(), exception.getMessage()));
        responseData.setErrors(errors);
        return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
    }

}
