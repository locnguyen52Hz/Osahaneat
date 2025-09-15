package com.example.restaurant.management.Repository;

import com.example.restaurant.management.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    @Query("select u from User u JOIN FETCH u.role where u.email = :email")
    User findUserByEmail(@Param("email") String email);

    @Query("select u from User u join fetch u.role where u.id = :id")
    Optional<User> findByIdWithRole(@Param("id") Integer id);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.role LEFT JOIN FETCH u.shop WHERE u.email = :email")
    Optional<User> findByEmailWithShop(@Param("email") String email);

    User findUserById(int id);
}
