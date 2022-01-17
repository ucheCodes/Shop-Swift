<template>
    <div class="form row" v-if="user.UserId">
        <div class="col-1">
                    <div>
            <h3>File Upload</h3>
            <div class="flex-row">
                <label for="category2">Section</label>
                <select name="category" @change="categoryChanged($event)" id="category">
                    <option value="brand" id="product" selected>Create Brand</option>
                    <option value="product" id="product">Upload Product</option>
                    <option value="story" id='story'>Update Story</option>
                    <option value="ads" id='ads' v-if="user.IsSuperAdmin">Upload Ads</option>
                </select>
            </div>
        </div>
        <div class="uploads" id="brand">
            <h3>Create Your Unique Brand</h3>
                <div class="flex-row">
                    <label for="brandName">Brand Name</label>
                     <input type="text" class="input brandName"/>
                </div>
                <div class="flex-row">
                    <label for="brandCategory">Brand Category</label>
                    <select name="product-category" id="product-category" class="flex-row brandCategory" v-if="true">
                        <option value="fashion">Fashion</option>
                        <option value="agriculture">Agriculture</option>
                        <option value="health">Health</option>
                        <option value="education">Education</option>                 
                        <option value="commerce">Commerce</option>                 
                        <option value="music">Music</option>                 
                        <option value="art">Art</option>
                        <option value="science">Science</option>                 
                        <option value="technology">Technology</option>                 
                        <option value="architecture">Architecture</option>
                        <option value="building">Building</option>                 
                        <option value="estate">Estate Management</option>                 
                        <option value="food">Food and Catering Services</option>                 
                    </select>
                </div>
                <div class="flex-row">
                    <label for="description">Description</label>
                     <textarea  class="textarea brandDesc" placeholder="Type a brief description of your brand"></textarea>

                </div>
                <div class="flex-row">
                    <label for="description">Display Picture</label>
                     <input @change="uploadBrandImg" class="input brandImg" type="file"/>
                </div>
                <div class="flex-row">
                    <label for="description">Preview</label>
                     <img :src="photoUrl+brandImg" alt="preview">
                </div>
        </div>
        <div class="uploads" id="ads">
            <h3>Add an Advertisement</h3>
                <div class="flex-row">
                    <label for="brandName">Brand Name</label>
                     <input id="ad-brand" type="text" class="input"/>
                </div>
                <div class="flex-row">
                    <label for="brandName">Product Name</label>
                     <input id="ad-product" type="text" class="input"/>
                </div>
                <div class="flex-row">
                    <label for="brandCategory">Brand Category</label>
                    <select name="product-category" id="ad-category" class="flex-row" v-if="true">
                        <option value="fashion">Fashion</option>
                        <option value="agriculture">Agriculture</option>
                        <option value="health">Health</option>
                        <option value="education">Education</option>                 
                        <option value="commerce">Commerce</option> 
                        <option value="music">Music</option>                 
                        <option value="art">Art</option>
                        <option value="science">Science</option>                 
                        <option value="technology">Technology</option>                 
                        <option value="architecture">Architecture</option>
                        <option value="science">Building</option>                 
                        <option value="technology">Estate Management</option>                 
                        <option value="others">Others</option>                 
                    </select>
                </div>
                <div class="flex-row">
                    <label for="description">Description</label>
                     <input type="text" id="ad-desc" class="input" placeholder="enter brief description of your brand"/>
                </div>
                <div class="flex-row">
                    <label for="description">Upload Ad</label>
                     <input @change="uploadAdFile" id="ad-file" class="input" type="file"/>
                </div>
                <div class="flex-row" v-if="adFile.includes('.jpg') || adFile.includes('.jpeg')">
                    <label for="description">Preview</label>
                     <img :src="photoUrl+adFile" alt="preview">
                </div>
                <div v-else-if="adFile.includes('.mp4')">
                     <video controls autoplay :src="photoUrl+adFile"></video>
                </div>
        </div>
        <div class="uploads" id="product">
            <h3>Add Products</h3>
            <div class="flex-row">
                <label for="product">Product Name</label>
                <input type="text" class="productName"/>
            </div>
            <div class="flex-row">
                <label for="product_category">Product Category</label>
                <select class="productCat" name="product-category" id="product-category">
                    <option :value="cat" v-for="cat in categories" :key="cat">{{cat}}</option>               
                </select>
            </div>
            <div class="flex-row">
                <label for="">Create your unique product category</label>
                <button @click="categoryChanged" value="pro-cat" class="btn">Add Category</button>
            </div>
            <div class="flex-row">
                <label for="price">Price</label>
                <input class="productPrice" type="number">
            </div>
            <div class="flex-row">
                <label for="price">Shipping Fee</label>
                <input class="productShip" value="0" type="number">
            </div>
            <div class="flex-row">
                <label for="price">Currency Unit</label>
                <select class="productUnit" name="currency" id="currency">
                    <option value="dollar"> US Dollar</option>
                    <option value="naira" selected>Naira</option>
                    <option value="pounds">GB Pounds</option>
                    <option value="cedi">GH Cedis</option>                 
                    <option value="yen">JP Yen</option>                 
                </select>
            </div>
            <div class="flex-row">
                <label for="price">Search tag</label>
                 <textarea  class="textarea productSearch" maxlength="80" placeholder="Search tags enables your product to be found when searched"></textarea>
            </div>
            <div class="flex-row">
                <label for="price">Description</label>
                <textarea  class="textarea" id="productDesc" maxlength="80" placeholder="Type a description of the product"></textarea>
            </div>
            <div class="flex-row">
                <label for="file">Product Image</label>
                <input @change="uploadProductImg" class="productImg" type="file">
            </div>
            <div class="flex-row">
                <label for="description">Preview</label>
                <img :src="photoUrl+productImg" alt="preview">
            </div>
            <div class="flex-row">
                <label for="file">Related Products</label>
                <input @change="uploadRelatedProductImage" class="productImg2" type="file" multiple>
            </div>
        </div>
        <div id="story" class="uploads">
            <h3>Add to your daily story</h3>
            <div class="flex-row">
                <label for="story">Add Story</label>
                <input @change="uploadStoryFile" type="file">
            </div>
            <div class="flex-row">
                <label for="price">Description</label>
                <textarea name="" id="story-desc" class="textarea" maxlength="300" placeholder="Type a short description"></textarea>
            </div>
            <div class="flex-row">
                <label for="description">Preview</label>
                <div v-if="storyFile.includes('.jpg') || storyFile.includes('.jpeg')">
                     <img :src="photoUrl+storyFile" alt="preview">
                </div>
                <div v-else-if="storyFile.includes('.mp4')">
                     <video controls autoplay :src="photoUrl+storyFile"></video>
                </div>
            </div>
        </div>
        <div id="dp" class="uploads">
            <h3>Change Display Pictures</h3>
            <div class="flex-row">
                <label for="dp">Profile Picture</label>
                <input  @change="changeDp($event)"  type="file">
            </div>
            <div class="flex-row">
                <label for="dp2">Brand Picture</label>
                <input @change="changeDp($event)" type="file">
            </div>

        </div>
        <div class="uploads" id="pro-cat">
            <h3>Create your category list</h3>
            <div class="flex-row">
                <label for="add">Add Category</label>
                <input type="text" placeholder="Type a new category here" v-model="category">
            </div>
            <div class="flex-row">
                <label class="btnLabel" for="add">Add</label>
                <button class="btn"  @click="addCategory()">Add</button>
            </div>
            <div class="flex-row">
                <label for="add">Remove Category</label>
                <select id="selectBoxRemove">
                    <option  v-for="category in categories" :key="category" :value="category">{{category}}</option>
                </select>
            </div>
            <div class="flex-row">
                <label class="btnLabel" for="add">Remove</label>
                <button class="btn"  @click="removeCategory()">Remove</button>
            </div>
            <div class="flex-row">
                <label for="categoryAdded">New Category</label>
                <select class="selectBox">
                    <option>Your unique business Category</option>
                    <option  v-for="category in categories" :key="category" :value="category">{{category}}</option>
                </select>
            </div>
            <div class="flex-row">
                <label for="">Back to Products Upload</label>
                <button @click="categoryChanged" value="product" class="btn fas fa-arrow-left">Back</button>
            </div>
        </div>
            <button @click="submitUpload()" class="btn">Submit</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import {mapState,mapActions} from 'vuex'

