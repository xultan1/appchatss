class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            theResponse:'',
            message:[],
            chatMessage:'',
            user:'',
            ws:null,
            other:'',
            p:''
        };
    }

    render(){

        const renderMessage = (element) => {
            if (element.sender === this.state.user) {
              return <div>{element.message}</div>
            } else {
              return <div className='message-divRight'>{element.message}</div>
            }
          }
        
        return(
            <div>
                <div>
                    {this.state.message.map((element, i) =>
                    <div className='thisdiv' key={i}>
                        <div>                           
                            {renderMessage(element)}
                        </div>
                    </div>
                    )}
                </div>
                <input onChange={this.handleChange} name='chatMessage' id="chat-message-input" className="form-control form-control-lg" type="text" value={this.state.chatMessage} size="50"/>
                <input onClick={this.submitMessage} id="chat-message-submit" className="btn btn-success" type="button" value="Send"/>
            </div>
        )
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    componentDidMount(){
        let x = window.location.href.replace('http://127.0.0.1:8000/thelisting/','')
        let p = window.location.href;

        let s = p.search('/') + 1

        for (let index = 0; index < 5; index++) {

          s = p.search('/') + 1

          p = p.substring(s)
        }

        this.setState({
            other: p.replace('/','')
        });
    
        fetch('http://127.0.0.1:8000/chat/chats/'+p)
        .then(res => res.json())
        .then(data => {
            this.setState({
                theResponse: [data],
            }, this.connectSocket);
        });

    }

    connectSocket = () => {
        this.state.theResponse.forEach(element => {
            const chatSocket = new WebSocket(
                'ws://'
                + window.location.host
                + '/ws/chat/'
                + element.id
                + '/'
            );

            this.setState({
                user: element.user,
            });

            chatSocket.onmessage = (e) => {
                const data = JSON.parse(e.data);
                this.setState(state => ({
                    message: [...state.message, data.message]
                }));

                console.log(this.state.message)
            };

            this.setState({
                ws: chatSocket,
            });

            chatSocket.onclose = function(e) {
                console.error('Chat socket closed unexpectedly');
            };
        });
    }


    submitMessage = () =>{
        const message = this.state.chatMessage;
        let thisMessage = {}
        let user = this.state.user
        thisMessage = {'sender':user,'message':message}
        //thisMessage[user] = 'message';
        this.state.ws.send(JSON.stringify({
            'message': thisMessage,
        }));
        this.setState({
            chatMessage: "",
        });
    }

}

ReactDOM.render(<App />, document.querySelector(".chat"));