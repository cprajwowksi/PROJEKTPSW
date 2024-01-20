import React, { useEffect } from 'react';

function Reklamy() {
    useEffect(() => {
        const es = new EventSource("http://localhost:7000/events/datetime");

        es.addEventListener("message", function(event) {
            const newElement = document.createElement("li");
            const eventList = document.getElementById("list");
            console.log(event.data)
            newElement.textContent = event.data;

            eventList.innerHTML = "";

            eventList.appendChild(newElement);
        });

        return () => {

            es.close();
        };
    }, []);

    return (
        <div className="reklamy">
            TUTAJ BEDA REKLAMY
            <ul className="list" id="list"></ul>
        </div>
    );
}

export default Reklamy;
