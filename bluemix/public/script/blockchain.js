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

Blockchain.CHAINCODE = '7721bc7da47454354e074589798d9ef3ae59be24a0fb8705b190b6b9e4c28ab7a38ca1df36537a25873f3660672e37d8e3b37c54c5c0432f3415f6c04c36ff1a';
Blockchain.URL = 'https://ba5d025f326946a1a17a37c120fd233c-vp0.us.blockchain.ibm.com:5002/chaincode';
Blockchain.USER = 'user_type1_0';

Blockchain.QUERY = 'query';
Blockchain.INVOKE = 'invoke';
