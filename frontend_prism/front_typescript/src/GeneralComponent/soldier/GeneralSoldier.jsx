import React from "react"
import CustomCalendar from "../commonGeneral/CustomCalendar"
import CustomClock from "../commonGeneral/CustomClock"
import MenuAppBar from "../main/MenuAppBar"
import {getUserInfoByJWT } from "../../HelperJS/extract_info"
import { Grid } from "@material-ui/core"
import WaiterLoading from "../../HelperFooStuff/WaiterLoading"
import SoldierMenu from "./SoldierMenu"
import VerticalGraph from "./../admin/graphs/VerticalGraph"


export default class GeneralSoldier extends React.Component {

    constructor(props) {
        super(props);


        this.state = {
			my_role:undefined
		};

    }




	

	componentDidMount() {
		getUserInfoByJWT().then((user) => {

			if (user === undefined || user.data === undefined) {
				
			} else {
				this.myRole = user.data["role"];
				let majors = user.data["major"];
                let personalId = user.data["personalId"]
				console.log("GGGGGGGGGGGGG")
                this.setState({my_role:this.myRole})

                getAllMySubmissions(personalId).then((submissions)=>{
                    
                })

			}
		});
	}

    render() {		
		

		if (this.myRole === undefined) {
			return <WaiterLoading />;
		}

		let menu = undefined;


		return (

			<MenuAppBar 
			menu={<SoldierMenu/>} 
			role={this.myRole}
			content={
			
				<div>
					<div>
						<Grid container item justify='center' alignItems='center'>
							<CustomCalendar />
							
						</Grid>
					</div>
					
					<div>
						<Grid container item justify='flex-start' alignItems='flex-start'>
							<CustomClock />
						</Grid>
					</div>

					<br />
					<br/>
					<br/>


                    <div> <h2>My open and not submitted AND submitted</h2> 
                    	
                        <VerticalGraph horizontal={["To Submitt","Submitted", "Opened"]} vertical={[3,25]}/>
					</div>

                    
                    <div> 
                        <h2>My OK and not OK were given</h2> 
                    
                    <VerticalGraph horizontal={["OK grades","NOT_OK grades","Waiting For Grades"]} vertical={[30,15,3]}/>
                    
                    </div>
					
				
				</div>
			}>
			</MenuAppBar>
		);
    }
}