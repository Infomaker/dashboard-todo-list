import Dashboard from 'Dashboard'
import { StoreProvider } from './services/context/store';
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

        this.hasPermission = this.hasPermission.bind(this);
    }



    render() {
        return (
            <StaticProvider staticContext={{
                event: this.event,
                confirm: this.confirm,
                modal: this.modal,
                hasPermission: this.hasPermission
            }} >
                <TodoList
                    event={this.event}
                    confirm={this.confirm}
                    modal={this.modal}
                    applicationId={this.props.id}
                    config={this.props.config}
                    hasPermission={this.hasPermission}
                />
            </StaticProvider>
        );
    }
}

export default Application