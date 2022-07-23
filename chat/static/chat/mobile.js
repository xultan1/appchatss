class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            theResponse:[],
            hideDiv:'block',
            showDiv:'none',
            people:[],
            isLoadedPeople:false,
            personName:'',
            finished:false,
            message:[],
            ws:null,
            wsPublic:null,
            wsSelf:null,
            loggedInUser:'',
            loggedInUserAlways:'',
            publicUsername:[],
            notification:'',
            hideNotification:'none',
            isLoadedHistory:false,
            whoYouClicked:''


        };
    }

    componentDidMount(){
        fetch('http://127.0.0.1:8000/chat/friends/ac')
        .then(res => res.json())
        .then(data => {
            this.setState({
                people:data,
                isLoadedPeople:true
            });
        });


        fetch('http://127.0.0.1:8000/chat/loggedUser')
        .then(res => res.json())
        .then(data => {
            this.setState({
                loggedInUser: data.username,
                loggedInUserAlways:data.username
            },this.connectSocketPublic);
            
        });

    }



    render(){

        if (!this.state.isLoadedPeople) {

            return(
                <div style={{color: "red"}}>
                    Loading!!!!
                </div>
            )
            
        }


        return(
            <div>
                <div className="topNav">
                        
                    <div className="topNavDiv">
                        <button onClick={this.clickNotification} style={{display: this.state.hideNotification ,position:"absolute"}} className="notification formButton">
                         <a className="notName">{this.state.notification}</a>
                        </button>

                        <button onClick={this.back} className='topNavDivButton' type="submit"><img className="topNavDivButtonImg" src={"http://127.0.0.1:8000/static/chat/previous.png"} alt=""/></button>

                        <button onClick={this.clickPlus} className="addUserButton"><img className="plusButton" src={"http://127.0.0.1:8000/static/chat/icons8-plus-100.png"} alt=""/></button>

                    </div>

                    <div style={{display: this.state.showDiv,position:"absolute",width:"100%"}}>
                        <p className="personName">{this.state.personName}</p>
                    </div>
                        
                </div>
                <div style={{display: this.state.hideDiv}}>

                    <div>
                        <ul className="homeUl">{this.state.people.map((element, i) =>
                            <li key={i}>
                                <button onClick={this.handleClick} className="UlButton"><p className="buttonPs">{element.friend}</p></button>
                            </li>
                        )}</ul>
                    </div>

                </div>
                <div style={{display: this.state.showDiv}}>
                    <ChatView name = {this.state.personName} ws = {this.state.ws} message = {this.state.message} wsSelf = {this.state.wsSelf}
                     wsPublic = {this.state.wsPublic} notification = {this.state.notification} loggedInUser={this.state.loggedInUserAlways}
                     loadedHistory ={this.state.isLoadedHistory} who={this.state.whoYouClicked}/>
                </div>
            </div>
        )
    }


    

    handleClick = (e) => {
        let name = e.target.innerHTML.replace(/<\/?[^>]+(>|$)/g, "")     
        this.setState({
            hideDiv : "none",
            showDiv : "block",
            personName:name,
            whoYouClicked:name,
        },this.connect);    


        fetch('http://127.0.0.1:8000/chat/history/'+name)
        .then(res => res.json())
        .then(data => {
            this.setState({
                message:data,
                isLoadedHistory:true,
            });
        });

                
    }


    clickNotification = (e) => {
        let name = e.target.innerHTML.replace(/<\/?[^>]+(>|$)/g, "") 
        //name = name.replace('messaged','') 
        if (this.state.ws !== null) {
            this.state.ws.close();            
        }
        this.setState({
            hideDiv : "none",
            showDiv : "block",
            personName:name,
            hideNotification:'none',
            whoYouClicked:name,
        },this.connect);  


        
        fetch('http://127.0.0.1:8000/chat/history/'+name)
        .then(res => res.json())
        .then(data => {
            this.setState({
                message:data,
                isLoadedHistory:true,
            });
        });
                
    }

    clickPlus = (e) => {
        window.location.href = "http://127.0.0.1:8000/chat/people/ac"
    }


    connect = (e) => {

        fetch('http://127.0.0.1:8000/chat/chats/'+this.state.personName)
        .then(res => res.json())
        .then(data => {
            this.setState({
                theResponse: [data],
            },this.connectSocket);
        });
        
        
    }




    back = () => {
        this.setState({
            hideDiv : "block",
            showDiv : "none"
        });

        this.state.ws.close();
    }


    


    connectSocket = () => {

        const chatSocket = new WebSocket(
            'ws://'
            + window.location.host
            + '/ws/chat/'
            + this.state.theResponse[0].id
            + '/'
        );

        
        chatSocket.onopen = function(e) {
            console.log('Connected')
        }

        this.setState({
            ws:chatSocket
        });

        chatSocket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            this.setState(state => ({
                message: [...state.message, data.message]
            }));
        };



        chatSocket.onclose = function(e) {
            console.error('Chat socket closed unexpectedly');
        };


        const chatSocketPublic = new WebSocket(
            'ws://'
            + window.location.host
            + '/ws/public/'
            + this.state.personName
            + '/'
        );


        this.setState({
            wsPublic:chatSocketPublic
        });


        this.setState({
            loggedInUser:this.state.personName
        });

        chatSocketPublic.onopen = function(e) {
            console.log('ConnectedPublic1')
        }


        chatSocketPublic.onmessage = (e) => {
            const data = JSON.parse(e.data);
            console.log(this.state.whoYouClicked)
            console.log(this.state.notification)
            if(this.state.whoYouClicked !== this.state.notification){
                this.setState({
                    notification : data.message,
                    hideNotification:"block"
                });
            }
        };



    }


    connectSocketPublic = () => {

        const chatSocketPublic = new WebSocket(
            'ws://'
            + window.location.host
            + '/ws/public/'
            + this.state.loggedInUser
            + '/'
        );


        chatSocketPublic.onopen = function(e) {
            console.log('ConnectedPublic1')
        }


        chatSocketPublic.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if(this.state.whoYouClicked !== data.message){
                this.setState({
                    notification : data.message,
                    hideNotification:"block"
                });
            }
        };



        this.setState({
            wsPublic:chatSocketPublic
        });


        /*const chatSocketSelf = new WebSocket(
            'ws://'
            + window.location.host
            + '/ws/public/'
            + this.state.loggedInUser
            + '/'
        );


        this.setState({
            wsSelf:chatSocketSelf
        });


        this.setState({
            wsPublic:chatSocketPublic
        });


        chatSocketSelf.onopen = function(e) {
            console.log('ConnectedPublic2')
        }

        chatSocketSelf.onmessage = (e) => {
            const data = JSON.parse(e.data);
            this.setState({
                notification : data.message,
            });
        };
        /*this.setState({
            ws:chatSocket
        });

        chatSocket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            this.setState(state => ({
                message: [...state.message, data.message]
            }));
        };

        chatSocket.onclose = function(e) {
            console.error('Chat socket closed unexpectedly');
        };*/


    }


}

