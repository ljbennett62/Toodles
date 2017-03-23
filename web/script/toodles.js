class Toodles {

  constructor() {
    model.addEventListener( Model.WRONG, evt => this.doLoginError( evt ) );    
    model.addEventListener( Model.LOGIN, evt => this.doLoginSuccess( evt ) );    
    model.addEventListener( Model.READY, evt => this.doModelReady( evt ) );

    this.authentication = document.querySelector( 'toodles-authentication' );
    this.authentication.addEventListener( Authentication.SIGN_IN, evt => this.doSignIn( evt ) );

    this.toolbar = document.querySelector( 'toodles-toolbar' );
    this.toolbar.addEventListener( Toolbar.EXIT, evt => this.doExit( evt ) );

    this.list = document.querySelector( 'toodles-list' );

    this.filter = document.querySelector( 'toodles-filter' );
    this.filter.addEventListener( Filter.CHANGE, evt => this.doFilter( evt ) );
    
    this.action = document.querySelector( 'toodles-action' );
    this.action.addEventListener( Action.CREATE_TASK, evt => this.doTaskCreate( evt ) );
  }

  doFilter( evt ) {
    this.list.filter( evt.detail );
  }

  doLoginError( evt ) {
    this.authentication.loading = false;
    this.authentication.shake();
  }

  doLoginSuccess( evt ) {
    this.authentication.id = model.account.id;
    this.authentication.hide();
    this.toolbar.show();
  }

  doModelReady( evt ) {
    this.filter.places = model.locations;
    this.filter.show();

    this.list.data = model.tasks;
    this.list.show();

    this.action.show();
  }

  doExit( evt ) {
    this.action.hide();

    this.list.hide();
    this.list.data = [];

    this.filter.hide();
    this.filter.places = [{
      id: 'any',
      account: null,
      name: 'Any'
    }];

    this.toolbar.hide();

    this.authentication.show();
  }

  doSignIn( evt ) {
    model.login( evt.detail.email, evt.detail.password );
  }

  doTaskCreate( evt ) {
    let task = {
      id: uuid.v4(),
      account: model.account.id,
      complete: false,
      due: 0,
      duration: 0,
      energy: 0,
      location: 'any',
      name: 'New To Do',
      notes: '',
      tags: '',
      created: new Date().getTime()
    };

    model.taskAdd( task );
    this.list.add( task );
  }

}

let model = new Model();
let app = new Toodles();
