package com.example.restaurant.management.Repository;

import com.example.restaurant.management.Entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    CartItem findByCart_IdAndFood_Id(Integer cartId, Integer foodId);
    List<CartItem> findByCart_Id(Integer cartId);

    List<CartItem> findByCart_IdInAndFood_IdIn(List<Integer> cartIds, List<Integer> foodIds);

    List<CartItem> findByCart_IdAndFood_IdIn(Integer cartId, List<Integer> foodIds);
}
