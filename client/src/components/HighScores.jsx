import React, { Component } from 'react'
import '../css/HighScores.css';
import { Link } from 'react-router-dom'
import api from '../api'
import ReactTable from 'react-table'
import styled from 'styled-components'

const Container = styled.div`
    position: fixed;
    border-radius: 10px;
    left: 50px;
    top: 50px;
    bottom: 50px;
    right: 50px;
    background-color: #5da8ff;
    border: 4px solid #000000;
    text-align: center;
`

class HighScores extends Component {
    constructor(props) {
        super(props)
        this.state = {
            bestEasyTimes: [],
            bestMediumTimes: [],
            bestHardTimes: [],
            bestRates: [],
            isLoading: false,
        }
    }

    componentDidMount = async () => {
        this.setState({ isLoading: true })

        await api.getScores().then(scores => {
            this.setState({
                bestRates: scores.data.data["Rates"].sort(
                    function(a, b) {return a.value - b.value}),
                bestEasyTimes: scores.data.data["Easy"].sort(
                    function(a, b) {return a.value - b.value}),
                bestMediumTimes: scores.data.data["Medium"].sort(
                    function(a, b) {return a.value - b.value}),
                bestHardTimes: scores.data.data["Hard"].sort(
                    function(a, b) {return a.value - b.value}),
                isLoading: false,
            })
        })
    }

    render() {
        const { bestEasyTimes, bestMediumTimes, bestHardTimes, bestRates, isLoading } = this.state

        const easyTimes = [...Array(bestEasyTimes.length).keys()].map((i) =>
             <tr id={i.toString()}>
                 <td>{i+1}</td>
                 <td>{bestEasyTimes[i].value}</td>
             </tr>
        )
        const mediumTimes = [...Array(bestMediumTimes.length).keys()].map((i) =>
            <tr id={i.toString()}>
                <td>{i+1}</td>
                <td>{bestMediumTimes[i].value}</td>
            </tr>
        )
        const hardTimes = [...Array(bestHardTimes.length).keys()].map((i) =>
            <tr id={i.toString()}>
                <td>{i+1}</td>
                <td>{bestHardTimes[i].value}</td>
            </tr>
        )
        const rates = [...Array(bestRates.length).keys()].map((i) =>
            <tr id={i.toString()}>
                <td>{bestRates[i].value}</td>
                <td>{bestRates[i].difficulty}</td>
            </tr>
        )

        return (
            <Container>
                <div className={"row"}>
                    <div className={"column"}>
                        <h3>Easy</h3>
                        <table>
                            <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Time</th>
                            </tr>
                            </thead>
                            <tbody>
                            {easyTimes}
                            </tbody>
                        </table>
                    </div>
                    <div className={"column"}>
                        <h3>Medium</h3>
                        <table>
                            <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Time</th>
                            </tr>
                            </thead>
                            <tbody>
                            {mediumTimes}
                            </tbody>
                        </table>
                    </div>
                    <div className={"column"}>
                        <h3>Hard</h3>
                        <table>
                            <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Time</th>
                            </tr>
                            </thead>
                            <tbody>
                            {hardTimes}
                            </tbody>
                        </table>
                    </div>
                    <div className={"column"}>
                        <h3>Best Rates</h3>
                        <table>
                            <thead>
                            <tr>
                                <th>Clearance Rate</th>
                                <th>Difficulty</th>
                            </tr>
                            </thead>
                            <tbody>
                            {rates}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Link to="/">
                    <button style={{margin: "auto"}}>
                        Play Game
                    </button>
                </Link>
                <br/><br/>
                <button onClick={() => {
                    api.deleteAllScores().then(r => {
                        this.setState({
                            bestEasyTimes: [],
                            bestMediumTimes: [],
                            bestHardTimes: [],
                            bestRates: [],
                        })
                    }).catch(err => console.log(err))
                }}>Reset All Statistics</button>
            </Container>
        )
    }
}

export default HighScores
