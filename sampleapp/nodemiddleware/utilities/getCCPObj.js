// load the network configuration
const ccpPath = path.resolve(__dirname, '..', 'fabric-artifacts', 'hlf-connection-profile.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8')
const ccp = JSON.parse(ccpJSON);

module.exports = ccp;
