function ProductCard({ product }) {
  return (
    <div className="result-card-wrapper">
      <div className="card-icon">
        {product.image && <img src={product.image} alt={product.name} className="product-image" />}
      </div>
      <div className="result-card">
        <p className="card-title card-title-link">{product.name}</p>
        <p className="card-description">{product.description}</p>
        <p className="card-stock">В наличии {Math.floor(Math.random() * (30 - 4 + 1)) + 4} шт.</p>
        <div className="card-price">{product.price}</div>
        
      </div>
    </div>
  );
}

export default ProductCard;
