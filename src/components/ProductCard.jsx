function ProductCard({ product }) {
  return (
    <div className="result-card-wrapper">
      <div className="card-icon">
        {product.image && <img src={product.image} alt={product.name} className="product-image" />}
      </div>
      <div className="result-card">
        <h5 className="card-title card-title-link">{product.name}</h5>
        <p className="card-description">{product.description}</p>
        <div className="card-price">{product.price}</div>
      </div>
    </div>
  );
}

export default ProductCard;
