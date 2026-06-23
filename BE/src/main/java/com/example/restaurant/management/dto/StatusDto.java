package com.example.restaurant.management.dto;

import com.example.restaurant.management.Enums.OrdersStatus;

import java.time.Instant;

public class StatusDto {
    private OrdersStatus status;
    private Instant startTime;
    private Instant endTime;


    public StatusDto(OrdersStatus status, Instant startTime, Instant endTime) {
        this.status = status;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public OrdersStatus getStatus() {
        return status;
    }

    public void setStatus(OrdersStatus status) {
        this.status = status;
    }

    public Instant getStartTime() {
        return startTime;
    }

    public void setStartTime(Instant startTime) {
        this.startTime = startTime;
    }

    public Instant getEndTime() {
        return endTime;
    }

    public void setEndTime(Instant endTime) {
        this.endTime = endTime;
    }
}
