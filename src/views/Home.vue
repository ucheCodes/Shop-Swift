<template>
  <div>
        <div class="background">
            <div class="row">
                <div class="col-2">
                    <h1>Shop Swift</h1>
                    <p><strong>Welcome to Shop Swift </strong> Your E - Commerce and social Platform for digital marketing, social networking, online shopping and affiliate marketing. We help you brand and promote
                      your goods and services, link buyers, sellers and connect Enterpreneurs. Sign up today, let's make your social, enterpreneural and digital marketing skills a reality.
                    </p>
                    <div class="flex-row mg-5 custom">
                      <label class="theme" for="">Customize page</label>
                      <select @change="customizeTheme">
                        <option v-for="color in colors" :key="color.key" :value="color.value">{{color.key}}</option>
                      </select>
                    </div>
                    <button class="button"><router-link to="/market">Explore</router-link></button>
                  <div>
                   <input @change="_changeCoverImage" accept=".jpg, .jpeg" type="file" id="coverImgInput">
                  </div>
                </div>
                <div v-if="user.IsSuperAdmin">
                  <div  v-if="coverImg" class="col-2 back-img">
                   <img @click="triggerCoverImageChange" :src="photoUrl+coverImg" alt="cover image">
                  </div>
                  <div v-else class="col-2 back-img">
                    <img @click="triggerCoverImageChange" src="../assets/cart1.jpg" alt="cover image">
                  </div>
                </div>
                <div v-else>
                  <div  v-if="coverImg" class="col-2 back-img">
                   <img :src="photoUrl+coverImg" alt="cover image">
                  </div>
                  <div v-else class="col-2 back-img">
                    <img src="../assets/cart1.jpg" alt="cover image">
                  </div>
                </div>
            </div>
        </div>
        <div class="about">
          <div class="row">
            <div class="a1">
              <h2 class="theme">About Shop Swift</h2>
              <p>Shop Swift is a dynamic E - Commerce and social platform aimed at promoting enterpreneurs, digital marketers
                  and business owners. We help promote their brand via a digital platform that spans the globe, linking users globally, providing them an avenue
                  to buy, sell and socialize as a means of promoting enterpreneurship. <strong>Shop Swift is an affiliate of Peter's Soft Network.</strong>
              </p>
            </div>
            <div class="a2">
              <h2 class="theme">How to explore Shop Swift</h2>
              <p>Click <strong><router-link to="/login">here</router-link></strong> to sign up for a regular users account or follow
              the navigation menu at the top rignt hand corner to complete. You can't explore and enjoy the beauty of this application without a regular user account.</p>
              <p>This will give you access to buy, sell and socialize with a vast range of enterpreneurs and digital marketers</p>
              <p>If you own a brand or store which you wish to promote and display your wares digitally, you can click 
                <strong><router-link to="/uploads">here</router-link></strong> to create a brand account only after you have registered for the regular user account.
                Shop digitally and explore a vast range of product catalogues from the digital market by clicking   <strong><router-link to="/market">here</router-link></strong>
              </p>
            </div>
          </div>
        </div>
        <div class="feedbacks">
            <h2 class="theme header-title">Users Response and Reactions</h2>
            <h4 class="theme">Let us know how or what you feel about this application.</h4>
            <div class="testimony small-container mg-5">
              <div class="row">
                <div class="col-4" v-for="(feedback) in feedbacks" :key="feedback.Id">
                    <img v-if="feedback.ImagePath" :src="photoUrl+feedback.ImagePath" :alt="feedback"/>
                    <img v-else-if="coverImg" :src="photoUrl+coverImg" alt="chat-img">
                    <h3 class="name">{{feedback.Lastname}} {{feedback.Firstname}}</h3>
                    <p :id="'p'+feedback.Id">{{feedback.Feedback}}</p>
                    <button :id="feedback.Id" value="Read" text="read" @click="showFeedbacks" class="btn fas fa-arrow-up">Read</button>
                    <span @click="deleteFeedback" :id="feedback.Id" v-if="superAdmin" class="fas fa-trash delete"></span>
                    <div class="rating">
                      <i v-for="count in feedback.Star" :key="count" class="fas fa-star"></i>
                    </div>
                </div>
              </div>
           </div>
              <div class="product-btns">
                <div>
                    <span class="fas fa-chevron-left"></span>
                    <div>1/24</div>
                    <span class="fas fa-chevron-right"></span>
                </div>
            </div>
         </div>
         <div class="feedback-msg row">
           <div class="msg">
              <textarea name="feedback" class="feedback-txt" placeholder="Leave us a comment or reply"></textarea>
              <div class="rating-star">
                <label for="">Rate Us:</label>
                <select name="categoy" id="stars">
                    <option value="1">1 star</option>
                    <option value="2">2 stars</option>
                    <option value="3">3 stars</option>
                    <option value="4">4 stars</option>
                    <option value="5" selected>5 stars</option>
                  </select>
              </div>
              <button @click="submitFeedback()" class="btn">Send</button>
           </div>
           <button @click="hideFeedback()" class="feedback-display">Click Here to leave a comment</button>
         </div>

        <!-- <div v-if="showNotifier">
            <notifier :message="notifyData"/>
        </div>       -->
  </div>
