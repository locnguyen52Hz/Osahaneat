package com.example.restaurant.management.DTO;

import java.util.List;

public class OsrmResponse {
    private String code;
    private List<Route> routes;
    private List<Waypoint> waypoints;

    // getter, setter

    public static class Route {
        private List<Leg> legs;
        private double distance;
        private double duration;
        private String weight_name;
        private double weight;
        private Geometry geometry;

        public Geometry getGeometry() {
            return geometry;
        }

        public void setGeometry(Geometry geometry) {
            this.geometry = geometry;
        }

        public List<Leg> getLegs() {
            return legs;
        }

        public void setLegs(List<Leg> legs) {
            this.legs = legs;
        }

        public double getDistance() {
            return distance;
        }

        public void setDistance(double distance) {
            this.distance = distance;
        }

        public double getDuration() {
            return duration;
        }

        public void setDuration(double duration) {
            this.duration = duration;
        }

        public String getWeight_name() {
            return weight_name;
        }

        public void setWeight_name(String weight_name) {
            this.weight_name = weight_name;
        }

        public double getWeight() {
            return weight;
        }

        public void setWeight(double weight) {
            this.weight = weight;
        }

    }

    public static class Leg {
        private List<Object> steps; // hoặc tạo class Step nếu cần chi tiết
        private double distance;
        private double duration;
        private String summary;
        private double weight;

        public List<Object> getSteps() {
            return steps;
        }

        public void setSteps(List<Object> steps) {
            this.steps = steps;
        }

        public double getDistance() {
            return distance;
        }

        public void setDistance(double distance) {
            this.distance = distance;
        }

        public double getDuration() {
            return duration;
        }

        public void setDuration(double duration) {
            this.duration = duration;
        }

        public String getSummary() {
            return summary;
        }

        public void setSummary(String summary) {
            this.summary = summary;
        }

        public double getWeight() {
            return weight;
        }

        public void setWeight(double weight) {
            this.weight = weight;
        }
// getter, setter
    }

    public static class Waypoint {
        private String hint;
        private double distance;
        private String name;
        private List<Double> location; // [lng, lat]

        public String getHint() {
            return hint;
        }

        public void setHint(String hint) {
            this.hint = hint;
        }

        public double getDistance() {
            return distance;
        }

        public void setDistance(double distance) {
            this.distance = distance;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public List<Double> getLocation() {
            return location;
        }

        public void setLocation(List<Double> location) {
            this.location = location;
        }

    }

    public static class Geometry {
        private String type;
        private List<List<Double>> coordinates; // [[lon,lat], [lon,lat], ...]

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public List<List<Double>> getCoordinates() {
            return coordinates;
        }

        public void setCoordinates(List<List<Double>> coordinates) {
            this.coordinates = coordinates;
        }
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public List<Route> getRoutes() {
        return routes;
    }

    public void setRoutes(List<Route> routes) {
        this.routes = routes;
    }

    public List<Waypoint> getWaypoints() {
        return waypoints;
    }

    public void setWaypoints(List<Waypoint> waypoints) {
        this.waypoints = waypoints;
    }
}
