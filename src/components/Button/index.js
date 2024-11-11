import React from "react";
import "./styles.css";

function Button({ text, onclick, blue, disabled })
{
        return(
            <div className={ blue ? "btn btn-blue" : "btn"} onClick={onclick}>
                {text}
            </div>
        );
}

export default Button;
