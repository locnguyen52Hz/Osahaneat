package com.example.restaurant.management.Repository;

import com.example.restaurant.management.DTO.OrdersDTO;
import com.example.restaurant.management.Entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdersRepository extends JpaRepository<Orders, Integer> {
    List<Orders> findAllByShopId(Integer shopId);

    @Query(value = "select  * from orders where  user_id = :userId  and status = 'PENDING' order by created_date desc ", nativeQuery = true)
    List<Orders> findPendingConfirmationOrders(@Param("userId") Integer userId);
}
