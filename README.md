# Adyen Challenge - Ben Basuni 12/19/20

## Backend (index.js and adyenImplementation.js)

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

## Frontend (views/*)

### ```layout/main.handlebars```
* main page that imports Adyen CDNs and body that gets imported by other handlebar files

### ```partials/customer-form.handlebars```
* page that handles the customer-form (left-hand side of main page). By default, everything is read-only for demo purposes.

### ```payment.handlebars```
* Page that imports adyenImplementation.js and handles redirects, submissions, etc (look at `adyenImplementation.js` for more  information.

### * Redirect pages
* ```success.handlebars```
* ```error.handlebars```
* ```pending.handlebars```
* ```failed.handlebars```

## Static Data
* CSS and Images should also be mentioned in `public/` folder
