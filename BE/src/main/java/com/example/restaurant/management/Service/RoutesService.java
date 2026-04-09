package com.example.restaurant.management.Service;

import com.example.restaurant.management.DTO.OsrmResponse;
import com.example.restaurant.management.DTO.OsrmTableResponse;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

public interface RoutesService {
    OsrmResponse getRoutes(@RequestBody double fromLongitude, double fromLatitude, double toLongitude, double toLatitude);
    double calculateShipFee(double distance);
    OsrmTableResponse getDistance (@RequestParam double fromLongitude, @RequestParam double fromLatitude, @RequestParam double toLongitude, @RequestParam double toLatitude);
    double getShippingFee(@RequestParam double fromLongitude, @RequestParam double fromLatitude, @RequestParam Integer shopId);
}
