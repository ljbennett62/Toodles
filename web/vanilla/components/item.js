class Item {

  constructor( list, task ) {
    let template = document.querySelector( '#item' );

    let clone = document.importNode( template.content, true );

    this.tags = clone.children[0].querySelector( '.tags input' );
    this.tags.addEventListener( 'keypress', evt => this.doTag( evt ) );

    this.detail = clone.children[0].querySelector( '.detailed' );
    this.open = false;
    this.root = clone.children[0];

    clone.children[0].setAttribute( 'data-id', task.id );
    clone.children[0].setAttribute( 'data-account', task.account );
    clone.children[0].setAttribute( 'data-created', task.created );        
    clone.children[0].setAttribute( 'data-location', task.location );
    clone.children[0].setAttribute( 'data-due', task.due );
    clone.children[0].setAttribute( 'data-duration', task.duration );
    clone.children[0].setAttribute( 'data-energy', task.energy );

    this.name = clone.children[0].querySelector( '.short > .label' );
    this.name.addEventListener( 'focus', evt => this.doOpen( evt ) );
    this.name.value = task.name;

    let check = clone.children[0].querySelector( '.short > .check' );
    let remain = clone.children[0].querySelector( '.short > .remain' );

    if( task.complete ) {
      check.classList.add( 'complete' );
      clone.children[0].classList.add( 'complete' );
    } else {
      if( task.due > 0 ) {
        let duration = new Date().setTime( task.due );

        remain.style.display = 'block';
        remain.innerHTML = moment().to( duration );
      }
    }

    if( task.tags.trim().length > 0 ) {
      let parts = task.tags.split( ',' );

      for( let p = 0; p < parts.length; p++ ) {
        let chip = document.createElement( 'p' );
        chip.classList.add( 'chip' );
        chip.innerHTML = parts[p].trim();
        remain.parentElement.insertBefore( chip, remain );
      }
    }

    list.appendChild( clone );    
  }

  doClose( evt ) {
    let chips = this.root.querySelectorAll( '.short p.chip' );
    let remain = this.root.querySelector( '.remain' );

    remain.style.display = 'block';

    for( let c = 0; c < chips.length; c++ ) {
      chips[c].style.display = 'block';
    }

    this.detail.style.display = 'none';
    this.open = false;    
  }

  doOpen( evt ) {
    let chips = this.root.querySelectorAll( '.short p.chip' );
    let remain = this.root.querySelector( '.remain' );

    remain.style.display = 'none';

    for( let c = 0; c < chips.length; c++ ) {
      chips[c].style.display = 'none';
    }

    this.detail.style.display = 'flex';
    this.open = true;
  }

  doTag( evt ) {
    if( evt.charCode == 13 ) {
      let chip = document.createElement( 'p' );
      chip.classList.add( 'chip' );
      chip.innerHTML = this.tags.value.trim();
      this.tags.value = '';
      this.tags.parentElement.insertBefore( chip, this.tags );
    }
  }

}
