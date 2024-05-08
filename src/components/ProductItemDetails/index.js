import './index.css'
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import SimilarProductItem from '../SimilarProductItem'

const apiStatusConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    productDetails: [],
    errorMsg: '',
    quality: 1,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.loading})

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const apiURL = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiURL, options)
    const data = await response.json()

    if (response.ok === true) {
      const updatedData = {
        id: data.id,
        imageUrl: data.image_url,
        price: data.price,
        description: data.description,
        title: data.title,
        brand: data.brand,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
        similarProduct: data.similar_products,
      }
      this.setState({
        productDetails: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
        errorMsg: data.error_msg,
      })
    }
  }

  onClickContinue = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderLoading = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailure = () => {
    const {errorMsg} = this.state
    return (
      <div className="product-not-found-contianer">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
          className="product-not-found-image"
        />
        <h1>{errorMsg}</h1>
        <button className="continue-button" onClick={this.onClickContinue}>
          Continue Shopping
        </button>
      </div>
    )
  }

  qualityDecerease = () => {
    const {quality} = this.state
    if (quality >1){
    this.setState(prevState => {
      return {quality: prevState.quality - 1}
    })
  }
  }
  qualityIncrease = () => {
    this.setState(prevState => {
      return {quality: prevState.quality + 1}
    })
  }
  renderProductDetails = () => {
    const {productDetails, quality} = this.state
    const {
      id,
      imageUrl,
      title,
      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
      similarProduct,
    } = productDetails

    const updateSimilarProduct = similarProduct.map(eachItem => ({
      id: eachItem.id,
      imageUrl: eachItem.image_url,
      title: eachItem.title,
      style: eachItem.style,
      price: eachItem.price,
      description: eachItem.description,
      brand: eachItem.brand,
      totalReviews: eachItem.total_reviews,
      rating: eachItem.rating,
      availability: eachItem.availability,
    }))
    console.log(updateSimilarProduct)
    return (
      <>
        <div className="total-product-details-contianer">
          <div className="product-details-contianer">
            <img src={imageUrl} alt="product" className="product-image" />
            <div className="product-description-contianer">
              <h1 className="product-title">{title}</h1>
              <p className="product-price">Rs {price}/-</p>
              <div className="rating-star-container">
                <div className="total-star">
                  <p>{rating}</p>
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                    alt="star"
                    className="star-image"
                  />
                </div>
                <p className="total-review">{totalReviews} Reviews</p>
              </div>
              <p className="product-description">{description}</p>
              <p className="span-availability">
                <span className="product-availability">Available:</span>
                {availability}
              </p>
              <p className="span-availability">
                <span className="product-availability">Brand:</span>
                {brand}
              </p>
              <hr />
              <div className="quality-contianer">
                <button
                  className="quality-button"
                  onClick={this.qualityDecerease}
                  data-testid="minus"
                >
                  <BsDashSquare className="quality-image" />
                </button>
                <p>{quality}</p>
                <button
                  className="quality-button"
                  onClick={this.qualityIncrease}
                  data-testid="plus"
                >
                  <BsPlusSquare className="quality-image" />
                </button>
              </div>
              <button className="add-to-cart">ADD TO CART</button>
            </div>
          </div>
          <div className="similar-product-container">
            <h1>Similar Products</h1>
            <ul className="unorder-similar-product">
              {updateSimilarProduct.map(eachItem => (
                <SimilarProductItem
                  similarProduct={eachItem}
                  key={eachItem.id}
                />
              ))}
            </ul>
          </div>
        </div>
      </>
    )
  }

  renderFullProductDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.loading:
        return this.renderLoading()
      case apiStatusConstants.success:
        return this.renderProductDetails()
      case apiStatusConstants.failure:
        return this.renderFailure()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        {this.renderFullProductDetails()}
      </div>
    )
  }
}

export default ProductItemDetails
