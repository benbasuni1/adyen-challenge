curl https://checkout-test.adyen.com/v1/originKeys \
-H "X-API-key: " \
-H "Content-Type: application/json" \
-d '{
   "originDomains":[
      "http://localhost:8080",
      "https://adyen-challenge.herokuapp.com"
   ]
}'
