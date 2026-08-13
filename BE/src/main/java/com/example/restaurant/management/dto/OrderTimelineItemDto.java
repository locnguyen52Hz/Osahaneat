package com.example.restaurant.management.dto;

import com.example.restaurant.management.Enums.OrdersStatus;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class OrderTimelineItemDto {
    private OrdersStatus status;
    private Instant startTime;
    private Instant endTime;
    private OrdersStatus cancelledFrom;

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

    public OrdersStatus getCancelledFrom() {
        return cancelledFrom;
    }

    public void setCancelledFrom(OrdersStatus cancelledFrom) {
        this.cancelledFrom = cancelledFrom;
    }
}
