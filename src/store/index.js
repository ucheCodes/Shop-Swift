import { createStore } from 'vuex';
import router from '@/router/index'
import axios from 'axios';
import moment from 'moment'
import { Decryption } from '../assets/encryption';
import { groupBy } from '../assets/groupBy';
import connection from "../signalrHub"

function updateLocalStorage(cart) {
  localStorage.setItem('cart',JSON.stringify(cart))
}

export default createStore({
  state: {
    cart : [],
    serverPath: "https://localhost:5001/",//I have to change this 3 parts to the set domain of the azure
    apiUrl : "https://localhost:5001/api/",//domain containing the api codes here.
    photoUrl : "https://localhost:5001/photos/",//I can host this first using git then avail it for changes afterwards.
    allUsers:[],
    allProducts:[],
    allBrands:[],
    allAds:[],
    allStory:[],
    modifiedBrands:[],
    isLogged:false,
    user: {
      UserId: "",
      Firstname : 'client',
      Lastname : 'swift',
      IsAdmin : false,
      IsSuperAdmin : false,
      ImagePath : "img.jpg",
    },
    signalrId : "",
    brand : null,
    onlineUsers: [],
    allChats: new Map(),
    lastChats : new Map(),
    groups : new Map(),
    allGroupChats : new Map(),
    activeGroups: new Map(),
    productComments : [],
    activeProduct : '',
    encryptionKey : "",
    commentResponses : new Map(),
    notifications : new Map(),
    showNotifier : true,
    coverImg : '',
  },
  getters: {
  },
  mutations:{
    hideNotifier(state){
      if (state.showNotifier) {
        state.showNotifier = false;
      }
    },
    setNotifier(state){
      state.showNotifier = true;
    },
    setSignalrId(state,payload){
      state.signalrId = payload;
    },
    logUser(state,payload){
      if (payload.msg != "failed") {
        if (confirm("Would you like to remain signed in automatically???")) {
          state.user = payload.data;
          localStorage.setItem('userId',JSON.stringify(state.user.UserId))
        }
        else{
         state.user = payload.data;
        }
        state.isLogged = true;
        alert("Welcome "+state.user.Lastname);
        connection.client.invoke("AddUserToGroups",state.user.UserId);
      }
    },
    getUserByCookie(state,payload){
      state.user = JSON.parse(payload.value);
    },
    getAllUsers(state,payload){
      payload.forEach(element => {
        var parsedValue = JSON.parse(element.value)
        state.allUsers.push(parsedValue);
      });
     // console.log(state.allUsers);
    },
    getAndLogUser(state,payload){
      state.user = payload;
      state.isLogged = true;
      connection.client.invoke("AddUserToGroups",state.user.UserId);
    },
    deleteUser(state,payload){
      if (payload.data == 'success') {
        const deletedUser = state.allUsers.find(user => user.UserId == payload.id);
        if(deletedUser){
          state.allUsers = state.allUsers.filter(user => user.UserId != deletedUser.UserId );
        }
      }
    },
    changeAffiliate(state,payload){
      state.allUsers = state.allUsers.filter(u => u.UserId != payload.UserId);
      state.allUsers.unshift(payload);
    },
    changeDp(state,payload){
      if (payload != "img.jpg") {
        state.user.ImagePath = payload;
      }
    },
    createBrand(state,payload){
      if (payload.data == "success") {
        alert("notify.js brand created successfully");
        state.user.IsAdmin = true;
        state.brand = payload.brand;
      }
    },
    getAllProducts(state,payload){
      payload.forEach(product => {
        state.allProducts.push(JSON.parse(product.value));
      }); 
        if (state.allProducts.length) {
          state.allProducts.sort((product1,product2) => moment(product2.Date) - moment(product1.Date));
        }
    },
    getAllBrands(state,payload){
      payload.forEach(brand => {
        var _brand = JSON.parse(brand.value)
        state.allBrands.push(_brand);
        //Modify Brands to include users names and details
        if (state.allUsers.length > 0) {
          var u = state.allUsers.find(_user => _user.UserId == _brand.UserId);
          var modifiedBrand = {
              Lastname: u.Lastname,
              Firstname: u.Firstname,
              userImg: u.ImagePath,
              Mobile: u.Mobile,
              Day: moment(brand.Date).format('ll'),
              Time: moment(brand.Date).format('LT'),
          };
          Object.assign(_brand,modifiedBrand);
          state.modifiedBrands.push(_brand);
        }
      });
    },
    getBrand(state,payload){
      state.brand =  JSON.parse(payload.value);
    },
    addToCart(state,payload){
      var product = state.allProducts.find(p => p.Id == payload);
      var notification = {
        Id : "",
        SenderId : state.user.UserId,
        ReceiverId : product.UserId,
        ProductId : product.Id,
        ProductName : product.Name,
        NotificationType : 'cart',
        Message : 'added to cart',
        Date : new Date().toUTCString(),
      };
      if (!state.cart.includes(product)) {
        state.cart.push(product);
        if (state.user.UserId) {
          this.dispatch("postNotification",notification);
        }
        alert("notify.js item added")
      }
    },
    removeFromCart(state,payload){
      state.cart = state.cart.filter(p => p.Id != payload);
    },
    postProduct(state,payload)
    {
      var findPostedProduct = state.allProducts.find(p => p.Id == payload.Id);
      if (findPostedProduct) {
        //replace with the updated data
        state.allProducts[state.allProducts.map((x,i) => [i,x]).filter(product => product[1].Id == payload.Id)[0][0]] = payload;
      }
      else{
        state.allProducts.push(payload);
      }
     router.push({name:"Products",params:{userId:payload.UserId}}); 
    },
    postAds(state,payload){
      state.allAds.push(payload);
      router.push("/market");
    },
    getAds(state,payload){
      payload.forEach(ad => {
        var ads = JSON.parse(ad.value); 
        state.allAds.push(ads);
     });
    },
    postStory(state,payload){
      state.allStory.push(payload);
    },
    removeDeletedProduct(state,payload){
      state.allProducts = state.allProducts.filter(product => product.Id != payload);
    },
    manageOnlineUsers(state,payload){
      if (state.onlineUsers.length > 0) {
        state.onlineUsers = state.onlineUsers.filter(u => u.UserId != payload.UserId);
        state.onlineUsers.push(payload);
      }
      else{
        state.onlineUsers.push(payload);
      }
    },
    addChat(state,payload){
      state.allChats.set(payload.chatId,payload);
    },
    postChat(state,payload){
      state.allChats.get(payload.chatId).chats.push(payload);
    },
    getLastChats(state,payload){
      payload.forEach(lc => {
        if (state.allUsers.length) {
          var u = state.allUsers.find(x => x.UserId == lc.partnerId);
          if (u) {
            var userObj = {
            lastname : u.Lastname,
            firstname : u.Firstname,
            imagePath : u.ImagePath,
            time : moment(payload.date).format('LT'),
            day : moment(payload.date).format('ll')
          }
          Object.assign(lc,userObj);
          }
        }
        state.lastChats.set(lc.chatId, lc);
      });
    },
    appendLastChat(state,lc)
    {
      var dummyLc = lc;
      if (state.allUsers.length) {
        var u = state.allUsers.find(x => x.UserId == dummyLc.partnerId);
        if (u) {
          var userObj = {
          lastname : u.Lastname,
          firstname : u.Firstname,
          imagePath : u.ImagePath,
          time : moment(dummyLc.date).format('LT'),
          day : moment(dummyLc.date).format('ll')
        }
        Object.assign(dummyLc,userObj);
        }
      }
      state.lastChats.set(dummyLc.chatId,dummyLc);
    },
    deleteChat(state,payload){
      var _chats = state.allChats.get(payload.chatId);
      var modifiedChat = _chats.chats.filter(c => c.id != payload.id);
      _chats.chats = modifiedChat;
      state.allChats.set(payload.chatId,_chats);
    },
    addToGroup(state,payload){
      var group = payload;
      this.commit("appendGroup",group);
    },
    getGroups(state,payload){
      payload.forEach(group => {
        this.commit("appendGroup",group);
      });
    },
    appendGroup(state,group){
      var admin = state.allUsers.find(g => g.UserId == group.adminId);
      if (admin) {
        var n = {
          lastname : admin.Lastname,
          firstname : admin.Firstname,
        };
        Object.assign(group,n);
        state.groups.set(group.id,group);
      }
    },
    getGroupChats(state,payload){
      // console.log(payload);
      // console.log(Object.keys(payload));
      // console.log(Object.values(payload));
      // console.log(Object.entries(payload));//use for each to loop any of the above
      Object.entries(payload).forEach(([key,value]) => {
        var chatArr = [];
        value.forEach(chat => {
          var user = state.allUsers.find(u => u.UserId == chat.sender);
          if (user) {
            var u = {
              firstname : user.Firstname,
              lastname : user.Lastname,
              imagePath : user.ImagePath,
              time : moment(user.date).format('LT'),
              day : moment(user.date).format('ll')
            }
          }
          Object.assign(chat,u);
          chatArr.push(chat);
        });
        state.allGroupChats.set(key,chatArr);
      });
    },
    postGroupChat(state,payload){
      var value = payload;
      var user = state.allUsers.find(u => u.UserId == value.sender);
        if(user) {
          var u = {
            firstname : user.Firstname,
            lastname : user.Lastname,
            imagePath : user.ImagePath,
            time : moment(user.date).format('LT'),
            day : moment(user.date).format('ll')
          }
          Object.assign(value,u);
          if (state.allGroupChats.has(value.chatId)) {
            var chatArr = state.allGroupChats.get(value.chatId);
            state.allGroupChats.get(value.chatId).push(value);
          }
          else{
            var chatArr = [];
            chatArr.push(value);
            state.allGroupChats.set(value.chatId,chatArr);
          }

          if (value.sender != state.user.UserId) {
            this.commit("injectActiveGroups",value.chatId);
          }
        }
    },
    deleteGroupChat(state, payload){//to delete a single chat in a group
      var filtered = state.allGroupChats.get(payload.groupId).filter(c => c.id != payload.id);
      state.allGroupChats.set(payload.groupId,filtered);
    },
    getUserActiveGroups(state,payload){
      if (payload.length > 0) {
        payload.forEach(element => {
          var id = JSON.parse(element.value);
          this.commit("injectActiveGroups",id);
        });
      }
    },
    injectActiveGroups(state,id){
      if (state.groups.size > 0) {
        var gp = state.groups.get(id);
        var chats = state.allGroupChats.get(id);
        if (chats) {
          var lastMsg = chats[chats.length - 1];
          var count = 0;
          var   getCount = state.activeGroups.get(id);
          if (getCount) {
            count = getCount.count+1;
          }
          else{count = 0}
          var activeObj = {
            body : lastMsg.body,
            time : lastMsg.time,
            day : lastMsg.day,
            id : lastMsg.id,
            chatId : lastMsg.chatId,
            imagePath : gp.imagePath,
            title : gp.title,
            count : count
          };
          state.activeGroups.set(activeObj.chatId,activeObj);
        }
      }
    },
    resetGroupCount(state,payload){
     if (state.activeGroups.has(payload)) {
      state.activeGroups.get(payload).count = 0;
     }
    },
    deleteGroup(state,payload){
      state.allGroupChats.delete(payload);
      state.activeGroups.delete(payload);
      state.groups.delete(payload);
    },
    setActiveProduct(state,payload){
      if (payload != '') {
        state.activeProduct = payload;
      }
    },
    removeActiveProduct(state,payload){
        state.activeProduct = '';
        if (state.productComments.length) {
          state.productComments = [];
          state.commentResponses = new Map();
        }
    },
    getProductComments(state,payload){
      state.activeProduct  = payload[0].ProductId;
      if (state.productComments.length) {
        state.productComments = [];
      }
      state.productComments = payload;
    },
    appendProductComments(state, payload){
      if (state.activeProduct == payload.productId) {
        var comment = payload;
        var _commenter = state.allUsers.find(c => c.UserId == comment.commenterId);
          if (_commenter) {
                  var commenter = {
                  ImagePath: _commenter.ImagePath,
                  Lastname: _commenter.Lastname,
                  Firstname: _commenter.Firstname,
                  Comment: comment.comment,
                  CommentId : comment.id,
                  ProductId : comment.productId,
                  CommenterId: comment.commenterId,
                  RawDate: comment.date,
                  Date : moment(comment.date).format('ll'),
                  Time : moment(comment.date).format('LT')
            }
            state.productComments.push(commenter);
          }
      }
    },
    getEncryptionKey(state,payload){
      state.encryptionKey = payload;
    },
    groupCommentResponse(state,payload){
      state.commentResponses = new Map();
      state.commentResponses =  groupBy(payload, data => data.CommentId);
    },
    appendCommentResponse(state,payload){
     if (state.activeProduct == payload.productId) {
      var element = payload;
      var _user = state.allUsers.find(c => c.UserId == element.replierId);
      if (_user) {                                                                                                             //console.log(_user)
             var replyData = {
             Id : element.id,
             ProductId : element.productId,
             CommentId : element.commentId,
             Lastname: _user.Lastname,
             Firstname: _user.Firstname,
             UserId: element.replierId,    
             ImagePath: _user.ImagePath,
             Reply: element.response,
             RawDate:element.date,
             Date : moment(element.date).format('ll'),
             Time : moment(element.date).format('LT'),
        }
        if (state.commentResponses.has(replyData.CommentId)) {
          state.commentResponses.get(replyData.CommentId).push(replyData);
        }
        else{
          var newArr = []; newArr.push(replyData);
          state.commentResponses.set(replyData.CommentId,newArr)
        }
      }
     }
  },
  DeleteProductComment(state, payload){
    var id = payload;
    if ((state.activeProduct == id[0])) {
      state.productComments = state.productComments.filter(data => data.CommentId != id[1]);
    }
  },
  DeleteCommentResponse(state, id){
    if (state.activeProduct == id[0]) {
      if (state.commentResponses.has(id[2])) {
        var newArr = state.commentResponses.get(id[2]).filter(x => x.Id != id[1])
        state.commentResponses.set(id[2],newArr);
      }
    }
  },
  getNotifications(state,payload){
    var notifArr = [];
    var timeDiff = "";
    payload[1].forEach(element => {
      timeDiff = "";
    var notif = JSON.parse(element.value);
    var a = moment(new Date().toUTCString());
    var b = moment(notif.Date);
    var years = a.diff(b,'years');
    var months = a.diff(b,'months');
    var weeks = a.diff(b,'weeks');
    var days = a.diff(b,'days');
    var hours = a.diff(b,'hours');
    var minutes = a.diff(b,'minutes');
    var seconds = a.diff(b,'seconds');
    if (years > 0) {
      timeDiff = years+" years ago";
    }
    else if (months > 0) {
      timeDiff = months+" months ago";
    }
    else if (months > 0) {
      timeDiff = months+" months ago";
    }
    else if (weeks > 0) {
      timeDiff = weeks+" weeks ago";
    }
    else if (days > 0) {
      timeDiff = days+" weeks ago";
    }
    else if (hours > 0) {
      timeDiff = hours+" hours ago";
    }
    else if (minutes > 0) {
      timeDiff = minutes+" minutes ago";
    }
    else { timeDiff = seconds+" seconds ago";};
    var user = state.allUsers.find(u => u.UserId == notif.SenderId);
    if (user) {
      var userData = {
        Lastname : user.Lastname,
        Firstname : user.Firstname,
        ImagePath : user.ImagePath,
        Mobile : user.Mobile,
        TimeDiff : timeDiff,
      };
      Object.assign(notif,userData);
      notifArr.push(notif);
    }
    });
    notifArr.sort((c1,c2) => moment(c2.Date) - moment(c1.Date));
    state.notifications.set(payload[0],notifArr);
  },
  newNotification(state,payload){
    var timeDiff = "just now";
    var user = state.allUsers.find(u => u.UserId == payload.senderId);
    if (user) {
      var notif = payload;
      var userData = {
        Lastname : user.Lastname,
        Firstname : user.Firstname,
        ImagePath : user.ImagePath,
        Mobile : user.Mobile,
        TimeDiff : timeDiff,
        Id : notif.id,
        SenderId : notif.senderId,
        ReceiverId : notif.receiverId,
        Message : notif.message,
        NotificationType : notif.notificationType,
        ProductId : notif.productId,
        ProductName: notif.productName,
        Date : notif.date
      };
      if (state.user.IsAdmin && state.notifications.has("admin")) {//all push here has bben changed to unshift
        state.notifications.get("admin").unshift(userData);
        if (state.notifications.has(state.user.UserId) && notif.receiverId == state.user.UserId) {
          state.notifications.get(state.user.UserId).unshift(userData);//restructure this data so that it
        }
      }
      else{
        if (state.notifications.has(state.user.UserId)) {
          state.notifications.get(state.user.UserId).unshift(userData);//will be appended to the top
        }
        else{
          state.notifications.set(state.user.UserId,[userData]);
        }
      }
    }
  },
  getCoverImage(state,payload){
      state.coverImg = payload;
    }
  },
  actions: {
    logUser(context,payload){
      const checkEmailPass = context.state.allUsers.find(user => (user.Email == payload.Email || user.Mobile == payload.Mobile));
      if (checkEmailPass) {
        alert("notify.js email or username is registered")
      }
      else{
        axios.post(context.state.apiUrl+"default",payload)
          .then(
            response => {
              payload.UserId = response.data;
               context.commit("logUser",{msg:response.data,data:payload});
               if (confirm("proceed to create your digital store where you can display your products")) {
                router.push("/uploads");
               }
            }
            );
      }
    },
    getAndLogUser(context,payload){
      var userData = context.state.allUsers.find(user => (user.Email == payload.id || user.Mobile == payload.id) && Decryption(user.Password1) == Decryption(payload.password));
      if (userData) {
        if (context.state.user.UserId != "") {
          if (confirm("Would you like to overwrite the signed in account and keep this account signed in?")) {
            context.commit("getAndLogUser",userData);
            localStorage.setItem('userId',JSON.stringify(userData.UserId))
          }
          else{
            context.commit("getAndLogUser",userData);
          }
        }
        else{
          context.commit("getAndLogUser",userData);
        }
        context.dispatch(
          "keyBrandExists",
            {
              id : userData.UserId,
              operation: 'get',//check if brand exists then get it
              newBrand: null
            }
          );
          
          if (context.state.user.IsSuperAdmin) {
            context.dispatch("getNotifications","admin");
            context.dispatch("getNotifications",context.state.user.UserId);
          }
          else{
            context.dispatch("getNotifications",context.state.user.UserId);
          }
      }
      else{
        alert("Notify Js invalid login details")
      }

    },
    getAllUsers(context){
      axios.get(context.state.apiUrl+'default').then(
        response => {
          context.commit("getAllUsers",response.data);
      })
    },
    deleteUser(context,payload){
      axios.delete(context.state.apiUrl+'default/'+payload)
      .then(
        response => {
          context.commit("deleteUser",{id:payload,data:response.data});
          axios.delete(context.state.apiUrl+'brand/'+payload)
        },
        
      )
    },
    changeSuperAdmin(context,payload){
      axios.get(context.state.apiUrl+"default/"+payload).then(
        response => {
          var u = JSON.parse(response.data.value);
          if (u) {
           if (u.IsSuperAdmin == false) {
            u.IsSuperAdmin =! u.IsSuperAdmin;
            axios.post(context.state.apiUrl+"default/update",u)
            .then(
               response => {
                 context.commit("changeAffiliate",u);//the logic is same with change affiliate
               }
           );
           }
          }
        }
      );
    },
    changeAffiliate(context,payload){
      axios.get(context.state.apiUrl+"default/"+payload).then(
        response => {
          var u = JSON.parse(response.data.value);
          if (u) {
            u.IsAffiliate =! u.IsAffiliate;
              axios.post(context.state.apiUrl+"default/update",u)
               .then(
                  response => {
                    context.commit("changeAffiliate",u);
                  }
              );
          }
        }
      );
    },
    changeDp(context,payload){
      axios.post(context.state.apiUrl+"default/savefile",payload)
      .then(
        response => {
          context.commit("changeDp",response.data);
          context.dispatch("updateUser");
        }
        );
    },
    updateUser(context){
      axios.post(context.state.apiUrl+"default/update",context.state.user);
    },
    getUserByCookie(context){

      const userId = localStorage.getItem('userId');
      if (userId) {
       var id = JSON.parse(userId);
        if (id != null && id != undefined && id != '') {
          axios.get(context.state.apiUrl+'default/'+id)
          .then( 
            response => {
              context.commit('getUserByCookie',response.data);
              context.dispatch(
                "keyBrandExists",
                  {
                    id : id,
                    operation: 'get',//check if brand exists then get it
                    newBrand: null
                  }
                );

                //get notifications
                if (context.state.user.IsSuperAdmin) {
                  context.dispatch("getNotifications","admin");
                  context.dispatch("getNotifications",context.state.user.UserId);
                }
                else{
                  context.dispatch("getNotifications",context.state.user.UserId);
                }
            }
          )
        }
        
      }
    },
    keyBrandExists(context,payload){
      if (payload.id) {
        axios.get(context.state.apiUrl+"brand/"+payload.id)
        .then(
          response => {
           if (response.data) {
              if (payload.operation == 'get') {
                context.dispatch("getBrand",payload.id);
              }
              else if (payload.operation == 'create') {
                if (confirm("Do you want to update your brand account??")) {
                  context.dispatch("updateBrand",payload);
                }
              }
           }
           else{
            if(payload.operation == 'create') {
              context.dispatch("createBrand",payload);
            }
           }
          }
        );
      }
    },
    createBrand(context,payload){
       axios.post(context.state.apiUrl+"brand",payload.newBrand)
         .then(
           response => {
             context.commit("createBrand",{data:response.data,brand:payload.newBrand});
             context.dispatch("updateUser");
           }
         )
     },
    updateBrand(context,payload){
      axios.put(context.state.apiUrl+"brand/read",payload.newBrand)
        .then(
          response => {
            var id = JSON.parse(response.data.value).Id;
            var date = JSON.parse(response.data.value).Date;
            payload.newBrand.Id = id;
            payload.newBrand.Date = date;
            axios.put(context.state.apiUrl+"brand",payload.newBrand)
            .then(
              response => {
                context.commit("createBrand",{data:response.data,brand:payload.newBrand});
                context.dispatch("updateUser");
              }
            )
          }
        )
     },
     getAllProducts(context){
      axios.get(context.state.apiUrl+"product")
        .then(
          response => {
            if (response.data.length) {
              context.commit("getAllProducts",response.data);
            }
          }
        )
     },
     getAllBrands(context){
      axios.get(context.state.apiUrl+"brand")
        .then(
          response => {
            if (response.data.length) {
              context.commit("getAllBrands",response.data);
            }
          }
        )
     },
     _followBrand(context,payload){
      axios.post(context.state.apiUrl+"followers",payload);
     },
    getBrand(context,payload){
        var dummyBrand = {
          UserId : payload
        };
        axios.put(context.state.apiUrl+"brand/read",dummyBrand)
        .then(
          response => {
            context.commit("getBrand",response.data);
          }
        )
    },
    postProduct(context,payload){
      axios.post(context.state.apiUrl+"product",payload)//move it to action and mutation.
      .then(response => {
          if (response.data != 'failed' && response.data != '') {
            payload.Id = response.data;
            context.commit("postProduct",payload);
            alert("success");
          }
      });
    },
    postAds(context,payload){
      axios.post(context.state.apiUrl+"ads",payload)
      .then(response => {
          if (response.data != 'failed' && response.data != '') {
            payload.Id = response.data;
            context.commit("postAds",payload);
            alert("success");
          }
      });
    },
    postStory(context,payload){
      axios.post(context.state.apiUrl+"story",payload)
      .then(response => {
          if (response.data != 'failed' && response.data != '') {
            payload.Id = response.data;
            context.commit("postStory",payload);
            alert("success");
            router.push("/market");
          }
      });
    },
    getAds(context){
      axios.get(context.state.apiUrl+"ads").then(
        response => {
            if (response.data.length) {
              context.commit("getAds",response.data);
            }
        }
    )
    },
    manageOnlineUsers(context){
      var onlineUsers = [];
      var now = moment(new Date().toUTCString());
      axios.get(context.state.apiUrl+"connection").then(
          response => 
          {
              response.data.forEach(element => {
              var connections = JSON.parse(element.value);
              var userId = connections.UserId;
              var timeConnected = connections.Date;
              var signalrId = connections.SignalrId;
              var diff = now.diff(moment(timeConnected),'seconds');
              if (diff < 60 && context.state.user.UserId != userId) {              
                if (context.state.allUsers.length) {
                    var  user = context.state.allUsers.find(u => u.UserId == userId);
                    var onlineUser = {
                          Lastname : user.Lastname,
                          Firstname : user.Firstname,
                          ImagePath : user.ImagePath,
                          UserId : user.UserId,
                          SignalrId: signalrId
                    }
                    context.commit("manageOnlineUsers",onlineUser);
                }
              }
              else if(diff >= 7200 && userId == context.state.user.UserId)
              {
                context.dispatch("deleteConnection",signalrId);
              }
          });
          }
       );
    },
    deleteConnection(context,signalrId){
      axios.delete(context.state.apiUrl+"connection/"+signalrId).then(
        response => {
          console.log(response.data);
        }
      );
    },
    postChat(context,payload){
      axios.post(context.state.apiUrl+"chats/postchat",payload);
    },
    postGroupChat(context,payload){
      axios.post(context.state.apiUrl+"groups/postchat",payload);
    },
    getLastChats(context,payload){
      axios.get(context.state.apiUrl+"chats/"+payload).then(
        response => {
          if (response.data.length > 0) {
            context.commit("getLastChats",response.data);
          }
        }
      )
    },
    getGroups(context,payload){
      axios.get(context.state.apiUrl+"groups").then(
        response => {
          if (response.data.length) {
            context.commit("getGroups",response.data);
          }
        }
      )
    },
    getGroupChats(context){
      axios.put(context.state.apiUrl+"groups").then(
        response => {
          context.commit("getGroupChats",response.data);
        }
      )
    },
    getUserActiveGroups(context,payload){
      axios.get(context.state.apiUrl+"random/"+payload).then(
        response => {
         context.commit("getUserActiveGroups",response.data);
        }
      );
    },
    getProductComments(context,payload){
      var comments = [];
      axios.get(context.state.apiUrl+"comment/"+payload)
      .then(
          response => {
              if (response.data.length > 0) {
                  response.data.forEach(element => {
                      var comment = JSON.parse(element.value);
                      var _commenter = context.state.allUsers.find(c => c.UserId == comment.CommenterId);
                      if (_commenter) {
                          var commenter = {
                          ImagePath: _commenter.ImagePath,
                          Lastname: _commenter.Lastname,
                          Firstname: _commenter.Firstname,
                          Comment: comment.Comment,
                          CommentId : comment.Id,
                          ProductId : comment.ProductId,
                          CommenterId: comment.CommenterId,
                          RawDate:comment.Date,
                          Date : moment(comment.Date).format('ll'),
                          Time : moment(comment.Date).format('LT'),
                      }
                      comments.push(commenter);
                      }
                  });
              }
              comments.sort((c1,c2) => moment(c1.RawDate) - moment(c2.RawDate));
              if (comments.length > 0) {
                context.commit("getProductComments",comments);
              }
              else{ context.commit("setActiveProduct",payload);}
          }
      );
    },
    getCommentResponse(context,payload){
      var allReply = [];
      axios.get(context.state.apiUrl+"reply/"+payload)
      .then(
         response => {
             if (response.data.length > 0) {
                 response.data.forEach(element => {
                    var element = JSON.parse(element.value);
                    var _user = context.state.allUsers.find(c => c.UserId == element.ReplierId);
                    if (_user) {                                                                                                             //console.log(_user)
                         var replyData = {
                         Id : element.Id,
                         ProductId : element.ProductId,
                         CommentId : element.CommentId,
                         Lastname: _user.Lastname,
                         Firstname: _user.Firstname,
                         UserId: element.ReplierId,    
                         ImagePath: _user.ImagePath,
                         Reply: element.Response,
                         RawDate:element.Date,
                         Date : moment(element.Date).format('ll'),
                         Time : moment(element.Date).format('LT'),
                    }
                     allReply.push(replyData);
                     if (allReply.length > 0) {
                       context.commit("groupCommentResponse",allReply)
                     }
                    }               
                 });
             }
         } 
      );
      allReply.sort((c1,c2) => moment(c1.Date) - moment(c2.Date));
      
    },
    sendEmail(context,payload){
      axios.post(context.state.apiUrl+"email",payload).then(
        response => {
          console.log(response.data);
        }
      )
    },
    postNotification(context,payload){
      axios.post(context.state.apiUrl+"notifications",payload);
    },
    getNotifications(context,payload){
      axios.get(context.state.apiUrl+"notifications/"+payload).then(
        response => {
          if (response.data.length) {
            context.commit("getNotifications",[payload,response.data]);
          }
        }
      )
    },
    getEncryptionKey(context){
      axios.get(context.state.apiUrl+"random").then(
          response =>  {
            context.commit("getEncryptionKey",JSON.parse(response.data.value));
          }
      );
   },
   changeCoverImage(context,payload){
    axios.post(context.state.apiUrl+"default/savefile",payload)
    .then(
      response => {
        if (response.data) {
          context.commit("getCoverImage",response.data);
          context.dispatch("setCoverImage",response.data);
        }
      }
      );
   },
   setCoverImage(context,payload){
     axios.post(context.state.apiUrl+"coverImage/"+payload);
   },
   getCoverImage(context,payload){
     axios.get(context.state.apiUrl+"coverImage").then(
       response => {
        if (response.data) {
          context.commit("getCoverImage",response.data); 
        }
       }
     );
   }

  },
  modules: {
  }
})

