package com.example.onlybuy.roles.repository;

import com.example.onlybuy.roles.entity.RoleEntity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RoleRepository extends JpaRepository<RoleEntity, UUID> {
    List<RoleEntity> findAll();
}
