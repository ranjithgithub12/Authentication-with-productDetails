import './index.css'

const SimilarProductItem = props => {
  const {similarProduct} = props
  const {
    id,
    imageUrl,
    title,
    style,
    price,
    description,
    brand,
    totalReviews,
    rating,
    availability,
  } = similarProduct

  return (
    <li className="list-of-similar-products">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-product-image"
      />
      <p className="similar-title">{title}</p>
      <p className="similar-brand">by {brand}</p>
      <div className="similar-rating-container">
        <p className="similar-product-price">Rs {price}/-</p>
        <div className="similar-rating">
          <p className="similar-rating-content">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="similar-star-image"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
