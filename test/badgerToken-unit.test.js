const { expect } = require("chai");
const hre = require("hardhat");

describe("BadgerToken Unit Test", function () {
  let token,
    badgerToken,
    owner,
    user1,
    user2,
    tokenCap = 1000000;

  beforeEach(async function () {
    token = await ethers.getContractFactory("BadgerToken");
    [owner, user1, user2] = await hre.ethers.getSigners();
    badgerToken = await token.deploy(tokenCap);
  });

  describe("On Deployment", function () {
    it("Should confirm the owner", async function () {
      expect(await badgerToken.owner()).to.equal(owner.address);
    });

    it("Supply of tokens to owner", async function () {
      const ownerBalance = await badgerToken.balanceOf(owner.address);
      expect(await badgerToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Token cap matching the initial amount provided", async function () {
      const cap = await badgerToken.cap();
      expect(Number(hre.ethers.utils.formatEther(cap))).to.equal(tokenCap);
    });
  });

  describe("Transactions", function () {
    it("Transactions between accounts", async function () {
      await badgerToken.transfer(user1.address, 100);
      const user1Balance = await badgerToken.balanceOf(user1.address);
      expect(user1Balance).to.equal(100);

      await badgerToken.connect(user1).transfer(user2.address, 100);
      const user2Balance = await badgerToken.balanceOf(user2.address);
      expect(user2Balance).to.equal(100);
    });

    it("Fail check for insufficient funds", async function () {
      const initialOwnerBalance = await badgerToken.balanceOf(owner.address);

      await expect(
        badgerToken.connect(user1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      expect(await badgerToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Updating balances", async function () {
      const initialOwnerBalance = await badgerToken.balanceOf(owner.address);

      // Transfer 100 to user 1 and 150 to user 2 respectively, checking balances of all three after.
      await badgerToken.transfer(user1.address, 100);

      await badgerToken.transfer(user2.address, 150);

      const finalOwnerBalance = await badgerToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(250));

      const user1Balance = await badgerToken.balanceOf(user1.address);
      expect(user1Balance).to.equal(100);

      const user2Balance = await badgerToken.balanceOf(user2.address);
      expect(user2Balance).to.equal(150);
    });
  });
});
