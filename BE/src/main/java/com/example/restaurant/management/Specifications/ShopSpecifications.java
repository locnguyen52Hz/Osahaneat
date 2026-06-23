package com.example.restaurant.management.Specifications;

import com.example.restaurant.management.Entity.Category;
import com.example.restaurant.management.Entity.Shop;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

public class ShopSpecifications {
    public static Specification<Shop> hasCategoryName(String categoryName){
        return (root, query, criteriaBuilder) -> {
            if(categoryName == null || categoryName.isEmpty()) return null;
            query.distinct(true);
            Join<Shop, Category>  join = root.join("categories", JoinType.INNER);

            //join sang bảng categories
            return criteriaBuilder.like(criteriaBuilder.lower(join.get("name")), "%" + categoryName.toLowerCase() + "%");
        };
    }
    public static Specification<Shop> hasNameLike(String keyword){
        return ((root, query, criteriaBuilder) -> {
            if(keyword == null || keyword.isEmpty()) return null;
            return criteriaBuilder.like(criteriaBuilder.lower(root.get("shop_name")), "%"+keyword.toLowerCase()+"%");
        });
    }
}
