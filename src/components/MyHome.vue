<template>
  <div>
      <div class="cards" v-if="user.IsAdmin">
            <div @click="followers" class="card-single">
                <div>
                <h1>{{friends.length}}</h1>
                <span>Followers</span>
                </div>
                <div>
                <span class="fas fa-users"></span>
                </div>
            </div>
            <div @click="showOrders" class="card-single">
                <div>
                <h1 v-if="notifications.has(user.UserId)">{{notifications.get(user.UserId).filter(ord => ord.NotificationType == 'cart').length}}</h1>
                <span>Orders</span>
                </div>
                <div>
                <span class="fas fa-shopping-bag"></span>
                </div>
            </div>
          <div @click="showTrans" class="card-single">
            <div>
              <h1 v-if="notifications.size > 0 && notifications.has(user.UserId)">{{notifications.get(user.UserId).length}}</h1>
              <span>Notifications</span>
            </div>
            <div>
              <span class="fas fa-bell"></span>
            </div>
          </div>
            <div @click="showAdmins" class="card-single">
                <div>
                <h1>{{admins.length}}</h1>
                <span>Admins</span>
                </div>
                <div>
                <span class="fas fa-user-alt"></span>
                </div>
            </div>
        </div>

        <div class="brands" v-if="cardName == 'followers'">
            <div class="card">
              <div class="card-header">
                <h2 class="header-title">Friends</h2>
                <button class="btn">See all<span class="fas fa-arrow-right"></span></button>
              </div>
              <div class="card-body" v-for="friends in friendsData" :key="friends.UserId">
                  <div class="customer flex-col">
                      <div class="info">
                        <img :src="photoUrl+friends.ImagePath" alt="customer">
                        <div>
                          <h4>{{friends.Lastname}}  {{friends.Firstname}}</h4>
                        </div>
                      </div>
                      <div class="contact">
                        <span v-if="friends.IsAdmin" :id="friends.UserId" @click="goToBrand(friends.UserId)" class="fas fa-user-circle"></span>
                        <span @click="goToChat(friends.UserId)" :id="friends.UserId" class="fas fa-comment"></span>
                        <span @click="viewMobile" class="fas fa-phone"></span>
                        <span class="fas fa-video"></span>
                        <span @click="deleteFollower" :id="friends.UserId" :text="user.UserId" class="fas fa-trash delete"></span>
                      </div>
                      <div><span class="fas fa-phone green"></span>{{user.Mobile}}</div>
                  </div>
              </div>
            </div>
        </div>
        <div class="cards-content">
            <div class="projects" v-if="cardName == 'admins' && admins.length">
                <div class="card">
                  <div class="card-header flex-col">
                    <h2 class="header-title">Registered Admins <small>{{admins.length}}</small></h2>
                    <button class="btn">See all<span class="fas fa-arrow-right"></span></button>
                  </div>
                  <div class="card-body">
                    <div class="table-responsive">
                      <table>
                      <thead>
                        <tr>
                          <td>Last Name</td>
                          <td>FirstName</td>
                          <td>Email</td>
                          <td>Mobile</td>
                          <td>Date</td>
                          <td>Photo</td>
                          <td>Send a dm</td>
                        </tr>
                      </thead>
                      <tbody v-for="user in allUsers" :key="user.UserId">
                          <tr>
                            <td>{{user.Lastname}}</td>
                            <td>{{user.Firstname}}</td>
                            <td>{{user.Email}}</td>
                            <td>{{user.Mobile}}</td>
                            <td>{{user.Date}}</td>     
                            <td v-if="user.ImagePath != null"><img :src="photoUrl+user.ImagePath" alt="img"></td>  
                            <td v-else-if="coverImg" ><img :src="photoUrl+coverImg" alt="chat-img"></td>  
                            <td @click="goToChat(user.UserId)"><span class="fas fa-comment"></span></td> 
                          </tr>
                      </tbody>
                    </table>
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
        </div>

        <div class="transactions" v-if="cardName == 'orders' && notifications.has(user.UserId)">
          <h3 class="header-title">All Orders</h3>
            <div class="card-body">
                <div class="customer" v-for="notif in notifications.get(user.UserId).filter(ord => ord.NotificationType == 'cart')" :key="notif.Id">
                    <div class="info flex-col">
                      <h4>{{notif.Lastname}} {{notif.Firstname}}</h4>
                      <div class="flex-row">
                            <div v-if="notif.ImagePath"><img :src="photoUrl+notif.ImagePath" alt="customer"></div>
                            <div v-else-if="coverImg"><img :src="photoUrl+coverImg" alt="chat-img"></div>
                            <small class="mobile" :class="{showMobile : showMobile}">Mobile: {{notif.Mobile}}</small>
                            <div class="contact">
                              <span v-if="notif.NotificationType == 'like'"  @click="viewLikes(notif.ProductId)" class="fas fa-eye"></span>
                              <span v-else-if="notif.NotificationType == 'comment'" @click="comment(notif.ProductId,notif.ReceiverId)" class="fas fa-comment-alt"></span>
                              <span v-else-if="notif.NotificationType == 'cart'" @click="viewProduct(notif.ProductId)" class="fas fa-eye"></span>
                              <span @click="viewMobile" class="fas fa-phone"></span>
                              <span v-if="user.UserId != '' && user.userId != notif.SenderId" @click="goToChat(notif.SenderId)" class="fas fa-comment"></span>
                            </div>
                      </div>
                      <div>
                        <p v-if="notif.SenderId == user.UserId">you {{notif.Message}} {{notif.ProductName}} {{notif.TimeDiff}}</p>
                        <p v-else>{{notif.Lastname}} {{notif.Message}} {{notif.ProductName}} {{notif.TimeDiff}}</p> 
                      </div>
                    </div>
                  </div>
              </div>
        </div>
        <div class="transactions" v-if="cardName == 'transactions' && notifications.get(user.UserId)">
          <h3 class="header-title">All Notifications</h3>
            <div class="card-body">
                <div class="customer" v-for="notif in notifications.get(user.UserId)" :key="notif.Id">
                    <div class="info flex-col">
                      <h4>{{notif.Lastname}} {{notif.Firstname}}</h4>
                      <div class="flex-row">
                            <div v-if="notif.ImagePath"><img :src="photoUrl+notif.ImagePath" alt="customer"></div>
                            <div v-else-if="coverImg"><img :src="photoUrl+coverImg" alt="chat-img"></div>
                            <small class="mobile" :class="{showMobile : showMobile}">Mobile: {{notif.Mobile}}</small>
                            <div class="contact">
                              <span v-if="notif.NotificationType == 'like'"  @click="viewLikes(notif.ProductId)" class="fas fa-eye"></span>
                              <span v-else-if="notif.NotificationType == 'comment'" @click="comment(notif.ProductId,notif.ReceiverId)" class="fas fa-comment-alt"></span>
                              <span v-else-if="notif.NotificationType == 'cart'" @click="viewProduct(notif.ProductId)" class="fas fa-eye"></span>
                              <span @click="viewMobile" class="fas fa-phone"></span>
                              <span v-if="user.UserId != '' && user.userId != notif.SenderId" @click="goToChat(notif.SenderId)" class="fas fa-comment"></span>
                            </div>
                      </div>
                      <div>
                        <p v-if="notif.SenderId == user.UserId">you {{notif.Message}} {{notif.ProductName}} {{notif.TimeDiff}}</p>
                        <p v-else>{{notif.Lastname}} {{notif.Message}} {{notif.ProductName}} {{notif.TimeDiff}}</p> 
                      </div>
                    </div>
                  </div>
              </div>
        </div>
        <div class="users" v-if="cardName == 'likes' && likesArr.length > 0">
            <h2 class="header-title">Users that Likes your Product</h2>
            <div class="flex-col" v-if="product">
              <div>
                <div class="flex-row">
                  <h4>{{product.Name}}</h4>
                  <span>NGN {{product.Price}}</span>
                </div>
              </div>
              <div class="big-image">
                    <img :src="photoUrl+product.ImagePath" :alt="product.Id">
              </div>
            </div>
            <div class="brand-card">
                <div class="row">
                    <div class="col-4 flex-row"  v-for="user in likesArr" :key="user.UserId">
                        <div>
                            <img :id="user.UserId" @click="goToBrand(user.UserId)"   class="img-rounded" :src="photoUrl+user.ImagePath" alt="g"/>
                        </div>
                        <div class="flex-col">
                            <b><label for="">{{user.Lastname}} {{user.Firstname}}</label></b>
                            <div class="flex-row">
                                <span :id="user.UserId" @click="goToBrand(user.UserId)" class="fas fa-user-circle"></span>
                                <span class="fas fa-phone"></span>
                                <span class="fas fa-video"></span>
                                <span @click="goToChat(user.UserId)" class="fas fa-comment-alt"></span>
                            </div>
                            <div><span class="fas fa-phone green"></span>{{user.Mobile}}</div>
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
import axios from 'axios'
import { mapActions, mapState, mapMutations } from 'vuex'
import Notifier from './Notifier.vue'
export default {
  components: { Notifier },
    data() {
      return {
        cardName : "",
        friends: [],
        friendsData:[],
        admins : [],
        ordersArr : [],
        notifyData: {},
        likesArr : [],
        showMobile : false,
      }
    },
    computed:{
         ...mapState(["allUsers","allProducts","allBrands","coverImg","photoUrl","apiUrl","modifiedBrands","notifications","user","showNotifier"])
    },
    methods: {
      ...mapActions(["getAllUsers","getNotifications"]),
      ...mapMutations(["setNotifier"]),

      followers(){
        this.cardName = "followers";
       if (this.friends.length > 0) {
         this.allUsers.forEach(_user => {
           this.friends.forEach(element => {
             if (_user.UserId == element) {
                this.friendsData.push(_user);
             }
           });
         });
       }
      },
      showTrans(){
       this.cardName = "transactions"
       },
      showOrders(){
        this.cardName = 'orders';
      },
      deleteFollower(event){
        var follower = {
          BrandFollowed : this.user.UserId,
          UserFollowing : event.target.id
        }
        var id =  JSON.stringify(follower);
        axios.delete(this.apiUrl+"followers/"+id)
          .then(
            response => {
             if (response.data == "success") {
              this.friendsData = this.friendsData.filter(f => f.UserId != follower.UserFollowing);
             }
             alert(response.data)
            }
          )
      },
      showAdmins(){
        this.cardName = "admins";
        // this.getAdmins();
      },
      getAdmins(){
      this.admins = this.allUsers.filter(admin => admin.IsAdmin == true || admin.IsSuperAdmin == true);
    },
    getOrders(){
      if (this.notifications.has(this.user.UserId)) {
          var allNotif = this.notifications.get(this.user.UserId);
          this.ordersArr = allNotif.filter(ord => ord.NotificationType == 'cart');
      }
    },
    viewMobile(){
      this.showMobile =! this.showMobile;
    },
    viewLikes(productId){
      this.likesArr = [];
      axios.get(this.apiUrl+"like/"+productId).then(
        response => {
          if (response.data.length) {
            response.data.forEach(element => {
              var userId = JSON.parse(element.key);
              var user = this.allUsers.find(u => u.UserId == userId);
              if (user) {
                this.likesArr.push(user);
              }
            });
          }
        }
      )
      this.cardName = 'likes';
      this.product = this.allProducts.find(p => p.Id == productId);
    },
    goToBrand(userId){
        this.$router.push({name:"Products",params:{userId}});
    },
    comment(productId,posterId){
      var commenterId = this.user.UserId;
     this.$router.push({name:"ProductComments",params:{productId:productId,commenterId:commenterId,posterId:posterId}})
    },
    viewProduct(id){
      this.$router.push({name : "Productviewer",params: {product : id}});
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
        this.setNotifier();
      }
    }
    },
    created() {
      if (this.user.UserId) {
        axios.put(this.apiUrl+"followers/"+this.user.UserId)
          .then(
            response => {
            if (response.data.length > 0) {
              response.data.forEach(element => {
                this.friends.push(JSON.parse(element.value));
              });
            }
            }
        )
      }
    },
    mounted() {
        this.getOrders();
         this.getAdmins();
    },
}
</script>

