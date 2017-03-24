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

Blockchain.CHAINCODE = '17abdb9fcc50d315a5f9239e7675baffafe72439cdb30c06f3d83d57c667ef48ffea02b639878d1a31f0025e0f2aef28f13e47fd15ec597555ada9d49de3e9f7';
Blockchain.URL = 'https://ba5d025f326946a1a17a37c120fd233c-vp0.us.blockchain.ibm.com:5002/chaincode';
Blockchain.USER = 'user_type1_0';

Blockchain.QUERY = 'query';
Blockchain.INVOKE = 'invoke';
