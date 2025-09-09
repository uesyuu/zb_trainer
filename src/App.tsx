import React from "react";
import {BrowserRouter, Route} from "react-router-dom";
import Trainer from "./Trainer";

function App() {
    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <div>
                <Route exact path='/' component={Trainer}/>
            </div>
        </BrowserRouter>
    );
}

export default App;
