There are 4 collections 
    i.e. User,Shop,Cart,Item.
        Users and Shop are two main collections which then influence
        the Cart and Item collection respectively.to Access Items collection we need 
        authentication of Shop and for Cart needs authentication of User.Shop collection 
        is needed as there is no one resposible for accessing Item collection as User 
        is not the one who can alter the data in items.Apis working on User and Shop 
        collections need idependant authentication mechanism.
        
How to run?

    npm install
    npm run dev or npm start
    
How to test?
    
    npm run test
    
postman environment variables:

    url:             
        currentValue=localhost:{port}

    authToken:       
        currentValue={user token stored through test script while creating user and logging in user}

            create user test script:     if (pm.response.code === 201) {
                                            pm.environment.set("authToken", pm.response.json().token)
                                        }
            login user test script:    if (pm.response.code === 200) {
                                            pm.environment.set("authToken", pm.response.json().token)
                                        }

    authTokenShop  
        currentValue={shop token stored through test script while creating shop and loggong in shop}

            create shop test script:     if (pm.response.code === 201) {
                                            pm.environment.set("authTokenShop", pm.response.json().token)
                                        }
            login shop test script:    if (pm.response.code === 200) {
                                            pm.environment.set("authTokenShop", pm.response.json().token)
                                        }


user

    create user:               
         localhost:{port}/api/users =>(stores user and assign them 
                                        tokens for sessions while storing)
            body:{
                "name":"xyz", 
                "email": "xyz@gmail.com",
                "password": "12345678",
                "phone": 1234567890,
                "addresses": [{
                        "housename": "abc",
                        "area": "abc nagar",
                        "pincode":123456,
                        "city": "abc",
                        "state": "abc",
                        "name":"abc",
                        "phone":1234567890
                }],
                "age": 21,
                "gender": "male"
                }                                                       

    login user:
        localhost:{port}/api/users/login=>(logs in user and create another token)
            body:{
                "email":"xyz@gmail.com",
                "password":"12345678"
            }
    
    logout user:                
        localhost:{port}/api/users/logout=>(logs out the current 
                                            logged in user using token)
            {no body ,it will take the Authorization token 
            from environment variable i.e. AuthToken}

    logoutAll user:
        localhost:{port}/api/users/logoutAll=>(logs out all user for current 
                                                account by deleting all tokens)
            {no body ,it will take the Authorization token 
            from environment variable i.e. AuthToken}

    read user profile:          
        localhost:{port}/api/users/me=>(reads user profile using auth token)
            {no body ,it will take the Authorization token 
            from environment variable i.e. AuthToken}

    read user :
        localhost:{port}/api/users/:id=>(reads user data using id)
            {no body, it will take the Authorization token 
            from environment variable i.e. AuthToken}

    update user profile:
        localhost:{port}/api/users/me=>(updates user profile using auth token)
            body:{
                    "{fieldname}": "xyz"
                }

    update address of user:     
        localhost:{port}/api/users/me/address/:id=>(updates user address using id of address 
                                                    stored while creating user who is logged in)
            body:{
                    "{fieldname}": "xyz"
                }

    add new address:
        localhost:{port}/api/users/me/addAddress=>(adds new user address to logged in user profile)
            body:{
                        "housename": "abc",
                        "area": "abc nagar",
                        "pincode":123456,
                        "city": "abc",
                        "state": "abc",
                        "name":"abc",
                        "phone":1234567890
                    }
    delete address of user:
        localhost:{port}/api/users/me/deleteAddress/:id=>(deletes user address using id 
                                                        of address stored while creating user)
    
    delete user profile:        
        localhost:{port}/api/users/me=>(delete user profile using auth token)

    

