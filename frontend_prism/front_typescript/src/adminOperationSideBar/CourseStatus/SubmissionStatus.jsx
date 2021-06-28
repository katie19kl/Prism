import React from "react";
import CommanderMenu from "../../GeneralComponent/admin/CommanderMenu";
import TesterMenu from "../../GeneralComponent/tester/TesterMenu";
import MenuAppBar from "../../GeneralComponent/main/MenuAppBar";
import WaiterLoading from "../../HelperFooStuff/WaiterLoading";
import { getUserInfoByJWT } from "../../HelperJS/extract_info";
import Role from "../../Roles/Role";
import TableStatusFrame from "./TableStatusFrame";


export default class SubmissionStatus extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            myRole: undefined,
        }
    }

    componentDidMount() {
        getUserInfoByJWT().then((user) => {

			if (user === undefined) {
				
			} else {
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

            let currMenu = undefined;

            if (this.state.myRole === Role.Commander || this.state.myRole === Role.Admin) {
                currMenu = <CommanderMenu />;
            } else if (this.state.myRole === Role.Tester) {
                currMenu = <TesterMenu />;
            }

            return ( 
                <MenuAppBar 
                menu={currMenu} 
                role={this.state.myRole}
                content={
                    <TableStatusFrame /> 
                }>
    
                </MenuAppBar>
            );
        }
    }
}
