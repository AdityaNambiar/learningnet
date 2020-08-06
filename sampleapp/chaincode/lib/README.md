# Lib directory

- Consists of the smart contract and a `models/` folder. 

## Models directory
- This is a user-defined directory. It can be named anything but my reason to give this name is to make it analogous to Hyperledger Composer's model directory and its purpose.
- This folder consists (and can consist) of various JS classes. These classes are child classes of the Ledger API and utilize the methods defined over there. 
- The idealogy one should have while creating asset and registry classes under this directory is:
  - All assets are simply objects. Objects have properties. You have the freedom to decide how your asset would look like, which properties should act as the unique identifier(s) for a certain asset. 
  - Registries are not exactly stored in the blockchain. Create these classes to be able to perform operations on your defined assets. It doesn't even need to be called a 'registry' but I named it like this to make it analogous to the Hyperledger Composer registry concept.
    - I am unsure whether Composer stored the registries on the Fabric Blockchain but all registries facilitated CRUD operations on assets stored in them and this is what I tried to make use of. 
  - _Each_ asset must be defined in seperate JS classes and _each_ registry must be defined in seperate JS classes. This is a good practise for code readability and accessibility.
  
## Smart contract
- The topic has been covered in [Developing Applications/Smart Contract Processing](https://hyperledger-fabric.readthedocs.io/en/latest/developapps/smartcontract.html)
- This contract was written in JS and utilizes the models under `models/`. 
