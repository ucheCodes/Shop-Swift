import {HubConnectionBuilder} from '@microsoft/signalr'
import store from './store'
class CallHub{
    constructor(){
        this.client = new HubConnectionBuilder().withUrl(store.state.serverPath+'signalr').build();
        //this.client = new HubConnectionBuilder().withUrl('https:localhost:5001/signalr').build();
    }
     start() {
        this.startedPromise = this.client.start().then(() => this.client.invoke("GetConnectionId").then(function (id) {
             store.commit("setSignalrId",id);
             console.log("signal r server started running and id is below");
             console.log("signal r id is "+id);
            }))
            .catch(
                err => {
                    return new Promise((resolve,reject) => 
                    setTimeout(() => start().then(resolve).catch(reject),5000))
                }
            )
            return this.startedPromise;
    }
}
export default new CallHub();