package com.example.restaurant.management.DTO;

import com.example.restaurant.management.Enums.OrdersStatus;
import com.fasterxml.jackson.annotation.JsonInclude;

import javax.xml.crypto.Data;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class OrdersDTO {
    // thông tin đơn hàng
    private Integer orderID;
    private double totalAmount;
    private String status;
    private String note;
    private Instant time;
    private String address;
    private double shippingFee;
    private double subtotal;
    private double distance;

    public OrdersDTO() {}

    public OrdersDTO(Integer orderID, double totalAmount, OrdersStatus status, String note, Instant time, String address, double shippingFee, double subtotal, double distance, Integer partnerID, String partnerName) {
        this.orderID = orderID;
        this.totalAmount = totalAmount;
        this.status = status.toString();
        this.note = note;
        this.time = time;
        this.address = address;
        this.shippingFee = shippingFee;
        this.subtotal = subtotal;
        this.distance = distance;
        this.partnerID = partnerID;
        this.partnerName = partnerName;
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


    private Integer shopID;
    //chi tiết món ăn
    private List<OrderItemDTO> foods;

    //id người nhận thông báo
    private Integer partnerID;
    private String partnerName;
    private Double partnerLatitude;
    private Double partnerLongitude;

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

    public Integer getPartnerID() {
        return partnerID;
    }

    public void setPartnerID(Integer partnerID) {
        this.partnerID = partnerID;
    }

    public String getPartnerName() {
        return partnerName;
    }

    public void setPartnerName(String partnerName) {
        this.partnerName = partnerName;
    }

    public Integer getOrderID() {
        return orderID;
    }

    public void setOrderID(Integer orderID) {
        this.orderID = orderID;
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

    public Instant getTime() {
        return time;
    }

    public void setTime(Instant time) {
        this.time = time;
    }

    public Integer getShopID() {
        return shopID;
    }

    public void setShopID(Integer shopID) {
        this.shopID = shopID;
    }


    public List<OrderItemDTO> getFoods() {
        return foods;
    }

    public void setFoods(List<OrderItemDTO> foods) {
        this.foods = foods;
    }
}
