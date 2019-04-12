import { Application, GUI, moment } from "Dashboard";
import { Component } from 'react'

class Notification extends Application {  // Ska vi göra detta? (Hur annars få tillgång till this.send)
    
    remind(minutes){
        const { item } = this.props;
        item.reminder = moment().add(minutes,'minutes');
        this.saveItem(item);
    }

    dismiss() {
        const { item } = this.props;
        item.reminder = null;
        this.saveItem(item);
    }

    saveItem(item) {
        const { applicationId, notificationId } = this.props;
        this.send("@plugin_bundle:setItem", {
            applicationId: applicationId,
            item: item
        });
        this.send("@plugin_bundle:closeNotification", {
            notificationId: notificationId
        })
    }
    
    render() {
        console.log('this :', this);
        const { item } = this.props;
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