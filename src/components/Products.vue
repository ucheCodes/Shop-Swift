<template>
<div>
    <div class="product-container"  v-if="brandData">
        <div class="product-background">
            <div class="row">
                <div class="col-2">
                    <h2>{{brandData.Name}}</h2>
                    <p>{{brandData.Description}}</p>
                    <p class="green" v-if="isAffiliate">{{brandData.Name}} is a trusted affiliate and agent of Shop Swift</p>
                    <button class="button">Explore</button>
                </div>
                <div class="col-2 back-img">
                    <input @change="_changeBrandDp" type="file" id="brand_dp">
                    <img @click="activateInput" :src="photoUrl+brandData.ImagePath" alt="">
                </div>
            </div>
        </div>
        <div class="recent-products" v-if="recentProducts.length">
            <h2 class="header-title">Recent Products</h2>
            <div class="row">
                <div class="col-4" v-for="product in recentProducts" :key="product.Id">
                    <div class="product">
                        <div class="product-top">
                            <div class="product-icons" v-if="user.UserId == userId">
                                <span  @click="deleteProduct(user.UserId,product.Id)" class="fas fa-trash"></span>
                                <span @click="edit(product.Id)" class="fas fa-edit"></span>
                            </div>
                            <div class="product-icons" v-else>
                                <span  @click="_addToCart(product.Id,product.UserId)" class="fas fa-cart-arrow-down"></span>
                                <span  @click="goToChat(product.UserId)" class="fas fa-comments"></span>
                                <span v-if="cart.length > 0" @click="viewCart" class="fas fa-eye"></span>
                            </div>
                            <div v-if="product.Unit == 'naira'" class="product-price">NGN <span>{{product.Price}}</span></div>
                            <div v-else-if="product.Unit == 'pounds'" class="product-price">GBP <span>{{product.Price}}</span></div>
                            <div v-else-if="product.Unit == 'dollar'" class="product-price">USD <span>{{product.Price}}</span></div>
                            <div v-else-if="product.Unit == 'cedi'" class="product-price">GHC <span>{{product.Price}}</span></div>
                            <div v-else-if="product.Unit == 'yen'" class="product-price">JPY <span>{{product.Price}}</span></div>
                        </div>
                        <div class="product-img">
                            <img :id="product.Id" @click="viewProduct" :src="photoUrl+product.ImagePath" :alt="product.Id">
                        </div>
                        <div class="product-name">
                            <h3>{{product.Name}} <span v-if="isAffiliate" class="fas fa-check green"></span></h3>
                        </div>
                        <div class="product-icons flex-row" v-if="user.UserId">
                            <div v-if='likesCount.has(product.Id)' @click="like(product.Id,user.UserId)"><label class="number">{{likesCount.get(product.Id)}}</label><span class="fas fa-thumbs-up"></span></div>
                            <div v-else @click="like(product.Id,user.UserId)"><label class="number">0</label><span class="fas fa-thumbs-up"></span></div>
                            <div v-if='commentsCount.has(product.Id)' @click="comment(product.Id,user.UserId,product.UserId)"><label class="number">{{commentsCount.get(product.Id)}}</label><span class="fas fa-comment-alt"></span></div>
                            <div v-else @click="comment(product.Id,user.UserId,product.UserId)"><label class="number">0</label><span class="fas fa-comment-alt"></span></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="product-btns" v-if="recentProducts.length > 8">
                <div>
                    <span class="fas fa-chevron-left"></span>
                    <div>1/24</div>
                    <span class="fas fa-chevron-right"></span>
                </div>
            </div>
        </div>

        <div class="products-category" v-if="category.length">
            <div class="category-dropdown">
                <h2 class="header-title">Categorized Products</h2>
                <select name="categoy" id="category" @change="getCategoryData" >
                    <option value="select Category" selected>View Categorized Products</option>
                    <option v-for="c in category" :key="c" :value="c">{{c}}</option>
                </select>
            </div>
            <div class="row" v-if="categoryProducts.length">
                <div class="row">
                    <div class="col-4" v-for="product in categoryProducts" :key="product.Id">
                        <div class="product">
                            <div class="product-top">
                                <div class="product-icons" v-if="user.UserId == userId">
                                    <span  @click="deleteProduct(user.UserId,product.Id)" class="fas fa-trash"></span>
                                    <span @click="edit(product.Id)" class="fas fa-edit"></span>
                                </div>
                                <div class="product-icons" v-else>
                                    <span  @click="_addToCart(product.Id,product.UserId)"  class="fas fa-cart-arrow-down"></span>
                                    <span  @click="goToChat(product.UserId)" class="fas fa-comments"></span>
                                    <span v-if="cart.length > 0" @click="viewCart" class="fas fa-eye"></span>
                                </div>
                                <div v-if="product.Unit == 'naira'" class="product-price">NGN <span>{{product.Price}}</span></div>
                                <div v-else-if="product.Unit == 'pounds'" class="product-price">GBP <span>{{product.Price}}</span></div>
                                <div v-else-if="product.Unit == 'dollar'" class="product-price">USD <span>{{product.Price}}</span></div>
                                <div v-else-if="product.Unit == 'cedi'" class="product-price">GHC <span>{{product.Price}}</span></div>
                                <div v-else-if="product.Unit == 'yen'" class="product-price">JPY <span>{{product.Price}}</span></div>
                            </div>
                            <div class="product-img">
                                <img :id="product.Id" @click="viewProduct" :src="photoUrl+product.ImagePath" :alt="product.Id">
                            </div>
                            <div class="product-name">
                                <h3>{{product.Name}} <span v-if="isAffiliate" class="fas fa-check green"></span></h3>
                            </div>
                            <div class="product-icons flex-row" v-if="user.UserId">
                            <div v-if='likesCount.has(product.Id)' @click="like(product.Id,user.UserId)"><label class="number">{{likesCount.get(product.Id)}}</label><span class="fas fa-thumbs-up"></span></div>
                            <div v-else @click="like(product.Id,user.UserId)"><label class="number">0</label><span class="fas fa-thumbs-up"></span></div>
                            <div v-if='commentsCount.has(product.Id)' @click="comment(product.Id,user.UserId,product.UserId)"><label class="number">{{commentsCount.get(product.Id)}}</label><span class="fas fa-comment-alt"></span></div>
                            <div v-else @click="comment(product.Id,user.UserId,product.UserId)"><label class="number">0</label><span class="fas fa-comment-alt"></span></div>
                             </div>
                        </div>
                    </div>
            </div>
            </div>

            <div class="product-btns" v-if="categoryProducts.length > 8">
                <div>
                    <span class="fas fa-chevron-left"></span>
                    <div>1 / {{categoryProducts.length}}</div>
                    <span class="fas fa-chevron-right"></span>
                </div>
            </div>
        </div>

        <div class="products-category" v-if="products.length">
           <h2 class="header-title">All Products</h2>
             <div class="row">
                <div class="col-4" v-for="product in products" :key="product.Id">
                    <div class="product">
                        <div class="product-top">
                            <div class="product-icons" v-if="user.UserId == userId">
                                <span @click="deleteProduct(user.UserId,product.Id)" class="fas fa-trash"></span>
                                <span @click="edit(product.Id)" class="fas fa-edit"></span>
                            </div>
                            <div class="product-icons" v-else>
                                <span  @click="_addToCart(product.Id,product.UserId)"  class="fas fa-cart-arrow-down"></span>
                                <span  @click="goToChat(product.UserId)" class="fas fa-comments"></span>
                                <span v-if="cart.length > 0" @click="viewCart" class="fas fa-eye"></span>
                            </div>
                            <div v-if="product.Unit == 'naira'" class="product-price">NGN <span>{{product.Price}}</span></div>
                            <div v-else-if="product.Unit == 'pounds'" class="product-price">GBP <span>{{product.Price}}</span></div>
                            <div v-else-if="product.Unit == 'dollar'" class="product-price">USD <span>{{product.Price}}</span></div>
                            <div v-else-if="product.Unit == 'cedi'" class="product-price">GHC <span>{{product.Price}}</span></div>
                            <div v-else-if="product.Unit == 'yen'" class="product-price">JPY <span>{{product.Price}}</span></div>
                        </div>
                        <div class="product-img">
                            <img :id="product.Id" @click="viewProduct" :src="photoUrl+product.ImagePath" :alt="product.Id">
                        </div>
                        <div class="product-name">
                            <h3>{{product.Name}} <span v-if="isAffiliate" class="fas fa-check green"></span></h3>
                        </div>
                        <div class="product-icons flex-row" v-if="user.UserId">
                            <div v-if='likesCount.has(product.Id)' @click="like(product.Id,user.UserId)"><label class="number">{{likesCount.get(product.Id)}}</label><span class="fas fa-thumbs-up"></span></div>
                            <div v-else @click="like(product.Id,user.UserId)"><label class="number">0</label><span class="fas fa-thumbs-up"></span></div>
                            <div v-if='commentsCount.has(product.Id)' @click="comment(product.Id,user.UserId,product.UserId)"><label class="number">{{commentsCount.get(product.Id)}}</label><span class="fas fa-comment-alt"></span></div>
                            <div v-else @click="comment(product.Id,user.UserId,product.UserId)"><label class="number">0</label><span class="fas fa-comment-alt"></span></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="product-btns" v-if="products.length > 8">
                <div>
                    <span class="fas fa-chevron-left"></span>
                    <div>1/ {{products.length}}</div>
                    <span class="fas fa-chevron-right"></span>
                </div>
            </div>
        </div>
        <div v-else>
            <p>No Product Uploads yet</p>
            <button @click="goToMarket" class="btn">Surf For Products</button>
        </div>
    </div>

        <div v-if="story.length">
            <h2 class="header-title">Story</h2>
            <div class="row">
                <div class="col-2">
                    <div class="myslides fade"  v-for="(s,count) in story" :key="s.Id"  :id="s.UserId">
                        <div class="numbertext">{{count}}/{{story.length}}</div>
                        <div v-if="s.File.includes('.jpg') || s.File.includes('.jpeg')">
                            <img :src="photoUrl+s.File" :alt="s.Id"/>
                        </div>
                        <div v-else-if="s.File.includes('.mp4') || s.File.includes('.3gp')">
                            <video controls :src="photoUrl+s.File"></video>
                        </div>
                        <div>
                            <p>{{s.Desc}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="showNotifier">
            <notifier :message="notifyData"/>
        </div>
</div>
</template>

<script>
// import slider from '../data/slider.js'
import Brands from '@/components/Brands.vue'
// import Notifier from '@/components/Notifier.vue'
import {mapState,mapActions, mapMutations} from 'vuex'
import {showSlide} from  "../data/slider"
import axios from 'axios'
import moment from 'moment'
import Notifier from './Notifier.vue'

export default {
  components: { Notifier },
    name: "Products",
    props: ['userId'],
    component:{Brands,Notifier},
    data() {
        return {
            brandData : null, //while api is loading, I can check out some codes to show spinner
            products : [],
            commentsCount: new Map(),
            likesCount: new Map(),
            recentProducts : [],
            categoryProducts: [],
            category: [],
            story:[],
            notifyData: {},
            isAffiliate : false
        }
    },
    created() {
      this.getData(this.userId);
    },
    watch:{
        userId: function(newId,oldId) {
            this.getData(newId);
            //this.getStory(newId);
        }
    },
    computed:{
        ...mapState(["apiUrl","photoUrl","brand","user","cart","allProducts","allAds","showNotifier"]),
    },
    methods: {
        ...mapMutations(["addToCart","removeDeletedProduct","setNotifier"]),
        ...mapActions(["postNotification"]),

        viewCart(){
            this.$router.push("/cart");
        },
        deleteProduct(userId,productId){
            var idArr = [userId,productId];
            var id = JSON.stringify(idArr);
            if (confirm("This product will be deleted permanently ...")) {
                  axios.delete(this.apiUrl+'product/'+id)
                .then(
                    response => {
                        if (response.data == 'success') {
                           this.products = this.products.filter(product => product.Id != productId);
                           this.recentProducts = this.recentProducts.filter(product => product.Id != productId);
                           this.categoryProducts = this.categoryProducts.filter(product => product.Id != productId);
                            this.removeDeletedProduct(productId);
                        }
                    }
                );
            }
        },
        edit(id){
            this.$router.push({name:'Upload',params:{productId:id}});
        },
        getProducts(id){
            this.products = [];
           axios.get(this.apiUrl+"product/"+id)
            .then(
                response => {
                   response.data.forEach(element => {
                      this.products.push(JSON.parse(element.value));
                      var id2 = JSON.parse(element.value).Id;
                      //code below to get number of likes associated to each product comment // will write for likes too
                        axios.get(this.apiUrl+"comment/"+id2).then(
                           response => {
                            if (response.data.length) {
                                this.commentsCount.set(id2,response.data.length);
                            }
                           }
                        );
                        axios.get(this.apiUrl+"like/"+id2).then(
                           response => {
                            if (response.data.length) {
                                this.likesCount.set(id2,response.data.length);
                            }
                           }
                        );
                   });
                   var cat = localStorage.getItem(id);
                   var now = moment(new Date());//sort the code below
                   this.recentProducts = this.products.filter(product =>now.diff(moment(product.Date),'days') <= 7);
                   if (cat) {
                       this.category = JSON.parse(cat);
                   }
                }
            )
            this.getStory(id);
                axios.get(this.apiUrl+"default/"+id).then(
                    response => {
                    if (response.data) {
                        var u = JSON.parse(response.data.value);
                        this.isAffiliate = u.IsAffiliate;
                    }
                    }
                );
         },
         viewProduct(event){
             var id = event.target.id;//this.products.filter(p => p.Id == event.target.id);
             this.$router.push({name : "Productviewer",params: {product : id}});
         },
         getCategoryData(event){
             this.categoryProducts = this.products.filter(products => products.Category == event.target.value);
         },
        activateInput(){
            if (this.user.UserId == this.userId){
                if (confirm("Do you want to update your Brand photo?")) {
                document.getElementById("brand_dp").click();
            }
            }
         },
        like(productId,userId){
            axios.post(this.apiUrl+"like/"+JSON.stringify([productId,userId])).then(
                response => {
                    if(response.data == 'success'){
                        var add = 0;
                       if (this.likesCount.has(productId)) {
                            add = this.likesCount.get(productId) + 1;
                       }
                       else{
                           add += 1;
                       }
                       this.likesCount.set(productId,add);
                        var product = this.allProducts.find(p => p.Id == productId);
                        if(product){               
                            var notification = {
                                Id : "",
                                SenderId : this.user.UserId,
                                ReceiverId : product.UserId,
                                ProductId : productId,
                                ProductName : product.Name,
                                NotificationType : 'like',
                                Message : 'Liked product',
                                Date : new Date().toUTCString(),
                            };
                            this.postNotification(notification);
                         }
                    }
                    else{
                        this.notifyData = {
                             info : "error",
                             msg : response.data
                        }
                        this.setNotifier();
                    }
                }
            );
        },
       comment(productId,commenterId,posterId){
           this.$router.push({name:"ProductComments",params:{productId:productId,commenterId:commenterId,posterId:posterId}})
        },
      _changeBrandDp(event){
        let formData = new FormData();
        formData.append('file',event.target.files[0]);
        axios.post(this.apiUrl+"default/savefile",formData)
            .then(
                response => {
                    if (response.data != "img.jpg") {
                        this.brandData.ImagePath = response.data;
                       axios.put(this.apiUrl+"brand",this.brandData)
                        .then(res => {alert(res.data)})

                    }
                }
            );
      },
      getStory(id){
          this.story = [];
          axios.get(this.apiUrl+"story/"+id).then(
              response => {
                  response.data.forEach(s => {
                      if (moment(new Date()).diff(moment(s.value.Date),'hours') <= 24) {
                            this.story.push(JSON.parse(s.value));
                      }
                  });
              }
          );
        var slides = new showSlide();
        slides.automate("myslides");
      },
      getData(id){
             if (id) {
              axios.put(this.apiUrl+"brand/read",{UserId : id})
                .then(
                    response => {
                        if (response.data.value) {
                            var data = JSON.parse(response.data.value);
                            if (this.userId == data.UserId) {
                                this.brandData = JSON.parse(response.data.value);
                                this.getProducts(id)
                            }
                        }
                        else{
                            this.$router.push("/market");
                        }
                     }
                );
         }
      },
    _addToCart(id,userId){
        if (userId != this.user.UserId) {
            this.addToCart(id);
        }
      },
    goToMarket(){
        this.$router.push("/market")
    },
    goToChat(receiverId){
      if (this.user.UserId && (receiverId != this.user.UserId)) {
          this.$router.push({name:'Chats',params:{receivingUserId:receiverId}});
      }
      else{
        if (this.user.UserId == '') {
            this.notifyData = {
            info : "warn",
            msg : "this chat cannot be initiated. Sign Up first to complete"
            }
          }
          else{
            this.notifyData = {
            info : "error",
            msg : "this chat cannot be initiated. Sender and Receiver Identity is same."
         }
        }
        this.setNotifier();
      }
    }
    },
    mounted() {
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

<style>
#brand_dp{
    display: none;
}
.product-background{
    margin-bottom: 55px;
    /* height: 50px; */
}
.back-img{
    height: 400px;
    display: flex;
    box-sizing: border-box;
    padding: 8px 6px;
    margin: auto;
}
.back-img img{
    width: 100%;
    max-height: 100%;
}
.story-update{
    margin-top: 25px;
}
    .header-title{
        text-align: center;
        color: var(--color-dark);
        margin: 25px 0;
    }
    .row{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        align-items: center;
    }
    .col-2{
        flex-basis: 50%;
    }
    .col-1{
        flex-basis: 100%;
        margin: 5px auto;
        justify-content: center;
    }
    .col-2 img, .col-2 video, .col-4 video{
        max-width: 100%;
        margin: 10px;
    }
    .col-2 h2{
        font-style: 50px;
        line-height: 60px;
        margin: 25px 0;
    }
    .col-4{
        flex-basis: 25%;
        min-width: 150px;
        margin-bottom: 50px;
        padding: 10px;
    }
    .product-container .col-4{
        max-height: 350px;
    }
    .product{
        display: flex;
        flex-direction: column;
    }
     .product-img{
    display: flex;
    width: 230px;
    height: 230px;
    box-sizing: border-box;
    padding: 8px 6px;
    margin: auto;
}
 .product-img img{
    max-width: 100%;
    max-height: 100%;
    transition: transform .5s;
}
    .product-img img:hover{
        transform: translateY(-5px);
    }
    .product-top, .product-top .product-icons{
        display: flex;
        justify-content: space-between;
    }
    .product-top .product-icons span, .product-name{
        margin: .2rem;
        color: var(--color-dark);
    }
   .product-price{
        color: var(--white);
        background: var(--main-color);
        font-weight: bold;
        margin: .3rem;
        font-size: 1rem;
    }
     .product-icons span{
        font-size: 1.2rem;
        cursor: pointer;
    }
     .product-icons span:hover{
        color: var(--main-color);
    }
    .product-btns div{
        margin: 20px auto;
        display: flex;
    }
    .product-btns div span{
        font-size: 1.8rem;
        color: var(--color-dark);
    }
    .product-btns div span:hover{
        color: var(--main-color);
    }

    #category{
        height: 2rem;
        width: 200px;
        margin: 2px auto;
        display: block;
    }

    /**story slides styles */
    .myslides{
        display: none;
    }
    .myslides img{
        width: 100%;
        height: 70vh;
        position: relative;
    }
    .numbertext{
        color: #f2f2f2;
        font-size: 12px;
        padding: 8px 12px;
        position: absolute;
        top: 0;
    }
     .fade{
        -webkit-animation-name: fade;
        -webkit-animation-duration: 4s;
        animation-name: fade;
        animation-duration: 4s;
    }
    @-webkit-keyframes fade{
        from{
            opacity:.4
        }
        to{
            opacity: 1;
        }
    }
    @keyframes fade{
        from{
            opacity:.4
        }
        to{
            opacity: 1;
        }
    }

    @media only screen and (max-width:1200px){
        .col-4{
            flex-basis: 50%;
        }
    }
    @media only screen and (max-width:768px){
        h1{
            font-size: 2rem !important;
            margin: auto;
        }
        .header-title{
            font-size: 1.7rem !important;
        }
    }
    @media only screen and (max-width:520px){
        .col-4,.col-2{
            flex-basis: 100%;
        }
           .col-1{
        font-size: 1.2rem;

         }
        input,textarea{
              font-size: 1.2rem;
          }
        h1{
            font-size: 1.7rem !important;
            margin: auto;
        }
        .header-title{
            font-size: 1.4rem !important;
        }
    }
    @media only screen and (max-width:768px){
        .product-icons span, .product-btns span{
            font-size: 1.4rem !important;
        }
    }
    @media only screen and (max-width:375px){
        .col-1{
            font-size: 1.4rem;
         }
        .header-title{
            font-size: 1.2rem !important;
        }
        h1{
            font-size: 1.5rem !important;
            margin: auto;
        }
        strong{
            font-size: 1rem;
        }
        .product-icons span, .product-btns span{
            font-size: 1.2rem !important;
        }
        input,textarea{
            font-size: 1rem;
        }
    }
</style>