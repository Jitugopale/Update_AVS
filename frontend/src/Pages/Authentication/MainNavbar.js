import React from 'react'
import img from "../Authentication/images/logo.png"


const MainNavbar = () => {
  return (
    <>
        <nav>
        <div className="col-12">
          <div className="text-white py-2" style={{ maxHeight: "70px", height:'70px',backgroundColor: '#0088CC'}} >
            <img src={img} alt="Company Logo" className="me-2" style={{width:'500px', height:'55px',marginBottom:'90px'}} />
          </div>
        </div>
        </nav>
    </>
  )
}

export default MainNavbar
