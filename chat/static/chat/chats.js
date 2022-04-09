class App extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            theResponse:'',
            message:[],
            history:[],
            chatMessage:'',
            user:'',
            ws:null,
            wsAll:null,
            wsAll2:null,
            theClass:'',
            people:[],
            pk:0,
            other:'',
            personal1:'',
            personal2:'',
            p:''
        };
    }

    render(){

        const renderMessage = (element) => {
            if (element.sender === this.state.user) {
              return <li className="clearfix">
              <div className="message-data align-right">
              <span className="message-data-time" >10:10 AM, Today</span> &nbsp; &nbsp;
              <span className="message-data-name" >{element.sender}</span> <i className="fa fa-circle me"></i>
              
              </div>
              <div className="message other-message float-right">
              {element.message}
              </div>
              
          </li>
            } else {
              return <li>
              <div className="message-data">
              <span className="message-data-name"><i className="fa fa-circle online"></i> {element.sender}</span>
              <span className="message-data-time">10:12 AM, Today</span>
              </div>
              <div className="message my-message">
              {element.message}
              </div>
          </li>
            
            }
          }

          const renderHistory = (element) => {
            if (element.sender === this.state.user) {
              return <li className="clearfix">
              <div className="message-data align-right">
              <span className="message-data-time" >{element.timestamp}</span> &nbsp; &nbsp;
              <span className="message-data-name" >{element.sender}</span> <i className="fa fa-circle me"></i>
              
              </div>
              <div className="message other-message float-right">
              {element.message}
              </div>
              
          </li>
            } else {
              return <li>
              <div className="message-data">
              <span className="message-data-name"><i className="fa fa-circle online"></i> {element.sender}</span>
              <span className="message-data-time">10:12 AM, Today</span>
              </div>
              <div className="message my-message">
              {element.message}
              </div>
          </li>
            
            }
          }
        
        return(
            <div>
                
                <div className="people-list" id="people-list">
                    <div className="search">
                        <input type="text" placeholder="search" />
                        <i className="fa fa-search"></i>
                        
                    </div>
                    
                    <ul className = 'list'>{this.state.people.map((element, i) =>
                        <li tabIndex="1" className="clearfix" key={i}>
                            <button className="submit-feedback" name={element.friend} onClick={() => this.handleClick(element.friend)} >
                            <div className="about">
                                    <div className="name">{element.friend}</div>
                                    <div className="status">

                                    </div>
                                </div>
                            </button>
                        </li>
                    )}</ul>
                </div>
        
                <div className="chat" >
                    <div className="chat-header clearfix">
                    <div className="chat-about">
                        <div className="chat-with">Chat With {this.state.other}</div>
                        <div className="chat-num-messages">{this.state.message.length}</div>
                    </div>
                    <i className="fa fa-star"></i>
                    </div>

                    
                    
                    <div className="chat-history" id='messa'>


                        {this.state.history.map((element, i) =>
                            <ul key={i}>
                        
                                {renderHistory(element)}

                            </ul>
                        )}

                        {this.state.message.map((element, i) =>
                        <ul key={i}>
                     
                            {renderMessage(element)}

                        </ul>
                        )}

                        <div style={{ float:"left", clear: "both" }}
                            ref={(el) => { this.messagesEnd = el; }}>
                        </div>

                        


                    </div>

                   

                    <div className="chat-message clearfix">
            <textarea onChange={this.handleChange} name='chatMessage' id="chat-message-input" value={this.state.chatMessage} placeholder ="Type your message" rows="3"></textarea>
                    
            <i className="fa fa-file-o"></i> &nbsp;&nbsp;&nbsp;
            <i className="fa fa-file-image-o"></i>
            
            <button  onClick={this.submitMessage} id="chat-message-submit" type="button" value="Send" >Send</button>
    
          </div>


                </div>
            </div>
        )
    }

    handleClick(name) {
        document.querySelector(".people-list").style.display = "none";
        this.state.ws.close();
       fetch('http://127.0.0.1:8000/chat/chats/'+name)
        .then(res => res.json())
        .then(data => {
            this.setState({
                theResponse: [data],
            }, this.connectSocket);
        });


        this.setState({
            other: name
        });

        this.setState({
            message: [],
        });

        fetch('http://127.0.0.1:8000/chat/history/'+name)
        .then(res => res.json())
        .then(data => {
            this.setState({
                history:data,
            });
            if(this.state.history.length === 0 ){

                fetch('http://127.0.0.1:8000/chat/chats/person/'+name)
                .then(res => res.json())
                .then(data => {
                    this.setState({
                        personal1: data,
                    },this.firstConnection);
                    
                });          
    
            }
        });

        console.log(this.state.people)
        
        /**/
        this.scrollToBottom();

               
    }

    
    change = () =>{

        document.querySelector("#mobile-cta").style.display = 'block';
        console.log('pressed')

    }


    saveFriend = () => {
        var csrftoken = getCookie('csrftoken');

        fetch('http://127.0.0.1:8000/chats/add/other/friend/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                user: this.state.other,
                friend: this.state.user,
            })
          })
          .then(response => response.json())
          .then(result => {
            
          });

    }



    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    componentDidMount(){

        console.log(window.screen.height)

        let x = window.location.href.replace('http://127.0.0.1:8000/thelisting/','')
        let p = window.location.href;

        let s = p.search('/') + 1

        for (let index = 0; index < 5; index++) {

          s = p.search('/') + 1

          p = p.substring(s)
        }

        fetch('http://127.0.0.1:8000/chat/friends/ac')
        .then(res => res.json())
        .then(data => {
            this.setState({
                people:data
            });

            try {

                this.setState({
                    p: data[0].friend
                },this.connect);
                
            } catch (error) {

                window.location.href = "http://127.0.0.1:8000/chat/people/ac";
                
            }


    
        });

        

        this.setState({
            other: p.replace('/','')
        });

        this.scrollToBottom();
        
        
        

    }


    componentDidUpdate() {
        this.scrollToBottom();
    }

    connect = () =>{
        fetch('http://127.0.0.1:8000/chat/history/'+this.state.p)
        .then(res => res.json())
        .then(data => {
            this.setState({
                history:data,
            });
        });
        
    
        fetch('http://127.0.0.1:8000/chat/chats/'+this.state.p)
        .then(res => res.json())
        .then(data => {
            this.setState({
                theResponse: [data],
            },this.connectSocket);

            this.setState({
                theResponse: [data],
            },this.conne);
            
        });


        
    }

    conne = () =>{ 
        fetch('http://127.0.0.1:8000/chat/chats/person/'+this.state.user)
        .then(res => res.json())
        .then(data => {
            this.setState({
                personal1: data,
            },this.firstConnection);           
        });
    }



    firstConnection = () =>{
        let objDiv = document.getElementById("messa");
        objDiv.scrollTop = objDiv.scrollHeight;
        
        let x = this.state.personal1

        const chatSocket = new WebSocket(
            'ws://'
            + window.location.host
            + '/ws/all/new/'
            + x.id
            + '/new/'
        );


        chatSocket.onmessage = (e) => {
            const data = JSON.parse(e.data);

            //this.state.people.forEach(element => {

                

                    
                if(data.message.username === this.state.user){
                    

                    this.setState(state => ({

                        people:remove([...state.people,data.message]) 
                    }));

                }
                    
                
                
            //});
            
        };

        this.setState({
            wsAll: chatSocket,
        });

        chatSocket.onclose = function(e) {
            console.error('Chat socket closed unexpectedly');
        };

    }


    connectSocketAll = (name) =>{
        
        
        /*if(this.state.history.length === 0 ){

            fetch('http://127.0.0.1:8000/chat/chats/person/'+name)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    personal1: data,
                },this.firstConnection);
                
            });          

        }*/

    }

    connectSocket = () => {

       /*fetch('http://127.0.0.1:8000/chat/chats/'+this.state.p)
       .then(res => res.json())
       .then(data => {
           this.setState({
               theResponse: [data],
           },this.conne);
       });*/

       let objDiv = document.getElementById("messa");
       objDiv.scrollTop = objDiv.scrollHeight;
        
        this.state.theResponse.forEach(element => {
            const chatSocket = new WebSocket(
                'ws://'
                + window.location.host
                + '/ws/chat/'
                + element.id
                + '/'
            );

            

            this.setState({
                pk: element.id
            });

            this.setState({
                message: [],
            });

            this.setState({
                user: element.user,
            });

            chatSocket.onmessage = (e) => {
                const data = JSON.parse(e.data);
                this.setState(state => ({
                    message: [...state.message, data.message]
                }));
            };

            this.setState({
                ws: chatSocket,
            });

            chatSocket.onclose = function(e) {
                console.error('Chat socket closed unexpectedly');
            };
        });

        
    }




    other = () =>{

        this.setState(state => ({
            people: [...state.people, data.message]
        }));

    }




    submitMessage = () =>{
        if (this.state.history.length === 0) {
            let user = this.state.user
            let other = this.state.other
            let send = {'id':10,'username':other,'friend':user}    


//
            var csrftoken = getCookie('csrftoken');

            fetch('http://127.0.0.1:8000/chat/chats/add/other/friend/', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                },
                body: JSON.stringify({
                    user: this.state.other,
                    friend: this.state.user,
                })
              })
              .then(response => response.json())
              .then(result => {
                
            });
//




            this.state.wsAll.send(JSON.stringify({
                'message': send,
            }));
            
        }


        const message = this.state.chatMessage;
        let thisMessage = {}
        let user = this.state.user
        let pk = this.state.pk
        let other = this.state.other
        thisMessage = {'sender':user,'message':message,'pk':pk,'other':other}
        //thisMessage[user] = 'message';
        this.state.ws.send(JSON.stringify({
            'message': thisMessage,
        }));

        this.scrollToBottom();



        this.setState({
            chatMessage: "",
        });
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

}


function remove(arr) {

    var seenNames = {};

    let array = arr.filter(function(currentObject) {
        if (currentObject.friend in seenNames) {
            return false;
        } else {
            seenNames[currentObject.friend] = true;
            return true;
        }
    });
    
    return array

    
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






ReactDOM.render(<App />, document.querySelector(".container"));