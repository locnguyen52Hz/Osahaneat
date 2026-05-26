package com.example.restaurant.management.Repository;

import com.example.restaurant.management.DTO.OrdersDTO;
import com.example.restaurant.management.DTO.ShopDTO;
import com.example.restaurant.management.DTO.ShopLocationDTO;
import com.example.restaurant.management.Entity.Shops;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShopsRepository extends JpaRepository<Shops, Integer>, JpaSpecificationExecutor<Shops> {
    Shops findByShopName(String shopName);


    @Query("SELECT s FROM Shops s JOIN s.categories c WHERE c.id = :categoryId")
    List<Shops> findShopsByCategoryId(@Param("categoryId") Integer categoryId, PageRequest pageRequest);

    Optional<Shops> findById(Integer id);

    Shops findShopsByManager_Id(Integer managerId);


    @Query("SELECT new com.example.restaurant.management.DTO.ShopLocationDTO(s.shopName, s.latitude, s.longitude, s.address, s.id) FROM Shops s")
    List<ShopLocationDTO> getAllShopsLocations();

    @Query("select new com.example.restaurant.management.DTO.ShopDTO(s.longitude, s.latitude) " +
            "from Shops s where s.id = :shopId")
    ShopDTO findShopLocationById(@Param("shopId") Integer shopId);

    List<Shops> findTop6ByOrderByIdDesc();


    @Query(value = "SELECT id AS id, longitude AS longitude, latitude AS latitude FROM shops ORDER BY id DESC", nativeQuery = true)
    List<ShopDTO> findTop6ShopsLocation();


}
