class List {

  constructor( path ) {
    // Root element
    this.root = document.querySelector( path );

    // Buttons
    this.root.querySelector( '.compose' ).addEventListener( 'click', evt => this.doTaskAdd( evt ) );

    // Item template
    this.template = this.root.querySelector( '#item' );
  }

  set data( tasks ) {
    for( let t = 0; t < tasks.length; t++ ) {
      this.add( tasks[t] );
    }

    console.log( tasks );
  }

  add( task ) {
    let item = new Item( this.root, task );
  }

  show() {
    this.root.style.display = 'block';
    this.root.style.opacity = 1;
  }

  doTaskAdd( evt ) {
    let detail = {
      created: Date.now(),
      id: uuid.v4(),
      name: 'New To Do',
      due: 0,
      duration: 0,
      energy: 0,
      tags: '',
      location: 'any',
      complete: false,
      notes: ''      
    };

    let task = new CustomEvent( List.TASK_ADD, {
      detail: detail
    } );
    this.root.dispatchEvent( task );

    this.add( detail );
  }

}

List.TASK_ADD = 'list_task_add';
