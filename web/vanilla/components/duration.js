class Duration {

  constructor( path ) {
    // Root element
    this.root = document.querySelector( path );

    // List
    this.list = this.root.querySelector( 'div.list' );

    // Buttons
    this.times = this.root.querySelectorAll( 'div.list > button' );

    // Event listeners
    for( let t = 0; t < this.times.length; t++ ) {
      this.times[t].addEventListener( 'click', evt => this.doTime( evt ) );
    }

    // Default selected
    this.selected = 0;
  }

  // Button clicked
  // Record selection
  // Update styles
  doTime( evt ) {
    // Iterate through children
    for( let c = 0; c < this.list.children.length; c++ ) {
      // Child is button clicked
      if( this.list.children[c] == evt.target ) {
        // Record selected index
        // Show selection style
        this.selected = c;
        this.list.children[c].classList.add( 'selected' );
      } else {
        // Not selected
        // Remove selection style
        this.list.children[c].classList.remove( 'selected' );
      }
    }
  }

}
