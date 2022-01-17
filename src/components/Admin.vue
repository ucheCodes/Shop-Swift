<template>
  <div  v-if="user.IsSuperAdmin">
        <div class="cards">
          <div  @click="showUsers" class="card-single active">
            <div>
              <h1>{{allUsers.length}}</h1>
              <span>Registered Users</span>
            </div>
            <div>
              <span class="fas fa-user-friends"></span>
            </div>
          </div>
          <div @click="showBrands" class="card-single">
            <div>
              <h1>{{modifiedBrands.length}}</h1>
              <span>All Brands</span>
            </div>
            <div>
              <span class="fab fa-google-wallet"></span>
            </div>
          </div>
          <div @click="showTrans" class="card-single">
            <div>
              <h1 v-if="notifications.size > 0 && notifications.has('admin')">{{notifications.get("admin").length}}</h1>
              <span>Transactions</span>
            </div>
            <div>
              <span class="fas fa-coins"></span>
            </div>
          </div>
          <div @click="showAdmins"  class="card-single">
            <div>
              <h1>{{admins.length}}</h1>
              <span>Admins</span>
            </div>
            <div>
              <span class="fas fa-user-alt"></span>
            </div>
          </div>
        </div>
        <div class="cards-content">
            <div class="projects" v-if="cardName == 'users' && allUsers.length">
                <div class="card">
                  <div class="card-header flex-col">
                    <h2 class="header-title">Registered Users <small>{{allUsers.length}}</small></h2>
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
                          <td>Is Super Admin</td>
                          <td>Is Admin></td>
                          <td>Is Affiliate Marketer?</td>
                          <td>Photo</td>
                          <td>Delete</td>
                        </tr>
                      </thead>
                      <tbody v-for="user in allUsers" :key="user.UserId">
                          <tr>
                            <td>{{user.Lastname}}</td>
                            <td>{{user.Firstname}}</td>
                            <td>{{user.Email}}</td>
                            <td>{{user.Mobile}}</td>
                            <td>{{user.Date}}</td>   
                            <td><input type="checkbox"  @change="changeSuperAdmin(user.UserId)"  v-model="user.IsSuperAdmin"></td>            
                            <td><input type="checkbox" v-model="user.IsAdmin"></td>            
                            <td><input type="checkbox"  @change="changeAffiliate(user.UserId)" v-model="user.IsAffiliate"></td>   
                            <td v-if="user.ImagePath != null"><img :src="photoUrl+user.ImagePath" alt="img"></td>  
                            <td v-else><img :src="photoUrl+'img.jpg'" alt="img"></td>  
                            <td  @click="_deleteUser(user.UserId)" class="delete"><span class="fas fa-trash"></span></td>      
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
                          <td>Is Super Admin</td>
                          <td>Is Admin></td>
                          <td>Is Affiliate Marketer?</td>
                          <td>Photo</td>
                          <td>Delete</td>
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
                            <td><input type="checkbox" @change="changeSuperAdmin(user.UserId)" v-model="user.IsSuperAdmin"></td>            
                            <td><input type="checkbox" v-model="user.IsAdmin"></td>            
                            <td><input type="checkbox"  @change="changeAffiliate(user.UserId)" v-model="user.IsAffiliate"></td>   
                            <td v-if="user.ImagePath != null"><img :src="photoUrl+user.ImagePath" alt="img"></td>  
                            <td v-else><img :src="photoUrl+'img.jpg'" alt="img"></td>  
                            <td  @click="_deleteUser(user.UserId)" class="delete"><span class="fas fa-trash"></span></td> 
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

          <div class="brands" v-if="cardName == 'brands'">
            <div class="card">
              <div class="card-header">
                <h2 class="header-title">Brands</h2>
                <button class="btn">See all<span class="fas fa-arrow-right"></span></button>
              </div>
              <div class="card-body">
                  <div class="customer" v-for="brand in modifiedBrands" :key="brand.Id">
                      <div class="info flex-row">
                        <div><img @click="goToBrand(brand.UserId)" :src="photoUrl+brand.ImagePath" alt="customer"></div>
                        <div class="flex-col">
                          <h4>{{brand.Lastname}} {{brand.Firstname}}</h4>
                          <small>{{brand.Name}}</small>
                          <small class="mobile" :class="{showMobile : showMobile}">Mobile: {{brand.Mobile}}</small>
                        </div>
                      </div>
                      <div class="contact">
                        <span  @click="goToBrand(brand.UserId)" class="fas fa-user-circle"></span>
                        <span @click="goToChat(brand.UserId)" class="fas fa-comment"></span>
                        <span @click="viewMobile" class="fas fa-phone"></span>
                      </div>
                  </div>
              </div>
            </div>
        </div>

        <div class="transactions" v-if="cardName == 'transactions'">
          <h3 class="header-title">Order Transactions</h3>
              <div class="card-body">
                  <div class="customer" v-for="notif in notifications.get('admin')" :key="notif.Id">
                    <div class="info flex-col">
                      <h4>{{notif.Lastname}} {{notif.Firstname}}</h4>
                      <div class="flex-row">
                            <div v-if="notif.ImagePath"><img :src="photoUrl+notif.ImagePath" alt="customer"></div>
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

      </div> 
      <div v-if="showNotifier">
        <notifier :message="notifyData"/>
      </div>
  </div>
