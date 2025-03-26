import React from 'react'

const FromTo = () => {
     const [startDate, setStartDate] = useState("");
      const [endDate, setEndDate] = useState("");
  return (
    <>
         <div className="row mb-5">
        <div className="col-md-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
          />
        </div>
        <div className="col-md-2 offset-md-8">
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
          />
        </div>
      </div>

      
    </>
  )
}

export default FromTo
