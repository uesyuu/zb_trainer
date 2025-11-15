import React, {useEffect, useRef, useState} from "react";
import {AppBar, Box, Button, Dialog, DialogContent, makeStyles, Toolbar, Typography} from "@material-ui/core";
import moment from "moment";
import twoPhase from './lib/twophase'
import algUtil from './lib/algUtil'
import inverse from './lib/inverse'
import {RouteComponentProps} from "react-router-dom";
import MyButton from "./MyButton";

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
    const [isTimerRunning, setIsTimerRunning] = useState(false)
    const [timeList, setTimeList] = useState(Array<string>())
    const [scramble, setScramble] = useState("")
    const [prevScramble, setPrevScramble] = useState("")
    const [zbllList, setZbllList] = useState(Array<string>())
    const [zblsFrList, setZblsFrList] = useState(Array<Array<string>>())
    const [zblsBrList, setZblsBrList] = useState(Array<Array<string>>())
    const [zblsFlList, setZblsFlList] = useState(Array<Array<string>>())
    const [zblsBlList, setZblsBlList] = useState(Array<Array<string>>())
    const [openZblsSelect, setOpenZblsSelect] = useState(false)
    const [selectedIndexList, setSelectedIndexList] = useState(Array<boolean>())

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
                    setZblsFrList(createZblsList(list))
                }
            )
        fetch(process.env.PUBLIC_URL + "/zbls_br.txt")
            .then(res => res.text())
            .then(text => {
                    const list = text.split("\n")
                    setZblsBrList(createZblsList(list))
                }
            )
        fetch(process.env.PUBLIC_URL + "/zbls_fl.txt")
            .then(res => res.text())
            .then(text => {
                    const list = text.split("\n")
                    setZblsFlList(createZblsList(list))
                }
            )
        fetch(process.env.PUBLIC_URL + "/zbls_bl.txt")
            .then(res => res.text())
            .then(text => {
                    const list = text.split("\n")
                    setZblsBlList(createZblsList(list))
                }
            )
    }, [])

    useEffect(() => {
        twoPhase.initialize()
        if (zbllList.length > 0 && zblsFrList.length > 0 && zblsBrList.length > 0 && zblsFlList.length > 0 && zblsBlList.length > 0) {
            setSelectedIndexList(Array(zblsFlList.length).fill(false))
            startGame()
        }
    }, [zbllList, zblsFrList, zblsBrList, zblsFlList, zblsBlList])

    document.onkeydown = (event) => {
        if (event.code === "Space") {
            operateGame()
        }
    }

    const createZblsList = (list: Array<string>): Array<Array<string>> => {
        const result = [];
        let currentGroup = [];

        for (const line of list) {
            if (line.trim() === "") {
                // 空行でグループ終了
                if (currentGroup.length > 0) {
                    result.push(currentGroup);
                    currentGroup = [];
                }
            } else {
                currentGroup.push(line);
            }
        }

        // 最後のグループが空でなければ追加
        if (currentGroup.length > 0) {
            result.push(currentGroup);
        }

        return result;
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

    const startGame = () => {
        const slotIndex = Math.floor(Math.random() * 3)

        let tmpZblsList = Array<string>()
        for (let i = 0; i < selectedIndexList.length; i++) {
            if (selectedIndexList[i]) {
                if (slotIndex === 0) {
                    tmpZblsList = tmpZblsList.concat(zblsFrList[i])
                } else if (slotIndex === 1) {
                    tmpZblsList = tmpZblsList.concat(zblsBrList[i])
                } else if (slotIndex === 2) {
                    tmpZblsList = tmpZblsList.concat(zblsFlList[i])
                }
            }
        }

        if (tmpZblsList.length > 0) {
            const auf0List = ["", "U ", "U' ", "U2 "]
            const aufList = ["", " U", " U'", " U2"]
            const auf0Index = Math.floor(Math.random() * auf0List.length)
            const zblsIndex = Math.floor(Math.random() * tmpZblsList.length)
            const auf1Index = Math.floor(Math.random() * aufList.length)
            const zbllIndex = Math.floor(Math.random() * zbllList.length)
            const auf2Index = Math.floor(Math.random() * aufList.length)
            const alg = `${auf0List[auf0Index]}${tmpZblsList[zblsIndex]}${aufList[auf1Index]} ${zbllList[zbllIndex]}${aufList[auf2Index]}`
            const [newRotationLessSolutionList, newRotationList] = algUtil.makeRotationLessAlg(alg.split(" "))
            setScramble(twoPhase.solve(newRotationLessSolutionList.join(" ")))
        } else {
            setScramble("ZBLSを選んでください")
        }
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
        startGame()
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

    const selectImage = (num: number) => {
        setSelectedIndexList(selectedIndexList.map((v, i) => i === num ? !v : v))
    }

    return (
        <div>
            <AppBar position={"relative"}>
                <Toolbar>
                    <Typography>ZB Trainer</Typography>
                </Toolbar>
            </AppBar>
            <Box className={classes.container} maxWidth={"xs"} display={"flex"} flexDirection={"column"}>
                <Box display={"flex"} justifyContent={"space-between"}>
                    <Typography className={classes.box}>
                        スタート/ストップ方法<br/>
                        PC: スペースキー押下<br/>
                        スマホ: タイマー部分タップ
                    </Typography>
                    <MyButton color={"primary"} width={"150px"} onClick={() => setOpenZblsSelect(true)}>ZBLS選択</MyButton>
                </Box>
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
            <Dialog open={openZblsSelect} onClose={() => {
                setOpenZblsSelect(false)
                startGame()
            }}>
                <Box display={"flex"} justifyContent={"center"}>
                    <MyButton
                        color={"primary"}
                        width={"120px"}
                        onClick={() => setSelectedIndexList(selectedIndexList.map(() => false))}
                    >選択を解除</MyButton>
                    <MyButton
                        color={"default"}
                        width={"120px"}
                        onClick={() => setSelectedIndexList(selectedIndexList.map(() => true))}
                    >すべて選択</MyButton>
                </Box>
                <DialogContent>
                    {zblsFrList.map((list, i) =>
                        <>
                            <img
                                src={`https://visualcube.api.cubing.net/visualcube.php?fmt=svg&size=100&pzl=3&r=y30x-30&stage=f2l&alg=${inverse.inverse(list[0])}`}
                                onClick={() => selectImage(i)}
                                style={{
                                    cursor: "pointer",
                                    transition: "0.2s",
                                    opacity: selectedIndexList[i] ? 1 : 0.5
                                }}
                            />
                            {((i < 36 && i % 2 === 1) || i === 36 || (i > 36 && i % 2 === 0)) && <br />}
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Trainer
