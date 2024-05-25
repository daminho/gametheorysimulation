import React, {FC} from "react";
import { Link } from "react-router-dom";
import DoveHawk from "../games/DoveHawk";



const MainPage: FC = () => {


    return (
        <ul>
            <li> 
                <Link to ="/dovehawks">
                DoveHawk
                </Link>
            </li>
            <li>
                <Link to ="/prisonerdelimma">
                    Prisoner's Delimma
                </Link>
            </li>
        </ul>
    )

}

export default MainPage