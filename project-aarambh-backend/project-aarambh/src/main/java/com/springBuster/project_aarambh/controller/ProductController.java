package com.springBuster.project_aarambh.controller;

import com.springBuster.project_aarambh.model.Product;
import com.springBuster.project_aarambh.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class ProductController {

    ProductService service;

    // constructor injection
    public ProductController(ProductService service) {
        this.service = service;
    }

    @RequestMapping("/")
    public String greet() {
        return "Welcome to the Server";
    }


    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts() {                // Sending Status codes is very imp to the front-end team for debugging and thus we can do this by wrapping our resource in the Response Entity that enables us to send the status code as well
        return new ResponseEntity<>(service.getAllProducts(), HttpStatus.ACCEPTED);
    }


    @GetMapping("/product/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable("id") int prodId) {
        Product product = service.getProductById(prodId);
        if (product != null)
            return new ResponseEntity<>(product, HttpStatus.ACCEPTED);
        else
            return new ResponseEntity<>(product, HttpStatus.NOT_FOUND);
    }


    @PostMapping("/product")
    public ResponseEntity<?> addProduct(@RequestPart("product") Product product,
                                        @RequestPart("imageFile") MultipartFile imageFile) {
        try {
            Product addedProduct = service.addProduct(product, imageFile);
            return new ResponseEntity<>(addedProduct, HttpStatus.CREATED);
        }
        catch (Exception e) {
            return  new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }


    @GetMapping("product/{productId}/image")
    public ResponseEntity<byte[]> getImageById(@PathVariable("productId") int id) {
        Product product = service.getProductById(id);
        byte[] image = product.getImageData();

        return ResponseEntity.ok()
                .contentType(MediaType.valueOf(product.getImageType()))
                .body(image);
    }


    @PutMapping("product/{prodId}")
    public ResponseEntity<String> updateProduct(@PathVariable int prodId,
                                                @RequestPart Product product,
                                                @RequestPart MultipartFile imageFile) {
        Product updatedProduct = null;
        try {
            updatedProduct = service.updateProduct(prodId, product, imageFile);
        } catch (IOException e) {
            return new ResponseEntity<>("Failed to Update", HttpStatus.BAD_REQUEST);
        }
        if (updatedProduct != null)
            return new ResponseEntity<>("Updated", HttpStatus.OK);
        else
            return new ResponseEntity<>("Failed to update", HttpStatus.BAD_REQUEST);
    }


    @DeleteMapping("product/{prodId}")
    public ResponseEntity<String> deleteProduct(@PathVariable int prodId) {
        Product product = service.getProductById(prodId);
        if (product != null) {
            service.deleteProductById(prodId);
            return new ResponseEntity<>("Product Deleted Successfully", HttpStatus.OK);
        }
        else
            return new ResponseEntity<>("Product doesn't Exist. Thus, it cannot be deleted", HttpStatus.BAD_REQUEST);
    }

    @GetMapping("products/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String keyword)  {
        List<Product> products = service.searchProducts(keyword);
//        System.out.println(keyword);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }


}
