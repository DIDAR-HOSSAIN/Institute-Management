import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateWiseReport = ({ onSearch }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // Trigger search whenever startDate or endDate changes
    useEffect(() => {
        onSearch(startDate, endDate);
    }, [startDate, endDate]);

    return (
        <div className="my-4">
            <div className="flex items-center">
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Start Date"
                />
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="End Date"
                    className="ml-2"
                />
            </div>
        </div>
    );
};

export default DateWiseReport;
