/**
 * @deprecated
 */

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');

const ccp = require('./getCCPObj.js');
const generateAffiliation = require('./generateAffiliation.js');


const getRegisteredUser = async (username, pType, pIdentifier) => {

    console.log(JSON.stringify(Wallets))

    // Create a new CA client for interacting with the CA.
    const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
    const ca = new FabricCAServices(caURL);
    const fsWalletPath =  path.join(process.cwd(), 'wallet'); // process.cwd() = current working directory
    if (!fs.existsSync(fsWalletPath)){
        fs.mkdirSync(fsWalletPath);
    }
    const wallet = await Wallets.newFileSystemWallet(fsWalletPath);
    console.log(`Wallet path: ${walletPath}`);

    const userIdentity = await wallet.get(username);
    if (userIdentity) {
        console.log(`An identity for the user ${username} already exists in the wallet`);
        var response = {
            success: true,
            message: username + ' enrolled Successfully',
        };
        return response
    }

    // Check to see if we've already enrolled the admin user.
    let adminIdentity = await wallet.get('admin');
    if (!adminIdentity) {
        console.log('An identity for the admin user "admin" does not exist in the wallet. Creating one...');
        await enrollAdmin();
        adminIdentity = await wallet.get('admin');
        console.log("OBSERVE -> admin identity: ",adminIdentity);
        console.log("Admin Enrolled Successfully")
    }

    // build a user object for authenticating with the CA
    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, 'admin');

    /**
     * CA User guide (very useful to practise the hands-on given on the site beforehand): 
     * https://hyperledger-fabric-ca.readthedocs.io/en/latest/users-guide.html
     */
    // Register the user, enroll the user, and import the new identity into the wallet.
    const secret = await ca.register({ 
            affiliation: 'org1.department1', 
            enrollmentID: username, 
            role: 'client',
             attrs: [
                {
                    name: 'pType',
                    value: pType,
                    ecert: true
                },
                {
                    name: 'pIdentifier',
                    value: pIdentifier,
                    ecert: true
                },
            ]
        }, adminUser);
    // const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: username, role: 'client', attrs: [{ name: 'role', value: 'approver', ecert: true }] }, adminUser);

    const enrollment = await ca.enroll({ enrollmentID: username, enrollmentSecret: secret });
    // const enrollment = await ca.enroll({ enrollmentID: username, enrollmentSecret: secret, attr_reqs: [{ name: 'role', optional: false }] });
    const x509Identity = {
        credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
        },
        mspId: 'Org1MSP',
        type: 'X.509',
    };

    await wallet.put(username, x509Identity);
    console.log(`Successfully registered and enrolled admin user ${username} and imported it into the wallet`);

    var response = {
        success: true,
        message: username + ' enrolled Successfully',
    };
    return response
}


const enrollAdmin = async () => {

    console.log('Enrolling admin...')

    try {

        const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const identity = await wallet.get('admin');
        if (identity) {
            console.log('An identity for the admin user "admin" already exists in the wallet');
            return;
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };
        await wallet.put('admin', x509Identity);
        console.log('Successfully enrolled admin user "admin" and imported it into the wallet');
        return


    } catch (error) {
        console.error(`Failed to enroll admin user "admin": ${error}`);
    }

}


exports.getRegisteredUser = getRegisteredUser