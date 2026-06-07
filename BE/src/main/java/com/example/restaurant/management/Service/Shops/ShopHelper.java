package com.example.restaurant.management.Service.Shops;

import com.example.restaurant.management.DTO.CategoryDTO;
import com.example.restaurant.management.DTO.ShopCategoryProjection;
import com.example.restaurant.management.DTO.ShopDTO;
import com.example.restaurant.management.Repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ShopHelper {

    @Autowired
    CategoryRepository categoryRepository;




    public void attachCategories(List<ShopDTO> shops) {
        if (shops.isEmpty()) {
            return;
        }

        List<Integer> shopIds = shops.stream()
                .map(ShopDTO::getId)
                .toList();

        List<ShopCategoryProjection> rows =
                categoryRepository.findCategoriesByShopIds(shopIds);

        Map<Integer, List<CategoryDTO>> categoriesByShop =
                rows.stream()
                        .collect(Collectors.groupingBy(
                                ShopCategoryProjection::getShopId,
                                Collectors.mapping(
                                        row -> new CategoryDTO(
                                                row.getCategoryId(),
                                                row.getCategoryName()
                                        ),
                                        Collectors.toList()
                                )
                        ));
        shops.forEach(shop ->
                shop.setCategories(
                        categoriesByShop.getOrDefault(
                                shop.getId(),
                                Collections.emptyList()
                        )
                )
        );
    }
}
