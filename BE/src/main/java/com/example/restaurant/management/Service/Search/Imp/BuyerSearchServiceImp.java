package com.example.restaurant.management.Service.Search.Imp;
import com.example.restaurant.management.dto.FoodDto;
import com.example.restaurant.management.dto.OsrmTableResponse;
import com.example.restaurant.management.dto.ShopDto;
import com.example.restaurant.management.Entity.Shop;
import com.example.restaurant.management.Repository.FoodRepository;
import com.example.restaurant.management.Repository.ShopsRepository;
import com.example.restaurant.management.Service.Search.SearchService;
import com.example.restaurant.management.Specifications.ShopSpecifications;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
public class BuyerSearchServiceImp implements SearchService {

    @Autowired
    ShopsRepository shopsRepository;

    private final RestTemplate restTemplate = new RestTemplate();
    @Autowired
    FoodRepository foodRepository;

    public Page<ShopDto> findShopsByCategoryWithQuantity(
            String name, double userLon, double userLat, int page) {

        if (name == null || name.isEmpty()) {
            return Page.empty(); // trả về page rỗng
        }

        Specification<Shop> spec = ShopSpecifications.hasCategoryName(name);
        Pageable pageable = PageRequest.of(page, 10);

        Page<Shop> shopsPage = shopsRepository.findAll(spec, pageable);
        List<Shop> shopList = shopsPage.getContent();

        if (shopList.isEmpty()) {
            return Page.empty(pageable);
        }

        // Ghép tọa độ user + các shop
        StringBuilder coords = new StringBuilder();
        coords.append(String.format("%f,%f", userLon, userLat));
        for (Shop shop : shopList) {
            coords.append(";").append(String.format("%f,%f", shop.getLongitude(), shop.getLatitude()));
        }

        // Gọi OSRM
        String url = String.format("http://localhost:5000/table/v1/driving/%s?annotations=distance", coords);
        OsrmTableResponse osrmTableResponse;
        try {
            ResponseEntity<String> res = restTemplate.getForEntity(url, String.class);
            if (!res.getStatusCode().is2xxSuccessful() || res.getBody() == null) {
                throw new RuntimeException("OSRM returned empty or error response: " + res.getStatusCode());
            }
            ObjectMapper mapper = new ObjectMapper();
            osrmTableResponse = mapper.readValue(res.getBody(), OsrmTableResponse.class);
        } catch (Exception e) {
            throw new RuntimeException("OSRM request failed: " + e.getMessage());
        }

        List<Double> distanceRow = osrmTableResponse.getDistances().get(0); // từ user tới shop
        if (distanceRow.size() < shopList.size() + 1) {
            throw new RuntimeException("OSRM response size mismatch");
        }

        // Map Shops -> ShopDTO
        List<ShopDto> shopDtos = new ArrayList<>();
        for (int i = 0; i < shopList.size(); i++) {
            Shop shop = shopList.get(i);
            double distanceInKm = distanceRow.get(i + 1) / 1000.0;

            ShopDto dto = new ShopDto();
            dto.setId(shop.getId());
            dto.setName(shop.getShopName());
            dto.setShopAvatar(shop.getShopImage());
            dto.setDistance(distanceInKm);
            dto.setLatitude(shop.getLatitude());
            dto.setLongitude(shop.getLongitude());

            shopDtos.add(dto);
        }

        // Trả về Page<ShopDTO> bằng cách map từ Page<Shops>
        return new PageImpl<>(
                shopDtos,
                pageable,
                shopsPage.getTotalElements() // tổng số shop
        );
    }

    public Map<String, Object> searchFoods(String name, int page) {
        Pageable pageable = PageRequest.of(page, 10);
        Page<FoodDto> result = foodRepository.searchFoodsByName(name, pageable);
        Map<String, Object> response = new HashMap<>();
        response.put("list", result.getContent());
        response.put("totalElement", result.getTotalElements());
        response.put("totalPages", result.getTotalPages());
        response.put("page",result.getNumber());
        response.put("size",result.getSize());
        return response;
    }

    public Map<String, Object> searchFoodsByCategoryName(String name, int page) {
        Pageable pageable = PageRequest.of(page, 10);
        Page<FoodDto> result = foodRepository.findFoodByCategoryName(name, pageable);
        Map<String, Object> response = new HashMap<>();
        response.put("list", result.getContent());
        response.put("totalElement", result.getTotalElements());
        response.put("totalPages", result.getTotalPages());
        response.put("page",result.getNumber());
        response.put("size",result.getSize());
        return response;
    }



}
