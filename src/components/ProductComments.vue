<template>
    <div>
        <div class="row comments">
            <div class="col-2">
                <div class="product">
                    <div class="catalogue-details">
                        <div class="flex-row brand-info" v-if="brand">
                            <img :src="photoUrl+brand.ImagePath" alt="img">
                            <div class="details">
                                <label>{{brand.Name}}</label>
                                <label>{{date}}</label>
                                <label>{{time}}</label>
                            </div>
                            <div class="close">
                                <div @click="backToProducts" class="delete">x</div>
                            </div>
                        </div>
                    </div>
                    <div class="product-img" v-if="product">
                        <img :src="photoUrl+product.ImagePath" :alt="product.Id">
                    </div>
                    <div class="product-name" v-if="product">
                        <h3>{{product.Name}}</h3><br>
                        <small v-if="productComments.length">{{productComments.length}} comments</small>
                    </div>
                    <div class="flex-row" v-if="product && user.UserId">
                        <textarea placeholder="leave a comment on the product" class="textarea"></textarea>
                        <span v-on:click="submitComments" class="fas fa-paper-plane icons"></span>
                    </div>
                </div>
            </div>
            <div class="col-2 comment-container" v-if="productComments && user.UserId">
                <div class="comment flex-col" v-for="(comment,count) in productComments" :key="count">
                    <div class="user-comment flex-row">
                        <img :src="photoUrl+comment.ImagePath" :alt="count" class="user-comment-img">
                        <div class="comment-text">
                            <div class="text">
                                <div class="flex-row">
                                    <p class="gray">{{comment.Lastname}} {{comment.Firstname}}</p>
                                    <span @click="deleteComment(comment.ProductId,comment.CommentId)" v-if="comment.CommenterId == user.UserId" class="fas fa-trash"></span>
                                </div>
                                <hr>
                                <p>{{comment.Comment}}</p>
                            </div>
                            <small>{{comment.Date}}</small>
                            <small>{{comment.Time}}</small>
                            <hr>
                            <div class="flex-row reply-icon">
                                <span @click="replyClick" :id="count">Reply</span>
                                <small v-if="commentResponses.has(comment.CommentId)">{{commentResponses.get(comment.CommentId).length}} responses</small>
                                <span @click="dropReplies(count)" v-if="commentResponses.has(comment.CommentId)" :id="count" class="fas" :class="{'fa-chevron-down': chevronDown,'fa-chevron-up': chevronUp}"></span>
                            </div>
                            <div class="reply" id="commentbox">
                                <div class="flex-row">
                                    <textarea v-model="commentReply" :id="comment.CommenterId" placeholder="respond to this comment" class="textarea"></textarea>
                                    <span v-on:click="submitCommentReply(count,comment.CommenterId,comment.CommentId)" class="fas fa-paper-plane icons"></span>
                                 </div>
                            </div>
                            <div  :id="'reply'+count">
                                <div v-if="commentResponses.size > 0 && commentResponses.has(comment.CommentId)">
                                    <div class="reply-list flex-col"  v-for="reply in commentResponses.get(comment.CommentId)" :key="reply">
                                        <div class="flex-row user-reply">
                                            <img :src="photoUrl+reply.ImagePath" alt="" class="user-reply-img">
                                            <div class="reply-text">
                                                <div class="flex-row">
                                                    <small for="">{{reply.Lastname}}</small><br>
                                                    <span @click="deleteCommentResponse(reply.ProductId,reply.Id, comment.CommentId)" v-if="reply.UserId == user.UserId" class="fas fa-trash"></span>
                                                </div>
                                                <p>{{reply.Reply}}</p>
                                                <small>{{reply.Date}}</small><br>
                                                <small>{{reply.Time}}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import moment from 'moment';
import axios from 'axios';
import connection from '../signalrHub'

