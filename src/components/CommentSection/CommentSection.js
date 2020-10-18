import React, {useState, useEffect} from 'react'
import './stylesheet.scss';
import SingleComment from '../SingleComment/SingleComment'
import CommentInputForm from '../CommentInputForm/CommentInputForm'
import textImage1 from '../Images/textImage1.jpg'
import {Segment, Divider} from 'semantic-ui-react'
import * as firebase from 'firebase';

export default function CommentSection({id}) {
    const [sampleComments, setSampleComments] = useState(['This is great', 'Good', 'Fake'])
    const [params, setParams] = useState({comment: ""})

    const stringify = (val) => {
        return val.replaceAll(':', '').replaceAll('.', '').replaceAll('/', '');
    }; 

    const getText = () => {
        firebase.database().ref(`comments/${stringify({id}.id)}`).on('value', (snapshot) => {
            setSampleComments(snapshot.val().sampleComments);
        });
    }   ;

    // useEffect(() => getText())

    const setText = (text) => {
        if (text == "") return
        sampleComments.push(text)
        setSampleComments(sampleComments)
        firebase.database().ref(`comments/${stringify({id}.id)}`).set({
            sampleComments
        });
    };

    function handleParamChange(e) {
        const param = e.target.name
        const value = e.target.value
        setParams(prevParams => {
          return {[param]: value}
        })
    }

    function handlePostChange() {
        getText()
        setText(params.comment)
        setParams({comment: ""})
    }

    console.log(sampleComments);

    return (
        <div className = "bigger-comment">
            <h2>Comments</h2>
            <div className="CommentSection">
                {sampleComments.map(comment => {
                    return <div>
                        <SingleComment 
                        src = {textImage1} firstName="Shuge"
                        lastName="Fan" time="1h"
                        commentText= {comment}
                        />
                        <Divider section />
                        </div>
                })
            }
            <CommentInputForm src = {textImage1} firstName={"Shuge"} params={params} onParamChange={handleParamChange} onPostChange={handlePostChange}/>
            </div>
         </div>
    )
}
