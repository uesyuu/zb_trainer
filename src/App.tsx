import React from "react";
import {BrowserRouter, Route} from "react-router-dom";
import Home from "./Home";
import Trainer from "./Trainer";
import RecapTrainer from "./RecapTrainer";

function App() {
    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <div>
                <Route exact path='/' component={Home}/>
                <Route path='/trainer' component={Trainer}/>
                <Route path='/recap_trainer' component={RecapTrainer}/>
            </div>
        </BrowserRouter>
    );
}

export default App;
