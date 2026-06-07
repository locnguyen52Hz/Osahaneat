package com.example.restaurant.management.Repository;

import com.example.restaurant.management.Entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface RatingRepository extends JpaRepository<Rating, Integer> {
    boolean existsRatingByOrder_Id(Integer orderId);
}
