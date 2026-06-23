package com.example.restaurant.management.Repository;

import com.example.restaurant.management.Entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RolesRepository extends JpaRepository<Role,Integer> {
    Role findByRoleName(String roleName);

    Optional<Role> findById(Integer id);
}
