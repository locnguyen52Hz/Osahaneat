package com.example.restaurant.management.Repository;

import com.example.restaurant.management.dto.DailyRevenueProjection;
import com.example.restaurant.management.dto.MonthlyRevenueProjection;
import com.example.restaurant.management.Entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RevenueRepository extends JpaRepository<Order, Integer> {

    @Query(value = """
        WITH RECURSIVE months AS (
            SELECT DATE(:startMonth) AS month_start
            UNION ALL
            SELECT DATE_ADD(month_start, INTERVAL 1 MONTH)
            FROM months
            WHERE month_start < DATE_FORMAT(CURDATE(), '%Y-%m-01')
        )
        SELECT
            DATE_FORMAT(m.month_start, '%Y-%m') AS month,
            COALESCE(SUM(o.total_amount), 0) AS totalAmount
        FROM months m
        LEFT JOIN order_status_history osh
            ON osh.start_time >= m.month_start
            AND osh.start_time < DATE_ADD(m.month_start, INTERVAL 1 MONTH)
            AND osh.status = 'COMPLETED'
        LEFT JOIN orders o
            ON osh.order_id = o.id
            AND o.shop_id = :shopId
        GROUP BY month
        ORDER BY month
    """, nativeQuery = true)
    List<MonthlyRevenueProjection> getMonthlyRevenue(@Param("shopId") Integer shopId, @Param("startMonth") String startMonth);

    @Query(value = """
        WITH RECURSIVE days AS (
            SELECT DATE(:startDate) AS day
            UNION ALL
            SELECT DATE_ADD(day, INTERVAL 1 DAY)
            FROM days
            WHERE day < CURDATE()
        )
        SELECT
            DATE_FORMAT(d.day, '%Y-%m-%d') AS day,
            COALESCE(SUM(o.total_amount), 0) AS totalAmount
        FROM days d
        LEFT JOIN restaurants_management.order_status_history osh
            ON osh.start_time >= d.day
            AND osh.start_time < DATE_ADD(d.day, INTERVAL 1 DAY)
            AND osh.status = 'COMPLETED'
        LEFT JOIN orders o
            ON osh.order_id = o.id
            AND o.shop_id = :shopId
        GROUP BY d.day
        ORDER BY d.day
    """, nativeQuery = true)
    List<DailyRevenueProjection> getDailyRevenue(@Param("shopId") Integer shopId, @Param("startDate") String startDate);


}
