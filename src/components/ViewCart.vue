<template>
    <div>
        <div class="small-container cart-page" v-if="cart.length">
            <table>
                <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Total</th>
                </tr>
                <tr v-for="data in cart" :key="data.Id">
                    <td>
                        <div class="cart-info">
                            <img :src="photoUrl+data.ImagePath" alt="hp">
                            <div>
                                <p>{{data.Name}}</p>
                                <small>Price : NGN{{data.Price}}</small><br>
                                <small>Shipping : NGN{{data.Shipping}}</small>
                                <br>
                                <a @click="_removeFromCart(data.Id)">Remove</a>
                            </div>
                        </div>
                    </td>
                    <td><input type="number" value="1"></td>
                    <td>${{data.Price}}</td>
                </tr>
            </table>

            <div class="total-price">
                <table>
                    <tr>
                        <td>Sub Total</td>
                        <td>{{priceTotal}}</td>
                    </tr>
                    <tr>
                        <td>Shipping Fee</td>
                        <td>NGN {{shippingTotal}}</td>
                    </tr>
                    <tr>
                        <td>Grand Total</td>
                        <td>NGN {{priceTotal+shippingTotal}}</td>
                    </tr>
                </table>
            </div>
            <div class="flex-row btns">
                <button @click="order" class="btn">Place Order</button>
                <button @click="backToProductViewer" class="btn fas fa-arrow-left">Back</button>
            </div>
        </div>
        <div v-else>
                <p>No item in cart</p>
                <button @click="goToMarket" class="btn">Surf for Products</button>
        </div>
        <div>
            <notifier :message="notifyData"/>
        </div>
    </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import Notifier from './Notifier.vue';
export default {
  components: { Notifier },
    props:['id'],
    data() {
        return {
            quantity: 0,
            priceTotal : 0,
            shippingTotal : 0,
            notifyData : {},
        }
    },
    methods: {
        ...mapMutations(["removeFromCart","setNotifier"]),

        backToProductViewer(){
            if (this.id) {
                this.$router.push({name : "Productviewer",params: {product : this.id}});
            }
            else{
                this.$router.go(-1);
            }
        },
        _removeFromCart(id){
            this.removeFromCart(id);
            this.cartTotal();
        },
        goToMarket(){
            this.$router.push("/market")
        },
        cartTotal() {
            this.priceTotal = 0; this.shippingTotal = 0;
            for (let i = 0; i < this.cart.length; i++) {
                const element = this.cart[i];
                this.priceTotal += element.Price;
                this.shippingTotal += element.Shipping;
            }
        },
        order(){
            if (this.user.UserId) {
                  this.notifyData = {
                    info : "success",
                    msg : "notify.js The product brands has been notified of your order, they will send you a dm or place a call through regarding your order."
                 }
                this.setNotifier();
            }
            else{
                this.notifyData = {
                    info : "success",
                    msg : "kindly sign up to complete this transaction."
                 }
                this.setNotifier();
            }
        }
    },
    computed:{
        ...mapState(["cart","photoUrl","user"]),
    },
    created() {
        this.cartTotal();
    },
}
</script>

<style>
    .small-container{
        max-width: 1080px;
        margin: auto;
        padding: 0 25px;
    }
  .cart-page{
      margin: 20px auto;
  }  
  .cart-page table{
      width: 100%;
      border-collapse: collapse;
  }
  .cart-page table th{
     text-align: left;
     padding: 5px;
     color: var(--white);
     background: var(--main-color);
     font-weight: normal;
  }
  .cart-page table td{
     padding: 10px 5px;
  }
  .cart-page table td a{
     font-size: 14px;
     color: var(--main-color);
  }
  .cart-page table td:last-child, .cart-page table th:last-child{
     text-align: right;
  }
  .cart-page table td input{
      width: 40px;
      height: 30px;
  }
  .cart-page table td img{
      width: 120px;
      height: 120px;
      border-radius: 0%;
      padding-right: 5px;
  }
  .cart-info{
      display: flex;
      flex-wrap: wrap;
  }
  .total-price{
      display: flex;
      justify-content: flex-end;
  }
  .total-price table{
      border-top: 3px solid var(--main-color);
      width: 100%;
      max-width: 400px;
  }

  @media only screen and (max-width: 560px) {
    .cart-info p{
          display: none;
    }
    .cart-page table td img{
      width: 100px;
      height: 100px;
     }
  }
  @media only screen and (max-width: 320px) {
    .btns.flex-row{
          flex-direction: column;
    }
  }
</style>