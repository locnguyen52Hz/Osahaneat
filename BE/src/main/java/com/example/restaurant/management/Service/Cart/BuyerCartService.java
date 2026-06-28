package com.example.restaurant.management.Service.Cart;

import com.example.restaurant.management.Entity.*;
import com.example.restaurant.management.Payload.Request.AddToCartRequest;
import com.example.restaurant.management.Payload.Request.CartItemRequest;
import com.example.restaurant.management.Payload.Request.CartRequest;
import com.example.restaurant.management.Payload.Request.SyncCartRequest;
import com.example.restaurant.management.Repository.*;
import com.example.restaurant.management.Util.JwtHelper;
import com.example.restaurant.management.dto.AddToCartResponseDto;
import com.example.restaurant.management.dto.CartDto;
import com.example.restaurant.management.dto.CartItemResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;


@Service
public class BuyerCartService {

    @Autowired
    CartRepository cartRepository;

    @Autowired
    CartItemRepository cartItemRepository;

    @Autowired
    JwtHelper jwtHelper;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ShopsRepository shopsRepository;

    @Autowired
    FoodRepository foodRepository;

    @Transactional
    public AddToCartResponseDto addItemToCart(String authHeader, AddToCartRequest request) {

        Integer userId = jwtHelper.getUserID(authHeader);

        User user = userRepository.findById(userId).orElseThrow();

        // Validate request rỗng
        if (request.getCartItems() == null || request.getCartItems().isEmpty()) {

            throw new RuntimeException("Cart items cannot be empty");
        }

        // Gộp các food trùng nhau
        Map<Integer, Integer> mergedItems = request.getCartItems().stream().collect(Collectors.toMap(CartItemRequest::getFoodId, CartItemRequest::getQuantity, Integer::sum));

        List<Integer> foodIds = new ArrayList<>(mergedItems.keySet());

//        List<Integer> foodIds = request.getCartItems().stream().map(CartItemRequest::getFoodId).toList();

        // Query toàn bộ food
        List<Food> foods = foodRepository.findAllById(foodIds);

        // Validate food tồn tại
        Set<Integer> uniqueFoodIds = new HashSet<>(foodIds);

        if (foods.size() != uniqueFoodIds.size()) {
            throw new RuntimeException("Some food items do not exist");
        }

        Map<Integer, Food> foodMap = foods.stream().collect(Collectors.toMap(Food::getId, Function.identity()));

        // Validate cùng shop
        Set<Integer> shopIds = foods.stream().map(food -> food.getShop().getId()).collect(Collectors.toSet());

        if (shopIds.size() > 1) {
            throw new RuntimeException("Items must belong to same shop");
        }

        Shop shop = foods.get(0).getShop();

        Instant now = Instant.now();

        // Query cart
        Cart cart = cartRepository.findByUser_IdAndShop_Id(userId, shop.getId());

        if (cart == null) {

            cart = new Cart();

            cart.setUser(user);
            cart.setShop(shop);
            cart.setCreatedAt(now);
        }

        cart.setUpdatedAt(now);

        cart = cartRepository.save(cart);

        // Query cartItems 1 lần
        List<CartItem> existingCartItems = cartItemRepository.findByCart_IdAndFood_IdIn(cart.getId(), foodIds);

        Map<Integer, CartItem> cartItemMap = existingCartItems.stream().collect(Collectors.toMap(item -> item.getFood().getId(), Function.identity()));

        List<CartItem> cartItemsToSave = new ArrayList<>();

        for (Map.Entry<Integer, Integer> entry : mergedItems.entrySet()) {

            Integer foodId = entry.getKey();

            Integer quantity = entry.getValue();

            Food food = foodMap.get(foodId);

            CartItem cartItem = cartItemMap.get(foodId);

            if (cartItem == null) {

                cartItem = new CartItem();

                cartItem.setCart(cart);

                cartItem.setFood(food);

                cartItem.setQuantity(quantity);

            } else {

                cartItem.setQuantity(cartItem.getQuantity() + quantity);
            }

            cartItemsToSave.add(cartItem);
        }

        List<CartItem> savedItems = cartItemRepository.saveAll(cartItemsToSave);

        // Build CartDto
        List<CartItemResponseDto> itemDtos = savedItems.stream().map(item -> {

            CartItemResponseDto dto = new CartItemResponseDto();

            dto.setId(item.getId());

            dto.setFoodId(item.getFood().getId());

            dto.setFoodName(item.getFood().getName());

            dto.setPrice(item.getFood().getPrice());

            dto.setImage(item.getFood().getImage());

            dto.setDescription(item.getFood().getDescription());

            dto.setQuantity(item.getQuantity());

            return dto;

        }).toList();

        CartDto cartDto = new CartDto();

        cartDto.setId(cart.getId());

        cartDto.setShopId(shop.getId());

        cartDto.setShopName(shop.getShopName());

        cartDto.setAddress(shop.getAddress());

        cartDto.setCreatedAt(cart.getCreatedAt());

        cartDto.setUpdatedAt(cart.getUpdatedAt());

        cartDto.setCartItems(itemDtos);

        AddToCartResponseDto response = new AddToCartResponseDto();

        response.setCart(cartDto);

        return response;
    }

