<template>
    <div>
        <input type="checkbox" id="nav-toggle">
        <div class="sidebar">
            <div class="sidebar-user">
                <div class="user-wrapper">  
                <img v-if="user.ImagePath" @click="activateInput" :src="photoUrl+user.ImagePath" alt="user-logo">
                <img v-else-if="coverImg" @click="activateInput" :src="photoUrl+coverImg" alt="cover-logo">
                <input @change="_changeDp" accept = ".jpg, .jpeg" type="file" id="dp"> 
                <div>
                    <h4 class="username">{{user.Lastname + " "+user.Firstname}}</h4>
                    <small v-if="user.IsSuperAdmin">super admin</small>
                    <small v-else-if="user.IsAdmin">admin</small>
                    <small v-else>regular</small>
                </div>
                </div>
            </div> 
            <div class="sidebar-menu">
                <ul>
                    <li @click="toggleActive" >
                        <router-link to="/" :class="{active : $route.Name === 'Home'}">
                            <i  class="fas fa-igloo"></i>
                            <span>Home</span>
                        </router-link>                        
                    </li>
                    <li @click="toggleActive" :class="{isAdmin : !user.IsAdmin}"  >
                        <router-link to="/myHome" :class="{active : $route.Name === 'MyHome'}">
                            <i  class="fas fa-home"></i>
                            <span>My Page</span>
                        </router-link>  
                        <!-- <span class="number">25</span> -->
                    </li>
                    <li @click="toggleActive" :class="{isAdmin : !user.IsSuperAdmin}" >
                        <router-link class="{isActive}" to="/admin" :class="{active : $route.Name === 'Admin'}">
                            <i  class="fas fa-user-circle"></i>
                            <span>Admin</span>
                        </router-link>  
                    </li>
                    <li @click="toggleActive" v-if="user.UserId">
                        <router-link  :to="`/products/${user.UserId}`">
                            <i  class="fas fa-clipboard-list"></i>
                            <span>Products</span>
                        </router-link>  
                    </li>
                    <li @click="toggleActive" >
                        <router-link to="/chats" :class="{active : $route.Name === 'Chats'}">
                            <i  class="fas fa-comments"></i>
                            <span>Chats</span>
                        </router-link>  
                    </li>
                    <li @click="toggleActive" :class="{isAdmin : !user.IsAdmin}" >
                        <router-link to="/uploads" :class="{active : $route.Name === 'Uploads'}">
                            <i  class="fas fa-cloud"></i>
                            <span>Upload</span>
                        </router-link>  
                    </li>
                </ul>
            </div>
        </div>

        <div class="main-content">
            <div class="header">
                <input type="checkbox" id="nav-icons-toggle">
                <header>
                <h1>
                <label for="nav-toggle"><span class="fas fa-bars"></span></label>
                </h1>
                <div class="header-brand">
                    <h2 class="brand-logo"><i class="fas fa-shopping-cart"></i> <span>Shop Swift</span></h2>
                    <div class="search-wrapper">
                        <span class="fas fa-search"></span>
                        <input v-on:keyup="search" class="search-text" v-on:blur="inputBlur()" type="search" name="search" id="search" placeholder="search">
                    </div>
                </div>
                <div class="nav-icons">
                <label for="nav-icons-toggle"> <span class="fas fa-search search"></span></label>
                    <router-link to="/market"><span class="fas fa-cart-plus link"></span></router-link>
                    <router-link to="/brands"><span class="fas fa-users link"></span></router-link>
                    <router-link to="/login"><span class="fas fa-sign-in-alt link"></span></router-link>
                </div>
                </header>
            </div>
            <main>
            <router-view/>
            </main>
        </div>
    </div>
</template>

