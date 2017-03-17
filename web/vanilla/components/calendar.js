class Calendar {

  constructor( path ) {
    // Root element
    this.root = document.querySelector( path );

    // Days of week
    this.days = this.root.querySelectorAll( 'div' );

    // Listen for select
    for( let d = 0; d < this.days.length; d++ ) {
      this.days[d].addEventListener( 'click', evt => this.doSelect( evt ) );
    }
    
    // Back button
    this.left = this.root.querySelector( 'button:first-of-type' );
    this.left.addEventListener( 'click', evt => this.doRollClick( evt ) );    
    
    // Forward button
    this.right = this.root.querySelector( 'button:last-of-type' );    
    this.right.addEventListener( 'click', evt => this.doRollClick( evt ) );

    // Seed calendar
    this.start = new Date();
    this.start.setDate( this.start.getDate() - 3 );

    // Track selection
    this.selected = null;

    // Build calendar
    this.roll();
  }

  // Called to display calendar
  // Updates displayed dates
  // Accounts for today and selection
  roll() {
    let day = new Date( this.start.getTime() );
    let today = new Date();

    // Populate
    for( let d = 0; d < this.days.length; d++ ) {
      this.days[d].children[0].innerHTML = Calendar.DAYS[day.getDay()];
      this.days[d].children[1].innerHTML = day.getDate() + ' ' + Calendar.MONTHS[day.getMonth()];      

      // Attributes for later evaluation
      this.days[d].setAttribute( 'data-month', day.getMonth() );
      this.days[d].setAttribute( 'data-date', day.getDate() );
      this.days[d].setAttribute( 'data-year', day.getFullYear() );

      // Highlight today
      if( day.getDate() == today.getDate() &&
          day.getMonth() == today.getMonth() &&
          day.getFullYear() == today.getFullYear() ) {
        this.days[d].children[0].classList.add( 'today' );
        this.days[d].children[1].classList.add( 'today' );      
      } else {
        this.days[d].children[0].classList.remove( 'today' );
        this.days[d].children[1].classList.remove( 'today' );              
      }

      // Select if needed
      if( this.selected ) {
        if( day.getDate() == this.selected.date &&
            day.getMonth() == this.selected.month &&
            day.getFullYear() == this.selected.year ) {
          this.days[d].classList.add( 'selected' );
          this.days[d].children[0].classList.add( 'selected' );
          this.days[d].children[1].classList.add( 'selected' );               
        } else {
          this.days[d].classList.remove( 'selected' );
          this.days[d].children[0].classList.remove( 'selected' );
          this.days[d].children[1].classList.remove( 'selected' );             
        }
      }

      // Increment
      day.setDate( day.getDate() + 1 );
    }    
  }

  // Get selected date if any
  selection() {
    if( this.selected ) {
      return new Date( 
        this.selected.year,
        this.selected.month,
        this.selected.date
      );
    } else {
      return null;
    }
  }

  // Called to move calendar
  // Checks forward or backward
  doRollClick( evt ) {
    if( evt.target == this.right ) {
      this.start.setDate( this.start.getDate() + 7 );
    } else if( evt.target == this.left ) {
      this.start.setDate( this.start.getDate() - 7 );
    }

    // Update display
    this.roll();
  }

  // Date selection
  // Deselect of current selection
  doSelect( evt ) {
    // Get element
    // Not child
    // This keyword is class instance
    let target = ( evt.target.tagName == 'div' ) ? evt.target : evt.target.parentElement;

    // Iterate through displayed dates
    for( let d = 0; d < this.days.length; d++ ) {
      // Clicked element
      if( this.days[d] == target ) {
        // Already selected so deselect
        if( target.classList.contains( 'selected' ) ) {
          // Clear external reference
          this.selected = null;

          // Remove element styles
          this.days[d].classList.remove( 'selected' );
          this.days[d].children[0].classList.remove( 'selected' );
          this.days[d].children[1].classList.remove( 'selected' );                            
        } else {
          // Not selected so select
          // Store external reference
          this.selected = {
            month: parseInt( target.getAttribute( 'data-month' ) ),
            date: parseInt( target.getAttribute( 'data-date' ) ),
            year: parseInt( target.getAttribute( 'data-year' ) )
          }

          // Add element styles
          this.days[d].classList.add( 'selected' );
          this.days[d].children[0].classList.add( 'selected' );
          this.days[d].children[1].classList.add( 'selected' );               
        }
      } else {
        // Not selected or match
        // Make sure no selected styles are applied
        this.days[d].classList.remove( 'selected' );
        this.days[d].children[0].classList.remove( 'selected' );
        this.days[d].children[1].classList.remove( 'selected' );                
      }
    }
  }

}

// Days of the week
Calendar.DAYS = [
  'Sunday',
  'Monday', 
  'Tuesday', 
  'Wednesday', 
  'Thursday', 
  'Friday', 
  'Saturday'
];

// Months of the year
Calendar.MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

// Change event
Calendar.SELECT_CHANGE = 'calendar_change';
