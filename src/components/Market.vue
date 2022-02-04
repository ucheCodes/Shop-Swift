<template>
    <div>
        <div class="latest-products">
            <h2 class="header-title">Latest Product Catalogues</h2>
            <div class="row" v-if="productCatalogue.length">
                <div class="col-4"  v-for="catalogue in productCatalogue" :key="catalogue.Id">
                    <div class="product">
                        <div class="catalogue-details">
                            <div class="flex-row">
                                <img :id="catalogue.UserId" :src="photoUrl+catalogue.brandImg"  @click="viewCatalogue" alt="img">
                                 <div class="details">
                                     <label :id="catalogue.UserId"  @click="viewCatalogue">{{catalogue.brandName}}</label>
                                     <label>{{catalogue.Day}}</label>
                                     <label>{{catalogue.Time}}</label>
                                 </div>
                                 <span>NGN {{catalogue.Price}}</span>
                            </div>
                        </div>
                        <div class="product-img">
                            <img :id="catalogue.UserId" :src="photoUrl+catalogue.ImagePath"  @click="viewCatalogue" :alt="catalogue.Name">
                        </div>
                        <div class="product-name">
                            <h3>{{catalogue.Name}}</h3>
                        </div>
                    </div>
                </div>          
            </div>
            <div class="product-btns" v-if="productCatalogue.length">
                <div>
                    <span class="fas fa-chevron-left"></span>
                    <div>1/{{productCatalogue.length}}</div>
                    <span class="fas fa-chevron-right"></span>
                </div>
            </div>
        </div>
        <div class="ads" v-if="ads.length">
                <h3 class="header-title">Featured Contents that may interest and entertain you.</h3>
                <div class="ad-products">
                   <div class="col-4"  v-for="ad in ads" :key="ad.Id">
                        <div class="product" v-if="ad.Filename">
                            <b><label>{{ad.Brand}}</label></b>
                            <div class="product-img" v-if="ad.Filename.includes('.jpg') || ad.File.includes('.jpeg')">
                                <img :src="photoUrl+ad.File" @click="viewAds(ad.Id)" alt="start">
                            </div>
                            <div class="product-img" v-else-if="ad.Filename.includes('.mp4') || ad.File.includes('.3gp')">
                                 <video @click="viewAds(ad.Id)" :src="videoUrl+ad.File"></video>
                             </div>
                            <label>{{ad.Product}}</label>
                            <div>
                                <button @click="viewAds(ad.Id)" class="btn">View</button>
                            </div>
                            </div>
                    </div>
                </div>
        </div>

        <div class="more-products" v-if="moreCatalogue.length">
            <h2 class="header-title">Product Catalogues</h2>
            <div class="row">
                <div class="col-4"  v-for="catalogue in moreCatalogue" :key="catalogue.Id">
                    <div class="product">
                        <div class="catalogue-details">
                            <div class="flex-row">
                                <img :id="catalogue.UserId" :src="photoUrl+catalogue.brandImg"  @click="viewCatalogue" alt="img">
                                 <div class="details">
                                     <label :id="catalogue.UserId"  @click="viewCatalogue">{{catalogue.brandName}}</label>
                                     <label>{{catalogue.Day}}</label>
                                     <label>{{catalogue.Time}}</label>
                                 </div>
                                 <span>NGN {{catalogue.Price}}</span>
                            </div>
                        </div>
                        <div class="product-img">
                            <img :id="catalogue.UserId" :src="photoUrl+catalogue.ImagePath"  @click="viewCatalogue" :alt="catalogue.Name">
                        </div>
                        <div class="product-name">
                            <h3>{{catalogue.Name}}</h3>
                        </div>
                    </div>
                </div>          
            </div>
            <div class="product-btns" v-if="moreCatalogue.length > 8">
                <div>
                    <span class="fas fa-chevron-left"></span>
                    <div>1/{{moreCatalogue.length}}</div>
                    <span class="fas fa-chevron-right"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import moment from 'moment'
import axios from 'axios'
export default {
    name:'Market',
    data() {
        return {
            productCatalogue:[],
            moreCatalogue:[],
            ads:[],
        }
    },
    computed:{
        ...mapState(["allProducts","photoUrl","videoUrl","apiUrl","allBrands","allAds"]),
    },
    methods: {
        //...mapActions(["getAllProducts"]),
        removeDuplicatesFromObjectArray(data,key){
            return [
                ...new Map(data.map((item) =>[key(item),item])).values()
            ]
        },
        viewCatalogue(event){
            var id = event.target.id;
            this.$router.push({name:'Products',params:{userId:id}})
        },
        viewAds(id){
            this.$router.push({name : "Productviewer",params: {product : id}});
        }
    },
    created() {
        var momentFilter = this.allProducts.filter(product => moment(new Date()).diff(moment(product.Date),'days') <= 1 );
        var momentFilter2 = this.allProducts.filter(product => moment(new Date()).diff(moment(product.Date),'days') > 1 );
        var filtered = this.removeDuplicatesFromObjectArray(momentFilter,product => product.UserId);
        filtered.forEach(product => {
            var _brand = this.allBrands.find(brand => brand.UserId === product.UserId);
            var modifiedBrand = {
                brandName : _brand.Name,
                brandImg: _brand.ImagePath,
                Day: moment(product.Date).format('ll'),
                Time: moment(product.Date).format('LT'),
            }
            Object.assign(product,modifiedBrand);
            this.productCatalogue.push(product);
        });
        var filtered2 = this.removeDuplicatesFromObjectArray(momentFilter2,product => product.UserId);
        filtered2.forEach(product => {
            var _brand = this.allBrands.find(brand => brand.UserId === product.UserId);
            var modifiedBrand = {
                brandName : _brand.Name,
                brandImg: _brand.ImagePath,
                Day: moment(product.Date).format('ll'),
                Time: moment(product.Date).format('LT'),
            }
            Object.assign(product,modifiedBrand);
            this.moreCatalogue.push(product);
        });

    },
    mounted() {
        axios.get(this.apiUrl+"ads").then(
            response => {
                //this.ads = response.data;
                response.data.forEach(ad => {
                   var ads = JSON.parse(ad.value); 
                   this.ads.push(ads);
                });
            }
        )
    },
}
</script>

<style>
 .ads .product-img{
    display: flex;
    width: 150px;
    height: 150px;
    box-sizing: border-box;
    padding: 15px 12px;
    margin: auto;
}
 .ads .product-vid{
    box-sizing: border-box;
    padding: 15px 12px;
    display: flex;
    width: 300px;
    height: 150px;
    margin: auto;
 }
 .ads .product-img img, .ads .product-vid video{
    max-width: 100%;
    max-height: 100%;
}
    .catalogue-details img{
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin: .2rem;
    }
    .details{
        display: flex;
        flex-direction: column;
        margin-right: .2rem;
    }
    .details label:first-child{ 
        font-weight: bold;
    }
    label{
        font-size: 1rem;
        color: var(--color-dark);
    }
    .number{
        font-size: .7rem !important;
    }
    .ad-products{
        display: flex;
        max-height: 350px;
        overflow-x: scroll;
    }
</style>