package com.example.onlybuy.auth.entity;

import com.example.onlybuy.users.entity.UserEntity;
import jakarta.persistence.*;

import lombok.*;

import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "refresh_tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshTokenEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String token;

    @Column(nullable = false)
    private Date expiresAt;

    @OneToOne
    @JoinColumn(name = "userId", referencedColumnName = "id")
    private UserEntity user;
}
