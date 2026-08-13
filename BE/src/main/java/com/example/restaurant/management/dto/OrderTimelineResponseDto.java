package com.example.restaurant.management.dto;

import com.example.restaurant.management.Enums.OrdersStatus;

import java.util.List;

public class OrderTimelineResponseDto {
    private OrdersStatus currentStatus;
    private List<OrderTimelineItemDto> statuses;

    public OrdersStatus getCurrentStatus() {
        return currentStatus;
    }

    public void setCurrentStatus(OrdersStatus currentStatus) {
        this.currentStatus = currentStatus;
    }

    public List<OrderTimelineItemDto> getStatuses() {
        return statuses;
    }

    public void setStatuses(List<OrderTimelineItemDto> statuses) {
        this.statuses = statuses;
    }
}
