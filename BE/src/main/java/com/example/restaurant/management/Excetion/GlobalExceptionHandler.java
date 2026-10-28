package com.example.restaurant.management.Excetion;


import com.example.restaurant.management.Payload.ResponseData;
import jakarta.persistence.EntityNotFoundException;
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
        errors.add(new FieldErrorMessage(exception.getMessage(), exception.getFieldName()));
        responseData.setErrors(errors);
        return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ResponseData> handleMethodArgumentNotValidException(MethodArgumentNotValidException exception) {
        ResponseData responseData = new ResponseData();
        responseData.setMessage("Dữ liệu gửi lên không hợp lệ");
        responseData.setStatus(HttpStatus.BAD_REQUEST.value());
        responseData.setSuccess(false);
        List<FieldErrorMessage> errors = new ArrayList<>();
        exception.getBindingResult()
                .getFieldErrors()
                .forEach(error -> {
                    errors.add(new FieldErrorMessage(error.getDefaultMessage(), error.getField()));
                });
        responseData.setErrors(errors);
        return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ResponseData> handleEntityNotFoundException(EntityNotFoundException exception) {
        ResponseData responseData = new ResponseData();
        responseData.setMessage(exception.getMessage());
        responseData.setStatus(HttpStatus.NOT_FOUND.value());
        responseData.setSuccess(false);
        return new ResponseEntity<>(responseData, HttpStatus.NOT_FOUND);
    }

}