    @Transactional
    public List<CartDto> syncCart(String authHeader, SyncCartRequest request) {

        Integer userId = jwtHelper.getUserID(authHeader);

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        // ==========================
        // 1. VALIDATE REQUEST
        // ==========================

        if (request.getCarts() == null || request.getCarts().isEmpty()) {
            throw new RuntimeException("Cart list must not be empty");
        }

        for (CartRequest cartReq : request.getCarts()) {

            if (cartReq.getShopId() == null) {
                throw new RuntimeException("ShopId must not be null");
            }

            if (cartReq.getItems() == null) {
                throw new RuntimeException("Items must not be null");
            }

            for (CartItemRequest item : cartReq.getItems()) {

                if (item.getFoodId() == null) {
                    throw new RuntimeException("FoodId must not be null");
                }

                if (item.getQuantity() <= 0) {
                    throw new RuntimeException("Quantity must > 0");
                }
            }
        }

        // ==========================
        // 2. COLLECT IDS
        // ==========================

        Set<Integer> foodIds = request.getCarts().stream().flatMap(c -> c.getItems().stream()).map(CartItemRequest::getFoodId).collect(Collectors.toSet());

        Set<Integer> shopIds = request.getCarts().stream().map(CartRequest::getShopId).collect(Collectors.toSet());

        // ==========================
        // 3. LOAD DATA
        // ==========================

        Map<Integer, Food> foodMap = foodRepository.findAllById(foodIds).stream().collect(Collectors.toMap(Food::getId, Function.identity()));

        Map<Integer, Shop> shopMap = shopsRepository.findAllById(shopIds).stream().collect(Collectors.toMap(Shop::getId, Function.identity()));

        List<Cart> existingCarts = cartRepository.findByUser_IdAndShop_IdIn(userId, shopIds);

        Map<Integer, Cart> cartMap = existingCarts.stream().collect(Collectors.toMap(c -> c.getShop().getId(), Function.identity()));

        List<Cart> cartsToDelete = new ArrayList<>();

        List<Cart> cartsToSave = new ArrayList<>();


        // ==========================
        // 4. RECONCILE
        // ==========================

        for (CartRequest cartReq : request.getCarts()) {

            Cart cart = cartMap.get(cartReq.getShopId());

            Instant now = Instant.now();

            // cart mới
            if (cart == null) {

                cart = new Cart();

                cart.setUser(user);

                cart.setShop(shopMap.get(cartReq.getShopId()));

                cart.setCreatedAt(now);

                cart.setLastAddedAt(now);

                cart.setCartItems(new ArrayList<>());
            }

            cart.setUpdatedAt(now);

            // map item hiện tại
            Map<Integer, CartItem> existingItemMap = cart.getCartItems().stream().collect(Collectors.toMap(i -> i.getFood().getId(), Function.identity()));


            Set<Integer> requestFoodIds = cartReq.getItems().stream().map(CartItemRequest::getFoodId).collect(Collectors.toSet());

            // remove item cũ
            cart.getCartItems().removeIf(item -> !requestFoodIds.contains(item.getFood().getId()));

            // add/update
            for (CartItemRequest itemReq : cartReq.getItems()) {

                Food food = foodMap.get(itemReq.getFoodId());

                if (!food.getShop().getId().equals(cartReq.getShopId())) {

                    throw new RuntimeException("Food does not belong to shop");
                }

                CartItem cartItem = existingItemMap.get(food.getId());

                if (cartItem == null) {

                    cartItem = new CartItem();

                    cartItem.setCart(cart);

                    cartItem.setFood(food);

                    cart.setLastAddedAt(now);

                    cart.getCartItems().add(cartItem);
                }

                cartItem.setQuantity(itemReq.getQuantity());
            }

            // cart rỗng
            if (cart.getCartItems().isEmpty()) {

                if (cart.getId() != null) {
                    cartsToDelete.add(cart);
                }

                continue;
            }

            cartsToSave.add(cart);
        }


        // ==========================
        // 5. SAVE
        // ==========================

        if (!cartsToDelete.isEmpty()) {
            cartRepository.deleteAll(cartsToDelete);
        }

        cartRepository.saveAll(cartsToSave);

        // ==========================
        // 6. RESPONSE
        // ==========================

        return cartRepository.findByUser_IdOrderByLastAddedAtDesc(userId).stream().map(this::toCartDto).toList();
    }

