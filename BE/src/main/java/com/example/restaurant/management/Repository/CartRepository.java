package com.example.restaurant.management.Repository;

import com.example.restaurant.management.Entity.Cart;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {
    Cart findByUser_IdAndShop_Id(Integer userId, Integer shopId);
    Cart findByUser_Id(Integer userId);



    @Query("""
            SELECT DISTINCT c
            FROM Cart c
            LEFT JOIN FETCH c.cartItems ci
            LEFT JOIN FETCH ci.food
            LEFT JOIN FETCH c.shop
            WHERE c.user.id = :userId
            ORDER BY c.updatedAt desc
            """)
    List<Cart> findAllByUserIdWithItems(Integer userId);

    List<Cart> findByUser_IdAndShop_IdIn(Integer userId, Set<Integer> shopIds);

}
