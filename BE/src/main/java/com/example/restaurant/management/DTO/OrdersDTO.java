package com.example.restaurant.management.DTO;

import com.example.restaurant.management.Enums.OrdersStatus;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class OrdersDTO {
    // thông tin đơn hàng
    private Integer orderId;
    private double totalAmount;
    private String status;
    private String note;
    private Instant createdAt;
    private String address;
    private double shippingFee;
    private double subtotal;
    private double distance;
    private Long totalQuantity;
    private double latitude;
    private double longitude;
    private Integer rating;


    //id người nhận thông báo
    private Integer partnerId;
    private String partnerName;
    private Double partnerLatitude;
    private Double partnerLongitude;
    private Integer shopId;
    private String shopName;

    private List<OrderItemDTO> foods;

    public OrdersDTO() {
    }

    public OrdersDTO(Integer orderId, double totalAmount, OrdersStatus status,
                     String note, Instant createdAt, String address, double shippingFee,
                     double subtotal, double distance, Integer shopId, String shopName, double latitude, double longitude,
                     Integer rating
                     ) {
        this.orderId = orderId;
        this.totalAmount = totalAmount;
        this.status = status.toString();
        this.note = note;
        this.createdAt = createdAt;
        this.address = address;
        this.shippingFee = shippingFee;
        this.subtotal = subtotal;
        this.distance = distance;
        this.shopId = shopId;
        this.shopName = shopName;
        this.latitude = latitude;
        this.longitude = longitude;
        this.rating = rating;
    }


    public OrdersDTO(Integer orderId, double totalAmount, OrdersStatus status,
                     String note, Instant createdAt, String address, double shippingFee,
                     double subtotal, double distance, Integer partnerId, String partnerName) {
        this.orderId = orderId;
        this.totalAmount = totalAmount;
        this.status = status.toString();
        this.note = note;
        this.createdAt = createdAt;
        this.address = address;
        this.shippingFee = shippingFee;
        this.subtotal = subtotal;
        this.distance = distance;
        this.partnerId = partnerId;
        this.partnerName = partnerName;
    }

    public OrdersDTO(Integer orderId, double totalAmount, OrdersStatus status,
                     Instant createdAt, String address, Integer partnerId,
                     String partnerName, Long totalQuantity) {
        this.orderId = orderId;
        this.totalAmount = totalAmount;
        this.status = status.toString();
        this.createdAt = createdAt;
        this.address = address;
        this.partnerId = partnerId;
        this.partnerName = partnerName;
        this.totalQuantity = totalQuantity;
    }


    public double getShippingFee() {
        return shippingFee;
    }

    public void setShippingFee(double shippingFee) {
        this.shippingFee = shippingFee;
    }

    public double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(double subtotal) {
        this.subtotal = subtotal;
    }

    public double getDistance() {
        return distance;
    }

    public void setDistance(double distance) {
        this.distance = distance;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }


    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public Double getPartnerLatitude() {
        return partnerLatitude;
    }

    public void setPartnerLatitude(Double partnerLatitude) {
        this.partnerLatitude = partnerLatitude;
    }

    public Double getPartnerLongitude() {
        return partnerLongitude;
    }

    public void setPartnerLongitude(Double partnerLongitude) {
        this.partnerLongitude = partnerLongitude;
    }

    public Integer getOrderId() {
        return orderId;
    }

    public void setOrderId(Integer orderId) {
        this.orderId = orderId;
    }

    public Integer getPartnerId() {
        return partnerId;
    }

    public void setPartnerId(Integer partnerId) {
        this.partnerId = partnerId;
    }

    public String getPartnerName() {
        return partnerName;
    }

    public void setPartnerName(String partnerName) {
        this.partnerName = partnerName;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }


    public Integer getShopId() {
        return shopId;
    }

    public void setShopId(Integer shopId) {
        this.shopId = shopId;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public Long getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(Long totalQuantity) {
        this.totalQuantity = totalQuantity;
    }

    public List<OrderItemDTO> getFoods() {
        return foods;
    }

    public void setFoods(List<OrderItemDTO> foods) {
        this.foods = foods;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }
}