    public List<CartDto> getCarts(String auth) {

        Integer userId = jwtHelper.getUserID(auth);

        List<Cart> carts = cartRepository.findAllByUserIdWithItems(userId);

        List<CartDto> result = new ArrayList<>();

        for (Cart cart : carts) {

            CartDto cartDto = new CartDto();

            cartDto.setId(cart.getId());
            cartDto.setShopId(cart.getShop().getId());
            cartDto.setShopName(cart.getShop().getShopName());
            cartDto.setAddress(cart.getShop().getAddress());
            cartDto.setCreatedAt(cart.getCreatedAt());
            cartDto.setUpdatedAt(cart.getUpdatedAt());

            List<CartItemResponseDto> cartItemsList = new ArrayList<>();

            for (CartItem item : cart.getCartItems()) {

                CartItemResponseDto itemDto = new CartItemResponseDto();

                itemDto.setId(item.getId());
                itemDto.setFoodId(item.getFood().getId());
                itemDto.setQuantity(item.getQuantity());
                itemDto.setFoodName(item.getFood().getName());
                itemDto.setImage(item.getFood().getImage());
                itemDto.setPrice(item.getFood().getPrice());
                itemDto.setDescription(item.getFood().getDescription());
                cartItemsList.add(itemDto);
            }

            cartDto.setCartItems(cartItemsList);

            result.add(cartDto);
        }

        return result;
    }

    private CartDto toCartDto(Cart cart) {

        CartDto dto = new CartDto();

        dto.setId(cart.getId());
        dto.setShopId(cart.getShop().getId());
        dto.setShopName(cart.getShop().getShopName());
        dto.setAddress(cart.getShop().getAddress());
        dto.setUpdatedAt(cart.getUpdatedAt());
        dto.setCreatedAt(cart.getCreatedAt());
        dto.setLastAddedAt(cart.getLastAddedAt());

        List<CartItemResponseDto> items = cart.getCartItems().stream().map(this::toCartItemDto).toList();

        dto.setCartItems(items);

        return dto;
    }

    private CartItemResponseDto toCartItemDto(CartItem item) {

        CartItemResponseDto dto = new CartItemResponseDto();

        dto.setId(item.getId());
        dto.setFoodId(item.getFood().getId());
        dto.setFoodName(item.getFood().getName());
        dto.setPrice(item.getFood().getPrice());
        dto.setImage(item.getFood().getImage());
        dto.setDescription(item.getFood().getDescription());
        dto.setQuantity(item.getQuantity());

        return dto;
    }

}
