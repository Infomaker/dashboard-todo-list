import { moment } from "Dashboard";
import { Component } from 'react'
import { ComponentButton, CustomWrapper } from './style'


class Notification extends Component {

    remind(minutes) {
        const { item } = this.props;
        item.reminder = moment().add(minutes, 'minutes');
        this.saveItem(item);
    }

    dismiss() {
        const { item } = this.props;
        item.reminder = null;
        this.saveItem(item);
    }

    saveItem(item) {
        const { applicationId, notificationId, send } = this.props;
        send("@plugin_bundle:setItem", {
            applicationId: applicationId,
            item: item
        });
        send("@plugin_bundle:closeNotification", {
            notificationId: notificationId
        })
    }

    render() {
        
        return (
            <CustomWrapper>
                <div>
                    <ComponentButton
                        text={"Remind me in five minutes"}
                        size={"large"}
                        onClick={() => this.remind(5)}
                    />
                    <ComponentButton
                        text={"Remind me in an hour"}
                        size={"large"}
                        onClick={() => this.remind(60)}
                    />
                    <ComponentButton
                        text={"Remind me tomorrow"}
                        size={"large"}
                        onClick={() => this.remind(1440)}
                    />
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