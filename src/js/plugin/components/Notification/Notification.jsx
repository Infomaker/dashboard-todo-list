import { GUI } from "Dashboard";
import { Component } from 'react'

class Notification extends Component {
    
    remind(minutes){
        const { item } = this.props;
        item.reminder = item.reminder.add(minutes,'minutes');
        console.log(item);
    }

    dismiss() {
        const { item } = this.props;
        console.log(item);
        item.reminder = null;
        console.log(item);
    }
    
    render() {
        const { item } = this.props;
        console.log("Item in notification", item);
        return (
            <GUI.Wrapper>
                {item.text}
                <div>
                    <p>Remind me:</p>
                    <GUI.Button
                        text={"in five minutes"}
                        size={"large"}
                        onClick={() => this.remind(5)}
                    />
                    <GUI.Button
                        text={"in an hour"}
                        size={"large"}
                        onClick={() => this.remind(60)}
                    />
                    <GUI.Button
                        text={"tomorrow"}
                        size={"large"}
                        onClick={() => this.remind(1440)}
                    />
                </div>
                <div>
                    <GUI.Button
                        text={"Dismiss"}
                        size={"large"}
                        onClick={() => this.dismiss()}
                    />
                </div>
                
            </GUI.Wrapper>
            
        )
    }
}

export default Notification