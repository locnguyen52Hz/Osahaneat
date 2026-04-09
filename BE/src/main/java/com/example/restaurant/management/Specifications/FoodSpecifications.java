package com.example.restaurant.management.Specifications;

import com.example.restaurant.management.Entity.Food;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;


public class FoodSpecifications {
    public static Specification<Food> hasName(String name) {
        return ((root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if(name != null && name.isEmpty()){
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("food_name")), "%"+name.toLowerCase()+"%"));
            }
            predicates.add(criteriaBuilder.isFalse(root.get("deleted")));
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        });

    }
}
