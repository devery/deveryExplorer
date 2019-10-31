/* eslint-disable no-unused-expressions,class-methods-use-this,prefer-promise-reject-errors */

import { DeveryERC721, DeveryRegistry, EveToken, Utils } from '@devery/devery';

export const eveTokenClient = new EveToken();
export const deveryERC721Client = new DeveryERC721();
export const deveryRegistryClient = new DeveryRegistry();

const checkAndUpdateAllowanceOfContract = contractAddress => async (
  account,
  minAllowance = 40,
  total = 100,
) => {
  try {
    const currentAllowance = await eveTokenClient.allowance(
      account,
      contractAddress,
    );
    if (parseFloat(currentAllowance.toString()) / 10e17 >= minAllowance) return;

    const { hash } = await eveTokenClient.approve(
      contractAddress,
      `${total}000000000000000000`,
    );
    const { provider } = eveTokenClient.getProvider();
    await provider.waitForTransaction(hash);
  } catch (e) {
    console.error(e);
  }
};

export const registryContractAddress =
  '0x0364a98148b7031451e79b93449b20090d79702a';
export const ercContractAddress = '0x032ef0359eb068d3dddd6e91021c02f397afce5a';

const allowanceForRegistry = checkAndUpdateAllowanceOfContract(
  registryContractAddress,
);
const allowanceForERC = checkAndUpdateAllowanceOfContract(ercContractAddress);

// All devery methods used in this example can be found at https://devery.github.io/deveryjs/

class DeveryExplorer {
  getAccount(cb) {
    if (!window.web3) return;

    if (window.web3.eth && window.web3.eth.accounts) {
      cb(window.web3.eth.accounts[0]);
    }

    if (window.web3.currentProvider) {
      window.web3.currentProvider.isMetaMask &&
        window.web3.currentProvider.enable();
      window.web3.currentProvider.publicConfigStore.on(
        'update',
        ({ selectedAddress }) => cb(selectedAddress),
      );
    }
  }

  async checkAndUpdateAllowance(account) {
    await allowanceForERC(account);
    await allowanceForRegistry(account);
  }

  async getBrand(addr) {
    const Brand = await deveryRegistryClient.getBrand(addr);
    if (!Brand.active) return Promise.reject('No active brand');
    return Promise.resolve(Brand);
  }

  async getProduct(addr) {
    const Product = await deveryRegistryClient.getProduct(addr);
    if (!Product.active) return Promise.reject('No product');
    return Promise.resolve(Product);
  }

  getAppAccounts() {
    return deveryRegistryClient.appAccountsPaginated();
  }

  getApp(addr) {
    return deveryRegistryClient.getApp(addr);
  }

  getBrandAccounts() {
    return deveryRegistryClient.brandAccountsPaginated();
  }

  getProductAccounts() {
    return deveryRegistryClient.productAccountsPaginated();
  }

  checkItem(addr) {
    return deveryRegistryClient.check(addr);
  }

  permissionMarker(addr, permission = true) {
    return deveryRegistryClient.permissionMarker(addr, permission);
  }

  getProductsByOwner(addr) {
    return deveryERC721Client.getProductsByOwner(addr);
  }

  async markProduct(itemAddress, markProductAddr) {
    const hash = await deveryRegistryClient.addressHash(itemAddress);

    return deveryRegistryClient.mark(markProductAddr, hash);
  }

  async addApp(account, data) {
    try {
      await deveryRegistryClient.addApp(data, account, 0);
    } catch (e) {
      if (e.message.indexOf('User denied')) {
        console.log('The user denied the transaction');
      }
    }
  }

  async permissionAccount(account) {
    try {
      await deveryRegistryClient.permissionMarker(account, true);
    } catch (e) {
      if (e.message.indexOf('User denied')) {
        console.log('The user denied the transaction');
      }
    }
  }

  async addBrand(account, data) {
    try {
      await deveryRegistryClient.addBrand(account, data);
    } catch (e) {
      if (e.message.indexOf('User denied')) {
        console.log('The user denied the transaction');
      }
    }
  }

  async addProduct(data) {
    try {
      const productAddress = Utils.getRandomAddress();
      await deveryRegistryClient.addProduct(
        productAddress,
        data,
        'batch 001',
        new Date().getFullYear(),
        'Unknown place',
      );
      const hash = await deveryRegistryClient.addressHash(productAddress);
      const txn = await deveryRegistryClient.mark(productAddress, hash);

      const { provider } = deveryERC721Client.getProvider();
      await provider.waitForTransaction(txn.hash);
      deveryERC721Client.claimProduct(productAddress, 1);
    } catch (e) {
      if (e.message.indexOf('User denied')) {
        console.log('The user denied the transaction');
      }
    }
  }

  async safeTransferTo(fromAddress, toAddress, tokenId) {
    try {
      await deveryERC721Client.safeTransferFrom(
        fromAddress,
        toAddress,
        tokenId,
      );
    } catch (e) {
      if (
        e.message.indexOf(
          'gas required exceeds allowance or always failing transaction',
        )
      ) {
        console.log('You do not own the product you are trying to transfer');
      }
    }
  }
}

export default new DeveryExplorer();
