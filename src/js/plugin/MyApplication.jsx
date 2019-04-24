import { Provider } from "react-redux";
// import store from "./redux/store";
import Dashboard from 'Dashboard'
import TodoList from './components/TodoList/TodoList'

class Application extends Dashboard.Application {
    constructor(props) {
        super(props);
        
        this.event = {
            on: this.on.bind(this),
            off: this.off.bind(this),
            ready: this.ready.bind(this),
            send: this.send.bind(this)
        }

        this.confirm = {
            open: this.confirm.bind(this) 
        }

        this.modal = {
            open: this.openModal.bind(this)
        }
    }

    render() {
        return (
           <Provider store={this.props.store}>
               <TodoList
                    event={this.event}
                    confirm={this.confirm}
                    modal={this.modal}
                    applicationId={this.props.id}
                    config={this.props.config}
               />
           </Provider>
        );
    }
}

export default Application