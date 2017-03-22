class Account extends Blockchain {

  constructor() {
    super();
    this.doRead = this.doRead.bind( this );
  }

  read( email, password ) {
    this.xhr.addEventListener( 'load', this.doRead );
    this.request( {
      method: Blockchain.QUERY,
      operation: Account.READ,
      values: [email, password]
    } );
  }

  doRead( evt ) {
    let data = JSON.parse( this.xhr.responseText );
    let result = JSON.parse( data.result.message );

    this.emit( Account.READ, result );

    this.xhr.removeEventListener( 'load', this.doRead );
  }

}

Account.READ = 'account_read';
