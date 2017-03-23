class Blockchain {

  static request( route ) {
    return new Promise( ( resolve, reject ) => {
      let xhr = new XMLHttpRequest();
      xhr.addEventListener( 'error', evt => {
        reject( xhr.statusText );
      } );
      xhr.addEventListener( 'load', evt => {
        let data = JSON.parse( xhr.responseText );
        let result = null;

        try {
          result = JSON.parse( data.result.message );
        } catch( e ) {
          result = data.result.message;
        }

        resolve( result );
      } );
      xhr.open( 'POST', Blockchain.URL, true );
      xhr.setRequestHeader( 'Content-Type', 'application/json' );
      xhr.send( JSON.stringify( {
        jsonrpc: '2.0',
        method: route.method,
        params: {
          chaincodeID: {
            name: Blockchain.CHAINCODE
          },
          ctorMsg: {
            function: route.operation,
            args: route.values
          },
          secureContext: Blockchain.USER,
          type: 1
        },
        id: 1        
      } ) );
    } );
  }
  
}

Blockchain.CHAINCODE = '32cc6900893f59c2e9afe28ce934f8f9a0305a4f10c6d6c20c4ed7d980da7025313d73c2a27a9e0153f8ce2b0353121293a197177c9a87fc35fb203d66d8bd04';
Blockchain.URL = 'https://ba5d025f326946a1a17a37c120fd233c-vp0.us.blockchain.ibm.com:5002/chaincode';
Blockchain.USER = 'user_type1_0';

Blockchain.QUERY = 'query';
Blockchain.INVOKE = 'invoke';
