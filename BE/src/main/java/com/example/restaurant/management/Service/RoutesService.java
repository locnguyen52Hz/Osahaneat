package com.example.restaurant.management.Service;

import com.example.restaurant.management.DTO.Location;
import com.example.restaurant.management.DTO.OsrmResponse;
import com.example.restaurant.management.DTO.OsrmTableResponse;
import com.example.restaurant.management.DTO.ShopDTO;
import com.example.restaurant.management.Entity.Shops;
import com.example.restaurant.management.Repository.ShopsRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class RoutesService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Autowired
    ShopsRepository shopsRepository;


    public OsrmResponse getRoutes(Location from, Location to) {
        String url = String.format(
                "http://localhost:5000/route/v1/driving/%f,%f;%f,%f?overview=full&geometries=geojson",
                from.getLongitude(), from.getLatitude(),
                to.getLongitude(), to.getLatitude()
        );

        return restTemplate.getForObject(url, OsrmResponse.class);
    }




    public OsrmTableResponse getDistance(double fromLongitude, double fromLatitude, List<ShopDTO> shops) {
        StringBuilder coordinates = new StringBuilder();

        // source (client)
        coordinates.append(fromLongitude).append(",").append(fromLatitude);

        // destinations (shops)
        for (ShopDTO shop : shops) {
            coordinates.append(";")
                    .append(shop.getLongitude())
                    .append(",")
                    .append(shop.getLatitude());
        }

        String url = String.format(
                "http://localhost:5000/table/v1/driving/%s?annotations=distance",
                coordinates.toString()
        );

        try {
            OsrmTableResponse response =
                    restTemplate.getForObject(url, OsrmTableResponse.class);

            if (response != null) {
                return response;
            } else {
                throw new RuntimeException("OSRM returned invalid response");
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch distance from OSRM: " + e.getMessage());
        }
    }




    public double getShippingFee(double fromLongitude, double fromLatitude, Integer shopID) {
        Shops shop = shopsRepository.findById(shopID).orElseThrow(()-> new EntityNotFoundException("Shop not found"));

        double distance = getDistanceToShop(fromLongitude, fromLatitude, shop.getLongitude(), shop.getLatitude());

        return calculateShipFee(distance);
    }

    public double getDistanceToShop(double fromLongitude, double fromLatitude, double toLongitude, double toLatitude){
        String url = String.format("http://localhost:5000/table/v1/driving/%f,%f;%f,%f?annotations=distance",
                fromLongitude, fromLatitude, toLongitude, toLatitude);
        try{
            OsrmTableResponse response = restTemplate.getForObject(url, OsrmTableResponse.class);
            if (response != null) {
                return response.getDistances().get(0).get(1);
            }else  {
                throw new RuntimeException("OSRM returned invalid response");
            }

        }catch (Exception e){
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch distance from OSRM: " + e.getMessage());
        }
    }

    public double calculateShipFee(double distance) {
        double perKm = 5000;
        return (distance / 1000) * perKm;
    }


}
