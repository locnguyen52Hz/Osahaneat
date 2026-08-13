package com.example.restaurant.management.Repository;


import com.example.restaurant.management.Enums.SortBy;
import com.example.restaurant.management.Payload.Request.SearchFoodByKeywordRequest;
import com.example.restaurant.management.dto.FoodSearchDto;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class FoodRepositoryImpl implements FoodRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Page<FoodSearchDto> searchFoods(
            SearchFoodByKeywordRequest request,
            Pageable pageable
    ) {
        String sql = """
                    SELECT
                        f.id AS foodId,
                        f.food_name AS foodName,
                        f.image AS image,
                        f.description AS description,
                        f.price AS price,
                        f.shop_id AS shopId,
                        s.shop_name AS shopName,
                        s.rating_count AS ratingCount,
                        s.rating_avg AS ratingAvg,
                
                        ST_Distance_Sphere(
                            POINT(s.longitude, s.latitude),
                            POINT(:userLng, :userLat)
                        ) AS distance
                
                    FROM foods f
                    JOIN shops s ON f.shop_id = s.id
                
                    WHERE 1=1
                
                    AND (:keyword IS NULL
                        OR f.food_name LIKE CONCAT('%', :keyword, '%'))
                
                    AND (:categoryId IS NULL
                        OR f.category_id = :categoryId)
                
                    AND ST_Distance_Sphere(
                            POINT(s.longitude, s.latitude),
                            POINT(:userLng, :userLat)
                        ) <= :radiusInMeters
                """;
        String countSql = """
                    SELECT COUNT(*)
                    FROM foods f
                    JOIN shops s ON f.shop_id = s.id
                
                    WHERE 1=1
                
                    AND (:keyword IS NULL
                        OR f.food_name LIKE CONCAT('%', :keyword, '%'))
                
                    AND (:categoryId IS NULL
                        OR f.category_id = :categoryId)
                
                    AND ST_Distance_Sphere(
                            POINT(s.longitude, s.latitude),
                            POINT(:userLng, :userLat)
                        ) <= :radiusInMeters
                """;
        sql += buildOrderBy(request.getSortBy());

        Query query = entityManager.createNativeQuery(sql);
        Query countQuery = entityManager.createNativeQuery(countSql);

        bindParams(query, request);
        bindParams(countQuery, request);

        // pagination cho query data
        query.setFirstResult(
                (int) pageable.getOffset()
        );

        query.setMaxResults(
                pageable.getPageSize()
        );

        long total = ((Number) countQuery.getSingleResult()).longValue();

        List<Object[]> rows = query.getResultList();


        List<FoodSearchDto> result = rows.stream()
                .map(r -> new FoodSearchDto(
                        ((Number) r[0]).longValue(),     // foodId
                        (String) r[1],                   // foodName
                        (String) r[2],                   // image
                        (String) r[3],                   // description
                        ((Number) r[4]).doubleValue(),   // price
                        ((Number) r[5]).longValue(),     // shopId
                        (String) r[6],                   // shopName
                        ((Number) r[7]).intValue(),      // ratingCount
                        ((Number) r[8]).doubleValue(),   // ratingAvg
                        ((Number) r[9]).doubleValue()    // distance
                ))
                .toList();

        return new PageImpl<>(
                result,
                pageable,
                total
        );
    }

    private String buildOrderBy(SortBy sortBy) {

        return switch (sortBy) {

            case RATING_AVG -> " ORDER BY s.rating_avg DESC, distance ASC";

            case PRICE_ASC -> " ORDER BY f.price ASC, distance ASC";

            case PRICE_DESC -> " ORDER BY f.price DESC, distance ASC";
        };
    }

    private void bindParams(Query query, SearchFoodByKeywordRequest request) {
        query.setParameter("keyword", request.getKeyword());
        query.setParameter("userLat", request.getFromLatitude());
        query.setParameter("userLng", request.getFromLongitude());
        query.setParameter("radiusInMeters", request.getRadius());
        query.setParameter("categoryId", request.getCategoryId());


    }
}
