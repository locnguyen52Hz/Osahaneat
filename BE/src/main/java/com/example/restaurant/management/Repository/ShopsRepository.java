package com.example.restaurant.management.Repository;

import com.example.restaurant.management.dto.ShopDto;
import com.example.restaurant.management.dto.ShopLocationDto;
import com.example.restaurant.management.Entity.Shop;
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
public interface ShopsRepository extends JpaRepository<Shop, Integer>, JpaSpecificationExecutor<Shop> {
    Shop findByShopName(String shopName);


    @Query("SELECT s FROM Shop s JOIN s.categories c WHERE c.id = :categoryId")
    List<Shop> findShopsByCategoryId(@Param("categoryId") Integer categoryId, PageRequest pageRequest);

    Optional<Shop> findById(Integer id);

    Shop findShopsByManager_Id(Integer managerId);


    @Query("SELECT new com.example.restaurant.management.dto.ShopLocationDto(s.shopName, s.latitude, s.longitude, s.address, s.id) FROM Shop s")
    List<ShopLocationDto> getAllShopsLocations();

    @Query("select new com.example.restaurant.management.dto.ShopDto(s.longitude, s.latitude) " +
            "from Shop s where s.id = :shopId")
    ShopDto findShopLocationById(@Param("shopId") Integer shopId);

    List<Shop> findTop6ByOrderByIdDesc();


    @Query("""
    SELECT new com.example.restaurant.management.dto.ShopDto(
        s.id,
        s.shopName,
        s.latitude,
        s.longitude,
        s.shopImage,
        s.address,
        s.ratingAvg,
        s.ratingCount
    )
    FROM Shop s
    WHERE s.latitude BETWEEN :minLat AND :maxLat
      AND s.longitude BETWEEN :minLon AND :maxLon
    """)
    List<ShopDto> findNearbyShops(double minLat, double maxLat, double minLon, double maxLon);

    @Query("""
    SELECT new com.example.restaurant.management.dto.ShopDto(
        s.id,
        s.shopName,
        s.latitude,
        s.longitude,
        s.shopImage,
        s.address,
        s.ratingAvg,
        s.ratingCount
    )
    FROM Shop s
    ORDER BY s.ratingAvg DESC
    """)
    List<ShopDto> findTopByRating(Pageable pageable);

}
