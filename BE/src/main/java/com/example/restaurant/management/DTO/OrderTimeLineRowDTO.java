package com.example.restaurant.management.DTO;

import com.example.restaurant.management.Enums.OrdersStatus;

import java.time.Instant;


public class OrderTimeLineRowDTO {
    // o.id
    private Integer orderId;

    // osh.status
    private OrdersStatus ohsStatus;

    private OrdersStatus currentStatus;

    // osh.start_time
    private Instant startTime;

    // osh.end_time
    private Instant endTime;

    // u.id as userId
    private Integer userId;

    // osh.order_id
    private Integer oshOrderId;

    // o.total_amount
    private double totalAmount;

    // o.note
    private String note;

    // o.address
    private String address;

    // o.shipping_fee
    private double shippingFee;

    // o.subtotal
    private double subtotal;

    // o.distance
    private Double distance;

    // s.id
    private Integer shopId;

    // s.shop_name
    private String shopName;

    private String shopAddress;
    private Location fromLocation;
    private Location toLocation;
    private Instant createdAt;

    public OrderTimeLineRowDTO(Integer orderId,
                               Integer userId,
                               double totalAmount,
                               String note,
                               String address,
                               double shippingFee,
                               double subtotal,
                               double distance,
                               Integer shopId,
                               String shopName,
                               String shopAddress,
                               OrdersStatus currentStatus,
                               OrdersStatus ohsStatus,
                               Instant startTime,
                               Instant endTime,
                               double fromLatitude,
                               double fromLongitude,
                               double toLatitude,
                               double toLongitude,
                               Instant createdAt
    ) {
        this.orderId = orderId;
        this.userId = userId;
        this.totalAmount = totalAmount;
        this.note = note;
        this.address = address;
        this.shippingFee = shippingFee;
        this.subtotal = subtotal;
        this.distance = distance;
        this.shopId = shopId;
        this.shopName = shopName;
        this.shopAddress = shopAddress;
        this.currentStatus = currentStatus;
        this.startTime = startTime;
        this.endTime = endTime;
        this.fromLocation = new Location( fromLongitude,fromLatitude);
        this.toLocation = new Location(toLongitude,toLatitude);
        this.createdAt = createdAt;
        this.ohsStatus = ohsStatus;
    }

    public Integer getOrderId() {
        return orderId;
    }

    public void setOrderId(Integer orderId) {
        this.orderId = orderId;
    }


    public Instant getStartTime() {
        return startTime;
    }

    public void setStartTime(Instant startTime) {
        this.startTime = startTime;
    }

    public Instant getEndTime() {
        return endTime;
    }

    public void setEndTime(Instant endTime) {
        this.endTime = endTime;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getOshOrderId() {
        return oshOrderId;
    }

    public void setOshOrderId(Integer oshOrderId) {
        this.oshOrderId = oshOrderId;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
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

    public Double getDistance() {
        return distance;
    }

    public void setDistance(Double distance) {
        this.distance = distance;
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


    public String getShopAddress() {
        return shopAddress;
    }

    public OrdersStatus getOhsStatus() {
        return ohsStatus;
    }

    public void setOhsStatus(OrdersStatus ohsStatus) {
        this.ohsStatus = ohsStatus;
    }

    public OrdersStatus getCurrentStatus() {
        return currentStatus;
    }

    public void setCurrentStatus(OrdersStatus currentStatus) {
        this.currentStatus = currentStatus;
    }

    public Location getFromLocation() {
        return fromLocation;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public void setFromLocation(Location fromLocation) {
        this.fromLocation = fromLocation;
    }

    public Location getToLocation() {
        return toLocation;
    }

    public void setToLocation(Location toLocation) {
        this.toLocation = toLocation;
    }

    public void setShopAddress(String shopAddress) {
        this.shopAddress = shopAddress;
    }
}
