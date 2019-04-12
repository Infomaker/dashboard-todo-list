import { Application, GUI, moment } from "Dashboard";
import { Component } from 'react'
import { ComponentButton, CustomWrapper } from './style'


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
        const { item } = this.props;
        return (
            <CustomWrapper>
                {item.text}
                <div>
                    <p>Remind me:</p>
                    <ComponentButton
                        text={"in five minutes"}
                        size={"large"}
                        onClick={() => this.remind(5)}
                    />
                    <ComponentButton
                        text={"in an hour"}
                        size={"large"}
                        onClick={() => this.remind(60)}
                    />
                    <ComponentButton
                        text={"tomorrow"}
                        size={"large"}
                        onClick={() => this.remind(1440)}
                    />
                </div>

                <div>
                    <ComponentButton
                        text={"Dismiss"}
                        size={"large"}
                        onClick={() => this.dismiss()}
                    />
                </div>
            </CustomWrapper>
        )
    }
}

export default Notification