</template>

<script>
import axios from 'axios'
import {mapActions, mapMutations, mapState} from 'vuex'
import Notifier from './Notifier.vue'

export default {
  name: 'Admin',
  components: {
    Notifier
  },
  data() {
    return {
      cardName: 'users',
      ischecked:true,
      isnotchecked:false,
      admins : [],
      showMobile : false,
      notifyData : {},
      likesArr : [],
      product : null
    }
  },
  computed:{
    ...mapState(["allUsers","allProducts","allBrands","photoUrl","apiUrl","modifiedBrands","notifications","user","showNotifier"])
  },
  methods: {
    ...mapActions(["getAllUsers","deleteUser","changeAffiliate","getNotifications","changeSuperAdmin"]),
    ...mapMutations(["setNotifier"]),

    showUsers(){
      this.cardName = "users"
    },
    showTrans(){
      this.cardName = "transactions"
    },
    showBrands(){
      this.cardName = "brands";
    },
    showAdmins(){
      this.cardName = "admins";
      this.getAdmins();
    },
    _deleteUser(id){
      if (confirm("This user will be deleted permanently")) {
        this.deleteUser(id);
      }
    },
    _changeAffiliate(id){
      alert("if I hear say e fire")
      this.changeAffiliate(id);
    },
    _changeSuperAdmin(id){
      alert("super clicked"+id)
    },
    getAdmins(){
      this.admins = this.allUsers.filter(admin => admin.IsAdmin == true || admin.IsSuperAdmin == true);
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
    movePrev(){
      alert("prev")
    },
    moveNext(){
      alert("next")
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
        alert(this.showNotifier);
        this.setNotifier();
      }
    }
  },
  mounted() {
  },
}
</script>

<style>
  .table-responsive{
    width: 100%;
    overflow-x: auto;
  }
  .table-responsive table{
    width: 100%;
    border-collapse: collapse;
  }
  .table-responsive thead{
    background: var(--main-color);
    padding: 5px;
  }
  .table-responsive thead td{
    font-weight: 700;
    color : var(--white);
  }
  .table-responsive td img{
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  .table-responsive td{
    padding: .5rem 1rem;
    font-size: .9rem;
    color: var(--color-dark);
  }
  /* .table-responsive tr td:last-child{
    display: flex;
    align-items: center;
  } */

.customer{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .5rem 1rem;
  margin: 1rem;
  border-bottom: 1px solid var(--main-color);
}
.info{
  display: flex;
  align-items: center;
}
.info h4{
  font-size: .8rem;
  font-weight: 700;
  color: #222;
  margin: 1px 15px;
}
.info small{
  font-weight: 600;
  color: var(--text-gray);
  margin: 1px 15px;
}
.contact{
    display: flex;
}
.contact span{
  font-size: 1.2rem;
  margin-left: .5rem;
  color: var(--main-color);
}
.mobile{
  display: none;
}
.mobile.showMobile{
  display: block;
}
.info img{
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.delete span{
  font-size: .9rem;
  margin-top: .8rem;
}
.delete:hover{
  color: red;
  cursor: pointer;
}


@media only screen and (max-width:560px){
  .card-header .fa-arrow-right{
    display: none;
  }
  .table-responsive thead{
      display: none;
  }
  .table-responsive td{
      display: block;
      text-align: right;
  }
  .table-responsive td::before{
      float: left;
      margin-right: 3rem;
      font-weight: 600;
  }
  .table-responsive td:first-child{
      background: var(--main-color);
      color: var(--white);
      text-align: center;
  }
  .table-responsive td:first-child::before{
      content: 'Last Name';
  }
  .table-responsive td:nth-child(2)::before{
      content: 'First Name';
  }
  .table-responsive td:nth-child(3)::before{
      content: 'Email';
  }
  .table-responsive td:nth-child(4)::before{
      content: 'Mobile';
  }
  .table-responsive td:nth-child(5)::before{
      content: 'Date';
  }
 .table-responsive td:nth-child(6)::before{
      content: 'Is Super Admin';
  }
  .table-responsive td:nth-child(7)::before{
      content: 'Is Admin';
  }
  .table-responsive td:nth-child(8)::before{
      content: 'Is Affiliate';
  }
  .table-responsive td:nth-child(9)::before{
      content: 'Photo';
  }
  .table-responsive td:nth-child(10)::before{
      content: 'Delete';
  }
  .table-responsive td:nth-child(11)::before{
      content: 'Send a dm';
  }
}
@media only screen and (max-width:320px){
  .customer{
    flex-direction: column;
    padding: 1rem;
    align-items: center;
  }
  .info{
    margin: .5rem 0;
  }
 
}


</style>
