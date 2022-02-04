<template>
<div>
    <div class="brand-card" v-if="modifiedBrands.length">
        <h2 class="header-title">List of Registered Brands</h2>
        <div class="row">
            <div class="col-4" v-for="(brand,index) in modifiedBrands" :key="brand.Id">
                <div class="flex-col">
                    <div class="brand-info">
                        <div class="flex-row">
                            <div class="flex-col info">
                                <img :id="brand.UserId" @click="goToProducts" class="img-rounded" :src="photoUrl+brand.userImg" :alt="brand.Id">
                                <button @click="followBrand" :id="brand.UserId" class="btn">Follow</button>
                            </div>
                            <div class="flex-col info">
                                <b><label :id="brand.UserId" @click="goToProducts" for="">{{brand.Lastname}} {{brand.Firstname}}</label></b>
                                <label :id="brand.UserId" @click="goToProducts"  for="">{{brand.Name}}</label>
                                <label for="">{{brand.Category}}</label>
                                <label for="">{{brand.Day}}</label>
                                <label for="">{{brand.Time}}</label>
                            </div>
                        </div>
                    </div>
                    <div class="brand-desc">
                           <span :id="index" @click="showDesc" class="fas fa-chevron-down"></span>
                            <p :id="'p'+index">{{brand.Description}}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="product-btns brand-chevron" v-if="brands.length > 8">
            <div>
                <span class="fas fa-chevron-left"></span>
                <div>1/24</div>
                <span class="fas fa-chevron-right"></span>
            </div>
        </div>
    </div>
    <div v-else>
        <p>No data found now, visit the market place from <router-link to="/market">here</router-link></p>
    </div>
    <div v-if="showNotifier">
        <notifier :message="notifyData"/>
    </div>
</div>        
</template>

<script>
import {mapActions, mapMutations, mapState} from 'vuex'
import axios from 'axios'
import moment from 'moment'
import Notifier from './Notifier.vue'

export default {
  components: { Notifier },
    name: 'Brands',
    data() {
        return {
            brands : [],
            notifyData:{},
        }
    },
    created() {
       // console.log(this.modifiedBrands)
    },
    computed: {
            ...mapState(["apiUrl","photoUrl","user","allBrands","allUsers","modifiedBrands","showNotifier"]),
    },
    methods: {
        ...mapActions(["_followBrand"]),
        ...mapMutations(["setNotifier"]),

        getBrand(){
            alert("Get brand, collect the id from loop key and then call product components")
        },
        addSubscriber(){
            alert("be sure the clicker is registered then add to his list of subscribers/n sice this calls both forms, i'll use confirm to let user proceed to the suscribed psge or to remain on the brand page")
        },
        goToProducts(event){
            var userId = event.target.id;
            this.$router.push({name:"Products",params:{userId}});
        },
        followBrand(event){
            var brandFollowed = event.target.id;
            var userFollowing = this.user.UserId;
            var follower = {
                BrandFollowed : brandFollowed,
                UserFollowing : userFollowing
            }
            this._followBrand(follower);
            this.notifyData = {
            info : "success",
            msg : "you will get constant updates from this user"
            }
        this.setNotifier();
        },
        showDesc(event){
            var id = event.target.id;
            var index = id;
            var brand = document.getElementById("p"+id);
            if ( brand.style.display == 'none') {
                 brand.style.display = 'block';
            }
            else{
                 brand.style.display = 'none';
            }
          for (let i = 0; i < this.brands.length; i++) {
              var _brand = document.getElementById("p"+i);
              if ( _brand != brand && _brand.style.display == 'block') {
                  _brand.style.display = 'none';
                    brand.style.display = 'block';
              }
          }
         }
    },
}
</script>

<style>
.brand-desc p{
    display: none;
    margin: 15px;
}
.brand-card .img-rounded{
    width: 80px;
    height: 80px;
}
/* .brand-card .row{
    width: fit-content;
} */
    .brand-card .col-4{
        box-shadow: 0 0 20px 0px rgba(88, 64, 64, 0.3);
        width: 100%;
        height: 100%;
        /*overflow-y: scroll;*/
    }
    .brand-card .col-2:hover{
        cursor: pointer;
    }
    /* .brand-card .col-4 div{
        margin: 10px;
    } */
    .brand-info div{
        display: flex;
        justify-content: space-between;
        text-align: center;
    }

    .brand-img img{
        width: 80px;
        height: 80px;
        border-radius: 50%;
        margin-bottom: 1rem;
    }
    .brand-img .btn{
        width: 100px;
        height: 40px;
        font-size: 1rem;
        margin-top: 20px;
    }
    .brand-chevron{
        margin: 20px 5px;
    }



@media only screen and (max-width:520px){
  .brands{
    grid-template-columns: 100%;
  }
}
@media only screen and (max-width:320px){
  .brand{
    flex-direction: column;
    text-align: center;
    justify-content: center;
  }
  .brand-img{
    margin: 2px auto;
  }
}
</style>