export default {
    name:"ProductComments",
    props:['productId','posterId','commenterId'],
    data() {
        return {
            comments:[],
            commentReply:"",
            allReply:[],
            chevronDown:true,
            chevronUp:false,
            brand:null,
            product:null,
            date:null,
            time:null,
        }
    },
    watch:{
        productId: function (oldId, newId) {
            console.log(oldId+" "+newId);
           //this.search(oldtext);
        }
    },
    created() {
      if (this.posterId && this.productId) {
        this.brand = this.allBrands.find(b => b.UserId == this.posterId);
       this.product = this.allProducts.find(p => p.Id == this.productId);
       this.date = moment(this.product.Date).format('ll');
       this.time = moment(this.product.Date).format('LT');
      }
    },
    mounted() {
        if (this.posterId && this.productId) {
            this.getProductComments(this.productId);
            this.getCommentResponse(this.productId);
        }
    },
    computed:{
        ...mapState(["allProducts","allBrands","allUsers","photoUrl","apiUrl","user","productComments","commentResponses"]),
    },
    methods: {
        ...mapActions(["getProductComments","getCommentResponse","postNotification"]),
        ...mapMutations(["removeActiveProduct"]),

        backToProducts(){
            this.$router.go(-1);
            this.removeActiveProduct();
        },
        deleteComment(productId,id){
            if (confirm("This data will be deleted across all ends permanently")) {
                connection.client.invoke("DeleteProductComment",productId,id); 
            }
        },
        deleteCommentResponse(productId,id,commentId){
            if (confirm("This data will be deleted across all ends permanently")) {
                connection.client.invoke("DeleteCommentResponse",productId,id,commentId); 
            }
        },
        submitComments(){
            var text = document.querySelector(".comments .textarea");
            if (text.value != '') {
                var comment = {
                    Id:"",
                    ProductId:this.productId,
                    PosterId:this.posterId,
                    CommenterId: this.commenterId,
                    Comment:text.value,
                    Date: new Date().toUTCString()
                }
                axios.post(this.apiUrl+"comment",comment)
                 .then(
                     response => {
                        text.value = "";
                     }
                 );
                 var notification = {
                     Id : "",
                     SenderId : this.commenterId,
                     ReceiverId : this.posterId,
                     ProductId : this.productId,
                     productName : this.product.Name,
                     NotificationType : 'comment',
                     Message : 'Commented on a product',
                     Date : new Date().toUTCString(),
                 };
                 this.postNotification(notification);
            }
        },
        submitCommentReply(count,commenterId,commentId){
            var reply = document.getElementById(commenterId);
            if (reply && reply.value != '') {
                var c = document.querySelectorAll("#commentbox");
                if (c[count].style.display == "block") {
                    c[count].style.display = "none";
                }
                this.commentReply='';
                var t = document.getElementById("reply"+count);
                if (t && t.style.display == "none") {
                    t.style.display = "block"
                }
                var reply = {
                    Id:"",
                    CommenterId: commenterId,
                    Response: reply.value,
                    ProductId: this.productId,
                    replierId : this.user.UserId,
                    CommentId : commentId,
                    Date: new Date().toUTCString()
                }
                axios.post(this.apiUrl+"reply",reply);

                var notification = {
                     Id : "",
                     SenderId : this.commenterId,
                     ReceiverId : this.posterId,
                     ProductId : this.productId,
                     ProductName : this.product.Name,
                     NotificationType : 'comment',
                     Message : 'Replied to a comment on product',
                     Date : new Date().toUTCString(),
                 };
                 this.postNotification(notification);
            }
        },
        replyClick(event){
            var numId = event.target.id;
            var c = document.querySelectorAll("#commentbox");
            if (c[numId].style.display == "" || c[numId].style.display == "none") {
                c[numId].style.display = "block";
            }
            else if (c[numId].style.display == "block"){
                 c[numId].style.display = "none";
            }
        },
        dropReplies(count){
            // this.chevronDown =! this.chevronDown;
            // this.chevronUp =! this.chevronUp;
            var numId = count;
            var t = document.getElementById("reply"+numId);
            if (t.style.display == "none") {
                t.style.display = "block"
            }
            else{
                t.style.display = "none"
            }
        },
    },
}
</script>

<style>
    #commentbox{
        display:none;
    }
    .comments .textarea{
        border-radius: 20px;
        height: 2rem;
    }
    .comments .icons{
        margin: 0 2px;
        font-size: 1.6rem;
        color: var(--main-color);
        margin-top: 15x;
    }
    .comments .product-img{
        width: 300px;
        height: 300px;
    }
    .comments .user-comment-img{
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }
    .comments .user-reply-img{
        width: 30px;
        height: 30px;
        border-radius: 50%;
    }
    .comments .comment-text{
        width: 90%;
        margin: 0 auto;
    }
    .comments  small{
       color: var(--main-color);
       margin: 0 20px;
    }
    .text{
        background: var(--main-color);
        border-radius: 10px;
        padding: 10px;
    }
    .gray{
        color:red;
    }
    .text p{
        color: var(--white);
    }
    .comments .comment-text p{
        align-items: justify;
        font-size: 1rem;
    }
    .comments .user-comment{
        margin: 15px 1px;
    }
    .comment-container{
        overflow-y: scroll;
        height: 450px;
    }
    .reply .textarea, .reply .icons{
        font-size: 1rem;
    }
    .reply-icon{ 
        margin-top: 10px;
    }
    .reply .icons{
        margin-top: 15px;
    }
    .reply-list .reply-text{
        background: var(--white);
        padding: 10px;
        border-radius: 10px;
        box-shadow: 0 0 20px 0px rgba(0, 0, 0, 0.1);
    }
    .reply-list .reply-text p{
        color: var(--color-dark);
    }
    .reply-icon span:hover, .reply-text .icons:hover{
        color: var(--color-dark);
        cursor: pointer;
    }
    .user-reply{
        margin: 15px 0;
    }
    .close{
        font-weight: bold;
        font-size: 1rem;
        color: red;
        cursor: pointer;
    }


    @media only screen and (max-width:375px){
        .comments .col-2{
           max-width: 320px;
        }
        .comments .product-img{
            width: 250px;
            height: 250px;
        }
        .comments .textarea{
            font-size: .9rem;
        }
        .comments .icons{
            font-size: 1.1rem;
        }
        .comment-text p{
            font-size: .8rem;
        }
        .comments .user-comment img{
            width: 40px;
            height: 40px;
        }
    }
</style>