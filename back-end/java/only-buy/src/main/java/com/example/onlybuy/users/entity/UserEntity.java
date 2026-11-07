package com.example.onlybuy.users.entity;

import com.example.onlybuy.auth.entity.RefreshTokenEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String avatar;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private Boolean active;

    @Column(nullable = false, updatable = false)
    private Date createdDate;

    @Column()
    private Date updatedDate;

    @OneToOne
    @JoinColumn(name = "userId", referencedColumnName = "id")
    private RefreshTokenEntity refreshToken;
}
