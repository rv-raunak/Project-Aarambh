import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const UpdateProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [image, setImage] = useState();
  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    name: "",
    description: "",
    brand: "",
    price: "",
    category: "",
    releaseDate: "",
    productAvailable: false,
    stockQuantity: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/product/${id}`
        );

        // 1. SET TEXT DATA IMMEDIATELY
        // This ensures all untouched fields (like releaseDate) are preserved and loaded into state
        setProduct(response.data);
        setUpdateProduct(response.data);

        // 2. FETCH IMAGE IN A SEPARATE TRY-CATCH
        // If the image fails (e.g. dummy data), it won't break the text data above
        try {
          const responseImage = await axios.get(
            `http://localhost:8080/api/product/${id}/image`,
            { responseType: "blob" }
          );
          const imageFile = await converUrlToFile(
            responseImage.data, 
            response.data.imageName || "image.jpg"
          );
          setImage(imageFile);     
        } catch (imageError) {
          console.warn("Could not fetch image, it might be missing or dummy data.");
        }

      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    console.log("image Updated", image);
  }, [image]);

  const converUrlToFile = async(blobData, fileName) => {
    const file = new File([blobData], fileName, { type: blobData.type });
    return file;
  }
 
  const handleSubmit = async(e) => {
    e.preventDefault();
    
    // Format the data to prevent 400 Bad Request
    const formattedProduct = {
      ...updateProduct,
      id: Number(id),
      price: Number(updateProduct.price) || 0,
      stockQuantity: Number(updateProduct.stockQuantity) || 0,
      releaseDate: updateProduct.releaseDate === "" ? null : updateProduct.releaseDate,
    };
    
    const formData = new FormData();
    if (image) {
        formData.append("imageFile", image);
    }
    formData.append(
      "product",
      new Blob([JSON.stringify(formattedProduct)], { type: "application/json" })
    );

    // Removed manual headers so the browser can automatically set the boundary string
    axios
      .put(`http://localhost:8080/api/product/${id}`, formData)
      .then((response) => {
        console.log("Product updated successfully:", response.data);
        alert("Product updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating product:", error);
        
        let errorMessage = "Failed to update product. Please try again.";
        if (error.response && error.response.data) {
          errorMessage = typeof error.response.data === 'string' 
            ? error.response.data 
            : (error.response.data.message || JSON.stringify(error.response.data));
        }
        alert("Backend rejected request: " + errorMessage);
      });
  };
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateProduct({
      ...updateProduct,
      [name]: value,
    });
  };
  
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };
  
  return (
    <div className="update-product-container" >
      <div className="center-container" style={{marginTop:"7rem"}}>
        <h1>Update Product</h1>
        <form className="row g-3 pt-1" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label className="form-label">
              <h6>Name</h6>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder={product.name}
              value={updateProduct.name}
              onChange={handleChange}
              name="name"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">
              <h6>Brand</h6>
            </label>
            <input
              type="text"
              name="brand"
              className="form-control"
              placeholder={product.brand}
              value={updateProduct.brand}
              onChange={handleChange}
              id="brand"
            />
          </div>
          <div className="col-12">
            <label className="form-label">
              <h6>Description</h6>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder={product.description}
              name="description"
              onChange={handleChange}
              value={updateProduct.description}
              id="description"
            />
          </div>
          <div className="col-5">
            <label className="form-label">
              <h6>Price</h6>
            </label>
            <input
              type="number"
              className="form-control"
              onChange={handleChange}
              value={updateProduct.price}
              placeholder={product.price}
              name="price"
              id="price"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">
              <h6>Category</h6>
            </label>
            <select
              className="form-select"
              value={updateProduct.category}
              onChange={handleChange}
              name="category"
              id="category"
            >
              <option value="">Select category</option>
              <option value="laptop">Laptop</option>
              <option value="headphone">Headphone</option>
              <option value="mobile">Mobile</option>
              <option value="electronics">Electronics</option>
              <option value="toys">Toys</option>
              <option value="fashion">Fashion</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">
              <h6>Stock Quantity</h6>
            </label>
            <input
              type="number"
              className="form-control"
              onChange={handleChange}
              placeholder={product.stockQuantity}
              value={updateProduct.stockQuantity}
              name="stockQuantity"
              id="stockQuantity"
            />
          </div>
          <div className="col-md-8">
            <label className="form-label">
              <h6>Image</h6>
            </label>
            <img
              src={image ? URL.createObjectURL(image) : "Image unavailable"}
              alt={product.imageName}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                padding: "5px",
                margin: "0",
              }}
            />
            <input
              className="form-control"
              type="file"
              onChange={handleImageChange}
              placeholder="Upload image"
              name="imageUrl"
              id="imageUrl"
            />
          </div>
          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="productAvailable"
                id="gridCheck"
                checked={updateProduct.productAvailable}
                onChange={(e) =>
                  setUpdateProduct({ ...updateProduct, productAvailable: e.target.checked })
                }
              />
              <label className="form-check-label">Product Available</label>
            </div>
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;











































// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// const UpdateProduct = () => {
//   const { id } = useParams();
//   const [product, setProduct] = useState({});
//   const [image, setImage] = useState();
//   const [updateProduct, setUpdateProduct] = useState({
//     id: null,
//     name: "",
//     description: "",
//     brand: "",
//     price: "",
//     category: "",
//     releaseDate: "",
//     productAvailable: false,
//     stockQuantity: "",
//   });

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:8080/api/product/${id}`
//         );

//         setProduct(response.data);
      
//         const responseImage = await axios.get(
//           `http://localhost:8080/api/product/${id}/image`,
//           { responseType: "blob" }
//         );
//        const imageFile = await converUrlToFile(responseImage.data,response.data.imageName)
//         setImage(imageFile);     
//         setUpdateProduct(response.data);
//       } catch (error) {
//         console.error("Error fetching product:", error);
//       }
//     };

//     fetchProduct();
//   }, [id]);

//   useEffect(() => {
//     console.log("image Updated", image);
//   }, [image]);



//   const converUrlToFile = async(blobData, fileName) => {
//     const file = new File([blobData], fileName, { type: blobData.type });
//     return file;
//   }
 
//   const handleSubmit = async(e) => {
//     e.preventDefault();
//     console.log("images", image)
//     console.log("productsdfsfsf", updateProduct)
//     const updatedProduct = new FormData();
//     updatedProduct.append("imageFile", image);
//     updatedProduct.append(
//       "product",
//       new Blob([JSON.stringify(updateProduct)], { type: "application/json" })
//     );
  

//   console.log("formData : ", updatedProduct)
//     axios
//       .put(`http://localhost:8080/api/product/${id}`, updatedProduct, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       })
//       .then((response) => {
//         console.log("Product updated successfully:", updatedProduct);
//         alert("Product updated successfully!");
//       })
//       .catch((error) => {
//         console.error("Error updating product:", error);
//         console.log("product unsuccessfull update",updateProduct)
//         alert("Failed to update product. Please try again.");
//       });
//   };
 

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setUpdateProduct({
//       ...updateProduct,
//       [name]: value,
//     });
//   };
  
//   const handleImageChange = (e) => {
//     setImage(e.target.files[0]);
//   };
  

//   return (
//     <div className="update-product-container" >
//       <div className="center-container"style={{marginTop:"7rem"}}>
//         <h1>Update Product</h1>
//         <form className="row g-3 pt-1" onSubmit={handleSubmit}>
//           <div className="col-md-6">
//             <label className="form-label">
//               <h6>Name</h6>
//             </label>
//             <input
//               type="text"
//               className="form-control"
//               placeholder={product.name}
//               value={updateProduct.name}
//               onChange={handleChange}
//               name="name"
//             />
//           </div>
//           <div className="col-md-6">
//             <label className="form-label">
//               <h6>Brand</h6>
//             </label>
//             <input
//               type="text"
//               name="brand"
//               className="form-control"
//               placeholder={product.brand}
//               value={updateProduct.brand}
//               onChange={handleChange}
//               id="brand"
//             />
//           </div>
//           <div className="col-12">
//             <label className="form-label">
//               <h6>Description</h6>
//             </label>
//             <input
//               type="text"
//               className="form-control"
//               placeholder={product.description}
//               name="description"
//               onChange={handleChange}
//               value={updateProduct.description}
//               id="description"
//             />
//           </div>
//           <div className="col-5">
//             <label className="form-label">
//               <h6>Price</h6>
//             </label>
//             <input
//               type="number"
//               className="form-control"
//               onChange={handleChange}
//               value={updateProduct.price}
//               placeholder={product.price}
//               name="price"
//               id="price"
//             />
//           </div>
//           <div className="col-md-6">
//             <label className="form-label">
//               <h6>Category</h6>
//             </label>
//             <select
//               className="form-select"
//               value={updateProduct.category}
//               onChange={handleChange}
//               name="category"
//               id="category"
//             >
//               <option value="">Select category</option>
//               <option value="laptop">Laptop</option>
//               <option value="headphone">Headphone</option>
//               <option value="mobile">Mobile</option>
//               <option value="electronics">Electronics</option>
//               <option value="toys">Toys</option>
//               <option value="fashion">Fashion</option>
//             </select>
//           </div>

//           <div className="col-md-4">
//             <label className="form-label">
//               <h6>Stock Quantity</h6>
//             </label>
//             <input
//               type="number"
//               className="form-control"
//               onChange={handleChange}
//               placeholder={product.stockQuantity}
//               value={updateProduct.stockQuantity}
//               name="stockQuantity"
//               id="stockQuantity"
//             />
//           </div>
//           <div className="col-md-8">
//             <label className="form-label">
//               <h6>Image</h6>
//             </label>
//             <img
//               src={image ? URL.createObjectURL(image) : "Image unavailable"}
//               alt={product.imageName}
//               style={{
//                 width: "100%",
//                 height: "180px",
//                 objectFit: "cover",
//                 padding: "5px",
//                 margin: "0",
//               }}
//             />
//             <input
//               className="form-control"
//               type="file"
//               onChange={handleImageChange}
//               placeholder="Upload image"
//               name="imageUrl"
//               id="imageUrl"
//             />
//           </div>
//           <div className="col-12">
//             <div className="form-check">
//               <input
//                 className="form-check-input"
//                 type="checkbox"
//                 name="productAvailable"
//                 id="gridCheck"
//                 checked={updateProduct.productAvailable}
//                 onChange={(e) =>
//                   setUpdateProduct({ ...updateProduct, productAvailable: e.target.checked })
//                 }
//               />
//               <label className="form-check-label">Product Available</label>
//             </div>
//           </div>

//           <div className="col-12">
//             <button type="submit" className="btn btn-primary">
//               Submit
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UpdateProduct;