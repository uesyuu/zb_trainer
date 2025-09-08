const algUtil = (function () {
    let faceList = ["U", "R", "F", "D", "L", "B"]
    const rotateX = [2, 1, 3, 5, 4, 0]
    const rotateXPrime = [5, 1, 0, 2, 4, 3]
    const rotateX2 = [3, 1, 5, 0, 4, 2]
    const rotateY = [0, 5, 1, 3, 2, 4]
    const rotateYPrime = [0, 2, 4, 3, 5, 1]
    const rotateY2 = [0, 4, 5, 3, 1, 2]
    const rotateZ = [4, 0, 2, 1, 3, 5]
    const rotateZPrime = [1, 3, 2, 4, 0, 5]
    const rotateZ2 = [3, 4, 2, 0, 1, 5]

    const rotate = (faceList, rotateList) => {
        const resultFaceList = [0, 1, 2, 3, 4, 5]
        for (let i = 0; i < 6; i++) {
            resultFaceList[i] = faceList[rotateList[i]]
        }
        return resultFaceList
    }

    const notationToIndex = (notation) => {
        let index
        switch (notation) {
            case "U": {
                index = 0
                break
            }
            case "R": {
                index = 1
                break
            }
            case "F": {
                index = 2
                break
            }
            case "D": {
                index = 3
                break
            }
            case "L": {
                index = 4
                break
            }
            case "B": {
                index = 5
                break
            }
            default: {
                index = 0
                break
            }
        }
        return index
    }

    const makeRotationLessAlg = (notationList) => {
        let currentFaceList = [0, 1, 2, 3, 4, 5]
        const modifiedNotationList = convertAlgToDefaultNotationAndRotation(notationList)
        const resultNotationList = []
        const resultRotationList = []
        for (let i = 0; i < modifiedNotationList.length; i++) {
            if (modifiedNotationList[i] === "x") {
                currentFaceList = rotate(currentFaceList, rotateX)
                resultRotationList.push(modifiedNotationList[i])
            } else if (modifiedNotationList[i] === "x'") {
                currentFaceList = rotate(currentFaceList, rotateXPrime)
                resultRotationList.push(modifiedNotationList[i])
            } else if (modifiedNotationList[i] === "x2") {
                currentFaceList = rotate(currentFaceList, rotateX2)
                resultRotationList.push(modifiedNotationList[i])
            } else if (modifiedNotationList[i] === "y") {
                currentFaceList = rotate(currentFaceList, rotateY)
                resultRotationList.push(modifiedNotationList[i])
            } else if (modifiedNotationList[i] === "y'") {
                currentFaceList = rotate(currentFaceList, rotateYPrime)
                resultRotationList.push(modifiedNotationList[i])
            } else if (modifiedNotationList[i] === "y2") {
                currentFaceList = rotate(currentFaceList, rotateY2)
                resultRotationList.push(modifiedNotationList[i])
            } else if (modifiedNotationList[i] === "z") {
                currentFaceList = rotate(currentFaceList, rotateZ)
                resultRotationList.push(modifiedNotationList[i])
            } else if (modifiedNotationList[i] === "z'") {
                currentFaceList = rotate(currentFaceList, rotateZPrime)
                resultRotationList.push(modifiedNotationList[i])
            } else if (modifiedNotationList[i] === "z2") {
                currentFaceList = rotate(currentFaceList, rotateZ2)
                resultRotationList.push(modifiedNotationList[i])
            } else {
                const currentNotation = modifiedNotationList[i].split("")
                let resultNotation = ""
                if (currentNotation.length === 1) {
                    resultNotation = faceList[currentFaceList[notationToIndex(currentNotation[0])]]
                } else if (currentNotation.length === 2) {
                    resultNotation = faceList[currentFaceList[notationToIndex(currentNotation[0])]] + currentNotation[1]
                }
                resultNotationList.push(resultNotation)
            }
        }
        return [resultNotationList, resultRotationList]
    }

    const notationConversionList = [
        ["U", "U"],
        ["U'", "U'"],
        ["U2", "U2"],
        ["D", "D"],
        ["D'", "D'"],
        ["D2", "D2"],
        ["R", "R"],
        ["R'", "R'"],
        ["R2", "R2"],
        ["L", "L"],
        ["L'", "L'"],
        ["L2", "L2"],
        ["F", "F"],
        ["F'", "F'"],
        ["F2", "F2"],
        ["B", "B"],
        ["B'", "B'"],
        ["B2", "B2"],
        ["x", "x"],
        ["x'", "x'"],
        ["x2", "x2"],
        ["y", "y"],
        ["y'", "y'"],
        ["y2", "y2"],
        ["z", "z"],
        ["z'", "z'"],
        ["z2", "z2"],
        ["M", "R L' x'"],
        ["M'", "R' L x"],
        ["M2", "R2 L2 x2"],
        ["S", "F' B z"],
        ["S'", "F B' z'"],
        ["S2", "F2 B2 z2"],
        ["E", "U D' y'"],
        ["E'", "U' D y"],
        ["E2", "U2 D2 y2"],
        ["Uw", "D y"],
        ["Uw'", "D' y'"],
        ["Uw2", "D2 y2"],
        ["Dw", "U y'"],
        ["Dw'", "U' y"],
        ["Dw2", "U2 y2"],
        ["Rw", "L x"],
        ["Rw'", "L' x'"],
        ["Rw2", "L2 x2"],
        ["Lw", "R x'"],
        ["Lw'", "R' x"],
        ["Lw2", "R2 x2"],
        ["Fw", "B z"],
        ["Fw'", "B' z'"],
        ["Fw2", "B2 z2"],
        ["Bw", "F z'"],
        ["Bw'", "F' z"],
        ["Bw2", "F2 z2"],
        ["u", "D y"],
        ["u'", "D' y'"],
        ["u2", "D2 y2"],
        ["d", "U y'"],
        ["d'", "U' y"],
        ["d2", "U2 y2"],
        ["r", "L x"],
        ["r'", "L' x'"],
        ["r2", "L2 x2"],
        ["l", "R x'"],
        ["l'", "R' x"],
        ["l2", "R2 x2"],
        ["f", "B z"],
        ["f'", "B' z'"],
        ["f2", "B2 z2"],
        ["b", "F z'"],
        ["b'", "F' z"],
        ["b2", "F2 z2"],
    ]

    const convertAlgToDefaultNotationAndRotation = (notationList) => {
        const resultNotationList = []
        for (let i = 0; i < notationList.length; i++) {
            const foundNotation = notationConversionList.find((pair) => pair[0] === notationList[i])
            resultNotationList.push(foundNotation[1])
        }
        return resultNotationList.join(" ").split(" ")
    }

    return {
        makeRotationLessAlg: makeRotationLessAlg
    }
})();

module.exports = algUtil