class Blockchain {

  constructor() {
    this.listeners = [];
    this.xhr = new XMLHttpRequest();
  }

  addEventListener( label, callback ) {
    this.listeners.push( {
      label: label,
      callback: callback
    } );
  }

  emit( label, evt ) {
    for( let h = 0; h < this.listeners.length; h++ ) {
      if( this.listeners[h].label == label ) {
        this.listeners[h].callback( evt );
      }
    }
  }

  request( route ) {
    // Build message
    let message = {
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
    }; 

    // Confirm content
    console.log( message );

    // Make request
    this.xhr.open( 'POST', Blockchain.URL, true );
    this.xhr.setRequestHeader( 'Content-Type', 'application/json' );
    this.xhr.send( JSON.stringify( message ) ); 
  }
  
}

Blockchain.CHAINCODE = '32cc6900893f59c2e9afe28ce934f8f9a0305a4f10c6d6c20c4ed7d980da7025313d73c2a27a9e0153f8ce2b0353121293a197177c9a87fc35fb203d66d8bd04';
Blockchain.URL = 'https://ba5d025f326946a1a17a37c120fd233c-vp0.us.blockchain.ibm.com:5002/chaincode';
Blockchain.USER = 'user_type1_0';

Blockchain.QUERY = 'query';
Blockchain.INVOKE = 'invoke';
