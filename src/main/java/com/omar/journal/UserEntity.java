package com.omar.journal;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "users", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
public class UserEntity extends PanacheEntity {
    @Email @NotBlank
    public String email; 

    @NotBlank
    public String passwordHash; 
}
