import React, {useState} from 'react'
import './stylesheet.scss';
import SingleComment from '../SingleComment/SingleComment'
import CommentInputForm from '../CommentInputForm/CommentInputForm'
import textImage1 from '../Images/textImage1.jpg'
import {Segment, Divider} from 'semantic-ui-react'

export default function CommentSection() {
    const [params, setParams] = useState({comment: ""})

    function handleParamChange(e) {
        const param = e.target.name
        const value = e.target.value
        setParams(prevParams => {
          return {[param]: value}
        })
    }

    function handlePostChange() {
        console.log(params.comment)
        setParams({comment: ""})
    }

    return (
        <div className = "bigger-comment">
            <h2>Comments</h2>
            <div className="CommentSection">
                <SingleComment 
                src = {textImage1} firstName={"Shuge"} 
                lastName={"Fan"} time={"1h"} 
                commentText= "This solution will work for all cases even if there are multiple rows or any number of elements. But the count of the section should be same you want 4 in first row and 3 is second row it won't work that way the space for the 4th content will be blank the container won't fill."
                />
                <Divider section />
                <SingleComment 
                src = {textImage1} firstName={"Shuge"} 
                lastName={"Fan"} time={"1h"} 
                commentText= "This solution will work for all cases even if there are multiple rows or any number of elements. But the count of the section should be same you want 4 in first row and 3 is second row it won't work that way the space for the 4th content will be blank the container won't fill. his solution will work for all cases even if there are multiple rows or any number of elements. But the count of the section should be same you want 4 in first row and 3 is second row it won't work that way the space for the 4th content will be blank the container won't fill."
                />
                <Divider section />
                <SingleComment 
                src = {textImage1} firstName={"Shuge"} 
                lastName={"Fan"} time={"1h"} 
                commentText= "This solution will work for all cases even if there are multiple rows or any number of elements. But the count of the section should be same you want 4 in first row and 3 is second row it won't work that way the space for the 4th content will be blank the container won't fill."
                />
                <Divider section />
                <SingleComment 
                src = {textImage1} firstName={"Shuge"} 
                lastName={"Fan"} time={"1h"} 
                commentText= "This solution will work for all cases even if there are multiple rows or any number of elements. But the count of the section should be same you want 4 in first row and 3 is second row it won't work that way the space for the 4th content will be blank the container won't fill."
                />
                <Divider section />
                <SingleComment 
                src = {textImage1} firstName={"Shuge"} 
                lastName={"Fan"} time={"1h"} 
                commentText= "This solution will work for all cases even if there are multiple rows or any number of elements. But the count of the section should be same you want 4 in first row and 3 is second row it won't work that way the space for the 4th content will be blank the container won't fill."
                />
                <Divider section />
                <SingleComment 
                src = {textImage1} firstName={"Shuge"} 
                lastName={"Fan"} time={"1h"} 
                commentText= "This solution will work for all cases it won't work that way the space for the 4th content will be blank the container won't fill."
                />
                <Divider section />
                <SingleComment 
                src = {textImage1} firstName={"Shuge"} 
                lastName={"Fan"} time={"1h"} 
                commentText= "This solution will work for all cases even if there are multiple rows or any number of elements. But the count of the section should be same you want 4 in first row and 3 is second row it won't work that way the space for the 4th content will be blank the container won't fill."
                />
                <Divider section />
                <CommentInputForm src = {textImage1} firstName={"Shuge"} params={params} onParamChange={handleParamChange} onPostChange={handlePostChange}/>
            </div>
         </div>
    )
}
