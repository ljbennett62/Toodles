#What

Toodles is a basic to-do list manager that leverages IBM Blockchain as the data store.

#Why

The cryptocurrency Bitcoin is well known even outside of technology spheres of influence. Underlying Bitcoin however is Blockchain - a distributed database with some very special properties. These properties make Blockchain an ideal data store for all variety of applications, not just financial records. Toodles helps developers understand Blockchain in the context of typical (CRUD) database operations they use on a daily basis.

#Who

Blockchain is open source, and many corporate entities have seen the value of leveraging its unique characteristics (Blockchain for business). One implementation of Blockchain is Hyperledger Fabric, which is organized and run by the Linux Foundation. Various IBM employees are involved in Hyperledger Fabric, including the technical steering committee. IBM Blockchain is an instance of Hyperledge Fabric in the cloud - running on IBM Bluemix.

#Where

Toodles runs on IBM Blockchain on IBM Bluemix.

#How

IBM Blockchain on IBM Bluemix provides a safe testing area, with robust tooling, for everything from prototype applications, to large scale production. 

A "block" is some amount of data. Functionally, Blockchain stores data as an array of bytes, so that data can take just about any form - an image, some JSON, a legal document, you name it. The "chain" refers to hashes that correlate to every block update. The hash of the current version of a block of data is directly dependant on the hash of the previous version. In this manner, a chain is formed - a verifiable, auditable, log of changes.

Toodles has three data structures represented on the Blockchain ...

- Account
-- Id
-- Email
-- Password

- Location
-- Id
-- AccountId
-- Name

- Task
-- Id
-- AccountId
-- Due
-- LocationId
-- Duration
-- Energy
-- Tags
-- Notes
-- Complete
-- Name
-- CreatedAt

If we continue with the analogy of Blockchain as a distributed database, then "chaincode" is effectively a stored procedure. The difference here is that chaincode is written in Go, and can [arguably] have more substantial logic than a stored procedure. You might also hear the term "smart contract" which is a more business-oriented phrasing for chaincode.

The only way you can interact with the data on the Blockchain is through chaincode. Like many APIs these days, a client interaction with chaincode happens over HTTP using a JSON message. This opens access to just about any client technology. 

There are three main API endpoints for any given chaincode. The first is to "deploy" chaincode, which expects a GitHub repository to be specified. The second is asynchronous "invoke" operations where you do not need a specific response right away, other than knowing that the service received the data, and will process it. The last is a "query" operation, where you are expecting to get a specific set of data in response to the API call (synchronous). In Blockchain terminology, "invoke" is generally used for create, update, and delete operations, while "query" would represent various read operations (by ID, search).

The format of the JSON message varies slightly depending on the operation, but generally looks like the following example ...

```
{
	"jsonrpc": "2.0",
	"method": "invoke",
	"params": {
        "chaincodeID": "abc-123-xyz-456",
        "ctorMsg": {
          "function": "create_account",
          "args": ["abc-123", "krhoyt@us.ibm.com", "mypassword"]
        },
        "secureContext": "user_1",
        "type": 1
    },
    "id": 1        
}
```

The function "create_account" will map to a specific function in the chaincode. That function will be passed the "args" array of strings as values. In the case of Toodles, this then creates an account. It is not uncommon for the "args" array of strings to take a single JSON-formatted string, with that JSON content holding any various permutation of properties and values. In this respect, you can use Blockchain in a relational nature, or a NoSQL nature, depending on your preferences and application needs.

The Toodles chaincode functions in a relational approach, and provides for browse, read, edit, add, delete (BREAD) for each of the given data structures.

In the case of Toodles, a web-based interface is supplied to allow users to login to their specific accounts, and work with their specific to-do list items. Polymer 2.0 RC is used as a polyfill for the Web Components (and related) specifciations. The encapsulation of behaviors in components should make the Toodles source code approachable to any developer with an understanding of Web technologies (specifically JavaScript, and XHR/SPA approaches).

> As IBM Blockchain supports CORS (cross-domain resource sharing) by default, the Web-based user interface makes requests directly against chaincode. Should you prefer a "serverless" approach, an OpenWhisk action is included in the repository. Alternatively, you might leverage Node.js (or other) server to proxy/massage data between clients and chaincode.

#What Next

The chaincode for Toodles is very specific for the application and its related data structures. It stands to reason however that those specifics could be abstracted away at the chaincode such that the arguments would specify which data model to edit, how, and with what values.  This would simplify the chaincode substantially, and make future database-oriented deployments as simple as using the exact same chaincode.

When it comes to database structures, a common follow-on project that generally emerges is that of scaffolding. A scaffolding project is currently in progress, and is called Fabric Composer. If you are a Go or JavaScript (Angular) professional, then you should consider getting involved.
