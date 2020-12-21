## Adyen Challenge - Ben Basuni 12/19/20

### ```Index.js```
File that will handle our apps: **configuration, basic API routes, rendering views, and starting the server**

* Configuration
    * Express Middleware
    * .env
    * Adyen Config
    * Handlebars
   
* API Routes
    * GET Payment Methods
    * POST Initiate Payment
    * Handling Redirects
    * Handling Submission of Additional Details 

* Other
    * Render Views
    * Start Server
  
### ```adyenImplementation.js```
File that will handle the logic of interacting with server's APIs and browser data.

Invoked in `payment.handlebars`

* Variables
    * paymentMethodResponse - get response from browser
    * clientKey - client key from .env
    * checkout  
    * integration - integrations that populate on right side of browser

* Functions
    * callServer(url, data)
    * handleServerResponse(res, component)
    * handleSubmission(state, component, url)

  