<script>
import {mapState, mapActions, mapMutations} from 'vuex'
import moment from 'moment'      // "fortawesome": "0.0.1-security",
///// for later use |||||| back slash \\\\
// dotnet server publish code
// dotnet publish -c Release -o ./publish
//git push coomands
// git commit -m "initial update"
//git remote add origin https://github.com/ucheCodes/Shop-Swift.git
//
// git push -u origin main
export default {
  name: 'Main',
  components: {
  },data() {
      return {

      }
  },
  computed: {
      ...mapState(["photoUrl","user","allProducts","allBrands","coverImg"]),
  },
  methods: {
      ...mapActions(["keyExists","changeDp","getUserByCookie","getAllUsers","getAllProducts","getAllBrands","getAds"]),
      ...mapMutations(["modifyBrands"]),

        search(){
            var text = document.querySelector(".search-text").value;
            if (text != '') {
                this.$router.push({name:'Searched',params:{text:text.toLowerCase()}});
            }
        },
      toggleActive(){
          this.isActive = !this.isActive
          var nav_toggler = document.querySelector("#nav-toggle");
          if (!nav_toggler.checked) {
              nav_toggler.checked = true;
          }
      },
      inputBlur(){
          var nav_icons_toggler = document.querySelector("#nav-icons-toggle");
          var search_input = document.querySelector(".search-wrapper input");
          search_input.value = "";
          if (nav_icons_toggler.checked) {
              nav_icons_toggler.checked = false;
          }

      },
      activateInput(){
        if (confirm("Do you want to update your display photo?")) {
            document.getElementById("dp").click();
        }
      },
      _changeDp(event){
        let formData = new FormData();
        formData.append('file',event.target.files[0]);
        this.changeDp(formData);
      }
  },
  created() {
  },
  mounted() {
  },
}
</script>

