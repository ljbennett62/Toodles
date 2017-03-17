class TextField {

  constructor( root ) {
    this.label = root.querySelector( 'p' );
    
    this.field = root.querySelector( 'input' );
    this.field.addEventListener( 'focus', evt => this.doFocus( evt ) );
    this.field.addEventListener( 'blur', evt => this.doBlur( evt ) );    

    this.divider = root.querySelector( 'div.divider' );
  }

  get value() {
    return this.field.value.trim();
  }

  set value( contents ) {
    this.field.value = contents;
  }

  invalidate( state ) {
    if( state ) {
      this.label.classList.add( 'invalid' );
      this.divider.classList.add( 'invalid' );
    } else {
      this.label.classList.remove( 'invalid' );
      this.divider.classList.remove( 'invalid' );          
    }
  }

  doBlur( evt ) {
    this.label.classList.remove( 'selected' );
    this.divider.classList.remove( 'selected' );    
  }

  doFocus( evt ) {
    this.label.classList.add( 'selected' );
    this.divider.classList.add( 'selected' );
  }

}