export default {
    name:'Uploads',
    props:['productId'],
    data() {
        return {
            brandImg:"cart3.jpg",
            category: '',
            categories:[],
            isUser:true,
            productImg:"img.jpg",
            adFile:"img.jpg",
            storyFile:'img.jpg',
            relatedProductImages:[]
        }
    },
    computed:{
        ...mapState(["apiUrl","photoUrl","user","brand","allProducts","user"]),
    },
    created() {
        if (this.brand) {
            var brandCategory = localStorage.getItem(this.brand.UserId);
            if (brandCategory) {
                var bc = JSON.parse(brandCategory)
                for (let i = 0; i < bc.length; i++) {
                    const element = bc[i];
                    this.categories.push(element)
                }
            }
        }
    },
    mounted() {
        if (this.productId) {
            var category = document.querySelector("#category");
            category.selectedIndex = 1;
            this.changeCategory('product');
            var product = this.allProducts.find(p => p.Id == this.productId);
            //console.log(product);
                document.querySelector(".productName").value = product.Name;
                document.querySelector(".productShip").value = product.Shipping;
                document.querySelector(".productPrice").value = product.Price;
                document.querySelector(".productSearch").value = product.Search;
                //document.querySelector(".productUnit").options[0].text = product.Unit;
                document.querySelector("#productDesc").value = product.Description;
                //document.querySelector(".productCat").options[0].text = product.Category;
                this.productImg = product.ImagePath;
                this.relatedProductImages = product.RelatedImages;

        }
    },
    methods: {
        ...mapActions(["keyBrandExists","postProduct","postAds","postStory"]),

        categoryChanged(event){
            var val = event.target.value;
            this.changeCategory(val);
        },
        changeCategory(val){
            var uploads = document.getElementsByClassName('uploads')
            for (let i = 0; i < uploads.length; i++) {
               if (uploads[i].id == val) {
                   uploads[i].style.display = "block";
               }
               else{
                   uploads[i].style.display = "none";
               } 
            }
        },
        submitUpload(){
            var category = document.getElementById("category");
            if (category.value == "brand"){
                var brandName = document.querySelector(".brandName");
                var brandCategory = document.querySelector(".brandCategory");
                var brandDesc = document.querySelector(".brandDesc");
                var brandImg = document.querySelector(".brandImg");

                if(brandName.value != "" && brandDesc.value != ""){
                    if (this.user.UserId) {
                        var newBrand ={
                        Id : "",
                        UserId : this.user.UserId,
                        Name : brandName.value,
                        Category : brandCategory.options[brandCategory.selectedIndex].text,
                        Description : brandDesc.value,
                        Date : new Date().toUTCString(),
                        ImagePath : this.brandImg
                        };
                        var brandData =  {                 
                            id : newBrand.UserId,
                            operation: 'create',
                            newBrand: newBrand
                        };
                        this.keyBrandExists(brandData);
                          brandName.value = ""; brandDesc.value == "";
                          this.$router.push({name:"Products",params:{userId:this.user.UserId}});
                        }
                        else{
                            alert("Access Denied, Sign Up Now.")
                        }
                }
                else{
                    alert("All Fields must be completed")
                }
            }
            else if (category.value == "product") {
                var productName = document.querySelector(".productName");
                var productCategory = document.querySelector(".productCat");
                var productDesc = document.querySelector("#productDesc");
                var productImg = document.querySelector(".productImg");
                var productImg2 = document.querySelector(".productImg2");
                var productShip = document.querySelector(".productShip");
                var productPrice = document.querySelector(".productPrice");
                var productSearch = document.querySelector(".productSearch");
                var productUnit = document.querySelector(".productUnit");
                var id = '';
               if (productName.value != "" && productDesc.value != "" && productSearch.value != ""){
                   if (this.brand.UserId) {
                       if (productCategory.value == "") {
                           productCategory.value = this.brand.Category;
                       }
                       if (this.productId) {
                           id = this.productId;
                       }
                    var product = {
                        Id:id,
                        UserId:this.brand.UserId,
                        Name: productName.value,
                        Category: productCategory.value,
                        Description : productDesc.value,
                        Shipping: productShip.value,
                        Price: productPrice.value,
                        Search: productSearch.value,
                        Unit: productUnit.value,
                        ImagePath: this.productImg,
                        RelatedImages:  this.relatedProductImages,
                        Date: new Date().toUTCString() 
                    }
                    this.postProduct(product);
                    this.productImg = "img.jpg";
                    this.relatedProductImages = [];
                    productName.value = "";productDesc.value = ""; productSearch.value = "",
                    productPrice.value = 0; productShip.value = 0;             
                   }
                    else{
                        alert("you dont have a brand account. Go to login menu and register Now.")
                    }
               }
               else{
                   alert("notify .js Complete Product Details Info to proceed")
               }
                
            }
            else if (category.value == "ads"){
                var ad_brand = document.querySelector("#ad-brand");
                var ad_product = document.querySelector("#ad-product");
                var ad_category = document.querySelector("#ad-category");
                var ad_desc = document.querySelector("#ad-desc");
                var ad_file = document.querySelector("#ad-file");
                if (ad_brand.value != '' && ad_product.value != '' && ad_desc.value != '') {
                    var ad = {
                        UserId : this.user.UserId,
                        Id: '',
                        Brand : ad_brand.value,
                        Product: ad_product.value,
                        Category: ad_category.value,
                        Desc: ad_desc.value,
                        File: this.adFile,
                        Date: new Date().toUTCString()
                 };
                // console.log(ad);
                this.postAds(ad);
                }
            }
            else if (category.value == "story"){
                var story_desc = document.querySelector("#story-desc");
                var story = {
                    Id: '',
                    UserId : this.user.UserId,
                    Desc: story_desc.value,
                    File: this.storyFile,
                    Date: new Date().toUTCString()
                }
                this.postStory(story);
            }
        },
        uploadBrandImg(event){
            let formData = new FormData();
            formData.append('file',event.target.files[0]);
            axios.post(this.apiUrl+"default/savefile",formData)
                .then(
                    response => {
                        if (response.data != "img.jpg") {
                            this.brandImg = response.data;
                        }
                    }
                )
        },
        uploadProductImg(event){
            if (this.brand.UserId) {
                let formData = new FormData();
                formData.append('file',event.target.files[0]);
                axios.post(this.apiUrl+"default/savefile",formData)
                    .then(
                        response => {
                            if (response.data != "img.jpg" && (response.data.includes('.jpg') || (response.data.includes('.jpeg')))) {
                                this.productImg = response.data;
                            }
                            else{
                                alert("file format not supported, only .jpg and jpeg files are acceptable");
                                this.productImg = 'img.jpg';
                            }
                        }
                    )
            }
        },
        uploadRelatedProductImage(event){
          if (this.brand.UserId) {
                let formData = new FormData();
                for (let i = 0; i < event.target.files.length; i++) {
                    formData.append('file'+i,event.target.files[i]);
                }
                    axios.post(this.apiUrl+"default/savefile",formData)
                        .then(
                            response => {
                                if (Array.isArray(response.data)) {
                                    response.data.forEach(image => {
                                        if ((image.includes('.jpg') || (image.includes('.jpeg')))) {
                                            this.relatedProductImages.push(image);
                                        }
                                    });
                                }
                                else if(response.data != "img.jpg"){
                                   this.relatedProductImages.push(response.data); 
                                }
                            }
                        );
                }
        },
        uploadAdFile(event){
                let formData = new FormData();
                formData.append('file',event.target.files[0]);
                axios.post(this.apiUrl+"default/savefile",formData)
                    .then(
                        response => {
                            if (response.data != "img.jpg") {
                                this.adFile = response.data;
                            }
                        }
                    )
        },
        uploadStoryFile(event){
                let formData = new FormData();
                formData.append('file',event.target.files[0]);
                axios.post(this.apiUrl+"default/savefile",formData)
                    .then(
                        response => {
                            if (response.data != "img.jpg") {
                                this.storyFile = response.data;
                            }
                        }
                    )
        },
        addCategory(){
            if (this.category != '') {
                this.categories.push(this.category)
                this.category = '';
                if (this.brand) {
                    localStorage.setItem(this.brand.UserId,JSON.stringify(this.categories));
                }
            }
        },
        removeCategory(){
             var selectBoxRemove = document.querySelector("#selectBoxRemove");
             var selectedItem = selectBoxRemove.options[selectBoxRemove.selectedIndex].text
             if (confirm("Do you want to permanently delete this category?")) {
                var itemIndex = this.categories.indexOf(selectedItem);
                if (itemIndex > -1) {
                    this.categories.splice(itemIndex,1);
                }
                if (this.brand) {
                    localStorage.setItem(this.brand.UserId,JSON.stringify(this.categories));
                }
             }
        },

    },

}
</script>
<style>
  .form{
      display: flex;
      flex-direction: column;
  } 
  .uploads{
      display: none;
  } 
  .uploads:nth-child(2){
      display: block;
  } 
  .form label{
      font-size: 1.5rem;
      margin: 2rem;
      color: var(--color-dark);
  } 
  .textarea{
      margin: 1rem;
      width: 90%;
      height: 3rem;
      border: none;
      outline: none;
      text-align: center;
      align-items: center;
      font-size: 1.2rem;
      padding: auto;
  }
  .form input, .form select{
      width: 20rem;
      height: 2rem;
      margin: 1rem;
  }  
  .flex-row{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
  }
  .form .btn{
      width: 200px;
      height: 50px;
      font-size: 1rem;
  }
  .form img{
      width: 180px;
      height: 180px;
      border-radius: 15px;
      margin: 1rem;
  }
  .form video{
      width: 200px;
      height: 200px;
       margin: 1rem;
  }

  @media only screen and (max-width: 560px){
      .form .flex-row{
          flex-direction: column;
      }
      .form .btn{
          margin: auto;
      }
      .btnLabel{
          display: none;
      }
  }
</style>