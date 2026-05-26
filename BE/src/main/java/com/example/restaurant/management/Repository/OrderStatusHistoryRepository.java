package com.example.restaurant.management.Repository;


import com.example.restaurant.management.Entity.OrderStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderStatusHistoryRepository extends JpaRepository<OrderStatusHistory, Integer> {

    @Query("SELECT h" +
           " FROM OrderStatusHistory h" +
           " WHERE h.order.id = :orderId AND h.endTime IS NULL")
    OrderStatusHistory findCurrentStatus(@Param("orderId") Integer orderId);

    @Query("""
                SELECT h.order.id, h.status
                FROM OrderStatusHistory h
                WHERE h.endTime IS NULL
                  AND h.order.id IN :orderIds
            """)
    List<Object[]> findCurrentStatuses(@Param("orderIds") List<Integer> orderIds);

}
