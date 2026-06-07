package com.example.restaurant.management.Repository;

import com.example.restaurant.management.DTO.OrderTimeLineDTO;
import com.example.restaurant.management.DTO.OrderTimeLineRowDTO;
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
                od.createdAt,
                od.address,
                od.shipFee,
                od.subtotal,
                od.distance,
                s.id,
                s.shopName,
                s.latitude,
                s.longitude,
                r.rating
            )
            FROM Orders od
            JOIN od.user usr
            JOIN od.shops s
            JOIN od.statusHistories odh
            LEFT JOIN Rating r on r.order.id = od.id
            WHERE usr.id = :userID
              AND odh.endTime IS NULL
              AND odh.status in ('COMPLETED', 'CANCELLED')
            ORDER BY od.id DESC
            """)
    Page<OrdersDTO> findPreviousOrdersForBuyer(@Param("userID") Integer userId, Pageable pageable);

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
                od.createdAt,
                od.address,
                od.shipFee,
                od.subtotal,
                od.distance,
                usr.id,
                usr.fullName
            )
            FROM Orders od
            JOIN od.user usr
            JOIN od.shops s
            JOIN od.statusHistories odh
            WHERE od.shops.id = :shopId
              AND odh.endTime IS NULL
              AND odh.status in ('COMPLETED', 'CANCELLED')
            ORDER BY od.id DESC
            """)
    Page<OrdersDTO> findPreviousOrdersForShopManager(@Param("shopId") Integer shopId,Pageable pageable);


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

    @Query("""
            SELECT new com.example.restaurant.management.DTO.OrdersDTO(
                    od.id
                    ,od.totalAmount
                    ,odh.status
                    ,od.note
                    ,odh.startTime
                    ,od.address
                    ,od.shipFee
                    ,od.subtotal
                    ,od.distance
                    ,usr.id
                    ,usr.fullName
                )
                    FROM Shops sh
                    INNER JOIN Orders od ON sh.id = od.shops.id
                    INNER JOIN OrderStatusHistory odh ON odh.order.id = od.id
                    INNER JOIN User usr ON od.user.id = usr.id
                    WHERE
                        sh.manager.id = :managerID
                        AND odh.endTime IS NULL
                    ORDER BY od.id DESC
            """)
    Page<OrdersDTO> findListOrdersByShopsId(@Param("managerID") Integer managerID, Pageable pageable);

    @Query(
            value = """
        SELECT new com.example.restaurant.management.DTO.OrdersDTO(
            od.id,
            od.totalAmount,
            odh.status,
            odh.startTime,
            od.address,
            usr.id,
            usr.fullName,
            CAST((
                SELECT SUM(oi2.quantity)
                FROM OrdersItem oi2
                WHERE oi2.orders.id = od.id
            ) AS long)
        )
        FROM Orders od
        JOIN od.shops sh
        JOIN od.user usr
        JOIN od.statusHistories odh
        WHERE sh.manager.id = :managerID
          AND odh.endTime IS NULL
        ORDER BY od.id DESC
    """,
            countQuery = """
        SELECT COUNT(od)
        FROM Orders od
        JOIN od.shops sh
        JOIN od.statusHistories odh
        WHERE sh.manager.id = :managerID
          AND odh.endTime IS NULL
    """
    )
    Page<OrdersDTO> findOrdersWithQuantity(@Param("managerID") Integer managerID, Pageable pageable);



    @Query("""
    SELECT o.id
    FROM Orders o
    JOIN o.user u

    JOIN OrderStatusHistory currentOsh
        ON currentOsh.order.id = o.id
        AND currentOsh.endTime IS NULL

    WHERE u.id = :userId
      AND currentOsh.status NOT IN ('COMPLETED', 'CANCELLED')

    ORDER BY o.id DESC
    """)
    Page<Integer> getActiveOrderIdsByUserId(
            @Param("userId") Integer userId,
            Pageable pageable
    );


    @Query("""
    SELECT new com.example.restaurant.management.DTO.OrderTimeLineRowDTO(
        o.id,
        u.id,
        o.totalAmount,
        o.note,
        o.address,
        o.shipFee,
        o.subtotal,
        o.distance,
        s.id,
        s.shopName,
        s.address,
        o.status,
        osh.status,
        osh.startTime,
        osh.endTime,
        o.fromLocation.latitude,
        o.fromLocation.longitude,
        o.toLocation.latitude,
        o.toLocation.longitude,
        o.createdAt
    )
    FROM Orders o
    JOIN o.user u
    JOIN o.shops s
    JOIN OrderStatusHistory osh
        ON osh.order.id = o.id

    WHERE o.id IN :orderIds

    ORDER BY o.id DESC, osh.startTime ASC
""")
    List<OrderTimeLineRowDTO> getTimelineRowsByOrderIds(
            @Param("orderIds") List<Integer> orderIds
    );


}
