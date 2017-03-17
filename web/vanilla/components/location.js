class Location {

  constructor( path ) {
    // Root element
    this.root = document.querySelector( path );

    // Bind for removal of listeners
    // http://stackoverflow.com/questions/30446622/es6-acces-to-this-with-addeventlistener-applied-on-method
    this.doPage = this.doPage.bind( this );
    this.doPlace = this.doPlace.bind( this );

    this.left = this.root.querySelector( 'button:first-of-type' );
    this.right = document.querySelector( '#location > button:last-of-type' );

    // List
    this.list = this.root.querySelector( '.list' );

    // Buttons
    this.page = 0;
    this.places = [];
    this.selected = 0;
  }

  update() {
    // Reset buttons
    this.left.removeEventListener( 'click', this.doPage );
    this.left.classList.remove( 'left' );
    this.left.classList.add( 'icon' );

    this.right.removeEventListener( 'click', this.doPage );
    this.right.classList.remove( 'right' );

    // Remove old values
    for( let c = 0; c < this.list.children.length; c++ ) {
      this.list.children[c].innerHTML = '';
      this.list.children[c].classList.remove( 'selected' );
      this.list.children[c].classList.add( 'inactive' );
      this.list.children[c].removeEventListener( 'click', this.doPlace );
    }

    let start = this.page * Location.PLACES;
    let stop = Location.PLACES;

    if( this.places.length < Location.PLACES ) {
      stop = this.places.length;
    } else if( this.places.length >= Location.PLACES ) {
      if( this.page > 0 ) {
        this.left.addEventListener( 'click', this.doPage );
        this.left.classList.remove( 'icon' );
        this.left.classList.add( 'left' );        
      }

      if( this.places.length > start + Location.PLACES ) {
        stop = start + Location.PLACES;

        this.right.classList.add( 'right' );
        this.right.addEventListener( 'click', this.doPage );
      } else {
        stop = this.places.length;
      }
    }

    for( let c = 0; c < this.list.children.length; c++ ) {
      if( ( this.page * Location.PLACES ) + c < stop ) {
        this.list.children[c].innerHTML = this.places[start + c].name;
        this.list.children[c].setAttribute( 'data-id', this.places[start + c].id );
        this.list.children[c].classList.remove( 'inactive' );
        this.list.children[c].addEventListener( 'click', this.doPlace );

        if( ( this.page * Location.PLACES ) + c == this.selected ) {
          this.list.children[c].classList.add( 'selected' );          
        }
      } else {
        if( this.places.length > Location.PLACES ) {
          this.list.children[c].classList.remove( 'inactive' );
        }
      }
    }
  }

  options( values ) {
    this.page = 0;
    this.places = [];
    this.selected = 0;

    values = values.sort( ( a, b ) => {
      if( a.name.toUpperCase() < b.name.toUpperCase() ) {
        return -1;
      }

      if( a.name.toUpperCase() > b.name.toUpperCase() ) {
        return 1;
      }

      return 0;
    } );
    this.places = this.places.concat( [{
      id: null,
      account: null,
      name: 'Any'
    }], values );

    this.update();
  }

  doPage( evt ) {
    if( evt.target == this.left ) {
      this.page = this.page - 1;
    }

    if( evt.target == this.right ) {
      this.page = this.page + 1;
    }

    this.update();
  }

  doPlace( evt ) {
    let previous = this.selected;

    for( let p = 0; p < this.places.length; p++ ) {
      if( this.places[p].name == evt.target.innerHTML ) {
        this.selected = p;
        break;
      }
    }

    if( previous != this.selected ) {
      this.update();
    }
  }

}

Location.ANY = 'Any';
Location.PLACES = 7;
