import React from "react"
import CommanderMenu from "../../../GeneralComponent/admin/CommanderMenu";
import MenuAppBar from "../../../GeneralComponent/main/MenuAppBar";
import "bootstrap/dist/css/bootstrap.min.css";
import UploadBar from './UploadBar';

import DisplayFiles from '../CourseDisplaying/DisplayFiles';


import {  Page } from 'react-pdf';
import { Document } from 'react-pdf/dist/esm/entry.webpack';



import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;


class CourseUploading  extends React.Component {

	constructor(props) {
		super(props)


		this.state = {
            pageNum: 1
		};
	}
    
    
	render() {
        let path_1 = 'http://localhost:4000/file-handling/files/2-Aprism_pdf.pdf/firmware/2- new_module_name/2.1- subject_a'
        
        let path_2 = "http://localhost:4000/file-handling/files/Part_1 - Copy.pdf/firmware/2- new_module_name/2.2- new name subject"
        let path = ""
        let pageNum = this.state.pageNum 
        if (pageNum == 1){
            path = path_1
        }
        else {
            path = path_2
        }


        return (
            <MenuAppBar
            role = "Commander" 
            menu={
                <CommanderMenu/>
            }
            content={
                <div>
                



                  
        
                    <br></br>
                    <br></br>
                    <br></br>
                    <h2> uploading Second  here </h2>
                    {<UploadBar/>}
               </div>
            }>

            </MenuAppBar>

        )
    }

}
	
export default CourseUploading;

/*
                <Document
                    file={path}
                    onLoadSuccess={() => console.log("loaded")}
                >
                    <Page pageNumber={pageNum} />
                </Document>
*/