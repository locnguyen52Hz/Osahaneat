package com.example.restaurant.management.Repository;

import com.example.restaurant.management.Entity.Roles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RolesRepository extends JpaRepository<Roles,Integer> {
    Roles findByRoleName(String roleName);

    Optional<Roles> findById(Integer id);
}
