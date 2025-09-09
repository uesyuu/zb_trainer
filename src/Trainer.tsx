import React, {useEffect, useRef, useState} from "react";
import {AppBar, Box, Button, makeStyles, Toolbar, Typography} from "@material-ui/core";
import moment from "moment";
import twoPhase from './lib/twophase'
import algUtil from './lib/algUtil'
import {RouteComponentProps} from "react-router-dom";
import {RouterState} from "./types/routerState";

const Trainer = (props: RouteComponentProps) => {
    const useStyles = makeStyles(() => ({
        container: {
            margin: '0 auto',
            padding: '20px',
            maxWidth: '700px'
        },
        box: {
            marginBottom: '10px'
        },
        countBlock: {
            backgroundColor: '#ededed'
        },
        prevScrambleBlock: {
            backgroundColor: '#ededed'
        },
        scrambleBlock: {
            backgroundColor: '#dddddd'
        },
        imageBlock: {
            backgroundColor: '#eeeeee'
        },
        timerBlock: {
            backgroundColor: '#ededed'
        },
        timeListTitleBlock: {
            backgroundColor: '#dddddd'
        },
        timeListBlock: {
            backgroundColor: '#dddddd',
            height: "250px",
            overflow: "scroll",
        }
    }))
    const classes = useStyles()

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [time, setTime] = useState(0); // センチ秒
    const [algList, setAlgList] = useState(Array<string>())
    const [isTimerRunning, setIsTimerRunning] = useState(false)
    const [timeList, setTimeList] = useState(Array<string>())
    const [scramble, setScramble] = useState("")
    const [prevScramble, setPrevScramble] = useState("")
    const [zbllList, setZbllList] = useState(Array<string>())
    const [zblsFrList, setZblsFrList] = useState(Array<string>())
    const [zblsBrList, setZblsBrList] = useState(Array<string>())
    const [zblsFlList, setZblsFlList] = useState(Array<string>())
    const [zblsBlList, setZblsBlList] = useState(Array<string>())

    useEffect(() => {
        fetch(process.env.PUBLIC_URL + "/zbll.txt")
            .then(res => res.text())
            .then(text => {
                    const list = text.split("\n")
                    setZbllList(list)
                }
            )
        fetch(process.env.PUBLIC_URL + "/zbls_fr.txt")
            .then(res => res.text())
            .then(text => {
                    const list = text.split("\n")
                    setZblsFrList(list)
                }
            )
        fetch(process.env.PUBLIC_URL + "/zbls_br.txt")
            .then(res => res.text())
            .then(text => {
                    const list = text.split("\n")
                    setZblsBrList(list)
                }
            )
        fetch(process.env.PUBLIC_URL + "/zbls_fl.txt")
            .then(res => res.text())
            .then(text => {
                    const list = text.split("\n")
                    setZblsFlList(list)
                }
            )
        fetch(process.env.PUBLIC_URL + "/zbls_bl.txt")
            .then(res => res.text())
            .then(text => {
                    const list = text.split("\n")
                    setZblsBlList(list)
                }
            )
    }, [])

    useEffect(() => {
        twoPhase.initialize()
        if (props.location.state) {
            const algListInState = props.location.state as RouterState
            setAlgList(algListInState.algList)
            if (zbllList.length > 0 && zblsFrList.length > 0 && zblsBrList.length > 0 && zblsFlList.length > 0 && zblsBlList.length > 0) {
                startGame(algListInState.algList)
            }
        } else {
            props.history.push("/")
        }
    }, [props.history, props.location.state, zbllList, zblsFrList, zblsBrList, zblsFlList, zblsBlList])

    document.onkeydown = (event) => {
        if (event.code === "Space") {
            operateGame()
        }
    }

    const onTouchTimerView = () => {
        operateGame()
    }

    const operateGame = () => {
        if (isTimerRunning) { // ソルブ中
            endGame()
            setIsTimerRunning(false)
        } else { // 停止中
            setTime(0)
            startTimer()
            setIsTimerRunning(true)
        }
    }

    const startGame = (list: Array<string>) => {
        const auf0List = ["", "U ", "U' ", "U2 "]
        const aufList = ["", " U", " U'", " U2"]
        const slotIndex = Math.floor(Math.random() * 3)
        const auf0Index = Math.floor(Math.random() * auf0List.length)
        const zblsIndex = Math.floor(Math.random() * zblsFrList.length)
        const auf1Index = Math.floor(Math.random() * aufList.length)
        const zbllIndex = Math.floor(Math.random() * zbllList.length)
        const auf2Index = Math.floor(Math.random() * aufList.length)
        let alg = ""
        if (slotIndex === 0) {
            alg = `${auf0List[auf0Index]}${zblsFrList[zblsIndex]}${aufList[auf1Index]} ${zbllList[zbllIndex]}${aufList[auf2Index]}`
        } else if (slotIndex === 1) {
            alg = `${auf0List[auf0Index]}${zblsBrList[zblsIndex]}${aufList[auf1Index]} ${zbllList[zbllIndex]}${aufList[auf2Index]}`
        } else if (slotIndex === 2) {
            alg = `${auf0List[auf0Index]}${zblsFlList[zblsIndex]}${aufList[auf1Index]} ${zbllList[zbllIndex]}${aufList[auf2Index]}`
        }
        const [newRotationLessSolutionList, newRotationList] = algUtil.makeRotationLessAlg(alg.split(" "))
        setScramble(twoPhase.solve(newRotationLessSolutionList.join(" ")))
    }

    const endGame = () => {
        stopTimer()
        if (time / 100 / 60 < 1) {
            setTimeList([
                ...timeList,
                moment(time * 10).format('s.SS')
            ])
        } else {
            setTimeList([
                ...timeList,
                moment(time * 10).format('m:ss.SS')
            ])
        }
        setPrevScramble(scramble)
        startGame(algList)
    }

    const startTimer = () => {
        if (intervalRef.current !== null) return;
        intervalRef.current = setInterval(() => {
            setTime(c => c + 1);
        }, 10);
    }

    const stopTimer = () => {
        if (intervalRef.current === null) return;
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    }

    return (
        <div>
            <AppBar position={"relative"}>
                <Toolbar>
                    <Typography>Alg Trainer</Typography>
                </Toolbar>
            </AppBar>
            <Box className={classes.container} maxWidth={"xs"} display={"flex"} flexDirection={"column"}>
                <Box className={classes.box} display={"flex"} justifyContent={"space-between"}>
                    <Button variant='contained' onClick={() => props.history.push({
                        pathname: "/",
                        state: {
                            algList: algList
                        }
                    })}>
                        戻る
                    </Button>
                </Box>
                <Typography className={classes.box}>
                    スタート/ストップ方法<br/>
                    PC: スペースキー押下<br/>
                    スマホ: タイマー部分タップ
                </Typography>
                <Box onTouchStart={onTouchTimerView}>
                    <Box className={classes.countBlock} display={"flex"} justifyContent={"center"}>
                        <Typography>
                            Count: {timeList.length}
                        </Typography>
                    </Box>
                    <Box className={classes.scrambleBlock} display={"flex"} justifyContent={"center"}>
                        <Typography>
                            Scramble: {scramble}
                        </Typography>
                    </Box>
                    <Box display={"flex"}>
                        <Box className={classes.imageBlock} display={"flex"}>
                            <img
                                src={"https://cubing.net/api/visualcube/?fmt=svg&r=x-30y30z15&bg=t&size=150&pzl=3&alg=" + scramble.replace(/\s+/g, "")}
                                alt={""}
                            />
                        </Box>
                        <Box className={classes.timerBlock}
                             display={"flex"}
                             justifyContent={"center"}
                             alignItems={"center"}
                             flexGrow={1}>
                            <Typography variant={"h4"}>
                                {moment(time * 10).format('mm:ss.SS')}
                            </Typography>
                        </Box>
                    </Box>
                    <Box className={classes.timeListTitleBlock} display={"flex"}>
                        <Typography>
                            Time List:
                        </Typography>
                    </Box>
                    <Box className={classes.timeListBlock} display={"flex"}>
                        <Typography>
                            &nbsp; {timeList.join(", ")}
                        </Typography>
                    </Box>
                    <Box className={classes.prevScrambleBlock} display={"flex"} justifyContent={"center"}>
                        <Typography>
                            Prev Scramble: {prevScramble}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </div>
    )
}

export default Trainer
