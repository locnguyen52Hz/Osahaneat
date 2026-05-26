package com.example.restaurant.management.DTO;

import java.util.List;

public class ChartResponse {
    private List<String> labels;
    private List<Double> data;

    public ChartResponse(List<String> labels, List<Double> data) {
        this.labels = labels;
        this.data = data;
    }

    public List<String> getLabels() {
        return labels;
    }

    public List<Double> getData() {
        return data;
    }
}
