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

  login( email, password ) {
    Blockchain.request( {
      method: Blockchain.QUERY,
      operation: 'account_read',
      values: [email, password]
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
      if( result == null ) {
        let any = {
          id: null,
          account: null,
          name: 'Any'
        };

        if( this.locations == null ) {
          this.locations = [any];
        } else {
          this.locations.push( any );
        }
      } else{
        console.log( result );        

        // Sort locations by name
        result = result.sort( ( a, b ) => {
          if( a.name.toUpperCase() < b.name.toUpperCase() ) {
            return -1;
          }

          if( a.name.toUpperCase() > b.name.toUpperCase() ) {
            return 1;
          }

          return 0;
        } );    

        // Push default to front of list
        result.unshift( {
          id: 'any',
          account: null,
          name: 'Any'
        } );

        this.locations = result;
        return Blockchain.request( {
          method: Blockchain.QUERY,
          operation: 'task_browse',
          values: [this.account.id]
        } );
      }
    } ).then( result => {
      if( result == null ) {
        this.tasks = [];
      } else {
        console.log( result );
        this.tasks = result.splice( 0 );
        this.taskSort();
        this.emit( Model.READY, null );
      }
    } ).catch( error => {
      console.log( error );
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
        task.created.toString()]
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

Model.LOGIN = 'model_login';
Model.READY = 'model_ready';
Model.WRONG = 'model_wrong';