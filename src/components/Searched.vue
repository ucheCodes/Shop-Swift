<template>
    <div>
        <div>
            <h2>Filter Search By ...</h2>
            <select name="search" @change="searchFilterChanged" >
                <option v-if="products.length" value="products" selected>Products</option>
                <option v-if="brands.length" value="brands">Brands</option>
                <option v-if="users.length" value="users">People</option>              
            </select>
        </div>
        <div  v-if="selected == 'products'">
            <h2 class="header-title">Searched Products</h2>
            <div class="row">
                <div class="col-4" v-for="product in products" :key="product.Id">
                    <div class="product">
                        <div class="product-img">
                            <img :id="product.Id" @click="viewProduct(product.Id)" :src="photoUrl+product.ImagePath" :alt="product.Id">
                        </div>
                        <div class="product-name" @click="viewProduct(product.Id)">
                            <h3>{{product.Name}}</h3>
                        </div>
                        <div class="product-icons flex-row" v-if="user.UserId">
                            <div @click="like(product.Id,user.UserId)"><label class="number">123</label><span class="fas fa-thumbs-up"></span></div>
                            <div @click="comment(product.Id,user.UserId,product.UserId)"><label class="number">12387</label><span class="fas fa-comment-alt"></span></div>
                        </div>
                    </div>
                </div>    
            </div>
        </div>
        <div class="row brand-card" v-else-if="selected == 'brands'">
            <div class="col-4" v-for="(brand,index) in brands" :key="brand.Id">
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
        <div class="users" v-else-if="selected == 'users'">
            <h2 class="header-title">Searched Users</h2>
            <div class="brand-card">
                <div class="row">
                    <div class="col-4 flex-row"  v-for="user in users" :key="user.userId">
                        <div>
                            <img :id="user.userId" @click="goToProducts"   class="img-rounded" :src="photoUrl+user.imagePath" alt="g"/>
                        </div>
                        <div class="flex-col">
                            <b><label for="">{{user.lastname}} {{user.firstname}}</label></b>
                            <div class="flex-row">
                                <span :id="user.userId" @click="goToProducts" class="fas fa-user-circle"></span>
                                <span class="fas fa-phone"></span>
                                <span class="fas fa-video"></span>
                                <span @click="goToChat(user.userId)" class="fas fa-comment-alt"></span>
                            </div>
                            <div><span class="fas fa-phone green"></span>{{user.mobile}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else><p>No result found</p></div>
        <div>
            <notifier :message="notifyData"/>
        </div>
    </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import axios from 'axios'
import Notifier from './Notifier.vue'
export default {
  components: { Notifier },
    name:'Searched',
    props:['text'],
    data() {
        return {
            products:[],
            brands:[],
            users:[],
            selected:'products',
            notifyData : {},
        }
    },
    computed:{
        ...mapState(['user','photoUrl','apiUrl','allProducts','allBrands','modifiedBrands'])
    },
    watch:{
        text: function (oldtext, newtext) {
           // console.log(oldtext);
           this.search(oldtext);
        }
    },
    methods: {
        ...mapActions(["_followBrand"]),
        ...mapMutations(["setNotifier"]),

        search(text){
            this.products  = this.allProducts.filter(p => p.Search.toLowerCase().includes(text) || p.Name.toLowerCase().includes(text) || p.Category.toLowerCase().includes(text));
            this.brands = this.modifiedBrands.filter(b => b.Name.toLowerCase().includes(text) || b.Category.toLowerCase().includes(text) || b.Firstname.toLowerCase().includes(text) || b.Lastname.toLowerCase().includes(text));
            this.getUsers(text);
        },
        searchFilterChanged(event){
            this.selected = event.target.options[event.target.selectedIndex].value;
        },
        viewProduct(id){
            this.$router.push({name : "Productviewer",params: {product : id}});
        },
        comment(productId,commenterId,posterId){
           this.$router.push({name:"ProductComments",params:{productId:productId,commenterId:commenterId,posterId:posterId}})
        },
        goToProducts(event){
            var userId = event.target.id;
            this.$router.push({name:"Products",params:{userId}});
        },
        goToChat(receiverId){
            if (this.user.UserId && (receiverId != this.user.UserId)) {
                this.$router.push({name:'Chats',params:{receivingUserId:receiverId}});
            }
            else{
                this.notifyData = {
                    info : "error",
                    msg : "this chat cannot be initiated. Sender and Receiver Identity is same."
                }
                alert(this.showNotifier);
                this.setNotifier();
      }
    },
        getUsers(text){
           if (text) {
                axios.get(this.apiUrl+"email/"+text).then(
                response => {
                    if (response.data.length) {
                       this.users = response.data; 
                    }
                }

            )
           }
        },
        followBrand(event){
            var brandFollowed = event.target.id;
            var userFollowing = this.user.UserId;
            var follower = {
                BrandFollowed : brandFollowed,
                UserFollowing : userFollowing
            }
            this._followBrand(follower);
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
    created() {
    },
    mounted() {
        this.search(this.text);
        if(this.user.UserId == '') {
            this.notifyData = {
            info : "success",
            msg : "welcome to shop swift, we appreciate your presence here. kindly sign up for a better user experience. "
            }
        this.setNotifier();
        }
    },
}
</script>