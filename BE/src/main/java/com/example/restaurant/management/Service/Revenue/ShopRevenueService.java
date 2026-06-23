package com.example.restaurant.management.Service.Revenue;

import com.example.restaurant.management.dto.ChartResponse;
import com.example.restaurant.management.dto.DailyRevenueProjection;
import com.example.restaurant.management.dto.MonthlyRevenueProjection;
import com.example.restaurant.management.Entity.Shop;
import com.example.restaurant.management.Repository.RevenueRepository;
import com.example.restaurant.management.Repository.ShopsRepository;
import com.example.restaurant.management.Util.JwtHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ShopRevenueService {

    @Autowired
    JwtHelper jwtHelper;
    @Autowired
    ShopsRepository shopsRepository;
    @Autowired
    RevenueRepository revenueRepository;

    public ChartResponse getMonthlyRevenueByShop(String authHeader, String startMonth) {
        Integer userId = jwtHelper.getUserID(authHeader);
        Shop shop = shopsRepository.findShopsByManager_Id(userId);
        if (shop == null) {
            throw new RuntimeException("Shop not found");
        }
        Integer shopId = shop.getId();
        List<MonthlyRevenueProjection> result = revenueRepository.getMonthlyRevenue(shopId, startMonth);
        List<String>labels = new ArrayList<>();
        List<Double> data = new ArrayList<>();
        for (MonthlyRevenueProjection r : result) {
            labels.add(r.getMonth());
            data.add(r.getTotalAmount() != null ? r.getTotalAmount() : 0.0);
        }

        return new ChartResponse(labels, data);
    }

    public ChartResponse getDailyRevenueByShop(String authHeader, String startDate){
        Integer userId = jwtHelper.getUserID(authHeader);
        Shop shop = shopsRepository.findShopsByManager_Id(userId);
        if (shop == null) {
            throw new RuntimeException("Shop not found");
        }
        Integer shopId = shop.getId();
        List<DailyRevenueProjection> result = revenueRepository.getDailyRevenue(shopId, startDate);
        List<String>labels = new ArrayList<>();
        List<Double>data = new ArrayList<>();
        for (DailyRevenueProjection d : result) {
            labels.add(d.getDay());
            data.add(d.getTotalAmount() != null ? d.getTotalAmount() : 0.0);
        }
        return new ChartResponse(labels, data);
    }
}
