package com.example.restaurant.management.Repository;

import com.example.restaurant.management.Entity.OrdersItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrdersItemRepository extends JpaRepository<OrdersItem, Integer> {
    List<OrdersItem> findByOrderId(Integer ordersId);
}
