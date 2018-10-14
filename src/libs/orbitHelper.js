const IPFS = require('ipfs-api');
const OrbitDB = require('orbit-db');

// const ipfs = IpfsApi('localhost', '5001')
let ipfs;
let orbitdb;

/**
Helper library for using OrbitDB.
https://github.com/orbitdb/orbit-db
**/


export const LoadCars = async () => {
  /*
  Loads all car objects from cars db.
  {
    "_id": "bdb19370-ce3e-4799-b619-c53889180ee6",
    "owner": "0xf8b908e7dbb3a0f2581aa8f1962f9360e10dc059",
    "type": "Mustand",
    "model": "Ford",
    "year": "2018",
    "picHash": "https://s-media-cache-ak0.pinimg.com/736x/4a/ed/fa/4aedfa93b3c8785d55fd20362a1480d4.jpg",
    "isSelling": false,
    "created": "2018-10-08T17:04:14.795Z"
  }
  */
  console.log('Loading Cars...');
  ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
  orbitdb = new OrbitDB(ipfs);
  const db = await orbitdb.docs('cars');
  await db.load();
  console.log(db.address.toString())

  const all = db.query(doc => doc);

  if (all.length === 0) {
    console.log('No Cars');
    return [];
  }

  console.log('Cars: ');
  console.log(all);
  return all;
};


export const saveCar = async Car => {
  /*
  Saves a new car object to cars db.
  */
  console.log('Saving car...');
  console.log(Car);
  ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
  orbitdb = new OrbitDB(ipfs);
  const db = await orbitdb.docs('cars');
  await db.load();

  const hash = await db.put(Car);
  console.log('Ok.');
};


export const LoadBrands = async () => {
  /*
  Loads all brand objects from cars db.

  const newbrand = {
    _id: uuid.v4(),
    address: Addr,
    name: Name
  };
  */
  console.log('Loading Brands...')
  ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
  orbitdb = new OrbitDB(ipfs);
  const db = await orbitdb.docs('brands');
  await db.load();

  const all = db.query(doc => doc);

  if (all.length == 0) {
    console.log('No Brands');
    return [];
  } else {
    console.log('Brands: ');
    console.log(all);
    return all;
  }
};

export const saveRecord = async (DbName, Record) => {
  /*
  Saves a new record, Record, to specified db, Dbname.
  */

  console.log('Saving record to: ' + DbName);
  console.log(Record);
  ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
  orbitdb = new OrbitDB(ipfs);
  const db = await orbitdb.docs(DbName);
  await db.load();

  const hash = await db.put(Record);
  console.log('Ok.');
};

export const LoadBrandProducts = async (BrandAddress) => {
  /*
  Loads all product records for a specified brand.
  Product DB:
  {"_id":"eacdc32f-9b97-4dcd-b29f-642c2241624a",
  "brand":"0xeefc64d684a2de1566b9a3368150cc882aa0b683",
  "address":"0x9D827bbfE2D04e3c076384F5D659dE795e875C90",
  "name": "Tyre",
  "details":"PremiumTyre-17651",
  "year":"2018",
  "origin":"UK"}
  */
  console.log('Loading Brands...')
  ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
  orbitdb = new OrbitDB(ipfs);
  const db = await orbitdb.docs('products');
  await db.load();

  const all = db.query(doc => doc.brand.toLowerCase() == BrandAddress.toLowerCase());

  if (all.length == 0) {
    console.log('No Products');
    return [];
  } else {
    console.log('Products: ');
    console.log(all);
    return all;
  }
};

export const LoadCarItems = async (ID) => {
  /*
  Loads all item records for a specified car ID.
  const newItem = {
    _id: uuid.v4(),
    address: newItemAddress,
    brandAddress: this.props.brandInfo.address,
    brandName: this.props.brandInfo.name,
    productId: this.props.product._id,
    productName: this.props.product.name,
    productDetail: this.props.product.detail,
    carId: this.state.selectedCarId,
    date: new Date()
  };
  */
  console.log('Loading Items for: ' + ID);
  ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
  orbitdb = new OrbitDB(ipfs);
  const db = await orbitdb.docs('items');
  await db.load();

  const all = db.query(doc => doc.carId == ID);

  if (all.length == 0) {
    console.log('No Items');
    return [];
  } else {
    console.log('Items: ');
    console.log(all);
    return all;
  }

}

export const LoadBrandItems = async (BrandAddress) => {
    /*
    Loads all item records for a specified brand address.
    const newItem = {
      _id: uuid.v4(),
      address: newItemAddress,
      brandAddress: this.props.brandInfo.address,
      brandName: this.props.brandInfo.name,
      productId: this.props.product._id,
      productName: this.props.product.name,
      productDetail: this.props.product.detail,
      carId: this.state.selectedCarId,
      date: new Date()
    };
    */
  console.log('Loading Items for: ' + BrandAddress);
  ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
  orbitdb = new OrbitDB(ipfs);
  const db = await orbitdb.docs('items');
  await db.load();

  const all = db.query(doc => {

      if (doc.brandAddress == undefined){
        return false
      }
      return doc.brandAddress.toLowerCase() == BrandAddress.toLowerCase();
  });

  if (all.length == 0) {
    console.log('No Items');
    return [];
  } else {
    console.log('Items: ');
    console.log(all);
    return all;
  }

}