</template>

<script>
import {mapActions, mapMutations, mapState} from 'vuex'
import axios from 'axios'
import {themes} from '../assets/themes'
// import Notifier from '@/components/Notifier.vue'

export default {
  name: 'Home',
  // component:{Notifier},
  data() {
    return {
      superAdmin: this.$store.state.user.IsSuperAdmin,
      feedbacks:[],
      colors : [],
      notifyData: {},
    }
  },
  computed:{
      ...mapState(["user","photoUrl","apiUrl","allUsers","coverImg", "showNotifier"])
  },
  methods: {
    ...mapActions(["changeCoverImage"]),
    triggerCoverImageChange(){
       document.getElementById("coverImgInput").click();
    },
    customizeTheme(event){
      var color = event.target.value;
      const root = document.documentElement;
      root.style.setProperty('--main-color',color);
    },
    _changeCoverImage(event){
      let formData = new FormData();
        formData.append('file',event.target.files[0]);
        this.changeCoverImage(formData);
    },
    hideFeedback(){
      var feedback = document.querySelector(".msg");
      feedback.style.display = "block";
      var displayBtn = document.querySelector(".feedback-display");
      displayBtn.style.display = "none";
    },
    submitFeedback(){
      var feedback = document.querySelector(".msg");
      feedback.style.display = "none";
      var displayBtn = document.querySelector(".feedback-display");
      displayBtn.style.display = "block";//add to db from here feedback-txt
      var textVal = document.querySelector(".feedback-txt");
      var stars = document.querySelector("#stars")
      if (textVal.value != null && textVal.value != "") {
        if (this.user.UserId) {
          var feedback = {
            Id : "",
            Star: parseInt(stars.value),
            UserId : this.user.UserId,
            Feedback: textVal.value,
            Date: new Date().toUTCString() 
          }
          axios.post(this.apiUrl+"feedback",feedback)
          .then(
              response => {
                alert("success");
                textVal.value  = "";
              feedback = {
                    Id : response.data,
                    Star: parseInt(stars.value),
                    UserId : this.user.UserId,
                    Feedback: textVal.value,
                    Date: new Date().toUTCString(),
                    ImagePath:  this.user.ImagePath,
                    Lastname: this.user.Lastname,
                    Firstname: this.user.Firstname
                  };
                  this.feedbacks.push(feedback);
              }
          )
        }
      }
      else{
        this.notifyData = {
          info : "warn",
          msg : "welcome to shop swift, we appreciate your presence here. kindly sign up for a better user experience. "
        }
        //this.setNotifier();
        alert("register first")
      }
    },
    deleteFeedback(event){
          axios.delete(this.apiUrl+"feedback/"+event.target.id)
          .then(
            response => {
             if (response.data == "success") {
               this.feedbacks = this.feedbacks.filter(f => f.Id != event.target.id);
             }
            }
          )
    },
    showFeedbacks(event){
            var id = event.target.id;
            var btn = document.getElementById(id);
           // console.log(btn)
            var feedback = document.getElementById("p"+id);
            if ( feedback.style.display == 'none') {
                 feedback.style.display = 'block';
                 btn.value = "Close";
            }
            else{
                 feedback.style.display = 'none';
                 btn.value = "Read";
            }
          for (let i = 0; i < this.feedbacks.length; i++) {
              var _feedback = document.getElementById("p"+this.feedbacks[i].Id);
              if ( _feedback != feedback && _feedback.style.display == 'block') {
                  _feedback.style.display = 'none'
                  feedback.style.display = 'block'
              }
          }
        }   
  },
  created() {
    axios.get(this.apiUrl+"feedback")
      .then(
        response => {
          if (response.data.length > 0) {
            this.allUsers.forEach(_user => {
              response.data.forEach(_element => {
                var element = JSON.parse(_element.value);
                if (_user.UserId == element.UserId) {
                  var feedbackData = {
                    Id : element.Id,
                    Star: element.Star,
                    Feedback: element.Feedback,
                    ImagePath: _user.ImagePath,
                    Lastname: _user.Lastname,
                    Firstname: _user.Firstname
                  };
                  this.feedbacks.push(feedbackData);
                }
              });
            });
          }
        }
      );
  },
  mounted() {
    this.colors = themes;
  },
}
</script>

