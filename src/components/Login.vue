<template>
  <div>
      <div class="registration">
        <div class="row">
          <div class="col-1">
            <div class="form-btns">
                <span @click="signIn">Sign In</span>
                <span @click="signUp">Sign Up</span>
                <hr id="indicator">
            </div>
              <div class="form" id="login">
                  <h2 class="header-title">Sign In</h2>
                  <div class="sign-up">
                        <input id="loginEmailOrPass" class="input" type="text" placeholder="Registered Email or Mobile">
                        <input id="loginPass" class="input" type="password" placeholder="password">
                        <input class="submit" @click="Login()" type="submit" value="Sign In">
                  </div>
                  <span @click="signUp">New User? click here to sign up</span>
                  <span @click="callOneInput">Forgot Password? click here to retrieve</span>
              </div>
              <div class="form" id="sign-up">
                <h2 class="header-title">Sign Up</h2>
                <div class="sign-up">
                      <input class="input" id="firstname" type="text" placeholder="First Name">
                      <input class="input" id="lastname" type="text" placeholder="Last Name">
                      <input class="input" id="email" type="email" placeholder="Email">
                      <input class="input" id="mobile" type="mobile" placeholder="Active Mobile">
                      <input class="input" id="password1" type="password" placeholder="Password">
                      <input class="input" id="password2" type="password" placeholder="Confirm Password">
                      <input class="submit" @click="Register()" type="submit" value="Sign Up">
                </div>
                <span @click="signIn">Already have an account? click here to sign in</span>
              </div>
          </div>
        </div>
      </div>
      <div class="one-input-modal fade" :class="{'show':showOneInput}">
          <div @click="hideOneInput" class="close">x</div>
            <div class="flex-col">
                  <input id="retrieveEmail"  type="text" placeholder="Enter your registered Email">
                  <button class="btn" @click="retrieveEmail" value="create">Submit Data</button>
            </div>
      </div>
  </div>
</template>


<script>
import {mapMutations, mapState, mapActions} from 'vuex'
import axios from 'axios'
import {Encryption, Decryption} from '../assets/encryption'

