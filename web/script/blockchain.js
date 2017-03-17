class Blockchain {

  constructor() {
    this.listeners = [];
    this.xhr = null;
  }

  addTask( task ) {
    this.xhr = new XMLHttpRequest();
    this.xhr.addEventListener( 'load', evt => this.doTaskAdd( evt ) );
    this.xhr.open( 'POST', Blockchain.OPEN_WHISK, true );
    this.xhr.setRequestHeader( 'Content-Type', 'application/json' );
    this.xhr.send( JSON.stringify( {
      message: {
        jsonrpc: '2.0',
        method: Blockchain.INVOKE_METHOD,
        params: {
          chaincodeID: {
            name: Blockchain.CHAINCODE
          },
          ctorMsg: {
            function: Blockchain.TASK_ADD,
            args: [
              task.id, 
              task.account, 
              task.name, 
              task.due.toString(), 
              task.location, 
              task.duration.toString(), 
              task.energy.toString(),
              task.created.toString()
            ]
          },
          secureContext: Blockchain.USER,
          type: 1
        },
        id: 1                
      }
    } ) );            
  }

  browseLocation( account ) {
    this.xhr = new XMLHttpRequest();
    this.xhr.addEventListener( 'load', evt => this.doLocationLoad( evt ) );
    this.xhr.open( 'POST', Blockchain.URL, true );
    this.xhr.setRequestHeader( 'Content-Type', 'application/json' );
    this.xhr.send( JSON.stringify( {
      jsonrpc: '2.0',
      method: Blockchain.QUERY_METHOD,
      params: {
        chaincodeID: {
          name: Blockchain.CHAINCODE
        },
        ctorMsg: {
          function: Blockchain.LOCATION_BROWSE,
          args: [account]
        },
        secureContext: Blockchain.USER,
        type: 1
      },
      id: 1                
    } ) );        
  }

  browseTask( account ) {
    this.xhr = new XMLHttpRequest();
    this.xhr.addEventListener( 'load', evt => this.doTaskLoad( evt ) );
    this.xhr.open( 'POST', Blockchain.URL, true );
    this.xhr.setRequestHeader( 'Content-Type', 'application/json' );
    this.xhr.send( JSON.stringify( {
      jsonrpc: '2.0',
      method: Blockchain.QUERY_METHOD,
      params: {
        chaincodeID: {
          name: Blockchain.CHAINCODE
        },
        ctorMsg: {
          function: Blockchain.TASK_BROWSE,
          args: [account]
        },
        secureContext: Blockchain.USER,
        type: 1
      },
      id: 1                
    } ) );    
  }

  login( email, password ) {
    this.xhr = new XMLHttpRequest();
    this.xhr.addEventListener( 'load', evt => this.doLoginLoad( evt ) );
    this.xhr.open( 'POST', Blockchain.URL, true );
    this.xhr.setRequestHeader( 'Content-Type', 'application/json' );
    this.xhr.send( JSON.stringify( {
        jsonrpc: '2.0',
        method: Blockchain.QUERY_METHOD,
        params: {
          chaincodeID: {
            name: Blockchain.CHAINCODE
          },
          ctorMsg: {
            function: Blockchain.ACCOUNT_READ,
            args: [email, password]
          },
          secureContext: Blockchain.USER,
          type: 1
        },
        id: 1                
      } ) 
    );
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

  doLocationLoad( evt ) {
    let data = JSON.parse( this.xhr.responseText );
    let result = JSON.parse( data.result.message );

    if( result == null ) {
      result = [];
    }

    this.emit( Blockchain.LOCATION_LIST, result );
  }

  doLoginLoad( evt ) {
    let data = JSON.parse( this.xhr.responseText );
    let result = JSON.parse( data.result.message );

    if( result == null ) {
      this.emit( Blockchain.LOGIN_FAILURE, null );
    } else {
      this.emit( Blockchain.LOGIN_SUCCESS, result );
    }
  }

  doTaskAdd( evt ) {
    console.log( this.xhr.responseText );
  }

  doTaskLoad( evt ) {
    let data = JSON.parse( this.xhr.responseText );
    let result = JSON.parse( data.result.message );

    if( result == null ) {
      result = [];
    }

    this.emit( Blockchain.TASK_LIST, result );
  }

}

Blockchain.ACCOUNT_READ = 'account_read';
Blockchain.CHAINCODE = '32cc6900893f59c2e9afe28ce934f8f9a0305a4f10c6d6c20c4ed7d980da7025313d73c2a27a9e0153f8ce2b0353121293a197177c9a87fc35fb203d66d8bd04';
Blockchain.INVOKE_METHOD = 'invoke';
Blockchain.LOCATION_BROWSE = 'location_browse';
Blockchain.LOCATION_LIST = 'blockchain_location_list';
Blockchain.LOGIN_FAILURE = 'blockchain_login_failure';
Blockchain.LOGIN_SUCCESS = 'blockchain_login_success';
Blockchain.OPEN_WHISK = 'https://openwhisk.ng.bluemix.net/api/v1/experimental/web/krhoyt@us.ibm.com_dev/blockchain/command.json/body';
Blockchain.QUERY_METHOD = 'query';
Blockchain.TASK_ADD = 'task_add';
Blockchain.TASK_BROWSE = 'task_browse';
Blockchain.TASK_LIST = 'blockchain_task_list';
Blockchain.URL = 'https://ba5d025f326946a1a17a37c120fd233c-vp0.us.blockchain.ibm.com:5002/chaincode';
Blockchain.USER = 'user_type1_0';