shop

    create shop:               
        localhost:{port}/api/shops=>(stores shop and assign them tokens for
                                     sessions while storing)
            body:{
                    "shopName":"xyz",
                    "ownerName":"xyz",
                    "email":"xyz@gmail.com",
                    "password":"12345678",
                    "phone":918928399,
                    "location":"xyz"
                }

    logout shop:
        localhost:{port}/api/shops/login=>(logs in shop and create another token)
            body:{
                "email":"xyz@gmail.com",
                "password":"12345678"
            }
    
    logout shop:
        localhost:{port}/api/shops/logout=>(logs out the current logged in shop using token)
            {no body ,it will take the Authorization token 
            from environment variable i.e. AuthTokenShop}   

    logoutAll shop:             
        localhost:{port}/api/shops/logoutAll=>(logs out all shop for current account 
                                                by deleting all tokens)
            {no body ,it will take the Authorization token 
            from environment variable i.e. AuthTokenShop}

    read shop profile:
        localhost:{port}/api/shops/me=>(reads shop profile)
            {no body ,it will take the Authorization token 
            from environment variable i.e. AuthTokenShop}

    read shop :                 
        localhost:{port}/api/shops/:id=>(reads shop data using id)
            {no body ,it will take the Authorization token 
            from environment variable i.e. AuthTokenShop}

    update shop profile:        
        localhost:{port}/api/shops/me=>(updates shop profile)
            body:{
                    "{fieldname}": "xyz"
                }

    delete shop profile:        
        localhost:{port}/api/shops/me=>(delete shop profile)


cart=

    create cart:
        localhost:{port}/api/carts/save=>(saves carts in datatbase without
                                         authentication of user as user should be 
                                         able to create a cart without any authentication)
            body: {
                    "cartItems": [
                            {
                            "_id":"{id of any existing item}",
                            "quantity": 5
                            }
                        ]}

    update cart(place order):  
            localhost:{port}/api/carts/submit/:id=>(updates a carts to with user authentication 
                                                    as user should be logged in to place order )
                body:{                                           
                        "deliveryAddress":"5ec024a741056e16e803c234",(id of address which is stored users)
                        "payment":"card"
                    }
            (automatically sets 
            checkedOut:false to checkedOut:true )

    read allCarts:
        localhost:{port}/api/carts=>(reads all carts)

    read cart:
        localhost:{port}/api/carts/:id=>(reads cart using id without authenticating)

    update cartItem:
        localhost:{port}/api/carts/item/:id=>(update cartItem quantity using id of cart 
                                              without authenticating)
            body:{
                    "_id":"{id of item stored while creating cart}",
                    "quantity":6
                }

    delete cartItem:            
        localhost:{port}/api/carts/deleteItem/:id=>(delete cartItem using id of cart 
                                                    without authenticating)
            body:{
                    "_id":"{id of item stored while creating cart}",
                }

    delete cart:
        localhost:{port}/api/cart/:id=>(delete cart using id of cart without authenticating)



item:

    create Item:
        localhost:{port}/api/items=>(creates item with authentication for shop)
            body:{
                    "name": "xyz",
                    "price": 120,
                    "catagory": "abc",
                    "shopId":"{automatically stores id for shop}",
                    "description": "6 pieces",
                    "stock": 200,
                    "reviews": [{
                        "body": "nice product",
                        "email": "xyz@gmail.com",
                        "name": "abc"
                    }]
                }
                
    read items:      
        localhost:{port}/api/items=>(reads item with shop authentication)
        
                    //GET /items?catagory=fruit
                    //GET /items?limit=2&skip:2
                    //GET /items?sortBy=createdBy:-1
                    
            {no body ,it will take the Authorization token 
            from environment variable i.e. AuthTokenShop}

    read item:
        localhost:{port}/api/items/:id=>(reads item using id of item with shop authenticating)
            {no body ,it will take the Authorization token 
            from environment variable i.e. AuthTokenShop}
    update item:
        localhost:{port}/api/items/:id=>(update item using id of item whit shop authenticating)
            {no body ,it will take the Authorization token 
            from environment variable i.e. AuthTokenShop}
    delete item:                
        localhost:{port}/api/items/:id=>(delete item using id of item with shop authenticating)
            {no body ,it will take the Authorization token 
            from environment variable i.e. AuthTokenShop}

user avatar=

    create user avatar:          
        localhost:{port}/users/me/avatar=>(create user avatar with authentication of user)
            body:("in form-data" key=avatar 
                            value={file})
    delete user avatar:          
        localhost:{port}/users/me/avatar=>(delete user avatar with authentication of user)

user avatar=

    create shop avatar:
        localhost:{port}/shops/me/avatar=>(create shop avatar with authentication of shop)
            body:("in form-data" key=avatar 
                            value={file})
    delete shop avatar:          
        localhost:{port}/shops/me/avatar=>(delete shop avatar with authentication of shop)

user image=

    create item image:
        localhost:{port}/items/:id/image=>(create item image using item id with authentication of shop)
            body:(in form-data key=image 
                            value={file})
    delete item image:           
        localhost:{port}/items/:id/image=>(create item image using item id with authentication of shop)