class ChatView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history:'',
            chatMessage:'',
        };
    }



    componentDidMount(){
        /*fetch('http://127.0.0.1:8000/chat/history/'+this.props.name)
        .then(res => res.json())
        .then(data => {
            this.setState({
                history:data,
            });
        });*/
    }
    

    render(){

        if (!this.props.loadedHistory) {

            return(
                <div style={{color: "red"}}>
                    Loading!!!!
                </div>
            )
            
        }

        return(
            <div>
                <div className="chatDiv">


                    <div className="chatDivInner">{this.props.message.map((element,i) =>
                
                        <div className={element.sender === this.props.name ? "right-chat" : "left-chat"} key={i}>

                            <p className="chatDivInnerP">{element.message}</p>

                        </div>

                        )}                        
                    </div>

                </div>


                
                <div className="formDiv">
                    
                        <div className="textarea-container">
                            <textarea  value={this.state.chatMessage}  onChange={this.handleChange}  name="chatMessage" id="formTextArea" cols="10" rows="1"></textarea>
                            <button onClick={this.submitMessage} className="formButton" type="submit"><img className="buttonImage" src={"http://127.0.0.1:8000/static/chat/send-message.png"} alt=""/></button>
                        </div>
                    
                    
			
		        </div>

            </div>
        )

    }



    submitMessage = () =>{
        if(this.state.chatMessage != ''){

            this.props.ws.send(JSON.stringify({
                'message': {"message":this.state.chatMessage,"receiver":this.props.who},
            }));
    
            this.setState({
                chatMessage: "",
            });
    
            /*this.props.wsSelf.send(JSON.stringify({
                'message': "notification",
            }));*/
    

            this.props.wsPublic.send(JSON.stringify({
                'message': {"notification":"notification","person":this.props.name,"personMessaging":this.props.loggedInUser,"who":this.props.who},
            }));

        }


        

    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }


    
}






function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].toString().replace(/^([\s]*)|([\s]*)$/g, "");
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}






ReactDOM.render(<App />, document.querySelector(".mobileView"));
