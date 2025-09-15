package com.example.restaurant.management.Repository;

import com.example.restaurant.management.DTO.ShopDTO;
import com.example.restaurant.management.Entity.Shops;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShopsRepository extends JpaRepository<Shops,Integer> {
    Shops findByShopName(String shopName);
    @Query("SELECT u.shop FROM User u WHERE u.id = :userId")
    Shops findShopByUserId(@Param("userId") Integer userId);

    Shops findShopsById(int shopID);

//    List<Shops> findAllShops();
    List<Shops> findTop6ByOrderByIdDesc();

}
