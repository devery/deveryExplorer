import React, { Component } from 'react';
import { Button, ControlLabel, FormControl, FormGroup, Jumbotron, } from 'react-bootstrap';
import { hot } from 'react-hot-loader';
import uuid from 'uuid';
import DeveryExplorer from './libs/deveryHelper';

const devery = require('@devery/devery');
const dbHelper = require('./libs/orbitHelper');

class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      account: 'Please sign in to MetaMask',
      appAddress: '0xf8b908e7DBb3a0f2581aa8F1962f9360e10DC059',
      brandAddr: '0xf8b908e7DBb3a0f2581aa8F1962f9360e10DC059',
      productAddress: '0x2a6aa0af60f753e020030d5fe7cf1a6da3de9a81',
      markProductAddr: '0x2a6aa0af60f753e020030d5fe7cf1a6da3de9a81',
      info: '',
      itemAddress: '',
      tokenFromAddr: '',
      tokenToAddr: '',
      tokenId: '',
      itemProductAccount: '',
      itemBrandAccount: '',
      itemAppAccount: '',
      checkBrandAddr: '',
      brandInfo: '',
      checkOwnedProductsAddr: '',
      appName: 'Not Loaded',
      brandName: 'Not Loaded',
      productName: 'Not Loaded',
      appAccounts: 'No Accounts Loaded',
      appInfo: 'No App Info Loaded',
      brandAccounts: 'No Accounts Loaded',
      productAccount: 'No Products Loaded',
      itemCheckAddr: 'No Addr',
      noApps: '0',
    };
  }

  componentDidMount() {
    DeveryExplorer.getAccount(async account => {
      if (this.state.account === account) return;
      this.setState({ account });
      await DeveryExplorer.checkAndUpdateAllowance(account);
    })
  }

  handleChangeState = field => event => this.setState({[field]: event.target.value});

  handleAddBrand = () => {
    const { addBrandName, addBrandAddr } = this.state;
    console.log(`Adding Brand: ${addBrandName}, ${addBrandAddr}`);
    DeveryExplorer.addBrand(addBrandAddr, addBrandName);
  };

  handleGetBrand = () => {
    this.setState({ brandInfo: 'Loading Brand Info...' });
    const brandInfo = DeveryExplorer.getBrand(this.state.checkBrandAddr);
    this.setState({ brandInfo });
  };

  handleAddProduct = () => {
    const { addProductName } = this.state;

    console.log(`Adding product:${addProductName}`);
    DeveryExplorer.addProduct(addProductName);
  };

  handleGetProduct = async () => {
    const { checkProductAddr } = this.state;

    console.log(`Getting Product info: ${checkProductAddr}`);
    const Product = await DeveryExplorer.getProduct(checkProductAddr);
    this.setState({ productInfo: Product });
  };

  handleMark = async () => {
    const { itemAddress, markProductAddr } = this.state;
    await DeveryExplorer.markProduct(itemAddress, markProductAddr);
  };

  handleGenerateItem = () => {
    this.setState({ itemAddress: devery.Utils.getRandomAddress() });
  };

  handleCheckItem = async () => {
    const { itemCheckAddr } = this.state;
    console.log(`Checking Item: ${itemCheckAddr}`);
    const item = await DeveryExplorer.checkItem(itemCheckAddr);
    this.setState({
      itemProductAccount: item.productAccount,
      itemBrandAccount: item.brandAccount,
      itemAppAccount: item.appAccount,
    });
  };

  handleSetAccount = async () => {
    const { setAccountAddr } = this.state;
    console.log(`Setting: ${setAccountAddr}`);
    await DeveryExplorer.permissionMarker(setAccountAddr);
  };

  // APP INFO
  handleGetAppAccounts = async () => {
    this.setState({ appAccounts: 'Getting App Accounts...' });
    const appAccounts = await DeveryExplorer.getAppAccounts();
    this.setState({ appAccounts });
  };

  handleGetApp = async () => {
    this.setState({ appInfo: 'Getting App Info...' });
    const appInfo = await DeveryExplorer.getApp(this.state.appAccount);
    this.setState({ appInfo });
  };

  // BRAND INFO
  handleGetBrandAccounts = async () => {
    this.setState({ brandAccounts: 'Getting Brand Accounts...' });
    const brandAccounts = await DeveryExplorer.getBrandAccounts();
    this.setState({ brandAccounts });
  };

  // PRODUCT INFO
  handleGetProductAccounts = async () => {
    this.setState({ productAccounts: 'Getting Product Accounts...' });
    const productAccounts = await DeveryExplorer.getProductAccounts();
    this.setState({ productAccounts });
  };

  // OWNER INFO
  handleGetProductsOwned = async () => {
    this.setState({ ownedProducts: 'Getting Owned Products...' });
    const ownedProducts = await DeveryExplorer.getProductsByOwner(this.state.checkOwnedProductsAddr);
    this.setState({ ownedProducts });
  };

  handleSafeTransfer = async () => {
    const { fromAddress, toAddress, tokenId } = this.state;
    await DeveryExplorer.safeTransferTo(fromAddress, toAddress, tokenId);
  };

  handleAddDb = async () => {
    const { dbName, jsonString } = this.state;

    console.log(`saving to db: ${dbName}`);
    console.log(jsonString);
    const js = JSON.parse(jsonString);
    console.log(js);

    await dbHelper.saveRecord(dbName, js);
  };

  render() {
    return (
      <div>
        <Jumbotron>
          <div>
            <h1>Devery Explorer</h1>
            <p>User Account: {this.state.account}</p>
          </div>
        </Jumbotron>

        <h2>APP INFO</h2>
        <FormGroup>
          <ControlLabel>Get App Accounts:</ControlLabel>
          <FormControl componentClass="textarea" value={this.state.appAccounts}/>
          <br/>
          <Button bsStyle="primary" onClick={this.handleGetAppAccounts}>Get App Accounts</Button>
        </FormGroup>

        <FormGroup>
          <ControlLabel>Get App:</ControlLabel>
          <FormControl.Static>App Info: active, appAccount, appName, fee, feeAccount</FormControl.Static>
          <FormControl type="text" placeholder="App Address" onChange={this.handleChangeState('appAccount')}/>
          <FormControl componentClass="textarea" value={this.state.appInfo}/>
          <br/>
          <Button bsStyle="primary" onClick={this.handleGetApp}>Get App</Button>
        </FormGroup>

        <h2>BRAND INFO</h2>

        <FormGroup>
          <ControlLabel>Get Brand Accounts:</ControlLabel>
          <FormControl.Static>This gets ALL brand accounts. i.e. Not just for your app.</FormControl.Static>
          <FormControl componentClass="textarea" value={this.state.brandAccounts}/>
          <br/>
          <Button bsStyle="primary" onClick={this.handleGetBrandAccounts}>Get Brand Accounts</Button>
        </FormGroup>

        <FormGroup>
          <ControlLabel>Get Brand Info:</ControlLabel>
          <FormControl.Static>Brand Info: brandAccount, appAccount, brandName, active</FormControl.Static>
          <FormControl type="text" placeholder="Enter Brand Address" onChange={this.handleChangeState('checkBrandAddr')}/>
          <FormControl componentClass="textarea" value={this.state.brandInfo}/>
          <br/>
          <Button bsStyle="primary" onClick={this.handleGetBrand}>Get Brand Info</Button>
        </FormGroup>

        <FormGroup>
          <ControlLabel>Add A Brand:</ControlLabel>
          <FormControl.Static>Brands can only be added by app owner account so make sure correct MetaMask!</FormControl.Static>
          <FormControl.Static>Brand Account is basically the account that controls it (i.e. adding brand products) so it might be useful to use a MetaMask account.</FormControl.Static>
          <FormControl type="text" placeholder="Brand Address" onChange={this.handleChangeState('addBrandAddr')}/>
          <FormControl type="text" placeholder="Brand Name" onChange={this.handleChangeState('addBrandName')}/>
          <br/>
          <Button bsStyle="primary" onClick={this.handleAddBrand}>Add Brand</Button>
        </FormGroup>

        <h2>PRODUCT INFO</h2>

        <FormGroup>
          <ControlLabel>Get Product Accounts:</ControlLabel>
          <FormControl.Static>This gets ALL product accounts. i.e. Not just for your app/brand.</FormControl.Static>
          <FormControl componentClass="textarea" value={this.state.productAccounts}/>
          <br/>
          <Button bsStyle="primary" onClick={this.handleGetProductAccounts}>Get Product Accounts</Button>
        </FormGroup>

        <FormGroup>
          <ControlLabel>Get Product Info:</ControlLabel>
          <FormControl.Static>Product Info: productAccount, brandAccount, description, details, year, origin, active</FormControl.Static>
          <FormControl type="text" placeholder="Enter A Product Address" onChange={this.handleChangeState('checkProductAddr')}/>
          <FormControl componentClass="textarea" value={this.state.productInfo}/>
          <br/>
          <Button bsStyle="primary" onClick={this.handleGetProduct}>Get Product Info</Button>
        </FormGroup>

        <FormGroup>
          <ControlLabel>Add Product:</ControlLabel>
          <FormControl.Static>Product takes account that added it as its brand.</FormControl.Static>
          <FormControl.Static>If your MetaMask account doesn’t have a brand then you can’t add a product.</FormControl.Static>
          <FormControl type="text" placeholder="Product Address" onChange={this.handleChangeState('addProductAddr')}/>
          <FormControl type="text" placeholder="Product Name" onChange={this.handleChangeState('addProductName')} />
          <br/>
          <Button bsStyle="primary" onClick={this.handleAddProduct}>Add Product</Button>
        </FormGroup>

        <h2>OWNER INFO</h2>
        <FormGroup>
          <ControlLabel>Get Owned Products:</ControlLabel>
          <FormControl.Static>Enter an ETH Address to return all owned products</FormControl.Static>
          <FormControl type="text" placeholder="Enter ETH Address" onChange={this.handleChangeState('checkOwnedProductsAddr')}/>
          <FormControl componentClass="textarea" value={this.state.ownedProducts}/>
          <br/>
          <Button bsStyle="primary" onClick={this.handleGetProductsOwned}>Get Owned Products</Button>
        </FormGroup>

        <h2>MARKING</h2>

        <FormGroup>
          <ControlLabel>Allow Account To Mark:</ControlLabel>
          <FormControl.Static>An Account has to have permission set before it can Mark.</FormControl.Static>
          <FormControl type="text" placeholder='Account To Set' onChange={this.handleChangeState('setAccountAddr')}/>
          <br/>
          <Button bsStyle="primary" onClick={this.handleSetAccount}>Set Account Permission</Button>
        </FormGroup>

        <FormGroup>
          <ControlLabel>Mark Item With Product: </ControlLabel>
          <FormControl.Static>You can only mark an item with a product from the products brand account.</FormControl.Static>
          <FormControl.Static>An item can be marked more than once but most recent state is only one recalled by check.</FormControl.Static>
          <FormControl.Static>Can generate a random Item address below.</FormControl.Static>
          <FormControl type="text" placeholder='Product Address' onChange={this.handleChangeState('markProductAddr')}/>
          <FormControl type="text" placeholder='Item Address' onChange={this.handleChangeState('itemAddress')}/>
          <br/>
          <Button bsStyle="primary" onClick={this.handleMark}>Mark Item</Button>
        </FormGroup>

        <FormGroup>
          <ControlLabel>Transfer token: </ControlLabel>
          <FormControl.Static>Safe Transfer Token: current owner account address as fromAddress, new owner account address as toAddress, tokenId</FormControl.Static>
          <FormControl type="text" placeholder='Product Address' onChange={this.handleChangeState('tokenFromAddr')}/>
          <FormControl type="text" placeholder='Item Address' onChange={this.handleChangeState('tokenToAddr')}/>
          <FormControl type="text" placeholder='Item Address' onChange={this.handleChangeState('tokenId')}/>
          <br/>
          <Button bsStyle="primary" onClick={this.handleSafeTransfer}>Generate Address</Button>
        </FormGroup>

        <FormGroup>
          <ControlLabel>Generate Random Address: </ControlLabel>
          <FormControl type="text" value={this.state.itemAddress}/>
          <br/>
          <Button bsStyle="primary" onClick={this.handleGenerateItem}>Generate Address</Button>
        </FormGroup>

        <FormGroup>
          <ControlLabel>Check Item: </ControlLabel>
          <FormControl.Static>An item can be marked more than once but most recent state is only one recalled by check.</FormControl.Static>
          <FormControl type="text" placeholder='Item Address To Check' onChange={this.handleChangeState('itemCheckAddr')}/>
          <p>itemProductAccount: {this.state.itemProductAccount}</p>
          <p>itemBrandAccount: {this.state.itemBrandAccount}</p>
          <p>itemAppAccount: {this.state.itemAppAccount}</p>
          <Button bsStyle="primary" onClick={this.handleCheckItem}>Check Item</Button>
        </FormGroup>

        <h2>OrbitDb</h2>
        <FormGroup controlId="formControlItem">
          <h4>Add To Db (Random ID: {uuid.v4()})</h4>
          <ControlLabel>DB Name:</ControlLabel>
          <FormControl type="text" placeholder='i.e. brands' onChange={this.handleChangeState('dbName')}/>
          <ControlLabel>JSON String:</ControlLabel>
          <FormControl type="text" placeholder='i.e. {"result":true, "count":42} ' onChange={this.handleChangeState('jsonString')}/>
          <br/>
          <Button bsStyle="primary" onClick={this.handleAddDb}>Add To Db</Button>
        </FormGroup>

      </div>
    );
  }
}

export default hot(module)(App);
