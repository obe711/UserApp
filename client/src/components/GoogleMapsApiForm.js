import React, {useRef} from 'react';

const GoogleMapsApiForm = () => {
    const usernameRef = useRef(null);
    

    const handleSubmit = event => {
        event.preventDefault();
        const username = usernameRef.current.value;
        
        if(username !== "") {
          console.log(username);
        }
    };
    
    return ( 
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <input
              ref={usernameRef}
              type="text"
              className="form-control form-control-lg rounded border-0 shadow-lg"
              required=""
            ></input>
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              className="btn btn-primary text-uppercase font-size-15 px-6 px-md-7 shadow-lg"
            >
              Update API Key
            </button>
          </div>
        </form>
    );
}
 
export default GoogleMapsApiForm;