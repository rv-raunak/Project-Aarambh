package com.springBuster.project_aarambh.service;

import com.springBuster.project_aarambh.model.Product;
import com.springBuster.project_aarambh.repository.ProductRepo;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProductService {

    ProductRepo repo;

    public ProductService(ProductRepo repo) {
        this.repo = repo;
    }

    public List<Product> getAllProducts() {
        return repo.findAll();
    }

    public Product getProductById(int prodId) {
        return repo.findById(prodId).orElse(null);    // although we are handing null in the controller but it's not a good idea to send it (there are multiple ways to handle such situations or even sending Status Requests)
    }

    public Product addProduct(Product product, MultipartFile imageFile) throws IOException {

        // we would have to extract the properties from the imageFile as per our product
        // we also have to convert the imageData into byte[] to store that into our db
        product.setImageName(imageFile.getOriginalFilename());
        product.setImageType(imageFile.getContentType());
        product.setImageData(imageFile.getBytes());

        return repo.save(product);
    }

    public Product updateProduct(int prodId, Product product, MultipartFile imageFile) throws IOException {

        product.setImageData(imageFile.getBytes());
        product.setImageName(imageFile.getOriginalFilename());
        product.setImageType(imageFile.getContentType());

        return repo.save(product);
    }

    public void deleteProductById(int prodId) {
        repo.deleteById(prodId);
    }

    public List<Product> searchProducts(String keyword) {
        return repo.searchProducts(keyword);
    }
}
