// Write your code here
import {Component} from 'react'

import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Cookies from 'js-cookie'
import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productsList: {
      similarProducts: [],
    },
    apistatus: apiStatusConstants.initial,
    quantity: 1,
  }

  componentDidMount = () => {
    this.gettingProducts()
  }

  gettingProducts = async () => {
    this.setState({apistatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id)
    const url = `https://apis.ccbp.in/products/${id}`
    console.log(url)
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    console.log(response)
    if (response.ok === true) {
      const data = await response.json()
      const fetchedData = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        brand: data.brand,
        price: data.price,
        description: data.description,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
        similarProducts: data.similar_products.map(eachProduct => ({
          availability: eachProduct.availability,
          description: eachProduct.description,
          id: eachProduct.id,
          imageUrl: eachProduct.image_url,
          price: eachProduct.price,
          rating: eachProduct.rating,
          style: eachProduct.style,
          title: eachProduct.title,
          totalReviews: eachProduct.total_reviews,
          brand: eachProduct.brand,
        })),
      }
      console.log(fetchedData)
      this.setState({
        productsList: fetchedData,
        apistatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apistatus: apiStatusConstants.failure})
    }
  }

  onDecreasingQuantity = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({
        quantity: prevState.quantity - 1,
      }))
    }
  }

  onIncreasingQuantity = () => {
    const {quantity} = this.state
    if (quantity >= 1) {
      this.setState(prevState => ({
        quantity: prevState.quantity + 1,
      }))
    }
  }

  renderingProducts = () => {
    const {productsList, apistatus, quantity} = this.state
    console.log(quantity)
    const {
      id,
      imageUrl,
      title,
      brand,
      price,
      description,
      totalReviews,
      rating,
      availability,
      similarProducts,
    } = productsList
    switch (apistatus) {
      case 'SUCCESS':
        return (
          <div className="product-item-container">
            <div className="selected-products-container">
              <img
                alt="product"
                className="product-image-style"
                src={imageUrl}
              />
              <div>
                <h1>{title}</h1>
                <p>Rs.{price}/-</p>
                <p>{description}</p>
                <div className="product-item-rating-container">
                  <p className="rating">{rating}</p>
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                    alt="star"
                    className="star"
                  />
                </div>
                <p>{totalReviews} Reviews</p>
                <p>Availabity: {availability}</p>
                <p>Brand: {brand}</p>
                <hr />
                <button
                  type="button"
                  testid="minus"
                  onClick={this.onDecreasingQuantity}
                >
                  <BsDashSquare />
                </button>
                <p>{quantity}</p>
                <button
                  type="button"
                  testid="plus"
                  onClick={this.onIncreasingQuantity}
                >
                  <BsPlusSquare />
                </button>
                <button>ADD TO CART</button>
              </div>
            </div>

            <h1>Similar Products</h1>
            <ul className="similar-products-container">
              {similarProducts.map(eachsimilarproduct => (
                <SimilarProductItem
                  similarProduct={eachsimilarproduct}
                  key={eachsimilarproduct.id}
                />
              ))}
            </ul>
          </div>
        )
      case 'IN_PROGRESS':
        return (
          <div testid="loader">
            <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
          </div>
        )

      case 'FAILURE':
        return (
          <div>
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
              alt="failure view"
            />
            <h1>Product Not Found</h1>
            <Link to="/products">
              <button>Continue Shopping</button>
            </Link>
          </div>
        )
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderingProducts()}
      </>
    )
  }
}

export default ProductItemDetails
