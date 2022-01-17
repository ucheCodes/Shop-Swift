<template>
<div  class="chat-container">
    <div v-if="user.UserId != ''">
        <div class="chats" :class="{'chat-or-status':isChatOrStatus}">
            <div class="row chatLayer1" :class="{active : isActive}">
                <div class="col-1">
                    <div class="chat-top">
                        <span @click="createOrViewGroups" class="fas fa-ellipsis-v"></span>
                        <img :src="photoUrl+user.ImagePath" alt="chat-img">
                        <span @click="viewGroups" class="fas fa-layer-group"></span>
                    </div>
                    <div class="chat-search">
                        <div class="search-wrapper">
                            <span class="fas fa-search"></span>
                            <input type="search" name="search" id="search" placeholder="search">
                        </div>
                    </div>
                    <div class="chat-body">
                        <div v-if="!showGroups" class="msg-container chat-all-active-users" :class="{'online-or-recent-user-chats': !isOnlineOrRecentChats}">
                                <h2 class="header-title">Currently Active Users</h2>
                            <div v-if="onlineUsers.length">    
                                <div v-for="u in onlineUsers" :key="u.signalrId" class="body" @click="chatUser(u.UserId)">
                                    <div class="chat-img">
                                        <img :src="photoUrl+u.ImagePath" alt="chat-img">
                                    </div>
                                    <div class="chat-text">
                                        <label for="chat" class="names">{{u.Lastname}} {{u.Firstname}}</label>
                                        <label for="text">Say Hi to {{u.Lastname}} {{u.Firstname}}</label>
                                    </div>
                                </div>
                            </div> 
                            <div v-else>
                                <p>No Currently active user on the platform at this moment, click on the chat icon 
                                    on the bottom left to view your recent chats or the icon at the top right to view groups</p>
                            </div>   
                        </div>
                        <div v-if="!showGroups && lastChats.size> 0" class="recent-chats msg-container" :class="{'online-or-recent-user-chats': isOnlineOrRecentChats}">
                            <h2 class="header-title">Recent Chats</h2>
                            <div v-if="lastChats.size> 0">
                                <div v-for="[key,value] in lastChats" :key="key" class="body" @click="messageFromRecent(value.partnerId,value.chatId)">
                                    <div class="chat-img">
                                        <img :src="photoUrl+value.imagePath" alt="chat-img">
                                    </div>
                                    <div class="chat-text">
                                        <label class="names">{{value.lastname}} {{value.Firstname}}</label>
                                        <label v-if="value.lastMessage.endsWith('.jpg') || value.lastMessage.endsWith('.jpeg') ||
                                        value.lastMessage.endsWith('.mp4') || value.lastMessage.endsWith('.mp3') || 
                                        value.lastMessage.endsWith('.3gp')">media file received</label>
                                        <label v-else-if="value.lastMessage.length > 25" for="text">{{value.lastMessage.substring(0,25)+" ..."}}</label>
                                        <label v-else for="text">{{value.lastMessage}}</label>
                                        <small>{{value.day}}</small>
                                    </div>
                                    <div class="notify">
                                        <div class="time">{{value.time}}</div>
                                        <div v-if="value.numberOfPendingChats > 0" class="number">{{value.numberOfPendingChats}}</div>
                                    </div>
                                </div>
                            </div>
                            <div v-else>
                              <p>You have no recent chats, kindly click on the icon at the bottom right to view active users or 
                                 the icon at the top right to view groups</p>
                            </div>
                        </div>
                        <div v-if="showGroups && groups.size > 0" class="group-chats msg-container">
                            <div v-if="toggleGroups == 'all'">
                                <h2 class="header-title">Available Groups</h2>
                                <div v-for="[id,group] in groups" :key="id" class="body" @click="chatGroup(id,group.title,group.imagePath)">
                                    <div class="chat-img">
                                        <img :src="photoUrl+group.imagePath" alt="chat-img">
                                    </div>
                                    <div class="chat-text">
                                        <label for="chat" class="names">{{group.title}}</label>
                                        <label for="text">{{group.lastname}} {{group.firstname}}</label>
                                    </div>
                                </div>
                            </div>
                            <div v-else>
                                <div v-if="activeGroups.size > 0">
                                    <h2 class="header-title">Active Groups</h2>
                                    <div v-for="[id,value] in activeGroups" :key="id">
                                        <div class="body" @click="chatGroup(value.chatId,value.title,value.imagePath)">
                                            <div class="chat-img">
                                                <img :src="photoUrl+value.imagePath" alt="chat-img">
                                            </div>
                                            <div @click="resetCount(value.chatId)" class="chat-text">
                                                <label class="names">{{value.title}}</label>
                                                <label v-if="value.body.endsWith('.jpg') || value.body.endsWith('.jpeg') ||  value.body.endsWith('.mp4') || value.body.endsWith('.mp3') || value.body.endsWith('.3gp')">media file received</label>
                                                <label v-else-if="value.body.length > 25" for="text">{{value.body.substring(0,25)+" ..."}}</label>
                                                <label v-else for="text">{{value.body}}</label>
                                                <small>{{value.day}}</small>
                                            </div>
                                            <div class="notify">
                                                <div class="time">{{value.time}}</div>
                                                <div v-if="value.count > 0" class="number">{{value.count}}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-else>
                                    <p>You are not actively a member of any group yet {{activeGroups.size}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="chat-bottom">
                        <span @click="toggleRecentOrActiveChats('recent')" class="fas fa-comments"></span>
                        <span @click="toggleChatsOrStatus"  class="fas fa-tv" :class="{'chat-or-status': !isChatOrStatus}"></span>
                        <span @click="toggleRecentOrActiveChats('online')" class="fas fa-user-check"></span>
                    </div>
                </div>
            </div>
            <div class="row chatLayer2" v-if="allChats.size > 0 && showGroups == false" :class="{active : !isActive}">
                <div class="col-1" v-if="chatId">
                        <div class="chat-top">
                            <span @click="updateLastChat(user.UserId,chatId)" class="fas fa-chevron-left"></span>
                            <div class="receiver-detail">
                                <img :src="photoUrl+allChats.get(chatId).receiverImagePath" alt="chat-img">
                                <div class="info">
                                    <label class="name" v-if="allChats.get(chatId).receiverLastname.length < 7 && allChats.get(chatId).receiverFirstname.length < 7">
                                        {{allChats.get(chatId).receiverLastname}} {{allChats.get(chatId).receiverFirstname}}</label>
                                    <label class="name" v-else>{{allChats.get(chatId).receiverLastname}}</label>
                                    <small class="green" v-if="allChats.get(chatId).receiverLastSeen == 'active now'">{{allChats.get(chatId).receiverLastSeen}}</small>
                                    <small class="red" v-else-if="allChats.get(chatId).receiverLastSeen == 'offline'">{{allChats.get(chatId).receiverLastSeen}}</small>
                                    <small class="blue" v-else>{{allChats.get(chatId).receiverLastSeen.substring(0,15)+" ago"}}</small>
                                </div>
                            </div>
                            <div class="right">
                                <span class="fas fa-phone"></span>
                                <span class="fas fa-video"></span>
                            </div>
                        </div>
                        <div class="chat-body msg">
                        <div class="msg-container">
                            <div id="scroll-chat" class="messages" v-for="chat in allChats.get(chatId).chats" :key="chat.Id">
                                <div class="sent" v-if="chat.sender == this.user.UserId">
                                    <small>{{chat.date}}</small><span @click="deleteChat(chat)" class="fas fa-trash"></span><br>
                                    <span v-if="chat.body == 'img.jpg'">
                                        <small>Server could not process the sent file, it might have been bigger than the max size</small>
                                    </span>
                                    <span v-else-if="chat.body.includes('.jpg') || chat.body.includes('.jpeg')">
                                        <img :src="photoUrl+chat.body" alt="">
                                    </span>
                                    <span v-else-if="chat.body.includes('.mp4') || chat.body.includes('.3gp')">
                                        <video controls :src="photoUrl+chat.body"></video>
                                    </span>
                                    <span v-else-if="chat.body.includes('.mp3')">
                                        <audio controls :src="photoUrl+chat.body"></audio>
                                    </span>
                                    <span v-else>
                                        {{chat.body}}
                                    </span>
                                </div>
                                <div class="received" v-else>
                                    <div>
                                    <small>{{chat.date}}</small><br>
                                    <span v-if="chat.body == 'img.jpg'">
                                        <small>A media file was sent, server could not process the sent file, it might have been bigger than the max size</small>
                                    </span>
                                    <span v-if="chat.body.includes('.jpg') || chat.body.includes('.jpeg')">
                                        <img :src="photoUrl+chat.body" alt="">
                                    </span>
                                    <span v-else-if="chat.body.includes('.mp4') || chat.body.includes('.3gp')">
                                        <video controls :src="photoUrl+chat.body"></video>
                                    </span>
                                    <span v-else-if="chat.body.includes('.mp3')">
                                        <audio controls :src="photoUrl+chat.body"></audio>
                                    </span>
                                    <span v-else>
                                        {{chat.body}}
                                    </span>
                                    </div>
                                </div>
                            </div>    
                        </div>
                        </div>
                        <div class="msg-send">
                            <div class="send-container chat-bottom">
                                <span @click="triggerChatFile" class="fas fa-image"><input @change="uploadChatFile" id="chatFile" type="file"></span>
                                <textarea class="txtsend" placeholder="Type a message"></textarea>
                                <span @click="sendMessage" class="fas fa-paper-plane"></span>
                            </div>
                        </div>
                </div>
            </div>
            <div class="row chatLayer2 groupChat" v-else-if="allGroupChats.size > 0 && showGroups == true" :class="{active : !isActive}">
                <div class="col-1" v-if="groupId">
                       <div class="chat-top">
                            <span @click="backFromGroups" class="fas fa-chevron-left"></span>
                            <div class="receiver-detail">
                                <input @change="changeGroupDp" type="file" id="groupDp">
                                <img @click="triggerChangeGroupDp" :src="photoUrl+groupImg" alt="chat-img">
                                <div class="info" @click="callOneInput">
                                    <label class="name small" v-if="groupTitle.length < 15">{{groupTitle}}</label>
                                    <label class="name small" v-else>{{groupTitle.substring(0,12)}} ...</label>
                                    <label class="name large" v-if="groupTitle.length < 40">{{groupTitle}}</label>
                                    <label class="name large" v-else>{{groupTitle.substring(0,40)}} ...</label>
                                </div>
                            </div>
                            <div class="right" v-if="groupAdminId == user.UserId">
                                <span @click="deleteGroup(groupId)" class="fas fa-trash"></span>
                                <span class="fas fa-user-circle"></span>
                            </div>
                            <div class="right" v-else>
                                <span @click="joinGroup(groupId)" class="fas fa-plus"></span>
                                <span @click="leaveGroup(groupId)" class="fas fa-window-minimize"></span>
                            </div>
                        </div>
                        <div class="chat-body msg">
                        <div id="scrollGroup" class="msg-container" v-if="groupId && allGroupChats.get(groupId) != undefined">
                            <div class="messages" v-for="chat in allGroupChats.get(groupId)" :key="chat.Id">
                                <div class="sent" v-if="chat.sender == user.UserId">
                                   <div class="groups">
                                       <div>
                                        <span><img class="group-img" :src="photoUrl+chat.imagePath" alt="group"></span>
                                        <span>{{chat.lastname}} {{chat.firstname}}</span>
                                        <div>
                                            <small>{{chat.day}}</small><span @click="deleteGroupChat(chat)" class="fas fa-trash"></span>
                                        </div>
                                        </div>
                                        <div>
                                           <span v-if="chat.body == 'img.jpg'">
                                             <small>A media file was sent, server could not process the sent file, it might have been bigger than the max size</small>
                                           </span>
                                            <span v-else-if="chat.body.includes('.jpg') || chat.body.includes('.jpeg')">
                                                <img :src="photoUrl+chat.body" alt="">
                                            </span>
                                             <span v-else-if="chat.body.includes('.mp4') || chat.body.includes('.3gp')">
                                                 <video controls :src="photoUrl+chat.body"></video>
                                            </span>
                                             <span v-else-if="chat.body.includes('.mp3')">
                                                <audio controls :src="photoUrl+chat.body"></audio>
                                             </span>
                                            <span v-else>
                                                {{chat.body}}
                                            </span>
                                            <span>{{chat.time}}</span>
                                        </div>
                                   </div>
                                </div>
                                <div v-else class="received">
                                   <div class="groups">
                                       <div>
                                         <span><img class="group-img" :src="photoUrl+chat.imagePath" alt="group"></span>
                                         <span>{{chat.lastname}} {{chat.firstname}}</span>
                                         <small>{{chat.day}}</small>
                                        </div>
                                        <div>
                                            <span v-if="chat.body == 'img.jpg'">
                                                <small>A media file was sent, server could not process the sent file, it might have been bigger than the max size</small>
                                            </span>
                                            <span v-else-if="chat.body.includes('.jpg') || chat.body.includes('.jpeg')">
                                                <img :src="photoUrl+chat.body" alt="">
                                            </span>
                                             <span v-else-if="chat.body.includes('.mp4') || chat.body.includes('.3gp')">
                                                 <video controls :src="photoUrl+chat.body"></video>
                                            </span>
                                             <span v-else-if="chat.body.includes('.mp3')">
                                                <audio controls :src="photoUrl+chat.body"></audio>
                                             </span>
                                            <span v-else>
                                                {{chat.body}}
                                            </span>
                                            <span>{{chat.time}}</span>
                                        </div>
                                   </div>
                                </div>
                            </div>
                        </div>
                        <div class="msg-send" v-if="isGroupMember">
                            <div class="send-container chat-bottom">
                                <span @click="triggerGroupChatFile" class="fas fa-image"><input @change="uploadGroupChatFile" id="groupChatFile" type="file"></span>
                                <textarea id="txtsend" class="txtsend" placeholder="Type a message"></textarea>
                                <span @click="sendGroupMessage" class="fas fa-paper-plane"></span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <div class="status" :class="{'chat-or-status' : !isChatOrStatus}">
            <h2 class="header-title">Story Views</h2>
            <div class="row">
                <div class="col-2">
                    <div class="flex-col">
                        <div class="flex-row">
                            <div>
                                <h2 class="header-title"><i class="fas fa-shopping-cart"></i> <span>Shop Swift</span></h2>
                            </div>
                            <span class="close"  @click="toggleChatsOrStatus">
                                x
                            </span>
                        </div>

                        <div class="col-2" v-if="storyContent.length">
                            <div class="myslides fade"  v-for="(s,count) in storyContent" :key="s.Id" :id="s.File">
                                <div class="numbertext">{{count}}/{{storyContent.length}}</div>
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
                        <div v-else>
                            <img :src="photoUrl+user.ImagePath" alt="slide1">
                            <!-- <div v-if="fetchStory">
                                <p>fetching data ... </p>
                            </div> -->
                        </div>
                    </div>
                </div>
                <div class="col-2">
                    <div class="status-container flex-col">
                        <div class="flex-row">
                            <img class="status-img" :src="photoUrl+user.ImagePath" alt="status">
                            <div class="flex-col">
                                <label>View or Add Story</label>
                                <router-link to="/uploads">Click here to add story</router-link>
                            </div>
                        </div>
                        <div v-if="story.length">
                            <h4 class="header-title">Most Recent Updates</h4>
                            <div class="story" v-for="s in story" :key="s.Id">
                                <div class="flex-row" @click="getUserStory(s.UserId)">
                                    <img class="status-img" :src="photoUrl+s.ImagePath" alt="status">
                                    <div class="flex-col">
                                        <label>{{s.Lastname}}  {{s.Firstname}}</label>
                                        <small>{{s.day}} {{s.time}}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <p>No recent status update, kindly add to your story</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="chat-modal row" :class="{'show-modal' : showModal}">
            <div @click="hideModal" class="close">x</div>
            <div class="flex-col col-1">
                <button @click="viewActiveGroups" class="btn">View Your Active Groups</button>
                <div class="flex-col">
                    <button :class="{'color-green': colorGreen}" id="createBtn" class="btn" @click="createGroup" value="create">Create New Group</button>
                    <input id="input-text" :class="{'show-input':showInput}" type="text" placeholder="Type Group Name Here">
                </div>
            </div>
        </div>
        <div class="one-input-modal" :class="{'show':showOneInput}">
            <div @click="hideOneInput" class="close">x</div>
            <div class="flex-col">
                    <input id="changeGroupName"  type="text" placeholder="Type Group Name Here">
                    <button class="btn" @click="changeGroupName" value="create">Submit Data</button>
            </div>
        </div>
    </div>
    <div v-else>
        <login/>
    </div>
</div>    
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import Login from "../components/Login.vue"
import axios from 'axios'
import store from '../store'
import moment from 'moment'
import {showSlide} from "../data/slider"
import connection from '../signalrHub'
export default {
    name:"Chats",
    components: {Login},
    props: ['receivingUserId'],
    data() {
        return {
           //allUsers: [],//b sure this has not been used at all
            onlineConnections: [],
            isActive: true,
            isChatOrStatus: true,
            isOnlineOrRecentChats : false,
            showGroups : false,
            showModal : false,
            showInput : false,
            colorGreen: false,
            chatId: '',
            groupId: '',
            groupTitle : '',
            groupImg : 'img.jpg',
            toggleGroups : '',
            groupAdminId : '',
            isGroupMember : false,
            chatFile : '',
            receiver:'',
            resetGroupId:'',
            showOneInput:false,
            story : [],
            storyContent : [],
            fetchStory : false,
            currentChatSection: ''//aany section user clicks, set the section to this so when searching, it will be easy to find and obtain data
        }
    },
    computed:{
        ...mapState(['user',"allUsers","apiUrl","onlineUsers","photoUrl","allChats","lastChats","signalrId","groups","allGroupChats","activeGroups","activeGroups"])
    },
    methods: {
        ...mapMutations(["addChat","resetGroupCount"]),
        ...mapActions(["postChat","getLastChats","getGroups","postGroupChat","getUserActiveGroups"]),
        removeDuplicatesFromObjectArray(data,key){
            return [
                ...new Map(data.map((item) =>[key(item),item])).values()
            ]
        },
        messageFromRecent(partnerId,chatId){
            this.updateChat(this.user.UserId,chatId);
            this.viewChats(partnerId);
            this.showGroups = false;
        },
        updateLastChat(userId,chatId){
           this.updateChat(userId,chatId);
           this.toggleChats();
           this.showGroups = false;
        },
        updateChat(userId,chatId){
            if (userId != '' && chatId != '') {
            var ids = JSON.stringify([userId,chatId]);
            if (this.lastChats.size > 0) {
                var num = this.lastChats.get(chatId);
                if (num != undefined && num.numberOfPendingChats > 0) {
                    connection.client.invoke("updateLastChat",ids);
                }
            }
           }
        },
        chatUser(id){
            this.viewChats(id);
            // var scroll = document.getElementById("scroll-chat");//scroll-group
            // scroll.scrollIntoView();//scroll.scrollHeight;
            // console.log(scroll)
        },
        chatGroup(groupId,groupTitle,groupImg){
            this.groupId = groupId;
            this.groupTitle = groupTitle;
            this.groupImg = groupImg;
            this.showGroups = true;
            this.groupAdminId =this.groups.get(groupId).adminId;
            this.toggleChats();
            var c = this.allGroupChats.get(groupId);
            var isMemberIds = [this.user.UserId,groupId];
            axios.post(this.apiUrl+"random/"+JSON.stringify(isMemberIds)).then(
                response => {
                    if (response.data) {
                      this.isGroupMember = response.data;  
                    }
                }
            );
            // var scroll = document.getElementById("scrollGroup");//scroll-group
            // scroll.scrollTop = scroll.scrollHeight;
            // console.log(scroll)
        },
        viewChats(receiverId){//review this code as I will use it to reach chat outside here
            if (receiverId != '') {
                this.receiver = receiverId;
                var chatManager = {
                    Sender : this.user.UserId,
                    Receiver : receiverId,
                    ChatId : '',
                    Chats : null
                }
                axios.post(this.apiUrl+"chats",chatManager).then(
                    response => {
                     this.addChat(response.data);
                     this.chatId = response.data.chatId;
                    }
                );
            }
            this.toggleChats();
        },
        toggleChats(){
            this.isActive =! this.isActive;
            this.currentChatSection = 'chats';
        },
        toggleChatsOrStatus(){
            this.isChatOrStatus =! this.isChatOrStatus
            axios.get(this.apiUrl+"story").then(
                response => {
                    var Allstory = [];
                    response.data.forEach(element => {
                        Allstory.push(JSON.parse(element.value));                      
                    });
                   var _story = this.removeDuplicatesFromObjectArray(Allstory,user => user.UserId);
                    if (_story.length > 0) {
                        var now = moment(new Date().toUTCString());
                        _story.forEach(story => {
                            if(now.diff(moment(story.Date),'hours') < 36) {
                            var user = this.allUsers.find(u => u.UserId == story.UserId);
                                if (user) {
                                    var userStoryDetail = {
                                        UserId : story.UserId,
                                        Id : story.Id,
                                        ImagePath : user.ImagePath,
                                        day : moment(story.Date).format('ll'),
                                        time : moment(story.Date).format('LT'),
                                        Lastname : user.Lastname,
                                        Firstname : user.Firstname
                                    }
                                    this.story.push(userStoryDetail);
                                }
                            }
                        });
                    }
                }
            );
            this.getUserStory(this.user.UserId);
        },
        getUserStory(userId){
            var slides = new showSlide();
            this.storyContent = [];
            axios.get(this.apiUrl+"story/"+userId).then(
                response => {
                    if (response.data.length) {
                        response.data.forEach(element => {
                        var story = JSON.parse(element.value);
                        var now = moment(new Date().toUTCString());
                        if(now.diff(moment(story.Date),'hours') < 36){
                            this.storyContent.push(story);
                        }
                      this.fetchStory = true;  
                    });
                    }
                }
            );
            slides.automate("myslides");
        },
        toggleRecentOrActiveChats(val){
            this.showGroups = false;
            if (val == 'recent') {
                this.isOnlineOrRecentChats = true;
                this.currentChatSection = 'recent';
            }
            else if (val == 'online') {
                this.isOnlineOrRecentChats = false;
                this.currentChatSection = 'online'
            }
        },
        viewGroups(){
            this.showGroups = true;
            this.currentChatSection = 'groups'
            this.toggleGroups = "all";
        },
        viewActiveGroups(){
            this.showGroups = true;
            this.currentChatSection = 'groups';
            this.toggleGroups = "active";
            if (this.user.UserId) {
               this.getUserActiveGroups(this.user.UserId);
               this.showModal = false;
            }
        },
        createOrViewGroups(){
            this.showModal = true;
        },
        createGroup(){
            var createBtn = document.getElementById('createBtn');
            if (createBtn.value == 'create') {
                createBtn.value = "submit"
                this.showInput = true;
                this.colorGreen = true;
                createBtn.textContent = "Click to Submit"
            }
            else if (createBtn.value == 'submit') {
                var inputText = document.getElementById('input-text');
                createBtn.value = "create";
                createBtn.textContent = "Create New Group";
                this.showInput = false;
                this.colorGreen = false;
               if (inputText.value != "") {
                var newGroup = {
                    Id : '',
                    AdminId : this.user.UserId,
                    Title : inputText.value,
                    Date : new Date().toUTCString(),
                    ImagePath : 'img.jpg'
                };
                axios.post(this.apiUrl+"groups",newGroup).then(
                    response => {
                        if (response.data != '') {
                           connection.client.invoke("JoinGroup",this.user.UserId,response.data);
                        }
                    }
                );
                
                    inputText.value = "";
                    this.showModal = false;
               }
            }
        },
        hideModal(){
            this.showModal = false;
        },
        sendMessage(){
           var text = document.querySelector(".txtsend");
            if (text.value != "" && this.receiver != '') {
            var chat = {
                Id : '',
                Sender : this.user.UserId,
                Receiver: this.receiver,
                ChatId : this.chatId,
                Body : text.value,
                SenderSignalrId : this.signalrId,
                Date : new Date().toUTCString()
            };
            this.postChat(chat);
            text.value = "";
            }
        },
        sendGroupMessage(){
           var text = document.getElementById('txtsend');
            if (text.value != "") {
            var chat = {
                Id : '',
                Sender : this.user.UserId,
                Receiver: this.groupId,
                ChatId : this.groupId,
                Body : text.value,
                SenderSignalrId : this.signalrId,
                Date : new Date().toUTCString()
            };
            this.postGroupChat(chat);
            text.value = "";
            // var scroller = document.getElementById("scrollGroup");//work on scroller to delete scroll messages
            // scroller.scrollTop = scroller.scrollHeight;
            }
        },
        deleteChat(chat){
            if (confirm("this chat will be permanently deleted from both end")) {
               connection.client.invoke("DeleteChat",chat);
            }
        },
        deleteGroupChat(chat){
            if (confirm("this chat will be permanently deleted from all connected end")) {
               connection.client.invoke("DeleteGroupChat",chat.chatId,chat.id);
            }
        },
        postToChat(file){
            if (confirm("confirm media post to receivers end")) {
                var chat = {
                    Sender : this.user.UserId,
                    Receiver: this.receiver,
                    ChatId : this.chatId,
                    Body : file,
                    SenderSignalrId : this.signalrId,
                    Date : new Date().toUTCString()
            };
            this.postChat(chat);
            }
        },
        postToGroupChat(file){
            if (confirm("confirm media post to all connected members")) {
                var chat = {
                    Id : '',
                    Sender : this.user.UserId,
                    Receiver: this.groupId,
                    ChatId : this.groupId,
                    Body : file,
                    SenderSignalrId : this.signalrId,
                    Date : new Date().toUTCString()
                };
            this.postGroupChat(chat);
            }
        },
        triggerChatFile(){
            document.getElementById("chatFile").click();
        },
        uploadChatFile(event)
        {
            let formData = new FormData();
            formData.append('file',event.target.files[0]);
            axios.post(this.apiUrl+"default/savefile",formData)
            .then(
                response => {
                    this.postToChat(response.data)
                }
            );
        },
        triggerGroupChatFile(){
            document.getElementById("groupChatFile").click();
        },
        uploadGroupChatFile(event)
        {
            let formData = new FormData();
            formData.append('file',event.target.files[0]);
            axios.post(this.apiUrl+"default/savefile",formData)
            .then(
                response => {
                    this.postToGroupChat(response.data)
                }
            );
        },
        joinGroup(id){
            var userId = this.user.UserId;
            var chatId = id;
            if (confirm("You are subscribing to this group, you'll be getting real  time information regarding this group.")) {
                connection.client.invoke("JoinGroup",userId,chatId);
                this.isGroupMember = true;
            }
        },
        leaveGroup(id){
            var userId = this.user.UserId;
            var chatId = id;
            if (confirm("you'll be removed from this group. you'll no longer get information update regarding this group.")) {
                connection.client.invoke("LeaveGroup",userId,chatId);
                this.isGroupMember = false;
            }
        },
        deleteGroup(groupId){
            if (groupId) {
             if (confirm("this group will be deleted permanently and all information shared therein will be lost")) {
                 connection.client.invoke("DeleteGroup",groupId); 
             }
            }
        },
        backFromGroups(){
            this.isGroupMember = false;
            this.toggleChats();
            if (this.resetGroupId) {
                this.resetGroupCount(this.resetGroupId);
            }
        },
        resetCount(id){
            this.resetGroupId = id;
        },
        triggerChangeGroupDp(){
            var group = this.groups.get(this.groupId);
            if (group.adminId == this.user.UserId) {
                document.getElementById("groupDp").click();
            }
        },
        changeGroupDp(event){
            let formData = new FormData();
            formData.append('file',event.target.files[0]);
            axios.post(this.apiUrl+"default/savefile",formData)
            .then(
                response => {
                    if (response.data != 'img.jpg' && response.data != '') {
                        var group = this.groups.get(this.groupId);
                        if (group != "") {
                            var newGroup = {
                            Id : group.id,
                            AdminId : group.adminId,
                            Title : group.title,
                            Date : group.date,
                            ImagePath : response.data
                            };
                            axios.post(this.apiUrl+"groups",newGroup).then(
                                res => {
                                    if (res.data != '') {
                                        this.groupImg = response.data;
                                    }
                                }
                            );
                        }   
                    }
                }
            );
        },
        callOneInput(){
            var group = this.groups.get(this.groupId);
            if (group.adminId == this.user.UserId) {
                if (confirm("do you want to update your group name?")) {
                 this.showOneInput = true;
                }
            }
        },
        hideOneInput(){
            this.showOneInput = false;
        },
        changeGroupName(){
            var newGroupName = document.getElementById("changeGroupName");
            if (newGroupName.value != "") {
                console.log();
                var group = this.groups.get(this.groupId);
                        if (group != "") {
                            var newGroup = {
                            Id : group.id,
                            AdminId : group.adminId,
                            Title : newGroupName.value,
                            Date : group.date,
                            ImagePath : group.imagePath
                            };
                            axios.post(this.apiUrl+"groups",newGroup).then(
                                res => {
                                    if (res.data != '') {
                                        this.groupTitle = newGroupName.value;
                                        newGroupName.value = "";
                                        this.showOneInput = false;
                                    }
                                }
                            );
                        }  
            }
        }
    },
    created() {
        if (this.user.UserId !=  "") {
            this.getLastChats(this.user.UserId); 
            this.getGroups();
        } 
    },
    mounted() {
        if (this.receivingUserId) {
            this.viewChats(this.receivingUserId);
        }
    },
}
</script>

<style scoped>
    .myslides.show{
        display: block;
        max-height: 500px;
    }
    .status-container{
        width: 400px;
        max-height: 550px;
        overflow: scroll;
        margin: 0 auto;
    }
    .status .header-title{
        color:var(--main-color);
    }
    .status label{
        font-weight: 550;
    }
    .status .close{
        margin-top: 50px;
    }
    .story:hover{
        background: var(--main-color);
        color: var(--white);
    }
    .chat-container{
        width: 90%;
        height: 80%;
        padding: 10px;
    }
    .msg-container{
        width: 100%;
        height: 400px;
        overflow-y: scroll;
    }
    .chats.chat-or-status, .status.chat-or-status{
        display: block;
    }
     .recent-chats.online-or-recent-user-chats,
    .chat-all-active-users.online-or-recent-user-chats
    {
        display: block;
    }
    .chats, .status, #chatFile,#groupChatFile,
    .chat-all-active-users, .recent-chats{
        display: none;
    }
    .chatLayer1, .chatLayer2{
        display: none;
    }
    .chatLayer1.active, .chatLayer2.active{
        display: block;
    }
    .chats   .search-wrapper input{
        width: 90%;
    }
    .chats   .search-wrapper span{
        margin-top: 10px;
    }
    .chats{
        margin-top: 50px;
    }
    .chats .col-1{
        display: flex;
        flex-direction: column;
        margin: 10px 2px;
        max-height: 480px;
    }
    .chats .chat-top{
        display: flex;
        justify-content: space-between;
        padding: 5px;
    }
    .chats .chat-top span{
        margin: 0 2px;
        font-size: 1.6rem;
    }
    .chats .chat-top img, .status-img{
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-bottom: 5px;
        margin-left: 2px;
    }
    .chats .chat-body{
         display: flex;
        flex-direction: column;
        margin-bottom: 10px;
    }
    .chats .body{
        display: flex;
        justify-content: space-between;
        margin: 10px 2px;
    }
    .chats .body .chat-text{
        display: flex;
        flex-direction: column;
    }
    .chats .body .chat-text label:first-child{
        font-size: 1rem;
    }
    .chats .body .chat-text label:nth-child(2),
    .chats .body .chat-text small{
       color: var(--main-color);
       align-content: center;
       align-items: center;
    }
    .chats .body .chat-text small{
        font-size: .7rem;
        margin-top: .2rem;
    }
    .chats .body img{
        width: 70px;
        height: 70px;
        border-radius: 50%;
    }
    .chats .body .names{
        font-size: 1.2rem;
        font-weight: bold;
        margin-bottom: .5rem;
    }
    .chats .body label{
        font-size: 1rem;
        color: var(--color-dark);
    }
    .chats .body .time{
        color: var(--color-dark);
         margin: .5rem;
    }
    .number{
        color: var(--white);
        background: var(--main-color);
        width: 30px;
        height: 30px;
        display: flex;
        border-radius: 50%;
        align-items: center;
        justify-content: center;
        margin: 0 .5rem;
    }
      .chats .body:hover{
        background: var(--main-color);
        color: var(--white) !important;
        cursor: pointer;
    }
      .chats .body:hover  > .chat-text label{
        color: var(--white) !important;
    }
      .chats .body:hover ~ .notify div:first-child{
        color: (--white);
    }
    .chats .chat-bottom{
        display: flex;
        justify-content: space-between;
    }
    .chats .chat-bottom span, .chats .chat-top span{
        font-size: 1.8rem;
        color: var(--main-color);
    }
    .chats .chat-bottom span:hover,
    .chats .chat-bottom span.chat-or-status,
     .chats .chat-top span:hover{
        cursor: pointer;
        color: var(--color-dark);
    }
    .receiver-detail{
        display: flex;
    }
    .receiver-detail div{
        display: flex;
        flex-direction: column;
        margin-bottom: 15px;
        margin-left: 10px;
    }
    .receiver-detail div small{
        margin-top: 5px;
        font-size: .7rem;
    }
    .receiver-detail div small.green{
        color: green;
    }
    .receiver-detail div small.red{
        color: red;
    }
    .receiver-detail div small.blue{
        color: blue;
    }
    .chat-top .right span:nth-child(2){
        margin-left:2rem;
    }

     .sent{
        background: var(--main-color);
        color: var(--white);
        margin: 5px;
        border-radius: 30px 10px;
        width: fit-content;
        height: fit-content;
        padding: 10px;
    }
     .received{
         display: flex;
        background: lightgray;
        color: var(--color-dark);
        border-radius: 10px 30px;
        margin: 8px;
        width: fit-content;
        height: fit-content;
        padding: 10px;
        font-weight: bold;
    }
    .sent img, .received img{
        width: 180px;
        height: 180px;
    }
    .sent span, .received span{
        margin: .5rem;
    }
    .sent video, .received video{
        width: 300px;
        height: 300px;
    }
    .groups{
        display: flex;
        flex-direction: column;
    }
    .groups div{
        display: flex;
        justify-content: space-between;
    }
    .groups span .group-img{
        width: 25px;
        height: 25px;
        border-radius: 50%;
    }
    .txtsend{
        width: 80%;
        height: 2rem;
        border-radius: 30px;
        outline: none;
        margin: 5px 10px;
        color: var(--color-dark);
        text-align: center;
        font-size: 1.2rem;
        align-items: center;
    }
    .chat-modal{
        width: 350px;
        height: 300px;
        z-index: 100;
        position: absolute;
        top: 140px;
        left: 100px;
        background: var(--main-color);
        color: var(--white);
        display: none;
    }
    .chat-modal .close{
        position: absolute;
        top: 0;
        right: 10px;
        font-size: 30px;
    }
    .chat-modal .col-1{
        margin-top: 40px;
    }
    .chat-modal input{
        margin: 10px;
        padding: 5px;
        border-radius: 10px;
        height: 40px;
        align-content: center;
        font-weight: bold;
        font-size: 25px;
        text-align: justify;
    }
    .chat-modal .btn{
        color: var(--back-color);
        height: 40px;
        font-size: 25px;
        margin: 10px;
    }
    .chat-modal.show-modal, .chat-modal input.show-input{
        display: block;
    }
    .chat-modal.hide-modal, .chat-modal input,#groupDp{
        display: none;
    }
    .color-green{
        background: green;
    }
    .large{
        display : none;
    }

    @media only screen and (min-width: 1024px){
          .chats .body .chat-text small{
              font-size: 1.6rem;
          } 
          .chats .body .chat-text label{
             font-size: 1.8rem;
         }
          .chats .body .chat-text label.names{
             font-size: 2rem;
         }
         .chats .header-title{
             font-size: 2rem;
         }
         .chats .chat-img img{
             width: 70px !important;
             height: 70px !important;
         }
         .chat-top img{
             width: 60px !important;
             height: 60px !important;
         }
         .chat-top span, .chat-bottom span{
             font-size: 2.5rem !important;
         }
         .notify div{
             width: 40px !important;
             height: 40px !important;
         }
    }
    @media only screen and (min-width:768px){
        .large{
             display : block;
         }
        .small{
             display : none;
         }
    }
    @media only screen and (max-width:768px){
        .chats  .search-wrapper input{
            font-size: .9rem;
         }
        .sent img, .received img{
        width: 140px;
        height: 140px;
        }
        .chat-modal{
            left: 10px !important;
            width: 250px;
            height: 200px;
         }
        .chat-modal input, .chat-modal .btn{
            height: 30px !important;
            font-size: 20px !important;
            width: 230px !important;
            font-size: 15px !important;
         }
         .chat-modal .close{
             font-size: 20px;
         }
    }
    @media only screen and (max-width: 560px){
        .chats .body img{
            width: 50px;
            height: 50px;
        }
        .chats .body .names{
            font-size: 1rem;
        }
        .chats .body label{
            font-size: .8rem;
         }
        .chats .body .number{
            color: var(--white);
            background: var(--main-color);
            width: 20px;
            height: 20px;
            border-radius: 50%;
            font-size: .8rem;
         }
        .chats .body .time{
             font-size: .8rem;
         }
        .chats .chat-bottom span, .chats .chat-top span{
            font-size: 1.4rem;
        }
        .txtsend{
             height: 1.6rem;
             text-align: center;
        }
        .received,.sent,.txtsend{
             font-size: 1rem;
         }
        .sent img, .received img{
            width: 120px;
            height: 120px;
        }
    }
    @media only screen and (max-width: 375px){
        .chats .body img{
            width: 45px;
            height: 45px;
        }
        .chats .body .names{
            font-size: .8rem;
            font-weight: bold;
        }
        .chats .body .time{
             font-size: .6rem;
         }
        .chats .chat-bottom span, .chats .chat-top span{
            font-size: 1.2rem;
        }
        .chats  .search-wrapper span{
            font-size: 1.2rem;
         }
        .chats  .search-wrapper input{
            font-size: .8rem;
         }
         .received,.sent,.txtsend{
             font-size: .8rem;
         }
        .chat-top .right span:nth-child(2){
         margin-left: .2rem !important;
        }
        .chat-top .right span{
         margin: .3rem !important;
        }
        .chat-top img{
         width: 30px !important;
         height: 30px !important;
        }
        .sent img, .received img{
            width: 110px;
            height: 110px;
        }
        .status-container{
             width: 300px;
         }
        .sent video, .received video,
        .sent .groups video, .received .groups video
        {
             width: 200px !important;
             height: 200px !important;
        }
        .sent audio, .received audio{
             width: 200px;
             height: 40px;
        }
                 .sent{
             float: right;
         }
         .received{
             float: left;
         }
    }
     @media only screen and (max-width: 320px){
         .receiver-detail .info{
             display: none;
         }
        .sent video, .received video{
            width: 150px !important;
             height: 150px !important;
        }
        .sent audio, .received audio{
             width: 170px;
             height: 40px;
        }
     }
</style>