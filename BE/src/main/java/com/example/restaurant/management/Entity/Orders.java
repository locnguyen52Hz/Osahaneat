package com.example.restaurant.management.Entity;

import com.example.restaurant.management.DTO.Location;
import com.example.restaurant.management.Enums.OrdersStatus;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToMany(mappedBy = "orders", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrdersItem> orderItems;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "shop_id", nullable = false)
    private Shops shops;

    @Column(name = "address", nullable = false)
    private String address;

    // ✅ FROM LOCATION
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "latitude", column = @Column(name = "from_lat", nullable = false)),
            @AttributeOverride(name = "longitude", column = @Column(name = "from_longitude", nullable = false))
    })
    private Location fromLocation;

    // ✅ TO LOCATION
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "latitude", column = @Column(name = "to_lat", nullable = false)),
            @AttributeOverride(name = "longitude", column = @Column(name = "to_longitude", nullable = false))
    })
    private Location toLocation;

    @Column(name = "distance")
    private double distance;

    @Column(name = "note")
    private String note;

    @Column(name = "total_amount", nullable = false)
    private double totalAmount;

    @Column(name = "subtotal")
    private double subtotal;

    @Column(name = "shipping_fee")
    private double shipFee;

    @Column(name = "created_at")
    private Instant createdAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private OrdersStatus status;


    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderStatusHistory> statusHistories = new ArrayList<>();

    @Version
    private Integer version;

    // ================= GETTER / SETTER =================

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public List<OrdersItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrdersItem> orderItems) {
        this.orderItems = orderItems;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }


    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public OrdersStatus getStatus() {
        return status;
    }

    public void setStatus(OrdersStatus status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Location getFromLocation() {
        return fromLocation;
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

    public double getDistance() {
        return distance;
    }

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public Shops getShops() {
        return shops;
    }

    public void setShops(Shops shops) {
        this.shops = shops;
    }

    public void setDistance(double distance) {
        this.distance = distance;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(double subtotal) {
        this.subtotal = subtotal;
    }

    public double getShipFee() {
        return shipFee;
    }

    public void setShipFee(double shipFee) {
        this.shipFee = shipFee;
    }

    public List<OrderStatusHistory> getStatusHistories() {
        return statusHistories;
    }

    public void setStatusHistories(List<OrderStatusHistory> statusHistories) {
        this.statusHistories = statusHistories;
    }
}