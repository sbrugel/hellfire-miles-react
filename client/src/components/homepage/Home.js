import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const HomePage = (user) => {
    const [file, setFile] = useState({});
    const fileReader = new FileReader();

    const [moves, setMoves] = useState([]);
    const [movesDisplay, setMovesDisplay] = useState([]);

    // on page load, get moves from this user
    useEffect(() => {
        axios.get(`http://localhost:5000/moves/${user.user.name}`).then((res) => {
            setMoves(res.data);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // whenever moves update (i.e. we upload new moves), update display
    useEffect(() => {
        axios.get(`http://localhost:5000/moves/${user.user.name}`).then((moves) => {
            const data = moves.data.map((m) => 
                <tr key={m._id}>
                    <td>{m.loco1}</td>
                    <td>{m.loco2 || 'None'}</td>
                    <td>{m.loco3 || 'None'}</td>
                    <td>{m.loco4 || 'None'}</td>
                    <td>{m.start}</td>
                    <td>{m.end}</td>
                    <td>{m.service}</td>
                    <td>{m.mileage}</td>
                </tr>)
            setMovesDisplay(data.length > 0 ? <table>{ data }</table> : <p>No moves yet</p>)
        });
    }, [moves]);

    /**
     * When the user uploads a new CSV file to the page, update the selected CSV file to be imported
     * @param {*} e The file picker (fires this function)
     */
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    }

    /**
     * Converts the contents of a CSV file to an array, with each row corresponding to an element of the array.
     * @param {string} string: Contents of CSV file
     * @returns CSV contents in an array
     */
    const csvFileToArray = string => {
        const DELIMITER = ',';
        const headers = string.slice(0, string.indexOf("\n")).split(DELIMITER);
        const rows = string.slice(string.indexOf("\n") + 1).split("\n");
        const arr = rows.map(function (row) {
            const values = row.split(DELIMITER);
            const el = headers.reduce(function (object, header, index) {
                object[header] = values[index];
                return object;
            }, {});
            return el;
        });

        return arr;
    };

    /**
     * Handles CSV file uploading; adds all moves in this CSV file to the database under the currently logged in user's username
     * @param {*} e The import button (fires this function)
     */
    const handleFileSubmit = (e) => {
        e.preventDefault();

        if (file) {
            let movesArray, movesAdded = 0;
            fileReader.onload = async function (event) {
                const newMoves = [];
                movesArray = csvFileToArray(event.target.result);
                for (const move of movesArray) {
                    if (!move.Loco1) continue; // empty move
                    const m = {
                        user: user.user.name,
                        loco1: move.Loco1,
                        loco2: move.Loco2,
                        loco3: move.Loco3,
                        loco4: move.Loco4,
                        start: move.From,
                        end: move.To,
                        service: move.Headcode + ' ' + move.Train,
                        mileage: Number(move["Mileage\r"])
                    };
                    await axios.post("http://localhost:5000/moves", m);
                    newMoves.push(move);
                    movesAdded++;
                }
                setMoves([...moves, newMoves]);
                alert(`Added ${movesAdded} new moves!`);
            }

            fileReader.readAsText(file);
        } else {
            alert("You haven't uploaded a CSV!");
        }
    }

    return (
        <>
            <h1>{ user.user.name }'s Moves</h1>
            <h2>Import Moves</h2>
            <input type="file" accepts=".csv" onChange={ handleFileChange } />
            <button type="submit" onClick={ handleFileSubmit }>
                Import
            </button>
            <h2>Your Moves</h2>
            <div>
                { movesDisplay }
            </div>
        </>
    )
}

export default HomePage;