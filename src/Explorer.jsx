import React, { Component } from 'react';
import {
  Jumbotron,
  FormGroup,
  ControlLabel,
  Button,
  FormControl,
} from 'react-bootstrap';
import { hot } from 'react-hot-loader';
import uuid from 'uuid';

const devery = require('@devery/devery');
const dbHelper = require('./libs/orbitHelper');

const DeveryRegistry = devery.DeveryRegistry;
const deveryRegistryClient = new DeveryRegistry();

class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleInfoChange = this.handleInfoChange.bind(this);
    this.handleProduct = this.handleProduct.bind(this);
    this.handleMark = this.handleMark.bind(this);
    this.handleGenerateItem = this.handleGenerateItem.bind(this);
    this.handleCheckItem = this.handleCheckItem.bind(this);
    this.handleGetBrand = this.handleGetBrand.bind(this);
    this.handleBrandAddrChange = this.handleBrandAddrChange.bind(this);
    this.handleAddBrandAddrChange = this.handleAddBrandAddrChange.bind(this);
    this.handleAddBrandNameChange = this.handleAddBrandNameChange.bind(this);
    this.handleAddBrand = this.handleAddBrand.bind(this);
    this.handleSetAccount = this.handleSetAccount.bind(this);
    this.handleMarkProductAddrChange = this.handleMarkProductAddrChange.bind(this);
    this.handleSetAccountAddrChange = this.handleSetAccountAddrChange.bind(this);

    this.handleGetProduct = this.handleGetProduct.bind(this);
    this.handleProductAddrChange = this.handleProductAddrChange.bind(this);
    this.handleAddProductAddrChange = this.handleAddProductAddrChange.bind(this);
    this.handleAddProductNameChange = this.handleAddProductNameChange.bind(this);
    this.handleAddProduct = this.handleAddProduct.bind(this);

    this.handleDbNameChange = this.handleDbNameChange.bind(this);
    this.handleJsonChange = this.handleJsonChange.bind(this);
    this.handleAddDb = this.handleAddDb.bind(this);

    this.handleitemAddrChange = this.handleitemAddrChange.bind(this);

    this.state = {
      info: '',
      appAddress: '0xf8b908e7DBb3a0f2581aa8F1962f9360e10DC059',
      appName: 'Not Loaded',
      brandAddr: '0xf8b908e7DBb3a0f2581aa8F1962f9360e10DC059',
      brandName: 'Not Loaded',
      productAddress: '0x2a6aa0af60f753e020030d5fe7cf1a6da3de9a81',
      productName: 'Not Loaded',
      itemAddress: '',
      itemProductAccount: '',
      itemBrandAccount: '',
      itemAppAccount: '',
      noApps: '0',
      account: 'Please sign in to MetaMask',
      checkBrandAddr: '',
      brandInfo: '',
      markProductAddr: '0x2a6aa0af60f753e020030d5fe7cf1a6da3de9a81',

      appAccounts: 'No Accounts Loaded',
      appInfo: 'No App Info Loaded',

      brandAccounts: 'No Accounts Loaded',

      productAccount: 'No Products Loaded',

      itemCheckAddr: 'No Addr'
    };
  }

  componentWillMount() {
    setInterval(() => this.checkMetaMask(), 1000);
  }

  checkMetaMask() {
    // Checks for active MetaMask account info.
    if(web3.eth.accounts[0] === undefined){
      this.setState({
        account: 'Please sign in to MetaMask.',
      });
      return;
    }
    if (web3.eth.accounts[0] !== this.state.account) {
      this.setState({
        account: web3.eth.accounts[0],
      });
    }
  }

  handleitemAddrChange(e){
    this.setState({itemAddress: e.target.value});
  }

  handleBrandAddrChange(e){
    this.setState({checkBrandAddr: e.target.value});
  }

  handleAddBrandAddrChange(e){
    this.setState({addBrandAddr: e.target.value});
  }

  handleAddBrandNameChange(e){
    this.setState({addBrandName: e.target.value});
  }

  handleAddBrand(){
    this.addBrand(this.state.addBrandAddr, this.state.addBrandName);
  }

  handleGetBrand(){
    this.getBrand();
  }

  handleProductAddrChange(e){
    this.setState({checkProductAddr: e.target.value});
  }

  handleAddProductAddrChange(e){
    this.setState({addProductAddr: e.target.value});
  }

  handleAddProductNameChange(e){
    this.setState({addProductName: e.target.value});
  }

  handleAddProduct(){
    this.addProduct(this.state.addProductAddr, this.state.addProductName);
  }

  handleGetProduct(){
    this.getProduct();
  }

  handleInfoChange(e) {
    this.setState({ info: e.target.value });
  }

  handleProduct() {
    this.getProduct();
  }

  handleMark() {
    this.markItem();
  }

  handleGenerateItem() {
    this.setState({itemAddress: devery.Utils.getRandomAddress() });
  }

  handleCheckItem() {
    this.checkItemMarker();
  }

  handleSetAccount() {
    this.SetAccount();
  }

  handleMarkProductAddrChange(e) {
    this.setState({markProductAddr: e.target.value});
  }

  handleSetAccountAddrChange(e) {
    this.setState({ setAccountAddr: e.target.value});
  }

  handleDbNameChange(e) {
    this.setState({dbName: e.target.value});
  }

  handleJsonChange(e) {
    this.setState({jsonString: e.target.value});
  }

  handleAddDb(){
    console.log('saving to db: ' + this.state.dbName);
    console.log(this.state.jsonString);
    let js = JSON.parse(this.state.jsonString);
    console.log(js);

    this.SaveToDb(this.state.dbName, js);
  }

  async SaveToDb(DbName, Record){
    await dbHelper.saveRecord(DbName, Record);
  }

  async SetAccount(){
    console.log('Setting: ' + this.state.setAccountAddr)
    await deveryRegistryClient.permissionMarker(this.state.setAccountAddr, true);
  }

  async getApp() {
    const noApps = await deveryRegistryClient.appAccountsLength();
    this.setState({ noApps });

    const app = await deveryRegistryClient.getApp(this.state.appAddress);
    if (app.active) {
      this.setState({ appName: app.appName });
      let transaction = await deveryRegistryClient.updateApp("AutoApp", this.state.appAddress, 0, true);
      await deveryRegistryClient.permissionMarker(this.state.appAddress, true);
    } else {
      this.setState({ appName: "AutoApp doesn't exist. Creating..." });
      this.createApp();
    }

  }

  async createApp() {
    try {
      const transaction = await deveryRegistryClient.addApp(
        'AutoApp',
        this.state.appAddress,
        0,
      );
      await deveryRegistryClient.permissionMarker(this.state.appAddress, true);
      // console.log('transaction address',transaction.hash);
    } catch (err) {
      console.log(err);
      if (err.message.indexOf('User denied')) {
        console.log('The user denied the transaction');
        this.setState({ appName: 'The user denied the transaction' });
      }
    }
  }

  async getBrand() {
    this.setState({ brandInfo: 'Loading Brand Info...' });
    const brand = await deveryRegistryClient.getBrand(this.state.checkBrandAddr);
    if (!brand.active) {
      console.log('No brand');
      this.setState({ brandInfo: 'No Brand' });
    } else {
      console.log(brand);
      this.setState({ brandInfo: brand });

      let addressArr = await deveryRegistryClient.brandAccountsPaginated();
    }
  }

  async addBrand(Addr, Name){
    console.log('Adding Brand: ' + Addr + ', ' + Name);
    try {
      const brand = await deveryRegistryClient.addBrand(Addr, Name);
    }
    catch (err) {
      console.log(err);
    }
  }

  async getProduct() {
    console.log('Getting Product info: ' + this.state.checkProductAddr);
    const Product = await deveryRegistryClient.getProduct(this.state.checkProductAddr);
    if (!Product.active) {
      console.log('No Product');
      this.setState({ productInfo: 'No product' });
    } else {
      console.log(Product);
      this.setState({ productInfo: Product });
    }
  }

  async addProduct(Addr, Name){
    console.log('Adding product: ' + Addr + ', ' + Name);
    try {
      const product = await deveryRegistryClient.addProduct(
        Addr,
        Name,
        'Accredited: 7823B12AE',
        1999,
        'Kirknewton')
    }
    catch (err) {
      console.log(err);
    }
  }

  async checkItemMarker() {

    console.log('Checking Item: ' + this.state.itemCheckAddr)
    const item = await deveryRegistryClient.check(this.state.itemCheckAddr);
    this.setState({
      itemProductAccount: item.productAccount,
      itemBrandAccount: item.brandAccount,
      itemAppAccount: item.appAccount,
    });
  }

  async markItem() {
    const hash = await deveryRegistryClient.addressHash(
      this.state.itemAddress,
    );

    console.log(this.state.markProductAddr, hash);
    await deveryRegistryClient.mark(this.state.markProductAddr, hash);
  }

  // APP INFO
  handleGetAppAccounts(){
    this.setState({appAccounts: 'Getting App Accounts...'});
    this.GetAppAcounts();
  }

  async GetAppAcounts(){
    let addressArr = await deveryRegistryClient.appAccountsPaginated();
    this.setState({appAccounts: addressArr});
  }

  handleAppAccountChange(e) {
    this.setState({appAccount: e.target.value});
  }

  handleGetApp(){
    this.setState({appInfo: 'Getting App Info...'});
    this.GetAppInfo();
  }

  async GetAppInfo(){
    let info = await deveryRegistryClient.getApp(this.state.appAccount);
    this.setState({appInfo: info});
  }

  // BRAND INFO
  handleGetBrandAccounts(){
    this.setState({brandAccounts: 'Getting Brand Accounts...'});
    this.GetBrandAcounts();
  }

  async GetBrandAcounts(){
    let addressArr = await deveryRegistryClient.brandAccountsPaginated();
    this.setState({brandAccounts: addressArr});
  }

  // PRODUCT INFO
  handleGetProductAccounts(){
    this.setState({productAccounts: 'Getting Product Accounts...'});
    this.GetProductAcounts();
  }

  async GetProductAcounts(){
    let addressArr = await deveryRegistryClient.productAccountsPaginated();
    this.setState({productAccounts: addressArr});
  }

  handleItemCheckChange(e){
    this.setState({itemCheckAddr: e.target.value});
  }

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
          <Button bsStyle="primary" onClick={(e) => this.handleGetAppAccounts(e)}>Get App Accounts</Button>
        </FormGroup>

        <FormGroup>
          <ControlLabel>Get App:</ControlLabel>
          <FormControl.Static>App Info: active, appAccount, appName, fee, feeAccount</FormControl.Static>
          <FormControl type="text" placeholder="App Address" onChange={(e) => this.handleAppAccountChange(e)}/>
          <FormControl componentClass="textarea" value={this.state.appInfo}/>
          <br/>
          <Button bsStyle="primary" onClick={(e) => this.handleGetApp(e)}>Get App</Button>
        </FormGroup>

        <h2>BRAND INFO</h2>

        <FormGroup>
          <ControlLabel>Get Brand Accounts:</ControlLabel>
          <FormControl.Static>This gets ALL brand accounts. i.e. Not just for your app.</FormControl.Static>
          <FormControl componentClass="textarea" value={this.state.brandAccounts}/>
          <br/>
          <Button bsStyle="primary" onClick={(e) => this.handleGetBrandAccounts(e)}>Get Brand Accounts</Button>
        </FormGroup>

        <FormGroup>
          <ControlLabel>Get Brand Info:</ControlLabel>
          <FormControl.Static>Brand Info: brandAccount, appAccount, brandName, active</FormControl.Static>
          <FormControl type="text" placeholder="Enter Brand Address" onChange={this.handleBrandAddrChange}/>
          <FormControl componentClass="textarea" value={this.state.brandInfo}/>
          <br/>
          <Button bsStyle="primary" onClick={this.handleGetBrand}>Get Brand Info</Button>
        </FormGroup>

        <FormGroup>
          <ControlLabel>Add A Brand:</ControlLabel>
          <FormControl.Static>Brands can only be added by app owner account so make sure correct MetaMask!</FormControl.Static>
          <FormControl.Static>Brand Account is basically the account that controls it (i.e. adding brand products) so it might be useful to use a MetaMask account.</FormControl.Static>
          <FormControl type="text" placeholder="Brand Address" onChange={this.handleAddBrandAddrChange}/>
          <FormControl type="text" placeholder="Brand Name" onChange={this.handleAddBrandNameChange}/>
          <br/>
          <Button bsStyle="primary" onClick={this.handleAddBrand}>Add Brand</Button>
        </FormGroup>

        <h2>PRODUCT INFO</h2>

        <FormGroup>
          <ControlLabel>Get Product Accounts:</ControlLabel>
          <FormControl.Static>This gets ALL product accounts. i.e. Not just for your app/brand.</FormControl.Static>
          <FormControl componentClass="textarea" value={this.state.productAccounts}/>
          <br/>
          <Button bsStyle="primary" onClick={(e) => this.handleGetProductAccounts(e)}>Get Product Accounts</Button>
        </FormGroup>

        <FormGroup>
          <ControlLabel>Get Product Info:</ControlLabel>
          <FormControl.Static>Product Info: productAccount, brandAccount, description, details, year, origin, active</FormControl.Static>
          <FormControl type="text" placeholder="Enter A Product Address" onChange={this.handleProductAddrChange}/>
          <FormControl componentClass="textarea" value={this.state.productInfo}/>
          <br/>
          <Button bsStyle="primary" onClick={this.handleGetProduct}>Get Product Info</Button>
        </FormGroup>

        <FormGroup>
          <ControlLabel>Add Product:</ControlLabel>
          <FormControl.Static>Product takes account that added it as its brand.</FormControl.Static>
          <FormControl.Static>If your MetaMask account doesn’t have a brand then you can’t add a product.</FormControl.Static>
          <FormControl type="text" placeholder="Product Address" onChange={this.handleAddProductAddrChange}/>
          <FormControl type="text" placeholder="Product Name" onChange={this.handleAddProductNameChange} />
          <br/>
          <Button bsStyle="primary" onClick={this.handleAddProduct}>Add Product</Button>
        </FormGroup>

        <h2>MARKING</h2>

        <FormGroup>
          <ControlLabel>Allow Account To Mark:</ControlLabel>
          <FormControl.Static>An Account has to have permission set before it can Mark.</FormControl.Static>
          <FormControl type="text" placeholder='Account To Set' onChange={this.handleSetAccountAddrChange}/>
          <br/>
          <Button bsStyle="primary" onClick={this.handleSetAccount}>Set Account Permission</Button>
        </FormGroup>

        <FormGroup>
          <ControlLabel>Mark Item With Product: </ControlLabel>
          <FormControl.Static>You can only mark an item with a product from the products brand account.</FormControl.Static>
          <FormControl.Static>An item can be marked more than once but most recent state is only one recalled by check.</FormControl.Static>
          <FormControl.Static>Can generate a random Item address below.</FormControl.Static>
          <FormControl type="text" placeholder='Product Address' onChange={this.handleMarkProductAddrChange}/>
          <FormControl type="text" placeholder='Item Address' onChange={this.handleitemAddrChange}/>
          <br/>
          <Button bsStyle="primary" onClick={this.handleMark}>Mark Item</Button>
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
          <FormControl type="text" placeholder='Item Address To Check' onChange={(e) => this.handleItemCheckChange(e)}/>
          <p>itemProductAccount: {this.state.itemProductAccount}</p>
          <p>itemBrandAccount: {this.state.itemBrandAccount}</p>
          <p>itemAppAccount: {this.state.itemAppAccount}</p>
          <Button bsStyle="primary" onClick={this.handleCheckItem}>Check Item</Button>
        </FormGroup>

        <h2>OrbitDb</h2>
        <FormGroup controlId="formControlItem">
          <h4>Add To Db (Random ID: {uuid.v4()})</h4>
          <ControlLabel>DB Name:</ControlLabel>
          <FormControl type="text" placeholder='i.e. brands' onChange={this.handleDbNameChange}/>
          <ControlLabel>JSON String:</ControlLabel>
          <FormControl type="text" placeholder='i.e. {"result":true, "count":42} ' onChange={this.handleJsonChange}/>
          <br/>
          <Button bsStyle="primary" onClick={this.handleAddDb}>Add To Db</Button>
        </FormGroup>

      </div>
    );
  }
}

export default hot(module)(App);