<style>
    .cards{
    margin-top: 10px;
    display: grid;
    grid-template-columns: repeat(4,1fr);
    grid-gap: 2rem;
  }
  .card-single{
    display: flex;
    justify-content: space-between;
    background: var(--white);
    padding: 2rem;
    border-radius: 2px;
  }
  .card-single div:last-child span{
    color: var(--main-color);
    font-size: 2rem;
  }
  .card-single div:first-child span{
    color: var(--text-gray);
  }
  .card-single:hover{
    background: var(--main-color);
    cursor: pointer;
  }
  .card-single:hover div:last-child span{
    color: var(--white);
  }
  .card-single.active{
    background: var(--main-color);
  }
  .card-single.active div span{
    color: var(--white);
  }

  /*Design for card grids */
  .cards-content{
    margin: 1rem;
    display: grid;/*may set to flex later*/
    grid-gap: 2rem;
    grid-template-columns: 100%;
  }
  .card{
    background: var(--white);
    border: 5px;
  }
  .card-header, .card-body{
    padding: 1rem;
  }
  .card-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .img-rounded{
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }

  @media only screen and (max-width:1200px){
  .cards{
    grid-template-columns: repeat(2,1fr);
  }
  .cards-content{
    grid-template-columns: 100%;
  }
}
@media only screen and (max-width:960px){
  .cards{
    grid-template-columns: repeat(2,1fr);
  }
  .cards-content{
    grid-template-columns: 100%;
  }
}

@media only screen and (max-width:560px){
  .cards,
  .cards-content{
    grid-template-columns: 100%;
  }
}
</style>