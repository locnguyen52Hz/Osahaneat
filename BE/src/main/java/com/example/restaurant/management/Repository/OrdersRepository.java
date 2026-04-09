package com.example.restaurant.management.Repository;

import com.example.restaurant.management.DTO.OrdersDTO;
import com.example.restaurant.management.Entity.Orders;
import com.example.restaurant.management.Enums.OrdersStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdersRepository extends JpaRepository<Orders, Integer>, JpaSpecificationExecutor<Orders> {
    List<Orders> findAllByShopsId(Integer shopId);

    @Query("""
            SELECT o FROM Orders o
            WHERE (:buyerId IS NULL OR o.user.id = :buyerId)
              AND (:shopManagerId IS NULL OR o.shops.manager.id = :shopManagerId)
              AND EXISTS (
                  SELECT h FROM o.statusHistories h
                  WHERE h.status = :status AND h.endTime IS NULL
              )
            ORDER BY o.id DESC
            """)
    List<Orders> findOrdersByStatusAndRole(
            @Param("status") OrdersStatus status,
            @Param("buyerId") Integer buyerId,
            @Param("shopManagerId") Integer shopManagerId,
            PageRequest pageable
    );

    @Query("""
            SELECT new com.example.restaurant.management.DTO.OrdersDTO(
                od.id,
                od.totalAmount,
                odh.status,
                od.note,
                odh.startTime,
                od.address,
                od.shipFee,
                od.subtotal,
                od.distance,
                s.id,
                s.shopName
            )
            FROM Orders od
            JOIN od.user usr
            JOIN od.shops s
            JOIN od.statusHistories odh
            WHERE usr.id = :userID
              AND odh.endTime IS NULL
              AND odh.status = :status
            ORDER BY od.id DESC
            """)
    Page<OrdersDTO> findListOrdersByStatusForBuyer(
            @Param("status") OrdersStatus status,
            @Param("userID") Integer userId,
            Pageable pageable
    );

    Orders findOrdersByIdAndUserId(Integer ordersId, Integer userId);

    Orders findOrdersByIdAndShops_Id(int id, int shopsId);

    Orders findOrdersById(@Param("ordersId") Integer ordersId);


    @Query("""
            SELECT o
            FROM Orders o
            WHERE o.user.id = :userId
            ORDER BY o.id DESC
            """)
    Page<Orders> findOrdersByUserId(Integer userId, Pageable pageable);


    @Query("""
                SELECT new com.example.restaurant.management.DTO.OrdersDTO(
                od.id,
                od.totalAmount,
                odh.status,
                od.note,
                odh.startTime,
                od.address,
                od.shipFee,
                od.subtotal,
                od.distance,
                s.id,
                s.shopName
            )
            FROM Orders od
            JOIN od.user usr
            JOIN od.shops s
            JOIN od.statusHistories odh
            WHERE od.shops.id = :shopManagerId
              AND odh.endTime IS NULL
              AND odh.status = :status
            ORDER BY od.id DESC
            """)
    Page<OrdersDTO> findOrdersByStatusForShopManager(
            @Param("status") OrdersStatus status,
            @Param("shopManagerId") Integer shopManagerId,
            Pageable pageable
    );


    @Query("""
                SELECT new com.example.restaurant.management.DTO.OrdersDTO(
                    od.id,
                    od.totalAmount,
                    odh.status,
                    od.note,
                    odh.startTime,
                    od.address,
                    od.shipFee,
                    od.subtotal,
                    od.distance,
                    s.id,
                    s.shopName
                )
                FROM Orders od
                JOIN od.user usr
                JOIN od.shops s
                JOIN od.statusHistories odh
                WHERE usr.id = :userID
                  AND odh.endTime IS NULL
                ORDER BY od.id DESC
            """)
    Page<OrdersDTO> findListOrdersByUserId(@Param("userID") Integer userId, Pageable pageable);

}
