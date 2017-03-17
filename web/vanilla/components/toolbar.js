class Toolbar {
  
  constructor( path ) {
    this.root = document.querySelector( path );
  } 

  show() {
    this.root.style.top = 0;
    this.root.style.opacity = 1;
  }

}
