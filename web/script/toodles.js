class Toodles {

  constructor() {
    this.blockchain = new Blockchain();
    this.blockchain.addEventListener( Blockchain.LOGIN_SUCCESS, evt => this.doLoginSuccess( evt ) );
    this.blockchain.addEventListener( Blockchain.LOCATION_LIST, evt => this.doLocationList( evt ) );
    this.blockchain.addEventListener( Blockchain.TASK_LIST, evt => this.doTaskList( evt ) );    

    this.account = document.querySelector( 'toodles-account' );
    this.account.addEventListener( Account.SIGN_IN, evt => this.doSignIn( evt ) );

    this.toolbar = document.querySelector( 'toodles-toolbar' );
    this.list = document.querySelector( 'toodles-list' );
    this.filter = document.querySelector( 'toodles-filter' );
    this.action = document.querySelector( 'toodles-action' );
  }

  doLocationList( evt ) {
    // Sort list
    evt = evt.sort( ( a, b ) => {
      if( a.name.toUpperCase() < b.name.toUpperCase() ) {
        return -1;
      }

      if( a.name.toUpperCase() > b.name.toUpperCase() ) {
        return 1;
      }

      return 0;
    } );    

    // Push default to front of list
    evt.unshift( {
      id: null,
      account: null,
      name: 'Any'
    } );

    // Assign and show
    this.filter.places = evt;
    this.filter.show();

    this.blockchain.browseTask( this.account.id );
  }

  doLoginSuccess( evt ) {
    this.account.id = evt.id;
    this.account.hide();
    this.toolbar.show();
    this.blockchain.browseLocation( this.account.id );
  }

  doSignIn( evt ) {
    this.blockchain.login( evt.detail.email, evt.detail.password );
  }

  doTaskList( evt ) {
    this.list.data = evt;
    this.list.show();
    this.action.show();
  }

}

let app = new Toodles();
