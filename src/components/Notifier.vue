<template>
    <div>
        <div class="fadeInOut message" :class="{'show':showNotifier}">
            <div @click="_hideNotifier" class="close">x</div>
            <div class="flex-col">
                <h2>Shop Swift Notifier</h2>
                <div v-if="message.info == 'success'">
                    <span class="fas fa-check green"></span>
                    <p class="green">{{message.msg}}</p>
                </div>
                <div v-else-if="message.info == 'warn'">
                    <span class="fas fa-exclamation-triangle yellow"></span>
                    <p class="yellow">{{message.msg}}</p>
                </div>
                <div v-else-if="message.info == 'error'">
                    <span class="fas fa-times maroon"></span>
                    <p class="yellow">{{message.msg}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
    name: 'Notifier',
    props: ["message"],
    data() {
        return {
        }
    },
    methods: {
        ...mapMutations(["hideNotifier"]),
        _hideNotifier(){
            this.hideNotifier();
        }
    },
    computed:{
        ...mapState(["showNotifier"])
    },
    mounted() {
    },
}
</script>

<style>
    @keyframes fadeInOut {
        0%{
            opacity: 0;
        }
        16%{
            opacity: 1;
        }
        84%{
            opacity: 1;
        }
        100%{
            opacity: 0;
        }
    }
    .message{
        width: 400px;
        margin: 0 auto;
        opacity: 0;
        text-align: center;
        -webkit-animation: fadeInOut 20s;
        animation: fadeInOut 20s;
    }
    .yellow{
        color: yellow;
    }
    .green{
        color: green;
    }
    .maroon{
        color: maroon;
    }
    .fadeInOut{
        width: 250px;
        height: fit-content;
        z-index: 30;
        margin: auto;
        background: var(--color-dark);
        color: var(--white); 
        border-radius: 10px;
        box-shadow: rgba(0.1, 0.1, 0.2, alpha);
        position: absolute;
        top: 50%;
        left: 10%;
        display: none;
    }
    .fadeInOut.show{
        display: block;
    }
</style>