<template>
  <div>
    <Main/>
  </div>
</template>

<script>
import Main from '@/components/Main.vue'
import connection from './signalrHub'
import { mapState, mapActions, mapMutations } from 'vuex';
import axios from 'axios';
import store from './store'
import router from './router'
import { groupBy } from './assets/groupBy';

export default {
  name: 'Home',
  components: {
    Main
  },
  computed:{
    ...mapState(["users","signalrId","apiUrl"])
  },
  methods: {
      ...mapActions(["getEncryptionKey","getCoverImage","keyExists","changeDp","getUserByCookie","getAllUsers","getAllProducts","getAllBrands","getAds","getGroupChats"]),
  },
  created() {
    // axios.get(this.apiUrl+"default").then(
    //   response => {
    //     console.log("making api calls ...");
    //     console.log(response.data);
    //   }
    // );
  },
   mounted() {
    connection.client.on("NewChat",function (chat) {
      store.commit("postChat",chat);
    });
    connection.client.on("GroupChat",function (chat) {
      store.commit("postGroupChat",chat);
    });
    connection.client.on("LastChat",function (lc) {
      store.commit("appendLastChat",lc);
    });
    connection.client.on("DeleteChat",function (chat) {
      store.commit("deleteChat",chat);
    });
    connection.client.on("DeleteGroup",function (groupId) {
      store.commit("deleteGroup",groupId);
      router.go(-1);
    });
    connection.client.on("DeleteGroupChat",function (groupId,id) {
      var groupId = groupId; var id = id;
      store.commit("deleteGroupChat",{groupId : groupId, id : id});
    });
    connection.client.on("NewGroup",function (group) {
      store.commit("addToGroup",group);
    });
    connection.client.on("JoinGroup",function (groupId) {
      store.commit("injectActiveGroups",groupId);
    });
    connection.client.on("NewProductComment",function (comment) {
      store.commit("appendProductComments",comment);
    });
    connection.client.on("NewCommentResponse",function (response) {
      store.commit("appendCommentResponse",response);
    });
    connection.client.on("DeleteProductComment",function (ids) {
      store.commit("DeleteProductComment",ids);
    });
    connection.client.on("DeleteCommentResponse",function (ids) {
      store.commit("DeleteCommentResponse",ids);
    });
    connection.client.on("NewNotification",function (notif) {
      store.commit("newNotification",notif);
    });
    connection.start();

      this.getAllUsers();  
      this.getAllBrands();
      this.getAllProducts();
      this.getAds();
      this.getGroupChats();
      this.getEncryptionKey();
      this.getCoverImage();
      this.getUserByCookie();


    setInterval(function() {
          store.commit("hideNotifier");
    },20000);
    setInterval(function () {
      if (store.state.user.UserId != '' && store.state.signalrId != '') {
        var con = {
          signalrId : store.state.signalrId,
          UserId : store.state.user.UserId,
          Date : new Date().toUTCString()
        };
      axios.post(store.state.apiUrl+"connection",con);
      store.dispatch("manageOnlineUsers");
     }
    },30000)
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
:root{
  --main-color: royalblue;
  --color-dark: #1D2231;
  --back-color: #f1f5f9;
  --text-gray: #8390A2;
  --white: #ffffff;
}
*{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  list-style-type: none;
  text-decoration: none;
}
.one-input-modal{
        width: 250px;
        height: 100px;
        z-index: 30;
        margin: auto;
        background: var(--color-dark);
        color: var(--white); 
        border-radius: 10px;
        box-shadow: rgba(0.1, 0.1, 0.2, alpha);
        position: absolute;
        top: 50%;
        left: 10%;
        display: none;
    }
    .one-input-modal.show{
        display: block;
    }
    .one-input-modal input, .one-input-modal .btn{
       border-radius: 30px;
       width: 95%;
       padding: 2px;
       font-size: 14px;
       height: 25px;
       margin: 5px 10px;
    }
</style>