<style lang="scss">
#coverImgInput{
  display: none;
}
.mg-5{
  margin: 10px;
}
.custom label{
  font-weight: bold;
  font-size: 18px;
}
.custom select{
  width: 80px;
}
.theme{
  color: var(--main-color);
}
  .background h1{
    display: block;
    width: fit-content;
    font-size: 4rem;
    position: relative;
    color: var(--color-dark);
  }
 .button{
    display: inline-block;
    padding: 10px 30px;
    background-color: var(--main-color);
    color: var(--white);
    letter-spacing: .1rem;
    margin-top: 30px;
    transition: .3s ease background-color;
    border: 1px solid var(--color-dark);
    width: 10rem;
    border-radius: 3rem;
  }
   .button:hover{
    background-color: var(--color-dark);
    cursor: pointer;
  }
   .button a{
     color: var(--white);
  }
  .feedbacks p{
    display: none;
  }
  .small-container{
    max-width: 1080px;
    margin: auto;
    padding: 0 25px;
  }
  .about .row{
    flex-direction: column;
  }
  .about .a1, .about .a2{
    margin: 30px 1px;
    box-shadow: 0 0 20px 0px rgba(0, 0, 0, 0.1);
    padding: 15px 10px;
  }
  .feedbacks .col-4{
    text-align: center;
    padding: 40px 20px;
    box-shadow: 0 0 20px 0px rgba(0, 0, 0, 0.3);
    transition: transform .5s;
  }
  .feedbacks .col-4 img{
    width: 70px;
    height: 70px;
    border-radius: 50%;
  }
  .feedbacks .col-4:hover{
    transform: translateY(-10px);
  }
  p{
    text-align: justify;
    color: var(--color-dark);
    font-size: 1.2rem;
  }
  .rating i, .name{
    color: var(--main-color);
    font-size: 1.2rem;
  }
  .fa-quote-left{
    font-size: 30px;
    color: var(--main-color);
}
 .feedback-msg{
   flex-direction: column;
   box-shadow: 0 0 20px 0px rgba(0, 0, 0, 0.1);
 }
 .feedback-msg .msg{
   display: flex;
   flex-direction: column;
  //  margin: auto;
 }
  .feedback-txt{
   border: none;
   outline: none;
   min-width: 250px; 
   height: 40px;
   font-size: 1rem;
   border-radius: 10px;
   padding: 5px;
 }
 .feedback-msg .msg .btn{
   background: var(--color-dark);
   color: var(--white);
   width: 150px;
   margin: auto;
 }
 .feedback-msg .msg .btn:hover{
   background: var(--main-color);
 }
 .feedback-msg .msg .rating-star{
   display: flex;
   justify-content: space-between;
   margin: 1rem;
 }
 .feedback-msg .msg .rating-star label{
   margin-right: 1rem;
 }
 .feedback-display{
   margin: 10px 5px;
   height: 30px;
   width: 280px;
   background: var(--color-dark);
   color: var(--white);
 }
 .feedback-display:hover{
   cursor: pointer;
   background: var(--main-color);
 }
 
</style>