export default {
  name:'Login',
  data() {
    return {
      newUser : {},
      showOneInput:false
    }
  },
  computed:{
     ...mapState(["allUsers","apiUrl","user","isLogged"]),
  },
  methods: {
    ...mapActions(["getAllUsers","logUser","getAndLogUser", "sendEmail"]),

    signUp(){
      var loginForm = document.getElementById("login");
      var signupForm = document.getElementById("sign-up");
      var indicator = document.getElementById("indicator");
      loginForm.style.transform = "translate(-300px)";
      signupForm.style.transform = "translate(300px)";
      indicator.style.transform = "translate(100px)";
    },
    signIn(){
      var indicator = document.getElementById("indicator");
      var loginForm = document.getElementById("login");
      var signupForm = document.getElementById("sign-up");
      loginForm.style.transform = "translate(0px)";
      signupForm.style.transform = "translate(0px)";
      indicator.style.transform = "translate(0px)";
    },
    Login(){
      var loginEmailOrPass = document.querySelector("#loginEmailOrPass").value;
      var loginPass = document.querySelector("#loginPass").value;
      if(loginPass != "" && loginEmailOrPass != ""){
        var _user = {
          id : loginEmailOrPass,
          password : Encryption(loginPass),
        };
        this.getAndLogUser(_user);

        if (this.isLogged) {
          if (this.user.IsAdmin) {
          this.$router.push({name:"Products", params:{userId:this.user.UserId}});
             document.querySelector("#loginEmailOrPass").value = "";
             document.querySelector("#loginPass").value = "";
          }
          if (!this.user.IsAdmin) {
            this.$router.push("/market");
          }
        }
      }
    },
    Register(){
      var firstname = document.querySelector("#firstname").value;
      var lastname = document.querySelector("#lastname").value;
      var email = document.querySelector("#email").value;
      var mobile = document.querySelector("#mobile").value;
      var password1= document.querySelector("#password1").value;
      var password2 = document.querySelector("#password2").value;

      if (firstname != "" && lastname != "" && email != "" && mobile != "" && password1 != "" && password2 != "") {
        if (this.validateAndPostToDb(firstname,lastname,email,mobile,password1,password2)) {
          document.querySelector("#firstname").value = "",  document.querySelector("#lastname").value = "",
          document.querySelector("#email").value = "",  document.querySelector("#mobile").value = "",
          document.querySelector("#password1").value = "", document.querySelector("#password2").value = ""
          this.logUser(this.newUser); 
            console.log(this.isLogged)
        }
      }
      else{
        alert("notify.js all inputs must be completed")
      }
    },
    
    validateAndPostToDb(firstname,lastname,email,mobile,password1,password2){
    var IsSuperAdmin  = false;
    var IsAdmin = false;
    if (password1 == password2) {
       if (email.includes('@') && email.includes(".")) {
         if (mobile.length < 11 || (/[a-zA-Z]/).test(mobile)) {
           alert("Invalid mobile number")
         }
         else{
           //call api via vuex
           if (firstname.includes("$admin")) {
             IsSuperAdmin = true;
             var splitName = firstname.split("$admin");
             firstname = splitName[1]
           }
           this.newUser = {
             Firstname : firstname,
             Lastname : lastname,
             Email : email,
             Mobile : mobile,
             Password1 : Encryption(password1),
             Password2 : Encryption(password2),
             IsSuperAdmin : IsSuperAdmin,
             IsAdmin : IsAdmin,
             IsAffiliate : false,
             Date : new Date().toUTCString()
           };
          return true;
         }
       }
       else{
         alert("Invalid email address")
       }
    }
    else{
      alert("Passwords do not match !!!")
    }

    },
    callOneInput(){
      this.showOneInput = true;
    },
    hideOneInput(){
      this.showOneInput = false;
    },
    retrieveEmail(){
      var email = document.getElementById("retrieveEmail");
      if (email.value.includes(".") && email.value.includes("@")) {
        axios.post(this.apiUrl+"email/"+email.value).then(
          response => {
            if (response.data.length > 0) {
              var user = JSON.parse(response.data[0].value);
              var link  = `<p>click here to go back to <a>https://shop-swiftly.vercel.app/#/</a></p>`;
              var domain = `<a>https://shop-swiftly.vercel.app/#/</a>`;
              if (user) {
                var emailData = {
                  fromAddress : "amazincoders0@gmail.com",
                  toAddress : user.Email,
                  title : "Password Retrieval System From Shop Swift E-Commerce Platform",
                  fromAddressPassword : "AmazingCoders1$",
                  password : Decryption(user.Password1),
                  message : `<p> Hello `+user.Lastname+` `+user.Firstname+` your password retrieved from  `+domain+` is `+Decryption(user.Password1)+` kindly login to the platform with the retrieved password \n"</p>`+link,
                  link : link
                }
                //console.log("on your consent (Abdi), I will uncomment the code that will send this emil to api backend");
                //console.log(emailData);
                this.sendEmail(emailData);
              }
            }
            else{alert("notify js data not found.")}
          }
        )
        email.value = '';
        this.showOneInput = false;//then notify the users if the email sending succedded or failed.
      }
      else{
        alert("invalid email address")
      }
    }
  },
  mounted() {
    if (this.allUsers.length == 0) {
        this.getAllUsers();
    }
  },
}

</script>

<style scoped>
  .registration{
    width: 300px;
    height: 650px;
    position: relative;
    text-align: center;
    padding: 20px 0;
    margin: auto;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  .registration .form{
    max-width: 300px;
    /* padding: 0 200px; */
    top: 130px;
    position: absolute;
    transition: 1s;
  }
  #sign-up{
    left: -300px;
  }
  #login{
    left: 0px;
  }
  .form-btns{
    display: inline-block;
  }
  .form-btns span{
    display: inline-block;
    width: 100px;
    height: 30px;
    border-radius: 30px;
    margin: 5px 10px;
    background: var(--main-color);
    color: var(--white);
    padding: 7px 10px;
    font-weight: bold;
    text-align: center;
  }
  .form-btns span:hover{
    background: var(--color-dark);
    cursor: pointer;
  }
  #indicator{
    width: 100px;
    border: none;
    background: var(--color-dark);
    margin: 8px 10px;
    height: 3px;
    transform: translateX(0px);
    transition: 1s;
  }
  .sign-up .input,.sign-up .submit{
    width: 80%;
    height: 2rem;
    margin: 10px auto;
    border: none;
    font-size: 1.2rem;
  }
  .sign-up .submit{
    background: var(--main-color);
    color: var(--white);
    border-radius: 30px;
  }
  .sign-up .submit:hover{
    cursor: pointer;
    background: var(--color-dark);
  }
  .registration span{
    font-size: .8rem;
    margin-top: 3rem;

  }
</style>