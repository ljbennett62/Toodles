class Model {
  
  constructor() {
    this.listeners = [];

    this.account = null;
    this.locations = null;
    this.tasks = null;
  }

  addEventListener( label, callback ) {
    this.listeners.push( {
      label: label,
      callback: callback
    } );
  }

  emit( label, evt ) {
    for( let h = 0; h < this.listeners.length; h++ ) {
      if( this.listeners[h].label == label ) {
        this.listeners[h].callback( evt );
      }
    }
  }

  login( username, password ) {
    Blockchain.request( {
      method: Blockchain.QUERY,
      operation: 'account_read',
      values: [username, password]
    } ).then( result => {
      if( result == null ) {
        console.log( 'Not logged in.' );
        this.emit( Model.WRONG, null );        
      } else {
        console.log( result );
        this.account = result;
        this.emit( Model.LOGIN, null );
        return Blockchain.request( {
          method: Blockchain.QUERY,
          operation: 'location_browse',
          values: [this.account.id]
        } );
      }
    } ).then( result => {      
      let any = {
        id: 'any',
        account: null,
        name: 'Any'
      };

      if( result == null ) {
        console.log( 'No locations.' );
        this.locations = [any];
      } else{
        console.log( result );        
        this.locations = result.slice( 0 );
        this.locationSort();
      }

      return Blockchain.request( {
        method: Blockchain.QUERY,
        operation: 'task_browse',
        values: [this.account.id]
      } );      
    } ).then( result => {
      if( result == null ) {
        console.log( 'No tasks.' );
        this.tasks = [];
      } else {
        console.log( result );          
        this.tasks = result.slice( 0 );
        this.taskSort();
      }

      this.emit( Model.READY, null );      
    } ).catch( error => {
      console.log( error );
    } );
  }

  locationAdd( location ) {
    Blockchain.request( {
      method: Blockchain.INVOKE,
      operation: 'location_add',
      values: [
        location.id, 
        location.account, 
        location.name
      ]
    } ).then( result => {
      console.log( result );
      this.emit( Model.LOCATION_ADD, null );       
    } );    
  }

  locationDelete( location ) {
    for( let p = 0; p < this.locations.length; p++ ) {
      if( this.locations[p].id == location.id ) {
        this.locations.splice( p, 1 );
        break;
      }
    }

    Blockchain.request( {
      method: Blockchain.INVOKE,
      operation: 'location_delete',
      values: [location.id], 
    } ).then( result => {
      console.log( result );     
    } );    
  }  

  locationSort() {
    if( this.locations[0].id == 'any' ) {
      this.locations.splice( 0, 1 );      
    }

    // Sort locations by name
    this.locations = this.locations.sort( ( a, b ) => {
      if( a.name.toUpperCase() < b.name.toUpperCase() ) {
        return -1;
      }

      if( a.name.toUpperCase() > b.name.toUpperCase() ) {
        return 1;
      }

      return 0;
    } );        

    this.locations.unshift( {
      id: 'any',
      account: null,
      name: 'Any'
    } );    
  }

  taskAdd( task ) {
    Blockchain.request( {
      method: Blockchain.INVOKE,
      operation: 'task_add',
      values: [
        task.id, 
        task.account, 
        task.name, 
        task.due.toString(),
        task.location, 
        task.duration.toString(), 
        task.energy.toString(), 
        task.created.toString()
      ]
    } ).then( result => {
      console.log( result );
    } );    
  }

  taskEdit( task ) {
    Blockchain.request( {
      method: Blockchain.INVOKE,
      operation: 'task_edit',
      values: [
        task.id, 
        task.account, 
        task.due.toString(), 
        task.location, 
        task.duration.toString(), 
        task.energy.toString(), 
        task.tags, 
        task.notes, 
        task.complete.toString(), 
        task.name]
    } ).then( result => {
      console.log( result );
    } );
  }

  taskSort() {
    // Sort tasks by date
    this.tasks = this.tasks.sort( ( a, b ) => {
      if( a.due < b.due ) {
        return -1;
      }

      if( a.due > b.due ) {
        return 1;
      }

      return 0;
    } );

    // Sort tasks by complete
    this.tasks = this.tasks.sort( ( a, b ) => {
      if( a.complete ) {
        return 1;
      }

      return -1;
    } );
  }

}

Model.DURATION = [
  {id: '0', name: 'Any'},
  {id: '1', name: '&lt; 30 mins.'},
  {id: '2', name: '30 - 60 mins.'},
  {id: '3', name: '1 - 2 hrs.'},
  {id: '4', name: '2 - 4 hrs.'},
  {id: '5', name: '&gt 4 hrs.'}  
];

Model.ENERGY = [
  {id: '0', name: 'Any'},
  {id: '1', name: 'Low'},
  {id: '2', name: 'Normal'},
  {id: '3', name: 'High'},      
];

Model.LOCATION_ADD = 'model_location_add';

Model.LOGIN = 'model_login';
Model.READY = 'model_ready';
Model.WRONG = 'model_wrong';
