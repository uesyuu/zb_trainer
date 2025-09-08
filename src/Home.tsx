import React, {useEffect, useState} from "react";
import {AppBar, Box, Button, TextField, Toolbar, Typography} from "@material-ui/core";
import {createStyles, makeStyles} from "@material-ui/core/styles"
import twoPhase from './lib/twophase'
import {RouteComponentProps} from "react-router-dom";
import {RouterState} from "./types/routerState";

const Home = (props: RouteComponentProps) => {
    const useStyles = makeStyles(() => createStyles({
        container: {
            margin: '0 auto',
            padding: '20px',
            maxWidth: '700px'
        },
        box: {
            marginBottom: '10px'
        },
        error: {
            color: "red"
        },
        button: {
            marginLeft: '20px'
        }
    }))
    const classes = useStyles()

    const [algList, setAlgList] = useState(Array<string>())
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        twoPhase.initialize()
        if (props.location.state) {
            setAlgList((props.location.state as RouterState).algList)
        }
    }, [props.location.state])

    const handleAlgListChanged = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setAlgList(event.target.value.split("\n"))
    }

    const onClickTrainerButton = () => {
        if (algList.length === 0) {
            setIsError(true)
            setTimeout(() => {
                setIsError(false)
            }, 3000)
            return
        }
        props.history.push({
            pathname: "trainer",
            state: {
                algList: algList
            }
        })
    }

    const onClickRecapTrainerButton = () => {
        if (algList.length === 0) {
            setIsError(true)
            setTimeout(() => {
                setIsError(false)
            }, 3000)
            return
        }
        props.history.push({
            pathname: "recap_trainer",
            state: {
                algList: algList
            }
        })
    }

    return (
        <div>
            <AppBar position={"relative"}>
                <Toolbar>
                    <Typography>Alg Trainer</Typography>
                </Toolbar>
            </AppBar>
            <Box className={classes.container} maxWidth={"xs"} display={"flex"} flexDirection={"column"}>
                <Typography className={classes.box}>
                    複数の手順を練習できるツールです。<br/><br/>
                    練習したい手順を入力してください。<br/>
                    1行1手順となり、改行すると別手順とみなされます。<br/>
                    使える記号は以下の通りです。<br />
                    U, R, F, D, L, B, Uw, Rw, Fw, Dw, Lw, Bw, u, r, f, d, l, b, M, S, E, x, y, z<br />
                    記号はすべて半角で入力してください。<br />
                    またプライム記号は必ずシングルクォーテーションを使い、記号間には必ず半角スペースを置いてください。
                </Typography>
                <Box className={classes.box} display={"flex"} justifyContent={"center"}>
                    <Button variant="contained" size="large" onClick={onClickTrainerButton}>
                        ランダムで練習する
                    </Button>
                    <Button className={classes.button} variant="contained" size="large" onClick={onClickRecapTrainerButton}>
                        一巡する
                    </Button>
                </Box>
                {isError &&
                <Box className={classes.box} display={"flex"} justifyContent={"center"}>
                    <Typography className={classes.error}>
                        手順が入力されていません
                    </Typography>
                </Box>
                }
                <TextField className={classes.box}
                           id="textField"
                           multiline
                           rows={10}
                           variant="outlined"
                           defaultValue={algList.join("\n")}
                           onChange={handleAlgListChanged}/>
            </Box>
        </div>
    )
}

export default Home
