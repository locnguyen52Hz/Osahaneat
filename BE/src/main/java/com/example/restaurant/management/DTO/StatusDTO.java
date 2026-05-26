package com.example.restaurant.management.DTO;

import com.example.restaurant.management.Enums.OrdersStatus;

import java.time.Instant;

public class StatusDTO {
    private OrdersStatus status;
    private Instant startTime;
    private Instant endTime;


    public StatusDTO(OrdersStatus status, Instant startTime, Instant endTime) {
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
