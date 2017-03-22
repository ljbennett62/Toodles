class Task extends Blockchain {

  constructor() {
    super();
    this.doBrowse = this.doBrowse.bind( this );
  }

  browse( account ) {
    this.xhr.addEventListener( 'load', this.doBrowse );
    this.request( {
      method: Blockchain.QUERY,
      operation: Task.BROWSE,
      values: [account]
    } );
  }

  doBrowse( evt ) {
    let data = JSON.parse( this.xhr.responseText );
    let result = JSON.parse( data.result.message );

    this.emit( Task.BROWSE, result );

    this.xhr.removeEventListener( 'load', this.doBrowse );
  }

}

Task.BROWSE = 'task_browse';
