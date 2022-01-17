<template>
<div v-if="product">
    <div v-if="_product">
       <div class="row">
            <div class="col-2">
               <div class="flex-col">
                   <div>
                       <div class="flex-row">
                           <h3 class="header-title">{{_product.Name}}</h3>
                           <div class="close">
                               <div @click="backToProducts">x</div>
                           </div>
                       </div>
                   </div>
                   <div class="flex-row">
                       <label>category: </label>
                       <span>{{_product.Category}}</span>
                   </div>
                   <div class="flex-row">
                       <label>Price: </label>
                       <span>{{_product.Price}}</span>
                   </div>
                   <div class="flex-row">
                       <label>Shipping Fee: </label>
                       <span>{{_product.Shipping}}</span>
                   </div>
                   <div class="flex-row select">
                       <button @click="_addToCart(_product.Id,_product.UserId)"  class="btn">Add to Cart</button>
                       <button @click="viewCart" class="btn">View Cart</button>
                   </div>
                   <div>
                       <div class="flex-col">
                           <h4 class="header-title">Product Description</h4>
                           <p>{{_product.Description}}</p>
                       </div>
                   </div>
               </div>
           </div>
           <div class="col-2">
               <div class="flex-col">
                    <div class="big-image">
                         <img :src="photoUrl+productImg" :alt="_product.Id">
                    </div>
                    <div class="small-images" v-if="_product.RelatedImages.length">
                        <h4 class="header-title">Other Specs of {{_product.Name}}</h4>
                        <div class="flex-row">
                            <div class="product-img col-4">
                                 <img :id="_product.ImagePath" @click="showImage" :src="photoUrl+_product.ImagePath" alt="img">
                            </div>
                            <div class="product-img col-4" v-for="(img, index) in _product.RelatedImages" :key="index">
                                <img :id="img" @click="showImage" :src="photoUrl+img" :alt="index">
                            </div>
                        </div>
                    </div>
               </div>
           </div>
        </div> 
        <div class="related-products"  v-if="relatedProducts.length">
            <h2 class="header-title">Related Products</h2>
            <div class="products">
                <div class="col-4" v-for="product in relatedProducts" :key="product.Id">
                    <div class="product">
                        <div class="product-img">
                            <img @click="viewProduct(product.Id)" :src="photoUrl+product.ImagePath" :alt="product.Id">
                        </div>
                        <div>
                            <h3>{{product.Name}}</h3>
                        </div>
                    </div>
                </div>    
            </div>
        </div>
        <div class="col-2" v-if="allAds.length">
            <div class="myslides fade"  v-for="(ad,count) in allAds" :key="ad.Id" :id="ad.File">
                <div class="numbertext">{{count}}/{{allAds.length}}</div>
                 <div v-if="ad.File.includes('.jpg') || ad.File.includes('.jpeg')">
                    <img :src="photoUrl+ad.File" :alt="ad.Id"/>
                </div>
                <div v-else-if="ad.File.includes('.mp4') || ad.File.includes('.3gp')">
                    <video controls :src="photoUrl+ad.File"></video>
                </div>
            </div>
        </div>
    </div>
    <div v-else-if="ad">
        <div class="row">
            <div class="col-2">
               <div class="flex-col">
                   <div>
                       <div class="flex-row">
                           <h3 class="header-title">{{ad.Brand}}</h3>
                           <div class="close">
                               <div @click="backToProducts">x</div>
                           </div>
                       </div>
                   </div>
                   <div class="flex-row">
                       <label>Product: </label>
                       <span>{{ad.Product}}</span>
                   </div>
                   <div>
                       <div class="flex-col">
                           <h4 class="header-title">Description</h4>
                           <p>{{ad.Desc}}</p>
                       </div>
                   </div>
                    <div class="big-image" v-if="ad.File.includes('.jpg') || ad.File.includes('.jpeg')">
                         <img :src="photoUrl+ad.File" :alt="ad.Id">
                    </div>
                    <div v-else-if="ad.File.includes('.mp4') || ad.File.includes('.3gp')">
                        <video controls :src="photoUrl+ad.File"></video>
                    </div>
               </div>
           </div>
            <div class="col-2" v-if="allAds.length">
                <div class="myslides fade"  v-for="(ad,count) in allAds" :key="ad.Id" :id="ad.File">
                    <div class="numbertext">{{count}}/{{allAds.length}}</div>
                    <div v-if="ad.File.includes('.jpg') || ad.File.includes('.jpeg')">
                    <img :src="photoUrl+ad.File" :alt="ad.Id"/>
                    </div>
                    <div v-else-if="ad.File.includes('.mp4') || ad.File.includes('.3gp')">
                        <video controls :src="photoUrl+ad.File"></video>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import moment from 'moment';
