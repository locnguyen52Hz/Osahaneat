package com.example.restaurant.management.Service.ServiceImp;

import com.example.restaurant.management.DTO.OsrmResponse;
import com.example.restaurant.management.DTO.OsrmTableResponse;
import com.example.restaurant.management.Entity.Shops;
import com.example.restaurant.management.Repository.ShopsRepository;
import com.example.restaurant.management.Service.RoutesService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class RoutesImp implements RoutesService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Autowired
    ShopsRepository shopsRepository;

    @Override
    public OsrmResponse getRoutes(double fromLongitude, double fromLatitude, double toLongitude, double toLatitude) {
        String url = String.format(
                "http://localhost:5000/route/v1/driving/%f,%f;%f,%f?overview=full&geometries=geojson",
                fromLongitude, fromLatitude,
                toLongitude, toLatitude
        );

        return restTemplate.getForObject(url, OsrmResponse.class);
    }



    @Override
    public OsrmTableResponse getDistance(double fromLongitude, double fromLatitude, double toLongitude, double toLatitude) {
        String url = String.format(
                "http://localhost:5000/table/v1/driving/%f,%f;%f,%f?annotations=distance",
                fromLongitude, fromLatitude, toLongitude, toLatitude
        );
        try {
            OsrmTableResponse response = restTemplate.getForObject(url, OsrmTableResponse.class);
            if (response != null) {
                return response;
            } else {
                throw new RuntimeException("OSRM returned invalid response");
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch distance from OSRM: " + e.getMessage());
        }
    }

    @Override
    public double getShippingFee(double fromLongitude, double fromLatitude, Integer shopID) {
        Shops shop = shopsRepository.findById(shopID).orElseThrow(()-> new EntityNotFoundException("Shop not found"));

        double distance = getDistance2(fromLongitude, fromLatitude, shop.getLongitude(), shop.getLatitude());

        return calculateShipFee(distance);
    }

    public double getDistance2(double fromLongitude, double fromLatitude, double toLongitude, double toLatitude){
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
