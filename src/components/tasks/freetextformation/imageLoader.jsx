import React, { Component } from "react";
import Utils from "../../../utils/Utils";
import { Image, Container, Col, Row } from "react-bootstrap";

class ImageLoader extends Component {
  // shouldComponentUpdate(nextProps, nextState) {
  //   return false;
  // }

  render() {
    // To get random images - Begins
    let totalImages = 38;
    let imageNumber = this.props.imageNumber % totalImages; //Utils.getRandomInt(4);
    imageNumber = 3 * imageNumber;
    let toLoadImage1 = require(`../../../fixtures/image${imageNumber + 1}.jpg`);
    let toLoadImage2 = require(`../../../fixtures/image${imageNumber + 2}.jpg`);
    let toLoadImage3 = require(`../../../fixtures/image${imageNumber + 3}.jpg`);
    // To get random images - Ends
    return (
      <React.Fragment>
        <Container>
          <Row>
            <Col xs={6} md={12}>
              <h4 className="text-center">
                Pick{" "}
                <b>
                  <font color="red">two</font>
                </b>{" "}
                images. Describe the images and tell a story about the people in
                the images.
              </h4>
            </Col>
          </Row>
          <Row>
            <Col xs={6} md={4}>
              <Image src={toLoadImage1} fluid />
            </Col>
            <Col xs={6} md={4}>
              <Image src={toLoadImage2} fluid />
            </Col>
            <Col xs={6} md={4}>
              <Image src={toLoadImage3} fluid />
            </Col>
          </Row>
        </Container>
        {/* For Image */}
        {/* <div className="row justify-content-md-center">
          <div className="col col-lg-4">
            <img
              src={toLoadImage}
              className="img-fluid img-thumbnail"
              alt="freetext"
            />
          </div>
        </div>
        <br /> */}
        {/* For Image Ends*/}
      </React.Fragment>
    );
  }
}

export default ImageLoader;