import { mapState,mapMutations } from 'vuex';
import {showSlide} from "../data/slider";

export default {
    name:'ProductViewer',
    props : ['product'],
    data() {
        return {
            quantity:12,
            isAdmin:false,
            _product : null,
            productImg:"",
            relatedProducts:[],
            ad:[],
            filteredAds:[]
        }
    },
    created() {
      if (this.product) {
        if (this.allProducts.length > 0) {
           this._product = this.allProducts.find(p => p.Id == this.product);
             if (this._product) {
                this.productImg = this._product.ImagePath;
             }
             else{
                 this.ad = this.allAds.find(p => p.Id == this.product);
             }
        }
      }
    },
    mounted() {
        if (this._product) {
            this.getRelatedProducts();
        }
        var slides = new showSlide();
        slides.automate("myslides");
     // var now = new Date().toUTCString();
    //   if (this.allAds.length) {
    //       console.log(this.allAds)
    //       this.filteredAds = this.allAds.filter(ad => moment(now).diff(moment(ad.Date),'days') <= 1 );
    //   }
    },
    computed:{
        ...mapState(["allProducts","photoUrl","user","cart","allAds"])
    },

    methods: { 
        ...mapMutations(["addToCart"]),

        getRelatedProducts(){
            if (this.allProducts.length > 0) {
                this.relatedProducts = this.allProducts.filter(p => (p.Category.toLowerCase() == this._product.Category.toLowerCase() && p.Id != this._product.Id) || (p.Name.toLowerCase() == this._product.Name.toLowerCase() && p.Id != this._product.Id));
                if (this.relatedProducts.length == 0) {
                this.relatedProducts = this.allProducts.filter(p => (p.UserId == this._product.UserId && p.Id != this._product.Id)); 
                }
            }
        },
        showImage(event){
            this.productImg = event.target.id;
        },
        _addToCart(id,userId){
            if (userId != this.user.UserId) {
                this.addToCart(id);
            }
        },
        backToProducts(){
           this.$router.go(-1);
        },
        viewCart(){
           if (this.cart.length > 0) {
                this.$router.push({name : "Cart",params: {id : this.product}});
           }
        },
        viewProduct(id){
            this._product = this.allProducts.find(p => p.Id == id);
            this.productImg = this._product.ImagePath;
            this.getRelatedProducts();
        },
    },
}
</script>

<style>
    .flex-col{
        display: flex;
        flex-direction: column;
    }
    .flex-col div{
        margin: 10px 2px;
    }
    .big-image{
        width: 300px;
        height: 300px;
        display: flex;
        margin: auto;
    }
    .small-images{
        width: 300px;
    }
    .small-images .product-img{
        width: 150px;
        height: 150px;
    }
    .small-images img{
        max-width: 100%;
        max-height: 100%;
    }
    .small-images .col-4{
        display: flex;
        flex-direction: row;
    }
    .big-image img{
        max-width: 100%;
        max-height: 100%;
    }
    .small-images .flex-row{
        overflow-x: scroll;
    }
    .select select{
        margin-left: 100px;
        width: fit-content;
        height: fit-content;
    }
    .select .btn{
        margin: 0 10px;
    }
    .related-products .products{
        overflow-x: scroll;
        display: flex;
        flex-direction: row;
    }
    .related-products .col-4{
        margin: 0 40px;
    }
    .related-products .product-img{
       width: 200px;
       height: 200px;
    }
    .related-products .product-price{
       font-size: .8rem !important;
    }


    @media only screen and (max-width:768px){
        .select .btn{
            margin-bottom: 30px;
        }
        .select{
            flex-direction: column;
        }
    }
</style>