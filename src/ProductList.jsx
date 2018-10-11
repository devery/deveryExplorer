import React from 'react';
import Product from './Product';
import {Row } from 'react-bootstrap';

export default class ProductList extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    const products = this.props.products;

    return (
      <Row>
        <div>
          {products.map(product =>
            <Product
              key={product._id}
              product={product}
              cars={this.props.cars}
              brandAccount={this.props.brandAccount}
              />
          )}
        </div>
      </Row>
    );
  }
}
