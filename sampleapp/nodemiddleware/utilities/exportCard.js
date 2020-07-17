const CardExport = require('composer-cli').Card.Export;
const express =  require('express');
const fs = require('fs');
const path = require("path")
const router = express.Router();

// let cardoptions = {
//   file: `admin@labsystems.card`,
//   // card: 'dan@penguin-network'
//   card:`admin@labsystems`
// }
// CardExport.handler(cardoptions);

    async function exportCard(pIdentifier,networkName,callback){
      
            const cardPath = `../${pIdentifier}@${networkName}.card`;
            const file = path.join(__dirname,cardPath)
            fs.exists(file,(result)=>{
              if(!result){
              console.log("Exporting the card...")
                        //Exporting the Card
              let cardoptions = {
                file: `${pIdentifier}@${networkName}.card`,
                // card: 'dan@penguin-network'
                card:`${pIdentifier}@${networkName}`
              };
                CardExport.handler(cardoptions)
                callback(true);
              }else{
                callback(false);
              }
            })

  }
  module.exports = exportCard;