<style>
.isAdmin,#dp{
    display: none;
}
#nav-icons-toggle{
    display: none;
}
#nav-icons-toggle:checked  + header .search-wrapper{
    display:flex;
}
#nav-toggle{
    display: none;
  }
  #nav-toggle:checked + .sidebar{
      width: 70px;
  }
  #nav-toggle:checked + .sidebar .sidebar-brand,
  #nav-toggle:checked + .sidebar li{
     padding-left: 1rem;
     text-align: center;
  }
  #nav-toggle:checked + .sidebar li a{
     padding-left: 0rem;
  }
  #nav-toggle:checked + .sidebar li  span:last-child{
      display: none;
  }
  
 #nav-toggle:checked + .sidebar .user-wrapper img{
      width: 50px;
      height: 50px;
  }
 #nav-toggle:checked + .sidebar .user-wrapper h4{
      font-size: 1rem;
  }
 #nav-toggle:checked + .sidebar .user-wrapper small{
      font-size: .5rem;
  }
  #nav-toggle:checked  + .sidebar .user-wrapper .username{
    display:none;
}
     #nav-toggle:checked ~ .main-content{
     margin-left: 70px;
  }
     #nav-toggle:checked ~ .main-content header{
     width: calc(100%-70px);
     left: 70px;
  }
    .sidebar{
        width: 345px;
        height: 100%;
        position: fixed;
        background: var(--main-color);
        left: 0;
        top: 0;
        z-index: 100;
        transition: width 300ms;
    }
    .sidebar-menu{
        margin-top: 1rem;
    }
    .sidebar-menu li{
        width: 100%;
        margin-bottom: 1.7rem;
        padding-left: 1rem;
    }
    .sidebar-menu li span{
        color: var(--white);
        font-size: 1.2rem;
    }
    .sidebar-menu li a{
        padding-left: 1rem;
        display: block;
        color: var(--white);
    }
    .sidebar-menu li .number{
        background: red;
        color: var(--white);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 15px;
        height: 15px;
    } 
     i{
        font-size: 2rem;
    }
    .sidebar-menu  a.active,
    .sidebar-menu  a:hover{
        background:var(--white);
        padding-top: 1rem;
        padding-bottom: 1rem;
        color: var(--main-color);
        border-radius: 30px 0 0 30px;
    }
    .sidebar-menu  a.active span,
    .sidebar-menu  a:hover span{
        color: var(--main-color);
        font-weight: bold;
        padding-left: .5rem;
    }
    .sidebar-menu a:first-child{
        padding-right: 1rem;
        font-size: 1.2rem;
    }

    .btn{
    background: var(--main-color);
    border-radius: 10px;
    color: var(--white);
    font-size: .8rem;
    padding: .5rem 1rem;
    border: 1px solid var(--white);
    margin: 1rem;
  }
 .btn:hover{
    background: var(--color-dark);
    cursor: pointer;
  }


    /*header styles*/
     .main-content{
    margin-left: 345px;
    transition: margin-left 300ms;
  }
  main{
    background: var(--back-color);
    padding: 2rem 1.5rem;
    min-height: calc(100vh-90px);
    margin-top: 58px;
  }
  header{
    display: flex;
    justify-content: space-between;
    padding: 1rem .2rem;
    left: 0 !important;
    top: 0;
    box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
    width: 100%;
    height: 3.5rem;
    z-index: 100;
    transition: left 300ms;
    background: transparent;
    position: fixed;
  }
  header h1 span{
      color: var(--white);
  }
    .header-brand{
        color: var(--main-color);
        height: 90px;
        display: flex;
    }
    .header-brand span{
        display: inline-block;
        padding-right: 1rem;
        color: var(--main-color);
    }
    header .nav-icons{
        display: flex;
        color: var(--main-color);
        font-size: 1.5rem;
        justify-content: space-between;
    }
    header .nav-icons span{
        margin: 0 1rem;
    }
    header .nav-icons span:hover{
        cursor: pointer;
        color: var(--color-dark);
    }
  .search-wrapper{
    border: 1px solid #ccc;
    border-radius: 30px;
    height: 36px;
    display: none;
    align-items: center;
    overflow-x: hidden;
    margin-bottom: 2rem;
    justify-content: center;
    overflow: hidden;
  }
  .search-wrapper input{
    width: 80%;
    margin: 2px;
    height: 100%;
    padding:.5rem 1rem;
    border: none;
    outline: none;
  }
    .search-wrapper span{
    display: inline-block;
    font-size: 1.5rem;
    padding: 0 .5rem;
    margin: auto;
  }
  .user-wrapper{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .user-wrapper h4{
    margin-bottom: 0rem !important;
    font-size: 1.5rem;
  }
  .user-wrapper small{
    display: inline-block;
    color: var(--text-gray);
    margin-bottom: 1.5rem;
    font-size: 1rem;
  }
  .user-wrapper img{
    width: 110px;
    height: 110px;
    border-radius: 50%;
    margin: 50px 0 5px 0;
  }

@media only screen and (max-width:768px){
     .nav-icons, i, .header span{
         font-size: 1.4rem !important;
     }
     #nav-icons-toggle:checked  + header .search-wrapper{
      display:flex;
    }
     #nav-icons-toggle:checked  + header .brand-logo{
      display:none;
    }
    .sidebar{
        width: 70px;
    }
 
  .user-wrapper h4{
    font-size: 2rem !important;
  }
  .user-wrapper small{
    font-size: 1rem !important;
    font-weight: bold !important;
    color: var(--white) !important;
  }
  .user-wrapper img{
    width: 100px !important;
    height: 100px !important;
  }

 .sidebar{
     left: -100px !important;
 }
 header h1 label{
     display: inline-block;
     background-color: var(--main-color);
     margin-right: 1rem;
     height: 35px;
     width: 35px;
     border-radius: 50%;
     color: var(--white);
 }
 header h1 span{
     text-align: center;
     padding-top: 5px;
     color: var(--white);
 }
 .main-content{
     width: 100%;
     margin-left: 0rem;
 }
 header{
     width: 100% !important;
     left: 0 !important;
     position: fixed;
     padding: 1rem;
     margin: .5rem;
 }


  #nav-toggle:not(:checked) + .sidebar{/**I broke this code by cheanging the checked property to not checked */
      left: 0 !important;
      z-index: 100;
      width: 345px;
  }
  #nav-toggle:not(:checked) + .sidebar li{
     padding-left: 2rem;
     text-align: left;
  }
  #nav-toggle:not(:checked) + .sidebar li a{
     padding-left: 1rem;
  }
  #nav-toggle:not(:checked) + .sidebar li span{
      display: inline-block !important;
  }
  .sidebar-menu  a.active span,
    .sidebar-menu  a:hover span{
        display: none;
    }
     #nav-toggle:checked ~ .main-content{
     margin-left: 0rem !important;
  }
     #nav-toggle:checked ~ main{
     margin-left: -10rem !important;
  }
 
}
@media only screen and (max-width:560px){
  .brand-logo{
      display: none;
  }
  .nav-icons .link{
      display: none;
  }
  #nav-icons-toggle:not(:checked)  + header .link{
    display:flex;
    }
}
@media only screen and (max-width:375px){
  .nav-icons, i, .header span{
      font-size: 1.2rem !important;
  }
  .custom label{
  font-weight: bold;
  font-size: 15px !important;
}
.custom select{
  width: 70px !important;
}
}
</style>