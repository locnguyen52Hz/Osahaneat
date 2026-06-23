package com.example.restaurant.management.Service.Shops.Imp;

import com.example.restaurant.management.dto.Coordinate;
import com.example.restaurant.management.dto.OsrmTableResponse;
import com.example.restaurant.management.dto.ShopDto;
import com.example.restaurant.management.dto.ShopLocationDto;
import com.example.restaurant.management.Entity.Shop;
import com.example.restaurant.management.Repository.ShopsRepository;
import com.example.restaurant.management.Service.RoutesService;
import com.example.restaurant.management.Service.Shops.ShopHelper;
import com.example.restaurant.management.Service.Shops.ShopService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Comparator;
import java.util.List;

@Service
public class BuyerShopServiceImp implements ShopService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Autowired
    ShopsRepository shopsRepository;

    @Autowired
    RoutesService routesService;

    @Autowired
    ShopHelper shopHelper;

    public List<ShopDto> getNearbyShops(double userLon, double userLat, double radius) {

        // 1. Bounding box
        double deltaLat = radius / 111.0;
        double deltaLon = radius / (111.0 * Math.cos(Math.toRadians(userLat)));

        double minLat = userLat - deltaLat;
        double maxLat = userLat + deltaLat;
        double minLon = userLon - deltaLon;
        double maxLon = userLon + deltaLon;

        //2. Query DB
        List<ShopDto> shops = shopsRepository.findNearbyShops(minLat, maxLat, minLon, maxLon);
        Pageable pageable = PageRequest.of(0, 10);
        if (shops.isEmpty()) {
            shops = shopsRepository.findTopByRating(pageable);
        }

        OsrmTableResponse osrmResponse = routesService.getDistance(userLon, userLat, shops);

        if (osrmResponse == null || osrmResponse.getDistances() == null) {
            throw new RuntimeException("Invalid OSRM response");
        }
        //3 map categories
        shopHelper.attachCategories(shops);

        // 4. Map distance
        List<List<Double>> distances = osrmResponse.getDistances();
        for (int i = 0; i < shops.size(); i++) {
            shops.get(i).setDistance(distances.get(0).get(i + 1));
        }
        // 5. Sort
        shops.sort(Comparator.comparingDouble(ShopDto::getDistance));
        return shops;
    }


    public ShopDto getShopById(Integer shopId, double longitude, double latitude) {
        Shop shop = shopsRepository.findById(shopId).orElseThrow(() -> new EntityNotFoundException("Shop not found"));

        ShopDto shopDTO = new ShopDto();
        shopDTO.setName(shop.getShopName());
        shopDTO.setShopAvatar(shop.getShopImage());
        shopDTO.setId(shop.getId());
        shopDTO.setDescription(shop.getDescription());
        shopDTO.setRatingAvg(shop.getRatingAvg());
        shopDTO.setRatingCount(shop.getRatingCount());
        shopDTO.setAddress(shop.getAddress());

        double distance = routesService.getDistanceToShop(longitude, latitude, shop.getLongitude(), shop.getLatitude());
        shopDTO.setDistance(distance);
        return shopDTO;
    }


    @Override
    public List<ShopLocationDto> getAllShopLocations() {
        return shopsRepository.getAllShopsLocations();
    }



//    public List<OsrmTableResponse> getLocationsOfTop6Shops(
//            double fromLongitude,
//            double fromLatitude
//    ) {
//        List<ShopDTO> shops = shopsRepository.findTop6ShopsLocation();
//
//        // Gọi OSRM
//        OsrmTableResponse tableResponse =
//                routesService.getDistance(fromLongitude, fromLatitude, shops);
//
//        List<OsrmTableResponse> result = new ArrayList<>();
//
//        if (tableResponse.getDistances() == null || tableResponse.getDistances().isEmpty()) {
//            return result;
//        }
//
//        List<Double> distancesRow = tableResponse.getDistances().get(0);
//
//        for (int i = 0; i < shops.size(); i++) {
//            ShopDTO shop = shops.get(i);
//
//            OsrmTableResponse item = new OsrmTableResponse();
//            item.setShopId(shop.getId());
//
//            // index 0 là source → shop bắt đầu từ index 1
//            if (i + 1 < distancesRow.size()) {
//                double distanceKm = distancesRow.get(i + 1) / 1000;
//                item.setDistance(distanceKm);
//            } else {
//                item.setDistance(null);
//            }
//
//            result.add(item);
//        }
//
//        return result;
//    }


    public List<Double> getDistances(
            double fromLng,
            double fromLat,
            List<Coordinate> destinations
    ) {
        StringBuilder coordinates = new StringBuilder();
        coordinates.append(fromLng).append(",").append(fromLat);

        for (Coordinate d : destinations) {
            coordinates.append(";")
                    .append(d.getLongitude())
                    .append(",")
                    .append(d.getLatitude());
        }

        String url = String.format("http://localhost:5000/table/v1/driving/%s?annotations=distance", coordinates);

        try {
            OsrmTableResponse response = restTemplate.getForObject(url, OsrmTableResponse.class);

            if (response == null || response.getDistances() == null) {
                throw new RuntimeException("Invalid OSRM response");
            }

            return response.getDistances().get(0);

        } catch (Exception e) {
            throw new RuntimeException("OSRM failed", e);
        }
    }


}
