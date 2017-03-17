class Account {

  constructor( path ) {
    this.id = null;

    this.root = document.querySelector( path );

    let fields = this.root.querySelectorAll( 'div.input' );
    this.email = new TextField( fields[0] );
    this.password = new TextField( fields[1] );

    this.submit = this.root.querySelector( 'button' );
    this.submit.addEventListener( 'click', evt => this.doSubmit( evt ) );

    this.create = this.root.querySelector( '#create' );
    this.create.addEventListener( 'click', evt => this.doCreate( evt ) );
  }

  hide() {
    this.root.style.display = 'none';
  }

  show() {
    this.id = null;
    this.password.value = '';
    this.root.style.display = 'block';
  }

  doCreate( evt ) {
    console.log( 'Create.' );
  }

  doSubmit( evt ) {
    let valid = true;

    if( this.email.value.length == 0 ) {
      this.email.invalidate( true );
      valid = false;
    } else {
      this.email.invalidate( false );
    }

    if( this.password.value.length == 0 ) {
      this.password.invalidate( true );
      valid = false;
    } else {
      this.password.invalidate( false );
    }    

    if( valid ) {
      let login = new CustomEvent( Account.LOGIN, {
        detail: {
          email: this.email.value,
          password: this.password.value
        }
      } );
      this.root.dispatchEvent( login );
    }
  }

}


Account.LOGIN = 'account_login';
