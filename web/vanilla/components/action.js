class Action {

  constructor( path ) {
    // Root element
    this.root = document.querySelector( path );

    // Removable event handler
    this.doComposeLeave = this.doComposeLeave.bind( this );

    // Add button
    this.compose = this.root.querySelector( 'button.compose' );
    this.compose.addEventListener( 'mouseover', evt => this.doComposeOver( evt ) );
    this.compose.addEventListener( 'click', evt => this.doComposeClick( evt ) );

    this.location = this.root.querySelector( 'button.location' );
    this.location.addEventListener( 'click', evt => this.doLocationClick( evt ) );

    this.account = this.root.querySelector( 'button.account' );
    this.account.addEventListener( 'click', evt => this.doAccountClick( evt ) );    
  }
	
  doAccountClick( evt ) {
    console.log( 'Account.' );
  }

  doComposeClick( evt ) {
    console.log( 'To Do.' );
  }

  doComposeLeave( evt ) {
    this.location.style.opacity = 0;
    this.account.style.opacity = 0;

    this.compose.classList.remove( 'todo' );

    this.root.removeEventListener( 'mouseleave', this.doComposeLeave );
  }

  doComposeOver( evt ) {
    this.root.addEventListener( 'mouseleave', this.doComposeLeave );    

    this.compose.classList.add( 'todo' );

    this.location.style.opacity = 1;
    this.account.style.opacity = 1;
  }

  doLocationClick( evt ) {
    console.log( 'Location.' );
  }

}
