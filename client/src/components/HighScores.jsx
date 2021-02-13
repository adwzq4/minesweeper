import React, { Component } from 'react'
import '../css/HighScores.css';
import { Link } from 'react-router-dom'
import api from '../api'
import styled from 'styled-components'

const Container = styled.div`
    position: fixed;
    border-radius: 10px;
    left: 30px;
    top: 30px;
    bottom: 30px;
    right: 30px;
    background-color: #5da8ff;
    border: 4px solid #000000;
    text-align: center;
    overflow: auto;
`

class HighScores extends Component {
    constructor(props) {
        super(props)
        this.state = {
            bestEasyTimes: [],
            bestMediumTimes: [],
            bestHardTimes: [],
            bestRates: [],
            easyMines: [{value: 0}],
            mediumMines: [{value: 0}],
            hardMines: [{value: 0}],
            easyWins: [{value: 0}],
            mediumWins: [{value: 0}],
            hardWins: [{value: 0}],
            easyDeaths: [{value: 0}],
            mediumDeaths: [{value: 0}],
            hardDeaths: [{value: 0}],
        }
    }

    componentDidMount = async () => {
        await api.getStats().then(stats => {
            this.setState({
                easyMines: stats.data.data["mines"]["Easy"],
                mediumMines: stats.data.data["mines"]["Medium"],
                hardMines: stats.data.data["mines"]["Hard"],
                easyWins: stats.data.data["wins"]["Easy"],
                mediumWins: stats.data.data["wins"]["Medium"],
                hardWins: stats.data.data["wins"]["Hard"],
                easyDeaths: stats.data.data["deaths"]["Easy"],
                mediumDeaths: stats.data.data["deaths"]["Medium"],
                hardDeaths: stats.data.data["deaths"]["Hard"],
            })
        })

        await api.getScores().then(scores => {
            //console.log(scores.data.data)
            this.setState({
                bestRates: scores.data.data["Rates"].sort(
                    function(a, b) {return a.value - b.value}),
                bestEasyTimes: scores.data.data["Easy"].sort(
                    function(a, b) {return a.value - b.value}),
                bestMediumTimes: scores.data.data["Medium"].sort(
                    function(a, b) {return a.value - b.value}),
                bestHardTimes: scores.data.data["Hard"].sort(
                    function(a, b) {return a.value - b.value}),
            })
        })
    }

    render() {
        const { bestEasyTimes, bestMediumTimes, bestHardTimes, bestRates } = this.state

        const easyTimes = [...Array(bestEasyTimes.length).keys()].map((i) =>
             <tr className={"tr"} id={i.toString()}>
                 <td className={"td"}>{i+1}</td>
                 <td className={"td"}>{bestEasyTimes[i].value}</td>
             </tr>
        )
        const mediumTimes = [...Array(bestMediumTimes.length).keys()].map((i) =>
            <tr className={"tr"} id={i.toString()}>
                <td className={"td"}>{i+1}</td>
                <td className={"td"}>{bestMediumTimes[i].value}</td>
            </tr>
        )
        const hardTimes = [...Array(bestHardTimes.length).keys()].map((i) =>
            <tr className={"tr"} id={i.toString()}>
                <td className={"td"}>{i+1}</td>
                <td className={"td"}>{bestHardTimes[i].value}</td>
            </tr>
        )
        const rates = [...Array(bestRates.length).keys()].map((i) =>
            <tr className={"tr"} id={i.toString()}>
                <td className={"td"}>{bestRates[i].value}</td>
                <td className={"td"}>{bestRates[i].difficulty}</td>
            </tr>
        )

        const easyMines = this.state.easyMines[0].value
        const mediumMines = this.state.mediumMines[0].value
        const hardMines = this.state.hardMines[0].value
        const easyWins = this.state.easyWins[0].value
        const mediumWins = this.state.mediumWins[0].value
        const hardWins = this.state.hardWins[0].value
        const easyDeaths = this.state.easyDeaths[0].value
        const mediumDeaths = this.state.mediumDeaths[0].value
        const hardDeaths = this.state.hardDeaths[0].value

        return (
            <Container>
                <h1 className={"hs-header"}>High Scores and Statistics</h1>
                <p className={"times-header"}>Best Times</p>
                <div className={"row"}>
                    <div className={"column"}>
                        <h2>Easy</h2>
                        <table className={"table"}>
                            <thead>
                            <tr className={"tr"}>
                                <th className={"th"}>Rank</th>
                                <th className={"th"}>Time</th>
                            </tr>
                            </thead>
                            <tbody>
                            {easyTimes}
                            </tbody>
                        </table>
                    </div>
                    <div className={"column"}>
                        <h2>Medium</h2>
                        <table className={"table"}>
                            <thead>
                            <tr className={"tr"}>
                                <th className={"th"}>Rank</th>
                                <th className={"th"}>Time</th>
                            </tr>
                            </thead>
                            <tbody>
                            {mediumTimes}
                            </tbody>
                        </table>
                    </div>
                    <div className={"column"}>
                        <h2>Hard</h2>
                        <table className={"table"}>
                            <thead>
                            <tr className={"tr"}>
                                <th className={"th"}>Rank</th>
                                <th className={"th"}>Time</th>
                            </tr>
                            </thead>
                            <tbody>
                            {hardTimes}
                            </tbody>
                        </table>
                    </div>
                    <div className={"column"}>
                        <h2>Best Rates</h2>
                        <table className={"table"}>
                            <thead>
                            <tr className={"tr"}>
                                <th className={"th"}>Clearance Rate</th>
                                <th className={"th"}>Difficulty</th>
                            </tr>
                            </thead>
                            <tbody>
                            {rates}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className={"stats"}>
                    <p className={"stat-header"}>Mines Cleared</p>
                    <p>Easy: {easyMines}</p>
                    <p>Medium: {mediumMines}</p>
                    <p>Hard: {hardMines}</p>
                </div>
                <div className={"stats"}>
                    <p className={"stat-header"}>Areas Cleared</p>
                    <p>Easy: {easyWins}</p>
                    <p>Medium: {mediumWins}</p>
                    <p>Hard: {hardWins}</p>
                </div>
                <div className={"stats"}>
                    <p className={"stat-header"}>Deaths</p>
                    <p>Easy: {easyDeaths}</p>
                    <p>Medium: {mediumDeaths}</p>
                    <p>Hard: {hardDeaths}</p>
                </div>
                <br/><br/><br/><br/>
                <Link to="/">
                    <button className={"button"} style={{margin: "auto"}}>
                        Sweep Some Mines
                    </button>
                </Link>
                <br/><br/><br/>
                <button className={"button"} onClick={() => {
                    api.deleteAllScores().then(r => {
                        this.setState({
                            bestEasyTimes: [],
                            bestMediumTimes: [],
                            bestHardTimes: [],
                            bestRates: [],
                            easyMines: [{value: 0}],
                            mediumMines: [{value: 0}],
                            hardMines: [{value: 0}],
                            easyWins: [{value: 0}],
                            mediumWins: [{value: 0}],
                            hardWins: [{value: 0}],
                            easyDeaths: [{value: 0}],
                            mediumDeaths: [{value: 0}],
                            hardDeaths: [{value: 0}],
                        })
                    }).catch(err => console.log(err))
                }}>Reset All Statistics</button>
            </Container>
        )
    }
}

export default HighScores
