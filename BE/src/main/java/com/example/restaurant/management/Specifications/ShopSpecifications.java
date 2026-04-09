package com.example.restaurant.management.Specifications;

import com.example.restaurant.management.Entity.Categories;
import com.example.restaurant.management.Entity.Shops;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

public class ShopSpecifications {
    public static Specification<Shops> hasCategoryName(String categoryName){
        return (root, query, criteriaBuilder) -> {
            if(categoryName == null || categoryName.isEmpty()) return null;
            query.distinct(true);
            Join<Shops, Categories>  join = root.join("categories", JoinType.INNER);

            //join sang bảng categories
            return criteriaBuilder.like(criteriaBuilder.lower(join.get("name")), "%" + categoryName.toLowerCase() + "%");
        };
    }
    public static Specification<Shops> hasNameLike(String keyword){
        return ((root, query, criteriaBuilder) -> {
            if(keyword == null || keyword.isEmpty()) return null;
            return criteriaBuilder.like(criteriaBuilder.lower(root.get("shop_name")), "%"+keyword.toLowerCase()+"%");
        });
    }
}
