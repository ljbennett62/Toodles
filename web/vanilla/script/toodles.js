class Toodles {
  
  constructor() {
    this.blockchain = new Blockchain();
    this.blockchain.addEventListener( Blockchain.LOGIN_FAILURE, evt => this.doLoginFailure( evt ) );
    this.blockchain.addEventListener( Blockchain.LOGIN_SUCCESS, evt => this.doLoginSuccess( evt ) );    
    this.blockchain.addEventListener( Blockchain.TASK_LIST, evt => this.doTaskList( evt ) );
    this.blockchain.addEventListener( Blockchain.LOCATION_LIST, evt => this.doLocationList( evt ) );    

    this.account = new Account( '#account' );
    this.account.root.addEventListener( Account.LOGIN, evt => this.doLogin( evt ) );

    this.toolbar = new Toolbar( '#toolbar' );
    
    this.list = new List( '#list' );
    this.list.root.addEventListener( List.TASK_ADD, evt => this.doTaskAdd( evt ) );

    this.filter = document.querySelector( '#filter' );
    this.calendar = new Calendar( '#calendar' );
    
    this.location = new Location( '#location' );
    /*
    this.location.options( [
      'Cave',
      'Church',
      'Home',
      'Parker',
      'Groceries',
      'TKD',
      'Work'
    ] );
    */

    this.duration = new Duration( '#duration' );
    this.energy = new Energy( '#energy' );

    this.action = new Action( '#action' );
  }

  doLocationList( evt ) {
    this.location.options( evt );

    this.toolbar.show();

    this.filter.style.bottom = 0;
    this.filter.style.opacity = 1;    

    this.blockchain.browseTask( this.account.id );
  }

  doLogin( evt ) {
    this.blockchain.login(
      evt.detail.email,
      evt.detail.password
    );
  }

  doLoginFailure( evt ) {
    console.log( 'No matching account.' );
  }

  doLoginSuccess( evt ) {    
    this.blockchain.browseLocation( evt.id );

    this.account.id = evt.id;
    this.account.hide();    
  }

  doTaskAdd( evt ) {
    evt.detail.account = this.account.id;
    this.blockchain.addTask( evt.detail );
  }

  doTaskList( evt ) {
    this.list.data = evt;
    this.list.show();
  }

}

// Here we go!
let app = new Toodles();
