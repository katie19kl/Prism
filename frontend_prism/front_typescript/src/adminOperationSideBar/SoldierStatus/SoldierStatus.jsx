import React from "react"
import CommanderMenu from "../../GeneralComponent/admin/CommanderMenu"
import MenuAppBar from "../../GeneralComponent/main/MenuAppBar"
import WaiterLoading from "../../HelperFooStuff/WaiterLoading"
import { getUserInfoByJWT } from "../../HelperJS/extract_info"
import SoldierStatusFrame from "./SoldierStatusFrame"


export default class SoldierStatus extends React.Component {

    constructor(props) {
        super(props);
        this.state = { myRole: undefined };
    }

    componentDidMount() {
        getUserInfoByJWT().then((user) => {

            if (user !== undefined) {
                
                user = user.data;
                let role = user["role"];

                this.setState({ myRole: role });
            }
        });
    }

    render() {
        if (this.state.myRole === undefined) {
            return <WaiterLoading />;
        
        } else {
            return (
                <MenuAppBar 
                menu={
                    <CommanderMenu />
                }
                
                role={this.state.myRole}
                content={
                   
                    <SoldierStatusFrame>
                    </SoldierStatusFrame>
                    
                }>
                </MenuAppBar>
            );
        }
    }
}
