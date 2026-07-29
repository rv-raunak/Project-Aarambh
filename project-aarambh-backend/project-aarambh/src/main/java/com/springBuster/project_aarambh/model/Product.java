package com.springBuster.project_aarambh.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)        // this auto-generates this ID
    private int id;
    private int stockQuantity;
    private String name;
    private String description;
    private String brand;
    private String category;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")     // we can change the format it is stored in the DB using the Jackson lib after which it us fetched by the frontend
    private Date releaseDate;
    private BigDecimal price;
    private boolean productAvailable;

    //Image
    private String imageName;
    private String imageType;

    @Lob                     // now whenever we are storing the data in a format like byte array so we must use the Large Object Annotation from Persistance
    private byte[] imageData;

}




